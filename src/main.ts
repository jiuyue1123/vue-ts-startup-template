import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import '@unocss/reset/sanitize/assets.css';
import '@unocss/reset/sanitize/sanitize.css';
import 'virtual:uno.css';
import { createApp } from 'vue';
import App from './App.vue';
import { steupRouter } from './router';
import './style.css';

const app = createApp(App);
steupRouter(app);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount('#app');
