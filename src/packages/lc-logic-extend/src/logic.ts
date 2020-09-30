import { DataList } from '@mikefeng110808/basic';

class  Logic {
  private dataList: DataList;
  constructor () {
    this.dataList = new DataList();
  }
  register (logic:SystemLogic) {
    this.dataList.add({
      name: logic.key,
      data: logic
    });
  }
  get (key:string) {
    var targets:any[] = this.dataList.get(key).map(item => item.data);
    var value = targets.map(item => item.getValue())[0]
    return value
  }
  set (key:string, value: any) {
    var targets:any[] = this.dataList.get(key).map(item => item.data);
    var target = targets.map(item => item)[0]
    if (target) {
      target.value = value
    }
  }
}

export let logic  = new Logic()

interface SystemLogicPayload {
  value: any
  key:string
  expression: string
}

export class SystemLogic {
  key: any
  expression: string
  private _value: any
  constructor (params:SystemLogicPayload) {
    this.key = ''
    this.expression = ''
    this.merge(params)
  }
  merge (params:SystemLogicPayload) {

    this.key = params.key || ''
    this.expression = params.expression || ''
    this.value = params.value
  }
  get value():any  {
    return this._value
  }
  set value  (value:any) {
    this._value = value 
  }
  getValue () {
    return this._value
  }
  setExpression (expression: string) {
    this.expression = expression
  }
  handler () {
    //表达式处理,
    //根据通过key查找全局logic获取value
    try {
      eval(this.expression)
    } catch (error) {
      console.log(error)
    }
  }
  register () {
    //注册至全局变量
    logic.register(this)
  }

}