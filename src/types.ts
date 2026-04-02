export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

export type Species =
  | 'duck'
  | 'goose'
  | 'blob'
  | 'cat'
  | 'dragon'
  | 'octopus'
  | 'owl'
  | 'penguin'
  | 'turtle'
  | 'snail'
  | 'ghost'
  | 'axolotl'
  | 'capybara'
  | 'cactus'
  | 'robot'
  | 'rabbit'
  | 'mushroom'
  | 'chonk'

export type Eye = 'dot' | 'dash' | 'o' | 'zero' | 'x' | 'star'

export type Hat =
  | 'none'
  | 'crown'
  | 'tophat'
  | 'propeller'
  | 'halo'
  | 'wizard'
  | 'beanie'
  | 'tinyduck'

export type ThemeId =
  | 'green-crt'
  | 'amber-phosphor'
  | 'ice-blue'
  | 'gray-dos'

export type StatKey =
  | 'debugging'
  | 'patience'
  | 'chaos'
  | 'wisdom'
  | 'snark'

export type Stats = Record<StatKey, number>

export type PetState = {
  appearance: {
    species: Species
    eye: Eye
    hat: Hat
    shiny: boolean
    rarity: Rarity
  }
  stats: Stats
  profile: {
    name: string
    personality: string
  }
}

export type AppView = 'builder' | 'gallery' | 'about'

export type ThemeTokens = {
  id: ThemeId
  label: string
  bg: string
  bg2: string
  panel: string
  panelAlt: string
  text: string
  dim: string
  border: string
  accent: string
  glow: string
  scanline: string
  rarityColors: Record<Rarity, string>
}
