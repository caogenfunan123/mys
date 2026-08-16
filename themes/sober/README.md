# hexo-theme-sober

一款简洁、优雅、开箱即用的 Hexo 主题。

左侧固定边栏 + 右侧内容区布局，自带毛玻璃卡片质感、深浅色模式、多强调色切换、站内搜索、动态说说、友链等实用功能，**零 npm 依赖**。

![preview](https://via.placeholder.com/1200x630/3b82f6/ffffff?text=sober+theme)

## ✨ 特性

- 🎨 **马卡龙渐变背景 + 毛玻璃卡片**，浅色/深色两套完整配色
- 🌗 **一键深浅色切换**，自动记忆用户选择，支持跟随系统偏好
- 🎯 **8 种强调色随心切换**（蓝/青/绿/黄/橙/粉/紫/红），无需改代码
- 🔍 **内置站内搜索**（`Ctrl/Cmd + K` 唤起），构建时自动生成索引，无插件依赖
- 📝 **动态说说**：支持 `source/_data/dynamics.yml` 数据文件 + `type: dynamic` 文章两种方式，首页聚合展示
- 🤝 **友链、标签、分类、归档** 完整页面支持
- 📱 **响应式布局**：桌面左侧边栏，移动端顶部资料卡 + 汉堡菜单
- ⚡ **零 npm 依赖**，纯 EJS + 原生 JS + CSS，构建快、部署省心

## 📦 安装

```bash
# 1. 克隆主题到 themes 目录
git clone https://github.com/你的用户名/hexo-theme-sober.git themes/sober

# 2. 修改站点 _config.yml
theme: sober
```

## 🚀 快速开始

```bash
hexo clean && hexo g && hexo s
```

## ⚙️ 配置说明

主题配置位于 `themes/sober/_config.yml`：

```yaml
# 导航菜单
menu:
  首页: /
  文章: /posts/
  标签: /tags/
  分类: /categories/
  归档: /archive/
  友链: /friends/
  关于: /about/
  动态: /dynamics/

# 左侧边栏
sidebar:
  enable: true
  avatar: ""                      # 头像
  description: focusing on interesting things
  github: ""                      # GitHub 主页
  bio: ""                         # 个人简介

# 动态区块
dynamics:
  title: 动态
  count: 5                        # 首页显示条数
  more_text: 查看更多动态
  more_link: /dynamics/
```

### 动态说说怎么用？

**方式一：数据文件**（适合短动态）

在 `source/_data/dynamics.yml` 中添加：

```yaml
- date: 2026-08-16
  content: 今天发布了 sober 主题 🎉
```

**方式二：说说文章**（适合长内容）

在文章 FrontMatter 中设置：

```yaml
---
title: 一条说说
type: dynamic
date: 2026-08-16 12:00:00
---
正文内容…
```

### 强调色列表

在侧边栏/顶部颜色按钮中可切换：`blue` / `cyan` / `green` / `yellow` / `orange` / `pink` / `purple` / `red`。

## 📁 目录结构

```
themes/sober/
├── _config.yml          # 主题配置
├── layout/              # EJS 模板
│   ├── layout.ejs       # 主布局
│   ├── index.ejs        # 首页
│   ├── post.ejs         # 文章页
│   ├── archive.ejs      # 归档
│   ├── tag.ejs          # 标签
│   ├── category.ejs     # 分类
│   ├── friends.ejs      # 友链
│   ├── dynamics.ejs     # 动态
│   └── about.ejs        # 关于
├── scripts/             # Hexo 构建脚本
│   ├── helpers.js       # 模板辅助函数
│   └── search-generator.js  # 站内搜索索引生成
└── source/
    ├── css/             # 样式
    └── js/              # 交互脚本
```

## 🗂 需要友链 / 标签等数据？

- 友链：在 `source/_data/friends.yml` 维护
- 标签、分类、归档：Hexo 自动生成，无需额外配置

## 📄 License

[MIT](./LICENSE)

Copyright (c) 2026 sober theme contributors
