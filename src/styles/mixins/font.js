const fontStyles = {
  default: {
    fontFamily: 'Open Sans, Arial, sans-serif',
    fontWeight: 300,
    fontSize: 14,
  },
  heroTitle: {
    fontSize: 60,
    fontWeight: 700,
  },
  heading: {
    fontSize: 28,
    fontWeight: 300,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  heading3: {
    fontSize: 16,
    fontWeight: 400,
  },
  text: {
    fontSize: 28,
    fontWeight: 400,
  },
  text2: {
    fontSize: 18,
    fontWeight: 400,
  },
  text3: {
    fontSize: 15,
    fontWeight: 400,
  },
  text4: {
    fontSize: 11,
  },
  label: {

  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
  },
}

const font = (rule, type) => {
  if (!fontStyles[type]) throw rule.error(`Invalid font type: ${type}`)
  return fontStyles[type]
}

module.exports = font
