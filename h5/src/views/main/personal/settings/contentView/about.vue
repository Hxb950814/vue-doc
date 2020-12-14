<template>
    <div class="pageBox">
        <div class="box">
            <img src="@assets/images/cait.png" alt="">
            <div class="group">
                <span>用户服务协议</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div class="group">
                <span>隐私政策</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div class="group">
                <span>客服微信</span>
                <span>qiuzhicaitang</span>
            </div>
        </div>
        <p>客服服务时间：工作日9:00-18:30</p>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
    }
</script>

<style lang="scss" scoped>
.pageBox{
    background-color: #f6f6f6;
    .box{
        display: flex;
        width: 100%;
        background: #fff;
        flex-direction: column;
        img{
            width: 240px;
            height: 200px;
            margin: 100px auto;
        }
        .group{
            display: flex;
            width:100%;
            height: 100px;
            align-items: center;
            padding: 0 30px;
            border-top: 2px solid #eee;
            justify-content: space-between;
            color: #666;
            font-size: 30px;
            span{
                &:nth-of-type(2){
                    color: #0a8dff;
                }
            }
        }

    }
    p{
        display: flex;
        width: 100%;
        margin-top: 30px;
        justify-content: center;
        color: #999;
        font-size: 26px;
    }
}
</style>
