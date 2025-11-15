# monorepo(单仓多模块)
https://www.bilibili.com/video/BV1uinuzGEMK/?spm_id_from=333.337.search-card.all.click&vd_source=2e335378575371c0ee42c4dc7ddc2978

## 发展历程

1. 全部一堆

2. 全部一堆开始分模块

3. multirepo 多个仓库多个模块

4. 单个仓库多个项目（同业务）

## 技术选型

1. 单项目还是多项目

无所谓了就单独一个包

2. 多项目是否有强关联性

关联性强就选择monorepo

没啥关联性就选择multirepo

## 创建monorepo

1. 创建配置文件
   `touch pnpm-workspace.yaml`
   https://pnpm.io/zh/pnpm-workspace_yaml

2. 初始化工程
   `pnpm --workspace-root init`

3. 限制版本环境 在package.json中
4. - 警告类

```json
  "engines": {
    "node": ">=22.14.0",
    "pnpm": ">=10.20.0",
    "npm": ">=11.4.2"
  }
```

- 直接报错类
  创建`.npmrc`文件

配置

```ini
   engine-strict=true
```

5. 安装ts库
   `pnpm -Dw add typescript @types/node`

6. 创建tsconfig.ts
   写入基本配置

7. 安装规范

---

### prettier

- `pnpm -Dw add prettier`

控制统一代码输出格式

https://prettier.io/docs/en/index.html

https://www.prettier.cn/docs/

- 创建文件 `prettier.config.js`

- 编写配置

```javascript

```

- 创建忽略文件配置 `.prettierignore`

```js
dist;
public.local;
node_modules;
pnpm - lock.yaml;
```

---

### eslint

1. `pnpm -Dw i eslint @eslint/js globals typescript-eslint eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue`

- `eslint` 核心库
- `@eslint/js` js规范
- `globals` 全局变量支持
- `typescript-eslint` ts类型支持
- `@types-node` 类型定义辅助
- `eslint-plugin-prettier eslint-config-prettier`集成prettier
- `eslint-plugin-vue` vue支持

2. 安装配置类型提示`pnpm add -Dw jiti`
3. 创建配置文件`eslint.config.ts`


---
