'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-ui-module.cjs.prod.js')
} else {
  module.exports = require('./dist/lc-ui-module.cjs.js')
}
