import { AllModuleInstance } from "./save";
import { restoreFromEdit } from "./save";

export let compilerInstance: AllModuleInstance = new AllModuleInstance();
restoreFromEdit(compilerInstance)
