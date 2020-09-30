<template>
  <div id="app">
    <EditorTemplate></EditorTemplate>
  </div>
</template>
<script lang="ts">
import EditorTemplate from "./pages/EditorTemplate.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({components: {EditorTemplate }})
export default class App extends Vue {
}
</script>
