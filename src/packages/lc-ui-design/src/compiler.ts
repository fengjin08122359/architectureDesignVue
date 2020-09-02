import { ModuleInstance } from "@mikefeng110808/lc-ui-module";
import { restoreFromEdit } from "./save";

export let compilerInstance: ModuleInstance = new ModuleInstance();
restoreFromEdit(compilerInstance)
