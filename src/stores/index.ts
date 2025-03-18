import { createPinia } from 'pinia';
import type { App } from 'vue';

// 导入所有store模块
import { useAuthStore } from './modules/auth';

// 创建pinia实例
const pinia = createPinia();

// 设置pinia实例
export function setupStore(app: App) {
  app.use(pinia);
}

// 导出store模块
export { useAuthStore };
