---
version: alpha
name: Mapseek UI
description: A compact, precision-first design system for geospatial analysis, map styling, data inspection, and resource-management tools.
colors:
  primary: "oklch(0.6270 0.1940 149)"
  on-primary: "oklch(1 0 0)"
  background: "oklch(0.9900 0.0020 149)"
  on-background: "oklch(0.2500 0.0100 149)"
  surface: "oklch(1 0 0)"
  on-surface: "oklch(0.2500 0.0100 149)"
  secondary: "oklch(0.9600 0.0050 149)"
  on-secondary: "oklch(0.3000 0.0500 149)"
  muted: "oklch(0.9700 0.0020 149)"
  on-muted: "oklch(0.5000 0.0200 149)"
  accent: "oklch(0.9600 0.0100 149)"
  on-accent: "oklch(0.3000 0.1000 149)"
  border: "oklch(0.9200 0.0050 149)"
  border-strong: "oklch(0.8500 0.0080 149)"
  input: "oklch(0.9400 0.0050 149)"
  input-surface: "transparent"
  ring: "oklch(0.6270 0.1940 149)"
  destructive: "oklch(0.6000 0.1800 25)"
  warning: "oklch(0.769 0.188 70.08)"
  info: "oklch(0.623 0.17 245)"
  selection: "oklch(0.9500 0.0300 149)"
  dark-primary: "oklch(0.6800 0.1940 149)"
  dark-on-primary: "oklch(0.1500 0.0100 149)"
  dark-background: "oklch(0.1500 0.0100 149)"
  dark-on-background: "oklch(0.9500 0.0050 149)"
  dark-surface: "oklch(0.2000 0.0100 149)"
  dark-on-surface: "oklch(0.9500 0.0050 149)"
  dark-muted: "oklch(0.2400 0.0080 149)"
  dark-on-muted: "oklch(0.6500 0.0200 149)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-input-surface: "oklch(1 0 0 / 4.5%)"
  dark-destructive: "oklch(0.7000 0.1800 25)"
typography:
  headline-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
  headline-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  body-base:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.06em
  data-display:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 9999px
spacing:
  hairline: 1px
  micro: 2px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  3xl: 32px
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
  surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
  surface-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    rounded: "{rounded.none}"
  surface-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
  button-xs:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 24px
    padding: 8px
  button-sm:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 28px
    padding: 10px
  button-lg:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 36px
    padding: 10px
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
  input-border:
    backgroundColor: "{colors.input}"
    height: 1px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-strong:
    backgroundColor: "{colors.border-strong}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  selection:
    backgroundColor: "{colors.selection}"
    textColor: "{colors.on-background}"
  destructive-action:
    textColor: "{colors.destructive}"
  warning-status:
    textColor: "{colors.warning}"
  info-status:
    textColor: "{colors.info}"
  badge:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 20px
    padding: 8px
  table-header:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    typography: "{typography.body-md}"
    height: 40px
  dark-app-shell:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-on-background}"
  dark-surface:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  dark-muted-surface:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-on-muted}"
  dark-button-primary:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  dark-input:
    backgroundColor: "{colors.dark-input-surface}"
  dark-input-control:
    backgroundColor: "{colors.dark-input}"
  dark-destructive-action:
    textColor: "{colors.dark-destructive}"
---

# Mapseek UI 设计规则

[English version](./DESIGN.md)

## Overview

Mapseek UI 是面向 GIS 分析、地图样式、数据检查和资源管理产品的组件注册表。它的视觉语言是 **precision-first technical minimalism（精度优先的技术极简主义）**：高密度但不拥挤、状态明确、数据周围保持克制，并针对长时间桌面使用进行优化。

界面应当像一台经过校准的专业仪器，而不是营销网站。地图、栅格、图表、坐标、模式和资源元数据才是视觉内容；界面框架只负责组织并操作这些内容。绿色标识当前动作或选择，细边界建立结构，统一的等宽字体让数值易于扫描和比较。

**关键特征：**

- 近白和近黑的中性画布，搭配克制的绿色动作色。
- Geist Mono Variable 统一用于界面文案、标签、标识符、坐标和数值数据。
- 控件、面板、卡片、菜单和弹窗全部为零圆角矩形。
- 24–36px 的紧凑控件高度，以及 4px 间距基线。
- 以 1px 边界和底色变化作为主要深度手段；阴影仅用于浮动层。
- 选中、加载、空状态、错误和禁用状态都不能只依赖颜色表达。
- 以桌面端面板和数据网格为主，同时保证窄视口可操作。

### 事实来源

- `registry/theme/registry.json` 拥有运行时颜色、字体、圆角、阴影、动效和 Tailwind 映射。
- `registry/ui/` 拥有可复用基础组件、变体、尺寸、状态和可访问性行为。
- `registry/blocks/` 将基础组件组合为地理空间和资源管理模式。
- `packages/docs/` 与 `showcase/` 是视觉和交互验收面。
- YAML front matter 是所列令牌的规范契约；`registry/theme/registry.json` 仍是图表色、分类色、侧栏色和派生透明色等运行时扩展的事实来源。正文解释两类值为何存在以及应在何时使用。

### 设计原则

1. **装饰服从精度。** 对齐、边界、数据可读性和状态清晰度优先于视觉效果。
2. **紧凑但不拥挤。** 使用紧凑控件和短间距，同时保持稳定分组与清晰扫描路径。
3. **数据优先于框架。** UI 表面保持中性，让地图、图表、色带和资源预览承担视觉重点。
4. **只使用语义令牌。** 组件消费 `primary`、`muted`、`border` 等语义角色，不复制颜色字面量。
5. **先复用，再创造。** 优先组合现有基础组件；只有领域模式重复出现时才创建 block。
6. **状态不能只靠颜色。** 颜色必须与文本、图标、边界、进度或结构变化共同使用。

## Colors

配色采用绿色轴 OKLCH 系统，外围是低彩度中性色。绿色是功能色而不是装饰色：用于主动作、焦点、选择和少量进度强调。大面积表面保持中性，使空间与科学数据保持主导地位。

### 品牌与动作

- **Primary**（`{colors.primary}`）：当前主动作、选中导航、焦点环和关键进度。同一局部任务中不要出现多个相互竞争的主按钮。
- **On Primary**（`{colors.on-primary}`）：亮色主题实心主色表面的前景色。图标和 `currentColor` SVG 必须继承它。
- **Secondary / Accent**（`{colors.secondary}`、`{colors.accent}`）：低强调动作、悬停填充、成组选项，以及不适合使用实心主色时的选中背景。
- **Selection**（`{colors.selection}`）：持久选中底色。必须同时使用主色边界、指示条、勾选图标或选中语义。

### 表面与文字

- **Background**（`{colors.background}`）：应用底层和默认地图相邻工作区。
- **Surface**（`{colors.surface}`）：卡片、popover、dialog 和独立面板。
- **Muted**（`{colors.muted}`）：表头、次级区域、弱悬停状态和空状态骨架。
- **On Background / On Surface**（`{colors.on-background}`、`{colors.on-surface}`）：主要界面文字。
- **On Muted**（`{colors.on-muted}`）：元数据、说明、计数和次级标签。小字号的重要操作说明不得使用它。

### 边界与输入

- **Border**（`{colors.border}`）：默认 1px 分隔线、面板边缘、卡片 ring 和表格规则线。
- **Border Strong**（`{colors.border-strong}`）：强调结构、活动拖放区域，以及需要更高对比的输入边界。
- **Input**（`{colors.input}`）：输入边界、禁用底色和深色主题字段色调。可编辑字段在浅色主题中保持透明，与所在面板形成一体。
- **Ring**（`{colors.ring}`）：键盘焦点。亮暗主题都必须清晰，且不能被 hover 样式替代。

### 语义色与数据色

- **Destructive**（`{colors.destructive}`）：不可逆动作和错误。危险按钮使用浅色危险底加危险文字，不使用大面积实心红底。
- **Warning**（`{colors.warning}`）和 **Info**（`{colors.info}`）：必须配合文字标签或图标使用。
- 图表色运行时顺序为：`--chart-1` 绿色、`--chart-2` 深绿、`--chart-3` 青绿、`--chart-4` 浅绿、`--chart-5` 灰绿。
- 分类色运行时顺序为：`--cat-1` 绿色、`--cat-2` 蓝色、`--cat-3` 琥珀色、`--cat-4` 红色、`--cat-5` 紫色、`--cat-6` 青色。除非数据领域定义了稳定语义映射，否则保持这一顺序。
- 色带、卫星影像、栅格预览和地图符号属于内容配色，不会重定义界面配色。

### 深色模式

深色模式使用对应的 `dark-*` 语义值，而不是机械反转亮色值。面板只比应用背景略亮，边界保持半透明，主色前景切换为深色以获得可读对比。可编辑文本字段使用 `{colors.dark-input-surface}` 作为克制的表面色调，它由 `{colors.dark-input}` 的 30% 派生。亮暗主题必须保持相同的层级和组件状态。

## Typography

Mapseek 使用 **Geist Mono Variable** 同时作为运行时 sans 和 mono 字体。统一的等宽语调强化产品的技术属性，并使坐标、标识符、图层名、计数和类代码值可直接比较。

### 层级

| Token | 字号 | 字重 | 行高 | 用途 |
|---|---:|---:|---:|---|
| `{typography.headline-lg}` | 18px | 600 | 1.2 | 页面与主要面板标题 |
| `{typography.headline-md}` | 15px | 600 | 1.25 | 弹窗与章节标题 |
| `{typography.headline-sm}` | 14px | 500 | 1.3 | 卡片标题和成组控件 |
| `{typography.body-base}` | 16px | 400 | 1.5 | 根文档字号和偏正文表面 |
| `{typography.body-lg}` | 13px | 400 | 1.5 | 重要界面文案和资源名称 |
| `{typography.body-md}` | 12px | 400 | 1.5 | 默认控件、表格、字段和面板 |
| `{typography.body-sm}` | 11px | 400 | 1.5 | 元数据、计数和紧凑状态文字 |
| `{typography.label-md}` | 10px | 500 | 1.2 | 大写分类和章节标签 |
| `{typography.data-display}` | 42px | 600 | 1 | 字体样张和特殊数据预览 |

### 原则

- 大多数 UI 使用 400、500 和 600 字重。700 只保留给产品标识或极少数展示需求。
- 大写与 `0.04em-0.06em` 字距只用于短分类标签和章节眉题，不能用于句子或按钮。
- 坐标、统计、存储量、时间戳和计数启用等宽数字。
- 标识符、端点、代码和长数据值保持等宽；允许截断并提供可发现的完整值，或允许横向滚动。
- 42px data display 是样张表现，不是通用页面标题。
- 不引入对比强烈的编辑型或几何展示字体。层级来自字号、字重、间距和结构。

## Layout

布局基于 4px 基线，并使用 2px 与 6px 作为紧凑对齐的中间步长。控件常用 4–8px 间距，容器使用 8–16px 内边距，主要面板使用 16–24px 间隔。

### 间距系统

- `{spacing.hairline}` 1px：规则线和边界。
- `{spacing.micro}` 2px：图标校正和紧密关联的状态细节。
- `{spacing.xs}` 4px 与 `{spacing.sm}` 6px：紧凑控件和工具栏间距。
- `{spacing.md}` 8px 与 `{spacing.lg}` 12px：字段组、行内边距和小容器。
- `{spacing.xl}` 16px：标准卡片、弹窗和面板内边距。
- `{spacing.2xl}` 24px 与 `{spacing.3xl}` 32px：主要章节和宽松空状态。

### 应用结构

- 主框架遵循 **顶部栏 → 导航或资源侧栏 → 工作画布 → 上下文面板或浮层**。
- 工具栏尽量保持单行，同一控件组使用统一高度。
- 侧栏与编辑面板使用稳定宽度、1px 边界和独立滚动；资源侧栏基准宽度为 220px。
- 主区域可承载地图、虚拟化表格、自适应资源网格、schema form 或编辑器；它占用剩余宽度，并必须保持 `min-width: 0` 行为。
- 持久动作放在顶部栏或面板 footer。破坏性动作不得与主动作拥有相同视觉权重。

### 网格、表格与表单

- 资源网格使用 `auto-fill` 和领域相关的最小卡片宽度。图标、雪碧图和字体模式共享间距、边界和选中规则。
- 表格位于明确的带边框容器中并允许横向滚动。表头约 40px；单元格保持紧凑，留白必须有明确用途。
- 字段布局可为垂直、行内或响应式。默认编辑器行由稳定标签列、可选动作列和弹性内容列组成。
- Dialog 宽度受视口约束，窄屏至少保留 16px 外边距。长表单或详情使用 sheet，局部选择使用 popover。
- 使用逻辑方向属性（`start`、`end`、`ps`、`pe`、`ms`、`me`）保持 RTL 兼容。

## Elevation & Depth

Mapseek 采用 **边界优先、表面优先** 的层级表达。大多数层级来自 1px 规则线、轻微中性底色变化和遮罩。静态卡片与面板不应漂浮在工作区上方。

| 层级 | 表现 | 用途 |
|---|---|---|
| Flat | 仅背景 | 应用框架、地图画布、内容区域 |
| Structured | 1px `{colors.border}` | 面板、表格、卡片、成组控件 |
| Selected | `{colors.selection}` 加主色边缘或指示器 | 当前行、资源、图层或导航项 |
| Floating | 表面加主题阴影 | 菜单、popover、tooltip、dialog、toast |
| Map floating | `--shadow-map-float` | 直接位于地图内容上方的控件 |

- 普通卡片、工具栏、侧栏、表格行和表单章节不使用阴影。
- 只有脱离文档流的组件才能使用现有主题阴影层级。
- Dialog 遮罩保持轻量（`black/10`）并配合小幅 blur，使空间上下文仍然可见。
- 动效快速且功能化：即时反馈 120ms，标准过渡 180ms，大型展开 260ms。优先使用透明度、颜色和短距离变换，并尊重 reduced motion。
- 为应用框架、地图控件、菜单/tooltip 和模态层维护明确 z-index 层级，禁止临时递增。

## Shapes

零圆角是 Mapseek 的核心识别特征。所有矩形控件、字段、卡片、表格、菜单、popover、dialog、sheet 和面板均使用 `{rounded.none}`。不得让框架默认值重新引入圆角。

### 形状规则

- `{rounded.full}` 只用于天然圆形的状态点、头像遮罩，以及 switch 轨道或滑块。
- 纯图标控件为正方形。标准图标按钮遵循 24px、28px、32px、36px 控件尺寸。
- 默认图标语言为 Tabler Icons。常用界面图标尺寸为 12–16px，stroke 为 1.5–1.75。
- 同一工具栏或数据行内保持统一的图标尺寸与描边。
- 分隔线为 1px。禁止用多层边框、粗描边或装饰性框线创造层级。
- 官方产品资源为 `public/img/mapseek.png`。保持透明背景、完整宽高比和完整标识，不得改色、裁切或重绘。
- 数据预览可以使用棋盘格、色带、字形样张或地图缩略图，但必须限制在边界明确的预览区域内。

## Components

组件遵循固定归属：theme → primitives → domain blocks → product screens。主题定义令牌，基础组件定义可复用行为，blocks 定义领域组合，产品页面提供数据和业务动作。

### 按钮与动作

**`button-primary`**：绿色主动作，高 32px，12px 界面字体，零圆角。每个局部任务只使用一个主导动作。Hover 降低强度，按下可向下移动 1px，焦点显示 ring。

**次级变体**：outline、secondary 和 ghost 在不发明第二动作色的前提下表达层级。`link` 只用于真正的行内导航或低框架动作。

**破坏性动作**：front matter 规范危险文字；运行时按钮从同一令牌派生 10% 透明度背景（深色模式为 20%）。结果不可逆或难恢复时必须确认。

**图标按钮**：24–36px 正方形动作，内部图标 12–16px。必须提供可访问名称；含义不明显时增加 tooltip。关键动作不得只用无标签图标表达。

### 表单与选择

**`input`**：高 32px，零圆角，12px 字体，水平内边距 10px，明确边界；浅色主题表面透明，深色主题使用 30% `{colors.dark-input}` 色调，并带 3px 半透明焦点 ring。Placeholder 是次级提示，不能替代 label。`textarea` 与 `input-group` 使用相同的表面规则。

**`field`**：组合 label、description、control 和 error。无效控件同时使用 `aria-invalid` 与可见错误文案；`FieldError` 通过 `role="alert"` 宣告。

**Checkbox、switch、slider、select、combobox、toggle 与 tabs**：保持 Base UI 语义和现有键盘行为。选中与勾选状态必须有 hover 之外的持久视觉标识。

### 容器与浮层

**`card`**：只分组相关内容。默认卡片使用 16px 内边距和间距，小卡片使用 12px。默认 ring 保持轻量，边角保持方形。

**`dialog`**：使用 `DialogContent -> DialogHeader / DialogBody / DialogFooter`，16px 内边距、16px 章节间距和可读标题。窄屏 footer 动作纵向排列，`sm` 及以上向末端对齐。

**`sheet`**：用于比 dialog 需要更多垂直空间的长编辑或详情流程。

**Popover、dropdown、context menu、command 与 tooltip**：用于局部浮动选择。对齐触发器，保留键盘导航，并让周围任务保持可见。

### 数据与状态

**`table`**：带边框、可横向滚动、12px 数据字体、40px 表头、8px 单元格内边距。Hover 与 selected 必须可区分。

**`badge`**：高 20px，水平内边距 8px。用于简短状态或分类标签，不承载段落式文案。

**Progress、skeleton、empty、sonner 与 notification center**：反馈范围与任务范围匹配；局部工作靠近触发源，全局或后台工作可进入通知。持久状态不能只存在于短暂 toast 中。

**JSON viewer/editor 与 chart**：保持等宽对齐和数据语义。大数据集应使用滚动、虚拟化或增量渲染，而不是缩小到不可读字号。

### 领域 Blocks

- **AppTopBar**：紧凑应用框架，包含导航、身份、文档状态、中心工具和末端对齐主动作。
- **ResourceSidebar / ResourceGrid**：稳定导航侧栏配合自适应资源卡片；选中状态组合浅色底、绿色文字或边缘，以及语义状态。
- **LayerPanel / LayerStyleEditor / StylePanel**：由复用字段和分组章节构成的高密度检查器。
- **MapControls / MapCoordinateStatus / MapSwitcher**：小型地图浮动工具，使用专用地图层级，并保持 label 或 tooltip 可发现。
- **AttrTable / AttrInspector / GeoJSONView / JSONEditor**：数据优先的检查表面，支持 overflow 和长值处理。
- **ProcessingTimeline / ServiceStatus / ResourceStatus / NotificationCenter**：文字、图标和颜色共同表达的进度与状态模式。
- Blocks 通过 props 接收数据、labels 与 handlers，不得嵌入产品引擎、网络请求或不可注入的业务文案。

## Do's and Don'ts

### Do

- 先使用语义主题令牌和现有基础组件变体，再添加样式。
- 保持控件紧凑，并让相邻控件使用统一高度。
- 将绿色主色保留给当前动作、焦点、选择和少量高价值强调。
- 使用 1px 边界和轻微表面变化建立结构。
- 所有矩形组件保持零圆角。
- 技术数值使用 Geist Mono 与等宽数字。
- 每个状态色都配合文字、图标、边界、进度或结构变化。
- 纯图标动作保持方形、可访问且可发现。
- 测试亮色、深色、键盘、RTL、窄屏、overflow 与 reduced motion。

### Don't

- 不引入营销页式大留白、超大 hero 字体、渐变、玻璃拟态或装饰性 blur。
- 不为卡片、控件、面板、dialog 或菜单增加圆角。
- 不为静态表面增加阴影，也不将层级作为装饰。
- 不将主绿色用于无关分类、每个图表序列或被动装饰。
- 已有语义令牌时，不在组件内复制 hex 或 OKLCH 字面量。
- 不通过缩小到规范以下的字号让数据强行适配。
- 不将 hover 作为选择或可用性的唯一信号。
- 不在领域 blocks 中重复实现基础组件行为。
- 不用无标签图标或纯颜色可供性隐藏关键动作。

## Responsive Behavior

Mapseek 以桌面端为主，但所有组件都必须在窄屏中保持可理解和可操作。响应式行为应保留任务优先级，而不是简单缩小所有内容。

### 断点

| 范围 | 预期行为 |
|---|---|
| `< 640px` | 弹窗动作纵向排列，保留 16px 视口边距，多列网格变单列，次级面板内容通过明确触发器打开。 |
| `640-767px` | 保持最小卡片宽度时可使用两列资源网格；控件保持紧凑，但产品壳可按需扩大触摸命中区。 |
| `768-1023px` | 当工作画布受挤压时折叠或覆盖次级侧栏；保留主地图、表格或编辑器。 |
| `>= 1024px` | 使用完整桌面框架：持久侧栏、工具栏、工作画布和上下文面板。 |

### 折叠策略

- 优先保留工作画布，其次是主动作，再次是当前上下文；之后再折叠次级导航和元数据。
- 工具栏只能在有意义的动作组边界换行；低频动作优先进入 overflow 菜单。
- 资源网格通过 `auto-fill/minmax` 自适应；表格横向滚动，不将列压缩成不可读值。
- 窄屏下侧栏变为 sheet 或由明确触发器打开的 overlay。
- 触屏产品可将视觉控件命中区域扩大至接近 44px，但不能改变桌面密度约定。

## Iteration Guide

1. 从最接近的现有 primitive 或 block 开始，不从原始 HTML 和局部字面量开始。
2. 令牌变更先写入 `registry/theme/registry.json`，再生成或同步消费面与本文档。
3. 使用现有 24/28/32/36px 控件尺寸、4px 间距基线、零圆角几何和 Tabler 图标语言。
4. 通过既有 CVA 或 `data-*` 模式添加组件变体，状态名称保持语义化。
5. Block 可见文案通过 `labels` 注入，行为数据通过 props 注入。
6. 验证 loading、empty、error、disabled、selected、长内容、overflow、dark、RTL、keyboard 和 reduced-motion 场景。
7. 每个公开 primitive 或 block 都提供或更新中英文文档和可深链的 showcase。
8. 相关变更后运行 `pnpm run lint`、`pnpm run typecheck`、`pnpm test`、`pnpm run registry:validate` 与 `pnpm run design:lint`。

## Known Gaps

- 亮色主题 `{components.button-primary}` 当前白字配绿底的对比度为 3.22:1。它可满足大字号文本和许多非文本指示器，但低于普通文本 WCAG AA 的 4.5:1 目标；设计系统负责人需要调整主色或前景色。
- `{components.input}` 在亮色主题中有意保持透明，并继承所在背景或表面。对比度必须基于合成后的表面评估；直接把文字与透明黑比较的自动检查不代表实际渲染结果。
- 完整移动编辑流程属于产品壳决策。注册表定义窄屏行为，但不承诺所有桌面 GIS 工作流都是触屏优先。
- 图表和分类令牌在运行时已有顺序，但尚未记录色觉安全的成对与排序策略。
- 动效令牌已经定义，但复杂地图过渡、时间线编排和编辑器展开序列仍由产品决定。
- 部分数据密集型 blocks 依赖消费产品提供虚拟化、分页或流式边界。
