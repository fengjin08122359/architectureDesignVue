var uiComponents = (function (exports, Vue, ElementUI, vuePropertyDecorator, axios) {
  'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  ElementUI = ElementUI && Object.prototype.hasOwnProperty.call(ElementUI, 'default') ? ElementUI['default'] : ElementUI;
  axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;

  class DataList {
      constructor() {
          this.datas = [];
      }
      /**
       *add
       *
       * @param {Data} data
       * @memberof DataList
       */
      add(data) {
          this.datas.push(data);
      }
      /**
       *remove
       *
       * @param {string} name
       * @memberof DataList
       */
      remove(name) {
          this.datas = this.datas.filter((data) => data.name !== name);
      }
      /**
       *clear
       *
       * @memberof DataList
       */
      clear() {
          this.datas = [];
      }
      /**
       *get
       *
       * @param {string} name
       * @memberof DataList
       */
      get(name = "") {
          return this.datas.filter((data) => name === "" || data.name === name);
      }
      /**
       *get
       *
       * @param {string} name
       * @return {any} any
       * @memberof DataList
       */
      find(name = "") {
          var target = this.datas.find((data) => data.name === name);
          var empty = this.datas.find((data) => data.name === '');
          return target ? target.data : empty ? empty.data : null;
      }
  }

  class Storage {
      constructor() {
          this.storage = {};
      }
      /**
       *get
       *
       * @param {string} key
       * @memberof Storage
       */
      get(key) {
          return this.storage[key];
      }
      /**
       *set
       *
       * @param {string} key
       * @param {any} value
       * @memberof Storage
       */
      set(key, value) {
          this.storage[key] = value;
      }
      /**
       *remove
       *
       * @param {string} key
       * @memberof Storage
       */
      remove(key) {
          this.storage[key] = undefined;
      }
      /**
       *clear
       *
       * @memberof Storage
       */
      clear() {
          this.storage = {};
      }
  }

  class SingleUI {
      constructor(params) {
          this.key = params.key || ""; //键
          this.props = {
              label: "",
              required: "",
              data: [],
              disabled: false,
              show: true,
              placeholder: "",
              ...params.props,
          }; //属性列表包含其他属性
          this.valid = params.valid || []; //验证信息
          this.type = params.type || ""; // 类型
          this.value = typeof params.value == "undefined" ? "" : params.value; // 值
          this.children = params.children || []; //子节点
          this.rawData = params; //原始数据
          this.rawComponents = params.rawComponents || [];
          this.canRender = false;
      }
      /**
       *dataFind
       * @param {string | number} data
       * @memberof SingleUI
       */
      dataFind(data) {
          var result = null;
          (this.props.data || []).forEach((item) => {
              if (typeof item[data] != "undefined") {
                  result = item[data];
              }
          });
          return result;
      }
      /**
       *setValue
       * @param {any} value
       * @memberof SingleUI
       */
      setValue(value) {
          var oldValue = this.value;
          this.value = value;
          if (oldValue != this.value) {
              this.onChange({
                  val: this.value,
                  oldVal: oldValue,
              });
          }
      }
      /**
       *getKey
       * @returns string
       * @memberof SingleUI
       */
      getKey() {
          return this.key;
      }
      /**
       *getValue
       * @returns any
       * @memberof SingleUI
       */
      getValue() {
          return this.value;
      }
      /**
       *hasChange
       * @returns boolean
       * @memberof SingleUI
       */
      hasChange() {
          return !(this.getValue() == "");
      }
      /**
       *onChange
       * @param  ({val, oldVal})
       * @returns ({val, oldVal})
       * @memberof SingleUI
       */
      onChange({ val, oldVal }) {
          return { val, oldVal };
      }
      /**
       *getValid
       *
       * @returns Promise<validPayload>
       * @memberof SingleUI
       */
      getValid() {
          var result = {
              success: true,
              message: "",
              type: "success",
          };
          return new Promise((resolve) => {
              if (!this.key) {
                  resolve(result);
                  return;
              }
              if (this.props.required && !this.hasChange()) {
                  result = {
                      success: false,
                      message: this.props.label || "",
                      type: "requiredEmpty",
                  };
              }
              resolve(result);
          });
      }
      /**
       *setDisabled
       * @param  {boolean} flag
       * @returns boolean
       * @memberof SingleUI
       */
      setDisabled(flag = false) {
          this.props.disabled = flag;
          return this.props.disabled;
      }
      /**
       *getKeyValue
       * @returns SingleUIValuePayload
       * @memberof SingleUI
       */
      getKeyValue() {
          return {
              key: this.getKey(),
              value: this.getValue(),
              children: this.children.map((item) => {
                  return item.getKeyValue();
              }),
          };
      }
      /**
       *setKeyValue
       * @param {SingleUIValuePayload} ({ key, value, children })
       * @memberof SingleUI
       */
      setKeyValue({ key, value, children }) {
          if (this.getKey() != "" && this.getKey() == key) {
              this.setValue(value);
              children.forEach((item) => {
                  var target = this.children.find((target) => item.key == target.getKey());
                  if (target) {
                      target.setKeyValue(item);
                  }
              });
          }
      }
      /**
       *setKeyValue
       * @returns SingleUI[]
       * @memberof SingleUI
       */
      getAllItems() {
          return this.children
              .map((item) => {
              return item.getAllItems();
          })
              .concat(this);
      }
      /**
       *getCanRender
       * @returns boolean
       * @memberof SingleUI
       */
      getCanRender() {
          return this.canRender || this.rawComponents.length == 0;
      }
      /**
       *render
       *
       * @memberof SingleUI
       */
      render(...res) {
          return;
      }
  }

  class LifeCycle {
      constructor(lifeCycle) {
      }
      mounted() {
      }
  }

  class VueUI extends SingleUI {
      constructor(params) {
          super(params);
          this.renderComponent = undefined;
          this.lifeCycle = new LifeCycle(params.props ? params.props.lifeCycle : {});
      }
      render(render, props) {
          if (!this.getCanRender()) {
              return render.createElement();
          }
          else {
              return this.renderInstance(render, props);
          }
      }
      renderInstance(render, props) {
          return render.createElement(this.renderComponent || 'div', // 标签名称
          {
              ...render.context,
              props: { target: this, ...props }
          }, [render.vueRoot.$slots.default]);
      }
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  let InputVueUI = class InputVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], InputVueUI.prototype, "target", void 0);
  InputVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='inputVue' v-show='target.props.show'> <el-input v-model="target.value" :disabled='target.props.disabled' clearable :type='target.props.inputType'> <template slot='append' v-if='target.props.append'>{{target.props.append}}</template> <template slot="prepend" v-if='target.props.label'>{{target.props.label}}</template> </el-input> </div>` })
  ], InputVueUI);

  let ArrayVueUI = class ArrayVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], ArrayVueUI.prototype, "target", void 0);
  ArrayVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='arrayVue' v-show='target.props.show'> <div>{{target.props.label}}</div> <el-row> <el-col v-for="(item,index) in target.value" :key="index"> <el-input v-model="item.value" > <template slot="append" > <span @click="target.addCol()" class='el-icon-circle-plus-outline'></span> <span v-if="index != 0" @click="target.delCol(index)" class='el-icon-remove-outline'></span> </template> </el-input> </el-col> </el-row> </div>` })
  ], ArrayVueUI);

  let ObjectVueUI = class ObjectVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], ObjectVueUI.prototype, "target", void 0);
  ObjectVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='objectVue' v-show='target.props.show'> <div>{{target.props.label}}</div> <el-row> <el-col v-for="(item,index) in target.props.objectArray" :key="index"> <el-col :span='10'> <el-input v-model="item.key" > <template slot='prepend'>key</template> </el-input> </el-col> <el-col :span='10'> <el-input v-model="item.value" > <template slot='prepend'>value</template> </el-input> </el-col> <el-col :span='4'> <span @click="target.addCol()" class='el-icon-circle-plus-outline'></span> <span v-if="index != 0" @click="target.delCol(index)" class='el-icon-remove-outline'></span> </el-col> </el-col> </el-row> </div>` })
  ], ObjectVueUI);

  let MulSelectVueUI = class MulSelectVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], MulSelectVueUI.prototype, "target", void 0);
  MulSelectVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='mulSelectVue' v-show='target.props.show'> <div>{{target.props.label}}</div> <div v-if='target.props.configVisible'> <span>选项:</span> <el-row> <el-col v-for="(item,index) in target.props.optionsArray" :key="index"> <el-col :span='10'> <el-input v-model="item.key" > <template slot='prepend'>key</template> </el-input> </el-col> <el-col :span='10'> <el-input v-model="item.value" > <template slot='prepend'>value</template> </el-input> </el-col> <el-col :span='4'> <span @click="target.addCol()" class='el-icon-circle-plus-outline'></span> <span v-if="index != 0" @click="target.delCol(index)" class='el-icon-remove-outline'></span> </el-col> </el-col> </el-row> </div> <span v-if='target.props.configVisible'>结果:</span> <el-select v-model="target.value" multiple filterable clearable> <el-option v-for="(item, index) in target.props.optionsArray" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select></div>` })
  ], MulSelectVueUI);

  let SelectVueUI = class SelectVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], SelectVueUI.prototype, "target", void 0);
  SelectVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='selectVue' v-show='target.props.show'> <div>{{target.props.label}}</div> <div v-if='target.props.configVisible'> <span>选项:</span> <el-row > <el-col v-for="(item,index) in target.props.optionsArray" :key="index"> <el-col :span='10'> <el-input v-model="item.key" > <template slot='prepend'>key</template> </el-input> </el-col> <el-col :span='10'> <el-input v-model="item.value" > <template slot='prepend'>value</template> </el-input> </el-col> <el-col :span='4'> <span @click="target.addCol()" class='el-icon-circle-plus-outline'></span> <span v-if="index != 0" @click="target.delCol(index)" class='el-icon-remove-outline'></span> </el-col> </el-col> </el-row> </div> <span v-if='target.props.configVisible'>结果:</span> <el-select v-model="target.value" filterable clearable> <el-option v-for="(item, index) in target.props.optionsArray" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select></div>` })
  ], SelectVueUI);

  let NumberVueUI = class NumberVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], NumberVueUI.prototype, "target", void 0);
  NumberVueUI = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='numberVue' v-show='target.props.show'> <div>{{target.props.label}}</div> <el-input-number v-model="target.value" :disabled='target.props.disabled' ></el-input-number></div>` })
  ], NumberVueUI);

  let InputVueUI$1 = class InputVueUI extends vuePropertyDecorator.Vue {
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], InputVueUI$1.prototype, "target", void 0);
  InputVueUI$1 = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='BooleanVueUI' v-show='target.props.show'> <el-checkbox v-model="target.value">是否选中</el-checkbox> </div>` })
  ], InputVueUI$1);

  let SimulateVueUIComponent = class SimulateVueUIComponent extends vuePropertyDecorator.Vue {
      watchSimulate(val) {
          this.target.simulate();
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], SimulateVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.value')
  ], SimulateVueUIComponent.prototype, "watchSimulate", null);
  SimulateVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='SimulateVue' v-show='target.props.show'> <el-input type="textarea" :rows="5" placeholder="模拟框" v-model="target.value"> </el-input> <div>{{target.error}}</div> <div>{{target.simulateValueToString()}}</div> </div>` })
  ], SimulateVueUIComponent);
  var SimulateVueUIComp = SimulateVueUIComponent;

  Vue.use(ElementUI);
  class SimulateVueUI extends VueUI {
      constructor(params) {
          super(params);
          this.simulateValue = '';
          this.error = '';
          this.simulate();
          this.renderComponent = SimulateVueUIComp;
      }
      getValue() {
          return this.value;
      }
      setValue(value) {
          var oldValue = this.value;
          this.value = value;
          if (oldValue != this.value) {
              this.onChange({
                  val: this.value,
                  oldVal: oldValue,
              });
          }
          this.simulate();
      }
      simulate() {
          this.simulateValue = this.value;
          this.error = '';
          try {
              this.simulateValue = JSON.parse(this.value);
          }
          catch (error) {
              this.error = error;
          }
      }
      simulateValueToString() {
          return typeof this.simulateValue == 'object' ? JSON.stringify(this.simulateValue) : this.simulateValue;
      }
  }

  let EventListVueUIComponent = class EventListVueUIComponent extends vuePropertyDecorator.Vue {
      get options() {
          var list = this.target.apiList.getList().map(item => {
              return {
                  key: item.opt.id,
                  value: `api:${item.opt.name}`
              };
          }).concat(this.target.eventList.getList().map(item => {
              return {
                  key: item.opt.id,
                  value: `${item.opt.type}:${item.opt.name}`
              };
          }));
          return list;
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], EventListVueUIComponent.prototype, "target", void 0);
  EventListVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='eventListVue'> <div>{{target.props.label}}</div> <el-row> <el-col> <el-select v-model="target.value" filterable> <el-option v-for="(item, index) in options" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> </el-col> </el-row> </div>` })
  ], EventListVueUIComponent);
  var EventListVueUIComponent$1 = EventListVueUIComponent;

  let ContainerVueUIComponent = class ContainerVueUIComponent extends vuePropertyDecorator.Vue {
      mounted() {
          console.log(this.target.ui);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], ContainerVueUIComponent.prototype, "target", void 0);
  ContainerVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='ContainerVue'> <slot></slot> </div>` })
  ], ContainerVueUIComponent);
  var ContainerVueUIComponent$1 = ContainerVueUIComponent;

  let CardContainerVueUIComponent = class CardContainerVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.tabs = [];
          this.activeTab = '';
      }
      mounted() {
          console.log(this.target.ui);
          console.log(this.target.ui.selfProp.opt);
          this.resetTabs();
      }
      resetTabs(val = this.target.ui.selfProp.opt) {
          this.tabs = (val.tab).map((item, index) => {
              return {
                  key: index.toString(),
                  value: item.toString()
              };
          });
          this.target.ui.activeCard = this.target.ui.activeCard || this.tabs[0].key || '';
      }
      watchTab(val) {
          this.resetTabs(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], CardContainerVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], CardContainerVueUIComponent.prototype, "watchTab", null);
  CardContainerVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='CardContainerVue'> <el-tabs v-model="target.ui.activeCard" > <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.value" :name="tab.key"> <slot></slot> </el-tab-pane> </el-tabs> </div>` })
  ], CardContainerVueUIComponent);
  var CardContainerVueUIComponent$1 = CardContainerVueUIComponent;

  let DialogContainerVueUIComponent = class DialogContainerVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.visible = false;
          this.title = '';
      }
      mounted() {
          console.log(this.target.ui);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], DialogContainerVueUIComponent.prototype, "target", void 0);
  DialogContainerVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='DialogContainerVue'> <div class='DialogContainerVue-block' v-if='!target.isCompiler'> <slot></slot> </div> <el-dialog :visible.sync='visible' :append-to-body="true" :title="title" v-if='target.isCompiler'> <slot></slot> </el-dialog> </div>` })
  ], DialogContainerVueUIComponent);
  var DialogContainerVueUIComponent$1 = DialogContainerVueUIComponent;

  let ButtonVueUIComponent = class ButtonVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.label = '';
      }
      mounted() {
          console.log(this.target.ui);
          console.log(this.target.ui.selfProp.opt);
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.label = val.label || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], ButtonVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], ButtonVueUIComponent.prototype, "watchTab", null);
  ButtonVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='ButtonVue'> <el-button >{{label}}</el-button> </div>` })
  ], ButtonVueUIComponent);
  var ButtonVueUIComponent$1 = ButtonVueUIComponent;

  let InputVueUIComponent = class InputVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.prepend = '';
      }
      mounted() {
          console.log(this.target.ui);
          console.log(this.target.ui.selfProp.opt);
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.value = val.value || '';
          this.prepend = val.prepend || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], InputVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], InputVueUIComponent.prototype, "watchTab", null);
  InputVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='InputVue'> <el-input v-model='value'> <template slot='prepend' v-if="prepend"> {{prepend}} </template> </el-input> </div>` })
  ], InputVueUIComponent);
  var InputVueUIComponent$1 = InputVueUIComponent;

  let NumberVueUIComponent = class NumberVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.label = '';
      }
      mounted() {
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.value = val.value || '';
          this.label = val.label || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], NumberVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], NumberVueUIComponent.prototype, "watchTab", null);
  NumberVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='NumberVue'> <el-row> <el-col :span='label ? 4 : 0'>{{label}}</el-col> <el-col :span='label ? 20 : 24'> <el-input-number v-model="value" :label='label'></el-input-number> </el-col> </el-row> </div>` })
  ], NumberVueUIComponent);
  var NumberVueUIComponent$1 = NumberVueUIComponent;

  let TimePickerVueUIComponent = class TimePickerVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.type = 'datetime';
          this.placeholder = '';
      }
      mounted() {
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.value = val.value || '';
          this.type = val.type || 'datetime';
          this.placeholder = val.placeholder || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], TimePickerVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], TimePickerVueUIComponent.prototype, "watchTab", null);
  TimePickerVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='TimePickerVue'> <el-date-picker v-model="value" :type="type" :placeholder="placeholder"> </el-date-picker> </div>` })
  ], TimePickerVueUIComponent);
  var TimePickerVueUIComponent$1 = TimePickerVueUIComponent;

  let TimeGroupVueUIComponent = class TimeGroupVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.year = '2020';
          this.report = 1;
      }
      mounted() {
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.year = val.year || '2020';
          this.report = val.report || 1;
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], TimeGroupVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], TimeGroupVueUIComponent.prototype, "watchTab", null);
  TimeGroupVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='TimeGroupVue'> <el-select v-model="year" filterable> <el-option v-for="(item, index) in target.year" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> <el-select v-model="report" filterable> <el-option v-for="(item, index) in target.report" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> </div>` })
  ], TimeGroupVueUIComponent);
  var TimeGroupVueUIComponent$1 = TimeGroupVueUIComponent;

  let SelectVueUIComponent = class SelectVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.optionsArray = [];
      }
      mounted() {
          console.log(this.target.ui.selfProp);
          this.resetSelfProp();
      }
      resetSelfProp(val = this.target.ui.selfProp) {
          this.value = val.opt.value || '';
          this.optionsArray = val.params.find(item => item.key == 'value').props.optionsArray;
      }
      watchTab(val) {
          this.resetSelfProp(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], SelectVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp', { deep: true })
  ], SelectVueUIComponent.prototype, "watchTab", null);
  SelectVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='SelectVue'> <el-select v-model="value" filterable> <el-option v-for="(item, index) in optionsArray" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> </div>` })
  ], SelectVueUIComponent);
  var SelectVueUIComponent$1 = SelectVueUIComponent;

  let CheckBoxVueUIComponent = class CheckBoxVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.label = '';
          this.value = '';
      }
      mounted() {
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.value = val.value || '';
          this.label = val.label || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], CheckBoxVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], CheckBoxVueUIComponent.prototype, "watchTab", null);
  CheckBoxVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='CheckBoxVueUI'> <el-checkbox v-model="value">{{label}}</el-checkbox> </div>` })
  ], CheckBoxVueUIComponent);
  var CheckBoxVueUIComponent$1 = CheckBoxVueUIComponent;

  let CheckBoxGroupVueUIComponent = class CheckBoxGroupVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = [];
          this.optionsArray = [];
      }
      mounted() {
          console.log(this.target.ui.selfProp);
          this.resetSelfProp();
      }
      resetSelfProp(val = this.target.ui.selfProp) {
          this.value = val.opt.value || [];
          this.optionsArray = val.params.find(item => item.key == 'value').props.optionsArray;
      }
      watchTab(val) {
          this.resetSelfProp(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], CheckBoxGroupVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp', { deep: true })
  ], CheckBoxGroupVueUIComponent.prototype, "watchTab", null);
  CheckBoxGroupVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='CheckBoxGroupVueUI'> <el-checkbox-group v-model="value"> <el-checkbox v-for="(item, index) in optionsArray" :key='index' :label="item.key"> {{item.value}} </el-checkbox> </el-checkbox-group> </div>` })
  ], CheckBoxGroupVueUIComponent);
  var CheckBoxGroupVueUIComponent$1 = CheckBoxGroupVueUIComponent;

  let RadioVueUIComponent = class RadioVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.optionsArray = [];
      }
      mounted() {
          console.log(this.target.ui.selfProp);
          this.resetSelfProp();
      }
      resetSelfProp(val = this.target.ui.selfProp) {
          this.value = val.opt.value || '';
          this.optionsArray = val.params.find(item => item.key == 'value').props.optionsArray;
      }
      watchTab(val) {
          this.resetSelfProp(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], RadioVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp', { deep: true })
  ], RadioVueUIComponent.prototype, "watchTab", null);
  RadioVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='RadioVueUI'> <el-radio-group v-model="value" > <el-radio v-for="(item, index) in optionsArray" :label='item.key' :key="index"> {{item.value}} </el-radio> </el-radio-group> </div>` })
  ], RadioVueUIComponent);
  var RadioVueUIComponent$1 = RadioVueUIComponent;

  let MulSelectVueUIComponent = class MulSelectVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = [];
          this.optionsArray = [];
      }
      mounted() {
          console.log(this.target.ui.selfProp);
          this.resetSelfProp();
      }
      resetSelfProp(val = this.target.ui.selfProp) {
          this.value = val.opt.value || [];
          this.optionsArray = val.params.find(item => item.key == 'value').props.optionsArray;
      }
      watchTab(val) {
          this.resetSelfProp(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], MulSelectVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp', { deep: true })
  ], MulSelectVueUIComponent.prototype, "watchTab", null);
  MulSelectVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='MulSelectVueUI'> <el-select v-model="value" multiple filterable clearable> <el-option v-for="(item, index) in optionsArray" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> </div>` })
  ], MulSelectVueUIComponent);
  var MulSelectVueUIComponent$1 = MulSelectVueUIComponent;

  let IframeVueUIComponent = class IframeVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.src = '';
      }
      mounted() {
          console.log(this.target.ui);
          console.log(this.target.ui.selfProp.opt);
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.src = val.src || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], IframeVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], IframeVueUIComponent.prototype, "watchTab", null);
  IframeVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='IframeVueUI'> <div class='IframeVueUI-block' v-if='!target.isCompiler'></div> <iframe v-if='target.isCompiler' :src="src" frameborder="0"></iframe> </div>` })
  ], IframeVueUIComponent);
  var IframeVueUIComponent$1 = IframeVueUIComponent;

  let TabelColSlot = class TabelColSlot extends vuePropertyDecorator.Vue {
      render(h, data) {
          return this.tableCol.render(h, data, this.row, this.propkey);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], TabelColSlot.prototype, "tableCol", void 0);
  __decorate([
      vuePropertyDecorator.Prop()
  ], TabelColSlot.prototype, "row", void 0);
  __decorate([
      vuePropertyDecorator.Prop()
  ], TabelColSlot.prototype, "propkey", void 0);
  TabelColSlot = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='TableVueUI'> <el-table class="list-table" size="mini" :data="target.mergetList" v-loading="target.loading" fit stripe :show-header="target.mergeShowHeader" style="width: 99.9%" > <template v-for="(item, index) in target.mergeCols"> <el-table-column :key="index" :type="item.type" :label="item.label" :prop="item.prop" :sortable="item.sortable" :class-name="item.className" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed" :show-overflow-tooltip="item.showOverflowTooltip" > <template slot-scope="scope"> <TabelColSlot :tableCol="item" :propkey="target.getTableKey(scope, item)" :row="target.getTableRow(scope, item)"></TabelColSlot> </template> </el-table-column> </template> </el-table> </div>` })
  ], TabelColSlot);
  let TableVueUIComponent = class TableVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.value = '';
          this.prepend = '';
      }
      mounted() {
          console.log(this.target);
          this.resetOpt();
      }
      resetOpt(val = this.target.ui.selfProp.opt) {
          this.value = val.value || '';
          this.prepend = val.prepend || '';
      }
      watchTab(val) {
          this.resetOpt(val);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], TableVueUIComponent.prototype, "target", void 0);
  __decorate([
      vuePropertyDecorator.Watch('target.ui.selfProp.opt')
  ], TableVueUIComponent.prototype, "watchTab", null);
  TableVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ components: { TabelColSlot } })
  ], TableVueUIComponent);
  var TableVueUIComponent$1 = TableVueUIComponent;

  let TableDataConfigVueUIComponent = class TableDataConfigVueUIComponent extends vuePropertyDecorator.Vue {
      constructor() {
          super(...arguments);
          this.activeName = 'column';
          this.typeArray = [{
                  key: '',
                  value: '默认'
              }, {
                  key: 'selection',
                  value: 'selection'
              }, {
                  key: 'index',
                  value: 'index'
              }, {
                  key: 'expand',
                  value: 'expand'
              },];
      }
      mounted() {
          console.log(this.target);
      }
  };
  __decorate([
      vuePropertyDecorator.Prop()
  ], TableDataConfigVueUIComponent.prototype, "target", void 0);
  TableDataConfigVueUIComponent = __decorate([
      vuePropertyDecorator.Component({ template: `<div class='TableVueUI'> <div></div> <el-tabs v-model="activeName"> <el-tab-pane label="column 管理" name="column"> <el-row v-for="(item, index) in target.cols" :key="index"> <el-col> type: <el-select v-model="item.type" filterable> <el-option v-for="(item, index) in typeArray" :value="item.key" :label='item.value' :key="index"> </el-option> </el-select> </el-col> <el-col> <el-input v-model="item.label"> <template slot='prepend'> label </template> </el-input> </el-col> <el-col> <el-input v-model="item.prop"> <template slot='prepend'> prop </template> </el-input> </el-col> <el-col> <el-checkbox v-model="item.sortable">sortable</el-checkbox> </el-col> <el-col> <el-input v-model="item.className"> <template slot='prepend'> className </template> </el-input> </el-col> <el-col> <el-input v-model="item.width"> <template slot='prepend'> width </template> </el-input> </el-col> <el-col> <el-input v-model="item.minWidth"> <template slot='prepend'> minWidth </template> </el-input> </el-col> <el-col> <el-checkbox v-model="item.fixed">fixed</el-checkbox> </el-col> <el-col> <el-checkbox v-model="item.showOverflowTooltip">showOverflowTooltip</el-checkbox> </el-col> <span @click="target.addCol()" class='el-icon-circle-plus-outline'></span> <span v-if="index != 0" @click="target.delCol(index)" class='el-icon-remove-outline'></span> </el-row> </el-tab-pane> <el-tab-pane label="tableData 管理" name="tableData"> <slot></slot> </el-tab-pane> </el-tabs> </div>` })
  ], TableDataConfigVueUIComponent);
  var TableDataConfigVueUIComponent$1 = TableDataConfigVueUIComponent;

  /**
   * Returns an array of HTML elements located under the point specified by x, y.
   * If the native elementsFromPoint function does not exist, a polyfill will be used.
   *
   * @param  {number} x : X position
   * @param  {number} y : Y position
   * @return {array} : Array of the elements under the point (x, y)
   */
  let setPx = (num, pre = "px") => {
      if (typeof num == "number") {
          return num + pre;
      }
      else {
          return num;
      }
  };
  let convertPx = (str) => {
      if (typeof str == "number") {
          return str;
      }
      else if (typeof str == "undefined") {
          return 0;
      }
      else if (str == 'auto') {
          return 0;
      }
      else if (str.indexOf('px') > -1) {
          return parseFloat(str);
      }
      else if (str.indexOf('%') > -1) {
          return str;
      }
      else if (!isNaN(parseFloat(str))) {
          return parseFloat(str);
      }
      else {
          return str;
      }
  };
  let gennerateUUID = () => {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
  };
  let styleOptionsStr = "alignContent,alignItems,alignSelf,alignmentBaseline,all,animation,animationDelay,animationDirection,animationDuration,animationFillMode,animationIterationCount,animationName,animationPlayState,animationTimingFunction,backdropFilter,backfaceVisibility,background,backgroundAttachment,backgroundBlendMode,backgroundClip,backgroundColor,backgroundImage,backgroundOrigin,backgroundPosition,backgroundPositionX,backgroundPositionY,backgroundRepeat,backgroundRepeatX,backgroundRepeatY,backgroundSize,baselineShift,blockSize,border,borderBlockEnd,borderBlockEndColor,borderBlockEndStyle,borderBlockEndWidth,borderBlockStart,borderBlockStartColor,borderBlockStartStyle,borderBlockStartWidth,borderBottom,borderBottomColor,borderBottomLeftRadius,borderBottomRightRadius,borderBottomStyle,borderBottomWidth,borderCollapse,borderColor,borderImage,borderImageOutset,borderImageRepeat,borderImageSlice,borderImageSource,borderImageWidth,borderInlineEnd,borderInlineEndColor,borderInlineEndStyle,borderInlineEndWidth,borderInlineStart,borderInlineStartColor,borderInlineStartStyle,borderInlineStartWidth,borderLeft,borderLeftColor,borderLeftStyle,borderLeftWidth,borderRadius,borderRight,borderRightColor,borderRightStyle,borderRightWidth,borderSpacing,borderStyle,borderTop,borderTopColor,borderTopLeftRadius,borderTopRightRadius,borderTopStyle,borderTopWidth,borderWidth,bottom,boxShadow,boxSizing,breakAfter,breakBefore,breakInside,bufferedRendering,captionSide,caretColor,clear,clip,clipPath,clipRule,color,colorInterpolation,colorInterpolationFilters,colorRendering,colorScheme,columnCount,columnFill,columnGap,columnRule,columnRuleColor,columnRuleStyle,columnRuleWidth,columnSpan,columnWidth,columns,contain,containIntrinsicSize,content,counterIncrement,counterReset,cursor,cx,cy,d,direction,display,dominantBaseline,emptyCells,fill,fillOpacity,fillRule,filter,flex,flexBasis,flexDirection,flexFlow,flexGrow,flexShrink,flexWrap,float,floodColor,floodOpacity,font,fontDisplay,fontFamily,fontFeatureSettings,fontKerning,fontOpticalSizing,fontSize,fontStretch,fontStyle,fontVariant,fontVariantCaps,fontVariantEastAsian,fontVariantLigatures,fontVariantNumeric,fontVariationSettings,fontWeight,gap,grid,gridArea,gridAutoColumns,gridAutoFlow,gridAutoRows,gridColumn,gridColumnEnd,gridColumnGap,gridColumnStart,gridGap,gridRow,gridRowEnd,gridRowGap,gridRowStart,gridTemplate,gridTemplateAreas,gridTemplateColumns,gridTemplateRows,height,hyphens,imageOrientation,imageRendering,inlineSize,isolation,justifyContent,justifyItems,justifySelf,left,letterSpacing,lightingColor,lineBreak,lineHeight,listStyle,listStyleImage,listStylePosition,listStyleType,margin,marginBlockEnd,marginBlockStart,marginBottom,marginInlineEnd,marginInlineStart,marginLeft,marginRight,marginTop,marker,markerEnd,markerMid,markerStart,mask,maskType,maxBlockSize,maxHeight,maxInlineSize,maxWidth,maxZoom,minBlockSize,minHeight,minInlineSize,minWidth,minZoom,mixBlendMode,objectFit,objectPosition,offset,offsetDistance,offsetPath,offsetRotate,opacity,order,orientation,orphans,outline,outlineColor,outlineOffset,outlineStyle,outlineWidth,overflow,overflowAnchor,overflowWrap,overflowX,overflowY,overscrollBehavior,overscrollBehaviorBlock,overscrollBehaviorInline,overscrollBehaviorX,overscrollBehaviorY,padding,paddingBlockEnd,paddingBlockStart,paddingBottom,paddingInlineEnd,paddingInlineStart,paddingLeft,paddingRight,paddingTop,pageBreakAfter,pageBreakBefore,pageBreakInside,paintOrder,perspective,perspectiveOrigin,placeContent,placeItems,placeSelf,pointerEvents,position,quotes,r,resize,right,rowGap,rx,ry,scrollBehavior,scrollMargin,scrollMarginBlock,scrollMarginBlockEnd,scrollMarginBlockStart,scrollMarginBottom,scrollMarginInline,scrollMarginInlineEnd,scrollMarginInlineStart,scrollMarginLeft,scrollMarginRight,scrollMarginTop,scrollPadding,scrollPaddingBlock,scrollPaddingBlockEnd,scrollPaddingBlockStart,scrollPaddingBottom,scrollPaddingInline,scrollPaddingInlineEnd,scrollPaddingInlineStart,scrollPaddingLeft,scrollPaddingRight,scrollPaddingTop,scrollSnapAlign,scrollSnapStop,scrollSnapType,shapeImageThreshold,shapeMargin,shapeOutside,shapeRendering,size,speak,src,stopColor,stopOpacity,stroke,strokeDasharray,strokeDashoffset,strokeLinecap,strokeLinejoin,strokeMiterlimit,strokeOpacity,strokeWidth,tabSize,tableLayout,textAlign,textAlignLast,textAnchor,textCombineUpright,textDecoration,textDecorationColor,textDecorationLine,textDecorationSkipInk,textDecorationStyle,textIndent,textOrientation,textOverflow,textRendering,textShadow,textSizeAdjust,textTransform,textUnderlinePosition,top,touchAction,transform,transformBox,transformOrigin,transformStyle,transition,transitionDelay,transitionDuration,transitionProperty,transitionTimingFunction,unicodeBidi,unicodeRange,userSelect,userZoom,vectorEffect,verticalAlign,visibility,webkitAlignContent,webkitAlignItems,webkitAlignSelf,webkitAnimation,webkitAnimationDelay,webkitAnimationDirection,webkitAnimationDuration,webkitAnimationFillMode,webkitAnimationIterationCount,webkitAnimationName,webkitAnimationPlayState,webkitAnimationTimingFunction,webkitAppRegion,webkitAppearance,webkitBackfaceVisibility,webkitBackgroundClip,webkitBackgroundOrigin,webkitBackgroundSize,webkitBorderAfter,webkitBorderAfterColor,webkitBorderAfterStyle,webkitBorderAfterWidth,webkitBorderBefore,webkitBorderBeforeColor,webkitBorderBeforeStyle,webkitBorderBeforeWidth,webkitBorderBottomLeftRadius,webkitBorderBottomRightRadius,webkitBorderEnd,webkitBorderEndColor,webkitBorderEndStyle,webkitBorderEndWidth,webkitBorderHorizontalSpacing,webkitBorderImage,webkitBorderRadius,webkitBorderStart,webkitBorderStartColor,webkitBorderStartStyle,webkitBorderStartWidth,webkitBorderTopLeftRadius,webkitBorderTopRightRadius,webkitBorderVerticalSpacing,webkitBoxAlign,webkitBoxDecorationBreak,webkitBoxDirection,webkitBoxFlex,webkitBoxOrdinalGroup,webkitBoxOrient,webkitBoxPack,webkitBoxReflect,webkitBoxShadow,webkitBoxSizing,webkitClipPath,webkitColumnBreakAfter,webkitColumnBreakBefore,webkitColumnBreakInside,webkitColumnCount,webkitColumnGap,webkitColumnRule,webkitColumnRuleColor,webkitColumnRuleStyle,webkitColumnRuleWidth,webkitColumnSpan,webkitColumnWidth,webkitColumns,webkitFilter,webkitFlex,webkitFlexBasis,webkitFlexDirection,webkitFlexFlow,webkitFlexGrow,webkitFlexShrink,webkitFlexWrap,webkitFontFeatureSettings,webkitFontSizeDelta,webkitFontSmoothing,webkitHighlight,webkitHyphenateCharacter,webkitJustifyContent,webkitLineBreak,webkitLineClamp,webkitLocale,webkitLogicalHeight,webkitLogicalWidth,webkitMarginAfter,webkitMarginBefore,webkitMarginEnd,webkitMarginStart,webkitMask,webkitMaskBoxImage,webkitMaskBoxImageOutset,webkitMaskBoxImageRepeat,webkitMaskBoxImageSlice,webkitMaskBoxImageSource,webkitMaskBoxImageWidth,webkitMaskClip,webkitMaskComposite,webkitMaskImage,webkitMaskOrigin,webkitMaskPosition,webkitMaskPositionX,webkitMaskPositionY,webkitMaskRepeat,webkitMaskRepeatX,webkitMaskRepeatY,webkitMaskSize,webkitMaxLogicalHeight,webkitMaxLogicalWidth,webkitMinLogicalHeight,webkitMinLogicalWidth,webkitOpacity,webkitOrder,webkitPaddingAfter,webkitPaddingBefore,webkitPaddingEnd,webkitPaddingStart,webkitPerspective,webkitPerspectiveOrigin,webkitPerspectiveOriginX,webkitPerspectiveOriginY,webkitPrintColorAdjust,webkitRtlOrdering,webkitRubyPosition,webkitShapeImageThreshold,webkitShapeMargin,webkitShapeOutside,webkitTapHighlightColor,webkitTextCombine,webkitTextDecorationsInEffect,webkitTextEmphasis,webkitTextEmphasisColor,webkitTextEmphasisPosition,webkitTextEmphasisStyle,webkitTextFillColor,webkitTextOrientation,webkitTextSecurity,webkitTextSizeAdjust,webkitTextStroke,webkitTextStrokeColor,webkitTextStrokeWidth,webkitTransform,webkitTransformOrigin,webkitTransformOriginX,webkitTransformOriginY,webkitTransformOriginZ,webkitTransformStyle,webkitTransition,webkitTransitionDelay,webkitTransitionDuration,webkitTransitionProperty,webkitTransitionTimingFunction,webkitUserDrag,webkitUserModify,webkitUserSelect,webkitWritingMode,whiteSpace,widows,width,willChange,wordBreak,wordSpacing,wordWrap,writingMode,x,y,zIndex,zoom";
  let styleOptions = styleOptionsStr.split(',');

  class Api {
      constructor(opt) {
          this.id = gennerateUUID();
          this.opt = opt;
          this.opt.id = opt.id || this.id;
      }
      fetch() {
      }
      setValue(val) {
          this.opt.id = val.id || this.opt.id;
          this.opt.config = val.config || 'get';
          this.opt.name = val.name || '';
          this.opt.getParam = val.getParam || {};
          this.opt.postParam = val.postParam || {};
          // this.uiList.setValue(val)
      }
  }
  class ApiList {
      constructor() {
          this.list = new DataList();
      }
      add(apiData) {
          var api = new Api(apiData);
          this.list.add({
              name: api.id || '',
              data: api
          });
          return api;
      }
      remove(id) {
          this.list.remove(id);
      }
      getList() {
          return this.list.get('').map(item => item.data);
      }
      clear() {
          this.list.clear();
      }
      save(val) {
      }
  }

  class Event {
      constructor(opt) {
          this.id = opt.id || gennerateUUID();
          this.opt = opt;
      }
      fetch() { }
      setValue(val) {
          this.opt.id = val.id || this.opt.id;
          this.opt.type = val.type || 'EventDispatcher';
          this.opt.name = val.name || '';
      }
  }
  class EventList {
      constructor() {
          this.list = new DataList();
      }
      add(apiData) {
          var event = new Event(apiData);
          this.list.add({
              name: event.id,
              data: event
          });
          return event;
      }
      remove(id) {
          this.list.remove(id);
      }
      getList() {
          return this.list.get('').map(item => item.data);
      }
      clear() {
          this.list.clear();
      }
      save() {
      }
  }

  let apiList = new ApiList();
  let eventList = new EventList();

  class InEventBind {
      constructor(opt) {
          this.opt = opt;
          this.id = gennerateUUID();
      }
      setValue(val) {
          this.opt.tid = val.tid || '';
      }
      getValue() {
          return this.opt;
      }
  }
  class OutEventBind {
      constructor(opt) {
          this.opt = opt;
          this.id = gennerateUUID();
      }
      setValue(val) {
          this.opt.tid = val.tid || '';
          this.opt.key = val.key || '';
      }
      getValue() {
          return this.opt;
      }
  }
  class EventBind {
      constructor() {
          this.inList = new DataList();
          this.outList = new DataList();
      }
      addIn(data) {
          var event = new InEventBind(data || {
              tid: ''
          });
          this.inList.add({
              name: event.id,
              data: event
          });
          return event;
      }
      addOut(data) {
          var event = new OutEventBind(data || {
              tid: '',
              key: 'click'
          });
          this.outList.add({
              name: event.id,
              data: event
          });
          return event;
      }
      removeIn(id) {
          this.inList.remove(id);
      }
      removeOut(id) {
          this.outList.remove(id);
      }
      getInList() {
          return this.inList.get('').map(item => item.data);
      }
      getOutList() {
          return this.outList.get('').map(item => item.data);
      }
      clearIn() {
          this.inList.clear();
      }
      clearOut() {
          this.outList.clear();
      }
      save() {
      }
      getValue() {
          return {
              inValue: this.getInList().map(item => item.getValue()),
              outValue: this.getOutList().map(item => item.getValue())
          };
      }
  }

  class Style {
      constructor() {
          this.changed = 0;
      }
      setKeyValue(key, value) {
          this[key] = value;
          this.changed++;
      }
      getValue() {
          return Object.assign({}, this);
      }
      setValue(val) {
          for (let [key, value] of Object.entries(val)) {
              try {
                  this.setKeyValue(key, value);
              }
              catch (error) { }
          }
      }
      clear() {
          for (let key of Object.keys(this)) {
              if (styleOptions.find((item) => item == key)) {
                  delete this[key];
              }
          }
      }
      move(x, y) {
          var left = convertPx(this.target.style.left) + x;
          var top = convertPx(this.target.style.top) + y;
          this.target.style.setKeyValue('left', setPx(left));
          this.target.style.setKeyValue('top', setPx(top));
      }
  }

  class UI {
      constructor() {
          this.eventBind = new EventBind();
          this.style = new Style();
          this.selfProp = new SelfProp();
      }
      setSelfProp(selfProp) {
          this.selfProp = selfProp;
      }
      getValue() {
          return {
              eventBind: {
                  value: this.eventBind.getValue()
              },
              selfProp: {
                  value: this.selfProp.getValue()
              },
              style: {
                  value: this.style.getValue()
              }
          };
      }
  }
  class SelfProp {
      constructor() {
          this.opt = {};
          this.params = [];
      }
      setParam(data = []) {
          this.params = data;
      }
      getValue() {
          return this.opt;
      }
      setValue(value) {
          this.opt = value || {};
      }
  }

  class UIInstance {
      constructor() {
          this.moduleId = gennerateUUID();
          this.children = [];
          this.target = new UI();
          this.canDrag = true;
      }
      canDragFilter() {
          return this.canDrag && (this.target.style.position && (this.target.style.position == 'absolute' || this.target.style.position == 'fixed'));
      }
      setTarget(target) {
          this.target = target;
      }
      combi(target) {
          var module = new UIInstance();
          module.setTarget(target);
          this.children.push(module);
          return module;
      }
      unCombi(moduleId) {
          var module = this.findContainUI(this, moduleId);
          console.log(module);
          if (module) {
              module.children = module.children.filter(t => t.moduleId != moduleId);
          }
      }
      findContainUI(tree, moduleId) {
          if (tree.children.find(item => item.moduleId == moduleId)) {
              return tree;
          }
          else if (tree.children.length > 0) {
              var target = null;
              tree.children.forEach(item => {
                  target = this.findContainUI(item, moduleId) || target;
              });
              return target;
          }
          else {
              return null;
          }
      }
      move(x, y) {
          this.target.style.move(x, y);
      }
      getValue() {
          return {
              moduleId: this.moduleId,
              canDrag: this.canDrag,
              target: this.target.getValue(),
              children: this.children.map(item => item.getValue())
          };
      }
      getChildren() {
          return this.children;
      }
  }

  class ModuleUI extends UI {
      constructor() {
          super();
          this.id = gennerateUUID();
          this.moduleIdList = [];
          this.editable = true;
          this.insertable = true;
          this.selfProp = new ModuleSelfProp();
      }
      getValue() {
          return {
              typeId: this.typeId,
              id: this.id,
              insertable: this.insertable,
              editable: this.editable,
              moduleIdList: this.moduleIdList,
              eventBind: {
                  value: this.eventBind.getValue()
              },
              selfProp: {
                  value: this.selfProp.getValue()
              },
              style: {
                  value: this.style.getValue()
              }
          };
      }
      setDom(dom) {
          this.dom = dom;
      }
      setId(id) {
          this.id = id || gennerateUUID();
      }
      filterChildren(instance) {
          return this.moduleIdList.find(item => item == instance.moduleId);
      }
      addModuleId(moduleId) {
          this.moduleIdList.push(moduleId);
      }
      removeModuleId(moduleId) {
          this.moduleIdList = this.moduleIdList.filter(item => item != moduleId);
      }
  }
  class ModuleSelfProp extends SelfProp {
      constructor() {
          super();
      }
      getStyle() {
          return {
              width: 100,
              height: 100
          };
      }
      getRelativeStyle() {
          return {
              position: 'relative',
              top: 'auto',
              bottom: 'auto',
              right: 'auto',
              left: 'auto',
          };
      }
  }

  class ContainerUI extends ModuleUI {
      constructor() {
          super();
          this.insertable = true;
      }
  }

  class ComponentSingleUI extends ModuleUI {
      constructor() {
          super();
          this.insertable = false;
      }
  }
  class ComponentMultipleUI extends ComponentSingleUI {
      constructor() {
          super();
          this.insertable = false;
      }
  }

  class ModuleInstance extends UIInstance {
      constructor() {
          super();
          this.moduleId = gennerateUUID();
          this.children = [];
          this.target = new ModuleUI();
          this.canDrag = true;
      }
      setTarget(target) {
          this.target = target;
      }
      combi(target) {
          var module = new ModuleInstance();
          module.setTarget(target);
          this.children.push(module);
          this.target.addModuleId(module.moduleId);
          return module;
      }
      unCombi(moduleId) {
          var module = this.findContainUI(this, moduleId);
          console.log(module);
          if (module) {
              module.target.removeModuleId(moduleId);
              module.children = module.children.filter(t => t.moduleId != moduleId);
          }
      }
      findContainUI(tree, moduleId) {
          if (tree.children.find(item => item.moduleId == moduleId)) {
              return tree;
          }
          else if (tree.children.length > 0) {
              var target = null;
              tree.children.forEach(item => {
                  target = this.findContainUI(item, moduleId) || target;
              });
              return target;
          }
          else {
              return null;
          }
      }
      resetRelativeStyle() {
          var style = this.target.selfProp.getRelativeStyle();
          for (let [key, value] of Object.entries(style)) {
              this.target.style[key] = value;
          }
      }
      getChildren() {
          return this.children.filter(item => this.target.filterChildren(item));
      }
      setValue(data) {
      }
  }

  class ContainerSelfProp extends ModuleSelfProp {
      constructor() {
          super();
      }
      getStyle() {
          return {
              width: "100%",
              height: "200px",
              background: '',
              display: 'block',
              position: 'relative',
          };
      }
  }
  class BasicSelfProp extends ModuleSelfProp {
      constructor() {
          super();
      }
      getStyle() {
          return {
              width: "100%",
              height: "70px",
              background: '',
              display: 'inline-block'
          };
      }
  }
  class MergeSelfProp extends ModuleSelfProp {
      constructor() {
          super();
      }
      getStyle() {
          return {
              width: "100%",
              height: "500px",
              background: '',
              display: 'inline-block'
          };
      }
  }
  class CardContainerSelfProp extends ContainerSelfProp {
      constructor() {
          super();
          this.opt = {
              tab: ['选项1']
          };
      }
  }
  class CardContainerUI extends ContainerUI {
      constructor() {
          super();
          this.activeCard = '';
      }
      filterChildren(instance) {
          return this.moduleIdList.find(item => item.moduleId == instance.moduleId && this.activeCard == item.tab);
      }
      addModuleId(moduleId) {
          this.moduleIdList.push({
              moduleId,
              tab: this.activeCard
          });
      }
      removeModuleId(moduleId) {
          this.moduleIdList = this.moduleIdList.filter(item => item.moduleId != moduleId);
      }
  }
  class ButtonSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              label: '提取数据'
          };
      }
  }
  class InputSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: '测试',
              prepend: ''
          };
      }
  }
  class NumberSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: 0,
              label: ''
          };
      }
  }
  class TimePickerSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: 0,
              placeholder: '',
              type: 'datetime'
          };
      }
  }
  class TimeGroupSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              year: 2020,
              report: 1
          };
      }
  }
  class SelectSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: ''
          };
      }
  }
  class CheckboxSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: '',
              label: 'test'
          };
      }
  }
  class CheckBoxGroupSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: []
          };
      }
  }
  class RadioSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: ''
          };
      }
  }
  class MulSelectSelfProp extends BasicSelfProp {
      constructor() {
          super();
          this.opt = {
              value: ''
          };
      }
  }
  class IframeSelfProp extends MergeSelfProp {
      constructor() {
          super();
          this.opt = {
              src: ''
          };
      }
  }

  let container = [{
          id: '1',
          name: "基本容器",
          selfProp: ContainerSelfProp,
          UI: ContainerUI,
          params: [{
                  type: 'input',
                  key: 'input',
                  props: { label: 'input' },
                  value: ''
              }, {
                  type: 'array',
                  key: 'array',
                  props: { label: 'array' },
                  value: []
              }, {
                  type: 'object',
                  key: 'object',
                  props: { label: 'object' },
                  value: {}
              }, {
                  type: 'number',
                  key: 'number',
                  props: { label: 'number' },
                  value: 0
              }, {
                  type: 'select',
                  key: 'select',
                  props: { label: 'select' },
                  value: ''
              }, {
                  type: 'mulSelect',
                  key: 'mulSelect',
                  props: { label: 'mulSelect' },
                  value: []
              },]
      }, {
          name: "选项卡",
          id: '2',
          selfProp: CardContainerSelfProp,
          UI: CardContainerUI,
          params: [{
                  type: 'array',
                  key: 'tab',
                  props: { label: '选项卡' },
              }]
      }, {
          name: "弹窗",
          id: '3',
          selfProp: ContainerSelfProp,
          UI: ContainerUI
      }];
  let basic = [{
          name: "按钮",
          id: '4',
          selfProp: ButtonSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'input',
                  key: 'label',
                  props: { label: '描述' },
              }]
      }, {
          name: "输入框",
          id: '5',
          selfProp: InputSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'input',
                  key: 'value',
                  props: { label: '值' },
              }, {
                  type: 'input',
                  key: 'prepend',
                  props: { label: '前缀' },
              }]
      }, {
          name: "数字输入框",
          id: '6',
          selfProp: NumberSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'input',
                  key: 'value',
                  props: { label: '值' },
              }, {
                  type: 'input',
                  key: 'label',
                  props: { label: '标签' },
              }]
      }, {
          name: "日期选择",
          id: '7',
          selfProp: TimePickerSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'input',
                  key: 'value',
                  props: { label: '值' },
              }, {
                  type: 'input',
                  key: 'placeholder',
                  props: { label: 'placeholder' },
              }, {
                  type: 'select',
                  key: 'type',
                  props: { label: '日期类型', optionsArray: [{
                              key: 'year',
                              value: 'year'
                          }, {
                              key: 'month',
                              value: 'month'
                          }, {
                              key: 'date',
                              value: 'date'
                          }, {
                              key: 'week',
                              value: 'week'
                          }, {
                              key: 'datetime',
                              value: 'datetime'
                          }, {
                              key: 'datetimerange',
                              value: 'datetimerange'
                          }, {
                              key: 'daterange',
                              value: 'daterange'
                          },],
                      configVisible: false
                  }
              }]
      }, {
          name: "时间选择",
          id: '8',
          selfProp: TimeGroupSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'select',
                  key: 'year',
                  props: { label: '日期类型', optionsArray: new Array(21).fill(2020).map((item, index) => item - index).map(item => {
                          return {
                              key: item,
                              value: item
                          };
                      }),
                      configVisible: false
                  }
              }, {
                  type: 'select',
                  key: 'report',
                  props: { label: '日期类型', optionsArray: [{
                              key: 1,
                              value: '年报'
                          }, {
                              key: 2,
                              value: '三季'
                          }, {
                              key: 3,
                              value: '中期'
                          }, {
                              key: 4,
                              value: '一季'
                          }],
                      configVisible: false
                  }
              }]
      }, {
          name: "下拉选择",
          id: '9',
          selfProp: SelectSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'select',
                  key: 'value',
                  props: { label: '日期类型', optionsArray: [{
                              key: 1,
                              value: '选项一'
                          }, {
                              key: 2,
                              value: '选项二'
                          }, {
                              key: 3,
                              value: '选项三'
                          }],
                      configVisible: true
                  }
              }]
      }, {
          name: "多选框",
          id: '10',
          selfProp: CheckboxSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'boolean',
                  key: 'value',
              }, {
                  type: 'input',
                  key: 'label',
              }]
      }, {
          name: "多选框组",
          id: '11',
          selfProp: CheckBoxGroupSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'mulSelect',
                  key: 'value',
                  props: { optionsArray: [{
                              key: 1,
                              value: '选项一'
                          }, {
                              key: 2,
                              value: '选项二'
                          }, {
                              key: 3,
                              value: '选项三'
                          }],
                      configVisible: true
                  },
              }]
      }, {
          name: "单选框组",
          id: '12',
          selfProp: RadioSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'select',
                  key: 'value',
                  props: { label: '日期类型', optionsArray: [{
                              key: 1,
                              value: '选项一'
                          }, {
                              key: 2,
                              value: '选项二'
                          }, {
                              key: 3,
                              value: '选项三'
                          }],
                      configVisible: true
                  }
              }]
      }, {
          name: "下拉框",
          id: '13',
          selfProp: MulSelectSelfProp,
          UI: ComponentSingleUI,
          params: [{
                  type: 'mulSelect',
                  key: 'value',
                  props: { optionsArray: [{
                              key: 1,
                              value: '选项一'
                          }, {
                              key: 2,
                              value: '选项二'
                          }, {
                              key: 3,
                              value: '选项三'
                          }],
                      configVisible: true
                  },
              }]
      }];
  let merge = [{
          name: "柱状折现图",
          id: '15',
          selfProp: MergeSelfProp,
          UI: ComponentMultipleUI
      }, {
          name: "饼图",
          id: '16',
          selfProp: MergeSelfProp,
          UI: ComponentMultipleUI
      }, {
          name: "表格",
          id: '17',
          selfProp: MergeSelfProp,
          UI: ComponentMultipleUI,
          params: [{
                  type: 'tableDataConfig',
                  key: 'config',
              }]
      }, {
          name: "嵌入式页面",
          id: '18',
          selfProp: IframeSelfProp,
          UI: ComponentMultipleUI,
          params: [{
                  type: 'input',
                  key: 'src',
              }]
      }];

  let containerModules = new ModuleInstance();
  containerModules.canDrag = false;
  containerModules.target.style.width = "100%";
  containerModules.target.style.height = "100%";
  containerModules.target.style.overflow = 'auto';

  class LocalStorage extends Storage {
      constructor() {
          super();
          this.storage = localStorage;
      }
      /**
       *get
       *
       * @param {string} key
       * @memberof Storage
       */
      get(key) {
          let value = this.storage.getItem(key);
          if (value) {
              value = decodeURIComponent(value);
          }
          try {
              value = JSON.parse(value);
          }
          catch (e) { }
          if (value == 'undefined') {
              value = undefined;
          }
          return value;
      }
      /**
       *set
       *
       * @param {string} key
       * @param {any} value
       * @memberof Storage
       */
      set(key, value) {
          if (typeof value == "object") {
              value = JSON.stringify(value);
          }
          try {
              value = encodeURIComponent(value);
          }
          catch (e) { }
          this.storage.setItem(key, value);
      }
      /**
       *remove
       *
       * @param {string} key
       * @memberof Storage
       */
      remove(key) {
          this.storage.setItem(key, undefined);
      }
      /**
       *clear
       *
       * @memberof Storage
       */
      clear() {
          this.storage.clear();
      }
  }
  let storage = new LocalStorage();

  let restoreInstance = (instance, res) => {
      instance.moduleId = res.moduleId;
      instance.canDrag = res.canDrag;
      let tc = basic.concat(container, merge).find(item => item.id == res.target.typeId);
      let TargetConstructor = tc ? tc : {
          name: "外层",
          selfProp: ModuleSelfProp,
          UI: ContainerUI,
          params: []
      };
      instance.target = new TargetConstructor.UI();
      instance.target.editable = res.target.editable;
      instance.target.id = res.target.id;
      instance.target.typeId = res.target.typeId;
      instance.target.insertable = res.target.insertable;
      instance.target.moduleIdList = res.target.moduleIdList;
      (res.target.eventBind.inValue || []).forEach((item) => {
          var event = instance.target.eventBind.addIn();
          event.setValue(item);
      });
      (res.target.eventBind.outValue || []).forEach((item) => {
          var event = instance.target.eventBind.addOut();
          event.setValue(item);
      });
      instance.target.eventBind.save();
      instance.target.selfProp = new TargetConstructor.selfProp();
      instance.target.selfProp.setParam(TargetConstructor.params || []);
      instance.target.selfProp.setValue(res.target.selfProp.value);
      instance.target.style.setValue(res.target.style.value);
      // container.target = new ContainerUI()
      instance.children = res.children.map((item) => {
          var module = restoreInstance(new ModuleInstance(), item);
          return module;
      });
      return instance;
  };

  let compilerInstance = new ModuleInstance();
  var res = storage.get('saveedit');
  if (res) {
      restoreInstance(compilerInstance, res);
  }

  Vue.use(ElementUI);
  class EventListVueUI extends VueUI {
      constructor(params) {
          super(params);
          this.apiList = apiList;
          this.eventList = eventList;
      }
      renderInstance(render) {
          return render.createElement(EventListVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class BasicVueUI extends VueUI {
      constructor(params) {
          super(params);
          this.ui = this.props.ui;
          this.isCompiler = this.props.isCompiler;
      }
      renderInstance(render) {
          return render.createElement('div', {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class ContainerVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(ContainerVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class CardContainerVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(CardContainerVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class DialogContainerVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(DialogContainerVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class ButtonVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(ButtonVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class InputVueUI$2 extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(InputVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class NumberVueUI$1 extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(NumberVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class TimePickerVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(TimePickerVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class TimeGroupVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
          this.year = new Array(21).fill(2020).map((item, index) => item - index).map(item => {
              return {
                  key: item,
                  value: item
              };
          });
          this.report = [{
                  key: 1,
                  value: '年报'
              }, {
                  key: 2,
                  value: '三季'
              }, {
                  key: 3,
                  value: '中期'
              }, {
                  key: 4,
                  value: '一季'
              }];
      }
      renderInstance(render) {
          return render.createElement(TimeGroupVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class SelectVueUI$1 extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(SelectVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class CheckBoxVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(CheckBoxVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class CheckBoxGroupVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(CheckBoxGroupVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class RadioVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(RadioVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class MulSelectVueUI$1 extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(MulSelectVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class IframeVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
      }
      renderInstance(render) {
          return render.createElement(IframeVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class TableCol {
      constructor(params) {
          this.prop = params.prop || '';
          this.type = params.type || '';
          this.label = params.label || '';
          this.sortable = params.sortable || false;
          this.className = params.className || '';
          this.width = params.width || '';
          this.minWidth = params.minWidth || '100px';
          this.fixed = params.fixed || false;
          this.convert = params.convert || false;
          this.showOverflowTooltip = params.showOverflowTooltip || false;
          this.children = (params.children || []).map((item) => new TableCol(item));
      }
      render(h, data, row, key = this.prop) {
          if (this.convert) {
              return h('span', {}, [this.convert(h, data, this, row)]);
          }
          else {
              return h('span', {}, [row[key]]);
          }
      }
  }
  class TableVueUI extends BasicVueUI {
      constructor(params) {
          super(params);
          this.list = [];
          this.loading = false;
          this.cols = [];
          this.direction = 'vertical';
          this.showHeader = true;
          this.mergetList = [];
          this.mergeCols = [];
          this.mergeShowHeader = false;
          this.setData();
      }
      setData() {
          this.cols.push(new TableCol({ label: 'test', prop: 'test' }));
          this.cols.push(new TableCol({ label: 'aaaaa', prop: 'test2' }));
          this.list = [{
                  test: "a",
                  test2: 'v'
              }, {
                  test: "b",
                  test2: 'q'
              },];
          this.merge();
      }
      merge() {
          if (this.direction === 'vertical') {
              this.mergeShowHeader = this.showHeader;
              this.mergetList = this.list.concat();
              this.mergeCols = this.cols.concat();
          }
          else {
              this.mergeShowHeader = false;
              this.mergetList = this.cols.map(item => {
                  return {
                      prop: item.prop
                  };
              });
              this.mergeCols = [new TableCol({ prop: 'homeTitle' })].concat(this.list.map((item, index) => {
                  return new TableCol({ prop: index.toString() });
              }));
          }
      }
      getTableRow(scope, item) {
          if (this.direction === 'vertical') {
              return scope.row;
          }
          else {
              if (item.prop == "homeTitle") {
                  var target = this.cols.find(t => t.prop == scope.row.prop);
                  if (target) {
                      return {
                          [scope.row.prop]: target.label
                      };
                  }
                  else {
                      return {
                          [scope.row.prop]: ''
                      };
                  }
              }
              return this.list[item.prop];
          }
      }
      getTableKey(scope, item) {
          if (this.direction === 'vertical') {
              return item.prop;
          }
          else {
              return scope.row.prop;
          }
      }
      renderInstance(render) {
          return render.createElement(TableVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default]);
      }
  }
  class TableDataConfigVueUI extends VueUI {
      constructor(params) {
          super(params);
          this.cols = [];
          this.data = [];
          this.simulate = new SimulateVueUI({});
          this.check();
      }
      addCol() {
          this.cols.push(new TableCol({}));
      }
      delCol(index) {
          this.cols.splice(index, 1);
      }
      check() {
          if (this.cols.length == 0) {
              this.addCol();
          }
      }
      getValue() {
          return this.value;
      }
      setValue(value) {
          var oldValue = this.value;
          this.value = value;
          this.check();
          if (oldValue != this.value) {
              this.onChange({
                  val: this.value,
                  oldVal: oldValue,
              });
          }
      }
      renderInstance(render) {
          return render.createElement(TableDataConfigVueUIComponent$1, {
              props: { target: this }
          }, [render.vueRoot.$slots.default, this.simulate.render(render)]);
      }
  }

  exports.BasicVueUI = BasicVueUI;
  exports.ButtonVueUI = ButtonVueUI;
  exports.CardContainerVueUI = CardContainerVueUI;
  exports.CheckBoxGroupVueUI = CheckBoxGroupVueUI;
  exports.CheckBoxVueUI = CheckBoxVueUI;
  exports.ContainerVueUI = ContainerVueUI;
  exports.DialogContainerVueUI = DialogContainerVueUI;
  exports.EventListVueUI = EventListVueUI;
  exports.IframeVueUI = IframeVueUI;
  exports.InputVueUI = InputVueUI$2;
  exports.MulSelectVueUI = MulSelectVueUI$1;
  exports.NumberVueUI = NumberVueUI$1;
  exports.RadioVueUI = RadioVueUI;
  exports.SelectVueUI = SelectVueUI$1;
  exports.TableCol = TableCol;
  exports.TableDataConfigVueUI = TableDataConfigVueUI;
  exports.TableVueUI = TableVueUI;
  exports.TimeGroupVueUI = TimeGroupVueUI;
  exports.TimePickerVueUI = TimePickerVueUI;

  return exports;

}({}, Vue, ElementUI, VueClassComponent, axios));
