'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-ui-design.cjs.prod.js')
} else {
  module.exports = require('./dist/lc-ui-design.cjs.js')
}
