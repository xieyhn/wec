import { marked } from 'marked'
import hljs from 'highlight.js'
import parseAPITagExtension from './extensions/parseAPITag'
import parseDEMOTagExtension from './extensions/parseDEMOTag'

marked.setOptions({
  headerIds: false,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
})

marked.use({ extensions: [parseAPITagExtension, parseDEMOTagExtension] })

export default marked