import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref<{
    username: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
  } | null>(null);
  const rememberMe = ref(localStorage.getItem('rememberMe') === 'true');

  // 登录状态
  const isLoggedIn = ref(!!token.value);

  // 登录方法
  const login = async (credentials: { username: string; password: string; remember: boolean }) => {
    try {
      // 模拟 API 请求
      // 实际项目中，这里应该调用真实的 API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟获取 token 和用户信息
      const mockToken = `token_${Date.now()}`;
      const mockUserInfo = {
        username: credentials.username,
        avatar: 'https://avatars.githubusercontent.com/u/12345678',
        roles: ['user'],
        permissions: ['read', 'write'],
      };

      // 更新状态
      token.value = mockToken;
      userInfo.value = mockUserInfo;
      isLoggedIn.value = true;
      rememberMe.value = credentials.remember;

      // 保存到 localStorage
      localStorage.setItem('token', mockToken);
      if (credentials.remember) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userInfo', JSON.stringify(mockUserInfo));
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userInfo');
      }

      return {
        success: true,
        message: '登录成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '登录失败',
      };
    }
  };

  // 登出方法
  const logout = () => {
    // 清除状态
    token.value = '';
    userInfo.value = null;
    isLoggedIn.value = false;

    // 清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    // 可以保留记住我的设置
  };

  // 初始化用户信息
  const initUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo);
      } catch (error) {
        // 解析错误时将用户信息置为null
        console.error('解析用户信息失败', error);
        userInfo.value = null;
      }
    }
  };

  // 获取用户权限
  const hasPermission = (permission: string) => {
    return userInfo.value?.permissions?.includes(permission) || false;
  };

  // 获取用户角色
  const hasRole = (role: string) => {
    return userInfo.value?.roles?.includes(role) || false;
  };

  // 初始化
  if (token.value && rememberMe.value) {
    initUserInfo();
    isLoggedIn.value = true;
  }

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    rememberMe,

    // 方法
    login,
    logout,
    hasPermission,
    hasRole,
  };
});
