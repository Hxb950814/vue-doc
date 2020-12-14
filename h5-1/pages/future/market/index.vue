<template>
    <div>
        <tk-nav-bar>
            <template #left>
                <i class="arrow" data-v-2f5af622="" @click="clickBack" />
                <div>
                    <div class="se-cat">
                        品种
                    </div>
                    <div class="se-name">
                        {{ titleName }}
                    </div>
                </div>
            </template>
            <template #right>
                <div class="tools-form">
                    <a class="menu-icon" @click="clickOnSetting">
                        <img src="https://rs.tanxingk.com/images/icon_setting.png" alt="">
                    </a>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container">
            <div class="menu-tab" :class="'tab' + showType">
                <div class="tab" :class="{active: showType === '0'}" @click="clickOnTab('0')">
                    盘口
                </div>
                <div class="tab" :class="{active: showType === '1'}" @click="clickOnTab('1')">
                    分时成交
                </div>
            </div>
            <div class="menu-content-warp">
                <div v-if="showType === '0'"
                     class="market-format-wrap"
                     :class="increaseStatus === -1 ? 'down' : increaseStatus === 0 ? '' : 'up'"
                >
                    <div class="market-block">
                        <div>
                            <span class="title">卖价</span>
                            <span class="value dy-value">{{ tickData.askPrice }}</span>
                        </div>
                        <div>
                            <span class="title">卖量</span>
                            <span class="value">{{ tickData.askVolumes }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">买价</span>
                            <span class="value dy-value">{{ tickData.bidPrice }}</span>
                        </div>
                        <div>
                            <span class="title">买量</span>
                            <span class="value">{{ tickData.bidVolumes }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">最新</span>
                            <span class="value dy-value">{{ tickData.price }}</span>
                        </div>
                        <div>
                            <span class="title">涨跌</span>
                            <span class="value dy-value">{{ tickData.changeValue }}/{{ tickData.changeRate }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">开盘</span>
                            <span class="value dy-value">{{ tickData.open }}</span>
                        </div>
                        <div>
                            <span class="title">成交量</span>
                            <span class="value">{{ tickData.volume }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">最高</span>
                            <span class="value red">{{ tickData.high }}</span>
                        </div>
                        <div>
                            <span class="title">持仓量</span>
                            <span class="value">{{ tickData.position }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">最低</span>
                            <span class="value dy-value">{{ tickData.low }}</span>
                        </div>
                        <div>
                            <span class="title">日增仓</span>
                            <span class="value">{{ tickData.positionDelta }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">均价</span>
                            <span class="value dy-value">{{ tickData.average }}</span>
                        </div>
                        <div>
                            <span class="title">结算</span>
                            <span class="value">{{ tickData.positionDelta }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">昨收</span>
                            <span class="value dy-value">{{ tickData.preSettle }}</span>
                        </div>
                        <div>
                            <span class="title">昨结</span>
                            <span class="value">{{ tickData.preClose }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">涨停</span>
                            <span class="value red">{{ tickData.highLimited }}</span>
                        </div>
                        <div>
                            <span class="title">跌停</span>
                            <span class="value green">{{ tickData.lowLimited }}</span>
                        </div>
                    </div>
                    <div class="market-block">
                        <div>
                            <span class="title">杠杆</span>
                            <span class="value">--</span>
                        </div>
                        <div>
                            <span class="title" />
                            <span class="value" />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <ul class="time-ul">
                        <li class="time-title">
                            <div>时间</div>
                            <div>价位</div>
                            <div>现手</div>
                            <div>增仓</div>
                            <div>开平</div>
                        </li>
                        <li v-for="(item,idx) in timeData" :key="idx">
                            <div>{{ item.timestamp }}</div>
                            <div :class="item.changeValue >= 0 ? 'up': 'down'">
                                {{ item.price }}
                            </div>
                            <div>{{ item.volume }}</div>
                            <div>{{ item.positionDelta }}</div>
                            <div>{{ item.timestamp }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <tk-situation-tab-bar :active-index="1" />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from 'vue-property-decorator';
    import { ContractDataSocket, EnumContractDataKey, getSituationData } from '@common/src/future';
    import {formatTime} from '@common/src/utils/time';
    import {postAsync, getCQouteAsync} from '@/utils/request';
    import TkSituationTabBar from '@/components/TkSituationTabBar.vue';

    let dataSocketInstance: any = null;
    let timeHandle = 0;
    @Component({
        components: {TkSituationTabBar},
        async asyncData({route}) {
            const [_, resp] = await postAsync('/quotation/getContractDetail', {
                quotationContractId: route.query.id
            });
            console.log(resp?.data);
            let apiCode = '';
            let titleName = '';
            if (resp?.code === '000000') {
                apiCode = resp?.data?.apiCode || '';
                titleName = resp?.data?.contractName || '';
            } else {
            }
            return {
                apiCode,
                titleName
            };
        }
    })
    export default class extends Vue {
        id = ''; // id
        showType = '0'; // 0=盘口  1=分时成交
        titleName = '';
        dataList: any[] = [];
        apiCode = '';

        increaseStatus = 0; // 是否上涨  -1下跌 0 持平 1=上涨
        /* 数据 */
        tickData = {
            askPrice: 0, // 卖价 最低卖价
            askVolumes: 0, // 卖量 累计卖量
            bidPrice: 0, // 买价
            bidVolumes: 0, // 买量
            price: 0, // 最新价
            changeValue: 0, // 涨跌
            changeRate: '', // 涨幅
            open: 0, // 开盘
            volume: 0, // 成交量
            low: 0, // 最低价
            high: 0, // 最高价
            position: 0, // 持仓
            positionDelta: 0, // 增仓
            average: 0, // 均价
            preSettle: 0, // 昨天收
            preClose: 0, // 昨天结
            lowLimited: 0, // 跌停价
            highLimited: 0 // 涨停价
        };

        timeData: any[] = [];

        async mounted() {
            await this.getTodayTicksData();
            await this.getSocketData();
        }

        beforeDestroy() {
            if (dataSocketInstance) {
                dataSocketInstance.sendCancelContractTickMessage(this.apiCode);
                dataSocketInstance.destroy();
            }
            if (timeHandle) {
                clearInterval(timeHandle);
                timeHandle = 0;
            }
        }

        async getSocketData() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener(this.handleSituationData1);
            const results = await dataSocketInstance.connect();
            results?.[1] && dataSocketInstance.sendContractTickMessage(this.apiCode);
        }

        async getTodayTicksData() {
            const [_, resp] = await getCQouteAsync('/api/get_tick', {
                code: this.apiCode,
                count: 100
            });
            if (resp?.err_code === 0) {
                const list = resp?.data?.list || [];
                this.timeData = list.map((item: any) => {
                    const data = getSituationData(item, [
                        EnumContractDataKey.timestamp, /* 时间戳 */
                        EnumContractDataKey.price, /* 价位 */
                        EnumContractDataKey.volume, /* 现手 */
                        EnumContractDataKey.position, /* 增仓 */
                        EnumContractDataKey.changeRate /* 涨跌值 */
                    ]);
                    data[EnumContractDataKey.timestamp] = formatTime(data[EnumContractDataKey.timestamp], 'hh:mm:ss');
                    return data;
                }).reverse();
                // console.log(this.timeData);
                // const showData: any = getSituationData(data);
            } else {
                // 无数据
            }
        }

        handleSituationData1(errCode: number, data: any) {
            if (errCode !== 0) {
                return;
            }
            const showData: any = data;
            // console.log('处理data:', showData);
            // this.marketPrice = showData.value1 || '';
            // this.marketPriceIsDown = showData.value2 < 0;

            if (JSON.stringify(showData) === '{}') {
                return;
            }
            this.tickData.askPrice = showData[EnumContractDataKey.askPrices]?.[0];
            this.tickData.askVolumes = (showData[EnumContractDataKey.askVolumes] || []).reduce((prev: number, curr: number) => {
                return prev + curr;
            });
            this.tickData.bidPrice = showData[EnumContractDataKey.bidPrices]?.[0];
            this.tickData.bidVolumes = (showData[EnumContractDataKey.bidVolumes] || []).reduce((prev: number, curr: number) => {
                return prev + curr;
            });
            this.tickData.price = showData[EnumContractDataKey.price];
            this.tickData.changeValue = showData[EnumContractDataKey.changeValue];
            this.tickData.changeRate = showData[EnumContractDataKey.changeRate] + '%';

            this.increaseStatus = this.tickData.changeValue > 0 ? 1 : this.tickData.changeValue === 0 ? 0 : -1;

            this.tickData.open = showData[EnumContractDataKey.open];
            this.tickData.volume = showData[EnumContractDataKey.volume];

            this.tickData.low = showData[EnumContractDataKey.low];
            this.tickData.high = showData[EnumContractDataKey.high];
            this.tickData.position = showData[EnumContractDataKey.position];

            this.tickData.average = showData[EnumContractDataKey.average];
            this.tickData.positionDelta = showData[EnumContractDataKey.positionDelta];

            this.tickData.preClose = showData[EnumContractDataKey.preClose];
            this.tickData.preSettle = showData[EnumContractDataKey.preSettle];

            this.tickData.highLimited = showData[EnumContractDataKey.highLimited];
            this.tickData.lowLimited = showData[EnumContractDataKey.lowLimited];

            this.timeData.unshift({
                [EnumContractDataKey.timestamp]: formatTime(showData[EnumContractDataKey.timestamp], 'hh:mm:ss'), /* 时间戳 */
                [EnumContractDataKey.price]: showData[EnumContractDataKey.price], /* 价位 */
                [EnumContractDataKey.volume]: showData[EnumContractDataKey.volume], /* 现手 */
                [EnumContractDataKey.positionDelta]: showData[EnumContractDataKey.positionDelta], /* 增仓 */
                [EnumContractDataKey.changeValue]: showData[EnumContractDataKey.changeValue] /* 涨跌值 */
            });
            if (this.timeData.length > 300) {
                this.timeData.splice(0, 300);
            }
        }

        async getData() {
            this.$showLoading();
            const [_, resp] = await postAsync('/quotation/getContractDetail', {
                quotationContractId: this.$route.query.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any[] = [];
                this.apiCode = resp.data.apiCode;
                await this.getSocketData();
            } else {
                // this.showChart([]);
                // this.apiCode = [];
            }
        }

        clickBack() {
            window.history.go(-1);
        }

        clickOnSetting() {
            this.$router.push('/future/setting/chart');
        }

        clickOnTab(idx: string) {
            if (this.showType === idx) {
                return;
            }
            this.showType = idx;
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        background-color: #fff;
        padding-bottom: 120px;
    }

    .tools-form {
        padding-top: 25px;
        padding-right: 20px;
        margin-top: 0;
        margin-right: 0;

        .menu-icon {
            width: 40px;
            height: 40px;
            display: inline-block;
            margin-left: 10px;

            > img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .menu-tab {
        height: 90px;
        top: $nav-height;
        left: 0;
        right: 0;
        margin:  0 auto;
        width: 750px;
        position: fixed !important;
        z-index: 4000;
        @include thinBorder(bottom);
        background-color: #fff;
        display: flex;

        > div {
            flex: 1;
            text-align: center;
            line-height: 90px;
            font-size: 32px;
            color: #666;
            position: relative;
            border-bottom: 1PX solid #eaeaea;

            &.active {
                background: #FFD9D7;
                color: #FF4338;
                border-bottom: 2PX solid #FF4338;
            }
        }

        :nth-child(2) {
            @include thinBorder(left);
            @include thinBorder(right);
        }
    }

    .time-title{
        position: fixed !important;
        top: $nav-height + 90px;
        width: 750px;
        margin: 0 auto;
        background-color: #fff;
        @include thinBorder(bottom);
    }

    .tab0 + .menu-content-warp{
        padding-top:90px;
    }
    .tab1 + .menu-content-warp{
        padding-top:150px;
    }

    .market-block{
        display: flex;
        >div{
            position: relative;
            height: 100px;
            justify-content: space-between;
            padding-left: 32px;
            padding-right: 20px;
            .title{
                color: #666;
                font-size: 30px;
            }
            .value{
                font-size: 30px;
                &.red{
                    color: $color-up;
                }
                &.green{
                    color: $color-down;
                }
            }
            &:first-child{
                display: flex;
                align-items: center;
                width: 45%;
                @include thinBorder(bottom right);
            }
            &:last-child{
                width: 55%;
                display: flex;
                align-items: center;
                @include thinBorder(bottom);

            }
        }
    }

    .down .dy-value{
        color: $color-down;
    }

    .up .dy-value{
        color: $color-up;
    }

    .time-ul{
        padding: 0 0;
        li{
            display: flex;
            justify-content: space-between;
            >div{
                width: 100%;
                text-align: center;
                line-height: 60px;
                font-size: 25px;
                &.up{
                    color: $color-up;
                }
            }
        }
    }
</style>
