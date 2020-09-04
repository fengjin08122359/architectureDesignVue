<template>
  <div id="app">
    <DataList></DataList>
    <TestMerge></TestMerge>
  </div>
</template>

<script lang="ts">
import TestMerge from "./pages/TestMerge.vue";
import DataList from "./pages/DataList.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({components: {TestMerge, DataList}})
export default class App extends Vue {

}
</script>
