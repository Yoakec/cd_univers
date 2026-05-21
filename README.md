# 成都科幻地图 · Chengdu Science Fiction Map

复古未来主义天体制图学（Retro-futurist Celestial Cartography）风格的 3D 交互式地图，将成都 43 个科幻地标以多层仪轨（Multi-Layer Orrery）的形式呈现在 Three.js 构建的宇宙中。

## 技术栈

| 层 | 技术 |
|---|------|
| UI 框架 | Vue 3 + TypeScript |
| 3D 引擎 | Three.js + CSS2DRenderer |
| 后期特效 | postprocessing (BloomEffect) |
| 动画 | GSAP |
| 构建 | Vite |

## 快速开始

```bash
npm install
npm run dev      # 启动开发服务器 → http://localhost:5173
npm run build    # 生产构建 → dist/
```

## 项目结构

```
src/
├── main.ts                    # Vue 入口
├── App.vue                    # 根布局，事件协调中心
├── composables/
│   └── useUniverse.ts         # Vue-Three.js 桥接
├── three/                     # Three.js 模块（命令式调用）
│   ├── scene.ts               # 场景、相机、渲染器
│   ├── starfield.ts           # 2000 粒子星空
│   ├── orbits.ts              # 22 条装饰椭圆轨道（逆向旋转）
│   ├── postprocessing.ts      # 辉光特效
│   ├── nodes.ts               # WebGL 图标 + CSS2D 文字标签
│   ├── edges.ts               # 结构连线（蚂蚁线动画）+ 聚类轨道
│   ├── camera.ts              # 镜头状态机 + GSAP 弧线飞跃
│   └── interaction.ts         # 射线检测 + 悬停/点击
├── components/                # Vue UI 组件
│   ├── UniverseCanvas.vue     # 3D 画布 + CSS2D 容器 + 渲染循环
│   ├── Sidebar.vue            # 左侧搜索 + 地标列表
│   ├── Compass.vue            # 纯 CSS 指南针
│   ├── TitleBlock.vue         # 主标题 + 演职员表
│   ├── Legend.vue             # 符号图例
│   ├── NodeTooltip.vue        # 悬停气泡
│   ├── ConnectorSvg.vue       # 气泡折线连接器
│   └── NoiseOverlay.vue       # 纸张噪声纹理
└── data/
    ├── types.ts               # TypeScript 类型定义
    └── loader.ts              # JSON 数据加载
```

## Z 轴深度编码

地标按类型分布于不同 Z 高度，形成多层仪轨结构：

| Z 高度 | 节点类型 |
|--------|---------|
| +20 | 宇宙中心 TUOCON |
| +10 | 博物馆、科幻展览 |
| 0 | 机构/企业、书店、图书馆 |
| -5 | 高校科幻协会、研究中心 |
| -10 | 补给站、旧补给站 |
| -20 | 已湮灭地点 |

## 镜头操作

- **左键拖拽**：旋转 / 平移视角
- **滚轮**：缩放
- **点击节点或左侧列表**：镜头自动飞跃至目标
- **点击空白处**：退出锁定模式

## 设计系统

- 背景色 `#000a16`（极深藏青，非纯黑）
- 主文字 `#FDF5E6`（象牙白）+ 强调色 `#FFD700`（淡金）
- 字体：Noto Serif SC Bold（标题/节点名）+ IBM Plex Sans Light（地址/数据）
- 禁止渐变与投影，仅使用 `1px solid` 象牙白分割线
- 全屏 0.06 透明度程序化噪声纹理
