import Vue from "vue";
import ElementUI from "element-ui";
import { VueUI } from "./ui";
import { SingleUIPayload } from "@mikefeng110808/instance";
import InputVueUIComp from "./components/InputVueUI.vue";
import ArrayVueUIComp from "./components/ArrayVueUI.vue";
import ObjectVueUIComp from "./components/ObjectVueUI.vue";
import MulSelectVueUIComp from "./components/MulSelectVueUI.vue";
import SelectVueUIComp from "./components/SelectVueUI.vue";
import NumberVueUIComp from "./components/NumberVueUI.vue";
import BooleanVueUIComp from "./components/BooleanVueUI.vue";
import SimulateVueUIComp from "./components/SimulateVueUI.vue";

Vue.use(ElementUI);
export class InputVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.setValue(this.value)
    this.renderComponent = InputVueUIComp;
  }
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = val.toString()
    } else if (typeof val == 'boolean' ) {
      this.value = val.toString()
    } else if (typeof val == 'undefined') {
      this.value = ''
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = val.join(',')
      } else {
        try {
          this.value =  JSON.stringify(val)
        } catch (error) {
          this.value = ''
        }
      }
    } else {
      this.value = ''
    }
  }
}

export class ArrayVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.changeData(this.value)
    this.renderComponent = ArrayVueUIComp;
  }
  addCol() {
    this.value.push({
      value: ""
    });
  }
  delCol(index: number) {
    this.value.splice(index, 1);
  }
  changeData(val:any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = [{
        value: val.toString()
      }]
    } else if (typeof val == 'boolean' ) {
      this.value = [{
        value: val.toString()
      }]
    } else if (typeof val == 'undefined') {
      this.value = []
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          this.value = (val || []).filter(item => item).map(item => {
            return {
              value: item
            }
          })
        }
      } else {
        this.value = []
      }
    } else {
      this.value = []
    }
    if (this.value.length == 0) {
      this.addCol();
    }
  }
  getValue(): any[] {
    return this.value.map((item: any) => item.value);
  }
  setValue(val: any) {
    
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = [{
        value: val.toString()
      }]
    } else if (typeof val == 'boolean' ) {
      this.value = [{
        value: val.toString()
      }]
    } else if (typeof val == 'undefined') {
      this.value = []
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          this.value = (val || []).filter(item => item).map(item => {
            return {
              value: item
            }
          })
        }
      } else {
        this.value = []
      }
    } else {
      this.value = []
    }
    if (this.value.length == 0) {
      this.addCol();
    }
  }
}

interface ObjectArrayPayload {
  key: any;
  value: any;
}

export class ObjectVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.props.objectArray = params.props ? params.props.objectArray || [] : [];
    this.setValue(this.value || {});
    if (this.props.objectArray.length == 0) {
      this.addCol();
    }
    this.renderComponent = ObjectVueUIComp;
  }
  addCol() {
    this.props.objectArray.push({
      key: "",
      value: ""
    });
  }
  delCol(index: number) {
    this.props.objectArray.splice(index, 1);
  }
  getValue(): any[] {
    return this.props.objectArray.reduce(
      (total: any, current: ObjectArrayPayload) => {
        total[current.key] = current.value;
        return total;
      },
      {}
    );
  }
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' || typeof val == 'boolean') {
      this.value = {}
      this.props.objectArray = []
    } else if (typeof val == 'undefined') {
      this.value = {}
      this.props.objectArray = []
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = {}
        this.props.objectArray = []
      } else {
        this.value = val || {};
        this.props.objectArray = [];
        for (let [key, value] of Object.entries(this.value)) {
          this.props.objectArray.push({
            key,
            value
          });
        }
      }
    } else {
      this.value = {}
      this.props.objectArray = []
    }
    
    if (this.props.objectArray.length == 0) {
      this.addCol();
    }
  }
}

export class MulSelectVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.props.configVisible = params.props ? params.props.configVisible || [] : [];
    this.props.optionsArray = params.props ? params.props.optionsArray || [] : [];
    this.setValue(this.value || []);
    if (this.props.optionsArray.length == 0) {
      this.addCol();
    }
    this.renderComponent = MulSelectVueUIComp;
  }
  addCol() {
    this.props.optionsArray.push({
      key: "",
      value: ""
    });
  }
  delCol(index: number) {
    this.props.optionsArray.splice(index, 1);
  }
  
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = [val.toString()]
    } else if (typeof val == 'boolean' ) {
      this.value = [val.toString()]
    } else if (typeof val == 'undefined') {
      this.value = []
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = val
      } else {
        this.value = []

      }
    } else {
      this.value = []
    }
  }

}
export class SelectVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.props.configVisible = params.props ? params.props.configVisible || [] : [];
    this.props.optionsArray = params.props ? params.props.optionsArray || [] : [];
    this.setValue(this.value || '');
    if (this.props.optionsArray.length == 0) {
      this.addCol();
    }
    this.renderComponent = SelectVueUIComp;
  }
  addCol() {
    this.props.optionsArray.push({
      key: "",
      value: ""
    });
  }
  delCol(index: number) {
    this.props.optionsArray.splice(index, 1);
  }
  
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = val.toString()
    } else if (typeof val == 'boolean' ) {
      this.value = val.toString()
    } else if (typeof val == 'undefined') {
      this.value = ''
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = ''
      } else {
        this.value = ''
      }
    } else {
      this.value = ''
    }
  }
}
export class NumberVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.setValue(this.value)
    this.renderComponent = NumberVueUIComp;
  }
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = Number(val)
    } else if (typeof val == 'boolean' ) {
      this.value = Number(val)
    } else if (typeof val == 'undefined') {
      this.value = 0
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = 0
      } else {
        this.value = 0
      }
    } else {
      this.value = 0
    }
    if (isNaN(this.value)) {
      this.value = 0
    }
  }
}

export class BooleanVueUI extends VueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    this.setValue(this.value)
    this.renderComponent = BooleanVueUIComp;
  }
  setValue(val: any) {
    if (typeof val == 'number' || typeof val == 'string' ) {
      this.value = !!val
    } else if (typeof val == 'boolean' ) {
      this.value = val
    } else if (typeof val == 'undefined') {
      this.value = false
    } else if (typeof val == 'object') {
      if (Array.isArray(val)) {
        this.value = false
      } else {
        this.value = false
      }
    } else {
      this.value = false
    }
  }
}

export class SimulateVueUI extends VueUI {
  simulateValue: any;
  error: string;
  constructor(params: SingleUIPayload) {
    super(params);
    this.simulateValue = "";
    this.error = "";
    this.simulate();
    this.setValue(this.value)
    this.renderComponent = SimulateVueUIComp;
  }
  getValue() {
    return this.value;
  }
  setValue(value: any) {
    var oldValue = this.value;
    this.value = value;
    if (oldValue != this.value) {
      this.onChange({
        val: this.value,
        oldVal: oldValue
      });
    }
    this.simulate();
  }
  simulate() {
    this.simulateValue = this.value;
    this.error = "";
    try {
      this.simulateValue = JSON.parse(this.value);
    } catch (error) {
      this.error = error;
    }
  }
  simulateValueToString(): string {
    return typeof this.simulateValue == "object"
      ? JSON.stringify(this.simulateValue)
      : this.simulateValue;
  }
}
