# nginx配置

本文件是项目nginx配置文件

```YAML

server
{
        listen 443 ;
        server_name  testm.tanxingk.com;
         
        # 省略*** 
         
        # 虚拟主机映射到nodejs服务 
        location ^~ / {
           add_header 'Access-Control-Allow-Origin' '*';
           proxy_pass http://127.0.0.1:8997/;
        }

        # 含/api/的请求代理 
        location ^~ /api/ {
           add_header 'Access-Control-Allow-Origin' '*';
           proxy_pass http://127.0.0.1:10000/;
        }

        # 含/tquote_api/的请求代理 
        location ^~ /tquote_api/ {
            add_header 'Access-Control-Allow-Origin' '*';
            proxy_pass http://127.0.0.1:10001/;
        }

      # 含/cquote_api/的请求代理 
        location ^~ /cquote_api/ {
            add_header 'Access-Control-Allow-Origin' '*';
            proxy_pass http://cquote.tanxingk.com/;
        }
}
```
