const proto = { x: 10 };
const target = Object.create(proto);
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // 响应式核心：收集依赖（如页面渲染依赖 x）
    // track(target, key); 
    console.log(1111);
    
    // 错误写法：用 target[key] 读原型属性
    // 此时查找的是 target 的原型（proto.x），但不会触发 proxy 的 get 拦截
    return target[key]; 

    // 正确写法：用 Reflect.get，receiver 绑定 proxy 实例
    // 查找时会以 proxy 为上下文，原型上的 x 访问也会被当前 get 捕获器拦截（如果原型也被代理）
    // return Reflect.get(target, key, receiver);
  }
});

// 访问 proxy.x 时，错误写法只能收集 target 的依赖，原型上的 x 访问未被拦截
// 若 proto.x 是响应式数据（如也被 proxy 代理），则无法触发更新
console.log(proxy.x);