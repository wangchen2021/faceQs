import { NodeTypes } from "./ast"
import { parse } from "./parser"
import { TO_DISPLAY_STRING } from "./runtimeHelper"

//dom遍历的方式

const createTransformContext = (root: any) => {
    const context = {
        currentNode: root,
        parent: null,
        transformNode: [
            transformElement,
            transformText,
            transformExpression,
        ],
        helpers: new Map(), //记录节点次数
        helper(name: string) {
            let count = context.helpers.get(name) || 0
            context.helpers.set(name, count + 1)
        },
    }
    return context
}

const transformElement = (node: any) => {
    if (node.type === NodeTypes.ELEMENT) {
        console.log(1);
    }
    return function () {

    }
}

const transformText = (node: any) => {
    if (node.type === NodeTypes.TEXT || node.type === NodeTypes.ROOT) {
        console.log(2);
    }
    return function () {

    }
}

const transformExpression = (node: any) => {
    if (node.type === NodeTypes.INTERPOLATION) {
        node.content.content = `_ctx.${node.content.content}`
    }
    return function () {

    }
}

const traverseNode = (node: any, context: any) => {
    context.currentNode = node
    const transforms = context.transformNode
    const exits = [] //元素 文本 表达式
    for (let i = 0; i < transforms.length; i++) {
        const exit = transforms[i](node, context)
        exit && exits.push(exit)
    }

    switch (node.type) {
        case NodeTypes.ROOT:
            break
        case NodeTypes.ELEMENT:
            for (let i = 0; i < node.children.length; i++) {
                context.parent = node
                traverseNode(node.children[i], context)
            }
            break
        case NodeTypes.INTERPOLATION:
            //处理表达式
            context.helper(TO_DISPLAY_STRING)
            break
    }

    let len = exits.length
    if (len > 0) {
        while (len--) {
            exits[len]()
        }
    }
}

const transform = (ast: any) => {
    const context = createTransformContext(ast)
    traverseNode(ast, context)
    ast.helpers = [...context.helpers.keys()]
}

const compile = (template: string) => {
    const ast = parse(template)
    //进行代码转化
    transform(ast)
    console.log(ast);
}

export { parse, compile }