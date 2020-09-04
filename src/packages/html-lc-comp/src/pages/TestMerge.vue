<template>
  <div class="testMerge">
    <InstanceSlot :instance="intance"></InstanceSlot>
    <el-input type='textarea' :value="staticTemplate" ></el-input>
    <InstanceSlot :instance="intance" :isCompiler='true'></InstanceSlot>
    <el-input type='textarea' v-model="renderView"></el-input>
    <div v-for="(error, index) in errors" :key="index">
      <el-input type='textarea' :value="error"></el-input>
    </div>
    <CombParam :instance="intance"></CombParam>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { combList,CombList, ComboModuleInstance} from "../sdk"
import { compile } from 'vue-template-compiler/build.js'
import CombParam from '../components/CombParam'
@Component
export class InstanceSlot extends Vue {
  @Prop() private instance: ComboModuleInstance;
  @Prop() private isCompiler: boolean;

  render(createElement:any, context:any) {
    let list = createElement("div", {}, []);
    if (this.instance) {
      if (this.isCompiler) {
        list = this.instance.render({
          createElement,
          vueRoot: this,
          context,
        },{isCompiler:true});
      } else {
        list = this.instance.render({
          createElement,
          vueRoot: this,
          context,
        },{isCompiler:false});
      }
    }
    return list;
  }
}


@Component({components: {InstanceSlot, CombParam}})
export default class TestMerge extends Vue {
  combList:CombList = combList
  staticTemplate:string = ''
  renderView:string= ''
  get intance (): ComboModuleInstance {
    window.instance = this.combList.current.comboModule
    return this.combList.current.comboModule
  }
  get errors ():string[] {
    var res = compile(this.intance.getRenderTemplate() || '')
    return res.errors
  }
  mounted() {
    console.log(this.intance.getRenderTemplate())
    this.staticTemplate = this.intance.getRenderTemplate()
    this.renderView = this.intance.getRenderTemplate()
  }
  @Watch('renderView')
  onWatchIV (val:any) {
    if (val) {
      this.intance.target.selfProp.renderTemplate = val
    }
  }
  @Watch('intance.target.selfProp.renderView', {deep:true})
  updateView (val) {
    this.staticTemplate = val
    this.renderView = val
  }
}
</script>

<style lang="less" scoped>
@toolWidth: 200px;

.mergeRender {
  .Editor {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    font-size: 0;
  }
}
</style>
