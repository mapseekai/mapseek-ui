# Mapseek UI — DESIGN.md 与实现不一致问题清单

> 来源：2026-08-06 设计与实现一致性审计（DESIGN.md vs `registry/theme`、`registry/ui`、`registry/blocks`、`packages/docs`、`showcase`）。
> 每条附 `文件:行号` 证据。修复后勾选。
> #1–#30 与 A–E 已全部收口；#31–#63 为 2026-08-07 复审追加（见文末）。

## P0 — 直接违反明文契约

### 主题 / token 层

- [x] **1. 排版 token 名存实亡**：✅ 已修复（739cda8 起）：14 个 typography token 全部落地运行时变量（含 headline 系列 `-0.02em` tracking 变量），registry 全库改用令牌类。~~DESIGN 定义 9 个 typography token，`registry/theme/registry.json:16-18,87-89` 仅实现 `headline-md` 一个~~
- [x] **2. dark 主题缺 `cat-*` 覆盖**：✅ 已修复（739cda8）：`--cat-1..6` 已在 dark 段定义（cat-1 保持品牌绿，cat-2..6 提亮适配暗底），showcase/docs 生成 CSS 的 `.dark` 块均已输出。~~`--cat-1..6` 仅 light 定义，dark 下回退浅色值~~
- [x] **3. docs 站丢失 theme `css` 块**：✅ 已修复（工作区未提交）：`generate-docs-theme.ts` 现序列化完整 `css` 块（imports / custom-variant / base / utilities / keyframes），docs 编译 CSS 实测获得 `.mono`/`.tnum`/`body 16px`/滚动条/keyframes 等规则，docs `globals.css` 与 showcase `app.css` 的手工拷贝已收编为单一来源。原问题：~~`.mono`/`.tnum` 与 `body text-[16px]` 未进入 `theme.generated.css`~~：`scripts/generate-docs-theme.ts` 只序列化 cssVars，`.mono`/`.tnum` 与 `body text-[16px]` 未进入 `packages/docs/app/theme.generated.css`；`globals.css:75-79` body 规则也无 font-size。后果：BandStat / NotificationCenter / LinkedRefList / StatStrip 等的 `mono tnum` 类在 docs 验收面上为空操作。showcase 靠 `showcase/src/app.css:57-66` 手工复制幸免。
- [x] **4. 死字体导入**：✅ 已修复：`@fontsource-variable/geist`（非 Mono）从 theme dependencies、registry `css` 导入、根与 docs `package.json`（含 lockfile）全部移除；docs/showcase 手写 CSS 的字体导入收编进生成 CSS（仅 geist-mono）；`--font-sans`/`--font-mono` 均指向等宽栈，8 处 `font-sans` 消费者不受影响。安装契约测试加反向断言防回归。~~无任何 token 引用，与 "single monospaced voice" 矛盾~~

### 选中 / hover 契约（Colors 章节）

- [x] **5. ResourceSidebar 选中态违规 ×2**：✅ 已修复（工作区未提交）：TypeRow/CategoryRow 选中态改用 `bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary`（选中 hover 保留表面 + primary 文字），非选中行才 `hover:bg-accent/50`；showcase 实测计算样式确认。~~`registry/blocks/resource-sidebar/ResourceSidebar.tsx:40-41,236-237` — 选中用 `bg-primary/10` 而非 `{colors.selection-bg}`；且无条件 `hover:bg-accent/50` 在 hover 时覆盖选中表面（契约要求选中元素 hover 时保留状态表面 + primary 文字）。~~
- [x] **6. ResourceGrid 图标卡片**：✅ 裁决为契约追认实现（视觉评审后保留原样）：DESIGN.md/DESIGN.zh-CN.md 新增卡片类例外——hover 与选中均用 `primary/5` 填充 + 1px 主色绿框，选中以持续填充+绿框+勾选作持久标识。实现维持 `ResourceGrid.tsx:90-93` 原状。~~选中态用 `primary/5 + ring-primary` 而非 selection-bg token；普通 hover 用 primary 填色 + primary ring。~~
- [x] **7. NotificationCenter 行 hover 色调错误**：✅ 已修复（工作区未提交）：`NotificationCenter.tsx:218` 行 hover 改为 `hover:bg-accent/50`,showcase 实测 hover 计算样式 = accent/50。清除按钮的 destructive 语义（`hover:bg-destructive/10`）为破坏性操作正当用法，未动。~~`registry/blocks/notification-center/NotificationCenter.tsx:218` — `hover:bg-destructive/5`，普通交互 hover 应为 `bg-accent/50`。~~
- [x] **8. attr-table 拖拽手柄 hover 滥用 primary**：✅ 裁决为契约追认实现：拖拽/缩放手柄 hover 允许 `{colors.primary}` 色调（如 40%）作为动作可供性（细条上 accent/50 不可辨识），DESIGN.md/DESIGN.zh-CN.md 已加例外；`attr-table-sheet.tsx:148` 维持 `hover:bg-primary/40` 原状。~~非 accent/50 也非选中态。~~

### 组件契约（front matter components 段）

- [x] **9. Badge 默认表面违反 front matter**：✅ 已裁决并收口（工作区未提交）：用户视觉评审后保留绿色默认（`bg-primary text-primary-foreground`）；outline 变体为 `border-primary text-primary`（绿边 + 绿字）。`DESIGN.md` 与 `DESIGN.zh-CN.md` front matter 均已同步为 primary 默认表面，并补充变体说明。~~契约 `badge: bg-muted + text-foreground`，实现 `registry/ui/badge.tsx:12` 默认 `bg-primary text-primary-foreground`；被动标签占用保留动作绿，冲突 "Use green only for primary action, current focus, selection"。~~
- [x] **10. attr-table 表头规格不符**：✅ 已修复（视觉确认）：`virtual-table.tsx:239` 表头改为 `h-10`（40px）+ `text-body-md-medium`（13px/500），与契约 `table-header` 及 `table.tsx:75` 原语对齐。~~`h-9`（36px）vs 契约 40px；表头比数据单元格还小。~~
- [x] **11. Tooltip 非 popover 表面**：✅ 裁决为契约追认实现：tooltip 反色表面（`bg-foreground`/`text-background` 无边界）属有意例外，已从 Elevation 表 Floating 行移出并加注说明（DESIGN.md/DESIGN.zh-CN.md），`tooltip.tsx` 与 MapControls tooltip 维持原状。~~Elevation 表 Floating 行明确包含 tooltips = "Popover surface with a 1px border or ring"。~~
- [x] **12. Scrim 不一致**：✅ 已修复并运行态验证：`sheet.tsx`、`alert-dialog.tsx` 已与 `dialog.tsx` 对齐为 `bg-black/10` + `supports-backdrop-filter:backdrop-blur-xs`；三者实测均为 10% 黑色遮罩与 `blur(4px)`。~~`dialog.tsx:28` 合规（`bg-black/10` + blur），但 `sheet.tsx:21`、`alert-dialog.tsx:26` 为 `bg-black/40` 无 blur，违反 "Dialog scrims are light (black/10)"。~~
- [x] **13. Command 裸用无边界**：✅ 已修复（工作区未提交）：`Command` 根层现在自带 `border border-border`，可独立作为完整浮层表面；Showcase 两处尺寸容器已移除重复外边框。新增 `command.test.tsx` 锁定裸用边界契约，浏览器实测 Command = 1px border、演示外层 = 0px。~~`registry/ui/command.tsx:15` 无 border/ring，仅 CommandDialog 靠 DialogContent 的 ring 兜底。~~

## P1 — 形状与排版纪律

- [x] **14. 保留列表外的圆角**：✅ 已裁决并修复：Radio（16px 真圆）与 attr-table 拖拽握把（40×2px 胶囊）为有意例外，已加入 DESIGN.md/DESIGN.zh-CN.md 的 `{rounded.full}` 允许列表；chart tooltip/legend 色块（`chart.tsx:197,289`）已从 `rounded-[2px]` 改为 `rounded-none`；ButtonRadioGroup 已删除无视觉作用、但可能在主题覆写时泄漏的 `rounded-md`。对应测试 11/11 通过。
- [x] **15. 禁用字重 700**：✅ 已修复：当前全库已无 `font-bold` / 700 字重；遗留的通知角标（12×12px、8px）已由 `font-bold` 改为 `font-semibold`（600），浏览器实测字重 600。~~"Use weights 400, 500, and 600"；审计时列出的多处 font-bold。~~
- [x] **16. 坐标无 tabular numerals**：✅ 已修复（工作区未提交）：`MapCoordinateStatus.tsx:175` 现以 `<span className="tnum">` 包住每个 `item.value`，仅对坐标/层级读数启用 tabular numerals，不波及标签与 CRS 文案。新增 SSR 回归测试覆盖三个默认读数；Showcase 实测三个读数的 `font-variant-numeric` 均为 `tabular-nums`。~~类型规则明言 coordinates 用 tnum；`registry/blocks/map-coordinate-status/MapCoordinateStatus.tsx:134,175` 坐标读数仅 `font-mono`，无 tnum/tabular-nums。~~
- [x] **17. label-md 被各文件重新发明**：✅ 已修复：规范为 10px/500/1.2/0.04em（旧审计中的 0.06em 为误记）。`SelectLabel`、`ComboboxLabel`、字段/类别/指标/坐标/直方图标签均改用 `text-label-md`；AttrField 与 PixelProbe 已移除将 token 覆盖为 400 的 `font-normal`；CRS、色带编辑器与资源详情标题的 0.07/0.06em 漂移已收敛。数值、单位、chip、估算结果和小写色带项等非 taxonomy 文案保持原样。契约测试 10/10 通过，浏览器实测 CRS 分组和坐标标签为 10px/500/12px/0.04em。
- [x] **18. 标题尺寸脱轨**：✅ 已修复：AlertDialog 与 Sheet 标题均使用 `text-headline-md`（15px/600/1.25/-0.02em）；StyleEditorModal 主标题使用完整 `text-headline-lg`（18px/600/1.2/-0.02em），已移除覆盖 token 行高的 `leading-none`；ResourceDetailDrawer 标本使用 `text-data-display`（42px/600/1/tnum）。新增契约测试覆盖四处；浏览器实测样式弹窗标题为 18px/600/21.6px/-0.36px。~~旧审计中的 14px/600、18px/700 与 48px 实现。~~
- [x] **19. 离刻度尺寸**：[OK] AppTopBar Showcase 的 9px 状态 pill 已改用 `ResourceStatusBadge`（`text-body-sm-medium`，11px），dirty 映射 `neutral`、saved 映射 `ready`；NotificationCenter 8px、LinkedRefList 20px、BandStat 24px 按本次裁决保留为例外，不处理。

## P1 — 表单 / 按钮细节

- [x] **20. Slider 滑块硬编码 `bg-white`**：✅ 已裁决并修复：保留深色模式的高对比近白 thumb，但不复制字面量；浅色使用 `bg-background`，深色使用 `dark:bg-foreground`（Switch 的既有语义范式）。浏览器实测浅色 thumb = `--background`，深色 thumb = `--foreground`。新增回归契约测试。~~`registry/ui/slider.tsx:51` 使用 `bg-white`，dark 主题仍保持白色。~~
- [x] **21. aria-invalid 缺口**：✅ 已裁决不处理：Slider 与 RadioGroup 仅用于即时选择／调节，不承载业务校验；无需为不会出现的 invalid state 增加 destructive 视觉样式或泛化错误文案。保留底层 primitive 的 `aria-invalid` 属性透传能力。~~`slider.tsx`、`radio-group.tsx` 全文无 aria-invalid 样式；契约 "Invalid controls expose aria-invalid and visible error copy"。~~
- [x] **22. icon-button 与设计全面脱节**：✅ 已修复（工作区未提交）：`IconButton` 现通过 Base UI `Button` 渲染；`label` 为必填 accessible name 并直映 `aria-label`，`tooltip` 支持默认 label 或自定义文本；新增 `xs/sm/md/lg` = 24/28/32/36px，默认 md，固定 `rounded-none`，focus ring 与 #23 一致为 `ring-ring/20`。所有调用方已迁移到 `label`，注册表已声明 tooltip 依赖；中英文 docs 与 showcase 覆盖四尺寸。新增 6 项契约测试；`pnpm test` 52 文件/200 测试、typecheck/lint/registry 验证和 icon-button browser QA 均通过。~~`registry/ui/icon-button.tsx` — 无 aria-label 强制、无 tooltip 支持（契约明文要求）；尺寸仅 24/32 两档（缺 28/36）；原生 `<button>` 而非 Base UI；无 `rounded-none`。Focus ring 已由 #23 统一为 `ring-ring/20`。~~
- [x] **23. Focus ring 颜色打折**：✅ 已裁决并修复：所有常规键盘 focus ring 统一为 `ring-ring/20`，保留 3px 宽度；此前的 `/50` 与两个不透明 override 已迁移，错误态 `ring-destructive/*` 不变。`DESIGN.md` 与 `DESIGN.zh-CN.md` 明确记录 20% opacity；新增回归契约测试并在浏览器实测 Button、Checkbox、Radio、ButtonRadioGroup、Slider、Switch 均为 3px / 20%。~~front matter `focus-ring: {colors.ring}` 全色，实现统一 `ring-ring/50`（`button.tsx:7`、`button-radio-group.tsx:41`）甚至 `/20`（`icon-button.tsx:22`）。~~
- [x] **24. Switch 高度 18.4px/14px**：[OK] 已按视觉裁决恢复紧凑轨道：default 为 32×18.4px / 16px thumb，sm 为 24×14px / 12px thumb；这两档是通用控件高度刻度的明确例外，`after` 指针目标上下各扩展 8px。framed `ServiceStatus` 同步恢复 24px 高度。DESIGN 中英版已记录该契约，Switch 几何回归测试覆盖两档。~~`registry/ui/switch.tsx:17` 使用 18.4px/14px，高度不在 24/28/32/36 刻度。~~
- [x] **25. 未记录变体 / 组件**：✅ 已补全文档：`button-radio-group` 记录 default/`soft` 选中态与 24/28/32/36px 尺寸；`button-group` 记录方向、边框折叠与焦点层级；`button-destructive` 记录 `border-destructive/10` 与 hover 的 20% 边框。`DESIGN.md`/`DESIGN.zh-CN.md` 同步，新增回归契约测试。~~ButtonRadioGroup `soft` 变体（`button-radio-group.tsx:7,41`）、button-group 整组件（`button-group.tsx`）、destructive 按钮 `border-destructive/10` 边框（`button.tsx:19`）均未出现在 DESIGN。~~

## P2 — Blocks / 文案注入

- [x] **26. 不可注入的英文 aria 文案 ×4**：[OK] `LayerPanelLabels` 现公开 `collapse`/`expand`、`showLayer`/`hideLayer` 与 `deleteLayer`；`AttrTableSheet` 现公开 `resizeLabel`，四处 accessible name 都经由可覆盖的 labels/prop 注入。
- [x] **27. attr-table 截断不可发现**：✅ 已修复：`virtual-table.tsx` 仅在文本实际横向溢出时显示 Base UI Tooltip，未溢出单元格不显示浮层；原生 `title` 已移除。列固定 160px（`:11`），横向滚动也看不到全文；契约要求 "truncate with a discoverable full value or scroll horizontally"。

## P2 — 文档 / 验收面

- [x] **28. docs 侧栏漏 2 个组件**：✅ 已修复：`packages/docs/content/docs/components/meta.json` 与 `meta.en.json` 已补 `alert`、`card-tabs`；并按字母序重排 sidebar 列表。
- [x] **29. 根 `components.json:8` 悬空**：✅ 已修复：`tailwind.css` 改为 `packages/docs/app/globals.css`；`tsconfig.json` 为 `@/components`、`@/hooks`、`@/lib` 补了根目录映射（分别指向 `./registry` 与 `./registry/lib`）。
- [x] **30. 校验脚本覆盖缺口**：✅ 已修复：`scripts/docs-required-registry-docs.ts` 必需清单已补 17 个新原语；CI `.github/workflows/deploy-pages.yml` 改为跑 `pnpm run docs:verify`。~~`scripts/check-docs-examples.ts` 必需清单缺 17 个新原语（alert、alert-dialog、aspect-ratio、breadcrumb、button-group、calendar、card-tabs、copy-button、hover-card、input-number、item、kbd、menubar、native-select、navigation-menu、scroll-area、spinner）；CI `.github/workflows/deploy-pages.yml` 只跑 `docs:build` 不跑 `docs:verify`。~~

## 待裁决判断点（非缺陷，需设计决策）

- [x] **A. 字重规范性**：✅ 已裁决（2026-08-07）：交互控件、Tabs、Badge 和表头统一使用 `body-md-medium`（13px/500）；`Button size="xs"` 是明确例外，使用 `body-md`（13px/400）。中英文 DESIGN 的 YAML 与 Typography 表均已对齐运行时 token 和实现。~~front matter 绑定 `typography: body-md`（400），实现统一 `font-medium`（500）（`button.tsx:7`、`badge.tsx:8`、`tabs.tsx:53`、`select.tsx:46`、`table.tsx:75`）。prose 允许 500 —— 需明确 YAML 对字重是否规范，然后统一改文档或改实现。~~
- [x] **B. select 家族 input-surface 契约**：✅ 已裁决（2026-08-07）：将选择控件的输入表面纳入透明输入契约；`SelectTrigger`、`NativeSelect`、Combobox 的 `InputGroup` 与 `ComboboxChips` 统一使用 `border-input bg-input-surface`。弹层继续使用不透明 `bg-popover`，单个 chip 保留状态填充。FilterPanel 已移除覆盖默认输入表面的 `border-border bg-background`。~~契约只点名 input/textarea/input-group；`select.tsx:46` 触发器用 `bg-background`，`combobox.tsx:233` chips 用 `border-border bg-background`。决定是否将 select 家族纳入透明输入契约。~~
- [x] **C. tooltip 反色表面**：✅ 已裁决（2026-08-06）：反色为有意例外，Elevation 表 Floating 行已移除 tooltips 并加注说明（见 #11）。
- [x] **D. oklch vs oklab**：✅ 已裁决（2026-08-07）：单一语义色 token 与 `transparent` 的透明度混合，以目标 alpha 为契约；`oklch` 与 Tailwind 生成的 `oklab` 均允许。两个可见颜色混合仍须显式声明插值空间，OKLCH 另须声明色相插值方法；中英文 DESIGN 已同步。~~DESIGN 写 `color-mix(in oklch, ...)`，Tailwind `/80` 修饰符生成 `in oklab`。视觉等价，决定契约措辞是否放宽。~~
- [x] **E. 未记录小尺寸**：✅ 已裁决（2026-08-07）：保留紧凑实现并补文档。Checkbox/Radio 的 16px 可见标记与 Slider 的 12px thumb 不属于 24/28/32/36px 单行和图标控件尺寸体系，伪元素分别提供 40×32px、32×32px、28×28px 指针命中区；Textarea 是可随内容增长的多行输入，64px 为两个默认输入行的最小高度。中英文 DESIGN 已同步。~~checkbox/radio `size-4`（16px）、slider 滑块 `size-3`（12px）、textarea `min-h-16`（64px）偏离 24/28/32/36 刻度，DESIGN 未规定小型选择控件尺寸 —— 决定补文档还是改实现。~~

## 已验证一致（无需处理）

- front matter 颜色与 theme light 逐值相等（含 warning/info、selection 三色、border-strong、input-surface）。
- `DESIGN.zh-CN.md` 与英文版完全对等（含透明输入对比度契约）。
- registry 完整性：57 原语 + 49 blocks 全部有 zh/en 文档和 showcase demo；ShowcaseDemo 解析缺失即抛错。
- table 原语（40px 表头 / bordered / 横向滚动）、card（16px + 12px compact）、popover（10px）、dialog（16px 结构、footer 堆叠、scrim 合规）。
- button 尺寸刻度（24/28/32/36 + 10px padding）、destructive tinted、ghost/link 变体存在。
- Base UI 全覆盖（registry/ui 零 Radix）、所有 shadow token = none、calendar 自定 `[--cell-radius:0px]`。
- input/input-group/textarea 的 input-surface 契约、FieldError `role="alert"`、checkbox/switch/slider/select/combobox/toggle/tabs 持久选中指示器。
- LayerPanel / MapSwitcher / VirtualTable 选中态合规；blocks 零网络调用；ResourceGrid auto-fill 最小宽度合规。

## 2026-08-07 复审追加（#31–#63）

> 来源：2026-08-07 五路并行复审（theme token / 表单原语 / 浮层与容器原语 / blocks / docs 验收面），口径同首轮。
> 旧修复抽查发现 3 处勾选描述与实际不符，已分别并入 #31（裁决 B）、#43（#17）、#61（#28）；其余 27 项旧修复抽查均落实。

### P0 — 直接违反明文契约

- [x] **31. blocks 覆盖 input-surface 契约 ×3（裁决 B 收口不实）**：✅ 已修复（694373e）：`AttrInspector` / `AddFieldForm` 的共享输入类均为 `border-input bg-input-surface`；`FilterPanel` 的值输入同样合规，SelectTrigger 继承合规原语。
- [x] **32. input-number 步进按钮无 focus ring**：✅ 已修复（694373e）：`NumberField.Decrement` / `Increment` 均使用 `focus-visible:ring-[3px] focus-visible:ring-ring/20`。
- [x] **33. CrsPicker 选中行硬编码 oklch 字面量**：✅ 已修复（694373e）：选中行使用 `aria-selected`、`bg-selection-bg` 与 primary 文字；已移除硬编码 `oklch`。
- [x] **34. LayerGroup 选中态违反 selection 契约**：✅ 已修复（694373e）：选中层使用 `bg-selection-bg text-primary`，并保留 `Current` 持久指示。
- [x] **35. ResourceSidebar CategoryRow 选中仅颜色**：✅ 已修复（694373e）：TypeRow 与 CategoryRow 均通过 `aria-pressed` 暴露选中语义；CategoryRow 保留 `text-body-md-medium` 字重作为颜色之外的持久视觉信号，不增加 TypeRow 专属的 primary 左边缘，从而维持大类/小类层级区分。新增回归测试覆盖 true/false 语义及分层视觉契约。
- [x] **36. ResourceGrid 图标网格用 auto-fit**：✅ 已修复（694373e）：图标网格使用 `repeat(auto-fill,minmax(96px,1fr))`，sprite / font 网格同样合规。
- [x] **37. AttrInspector 关闭按钮无可访问名**：✅ 已修复（694373e）：关闭按钮有可注入的 `aria-label={labels.close}` 与 `title={labels.close}`；Tooltip 仅作补充。

### P1 — 纪律性偏差

- [x] **38. ColormapPicker 选中块 hover 失态**：✅ 已修复（694373e）：active swatch 保持 `bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary`，不会被 ghost hover 覆盖。
- [x] **39. MapSearch 选中结果无可视选中态**：✅ 已修复（694373e）：选中结果同时提供 `aria-selected` 与 `bg-selection-bg text-primary` 的可视持久状态。
- [x] **40. 卡片类 hover 偏离裁决 + 普通行滥用 primary 边**：✅ 已修复（694373e）：三处卡片 hover 均为 `hover:border-primary hover:bg-primary/5`；普通 ToolList 行已移除 `hover:border-primary`。
- [x] **41. LayerPanel 行操作按钮隐形但可聚焦**：✅ 已修复：替换后的 `LayerActions` 仅在当前图层真正渲染定位、属性表和更多操作，不再留下透明但可聚焦的按钮；可见性操作始终可见且具有可注入的 accessible name 与 `title`。
- [x] **42. 交互控件标签降为 11px ×4**：✅ 已修复（694373e）：AppTopBar、AttrInspector、Toolbar 和 FilterPanel 的相关交互标签均使用 `text-body-md-medium`。
- [x] **43. font-normal 覆盖 typography token 残留 ×5（#17 未修干净）**：✅ 已修复（694373e）：列出的 ResourceSidebar、ResourceDetailDrawer 与 StyleEditorModal 消费点均已移除 `font-normal`，保留 token 字重。
- [x] **44. 区块/小节标题排版自造或误用**：✅ 已修复（694373e）：相关 dialog / section 标题改为 `text-headline-md`；StyleFunctionEditor 的紧凑面板标题按 DESIGN.md 允许保留 `text-body-md-strong`。
- [x] **45. tnum 缺口：时间戳/统计/存储**：✅ 已修复：`ProcessingTimeline` 原已通过 `.mono` 启用 `tnum`；RasterStylePanel 的统计值、StorageMeter 的详细存储值及 MapSearch 的经纬度 fallback 现均显式使用 `.tnum`。新增回归测试覆盖三处。
- [ ] **46. 离刻度尺寸与手搓开关（部分收口）**：✅ FilterPanel 的连接符与 SQL keyword 按钮、MapCoordinateStatus 的 CRS 触发器均已改为标准 `size="xs"`（24px）与 `text-label-md`；✅ ToggleConfigPopover 的 32×18px 设置箭头、SplitToolPicker 的 32×18px 下拉箭头均裁决为分段控件的有意例外，保留原样；✅ ToggleConfigPopover 的手搓 28×16px 开关已抽为共享 `Switch variant="square"` 并保留原视觉；仍待确认：`registry/blocks/toolbar/Toolbar.tsx` 同一 cluster 的高度混用。契约：24/28/32/36 刻度、"Icon-only controls are square"、"Toolbars use one control height per cluster"。
- [x] **47. calendar 日格 focus ring 25%**：✅ 已修复：`registry/ui/calendar.tsx:179` 现使用 `group-data-[focused=true]/day:ring-ring/20`，保持既有 3px 宽度；`design-component-style` 契约测试已纳入 Calendar。~~契约 20%（#23 统一时漏网）。~~
- [x] **48. kbd 手写 10px 而非 text-label-md**：✅ 已修复：`registry/ui/kbd.tsx:10` 现使用 `font-mono text-label-md`，保留 10px/500 的视觉规格并继承 token 的行高与 0.04em tracking；组件回归测试覆盖该契约。~~原实现为 `font-mono text-[10px] font-medium`，无 0.04em tracking。~~
- [x] **49. card-tabs 选中用 bg-primary/10**：✅ 已修复：`registry/ui/card-tabs.tsx:37` 现使用 `data-active:bg-selection-bg data-active:text-primary`；绿色边缘指示条保持不变，组件测试锁定选中背景 token。~~原实现使用 `data-active:bg-primary/10`。~~
- [x] **50. command 输入框违反透明输入契约**：✅ 已修复：`registry/ui/command.tsx:57` 已移除 `bg-input/30` 与无效 `border-input/30`，保留 `border-none` 和外层底部分隔线，因此继承 InputGroup 的 `bg-input-surface`（浅色透明）；组件测试锁定不再覆盖该表面。~~原实现使用半透明填充与冲突边框类。~~
- [x] **51. radio-group 缺 dark input-surface 填充**：✅ 已修复：`registry/ui/radio-group.tsx:15` 现使用 `dark:bg-input/30`，与 Checkbox 的深色输入面处理一致；新增 Radio 回归测试。~~原实现只有 `border-input`，无深色填充。~~
- [ ] **52. button-radio-group 家族两处**：`registry/ui/button-radio-group.tsx:43` — 未选中项无任何 hover 反馈（契约 "ordinary interactive elements use `{colors.accent}` at 50% opacity"；NativeSelect/Toggle/SelectItem 均合规）；`registry/blocks/form-inputs/InputMultiInput.tsx:48` — 重造 button-radio-group（违反 "Do not duplicate primitive behavior"）且 focus ring 为 `ring-1 ring-ring`（1px/100%，契约 3px/20%）。
- [ ] **53. 静默截断无发现路径 ×7 处**：✅ LayerPanel 替换后，`LayerGroup` 的分组名、图层名和元数据均提供原生 `title`；✅ Toolbox 的工具名与说明均提供原生 `title`；仍待处理：`registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx:44`（KV 值 `max-w-[180px] truncate`，路径/URL/id 无 title/Tooltip）、`registry/blocks/notification-center/NotificationCenter.tsx:228,231,234`（title/description/sourceUid）、`registry/blocks/linked-ref-list/LinkedRefList.tsx:70,141`、`registry/blocks/resource-sidebar/ResourceSidebar.tsx:245`、`registry/blocks/style-editor-panel/StyleEditorPanel.tsx:35,75,78`、`registry/blocks/layer-style-editor/LayerStyleEditor.tsx:48`、`registry/blocks/app-top-bar/AppTopBar.tsx:55`。契约："Long identifiers and data values must truncate with a discoverable full value or scroll horizontally"（MapSwitcher/StyleSourcePickerDialog 有原生 title 合规；attr-table overflow tooltip 合规）。
- [ ] **54. data-display 的 fontFeature 未落地运行时**：`registry/theme/registry.json:56-59` — token 契约声明 `fontFeature: '"tnum" 1, "zero" 1'`（DESIGN.md:116），但 `--text-data-display` utility 仅由 size/line-height/weight/letter-spacing 组装，无 font-feature-settings；两个消费者（ResourceDetailDrawer.tsx:284、ResourceGrid.tsx:173）也未配 `.mono`。

### P2 — 文案 / 验收面 / token 保真

- [ ] **55. sheet.tsx 三连**：`registry/ui/sheet.tsx:72` 硬编码中文 `aria-label="关闭"`（全库唯一非英文、不可注入的 aria 文案；dialog.tsx:98 用 "Close"）；:21,30 自造 `z-[1060]`（dialog/alert-dialog/popover 等统一 z-50，违反 "Do not increment z-index ad hoc"）；:71 物理定位 `top-3 right-3`（库内惯例为逻辑属性，dialog 关闭钮用 `inset-e-2.5`），RTL 不镜像。
- [ ] **56. sonner toast 动作 hover 色阶错误**：`registry/ui/sonner.tsx:64` — actionButton `hover:!bg-primary/90`。契约 button-primary-hover = primary 80%。
- [ ] **57. alert 默认变体使用保留绿（需裁决）**：`registry/ui/alert.tsx:11` — default `border-primary/20 bg-primary/5 text-primary`，被动横幅占用动作绿。DESIGN 未规定 alert 变体（info token 可用于信息信号）——裁决保留现状或改 info。
- [ ] **58. ButtonGroupText 用 muted-foreground 承载内容文字**：`registry/ui/button-group.tsx:40` — `bg-muted text-body-md text-muted-foreground`。契约："Do not use `{colors.muted-foreground}` for essential small text"。
- [ ] **59. 计数/表头/展示排版小项**：✅ Toolbox 工具计数已使用 `tnum`；仍待处理的计数器 —— `registry/blocks/linked-ref-list/LinkedRefList.tsx:66,103`、`registry/blocks/resource-sidebar/ResourceSidebar.tsx:184,255`、`registry/blocks/notification-center/NotificationCenter.tsx:96`（tnum 条款含 counts；#19 裁决豁免 20px 尺寸但未豁免 tnum）；`registry/blocks/style-function-editor/StyleFunctionEditor.tsx:24-31` 表头 `text-body-sm uppercase font-semibold`（契约 13px/500 = body-md-medium）；`registry/blocks/stat-strip/StatStrip.tsx:44` `text-body-base font-medium`（16px/500 无 hierarchy 条目）、`registry/blocks/product-logo/ProductLogo.tsx:51` 裸 `text-sm font-semibold tracking-[-0.02em]`（对比 headline-sm 14px/500/-0.01em；brand wordmark 上下文，可裁决豁免）。
- [ ] **60. 不可注入英文文案 ×4**：`registry/blocks/raster-style-panel/StretchControl.tsx:193,198`（`aria-label="Stretch percentile low/high"`，labels 无注入路径）、`registry/blocks/form-inputs/InputSelect.tsx:60`（`placeholder="Select option..."` 无 prop）、`registry/blocks/placeholder-glyph/PlaceholderGlyph.tsx:47`（SVG `<title>Placeholder resource glyph</title>`）、`registry/blocks/style-panel/StylePanel.tsx:192-193`（枚举 id "circle|square|triangle" 直作 aria-label/title）。契约："Do not … embed non-injectable product copy … inside domain blocks"（#26 同款）。
- [ ] **61. docs 侧栏缺漏与错序（#28 未修干净）**：`packages/docs/content/docs/blocks/meta.en.json:27` — en blocks 侧栏缺 `map-search`（zh meta.json:27 有；`map-search.en.mdx` 页面存在但 en 侧栏仅 48 条）；`packages/docs/content/docs/components/meta.json:20-21,34-35` 与 `meta.en.json` 同位置 —— `color-input`/`collapsible`、`input-number`/`input-group` 两处字母序倒置（57 条齐全，仅顺序）。
- [ ] **62. StyleEditorPanel 死类**：`registry/blocks/style-editor-panel/StyleEditorPanel.tsx:31,35` — `bg-panel-surface`、`text-panel-text` 在 theme/生成 CSS/全库均不存在（grep 验证），编译为空，头部表面/文字色实际未设定。契约："do not create a competing token"。
- [ ] **63. body token 的 letterSpacing 0px 未生成 reset**：`registry/theme/registry.json:22-55,140-171` — 8 个 body token（body-base/lg/lg-medium/md/md-medium/md-strong/sm/sm-medium）契约均声明 `letterSpacing: 0px`，但无 `--text-body-*--letter-spacing` 映射；`text-body-md` 元素嵌在 0.04em tracking 祖先下会继承而非归零（边界情形，当前无此嵌套表面）。
