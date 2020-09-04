import {CombResPayload, ComboModuleInstance}  from "@mikefeng110808/lc-logic-comp"

export let comboEl:CombResPayload | null = null;

export let setComboModule = (target: CombResPayload) => {
  comboEl = target
}

export let clearComboEl = () =>{
  comboEl = null
}


export let generateCombo = (target: CombResPayload) => {
  let combo = new ComboModuleInstance();
  combo.setValue(target.value.value)
  combo.initModuleId()
  combo.target.resetStyle()
  return combo;
};

