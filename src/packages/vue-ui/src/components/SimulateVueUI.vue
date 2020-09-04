<template>
  <div class='SimulateVue' v-show='target.props.show'>
  <div>参数类型: 模拟框</div>
  <div>标题: {{target.props.label}}</div>
  <div>key: {{target.key}}</div>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="模拟框"
      v-model="target.value">
    </el-input>
    <div>{{target.error}}</div>
    <div>{{target.simulateValueToString()}}</div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch
} from "vue-property-decorator";
import {SimulateVueUI} from '../index'
@Component
export default class SimulateVueUIComponent extends Vue {
  @Prop() private target!: SimulateVueUI;
  @Watch('target.value')
  watchSimulate (val: any) {
    this.target.simulate()
  }
}
</script>


