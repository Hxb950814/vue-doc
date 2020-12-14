# 弹性K线-h5

> 一个期货策略交易平台

## 启动步骤
注：由于官方推荐使用yarn，本项目采用yarn，确保你已经安装了yarn，使用npm安装可能无法正常运行。
```bash
#先全局安装yarn
npm i -g yarn

#然后在项目根目录执行
yarn
```

项目脚本

``` bash
# 安装依赖
$ yarn #请确保使用yarn安装依赖，而不是npm

# 开发模式启动
$ yarn dev

# 编译后启动
$ yarn build
$ yarn start

# 生成静态站点代码
$ yarn generate
```

- 启动之前准备事项

根目录创建.env文件，写入如下字段
```
#项目运行的host和端口
HOST=0.0.0.0
PORT=8997
#APP API接口代理地址
API_PATH = http://127.0.0.1:8009

#API 接口代理地址
TQUOTE_PATH = http://127.0.0.1:8080

#行情数据接口地址
CQUOTE_PATH = http://cquote.tanxingk.com
#行情数据ws地址
CQUOTE_WS_PATH = ws://cquote.tanxingk.com/api/ws

```
否则启动报错

docker命令

```yaml
#查看docker镜像
docker images

#删除镜像
docker rmi IMAGE
```
  
