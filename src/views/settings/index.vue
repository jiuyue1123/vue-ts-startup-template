<template>
  <div class="settings-container">
    <ElRow :gutter="20">
      <ElCol :span="6">
        <ElCard class="settings-menu-card">
          <div class="settings-menu">
            <div class="menu-title">
              <h3>设置</h3>
            </div>
            <ElMenu
              :default-active="activeMenu"
              class="settings-menu-list"
              @select="handleMenuSelect"
            >
              <ElMenuItem index="general">
                <ElIcon>
                  <Setting />
                </ElIcon>
                <span>通用设置</span>
              </ElMenuItem>
              <ElMenuItem index="appearance">
                <ElIcon>
                  <Brush />
                </ElIcon>
                <span>外观与主题</span>
              </ElMenuItem>
              <ElMenuItem index="notifications">
                <ElIcon>
                  <Bell />
                </ElIcon>
                <span>通知设置</span>
              </ElMenuItem>
              <ElMenuItem index="privacy">
                <ElIcon>
                  <Lock />
                </ElIcon>
                <span>隐私设置</span>
              </ElMenuItem>
              <ElMenuItem index="accessibility">
                <ElIcon>
                  <View />
                </ElIcon>
                <span>辅助功能</span>
              </ElMenuItem>
            </ElMenu>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="18">
        <!-- 通用设置 -->
        <ElCard v-show="activeMenu === 'general'" class="settings-content-card">
          <template #header>
            <div class="card-header">
              <h3>通用设置</h3>
              <ElButton type="primary" size="small" @click="saveSettings('general')"
                >保存设置</ElButton
              >
            </div>
          </template>
          <ElForm label-width="120px">
            <ElFormItem label="默认主页">
              <ElSelect v-model="generalSettings.defaultPage" placeholder="选择默认进入页面">
                <ElOption label="仪表盘" value="dashboard" />
                <ElOption label="项目列表" value="projects" />
                <ElOption label="任务管理" value="tasks" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="语言">
              <ElSelect v-model="generalSettings.language" placeholder="选择语言">
                <ElOption label="简体中文" value="zh-CN" />
                <ElOption label="English" value="en-US" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="时区">
              <ElSelect v-model="generalSettings.timezone" placeholder="选择时区">
                <ElOption label="北京时间 (GMT+8)" value="GMT+8" />
                <ElOption label="格林威治标准时间 (GMT)" value="GMT" />
                <ElOption label="纽约 (GMT-5)" value="GMT-5" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="日期格式">
              <ElRadioGroup v-model="generalSettings.dateFormat">
                <ElRadio label="yyyy-MM-dd">2023-01-01</ElRadio>
                <ElRadio label="dd/MM/yyyy">01/01/2023</ElRadio>
                <ElRadio label="MM/dd/yyyy">01/01/2023</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <!-- 外观与主题 -->
        <ElCard v-show="activeMenu === 'appearance'" class="settings-content-card">
          <template #header>
            <div class="card-header">
              <h3>外观与主题</h3>
              <div class="header-actions">
                <ElButton plain size="small" @click="resetToDefaultTheme">
                  <ElIcon>
                    <RefreshRight />
                  </ElIcon>
                  重置为默认主题
                </ElButton>
                <ElButton
                  type="primary"
                  size="small"
                  @click="saveSettings('appearance')"
                  :loading="isProcessing"
                >
                  保存设置
                </ElButton>
              </div>
            </div>
          </template>

          <ElForm label-width="120px">
            <ElFormItem label="主题模式">
              <ElRadioGroup v-model="appearanceSettings.theme">
                <ElRadio label="light-theme">
                  <div class="theme-option">
                    <div class="theme-preview light-preview"></div>
                    <span>亮色模式</span>
                  </div>
                </ElRadio>
                <ElRadio label="dark-theme">
                  <div class="theme-option">
                    <div class="theme-preview dark-preview"></div>
                    <span>暗色模式</span>
                  </div>
                </ElRadio>
                <ElRadio label="auto">
                  <div class="theme-option">
                    <div class="theme-preview auto-preview">
                      <div class="auto-preview-light"></div>
                      <div class="auto-preview-dark"></div>
                    </div>
                    <span>跟随系统</span>
                  </div>
                </ElRadio>
              </ElRadioGroup>
            </ElFormItem>

            <ElFormItem label="主题色">
              <div class="color-options">
                <div
                  v-for="color in primaryColors"
                  :key="color.value"
                  class="color-item"
                  :style="{ backgroundColor: color.value }"
                  :class="{ active: appearanceSettings.primaryColor === color.value }"
                  @click="appearanceSettings.primaryColor = color.value"
                >
                  <ElIcon v-if="appearanceSettings.primaryColor === color.value" class="check-icon">
                    <Check />
                  </ElIcon>
                </div>
                <ElTooltip content="自定义颜色" placement="top">
                  <ElColorPicker
                    v-model="appearanceSettings.primaryColor"
                    size="small"
                    show-alpha
                    :predefine="primaryColors.map((c) => c.value)"
                  />
                </ElTooltip>
              </div>
              <div class="theme-preview-panel">
                <div class="preview-item">
                  <ElButton type="primary">主按钮</ElButton>
                  <ElButton type="primary" plain>次按钮</ElButton>
                </div>
                <div class="preview-item">
                  <ElSwitch v-model="dummySwitch" />
                  <ElCheckbox v-model="dummyCheckbox">复选框</ElCheckbox>
                </div>
                <div class="preview-item" v-if="appearanceSettings.enableAnimations">
                  <ElTooltip content="动画效果预览" placement="top">
                    <div class="animation-demo">
                      <div class="animation-box"></div>
                    </div>
                  </ElTooltip>
                  <span class="setting-hint">此效果展示当前主题的动画效果</span>
                </div>
              </div>
            </ElFormItem>

            <ElFormItem label="菜单紧凑模式">
              <ElSwitch v-model="appearanceSettings.menuCompact" />
              <span class="setting-hint">减少菜单项间距，显示更多内容</span>
            </ElFormItem>

            <ElFormItem label="动画效果">
              <ElSwitch v-model="appearanceSettings.enableAnimations" />
              <span class="setting-hint">启用界面过渡动画效果</span>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <!-- 通知设置 -->
        <ElCard v-show="activeMenu === 'notifications'" class="settings-content-card">
          <template #header>
            <div class="card-header">
              <h3>通知设置</h3>
              <ElButton type="primary" size="small" @click="saveSettings('notifications')"
                >保存设置</ElButton
              >
            </div>
          </template>

          <ElForm label-width="0">
            <h4 class="settings-section-title">应用内通知</h4>
            <ElDivider />

            <div class="notification-settings">
              <div class="notification-item">
                <div class="notification-info">
                  <h5>系统通知</h5>
                  <p>接收关于系统更新、维护的提醒</p>
                </div>
                <ElSwitch v-model="notificationSettings.systemNotifications" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <h5>新消息通知</h5>
                  <p>接收新消息的实时提醒</p>
                </div>
                <ElSwitch v-model="notificationSettings.messageNotifications" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <h5>任务提醒</h5>
                  <p>接收任务到期和更新的提醒</p>
                </div>
                <ElSwitch v-model="notificationSettings.taskNotifications" />
              </div>

              <h4 class="settings-section-title">邮件通知</h4>
              <ElDivider />

              <div class="notification-item">
                <div class="notification-info">
                  <h5>邮件摘要</h5>
                  <p>接收每周活动摘要邮件</p>
                </div>
                <ElSelect v-model="notificationSettings.emailDigest" style="width: 120px">
                  <ElOption label="每天" value="daily" />
                  <ElOption label="每周" value="weekly" />
                  <ElOption label="每月" value="monthly" />
                  <ElOption label="从不" value="never" />
                </ElSelect>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <h5>重要通知</h5>
                  <p>接收关键操作和安全相关的邮件</p>
                </div>
                <ElSwitch v-model="notificationSettings.importantEmails" />
              </div>
            </div>
          </ElForm>
        </ElCard>

        <!-- 隐私设置 -->
        <ElCard v-show="activeMenu === 'privacy'" class="settings-content-card">
          <template #header>
            <div class="card-header">
              <h3>隐私设置</h3>
              <ElButton type="primary" size="small" @click="saveSettings('privacy')"
                >保存设置</ElButton
              >
            </div>
          </template>

          <ElForm label-width="0">
            <h4 class="settings-section-title">数据与隐私</h4>
            <ElDivider />

            <div class="privacy-settings">
              <div class="privacy-item">
                <div class="privacy-info">
                  <h5>数据收集</h5>
                  <p>允许收集使用数据以改进产品体验</p>
                </div>
                <ElSwitch v-model="privacySettings.dataCollection" />
              </div>

              <div class="privacy-item">
                <div class="privacy-info">
                  <h5>个人资料可见性</h5>
                  <p>控制您的个人资料对其他用户的可见程度</p>
                </div>
                <ElSelect v-model="privacySettings.profileVisibility" style="width: 120px">
                  <ElOption label="公开" value="public" />
                  <ElOption label="仅团队" value="team" />
                  <ElOption label="私密" value="private" />
                </ElSelect>
              </div>

              <div class="privacy-item">
                <div class="privacy-info">
                  <h5>在线状态</h5>
                  <p>显示您的在线状态给其他用户</p>
                </div>
                <ElSwitch v-model="privacySettings.onlineStatus" />
              </div>

              <div class="privacy-item">
                <div class="privacy-info">
                  <h5>搜索历史</h5>
                  <p>保存您的搜索历史记录</p>
                </div>
                <ElSwitch v-model="privacySettings.searchHistory" />
              </div>

              <ElDivider />
              <div class="danger-zone">
                <h4 class="settings-section-title danger-title">危险区域</h4>
                <div class="danger-actions">
                  <ElButton type="danger" plain @click="showClearDataDialog = true">
                    清除所有数据
                  </ElButton>
                  <ElButton type="danger" @click="showDeleteAccountDialog = true">
                    删除账号
                  </ElButton>
                </div>
              </div>
            </div>
          </ElForm>
        </ElCard>

        <!-- 辅助功能 -->
        <ElCard v-show="activeMenu === 'accessibility'" class="settings-content-card">
          <template #header>
            <div class="card-header">
              <h3>辅助功能</h3>
              <ElButton type="primary" size="small" @click="saveSettings('accessibility')"
                >保存设置</ElButton
              >
            </div>
          </template>

          <ElForm label-width="120px">
            <ElFormItem label="字体大小">
              <ElSlider v-model="accessibilitySettings.fontSize" :min="12" :max="20" :step="1" />
              <span
                class="font-size-demo"
                :style="{ fontSize: `${accessibilitySettings.fontSize}px` }"
              >
                示例文本大小
              </span>
            </ElFormItem>

            <ElFormItem label="对比度">
              <ElRadioGroup v-model="accessibilitySettings.contrast">
                <ElRadio label="normal">正常</ElRadio>
                <ElRadio label="high">高对比度</ElRadio>
              </ElRadioGroup>
            </ElFormItem>

            <ElFormItem label="减弱动画">
              <ElSwitch v-model="accessibilitySettings.reduceMotion" />
              <span class="setting-hint">减少页面上的动画效果</span>
            </ElFormItem>

            <ElFormItem label="键盘导航">
              <ElSwitch v-model="accessibilitySettings.keyboardNavigation" />
              <span class="setting-hint">启用键盘快捷键导航</span>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 删除账号对话框 -->
    <ElDialog v-model="showDeleteAccountDialog" title="删除账号" width="500px">
      <div class="delete-account-dialog">
        <ElAlert
          title="此操作不可逆"
          type="error"
          description="删除账号后，您的所有数据将被永久删除，且无法恢复。"
          show-icon
          :closable="false"
        />
        <p class="dialog-text">请输入您的密码确认删除账号：</p>
        <ElInput
          v-model="deleteAccountPassword"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </div>
      <template #footer>
        <ElButton @click="showDeleteAccountDialog = false">取消</ElButton>
        <ElButton type="danger" @click="handleDeleteAccount" :loading="isProcessing">
          确认删除
        </ElButton>
      </template>
    </ElDialog>

    <!-- 清除数据对话框 -->
    <ElDialog v-model="showClearDataDialog" title="清除所有数据" width="500px">
      <div class="clear-data-dialog">
        <ElAlert
          title="此操作不可逆"
          type="warning"
          description="清除后，您的个人数据将被删除，但账号会保留。"
          show-icon
          :closable="false"
        />
        <ElCheckboxGroup v-model="dataToClear">
          <p class="dialog-text">请选择要清除的数据：</p>
          <div class="clear-data-options">
            <ElCheckbox label="browsing_history">浏览历史</ElCheckbox>
            <ElCheckbox label="preferences">偏好设置</ElCheckbox>
            <ElCheckbox label="messages">消息记录</ElCheckbox>
            <ElCheckbox label="activities">活动记录</ElCheckbox>
          </div>
        </ElCheckboxGroup>
      </div>
      <template #footer>
        <ElButton @click="showClearDataDialog = false">取消</ElButton>
        <ElButton type="warning" @click="handleClearData" :loading="isProcessing">
          确认清除
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Setting, Brush, Bell, Lock, View, RefreshRight, Check } from '@element-plus/icons-vue';
import {
  getStoredTheme,
  setTheme,
  getStoredThemeVars,
  setThemeVars,
  applyStoredTheme,
  type ThemeMode,
  type ThemeVars,
} from '@/utils/theme';

// 当前激活的菜单
const activeMenu = ref('appearance');

// 是否处理中
const isProcessing = ref(false);

// 对话框控制
const showDeleteAccountDialog = ref(false);
const showClearDataDialog = ref(false);
const deleteAccountPassword = ref('');
const dataToClear = ref<string[]>([]);

// 通用设置
const generalSettings = reactive({
  defaultPage: localStorage.getItem('generalSettings')
    ? JSON.parse(localStorage.getItem('generalSettings') || '{}').defaultPage || 'dashboard'
    : 'dashboard',
  language: localStorage.getItem('generalSettings')
    ? JSON.parse(localStorage.getItem('generalSettings') || '{}').language || 'zh-CN'
    : 'zh-CN',
  timezone: localStorage.getItem('generalSettings')
    ? JSON.parse(localStorage.getItem('generalSettings') || '{}').timezone || 'GMT+8'
    : 'GMT+8',
  dateFormat: localStorage.getItem('generalSettings')
    ? JSON.parse(localStorage.getItem('generalSettings') || '{}').dateFormat || 'yyyy-MM-dd'
    : 'yyyy-MM-dd',
});

// 外观设置
const appearanceSettings = reactive({
  theme: getStoredTheme(),
  primaryColor: getStoredThemeVars().primaryColor,
  enableAnimations: getStoredThemeVars().enableAnimations,
  menuCompact: getStoredThemeVars().menuCompact,
});

// 预定义的主题色
const primaryColors = [
  { name: '蓝色', value: '#409EFF' },
  { name: '青色', value: '#36B4C1' },
  { name: '绿色', value: '#67C23A' },
  { name: '橙色', value: '#E09A43' },
  { name: '红色', value: '#E05D5D' },
  { name: '紫色', value: '#7952B3' },
  { name: '黑色', value: '#303133' },
];

// 通知设置
const notificationSettings = reactive({
  systemNotifications: localStorage.getItem('notificationSettings')
    ? JSON.parse(localStorage.getItem('notificationSettings') || '{}').systemNotifications !== false
    : true,
  messageNotifications: localStorage.getItem('notificationSettings')
    ? JSON.parse(localStorage.getItem('notificationSettings') || '{}').messageNotifications !==
      false
    : true,
  taskNotifications: localStorage.getItem('notificationSettings')
    ? JSON.parse(localStorage.getItem('notificationSettings') || '{}').taskNotifications !== false
    : true,
  emailDigest: localStorage.getItem('notificationSettings')
    ? JSON.parse(localStorage.getItem('notificationSettings') || '{}').emailDigest || 'weekly'
    : 'weekly',
  importantEmails: localStorage.getItem('notificationSettings')
    ? JSON.parse(localStorage.getItem('notificationSettings') || '{}').importantEmails !== false
    : true,
});

// 隐私设置
const privacySettings = reactive({
  dataCollection: localStorage.getItem('privacySettings')
    ? JSON.parse(localStorage.getItem('privacySettings') || '{}').dataCollection !== false
    : true,
  profileVisibility: localStorage.getItem('privacySettings')
    ? JSON.parse(localStorage.getItem('privacySettings') || '{}').profileVisibility || 'team'
    : 'team',
  onlineStatus: localStorage.getItem('privacySettings')
    ? JSON.parse(localStorage.getItem('privacySettings') || '{}').onlineStatus !== false
    : true,
  searchHistory: localStorage.getItem('privacySettings')
    ? JSON.parse(localStorage.getItem('privacySettings') || '{}').searchHistory !== false
    : true,
});

// 辅助功能设置
const accessibilitySettings = reactive({
  fontSize: localStorage.getItem('accessibilitySettings')
    ? JSON.parse(localStorage.getItem('accessibilitySettings') || '{}').fontSize || 14
    : 14,
  contrast: localStorage.getItem('accessibilitySettings')
    ? JSON.parse(localStorage.getItem('accessibilitySettings') || '{}').contrast || 'normal'
    : 'normal',
  reduceMotion: localStorage.getItem('accessibilitySettings')
    ? JSON.parse(localStorage.getItem('accessibilitySettings') || '{}').reduceMotion === true
    : false,
  keyboardNavigation: localStorage.getItem('accessibilitySettings')
    ? JSON.parse(localStorage.getItem('accessibilitySettings') || '{}').keyboardNavigation === true
    : false,
});

// UI预览用的临时状态
const dummySwitch = ref(true);
const dummyCheckbox = ref(true);

// 默认主题变量
const defaultThemeVars = {
  primaryColor: '#409EFF',
  enableAnimations: true,
  menuCompact: false,
};

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeMenu.value = key;
};

// 预览主题变化
const previewTheme = () => {
  // 应用主题色
  const root = document.documentElement;
  root.style.setProperty('--primary-color', appearanceSettings.primaryColor);

  // 生成衍生颜色
  const adjustColor = (color: string, amount: number, satAmount: number = 0): string => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const bigint = parseInt(hex, 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;

      // 简化的HSL转换和调整，仅用于预览
      // 计算亮度和饱和度
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;

      // 对高饱和度颜色降低更多饱和度
      let factor = 1 + amount / 255;
      if (max - min > 0.5 && satAmount > 0) {
        satAmount -= 5;
      }

      // 应用饱和度调整
      const avgColor = (r + g + b) / 3;
      const satFactor = 1 + satAmount / 100;

      r = Math.min(Math.max(avgColor + (r - avgColor) * satFactor, 0), 255);
      g = Math.min(Math.max(avgColor + (g - avgColor) * satFactor, 0), 255);
      b = Math.min(Math.max(avgColor + (b - avgColor) * satFactor, 0), 255);

      // 应用亮度调整
      r = Math.min(Math.max(r * factor, 0), 255);
      g = Math.min(Math.max(g * factor, 0), 255);
      b = Math.min(Math.max(b * factor, 0), 255);

      return (
        '#' +
        ((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).padStart(6, '0')
      );
    }
    return color;
  };

  const primaryHoverColor = adjustColor(appearanceSettings.primaryColor, 15, -3);
  const primaryActiveColor = adjustColor(appearanceSettings.primaryColor, -15, 3);

  root.style.setProperty('--primary-hover', primaryHoverColor);
  root.style.setProperty('--primary-active', primaryActiveColor);
  root.style.setProperty('--collapse-btn-bg', appearanceSettings.primaryColor);
  root.style.setProperty('--collapse-btn-hover', primaryHoverColor);

  // 应用动画设置
  if (!appearanceSettings.enableAnimations) {
    root.style.setProperty('--transition-duration', '0s');
    root.classList.add('no-animations');
  } else {
    root.style.removeProperty('--transition-duration');
    root.classList.remove('no-animations');
  }

  // 应用菜单紧凑模式
  if (appearanceSettings.menuCompact) {
    root.classList.add('menu-compact');
  } else {
    root.classList.remove('menu-compact');
  }
};

// 应用辅助功能设置
const applyAccessibilitySettings = () => {
  const root = document.documentElement;

  // 应用字体大小
  root.style.setProperty('--base-font-size', `${accessibilitySettings.fontSize}px`);

  // 应用对比度设置
  if (accessibilitySettings.contrast === 'high') {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // 应用减弱动画设置
  if (accessibilitySettings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
};

// 保存设置
const saveSettings = async (type: string) => {
  isProcessing.value = true;
  try {
    // 根据不同的设置类型处理
    if (type === 'appearance') {
      // 保存主题设置
      await setTheme(appearanceSettings.theme as ThemeMode);
      await setThemeVars({
        primaryColor: appearanceSettings.primaryColor,
        enableAnimations: appearanceSettings.enableAnimations,
        menuCompact: appearanceSettings.menuCompact,
      });

      // 应用主题预览
      previewTheme();
      ElMessage.success('外观设置已保存');
    } else if (type === 'general') {
      // 保存通用设置
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      ElMessage.success('通用设置已保存');
    } else if (type === 'notifications') {
      // 保存通知设置
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      ElMessage.success('通知设置已保存');
    } else if (type === 'privacy') {
      // 保存隐私设置
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      ElMessage.success('隐私设置已保存');
    } else if (type === 'accessibility') {
      // 保存辅助功能设置
      localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
      applyAccessibilitySettings();
      ElMessage.success('辅助功能设置已保存');
    }
  } catch (error) {
    console.error('保存设置失败', error);
    ElMessage.error('保存设置失败，请重试');
  } finally {
    isProcessing.value = false;
  }
};

// 重置为默认主题
const resetToDefaultTheme = async () => {
  try {
    isProcessing.value = true;
    await setTheme('light-theme');
    await setThemeVars(defaultThemeVars);

    // 更新本地状态
    appearanceSettings.theme = 'light-theme';
    appearanceSettings.primaryColor = defaultThemeVars.primaryColor;
    appearanceSettings.enableAnimations = defaultThemeVars.enableAnimations;
    appearanceSettings.menuCompact = defaultThemeVars.menuCompact;

    // 应用主题预览
    previewTheme();
    ElMessage.success('已重置为默认主题');
  } catch (error) {
    console.error('重置主题失败', error);
    ElMessage.error('重置主题失败，请重试');
  } finally {
    isProcessing.value = false;
  }
};

// 监听主题色变化实时预览
watch(
  () => appearanceSettings.primaryColor,
  () => {
    previewTheme();
  },
);

// 监听动画开关变化
watch(
  () => appearanceSettings.enableAnimations,
  () => {
    previewTheme();
  },
);

// 监听菜单紧凑模式变化
watch(
  () => appearanceSettings.menuCompact,
  () => {
    previewTheme();
  },
);

// 监听主题模式变化
watch(
  () => appearanceSettings.theme,
  () => {
    setTheme(appearanceSettings.theme as ThemeMode);
  },
);

// 监听辅助功能设置变化
watch(
  accessibilitySettings,
  () => {
    applyAccessibilitySettings();
  },
  { deep: true },
);

// 初始化
onMounted(() => {
  // 应用主题和主题变量
  applyStoredTheme();

  // 应用主题预览
  previewTheme();

  // 应用辅助功能设置
  applyAccessibilitySettings();
});

// 删除账号
const handleDeleteAccount = () => {
  if (!deleteAccountPassword.value) {
    ElMessage.error('请输入密码');
    return;
  }

  isProcessing.value = true;

  // 模拟API请求
  setTimeout(() => {
    isProcessing.value = false;
    showDeleteAccountDialog.value = false;
    deleteAccountPassword.value = '';

    ElMessageBox.alert('您的账号已成功删除', '操作成功', {
      confirmButtonText: '确定',
      callback: () => {
        // 实际项目中应跳转到登出页面
        window.location.href = '/login';
      },
    });
  }, 1000);
};

// 清除数据
const handleClearData = () => {
  if (dataToClear.value.length === 0) {
    ElMessage.error('请选择要清除的数据');
    return;
  }

  isProcessing.value = true;

  // 模拟API请求
  setTimeout(() => {
    isProcessing.value = false;
    showClearDataDialog.value = false;
    dataToClear.value = [];

    ElMessage.success('数据清除成功');
  }, 1000);
};
</script>

<style scoped>
.settings-container {
  padding: 20px 0;
}

.settings-menu-card,
.settings-content-card {
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s;
  margin-bottom: 20px;
  background-color: var(--card-bg);
}

.settings-menu {
  display: flex;
  flex-direction: column;
}

.menu-title {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.menu-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-menu-list {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 46px;
  line-height: 46px;
}

/* 菜单紧凑模式 */
:deep(.menu-compact .el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-section-title {
  margin: 16px 0 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.theme-preview {
  width: 40px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.light-preview {
  background-color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.dark-preview {
  background-color: #1a1a1a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.auto-preview {
  position: relative;
  display: flex;
}

.auto-preview-light {
  width: 50%;
  height: 100%;
  background-color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.auto-preview-dark {
  width: 50%;
  height: 100%;
  background-color: #1a1a1a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.color-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.color-item {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-item.active {
  transform: scale(1.1);
  border-color: var(--border-color);
}

.color-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-settings,
.privacy-settings {
  padding: 8px 0;
}

.notification-item,
.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.notification-info h5,
.privacy-info h5 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.notification-info p,
.privacy-info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.danger-zone {
  padding: 16px 0;
}

.danger-title {
  color: #f56c6c;
}

.danger-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.dialog-text {
  margin: 16px 0;
  font-size: 14px;
}

.delete-account-dialog,
.clear-data-dialog {
  padding: 0 8px;
}

.clear-data-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.font-size-demo {
  display: inline-block;
  margin-left: 16px;
  color: var(--text-primary);
  transition: font-size 0.3s;
}

.setting-hint {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.theme-preview-panel {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--component-bg);
}

.preview-item {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.check-icon {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
}

.animation-demo {
  width: 50px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.animation-box {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

/* 高对比度模式 */
:global(.high-contrast) {
  --text-primary: #000000;
  --text-secondary: #333333;
  --border-color: #000000;
  --component-bg: #ffffff;
  --card-bg: #ffffff;
  --card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}

:global(.dark.high-contrast) {
  --text-primary: #ffffff;
  --text-secondary: #dddddd;
  --border-color: #ffffff;
  --component-bg: #000000;
  --card-bg: #000000;
  --card-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.2);
}

/* 减弱动画 */
:global(.reduce-motion) * {
  animation-duration: 0.001s !important;
  transition-duration: 0.001s !important;
}
</style>
