# Mapseek UI 文档平台发布验证

日期：2026-08-01

分支：`zwishing/docs-site`

最终实现提交：`b936f94`（包含本地化修复 `2e11b90`，基于 Showcase 移除提交 `605db31`）。本证据提交位于其后，仅更新验证记录与截图，不改变运行时代码。

## 结果

纯静态 Docusaurus 文档站已替代旧 Showcase。中文为默认语言，英文位于 `/en`；组件与区块页面均提供安装命令、可运行示例、源码查看与 registry 元数据。同一静态产物在 `/r/*.json` 提供 shadcn registry。

## 自动验证

在最终实现提交上执行 `bun run docs:verify`，结果：

- `bun run lint`：通过，检查 397 个文件。
- `bun run typecheck`：通过根项目与 docs TypeScript 检查。
- `bun run registry:validate`：通过。
- `bun run docs:check-i18n`：通过，中英文页面成对且导航完整。
- `bun run docs:check-examples`：通过，公开 registry 项均有嵌入示例。
- `bun run docs:build`：通过，生成 `packages/docs/build` 与 `packages/docs/build/en`。
- `bun test`：通过，72 个测试、823 个断言、0 失败。
- `bun run docs:visual`：通过 onboarding、pilots、primitive、block 四组浏览器检查；覆盖中英文、亮暗主题、桌面与移动端以及真实交互。
- `bun run verify:items button layout layer-panel`：通过三次真实 shadcn 安装、TypeScript 与 Vite 构建。
- `bun install --frozen-lockfile --lockfile-only`：在仅由 Git index 展开的干净目录中通过，Playwright 发布依赖可复现。

移除用户可见的 Showcase 迁移文案后，再次执行 `docs:check-i18n`、`docs:check-examples`、`docs:build` 与 pilots 浏览器矩阵，全部通过。

## 静态产物抽查

以下静态文件均存在并已在 Chrome 中打开：

- `/components/button`：中文 Button 文档与交互示例。
- `/en/components/dialog`：英文 Dialog 文档与 portal 示例。
- `/blocks/layer-panel`：390 × 760 移动视口下的中文 LayerPanel。
- `/r/button.json`：有效 JSON，registry item 名称为 `button`。

截图：

- [中文 Button](./assets/button-zh.png)
- [英文 Dialog](./assets/dialog-en.png)
- [移动端 LayerPanel](./assets/layer-panel-mobile-zh.png)

## 移除与范围审计

- `showcase/`、`scripts/showcase-visual-qa.ts` 和旧 `scripts/__tests__/showcase.test.ts` 已物理移除。
- `scripts/generate-showcase-theme.ts` 已改名为 `scripts/generate-docs-theme.ts`，且只写入 docs 主题文件。
- `showcase/`、`showcase:`、旧主题生成器和旧视觉脚本在实现、命令与公开文档中均无引用；`docs/superpowers/` 保留历史迁移记录。
- 提交使用精确暂存，没有纳入工作区中与本任务无关的 registry、fixture 与 source 迁移改动。

## 已知但不阻塞的问题

- CSS minimizer 对上游动画值给出既有 warning，但双语构建成功且浏览器矩阵通过。
- `designmd lint DESIGN.md` 无 error；保留一个既有 Button 主色对比度 warning（3.22:1）。
- 生产 CDN 缓存、最终域名与托管平台行为需在部署后验证；当前产物不依赖服务端运行时。
