import { VueUI } from '@mikefeng110808/vue-ui';
import { ModuleSelfProp } from "@mikefeng110808/lc-ui-module";
import { SingleUI, SingleUIPayload } from '@mikefeng110808/logic';

export class ContainerSelfProp extends ModuleSelfProp {
  constructor() {
    super();
  }
  getStyle(): any {
    return {
      width: "100%",
      height: "200px",
      background: "",
      display: "block",
      position: "relative"
    };
  }
}

export class BasicSelfProp extends ModuleSelfProp {
  constructor() {
    super();
  }
  getStyle(): any {
    return {
      width: "100%",
      height: "70px",
      background: "",
      display: "inline-block"
    };
  }
}

export class MergeSelfProp extends ModuleSelfProp {
  constructor() {
    super();
  }
  getStyle(): any {
    return {
      width: "100%",
      height: "500px",
      background: "",
      display: "inline-block"
    };
  }
}

export const renderTemplate = "<div></div>"

export class ComboSelfProp extends ModuleSelfProp {
  renderTemplate:string
  renderView:string
  constructor() {
    super();
    this.renderTemplate = renderTemplate
    this.renderView = renderTemplate
  }
  addParam (data: SingleUIPayload) {//key,type
    this.params.push(new VueUI(data))
    this.resetOpt()
  }
  removeParam (key:string) {
    this.params = this.params.filter((item:SingleUI) => item.key != key)
    this.resetOpt()
  }
  getStyle(): any {
    return {
      width: "100%",
      height: "200px",
      fontSize: "12px",
      display: "inline-block"
    };
  }
  getAllValue () {
    return {
      params: this.params.map(item => item.getRawData()),
      opt: this.opt,
      renderTemplate: this.renderTemplate,
      renderView: this.renderTemplate,
    }
  }
  setAllValue (value:any) {
    this.setParam(value.params)
    this.setValue(value.opt)
    this.renderTemplate = value.renderTemplate || renderTemplate
    this.renderView  = value.renderView || renderTemplate
  }
}
