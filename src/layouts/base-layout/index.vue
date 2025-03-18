<template>
  <div class="layout" :class="currentTheme">
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
            <h2>{{ appTitle }}</h2>
            <div class="header-actions">
              <div class="theme-switch">
                <ElTooltip content="切换主题" placement="bottom">
                  <ElButton circle size="small" @click="toggleTheme">
                    <ElIcon>
                      <Moon v-if="currentTheme === 'dark-theme'" />
                      <Sunny v-else />
                    </ElIcon>
                  </ElButton>
                </ElTooltip>
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
import { ref, onMounted } from 'vue';
import { ArrowLeft, Moon, Sunny } from '@element-plus/icons-vue';
import GlobalMenu from '../modules/global-menu.vue';
import { getStoredTheme, setTheme } from '../../utils/theme';

const isCollapse = ref(false);
const appTitle = ref('Vue TS App');
const currentTheme = ref(getStoredTheme());

function toggleCollapse() {
  isCollapse.value = !isCollapse.value;
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light-theme' ? 'dark-theme' : 'light-theme';
  setTheme(currentTheme.value);
}

onMounted(() => {
  setTheme(currentTheme.value);
});
</script>

<style>
:root {
  /* Light Theme - Based on Ant Design color palette */
  --primary-color: #1890ff;
  --primary-hover: #40a9ff;
  --primary-active: #096dd9;
  --primary-light: #e6f7ff;

  /* Background colors */
  --bg-color: #f0f2f5;
  --component-bg: #ffffff;
  --header-bg: #ffffff;

  /* Menu colors */
  --menu-bg: #001529;
  --menu-text: rgba(255, 255, 255, 0.85);
  --menu-text-secondary: rgba(255, 255, 255, 0.65);
  --menu-active-text: #ffffff;
  --menu-active-bg: #1890ff;
  --menu-hover-bg: #000c17;
  --menu-submenu-bg: #000c17;

  /* Text colors */
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.65);
  --text-hint: rgba(0, 0, 0, 0.45);

  /* Border colors */
  --border-color: #d9d9d9;
  --split-color: rgba(0, 0, 0, 0.06);

  /* Other elements */
  --shadow-color: rgba(0, 0, 0, 0.15);
  --collapse-btn-bg: #1890ff;
  --collapse-btn-hover: #40a9ff;
}

.dark-theme {
  /* Dark Theme - Based on Ant Design dark palette */
  --primary-color: #177ddc;
  --primary-hover: #1890ff;
  --primary-active: #0050b3;
  --primary-light: #111b26;

  /* Background colors */
  --bg-color: #141414;
  --component-bg: #1f1f1f;
  --header-bg: #1f1f1f;

  /* Menu colors */
  --menu-bg: #141414;
  --menu-text: rgba(255, 255, 255, 0.85);
  --menu-text-secondary: rgba(255, 255, 255, 0.65);
  --menu-active-text: #ffffff;
  --menu-active-bg: #177ddc;
  --menu-hover-bg: #1f1f1f;
  --menu-submenu-bg: #000000;

  /* Text colors */
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-hint: rgba(255, 255, 255, 0.45);

  /* Border colors */
  --border-color: #434343;
  --split-color: rgba(255, 255, 255, 0.12);

  /* Other elements */
  --shadow-color: rgba(0, 0, 0, 0.45);
  --collapse-btn-bg: #177ddc;
  --collapse-btn-hover: #1890ff;
}
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
  background-color: var(--collapse-btn-bg);
  box-shadow: 0 2px 8px var(--shadow-color);
  transition:
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 2;
}

.collapse-btn:hover {
  background-color: var(--collapse-btn-hover);
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
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-primary);
  transition: color 0.3s;
}

.header-actions {
  display: flex;
  align-items: center;
}

.theme-switch {
  margin-left: 16px;
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
  background-color: var(--text-hint);
  border-radius: 4px;
}

.menu-container::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
