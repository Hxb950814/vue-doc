<template>
    <div style="float:left;width:100%">
        <!-- 切换数据 -->
        <div class="hbb-selectBox">
            <div class="left">
                <span>最大回撤：<b class="down">{{ maxWithdrawal }}%</b></span>
                <!--                <span>夏普率： <b-->
                <!--                    :class="{-->
                <!--                        up: sharpRate >= 0,-->
                <!--                        down: sharpRate < 0-->
                <!--                    }"-->
                <!--                >{{ sharpRate }}%</b></span>-->
                <span>收益率： <b
                    :class="{
                        up: profit >= 0,
                        down: profit < 0
                    }"
                >{{ profit }}%</b></span>
                <span>历史收益率： <b
                    :class="{
                        up: historyProfit >= 0,
                        down: historyProfit < 0
                    }"
                >{{ historyProfit }}%</b></span>
            </div>
            <el-select v-model="timeType" clearable placeholder="请选择" @change="timeChange">
                <el-option
                    v-for="item in navList"
                    :key="item.timeType"
                    :label="item.title"
                    :value="item.timeType"
                />
            </el-select>
        </div>

        <div class="charts" style="position:relative;">
            <!-- 统计图部分 -->
            <div v-if="nearData.length === 0" class="hbb-noData">
                暂无数据
            </div>
            <div id="chart1" ref="chart1" class="chart-map" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import echarts from 'echarts';
    import dayjs from 'dayjs';
    let chart: echarts.ECharts | undefined; // 图表
    @Component({
        components: {

        }
    })
    export default class extends Vue {
        nearData:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月
        nearDataTwo:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月 copy
        nearDataY:any[] = []; // 折线图数据数组
        navList:any[] = []; // 统计图表的选择按钮
        timeType:number = 0; // 当前所选的按钮
        strategyIdString:string = ''; // 策略ID
        strategyCapital:string = ''; // 策略本金

        historyProfit:number = 11.33; // 历史年化率
        maxWithdrawal:number = 15567.18; // 最大回撤
        profit:number = -8.84; // 年化率
        sharpRate:number = 0; // 夏普率

        maxVal:number = 0; // 数据最大值
        minVal:number = 0; // 数据最小值

        async mounted() {
            this.init();
        }

        init() {
            // 近7天
            // 取得选项列表  跟父元素的按钮配置数据相同
            this.$nextTick(() => {
                this.navList = (this.$parent as any).navList;
                this.strategyIdString = (this.$parent as any).pageData.strategyIdString;
                this.strategyCapital = (this.$parent as any).pageData.strategyCapital;
            });

            const chart1Dom = document.getElementById('chart1');
            if (!chart1Dom) {
                throw new Error('选择器 #chart1 对应的dom不存在');
            }
            const width = getComputedStyle(chart1Dom).width;
            const size = {
                width: parseFloat(width),
                height: 320
            };
            chart = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化
        }

        timeChange() {
            // 切换时间
            this.strategyIdString = (this.$parent as any).pageData.strategyIdString;
            this.strategyCapital = (this.$parent as any).pageData.strategyCapital;
            if (this.strategyCapital === '') {
                this.$message({
                    type: 'warning',
                    message: '策略本金不能为空'
                });
                return;
            }
            if (this.strategyIdString === '') {
                this.$message({
                    type: 'warning',
                    message: '策略ID不能为空'
                });
                return;
            }
            this.nearData = [];
            this.nearDataY = [];
            this.nearDataTwo = [];
            this.getDetail(String(this.timeType));
        }

        async getDetail(type:string) {
            const requestData = {
                strategyIdString: this.strategyIdString,
                dateType: this.timeType,
                strategyCapital: this.strategyCapital || 0
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/strategy/queryStrategyByStrategyIdString', requestData, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                // 处理展示数据
                this.dealWith(type, resp?.data?.dateList);
                this.historyProfit = resp?.data.historyProfit;
                this.maxWithdrawal = resp?.data.maxWithdrawal;
                this.profit = resp?.data.profit;
                this.sharpRate = resp?.data.sharpRate;
            } else {
                this.$showToast(resp!.message);
            }
            this.$closeLoading();
        }

        dealWith(t:string, arr:any) {
            // 处理数据
            const lengthIndex = arr.length - 1;

            arr.forEach((x:any, i:number) => {
                switch (t) {
                    case '0':
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataTwo.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '1':
                        this.nearDataTwo.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '3':
                        if (i <= (lengthIndex / 7)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 7 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '6':
                        if (i <= (lengthIndex / 7)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 7 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '12':
                        if (i <= (lengthIndex / 30)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 30 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '24':
                        if (i <= (lengthIndex / 30)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 30 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '36':
                        if (i <= (lengthIndex / 30)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 30 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    case '48':
                        if (i <= (lengthIndex / 30)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 30 * i].date).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.date).format('YYYY-MM-DD'));
                        this.nearDataY.push(x.balance);
                        break;
                    default:
                        break;
                }
                this.maxVal = Math.max.apply(Math, this.nearDataY);
                this.minVal = Math.min.apply(Math, this.nearDataY);
            });
            this.getData();
        }

        getData() {
            const option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#fff'
                        }
                    }
                },
                dataZoom: [
                    {
                        orient: 'horizontal',
                        show: true,
                        start: 0,
                        end: 100,
                        height: 30,
                        bottom: 0
                    },
                    {
                        type: 'inside'
                    },
                    {
                        xAxisIndex: [0, 1]
                    }
                ],

                legend: {
                    data: ['模拟收益']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        show: false,
                        data: this.nearData
                    },
                    {
                        type: 'category',
                        boundaryGap: false,
                        show: true,
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        },
                        position: 'bottom',
                        data: this.nearDataTwo
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: this.maxVal,
                        max: this.minVal
                    }
                ],
                series: [
                    {
                        name: '模拟收益',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {
                                color: '#D9EDFF'
                            }
                        },
                        lineStyle: {
                            color: '#0086FF'
                        },
                        data: this.nearDataY
                    }
                ]
            };
            chart && chart.setOption(option as echarts.EChartOption); // 绘制
        }
    }
</script>

<style lang="scss">
    .hbb-bigNav{
        display: flex;
        width: 100%;
        margin: 10px 0;
        padding: 0 20px;
        span{
            width: 120px;
            height: 30px;
            float: left;
            background: #F6F6F6;
            color: #666;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            &.active{
                color: #0086FF;
                background: #D8ECFF;
            }
        }
    }
    .hbb-selectBox{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        padding: 0 10px;
        .left{
            span{
                margin-right: 10px;
                b{
                    font-weight: normal;
                    &.up{
                        color: #ff2f2f;
                    }
                    &.down{
                        color: #00b600;
                    }
                }
            }
        }
    }
    .hbb-noData{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        height: 300px;
        font-size:14px;
        color: #666;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>
