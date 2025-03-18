<template>
  <ElMenu
    :default-active="activeRoute"
    class="el-menu-vertical"
    :collapse="isCollapse"
    :router="false"
    :unique-opened="true"
    :background-color="getMenuBgColor"
    :text-color="getMenuTextColor"
    :active-text-color="getActiveTextColor"
    @select="handleSelect"
  >
    <div class="logo-container">
      <h3 v-if="!isCollapse" class="logo-text"></h3>
      <!-- <h3 v-if="!isCollapse" class="logo-text">{{ appTitle }}</h3> -->
      <!-- <h3 v-else class="logo-text small">{{ getAppInitials }}</h3> -->
    </div>
    <menu-item
      v-for="route in topLevelRoutes"
      :key="route.path || route.name"
      :route="route"
      :is-first-level="true"
    />
  </ElMenu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MenuItem from '../modules/menu-item.vue';

export default defineComponent({
  name: 'GlobalMenu',
  components: {
    MenuItem,
  },
});
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import { isDarkMode } from '@/utils/theme';

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
  appTitle: {
    type: String,
    default: 'Vue TS App',
  },
});

const route = useRoute();
const router = useRouter();

// Get current active route path
const activeRoute = computed(() => {
  return route.fullPath;
});

// Get theme-based menu colors
const getMenuBgColor = computed(() => 'var(--menu-bg)');
const getMenuTextColor = computed(() => 'var(--menu-text-secondary)');
const getActiveTextColor = computed(() => 'var(--menu-active-text)');

// Get app initials for collapsed menu
const getAppInitials = computed(() => {
  if (!props.appTitle) return 'TS';

  return props.appTitle
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

// 只获取顶级路由，不递归处理子路由
const topLevelRoutes = computed(() => {
  const routes = router.getRoutes();
  return routes
    .filter((route) => {
      // 过滤掉带有hideInMenu元数据的路由
      return !(route.meta && route.meta.hideInMenu);
    })
    .filter((route) => {
      // 过滤掉没有组件的路由（如重定向路由）
      return route.name !== 'root' && route.name !== undefined;
    })
    .filter((route) => {
      // 只包含顶级路由（路径只有一段，如/home, /about等）
      const pathSegments = route.path.split('/').filter(Boolean);
      return pathSegments.length <= 1 && !route.path.includes('*');
    });
});

// Handle menu selection manually to ensure proper navigation
function handleSelect(index: string) {
  try {
    router.push(index);
  } catch (err) {
    console.error('Navigation error:', err);

    try {
      router.push({ name: index });
    } catch (nameErr) {
      console.error('Name navigation error:', nameErr);
    }
  }
}
</script>

<style scoped>
.el-menu-vertical {
  height: 100%;
  border-right: none;
  padding-top: 0;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow: hidden;
  will-change: width;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 240px;
}

.logo-container {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow: hidden;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.logo-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  will-change: transform, opacity;
  transform: translateZ(0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.logo-text.small {
  font-size: 16px;
}

:deep(.el-submenu__title):hover {
  background-color: var(--menu-hover-bg) !important;
}

:deep(.el-menu-item):hover {
  background-color: var(--menu-hover-bg) !important;
}

:deep(.el-menu-item.is-active),
:deep(.el-submenu.is-active > .el-submenu__title) {
  position: relative;
  z-index: 1;
}

:deep(.el-menu-item.is-active::before),
:deep(.el-submenu.is-active > .el-submenu__title::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 8px;
  bottom: 0;
  background-color: var(--menu-active-bg);
  border-radius: 0 22px 22px 0;
  z-index: -1;
  transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-menu-item.is-active),
:deep(.el-submenu.is-active > .el-submenu__title) {
  background-color: transparent !important;
  font-weight: 500;
}

:deep(.el-menu-item) {
  transition:
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
  border-radius: 0 22px 22px 0;
  margin-right: 8px;
  transform: translateZ(0);
  will-change: padding, background-color;
}

:deep(.el-submenu__title) {
  transition:
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
  border-radius: 0 22px 22px 0;
  margin-right: 8px;
  transform: translateZ(0);
  will-change: padding, background-color;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Fix for collapsible menu transitions */
:deep(.el-menu--collapse) {
  width: 64px !important;
}

:deep(.el-menu--collapse .el-submenu) {
  overflow: hidden;
}

:deep(.el-menu--collapse .el-menu-item span),
:deep(.el-menu--collapse .el-submenu__title span) {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

:deep(.el-menu--vertical .el-menu-item span),
:deep(.el-menu--vertical .el-submenu__title span) {
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}

:deep(.el-menu--collapse .el-menu-item .el-submenu__icon-arrow),
:deep(.el-menu--collapse .el-submenu .el-submenu__icon-arrow) {
  display: none;
}

/* Ensure smooth transition during width change */
:deep(.el-menu) {
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  will-change: width;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-submenu__title) {
  text-align: center;
  padding: 0 !important;
  transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}

/* Fix for text center alignment during collapsing */
:deep(.el-menu--collapse .el-menu-item .menu-icon),
:deep(.el-menu--collapse .el-submenu__title .menu-icon) {
  margin: 0;
  text-align: center;
  width: 100%;
  transform: translateZ(0);
}
</style>
