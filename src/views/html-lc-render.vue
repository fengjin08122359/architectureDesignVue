<template>
  <div id="app">
    <App :systemIn="systemIn"></App>
  </div>
</template>

<script>
import {App} from '../packages/html-lc-render/src'
export default {
  components: {App},
  data() {
    return {
      systemIn : {
        loggicId: 123123,
        chatId: 'ddda1ss',
        otherId: ['aaaaaa']
      }
    }
  },
  mounted () {
  }
};
</script>
