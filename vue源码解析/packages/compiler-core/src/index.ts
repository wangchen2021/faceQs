import { NodeTypes } from "./ast"

export const compile = {}

type AstContext = {
    originalSource: string,
    source: string, //字符串会不停的减少
    line: number,
    column: number,
    offset: number
}

const tagsBuffer: string[] = []

const createParserContext = (content: string): AstContext => {
    return {
        originalSource: content,
        source: content, //字符串会不停的减少
        line: 1,
        column: 1,
        offset: 0
    }
}

const advanceBy = (context: AstContext, endIndex: number) => {
    let c = context.source
    advancePositionMutation(context, c, endIndex);
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
    let start = getCursor(context);
    let content = parseTextData(context, endIndex)
    return {
        type: NodeTypes.TEXT,
        content,
        loc: getSelection(context, start),
    };
}

const advanceSpaces = (context: AstContext) => {
    const match = /^[ \t\r\n]+/.exec(context.source);
    if (match) {
        // 删除空格
        advanceBy(context, match[0].length);
    }
}

function getCursor(context: AstContext) {
    let { line, column, offset } = context;
    return { line, column, offset };
}

function getSelection(context: AstContext, start: any, e?: any) {
    let end = e || getCursor(context);
    // eslint 可以根据 start，end找到要报错的位置
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset),
    };
}

const parseAttributeValue = (context: AstContext) => {
    const quote = context.source[0]
    const isQuoted = quote === '"' || quote === "'"
    let content
    if (isQuoted) {
        advanceBy(context, 1)
        const endIndex = context.source.indexOf(quote, 1)
        content = parseTextData(context, endIndex)
        advanceBy(context, 1)
    } else {
        const match = context.source.match(/([^ \t\r\n/>])+/) as any[]
        content = match[0]
        advanceBy(context, content.length)
        advanceSpaces(context)
    }
    return content
}

const parseAttribute = (context: AstContext) => {
    const start = getCursor(context)
    let match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source) as any[];
    const name = match[0];
    advanceBy(context, name.length)
    let content;
    if (/^[\t\r\n\f ]*=/.test(context.source)) {
        advanceSpaces(context)
        advanceBy(context, 1)
        advanceSpaces(context)
        content = parseAttributeValue(context)
    }
    let loc = getSelection(context, start)
    return {
        type: NodeTypes.ATTRIBUTE,
        name,
        value: {
            type: NodeTypes.TEXT,
            content,
            loc
        },
        loc: getSelection(context, start)
    }
}

const parseAtrributes = (context: AstContext) => {
    const props: any[] = []
    while (context.source.length > 0 && !context.source.startsWith("/>") && !context.source.startsWith(">")) {
        props.push(parseAttribute(context))
        advanceSpaces(context)
    }
    return props
}

const parseTag = (context: AstContext) => {
    const isEndTag = context.source.startsWith("</")
    const start = getCursor(context)
    const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source) as string[]
    const tag = match[1];
    advanceBy(context, match[0].length)
    advanceSpaces(context)
    let props = parseAtrributes(context)
    const isSelfClosing = context.source.startsWith("/>")
    advanceBy(context, isSelfClosing ? 2 : 1)
    if (!isSelfClosing && !isEndTag) {
        tagsBuffer.push(tag)
    }
    return {
        type: NodeTypes.ELEMENT,
        tag,
        isSelfClosing,
        children: [],
        loc: getSelection(context, start),
        props,
    }
}

const checkEndTag = (endTag: string) => {
    const bufferLastTag = tagsBuffer.pop()
    if (endTag !== bufferLastTag) {
        unknowEndTag(endTag)
    }
}

const parseElement = (context: AstContext) => {
    const ele = parseTag(context)
    const children = parseChildren(context)
    if (context.source.startsWith("</")) {
        const endTag = parseTag(context).tag //闭合标签直接移除
        checkEndTag(endTag)
    }
    ele.children = children
    ele.loc = getSelection(context, ele.loc?.start)
    return ele
}

const advancePositionMutation = (context: any, c: string, endIndex: number) => {
    let linesCount = 0; // 第几行
    let linePos = -1; // 换行的位置信息

    for (let i = 0; i < endIndex; i++) {
        if (c.charCodeAt(i) == 10) {
            linesCount++;
            linePos = i;
        }
    }
    context.offset += endIndex;
    context.line += linesCount;
    context.column =
        linePos == -1 ? context.column + endIndex : endIndex - linePos;
}

const parseInterpolation = (context: AstContext) => {
    const start = getCursor(context);
    const closeIndex = context.source.indexOf("}}", 2);
    advanceBy(context, 2); // 去掉开头 {{
    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);
    const preTrimContent = parseTextData(context, closeIndex - 2);
    const content = preTrimContent.trim(); // 表达式中的变量
    // 获取  {{   name   }}去空格
    const startOffset = preTrimContent.indexOf(content);
    if (startOffset > 0) {
        advancePositionMutation(innerStart, preTrimContent, startOffset);
    }
    const endOffset = startOffset + content.length;
    advancePositionMutation(innerEnd, preTrimContent, endOffset);
    advanceBy(context, 2);
    //    name   }}
    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            isStatic: false,
            isConstant: false,
            content,
            loc: getSelection(context, innerStart, innerEnd),
        },
        loc: getSelection(context, start),
    };
}

const parseChildren = (context: AstContext) => {
    const nodes = [] as any;
    while (!isEnd(context)) {
        const c = context.source; // 现在解析的内容
        let node;
        if (c.startsWith("{{")) {
            // {{}}
            node = parseInterpolation(context);
        } else if (c[0] === "<") {
            // <div>
            node = parseElement(context);
        } else {
            // 文本  // abc  {{}} <div></div>
            node = parseText(context);
        }
        nodes.push(node);
    }
    // debugger
    for (let i = 0; i < nodes.length; i++) { //去除无效节点
        let node = nodes[i]
        if (node.type === NodeTypes.TEXT) {
            if (!/[^\t\r\n\f ]/.test(node.content)) {
                nodes[i] = null
            } else {
                node.content = node.content.replace(/[\t\r\n\f ]+/g, " ");
            }
        }
    }
    return nodes.filter(Boolean);
}

const missEndTag = (tag: string) => {
    throw new Error(`miss end tag </${tag}>`)
}

const unknowEndTag = (tag: string) => {
    throw new Error(`unknow end tag </${tag}>`)
}

const isEnd = (context: AstContext) => {
    const c = context.source;
    if (c.startsWith("</")) {
        const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source) as string[]
        const tag = match[1]
        console.log(tag);
        if (tag !== tagsBuffer[tagsBuffer.length - 1]) {
            unknowEndTag(tag)
        }
        // 如果是闭合标签，也要停止循环
        return true;
    } else if (!c) {
        if (tagsBuffer.length > 0) {
            missEndTag(tagsBuffer[tagsBuffer.length - 1])
        }
        tagsBuffer.length = 0
    }
    return !c;
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
    //产生ast语法树
    const context = createParserContext(template)
    return createRoot(parseChildren(context))
}

export { parse }