import ts from 'typescript'
import APIType from '../helper/APIType'
import JSDOCTag from '../helper/JSDOCTag'

export interface DocItem {
  // 属性名
  name: string,
  // 属性的文档注释
  documentation: string,
  // 属性的字符串类型
  stringOfType: string,
  // 默认值，字符串形式表现
  stringOfDefaultValue?: string
}

/**
 * 文档表数据
 */
export interface Doc {
  [p: string]: DocItem
}

type _Doc = Doc | undefined

/**
 * 判断是否是 Component()
 * @param node 
 * @returns 
 */
function isComponentExpressionStatement(node: ts.Node) {
  if (!ts.isExpressionStatement(node) || !ts.isCallExpression(node.expression)) {
    return false
  }
  const jsdocTags = ts.getJSDocTags(node)
  if (jsdocTags.some(t => t.tagName.escapedText === JSDOCTag.Component)) {
    return true
  }

  return ts.isIdentifier(node.expression.expression) && node.expression.expression.escapedText === 'Component'
}

/**
 * 在对象中根据属性名获取属性值表达式
 * @param exp 
 * @param checker 
 * @param propertyName 
 * @returns 
 */
function getInitExpressionByPropertyName(
  exp: ts.ObjectLiteralExpression,
  checker: ts.TypeChecker,
  propertyName: string
): ts.Expression | null {
  for (let prop of exp.properties) {
    if (
      ts.isPropertyAssignment(prop) 
      && checker.getSymbolAtLocation(prop.name)?.getName() === propertyName
    ) {
      return prop.initializer
    }
  }
  return null
}

interface APIParserOptions {
  filenames: string[]
}

/**
 * APIParser
 */
class APIParser {
  private filenames: string[]
  private program: ts.Program
  private checker: ts.TypeChecker

  constructor({ filenames }: APIParserOptions) {
    this.filenames = filenames
    this.program = ts.createProgram(this.filenames, {})
    this.checker = this.program.getTypeChecker()
  }

  parse() {
    const sourceFiles = this.program.getSourceFiles()
    let properties: _Doc
    let events: _Doc
    let compExpStatement: ts.ExpressionStatement | undefined

    sourceFiles.forEach(sourceFile => {
      const { properties: props, events: e, compExpStatement: compExp } = this.createDocs(sourceFile)
      if (props) {
        if (!properties) properties = {}
        Object.assign(properties, props)
      }
      if (e) {
        if (!events) events = {}
        Object.assign(events, e)
      }
      if (compExp && !compExpStatement) compExpStatement = compExp
    })

    if (!properties && compExpStatement) {
      properties = {}
      this.readCompPropsToContainer(compExpStatement, properties)
    }

    return {
      properties,
      events,
    }
  }

  private createDocs(sourceFile: ts.SourceFile) {
    let properties: _Doc
    let events: _Doc
    let compExpStatement: ts.ExpressionStatement | undefined

    sourceFile.forEachChild(node => {
      if (ts.isInterfaceDeclaration(node)) {
        // find interfaces
        const symbol = this.checker.getSymbolAtLocation(node.name)
        if (symbol) {
          switch (symbol.getName()) {
            case APIType.Properties:
              if (!properties) properties = {}
              this.readInterfaceMembersToContainer(symbol, properties)
              break
            case APIType.Events:
              if (!events) events = {}
              this.readInterfaceMembersToContainer(symbol, events)
              break
            default:
              break
          }
        }
      } else if (!compExpStatement && isComponentExpressionStatement(node)) {
        compExpStatement = node as ts.ExpressionStatement
      }
    })

    return {
      properties,
      events,
      compExpStatement
    }
  }

  private readInterfaceMembersToContainer(
    symbol: ts.Symbol, 
    container: Doc
  ) {
    symbol.members?.forEach(member => {
      const name = member.getName()
      container[name] = {
        name,
        documentation: ts.displayPartsToString(member.getDocumentationComment(this.checker)),
        stringOfType: this.checker.typeToString(
          this.checker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!)
        ),
      }
    })
  }

  private readCompPropsToContainer(
    compExpStatement: ts.ExpressionStatement, 
    container: Doc
  ) {
    const { checker } = this

    function getPropertiesInitExp(exp: ts.ObjectLiteralExpression): ts.ObjectLiteralExpression | null {
      for (let prop of exp.properties) {
        if (
          ts.isPropertyAssignment(prop)
          && ts.isObjectLiteralExpression(prop.initializer)
          && (
            ts.getJSDocTags(prop).some(t => t.tagName.escapedText === 'WComponentProperties')
            || checker.getSymbolAtLocation(prop.name)?.getName() === 'properties'
          )
        ) {
          return prop.initializer
        }
      }
      return null
    }
    const { arguments: [argument0] = [] } = compExpStatement.expression as ts.CallExpression
    if (!ts.isObjectLiteralExpression(argument0)) return
    const propertiesExp = getPropertiesInitExp(argument0)
    if (!propertiesExp) return

    for (let p of propertiesExp.properties) {
      if (!ts.isPropertyAssignment(p)) continue
      const symbol = checker.getSymbolAtLocation(p.name)
      if (!symbol) continue
      const name = symbol.getName()
      let stringOfType = p.initializer.getText()

      const docProp: DocItem = {
        name,
        documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
        stringOfType
      }
      // Component properties 对象类型描述属性
      if (ts.isObjectLiteralExpression(p.initializer)) {
        const type = getInitExpressionByPropertyName(p.initializer, checker, 'type')?.getText()
        const stringOfDefaultValue = getInitExpressionByPropertyName(p.initializer, checker, 'value')?.getText()
        if (type) docProp.stringOfType = type
        if (stringOfDefaultValue) docProp.stringOfDefaultValue = stringOfDefaultValue
      }
      container[name] = docProp
    }
  }
}

export default APIParser
