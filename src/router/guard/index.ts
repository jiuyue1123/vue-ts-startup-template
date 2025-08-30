import { useAuthStore } from '@/store/auth';
import type { Router } from 'vue-router';

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore();
    // 检查是否需要认证
    if (to.meta.requiresAuth && !authStore.isLogin) {
      // 保存原始目标路由，登录后跳转
      authStore.setRedirectPath(to.fullPath);

      ElMessage.error('请先登录');
      next('/login');
      return;
    }

    // 已登录用户访问登录页，重定向到首页或保存的路径
    if (to.path === '/login' && authStore.isLogin) {
      const redirectPath = authStore.getAndClearRedirectPath();
      next(redirectPath || '/');
      return;
    }

    next();
  });
};
