import { eyes } from './data'
import type { Eye, Hat, PetState, Species } from './types'

const bodies: Record<Species, string[][]> = {
  duck: [
    ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--`    '],
    ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--`~   '],
    ['            ', '    __      ', '  <({E} )___  ', '   (  .__>  ', '    `--`    '],
  ],
  goose: [
    ['            ', '     ({E}>    ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
    ['            ', '    ({E}>     ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
    ['            ', '     ({E}>>   ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
  ],
  blob: [
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (      )  ', '   `----`   '],
    ['            ', '  .------.  ', ' (  {E}  {E}  ) ', ' (        ) ', '  `------`  '],
    ['            ', '    .--.    ', '   ({E}  {E})   ', '   (    )   ', '    `--`    '],
  ],
  cat: [
    ['            ', '   /\\_/\\\\    ', '  ( {E}   {E})  ', '  (  w  )   ', '  (")_(")   '],
    ['            ', '   /\\_/\\\\    ', '  ( {E}   {E})  ', '  (  w  )   ', '  (")_(")~  '],
    ['            ', '   /\\-/\\\\    ', '  ( {E}   {E})  ', '  (  w  )   ', '  (")_(")   '],
  ],
  dragon: [
    ['            ', '  /^\\\\  /^\\\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-`  '],
    ['            ', '  /^\\\\  /^\\\\  ', ' <  {E}  {E}  > ', ' (        ) ', '  `-vvvv-`  '],
    ['   ~    ~   ', '  /^\\\\  /^\\\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-`  '],
  ],
  octopus: [
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\\\  '],
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  \\/\\/\\/\\//  '],
    ['     o      ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\\\  '],
  ],
  owl: [
    ['            ', '   /\\\\  /\\\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   `----`   '],
    ['            ', '   /\\\\  /\\\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   .----.   '],
    ['            ', '   /\\\\  /\\\\   ', '  (({E})(-))  ', '  (  ><  )  ', '   `----`   '],
  ],
  penguin: [
    ['            ', '  .---.     ', '  ({E}>{E})     ', ' /(   )\\\\    ', '  `---`     '],
    ['            ', '  .---.     ', '  ({E}>{E})     ', ' |(   )|    ', '  `---`     '],
    ['  .---.     ', '  ({E}>{E})     ', ' /(   )\\\\    ', '  `---`     ', '   ~ ~      '],
  ],
  turtle: [
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\\\ ', '  ``    ``  '],
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\\\ ', '   ``  ``   '],
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[======]\\\\ ', '  ``    ``  '],
  ],
  snail: [
    ['            ', ' {E}    .--.  ', '  \\\\  ( @ )  ', '   \\\\_`--`   ', '  ~~~~~~~   '],
    ['            ', '  {E}   .--.  ', '  |  ( @ )  ', '   \\\\_`--`   ', '  ~~~~~~~   '],
    ['            ', ' {E}    .--.  ', '  \\\\  ( @  ) ', '   \\\\_`--`   ', '   ~~~~~~   '],
  ],
  ghost: [
    ['            ', '   .----.   ', '  / {E}  {E} \\\\  ', '  |      |  ', '  ~`~``~`~  '],
    ['            ', '   .----.   ', '  / {E}  {E} \\\\  ', '  |      |  ', '  `~`~~`~`  '],
    ['    ~  ~    ', '   .----.   ', '  / {E}  {E} \\\\  ', '  |      |  ', '  ~~`~~`~~  '],
  ],
  axolotl: [
    ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  ( .--. )  ', '  (_/  \\\\_)  '],
    ['            ', '~}(______){~', '~}({E} .. {E}){~', '  ( .--. )  ', '  (_/  \\\\_)  '],
    ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  (  --  )  ', '  ~_/  \\\\_~  '],
  ],
  capybara: [
    ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------`  '],
    ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   Oo   ) ', '  `------`  '],
    ['    ~  ~    ', '  u______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------`  '],
  ],
  cactus: [
    ['            ', ' n  ____  n ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
    ['            ', '    ____    ', ' n |{E}  {E}| n ', ' |_|    |_| ', '   |    |   '],
    [' n        n ', ' |  ____  | ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
  ],
  robot: [
    ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------`  '],
    ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ -==- ]  ', '  `------`  '],
    ['     *      ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------`  '],
  ],
  rabbit: [
    ['            ', '   (\\\\__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
    ['            ', '   (|__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
    ['            ', '   (\\\\__/)   ', '  ( {E}  {E} )  ', ' =( .  . )= ', '  (")__(")  '],
  ],
  mushroom: [
    ['            ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
    ['            ', ' .-O-oo-O-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
    ['   . o  .   ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
  ],
  chonk: [
    ['            ', '  /\\\\    /\\\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------`  '],
    ['            ', '  /\\\\    /|  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------`  '],
    ['            ', '  /\\\\    /\\\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------`~ '],
  ],
}

const hatLines: Record<Hat, string> = {
  none: '',
  crown: '   \\^^^/    ',
  tophat: '   [___]    ',
  propeller: '    -+-     ',
  halo: '   (   )    ',
  wizard: '    /^\\     ',
  beanie: '   (___)    ',
  tinyduck: '    ,>      ',
}

export function eyeGlyph(key: Eye): string {
  return eyes.find(eye => eye.key === key)?.glyph ?? '.'
}

export function renderSprite(pet: PetState, frame = 0): string[] {
  const frames = bodies[pet.appearance.species]
  const body = frames[frame % frames.length]!.map(line =>
    line.replaceAll('{E}', eyeGlyph(pet.appearance.eye)),
  )
  const lines = [...body]
  if (pet.appearance.hat !== 'none' && !lines[0]!.trim()) {
    lines[0] = hatLines[pet.appearance.hat]
  }
  if (!lines[0]!.trim() && frames.every(item => !item[0]!.trim())) {
    lines.shift()
  }
  return lines
}

export function spriteFrameCount(species: Species): number {
  return bodies[species].length
}

export function renderFace(pet: PetState): string {
  const eye = eyeGlyph(pet.appearance.eye)
  switch (pet.appearance.species) {
    case 'duck':
    case 'goose':
      return `(${eye}>`
    case 'blob':
      return `(${eye}${eye})`
    case 'cat':
      return `=${eye}w${eye}=`
    case 'dragon':
      return `<${eye}~${eye}>`
    case 'octopus':
      return `~(${eye}${eye})~`
    case 'owl':
      return `(${eye})(${eye})`
    case 'penguin':
      return `(${eye}>)`
    case 'turtle':
      return `[${eye}_${eye}]`
    case 'snail':
      return `${eye}(@)`
    case 'ghost':
      return `/${eye}${eye}\\`
    case 'axolotl':
      return `}${eye}.${eye}{`
    case 'capybara':
      return `(${eye}oo${eye})`
    case 'cactus':
      return `|${eye}  ${eye}|`
    case 'robot':
      return `[${eye}${eye}]`
    case 'rabbit':
      return `(${eye}..${eye})`
    case 'mushroom':
      return `|${eye}  ${eye}|`
    case 'chonk':
      return `(${eye}.${eye})`
  }
}
