# RTMP 推流完整实现流程（从原理到落地，分步详解）
RTMP 推流是将**采集到的音视频数据封装为 RTMP 格式，通过网络推送到流媒体服务器/CDN**的过程，核心用于直播、实时监控等场景。下面按「核心流程总览」→「分步落地实现」→「关键配置&避坑」的逻辑，完整拆解 RTMP 推流实现。

## 一、 RTMP 推流核心总流程
整个推流链路分为「数据采集 → 编码封装 → 协议传输 → 服务器接收」4 个核心阶段，链路如下：
```
音视频采集设备（摄像头/麦克风/桌面）
    ↓（采集原始数据：YUV 视频 + PCM 音频）
音视频编码（压缩数据：H.264 视频 + AAC 音频）
    ↓（封装为 RTMP 消息格式）
RTMP 协议传输（基于 TCP 可靠传输，建立 3 次握手连接）
    ↓（服务器接收并存储/转发）
RTMP 流媒体服务器/CDN（nginx-rtmp/SRS/阿里云直播等）
```

## 二、 分步落地实现（2 种方案：快速测试方案 + 生产级方案）
### 方案1：快速测试方案（无需开发，用现成工具实现，5 分钟上手）
该方案使用「OBS Studio（推流工具）+ nginx-rtmp（简易服务器）」，无需编写代码，快速验证 RTMP 推流链路。

#### 步骤1：部署 RTMP 流媒体服务器（nginx-rtmp）
nginx-rtmp 是轻量级 RTMP 服务器，适合本地/内网测试，以 Windows 为例：
1.  **下载 nginx-rtmp**：下载已集成 rtmp 模块的打包版本（无需手动编译），地址：https://github.com/arut/nginx-rtmp-module/releases
2.  **修改配置文件**：打开 nginx 安装目录下的 `conf/nginx.conf`，添加 RTMP 核心配置（末尾追加/替换）：
    ```nginx
    # RTMP 服务核心配置
    rtmp {
        server {
            listen 1935; # RTMP 协议默认端口，不可随意修改（除非服务器防火墙开放对应端口）
            chunk_size 4096; # 数据块大小，默认 4096 即可

            # 直播应用名称（自定义，推流时需对应该名称）
            application live {
                live on; # 开启直播模式
                record off; # 关闭视频录制（测试场景无需保存）
                allow publish all; # 允许所有 IP 地址推流（测试场景放开限制）
                allow play all; # 允许所有 IP 地址拉流（测试场景放开限制）
            }
        }
    }

    # 可选：HTTP 服务（用于查看服务器状态，验证是否启动成功）
    http {
        include       mime.types;
        default_type  application/octet-stream;
        sendfile        on;
        keepalive_timeout  65;

        server {
            listen       8080;
            server_name  localhost;

            # 查看 RTMP 服务器状态
            location /stat {
                rtmp_stat all;
                rtmp_stat_stylesheet stat.xsl;
            }
            location /stat.xsl {
                root html; # 指向 nginx 的 html 目录
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }
        }
    }
    ```
3.  **启动 nginx 服务器**：
    - 双击 nginx 安装目录下的 `nginx.exe`（无弹窗，后台运行）
    - 验证启动：访问 `http://localhost:8080/stat`，若能看到 RTMP 状态页面，说明服务器启动成功
    - 常用命令：停止 `nginx -s stop`、重启 `nginx -s reload`

#### 步骤2：使用 OBS Studio 实现 RTMP 推流（采集+推流一体化）
OBS Studio 是免费开源的音视频采集/推流工具，支持桌面/摄像头采集，步骤如下：
1.  **下载安装 OBS**：官网 https://obsproject.com/，根据系统下载对应版本（Windows/Mac/Linux）
2.  **添加音视频采集源**（获取原始音视频数据）：
    - 打开 OBS，点击「来源」面板的「+」号
    - 视频源：选择「显示器捕获」（采集整个桌面）或「视频捕获设备」（采集摄像头画面），按需配置分辨率/帧率
    - 音频源：默认关联系统麦克风/扬声器，若需调整，点击「音频」面板配置
3.  **配置 RTMP 推流参数**（核心步骤）：
    - 点击 OBS 顶部「设置」→ 左侧「推流」
    - 推流类型：选择「自定义」
    - 服务器地址：格式 `rtmp://[服务器IP]:1935/[应用名称]`
      - 本地测试：`rtmp://localhost:1935/live`（对应 nginx 配置的 `application live`）
      - 内网其他设备推流：替换为服务器内网 IP，如 `rtmp://192.168.1.100:1935/live`
    - 串流密钥：自定义字符串（如 `my_test_stream_001`，用于服务器区分不同推流，拉流时需对应）
4.  **启动 RTMP 推流**：
    - 点击 OBS 主界面「开始推流」按钮，底部状态栏显示「推流中」+ 上传带宽，说明推流成功
    - 验证推流：访问 `http://localhost:8080/stat`，可看到当前推流的流名称、带宽等信息

### 方案2：生产级方案（代码开发，移动端/桌面端 SDK 推流）
在企业级应用中（如直播 APP、在线教育平台），需通过 SDK 开发自定义推流功能，下面以「腾讯云直播 SDK（Android）」为例，讲解代码级 RTMP 推流实现（iOS/前端逻辑类似）。

#### 步骤1：集成直播 SDK（获取 RTMP 推流能力）
1.  **添加依赖**：在 Android 项目 `build.gradle` 中添加腾讯云 SDK 依赖
    ```gradle
    // 腾讯云直播推流 SDK
    implementation 'com.tencent.liteav:LiteAVSDK_Pusher:11.6.0'
    ```
2.  **配置权限**：在 `AndroidManifest.xml` 中添加音视频采集/网络权限
    ```xml
    <!-- 网络权限（RTMP 基于 TCP 传输） -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <!-- 音视频采集权限 -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <!-- 存储权限（可选，用于缓存） -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    ```

#### 步骤2：初始化推流实例（配置基础参数）
```java
import com.tencent.liteav.txlivepush.TXLivePushConfig;
import com.tencent.liteav.txlivepush.TXLivePusher;
import android.content.Context;

public class RtmpPusherManager {
    private TXLivePusher mLivePusher;
    private TXLivePushConfig mPushConfig;

    // 初始化推流实例
    public void initPusher(Context context) {
        // 1. 创建推流配置对象
        mPushConfig = new TXLivePushConfig();
        mPushConfig.setVideoResolution(1280, 720); // 推流分辨率 720P
        mPushConfig.setVideoFPS(30); // 视频帧率 30fps
        mPushConfig.setVideoBitrate(1500); // 视频码率 1500kbps
        mPushConfig.setAudioBitrate(128); // 音频码率 128kbps

        // 2. 创建推流实例并绑定配置
        mLivePusher = new TXLivePusher(context);
        mLivePusher.setConfig(mPushConfig);

        // 3. 绑定预览视图（显示摄像头采集画面）
        // SurfaceView/TextureView 需在布局中定义
        // mLivePusher.setPreviewView(mSurfaceView);
    }
}
```

#### 步骤3：获取 RTMP 推流地址（从业务服务器/CDN 获取）
生产环境中，RTMP 推流地址不直接硬编码，需从业务服务器或云 CDN 申请（带鉴权信息，防止恶意推流），格式如下：
```java
// 腾讯云 RTMP 推流地址示例（带 txSecret 鉴权）
String rtmpPushUrl = "rtmp://xxxx.livepush.myqcloud.com/live/xxxx?txSecret=xxxx&txTime=xxxx";
// 自建 SRS/nginx-rtmp 服务器推流地址示例
String rtmpPushUrl = "rtmp://120.xx.xx.xx:1935/live/enterprise_stream_001";
```

#### 步骤4：启动/停止 RTMP 推流（核心 API 调用）
```java
// 启动 RTMP 推流
public int startRtmpPush(String rtmpUrl) {
    if (mLivePusher == null) {
        return -1;
    }
    // 调用 SDK 核心 API，启动 RTMP 推流
    int ret = mLivePusher.startPush(rtmpUrl);
    if (ret == 0) {
        // 推流启动成功
        Log.d("RTMP_PUSHER", "RTMP 推流启动成功，推流地址：" + rtmpUrl);
    } else {
        // 推流启动失败（常见原因：地址无效、网络异常、权限未授予）
        Log.e("RTMP_PUSHER", "RTMP 推流启动失败，错误码：" + ret);
    }
    return ret;
}

// 停止 RTMP 推流
public void stopRtmpPush() {
    if (mLivePusher != null) {
        mLivePusher.stopPush();
        Log.d("RTMP_PUSHER", "RTMP 推流停止");
    }
}

// 释放推流资源（页面销毁时调用）
public void releasePusher() {
    if (mLivePusher != null) {
        mLivePusher.stopPush();
        mLivePusher.release();
        mLivePusher = null;
    }
}
```

## 三、 RTMP 推流关键配置&避坑指南
1.  **推流地址格式（必须严格遵守）**
    核心格式：`rtmp://[服务器IP/域名]:[端口]/[应用名称]/[串流密钥]`
    - 示例：`rtmp://192.168.1.100:1935/live/my_stream_001`
    - 说明：端口默认 1935（若修改，推流/服务器需保持一致）；应用名称对应服务器配置（如 nginx 的 `application live`）；串流密钥用于区分不同推流。

2.  **音视频编码配置（影响推流质量）**
    - 视频编码：优先 H.264（RTMP 标准编码，兼容性最好），分辨率/帧率/码率按需配置（720P/30fps/1500kbps 为平衡画质和带宽的默认配置）
    - 音频编码：优先 AAC（压缩率高，音质好），采样率 44100Hz，码率 128kbps 足够

3.  **网络相关避坑**
    - RTMP 基于 TCP 传输，需确保推流端与服务器网络互通（开放 1935 端口，防火墙/安全组需放行）
    - 弱网场景：开启 SDK 的「弱网自适应」功能（自动调整码率/帧率，避免推流中断）
    - 鉴权问题：生产环境推流地址需带鉴权参数（如腾讯云的 txSecret），否则服务器会拒绝推流

4.  **常见推流失败原因排查**
    - 错误1：「服务器连接失败」→ 排查服务器地址是否正确、服务器是否启动、网络是否互通、端口是否开放
    - 错误2：「权限不足」→ 排查摄像头/麦克风/网络权限是否授予（Android 6.0+ 需动态申请权限）
    - 错误3：「推流被拒绝」→ 排查服务器配置（是否开启 `allow publish all`）、推流地址鉴权是否有效
    - 错误4：「画面/声音异常」→ 排查采集源是否正常、编码配置是否兼容、SDK 预览视图是否绑定

## 四、 RTMP 推流典型应用场景
1.  **直播带货**：主播通过 OBS/移动端 SDK 推流（RTMP）到电商平台 CDN，观众拉流观看
2.  **在线教育**：老师端采集课堂画面/课件，通过 RTMP 推流到教育平台服务器，学生端实时观看
3.  **安防监控**：摄像头/硬盘录像机（NVR）采集监控画面，通过 RTMP 推流到后端平台，实现远程实时查看
4.  **游戏直播**：主播采集游戏画面/语音，通过 RTMP 推流到斗鱼/虎牙等平台，平台转码后分发给观众

### 总结
1.  RTMP 推流核心四阶段：「采集 → 编码 → 封装 → 传输」，依赖 TCP 可靠连接和 H.264/AAC 编码
2.  快速测试：使用 OBS + nginx-rtmp，无需代码，5 分钟搭建完整推流链路
3.  生产开发：使用云 SDK（腾讯云/阿里云）或自建 SDK，核心步骤为「集成 SDK → 初始化配置 → 获取推流地址 → 调用 startPush API」
4.  关键避坑：严格遵守推流地址格式、开放 1935 端口、配置正确编码参数、解决权限/鉴权问题