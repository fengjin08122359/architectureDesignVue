import { basic, container, merge, InstanceModulePayload } from "@mikefeng110808/lc-ui-instance";


export let basicModules: InstanceModulePayload[] = [];
export let continerModules: InstanceModulePayload[] = [];
export let mergeModules: InstanceModulePayload[] = [];
basicModules = basic.concat()
continerModules = container.concat()
mergeModules = merge.concat()

export let generateModule = (props: InstanceModulePayload) => {
  let target = new props.module();
  target.resetStyle()
  return target;
};
