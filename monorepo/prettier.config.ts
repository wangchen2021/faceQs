/**
 * Prettier 完整配置示例
 * 文档参考：https://prettier.io/docs/en/options.html
 */
export default {
    // -------------------------- 基础格式配置 --------------------------
    // 每行最大字符数（超过会自动换行）
    printWidth: 120, // 默认 80，推荐 100-120 更适合现代宽屏

    // 缩进空格数（或使用 tab）
    tabWidth: 2, // 默认 2
    useTabs: false, // 是否用 tab 代替空格（默认 false）

    // 语句末尾是否加分号
    semi: true, // 默认 true，建议保持（避免ASI自动分号插入问题）

    // 字符串引号格式
    singleQuote: true, // 使用单引号（默认 false 为双引号）
    jsxSingleQuote: false, // JSX 中是否用单引号（默认 false，保持双引号更符合 React 习惯）

    // 对象/数组最后一个元素后是否加逗号
    trailingComma: 'es5', // 可选：'none'（不加）| 'es5'（对象/数组加）| 'all'（所有场景加，包括函数参数）
    // 推荐 'es5'：兼容大多数场景，避免 git  diff 冗余

    // 对象括号间的空格
    bracketSpacing: true, // { foo: bar } 而非 {foo: bar}（默认 true）

    // JSX 标签闭合位置
    // jsxBracketSameLine: false, // <div>content</div> 而非 <div
    //   content
    // ></div>（默认 false，更易读）

    // 箭头函数参数括号
    arrowParens: 'always', // (x) => x 而非 x => x（默认 'always'，避免歧义）

    // -------------------------- 特殊场景配置 --------------------------
    // 格式化范围（默认整个文件）
    rangeStart: 0,
    rangeEnd: Infinity,

    // 嵌入代码的格式化（如 HTML 中的 JS、Markdown 中的代码块）
    embeddedLanguageFormatting: 'auto', // 'auto'（自动格式化）| 'off'（不格式化）

    // Vue 单文件组件中 <script> 和 <style> 标签的缩进
    vueIndentScriptAndStyle: false, // 默认 false，保持与 <template> 缩进一致

    // HTML 空格敏感度（影响标签内空格处理）
    htmlWhitespaceSensitivity: 'css', // 可选：'strict'（严格）| 'ignore'（忽略）| 'css'（按 CSS 规则，默认）
    // 'css'：遵循 CSS display 属性处理空格（推荐，避免 HTML 布局问题）

    // Markdown 换行处理
    proseWrap: 'preserve', // 可选：'always'（超过 printWidth 换行）| 'never'（不换行）| 'preserve'（保持原换行，默认）
    // 推荐 'preserve'：Markdown 手动换行更符合阅读习惯

    // 换行符格式
    endOfLine: 'lf', // 可选：'lf'（Unix 风格，\n）| 'crlf'（Windows 风格，\r\n）| 'cr'（Mac 旧式，\r）| 'auto'（保持原文件）
    // 团队协作建议统一为 'lf'，避免跨系统 git 提交时的换行符冲突

    // -------------------------- 插件相关（如需扩展） --------------------------
    // 插件列表（需先安装对应 npm 包）
    // plugins: [
    //   'prettier-plugin-tailwindcss', // Tailwind CSS 类排序
    //   'prettier-plugin-vue', // Vue 格式化增强（通常无需手动加，Prettier 原生支持）
    // ],

    // 插件配置（示例：Tailwind 类排序）
    // tailwindConfig: './tailwind.config.js', // 指定 Tailwind 配置文件路径
};