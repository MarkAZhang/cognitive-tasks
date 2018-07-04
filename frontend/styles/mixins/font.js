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
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 12,
    fontWeight: 700,
  },
  input: {
    fontSize: 18,
  }
}

const font = (rule, type) => {
  if (!fontStyles[type]) throw rule.error(`Invalid font type: ${type}`)
  return fontStyles[type]
}

module.exports = font
