'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/utils.cjs.prod.js.js')
} else {
  module.exports = require('./dist/utils.cjs.js.js')
}
