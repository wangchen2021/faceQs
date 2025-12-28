const express = require('express');
const app = express();
const port = 3000; // 端口号
const cors = require('cors');

// 解析 JSON 请求体
app.use(express.json());
// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*', // 允许所有域名访问（开发环境可用，生产环境需指定具体域名）
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的请求方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));

// 根路由
app.get('/', (req, res) => {
    res.send('Hello, Express Server!');
});

app.get("/test", (req, res) => {
    setTimeout(() => {
        res.send({
            name: "小王"
        })
    }, 2000)
})

app.get("/count", (req, res) => {
    setTimeout(() => {
        res.send(5)
    }, 2000)
})

// 带参数的路由
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `获取用户 ${userId} 的信息`, id: userId });
});

// 处理 POST 请求
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // 模拟登录验证
    if (username && password) {
        res.json({ success: true, message: '登录成功', user: { username } });
    } else {
        res.status(400).json({ success: false, message: '用户名或密码不能为空' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});