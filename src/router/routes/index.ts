import type { CustomRoute, ElegantRoute } from '@elegant-router/types';
import { layouts, views } from '../elegant/imports';
import { generatedRoutes } from '../elegant/routes';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

const customRoutes: CustomRoute[] = [
  {
    name: 'root',
    path: '/',
    redirect: {
      name: 'home',
    },
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: 'layout.base$view.404',
  },
];

const elegantRoutes: ElegantRoute[] = [...customRoutes, ...generatedRoutes];

export const routes = transformElegantRoutesToVueRoutes(elegantRoutes, layouts, views);
