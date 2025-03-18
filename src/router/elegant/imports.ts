/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/base-layout/index.vue";
import BlankLayout from "@/layouts/blank-layout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  404: () => import("@/views/_built/404/index.vue"),
  home: () => import("@/views/home/index.vue"),
  login: () => import("@/views/login/index.vue"),
  profile: () => import("@/views/profile/index.vue"),
  settings: () => import("@/views/settings/index.vue"),
  test_test1: () => import("@/views/test/test1/index.vue"),
  test_test2: () => import("@/views/test/test2/index.vue"),
};
