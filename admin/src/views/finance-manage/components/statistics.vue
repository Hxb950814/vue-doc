<template>
    <div style="float:left;width:100%;border-top: 1px solid #ddd;">
        <!-- 切换数据 -->
        <div class="hbb-selectBox">
            <span class="words" style="margin-right: 10px">时间段:</span>
            <el-select v-model="search.day" clearable placeholder="请选择" @change="timeChange">
                <el-option
                    v-for="item in dayList"
                    :key="item.day"
                    :label="item.title"
                    :value="item.day"
                />
            </el-select>
            <div class="search-union" style="display: flex;align-items: center;margin-left: 50px">
                <span class="words" style="margin-right: 10px">营收时间:</span>
                <div class="input-text">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @change="dateCheck"
                    />
                </div>
            </div>
            <div class="search-union right" style="margin-left: 50px">
                <el-button type="primary" @click="searchData">
                    查询
                </el-button>
            </div>
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
    import {sub} from '@/utils/number';
    let chart: echarts.ECharts | undefined; // 图表
    @Component({
        components: {

        }
    })
    export default class extends Vue {
        nearData:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月
        nearDataTwo:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月 copy
        nearDataY1:any[] = []; // 折线图数据数组 支出
        nearDataY2:any[] = []; // 折线图数据数组 收入
        nearDataY3:any[] = []; // 折线图数据数组 实际收入
        navList:any[] = []; // 统计图表的选择按钮
        timeType:number = 0; // 当前所选的按钮

        maxVal:number = 0; // 数据最大值
        minVal:number = 0; // 数据最小值

        time = ''; // 时间桥接

        search:any = {
            day: 7, // 时间间隔
            startTime: '', // 开始时间
            endTime: '' // 结束时间
        };

        dayList:any[] = [
            {title: '近7天', day: 7},
            {title: '近30天', day: 30},
            {title: '近半年', day: 180},
            {title: '近一年', day: 360}
        ]

        pickerOptions:any = {
            shortcuts: [{
                text: '最近一周',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        }

        async mounted() {
            this.init();
            this.searchData();
        }

        searchData() {
            // 查询数据.
            this.nearData = [];
            this.nearDataY1 = [];
            this.nearDataY2 = [];
            this.nearDataY3 = [];
            this.nearDataTwo = [];
            this.getDetail(String(this.search.day));
        }

        init() {
            // 近7天
            // 取得选项列表  跟父元素的按钮配置数据相同
            const chart1Dom = document.getElementById('chart1');
            if (!chart1Dom) {
                throw new Error('选择器 #chart1 对应的dom不存在');
            }
            const width = getComputedStyle(chart1Dom).width;
            const size = {
                width: parseFloat(width),
                height: 520
            };
            chart = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化
        }

        timeChange() {
            // 切换时间间隔
            this.nearData = [];
            this.nearDataY1 = [];
            this.nearDataY2 = [];
            this.nearDataY3 = [];
            this.nearDataTwo = [];
            this.search.startTime = '';
            this.time = '';
            this.search.endTime = '';
            this.getDetail(String(this.search.day));
        }

        dateCheck() {
            this.search.startTime = dayjs(this.time[0]).format('YYYY-MM-DD');
            this.search.endTime = dayjs(this.time[1]).format('YYYY-MM-DD');
            this.search.day = '';
            this.nearData = [];
            this.nearDataY1 = [];
            this.nearDataY2 = [];
            this.nearDataY3 = [];
            this.nearDataTwo = [];
        }

        async getDetail(type:string) {
            const requestData = {
                day: this.search.day,
                endTime: this.search.endTime,
                startTime: this.search.startTime
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/finance/getMoneyStatistic', requestData, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                // 处理展示数据
                this.dealWith(type, resp?.data?.list);
                this.$emit('successPostEvent', resp?.data?.total);
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
                    case '7':
                        this.nearData.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataTwo.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataY1.push(x.income);
                        this.nearDataY2.push(x.award);
                        this.nearDataY3.push(sub(x.income, x.withdraw));
                        break;
                    case '30':
                        this.nearDataTwo.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearData.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataY1.push(x.income);
                        this.nearDataY2.push(x.award);
                        this.nearDataY3.push(sub(x.income, x.withdraw));
                        break;
                    case '180':
                        if (i <= (lengthIndex / 7)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 7 * i].time).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataY1.push(x.income);
                        this.nearDataY2.push(x.award);
                        this.nearDataY3.push(sub(x.income, x.withdraw));
                        break;
                    case '360':
                        if (i <= (lengthIndex / 30)) {
                            this.nearDataTwo.unshift(dayjs(arr[lengthIndex - 30 * i].time).format('YYYY-MM-DD'));
                        }
                        this.nearData.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataY1.push(x.income);
                        this.nearDataY2.push(x.award);
                        this.nearDataY3.push(sub(x.income, x.withdraw));
                        break;
                    default:
                        this.nearDataTwo.push(dayjs(arr[i].time).format('YYYY-MM-DD'));
                        this.nearData.push(dayjs(x.time).format('YYYY-MM-DD'));
                        this.nearDataY1.push(x.income);
                        this.nearDataY2.push(x.award);
                        this.nearDataY3.push(sub(x.income, x.withdraw));
                        break;
                }
                this.maxVal = Math.max.apply(Math, this.nearDataY1);
                this.minVal = Math.min.apply(Math, this.nearDataY1);
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
                        type: 'value'
                        // min: this.maxVal,
                        // max: this.minVal
                    }
                ],
                series: [
                    {
                        name: '收入金额',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        lineStyle: {
                            color: '#D9EDFF'
                        },
                        data: this.nearDataY1
                    },
                    {
                        name: '支出金额',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        lineStyle: {
                            color: '#9BD408'
                        },
                        data: this.nearDataY2
                    },
                    {
                        name: '实际收入',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        lineStyle: {
                            color: '#F5A659'
                        },
                        data: this.nearDataY3
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
    .charts{
        margin-top: 30px;

    }
    .hbb-selectBox{
        display: flex;
        width: 100%;
        align-items: center;
        margin: 5px 0;
        padding: 0 10px;
        margin-top: 30px;
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
