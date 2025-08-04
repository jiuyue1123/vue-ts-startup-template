// 全局错误处理，可以放在main.ts中
import type { App } from 'vue';

/**
 * 全局错误处理
 * @param app 应用实例
 */
export function setupErrorHandler(app: App) {
  // 创建局部变量避免直接修改参数
  const vueApp = app;

  vueApp.config.errorHandler = (err, instance, info) => {
    console.error('[Global Error]', err, instance, info);
    // 上报监控
  };

  window.addEventListener('unhandledrejection', (e) => {
    console.error('[Unhandled Rejection]', e.reason);
  });
}

/**
 * 用法
 * import { createApp } from 'vue';
 * import { setupErrorHandler } from '@/utils/errorHandler';
 * const app = createApp(App);
 * setupErrorHandler(app);
 */
