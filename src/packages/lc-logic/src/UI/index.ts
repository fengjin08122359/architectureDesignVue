import { SingleUI, SingleUIPayload } from "@mikefeng110808/logic";
import { EventBind } from "../EventBind";
import { Style } from "../Style";

export interface UIPayload {
  eventBind: EventBind;
  style: Style;
  selfProp: SelfProp;
}

export class UI {
  eventBind: EventBind;
  style: Style;
  selfProp: SelfProp;
  constructor() {
    this.eventBind = new EventBind();
    this.style = new Style();
    this.selfProp = new SelfProp();
  }
  setSelfProp(selfProp: SelfProp) {
    this.selfProp = selfProp;
  }
  getValue(): any {
    return {
      eventBind: {
        value: this.eventBind.getValue()
      },
      selfProp: {
        value: this.selfProp.getValue()
      },
      style: {
        value: this.style.getValue()
      }
    };
  }
}

export class SelfProp {
  opt: any;
  params: SingleUI[];
  constructor() {
    this.opt = {};
    this.params = [];
  }
  setParam(data: SingleUIPayload[] = []) {
    this.params = data.map(item => new SingleUI(item));
    this.resetOpt();
  }
  resetOpt() {
    var opt: any = {};
    this.params.forEach((item: SingleUI) => {
      opt[item.getKey()] = item.getValue();
    });
    this.opt = opt;
  }
  getValue(): any {
    return this.opt;
  }
  setValue(value: any) {
    this.opt = value || {};
    this.params.forEach(item => {
      if (this.opt[item.key]) {
        item.setValue(this.opt[item.key])
      }
    })
  }
  getAllValue () {
    return {
      params: this.params.map(item => item.getRawData()),
      opt: this.opt,
    }
  }
  setAllValue (value:any) {
    this.setParam(value.params)
    this.setValue(value.opt)
  }
}
