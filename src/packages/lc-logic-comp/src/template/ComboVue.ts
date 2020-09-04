import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ComboComponent } from "@mikefeng110808/lc-ui-instance";

@Component
export default class ComboVue extends Vue {
  @Prop() protected target!: ComboComponent;
  @Prop() isCompiler!: boolean;
  template = "<div></div>";
  renderTemplate = "";
  mounted() {
    this.resetOpt();
    this.template = this.target.selfProp.renderTemplate
    this.renderTemplate = this.target.selfProp.renderTemplate
  }
  resetOpt() {
    this.target.resetOpt(this);
  }
  resetRenderTemplate() {
    if (this.isCompiler) {
      this.template = this.target.selfProp.renderTemplate || "";
    } 
  }
  render(h: any) {
    console.log(this.template, this.target.selfProp.opt)
    return Vue.compile(this.template).render.apply(this, h);
  }
  @Watch("target.selfProp.opt", {deep:true})
  watchOpt(val: any) {
    this.resetOpt();
  }
  @Watch("target.selfProp.renderTemplate", {deep:true})
  watchRenderTemplate(val: any) {
    this.resetRenderTemplate();
  }
  @Watch("target.selfProp.renderView", {deep:true})
  watchRenderView(val: any) {
    this.template = this.target.selfProp.renderTemplate || "";
  }
}
