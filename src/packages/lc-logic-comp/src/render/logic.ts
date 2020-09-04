import { VueRenderPayload } from "@mikefeng110808/vue-instance";
import { ModuleInstance } from "@mikefeng110808/lc-ui-module";
import { ComboComponent } from "@mikefeng110808/lc-ui-instance";
import ComboVue from '../template/ComboVue';

export class ComboModuleInstance extends ModuleInstance{
  target: ComboComponent
  constructor () {
    super()
    this.target = new ComboComponent()
  }
  getRenderTemplate () {
    return this.target.selfProp.renderTemplate
  }
  addSelfPropParam () {
    this.target.selfProp.addParam({
      key: '',
      value: '',
      type:'input'
    })
  }
  removeSelfPropParam (key:string) {
    this.target.selfProp.removeParam(key)
  }
  resetOpt (target:any) {
    for (const [key,value] of Object.entries(this.target.selfProp.opt)) {
      target[key] = value
    }
  }
  render (render: VueRenderPayload, props: any = {isCompiler:true}) {
    return render.createElement(
      ComboVue, // 标签名称
      {
        ...render.context,
        props: { target: this.target, ...props }
      },
      [render.vueRoot.$slots.default]
    );
  }
}

export let testCombo = new ComboModuleInstance()
