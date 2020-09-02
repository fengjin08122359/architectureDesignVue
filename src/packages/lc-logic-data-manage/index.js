'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-logic-data-manage.cjs.prod.js.js')
} else {
  module.exports = require('./dist/lc-logic-data-manage.cjs.js.js')
}
