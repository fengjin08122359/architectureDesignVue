export class SystemLogic {
  systemIn:any
  paramIn:any
  systemOut:any
  paramOut:any
  constructor () {
  }
  getValue () {
    return {
      systemOut: this.systemOut,
      paramOut: this.paramOut
    }
  }
}