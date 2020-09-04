<template>
  <div class='BooleanVueUI' v-show='target.props.show'>
    <div>参数类型: 布尔值</div>
    <div>标题: {{target.props.label}}</div>
    <div>key: {{target.key}}</div>
    <el-checkbox v-model="target.value">是否选中</el-checkbox>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop
} from "vue-property-decorator";
import {VueUI} from '../index'
@Component
export default class InputVueUI extends Vue {
  @Prop() private target!: VueUI;
}
</script>


