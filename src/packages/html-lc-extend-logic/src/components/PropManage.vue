<template>
  <div class="propManage">
    <el-button @click='save'>save</el-button>
    <el-row>
    <el-col>
      <InstanceSlot :instance="instance.target.selfProp" :generator="generator"></InstanceSlot>
    </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ComboModuleInstance, PropGeneratePiece } from "../sdk";
import {InstanceSlot} from "./InstanceSlot"


@Component({ components: { InstanceSlot } })
export default class StyleManage extends Vue {
  @Prop() private instance!: ComboModuleInstance;
  @Prop() private updateNum: number;
  generator = new PropGeneratePiece()
  storeParam = ''
  created() {
    this.generator.generate(this.instance.target.selfProp.params)
  }
  change () {
    var paramsString = JSON.stringify(this.instance.target.selfProp.params)
    if (this.storeParam != paramsString) {
      this.storeParam = paramsString
    }
  }
  save () {
    this.instance.target.selfProp.setParam(this.generator.uiList.list.map(item => item.getRawData()))
    this.instance.target.selfProp.resetOpt()
  }
  @Watch('instance.target.selfProp.params')
  updateParam () {
     this.generator.generate(this.instance.target.selfProp.params)
  }
  @Watch('updateNum') 
  updateParamNum () {
     this.generator.generate(this.instance.target.selfProp.params)
  }
}
</script>