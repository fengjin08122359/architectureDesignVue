import { ContainerUI, ModuleSelfProp } from "@mikefeng110808/lc-ui-module";

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

export class CardContainerSelfProp extends ContainerSelfProp {
  constructor() {
    super();
    this.opt = {
      tab: ["选项1"]
    };
  }
}

export class CardContainerUI extends ContainerUI {
  activeCard: string;
  constructor() {
    super();
    this.activeCard = "";
  }
  filterChildren(instance: any): boolean {
    return this.moduleIdList.find(
      item => item.moduleId == instance.moduleId && this.activeCard == item.tab
    );
  }
  addModuleId(moduleId: string) {
    this.moduleIdList.push({
      moduleId,
      tab: this.activeCard
    });
  }
  removeModuleId(moduleId: string) {
    this.moduleIdList = this.moduleIdList.filter(
      item => item.moduleId != moduleId
    );
  }
}

export class ButtonSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      label: "提取数据"
    };
  }
}

export class InputSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: "测试",
      prepend: ""
    };
  }
}

export class NumberSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: 0,
      label: ""
    };
  }
}

export class TimePickerSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: 0,
      placeholder: "",
      type: "datetime"
    };
  }
}

export class TimeGroupSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      year: 2020,
      report: 1
    };
  }
}

export class SelectSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: ""
    };
  }
}

export class CheckboxSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: "",
      label: "test"
    };
  }
}

export class CheckBoxGroupSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: []
    };
  }
}

export class RadioSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: ""
    };
  }
}

export class MulSelectSelfProp extends BasicSelfProp {
  constructor() {
    super();
    this.opt = {
      value: ""
    };
  }
}

export class IframeSelfProp extends MergeSelfProp {
  constructor() {
    super();
    this.opt = {
      src: ""
    };
  }
}
