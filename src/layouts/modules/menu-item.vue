<template>
  <!-- 三种情况:
       1. 单一路由项，没有子路由
       2. 有一个子路由，其path为空字符串 - 需作为一级菜单项
       3. 有多个子路由 - 需作为可展开的子菜单
  -->

  <!-- 情况1和2: 单个菜单项 (无子路由或只有一个空路径子路由) -->
  <ElMenuItem v-if="!hasMultipleChildren" :index="getRouteIndex" @click="handleClick">
    <ElIcon v-if="route.meta && route.meta.icon" class="menu-icon">
      <component :is="route.meta.icon" />
    </ElIcon>
    <template #title>
      <span class="menu-title">{{ getMenuTitle }}</span>
    </template>
  </ElMenuItem>

  <!-- 情况3: 有多个子路由的菜单项，显示为可展开的子菜单 -->
  <ElSubMenu v-else :index="getRouteIndex" popper-class="menu-popper">
    <template #title>
      <ElIcon v-if="route.meta && route.meta.icon" class="menu-icon">
        <component :is="route.meta.icon" />
      </ElIcon>
      <span class="menu-title">{{ getMenuTitle }}</span>
    </template>

    <!-- 遍历并渲染子菜单项 -->
    <ElMenuItem
      v-for="child in visibleChildren"
      :key="child.path || child.name"
      :index="getChildPath(child)"
      @click="() => handleChildClick(child)"
    >
      <ElIcon v-if="child.meta && child.meta.icon" class="menu-icon">
        <component :is="child.meta.icon" />
      </ElIcon>
      <template #title>
        <span class="menu-title">{{ getChildTitle(child) }}</span>
      </template>
    </ElMenuItem>
  </ElSubMenu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
});
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteRecordRaw, RouteLocationRaw } from 'vue-router';

const router = useRouter();

const props = defineProps({
  route: {
    type: Object as () => RouteRecordRaw,
    required: true,
  },
  isFirstLevel: {
    type: Boolean,
    default: true,
  },
});

// 检查是否有子路由
const hasChildren = computed(() => {
  return props.route.children && props.route.children.length > 0;
});

// 检查是否有多个可见子路由，用于判断是否应显示为子菜单
const hasMultipleChildren = computed(() => {
  if (!props.route.children) return false;

  // 过滤掉隐藏的子路由
  const visibleChildren = props.route.children.filter(
    (child) => !(child.meta && child.meta.hideInMenu),
  );

  // 如果只有一个子路由且路径为空，则不视为多个子路由
  if (visibleChildren.length === 1 && visibleChildren[0].path === '') {
    return false;
  }

  return visibleChildren.length > 0;
});

// 获取可见的子路由
const visibleChildren = computed(() => {
  if (!props.route.children) return [];

  return props.route.children.filter((child) => !(child.meta && child.meta.hideInMenu));
});

// 从路由元数据或名称获取菜单项标题
const getMenuTitle = computed(() => {
  // 首先检查路由本身是否有标题
  if (props.route.meta && props.route.meta.title) {
    return props.route.meta.title;
  }

  // 其次检查是否有单个空路径子路由，如果有使用其标题
  if (hasChildren.value && props.route.children) {
    const emptyPathChild = props.route.children.find((child) => child.path === '');
    if (emptyPathChild && emptyPathChild.meta && emptyPathChild.meta.title) {
      return emptyPathChild.meta.title;
    }
  }

  // 最后回退到路由名称
  return props.route.name || '';
});

// 获取子菜单项的标题
function getChildTitle(child: RouteRecordRaw) {
  if (child.meta && child.meta.title) {
    return child.meta.title;
  }
  return child.name || '';
}

// 获取路由索引（用于菜单项的索引值）
const getRouteIndex = computed(() => {
  // 优先使用路径
  if (props.route.path) {
    return props.route.path;
  }
  // 回退到名称
  return props.route.name ? String(props.route.name) : '';
});

// 获取子路由的完整路径
function getChildPath(child: RouteRecordRaw): string {
  // 对于空路径子路由，使用父路由路径
  if (child.path === '') {
    return props.route.path;
  }

  // 对于相对路径（不以/开头）
  if (child.path && !child.path.startsWith('/')) {
    // 确保父路径不以/结尾
    const parentPath = props.route.path.endsWith('/')
      ? props.route.path.slice(0, -1)
      : props.route.path;
    return `${parentPath}/${child.path}`;
  }

  // 对于绝对路径，直接返回
  return child.path || (child.name ? String(child.name) : '');
}

// 处理菜单项点击
function handleClick() {
  // 检查是否有单个空路径子路由
  if (hasChildren.value && props.route.children) {
    const emptyPathChild = props.route.children.find((child) => child.path === '');
    if (emptyPathChild) {
      navigateTo(props.route.path);
      return;
    }
  }

  // 直接导航到路由路径
  if (props.route.path) {
    navigateTo(props.route.path);
  } else if (props.route.name) {
    navigateTo({ name: props.route.name });
  }
}

// 处理子菜单项点击
function handleChildClick(child: RouteRecordRaw) {
  // 空路径子路由
  if (child.path === '') {
    navigateTo(props.route.path);
    return;
  }

  // 相对路径子路由
  if (child.path && !child.path.startsWith('/')) {
    const parentPath = props.route.path.endsWith('/')
      ? props.route.path.slice(0, -1)
      : props.route.path;
    navigateTo(`${parentPath}/${child.path}`);
    return;
  }

  // 绝对路径子路由
  if (child.path) {
    navigateTo(child.path);
  } else if (child.name) {
    navigateTo({ name: child.name });
  }
}

// 统一处理导航
function navigateTo(to: RouteLocationRaw) {
  router.push(to).catch((err) => {
    console.error('Navigation error:', err);
  });
}
</script>

<style scoped>
.menu-icon {
  margin-right: 10px;
  width: 24px;
  text-align: center;
  color: var(--menu-text-secondary);
  font-size: 18px;
  transition:
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform: translateZ(0);
  will-change: color, margin, opacity;
  -webkit-font-smoothing: antialiased;
  opacity: 0.85;
}

.menu-title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition:
    opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform: translateZ(0);
  will-change: opacity, color;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
  letter-spacing: 0.2px;
}

:deep(.el-menu--popup) {
  background-color: var(--menu-submenu-bg) !important;
  min-width: 180px;
  border-radius: 4px;
  padding: 4px 0;
  box-shadow:
    0 6px 16px -8px rgba(0, 0, 0, 0.32),
    0 9px 28px 0 rgba(0, 0, 0, 0.2),
    0 12px 48px 16px rgba(0, 0, 0, 0.12);
  transform-origin: center top;
  animation: el-zoom-in 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: opacity, transform;
}

@keyframes el-zoom-in {
  0% {
    opacity: 0;
    transform: scaleY(0.8);
  }

  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

:deep(.el-menu--popup .el-menu-item) {
  background-color: var(--menu-submenu-bg);
  color: var(--menu-text-secondary);
  height: 40px;
  line-height: 40px;
  margin: 4px 8px;
  border-radius: 4px;
  padding: 0 16px !important;
  transition:
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  transform: translateZ(0);
  will-change: background-color;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background-color: var(--menu-hover-bg) !important;
}

:deep(.el-menu--popup .el-menu-item.is-active) {
  background-color: var(--menu-active-bg) !important;
  color: var(--menu-active-text);
}

:deep(.el-menu-item:hover .menu-icon),
:deep(.el-submenu__title:hover .menu-icon) {
  opacity: 1;
}

:deep(.el-menu-item.is-active .menu-icon),
:deep(.el-submenu.is-active .menu-icon) {
  color: var(--menu-active-text);
  opacity: 1;
}

/* Prevent flicker during transitions */
:deep(.el-submenu__title),
:deep(.el-menu-item) {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Ensure text stays aligned properly during transitions */
:deep(.el-menu-item .el-tooltip__trigger),
:deep(.el-submenu__title .el-tooltip__trigger) {
  display: flex;
  align-items: center;
}
</style>
