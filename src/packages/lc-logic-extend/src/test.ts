import { SystemLogic } from "./logic";

export class ApiSystemLogic extends  SystemLogic{
  constructor () {
    super()
    var url = ''
    this.systemIn = {
      in1:1
    }
    this.paramIn = {
      a:2
    }
  }
  getApi () {
    this.systemOut ={
      name: 3
    }
    this.paramOut ={
      aaa: 4
    }
  }
}  