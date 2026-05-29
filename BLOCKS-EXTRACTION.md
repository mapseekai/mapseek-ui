# 编辑器组件 → 共享 blocks 提取方案

> 把矢量编辑器 (`apps/web/src/features/editor`) 里 **domain-free + 可复用** 的业务组件，
> 按既有 `blocks/` 约定提取到 `@workspace/ui`。约定见 `attr-inspector` / `layer-panel`：
> **presentational block 放 `blocks/`（labels 经 props 注入、强类型 props/callbacks、无 i18n、不依赖 engine/store），
> 编辑器留薄 wrapper 注入中文与 engine 接线。** 每个 block 配一条 showcase（`category: "block"`）。

提取原则：**wrapper 的对外 props 保持不变**，调用方（EditorPage / ProjectsPage / FloatingToolbar）零改动。
影响面（gitnexus upstream，均 LOW）：EditorTopBar→EditorInner；StorageInfoCard→ProjectsPage；OpRunnerPanel→无直接 caller。

---

## #2 `AppTopBar`  ← `EditorTopBar`

应用顶栏：返回 + 品牌槽 + 工程名 + dirty 状态点 + 保存 + 动作槽。

**要拆掉的耦合**：`useEditorEngine`（仅用于「新建快照」导出）、`SnapshotList`、`badgeCls`、`relativeTime`、写死的 `mapseek` 品牌、中文串。

**Block props**（`blocks/app-top-bar`）
```ts
interface AppTopBarLabels { back: string; save: string; saved: string; unsaved: string }
interface AppTopBarProps {
  brand?: ReactNode               // 品牌槽（logo+名），默认空
  projectName: string
  dirty: boolean
  lastSavedLabel?: string | null  // 调用方算好相对时间再传（relativeTime 含中文）
  onBack: () => void
  onSave: () => void | Promise<void>
  beforeSaveActions?: ReactNode    // 保存按钮前（如「打开」）
  afterSaveActions?: ReactNode     // 保存按钮后（如「另存为」）
  endActions?: ReactNode           // 最右侧（编辑器把「快照」popover + 新建快照塞这里）
  labels: AppTopBarLabels
  className?: string
}
```
状态 pill 在 block 内用 token class 内联（不依赖 `ed-styles`）。

**Wrapper `EditorTopBar`** 保留现有对外 props（含 `snapOpen/setSnapOpen`），内部：`relativeTime`→`lastSavedLabel`、品牌 JSX→`brand`、快照 popover + 新建快照 + `useEditorEngine`→`endActions`。

---

## #3 `StorageMeter`  ← `StorageInfoCard`

存储用量 chip + popover 明细（usage/quota/进度条/分桶/footer 文案）。

**要拆掉的耦合**：`useStorageEstimate`、写死的 OPFS 隔离文案、中文串。

**Block props**（`blocks/storage-meter`）
```ts
// 复用 hook 已有的 StorageEstimateView 形状（usage/quota/available/ratio/details/unsupported）
interface StorageMeterLabels {
  unsupported: string; title: string; refresh: string
  used: string; available: string; quota: string; usageRate: string
}
interface StorageMeterProps {
  data: StorageEstimateView
  loading?: boolean
  error?: string | null
  errorLabel?: (msg: string) => string   // 「读取失败：…」
  onRefresh?: () => void
  labels: StorageMeterLabels
  footer?: ReactNode                       // OPFS 隔离特性等 app 专属文案
  className?: string
}
export function formatBytes(n: number): string  // 纯函数，无 i18n，迁入 block
```
`StorageEstimateView` 类型迁入 block（hook 复用 block 的导出，避免重复定义）。

**Wrapper `StorageInfoCard`** 保留 `useStorageEstimate`，传 `data` + OPFS footer JSX + 中文 labels。

---

## #1 `SchemaForm`  ← `OpRunnerPanel`

schema 驱动的表单**渲染器**（不含 Dialog / confirm / toast / engine）。
把领域字段类型坍缩成展示类型：`layerRef/fieldRef → select`、`layerRefMulti → multiselect`、`crs → text(+placeholder)`。

**Block props**（`blocks/schema-form`）
```ts
type SchemaFormField =
  | { key: string; label: string; required?: boolean; type: "number"; min?: number; max?: number; default?: number }
  | { key: string; label: string; required?: boolean; type: "text"; placeholder?: string; default?: string }
  | { key: string; label: string; required?: boolean; type: "select"; options: { value: string; label: string }[]; placeholder?: string; default?: string }
  | { key: string; label: string; required?: boolean; type: "multiselect"; options: { value: string; label: string }[]; min?: number; emptyHint?: string }

interface SchemaFormProps {
  fields: SchemaFormField[]
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  idPrefix?: string
  className?: string
}
export function isSchemaFormValid(fields: SchemaFormField[], values: Record<string, unknown>): boolean
```

**Wrapper `OpRunnerPanel`** 保留 Dialog/confirm/toast/`engine.runOp`，把 `OP_SCHEMAS[op]` + `engine.getLayers()/getLayerFields()` 解析成 `SchemaFormField[]`（注入 options），body 用 `<SchemaForm>`，按钮 `disabled` 用 `isSchemaFormValid`。

---

---

# Part B — style-editor app (`frontend/apps/style-editor`)

> 这是真正的「样式编辑器」：MapLibre/Maputnik fork，~87 组件。与 web 矢量编辑器最大不同：
> **重度 `react-i18next`（~43 组件用 `useTranslation`）**，且大量组件深绑 maplibre style-spec。
> 已有 ~28 文件 import `@workspace/ui`（迁移在进行中）。
>
> **i18n 桥接原则**：block 内不能有 i18next。提取手法 = block 收 `labels` prop，
> style-editor 留 wrapper 用 `useTranslation()` 把 `t(...)` 喂进 `labels`（与 web 的 labels-prop 约定一致）。
> 另：候选普遍用 app 本地 `@/lib/utils`，提取时换成 `@workspace/ui/lib/utils`。

## 组件家族（survey 结论）

| 家族 | 数量 | i18n | maplibre 耦合 |
|---|---|---|---|
| `Input*`（String/Number/Checkbox/Select/Color/Enum/MultiInput/Autocomplete/Font/Array/Json/Spec/Url/DynamicArray/Button） | 15 | 多数 clean | 无（少数 Url/Json/Spec 有 1 句 i18n）|
| `Field*`（label + Input + Block + doc popover） | 19 | 部分 | Source/SourceLayer/Type/Spec/Function 深绑 spec |
| 布局原子（Block / Fieldset / Collapser / ScrollContainer / PropertyGroup） | 5 | Block 经 FieldDocLabel 间接带 i18n | PropertyGroup 绑 spec |
| `Layer*`（LayerList / LayerListItem / LayerListGroup / LayerEditor*） | 7 | 重 | LayerEditor 深绑 spec |
| `Filter*`（FilterEditor / SingleFilterEditor / FilterEditorBlock） | 3 | 重 | 绑 maplibre filter 语法 |
| `Map*`（MapMaplibreGl / MapOpenLayers / popups） | 4 | 重 | 引擎绑定 |
| modals / panels / app chrome（App/AppLayout/AppToolbar/AppIconRail/Sources/Settings…） | ~15 | 重 | app 接线 |

## 候选分级

**A — 强候选（低耦合，低-中工作量）**
- `Input*` 纯输入件：**InputString / InputNumber / InputCheckbox / InputSelect / InputEnum / InputMultiInput / InputAutocomplete / InputFont** —— 已验证不含 i18n / maplibre，已包 `@workspace/ui` 原子。提取手法：搬进 `blocks/form-inputs`（named export），旧路径留 1 行 re-export shim（保留 default + `*Props` 类型），其余 style-editor 文件零改动。注意 `@/lib/utils`→ui cn。
  - ✅ **已完成：InputString、InputNumber**（`blocks/form-inputs`，shim 就位，style-editor 77/77 测试 net-zero，showcase 已加）。
  - ⚠️ **InputColor 不是 A 类**：survey 误判。它耦合 app zustand store（`useActiveColorStore`）+ lodash。真正可提取的是底层 `kibo-ui/color-picker`（清洁），InputColor 需先去 store 化 → 归 B/中等工作量。
- 布局原子：**Collapser / ScrollContainer**（已验证 clean）；**Block / Fieldset** 需先把 `FieldDocLabel`（i18n）做成可选 slot 才能 clean。
- **LayerListItem**：拖拽/选中/显隐/删除/复制，回调通用；图层类型图标 `IconLayer` 留 app。

**B — 与现有 block 收口（去重，需设计评审）**
- **LayerList/LayerListGroup ↔ `blocks/layer-panel`**：重复最大。建议抽一个共享 `LayerListView` compound（可拖拽项 + 分组折叠），让 layer-panel 复用。
- **FilterEditor ↔ `blocks/filter-panel`**：抽共享的「JSON 表达式编辑」核，maplibre filter 语法解析留 app wrapper。
- **InputColor ↔ `blocks/raster-style-panel`**：确认共用同一个 color-picker。

**C — 留在 app（深绑 spec / 引擎，不提取）**
- `Field*` 中的 Source/SourceLayer/Type/Spec/Function、`_SpecProperty/_DataProperty/_ZoomProperty/_ExpressionProperty`、`PropertyGroup`、`LayerEditor*`、`Filter*`（语法部分）、`Map*`、`SourcesPanel`/各 modal、App chrome、CodeEditor。

## 建议批次
1. ✅ **Batch 1（完成）**：`blocks/form-inputs`（InputString/Number/Checkbox/Select/MultiInput/Enum/Autocomplete）+ `blocks/layout`（Collapser/ScrollContainer）。shim 就位，style-editor 77/77。
2. **Batch 2（进行中）**：
   - ✅ **InputFont** → `blocks/form-inputs`（pure shim）。
   - ✅ **Block / Fieldset** → `blocks/layout`：label 改为 `labelSlot` slot，app 留**真 wrapper**（非 shim）在 fieldSpec 存在时注入 `<FieldDocLabel>`（i18n+spec 留 app）。21+5 个 caller 零改动，block.test/fieldset.test 通过。
   - ⏭️ **InputUrl —— 跳过**：耦合 app `libs/urlopen`（validate/ErrorType）+ react-i18next + SmallError，泛化价值低，留 app。
   - ⛔ **InputColor / kibo-ui color-picker —— 暂不提取**（核实后推翻 survey）：
     - kibo-ui/color-picker（574 行）**当前只有 InputColor 一个 consumer**；survey 称「与 raster-style-panel 重叠」**不成立**（ui/web 里根本没有别的 color picker）。→ 提取等于「为只用一次的代码做抽象」，违反 CLAUDE.md 1.2。
     - 提取还需给**共享 ui 包新增 `color` 依赖**（+ bun install / lockfile 变更），扩大 design-system footprint。
     - `InputColor` 本身是 app glue：耦合 `useActiveColorStore`(zustand) + 一段 popover-keep-open 逻辑；且 `input-color.test.tsx` 按 `@workspace/ui/components/popover` 路径 mock，组件搬进 ui（改用相对 import）会让 mock 失配、测试失败。
     - **结论**：等出现第 2 个 color-picker consumer（如 web 端样式面板）再提取；届时连 `color` 依赖一起进 ui，`InputColor` 留 app 只换 picker 的 import。
3. **Batch 3（战略）—— 核实后建议不做**：
   - ⛔ **LayerList ↔ layer-panel 不收口**：两者**领域不同**，不是真重叠。ui `layer-panel`（575L 复合组件）建模 **GIS 数据图层**（`LayerData`：geometryType/CRS/featureCount/属性表），已 ship 且被 web 编辑器 `LeftPanel` 使用、含写死中文；style-editor `LayerList`（278+204+53）建模 **maplibre style 图层**（`LayerSpecification[]`、index 回调、style-type 图标、metadata 分组、dnd-kit、error 态、i18n、耦合 `maplibre-gl`/`libs/layer`）。共享面只有「带可见性+拖拽的纵向列表」这层皮。强行抽 `LayerListView` 泛型壳 + 两边重写 = 大改一个**已发布**的 block（web 依赖它），收益投机、风险高 → 违反「不重构没坏的东西」。
   - ⛔ **FilterEditor ↔ filter-panel 同理**：maplibre filter 语法 vs 域无关 filter，差异同上。
   - ⛔ **LayerListItem**：行内容深绑 maplibre（layerType→IconLayer、visibility 字符串、index 回调），ui 侧 layer-panel 已自带行渲染 —— 无独立复用价值。
   - **结论**：真正的复用价值在 Batch 1/2 已落地的 i18n-free 原子 + 可 slot 化的布局件；layer/filter 这类「看起来像」的组件分属不同域，保持两份各自聚焦优于强行共享。若将来 web 端要做 maplibre 风格的 style 图层列表，再单独立项设计 `LayerListView`。

> ⚠️ 以上为 survey 级结论，单个组件提取前仍需逐个核对 props / 测试 / 现有 ui 原子重叠（尤其 Input* 是否该直接增强 ui 现有 input/select 而非新增）。

---

## lint 债 —— ✅ 已清（React-skill review 后修复）

把 style-editor input 件搬进更严的 ui eslint 后曾有约 10 条报错，现已全部修复，`blocks/{form-inputs,layout,app-top-bar,storage-meter,schema-form}` **eslint 0 problems**（含 warning），ui + style-editor typecheck 全过、style-editor 77/77：
- `react-hooks` setState-in-effect（3×：InputString/InputNumber/InputAutocomplete）→ 改为 **adjust-during-render**（用 `prevProps`/`prevEditing` 守卫，等价于原 `useEffect([deps])`，无行为变化）。
- `@typescript-eslint/no-explicit-any`（7×）→ 收紧为具体类型（InputSelect label→`React.ReactNode`、InputFont `fonts:string[]`、InputEnum `onChange(value:string)`、InputMultiInput `options:(string|[string,string])[]`、InputAutocomplete `options:string[][]`）；style-editor typecheck 确认**无调用方回灌**。
- InputNumber useMemo `exhaustive-deps` warning → 把 `getRangeValue` 提到模块级（稳定、不再是 dep），并**补回缺失的 `max` 依赖**（顺带修了一个潜在 stale-memo bug）。
- InputEnum 未使用的解构 `_` → 移除。

（注：`select.tsx` 等 ~9 条 pre-existing ui-lint 报错与本次无关，未动。）

## 每个提取的统一步骤

1. `gitnexus_impact`（已做，均 LOW）
2. 新建 `blocks/<name>/{<Comp>.tsx,types.ts,index.ts}` + `package.json` exports 已是 `./blocks/*`（无需改）
3. 改写 wrapper 委托给 block，对外 props 不变
4. 新建 `apps/showcase/src/showcases/<Comp>Showcase.tsx` + 注册进 `index.ts`（`category:"block"`）
5. `pnpm --filter @workspace/ui typecheck` + web 既有测试 + showcase 跑通
6. commit 前 `gitnexus_detect_changes`
