import { resolve } from "node:path"
import ts from "typescript"
import { expect, it } from "vitest"
import { showcaseSources } from "../../packages/docs/src/components/ShowcaseDemo/source-catalog.generated"

it("compiles copied examples with installed component aliases and no Showcase helper files", () => {
  const root = resolve(import.meta.dirname, "../..")
  const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const consumerOptions: ts.CompilerOptions = {
    ...options,
    paths: {
      "@/components/ui/*": ["registry/ui/*"],
      "@/components/blocks/*": ["registry/blocks/*"],
      "@/lib/*": ["registry/lib/*"],
    },
  }
  const copies = new Map(
    Object.entries(showcaseSources).map(([name, source]) => [
      resolve(root, `fixtures/vite-react-template/src/copied-examples/${name}.tsx`),
      source,
    ]),
  )
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = copies.get(fileName)
    return source === undefined
      ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  }
  host.resolveModuleNames = (moduleNames, containingFile) =>
    moduleNames.map(
      (name) =>
        ts.resolveModuleName(
          name,
          containingFile,
          copies.has(containingFile) ? consumerOptions : options,
          ts.sys,
        ).resolvedModule,
    )

  const program = ts.createProgram([...copies.keys()], options, host)
  const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
    file: diagnostic.file?.fileName.replace(root, ""),
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
  }))
  expect(errors).toEqual([])
}, 60_000)
