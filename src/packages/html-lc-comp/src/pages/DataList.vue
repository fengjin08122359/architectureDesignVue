<template>
  <div class="dataList">
    混合组件控制中心
    <el-button @click="combList.add()">添加</el-button>
    <div v-for="(item, index) in combList.dataList" :key="index">
      name: {{item.value.name}}
      <el-button @click="combList.getData(item.key)">选中</el-button>
      <el-button @click="combList.remove(item.key)">删除</el-button>
    </div>
    <div>
      <el-input v-model='combList.current.name'></el-input>
      <el-button @click="combList.setData(combList.current.id)">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CombList, combList, ComboModuleInstance} from "../sdk"


@Component
export default class DataList extends Vue {
  combList:CombList = combList
}
</script>

<style lang="less" scoped>
</style>
