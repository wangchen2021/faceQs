const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //入口
    entry: "./main.js",
    //出口
    output: {
        path: undefined, //开发模式无输出
        filename: "js/main.js",
        clean: true
    },
    //加载器
    module: {
        rules: [
            //loader的配置
            //css处理
            {
                test: /\.css$/i,
                //从右到左
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/i,
                //从右到左
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                //图片处理
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                //asset转base64 asset/resource 原封不动
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        //小于10kb转换格式
                        maxSize: 10 * 1024,//10kb
                    }
                },
                generator: {
                    //hash文件唯一id  ext 扩展名  query 携带请求参数
                    filename: 'static/imgs/[hash:10][ext][query]'
                }
            },
            {
                //babel
                test: /\.m?js$/,
                //排除哪些不处理
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                //下面的单独写在babel.config.js中
                //   options: {
                //     presets: ['@babel/preset-env']
                //   }
            }
        ]
    },
    //插件
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '../public'),
        },
        compress: true,
        port: 9000,
        open: true
    },
    //模式
    mode: "development"
 
}