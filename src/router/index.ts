import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const setupRouter = (app: App) => {
  app.use(router);
};

export { router, setupRouter };
