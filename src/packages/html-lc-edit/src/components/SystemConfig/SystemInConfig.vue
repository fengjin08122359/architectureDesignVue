<template>
  <el-row>
    <div @click="addParam()">添加</div>
    <el-form label-width='110px'>
    <div v-for="(item, index) in inParams.systemIn.getParams()" :key="index">
      <el-form-item label='key'>
        <el-input v-model='item.key'>
        </el-input>
      </el-form-item>
       <el-form-item label='type'>
       <el-select v-model="item.type">
        <el-option value='input'>input</el-option>
        <el-option value='number'>number</el-option>
        <el-option value='select'>boolean</el-option>
        <el-option value='array'>array</el-option>
       </el-select>
      </el-form-item>
        <el-col :span="4">
          <span @click="delParam(index)" class="el-icon-remove-outline"></span>
        </el-col>
    </div>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {SystemIn, inParams, SingleUI} from '../../sdk'

@Component
export default class SystemInConfig extends Vue {
  inParams:any = inParams;
  addParam () {
    inParams.systemIn.addParam()
    
  }
  delParam (index) {
    inParams.systemIn.delParam(index)
  }
  saveParams () {
  }
}
</script>