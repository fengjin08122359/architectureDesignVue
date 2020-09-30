import { SingleUIPayload, SingleUI } from '@mikefeng110808/logic'

export class ParamIn {
  constructor () {

  }
}

export interface InParamPayload {
  [x:string]: number | string | boolean | Array<number | string | boolean>
}
export class SystemIn {
  params: SingleUI[]
  constructor() {
    this.params = []
  }
  setParam (param: InParamPayload) {
    var paramsList:SingleUIPayload[] = []
    for (const [key, val] of Object.entries(param)) {
      if (typeof val == 'number') {
        paramsList.push({
          key,
          value: val,
          type: 'number'
        })
      } else if (typeof val == 'string' ) {
        paramsList.push({
          key,
          value: val,
          type: 'string'
        })
      } else if (typeof val == 'boolean' ) {
        paramsList.push({
          key,
          value: val,
          type: 'boolean'
        })
      } else if (typeof val == 'object') {
        if (Array.isArray(val)) {
          paramsList.push({
            key,
            value: val,
            type: 'array'
          })
        } 
      } 
      this.params = paramsList.map(item=>new SingleUI(item))
    }
  }
  addParam () {
    this.params.push(new SingleUI({
      key: '',
      type: 'input'
    }))
  }
  delParam (index:number) {
    this.params.splice(index, 1)
  }
  getParams () {
    return this.params
  }
  getValue () {
    return {
      params: this.params.map(item => item.getRawData()),
      value: this.params.map(item => item.getKeyValue()),
    }
  }
  setValue (val:any) {
    this.params = (val.params || []).map((item:SingleUIPayload)=>new SingleUI(item))
    this.params.forEach(item => {
      var p = val.value.find((target: any) => target.key == item.key)
      if (p) {
        item.setKeyValue(p)
      }
    })
  }
}

export class InParams {
  paramIn: ParamIn
  systemIn: SystemIn
  constructor () {
    this.paramIn = new  ParamIn()
    this.systemIn = new  SystemIn()
  }
  setSystemIn(param: InParamPayload) {
    this.systemIn.setParam(param)

  }
  getValue() {
    return {
      systemIn:this.systemIn.getValue()
    }
  }
  
  clear() {
    return 
  }
  
  save(val:any) {
    this.systemIn.setValue(val.systemIn)
    return 
  }
}

export let inParams = new InParams()