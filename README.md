# Mapseek UI

面向地图、空间数据和运维界面的 shadcn 源码组件与区块 registry。

## 环境要求

- Node.js `>=20.19`
- pnpm `10.14.0`

## 开发

```bash
pnpm install
pnpm docs:dev
```

`pnpm docs:dev` 会同时启动文档站点和 Showcase：

- 文档站点：<http://localhost:3000/>
- Showcase：<http://localhost:5173/>

常用检查命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm registry:validate
```

构建文档站点和 registry：

```bash
pnpm docs:build
```

## 使用 registry

文档站点发布后，在应用的 `components.json` 中配置 registry：

```json
{
  "registries": {
    "@mapseek": "https://mapseekai.github.io/mapseek-ui/r/{name}.json"
  }
}
```

在线地址：

- 文档站点：<https://mapseekai.github.io/mapseek-ui/>
- Showcase：<https://mapseekai.github.io/mapseek-ui/showcase/>

然后安装组件、区块、主题或工具：

```bash
pnpm dlx shadcn@latest add @mapseek/button
pnpm dlx shadcn@latest add @mapseek/layer-panel
pnpm dlx shadcn@latest add @mapseek/theme
pnpm dlx shadcn@latest add @mapseek/utils
```

## 项目结构

- `registry/`：组件、区块、主题和工具源码。
- `packages/docs/`：文档站点源码。
- `showcase/`：独立 Showcase 源码。
- `scripts/`：registry 构建、校验和文档检查脚本。
