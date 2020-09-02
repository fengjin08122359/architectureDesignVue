class e{constructor(e){this.key=e.key||"",this.props={label:"",required:"",data:[],disabled:!1,show:!0,placeholder:"",...e.props},this.valid=e.valid||[],this.type=e.type||"",this.value=void 0===e.value?"":e.value,this.children=e.children||[],this.rawData=e,this.rawComponents=e.rawComponents||[],this.canRender=!1}dataFind(e){var t=null;return(this.props.data||[]).forEach(s=>{void 0!==s[e]&&(t=s[e])}),t}setValue(e){var t=this.value;this.value=e,t!=this.value&&this.onChange({val:this.value,oldVal:t})}getKey(){return this.key}getValue(){return this.value}hasChange(){return!(""==this.getValue())}onChange({val:e,oldVal:t}){return{val:e,oldVal:t}}getValid(){var e={success:!0,message:"",type:"success"};return new Promise(t=>{this.key?(this.props.required&&!this.hasChange()&&(e={success:!1,message:this.props.label||"",type:"requiredEmpty"}),t(e)):t(e)})}setDisabled(e=!1){return this.props.disabled=e,this.props.disabled}getKeyValue(){return{key:this.getKey(),value:this.getValue(),children:this.children.map(e=>e.getKeyValue())}}setKeyValue({key:e,value:t,children:s}){""!=this.getKey()&&this.getKey()==e&&(this.setValue(t),s.forEach(e=>{var t=this.children.find(t=>e.key==t.getKey());t&&t.setKeyValue(e)}))}getAllItems(){return this.children.map(e=>e.getAllItems()).concat(this)}getCanRender(){return this.canRender||0==this.rawComponents.length}render(...e){}}class t{constructor(){this.datas=[]}add(e){this.datas.push(e)}remove(e){this.datas=this.datas.filter(t=>t.name!==e)}clear(){this.datas=[]}get(e=""){return this.datas.filter(t=>""===e||t.name===e)}find(e=""){var t=this.datas.find(t=>t.name===e),s=this.datas.find(e=>""===e.name);return t?t.data:s?s.data:null}}class s{constructor(e=[],s){this.options=s||{needValidHidden:!1},this.needValidHidden=this.options.needValidHidden,this.rawList=e,this.list=[],this.templateList=[],this.componentHasRendered=new t,this.classTarget=new.target,this.reset()}setList(e){this.rawList=e,this.list=[],this.reset()}reset(){this.list=this.rawList.map(e=>{var t=this.convert(e);return t.children&&(t.children=new this.classTarget(t.children,this.options).list),t},[])}addTemplate({key:e,value:t}){var s=this.getValue(),a=this.templateList.find(t=>t.key==e);a?a.value=t:this.templateList.push({key:e,value:t}),this.reset(),this.setValue(s)}removeTemplate(e){var t=this.getValue();this.templateList=this.templateList.filter(t=>t.key!==e),this.reset(),this.setValue(t)}clearTemplate(){var e=this.getValue();this.templateList=[],this.reset(),this.setValue(e)}getTemplate(){return this.templateList}convert(e){var t=this.templateList.find(t=>t.key==e.type);return t&&t.value?new t.value(e):this.convertSinlgeUI(e)}convertSinlgeUI(t){return new e(t)}getValid(){var e=this.getAllItems().filter(e=>this.needValidHidden||0!=e.props.show).map(e=>e.getValid(),[]);return new Promise(t=>{Promise.all(e).then(e=>{var s=e.filter(e=>!e.success);t({success:0==s.length,message:s.length>0?s[0].message:"",type:s.length>0?s[0].type:"success"})})})}setValue(e){e.forEach(e=>{var t=this.list.find(t=>e.key==t.getKey());t&&t.setKeyValue(e)})}getValue(){return this.list.map(e=>e.getKeyValue())}getAllItems(){return this.list.reduce((e,t)=>e=e.concat(t),[])}loadComponents(){return new Promise(e=>{var t=this.getNeedRender();Promise.all(t.map(e=>this.handleComponentKey(e))).then(()=>{e()})})}getNeedRender(){return Array.from(new Set(this.getAllItems().reduce((e,t)=>e=e.concat(t.getCanRender()?[]:t.rawComponents),[])))}load(){return this.loadComponents().then(()=>{var e=this.componentHasRendered.get("key").map(e=>e.data);this.getAllItems().forEach(t=>{!1===t.canRender&&(t.canRender=t.rawComponents.map(t=>e.includes(t)).reduce((e,t)=>e&&t,!0))})})}render(){return this.getAllItems().map(e=>e.render())}handleComponentKey(e){return new Promise(t=>{this.componentHasRendered.add({name:"key",data:e}),t()})}}export{e as SingleUI,s as UIList};
