<template>
    <div>
        <tk-nav-bar>
            <template #left>
                <i class="arrow" data-v-2f5af622="" @click="clickBack" />
                <div>
                    <div class="se-cat">
                        分时图
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
            <div>
                <div class="chart-area">
                    <div id="chart" ref="chart" class="chart-map" />
                    <div class="chart2-title">
                        xxx
                    </div>
                    <div id="chart2" ref="chart2" class="chart-map2" />
                </div>
            </div>
            <div class="contract-brief-info">
                <div class="price-part" :class="tickData.changeValue >=0 ? 'up' : 'down'">
                    <div class="top">
                        <span class="value">{{ tickData.price }}</span>
                        <img v-show="!userSelect" src="https://rs.tanxingk.com/images/small_icon_add_red.png" alt=""
                             @click="clickChoose(1)"
                        >
                        <img v-show="userSelect" src="https://rs.tanxingk.com/images/small_icon_sub.png" alt=""
                             @click="clickChoose(0)"
                        >
                    </div>
                    <div class="rate">
                        {{ tickData.changeValue }}/{{ tickData.changeRate }}
                    </div>
                </div>
                <div>
                    <div class="right-column">
                        <span>卖 <span :class="tickData.askPrice >= tickData.price ? 'up' : 'down'">{{ tickData.askPrice }}</span></span>
                        <span>{{ tickData.askVolumes }}</span>
                    </div>
                    <div class="right-column">
                        <span>买 <span :class="tickData.bidPrice >= tickData.price ? 'up' : 'down'">{{ tickData.bidPrice }}</span></span>
                        <span>{{ tickData.bidVolumes }}</span>
                    </div>
                    <div class="right-column">
                        <span>仓 <span>{{ tickData.position >= 1e4 ? (tickData.position / 1e4 + '万') : tickData.position }}</span></span>
                        <span>{{ tickData.positionDelta }}</span>
                    </div>
                </div>
            </div>
        </div>

        <tk-situation-tab-bar :active-index="2" />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from 'vue-property-decorator';
    import echarts from 'echarts';
    import { ContractDataSocket, EnumContractDataKey, getSituationData, formula } from '@common/src/future';
    import { showChartTime, showChartKindIndex } from './charTime';
    import {getCQouteAsync, postAsync} from '@/utils/request';
    import TkSituationTabBar from '@/components/TkSituationTabBar.vue';

    let chart: echarts.ECharts | null; // 图表2
    let chart2: echarts.ECharts | null; // 图表2

    let dataSocketInstance: any = null;

    let chartData: any[] = [];
    const kindIndexData: any[] = [];
    @Component({
        components: {TkSituationTabBar},
        async asyncData({route}) {
            const [_, resp] = await postAsync('/quotation/getContractDetail', {
                quotationContractId: route.query.id
            });
            console.log(resp?.data);
            let apiCode = '';
            let titleName = '';
            let userSelect = false;
            let contractSize = 0;
            if (resp?.code === '000000') {
                apiCode = resp?.data?.apiCode || '';
                titleName = resp?.data?.contractName || '';
                userSelect = resp?.data?.optional === 1;
                contractSize = resp?.data?.contractsize;
            } else {
            }
            return {
                userSelect,
                apiCode,
                titleName,
                contractSize
            };
        }
    })
    export default class extends Vue {
        id = ''; // id
        showType = '0'; // 0=盘口  1=分时成交
        titleName = '';
        dataList: any[] = [];
        apiCode = '';
        userSelect = false; // 是否自选
        contractSize = 1; // 是否自选

        price = ''; // 最新价

        increaseStatus = 0; // 是否上涨  -1下跌 0 持平 1=上涨
        selectSettingLock = false;

        formulaType = '';

        /* 数据 */
        tickData = {
            askPrice: 0, // 卖价 最低卖价
            askVolumes: 0, // 卖量 累计卖量
            bidPrice: 0, // 买价
            bidVolumes: 0, // 买量
            price: 0, // 最新价
            changeValue: 0, // 涨跌
            changeRate: '', // 涨跌
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

        async mounted() {
            if (!chart) {
                chart = echarts.init(this.$refs.chart as HTMLDivElement); // 表格初始化
            }
            if (!chart2) {
                chart2 = echarts.init(this.$refs.chart2 as HTMLDivElement); // 表格初始化
            }
            await this.getTodayTicksData();
            await this.getSocketData();
        }

        beforeDestroy() {
            dataSocketInstance = null;

            if (chart) {
                chart.clear();
                chart.dispose();
                chart = null;
            }
            if (chart2) {
                chart2.clear();
                chart2.dispose();
                chart2 = null;
            }
        }

        async getTodayTicksData() {
            const [_, resp] = await getCQouteAsync('/api/get_kline', {
                code: this.apiCode,
                period: 'm'
            });
            if (resp?.err_code === 0) {
                const list = resp?.data?.list || [];
                chartData = list.map((item: any) => {
                    const data = getSituationData(item, [
                        EnumContractDataKey.timestamp,
                        EnumContractDataKey.close,
                        EnumContractDataKey.amount,
                        EnumContractDataKey.volume
                    ]);
                    return {
                        name: data[EnumContractDataKey.timestamp], /* 时间戳 */
                        time: data[EnumContractDataKey.timestamp], /* 时间戳 */
                        price: data[EnumContractDataKey.close], /* 价格 */
                        amount: data[EnumContractDataKey.amount], /* amount */
                        volume: data[EnumContractDataKey.volume] /* volume */
                    };
                });
                this.calcKindIndexData('');
            } else {
                // 无数据
            }
        }

        async getSocketData() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener(this.handleSituationData);

            const results = await dataSocketInstance.connect();
            results?.[1] && dataSocketInstance.sendContractTickMessage(this.apiCode);
        }

        handleSituationData(errCode: number, data: any) {
            if (errCode !== 0) {
                return;
            }
            // console.log('datasss:', data);
            const showData: any = data;
            this.tickData.price = showData[EnumContractDataKey.price];

            this.tickData.changeValue = showData[EnumContractDataKey.changeValue];
            this.tickData.changeRate = showData[EnumContractDataKey.changeRate] + '%';

            /* 卖价 */
            this.tickData.askPrice = showData[EnumContractDataKey.askPrices]?.[0];
            this.tickData.askVolumes = (showData[EnumContractDataKey.askVolumes] || []).reduce((prev: number, curr: number) => {
                return prev + curr;
            });
            /* 买价 */
            this.tickData.bidPrice = showData[EnumContractDataKey.bidPrices]?.[0];
            this.tickData.bidVolumes = (showData[EnumContractDataKey.bidVolumes] || []).reduce((prev: number, curr: number) => {
                return prev + curr;
            });
            this.tickData.position = showData[EnumContractDataKey.position]; // 持仓
            this.tickData.positionDelta = showData[EnumContractDataKey.positionDelta]; // 增仓

            if (chartData) {
                const data = {
                    name: showData[EnumContractDataKey.timestamp], /* 时间戳 */
                    time: showData[EnumContractDataKey.timestamp], /* 时间戳 */
                    price: showData[EnumContractDataKey.price], /* 价格 */
                    preSettle: showData[EnumContractDataKey.preSettle], /* 昨日结算价格 */
                    high: showData[EnumContractDataKey.high], /* 最高价格 */
                    low: showData[EnumContractDataKey.low], /* 价格 */
                    amount: showData[EnumContractDataKey.amount], /* 价格 */
                    volume: showData[EnumContractDataKey.volume] /* 价格 */
                };
                chartData.push(data);
                showChartTime(chart as echarts.ECharts, chartData, {
                    contractSize: this.contractSize
                }); // 绘制
                this.calcKindIndexData('', data); // 算出新的数据
                showChartKindIndex(chart2 as echarts.ECharts, kindIndexData); // 绘制
            }
        }

        calcKindIndexData(formulaType: string, data?: any) {
            // 如果公式发生了变化，就需要重新计算
            const formulaFunc = formula.macd(12, 26, 9); // macd公式

            if (!kindIndexData || kindIndexData.length === 0) {
                for (let i = 0; i < chartData.length; ++i) {
                    const obj = chartData[i];
                    const value = formulaFunc(obj.price);
                    kindIndexData.push({
                        time: obj.time,
                        name: obj.name,
                        value1: value[0],
                        value2: value[1],
                        value3: value[2]
                    });
                }
                // 根据公式计算
            } else {
                if (!data) {
                    return;
                }
                const value = formulaFunc(data.price);
                kindIndexData.push({
                    time: data.time,
                    name: data.name,
                    value1: value[0],
                    value2: value[1],
                    value3: value[2]
                });
            }

            showChartKindIndex(chart2 as echarts.ECharts, kindIndexData, { type: 'macd'});
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

        async clickChoose(tag: number) {
            if (this.selectSettingLock) {
                console.log('正在处理');
                return;
            }
            // if (!await checkAuth()) {
            //     return;
            // }
            this.selectSettingLock = true;
            const [err, resp] = await postAsync('/quotation/updateContractUser', {
                quotationContractId: this.$route.query.id,
                type: tag
            });
            if (resp?.code === '000000') {
                if (tag) {
                    this.$showToast('已添加至自选');
                } else {
                    this.$showToast('已从自选移除');
                }
                this.userSelect = !!tag;
            }
            this.selectSettingLock = false;
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
        position: absolute;
        @include thinBorder(bottom);
        background: #fff;
        display: flex;

        > div {
            flex: 1;
            text-align: center;
            line-height: 90px;
            font-size: 32px;
            color: #666;
            position: relative;

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

    .market-block {
        display: flex;

        > div {
            position: relative;
            height: 120px;
            justify-content: space-between;
            padding-left: 32px;
            padding-right: 20px;

            .title {
                color: #666;
                font-size: 30px;
            }

            .value {
                font-size: 30px;

                &.red {
                    color: $color-up;
                }

                &.green {
                    color: $color-down;
                }
            }

            &:first-child {
                display: flex;
                align-items: center;
                width: 45%;
                @include thinBorder(bottom right);
            }

            &:last-child {
                width: 55%;
                display: flex;
                align-items: center;
                @include thinBorder(bottom);

            }
        }
    }

    .down .dy-value {
        color: $color-down;
    }

    .up .dy-value {
        color: $color-up;
    }

    .chart-map {
        height: calc((100vh - #{$nav-height} - 110px - 240px) * .65);
        min-height: 250px;
        max-height: 450px;
    }

    .chart-map2 {
        height: calc((100vh - #{$nav-height} - 110px - 240px) * .35);
        min-height: 250px;
        max-height: 450px;
    }
    .chart2-title{
        font-size: 28px;
        color: $color-down;
    }
</style>
