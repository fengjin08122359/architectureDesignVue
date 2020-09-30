import {storage} from './storage'

class ApiStore {
  constructor () {

  }
  setData (value:any) {
    storage.set('api', value)
  }
  getData () {
    return storage.get('api')
  }
}

class ComponentStore {
  constructor () {

  }
  setData (value:any, id:string='') {
    storage.set('ComponentStore'+id, value)
  }
  getData (id:string='') {
    return storage.get('ComponentStore'+id)
  }
}

class PageStore {
  constructor () {

  }
  setData (value:any, id:string='') {
    storage.set('PageStore'+id, value)
  }
  getData (id:string='') {
    return storage.get('PageStore'+id)
  }
}

class ApiListStore {
  constructor () {

  }
  setData (value:any) {
    storage.set('apiListStore', value)
  }
  getData () {
    return storage.get('apiListStore')
  }
}


class EventListStore {
  constructor () {

  }
  setData (value:any) {
    storage.set('eventListStore', value)
  }
  getData () {
    return storage.get('eventListStore')
  }
}


class CompListStore {
  constructor () {
    
  }
  setData (value:any, id:string = '') {
    if (id != '') {
      var store:any = storage.get('CompListStore')
      if (store) {
        var storeArray = store.split(',')
        storeArray = storeArray.filter((item:any) => item != id)
        storeArray.push(id)
        storage.set('CompListStore', storeArray.join(','))
      } else {
        storage.set('CompListStore', [id].join(','))
      }
      storage.set('CompListStore'+id, value)
    }
  }
  getData (id:string = '') {
    if (id == '') {
      var store:any = storage.get('CompListStore')
      if (store) {
        var storeArray = store.split(',')
        return storeArray.map((item:any) =>{
          return {
            key: item,
            value: storage.get('CompListStore'+item)
          }
        })
      }
    } else {
      return storage.get('CompListStore'+id)
    }
  }
  removeData (id:string) {
    var store:any = storage.get('CompListStore')
    if (store) {
      var storeArray = store.split(',')
      storeArray = storeArray.filter((item:any) => item != id)
      storage.set('CompListStore', storeArray.join(','))
    }
    storage.remove('CompListStore'+id)
  }
}



class ParamsStore {
  constructor () {

  }
  setData (value:any) {
    storage.set('ParamsStore', value)
  }
  getData () {
    return storage.get('ParamsStore')
  }
}

export let apiStore = new ApiStore()
export let componentStore = new ComponentStore()
export let apiListStore = new ApiListStore()
export let eventListStore = new EventListStore()
export let pageStore = new PageStore()
export let compListStore = new CompListStore()
export let paramsStore = new ParamsStore()
