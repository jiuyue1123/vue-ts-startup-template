<template>
  <div class="layout">
    <ElContainer>
      <ElAside :width="isCollapse ? '64px' : '240px'" class="aside">
        <div class="menu-container">
          <GlobalMenu :is-collapse="isCollapse" :app-title="appTitle" />
        </div>
      </ElAside>
      <div class="collapse-btn-container">
        <div class="collapse-btn" @click="toggleCollapse">
          <ElIcon class="collapse-icon" :class="{ 'rotate-icon': isCollapse }">
            <ArrowLeft />
          </ElIcon>
        </div>
      </div>
      <ElContainer>
        <ElHeader height="60px" class="header">
          <div class="header-content">
            <h2>{{ currentRouteTitle }}</h2>
            <div class="header-actions">
              <div class="theme-switch">
                <ElTooltip content="切换主题" placement="bottom">
                  <ElButton circle size="small" @click="toggleTheme">
                    <ElIcon>
                      <Moon v-if="isDarkMode" />
                      <Sunny v-else />
                    </ElIcon>
                  </ElButton>
                </ElTooltip>
              </div>

              <!-- 用户头像和下拉菜单 -->
              <div class="user-dropdown" v-if="authStore.isLoggedIn">
                <ElDropdown trigger="click" @command="handleCommand">
                  <div class="user-card">
                    <ElAvatar :size="32" :src="userAvatar">
                      {{ userInitials }}
                    </ElAvatar>
                    <span class="username">{{ userName }}</span>
                    <ElIcon class="dropdown-icon">
                      <ArrowDown />
                    </ElIcon>
                  </div>
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem command="profile">
                        <ElIcon>
                          <User />
                        </ElIcon>
                        <span>个人资料</span>
                      </ElDropdownItem>
                      <ElDropdownItem command="settings">
                        <ElIcon>
                          <Setting />
                        </ElIcon>
                        <span>设置</span>
                      </ElDropdownItem>
                      <ElDropdownItem divided command="logout">
                        <ElIcon>
                          <SwitchButton />
                        </ElIcon>
                        <span>退出登录</span>
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </div>
        </ElHeader>
        <ElMain class="main-content">
          <RouterView />
        </ElMain>
      </ElContainer>
    </ElContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  ArrowLeft,
  Moon,
  Sunny,
  User,
  Setting,
  SwitchButton,
  ArrowDown,
} from '@element-plus/icons-vue';
import GlobalMenu from '../modules/global-menu.vue';
import { getStoredTheme, setTheme, isDarkMode } from '@/utils/theme';
import { useAuthStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isCollapse = ref(false);
const appTitle = ref('Vue TS App');

// 当前路由标题
const currentRouteTitle = computed(() => {
  return route.meta.title || appTitle.value;
});

// 监听路由变化，更新标题
watch(
  () => route.path,
  () => {
    document.title = currentRouteTitle.value;
  },
  { immediate: true },
);

// 用户信息计算属性
const userName = computed(() => {
  return authStore.userInfo?.username || '未登录';
});

const userAvatar = computed(() => {
  return authStore.userInfo?.avatar || '';
});

const userInitials = computed(() => {
  if (!authStore.userInfo?.username) return '';
  return authStore.userInfo.username.slice(0, 2).toUpperCase();
});

function toggleCollapse() {
  isCollapse.value = !isCollapse.value;
}

function toggleTheme() {
  // 在亮色和暗色主题之间切换
  const newTheme = isDarkMode.value ? 'light-theme' : 'dark-theme';
  setTheme(newTheme);
}

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      router.push('/settings');
      break;
    case 'logout':
      handleLogout();
      break;
  }
}

// 退出登录
function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      authStore.logout();
      ElMessage.success('已成功退出登录');
      router.push('/login');
    })
    .catch(() => {
      // 取消退出
    });
}

// 注意: 不需要在这里初始化主题，因为App.vue中已经做了
</script>

<style>
/* 移除重复的CSS变量定义，样式已经在全局变量文件中定义 */
</style>

<style scoped>
.layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-color);
  transition: background-color 0.3s;
  will-change: background-color;
}

.aside {
  background-color: var(--menu-bg);
  height: 100vh;
  position: relative;
  transition:
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: var(--menu-text);
  overflow: hidden;
  box-shadow: 2px 0 6px var(--shadow-color);
  will-change: width;
  transform: translateZ(0);
}

.menu-container {
  height: calc(100% - 50px);
  overflow-y: auto;
  overflow-x: hidden;
}

.collapse-btn-container {
  position: relative;
  z-index: 10;
}

.collapse-btn {
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  background-color: var(--primary-color);
  box-shadow: 0 2px 8px var(--shadow-color);
  transition:
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 2;
}

.collapse-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.collapse-icon {
  font-size: 16px;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.rotate-icon {
  transform: rotate(180deg);
}

.header {
  background-color: var(--header-bg);
  box-shadow: 0 1px 4px var(--shadow-color);
  display: flex;
  align-items: center;
  padding: 0;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
  color: white;
  border-bottom: 1px solid transparent;
}

.header-content {
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
  transition: color 0.3s;
}

.header-actions {
  display: flex;
  align-items: center;
}

.theme-switch {
  margin-left: 16px;
}

.theme-switch .el-button {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  transition: all 0.3s;
}

.theme-switch .el-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.theme-switch .el-button:active {
  background-color: rgba(255, 255, 255, 0.4);
}

.user-dropdown {
  margin-left: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 24px;
  transition: all 0.3s;
  background-color: var(--user-card-bg);
}

.user-card:hover {
  background-color: var(--user-card-hover);
  transform: translateY(-1px);
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: var(--user-text-color);
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-shadow: 0 1px 2px var(--shadow-color);
}

.dropdown-icon {
  font-size: 12px;
  color: var(--user-text-color);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
}

:deep(.el-avatar) {
  background-color: var(--primary-active);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-content {
  background-color: var(--bg-color);
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 20px;
  transition:
    background-color 0.3s,
    color 0.3s;
  color: var(--text-primary);
}

/* Content cards in main area */
:deep(.el-card) {
  margin-bottom: 16px;
  background-color: var(--component-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
  box-shadow: 0 1px 2px 0 var(--shadow-color);
}

:deep(.el-card__header) {
  border-bottom-color: var(--border-color);
  padding: 12px 20px;
}

:deep(.el-card__body) {
  padding: 16px 20px;
}

/* Form inputs in main area */
:deep(.el-input__wrapper) {
  background-color: var(--component-bg);
  border-color: var(--border-color);
}

:deep(.el-input__inner) {
  color: var(--text-primary);
}

/* Tables in main area */
:deep(.el-table) {
  background-color: var(--component-bg);
  color: var(--text-primary);
}

:deep(.el-table tr) {
  background-color: var(--component-bg);
}

:deep(.el-table th.el-table__cell) {
  background-color: var(--bg-color);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--bg-color);
}

/* Scrollbar styling */
.menu-container::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.menu-container::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.menu-container::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: var(--text-secondary);
  border-radius: 4px;
}
</style>
