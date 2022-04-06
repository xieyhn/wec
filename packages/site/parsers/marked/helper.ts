export function createTagReg(tagName: string) {
  /**
   * 1. '<' 标签左开始
   * 2. '${tagName}' 标签名
   * 3. '\s*' 标签名后面允许有空格
   * 4. '\s+\w+(?:\-\w+)*(?:=(?:"[^"]*"|'[^']*'))?' 匹配属性的键值对
   * 4.1 '\s+' 属性前允许有空格，与第3点不冲突，+ 和 *
   * 4.2 '\w+(?:\-\w+)*' 匹配 src 或 src-a 或 src-aa-aa 等
   * 4.3 '(?:=(?:"[^"]*"|'[^']*'))?' 匹配属性的值，可没有值（不写 = ，最后一个?）
   * 5. '\s*' 后面允许有空格
   * 6. 自闭和或闭合标签
   */
  return new RegExp(String.raw`^<${tagName}\s*(\s+\w+(?:\-\w+)*(?:=(?:"[^"]*"|'[^']*'))?)*\s*(?:\/>|>.*<\/${tagName}>)`, 'i')
}

export function parseTagAttrs(match: RegExpExecArray) {
  const [, ...group] = match

  const ret: { [p: string]: string } = {}

  group.forEach(kvStr => {
    const [k, v] = kvStr.trim().split('=')
    ret[k] = v ? v.replace(/^(['"])(.*)\1$/, '$2'): ''
  })

  return ret
}

let currentParseFilepath: string

export function setCurrentParseFilepath(path: string) {
  currentParseFilepath = path
}

export function getCurrentParseFilepath(): string {
  return currentParseFilepath
}