<script setup lang="ts">
import { onMounted } from 'vue';
import { applyStoredTheme } from '@/utils/theme';

// 初始化主题
onMounted(() => {
  applyStoredTheme();
});
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-size: var(--base-font-size);
  line-height: var(--line-height);
  color: var(--text-primary);
  background-color: var(--bg-color);
  transition: background-color var(--transition-duration) var(--transition-timing);
}

/* 应用全局样式 */
#app {
  width: 100%;
  height: 100vh;
  transition: all var(--transition-duration) var(--transition-timing);
}
</style>
