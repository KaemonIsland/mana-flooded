/**
 * Converts HSL values to rgb values
 * Hue can be in the form of 0 - 360, deg, rad, or turn
 * @param {string} hsl - The hsl string value "hsl(360, 50%, 50%)"
 * @returns {string} rgb string
 *
 * More color conversions:
 * https://css-tricks.com/converting-color-spaces-in-javascript/
 */
export const hslToRgb = (hsl) => {
  // finds the separator value
  let separated = hsl.indexOf(',') > -1 ? ',' : ' '

  // splits the hsl value by the separator
  const splitHsl = hsl.substr(4).split(')')[0].split(separated)

  let hue = splitHsl[0]

  // saturation and lightness must be fractions of 1
  const saturation = splitHsl[1].substr(0, splitHsl[1].length - 1) / 100
  const lightness = splitHsl[2].substr(0, splitHsl[2].length - 1) / 100

  // Strip label and convert to degrees (if necessary)
  if (hue.indexOf('deg') > -1) hue = hue.substr(0, hue.length - 3)
  else if (hue.indexOf('rad') > -1)
    hue = Math.round(hue.substr(0, hue.length - 3) * (180 / Math.PI))
  else if (hue.indexOf('turn') > -1) hue = Math.round(hue.substr(0, hue.length - 4) * 360)
  // Keep hue fraction of 360 if ending up over
  if (hue >= 360) hue %= 360

  // Color intensity
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation

  // Second largest component next to chroma
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))

  // Amount to add to each value to match lightness
  const matchLightness = lightness - chroma / 2

  // RGB values
  let r = 0
  let g = 0
  let b = 0

  // All the fun calculations
  if (0 <= hue && hue < 60) {
    r = chroma
    g = x
    b = 0
  } else if (60 <= hue && hue < 120) {
    r = x
    g = chroma
    b = 0
  } else if (120 <= hue && hue < 180) {
    r = 0
    g = chroma
    b = x
  } else if (180 <= hue && hue < 240) {
    r = 0
    g = x
    b = chroma
  } else if (240 <= hue && hue < 300) {
    r = x
    g = 0
    b = chroma
  } else if (300 <= hue && hue < 360) {
    r = chroma
    g = 0
    b = x
  }
  r = Math.round((r + matchLightness) * 255)
  g = Math.round((g + matchLightness) * 255)
  b = Math.round((b + matchLightness) * 255)

  // This returns an rgb string
  // return 'rgb(' + r + ',' + g + ',' + b + ')'

  // This returns rgb values in an array
  return [r, g, b]
}

/**
 * Decides if the text color should be black or white
 * based off of the background color. This uses the suggested
 * formula from W3C.
 * https://www.w3.org/TR/AERT/#color-contrast
 */
export const textContrast = (hsl) => {
  // convert hsl to rgb for contrast
  const [r, g, b] = hslToRgb(hsl)

  // Contrast value
  const contrast = Math.round((parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000)
  return contrast > 125 ? 'black' : 'white'
}

/**
 * Various color swatches for themed use.
 * Each color has 10 variants ranging from 1-10
 * 10 = darkest variation
 * 1 = lightest variation.
 * 5/6 are the most vibrant
 */

export const color = {
  red: {
    1: 'hsl(360, 100%, 97%)',
    2: 'hsl(360, 82%, 89%)',
    3: 'hsl(360, 77%, 78%)',
    4: 'hsl(360, 71%, 66%)',
    5: 'hsl(360, 64%, 55%)',
    6: 'hsl(360, 67%, 44%)',
    7: 'hsl(360, 72%, 38%)',
    8: 'hsl(360, 79%, 32%)',
    9: 'hsl(360, 85%, 25%)',
    10: 'hsl(360, 92%, 20%)',
  },
  redVivid: {
    1: 'hsl(360, 100%, 95%)',
    2: 'hsl(360, 100%, 87%)',
    3: 'hsl(360, 100%, 80%)',
    4: 'hsl(360, 91%, 69%)',
    5: 'hsl(360, 83%, 62%)',
    6: 'hsl(356, 75%, 53%)',
    7: 'hsl(354, 85%, 44%)',
    8: 'hsl(352, 90%, 35%)',
    9: 'hsl(350, 94%, 28%)',
    10: 'hsl(360, 94%, 20%)',
  },
  orange: {
    1: 'hsl(22, 100%, 95%)',
    2: 'hsl(22, 100%, 86%)',
    3: 'hsl(22, 92%, 76%)',
    4: 'hsl(21, 83%, 64%)',
    5: 'hsl(22, 78%, 55%)',
    6: 'hsl(22, 71%, 45%)',
    7: 'hsl(22, 74%, 38%)',
    8: 'hsl(22, 79%, 31%)',
    9: 'hsl(22, 80%, 26%)',
    10: 'hsl(22, 83%, 19%)',
  },
  orangeVivid: {
    1: 'hsl(24, 100%, 93%)',
    2: 'hsl(22, 100%, 85%)',
    3: 'hsl(20, 100%, 77%)',
    4: 'hsl(18, 100%, 70%)',
    5: 'hsl(16, 94%, 61%)',
    6: 'hsl(14, 89%, 55%)',
    7: 'hsl(12, 86%, 47%)',
    8: 'hsl(10, 93%, 40%)',
    9: 'hsl(8, 92%, 35%)',
    10: 'hsl(6, 96%, 26%)',
  },
  yellow: {
    1: 'hsl(45, 100%, 96%)',
    2: 'hsl(45, 90%, 88%)',
    3: 'hsl(45, 86%, 81%)',
    4: 'hsl(43, 90%, 76%)',
    5: 'hsl(43, 89%, 70%)',
    6: 'hsl(42, 78%, 60%)',
    7: 'hsl(42, 63%, 48%)',
    8: 'hsl(43, 72%, 37%)',
    9: 'hsl(43, 77%, 27%)',
    10: 'hsl(43, 86%, 17%)',
  },
  yellowVivid: {
    1: 'hsl(49, 100%, 96%)',
    2: 'hsl(48, 100%, 88%)',
    3: 'hsl(48, 95%, 76%)',
    4: 'hsl(48, 94%, 68%)',
    5: 'hsl(44, 92%, 63%)',
    6: 'hsl(42, 87%, 55%)',
    7: 'hsl(36, 77%, 49%)',
    8: 'hsl(29, 80%, 44%)',
    9: 'hsl(22, 82%, 39%)',
    10: 'hsl(15, 86%, 30%)',
  },
  lime: {
    1: 'hsl(83, 188%, 94%)',
    2: 'hsl(84, 77%, 86%)',
    3: 'hsl(83, 68%, 74%)',
    4: 'hsl(83, 63%, 61%)',
    5: 'hsl(83, 55%, 52%)',
    6: 'hsl(83, 64%, 42%)',
    7: 'hsl(83, 70%, 33%)',
    8: 'hsl(83, 74%, 27%)',
    9: 'hsl(81, 78%, 21%)',
    10: 'hsl(81, 86%, 14%)',
  },
  limeVivid: {
    1: 'hsl(83, 100%, 96%)',
    2: 'hsl(83, 100%, 87%)',
    3: 'hsl(86, 100%, 76%)',
    4: 'hsl(88, 91%, 66%)',
    5: 'hsl(90, 84%, 55%)',
    6: 'hsl(92, 86%, 45%)',
    7: 'hsl(92, 89%, 38%)',
    8: 'hsl(100, 89%, 31%)',
    9: 'hsl(99, 91%, 25%)',
    10: 'hsl(100, 93%, 17%)',
  },
  green: {
    1: 'hsl(125, 65%, 93%)',
    2: 'hsl(126, 49%, 84%)',
    3: 'hsl(122, 42%, 75%)',
    4: 'hsl(123, 38%, 63%)',
    5: 'hsl(123, 35%, 51%)',
    6: 'hsl(122, 39%, 41%)',
    7: 'hsl(122, 47%, 35%)',
    8: 'hsl(125, 56%, 29%)',
    9: 'hsl(125, 73%, 20%)',
    10: 'hsl(125, 986%, 14%)',
  },
  greenVivid: {
    1: 'hsl(125, 65%, 93%)',
    2: 'hsl(127, 65%, 85%)',
    3: 'hsl(124, 63%, 74%)',
    4: 'hsl(123, 53%, 55%)',
    5: 'hsl(123, 57%, 45%)',
    6: 'hsl(122, 73%, 35%)',
    7: 'hsl(122, 80%, 29%)',
    8: 'hsl(125, 79%, 26%)',
    9: 'hsl(125, 86%, 20%)',
    10: 'hsl(125, 97%, 14%)',
  },
  teal: {
    1: 'hsl(152, 68%, 96%)',
    2: 'hsl(154, 75%, 87%)',
    3: 'hsl(156, 73%, 74%)',
    4: 'hsl(158, 58%, 62%)',
    5: 'hsl(160, 51%, 49%)',
    6: 'hsl(162, 63%, 41%)',
    7: 'hsl(164, 71%, 34%)',
    8: 'hsl(166, 72%, 28%)',
    9: 'hsl(168, 80%, 23%)',
    10: 'hsl(170, 97%, 15%)',
  },
  tealVivid: {
    1: 'hsl(165, 67%, 96%)',
    2: 'hsl(163, 75%, 87%)',
    3: 'hsl(162, 73%, 74%)',
    4: 'hsl(164, 70%, 63%)',
    5: 'hsl(166, 64%, 49%)',
    6: 'hsl(168, 78%, 41%)',
    7: 'hsl(170, 91%, 32%)',
    8: 'hsl(172, 94%, 26%)',
    9: 'hsl(172, 98%, 20%)',
    10: 'hsl(176, 100%, 13%)',
  },
  cyan: {
    1: 'hsl(186, 100%, 94%)',
    2: 'hsl(185, 94%, 87%)',
    3: 'hsl(184, 80%, 74%)',
    4: 'hsl(184, 65%, 59%)',
    5: 'hsl(185, 57%, 50%)',
    6: 'hsl(185, 62%, 45%)',
    7: 'hsl(184, 77%, 34%)',
    8: 'hsl(185, 81%, 29%)',
    9: 'hsl(185, 84%, 25%)',
    10: 'hsl(184, 91%, 17%)',
  },
  cyanVivid: {
    1: 'hsl(171, 82%, 94%)',
    2: 'hsl(172, 97%, 88%)',
    3: 'hsl(174, 96%, 78%)',
    4: 'hsl(176, 87%, 67%)',
    5: 'hsl(178, 78%, 57%)',
    6: 'hsl(180, 77%, 47%)',
    7: 'hsl(182, 85%, 39%)',
    8: 'hsl(184, 90%, 34%)',
    9: 'hsl(186, 91%, 29%)',
    10: 'hsl(188, 91%, 23%)',
  },
  lightBlue: {
    1: 'hsl(201, 100%, 96%)',
    2: 'hsl(200, 88%, 90%)',
    3: 'hsl(200, 71%, 80%)',
    4: 'hsl(200, 66%, 69%)',
    5: 'hsl(200, 60%, 58%)',
    6: 'hsl(200, 54%, 49%)',
    7: 'hsl(200, 59%, 43%)',
    8: 'hsl(200, 68%, 35%)',
    9: 'hsl(200, 72%, 31%)',
    10: 'hsl(200, 82%, 24%)',
  },
  LightBlueVivid: {
    1: 'hsl(195, 100%, 95%)',
    2: 'hsl(195, 100%, 85%)',
    3: 'hsl(195, 97%, 75%)',
    4: 'hsl(196, 94%, 67%)',
    5: 'hsl(197, 92%, 61%)',
    6: 'hsl(199, 84%, 55%)',
    7: 'hsl(201, 79%, 46%)',
    8: 'hsl(202, 83%, 41%)',
    9: 'hsl(203, 87%, 34%)',
    10: 'hsl(204, 96%, 27%)',
  },
  blue: {
    1: 'hsl(205, 79%, 92%)',
    2: 'hsl(205, 97%, 85%)',
    3: 'hsl(205, 84%, 74%)',
    4: 'hsl(205, 74%, 65%)',
    5: 'hsl(205, 65%, 55%)',
    6: 'hsl(205, 67%, 45%)',
    7: 'hsl(205, 76%, 39%)',
    8: 'hsl(205, 82%, 33%)',
    9: 'hsl(205, 87%, 29%)',
    10: 'hsl(205, 100%, 21%)',
  },
  blueVivid: {
    1: 'hsl(202, 100%, 95%)',
    2: 'hsl(204, 100%, 86%)',
    3: 'hsl(206, 93%, 73%)',
    4: 'hsl(208, 88%, 62%)',
    5: 'hsl(210, 83%, 53%)',
    6: 'hsl(212, 92%, 43%)',
    7: 'hsl(214, 95%, 36%)',
    8: 'hsl(215, 96%, 32%)',
    9: 'hsl(216, 98%, 25%)',
    10: 'hsl(218, 100%, 17%)',
  },
  indigo: {
    1: 'hsl(221, 68%, 93%)',
    2: 'hsl(221, 78%, 86%)',
    3: 'hsl(224, 67%, 76%)',
    4: 'hsl(225, 57%, 67%)',
    5: 'hsl(227, 50%, 59%)',
    6: 'hsl(227, 42%, 51%)',
    7: 'hsl(228, 45%, 45%)',
    8: 'hsl(230, 49%, 41%)',
    9: 'hsl(232, 51%, 36%)',
    10: 'hsl(234, 62%, 26%)',
  },
  indigoVivid: {
    1: 'hsl(216, 100%, 93%)',
    2: 'hsl(216, 100%, 85%)',
    3: 'hsl(219, 95%, 76%)',
    4: 'hsl(222, 81%, 65%)',
    5: 'hsl(224, 69%, 54%)',
    6: 'hsl(223, 71%, 47%)',
    7: 'hsl(228, 74%, 43%)',
    8: 'hsl(230, 80%, 38%)',
    9: 'hsl(232, 86%, 32%)',
    10: 'hsl(234, 90%, 25%)',
  },
  purple: {
    1: 'hsl(262, 61%, 93%)',
    2: 'hsl(261, 68%, 84%)',
    3: 'hsl(261, 54%, 68%)',
    4: 'hsl(261, 47%, 58%)',
    5: 'hsl(262, 43%, 51%)',
    6: 'hsl(262, 48%, 46%)',
    7: 'hsl(262, 60%, 38%)',
    8: 'hsl(262, 69%, 31%)',
    9: 'hsl(262, 72%, 25%)',
    10: 'hsl(263, 85%, 18%)',
  },
  purpleVivid: {
    1: 'hsl(262, 90%, 96%)',
    2: 'hsl(262, 100%, 88%)',
    3: 'hsl(262, 100%, 78%)',
    4: 'hsl(264, 96%, 70%)',
    5: 'hsl(268, 82%, 60%)',
    6: 'hsl(273, 80%, 49%)',
    7: 'hsl(274, 87%, 43%)',
    8: 'hsl(274, 87%, 37%)',
    9: 'hsl(274, 87%, 31%)',
    10: 'hsl(276, 91%, 23%)',
  },
  magenta: {
    1: 'hsl(295, 58%, 93%)',
    2: 'hsl(293, 67%, 85%)',
    3: 'hsl(293, 54%, 68%)',
    4: 'hsl(293, 48%, 58%)',
    5: 'hsl(294, 43%, 51%)',
    6: 'hsl(294, 48%, 46%)',
    7: 'hsl(294, 60%, 38%)',
    8: 'hsl(294, 68%, 32%)',
    9: 'hsl(294, 72%, 25%)',
    10: 'hsl(295, 84%, 18%)',
  },
  magentaVivid: {
    1: 'hsl(294, 100%, 96%)',
    2: 'hsl(294, 97%, 88%)',
    3: 'hsl(294, 100%, 78%)',
    4: 'hsl(296, 96%, 70%)',
    5: 'hsl(300, 82%, 60%)',
    6: 'hsl(305, 80%, 49%)',
    7: 'hsl(306, 85%, 43%)',
    8: 'hsl(306, 88%, 37%)',
    9: 'hsl(306, 90%, 31%)',
    10: 'hsl(308, 91%, 23%)',
  },
  pink: {
    1: 'hsl(329, 100%, 94%)',
    2: 'hsl(330, 87%, 85%)',
    3: 'hsl(330, 77%, 76%)',
    4: 'hsl(330, 72%, 65%)',
    5: 'hsl(330, 66%, 57%)',
    6: 'hsl(330, 63%, 47%)',
    7: 'hsl(330, 68%, 40%)',
    8: 'hsl(330, 70%, 36%)',
    9: 'hsl(331, 74%, 27%)',
    10: 'hsl(330, 79%, 20%)',
  },
  pinkVivid: {
    1: 'hsl(341, 100%, 95%)',
    2: 'hsl(338, 100%, 86%)',
    3: 'hsl(336, 100%, 77%)',
    4: 'hsl(334, 86%, 67%)',
    5: 'hsl(330, 79%, 56%)',
    6: 'hsl(328, 85%, 46%)',
    7: 'hsl(326, 90%, 39%)',
    8: 'hsl(324, 93%, 33%)',
    9: 'hsl(322, 93%, 27%)',
    10: 'hsl(320, 100%, 19%)',
  },
  blueGrey: {
    1: 'hsl(210, 36%, 96%)',
    2: 'hsl(212, 33%, 89%)',
    3: 'hsl(210, 31%, 80%)',
    4: 'hsl(211, 27%, 70%)',
    5: 'hsl(209, 23%, 60%)',
    6: 'hsl(210, 22%, 49%)',
    7: 'hsl(209, 28%, 39%)',
    8: 'hsl(209, 34%, 30%)',
    9: 'hsl(211, 39%, 23%)',
    10: 'hsl(209, 61%, 16%)',
  },
  coolGrey: {
    1: 'hsl(216, 33%, 97%)',
    2: 'hsl(214, 15%, 91%)',
    3: 'hsl(210, 16%, 82%)',
    4: 'hsl(211, 13%, 65%)',
    5: 'hsl(211, 10%, 53%)',
    6: 'hsl(211, 12%, 43%)',
    7: 'hsl(209, 14%, 37%)',
    8: 'hsl(209, 18%, 30%)',
    9: 'hsl(209, 20%, 25%)',
    10: 'hsl(210, 24%, 16%)',
  },
  grey: {
    1: 'hsl(0, 0%, 97%)',
    2: 'hsl(0, 0%, 88%)',
    3: 'hsl(0, 0%, 81%)',
    4: 'hsl(0, 0%, 69%)',
    5: 'hsl(0, 0%, 62%)',
    6: 'hsl(0, 0%, 49%)',
    7: 'hsl(0, 0%, 38%)',
    8: 'hsl(0, 0%, 32%)',
    9: 'hsl(0, 0%, 23%)',
    10: 'hsl(0, 0%, 13%)',
  },
  warmGrey: {
    1: 'hsl(40, 23%, 97%)',
    2: 'hsl(43, 13%, 90%)',
    3: 'hsl(40, 15%, 80%)',
    4: 'hsl(39, 11%, 69%)',
    5: 'hsl(41, 8%, 61%)',
    6: 'hsl(41, 8%, 48%)',
    7: 'hsl(41, 9%, 35%)',
    8: 'hsl(37, 11%, 28%)',
    9: 'hsl(40, 13%, 23%)',
    10: 'hsl(42, 15%, 13%)',
  },
}
