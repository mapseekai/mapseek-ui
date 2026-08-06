---
version: alpha
name: Mapseek UI
description: "A compact, zero-radius design system for GIS analysis, map styling, data inspection, and resource management. It uses neutral OKLCH surfaces, a reserved green action color, and a single monospaced interface voice."
colors:
  background: "oklch(0.9900 0.0020 149)"
  foreground: "oklch(0.2500 0.0100 149)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.2500 0.0100 149)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.2500 0.0100 149)"
  primary: "oklch(0.6270 0.1940 149)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.9600 0.0050 149)"
  secondary-foreground: "oklch(0.3000 0.0500 149)"
  muted: "oklch(0.9700 0.0020 149)"
  muted-foreground: "oklch(0.5000 0.0200 149)"
  accent: "oklch(0.9600 0.0100 149)"
  accent-foreground: "oklch(0.3000 0.1000 149)"
  destructive: "oklch(0.6000 0.1800 25)"
  warning: "oklch(0.769 0.188 70.08)"
  info: "oklch(0.623 0.17 245)"
  border: "oklch(0.9200 0.0050 149)"
  border-strong: "oklch(0.8500 0.0080 149)"
  input: "oklch(0.9400 0.0050 149)"
  input-surface: "transparent"
  ring: "oklch(0.6270 0.1940 149)"
  selection-bg: "oklch(0.9500 0.0300 149)"
  selection-bg-mid: "oklch(0.9200 0.0500 149)"
  selection-bg-deep: "oklch(0.8800 0.0700 149)"
typography:
  headline-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-base:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-lg-medium:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0px
  body-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3333
    letterSpacing: 0px
  body-md-medium:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3333
    letterSpacing: 0px
  body-md-strong:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3333
    letterSpacing: 0px
  body-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm-medium:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0px
  label-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
  label-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
  data-display:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: '"tnum" 1, "zero" 1'
rounded:
  none: 0px
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
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, {colors.primary}, transparent 20%)"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-destructive:
    backgroundColor: "color-mix(in oklch, {colors.destructive}, transparent 90%)"
    textColor: "{colors.destructive}"
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-xs:
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 24px
    padding: 0px 8px
  button-sm:
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 28px
    padding: 0px 10px
  button-lg:
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 36px
    padding: 0px 10px
  accent-surface:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.none}"
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
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
  selected-surface:
    backgroundColor: "{colors.selection-bg}"
    textColor: "{colors.foreground}"
  selected-surface-emphasized:
    backgroundColor: "{colors.selection-bg-mid}"
    textColor: "{colors.foreground}"
  selected-surface-strong:
    backgroundColor: "{colors.selection-bg-deep}"
    textColor: "{colors.foreground}"
  warning-status:
    textColor: "{colors.warning}"
  info-status:
    textColor: "{colors.info}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 10px
  badge:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md-medium}"
    rounded: "{rounded.none}"
    height: 20px
    padding: 0px 8px
  table-header:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-md-medium}"
    height: 40px
---

# Mapseek UI 设计规则

[English version](./DESIGN.md)

## Overview

Mapseek UI 是 GIS 分析、地图样式配置、数据检查与资源管理的工作界面。它采用**精度优先的技术极简主义**：紧凑、沉静，并清晰表达状态。它应像经过校准的专业仪器，而不是营销网站。地图、栅格、图表、坐标、模式和资源元数据是视觉内容；界面框架只负责组织和操作这些内容。

界面的核心节奏是近中性的画布、带 1px 边界的方形表面，以及仅用于当前动作、焦点或选择的克制绿色。单一等宽字体让坐标、标识符、计数和数据值在长时间桌面工作中易于扫描和比较。

**关键特征：**

- 中性亮暗画布；绿色具备功能性，而非装饰性。
- Geist Mono Variable 用于所有 UI 文字和技术数据。
- 控件、面板、卡片、菜单和弹窗均为零圆角矩形。
- 控件高度使用 24px、28px、32px、36px，并遵循 4px 间距节奏。
- 通过边界和轻微底色变化建立层级；组件默认不使用阴影。
- 选中、加载、空、错误和禁用状态绝不只依赖颜色。
- 桌面优先的数据与面板布局在空间收窄时仍可理解。

### Source of Truth

- `registry/theme/registry.json` 拥有运行时主题变量，包括深色值、无阴影兼容令牌、动效、图表、分类和侧栏令牌。
- `registry/ui/` 拥有基础组件的变体、尺寸、键盘行为和可访问性。
- `registry/blocks/` 将基础组件组合为 GIS 与资源管理模式。
- `packages/docs/` 与 `showcase/` 是视觉验收面。
- 本文件 front matter 镜像组件消费的主亮色主题变量。未在这里表示的运行时扩展应使用 `registry/theme/registry.json`，不得创建竞争令牌。

## Colors

Mapseek 使用由低彩度中性色包围的绿色轴 OKLCH 调色板。主绿色只标记有意义的活动状态；地图、栅格预览、图表和符号系统仍应是视觉重点。

### Action, State, and Text

- **Primary**（`{colors.primary}`）是唯一高强调动作、选中导航样式、键盘焦点来源和有限的进度强调；其前景色为 `{colors.primary-foreground}`。
- **Secondary**（`{colors.secondary}`）和 **accent**（`{colors.accent}`）用于低强调动作和成组选项；前景色使用对应的 `*-foreground` 令牌。
- **交互与选择** 使用不同表面：普通可交互元素默认使用 50% 透明度的 `{colors.accent}`，与文档侧栏 hover 处理保持一致。持续选中状态使用完整的 `{colors.selection-bg}` token 和 `{colors.primary}` 文字，并可递进至 `{colors.selection-bg-deep}`；选中、展开和激活元素在 hover 时保持原状态表面与主色文字，不再应用普通 hover 处理。同时必须搭配选中语义、边缘、勾选或其他持续性标识。
- **Destructive**、**warning** 与 **info** 是语义信号，不是装饰分类；必须搭配文字或图标，破坏性动作使用浅色调而非实心红色。

### Surfaces, Borders, and Dark Theme

- **Background**（`{colors.background}`）是应用底面；**card** 和 **popover** 是使用对应前景令牌的独立表面。
- **Muted** 支持表头、元数据带和空状态骨架，不再作为默认交互 hover 填充；关键小号文字不得使用 `{colors.muted-foreground}`。
- **Border** 是默认 1px 结构；**border-strong** 仅用于强调边界和活动拖放目标。
- 输入框的边界使用 `{colors.input}`，填充使用 `{colors.input-surface}`；亮色主题有意保持透明填充。
- 深色模式通过运行时主题的 `.dark` 值复用相同语义名，而非机械反相。深色面板只略亮于应用底面，可编辑输入框使用克制的半透明填充。
- **强调填充反转前景而非底色。** 深色模式下，`{colors.primary}`、`{colors.destructive}` 与 sidebar-primary 保持品牌色相（略微提亮），前景切换为深色文字（`oklch(0.1500 0.0100 149)` / `oklch(0.1000 0 0)`）。此为有意为之：白字在提亮后的底色上对比度不足 3:1，深字可保持约 7:1。如不同时加深底色，不要将白字"改回"。

### Data Palettes

图表和分类调色板属于运行时扩展。除非数据领域提供稳定的语义映射，否则应保持 `registry/theme/registry.json` 中声明的顺序。色带、卫星影像和地图符号属于内容调色板，绝不能重定义界面调色板。

## Typography

Mapseek 将 **Geist Mono Variable** 同时作为 UI 与数据字体。统一的技术字体让坐标、文件名、字段名、时间戳、存储量和类代码值可比较，而无需切换视觉语言。

### Hierarchy

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---:|---:|---:|---:|---|
| `{typography.headline-lg}` | 18px | 600 | 1.2 | -0.02em | 页面和主要面板标题 |
| `{typography.headline-md}` | 15px | 600 | 1.25 | -0.02em | 弹窗和章节标题 |
| `{typography.headline-sm}` | 14px | 500 | 1.3 | -0.01em | 卡片标题和成组控件 |
| `{typography.body-base}` | 16px | 400 | 1.5 | 0 | 根文档尺度和偏正文表面 |
| `{typography.body-lg}` | 13px | 400 | 1.5 | 0 | 显著界面文案和资源名称 |
| `{typography.body-lg-medium}` | 13px | 500 | 1.5 | 0 | 强调的资源名称和标识符 |
| `{typography.body-md}` | 12px | 400 | 1.5 | 0 | 表格、字段和面板中的内容文字 |
| `{typography.body-md-medium}` | 12px | 500 | 1.5 | 0 | 交互控件、标签页、徽章和表头 |
| `{typography.body-md-strong}` | 12px | 600 | 1.5 | 0 | 密集面板中的面板和区块标题 |
| `{typography.body-sm}` | 11px | 400 | 1.5 | 0 | 元数据、计数和紧凑状态文本 |
| `{typography.body-sm-medium}` | 11px | 500 | 1.5 | 0 | 强调的元数据和紧凑表头 |
| `{typography.label-sm}` | 11px | 500 | 1.2 | 0.04em | 紧凑分类和眉线标签 |
| `{typography.label-md}` | 10px | 500 | 1.2 | 0.04em | 简短分类和章节标签 |
| `{typography.data-display}` | 42px | 600 | 1 | -0.02em | 特殊数据或样张预览 |

### Type Rules

- 使用 400、500、600 字重。data-display 是例外，不是通用页面标题样式。
- 大写字距仅用于简短分类或眉题，不能用于句子或按钮。
- 坐标、统计、存储量、时间戳和计数使用等宽数字。
- 长标识符和数据值必须以可发现的完整值截断，或允许横向滚动；不得缩小到不可读。
- 不引入对比强烈的编辑型或几何展示字体。层级来自字号、字重、间距和结构。

## Layout

布局系统以桌面优先，并基于 4px 基线；2px 和 6px 用于精确对齐。相关控件保持紧凑，独立分组之间保留呼吸空间。

### Spacing System

- `{spacing.hairline}`（1px）：规则线与边界。
- `{spacing.micro}`（2px）：图标校正和紧密耦合的状态细节。
- `{spacing.xs}`（4px）和 `{spacing.sm}`（6px）：紧凑工具栏与控件间距。
- `{spacing.md}`（8px）和 `{spacing.lg}`（12px）：字段组、行内边距和小容器。
- `{spacing.xl}`（16px）：标准卡片、弹窗和面板内边距。
- `{spacing.2xl}`（24px）和 `{spacing.3xl}`（32px）：主要分隔与宽松空状态。

### Application Structure

- 通用框架为**顶部栏 → 导航或资源栏 → 工作画布 → 上下文面板或浮层**。
- 工具栏的同一控件簇使用一种高度；持久动作保留在顶部栏或面板 footer。
- 侧栏和编辑器应有稳定宽度、1px 边界和独立滚动。主工作区占用剩余宽度，并必须保持 `min-width: 0`。
- 资源网格使用带领域最小卡片宽度的 `auto-fill`；表格使用有边界的容器和横向滚动，不压缩列宽。
- 字段行可纵向、行内或响应式排列；空间允许时编辑器保留稳定的标签列与弹性内容列。

### Responsive Behavior

- 小于 640px 时，弹窗动作纵向排列，保留 16px 视口边距，多列网格收为单列，次级面板内容移入明确触发器。
- 640px 至 1023px 时，优先保留工作画布；次级栏会令地图、表格或编辑器不可用时，应折叠或覆盖它。
- 大于等于 1024px 时，使用完整桌面框架：持久侧栏、工具栏、工作画布和上下文面板。
- 工具栏只在有意义的动作组边界换行；低频动作优先放入 overflow 菜单。

## Elevation & Depth

Mapseek 采用**边界优先、表面优先**的层级。静态面板不应漂浮在工作区上方；深度来自 1px 规则线、细微中性色差和明确浮层。

| 层级 | 处理方式 | 用途 |
|---|---|---|
| Flat | 仅背景 | 应用框架、地图画布、内容区域 |
| Structured | 1px `{colors.border}` | 面板、表格、卡片、成组控件 |
| Selected | 选中填充加主色边缘或指示器 | 当前行、资源、图层或导航项 |
| Floating | 带 1px 边界或 ring 的 Popover 表面 | 菜单、popover、tooltip、dialog、toast |
| Map floating | 带边界且对比清晰的表面 | 直接位于地图内容上方的控件 |

- 所有组件阴影令牌默认解析为 `none`；使用边界、轮廓和表面对比建立层级。
- Dialog 遮罩保持轻量（`black/10`），可使用小幅 blur 以保留空间上下文。
- 既有基础组件使用短促、功能性的过渡；优先透明度、颜色和小位移，并尊重 reduced motion，常规 UI 不得加入冗长动画。
- 应用框架、地图控件、浮动选择和模态层使用既定 z-index 层级；不得临时递增 z-index。

## Shapes

零圆角是 Mapseek 的决定性特征。矩形控件、字段、卡片、表格、菜单、popover、dialog、sheet 和面板均使用 `{rounded.none}`；不得重新引入框架默认圆角。

- `{rounded.full}` 仅用于天然圆形的状态点、头像遮罩、switch 轨道和 switch 拇指。
- 纯图标控件为正方形，并遵循 24px、28px、32px、36px 尺寸体系。
- Tabler Icons 是默认图标语言；同一工具栏或行中保持一致的图标尺寸和 stroke。
- 分隔线为 1px；不要叠加描边、使用粗线或增加装饰边框来制造层级。
- `public/img/mapseek.png` 必须保持完整、透明且不修改。
- 棋盘格、色带、字形样张和地图缩略图仅属于边界明确的数据预览区。

## Components

组件遵循固定归属：theme → primitives → domain blocks → product screens。主题定义语义值，基础组件定义可复用行为，blocks 定义 GIS 组合，产品提供数据和业务动作。

### Buttons and Actions

- **`button-primary`** 是高 32px、12px 字体、10px 水平内边距的绿色动作；每个局部任务仅有一个主导动作。Hover 降低主色强度，按下可下移 1px，焦点应有可见 ring。
- **outline、secondary、ghost、link 变体**在不创建新动作色的前提下保持层级；`link` 仅用于真实行内导航或低框架动作。
- **`button-destructive`** 使用浅色危险表面与危险文字；结果不可逆或难以恢复时要求确认。
- **图标按钮**为 24–36px 正方形，必须有可访问名称；图标含义不自明时增加 tooltip。

### Forms and Selection

- **`input`** 高 32px、方形、12px 字体、1px 输入边界、10px 水平内边距，并使用透明的亮色主题填充；placeholder 提供辅助，不能取代标签。
- **透明输入框对比度契约。** `input`、`textarea` 和 `input-group` 使用 `{colors.input-surface}`，因此文字对比度必须在与承载表面合成后评估。它们只能置于 `background`、`card` 或 `popover`；每个支持主题中，文字对比度矩阵必须达到 4.5:1。不得置于 primary、destructive、影像、地图、数据可视化或其他未列出的彩色表面。`muted` 在显式加入对比度矩阵前不属于允许承载表面。
- **`field`** 组合标签、说明、控件和错误信息；无效控件应暴露 `aria-invalid` 和可见错误文案；`FieldError` 通过 `role="alert"` 宣告。
- **checkbox、switch、slider、select、combobox、toggle、tabs** 保持既有 Base UI 键盘语义；勾选和选中状态必须有 hover 之外的持续性标识。

### Containers and Overlays

- **`card`** 使用方形 1px ring 组织相关内容，默认间距 16px，紧凑变体 12px。
- **`dialog`** 使用 `DialogContent → DialogHeader / DialogBody / DialogFooter`，16px 内边距、易读标题和末端对齐 footer 动作；窄屏时动作纵向堆叠。
- **`sheet`** 承载长编辑或详情工作流；**popover、dropdown、context menu、command、tooltip** 提供局部浮动选择且不遮蔽当前任务。

### Data and Domain Blocks

- **`table`** 有边界并可横向滚动；表头高 40px，紧凑单元格仍保持可读的 12px 数据字体。
- **`badge`** 高 20px、水平内边距 8px，仅承载短状态或分类标签。
- **progress、skeleton、empty、sonner、notification center** 的反馈范围应匹配任务范围；持久状态不得只存在于短暂 toast。
- **MapControls、MapCoordinateStatus、MapSwitcher** 使用地图专用浮动层级，并保留标签或 tooltip。
- **ResourceSidebar、ResourceGrid、LayerPanel、LayerStyleEditor、AttrTable、AttrInspector、GeoJSONView、JSONEditor** 应保持与基础组件一致的数据密度、注入标签、溢出处理和状态可见性。

## Do's and Don'ts

### Do

- 添加局部样式前，先使用语义主题令牌和既有基础组件变体。
- 相邻控件使用同一已定义高度，并保持 4px 间距节奏。
- 绿色只用于主动作、当前焦点、选择和高价值进度。
- 状态色必须搭配文字、图标、边界、进度或其他结构变化。
- 验证亮色、深色、键盘导航、RTL、窄宽度、overflow、reduced motion 以及 loading/empty/error 状态。
- 公开视觉契约变更时，同时更新主题、本文档、双语文档和相关 showcase。

### Don't

- 不引入营销页式留白、hero 字体、渐变、玻璃拟态或装饰性 blur。
- 不为矩形卡片、控件、面板、dialog、菜单或字段增加圆角。
- 不为 UI 组件添加阴影，也不把层级当作装饰。
- 不将主绿色用于无关分类、每个图表序列或被动装饰。
- 存在语义令牌时，不在组件中复制颜色字面量。
- 不通过无标签图标、仅 hover 处理或仅颜色可供性隐藏关键动作。
- 不重复基础组件行为，也不在领域 blocks 中嵌入不可注入的产品文案和网络行为。
