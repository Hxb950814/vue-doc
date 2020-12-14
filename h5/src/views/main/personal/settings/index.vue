<template>
    <div class="pageBox">
        <div class="hbb-setting-top">
            <div @click="goPage(1)">
                <span><img src="@assets/images/s1.png" alt="" />个人信息</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div>
                <span><img src="@assets/images/s2.png" alt="" />微信登录</span>
<!--                <van-icon name="arrow" size="16" color="rgb(187, 187, 187)"/>-->
                <b>已绑定</b>
            </div>
            <div @click="goPage(3)">
                <span><img src="@assets/images/s3.png" alt="" />手机号</span>
                <p>
                    <b v-if="mobile">{{mobile}}</b>
                    <b v-else>绑定手机</b>
                    <van-icon v-if="!mobile" name="arrow" size="15" color="rgb(187, 187, 187)"/>
                </p>
            </div>
            <div @click="goPage(7)">
                <span><img src="@assets/images/address.png" alt="" />我的地址</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div @click="goPage(4)">
                <span><img src="@assets/images/s4.png" alt="" />关于软件</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div @click="goPage(5)">
                <span><img src="@assets/images/s5.png" alt="" />帮助中心</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
            <div @click="goPage(6)">
                <span><img src="@assets/images/s6.png" alt="" />意见反馈</span>
                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
            </div>
        </div>
<!--        <div class="hbb-footer">-->
<!--            <div class="hbb-vanbutton" @click="sureClick">-->
<!--               退出登录-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({})
    export default class extends Vue {
        wechatBind = 0;
        mobile = '';

        mounted() {
            this.mySetInfo();
        }

        mySetInfo() {
            PersonalModule.mySetInfo().then((res:any) => {
                this.wechatBind = res?.data.wechatBind;
                this.mobile = res?.data.mobile;
            })
        }

        goPage(t:number) {
            switch (t) {
                case 1:
                    this.$router.push({
                        path: '/personal/info'
                    })
                    break;
                case 3:
                    if(this.mobile) return false;
                    this.$router.push({
                        path: '/personal/phone'
                    })
                    break;
                case 4:
                    this.$router.push({
                        path: '/personal/about'
                    })
                    break;
                case 5:
                    this.$router.push({
                        path: '/personal/help'
                    })
                    break;
                case 6:
                    this.$toast('敬请期待');
                    return false;
                    this.$router.push({
                        path: '/personal/feedback'
                    })
                    break;
                case 7:
                    this.$router.push({
                        path: '/personal/address'
                    })
                    break;
                default:
                    break;
            }
        }

        sureClick() {
            // 退出登录
            this.$toast('正在退出...')
            HomeModule.setloginOut().then((res:any) => {
                localStorage.removeItem('vuexPersistedData');
                this.$toast('已退出');
                window.location.href='/personal';
            }).catch((err) => {
                localStorage.removeItem('vuexPersistedData');
                this.$toast('已退出');
                window.location.href='/personal';
            })
        }
    }
</script>

<style lang="scss" scoped>
.pageBox{
    background-color: #f6f6f6;
}
    .hbb-setting-top{
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        div{
            display: flex;
            width: 100%;
            height: 110px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 2px solid #eee;
            span{
                font-size: 30px;
                color:#333;
                display: flex;
                align-items: center;
                img{
                    width: 44px;
                    height: 44px;
                    margin-right: 20px;
                }
            }
            p{
                display: flex;
                align-items: center;
            }

            b{
                color: $color-gray;
                font-size: 26px;
            }
            &:nth-of-type(5){
                border-top: 30px solid #f6f6f6;
            }
        }
    }
.hbb-footer{
    display: flex;
    width: 100%;
    height: 120px;
    justify-content: center;
    border-top: 2px solid #eee;
    padding: 20px 0;
    .hbb-vanbutton{


        width: 80% !important;
        justify-content: center;
        align-items: center;
        font-size: 30px;

        color: #fff;

    }
}

</style>
