<template>
<div class="pageBox">
    <div class="hbb-invite-box">
        <div class="rule" @click="ruleState = true">
            活动规则
        </div>

            <div class="top">
                <img src="@assets/images/yqhaoyou.jpg" alt="">
                <div class="a">
                    <p>邀请奖学金</p>
                    <p>{{pageData.invitesetting.inviteMax | money}}</p>
                    <p>单人最高</p>
                </div>
                <div class="b">
                    每邀请1位新同学学习，最高可获得{{pageData && pageData.invitesetting.inviteMax | money}}元的奖学金
                </div>
            </div>
            <div class="hbb-main">
                <!-- 个人信息部分 -->
                <div class="box">
                    <h2>— 奖学金达人榜 —</h2>
                    <div class="title">
                        <div @click="goMyFriend">
                            <p v-if="pageData.info.userCount > 0">{{pageData.info && pageData.info.userCount}}</p>
                            <p>我的好友</p>
                        </div>
                        <div>
                            <p>{{pageData.info && pageData.info.sumMoney | money}}</p>
                            <p>我的奖金(元)</p>
                        </div>
                        <div>
                            <p>{{pageData.info && pageData.info.rownum}}</p>
                            <p>我的排名</p>
                        </div>
                    </div>
                    <div class="title title1">
                        <div>
                            <p class="z">名次</p>
                        </div>
                        <div>
                            <p class="z">获奖者</p>
                        </div>
                        <div>
                            <p class="z">奖学金</p>
                        </div>
                    </div>
                    <div class="groupBox">
                        <template v-if="pageData.list.length > 0">
                            <div class="group" v-for='(item,index) in pageData.list' :key="index">
                                <span>{{item.rownum}}</span>
                                <span>{{item.mobile}}</span>
                                <span>{{item.sumMoney | money}}</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="group" v-for='(item,index) in [1,2,3,4,5,6,7,8,9, 10]' :key="index">
                                <span>{{item}}</span>
                                <span>虚位以待</span>
                                <span></span>
                            </div>
                        </template>
                    </div>

                </div>
            </div>

        <div class="footer">
           <span @click="shareBtn">邀请海报</span><span @click="goInvite">邀请好友</span>
        </div>
        <van-dialog width="90%" v-model="ruleState">
            <div class="hbb-rule-con">
                <pre>{{pageData.invitesetting.description}}</pre>
            </div>
        </van-dialog>
        <div class="shareDiago" @click="shareModalState = false" v-if="shareModalState">
            <img src="@/assets/images/shareGuide.png" alt="">
        </div>
    </div>
    <!--  海报  -->
    <div id="info" ref="html2canvas">
        <img style="position:absolute;width: 100%;height: 100%" src="@assets/images/haibaobg.jpg" alt="">
        <div class="top">
            <img :src="head" alt="">
            <div>
                <h2>{{name}}</h2>
                <p>邀请你一起学习</p>
            </div>
        </div>
        <div class="bottom">
            <div class="a">
                限时特惠
            </div>
            <div class="b">
                {{pageData && pageData.courseTypeSection.discountPrice}}
            </div>
            <div class="c">
                元
            </div>
        </div>
        <div class="qrCode">
            <div id="qrcode"></div>
            <p>长按扫码 解锁学习</p>
        </div>
    </div>
    <div class="hbb-invite-modal">
        <van-popup v-model="canvasShow" style="width: 80%">
            <div class="hbb-canvas">
                <div class="tip" v-if="imgUrl">
                    长按图片，发送好友
                </div>
                <img :src="imgUrl" alt="">
            </div>
        </van-popup>
    </div>
</div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import html2canvas from "html2canvas"
    import { appweixin } from '@/utils/wechart.ts'
    import { PersonalModule } from '@/store/modules/user/personal.ts';
    import TopNav from "@components/nav/topNav.vue";
    import Footer from "@components/footer/index.vue";
    import {HomeModule} from "@/store/modules/user/home";
    import {setUserInfo} from "@/utils";
    import QRCode from 'qrcodejs2'

    @Component({components: {TopNav,Footer,QRCode}})
    export default class extends Vue {
        token = '';
        head = '';
        name = '';
        ruleState:boolean = false;
        shareModalState:boolean = false;
        pageData:any = {
            invitesetting: {
                inviteMax: 0,
                shareDesc:'',
                shareImg: '',
                shareTitle: ''
            },
            info: {
                rownum: 0,
                sumMoney: 0,
                userCount: 0
            },
            courseTypeSection: {
                discountPrice: 0
            },
            list: []
        };
        userId = 0;
        imgUrl = ''; // 生成海报的信息
        canvasShow:boolean = false; // 生成海报的弹层


        mounted() {
            this.token = HomeModule.getToken;
            if(!this.token){
                setUserInfo();
            } else {
                this.head = HomeModule.getHead;
                this.name = HomeModule.getNickName;
            }
            // 指定分享地址为小白课程的页面
            PersonalModule.getInviteMainInfo().then((res:any) => {
                this.pageData = res?.data;
                this.userId = res?.data.info ? res?.data.info.user_id : 0;
                let url = HomeModule.getUId ? res?.data.invitesetting.shareUrl + '&abcde=' + HomeModule.getUId : res?.data.invitesetting.shareUrl;
                this.useqrcode(url);
                appweixin.onMenuShare({
                    title: res?.data.invitesetting.shareTitle,
                    desc: res?.data.invitesetting.shareDesc,
                    link: url,
                    show: location.href,
                    imgUrl: res?.data.invitesetting.shareImg
                });
            })
        }

        useqrcode(url:any){
            let qrcode = new QRCode('qrcode', {
                width: 100,
                height: 100,
                text: url, // 二维码地址
            })
        }

        shareBtn(){
            this.canvasShow = true;
            let that = this;
            (window as any).pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            setTimeout(function() {
                html2canvas((that.$refs.html2canvas as any),{
                    backgroundColor: null,
                    scale:2,
                    //allowTaint: true,
                    useCORS: true
                }).then(canvas => {
                    // 生成图片地址
                    that.imgUrl = canvas.toDataURL("image/png");
                });
            }, 200);

        }

        goInvite() {
           this.shareModalState = true;
        }

        goMyFriend() {
            if(this.pageData.info.userCount === 0 ) {
                this.$toast('暂无好友')
                return false
            }
            this.$router.push({
                path: '/personal/myFriend'
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background:#ef2223;
    }
   .hbb-invite-box{
       display: flex;
       width: 100%;
       flex-direction: column;
       .top{
           display: flex;
           width: 100%;
           height: 1120px;
           position: relative;
           img{
               width: 100%;
               position: absolute;
               top: 0;
               left: 0;

           }
           .a{
               display: flex;
               width: 100%;
               position: absolute;
               z-index: 3;
               bottom: 260px;
               flex-direction: column;
               text-align: center;
               justify-content: center;
               p{
                      color: #ff2c27;
                   &:nth-of-type(1){
                       font-size: 40px;
                       font-weight: bold;
                   }
                   &:nth-of-type(2){
                       font-size: 88px;
                       font-weight: bold;
                       margin: 10px 0;
                   }
                   &:nth-of-type(3){
                       font-size: 26px;
                       color: #666;
                   }
               }
           }
           .b{
               display: flex;
               width: 100%;
               position: absolute;
               z-index: 3;
               bottom: 100px;
               flex-direction: column;
               text-align: center;
               justify-content: center;
               color: #fff;
               font-size: 24px;
               padding:0 85px;
               line-height: 44px;
           }
       }
       .hbb-main{
           display: flex;
           width: 100%;
           padding: 0 30px;
           background: #ef2223;
           position: relative;
           .box{
                display: flex;
                width: 100%;
                background: rgb(246, 47, 48);
                border-radius: 8px;
                padding: 24px;
                color: #fff;
                 margin-bottom: 130px;
                flex-direction: column;
                h2{
                   display: flex;
                    width: 100%;
                    justify-content: center;
                    font-size: 30px;
                    margin-bottom: 20px;
                }
                .title{
                   display: flex;
                    width: 100%;
                    height: 134px;
                    padding: 20px 0;
                    background: #ef2223;

                    div{
                        display: flex;
                        width: 33.333%;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        align-items: center;
                        p{
                            &:nth-of-type(1){
                                font-size: 36px;
                                font-weight: bold;
                            }
                            &:nth-of-type(2){
                                font-size: 26px;
                            }
                        }
                    }
                     &.title1{
                       background: rgba(255, 255, 255, 0.1);
                       padding:0; height: 64px;
                       margin-top: 20px;
                        .z{
                              font-size: 26px !important;
                        }

                    }
                }
                .groupBox{
                    display: flex;
                    width: 100%;
                    flex-direction: column;


                        .group{
                            display: flex;
                            width: 100%;
                            height: 72px;
                            justify-content: space-between;
                            align-content: center;
                            span{
                                display: flex;
                                width: 33.333%;
                                justify-content: center;
                                text-align: center;
                                align-items: center;
                            }
                        }
                    }
           }

       }
       .hbb-rule-con{
           display: flex;
           width: 100%;
           color: #666;
           min-height:100px;
           padding: 30px;
           pre{
               white-space:pre-wrap;
               white-space:-moz-pre-wrap;
               white-space:-o-pre-wrap;
               word-wrap:break-word;
               color: #666;
               font-size: 26px;
           }
       }

       .footer{
           position: fixed;
           width: 100%;
           height: 90px;
           padding: 0 30px;
           bottom: 0;
           display: flex;
           background: #ffdd56;
           color: rgb(255, 44, 39);
           font-size: 32px;
           span{
               display: flex;
               height: 90px;
               width: 100%;
                justify-content: center;
                align-items: center;
               &:nth-of-type(1){
                   border-right: 4px solid rgb(255, 44, 39);
               }
           }
       }
       .rule{
           position: fixed;
           width: 150px;
           height: 52px;
           background-color: rgb(255, 212, 86);
           top: 30px;
           right: 0;
            font-size: 26px;
            z-index: 9;
            display: flex;
            color: rgb(255, 44, 39);
            justify-content: center;
            align-items: center;
            border-radius: 30px 0px 0px 30px;
       }
   }
    .shareDiago{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 999;
        background-color: #000000b3;
        img{
            width: 300px;
            position: absolute;
            right: 80px;
            top: 80px;
        }
    }
    .hbb-canvas{
        display: flex;
        width:100%;
        justify-content: center;
        border-radius: 30px;
        margin:0 auto;
        position: relative;
        .tip{
            display: flex;
            width: 380px;
            background-color: #fb0;
            height: 64px;
            font-size: 28px;
            color: #fff;
            position: absolute;
            border-radius: 40px;
            align-items: center;
            justify-content: center;
            top: -90px
        }
        img{
            width: 100%;
            height: 950px;
            border-radius: 20px;
        }
    }
    .hbb-hai{
        display: flex;
        justify-content: center;
        padding: 60px 0;
        color: #fff;
        font-size: 30px;
    }
    #info{
        width: 100%;
        height: 1334px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        z-index:-1;
        position: fixed;
        top: 0;

        .top{
            display: flex;
            width: 100%;
            padding: 32px;
            align-items: center;
            position: relative;
            z-index: 4;
            img{
                width: 92px;
                height: 92px;
                border-radius: 50%;
                border: 4px solid #fff;
                margin-right: 30px;
            }
            h2{
                font-size: 32px;
                color: #fff;
            }
            p{
                font-size: 26px;
                color: #fff;
            }
        }
        .bottom{

            height: 138px;
            position: absolute;
            left: 50px;
            top: 1066px;
            background-color: #ff2a20;
            border-radius: 20px;
            padding: 0px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            color: #fff;
            div{
                font-weight: bold;
                &.a{
                    font-size: 36px;
                    width: 80px;
                }
                &.c{
                    margin-top: 40px;
                    margin-left: 5px;
                    font-size: 36px;
                }
                &.b{
                    font-size: 108px;
                }
            }
        }
        .qrCode{
            display: flex;
            width: 240px;
            position: absolute;
            flex-direction: column;
            right: 30px;
            bottom: 0;
            p{
                width: 100%;
                background: #fff;
                padding: 5px 0 10px 0;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
            }
            #qrcode{
                background: #fff;
                border-radius: 10px 10px 0 0;
                justify-content: center;
                display: flex;
                padding: 20px 0;
                img{
                    width: 100% !important;
                }
            }
        }
    }
</style>
