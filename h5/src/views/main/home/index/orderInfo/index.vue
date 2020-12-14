<template>
    <div class="hbb-order-info">
        <h2 class="title">订单信息</h2>
        <div class="content">
            <div class="top">
                <img :src="pageData.courseImgUrl" alt="">
                <div class="right">
                    <h2 class="ellipsis">{{pageData.courseName}}</h2>
                    <p class="ellipsis">{{pageData.courseDescribe}}</p>
                    <div class="tab" style="margin-top: 10px">
                        <span v-if="pageData.label1">{{pageData.label1}}</span>
                        <span v-if="pageData.label2">{{pageData.label2}}</span>
                        <span v-if="pageData.label3">{{pageData.label3}}</span>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <span>课程金额</span>
                <span>¥{{pageData.discountPrice | money}}</span>
            </div>
            <div class="coupons bottom" @click="couponModal">
                <span>优惠券</span>
                <span style="display: flex;align-items: center">
                    <b :class="couponsText ? 'hbb-b hbb-bA': 'hbb-b'">{{couponsText ? '已减' + couponsText + '元': '未选择优惠券' }}</b>
                    <van-icon style="margin-right:0;" name="arrow" color="#ccc" />
                </span>
            </div>
            <div  class="payMethods">
                <h2>支付方式</h2>
                <div class="group" v-for="(item,index) in payMethodsList" :key="index" @click="onPlayChange(item)">
                    <span>
                        <img :src="item.passagewayImage" alt="">
                        {{item.passagewayName}}支付
                    </span>
                    <span :class="payMethodsIndex === item.passagewaySetId ? 'active': ''" >
                        <van-icon v-if="payMethodsIndex === item.passagewaySetId" name="success" color="#fff" />
                    </span>
                </div>
            </div>
            <p class="hbb-tip">
                购买的课程为线上课程内容服务，基于在线内容的特殊性及产品的完整性，购买使用全部或部分内容后不支持退款、转让，望您知悉理解！
            </p>
        </div>
        <!-- 购买底部 -->
        <div class="hbb-buy-footer">
              <div class="x">
                  <van-checkbox style="width: auto;" icon-size="15px" class="hbb-fff" focus="false" v-model="checked" shape="square">我已阅读并同意

                  </van-checkbox>
                  <span class="xieyi-con" @click="xieyiShow = true">《知识付费产品服务协议》</span>
              </div>
            <div class='buy'>
                <span>实付：<b>¥ {{lastPrice | money}}</b></span>
                <van-button color="#FFA400" @click="surePay">确认支付</van-button>
            </div>
        </div>

        <van-dialog width="90%" v-model="xieyiShow" title="知识付费产品服务协议" :showConfirmButton="false" :closeOnClickOverlay="true">
            <div class="xieyi-com">
                <span @click="xieyiShow = false" style="position: absolute;top: -32px;right: 10px;">
                    <van-icon name="cross" size="15" />
                </span>
                <p>特别提示：</p>
                <p>上海崇卓信息技术有限公司（以下简称“本公司”）依据本协议的规定为在本公司相关页面购买、使用课程并注册为求知财堂的用户（以下简称“用户”或“您”）提供服务。本公司提醒您在注册成为求知财堂的用户之前，请认真阅读本《服务协议》（以下简称“协议”）。用户相关的权利义务将在本协议中进行约定，请您务必审慎阅读，确保充分理解本协议中各条款内容。用户应具有完全民事行为能力，本公司不向无民事行为能力人或限制行为能力人提供服务。如您对本协议有任何疑问的，应向本公司客服人员进行咨询（关注“求知财堂服务号“公众号进行咨询即可）。</p>
                <p>除非您接受本协议所有条款，否则请勿购买、使用或注册。您的购买、使用、注册等行为将视为对本协议的充分理解，并同意接受本协议各项条款的约束，包括免除和限制责任的条款、争议解决和法律适用条款等。用户不应以未阅读本协议的内容等理由主张本协议无效，或要求撤销本协议。在本协议履行过程中，可由本公司根据实际情况对本协议的相关条款进行不时修改或变更，一旦协议内容修改或变更，本公司将随时进行更新。更新后的协议一旦公布即代替原有协议，请您及时关注协议变更情况。若用户在协议变更后继续使用本公司服务的，视为用户已充分阅读、理解并接受修改后的协议内容；若用户不接受修改后的协议内容，请用户立即停止使用本服务。</p>
                <h3> 一、知识付费功能的开通、中止和终止</h3>
                <p>1、付费产品具体价格以订购页面展示为准。</p>
                <p>2、用户同意本协议并按本协议约定支付服务费以后，本服务即订购成功。一旦订购成功，用户即可开始使用本服务。</p>
                <p>3、用户在订购本产品功能时应当慎重考虑，用户一旦订购本服务支付服务费，本公司不因本协议的中止、终止或用户单方面而退出将已支付的服务费退还给客户。</p>
                <p>4、本公司的课程为虚拟内容服务，一旦购买无法退款，请谅解。</p>
                <p>5、根据法律规定因客户购买课程、接受服务而产生的税费，由客户自负。客户为实现课程购买和听课所必需的一切硬件、软件、服务及其它方面的费用，亦由客户自行承担。</p>
                <h3> 二、权利义务</h3>
                <p>1、客户承诺并保证遵守《中华人民共和国著作权法》、《中华人民共和国商标法》、《中华人民共和国广告法》等有关法律、法规、规章的规定。在任何情况下，本公司根据常规思维合理认为客户有可能违反上述法律、法规、规章的规定，有权不经事先通知终止向客户服务。</p>
                <p>2、客户违规违法行为：</p>
                <p>2.1涉及危害国家安全、泄露国家秘密的；侵犯国家社会集体的和公民的合法权益的；制作、复制、发行或传播带有煽动抗拒、破坏法律、法规实施的，煽动颠覆国家政权，推翻社会主义制度的，煽动分裂国家、破坏国家统一的，煽动民族仇恨、民族歧视，破坏民族团结的，捏造或者歪曲事实，散布谣言，扰乱社会秩序的，宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的，公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的，损害国家机关信誉的，其他违反法律、法规的内容。</p>
                <p>2.2 将有关干扰、破坏或限制任何计算机软件、硬件或通讯设备功能的软件病毒或其他计算机代码、档案和程序之资料，加以上载、张贴、发送电子邮件或以其他方式传送。</p>
                <p>3、客户禁止从事的行为：</p>
                <p>3.1不得利用本公司提供的任何资料从事违法活动；</p>
                <p>3.2 不得以任何手段干扰或侵害本公司的正常运行和其他客户对课程服务的正常使用；</p>
                <p>3.3未经本公司允许，不得以任何形式下载或试图下载除课程服务外的求知财堂其它任何内容；</p>
                <p>4、如果客户在使用本服务过程在违反了相关法律法规或本协议约定，给他方造成损失的，客户应自行承担责任，如本公司因此造成损失的，客户应一并赔偿。</p>
                <h3>三、服务中断或终止</h3>
                <p>下列情形发生时，本公司可以中断或终止向客户提供此项课程服务，并在服务中断或终止后通知客户： 1）客户违反法律法规或本协议相关约定； 2）客户明示不愿接受修订后的服务协议； 3）公司认为需中断或终止提供课程服务的其他情况。</p>
                <h3>四、不可抗力</h3>
                <p>客户理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务造成影响。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为及非本公司原因造成的通讯中断、技术故障等。出现上述情况时，本公司将努力在第一时间与相关单位配合，争取及时进行处理，但是由此给客户造成的损失本公司免责。</p>
                <h3>五、知识产权</h3>
                <p>经由本公司传送的文字、图片、音频、视频及其他内容，由本公司及其权利人依法享有，并受到著作权法、商标法、专利法或其他法律的保护；未经本公司或其权利人事先书面同意，任何人不得以任何方式擅自使用、修改、复制、公开发布、传播本公司产品有关程序及内容。任何用户未经授权对本公司产品的使用均属侵权行为，本公司将追究相关法律责任。</p>
                <h3>六、违约责任</h3>
                <p>1、协议任何一方违反本协议的规定，给另一方造成损害的，应当承担违约责任，并赔偿另一方因此而造成的直接损失。</p>
                <p>2、若用户违反有关法律法规或本协议的规定，本公司有权对该用户采取适当的法律行动并保存有关信息，用户应承担由此而产生的一切法律责任。</p>
                <p>3、若用户因违反本协议导致第三方产生损失，任何法律责任由用户本人承担，与本公司无关。本公司由此带来的损失，有权向用户进行追偿。</p>
                <h3>七、 法律适用、管辖和其他</h3>
                <p>1、本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律，没有相关法律规定的，参照通用国际商业惯例和（或）行业惯例。</p>
                <p>2、如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余条款则仍具有法律效力。</p>
                <p>3、本协议任何一方于另一方过失或违约时放弃本协议规定的权利的，不得视为其对一方的其他或以后同类之过失或违约行为弃权。</p>
                <p>4、双方约定，一旦由本协议产生争议，上海市浦东新区人民法院为管辖法院。</p>
                <p>5、本协议最终解释权及修订权归上海崇卓信息技术有限公司所有。</p>
            </div>
        </van-dialog>
        <!-- 优惠券列表 -->
        <van-popup
            v-model="showList"
            round
            position="bottom"
            style="height: 90%; padding-top: 4px;"
        >
            <div class="hbb-coupon-info">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="9" @getData="getData">
                    <div :class="index < 3 ? 'group use': 'group'" v-for="(item,index) in couponList" :key="index" @click="onChange(item, index)">
                        <div class="a">
                        <span>
                            <b>¥</b>{{item.couponAmount}}
                        </span>
                        </div>
                        <div class="b">
                            <p>{{item.couponName}}</p>
                            <p>仅限{{item.courseTypeName}}</p>
                            <p>到期时间：{{item.endTime}}</p>
                        </div>
                        <div class="c">
                            <span :class="currentIndex === index ? 'active': ''" v-if="index < 3">
                                <van-icon v-if="currentIndex === index" name="success" color="#ccc" />
                            </span>
                        </div>
                    </div>
                </VueScroller>
            </div>
            <div class="hbb-coupon-footer">
                <span>已选择{{chengeNum}}张, 可减 <b>￥{{couponsAmout | money}}</b></span>
                <van-button color="#FFA400" @click="sureClick">确认使用</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import VueScroller from "@/components/vantScroll/scrollVue.vue";
    import dayjs from "dayjs";
    import {sub} from "@/utils/number";
    import {showToast} from "@/utils/ui";
    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {
        coupons:any = [];
        showList = false;
        currentIndex = -1; // 选择当前的优惠券
        couponsAmout = 0; // 优惠券的面值
        couponsText = 0; // 展示优惠券的面值
        payMethodsIndex = 3; // 选择支付方式
        payMethodsList:any[] = [];
        productId:string = '';
        discountId:number = 0; // 选择优惠券的id
        checked = false; // 是否已阅读协议\
        couponList:any[] = []; // 优惠券list
        xieyiShow = false;
        requestObj = {};
        lastPrice = 0 ;
        chengeNum = 0;

        pageData:any = {
            courseDescribe: '', // 课程描述
            courseImgUrl: '', // 课程封面图片
            courseName: '', // 课程名称
            discountPrice: 0,  // 折后价
            hasBuy: 0, // 0 未买  1：已购买
            markPrice: 0, // 市场价
            label1: "",
            label2: "",
            label3: "",
        };
        userId = 0;

        getData(res: any) {
            this.couponList = res;
            this.couponList.forEach((x:any) => {
                x.endTime = x.endTime ? dayjs(x.endTime).format("YYYY年MM月DD日") : '';
            });
        }

        mounted() {
            this.productId = String(this.$route.query.id);
            this.requestObj = {
                page: 1,
                productId: this.productId
            }
            this.userId = Number(this.$route.query.userId);
            this.getSelectPassagewaySetList();
            this.getQueryNoListenCourseInfo();
            document.getElementsByClassName('hbb-fff')[0].setAttribute('tabindex', 'none');
        }


        getQueryNoListenCourseInfo() {
            const requestObj = {
                courseTypeId: this.productId,
                recommendUserId: this.userId
            }
            HomeModule.getQueryNoListenCourseInfo(requestObj).then((res:any) => {
                this.pageData.courseDescribe = res?.data.courseDescribe || '';
                this.pageData.courseImgUrl = res?.data.courseImgUrl || '';
                this.pageData.courseName = res?.data.courseName  || '';
                this.pageData.courseTypeId = res?.data.courseTypeId  || 0;
                this.pageData.discountPrice = res?.data.discountPrice  || 0;
                this.lastPrice = this.pageData.discountPrice;
                this.pageData.hasBuy = res?.data.hasBuy  || 0;
                this.pageData.markPrice = res?.data.markPrice  || 0;
                this.pageData.label1 = res?.data.label1  || '';
                this.pageData.label2 = res?.data.label2  || '';
                this.pageData.label3 = res?.data.label3  || '';
                if(this.pageData.hasBuy === 1) {
                    this.$router.push({
                        path: '/home/curriculum',
                        query: {
                            id: this.pageData.courseTypeId
                        }
                    })
                } else {
                    return false;
                }
            })
        }

        onChange(item:any, index:number) {
            if(this.currentIndex === index) {
                this.currentIndex = -1;
                this.couponsAmout = 0;
                this.discountId = 0;
                this.chengeNum = 0;
            } else {
                this.currentIndex = index;
                this.couponsAmout = item.couponAmount;
                this.discountId = item.userCouponId;
                this.chengeNum = 1;
            }

        }

        onPlayChange(item:any) {
            // 支付通道切换
            this.payMethodsIndex = item.passagewaySetId;
        }

        getSelectPassagewaySetList() {
            HomeModule.getSelectPassagewaySetList().then((res:any) => {
                this.payMethodsList = res?.data || []
            }).catch((err:any) => {
            })
        }

        couponModal() {
            this.showList = true;
        }

        sureClick() {
            this.showList = false;
            this.couponsText = this.couponsAmout;
            this.lastPrice = sub(this.pageData.discountPrice, this.couponsText)
        }


        onBridgeReady(data:any) {
            var vm = this;
            (window as any).WeixinJSBridge.invoke(
                'getBrandWCPayRequest',{
                    debug:true,
                    "appId":data.appId,//公众号名称，由商户传入
                    "timeStamp":data.timeStamp,//时间戳
                    "nonceStr":data.nonceStr,//随机串
                    "package":data.package,//预支付id
                    "signType":data.signType,//微信签名方式
                    "paySign":data.paySign,//微信签名
                },
                function(res:any){
 //            debugger;
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    if(res.err_msg === "get_brand_wcpay_request:ok" ){
                        vm.$toast("支付成功")
                        vm.$router.push({
                            path: "/home/orderInfo/paySuccess",
                            query: {
                                id: data.orderId
                            }
                        });
                    }else{
                        vm.$toast("支付失败")
//                alert("支付失败,请跳转页面"+res.err_msg);
                    }
                }
            );
        }

        surePay() {
            if(!this.checked) {
                this.$toast('请先阅读并同意《用户服务协议》');
                return false;
            }
            let requestData = {
                client: 1,
                passagewayId: this.payMethodsIndex,
                productId: this.productId,
                discountId: this.discountId
            }
            HomeModule.buyWxPayH5(requestData).then((res:any) => {
                if (res?.code === '000000') {
                    if (typeof (window as any).WeixinJSBridge === "undefined"){
                        if( document.addEventListener ){
                            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                        }else if ((document as any).attachEvent){
                            (document as any).attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                            (document as any).attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                        }
                    }else{
                        this.onBridgeReady(res?.data);
                    }
                }else if (res?.code === '113100') {
                    this.$toast("支付成功")
                    this.$router.push({
                        path: "/home/orderInfo/paySuccess",
                        query: {
                            id: res?.data.orderId
                        }
                    });
                }else {
                    showToast(res?.message+'')
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-order-info{
        .title{
            display: flex;
            width: 100%;
            height: 70px;
            background: #F6F6F6;
            padding: 0 30px;
            align-items: center;
            font-size: 24px;
            color: #333;
        }
        .content{
            display: flex;
            width: 100%;
            padding: 30px;
            flex-direction: column;
            .top{
                display: flex;
                width: 100%;
                img{
                    width: 160px;
                    height: 180px;
                    border-radius: 30px;
                }
                .right{
                    display: flex;
                    flex-direction: column;
                    padding:10px 20px;
                    h2{
                        font-size: 30px;
                        color: $base-font-color;
                        margin-bottom: 10px;
                        @include ellipsis(1);
                    }
                    p{
                        font-size: 26px;
                        color: $color-666;
                        margin-bottom: 10px;
                    }

                    .tab{
                        width: 100%;
                        margin-bottom: 10px;
                        span{
                            padding:5px 20px;
                            margin-right: 10px;
                            border-radius: 30px;
                            font-size: 22px;
                            color: $color-ff9600;
                            background-color:#f6f6f6;
                        }
                    }
                }
            }
            .bottom{
                display: flex;
                width: 100%;
                justify-content: space-between;
                margin-top: 20px;
                border-bottom: 2px solid #ddd;
                padding-bottom: 20px;
                *{
                    margin-right: 20px;
                    font-size: 28px;
                    color: #666;
                }
                span{
                    font-size: 26px;
                    &:nth-of-type(2){
                        color: $color-main;
                    }
                }
            }
            .hbb-b{
                font-weight: normal;
                font-size: 26px;
                margin-right: 10px;
                &.hbb-bA{
                    color: $color-main;
                }
            }

            .payMethods{
                display: flex;
                width: 100%;
                flex-direction: column;
                margin-top: 30px;
                h2{
                    display: flex;
                    width: 100%;
                    font-weight: normal;
                    font-size: 26px;
                    color:#333;
                    margin-bottom: 10px;
                }
                .group{
                    display: flex;
                    width: 100%;
                    height: 100px;
                    align-items: center;
                    justify-content: space-between;
                    span{
                        display: flex;
                        align-items: center;
                        img{
                            width: 50px;
                            height: 50px;
                            margin-right: 10px;
                        }
                        text-align: left;
                        font-size: 30px;
                        &:nth-of-type(2){
                            display: flex;
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            border: 2px solid #ddd;
                            font-size: 26px;
                            justify-content: center;
                            align-items: center;
                            &.active{
                                background: #37C034;
                            }
                        }
                    }
                }
            }
            .hbb-tip{
                display: flex;
                width: 100%;
                margin-top: 20px;
                color: $color-gray;
                font-size: 24px;
                line-height: 40px;
            }
        }

        .hbb-coupon-info{
            display: flex;
            width: 100%;
            flex-direction: column;
            padding: 30px;
            margin-bottom: 110px;

            .group{
                display: flex;
                width: 100%;
                height: 180px;
                align-items: center;
                margin-bottom: 20px;
                border-radius: 10px;
                &.use{
                    background: linear-gradient(to right, #ffdbbb 0%, #ffcf9c 100%);
                    .a,p{
                        color: #844a30;
                    }
                }
                background: linear-gradient(to right, #eee 0%, #ddd 100%);
                div{
                    &.a{
                        width: 30%;
                        color: #bbb;
                        font-size: 56px;
                        text-align: center;
                        font-weight: bold;
                        span{
                            position: relative;
                            b{
                                font-size: 26px;
                                position: absolute;
                                left: -15px;
                                top:8px;
                                font-weight: normal;
                            }
                        }

                    }
                    &.b{
                        width: 60%;
                        text-align: left;
                        color: #999;
                        font-size: 24px;
                        p{
                            &:nth-of-type(1){
                                font-size: 30px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                        }
                    }
                    &.c{
                        width: 10%;
                        text-align: center;
                        span{
                            display: flex;
                            width: 40px;
                            height: 40px;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            &.active{
                                border:none;
                                background: #0ca2ff;
                            }

                        }
                    }
                }
            }
        }

        .hbb-buy-footer{
            position: fixed;
            width: 100%;
            height: 240px;
            display: flex;
            bottom: 0;
            -webkit-transform: translateZ(0);
            left: 0;
            background: $color-666;
            padding: 30px 0;
            flex-direction: column;
            border-radius: 30px 30px 0 0;
            div{
                box-sizing: border-box;
                display: flex;
                width: 100%;

                &.x{
                    justify-content: flex-start;
                    padding:  0 30px;
                }
                .xieyi-con{
                    color: #2ec5ff;
                }
                &.buy{
                    height: 160px;
                    padding: 0 30px;
                    background: #ffffffe6;
                    align-items: center;
                    position: absolute;
                    bottom: 0;
                    padding-bottom: 40px;
                    margin-top: 30px;
                    justify-content: space-between;
                    border-radius: 40px 40px 0 0;
                    span{
                        font-size: 26px;
                        b{
                            font-size: 36px;
                            color: $color-main;
                        }
                    }
                }
            }
        }

        .hbb-coupon-footer{
            position: fixed;
            bottom: 0;
            height: 110px;
            width: 100%;
            border-top: 2px solid #ddd;
            background: #fff;
            display: flex;
            justify-content: flex-end;
            padding: 0 30px;
            align-items: center;
            left: 0;
            color: #666;
            font-size: 26px;
            span{

                b{
                    color: $color-main;
                }
            }
            button{
                width: 200px;
                height: 70px;
                border-radius: 40px;
                margin-left: 40px;
                color: #fff;
                font-size: 28px;
            }
        }
    }
    .xieyi-com{
        width: 100%;
        height: 900px;
        display: flex;
        overflow: auto;
        flex-direction: column;
        font-size: 24px;
        padding: 30px;
        color: #333;
        h2{
            font-size: 28px;
            margin-bottom: 10px;
        }
        p{
            margin-top: 10px;
        }
    }
</style>
