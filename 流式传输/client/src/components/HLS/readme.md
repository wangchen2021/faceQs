# 音视频点播 HLS 具体实现教程（完整可落地）
HLS（HTTP Live Streaming）实现音视频点播的核心逻辑是：**先将完整音视频文件转码切片为 TS 小文件 + 生成 M3U8 索引文件，再通过 Web 服务器提供文件访问，最后用播放器加载 M3U8 文件实现边下边播**。

下面分「核心准备工作」「步骤1：音视频转码切片（生成 HLS 资源）」「步骤2：部署 Web 服务器」「步骤3：前端播放 HLS 视频」「验证效果」五个部分，全程使用免费工具，零基础可落地。

## 一、 核心准备工作
### 1.  必备工具
| 工具 | 作用 | 下载地址 |
|------|------|----------|
| FFmpeg | 核心工具：将 MP4/AVI 等普通音视频转码为 HLS 格式（TS 切片 + M3U8 索引） | 官网：https://ffmpeg.org/download.html（根据系统选择对应版本，Windows 推荐下载静态编译包） |
| 任意 Web 服务器 | 提供 HLS 文件（M3U8 + TS）的 HTTP 访问（不能直接本地打开 M3U8，需 HTTP 服务） | 可选：① Python（自带简易 Web 服务，无需额外安装）；② Nginx（生产环境首选）；③ VS Code Live Server（前端友好） |
| 前端 HLS 播放器 | 解析 M3U8 并播放 TS 切片（浏览器原生不支持 HLS，需第三方播放器） | 推荐：Video.js（兼容好）、hls.js（轻量） |
| 测试音视频文件 | 任意格式的音视频（如 MP4 格式，建议先使用小文件测试） | 自备或下载测试文件：https://sample-videos.com/（选择 MP4 格式） |

### 2.  环境验证（以 Windows 为例，Mac/Linux 类似）
1.  下载 FFmpeg 后，解压到任意目录（如 `D:\ffmpeg`），并将 `ffmpeg/bin` 目录添加到系统环境变量（方便全局调用 `ffmpeg` 命令）；
2.  打开命令行（CMD/PowerShell），输入 `ffmpeg -version`，若能显示版本信息，说明 FFmpeg 配置成功；
3.  准备好测试文件（如 `test.mp4`），放在单独目录（如 `D:\hls-demo\source`），方便后续操作。

## 二、 步骤1：用 FFmpeg 将音视频转码切片（生成 HLS 核心资源）
HLS 的核心是「M3U8 索引文件」+「TS 媒体切片文件」，我们通过 FFmpeg 一键生成，无需手动操作。

### 1.  核心命令（基础版，满足大部分点播场景）
1.  命令行进入测试文件目录（或直接指定文件路径）：
    ```bash
    # 进入目录（Windows 示例）
    cd D:\hls-demo\source
    # Mac/Linux 示例
    cd /Users/xxx/hls-demo/source
    ```
2.  执行 FFmpeg 转码切片命令：
    ```bash
    # 基础版命令：将 test.mp4 转为 HLS 格式，输出到 ./hls 目录
    ffmpeg -i test.mp4 -c:v h264 -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename ./hls/%03d.ts ./hls/index.m3u8
    ```

### 2.  命令参数详解（理解后可自定义配置）
| 参数 | 作用 |
|------|------|
| `-i test.mp4` | 指定输入文件（你的测试音视频文件路径） |
| `-c:v h264` | 视频编码器指定为 H264（HLS 标准支持，兼容性最强） |
| `-c:a aac` | 音频编码器指定为 AAC（HLS 标准支持，音质好） |
| `-hls_time 10` | 每个 TS 切片的时长（单位：秒），默认 10 秒（可自定义 5-30 秒，切片越小，首屏加载越快，文件数量越多） |
| `-hls_list_size 0` | 指定 M3U8 索引文件中保存的切片数量，`0` 表示保存所有切片（点播场景必须设为 0，支持快进/后退到任意位置；直播场景可设为固定数值，清理旧切片） |
| `-hls_segment_filename ./hls/%03d.ts` | 指定 TS 切片的保存路径和命名规则（`./hls/` 表示当前目录下新建 hls 文件夹，`%03d` 表示切片按 001、002、003... 命名） |
| `./hls/index.m3u8` | 指定输出的 M3U8 索引文件路径和名称（核心索引文件，播放器将加载该文件） |

### 3.  执行结果验证
1.  命令执行完成后，会在 `./hls` 目录下生成两类文件：
    -  索引文件：`index.m3u8`（文本格式，可直接用记事本打开，里面记录了 TS 切片的路径、时长等信息）；
    -  媒体切片：`001.ts`、`002.ts`、`003.ts`...（编码后的音视频小文件，每个约 10 秒时长）；
2.  若生成失败，检查：① FFmpeg 环境变量是否配置；② 输入文件路径是否正确；③ 有无权限创建 hls 目录。

### 4.  进阶：生成自适应码率 HLS（兼容不同网络）
如果需要适配「弱网（低清）」「强网（高清）」场景，可生成多码率 HLS（多个 TS 切片目录 + 一个主 M3U8 文件），命令如下：
```bash
# 生成 360P（低清）、720P（高清）两个码率的 HLS 资源
ffmpeg -i test.mp4 \
-map 0:v -map 0:a -map 0:v -map 0:a \
-c:v:0 h264 -b:v:0 500k -s:0 640x360 \
-c:v:1 h264 -b:v:1 1500k -s:1 1280x720 \
-c:a aac -b:a 128k \
-hls_time 10 \
-hls_list_size 0 \
-hls_segment_filename ./hls/%v/%03d.ts \
-hls_variant_plist master.m3u8 \
-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
./hls/%v/index.m3u8
```
执行后会生成 `hls/360p`、`hls/720p` 两个切片目录，以及 `master.m3u8` 主索引文件，播放器会根据网络状况自动切换码率。

## 三、 步骤2：部署 Web 服务器（提供 HLS 文件 HTTP 访问）
**关键注意**：HLS 必须通过 HTTP/HTTPS 协议访问，不能直接双击 M3U8 文件用浏览器打开（会跨域/协议错误），下面提供 3 种简易部署方案（任选其一）。

### 方案1：Python 简易 Web 服务器（无需额外安装，推荐测试用）
1.  命令行进入 `hls-demo` 目录（包含 hls 文件夹的上级目录）：
    ```bash
    cd D:\hls-demo
    ```
2.  启动 Python Web 服务：
    ```bash
    # Python 3.x 命令
    python -m http.server 8080
    # Python 2.x 命令（极少用）
    python -m SimpleHTTPServer 8080
    ```
3.  启动成功后，终端会显示 `Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/)`，说明服务已启动。

### 方案2：VS Code Live Server（前端开发者友好）
1.  在 VS Code 中打开 `hls-demo` 目录；
2.  安装「Live Server」插件（搜索插件名，点击安装）；
3.  右键点击 `hls` 目录下的 `index.m3u8`（或上级目录的空白处），选择「Open with Live Server」；
4.  自动打开浏览器，端口默认 5500，无需额外配置。

### 方案3：Nginx 服务器（生产环境首选）
1.  下载 Nginx 并解压（官网：https://nginx.org/en/download.html）；
2.  修改 `nginx/conf/nginx.conf` 配置，指定网站根目录为 `hls-demo` 目录：
    ```nginx
    server {
        listen       80; # 端口
        server_name  localhost; # 域名，本地测试用 localhost

        # 网站根目录（改为你的 hls-demo 目录路径）
        root   D:\hls-demo;
        index  index.html index.htm;

        # 关键：配置 HLS 文件的 MIME 类型（避免浏览器识别错误）
        types {
            application/x-mpegURL m3u8;
            video/MP2T ts;
        }

        # 允许跨域（可选，前端部署在不同域名时需要）
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    }
    ```
3.  启动 Nginx：双击 `nginx.exe`（Windows），或 `./nginx`（Mac/Linux）；
4.  访问 `http://localhost/hls/index.m3u8`，若能看到 M3U8 文本内容，说明 Nginx 配置成功。

## 四、 步骤3：前端实现 HLS 视频播放（两种主流方案）
浏览器原生不支持 HLS 播放，需借助第三方播放器，下面提供两种常用方案，均兼容 PC + 移动端。

### 方案1：Video.js（开箱即用，兼容性最强）
Video.js 是一款成熟的 HTML5 视频播放器，通过 `videojs-http-streaming` 插件原生支持 HLS，无需额外配置。

1.  新建 HTML 文件（如 `player.html`，放在 `hls-demo` 目录下）：
    ```html
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HLS 点播 - Video.js 播放</title>
        <!-- 引入 Video.js 样式和脚本 -->
        <link href="https://cdn.jsdelivr.net/npm/video.js@8.6.1/dist/video-js.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/video.js@8.6.1/dist/video.min.js"></script>
        <!-- 引入 HLS 支持插件（Video.js 8.x 内置，无需额外引入；7.x 需单独引入） -->
        <script src="https://cdn.jsdelivr.net/npm/videojs-http-streaming@3.8.0/dist/videojs-http-streaming.min.js"></script>
    </head>
    <body>
        <!-- 视频播放器容器 -->
        <video
            id="hlsPlayer"
            class="video-js vjs-big-play-centered"
            controls
            width="800"
            height="450"
            poster="./poster.jpg" <!-- 可选：视频封面图 -->
        >
            <!-- 关键：指定 HLS 索引文件地址（HTTP 路径） -->
            <source src="http://localhost:8080/hls/index.m3u8" type="application/x-mpegURL">
            你的浏览器不支持 HLS 视频播放，请升级浏览器！
        </video>

        <script>
            // 初始化播放器
            var player = videojs('hlsPlayer', {
                autoplay: false, // 是否自动播放（部分浏览器需用户交互后才能自动播放）
                preload: 'auto' // 预加载策略
            });

            // 播放事件监听（可选）
            player.on('play', function() {
                console.log('视频开始播放');
            });

            player.on('ended', function() {
                console.log('视频播放结束');
            });
        </script>
    </body>
    </html>
    ```

### 方案2：hls.js（轻量灵活，自定义性强）
hls.js 是专门用于解析 HLS 的轻量库，可配合原生 `<video>` 标签使用，体积更小。

1.  新建 HTML 文件（如 `hls-player.html`，放在 `hls-demo` 目录下）：
    ```html
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HLS 点播 - hls.js 播放</title>
    </head>
    <body>
        <!-- 原生 video 标签 -->
        <video
            id="hlsPlayer"
            controls
            width="800"
            height="450"
            poster="./poster.jpg"
        ></video>

        <!-- 引入 hls.js -->
        <script src="https://cdn.jsdelivr.net/npm/hls.js@1.4.14/dist/hls.min.js"></script>
        <script>
            // 获取 video 元素
            var video = document.getElementById('hlsPlayer');
            // HLS 索引文件地址
            var hlsUrl = 'http://localhost:8080/hls/index.m3u8';

            // 判断浏览器是否支持 hls.js
            if (Hls.isSupported()) {
                // 初始化 HLS 实例
                var hls = new Hls({
                    // 可选配置：如最大缓冲时长、重试次数等
                    maxBufferLength: 30, // 最大缓冲 30 秒
                    maxRetryCount: 3 // 加载失败重试 3 次
                });

                // 绑定 video 元素
                hls.attachMedia(video);
                // 加载 M3U8 文件
                hls.loadSource(hlsUrl);
                // 启动加载
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    console.log('M3U8 索引文件解析成功，可播放视频');
                    // 可选：自动播放
                    // video.play();
                });

                // 错误监听
                hls.on(Hls.Events.ERROR, function(event, data) {
                    console.error('HLS 播放错误：', data);
                    // 尝试恢复播放
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });
            }
            // 兼容：部分浏览器（如 Safari）原生支持 HLS
            else if (video.canPlayType('application/x-mpegURL')) {
                video.src = hlsUrl;
                video.addEventListener('loadedmetadata', function() {
                    console.log('浏览器原生支持 HLS，开始播放');
                });
            }
            // 不支持 HLS
            else {
                alert('你的浏览器不支持 HLS 视频播放，请升级浏览器！');
            }
        </script>
    </body>
    </html>
    ```

### 关键配置：HLS 文件路径说明
-  本地测试时，路径格式为 `http://[服务器IP]:[端口]/hls/index.m3u8`（如 `http://localhost:8080/hls/index.m3u8`、`http://192.168.1.100:5500/hls/index.m3u8`）；
-  生产环境时，替换为你的域名路径（如 `https://xxx.com/hls/index.m3u8`）；
-  确保路径可访问：在浏览器直接输入 M3U8 路径，若能看到文本内容，说明路径有效。

## 五、 验证播放效果
1.  确保 Web 服务器已启动（如 Python 8080 端口）；
2.  浏览器访问前端播放页面（如 `http://localhost:8080/player.html`）；
3.  点击播放按钮，观察效果：
    -  视频能正常播放，无需等待完整文件加载（边下边播）；
    -  支持快进/后退到任意时间点（因 `hls_list_size 0` 保存了所有切片）；
    -  打开浏览器「Network」面板，可看到浏览器依次请求 `index.m3u8` 和 `001.ts`、`002.ts`、`003.ts`...（播放到对应片段时才请求对应的 TS 文件）；
4.  若播放失败，排查：① M3U8 路径是否正确；② Web 服务器是否配置 HLS MIME 类型；③ 浏览器是否兼容（推荐 Chrome/Firefox/Safari 最新版）。

## 六、 生产环境优化要点
1.  **CDN 加速**：将 TS 切片和 M3U8 文件部署到 CDN，提升用户访问速度（核心优化手段）；
2.  **缓存策略**：给 M3U8 文件设置短缓存（或不缓存），给 TS 切片设置长缓存（因 TS 文件不会变更）；
3.  **防盗链**：通过 Nginx 配置 referer 验证、签名 URL 等，防止他人盗用你的 HLS 资源；
4.  **转码优化**：使用硬件转码（如 NVIDIA NVENC）提升 FFmpeg 转码速度，或使用云服务（如阿里云媒体处理、腾讯云点播）自动生成 HLS 资源；
5.  **自适应码率**：生成多码率 HLS 资源，适配不同网络带宽的用户。

## 总结
HLS 音视频点播的核心实现流程可概括为 3 步：
1.  **转码切片**：用 FFmpeg 将普通音视频转为「M3U8 索引 + TS 切片」；
2.  **服务部署**：用 Web 服务器（Python/Nginx）提供 HLS 文件的 HTTP 访问（配置 MIME 类型）；
3.  **前端播放**：用 Video.js/hls.js 加载 M3U8 文件，实现边下边播。

以上步骤为完整可落地方案，测试环境可直接复用，生产环境只需补充 CDN、防盗链等优化即可。