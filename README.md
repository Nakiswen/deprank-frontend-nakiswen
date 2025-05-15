# DepRank - 开源贡献度分析与分配系统

DepRank是一个用于跟踪软件项目之间依赖关系和贡献度的开源系统，旨在提高开源协作的透明度和效率。该项目使用Next.js 15和React 19构建，采用TypeScript和TailwindCSS进行开发。

## 项目概述

DepRank提供以下核心功能：

- **依赖关系分析**：追踪项目之间的依赖关系图谱
- **贡献度评估**：分析和展示开发者对各个依赖包的贡献度
- **代码片段查看**：支持高亮显示特定依赖包的代码片段
- **贡献度分配**：允许用户申领对特定依赖包的贡献

## 技术栈

- **前端框架**：Next.js 15 (App Router)、React 19
- **样式**：TailwindCSS 3.4
- **语言**：TypeScript 5
- **代码高亮**：highlight.js 11
- **构建工具**：Turbopack

## 项目结构

```
deprank-frontend/
├── src/
│   ├── app/                    # Next.js App Router路由
│   │   ├── dependency/[name]/  # 依赖包详情页
│   │   ├── analysis/           # 贡献度分析页
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 布局组件
│   │   └── page.tsx            # 首页
│   ├── components/             # 可复用组件
│   │   ├── Background.tsx      # 背景组件
│   │   ├── CodeBlock.tsx       # 代码块展示组件
│   │   ├── Footer.tsx          # 页脚组件
│   │   └── Navbar.tsx          # 导航栏组件
├── public/                     # 静态资源
├── assets/                     # 项目资源
└── designs/                    # 设计资源
```

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm 9+

### 安装依赖

```bash
# 使用pnpm (推荐)
pnpm install

# 或使用npm
npm install
```

### 开发模式

```bash
# 使用Turbopack启动开发服务器
pnpm dev

# 或使用npm
npm run dev
```

开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

### 启动生产服务器

```bash
pnpm start
# 或
npm run start
```

## 主要页面

1. **首页** (`/`)
   - 提供搜索功能，允许用户通过GitHub仓库URL查找依赖包
   - 支持键盘快捷键（⌘+K）快速访问搜索

2. **依赖详情页** (`/dependency/[name]`)
   - 展示特定依赖包的详细信息
   - 显示代码片段，支持语法高亮
   - 提供贡献度信息和申领功能

3. **分析页** (`/analysis`)
   - 列出所有依赖包及其贡献者信息
   - 提供搜索和筛选功能
   - 可视化展示贡献度百分比

## 组件说明

### CodeBlock

代码块展示组件，支持：
- 语法高亮（基于highlight.js）
- 行号显示
- 文件名显示
- 自定义起始行号

### Navbar

顶部导航栏组件，包含项目Logo和导航链接。

### Background

页面背景组件，提供视觉效果。

### Footer

页脚组件，包含版权信息和链接。

## 开发指南

### 添加新页面

1. 在`src/app`目录下创建新文件夹和`page.tsx`文件
2. 使用Next.js的App Router路由规则进行路由配置

### 添加新组件

1. 在`src/components`目录下创建新的`.tsx`文件
2. 遵循现有组件的命名和结构规范
3. 使用TailwindCSS进行样式设计

### 代码规范

- 使用TypeScript类型定义确保类型安全
- 遵循React函数组件和Hooks的最佳实践
- 使用ESLint进行代码质量检查

## 贡献指南

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT License](LICENSE)
