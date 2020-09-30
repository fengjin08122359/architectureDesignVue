import { apiList, eventList } from "@mikefeng110808/lc-logic-edit";
import {
  ModuleInstance,
} from "@mikefeng110808/lc-ui-module";

import { pageStore, apiListStore, eventListStore, paramsStore } from "@mikefeng110808/lc-logic-data-manage";
import { containerModules } from './editor';
import { ComboModuleInstance } from '@mikefeng110808/lc-logic-comp';
import { inParams } from '@mikefeng110808/lc-logic-in-out';

export class AllModuleInstance extends ModuleInstance {
  children: AllModuleInstance[];
  constructor () {
    super()
    this.children = [];
  }
  setValue(data: any) {
    this.moduleId = data.moduleId
    this.canDrag = data.canDrag 
    this.target.setValue(data.target)
    this.children = (data.children || []).map((item: any) => {
      var module = new ModuleInstance() 
      if (item.target.typeId == '') {
        module = new ComboModuleInstance() 
      }
      module.setValue(item)
      return module;
    });
  }
}


export let saveFromEdit = (target: AllModuleInstance = containerModules) => {
  pageStore.setData(target.getValue())
};

export let restoreFromEdit = (target: AllModuleInstance = containerModules) => {
  var res = pageStore.getData();
  if (res) {
    restoreInstance(target, res);
  }
};

export let restoreInstance = (instance: AllModuleInstance, res: any) => {
  instance.setValue(res);
  return instance;
};

export let saveFromConfig = () => {
  var apiValue = apiList.getList().map(item => item.opt);
  apiListStore.setData(apiValue)

  var eventValue = eventList.getList().map(item => item.opt);
  eventListStore.setData(eventValue)

  var paramsValue = inParams.getValue()
  paramsStore.setData(paramsValue)
};
export let restoreFromConfig = () => {
  var apiValue: any = apiListStore.getData() || []
  apiList.clear();
  apiList.save(apiValue)

  var eventValue: any = eventListStore.getData() || []
  eventList.clear();
  eventList.save(eventValue)

  
  var paramsValue: any = paramsStore.getData()
  inParams.clear();
  inParams.save(paramsValue)
};