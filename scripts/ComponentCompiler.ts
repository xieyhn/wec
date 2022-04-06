import path from 'path'
import colors from 'colors'
import fs from 'fs-extra'
import sass from 'sass'
import chokidar from 'chokidar'
import { wait } from './helper';
import glob from 'glob'
import ts from 'typescript'
import componentsTSConfig from './components.tsconfig'
import rimraf from 'rimraf'

interface ComponentCompilerOptions {
  // 组件目录
  srcDir: string,
  // 组件生成目标目录
  distDir: string
}

enum CompileAction {
  Compile = 'Compile',
  Delete = 'Delete'
}

const tsReg = /\.ts$/i;
const scssReg = /\.s[c|a]ss$/i;
const mdReg = /\.md$/i

const pathOpt = (p: string) => p.replace(/\\/g, '/');

function compilingLog(src: string, dist: string, action: CompileAction = CompileAction.Compile) {
  console.log(
    colors.green(`${action}...`), 
    action === CompileAction.Compile ? `${pathOpt(src!)} => ${pathOpt(dist)}` : pathOpt(dist)
  )
}

function compileCatchErrorLog(err: Error, action: CompileAction = CompileAction.Compile) {
  console.log(`${colors.red(`${action} catch error`)}`);
  console.error(err);
}

class ComponentCompiler {
  private srcDir: string
  private distDir: string

  constructor(options: ComponentCompilerOptions) {
    this.srcDir = options.srcDir
    this.distDir = options.distDir
  }

  compile(options: { watch?: boolean } = {}) {
    rimraf.sync(this.distDir, {})
    if (options.watch) {
      const watcher = chokidar.watch('**/*', { cwd: this.srcDir });
      watcher.on('add', p => {
        wait(100).then(() => this._compile(p))
      });
      watcher.on('change', p => {
        wait(100).then(() => this._compile(p))
      });
      watcher.on('unlink', (p) => {
        const dist = path.resolve(this.distDir, this.getTargetFilename(p))
        compilingLog('', dist, CompileAction.Delete)
        try {
          fs.unlinkSync(dist);
        } catch (err) {
         compileCatchErrorLog(err as Error, CompileAction.Delete)
        }
      });
    } else {
      glob.sync('**/*', { cwd: this.srcDir, nodir: true }).forEach((p) => this._compile(p));
    }
  }

  private _compile(filename: string) {
    if (/package.*\.json$/.test(filename)) return
    if (mdReg.test(filename)) return
    
    const src = path.resolve(this.srcDir, filename)
    const dist = path.resolve(this.distDir, this.getTargetFilename(filename))

    if (tsReg.test(src)) {
      this.tsCompiler(src, dist, componentsTSConfig)
    } else if (scssReg.test(src)) {
      this.scssCompiler(src, dist)
    } else {
      this.defaultCompiler(src, dist)
    }
  }

  private getTargetFilename(filename: string) {
    return filename.replace(tsReg, '.js').replace(scssReg, '.wxss');
  }

  private tsCompiler(src: string, dist: string, options: ts.CompilerOptions) {
    compilingLog(src, dist)
    try {
      ts.createProgram([src], options).emit()
    } catch (err) {
      compileCatchErrorLog(err as Error)
    }
  }

  private scssCompiler(src: string, dist: string) {
    compilingLog(src, dist)
    try {
      fs.outputFileSync(dist, sass.compile(src).css);
    } catch (err) {
      compileCatchErrorLog(err as Error)
    }
  }

  private defaultCompiler(src: string, dist: string) {
    compilingLog(src, dist)
    try {
      fs.copySync(src, dist, { overwrite: true });
    } catch (err) {
      compileCatchErrorLog(err as Error)
    }
  }
}

export default ComponentCompiler
