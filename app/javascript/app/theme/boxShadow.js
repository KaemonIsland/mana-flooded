/**
 * Applies alpha to hsl strings
 * @param {string} hsl - HSL string, hsl(200, 100%, 50%)
 * @param {number} alpha - The alpha value for opacity
 * @returns {string} HSLA value, hsla(200, 100%, 50%, 0.3)
 */
export const getInsetColor = (hsl, alpha) => {
  // finds the separator value
  let separated = hsl.indexOf(',') > -1 ? ',' : ' '

  // splits the hsl value by the separator
  const splitHsl = hsl.substr(4).split(')')[0].split(separated)

  return `hsla(${splitHsl.join(',')}, ${alpha})`
}

/**
 * Variations of box shadows with varying height/depth
 * outset/inset have a inset shadows to represent light from above.
 * numbered shadows only have a lower shadow to represent raised height
 * 1 is the smallest
 * 5 is the largest
 */
export const boxShadow = {
  outset: (hsl) => `inset 0 3px 2px ${getInsetColor(hsl, 0.7)}, 0 2px 3px hsla(0, 0%, 0%, 0.4)`,
  inset: (hsl) => `0 2px 2px ${getInsetColor(hsl, 0.3)}, inset 0 2px 0 hsla(0, 0%, 0%, 0.3)`,
  single: {
    1: '0 1px 3px hsla(0, 0%, 0%, 0.3)',
    2: '0 4px 6px hsla(0, 0%, 0%, 0.3)',
    3: '0 5px 15px hsla(0, 0%, 0%, 0.3)',
    4: '0 10px 24px hsla(0, 0%, 0%, 0.3)',
    5: '0 15px 35px hsla(0, 0%, 0%, 0.3)',
  },
  dual: {
    1: '0 1px 3px hsla(0, 0%, 0%, .12), 0 1px 2px hsla(0, 0%, 0%, .24)',
    2: '0 3px 6px hsla(0, 0%, 0%, .15), 0 2px 4px hsla(0, 0%, 0%, .12)',
    3: '0 10px 20px hsla(0, 0%, 0%, .15), 0 3px 6px hsla(0, 0%, 0%, .1)',
    4: '0 15px 25px hsla(0, 0%, 0%, .15), 0 5px 10px hsla(0, 0%, 0%, .05)',
    5: '0 20px 40px hsla(0, 0%, 0%, .2)',
  },
}
