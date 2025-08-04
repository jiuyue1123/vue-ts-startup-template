// src/router/index.ts
import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { layouts, views } from './_generated/imports';
import { routes } from './_generated/routes';
import { transformToVueRoutes } from './_generated/transformer';

// 转换路由
const vueRoutes = transformToVueRoutes(routes, layouts, views);

const router = createRouter({
  history: createWebHistory(),
  routes: vueRoutes,
});

export const steupRouter = (app: App) => {
  app.use(router);
};
