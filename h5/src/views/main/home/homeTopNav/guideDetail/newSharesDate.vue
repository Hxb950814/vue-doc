<template>
    <div class="hbb-guide-one">
        <div class="group" v-for="(item,index) in [1,2]" :key="index">
            <div :class="index === 0 ? 'y active' : 'y'">

            </div>
            <div class="top">
                <span>10月12日 星期一（今天）</span>
            </div>
            <div class="top1">
                <div class="t">
                    <b></b><span>申购</span>
                </div>
                <ul>
                    <li v-for="(ite,inde) in [1,2,3,4]" :key="inde">
                        <div class="t">
                            <div>
                                <b>沪</b>
                                <b>K</b>
                                <span>中谷物流 732565</span>
                            </div>
                        </div>
                        <div class="b">
                            <div>
                                <span>发行总价：5.58</span>
                            </div>
                            <div>
                                <span>发行量：5.58万</span>
                            </div>
                            <div>
                                <span>市盈率：5.58万</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

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
        padding: 0 30px;
        margin-top: 60px;
        .group{
            display: flex;
            width: 100%;
            flex-direction: column;
            border-left: 2px solid #eee;
            position: relative;
            .y{
                position: absolute;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                left: -12px;
                top: 6px;
                border:4px solid #ff2c27;
                background:#fff;
                &.active{
                    background: #ff2c27;
                }
            }
            .top{
                display: flex;
                width: 100%;
                height: 70px;
                color: #666;
                font-size: 28px;
                padding-left: 50px;
            }
            .top1{
                display: flex;
                width: 100%;
                flex-direction: column;
               .t{
                   display: flex;
                   align-items: center;
                   b{
                       display: flex;
                       width: 50px;
                       height: 2px;
                       background: #eee;
                   }
                   span{
                       display: flex;
                       height: 40px;
                       border-radius: 20px;
                       padding: 0 16px;
                       color: #ff4844;
                       background-color: #ffebeb

                   }
               }
                ul{
                    display: flex;
                    width: 100%;
                    flex-direction: column;
                    li{
                        padding: 24px 0 24px 50px;
                        .t{
                            display: flex;
                            width: 100%;
                            justify-content: space-between;
                            align-items: center;
                            div{
                                display: flex;
                                align-items: center;
                                span{
                                    background: none;
                                    color: #0a8dff;
                                    font-size: 26px;
                                    font-weight: bold;
                                }
                                b{
                                    display: flex;
                                    width: 30px;
                                    height: 30px;
                                    margin-right: 10px;
                                    justify-content: center;
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
                            margin-top: 10px;
                            div{
                                float: left;
                                display: flex;
                                justify-content: space-between;
                                height: 30px;
                                align-items: center;
                                width: 33.333%;
                                color: $color-gray;
                                font-size: 24px;
                                span{
                                    &:nth-of-type(2){
                                        color: #666;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    }
</style>
