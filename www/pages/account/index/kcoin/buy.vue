<!--k豆购买-->
<template>
    <div>
        <div class="account-section-title">
            k豆产品
            <a class="back-btn" @click="clickBack">返回</a>
        </div>
        <div class="account-section-content">
            <div class="product-wrap">
                <div v-for="(item,idx) in productList" :key="idx" class="product"
                     :class="{active: chooseProductId === item.id}" @click="chooseProduct(idx)"
                >
                    <p class="value">
                        {{ item.number }}K豆
                    </p>
                    <p class="money">
                        {{ item.price }}元
                    </p>
                </div>
            </div>
        </div>
        <div class="account-section-content">
            <div class="channel-section">
                <div v-for="(item,idx) in channelList" :key="idx" @click="clickOnChannel(idx)">
                    <el-checkbox v-model="item.active" class="check-box" size="medium" readonly style="pointer-events: none" />
                    <img :src="item.channelImage" alt="" class="channel-icon">
                    <span class="channel-name">{{ item.channelName }}</span>
                </div>
            </div>
        </div>
        <div class="account-section-content">
            <div class="pay-info">
                <div v-loading="isRequestQrCode" class="qrcode">
                    <span v-if="isQrCodeErr" class="err">出错了</span>
                    <canvas id="canvas" width="110" height="110" />
                </div>
                <div class="infos">
                    <p class="money">
                        支付金额： <span class="sp">{{ needPayMoney }}元</span>
                    </p>
                    <p class="unit">
                        商户收款： 下单大师
                    </p>
                </div>
            </div>
        </div>
        <div class="account-section-content">
            <div class="question-info">
                <p class="title">
                    常见问题
                </p>
                <p>1、K豆可以用于订阅虚拟产品和服务，K豆购买成功后，不支持退款；</p>
                <p>2、支付成功后，如果可用K豆没有变化，刷新页面即可；</p>
                <p>3、充值过程中遇到任何问题，请联系下单大师客服。</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import QRCode from 'qrcode';
    import { postAsync } from '@/utils/request';
    import TkPagination from '@/components/ui/TkPagination.vue';

    @Component({
        components: {
            TkPagination
        }
    })
    export default class kcoin extends Vue {
        chooseProductId = '';
        chooseChannelId = '';
        needPayMoney = '';

        productList: any[] = [];
        channelList: any[] = [];

        isRequestQrCode = false
        isQrCodeErr = false

        mounted() {
            this.getData();
        }

        async getData() {
            const [err, resp] = await postAsync('/beanProductCtrl/findMyBeanProductList');
            if (resp?.code === '000000') {
                this.productList = (resp?.data || []).map((item: any) => {
                    return {
                        id: String(item.productId),
                        amount: item.amount,
                        number: item.number,
                        price: item.price + '',
                        productId: item.productId
                    };
                });
                console.log(this.productList);
            } else {
                this.productList = [];
            }
            const [err2, resp2] = await postAsync('/beanProductCtrl/finPayList');
            if (resp2?.code === '000000') {
                this.channelList = (resp2?.data || []).map((item: any) => {
                    return {
                        active: false,
                        channelImage: item.passagewayImage,
                        channelName: item.passagewayName,
                        id: String(item.beanPassagewaySetId)
                    };
                });
                // console.log(this.productList);
            } else {
                this.channelList = [];
            }
        }

        chooseProduct(idx: number) {
            this.chooseProductId = this.productList[idx].id;
            this.needPayMoney = this.productList[idx].price;
        }

        clickOnChannel(idx: number) {
            this.channelList.forEach((item: any, idx2: number) => {
                if (idx === idx2) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            });
            this.chooseChannelId = this.channelList[idx].id;
        }

        @Watch('chooseProductId')
        onChooseProductIdChange(val: string) {
            this.requestQrCode();
        }

        @Watch('chooseChannelId')
        onChooseChannelIdChange(val: string) {
            this.requestQrCode();
        }

        async requestQrCode() {
            if (!this.chooseProductId) {
                return;
            }
            if (!this.chooseChannelId) {
                return;
            }
            if (this.isRequestQrCode) {
                return;
            }
            this.isQrCodeErr = false;
            this.isRequestQrCode = true;
            const [_, resp] = await postAsync('/wxpay/wxPayH5', {
                client: 1,
                passagewayId: this.chooseChannelId,
                productId: this.chooseProductId
            });
            const opts = {
                margin: 1,
                width: 108,
                height: 108
            };

            if (resp?.code === '000000') {
                this.isQrCodeErr = false;
                const url = resp?.data?.url;
                QRCode.toCanvas(
                    document.getElementById('canvas'),
                    url,
                    opts,
                    function (error) {
                        if (error) { console.error(error); }
                        console.log('success!');
                    }
                );
            } else {
                this.isQrCodeErr = true;
                QRCode.toCanvas(
                    document.getElementById('canvas'),
                    '',
                    opts,
                    function (error) {
                        if (error) { console.error(error); }
                        console.log('success!');
                    }
                );
            }

            this.isRequestQrCode = false;
        }

        clickBack() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .product-wrap {
        display: flex;
        padding: 25px 35px 15px 25px;
        flex-wrap: wrap;

        .product {
            border-radius: 4px;
            width: 300px;
            height: 110px;
            padding-top: 10px;
            margin-bottom: 10px;
            border: 1px solid #eee;
            cursor: pointer;

            &.active {
                background-color: #ff43381a;
                border-color: #ff4338;
            }

            &:nth-child(3n + 2) {
                margin: 0 10px;
            }

            .value {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                color: #ff4338;
                margin-top: 15px;
            }

            .money {
                padding-top: 10px;
                font-size: 18px;
                text-align: center;
                color: #ff4338;
            }
        }
    }

    /deep/ .channel-section {
        padding: 15px 20px;
        border-top: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        display: flex;

        > div {
            cursor: pointer;
            margin-right: 20px;
            display: flex;
            align-items: center;
        }

        .el-checkbox__inner {
            border-radius: 50%;
            width: 20px;
            height: 20px;

            &::after {
                height: 10px;
                left: 6px;
                position: absolute;
                top: 2px;
                width: 6px
            }
        }

        .el-checkbox__input.is-focus .el-checkbox__inner {
            border-color: #DCDFE6;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
            border-color: #09bb07;
            background-color: #09bb07;
        }

        .channel-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background-color: #8c939d;
            margin: 0 10px;
        }

        .channel-name {
            color: #333;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
        }
    }

    .pay-info {
        padding: 20px 0 20px 80px;
        display: flex;

        .qrcode {
            width: 110px;
            height: 110px;
            margin-right: 10px;
            border: 1px solid #eaeaea;
            position: relative;
            .err{
                position: absolute;
                line-height: 110px;
                text-align: center;
                top: 0;
                left: 0;
                right: 0;
                margin: 0;
            }
            >canvas{
                width: 100%;
                height: 100%;
            }
        }

        .infos {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .money {
                margin-bottom: 20px;
                font-size: 20px;
                color: #333;

                > .sp {
                    color: #ff2f2f;
                    font-size: 20px;
                }
            }

            .unit {
                font-size: 20px;
                color: #333;
            }
        }
    }

    .question-info {
        padding: 20px 20px;
        border-top: 1px solid #eaeaea;

        .title {
            font-weight: bold;
        }

        > p {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
        }
    }
</style>
