import e from"axios";import t from"websocket";class s{constructor(){this.datas=[]}add(e){this.datas.push(e)}remove(e){this.datas=this.datas.filter(t=>t.name!==e)}clear(){this.datas=[]}get(e=""){return this.datas.filter(t=>""===e||t.name===e)}find(e=""){var t=this.datas.find(t=>t.name===e),s=this.datas.find(e=>""===e.name);return t?t.data:s?s.data:null}}class n extends class{constructor(){this.handlers=[]}add(e){this.handlers.push(e)}remove(e){this.handlers=this.handlers.filter(t=>t.name!==e)}get(e,t=""){return this.handlers.filter(e=>""===t||e.name===t).map(t=>({name:t.name,res:t.fun(e)}))}}{constructor(){super(),this.handlers=[]}addIntercept(e){this.add(e)}removeIntercept(e){this.remove(e)}getIntercept(e,t=""){return this.get(e,t).filter(e=>e.res).map(e=>e.name)}}class i{constructor(){this.EventList=new Array}static getInstance(){return this.instance=this.instance||new i,this.instance}addEventListener(e,t){this.EventList.push({name:e,listener:t})}removeEventListener(e){this.EventList=this.EventList.filter(t=>t.name!==e)}dispatchEvent(e,t){this.EventList.filter(t=>t.name===e).map(e=>e.listener).forEach(e=>e(t))}}class r{constructor(e){this.key=e.key||"",this.props={label:"",required:"",data:[],disabled:!1,show:!0,placeholder:"",...e.props},this.valid=e.valid||[],this.type=e.type||"",this.value=void 0===e.value?"":e.value,this.children=e.children||[],this.rawData=e,this.rawComponents=e.rawComponents||[],this.canRender=!1}dataFind(e){var t=null;return(this.props.data||[]).forEach(s=>{void 0!==s[e]&&(t=s[e])}),t}setValue(e){var t=this.value;this.value=e,t!=this.value&&this.onChange({val:this.value,oldVal:t})}getKey(){return this.key}getValue(){return this.value}hasChange(){return!(""==this.getValue())}onChange({val:e,oldVal:t}){return{val:e,oldVal:t}}getValid(){var e={success:!0,message:"",type:"success"};return new Promise(t=>{this.key?(this.props.required&&!this.hasChange()&&(e={success:!1,message:this.props.label||"",type:"requiredEmpty"}),t(e)):t(e)})}setDisabled(e=!1){return this.props.disabled=e,this.props.disabled}getKeyValue(){return{key:this.getKey(),value:this.getValue(),children:this.children.map(e=>e.getKeyValue())}}setKeyValue({key:e,value:t,children:s}){""!=this.getKey()&&this.getKey()==e&&(this.setValue(t),s.forEach(e=>{var t=this.children.find(t=>e.key==t.getKey());t&&t.setKeyValue(e)}))}getAllItems(){return this.children.map(e=>e.getAllItems()).concat(this)}getCanRender(){return this.canRender||0==this.rawComponents.length}render(...e){}}const a=new class extends class{constructor(){this.dataList=new s}log(...e){this.dataList.add({name:"log",data:e})}error(...e){this.dataList.add({name:"error",data:e})}debug(...e){this.dataList.add({name:"debug",data:e})}info(...e){this.dataList.add({name:"info",data:e})}warn(...e){this.dataList.add({name:"warn",data:e})}get(e=""){return this.dataList.get(e).map(e=>e.data)}}{constructor(){super()}open(){var e=this;console.log=function(t){return(...s)=>{e.log(s),t(s)}}(console.log),console.warn=function(t){return(...s)=>{e.warn(s),t(s)}}(console.warn),console.info=function(t){return(...s)=>{e.info(s),t(s)}}(console.info),console.error=function(t){return(...s)=>{e.error(s),o.collect(s),t(s)}}(console.error),console.debug=function(t){return(...s)=>{e.debug(s),t(s)}}(console.debug)}},o=new class{constructor(){this.dataList=new s}collect(e){this.dataList.add({name:"errorCode",data:e})}get(){return this.dataList.get("errorCode").map(e=>e.data)}},l=new i,c=new n,h=new n,d=new n;class u{constructor(e){this.baseURL=e.baseURL||"",this.init()}init(){e.interceptors.request.use(e=>this.convertRequest(e),e=>Promise.reject(e)),e.interceptors.response.use(e=>this.convertResponse(e),e=>Promise.reject(e))}convertRequest(e){return e}convertResponse(e){return e}create(t){const s={ts:Date.now()},n=(t.method||"get").toUpperCase(),i={method:n,baseURL:this.baseURL,url:t.url,responseType:t.responseType||"",timeout:2e4};t.meta&&(i.headers=t.meta);return["PUT","POST","PATCH"].includes(n)?i.data=t.data||{}:i.params={...s,...t.data||{}},t.formData&&(i.transformRequest=[e=>{const t=new FormData;return e&&Object.entries(e).forEach(e=>{t.append(e[0],e[1])}),t}]),new Promise((s,n)=>{e(i).then(e=>{this.handleSuccess(e,s,t)}).catch(e=>{this.handleError(e,n,t)})})}handleSuccess(e,t,s){c.getIntercept({response:e,opts:s},"http-success"),t(e)}handleError(e,t,s){c.getIntercept({error:e,opts:s},"http-error"),t(e)}}class p{constructor(e){this.ws=e.ws,this.pong=0,this.checkTime=3,this.reconnectTime=20,this.connnectNumber=0,this.connectLimit=1,this.keepAliveModel=!0}init(){this.pong=0,this.connnectNumber=0,this.interval&&clearInterval(this.interval),this.check(),this.interval=setInterval(()=>{this.check()},1e3*this.checkTime)}setConnectLimit(e){this.connectLimit=e}setPong(){this.connnectNumber=0,this.pong=(new Date).getTime()}check(){(navigator&&0==navigator.onLine||this.ws.isClosed()||this.pong&&(new Date).getTime()-this.pong>1e3*this.reconnectTime)&&this.endTimeout()}endTimeout(){this.keepAliveModel&&this.end(),this.reconnect()||(this.interval&&clearInterval(this.interval),h.getIntercept("close","keepalive"))}close(){this.interval&&clearInterval(this.interval),h.getIntercept("close","keepalive")}end(){this.ws.endClient()}reconnect(){var e=!1;return this.connnectNumber<=this.connectLimit&&(e=!0,this.ws.canReconnected()&&this.connnectNumber++,h.getIntercept("reconnect","keepalive")),e}}class m{constructor(){this.client=null,this.keepAlive=new p({ws:this})}isClosed(){return!this.client||this.client.readyState===this.client.CLOSED}canReconnected(){var e=this.client&&this.client.readyState==this.client.CLOSED;return e&&this.start(this.url),e}endClient(){this.client&&this.client.readyState==this.client.OPEN&&this.client.close()}start(e){this.url=e,this.client=new t.w3cwebsocket(e,"echo-protocol"),this.client.onerror=function(e){console.log("Connection Error"),h.getIntercept({client:this.client,data:e},"ws-error")},this.client.onopen=function(e){console.log("WebSocket Client Connected"),h.getIntercept({client:this.client,data:e},"ws-open"),this.keepalive.init()},this.client.onclose=function(e){console.log("echo-protocol Client Closed"),h.getIntercept({client:this.client,data:e},"ws-close")},this.client.onmessage=function(e){h.getIntercept({client:this.client,data:e.data},"ws-message"),this.keepAlive.setPong()}}setConnectLimit(e){this.keepAlive.setConnectLimit(e)}send(e){this.client&&this.client.send(e)}end(){this.client.close()}}class g extends r{constructor(e){super(e)}render(e){return this.getCanRender()?this.renderInstance(e):e.createElement()}renderInstance(e){return e.createElement("div",{...e.context,attrs:this},[this.props.label,e.vueRoot.$slots.default])}}class v extends class{constructor(e=[],t){this.options=t||{needValidHidden:!1},this.needValidHidden=this.options.needValidHidden,this.rawList=e,this.list=[],this.templateList=[],this.componentHasRendered=new s,this.classTarget=new.target,this.reset()}setList(e){this.rawList=e,this.list=[],this.reset()}reset(){this.list=this.rawList.map(e=>{var t=this.convert(e);return t.children&&(t.children=new this.classTarget(t.children,this.options).list),t},[])}addTemplate({key:e,value:t}){var s=this.getValue(),n=this.templateList.find(t=>t.key==e);n?n.value=t:this.templateList.push({key:e,value:t}),this.reset(),this.setValue(s)}removeTemplate(e){var t=this.getValue();this.templateList=this.templateList.filter(t=>t.key!==e),this.reset(),this.setValue(t)}clearTemplate(){var e=this.getValue();this.templateList=[],this.reset(),this.setValue(e)}getTemplate(){return this.templateList}convert(e){var t=this.templateList.find(t=>t.key==e.type);return t&&t.value?new t.value(e):this.convertSinlgeUI(e)}convertSinlgeUI(e){return new r(e)}getValid(){var e=this.getAllItems().filter(e=>this.needValidHidden||0!=e.props.show).map(e=>e.getValid(),[]);return new Promise(t=>{Promise.all(e).then(e=>{var s=e.filter(e=>!e.success);t({success:0==s.length,message:s.length>0?s[0].message:"",type:s.length>0?s[0].type:"success"})})})}setValue(e){e.forEach(e=>{var t=this.list.find(t=>e.key==t.getKey());t&&t.setKeyValue(e)})}getValue(){return this.list.map(e=>e.getKeyValue())}getAllItems(){return this.list.reduce((e,t)=>e=e.concat(t),[])}loadComponents(){return new Promise(e=>{var t=this.getNeedRender();Promise.all(t.map(e=>this.handleComponentKey(e))).then(()=>{e()})})}getNeedRender(){return Array.from(new Set(this.getAllItems().reduce((e,t)=>e=e.concat(t.getCanRender()?[]:t.rawComponents),[])))}load(){return this.loadComponents().then(()=>{var e=this.componentHasRendered.get("key").map(e=>e.data);this.getAllItems().forEach(t=>{!1===t.canRender&&(t.canRender=t.rawComponents.map(t=>e.includes(t)).reduce((e,t)=>e&&t,!0))})})}render(){return this.getAllItems().map(e=>e.render())}handleComponentKey(e){return new Promise(t=>{this.componentHasRendered.add({name:"key",data:e}),t()})}}{constructor(e=[],t){super(e,t)}convertSinlgeUI(e){return new g(e)}handleComponentKey(e){return new Promise(t=>{this.componentHasRendered.add({name:"key",data:e}),t()})}getRenderList(e){return this.getAllItems().map(t=>t.render(e))}}export{u as HttpInstance,g as VueUI,v as VueUIList,m as WebSocketInstance,o as errorCode,c as httpIntercept,l as keyFrame,a as log,d as routerIntercept,h as wsIntercept};
