<template>
    <div draggable="true"  @dragstart="dragModule">
        {{target.label}}
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {setCurrentModule} from '../sdk'
@Component
export default class DragCol extends Vue {
  @Prop() private target!: any;

  dragModule(e) {
    e.dataTransfer.effectAllowed = 'all'
    e.dataTransfer.dropEffect = 'copy'
    setCurrentModule(this.target)
  }
}
</script>