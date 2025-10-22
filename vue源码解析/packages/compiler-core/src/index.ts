import { NodeTypes } from "./ast"

export const compile = {}

type AstContext = {
    originSource: string,
    source: string, //字符串会不停的减少
    line: number,
    colum: number,
    offset: number
}

const createParserContext = (content: string): AstContext => {
    return {
        originSource: content,
        source: content, //字符串会不停的减少
        line: 1,
        colum: 1,
        offset: 0
    }
}

const advanceBy = (context: AstContext, endIndex: number) => {
    let c = context.source
    context.source = c.slice(endIndex)
}

const parseTextData = (context: AstContext, endIndex: number) => {
    const content = context.source.slice(0, endIndex)
    advanceBy(context, endIndex) //去掉已处理的字符
    return content
}

const parseText = (context: AstContext) => {
    let tokens = ['<', '{{'] //找离得最近的
    let endIndex = context.source.length
    for (let i = 0; i < tokens.length; i++) {
        const index = context.source.indexOf(tokens[i], 1)
        if (index !== -1 && endIndex > index) {
            endIndex = index
        }
    }
    let content = parseTextData(context, endIndex)
    return content
}


const parseChildren = (context: AstContext) => {
    const nodes = []
    while (isEnd(context)) {
        const c = context.source
        let node
        if (c.startsWith("{{")) { //变量

        } else if (c.startsWith("<")) { //标签开头

        } else { //文本
            node = parseText(context)
        }
        nodes.push(node)
    }
    return nodes
}

const isEnd = (context: AstContext) => {
    return !context.source
}

const createRoot = (children: any[]) => {
    return {
        type: NodeTypes.ROOT,
        children
    }
}

/**
 * @description 模板字符解析
 * @param template 
 */
const parse = (template: string) => {
    //产生树
    const context = createParserContext(template)
    return createRoot(parseChildren(context))
}

export { parse }