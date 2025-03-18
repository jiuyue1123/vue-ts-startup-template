# Vue 3 + TypeScript 企业级启动模板

这是一个基于 Vue 3、TypeScript 和 Vite 的现代化前端开发模板，专为企业级应用设计，提供了主题切换、响应式布局和高性能组件。

## 演示图

![Vue TS 启动模板](https://nanak-img.oss-cn-beijing.aliyuncs.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250319003402.png)

![Vue TS 启动模板](https://nanak-img.oss-cn-beijing.aliyuncs.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250319003717.png)

## 📅 开发计划

### 近期计划

- [ ] 完善主题切换功能，添加自定义主题定制能力
- [ ] 优化侧边菜单组件，添加权限控制功能
- [ ] 实现全局消息通知系统
- [ ] 添加常用表单组件和验证逻辑

### 中期计划

- [ ] 集成 Mock 数据服务，便于前端独立开发
- [ ] 添加多语言国际化 (i18n) 支持
- [ ] 开发数据可视化图表模块
- [ ] 实现综合性 Dashboard 示例页面

### 长期计划

- [ ] 集成单元测试与端到端测试框架
- [ ] 性能优化与打包分析
- [ ] 微前端架构扩展支持
- [ ] 支持 SSR (服务端渲染) 模式

## ✨ 特性

- 🎨 **主题切换系统** - 内置亮色/暗色主题切换功能，支持自定义主题变量
- 📱 **响应式设计** - 自适应布局，从移动设备到大屏幕显示器
- 🧩 **企业级组件** - 基于 Element Plus 的高质量组件库
- 🚀 **快速开发** - Vite 提供极速的热更新和构建
- 🔒 **TypeScript 支持** - 完整的类型检查和智能提示
- 📦 **优化打包** - 生产环境的代码拆分和优化
- 🔍 **代码质量** - ESLint、Prettier 和 StyleLint 集成
- 🧪 **性能优化** - 动画性能和渲染优化
- 🌐 **环境配置** - 开发、测试、生产环境分离配置

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/jiuyue1123/vue-ts-startup-template.git

# 进入项目目录
cd vue-ts-startup-template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📦 构建与部署

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 清理项目
pnpm clean
```

## 📁 项目结构

```
src/
├── assets/        # 静态资源
├── layouts/       # 布局组件
│   ├── base-layout/     # 基础布局（带侧边栏）
│   ├── blank-layout/    # 空白布局
│   └── modules/         # 布局模块组件
├── router/        # 路由配置
├── service/       # API 服务和请求
├── typings/       # TypeScript 类型定义
├── utils/         # 工具函数
│   └── theme.ts   # 主题切换工具
├── views/         # 页面视图
├── App.vue        # 根组件
├── main.ts        # 入口文件
└── style.css      # 全局样式
```

## 🎨 主题系统

项目内置了亮色和暗色两套主题，通过 CSS 变量实现，支持无缝切换：

```css
/* 亮色主题 */
:root {
  --primary-color: #1890ff;
  --bg-color: #f0f2f5;
  --text-primary: rgba(0, 0, 0, 0.85);
  /* 更多变量... */
}

/* 暗色主题 */
.dark-theme {
  --primary-color: #177ddc;
  --bg-color: #141414;
  --text-primary: rgba(255, 255, 255, 0.85);
  /* 更多变量... */
}
```

使用 `toggleTheme()` 函数可在任何组件中切换主题：

```typescript
import { getStoredTheme, setTheme } from '@/utils/theme';

// 切换主题
function toggleTheme() {
  const theme = getStoredTheme() === 'light-theme' ? 'dark-theme' : 'light-theme';
  setTheme(theme);
}
```

## 📱 布局系统

项目包含多种布局选项：

- **基础布局 (BaseLayout)**: 包含侧边栏、头部和内容区域
- **空白布局 (BlankLayout)**: 无任何预设内容的空白页面

侧边栏支持折叠功能，点击折叠按钮可切换宽窄两种模式。

## 🧩 主要依赖

- Vue 3.5.x
- TypeScript 5.7.x
- Vite 6.2.x
- Element Plus 2.9.x
- Vue Router 4.x
- VueUse 13.x
- Alova (API 请求库)

## 🌐 环境配置

项目支持多环境配置：

- `.env` - 所有环境的默认配置
- `.env.dev` - 开发环境配置
- `.env.prod` - 生产环境配置

配置示例：

```
VITE_APP_TITLE=My App
VITE_BASE_URL=http://api.example.com
```

## 📄 代码规范

项目集成了以下代码质量工具：

- ESLint（代码质量检查）
- Prettier（代码格式化）
- StyleLint（CSS 代码质量检查）

运行代码检查：

```bash
pnpm lint
```

自动修复问题：

```bash
pnpm lint:fix
```

## 📚 学习资源

- [Vue 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/)

## 📝 License

[MIT](./LICENSE)
