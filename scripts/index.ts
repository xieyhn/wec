import minimist from 'minimist'
import ComponentCompiler from './ComponentCompiler'
import { compsDir, compsDistDir, siteDistDir } from './consts'
import SiteCompiler from '../packages/site/SiteCompiler'

const args = minimist(process.argv)
const watch = !!args.watch

const compCompiler = new ComponentCompiler({
  srcDir: compsDir,
  distDir: compsDistDir
})
const siteCompiler = new SiteCompiler({
  compsDir,
  distDir: siteDistDir
})

// 组件编译
compCompiler.compile({ watch })
siteCompiler.compile({ watch })
