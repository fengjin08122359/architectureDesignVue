<template>
  <div class='SelectVue'>
    <el-select v-model="value" filterable>
      <el-option v-for="(item, index) in optionsArray" :value="item.key" :label='item.value' :key="index">
      </el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch
} from "vue-property-decorator";
import {SelectVueUI} from '../achieve'
@Component
export default class SelectVueUIComponent extends Vue {
  @Prop() private target!: SelectVueUI;
  value = ''
  optionsArray = []
  mounted() {
    console.log(this.target.ui.selfProp)
    this.resetSelfProp()
  }
  resetSelfProp (val = this.target.ui.selfProp) {
    this.value = val.opt.value || ''
    this.optionsArray = val.params.find(item =>item.key == 'value').props.optionsArray
  }
  @Watch('target.ui.selfProp', { deep: true }) 
  watchTab (val) {
    this.resetSelfProp(val)
  }
}
</script>

<style lang="less" scoped>
.NumberVue{
  font-size: 14px;
  line-height: 40px;
}
</style>

