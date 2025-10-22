export const enum NodeTypes {
  ROOT,                    // 0  根节点
  ELEMENT,                 // 1  普通元素
  TEXT,                    // 2  静态文本
  COMMENT,                 // 3  注释节点
  SIMPLE_EXPRESSION,       // 4  简单表达式（如变量名）
  INTERPOLATION,           // 5  插值 {{ }}
  ATTRIBUTE,               // 6  普通属性
  DIRECTIVE,               // 7  指令（v-xxx）
  // 8 被移除
  IF,                      // 9  v-if
  IF_BRANCH,               // 10 v-if 分支
  FOR,                     // 11 v-for
  TEXT_CALL,               // 12 需要调用的文本（优化）
  VNODE_CALL,              // 13 创建 VNode 的调用
  JS_CALL_EXPRESSION,      // 14 JS 调用表达式
  JS_OBJECT_EXPRESSION,    // 15 JS 对象表达式
  JS_PROPERTY,             // 16 JS 对象属性
  JS_ARRAY_EXPRESSION,     // 17 JS 数组表达式
  JS_FUNCTION_EXPRESSION,  // 18 JS 函数表达式
  JS_CONDITIONAL_EXPRESSION,// 19 JS 条件表达式
  JS_CACHE_EXPRESSION,     // 20 JS 缓存表达式
  JS_BLOCK_STATEMENT,      // 21 JS 块语句
  JS_TEMPLATE_LITERAL,     // 22 JS 模板字面量
  JS_IF_STATEMENT,         // 23 JS if 语句
  JS_ASSIGNMENT_EXPRESSION,// 24 JS 赋值表达式
  JS_SEQUENCE_EXPRESSION,  // 25 JS 序列表达式（逗号表达式）
  JS_RETURN_STATEMENT,     // 26 JS return 语句
}