const fontStyles = {
  default: {
    fontFamily: 'Open Sans, Arial, sans-serif',
    fontWeight: 300,
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 12,
  },
  instruction: {
    fontSize: 18,
  },
  button: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontWeight: 700,
  },
  highlight: {
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontWeight: 700,
  },
  input: {
    fontSize: 18,
  },
  error: {
    fontSize: 11,
    fontWeight: 700,
  },
  /* backward digit */
  digit: {
    fontSize: 18,
    fontWeight: 700,
  },
  bigDigit: {
    fontSize: 32,
    fontWeight: 700,
  },
}

const font = (rule, type) => {
  if (!fontStyles[type]) throw rule.error(`Invalid font type: ${type}`)
  return fontStyles[type]
}

module.exports = font
