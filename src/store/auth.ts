import { fetchLogin } from '@/service/api/auth';
import { localStg } from '@/utils';

export const useAuthStore = defineStore('auth', () => {
  const redirectPath = ref<string | null>(null);
  const token = ref<string | null>(localStg.get('token'));
  function setRedirectPath(path: string) {
    redirectPath.value = path;
  }

  function getAndClearRedirectPath() {
    const path = redirectPath.value;
    redirectPath.value = null;
    return path;
  }
  async function login(username: string, password: string) {
    const { data, error } = await fetchLogin(username, password);
    if (error) {
      ElMessage.error(error.message);
    } else if (data?.token) {
      ElMessage.success('登录成功');
      token.value = data?.token;
      localStg.set('token', data?.token);
      return true;
    }
    return false;
  }

  function logout() {
    token.value = null;
    localStg.remove('token');
  }

  const isLogin = computed(() => {
    return !!token.value;
  });

  return {
    setRedirectPath,
    getAndClearRedirectPath,
    login,
    logout,
    isLogin,
  };
});
