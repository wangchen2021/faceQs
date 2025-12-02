// 子系统：多个独立组件
function Input({ value, onChange }) { /* 输入框 */ }
function Validator({ value, rule }) { /* 校验逻辑 */ }
function Button({ onClick, children }) { /* 提交按钮 */ }

// 外观组件：封装子系统，提供简化接口
function LoginForm({ onSubmit }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 内部处理校验、状态管理（子系统逻辑）
    const handleSubmit = () => {
        if (!username || !password) {
            setError("用户名或密码不能为空");
            return;
        }
        onSubmit({ username, password });
    };

    // 对外提供简单接口（仅需传入 onSubmit）
    return (
        <div>
            <Input value={username} onChange={setUsername} placeholder="用户名" />
            <Input value={password} onChange={setPassword} type="password" />
            {error && <span>{error}</span>}
            <Button onClick={handleSubmit}>登录</Button>
        </div>
    );
}

// 使用：无需关心内部子组件，只需调用 onSubmit
<LoginForm onSubmit={(data) => console.log("提交", data)} />