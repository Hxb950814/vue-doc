<template>
    <div>
        <tk-nav-bar>购买K豆</tk-nav-bar>
        <div class="container">
            <div class="placeholder">
                <div class="buy-product">
                    <div v-for="(item,idx) in productList" :key="idx" class="product"
                         :class="{active: chooseProductId === item.id}" @click="chooseProduct(idx)"
                    >
                        <p class="value" :class="'len' + item.price.length">
                            <span class="unit">¥</span>{{ item.price }}
                        </p>
                        <p class="value2">
                            {{ item.number }}K豆
                        </p>
                        <!-- <div class="first-buy-reward">-->
                        <!--    首次送1000K豆-->
                        <!-- </div>-->
                    </div>
                </div>
            </div>
            <div class="pay-type">
                <div class="title">
                    支付渠道
                </div>
                <van-radio-group v-model="choosePayId">
                    <van-cell-group>
                        <van-cell v-for="(item,idx) in channelList" :key="idx" clickable
                                  class="pay-line" @click="choosePayId = item.id"
                        >
                            <template #title>
                                <img class="channel-image" :src="item.channelImage" alt="">
                                <span class="custom-title">{{ item.channelName }}</span>
                            </template>
                            <template #right-icon>
                                <van-radio :name="item.id" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="button-wrap">
                <button class="theme-button" :class="{disabled: chooseProductId === '' || choosePayId === ''}"
                        @click="clickSurePay"
                >
                    确认支付
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {isDesktop} from '@common/src/utils/browser';
    import {getAsync, postAsync} from '@/utils/request';
    // 判断是pc

    let handlePoll = -1;
    @Component({
        middleware: 'auth',
        components: {},
        async asyncData(context) {
            /* 查找所有的产品 */
            const promises = [
                await postAsync('/beanProductCtrl/findMyBeanProductList', {}),
                await postAsync('/beanProductCtrl/finPayList', {}) // 取得支付渠道
            ];
            const result = await Promise.all(promises) as any;

            const resp1 = result?.[0]?.[1];
            const resp2 = result?.[1]?.[1];

            let productList: any[] = [];
            let channelList: any[] = [];

            // console.log(resp1);

            if (resp1?.code === '000000') {
                productList = (resp1?.data || []).map((item: any) => {
                    return {
                        id: String(item.productId),
                        amount: item.amount,
                        number: item.number,
                        price: item.price + '',
                        productId: item.productId
                    };
                });
            }
            if (resp2?.code === '000000') {
                channelList = (resp2?.data || []).map((item: any) => {
                    return {
                        channelImage: item.passagewayImage,
                        channelName: item.passagewayName,
                        id: String(item.beanPassagewaySetId)
                    };
                });
            }

            // console.log(JSON.stringify(resp1));

            return {
                productList,
                channelList
            };
        }
    })
    export default class extends Vue {
        productList: any[] = []; // 服务端获取数据
        channelList: any[] = []; // 支付渠道

        chooseProductId = '';
        choosePayId = '';

        pullResultCount = 0; // 轮询次数

        async mounted() {
            document.addEventListener('urlunload', this.handleUrlUnload);
            const orderNumber = sessionStorage.getItem('payOrderNumberWait');
            if (orderNumber) {
                this.$showLoading('支付中，请勿刷新页面');
                await this.resultCheck(); // 轮询
            }
        }

        beforeDestroy() {
            // document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            clearTimeout(handlePoll);
            handlePoll = 0;
            this.$closeLoading();
            // this.$closeLoading();
            // sessionStorage.setItem('payOrderNumberWait', '');
        }

        // handleVisibilityChange() {
        //     if (document.visibilityState === 'visible') {
        //         console.log('支付失败');
        //         const orderNumber = sessionStorage.getItem('payOrderNumberWait');
        //         if (orderNumber) {
        //             this.$showLoading('支付中，请勿刷新页面');
        //             this.resultCheck(); // 轮询
        //         }
        //     }
        // }

        handleUrlUnload(ev: any) {
            if (sessionStorage.getItem('payOrderNumberWait')) {
                ev.returnValue = '你确定要离开吗？';
                return;
            }
            sessionStorage.getItem('payOrderNumberWait');
        }

        async resultCheck() {
            let hesResult = false;
            let isSuccess = false;
            const orderNumber = sessionStorage.getItem('payOrderNumberWait');
            if (!orderNumber) {
                return;
            }
            const [err, resp] = await postAsync('/beanProductCtrl/findBeanOrderByOrderNumber', {
                orderNumber: sessionStorage.getItem('payOrderNumberWait')
            });
            console.log('获取到结果', resp);
            if (resp?.code === '000000') {
                if (!resp?.data) {
                    this.$showMessageBox('温馨提示', '支付失败').then(() => {});
                    hesResult = true;
                } else {
                    const status = Number(resp?.data?.status);
                    if (status === 4) {
                        isSuccess = true;
                        hesResult = true;
                    } else if (status === 5) {
                        this.$showMessageBox('温馨提示', '支付失败').then(() => {});
                        hesResult = true;
                    }
                }
            } else {
                //
            }
            if (!hesResult) {
                // 状态为正在处理中的时候， 每隔2s查询一次状态
                handlePoll = window.setTimeout(() => {
                    this.resultCheck();
                }, 2000);
                this.pullResultCount++;
                if (this.pullResultCount === 4) {
                    this.pullResultCount = 0;
                    this.$closeLoading();
                    this.$showMessageBox('温馨提示', '支付失败').then(() => {});
                    sessionStorage.setItem('payOrderNumberWait', ''); // 清空掉
                }
            } else { // 得到成功或者失败了
                this.pullResultCount = 0;
                this.$closeLoading();
                sessionStorage.setItem('payOrderNumberWait', ''); // 清空掉
                if (isSuccess) {
                    this.$router.push({
                        path: '/kcoin/buy_success'
                    });
                }
            }
        }

        chooseProduct(idx: number) {
            this.chooseProductId = this.productList[idx].id;
        }

        choosePay(idx: number) {
            this.choosePayId = this.channelList[idx].id;
        }

        async clickSurePay() {
            if (this.choosePayId === '') {
                this.$showToast('请选择支付方式');
            }
            console.log(this.choosePayId);
            console.log(this.chooseProductId);
            const [_, resp] = await postAsync('/wxpay/wxPayH5', {
                productId: this.chooseProductId,
                passagewayId: this.choosePayId,
                client: 0 // 0=h5
            });
            console.log(resp);
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                const url = data.url || ''; // 微信地址
                sessionStorage.setItem('payOrderNumberWait', data.orderNumber); //
                if (isDesktop()) {
                    this.$showToast('请在手机上支付');
                    return;
                }
                if (url) {
                    window.location.href = url; // 打开微信活其他软件的协议链接
                } else {
                    this.$showToast('参数错误');
                }
            } else {
                // this.keepPlatOrderNumber = '';
            }
        };
    }
</script>

<style lang="scss" scoped>
    .container {
    }

    .placeholder {
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #fff;
    }

    .buy-product {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 40px 0;

        .product {
            text-align: center;
            border-radius: 6px;
            border: 1PX solid $color-main;
            width: 210px;
            height: 200px;
            margin-right: 20px;
            margin-bottom: 20px;

            &:nth-child(3n) {
                margin-right: 0;
            }

            position: relative;

            .first-buy-reward {
                position: absolute;
                top: -10px;
                right: -10px;
                color: #fff;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                padding: 0 10px;
                background: linear-gradient(to right, #FF5E3F, #FD1504);
                border-bottom-right-radius: 10px;
                border-top-left-radius: 10px;
            }

            &.active {
                background-color: #FFD8D8;
            }

            .value {
                color: $color-main;
                font-size: 70px;
                line-height: 70px;
                font-weight: bold;
                margin-top: 30px;

                &.len4 {
                    font-size: 60px;
                }

                &.len5 {
                    font-size: 60px;
                }

                &.len6 {
                    font-size: 55px;
                }

                &.len7 {
                    font-size: 50px;
                }

                &.len8 {
                    font-size: 50px;
                }

                .unit {
                    color: $color-main;
                    font-size: 26px;
                }
            }

            .value2 {
                margin-top: 16px;
                font-size: 26px;
                color: $color-main;
            }
        }
    }

    .pay-type {
        background-color: #fff;
        margin-top: 20px;

        .title {
            padding: 26px 40px;
            font-size: 30px;
            color: #666;
        }

        li {
            @include thinBorder();
        }

        /deep/ .pay-line {
            height: 88px;
            padding-left: 40px;
            padding-right: 40px;

            .van-cell__title {
                > span {
                    font-size: 30px;
                    padding-top: 10px;
                    max-width: 550px;
                    display: inline-block;
                    @include ellipsis();
                }
            }

            .van-radio__icon--checked .van-icon {
                background-color: $color-main;
                border-color: $color-main;
            }

            /*.icon {*/
            /*    width: 60px;*/
            /*    height: 60px;*/
            /*    margin-top: 15px;*/
            /*    display: inline-block;*/
            /*    margin-right: 18px;*/
            /*    background-color: #ccc;*/
            /*}*/
        }
    }

    .button-wrap {
        margin: 40px 55px;
    }

    .channel-image {
        border-radius: 5px;
        overflow: hidden;
        width: 50px;
        height: 50px;
        display: inline-block;
        margin-top: -0px;
        margin-right: 10px;
    }
</style>
