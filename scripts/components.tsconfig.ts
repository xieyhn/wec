import ts from 'typescript'

const config: ts.CompilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2015,
  strict: true,
  alwaysStrict: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  lib: [
    "ESNext"
  ],
  types: [
    'miniprogram-api-typings'
  ]
}


export default config