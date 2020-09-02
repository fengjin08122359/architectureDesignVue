import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import generator from "../utils/router";
const routes: Array<RouteConfig> = [...generator];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
