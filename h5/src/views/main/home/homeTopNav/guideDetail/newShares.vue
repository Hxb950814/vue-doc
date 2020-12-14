<template>
    <div class="hbb-guide-one">
        <div class="group" v-for="(item,index) in [1,2,3,4]" :key="index">
            <div class="top">
                <span>10月12日 星期一（今天）</span>
                <span>当日可申购时间 8:15-15:00</span>
            </div>
            <ul>
                <li v-for="(ite,inde) in [1,2,3,4]" :key="inde">
                    <div class="t">
                        <div>
                            <b>沪</b>
                            <b>K</b>
                            <span>中谷物流 732565</span>
                        </div>
                        <div>
                            具体申购额度请查看自己的额度
                            <van-icon style="margin-top: 2px" name="arrow" size="11" color="#ccc"/>
                        </div>
                    </div>
                    <div class="b">
                        <div>
                            <span>发行总价</span>
                            <span>5.58</span>
                        </div>
                        <div>
                            <span>市盈率</span>
                            <span>53.58</span>
                        </div>
                        <div>
                            <span>发行总数</span>
                            <span>5.58万</span>
                        </div>
                        <div>
                            <span>申购上限</span>
                            <span>5万</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
    }
</script>

<style lang="scss" scoped>
.hbb-guide-one{
    display: flex;
    width: 100%;
    flex-direction: column;
    .group{
        display: flex;
        width: 100%;
        flex-direction: column;
        border-bottom: 2px solid #eee;
        .top{
            display: flex;
            width: 100%;
            padding: 0 30px;
            justify-content: space-between;
            align-items: center;
            height: 70px;
            background: #f6f6f6;
            color: #666;
            font-size: 24px;
        }
        ul{
            display: flex;
            width: 100%;
            flex-direction: column;
            li{
                border-bottom: 2px solid #eee;
                padding: 24px 30px;
                .t{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    div{
                        display: flex;
                        align-items: center;
                        b{

                            width: 30px;
                            height: 30px;
                            margin-right: 10px;
                            text-align: center;
                            font-weight: normal;
                            font-size: 20px;
                            &:nth-of-type(1){
                                background: #ff2c27;
                                color: #fff;
                            }
                            &:nth-of-type(2){
                                border:2px solid  #ff2c27;
                                color: #ff2c27;
                            }
                        }
                        &:nth-of-type(2){
                            color: $color-ff9600;
                            font-size: 24px;

                        }
                    }
                }
                .b{
                    width: 100%;
                    margin-top: 30px;
                    div{
                        float: left;
                        display: flex;
                        justify-content: space-between;
                        height: 50px;
                        align-items: center;
                        width: 50%;
                        padding-right:30px;
                        color: $color-gray;
                        font-size: 24px;
                        span{
                            &:nth-of-type(2){
                                color: #666;
                            }
                        }
                        &:nth-of-type(2n){
                            padding-right: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>
