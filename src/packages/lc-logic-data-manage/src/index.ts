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

export let apiStore = new ApiStore()
export let componentStore = new ComponentStore()
export let apiListStore = new ApiListStore()
export let eventListStore = new EventListStore()
export let pageStore = new PageStore()
