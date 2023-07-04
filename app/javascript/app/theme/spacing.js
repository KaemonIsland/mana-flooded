// Range of sizes used for fonts/padding/margin etc.
// Range from 1-16. 1 = smallest, 18 = largest
export const spacing = {
  1: 0.25, // 4px
  2: 0.5, // 8px
  3: 0.75, // 12px
  4: 1, // 16px
  5: 1.5, // 24px
  6: 2, // 32px
  7: 3, // 48px
  8: 4, // 64px
  9: 6, // 96px
  10: 8, // 128px
  11: 12, // 192px
  12: 16, // 256px
  13: 24, // 384px
  14: 32, // 512px
  15: 40, // 640px
  16: 48, // 768px
  17: 60, // 960px
  18: 72, // 1152px
}

/**
 * Formats a size to use spacing values. uses 'rem'
 * by default.
 * @param {number} size - based off of spacing, 0-16
 * @param {string} unit - unit of measurement 'rem' 'em'
 *
 * @returns {string} formatted sizeMeasurement
 */
export const spaceScale = (size = 4, unit = 'rem') => {
  return `${spacing[size]}${unit}`
}

/**
 * Takes any CSS accepted measurement for padding/margin
 * and converts it to use our required unit sizes.
 * Every value should just be a number.
 * @param {array} spacing - array of values
 * @param {number} spacingVertical
 * @param {number} spacingHorizontal
 * @param {number} spacingTop
 * @param {number} spacingBottom
 * @param {number} spacingLeft
 * @param {number} spacingRight
 */
export const formatPaddingAndMargin = (
  spacing,
  spacingVertical,
  spacingHorizontal,
  spacingTop,
  spacingBottom,
  spacingLeft,
  spacingRight,
) => {
  let spacingArr = [0, 0, 0, 0]

  if (spacing) {
    if (typeof spacing === 'number') {
      spacingArr = [spacing]
    } else {
      spacingArr = [...spacing]
    }
  }
  if (spacingVertical) {
    spacingArr = [spacingVertical, 0]
  }
  if (spacingHorizontal) {
    spacingArr = [0, spacingHorizontal]
  }
  if (spacingTop) {
    spacingArr[0] = spacingTop
  }
  if (spacingBottom) {
    spacingArr[2] = spacingBottom
  }
  if (spacingRight) {
    spacingArr[1] = spacingRight
  }
  if (spacingLeft) {
    spacingArr[3] = spacingLeft
  }

  return spacingArr.map((unit) => (unit !== 0 && spaceScale(unit)) || '0rem').join(' ')
}
