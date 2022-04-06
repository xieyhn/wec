export interface CompilerOptions {
  watch?: boolean,
  compsDir: string,
  distDir: string
}

let compilerOptions: CompilerOptions

export function setCompilerOptions(opt: CompilerOptions) {
  compilerOptions = opt
}

export function getCompilerOptions() {
  return compilerOptions
}