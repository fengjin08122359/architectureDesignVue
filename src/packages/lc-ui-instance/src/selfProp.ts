import { ModuleSelfProp } from "@mikefeng110808/lc-ui-module";

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
