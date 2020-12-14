<template>
    <div>
        <tk-nav-bar>jsbridge测试</tk-nav-bar>
        <div class="container">
            <p style="text-align: center;padding-top: 10px">
                请在app webview中打开
            </p>
            <div class="button-blocks">
                <button class="theme-button" @click="clickInvoke">
                    获取app信息
                </button>
                <button class="theme-button" @click="clickInvoke">
                    跳转到
                </button>
            </div>
            <div class="desc" style="margin: 20px;background-color: #fff;padding: 10px">
                <p style="margin-bottom: 10px">
                    获取到cookie: {{ cookie }}
                </p>
                <p style="margin-bottom: 10px" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import JsBridge from '@common/src/utils/jsbridge';

    @Component({
    })
    export default class extends Vue {
        cookie = '';
        beforeCreate() {
        }

        created() {
        }

        mounted() {
           this.cookie = document.cookie;
        }

        clickInvoke() {
            JsBridge.getInstance().invoke('getAppInfo', '', (errCode: any, data: any) => {
                alert('调用getAppInfo成功 获得数据：，' + JSON.stringify(data));
            });
        }
    }
</script>

<style lang="scss" scoped>
    .button-blocks{
        margin: 10px 90px;
        .theme-button{
            margin-top: 10px;
        }
    }
</style>
