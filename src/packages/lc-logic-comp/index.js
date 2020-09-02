'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-logic-comp.cjs.prod.js.js')
} else {
  module.exports = require('./dist/lc-logic-comp.cjs.js.js')
}
