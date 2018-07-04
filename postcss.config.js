var path = require('path')
var STYLES_DIR = path.resolve(__dirname, 'frontend/styles')

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [STYLES_DIR],
    }),
    require('postcss-mixins')({
      mixins: require(STYLES_DIR + '/mixins'),
    }),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')({
      browsers: ['last 2 Chrome versions'],
    }),
  ]
}
