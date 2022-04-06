import path from 'path'
import fs from 'fs-extra'
import fm from 'front-matter'
import { marked } from 'marked'
import { createTagReg, getCurrentParseFilepath, parseTagAttrs } from '../helper';

interface MDAttribute {
  order: string,
  title: string
}

const parseDEMOTagExtension: marked.TokenizerExtension & marked.RendererExtension = {
  name: 'demo',
  level: 'block',
  tokenizer(src) {
    const match = createTagReg('DEMO').exec(src);
    if (match) {
      const { dirs = '' } = parseTagAttrs(match)
      if (!src) return
      const dirsPath = path.resolve(path.dirname(getCurrentParseFilepath()), dirs)
      if (!fs.statSync(dirsPath).isDirectory()) return

      const fmRes = fs.readdirSync(dirsPath)
        .filter(p => /\.md$/.test(p))
        .map(p => (
          fm<MDAttribute>(
            fs.readFileSync(path.resolve(dirsPath, p), { encoding: 'utf-8' })
          )
        ))
        .sort((a, b) => +a.attributes.order - +b.attributes.order)

      const tokens: marked.Token[] = []
      fmRes.forEach(res => {
        this.lexer.blockTokens(`**${res.attributes.title}**\n\n${res.body}`, tokens)
      })
      return {
        type: 'demo',
        raw: match[0],
        tokens
      }
    }
  },
  renderer(token) {
    return this.parser.parse(token.tokens!)
  }
}

export default parseDEMOTagExtension