import { apiList, eventList } from "@mikefeng110808/lc-logic-edit";
import {
  ModuleInstance,
} from "@mikefeng110808/lc-ui-module";
import { pageStore, apiListStore, eventListStore } from "@mikefeng110808/lc-logic-data-manage";
import { containerModules } from './editor';

export let saveFromEdit = (target: ModuleInstance = containerModules) => {
  pageStore.setData(target.getValue())
};

export let restoreFromEdit = (target: ModuleInstance = containerModules) => {
  var res = pageStore.getData();
  if (res) {
    restoreInstance(target, res);
  }
};

export let restoreInstance = (instance: ModuleInstance, res: any) => {
  instance.setValue(res);
  return instance;
};

export let saveFromConfig = () => {
  var apiValue = apiList.getList().map(item => item.opt);
  apiListStore.setData(apiValue)

  var eventValue = eventList.getList().map(item => item.opt);
  eventListStore.setData(eventValue)
};
export let restoreFromConfig = () => {
  var apiValue: any = apiListStore.getData() || []
  apiList.clear();
  apiList.save(apiValue)

  var eventValue: any = eventListStore.getData() || []
  eventList.clear();
  eventList.save(eventValue)
};