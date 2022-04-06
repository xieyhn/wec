import minimist from 'minimist'
import ComponentCompiler from './ComponentCompiler'
import { compsDir, compsDistDir, siteDistDir } from './consts'
import SiteCompiler from '../packages/site/SiteCompiler'

enum Application {
  All = 'all',
  Components = 'components',
  Site = 'site'
}

let { watch, app } = minimist(process.argv)
watch = !!watch

if ([Application.All, Application.Components].includes(app)) {
  const compCompiler = new ComponentCompiler({
    srcDir: compsDir,
    distDir: compsDistDir
  })
  compCompiler.compile({ watch })
}

if ([Application.All, Application.Site].includes(app)) {
  const siteCompiler = new SiteCompiler({
    compsDir,
    distDir: siteDistDir
  })

  siteCompiler.compile({ watch })
}
