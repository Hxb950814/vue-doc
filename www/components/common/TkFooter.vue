<template>
    <footer class="tk-footer">
        <div class="content">
            <div class="top-wrapper">
                <div class="left">
                    <div class="column">
                        <div class="title">
                            关于
                        </div>
                        <a class="item">关于我们</a>
                        <a class="item">联系我们</a>
                        <a class="item">加入我们</a>
                    </div>
                    <div class="column">
                        <div class="title">
                            帮助
                        </div>
                        <a class="item">新手指引</a>
                        <a class="item">常见问题</a>
                    </div>
                    <div class="column">
                        <div class="title">
                            关注
                        </div>
                        <a class="item">官方微博</a>
                        <a class="item">官方知乎</a>
                    </div>
                </div>
                <div class="right">
                    <div class="union">
                        <img src="//rs.tanxingk.com/images/tk_wx_ding.jpg" alt="">
                        <p>订阅号</p>
                    </div>
                    <div class="union">
                        <img src="//rs.tanxingk.com/images/tk_wx_serve.jpg" alt="">
                        <p>服务号</p>
                    </div>
                    <div class="union">
                        <img src="//rs.tanxingk.com/images/tk_app_serve.png" alt="">
                        <p>APP</p>
                    </div>
                </div>
            </div>
            <section>
                <p class="crop-info">
                    Copyright © 2007-2020 CITIC Futures Co., Ltd. All Rights Reserved
                </p>
                <p class="crop-info">
                    武汉富水数据技术有限公司 版权所有 粤ICP备14051234号
                </p>
            </section>
        </div>
    </footer>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({
        asyncData() {
            return {
            };
        }
    })
    export default class TkFooter extends Vue {

    }
</script>

<style>
</style>
