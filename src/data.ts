import type {
  Eye,
  Hat,
  PetState,
  Rarity,
  Species,
  Stats,
  ThemeTokens,
} from './types'

export const rarities: Rarity[] = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
]

export const rarityWeights: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
}

export const rarityStars: Record<Rarity, string> = {
  common: '*',
  uncommon: '**',
  rare: '***',
  epic: '****',
  legendary: '*****',
}

export const speciesList: Species[] = [
  'duck',
  'goose',
  'blob',
  'cat',
  'dragon',
  'octopus',
  'owl',
  'penguin',
  'turtle',
  'snail',
  'ghost',
  'axolotl',
  'capybara',
  'cactus',
  'robot',
  'rabbit',
  'mushroom',
  'chonk',
]

export const eyes: Array<{ key: Eye; label: string; glyph: string }> = [
  { key: 'dot', label: 'Dot', glyph: '.' },
  { key: 'dash', label: 'Dash', glyph: '-' },
  { key: 'o', label: 'Round', glyph: 'o' },
  { key: 'zero', label: 'Zero', glyph: '0' },
  { key: 'x', label: 'Cross', glyph: 'x' },
  { key: 'star', label: 'Star', glyph: '*' },
]

export const hats: Array<{ key: Hat; label: string }> = [
  { key: 'none', label: 'None' },
  { key: 'crown', label: 'Crown' },
  { key: 'tophat', label: 'Top Hat' },
  { key: 'propeller', label: 'Propeller' },
  { key: 'halo', label: 'Halo' },
  { key: 'wizard', label: 'Wizard' },
  { key: 'beanie', label: 'Beanie' },
  { key: 'tinyduck', label: 'Tiny Duck' },
]

export const statLabels: Record<keyof Stats, string> = {
  debugging: 'Debugging',
  patience: 'Patience',
  chaos: 'Chaos',
  wisdom: 'Wisdom',
  snark: 'Snark',
}

export const defaultStats: Stats = {
  debugging: 42,
  patience: 61,
  chaos: 18,
  wisdom: 57,
  snark: 36,
}

export const statTemplates: Array<{ name: string; values: Stats }> = [
  {
    name: 'Balanced',
    values: { debugging: 50, patience: 50, chaos: 50, wisdom: 50, snark: 50 },
  },
  {
    name: 'Debugger',
    values: { debugging: 88, patience: 62, chaos: 18, wisdom: 59, snark: 41 },
  },
  {
    name: 'Zen',
    values: { debugging: 44, patience: 92, chaos: 9, wisdom: 76, snark: 12 },
  },
  {
    name: 'Chaos',
    values: { debugging: 39, patience: 14, chaos: 96, wisdom: 27, snark: 63 },
  },
  {
    name: 'Snarky',
    values: { debugging: 58, patience: 25, chaos: 48, wisdom: 54, snark: 91 },
  },
  {
    name: 'Wise',
    values: { debugging: 46, patience: 64, chaos: 17, wisdom: 94, snark: 33 },
  },
]

export const defaultPet: PetState = {
  appearance: {
    species: 'duck',
    eye: 'dot',
    hat: 'none',
    shiny: false,
    rarity: 'common',
  },
  stats: defaultStats,
  profile: {
    name: 'Moss',
    personality: 'Quiet, curious, and slightly judgmental.',
  },
}

export const themes: ThemeTokens[] = [
  {
    id: 'green-crt',
    label: 'Green CRT',
    bg: '#06110a',
    bg2: '#0b1b11',
    panel: 'rgba(9, 28, 16, 0.84)',
    panelAlt: 'rgba(8, 23, 14, 0.92)',
    text: '#9ff5a8',
    dim: '#4b7f54',
    border: '#2a6d37',
    accent: '#6dff82',
    glow: 'rgba(109, 255, 130, 0.25)',
    scanline: 'rgba(159, 245, 168, 0.05)',
    rarityColors: {
      common: '#83e08e',
      uncommon: '#aff77d',
      rare: '#79ffd5',
      epic: '#f2ff77',
      legendary: '#ffb766',
    },
  },
  {
    id: 'amber-phosphor',
    label: 'Amber Phosphor',
    bg: '#150d05',
    bg2: '#231507',
    panel: 'rgba(37, 23, 10, 0.88)',
    panelAlt: 'rgba(26, 16, 7, 0.94)',
    text: '#ffc86a',
    dim: '#9a7035',
    border: '#8c5d23',
    accent: '#ffd07f',
    glow: 'rgba(255, 200, 106, 0.24)',
    scanline: 'rgba(255, 200, 106, 0.05)',
    rarityColors: {
      common: '#ffcc8b',
      uncommon: '#ffe17a',
      rare: '#ffd46a',
      epic: '#ffb861',
      legendary: '#ff8c52',
    },
  },
  {
    id: 'ice-blue',
    label: 'Ice Blue',
    bg: '#071117',
    bg2: '#0b1a24',
    panel: 'rgba(10, 22, 31, 0.88)',
    panelAlt: 'rgba(8, 17, 24, 0.94)',
    text: '#b8efff',
    dim: '#5d8c9b',
    border: '#2f6f89',
    accent: '#7fe2ff',
    glow: 'rgba(127, 226, 255, 0.2)',
    scanline: 'rgba(184, 239, 255, 0.04)',
    rarityColors: {
      common: '#98e8ff',
      uncommon: '#82f0d8',
      rare: '#8db7ff',
      epic: '#d7f2ff',
      legendary: '#ffc786',
    },
  },
  {
    id: 'gray-dos',
    label: 'Gray DOS',
    bg: '#0b0b0b',
    bg2: '#161616',
    panel: 'rgba(22, 22, 22, 0.9)',
    panelAlt: 'rgba(16, 16, 16, 0.94)',
    text: '#d3d3d3',
    dim: '#858585',
    border: '#5c5c5c',
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.08)',
    scanline: 'rgba(255, 255, 255, 0.025)',
    rarityColors: {
      common: '#cdcdcd',
      uncommon: '#f0f0f0',
      rare: '#b8d0ff',
      epic: '#fff3ad',
      legendary: '#ffbf8c',
    },
  },
]
