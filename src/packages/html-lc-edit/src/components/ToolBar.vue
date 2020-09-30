<template>
  <div class="toolBarList">
    <div class="toolTitle">容器组件（拖拽操作）</div>
    <el-row>
      <el-col :span="12" v-for="(item, index) in continerModules" :key="index">
        <DragCol :target="item"></DragCol>
      </el-col>
    </el-row>
    <div class="toolTitle">表单组件（拖拽操作）</div>
    <el-row>
      <el-col :span="12" v-for="(item, index) in basicModules" :key="index">
        <DragCol :target="item"></DragCol>
      </el-col>
    </el-row>
    <div class="toolTitle">复杂组件（拖拽操作）</div>
    <el-row>
      <el-col :span="12" v-for="(item, index) in mergeModules" :key="index">
        <DragCol :target="item"></DragCol>
      </el-col>
    </el-row>
    <div class="toolTitle">自定义组件（拖拽操作）</div>
    <el-row>
      <el-col :span="24" v-for="(item, index) in combList.dataList" :key="index">
        <div draggable="true"  @dragstart="(e) => dragModule(e, item)">
            {{item.value.name}}
        </div>
      </el-col>
    </el-row>

    <el-switch v-model="editorInstance.isRelative"></el-switch>
    <el-color-picker v-model="editorInstance.borderColor"></el-color-picker>
    <ToolBarConfig></ToolBarConfig>
    <SystemConfig></SystemConfig>
    <el-button-group>
    <el-button @click="restoreFromConfig()">restoreFromConfig</el-button>
    <el-button @click="restoreFromEdit()">restoreFromEdit</el-button>
    </el-button-group>

    <el-button-group>
    <el-button @click="saveFromConfig()">saveFromConfig</el-button>
    <el-button @click="saveFromEdit()">saveFromEdit</el-button>
    </el-button-group>
    
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  basicModules,
  continerModules,
  mergeModules,
  editorInstance,
  saveFromConfig,
  saveFromEdit,
  restoreFromEdit,
  restoreFromConfig,
  CombList, 
  combList,
  clearCurrentEl,
  setComboModule
} from "../sdk";
import DragCol from "./DragCol.vue";
import ToolBarConfig from "./ToolBar/ToolBarConfig.vue";
import SystemConfig from "./SystemConfig/SystemConfig.vue";

@Component({ components: { DragCol, ToolBarConfig, SystemConfig } })
export default class ToolBar extends Vue {
  basicModules = basicModules;
  continerModules = continerModules;
  mergeModules = mergeModules;
  editorInstance = editorInstance;
  saveFromConfig = saveFromConfig;
  saveFromEdit = saveFromEdit;
  restoreFromEdit = restoreFromEdit
  restoreFromConfig = restoreFromConfig
  combList:CombList = combList
  dragModule(e, target) {
    e.dataTransfer.effectAllowed = 'all'
    e.dataTransfer.dropEffect = 'copy'
    console.log(target)
    setComboModule(target)
    clearCurrentEl()
  }
}
</script>

<style lang="less" >
.el-drawer__body {
  overflow: auto;
}
</style>