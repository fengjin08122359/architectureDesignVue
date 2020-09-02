import { DataList } from "@mikefeng110808/basic";

import { gennerateUUID } from "@mikefeng110808/utils";

export interface OutEventPayload {
  key: keyof HTMLElementEventMap;
  tid: string;
}

export interface InEventPayload {
  tid: string;
}
export class InEventBind {
  opt: InEventPayload;
  id: string;
  constructor(opt: InEventPayload) {
    this.opt = opt;
    this.id = gennerateUUID();
  }
  setValue(val: any) {
    this.opt.tid = val.tid || "";
  }
  getValue() {
    return this.opt;
  }
}

export class OutEventBind {
  opt: OutEventPayload;
  id: string;
  constructor(opt: OutEventPayload) {
    this.opt = opt;
    this.id = gennerateUUID();
  }
  setValue(val: any) {
    this.opt.tid = val.tid || "";
    this.opt.key = val.key || "";
  }
  getValue() {
    return this.opt;
  }
}
export class EventBind {
  inList: DataList;
  outList: DataList;
  constructor() {
    this.inList = new DataList();
    this.outList = new DataList();
  }
  addIn(data?: InEventPayload) {
    var event = new InEventBind(
      data || {
        tid: ""
      }
    );
    this.inList.add({
      name: event.id,
      data: event
    });
    return event;
  }

  addOut(data?: OutEventPayload) {
    var event = new OutEventBind(
      data || {
        tid: "",
        key: "click"
      }
    );
    this.outList.add({
      name: event.id,
      data: event
    });
    return event;
  }

  removeIn(id: string) {
    this.inList.remove(id);
  }
  removeOut(id: string) {
    this.outList.remove(id);
  }
  getInList() {
    return this.inList.get("").map(item => item.data);
  }
  getOutList() {
    return this.outList.get("").map(item => item.data);
  }
  clearIn() {
    this.inList.clear();
  }
  clearOut() {
    this.outList.clear();
  }
  save() {}
  getValue() {
    return {
      inValue: this.getInList().map(item => item.getValue()),
      outValue: this.getOutList().map(item => item.getValue())
    };
  }
  setValue (value:any) {
    (value.inValue || []).forEach((item: any) => {
      var event = this.addIn();
      event.setValue(item);
    });
    (value.outValue || []).forEach((item: any) => {
      var event = this.addOut();
      event.setValue(item);
    });
    this.save();
  }
}
