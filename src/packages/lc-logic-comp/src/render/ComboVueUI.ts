import { BasicVueUI } from '@mikefeng110808/lc-ui-components';
import { SingleUIPayload } from '@mikefeng110808/logic';
import { VueRenderPayload } from '@mikefeng110808/vue-ui';
import ComboVue from '../template/ComboVue';

export class ComboVueUI extends BasicVueUI {
  constructor(params: SingleUIPayload) {
    super(params);
    console.log(params)
  }
  renderInstance(render: VueRenderPayload) {
    return render.createElement(
      ComboVue,
      {
        props: { target: this.props.ui,isCompiler: false}
      },
      [render.vueRoot.$slots.default]
    );
  }
}