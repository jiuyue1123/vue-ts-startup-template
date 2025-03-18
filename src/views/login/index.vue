<template>
  <div class="login-container" :class="currentTheme">
    <div class="login-content">
      <div class="login-header">
        <h1 class="app-title">{{ appTitle }}</h1>
        <p class="app-desc">企业级 Vue3 + TypeScript 应用模板</p>
      </div>

      <ElCard class="login-form-container">
        <template #header>
          <div class="login-form-header">
            <h2>账号登录</h2>
            <div class="theme-switch">
              <ElButton circle size="small" @click="toggleTheme">
                <ElIcon>
                  <Moon v-if="currentTheme === 'dark-theme'" />
                  <Sunny v-else />
                </ElIcon>
              </ElButton>
            </div>
          </div>
        </template>

        <ElForm
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @keyup.enter="handleLogin"
        >
          <ElFormItem prop="username">
            <ElInput v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
          </ElFormItem>

          <ElFormItem prop="password">
            <ElInput
              v-model="loginForm.password"
              placeholder="密码"
              :prefix-icon="Lock"
              type="password"
              show-password
            />
          </ElFormItem>

          <ElFormItem class="login-options">
            <ElCheckbox v-model="loginForm.remember">记住我</ElCheckbox>
            <ElLink type="primary" :underline="false">忘记密码？</ElLink>
          </ElFormItem>

          <ElFormItem>
            <ElButton type="primary" class="login-button" :loading="loading" @click="handleLogin">
              登录
            </ElButton>
          </ElFormItem>
        </ElForm>

        <div class="other-login-methods">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-login">
            <ElButton circle>
              <ElIcon>
                <Message />
              </ElIcon>
            </ElButton>
            <ElButton circle>
              <ElIcon>
                <ChatDotRound />
              </ElIcon>
            </ElButton>
            <ElButton circle>
              <ElIcon>
                <Service />
              </ElIcon>
            </ElButton>
          </div>
        </div>
      </ElCard>

      <div class="login-footer">
        <p>Copyright © {{ new Date().getFullYear() }} Vue TS Startup Template</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { User, Lock, Moon, Sunny, Message, ChatDotRound, Service } from '@element-plus/icons-vue';
import { getStoredTheme, setTheme } from '@/utils/theme';
import { useAuthStore } from '@/stores';

// 获取路由实例
const router = useRouter();

// 获取认证store
const authStore = useAuthStore();

// 应用标题
const appTitle = ref('Vue TS App');

// 主题切换
const currentTheme = ref(getStoredTheme());

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light-theme' ? 'dark-theme' : 'light-theme';
  setTheme(currentTheme.value);
}

// 表单相关
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const loginForm = reactive({
  username: '',
  password: '',
  remember: authStore.rememberMe,
});

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;

      try {
        // 调用 store 的登录方法
        const result = await authStore.login({
          username: loginForm.username,
          password: loginForm.password,
          remember: loginForm.remember,
        });

        if (result.success) {
          ElMessage.success(result.message);
          router.push('/');
        } else {
          ElMessage.error(result.message);
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  // 初始化主题
  setTheme(currentTheme.value);

  // 如果已经登录，直接跳转到首页
  if (authStore.isLoggedIn) {
    ElMessage.success('已经登录，无需再次登录');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }
});
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  transition: background-color 0.3s;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-color: var(--primary-color);
  transition: background-color 0.3s;
  z-index: 0;
}

.login-content {
  width: 400px;
  max-width: 90%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  margin-bottom: 24px;
  text-align: center;
  color: #fff;
}

.app-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.app-desc {
  font-size: 16px;
  opacity: 0.8;
}

.login-form-container {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: var(--component-bg);
  color: var(--text-primary);
  transition: all 0.3s;
  margin-bottom: 24px;
}

.login-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
}

.other-login-methods {
  margin-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.divider span {
  padding: 0 16px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Dark theme overrides */
.dark-theme .login-container::before {
  background-color: var(--primary-color);
}

.dark-theme .login-form-container {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
