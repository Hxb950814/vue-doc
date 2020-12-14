<template>
    <div style="float:left;width:100%">
        <div class="hbb-bigNav">
            <span v-for="(item,index) in bigNav" :key="index" :class="curBigIndex === index ? 'active': ''" @click="handBigClick(index)">
                {{ item.title }}
            </span>
        </div>
        <div class="hbb-selectBox">
            <el-select v-model="timeType" placeholder="请选择" @change="timeChange">
                <el-option
                    v-for="item in navList"
                    :key="item.timeType"
                    :label="item.title"
                    :value="item.timeType"
                />
            </el-select>
        </div>
        <div class="charts" style="position: relative">
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
        strategyIdString:string = ''; // 策略ID
        timeType:number = 0; // 当前所选的按钮
        navList:any[] = []; // 统计图表的选择按钮
        bigNav:any[] = [
            {id: 1, title: '实盘收益'},
            {id: 2, title: '模拟收益'}
        ]; // 收益的方式

        navData:any[] = [
            {timeType: 0, title: '近7天'},
            {timeType: 1, title: '近1月'},
            {timeType: 3, title: '近3月'},
            {timeType: 6, title: '近半年'},
            {timeType: 12, title: '近1年'},
            {timeType: 24, title: '近2年'},
            {timeType: 36, title: '近3年'},
            {timeType: 48, title: '近4年'}
        ]; // 时间段的切换按钮

        curBigIndex:number = 1; // 收益的方式当前的索引 暂无实盘收益  所以默认进来为模拟收益
        maxVal:number = 0; // 数据最大值
        minVal:number = 0; // 数据最小值

        active(res:any) {
            const arr:any[] = [];
            this.strategyIdString = String(this.$route.query.id);
            res.forEach((x:any) => {
                this.navData.filter((y:any) => y.timeType === x.timeType).map((z:any) => {
                    arr.push(z);
                });
            });
            this.timeType = arr[0].timeType;
            this.navList = arr;
            this.getDate();
        }

        getDate() {
           const chart1Dom = document.getElementById('chart1');
            if (!chart1Dom) {
                throw new Error('选择器 #chart1 对应的dom不存在');
            }
            const width = getComputedStyle(chart1Dom).width;
            const size = {
                width: parseFloat(width),
                height: 340
            };
            chart = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化
            this.init();
        }

        init() {
            // 近7天

            this.timeChange();
        }

        timeChange() {
            // 切换时间
            this.strategyIdString = (this.$parent as any).pageData.strategyIdString;
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
                strategyCapital: (this.$parent as any).pageData.strategyCapital
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/strategy/queryStrategyByStrategyIdString', requestData, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                // 处理展示数据
                this.dealWith(type, resp?.data?.dateList);
                (this.$parent as any).pageData.maxWithdrawal = resp?.data?.maxWithdrawal;
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

        handBigClick(index:number) {
            // 选择展示收益方式
            if (index === 0) {
                this.$showToast('敬请期待！');
                return;
            }
            this.curBigIndex = index;
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
                        bottom: -10
                    },
                    {
                        type: 'inside'
                    },
                    {
                        xAxisIndex: [0, 1]
                    }
                ],

                legend: {
                    data: ['实盘收益', '模拟收益']
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
                        name: '实盘收益',
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
                        data: []
                    },
                    {
                        name: '模拟收益',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        lineStyle: {
                            color: '#D55648'
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
.hbb-nav{
    display: flex;
    width: 100%;
    height: 40px;
    /*justify-content: space-between;*/
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    span{
        float: left;
        width: 120px;
        height: 30px;
        &.active{
            color: #e74c3c;
            font-weight: bold;
        }
    }
}
    .hbb-selectBox{
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin: 5px 0;
        padding-right: 50px;
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
