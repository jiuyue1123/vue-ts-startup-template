import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; // Element Plus dark mode
import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import './style.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { setupStore } from './stores';
import { setupTheme } from './utils/theme';
import './styles'; // 导入所有全局样式

const app = createApp(App);

// 初始化主题系统
setupTheme();

app.use(ElementPlus, {
  size: 'default',
});
setupRouter(app);
setupStore(app);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount('#app');
