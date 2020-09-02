import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);
let vueInstance = new Vue({
  render(h) {
    return h(App);
  }
});
// vueInstance.$mount("#app");

export default vueInstance;
export { App };
