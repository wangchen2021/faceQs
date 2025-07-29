//帮助打包packages下的模块，最终打包出js文件

import minimist from "minimist"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import esbuild from "esbuild"


//获取node执行的参数
const args = minimist(process.argv.slice(2))

console.log(args); //{ _: [ 'reactivity' ], f: 'esm' }

const target = args._[0] || "reactivity" //打包模块
const format = args.f || "iife" //打包模块规范
// es模块中无__dirname
const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url) //获取绝对路径
const __dirname = dirname(__filename)
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(`../packages/${target}/package.json`)

//根据需要进行打包
esbuild.context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: "browser",
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name
})
    .then((ctx) => {
        console.log("start dev");
        return ctx.watch()
    })