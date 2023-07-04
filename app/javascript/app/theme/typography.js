export const fontSizes = {
  1: 0.75, // 12px
  2: 0.875, // 14px
  3: 1, // 16px
  4: 1.125, // 18px
  5: 1.25, // 20px
  6: 1.5, // 24px
  7: 1.875, // 30px
  8: 2.25, // 36px
  9: 3, // 48px
  10: 3.75, // 60px
  11: 4.5, // 72px
}

/**
 * Formats a size to use fontSizes values. uses 'rem'
 * by default.
 * @param {number} size - based off of fontSizes, 0-11
 * @param {string} unit - unit of measurement 'rem' 'em'
 *
 * @returns {string} formatted sizeMeasurement
 */
export const fontScale = (size = 3, unit = 'rem') => {
  return `${fontSizes[size]}${unit}`
}
