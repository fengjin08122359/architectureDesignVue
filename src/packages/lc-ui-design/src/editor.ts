import { AllModuleInstance } from "./save";

export let currentEl:AllModuleInstance | null = null;

export let setCurrentModule = (target: AllModuleInstance) => {
    currentEl = target
}

export let clearCurrentEl = () =>{
    currentEl = null
}

class EditorInstance {
    active?:AllModuleInstance
    isRelative: boolean
    borderColor: string
    constructor () {
        this.active = undefined
        this.isRelative = true
        this.borderColor = '#bdbdbd'
    }
    setActive(instance: AllModuleInstance){
        this.active = instance
    }
    deleteActive () {
        if (this.active) {
            containerModules.unCombi(this.active.moduleId)
        }
    }
}

export let editorInstance = new EditorInstance();


export let setEditorInstance = (instance: AllModuleInstance) => {
    editorInstance.setActive(instance)
}

export let containerModules: AllModuleInstance = new AllModuleInstance()

containerModules.canDrag = false
containerModules.target.style.width = "100%"
containerModules.target.style.height = "100%"
containerModules.target.style.overflow = 'auto'
