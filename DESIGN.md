---
version: alpha
name: Mapseek UI
description: Compact, precision-first interface rules for Mapseek geospatial and resource-management products.
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
    backgroundColor: "{colors.input}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
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
    backgroundColor: "{colors.dark-input}"
  dark-destructive-action:
    textColor: "{colors.dark-destructive}"
---

# Mapseek UI Design Rules

## Overview

Mapseek UI 是面向 GIS、数据管理、地图样式配置和资源管理场景的组件注册表。视觉基调是 **precision-first technical minimalism**：高信息密度、清晰边界、低装饰、快速扫描，并优先保证专业工具在长时间使用中的稳定感。

### Source of truth

- **状态：** Active
- **最后刷新：** 2026-07-31
- **格式：** Google Labs `DESIGN.md` 0.4.0 所实现的 `alpha` 规范；YAML 令牌是机器可读的规范值，正文解释使用方式和设计理由。
- **主要界面：** 地图控制与坐标状态、图层与样式编辑、数据属性表、资源库、服务状态、通知与处理进度。
- **代码真值：** `registry/theme/registry.json` 定义完整运行时主题；`registry/ui/` 定义基础组件；`registry/blocks/` 定义领域组合组件；`components.json` 定义 shadcn 生成约束。
- **证据范围：** `README.md`、`docs/provenance.md`、`components.json`、`registry/theme/registry.json`、`registry/ui/registry.json`、`registry/blocks/registry.json` 以及现有组件实现。

### Brand

- **个性：** 精确、克制、可靠、工程化、数据导向。
- **信任信号：** 对齐稳定、状态明确、数值使用等宽数字、交互反馈可预测、深浅主题语义一致。
- **官方标识：** `public/img/mapseek.png` 是 Mapseek 唯一 Logo 资产。导航、favicon、社交预览和产品标识统一使用原图，保持透明背景、完整纵横比与 `object-fit: contain`，不得重绘、改色、裁切或为子产品替换不同图形。
- **避免：** 营销页式大留白、渐变装饰、玻璃拟态、随意阴影、胶囊化泛滥、无语义的强调色。

### Product goals

- 让用户在密集的图层、属性、样式和资源信息中快速定位、比较和操作。
- 让注册表消费者通过复用令牌与基础组件获得一致结果，而不是复制局部样式。
- 在紧凑桌面工作流中保持键盘、读屏、RTL 和深色模式可用性。
- 非目标：不为展示性网站、内容阅读产品或触屏优先的消费级界面提供通用品牌模板。

### Personas and jobs

- **主要用户：** GIS 分析师、数据工程师、地图制作者、空间数据平台运维人员，以及集成 Mapseek registry 的前端开发者。
- **核心任务：** 管理图层与数据集、检查属性、调整渲染样式、观察处理状态、管理图标/字体/雪碧图资源、复制服务端点。
- **使用情境：** 桌面端为主，常见多面板并置、长时间使用、键鼠混合操作和高信息密度。

### Information architecture

- 基础层级固定为 **theme → UI primitive → domain block → product screen**。
- 左侧栏承载资源或图层分类；主区域承载表格、网格、地图或编辑器；抽屉、弹窗和浮层只处理局部任务。
- 页面内最重要的动作放在顶部工具栏或面板尾部；破坏性动作不得与主动作拥有相同视觉权重。

### Design principles

1. **Precision before decoration：** 边界、对齐和状态比装饰更重要。
2. **Dense, not cramped：** 使用 24–36px 控件和 8–16px 容器间距，但保留清晰分组。
3. **Semantic tokens only：** 组件消费 `primary`、`muted`、`border` 等语义令牌，不直接复制颜色常量。
4. **Reuse before invention：** 先组合 `registry/ui/`；只有多个领域场景重复时才新增 block。
5. **State is never color-only：** 选择、错误、进度和状态必须结合文字、图标、边框或结构变化。

## Colors

主色是绿色轴的 OKLCH 色板，用于主动作、选中状态、焦点和有限的关键强调。大面积界面保持近白/近黑中性色，让地图、图表、色带和数据本身成为主要视觉内容。

- **Primary：** 仅用于当前主动作、选中项、焦点环和关键进度；单一局部不应出现多个竞争主色按钮。浅色主题的主色实心表面统一使用 `on-primary` 白色前景，文字、`currentColor` SVG 与图标按钮必须继承该前景；深色主题继续使用独立的 `dark-on-primary`。
- **Surface：** `background` 是应用底层，`surface` 对应 card/popover，`muted` 用于弱层级和 hover。
- **Borders：** 默认边界使用 `border`；需要强调结构或输入边界时使用 `border-strong`，不要引入临时灰色。
- **Status：** `destructive` 只表示危险或错误；危险按钮使用 10%/20% 色调背景加 destructive 前景，不使用实心 destructive 底。`warning` 与 `info` 必须配合文本/图标。图表和分类色继续以 `registry/theme/registry.json` 的 `chart-*`、`cat-*` 为唯一运行时来源。
- **Dark mode：** 使用对应 `dark-*` 语义，不反转亮色值；浮层和卡片只比背景略亮，避免纯黑/纯白大面积反差。
- **Selection：** 采用浅主色背景加主色边框/指示条；选择状态不得只靠 hover 表达。

## Typography

Geist Mono Variable 是默认字体，也是当前 `font-sans` 与 `font-mono` 的实现。统一等宽字形强化数值、坐标、代码、图层名和资源元数据的可比性。

- 应用根字号为 16px；密集组件正文默认 12px，辅助文本为 10–11px，界面标题通常为 14–15px。
- 字重限制为 400、500、600；产品标识可使用 700。不要用超细字重或仅靠加粗制造层级。
- 技术标签和分组标题可使用大写、`0.04em–0.06em` 字距；普通句子、按钮和表单标签保持正常大小写。
- 坐标、统计值、存储量和计数启用 tabular numerals；代码、端点和标识符保持等宽且允许横向滚动或截断。
- 42px `data-display` 只用于字体预览或同类展示数据，不能成为常规页面标题。

## Layout

布局以 4px 基线和细粒度半步构建；常用组件间距为 4–8px，容器内边距为 8–16px，面板级间距为 16–24px。

- **Control heights：** `xs` 24px、`sm` 28px、default 32px、`lg` 36px；同一工具栏优先保持单一高度。
- **Panels：** 侧栏和编辑面板使用稳定宽度、1px 边界和独立滚动；例如资源侧栏当前基准宽度为 220px。
- **Grids：** 资源网格使用 `auto-fill/minmax` 自适应列；图标、雪碧图和字体卡片可以有不同最小列宽，但共享间距和状态规则。
- **Tables：** 表格容器必须允许横向滚动；表头约 40px，数据行保持紧凑并支持选择/悬停反馈。
- **Overlays：** 弹窗最大宽度受视口约束，移动宽度至少保留 16px 边距；抽屉用于长内容，popover/tooltip 用于局部信息。
- 使用逻辑方向属性（`start/end`、`ps/pe`、`ms/me`）支持 RTL；方向性图标在 RTL 下镜像。

## Elevation & Depth

默认层级依靠 **边界、底色差和遮罩**，而不是阴影。卡片使用细 ring，表格和面板使用 1px border，选中项使用浅主色底与主色边界。

- 普通卡片和静态面板不得添加投影。
- 弹窗、菜单、toast 和地图浮动控件可使用主题已有 `shadow-*`；地图浮层使用 `--shadow-map-float`。
- 遮罩保持轻量并可配合小幅 backdrop blur；不可让背景信息完全失去上下文。
- z-index 只按应用栏、浮动控件、菜单/tooltip、模态层的明确层级使用，禁止任意递增。

## Shapes

所有矩形控件、输入框、卡片、菜单、弹窗和面板均为 **0px 圆角**。这是 Mapseek 的核心识别特征，不得用默认 shadcn 圆角覆盖。

- `rounded.full` 只允许用于天然圆形的状态点、switch 轨道/滑块或头像遮罩。
- 图标默认来自 Tabler，常用尺寸 12–16px，常用 stroke 为 1.5–1.75；同一区域保持一致。
- 图标按钮必须保持正方形，并使用组件提供的 `icon-*` 尺寸变体。
- 分隔线使用 1px；不要通过多层边框、厚描边或装饰性轮廓制造层级。

## Components

### Ownership and composition

- `registry/theme/registry.json` 拥有颜色、字体、圆角、阴影、动效和 Tailwind 主题映射。
- `registry/ui/` 拥有可复用的基础语义、尺寸、状态和可访问性；产品代码不得复制 button/input/dialog 等基础实现。
- `registry/blocks/` 只组合 primitives 并表达 GIS/资源领域结构。blocks 通过 props 接收数据、label 和 handler，不嵌入业务引擎或网络请求。
- `packages/docs/` 直接消费当前 registry 源码，是唯一的文档、视觉与交互验收面。每个公开 primitive 和 block 必须同时提供中英文文档、可访问且可深链的嵌入示例；新增公开项时完整性测试必须同步通过。

### Required component behavior

- **Button/IconButton：** 使用现有 variant 与 size；图标独占按钮必须提供可访问名称和 tooltip（若含义不显然）。disabled 使用不可交互和透明度降低，pending 同时设置 `aria-busy`。
- **Input/Field：** 默认高 32px；label、description、error 由 Field 组合；错误同时设置 `aria-invalid` 与可读错误文本，`FieldError` 保持 `role="alert"`。
- **Card：** 用于明确分组，不作为每个内容块的默认包装；default 内边距 16px，small 为 12px。
- **Dialog/Sheet：** Dialog 统一使用 `DialogContent → DialogHeader / DialogBody / DialogFooter` 结构；`DialogContent` 负责 16px 内边距和 16px 区块间距，业务用例不得在标题或 footer 上重复补边距。标题必须可读，关闭按钮必须有屏幕阅读器标签；footer 在窄屏纵向排列，在 `sm` 以上横向右对齐。短确认流程用 dialog，长表单/详情用 sheet。
- **Table/Grid：** 行或卡片的 hover、focus-within、selected 三态必须可区分；可选项使用真实 Checkbox，不用仅可点击的装饰元素代替。
- **Tooltip/Popover/Menu：** tooltip 只补充简短说明；可操作内容进入 popover/menu。不得把关键任务信息仅放入 hover 内容。
- **Empty/Skeleton/Progress/Toast：** 根据持续时间和结果分别表达空态、加载、进行中、成功或失败；不要用同一个 spinner 覆盖所有情况。

### New component acceptance

新增 primitive 前必须证明现有 `registry/ui/` 无法通过组合满足需求。新增 block 必须具有明确领域语义、无业务副作用、支持 label 注入，并在 `registry/*/registry.json` 中声明依赖。变体优先使用 `class-variance-authority` 和 `data-*` 状态，不创建平行样式系统。

## Do's and Don'ts

- **Do** 使用主题语义类（如 `bg-background`、`text-muted-foreground`、`border-border`）。
- **Don't** 在组件中新增与主题重复的 hex、rgb、hsl 或 OKLCH 常量。
- **Do** 复用 24/28/32/36px 控件高度和 4px 间距节奏。
- **Don't** 为“更现代”而加入圆角、渐变、玻璃效果或大面积阴影。
- **Do** 为 hover 同时设计 keyboard focus，为选中同时提供非颜色线索。
- **Don't** 把 `div onClick` 当作默认按钮；若结构限制必须使用，补齐 role、tabIndex 和键盘处理。
- **Do** 使用逻辑方向属性与 RTL 图标镜像。
- **Don't** 在 blocks 中写死业务文案；通过 labels/defaults 注入，并保持术语一致。
- **Do** 在深色与浅色主题都验证文本、边界、选择和危险状态。
- **Don't** 以降低字体到 10px 以下作为解决空间不足的首选；先截断、折行、滚动或重新分组。

## Accessibility

- **目标：** WCAG 2.2 AA；普通文本最低 4.5:1，大文本最低 3:1，非文本交互边界/状态最低 3:1。
- 所有交互必须支持键盘；使用 `:focus-visible`，焦点环不得被 `outline-none` 后无替代地移除。
- 图标按钮、关闭按钮、颜色选择器和地图控制必须有 `aria-label`；装饰图标不得重复朗读文字。
- 表单错误通过文本和 `aria-invalid` 关联；加载操作使用 `aria-busy`，动态结果根据重要性使用合适的 live region。
- 动效遵守 `prefers-reduced-motion`；不以闪烁、连续位移或颜色变化作为唯一反馈。
- 紧凑视觉尺寸不等于紧凑命中区：触屏场景应由外层布局扩大命中区域，关键操作目标建议至少 44×44px。

## Responsive behavior

- 主要支持现代桌面浏览器；窄屏作为可用降级，不承诺把所有专业多面板流程重构为移动优先体验。
- 顶部栏在窄屏允许动作区换至下一行；dialog footer 在窄屏纵向排列，在 `sm` 以上恢复横向右对齐。
- 双列选择卡在 `md` 以下改为单列；表格和端点保持横向滚动，不压缩到不可读。
- 侧栏和重型编辑器在产品层决定折叠、sheet 化或隐藏；primitive 不硬编码产品断点策略。
- hover 专属操作必须在触屏或键盘焦点下有等价入口。

## Interaction states

- **Loading：** 已知结构使用 Skeleton；确定进度使用 Progress；全屏初始化才使用 LoadingScreen。
- **Empty：** 说明为什么为空，并在可恢复时提供单一明确动作。
- **Error：** 就地错误靠近触发源；全局失败使用 toast/notification，同时保留可恢复路径。
- **Success：** 保存等即时操作可使用短 toast；持续状态应写入界面本身，不只显示瞬时消息。
- **Disabled：** 仅用于当前不可执行的动作；若原因不明显，在邻近说明或 tooltip 中解释。
- **Selected：** 使用浅主色底、主色边界/指示条以及语义状态；hover 不得覆盖 selected。
- **Slow/offline：** 保留用户输入，显示进行中或重试状态，不把网络延迟表现为空内容。

## Content voice

- 语气直接、技术准确、简短；按钮使用动词，状态使用明确名词或过去分词。
- 同一领域术语保持唯一译法；坐标系、波段、图层、数据集、瓦片集、雪碧图和服务端点不得混用近义词。
- 错误信息说明发生了什么、影响什么、用户下一步能做什么；不要只写“操作失败”。
- block 的可见文案通过 `labels` 与 `defaults` 注入；基础 primitive 只保留必要的可访问默认值。

## Implementation constraints

- **框架：** React 19、TypeScript 5.9、Tailwind CSS 4、Base UI、shadcn registry、Tabler Icons。
- **样式：** 使用 CSS variables + Tailwind 语义类；类名合并使用现有 `cn`，变体使用 CVA 或既有 `data-*` 模式。
- **主题：** 任何令牌变更先修改 `registry/theme/registry.json`，再同步消费面；不得让 `DESIGN.md` 与运行时主题长期分叉。
- **国际化：** blocks 的业务文案必须可注入；使用逻辑方向属性，保持 `components.json` 的 RTL 能力。
- **性能：** 大表格/列表保留虚拟化或滚动边界；避免在 render 内创建与数据量线性增长的昂贵样式计算。
- **验证：** 变更后运行 `bun run lint`、`bun run typecheck`、`bun run test`、`bun run registry:validate`，并使用 `@google/design.md lint DESIGN.md` 校验本文件。

## Open questions

- [ ] 亮色 `primary` + 白色按钮文字当前对比度为 3.22:1，是否调整主色或前景色以达到普通文本 4.5:1？负责人：设计系统；影响：主按钮和 WCAG 2.2 AA。
- [ ] 产品层是否正式承诺移动端完整编辑流程？负责人：产品；影响：侧栏与编辑器的响应式模式。
- [ ] 是否需要为 chart/category 色板建立色盲安全的成对/序列约束？负责人：设计系统；影响：图表和分类地图。
- [ ] 触屏设备上的紧凑控件是否统一由产品壳扩大至 44px 命中区？负责人：前端架构；影响：地图控件和工具栏。
