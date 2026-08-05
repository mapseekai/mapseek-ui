# Registry 与业务组件全面收敛计划

## Requirements Summary

- 将 registry 中仍保留的旧式公共 API 收敛到当前 Base UI / shadcn 组合方式。
- 删除 Showcase 中与 registry 并行维护的四套旧实现，保证文档与独立 Showcase 展示同一份组件。
- 将 docs/showcase 中手写的基础交互控件替换为 registry primitives，同时保留合理的 GIS 领域组合。
- 将 `LayerPanelGroupsDemo` 已验证的分组交互下沉为可复用的 registry 组合能力。
- 统一 shadcn CLI 版本来源，修复生成物导致的全项目 lint 失败。
- 不新增第三方依赖；优先删除重复代码和兼容层；行为变化先由回归测试锁定。

## Cleanup Baseline

1. 修改前记录 `pnpm test`、`pnpm run typecheck`、`pnpm run registry:validate`、`pnpm run registry:build`、`pnpm run showcase:build` 和 `pnpm run lint` 的基线结果。
2. 为 API 迁移、Showcase 选择策略、无原生控件和版本一致性补回归测试；测试先失败，再进入实现。
3. 每次只处理一种 smell：公共 API、重复实现、文档原语、Demo 原语、领域能力、工具链。
4. 每一批通过聚焦测试、Biome 和类型检查后再进入下一批；禁止用新增包装层长期保留两套 API。

## Acceptance Criteria

1. `registry/ui/select.tsx` 导出标准拆分组件：`Select`、`SelectTrigger`、`SelectValue`、`SelectContent`、`SelectGroup`、`SelectLabel`、`SelectItem`；源码、Showcase 和文档中不存在 `Select.Item`。
2. `registry/ui/tooltip.tsx` 使用标准 `Tooltip`、`TooltipTrigger`、`TooltipContent` 组合；源码中不存在自定义 `content`、`asChild` 兼容属性，触发器使用 Base UI `render`。
3. [types.ts](/Users/zhang/code/mapseek-ui/showcase/src/showcases/types.ts:31) 不再优先选择旧 `*Showcase`；四个重复 `*Showcase` 实现及其私有子组件被删除，独立 Showcase 与 docs 均加载 registry-backed Demo。
4. `showcase/src` 与 `packages/docs/src/components` 中不再直接实现 `<button>`、交互式 `<input>` 或不完整的手写 tab/menu；例外必须在测试白名单中写明语义理由。
5. [LayerPanelShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LayerPanelShowcase.tsx:356) 的分组折叠、重命名和菜单 UI 由 registry `LayerPanelGroup` 组合组件提供；Demo 只持有示例状态。
6. 未引用的 `LoomDialogExamples` 被删除，或明确注册到 catalog；本计划默认删除以减少孤立代码。
7. 所有 shadcn 命令从一个版本常量生成，并与 `package.json` 中安装的 shadcn 版本一致；仓库不再出现 `shadcn@4.8.0`。
8. `pnpm run lint` 不再扫描 `packages/docs/public/r` 生成物，所有受版本控制的非生成源文件通过 Biome。
9. `pnpm test`、`pnpm run typecheck`、`pnpm run registry:validate`、`tsx scripts/validate-registry.ts --complete`、`pnpm run registry:build`、`pnpm run showcase:build`、`pnpm run lint` 全部退出码为 0。

## Implementation Steps

### 1. 建立迁移护栏

- 扩展 [registry-component-composition.test.ts](/Users/zhang/code/mapseek-ui/scripts/__tests__/registry-component-composition.test.ts)，断言 Select/Tooltip 标准导出和旧 API 消失。
- 新增 Showcase catalog 测试，覆盖 [pickAppShowcase](/Users/zhang/code/mapseek-ui/showcase/src/showcases/types.ts:31) 的确定性选择顺序，并断言每个 registry item 只有一个活动 Demo。
- 新增业务原语扫描测试：扫描 `showcase/src` 与 `packages/docs/src/components` 的原生 button/input 及手写 tablist；为真实文档基础设施保留窄白名单。
- 扩展 [pnpm-command.test.ts](/Users/zhang/code/mapseek-ui/scripts/__tests__/pnpm-command.test.ts:13)，断言所有 CLI 调用引用统一版本常量。

### 2. 迁移 Select 公共 API

- 以当前 shadcn/Base UI 生成结果为基线重写 [select.tsx](/Users/zhang/code/mapseek-ui/registry/ui/select.tsx)，删除 `itemsCache`、children 扫描和 `Select.Item` namespace。
- 迁移 registry 消费者：
  - [FilterPanel.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/filter-panel/FilterPanel.tsx:168)
  - [attr-field.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/attr-inspector/attr-field.tsx:214)
  - [InputSelect.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/form-inputs/InputSelect.tsx:57)
  - [RasterStylePanel.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/raster-style-panel/RasterStylePanel.tsx:171)
  - [SchemaForm.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/schema-form/SchemaForm.tsx:122)
  - [ColorPicker.tsx](/Users/zhang/code/mapseek-ui/registry/ui/color-input/ColorPicker.tsx:442)
- 迁移 Showcase 消费者：`SelectShowcase`、`StyleFunctionEditorShowcase`、`StyleFilterEditorShowcase`，同步双语 Select 文档和生成的源码 catalog。
- 保持当前 `value/defaultValue/onValueChange` 行为，并新增受控、非受控、disabled、placeholder、分组项目的渲染测试。

### 3. 移除 Tooltip 兼容层

- 将 [tooltip.tsx](/Users/zhang/code/mapseek-ui/registry/ui/tooltip.tsx:8) 收敛为标准拆分 primitive，保留 `TooltipProvider` 的项目默认 delay。
- 将现有 `<Tooltip content={...}>` 消费者改成 `TooltipTrigger + TooltipContent`；可聚焦宿主通过 `render` 传给 Trigger。
- 更新 [TooltipShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/TooltipShowcase.tsx:47) 与双语 tooltip 文档，删除 `asChild` 说明。
- 添加键盘聚焦、disabled trigger、provider delay 和 portal content 的测试。

### 4. 删除四套双轨 Showcase 与孤立示例

- 调整 [types.ts](/Users/zhang/code/mapseek-ui/showcase/src/showcases/types.ts:31)，明确只选择 `*OverviewDemo` / `*Demo`，不再将 `*Showcase` 作为隐式入口。
- 删除以下文件中旧的 `*Showcase` 实现，仅保留 registry-backed Demo：
  - [LoomLayerPanelShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LoomLayerPanelShowcase.tsx:71)
  - [LoomToolbarShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LoomToolbarShowcase.tsx:59)
  - [LoomToolboxShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LoomToolboxShowcase.tsx:61)
  - [CustomColormapShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/CustomColormapShowcase.tsx:32)
- 删除随旧实现存在的 `FavoriteButton`、`ToolCard`、`ToolRow`、`ToolDetail` 和本地 Separator。
- 删除未注册的 [LoomDialogExamples.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LoomDialogExamples.tsx:15)，并重新生成 docs source catalog。

### 5. 收敛 docs 与 Showcase 基础控件

- [LocaleSwitcher.tsx](/Users/zhang/code/mapseek-ui/packages/docs/src/components/LocaleSwitcher/LocaleSwitcher.tsx:13)：使用 registry `DropdownMenu`，验证 Escape、外部点击、焦点返回和键盘导航。
- [RegistryInstall.tsx](/Users/zhang/code/mapseek-ui/packages/docs/src/components/RegistryItem/RegistryInstall.tsx:49)：使用 `ToggleGroup` 表达包管理器单选，移除不完整 tablist 语义。
- [ComponentIndex.tsx](/Users/zhang/code/mapseek-ui/packages/docs/src/components/ComponentIndex/ComponentIndex.tsx:31)：使用 registry `Input`，保留搜索 label 与过滤逻辑。
- [App.tsx](/Users/zhang/code/mapseek-ui/showcase/src/App.tsx:22)：分类和导航项复用 `Button`/`buttonVariants`。
- [AttrTableShowcase.tsx](/Users/zhang/code/mapseek-ui/showcase/src/showcases/AttrTableShowcase.tsx:99)：视图切换使用 Tabs/ToggleGroup，打开操作使用 Button。
- 扫描并迁移其余 Demo 控制按钮，包括 AttrInspector、CrsPicker、MapSwitcher、FormInputs、NumberRangeInput、AddFieldForm、SchemaForm、FilterPanel、PixelProbe 和 Layout Showcase。
- 将 `AppTopBarShowcase` 的 `StatusPill` 替换为 `Badge`；保留 `MapFrame`、展示用 `FieldRow/Row` 和 docs runtime 基础设施。

### 6. 将 LayerPanel 分组 UI 上收 registry

- 在 [LayerPanel.tsx](/Users/zhang/code/mapseek-ui/registry/blocks/layer-panel/LayerPanel.tsx:461) 附近新增组合式 `LayerPanelGroup`、`LayerPanelGroupHeader`、`LayerPanelGroupActions` 和 `LayerPanelGroupContent`；状态通过 controlled/default props 管理。
- 在 [types.ts](/Users/zhang/code/mapseek-ui/registry/blocks/layer-panel/types.ts:20) 增加分组 props 类型，不把 Demo 数据结构写死进 root `LayerPanelProps`。
- 复用现有 `Collapsible`、`DropdownMenu`、`Input`、`IconButton`，更新 block registryDependencies 与 index exports。
- 重写 [LayerPanelGroupsDemo](/Users/zhang/code/mapseek-ui/showcase/src/showcases/LayerPanelShowcase.tsx:356)，仅保留 groups/layers/rename 状态与事件，不再包含自写菜单或基础控件。
- 增加折叠受控/非受控、重命名提交/取消、菜单键盘导航和组内图层操作测试。

### 7. 统一 shadcn CLI 版本

- 新增一个可被 Node 脚本和 docs 客户端共同引用的纯 TS 配置模块，导出 `SHADCN_CLI_PACKAGE`；版本与 [package.json](/Users/zhang/code/mapseek-ui/package.json) 中的 shadcn 依赖保持一致。
- 替换 [build-registry.ts](/Users/zhang/code/mapseek-ui/scripts/build-registry.ts:30)、[verify-items.ts](/Users/zhang/code/mapseek-ui/scripts/verify-items.ts:84)、[verify-aggregate.ts](/Users/zhang/code/mapseek-ui/scripts/verify-aggregate.ts:38)、theme install/smoke tests和 [RegistryInstall.tsx](/Users/zhang/code/mapseek-ui/packages/docs/src/components/RegistryItem/RegistryInstall.tsx:37) 的硬编码版本。
- 更新 installation/theming 双语文档及 [docs-visual-qa.ts](/Users/zhang/code/mapseek-ui/scripts/docs-visual-qa.ts:1520) 断言。
- 增加仓库扫描断言：除 lockfile 历史记录外，不允许出现其他 `shadcn@<version>` 字面量。

### 8. 修复全项目 lint 边界并做最终清理

- 在 [biome.json](/Users/zhang/code/mapseek-ui/biome.json:3) 明确排除 `packages/docs/public/r` 生成 registry artifacts；保留源 manifest 和构建脚本检查。
- 格式化 [showcase/vite.config.ts](/Users/zhang/code/mapseek-ui/showcase/vite.config.ts) 及本计划涉及的全部源文件。
- 运行无用导出/引用搜索，删除迁移后残留 CSS module 规则、旧 imports、旧 labels 和过期 source catalog 内容。
- 最后运行完整验证矩阵，并在任一步失败时回到对应批次修复，不带失败收尾。

## Risks and Mitigations

- **Select/Tooltip 是公开 API 破坏性迁移。** 同一批次迁移全仓消费者，并用仓库扫描确保旧调用为零；registry build 后在临时 Vite fixture 中实际安装验证。
- **删除 Showcase 可能丢失旧 Demo 场景。** 删除前对比旧/新实现的交互清单；有价值场景先迁入 registry-backed Demo，再删除旧代码。
- **LayerPanel 分组 API 可能过度绑定单个 Demo。** 采用 composition API，只下沉视觉和交互原语；组数据和业务状态继续由消费者管理。
- **docs 引用 registry primitives 可能扩大客户端 bundle。** 使用按组件直接导入，并通过现有静态 docs/showcase build 验证无 server/client boundary 错误。
- **统一 CLI 版本可能改变生成输出。** 先锁定当前安装版本，生成后比较 catalog 和 fixture 安装结果；任何生成差异纳入同批 review。
- **排除生成目录可能隐藏真实错误。** 生成物正确性继续由 registry build、generated-output 和安装测试保证；Biome 只排除机器生成格式。

## Verification Steps

1. 聚焦回归：Select、Tooltip、Showcase picker、LayerPanelGroup、业务原语扫描、CLI 版本一致性测试。
2. `pnpm exec biome check registry showcase/src packages/docs/src scripts`
3. `pnpm run lint`
4. `pnpm run typecheck`
5. `pnpm test`
6. `pnpm run registry:validate`
7. `pnpm exec tsx scripts/validate-registry.ts --complete`
8. `pnpm run registry:build`
9. `pnpm run showcase:build`
10. `pnpm run docs:check-examples`
11. `pnpm run verify:aggregate`，覆盖每个 registry item 的真实 shadcn 安装与构建。
12. `git diff --check`，并人工确认没有误改用户原有、与本计划无关的工作树内容。

## Completion Report Requirements

- 列出删除的重复组件、迁移的公共 API、替换的业务原语和新增的 LayerPanel 能力。
- 报告所有验证命令及退出状态。
- 若仍有例外的原生控件或兼容 API，逐项给出文件、理由和后续期限；目标状态为无例外。

