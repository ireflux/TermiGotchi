import {
  defaultPet,
  defaultStats,
  rarityWeights,
  rarities,
  speciesList,
  hats,
  eyes,
  themes,
} from './data'
import type { Eye, Hat, PetState, Rarity, Species, Stats, ThemeId } from './types'

const maxNameLength = 24
const maxPersonalityLength = 120

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function clampStat(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)))
}

export function sanitizeName(value: string): string {
  const trimmed = value.trim().slice(0, maxNameLength)
  return trimmed || defaultPet.profile.name
}

export function sanitizePersonality(value: string): string {
  const trimmed = value.trim().slice(0, maxPersonalityLength)
  return trimmed || defaultPet.profile.personality
}

export function weightedRarity(): Rarity {
  const total = rarities.reduce((sum, rarity) => sum + rarityWeights[rarity], 0)
  let roll = Math.random() * total
  for (const rarity of rarities) {
    roll -= rarityWeights[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

export function randomStats(): Stats {
  return {
    debugging: clampStat(1 + Math.random() * 99),
    patience: clampStat(1 + Math.random() * 99),
    chaos: clampStat(1 + Math.random() * 99),
    wisdom: clampStat(1 + Math.random() * 99),
    snark: clampStat(1 + Math.random() * 99),
  }
}

export function randomAppearance(): PetState['appearance'] {
  return {
    species: pick(speciesList),
    eye: pick(eyes.map(item => item.key as Eye)),
    hat: pick(hats.map(item => item.key as Hat)),
    shiny: Math.random() < 0.12,
    rarity: weightedRarity(),
  }
}

export function makeRandomPet(previous: PetState): PetState {
  return {
    appearance: randomAppearance(),
    stats: randomStats(),
    profile: previous.profile,
  }
}

export function resetPet(): PetState {
  return {
    appearance: { ...defaultPet.appearance },
    stats: { ...defaultStats },
    profile: { ...defaultPet.profile },
  }
}

export function serializePet(pet: PetState, themeId: ThemeId): string {
  const url = new URL(window.location.href)
  url.searchParams.set('s', pet.appearance.species)
  url.searchParams.set('e', pet.appearance.eye)
  url.searchParams.set('h', pet.appearance.hat)
  url.searchParams.set('r', pet.appearance.rarity)
  url.searchParams.set('y', pet.appearance.shiny ? '1' : '0')
  url.searchParams.set('dg', String(pet.stats.debugging))
  url.searchParams.set('pa', String(pet.stats.patience))
  url.searchParams.set('ch', String(pet.stats.chaos))
  url.searchParams.set('wi', String(pet.stats.wisdom))
  url.searchParams.set('sn', String(pet.stats.snark))
  url.searchParams.set('n', pet.profile.name)
  url.searchParams.set('p', pet.profile.personality)
  url.searchParams.set('t', themeId)
  return url.toString()
}

function statFromQuery(params: URLSearchParams, key: string, fallback: number) {
  const raw = Number(params.get(key))
  return Number.isFinite(raw) ? clampStat(raw) : fallback
}

function includesString<T extends string>(
  items: readonly T[],
  value: string | null,
): value is T {
  return value !== null && items.includes(value as T)
}

export function restoreFromUrl(): { pet: PetState; themeId: ThemeId } {
  const params = new URLSearchParams(window.location.search)
  const appearance = {
    species: includesString(speciesList, params.get('s'))
      ? (params.get('s') as Species)
      : defaultPet.appearance.species,
    eye: includesString(
      eyes.map(item => item.key),
      params.get('e'),
    )
      ? (params.get('e') as Eye)
      : defaultPet.appearance.eye,
    hat: includesString(
      hats.map(item => item.key),
      params.get('h'),
    )
      ? (params.get('h') as Hat)
      : defaultPet.appearance.hat,
    rarity: includesString(rarities, params.get('r'))
      ? (params.get('r') as Rarity)
      : defaultPet.appearance.rarity,
    shiny: params.get('y') === '1',
  }
  const pet: PetState = {
    appearance,
    stats: {
      debugging: statFromQuery(params, 'dg', defaultPet.stats.debugging),
      patience: statFromQuery(params, 'pa', defaultPet.stats.patience),
      chaos: statFromQuery(params, 'ch', defaultPet.stats.chaos),
      wisdom: statFromQuery(params, 'wi', defaultPet.stats.wisdom),
      snark: statFromQuery(params, 'sn', defaultPet.stats.snark),
    },
    profile: {
      name: sanitizeName(params.get('n') ?? defaultPet.profile.name),
      personality: sanitizePersonality(
        params.get('p') ?? defaultPet.profile.personality,
      ),
    },
  }
  const themeIds = themes.map(item => item.id)
  const themeId = includesString(themeIds, params.get('t'))
    ? (params.get('t') as ThemeId)
    : themes[0]!.id
  return { pet, themeId }
}

export function saveLocal(pet: PetState, themeId: ThemeId) {
  window.localStorage.setItem(
    'termigotchi-state',
    JSON.stringify({ pet, themeId }),
  )
}

export function restoreLocal(): { pet: PetState; themeId: ThemeId } | null {
  const raw = window.localStorage.getItem('termigotchi-state')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as {
      pet?: PetState
      themeId?: ThemeId
    }
    return {
      pet: parsed.pet ?? defaultPet,
      themeId: parsed.themeId ?? themes[0]!.id,
    }
  } catch {
    return null
  }
}

export function updateUrl(url: string) {
  window.history.replaceState({}, '', url)
}

export function exportText(pet: PetState, sprite: string[], rarityLabel: string) {
  return [
    'Terminal Tamagotchi',
    '',
    ...sprite,
    '',
    `Name: ${pet.profile.name}`,
    `Personality: ${pet.profile.personality}`,
    `Species: ${pet.appearance.species}`,
    `Rarity: ${rarityLabel}`,
    `Stats: Dbg ${pet.stats.debugging} / Pat ${pet.stats.patience} / Chs ${pet.stats.chaos} / Wis ${pet.stats.wisdom} / Snk ${pet.stats.snark}`,
  ].join('\n')
}
