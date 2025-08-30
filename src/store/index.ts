import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { type App } from 'vue';

const pinia = createPinia();

export const setupStore = (app: App) => {
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
};
