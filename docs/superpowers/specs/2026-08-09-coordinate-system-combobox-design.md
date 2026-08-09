# CoordinateSystemCombobox 设计

## 目标

新增独立的 `CoordinateSystemCombobox` 业务组件，为地图产品提供基于项目标准 `Combobox` 的单选坐标系选择能力。组件显示 EPSG 编码和坐标系名称，并按球面坐标系与平面坐标系分组；不替换或修改现有 `CrsPicker`、`MapCoordinateStatus` 及其公开 API。

## 范围

### 组件边界

组件放在 `registry/blocks/coordinate-system-combobox`，内部只组合 `@/components/ui/combobox` 提供的标准部件。它负责默认数据、条目合并、分组、搜索、选中值展示与本地化文案；地图投影转换、坐标范围校验和地图重载继续由调用方负责。

组件为单选，支持受控和非受控两种使用方式：

1. `value` 与 `onValueChange` 用于受控状态，回调返回选中的 EPSG 字符串或清空时的 `null`。
2. `defaultValue` 用于非受控初始值。
3. `extraItems` 允许追加工程私有坐标系，或以相同 EPSG 编码覆盖默认条目。
4. `className`、`disabled` 与 `labels` 分别用于布局、禁用和本地化；不暴露与该业务无关的通用筛选配置。

### 数据模型与默认数据

公开 `CoordinateSystemItem` 与 `CoordinateSystemKind`：

```ts
type CoordinateSystemKind = "geographic" | "projected"

interface CoordinateSystemItem {
  epsg: string
  name: string
  kind: CoordinateSystemKind
}
```

内部类型采用技术上准确的 `geographic` / `projected`，界面分组文案分别显示为“球面坐标系”和“平面坐标系”。默认数据沿用项目已有 CRS 命名，并按以下顺序提供：

1. 球面坐标系：`EPSG:4326` / WGS 84、`EPSG:4490` / CGCS2000、`EPSG:4214` / Beijing 1954、`EPSG:4610` / Xian 1980。
2. 平面坐标系：`EPSG:3857` / Web Mercator，其后是 CGCS2000 高斯—克吕格 6 度带 13–23 带（`EPSG:4491`–`EPSG:4501`）和 3 度带 25–45 带（`EPSG:4513`–`EPSG:4533`）。条目名称明确包含基准、带宽与带号，例如 `CGCS2000 Gauss-Kruger 3° zone 25`。

默认投影集只包含上述 CGCS2000 的带号定义：不包含按中央经线命名的 `CM` 变体，也不包含 Beijing 1954 或 Xian 1980 的 3/6 度带投影。后两类若有项目需求，调用方可通过 `extraItems` 按需追加。

合并函数先按默认顺序建立列表，再依次合并 `extraItems`。额外条目与默认项编码相同则覆盖该项；额外条目之间编码相同则最后一项生效。新增项附加在所属分组的末尾，保证显示顺序稳定。

### 交互与可访问性

输入框和每个下拉条目均显示 `EPSG:xxxx · 名称`。用户可通过 EPSG 编码或名称检索；搜索后仍按分组显示，空分组隐藏。无结果时展示可本地化的空状态。

复用标准 `Combobox` 的输入、弹层、列表、分组、标签、条目与空状态部件，因此键盘上下导航、回车选择、焦点管理、选中指示及 ARIA 语义全部由基础组件处理。业务组件只提供可读的输入标签、分组标签与空状态文案，不手写 `role=listbox` 或键盘事件。

调用方传入未收录的 `value` 时，组件不得抛错；列表保持可搜索，选中指示只在匹配条目存在时出现。

## 文件与公开导出

新增以下文件：

1. `CoordinateSystemCombobox.tsx`：组件与 Combobox 组合逻辑。
2. `built-in-coordinate-systems.ts`：默认条目与稳定的合并函数。
3. `types.ts`：条目、分类和 props 类型。
4. `defaults.ts`、`labels.ts`：中文默认文案和本地化类型。
5. `index.ts`、`fragment.json`：注册表导出与安装描述。
6. 对应测试、Showcase、中文/英文文档与目录注册。

## 验证

1. 数据测试覆盖默认条目、球面/平面分类、CGCS2000 6 度带 13–23、3 度带 25–45、追加、同 EPSG 覆盖和重复额外条目的最后生效规则；同时断言不默认包含 `CM` 变体或历史基准的高斯—克吕格投影。
2. 渲染测试验证两个分组、每个条目的 EPSG 与名称、空结果文案，以及组件使用标准 Combobox 部件而非手写列表角色。
3. 交互测试验证单选值变化、受控值回显、非受控初始值和禁用状态。
4. 更新 Showcase 与中英文文档，运行目标测试、类型检查、格式检查和相关展示验证。

## 不在本次范围内

1. 替换或重构现有 `CrsPicker` 与 `MapCoordinateStatus`。
2. 多选、坐标转换、投影有效性检查、远程 EPSG 数据加载。
3. 允许调用方传入完整基础数据集或自定义筛选算法。
