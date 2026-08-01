# Task 8 Report

## Scope

- Added bilingual onboarding guides for installation, theming, and same-domain registry delivery.
- Added bilingual component and block index pages backed by manifest-derived `ComponentIndex` metadata and client-side filtering.
- Updated docs navigation, guide/index validation coverage, and live onboarding browser QA.

## Ignored / Unstaged Paths

- `packages/docs/.docusaurus/`
- `packages/docs/build/`
- existing registry migration edits under `registry/`
- existing Showcase migration files under `showcase/`
- existing legacy `src/` deletions
- existing fixture/root/config dirty files such as `README.md`, `biome.json`, `bun.lock`, `package.json`, `tsconfig.json`, and `fixtures/`
- existing Task 7 artifacts such as `task-7-report.md`, `scripts/showcase-visual-qa.ts`, and `scripts/__tests__/showcase.test.ts`

## Verification

- `bun run docs:check-i18n`
- `bun run docs:check-examples`
- `bun test`
- `bunx tsc -p packages/docs/tsconfig.json --noEmit`
- `bun run docs:build`
- `bunx biome check` on Task 8 docs/index/QA files
- `bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case onboarding --browser-channel chrome`
- `bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case pilots --browser-channel chrome`

## Commit

- `6824b1d Let external users discover, install, and navigate Mapseek UI`
- This report is intentionally uncommitted.

## Review Fix

- Removed MDX-local `documentedNames` whitelists from component and block indexes.
- `ComponentIndex` now derives routable registry names from Docusaurus docs global metadata for the active locale, then joins those names with manifest metadata from `registry-data`.
- Onboarding QA now opens the visible locale dropdown from `/getting-started/installation`, selects English, and verifies `/en/getting-started/installation`.

## Review Fix Verification

- `bun run docs:check-i18n`
- `bun run docs:check-examples`
- `bun test scripts/__tests__/docs-i18n.test.ts scripts/__tests__/docs-build.test.ts scripts/__tests__/docs-examples.test.ts`
- `bunx tsc -p packages/docs/tsconfig.json --noEmit`
- `bunx biome check` on Task 8 docs/index/QA files
- `bun run docs:build`
- `bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case onboarding --browser-channel chrome`
- `bun test`
