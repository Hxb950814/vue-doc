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
                <div class="right-icons">
                    <nuxt-link class="menu-icon" to="/future/setting/chart">
                        <img src="https://rs.tanxingk.com/images/icon_setting.png" alt="">
                    </nuxt-link>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container">
            <div>
                <div class="chart-area">
                    <div>
                        <div id="chart" ref="chart" class="chart-map" />
                    </div>
                    <div>
                        <div id="chart2" ref="chart2" class="chart-map2" />
                    </div>
                    <div>
                        <div id="chart3" ref="chart3" class="chart-map3" />
                    </div>
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
            <tk-situation-tab-bar :active-index="3" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import echarts from 'echarts';
    import { ContractDataSocket, EnumContractDataKey, getSituationData } from '@common/src/future';
    import { postAsync } from '@/utils/request';
    import TkSituationTabBar from '@/components/TkSituationTabBar.vue';

    /* 一些不用 vue管理的数据 */
    let chart: echarts.ECharts; // 图表2
    let chart2: echarts.ECharts; // 图表2
    let dataSocketInstance: any = null;
    const chartData1 = [];

    @Component({
        components: {TkSituationTabBar},
        async asyncData({route}) {
            const [_, resp] = await postAsync('/quotation/getContractDetail', {
                quotationContractId: route.query.id
            });
            // console.log(resp?.data);
            let apiCode = '';
            let titleName = '';
            let userSelect = false;
            if (resp?.code === '000000') {
                apiCode = resp?.data?.apiCode || '';
                titleName = resp?.data?.contractName || '';
                userSelect = resp?.data?.optional === 1;
            } else {
            }
            return {
                userSelect,
                apiCode,
                titleName
            };
        }
    })
    export default class extends Vue {
        userSelect = false;
        apiCode = '';
        titleName = '';
        contractSize = 1;

        selectSettingLock = false;

        /* 跳动数据 */
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
            this.initChart();
            await this.getTodayTicksData();
            await this.initSocketData();
        }

        beforeDestroy() {
            this.destroySocketData();
        }

        async initSocketData() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener(this.handleSituationData);
            const results = await dataSocketInstance.connect();
            results?.[1] && dataSocketInstance.sendContractTickMessage(this.apiCode);
        }

        destroySocketData() {
            /* 关闭socket */
            // if (dataSocketInstance) {
            //     dataSocketInstance.sendCancelContractTickMessage(this.apiCode);
            //     dataSocketInstance.destroy();
            // }
            dataSocketInstance = null
        }

        initChart() {
            if (!chart) {
                chart = echarts.init(this.$refs.chart as HTMLDivElement); // 表格初始化
            }
            if (!chart2) {
                chart2 = echarts.init(this.$refs.chart2 as HTMLDivElement); // 表格初始化
            }
        }

        destroyChart() {
            if (chart) {
                chart.dispose();
            }
            if (chart2) {
                chart2.dispose();
            }
        }

        handleSituationData(errCode: number, data: any) {
            if (errCode !== 0) {
                return;
            }
            const showData: any = data;
            // console.log('socket data:', showData);

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

            // const dataChart = {
            //     name: data[EnumContractDataKey.timestamp], /* 时间戳 */
            //     time: data[EnumContractDataKey.timestamp], /* 时间戳 */
            //     open: data[EnumContractDataKey.open], /* 开盘价格 */
            //     close: data[EnumContractDataKey.close], /* 收盘价格 */
            //     low: data[EnumContractDataKey.low], /* 最低价 */
            //     high: data[EnumContractDataKey.high] /* 最高价 */
            // };
            // chartData1.push(dataChart);
            // showChartKline(chart, chartData1); // 绘制
            // this.calcKindIndexData('', data); // 算出新的数据
            // showChartKindIndex(chart2, kindIndexData); // 绘制
        }

        async getTodayTicksData() {
            const [_, resp] = await postAsync('/kline/klineMeta', {
                code: this.apiCode,
                period: 'minute'
            }, {
                proxyType: 'tquote_api'
            });
            if (resp?.code === '000000') {
                // const list = resp?.data?.list || [];
                // chartData1 = list.map((item: any) => {
                //     const data = getSituationData(item);
                //     return {
                //         name: data[EnumContractDataKey.timestamp], /* 时间戳 */
                //         time: data[EnumContractDataKey.timestamp], /* 时间戳 */
                //         open: data[EnumContractDataKey.open], /* 开盘价格 */
                //         close: data[EnumContractDataKey.close], /* 收盘价格 */
                //         low: data[EnumContractDataKey.low], /* 最低价 */
                //         high: data[EnumContractDataKey.high] /* 最高价 */
                //     };
                // });
                // // this.calcKindIndexData('');
            } else {
                // 无数据
            }
        }

        clickBack() {
            window.history.go(-1);
        }

        clickOnSetting() {
            this.$router.push('/future/setting/chart');
        }

        async clickChoose(tag: number) {
            if (this.selectSettingLock) {
                console.log('正在处理');
                return;
            }
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

    .chart-area{
        >div{
            &:first-child{
                height: calc((100vh - #{$nav-height} - 110px - 240px) * .55);
            }
            &:nth-child(2){
                height: calc((100vh - #{$nav-height} - 110px - 240px) * .25);
            }
            &:last-child{
                height: calc((100vh - #{$nav-height} - 110px - 240px) * .2);
            }
        }
    }
</style>
