<template>
  <div class="CombParam">
    <div>params:</div>
    <el-button @click="instance.addSelfPropParam({
      key: '',
      value: '',
      type:'input'
    })">addParams</el-button>
    <el-button @click="save">save</el-button>
    <el-form label-width='110px'>
    <div v-for="(item, index) in instance.target.selfProp.params" :key="index">
      <el-form-item label='key'>
        <el-input v-model='item.key'>
        </el-input>
      </el-form-item>
       <el-form-item label='type'>
       <el-select v-model="item.type">
        <el-option value='input'>input</el-option>
        <el-option value='number'>number</el-option>
        <el-option value='select'>select</el-option>
        <el-option value='array'>array</el-option>
        <el-option value='object'>object</el-option>
        <el-option value='mulSelect'>mulSelect</el-option>
        <el-option value='boolean'>boolean</el-option>
       </el-select>
      </el-form-item>
      <el-form-item label='deal'>
          <el-button @click="instance.removeSelfPropParam(item.key)">删除key</el-button>
      </el-form-item>
    </div>
    </el-form>
    <PropManage :instance="instance" :updateNum='updateNum'>
    </PropManage>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {ComboModuleInstance} from '../sdk'
import PropManage from './PropManage'

@Component({components:{PropManage}})
export default class CombParam extends Vue {
  @Prop() private instance: ComboModuleInstance;
  updateNum:number = 0
  mounted() {
  }
  save () {
    this.updateNum++ 
    this.instance.target.selfProp.resetOpt()
  }
  @Watch('instance.target.selfProp.param',{ deep: true })
  updateParam (val) {
    this.instance.target.selfProp.resetOpt()
    // this.instance.target.selfProp.resetOpt()
  }
}
</script>

<style lang="less" scoped>
</style>
