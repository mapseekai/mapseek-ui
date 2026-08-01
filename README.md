# Mapseek UI

Mapseek UI 是面向地图、空间数据和运维界面的 shadcn 源码组件与区块 registry。

## 文档命令

```bash
bun run docs:dev
bun run docs:dev:en
bun run docs:build
bun run docs:visual
bun run docs:verify
```

- `docs:dev` 启动中文文档站点。
- `docs:dev:en` 启动英文文档站点。
- `docs:build` 生成静态文档和同域 `/r/*.json` registry 输出。
- `docs:visual` 针对已构建站点运行中英文、亮暗色、桌面和移动端视觉检查。
- `docs:verify` 运行发布前完整检查：lint、typecheck、测试、registry 校验、文档校验、构建、视觉检查和真实安装验证。

## 安装

公开站点发布后，在应用的 `components.json` 中配置同域 registry 模板：

```json
{
  "registries": {
    "@mapseek": "https://<docs-domain>/r/{name}.json"
  }
}
```

安装组件或区块：

```bash
bunx shadcn@4.8.0 add @mapseek/button
bunx shadcn@4.8.0 add @mapseek/layer-panel
```

安装主题和工具：

```bash
bunx shadcn@4.8.0 add @mapseek/theme
bunx shadcn@4.8.0 add @mapseek/utils
```

## 维护者

- [`docs/superpowers/specs/2026-08-01-mapseek-ui-documentation-platform-design.md`](docs/superpowers/specs/2026-08-01-mapseek-ui-documentation-platform-design.md) 记录文档平台设计约束。
- [`docs/provenance.md`](docs/provenance.md) 记录来源和同步策略。
