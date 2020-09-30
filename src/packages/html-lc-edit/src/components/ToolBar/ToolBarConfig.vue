<template>
    <el-row>
      <el-col>
        <el-button class="toolTitle" @click="visible = true">api列表, 事件列表</el-button>
      </el-col>
      <el-drawer :visible.sync="visible" direction="rtl" :append-to-body="true">
        <div class="drawer-section">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="api列表" name="ApiList">
              <ApiList></ApiList>
            </el-tab-pane>
            <el-tab-pane label="事件列表" name="EventList">
              <EventList></EventList>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-drawer>
    </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApiList from "../ToolBar/ApiList.vue";
import EventList from "../ToolBar/EventList.vue";

@Component({ components: { ApiList, EventList } })
export default class ToolBarConfig extends Vue {
  visible = false
  activeTab = "ApiList"
}
</script>