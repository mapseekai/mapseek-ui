# Mapseek UI — DESIGN.md 与实现不一致问题清单

> 来源：2026-08-06 设计与实现一致性审计（DESIGN.md vs `registry/theme`、`registry/ui`、`registry/blocks`、`packages/docs`、`showcase`）。
> 每条附 `文件:行号` 证据。修复后勾选。

## P0 — 直接违反明文契约

### 主题 / token 层

- [x] **1. 排版 token 名存实亡**：✅ 已修复（739cda8 起）：14 个 typography token 全部落地运行时变量（含 headline 系列 `-0.02em` tracking 变量），registry 全库改用令牌类。~~DESIGN 定义 9 个 typography token，`registry/theme/registry.json:16-18,87-89` 仅实现 `headline-md` 一个~~
- [x] **2. dark 主题缺 `cat-*` 覆盖**：✅ 已修复（739cda8）：`--cat-1..6` 已在 dark 段定义（cat-1 保持品牌绿，cat-2..6 提亮适配暗底），showcase/docs 生成 CSS 的 `.dark` 块均已输出。~~`--cat-1..6` 仅 light 定义，dark 下回退浅色值~~
- [x] **3. docs 站丢失 theme `css` 块**：✅ 已修复（工作区未提交）：`generate-docs-theme.ts` 现序列化完整 `css` 块（imports / custom-variant / base / utilities / keyframes），docs 编译 CSS 实测获得 `.mono`/`.tnum`/`body 16px`/滚动条/keyframes 等规则，docs `globals.css` 与 showcase `app.css` 的手工拷贝已收编为单一来源。原问题：~~`.mono`/`.tnum` 与 `body text-[16px]` 未进入 `theme.generated.css`~~：`scripts/generate-docs-theme.ts` 只序列化 cssVars，`.mono`/`.tnum` 与 `body text-[16px]` 未进入 `packages/docs/app/theme.generated.css`；`globals.css:75-79` body 规则也无 font-size。后果：BandStat / NotificationCenter / LinkedRefList / StatStrip 等的 `mono tnum` 类在 docs 验收面上为空操作。showcase 靠 `showcase/src/app.css:57-66` 手工复制幸免。
- [x] **4. 死字体导入**：✅ 已修复：`@fontsource-variable/geist`（非 Mono）从 theme dependencies、registry `css` 导入、根与 docs `package.json`（含 lockfile）全部移除；docs/showcase 手写 CSS 的字体导入收编进生成 CSS（仅 geist-mono）；`--font-sans`/`--font-mono` 均指向等宽栈，8 处 `font-sans` 消费者不受影响。安装契约测试加反向断言防回归。~~无任何 token 引用，与 "single monospaced voice" 矛盾~~

### 选中 / hover 契约（Colors 章节）

- [ ] **5. ResourceSidebar 选中态违规 ×2**：`registry/blocks/resource-sidebar/ResourceSidebar.tsx:40-41,236-237` — 选中用 `bg-primary/10` 而非 `{colors.selection-bg}`；且无条件 `hover:bg-accent/50` 在 hover 时覆盖选中表面（契约要求选中元素 hover 时保留状态表面 + primary 文字）。
- [ ] **6. ResourceGrid 图标卡片**：`registry/blocks/resource-grid/ResourceGrid.tsx:90-93` — 选中态用 `primary/5 + ring-primary` 而非 selection-bg token，名称文字不转 primary；普通 hover 用 primary 填色 + primary ring（绿色被用作装饰性 hover）。
- [ ] **7. NotificationCenter 行 hover 色调错误**：`registry/blocks/notification-center/NotificationCenter.tsx:218` — `hover:bg-destructive/5`，普通交互 hover 应为 `bg-accent/50`。
- [ ] **8. attr-table 拖拽手柄 hover 滥用 primary**：`registry/blocks/attr-table/attr-table-sheet.tsx:148` — `hover:bg-primary/40`，非 accent/50 也非选中态。

### 组件契约（front matter components 段）

- [ ] **9. Badge 默认表面违反 front matter**：契约 `badge: bg-muted + text-foreground`，实现 `registry/ui/badge.tsx:12` 默认 `bg-primary text-primary-foreground`；被动标签占用保留动作绿，冲突 "Use green only for primary action, current focus, selection"。
- [ ] **10. attr-table 表头规格不符**：`registry/blocks/attr-table/virtual-table.tsx:231` `h-9`（36px）vs 契约 `table-header 40px`；`:239` `text-[11px]` vs body-md 12px（表头比数据单元格还小）。注：`registry/ui/table.tsx:75` 原语合规。
- [ ] **11. Tooltip 非 popover 表面**：`registry/ui/tooltip.tsx:41` — 反色 `bg-foreground/text-background`，无 border/ring；Elevation 表 Floating 行明确包含 tooltips = "Popover surface with a 1px border or ring"。
- [ ] **12. Scrim 不一致**：`dialog.tsx:28` 合规（`bg-black/10` + blur），但 `sheet.tsx:21`、`alert-dialog.tsx:26` 为 `bg-black/40` 无 blur，违反 "Dialog scrims are light (black/10)"。
- [ ] **13. Command 裸用无边界**：`registry/ui/command.tsx:15` 无 border/ring，仅 CommandDialog 靠 DialogContent 的 ring 兜底。

## P1 — 形状与排版纪律

- [ ] **14. 保留列表外的圆角**：
  - `registry/ui/radio-group.tsx:15` Radio 根 `rounded-full`（rounded.full 仅保留给 status dots/avatar/switch）；
  - `registry/blocks/attr-table/attr-table-sheet.tsx:153` 拖拽丸 `rounded-full`；
  - `registry/ui/chart.tsx:197,289` 图例色块 `rounded-[2px]`；
  - `registry/ui/button-radio-group.tsx:26` `rounded-md`（被 `--radius-md:0px` 运行时中和，但违反 "Do not reintroduce framework corner radii" 字面）。
- [ ] **15. 禁用字重 700**："Use weights 400, 500, and 600" — `registry/blocks/style-editor-modal/StyleEditorModal.tsx:39,67,129`、`registry/blocks/style-function-editor/StyleFunctionEditor.tsx:30,38`、`registry/blocks/notification-center/NotificationCenter.tsx:75`、`registry/blocks/product-logo/ProductLogo.tsx:50` 均用 `font-bold`。
- [ ] **16. 坐标无 tabular numerals**：类型规则明言 coordinates 用 tnum；`registry/blocks/map-coordinate-status/MapCoordinateStatus.tsx:134,175` 坐标读数仅 `font-mono`，无 tnum/tabular-nums。
- [ ] **17. label-md 被各文件重新发明**：契约 10px/500/0.06em — 约 20 处实现为 0.04em（`combobox.tsx:199`、`attr-field.tsx:128,131`、`pixel-probe`、`storage-meter` 等）、0.05em（`LayerPanel.tsx:366`）、0.07em（`CrsPicker.tsx:153`）、tracking-wider（`StyleFunctionEditor.tsx:30`），尺寸漂移 11px/12px，字重漂移 600/700。`registry/ui/select.tsx:112` SelectLabel 完全不符合 label-md（12px/400 无大写）。
- [ ] **18. 标题尺寸脱轨**：`alert-dialog.tsx:74`、`sheet.tsx:96` 标题 14px/600 vs headline-md 15px/600；`StyleEditorModal.tsx:39` 覆盖 DialogTitle 为 18px/700；`registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx:284` 标本 `text-5xl` 48px vs data-display 42px。
- [ ] **19. 离刻度尺寸**：8px（`NotificationCenter.tsx:75`）、9px（`showcase/src/showcases/AppTopBarShowcase.tsx:45`）、20px（`registry/blocks/linked-ref-list/LinkedRefList.tsx:112`）、24px（`registry/blocks/band-stat/BandStat.tsx:171`）。

## P1 — 表单 / 按钮细节

- [ ] **20. Slider 滑块硬编码 `bg-white`**：`registry/ui/slider.tsx:51` — 违反 "Do not copy color literals"，dark 主题保持白色（switch 滑块用 `bg-background` 为正确范式）。
- [ ] **21. aria-invalid 缺口**：`slider.tsx`、`radio-group.tsx` 全文无 aria-invalid 样式；契约 "Invalid controls expose aria-invalid and visible error copy"。
- [ ] **22. icon-button 与设计全面脱节**：`registry/ui/icon-button.tsx` — 无 aria-label 强制、无 tooltip 支持（契约明文要求）；尺寸仅 24/32 两档（缺 28/36）；原生 `<button>` 而非 Base UI；focus ring `ring-ring/20` 与 Button 的 `/50` 不一致；无 `rounded-none`。
- [ ] **23. Focus ring 颜色打折**：front matter `focus-ring: {colors.ring}` 全色，实现统一 `ring-ring/50`（`button.tsx:7`、`button-radio-group.tsx:41`）甚至 `/20`（`icon-button.tsx:22`）。
- [ ] **24. Switch 高度 18.4px/14px**：`registry/ui/switch.tsx:17` — 不在 24/28/32/36 刻度，18.4px 破坏 4px 节奏。
- [ ] **25. 未记录变体 / 组件**：ButtonRadioGroup `soft` 变体（`button-radio-group.tsx:7,41`）、button-group 整组件（`button-group.tsx`）、destructive 按钮 `border-destructive/10` 边框（`button.tsx:19`）均未出现在 DESIGN。需决定：补文档或删实现。

## P2 — Blocks / 文案注入

- [ ] **26. 不可注入的英文 aria 文案 ×4**：`registry/blocks/layer-panel/LayerPanel.tsx:177`（"Toggle layer panel"）、`:453`、`:547`（英文模板串）、`registry/blocks/attr-table/attr-table-sheet.tsx:151`（"Resize attribute table"）— 不走 labels prop，违反 "no non-injectable product copy"。
- [ ] **27. attr-table 截断不可发现**：`registry/blocks/attr-table/virtual-table.tsx:265` `truncate` 无 title/tooltip，列固定 160px（`:11`），横向滚动也看不到全文；契约要求 "truncate with a discoverable full value or scroll horizontally"。

## P2 — 文档 / 验收面

- [ ] **28. docs 侧栏漏 2 个组件**：`packages/docs/content/docs/components/meta.json` 漏 `alert`、`card-tabs`（页面存在可路由，仅导航不可见）。
- [ ] **29. 根 `components.json:8` 悬空**：`tailwind.css: src/app.css` 不存在；`@/components`、`@/hooks` 别名无根目录支撑（仅影响根目录跑 `shadcn add`）。
- [ ] **30. 校验脚本覆盖缺口**：`scripts/check-docs-examples.ts` 必需清单缺 17 个新原语（alert、alert-dialog、aspect-ratio、breadcrumb、button-group、calendar、card-tabs、copy-button、hover-card、input-number、item、kbd、menubar、native-select、navigation-menu、scroll-area、spinner）；CI `.github/workflows/deploy-pages.yml` 只跑 `docs:build` 不跑 `docs:verify`。

## 待裁决判断点（非缺陷，需设计决策）

- [ ] **A. 字重规范性**：front matter 绑定 `typography: body-md`（400），实现统一 `font-medium`（500）（`button.tsx:7`、`badge.tsx:8`、`tabs.tsx:53`、`select.tsx:46`、`table.tsx:75`）。prose 允许 500 —— 需明确 YAML 对字重是否规范，然后统一改文档或改实现。
- [ ] **B. select 家族 input-surface 契约**：契约只点名 input/textarea/input-group；`select.tsx:46` 触发器用 `bg-background`，`combobox.tsx:233` chips 用 `border-border bg-background`。决定是否将 select 家族纳入透明输入契约。
- [ ] **C. tooltip 反色表面**：若是有意例外，应从 Elevation 表 Floating 行移除 tooltips；否则按 #11 修复。
- [ ] **D. oklch vs oklab**：DESIGN 写 `color-mix(in oklch, ...)`，Tailwind `/80` 修饰符生成 `in oklab`。视觉等价，决定契约措辞是否放宽。
- [ ] **E. 未记录小尺寸**：checkbox/radio `size-4`（16px）、slider 滑块 `size-3`（12px）、textarea `min-h-16`（64px）偏离 24/28/32/36 刻度，DESIGN 未规定小型选择控件尺寸 —— 决定补文档还是改实现。

## 已验证一致（无需处理）

- front matter 颜色与 theme light 逐值相等（含 warning/info、selection 三色、border-strong、input-surface）。
- `DESIGN.zh-CN.md` 与英文版完全对等（含透明输入对比度契约）。
- registry 完整性：57 原语 + 49 blocks 全部有 zh/en 文档和 showcase demo；ShowcaseDemo 解析缺失即抛错。
- table 原语（40px 表头 / bordered / 横向滚动）、card（16px + 12px compact）、popover（10px）、dialog（16px 结构、footer 堆叠、scrim 合规）。
- button 尺寸刻度（24/28/32/36 + 10px padding）、destructive tinted、ghost/link 变体存在。
- Base UI 全覆盖（registry/ui 零 Radix）、所有 shadow token = none、calendar 自定 `[--cell-radius:0px]`。
- input/input-group/textarea 的 input-surface 契约、FieldError `role="alert"`、checkbox/switch/slider/select/combobox/toggle/tabs 持久选中指示器。
- LayerPanel / MapSwitcher / VirtualTable 选中态合规；blocks 零网络调用；ResourceGrid auto-fill 最小宽度合规。
