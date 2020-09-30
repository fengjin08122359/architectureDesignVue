<template>
    <el-row>
      <el-col>
        <el-button class="toolTitle" @click="visible = true">系统参数配置</el-button>
      </el-col>
      <el-drawer :visible.sync="visible" direction="rtl" :append-to-body="true">
        <div class="drawer-section">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="系统入参" name="SystemIn">
              <SystemInConfig></SystemInConfig>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-drawer>
    </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SystemInConfig from "../SystemConfig/SystemInConfig.vue";

@Component({ components: { SystemInConfig } })
export default class SystemConfig extends Vue {
  visible = false
  activeTab = "SystemIn"
}
</script>