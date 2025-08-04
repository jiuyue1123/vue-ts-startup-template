# Vue3 + TypeScript 启动模板

这是一个基于 Vue 3 + TypeScript + Vite 的现代化前端项目启动模板，专为快速开发而设计。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 的组件库
- **Unocss** - 即时原子 CSS 引擎
- **Alova** - 轻量级数据请求库
- **Sass** - 预处理器
- **Pinia** - 轻量级状态管理
- **Vue DevTools** - Vue 3 的官方调试工具
- **ElegantRouter** - 文件路由管理
- **Czg** - 标准化commit message
- **f2elint** - 编码规范和代码质量工具

## ✨ 特性

### 🛠️ 开发环境

- **TypeScript 支持** - 完整的类型检查和智能提示
- **热重载** - 开发时快速刷新，提升开发效率
- **ESLint 集成** - 代码质量保证
- **模块化配置** - 分离的 TypeScript 配置文件
- **环境变量支持** - Vite 环境变量配置，定义在 .env 文件中，类型文件在src/typings/vite-env.d.ts 中
  - 类型化的环境变量定义
  - 开发/生产环境配置分离
  - 服务端接口配置支持
  - 安全的环境变量管理

### 🎨 UI 组件

- **Element Plus** - 企业级 UI 组件库
  - 丰富的组件库（按钮、表单、表格、导航等）
  - 响应式设计
  - 主题定制支持
  - 国际化支持

### 📦 构建工具

- **Vite** - 极速的开发服务器和构建工具
  - 快速的冷启动
  - 即时的热模块替换 (HMR)
  - 优化的生产构建

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📁 项目结构

```plain text
vue-ts-startup-template/
├── .vscode/                    # VS Code 配置
│   ├── settings.json          # 编辑器设置
│   └── extensions.json        # 推荐扩展
├── public/                     # 静态资源
│   └── vite.svg               # Vite 图标
├── src/
│   ├── assets/                # 项目资源文件
│   │   └── vue.svg           # Vue 图标
│   ├── components/            # Vue 组件目录
│   ├── layouts/               # 布局组件
│   │   ├── base/             # 基础布局
│   │   │   └── index.vue     # 基础布局组件
│   │   └── blank/            # 空白布局
│   │       └── index.vue     # 空白布局组件
│   ├── router/                # 路由配置
│   │   ├── _generated/       # 自动生成的路由
│   │   └── index.ts          # 路由入口
│   ├── service/               # 服务层
│   │   └── request/          # 请求配置
│   │       └── index.ts      # 请求工具
│   ├── styles/                # 样式文件
│   │   └── element/          # Element Plus 样式
│   │       └── index.scss    # Element 样式配置
│   ├── typings/               # TypeScript 类型定义
│   │   ├── app.d.ts          # 应用类型
│   │   ├── auto-imports.d.ts # 自动导入类型
│   │   ├── components.d.ts   # 组件类型
│   │   ├── elegant-router.d.ts # 路由类型
│   │   ├── typed-router.d.ts # 类型化路由
│   │   └── vite-env.d.ts     # Vite 环境类型
│   ├── views/                 # 页面组件
│   │   ├── 403/              # 403 错误页
│   │   ├── 404/              # 404 错误页
│   │   ├── 500/              # 500 错误页
│   │   ├── home/             # 首页
│   │   │   └── index.vue     # 首页组件
│   │   ├── login/            # 登录页
│   │   │   └── index.vue     # 登录组件
│   │   └── test/             # 测试页面
│   ├── App.vue               # 根组件
│   ├── main.ts               # 应用入口
│   └── style.css             # 全局样式
├── .editorconfig             # 编辑器配置
├── .gitignore                # Git 忽略文件
├── .prettierignore           # Prettier 忽略文件
├── .stylelintignore          # Stylelint 忽略文件
├── eslint.config.mjs         # ESLint 配置
├── index.html                # HTML 模板
├── package.json              # 项目配置
├── pnpm-lock.yaml           # pnpm 锁定文件
├── README.md                 # 项目说明
├── tsconfig.app.json         # 应用 TypeScript 配置
├── tsconfig.json             # TypeScript 根配置
├── tsconfig.node.json        # Node.js TypeScript 配置
├── uno.config.ts             # UnoCSS 配置
└── vite.config.ts            # Vite 配置
```

## 🔧 配置说明

### TypeScript 配置

- `tsconfig.json` - 项目根配置
- `tsconfig.app.json` - 应用配置
- `tsconfig.node.json` - Node.js 环境配置

### Vite 配置

- 支持 Vue 单文件组件
- 开发服务器配置
- 构建优化

## 🎯 集成功能

- ✅ Vue 3 Composition API
- ✅ TypeScript 类型支持
- ✅ Element Plus UI 组件库
- ✅ Vite 构建工具
- ✅ 热重载开发环境
- ✅ 生产构建优化
- ✅ 模块化 TypeScript 配置

## 📝 使用建议

1. **组件开发** - 在 `src/components/` 目录下创建可复用组件
2. **样式管理** - 使用 `src/style.css` 管理全局样式
3. **资源管理** - 将静态资源放在 `public/` 或 `src/assets/` 目录
4. **类型定义** - 充分利用 TypeScript 的类型系统提升代码质量

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个模板！

## 许可证

MIT License
