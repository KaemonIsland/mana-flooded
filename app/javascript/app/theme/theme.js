import { spacing, spaceScale } from './spacing'
import { fontSizes, fontScale } from './typography'
import { color, textContrast } from './color'
import { boxShadow } from './boxShadow'

export const theme = {
  boxShadow,
  spacing,
  spaceScale,
  fontSizes,
  fontScale,
  color,
  textContrast,
  // Based off of max-width
  breakpoint: {
    large: '1200px',
    medium: '992px',
    small: '768px',
    tiny: '576px',
  },
}
