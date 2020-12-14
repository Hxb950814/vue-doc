 # 先执行安装
 yarn

 # 再执行编译
 npm run build

 # 再将编译出来的文件拷贝到部署目录
 /bin/rm -rf _nuxt_publish
 mkdir _nuxt_publish
 cp -r .nuxt server static package.json nuxt.config.js node_modules _nuxt_publish

 #运行docker镜像（）
 docker run --name  nuxt-tk-test \
 -p 8996:80 \
 -e PORT=8996  \
 -e API_PATH=https://testm.tanxingk.com/api/  \
 -v $(pwd)/_nuxt_publish:/app \
 nuxt-ssr

 echo 'docker部署成功'
 echo '访问地址：https://testm.tanxingk.com'
