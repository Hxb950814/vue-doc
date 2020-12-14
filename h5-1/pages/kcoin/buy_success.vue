<template>
    <div>
        <tk-nav-bar>支付成功</tk-nav-bar>
        <div class="container">
            <img src="https://rs.tanxingk.com/images/check_mark.png" alt="" class="icon">
            <p class="text">
                支付成功
            </p>
            <div class="button-wrap">
                <button class="theme-button" @click="clickBack">
                    返回
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {isDesktop} from '@common/src/utils/browser';
    import {getAsync, postAsync} from '@/utils/request';
    @Component({
        middleware: 'auth'
    })
    export default class extends Vue {
        clickBack() {
            history.go(-1);
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        text-align: center;
    }
    .icon{
        width: 150px;
        height: 150px;
        margin-top: 50px;
        margin-bottom:20px;
    }
    .text{
        font-size: 25px;
        color: #333;
    }
    .button-wrap{
        margin: 0 70px;
    }
</style>
