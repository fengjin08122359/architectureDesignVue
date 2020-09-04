<template>
  <div class='inputVue' v-show='target.props.show'>
    <div>参数类型: 字符串</div>
    <div>标题: {{target.props.label}}</div>
    <div>key: {{target.key}}</div>
    <el-input v-model="target.value" :disabled='target.props.disabled' clearable :type='target.props.inputType'>
      <template slot='append' v-if='target.props.append'>{{target.props.append}}</template>
    </el-input>
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


