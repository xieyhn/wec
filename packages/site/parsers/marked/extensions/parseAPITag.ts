import path from 'path'
import { marked } from "marked"
import APIParser, { Doc } from '../../APIParser'
import { createTagReg, getCurrentParseFilepath, parseTagAttrs } from "../helper";

function createPropertiesSrc(properties: Doc) {
  let src = '| 属性名 | 说明 | 类型 | 默认值 |\n| ------ | ------ | ------ | ------ |\n'

  Object.values(properties).forEach(({
    name = '',
    documentation = '',
    stringOfType = '',
    stringOfDefaultValue = ''
  }) => {
    src += `| ${name } | ${documentation} | ${stringOfType} | ${stringOfDefaultValue} |\n`
  })

  return src + '\n'
}

function createEventsSrc(events: Doc) {
  let src = '| 事件名 | 说明 | 回调参数 |\n| ------ | ------ | ------ |\n'

  Object.values(events).forEach(({
    name = '',
    documentation = '',
    stringOfType = '',
  }) => {
    src += `| ${name} | ${documentation} | ${stringOfType} |\n`
  })

  return src + '\n'
}

const parseAPITagExtension: marked.TokenizerExtension & marked.RendererExtension = {
  name: 'api',
  level: 'block',
  tokenizer(src) {
    const match = createTagReg('API').exec(src);
    if (match) {
      const { src = '' } = parseTagAttrs(match)
      if (!src) return
      const dtsFilename = path.resolve(path.dirname(getCurrentParseFilepath()), src)
      const apiParser = new APIParser({
        filenames: [dtsFilename]
      })
      const { properties, events } = apiParser.parse()
      let newSrc = ''

      if (properties) {
        newSrc += `**Properties**\n\n`
        newSrc += createPropertiesSrc(properties)
      }

      if (events) {
        newSrc += `**Events**\n\n`
        newSrc += createEventsSrc(events)
      }

      return {
        type: 'api',
        raw: match[0],
        tokens: this.lexer.blockTokens(newSrc, [])
      }
    }
  },
  renderer(token) {
    return this.parser.parse(token.tokens!)
  }
}

export default parseAPITagExtension