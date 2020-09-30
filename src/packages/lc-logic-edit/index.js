'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-logic-edit.cjs.prod.js')
} else {
  module.exports = require('./dist/lc-logic-edit.cjs.js')
}
