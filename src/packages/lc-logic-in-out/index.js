'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-logic-in-out.cjs.prod.js.js')
} else {
  module.exports = require('./dist/lc-logic-in-out.cjs.js.js')
}
