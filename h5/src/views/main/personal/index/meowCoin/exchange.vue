<template>
    <div class="hbb-exchange-page">

        <div class="a ac" v-if="pageData.goodsImage">
            <img :src="pageData.goodsImage" alt="">
        </div>
        <div v-else>
            <template v-if="pageData.goodsType == 1">
                <div class="a ab">
                </div>
            </template>
            <template v-if="pageData.goodsType == 0">
                <div class="a aa">
                    <p><span>{{pageData.amount | money}}</span>元</p>
                    <p style="display: flex;align-items: center">
                        <span class="line"></span>
                        <b>优惠券</b>
                        <span class="line"></span>
                    </p>
                </div>
            </template>
        </div>


        <div class="b">
            <p>{{pageData.goodsName}}</p>
            <div class="b-b">
                <div class="b-b-l">
                    <b></b>
                    <span>{{pageData.goodsScore}}</span>
                </div>
                <div>
                    剩余：<b>{{pageData.goodsRemain}}</b>
                </div>
            </div>
        </div>
        <div class="c" v-if="pageData.goodsType === 0">
            <p>适用课程：</p>{{pageData.courseTypeName}}
        </div>
        <div class="f" v-if="pageData.goodsType === 1" @click="goPage">
            <div class="l">
                <b></b>
                <div v-if="pageData.name">
                    <h2>{{pageData.name}} <small>{{pageData.mobile}}</small></h2>
                    <p>{{pageData.addressDetail}}</p>
                </div>
                <div v-else style="text-align: right">
                    去添加
                </div>
            </div>
            <div class="r">
                <van-icon name="arrow" color="#ccc" size="15" style="top: 40%"/>
            </div>
        </div>
        <div class="d">
            <h2>兑换规则</h2>
            <div class="con">
                <pre>{{pageData.description}}</pre>
            </div>
        </div>
        <div class="e"  @click="sureClick">
            立即兑换
        </div>

        <van-dialog v-model="show" :showConfirmButton="false">
            <div class="hbb-dui-box">
                <img src="@assets/images/d-succes.png" alt="">
                <h2>您已成功兑换</h2>
                <p>{{pageData.goodsName}}</p>
                <b @click="goToUse">{{title}}</b>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { PersonalModule } from '@/store/modules/user/personal.ts';
    @Component({})
    export default class extends Vue {
        id:string = '';
        show:boolean = false; // 立即兑换弹层 是否启动
        pageData:any = {
            goodsImage: '', // 商品小图
            goodsName: '', // 商品名称
            amount: 0, // 优惠金额
            goodsRemain: 0, // 剩余数量
            goodsScore: 0, // 商品积分
            courseTypeName: '', // 使用课程
            description: '', // 兑换规则
            name: '', // 收货人姓名
            goodsType: 0, // 优惠券类型
            addressDetail: '', // 收货人地址
            addressId: 0,
            courseTypeId: 0, // 课程id
            mobile: '', // 收货人手机号
        };
        obj:any = null;
        title = '去使用';

        mounted() {
            this.id = String(this.$route.query.id);
            this.goodsDetail();
        }

        goPage() {
            if(this.pageData.name) {
                this.$router.push({
                    path: '/personal/address',
                    query: {
                        did: this.id,
                        page: 'exchange_mode'
                    }
                })
            } else {
                this.$router.push({
                    path: '/personal/editAddress',
                    query: {
                        did: this.id,
                        id: '0',
                        page: 'exchange_mode'
                    }
                })
            }

        }

        goodsDetail() {
            let requestObj = {
                goodsId: this.id
            };
            PersonalModule.goodsDetail(requestObj).then((res:any) => {
                console.log(res)
                this.pageData.goodsImage = res?.data?.goods?.goodsImage || '';
                this.pageData.goodsName = res?.data?.goods?.goodsName || '';
                this.pageData.goodsRemain = res?.data?.goods?.goodsRemain || 0;
                this.pageData.goodsType = res?.data?.goods?.goodsType || 0;
                this.pageData.goodsScore = res?.data?.goods?.goodsScore || '';
                this.pageData.description = res?.data?.goods?.description || '';
                this.pageData.courseTypeName = res?.data?.goods?.courseTypeName || '';
                this.pageData.amount = res?.data?.goods?.amount || 0;
                this.pageData.name = res?.data?.address?.name || '';
                this.pageData.courseTypeId = res?.data?.courseTypeId || 0;
                this.title = res?.data?.goods?.goodsType === 1 ? '我知道了' : '去使用';
                this.pageData.addressDetail = res?.data?.address?.addressDetail || '';
                this.pageData.addressId = res?.data?.address?.addressId || 0;
                this.pageData.mobile = res?.data?.address?.mobile || '';
                this.obj = localStorage.getItem('shopObj');
                if(this.obj) {
                    let obj = JSON.parse(this.obj);
                    this.pageData.name = obj?.name || '';
                    this.pageData.addressDetail = obj?.addressDetail || '';
                    this.pageData.mobile = obj?.mobile || '';
                }
            });
        }

        sureClick() {
            this.$showLoading();
            let addressId = this.obj ? JSON.parse(this.obj).addressId : this.pageData.addressId;
            let requestObj = {
                addressId: this.pageData.goodsType === 1 ? addressId : 0,
                goodsCount: 1,
                goodsId: this.id
            }
            PersonalModule.buyGoods(requestObj).then((res:any) => {
                this.show = true;
            })
            this.$closeLoading();
        }

        goToUse() {
            if(this.pageData.goodsType === 1) {
                location.reload();
            } else {
                this.$router.push({
                    path: '/home/curriculum',
                    query: {
                        id: this.pageData.courseTypeId
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-exchange-page{
        padding: 60px 30px 0px;
        display: flex;
        flex-direction: column;
        .a{
            display: flex;
            width: 330px;
            height: 330px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 30px auto;
            font-size: 22px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            &.aa{
                background-image: url(../../../../../assets/images/shopyhqbg.jpg);
            }
            &.ac{
                background-image:none;
            }
            &.ab{
                background-image: url(../../../../../assets/images/shopdefault.png);
            }
            img{
                width: 100%;
                height: 100%;
            }
            span{
                font-weight: bold;
                font-size: 72px;
                color: #844a30;
                &.line{
                    display: flex;
                    width: 24px;
                    height: 2px;
                    background: #844a30;
                }
            }
        }
        .b{
            display: flex;
            width: 100%;
            justify-content: center;
            font-size: 28px;
            padding: 15px;
            color: rgb(102, 102, 102);
            flex-direction: column;
            p{
                color:#333;
                font-size: 30px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .b-b{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                .b-b-l{
                    display: flex;
                    color: #ff2c27;
                    font-size: 26px;
                    b{
                        display: flex;
                        width: 24px;
                        margin-right: 10px;
                        height: 24px;
                        background-color: #ff2c27;
                        -webkit-mask: url(../../../../../assets/images/shopv.svg) center center / contain no-repeat;
                    }

                }
            }
        }
        .c{
            display: flex;
            width: 100%;
            height: 80px;
            background-color: #fff3f3;
            border-radius: 8px;
            margin-top: 30px;
            align-items: center;
            padding-left: 20px;
            font-size: 26px;
            color: #333;
            p{
                color: #999;
            }
        }
        .d{
            display: flex;
            width: 100%;
            flex-direction: column;
            margin-top: 30px;
            margin-bottom: 90px;
            h2{
                font-size: 32px;
                color: #333;
            }
            font-size: 28px;
            color: #595959;
            .con{
                margin-top: 30px;
                display: flex;
                width: 100%;
                font-size: 28px;
                color: #666;
                pre{
                    white-space:pre-wrap;
                    white-space:-moz-pre-wrap;
                    white-space:-o-pre-wrap;
                    word-wrap:break-word;
                    color: #666;
                }
            }
        }
        .e{
            display: flex;
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            margin: auto;
            width: 600px;
            height: 80px;
            justify-content: center;
            font-size: 30px;
            color: #fff;
            align-items: center;
            border-radius: 50px;
            background: linear-gradient(to right, #ff7a8a 0%, #ff5a62 100%);
        }
        .f{
            display: flex;
            width: 100%;
            background: #f6f6f6;
            padding: 16px 20px 16px 20px;
            border-radius: 8px;
            justify-content: space-between;
            align-items: center;
            .l{
                display: flex;
                width: 90%;
                align-items: center;
                div{
                    width: 556px;
                    color: #999;
                    font-size: 24px;
                }
            }
            h2{
                font-size: 28px;
                color: #333;
                small{
                    font-size: 26px;
                    color: #666;
                    margin-left: 20px;
                }
            }
            b{
                display: flex;
                width: 30px;
                margin-right: 20px;
                height: 30px;
                background-color: #bbb;
                -webkit-mask: url(../../../../../assets/images/address.svg) center center / contain no-repeat;
            }
            p{
                width: 500px;
                font-size: 24px;
                color: #999;
                margin-top: 10px;
                @include ellipsis(1);
            }
        }
        .hbb-dui-box{
            display: flex;
            width: 100%;
            padding:60px 30px;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            img{
                width: 140px;
            }
            h2{
                margin-top: 40px;
                font-size: 32px;
                color: #333;
            }
            p{
                margin-top: 10px;
                font-size: 30px;
                color: #333;
            }
            b{
                background-color: #ffb243;
                border-radius: 50px;
                margin-top: 30px;
                width: 300px;
                height: 75px;
                font-size: 30px;
                text-align: center;
                line-height: 75px;
                color: #fff;
            }
        }

    }
</style>
