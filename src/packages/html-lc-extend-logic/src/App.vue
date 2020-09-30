<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {SystemLogic} from './sdk'

@Component
export default class App extends Vue {
  mounted() {
    var logic1 = new SystemLogic()
    var logic2 = new SystemLogic()
    var logic3 = new SystemLogic()
    logic1.key = 'aaa'
    logic2.key = 'bbb'
    logic3.key = 'ccc'
    logic1.value = 1
    logic2.value = 2
    logic1.register() 
    logic2.register() 
    logic3.register() 
    logic3.setExpression("logic.set('ccc', (logic.get('aaa') + logic.get('bbb')))")
    logic3.handler()
    console.log(logic3.value)
    
    logic2.value = 3
    logic3.handler()
    console.log(logic3.value)
  }
}
</script>
