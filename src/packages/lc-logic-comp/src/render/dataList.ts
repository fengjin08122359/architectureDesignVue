import { gennerateUUID } from '@mikefeng110808/utils/';
import { compListStore } from '@mikefeng110808/lc-logic-data-manage/';
import { ComboModuleInstance } from '..';


export interface CombPayload {
  id: string;
  name: string;
  comboModule: ComboModuleInstance
}


export interface CombModulePayload {
  name: string;
  value: any;
}

export interface CombResPayload {
  key: string;
  value: CombModulePayload;
}


export class CombList {
  dataList:any[]
  current: CombPayload;
  constructor () {
    this.dataList = compListStore.getData()
    this.current = {
      id: '',
      name: '',
      comboModule: new ComboModuleInstance()
    }
  }
  getData (id:string) {
    var res = compListStore.getData(id);
    this.current = {
      id: id,
      name: res.name,
      comboModule: new ComboModuleInstance()
    }
    this.current.comboModule.setValue(res.value)
  }
  add () {
    this.current = {
      id: gennerateUUID(),
      name: '测试',
      comboModule: new ComboModuleInstance()
    }
    this.setData(this.current.id)
    this.getList();
  }
  getList () {
    this.dataList = compListStore.getData()
  }
  setData (id:string) {
    compListStore.setData({
      name:this.current.name,
      value: this.current.comboModule.getValue()
    }, id)
    this.getList();
  }
  remove (id:string) {
    compListStore.removeData(id)
    this.getList();
  }
}  

export let combList = new CombList()