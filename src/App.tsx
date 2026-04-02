import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  defaultPet,
  eyes,
  hats,
  rarityStars,
  rarities,
  speciesList,
  statLabels,
  statTemplates,
  themes,
} from './data'
import { eyeGlyph, renderFace, renderSprite, spriteFrameCount } from './sprites'
import {
  clampStat,
  exportText,
  makeRandomPet,
  randomAppearance,
  randomStats,
  resetPet,
  restoreFromUrl,
  restoreLocal,
  saveLocal,
  serializePet,
  updateUrl,
} from './utils'
import type { AppView, PetState, StatKey, ThemeId } from './types'

const tickMs = 500
const petBurstMs = 2500
const idleSequence = [0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 2, 0, 0, 0, 0, 1, 0]
const petHearts = ['   <3    <3   ', '  <3  <3   <3 ', ' <3   <3  <3  ', '<3  <3     <3 ', '.   .   .    ']
const appName = 'TermiGotchi'
const pageTitle = 'Terminal Tamagotchi'
const commandCatalog = [
  { command: '/pet', description: 'Trigger a pet reaction.' },
  { command: '/blink', description: 'Force a blink animation.' },
  { command: '/random', description: 'Randomize look and stats.' },
  { command: '/random look', description: 'Randomize appearance only.' },
  { command: '/random stats', description: 'Randomize stats only.' },
  { command: '/reset', description: 'Restore the default pet.' },
  { command: '/share', description: 'Copy the current share link.' },
  { command: '/theme green-crt', description: 'Switch to Green CRT.' },
  { command: '/theme amber-phosphor', description: 'Switch to Amber Phosphor.' },
  { command: '/theme ice-blue', description: 'Switch to Ice Blue.' },
  { command: '/theme gray-dos', description: 'Switch to Gray DOS.' },
]
const speciesStageTuning: Record<
  PetState['appearance']['species'],
  { scale: number; x: number; y: number }
> = {
  duck: { scale: 1.08, x: 8, y: 8 },
  goose: { scale: 1.08, x: 8, y: 8 },
  blob: { scale: 1.14, x: 0, y: 8 },
  cat: { scale: 1.1, x: 0, y: 10 },
  dragon: { scale: 1.08, x: -4, y: 12 },
  octopus: { scale: 1.12, x: 2, y: 12 },
  owl: { scale: 1.12, x: 0, y: 10 },
  penguin: { scale: 1.12, x: 4, y: 10 },
  turtle: { scale: 1.08, x: 2, y: 12 },
  snail: { scale: 1.18, x: 8, y: 8 },
  ghost: { scale: 1.12, x: 0, y: 8 },
  axolotl: { scale: 1.08, x: 0, y: 10 },
  capybara: { scale: 1.08, x: 0, y: 10 },
  cactus: { scale: 1.12, x: 0, y: 12 },
  robot: { scale: 1.1, x: 0, y: 12 },
  rabbit: { scale: 1.1, x: 0, y: 10 },
  mushroom: { scale: 1.08, x: 0, y: 8 },
  chonk: { scale: 1.08, x: 0, y: 12 },
}

function buildInitialState() {
  if (window.location.search.length > 0) {
    return restoreFromUrl()
  }
  return restoreLocal() ?? { pet: defaultPet, themeId: themes[0]!.id }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function exportBasename(name: string) {
  const petName = slugify(name) || 'pet'
  return `termigotchi-${petName}`
}

function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

export function App() {
  const initial = buildInitialState()
  const [view, setView] = useState<AppView>('builder')
  const [pet, setPet] = useState<PetState>(initial.pet)
  const [themeId, setThemeId] = useState<ThemeId>(initial.themeId)
  const [tick, setTick] = useState(0)
  const [petStartedAt, setPetStartedAt] = useState<number | null>(null)
  const [command, setCommand] = useState('')
  const [compactPreview, setCompactPreview] = useState(
    () => window.innerWidth < 900,
  )
  const [toastText, setToastText] = useState('boot sequence complete')
  const [petBubbleText, setPetBubbleText] = useState<string | null>(
    'sprite renderer online',
  )
  const [completionIndex, setCompletionIndex] = useState(0)

  const theme = themes.find(item => item.id === themeId) ?? themes[0]!
  const rarityColor = theme.rarityColors[pet.appearance.rarity]
  const rarityLabel = `${pet.appearance.rarity.toUpperCase()} ${rarityStars[pet.appearance.rarity]}`
  const stageTuning = speciesStageTuning[pet.appearance.species]

  useEffect(() => {
    const timer = window.setInterval(() => setTick(value => value + 1), tickMs)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function onResize() {
      setCompactPreview(window.innerWidth < 900)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(
      () => setToastText('profile synced to link'),
      1800,
    )
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toastText) return
    const timer = window.setTimeout(() => setToastText(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toastText])

  useEffect(() => {
    if (!petBubbleText) return
    const timer = window.setTimeout(() => setPetBubbleText(null), 2600)
    return () => window.clearTimeout(timer)
  }, [petBubbleText])

  useEffect(() => {
    const url = serializePet(pet, themeId)
    updateUrl(url)
    saveLocal(pet, themeId)
  }, [pet, themeId])

  const petting = petStartedAt !== null && Date.now() - petStartedAt < petBurstMs
  const frameCount = spriteFrameCount(pet.appearance.species)
  const idleStep = idleSequence[tick % idleSequence.length]!
  const blink = !petting && idleStep === -1
  const frame = petting ? tick % frameCount : blink ? 0 : idleStep % frameCount

  const spriteLines = useMemo(() => {
    const lines = renderSprite(pet, frame)
    const blinkEye = eyeGlyph(pet.appearance.eye)
    const body = blink
      ? lines.map(line => line.replaceAll(blinkEye, '-'))
      : lines
    return petting ? [petHearts[tick % petHearts.length]!, ...body] : body
  }, [blink, frame, pet, petting, tick])

  const completions = useMemo(() => {
    if (!command.startsWith('/')) return []
    const filtered = commandCatalog.filter(item =>
      item.command.startsWith(command.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : commandCatalog
  }, [command])

  const normalizedCommand = command.trim().toLowerCase()

  useEffect(() => {
    setCompletionIndex(0)
  }, [command])

  function showToast(message: string) {
    setToastText(message)
  }

  function showPetBubble(message: string) {
    setPetBubbleText(message)
  }

  function updateStat(key: StatKey, value: number) {
    setPet(current => ({
      ...current,
      stats: {
        ...current.stats,
        [key]: clampStat(value),
      },
    }))
  }

  function handlePet() {
    setPetStartedAt(Date.now())
    showPetBubble('pat pat')
  }

  async function handleCopyShare() {
    await navigator.clipboard.writeText(serializePet(pet, themeId))
    showToast('share link copied')
  }

  function handleExportText() {
    const text = exportText(pet, spriteLines, rarityLabel)
    downloadBlob(
      `${exportBasename(pet.profile.name)}.txt`,
      new Blob([text], { type: 'text/plain;charset=utf-8' }),
    )
    showToast('export complete')
  }

  function handleExportJson() {
    downloadBlob(
      `${exportBasename(pet.profile.name)}.json`,
      new Blob([JSON.stringify({ pet, themeId }, null, 2)], {
        type: 'application/json;charset=utf-8',
      }),
    )
    showToast('export complete')
  }

  function handleExportPng() {
    const canvas = document.createElement('canvas')
    const lineHeight = 28
    const width = 880
    const height = 720
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return

    context.fillStyle = theme.bg
    context.fillRect(0, 0, width, height)
    context.strokeStyle = theme.border
    context.lineWidth = 2
    context.strokeRect(18, 18, width - 36, height - 36)

    context.fillStyle = theme.text
    context.font = '18px "IBM Plex Mono", Consolas, monospace'
    context.fillText(pageTitle, 42, 60)
    context.fillStyle = rarityColor
    context.fillText(rarityLabel, width - 220, 60)

    context.fillStyle = theme.text
    context.font = '22px "IBM Plex Mono", Consolas, monospace'
    spriteLines.forEach((line, index) => {
      context.fillStyle = index === 0 && petting ? theme.accent : rarityColor
      context.fillText(line, 120, 150 + index * lineHeight)
    })

    context.fillStyle = theme.text
    context.font = '18px "IBM Plex Mono", Consolas, monospace'
    context.fillText(`Name: ${pet.profile.name}`, 42, 480)
    context.fillText(`Species: ${pet.appearance.species}`, 42, 516)
    context.fillText(`Personality: ${pet.profile.personality}`, 42, 552)
    context.fillText(
      `Stats: Dbg ${pet.stats.debugging}  Pat ${pet.stats.patience}  Chs ${pet.stats.chaos}  Wis ${pet.stats.wisdom}  Snk ${pet.stats.snark}`,
      42,
      588,
    )

    canvas.toBlob(blob => {
      if (!blob) return
      downloadBlob(`${exportBasename(pet.profile.name)}.png`, blob)
      showToast('export complete')
    })
  }

  function runCommand(raw: string) {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (value === '/pet') return handlePet()
    if (value === '/blink') return showPetBubble('blink')
    if (value === '/random') {
      setPet(current => makeRandomPet(current))
      return showToast('sprite reconfigured')
    }
    if (value === '/random look') {
      setPet(current => ({
        ...current,
        appearance: randomAppearance(),
      }))
      return showToast('sprite reconfigured')
    }
    if (value === '/random stats') {
      setPet(current => ({ ...current, stats: randomStats() }))
      return showToast('sprite reconfigured')
    }
    if (value === '/reset') {
      setPet(resetPet())
      setPetBubbleText(null)
      return showToast('default profile restored')
    }
    if (value === '/share') {
      void handleCopyShare()
      return
    }
    if (value.startsWith('/theme ')) {
      const nextTheme = value.slice(7)
      const match = themes.find(
        item =>
          item.id === nextTheme ||
          item.label.toLowerCase().replaceAll(' ', '-') === nextTheme,
      )
      if (match) {
        setThemeId(match.id)
        return showToast('theme channel updated')
      }
    }
    showToast('unknown command')
  }

  function commitCompletion(nextCommand: string) {
    setCommand(nextCommand)
  }

  function onCommandEnter() {
    if (completions.length > 0 && command.startsWith('/')) {
      const exact = completions.find(item => item.command === command.trim().toLowerCase())
      if (!exact && command.trim() !== '') {
        const selected = completions[completionIndex] ?? completions[0]
        if (selected) {
          runCommand(selected.command)
          setCommand('')
          return
        }
      }
    }
    runCommand(command)
    setCommand('')
  }

  function renderHighlightedCommand(text: string) {
    const query = normalizedCommand
    if (!query.startsWith('/') || query.length === 0) {
      return text
    }
    const index = text.indexOf(query)
    if (index === -1) {
      return text
    }
    const before = text.slice(0, index)
    const match = text.slice(index, index + query.length)
    const after = text.slice(index + query.length)
    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    )
  }

  return (
    <div
      className="app-shell"
      style={
        {
          '--bg': theme.bg,
          '--bg2': theme.bg2,
          '--panel': theme.panel,
          '--panel-alt': theme.panelAlt,
          '--text': theme.text,
          '--dim': theme.dim,
          '--border': theme.border,
          '--accent': theme.accent,
          '--glow': theme.glow,
          '--scanline': theme.scanline,
          '--rarity': rarityColor,
        } as CSSProperties
      }
    >
      <div className="crt-overlay" />
      {toastText ? <div className="toast">{toastText}</div> : null}
      <header className="topbar panel">
          <div>
            <div className="eyebrow">{appName}</div>
            <h1>{pageTitle}</h1>
            <p>Build a tiny terminal pet and share the result.</p>
        </div>
        <nav className="nav-tabs">
          <button className={view === 'builder' ? 'active' : ''} onClick={() => setView('builder')}>Builder</button>
          <button className={view === 'gallery' ? 'active' : ''} onClick={() => setView('gallery')}>Gallery</button>
          <button className={view === 'about' ? 'active' : ''} onClick={() => setView('about')}>About</button>
        </nav>
      </header>

      {view === 'builder' ? (
        <main className="builder-grid">
          <aside className="panel info-panel">
            <div className="section-title">SYSTEM</div>
            <div className="log-line">boot sequence complete</div>
            <div className="log-line">sprite renderer online</div>
            <div className="log-line">profile synced to link</div>
            <div className="summary-block">
              <div className="summary-row"><span>RARITY</span><strong style={{ color: rarityColor }}>{rarityLabel}</strong></div>
              <div className="summary-row"><span>SPECIES</span><strong>{pet.appearance.species}</strong></div>
              <div className="summary-row"><span>NAME</span><strong>{pet.profile.name}</strong></div>
              <div className="summary-row personality-row"><span>PERSONALITY</span><strong>{pet.profile.personality}</strong></div>
            </div>
            <div className="stats-readout">
              {(Object.entries(pet.stats) as Array<[StatKey, number]>).map(([key, value]) => (
                <div className="summary-row" key={key}>
                  <span>{statLabels[key]}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>

          <section className="panel preview-panel">
            <div className="terminal-head">
              <span>session://terminal-tamagotchi</span>
              <span style={{ color: rarityColor }}>{pet.appearance.rarity}</span>
            </div>
            <div className="preview-body">
              <div className="scene-row">
                <div className="sprite-column" style={{ color: rarityColor }}>
                  <div className="nameplate" style={{ color: rarityColor }}>
                    {pet.profile.name}
                  </div>
                  <div
                    className="sprite-wrap"
                    style={
                      {
                        '--pet-scale': stageTuning.scale,
                        '--pet-shift-x': `${stageTuning.x}px`,
                        '--pet-shift-y': `${stageTuning.y}px`,
                      } as CSSProperties
                    }
                  >
                    {petBubbleText ? (
                      <div
                        className={
                          compactPreview
                            ? 'speech-bubble compact anchored'
                            : 'speech-bubble anchored'
                        }
                      >
                        {petBubbleText}
                      </div>
                    ) : null}
                    {compactPreview ? (
                      <div className="face-line">
                        <span className="face-mark">{renderFace(pet)}</span>
                        <span className="face-label">
                          "{petBubbleText ?? pet.profile.name}"
                        </span>
                      </div>
                    ) : (
                      spriteLines.map((line, index) => (
                        <pre className="sprite-line" key={`${index}-${line}`}>{line}</pre>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="status-strip">
                <span>{pet.appearance.species}</span>
                <span>{pet.appearance.hat === 'none' ? 'no hat' : pet.appearance.hat}</span>
                <span>{pet.appearance.shiny ? 'shiny signal: on' : 'shiny signal: off'}</span>
              </div>
            </div>
            <div className="action-bar">
              <button onClick={handlePet}>Pet</button>
              <button onClick={() => showPetBubble('blink routine executed')}>Blink</button>
              <button
                onClick={() => {
                  setPet(current => makeRandomPet(current))
                  showToast('sprite reconfigured')
                }}
              >
                Random
              </button>
              <button
                onClick={() => {
                  setPet(resetPet())
                  setPetBubbleText('sprite renderer online')
                  showToast('default profile restored')
                }}
              >
                Reset
              </button>
            </div>
            <div className="command-stack">
              <div className="command-bar">
                <span className="prompt-mark">$</span>
                <input
                  value={command}
                  onChange={event => setCommand(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'ArrowDown' && completions.length > 0) {
                      event.preventDefault()
                      setCompletionIndex(current => (current + 1) % completions.length)
                      return
                    }
                    if (event.key === 'ArrowUp' && completions.length > 0) {
                      event.preventDefault()
                      setCompletionIndex(current =>
                        current === 0 ? completions.length - 1 : current - 1,
                      )
                      return
                    }
                    if (event.key === 'Tab' && completions.length > 0) {
                      event.preventDefault()
                      commitCompletion(completions[completionIndex]?.command ?? completions[0]!.command)
                      return
                    }
                    if (event.key === 'Enter') {
                      onCommandEnter()
                    }
                  }}
                  placeholder="/pet  /random  /theme green-crt"
                />
              </div>
              {completions.length > 0 ? (
                <div className="completion-panel">
                  {completions.slice(0, 6).map((item, index) => (
                    <button
                      key={item.command}
                      className={index === completionIndex ? 'completion-item active' : 'completion-item'}
                      onMouseDown={event => {
                        event.preventDefault()
                        commitCompletion(item.command)
                      }}
                    >
                      <span>{renderHighlightedCommand(item.command)}</span>
                      <small>{item.description}</small>
                    </button>
                  ))}
                  <div className="completion-hint">
                    <span>tab complete</span>
                    <span>enter confirm</span>
                    <span>up/down navigate</span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="panel controls-panel">
            <section className="editor-section">
              <h2>Appearance</h2>
              <label>
                Species
                <select
                  value={pet.appearance.species}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      appearance: {
                        ...current.appearance,
                        species: event.target.value as PetState['appearance']['species'],
                      },
                    }))
                  }
                >
                  {speciesList.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>
                Eyes
                <select
                  value={pet.appearance.eye}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      appearance: {
                        ...current.appearance,
                        eye: event.target.value as PetState['appearance']['eye'],
                      },
                    }))
                  }
                >
                  {eyes.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </label>
              <label>
                Hat
                <select
                  value={pet.appearance.hat}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      appearance: {
                        ...current.appearance,
                        hat: event.target.value as PetState['appearance']['hat'],
                      },
                    }))
                  }
                >
                  {hats.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </label>
              <label>
                Rarity
                <select
                  value={pet.appearance.rarity}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      appearance: {
                        ...current.appearance,
                        rarity: event.target.value as PetState['appearance']['rarity'],
                      },
                    }))
                  }
                >
                  {rarities.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="inline-toggle">
                <span>Shiny</span>
                <span className="switch">
                  <input
                    type="checkbox"
                    checked={pet.appearance.shiny}
                    onChange={event =>
                      setPet(current => ({
                        ...current,
                        appearance: {
                          ...current.appearance,
                          shiny: event.target.checked,
                        },
                      }))
                    }
                  />
                  <span className="switch-track" aria-hidden="true" />
                </span>
              </label>
            </section>

            <section className="editor-section">
              <h2>Stats</h2>
              <div className="section-head stats-tools">
                <button
                  className="small-button"
                  onClick={() => {
                    setPet(current => ({ ...current, stats: randomStats() }))
                    showToast('sprite reconfigured')
                  }}
                >
                  Random Stats
                </button>
              </div>
              <div className="template-row" role="group" aria-label="Stats templates">
                {statTemplates.map(template => (
                  <button
                    key={template.name}
                    className="small-button"
                    onClick={() => setPet(current => ({ ...current, stats: template.values }))}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              {(Object.entries(pet.stats) as Array<[StatKey, number]>).map(([key, value]) => (
                <label key={key}>
                  {statLabels[key]}
                  <div className="range-row">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={value}
                      onChange={event => updateStat(key, Number(event.target.value))}
                    />
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={value}
                      onChange={event => updateStat(key, Number(event.target.value))}
                    />
                  </div>
                </label>
              ))}
            </section>

            <section className="editor-section">
              <h2>Profile</h2>
              <label>
                Name
                <input
                  type="text"
                  maxLength={24}
                  value={pet.profile.name}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        name: event.target.value.slice(0, 24),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Personality
                <textarea
                  rows={4}
                  maxLength={120}
                  value={pet.profile.personality}
                  onChange={event =>
                    setPet(current => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        personality: event.target.value.slice(0, 120),
                      },
                    }))
                  }
                />
              </label>
            </section>

            <section className="editor-section">
              <h2>Theme</h2>
              <div className="theme-grid">
                {themes.map(item => (
                  <button
                    key={item.id}
                    className={item.id === themeId ? 'theme-swatch active' : 'theme-swatch'}
                    onClick={() => {
                      setThemeId(item.id)
                      showToast('theme channel updated')
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="editor-section">
              <h2>Share</h2>
              <div className="share-actions">
                <button onClick={() => void handleCopyShare()}>Copy Share Link</button>
                <button onClick={handleExportPng}>Export PNG</button>
                <button onClick={handleExportText}>Export TXT</button>
                <button onClick={handleExportJson}>Export JSON</button>
              </div>
            </section>
          </aside>
        </main>
      ) : null}

      {view === 'gallery' ? (
        <main className="panel gallery-view">
          <div className="gallery-header">
            <h2>Gallery</h2>
            <p>Browse terminal pet appearance combinations.</p>
          </div>
          <div className="gallery-grid">
            {speciesList.map(item => {
              const samplePet: PetState = {
                ...pet,
                appearance: { ...pet.appearance, species: item },
              }
              return (
                <button
                  key={item}
                  className="gallery-card"
                  onClick={() => {
                    setPet(current => ({
                      ...current,
                      appearance: { ...current.appearance, species: item },
                    }))
                    setView('builder')
                    showToast('sprite reconfigured')
                  }}
                >
                  <pre>{renderFace(samplePet)}</pre>
                  <strong>{item}</strong>
                  <span>Open in Builder</span>
                </button>
              )
            })}
          </div>
        </main>
      ) : null}

      {view === 'about' ? (
        <main className="panel about-view">
          <h2>About TermiGotchi</h2>
          <p>TermiGotchi is a lightweight browser application for designing and sharing terminal-style virtual pets.</p>
          <p>The Builder provides control over appearance, stats, and profile data, while the Gallery offers a fast way to explore visual variants before returning to an editable configuration.</p>
          <ul>
            <li>Customize sprite, rarity, and profile details in one place.</li>
            <li>Apply stat presets or fine-tune values manually.</li>
            <li>Export assets or share a reproducible build by link.</li>
          </ul>
        </main>
      ) : null}
    </div>
  )
}
