# npmrc文件

npmrc 文件完全指南（前端开发必备）
npmrc 是 npm 的配置文件，用于自定义 npm 的行为规则（如镜像源、缓存路径、权限设置等），支持全局配置和项目级配置，是前端开发中管理 npm 环境的核心工具。
一、npmrc 文件的类型与优先级
npm 会从多个位置读取 npmrc 文件，按优先级从高到低排列如下：
类型 路径（示例） 作用范围
项目级配置 项目根目录下的 .npmrc 仅对当前项目生效
用户级配置 ~/.npmrc（Windows：C:\Users\用户名\.npmrc） 对当前用户的所有项目生效
全局配置 $npm_config_prefix/etc/npmrc（需通过 npm config set 全局设置） 对系统所有用户生效（较少用）
npm 内置配置 npm 安装目录下的 npmrc 默认配置，不建议手动修改
优先级规则：如果不同配置文件中有相同配置项，高优先级的会覆盖低优先级（例如项目级 .npmrc 会覆盖用户级 .npmrc 中的同名配置）。

二、常用配置项（前端开发必备）

1. 镜像源配置（解决 npm 下载慢问题）
   默认镜像源（https://registry.npmjs.org/）在国内访问较慢，可配置为淘宝镜像、华为镜像等：

```ini
# 项目级 .npmrc（仅当前项目用淘宝镜像）
registry=https://registry.npmmirror.com/

# 单独设置某个包的镜像（如 electron 需特定源）
electron_mirror=https://npmmirror.com/mirrors/electron/
```

2. 依赖安装相关配置

```ini
# 安装依赖时是否生成 package-lock.json（默认 true）
package-lock=false

# 安装生产环境依赖（--production）的快捷配置
production=true

# 允许安装被标记为过时（outdated）的依赖
allow-outdated=true
```

3. 路径与缓存配置

```ini
# 全局安装包的路径（默认在系统目录，可改为用户目录避免权限问题）
prefix=~/.npm-global

# 缓存目录（默认 ~/.npm）
cache=~/.npm-cache

# 临时文件目录
tmp=~/.npm-tmp
```

4. 权限与安全配置

```ini
# 禁止运行 package.json 中的 scripts（安全模式）
ignore-scripts=true

# 安装时检查依赖的完整性（校验哈希值）
strict-ssl=true

# 允许安装未验证的包（不推荐，有安全风险）
unsafe-perm=true
```

5. 代理配置（适用于公司内网）

```ini
# HTTP 代理
proxy=http://username:password@proxy.company.com:8080

# HTTPS 代理
https-proxy=http://username:password@proxy.company.com:8080

# 不使用代理的域名（逗号分隔）
noproxy=localhost,127.0.0.1,.company.com
```

三、配置方式（3 种方法）

1. 手动编辑 npmrc 文件
   直接创建 / 修改对应路径的 .npmrc 文件（注意文件名前有.），按 key=value 格式添加配置：

```bash
# 创建项目级配置
touch .npmrc
echo "registry=https://registry.npmmirror.com/" >> .npmrc
```

2. 通过 npm 命令设置（推荐）
   使用 npm config set <key> <value> 自动写入配置，无需手动找文件路径：

```bash
# 设置用户级镜像源（对当前用户生效）
npm config set registry https://registry.npmmirror.com/

# 设置项目级配置（需在项目根目录执行，会写入项目 .npmrc）
npm config set registry https://registry.npmmirror.com/ --location project

# 查看当前所有配置
npm config list

# 查看某个配置的值（如 registry）
npm config get registry
```

3. 临时通过命令行参数覆盖
   安装依赖时通过 --<key> <value> 临时覆盖配置，不影响 npmrc 文件：

```bash
# 临时使用淘宝镜像安装 axios
npm install axios --registry=https://registry.npmmirror.com/
```

四、实战场景（解决前端开发问题）

1. 项目统一镜像源，避免团队成员环境差异
   在项目根目录添加 .npmrc，提交到 Git 仓库，确保所有人使用相同源：

```ini
# 项目 .npmrc
registry=https://registry.npmmirror.com/
# 私有包镜像（如公司内部 npm 仓库）
@company:registry=https://npm.company.com/
```

2. 解决全局安装权限问题（Mac/Linux）
   默认全局安装路径（如 /usr/local/lib）需要管理员权限，可通过 prefix 改到用户目录：

```bash

# 设置全局安装路径到用户目录
npm config set prefix ~/.npm-global

# 配置环境变量（~/.bashrc 或 ~/.zshrc）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

3. 加速特定包的下载（如 Electron、ChromeDriver）
部分包（如 Electron）默认从国外服务器下载，可单独配置镜像：
ini
```

# .npmrc 中添加

electron_mirror=https://npmmirror.com/mirrors/electron/
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver/
sass_binary_site=https://npmmirror.com/mirrors/node-sass/

五、注意事项
配置生效顺序：项目级 > 用户级 > 全局级，同名配置高优先级覆盖低优先级。
敏感信息处理：.npmrc 中若包含私有仓库的 token 或账号密码，不要提交到 Git（可在 .gitignore 中排除）。
删除配置：使用 npm config delete <key> 移除某个配置，或直接编辑文件删除行。
Windows 路径格式：在 Windows 中配置路径需用反斜杠 \ 或正斜杠 /，例如 cache=C:/Users/用户名/.npm-cache。
