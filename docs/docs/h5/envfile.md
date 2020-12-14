# .env文件

本文件用于本地开发启动项目和服务器打包编译

```yaml
#项目运行的host和端口
HOST=0.0.0.0
PORT=8997

#以下部分正式环境不需要

#APP API接口代理地址
API_PATH = http://127.0.0.1:8009
#API 接口代理地址
TQUOTE_PATH = http://127.0.0.1:8080

#行情数据接口地址
CQUOTE_PATH = http://cquote.tanxingk.com
#行情数据ws地址
CQUOTE_WS_PATH = ws://cquote.tanxingk.com/api/ws

```
