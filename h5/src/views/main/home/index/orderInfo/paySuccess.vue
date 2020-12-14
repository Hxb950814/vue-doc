<template>
    <div class="hbb-pay-success">
        <img class="img" src="@/assets/images/banzhurenbg.png" alt="">
        <div class="group">
            <span>我的班级</span>
            <b>{{pageData.className}}</b>
        </div>
        <div class="group">
            <span>我的班主任</span>
            <b>{{pageData.name}}</b>
        </div>
        <div class="group">
            <span>班主任微信</span>
            <b @click="copyCon">{{pageData.wechatNo}} <div class="copy"></div></b>
        </div>
        <div class="wechartBox">
            <img :src="pageData.wechatCode" alt="">
            <p>长按二维码识别添加微信</p>
        </div>

        <div class="hbb-vanbutton">
            <van-button @click="goKonw">我知道了</van-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal.ts";

    @Component({})
    export default class extends Vue {
        weChartNumber = 'HB785135500';
        id:string = '';

        pageData:any = {
            name: '',
            className: '',
            wechatCode: '',
            wechatNo: ''
        }



        mounted() {
            this.id = String(this.$route.query.id)
            PersonalModule.getClassInfo(this.id).then((res:any) => {
                this.pageData.name = res?.data.name;
                this.pageData.className = res?.data.className;
                this.pageData.wechatCode = res?.data.wechatCode;
                this.pageData.wechatNo = res?.data.wechatNo;
            })
        }
        copyCon() {
            // 点击复制
            let that = this;
            this.$copyText(this.weChartNumber).then(function (e) {
                that.$toast('复制成功')
            }, function (e) {
                that.$toast('复制失败')
            })
        }

        goKonw() {
            // 进入求知页面
            this.$router.push({
                path: '/knowledge'
            })
        }
    }
</script>

<style lang="scss" scoped>
.hbb-pay-success{
    display: flex;
    flex-direction: column;
    width: 100%;
    .img{
        width: 100%;
    }
    .group{
        display: flex;
        width: 100%;
        height: 100px;
        background: #fff;
        padding: 0 30px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #ddd;
        span{
            color: #333;
            font-size: 30px;
        }
        b{
            color: #0a8dff;
            font-size: 26px;
            display: flex;
            align-items: center;
            .copy{
                width: 30px;
                height: 30px;
                background-color: #0a8dff;
                margin-left: 10px;
                -webkit-mask: url(../../../../../assets/images/copy.svg) center center / contain no-repeat;
            }
        }
    }
    .wechartBox{
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        text-align: center;
        margin: 40px 0;
        *{
            width: 400px;
            margin: 10px auto;
            color: $color-gray;
            font-size: 26px;
        }
    }
}
</style>
