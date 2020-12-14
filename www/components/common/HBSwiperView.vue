<template>
    <div>
        <div v-show="true" id="chart1" ref="chart1" class="chart-map" />
        <div id="mySwiper" class="swiper-container">
            <div v-if="dataList.length>0" class="swiper-wrapper">
                <div v-for="(item,index) in dataList" :key="index" class="swiper-slide">
                    <div class="slide-wrap">
                        <div class="title">
                            <span class="l1">{{ item.strategyName }}</span>
                            <span class="l2">使用人数<span class="sp" style="color: #ff2f2f">{{ item.userTime }}</span>人</span>
                        </div>
                        <div class="hbb-box">
                            <div class="bottom-part">
                                <div class="chart">
                                    <div class="hbb-selectBox">
                                        <div>
                                            <span v-if="item.strategyLabel1">{{ item.strategyLabel1 }}</span>
                                            <span v-if="item.strategyLabel2">{{ item.strategyLabel2 }}</span>
                                            <span v-if="item.strategyLabel3">{{ item.strategyLabel3 }}</span>
                                        </div>
                                        <el-select v-model="timeType" placeholder="请选择" @change="timeChange">
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
                                        <div :class="'echartBox' + index" />
                                    </div>
                                </div>
                            </div>
                            <div class="menus">
                                <div class="cap top-cap">
                                    <p class="text1" :class="{
                                        up: curSlideObj.historyProfit > 0,
                                        down: curSlideObj.historyProfit < 0
                                    }"
                                    >
                                        {{ curSlideObj.historyProfit }}%
                                    </p>
                                    <p class="text2">
                                        累计盈利
                                    </p>
                                </div>
                                <template v-for="(item,index) in navList">
                                    <div v-if="index<4" :key="index" class="cap common-cap" :style="{borderLeft: index%2 === 0 ? '1px solid #eee': 0, borderTop: index<=1 ? '1px solid #eee': 0}">
                                        <p class="text1" :class="{
                                            up: item.value > 0,
                                            down: item.value < 0
                                        }"
                                        >
                                            {{ item.value }}%
                                        </p>
                                        <p class="text2">
                                            {{ item.title }}
                                        </p>
                                    </div>
                                </template>
                                <div class="cap common-cap" style="border-left: 1px solid #eee">
                                    <p class="text1 down">
                                        {{ curSlideObj.maxWithdrawal }}%
                                    </p>
                                    <p class="text2">
                                        最大回撤
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        {{ curSlideObj.fundTopLimit }}万
                                    </p>
                                    <p class="text2">
                                        资金上限
                                    </p>
                                </div>
                                <button class="cap bottom-cap" @click.stop="goDetail(item)">
                                    查看策略
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
    import Swiper from 'swiper';
    import echarts from 'echarts';
    import dayjs from 'dayjs';
    import { postAsync } from '~/utils/request';
    let chart: echarts.ECharts | undefined; // 图表
    @Component({

    })

    export default class extends Vue {
        @Prop({ type: String, default: '', required: false })
        mode?:string;

        dataList:any[] = [];
        swipeDom:any = {};

        nearData:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月
        nearDataTwo:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月 copy
        nearDataY:any[] = []; // 折线图数据数组
        navList:any[] = [
            { timeType: 0, title: '近7天' },
            { timeType: 1, title: '近1月' },
            { timeType: 3, title: '近3月' },
            { timeType: 6, title: '近半年' },
            { timeType: 12, title: '近1年' },
            { timeType: 24, title: '近2年' },
            { timeType: 36, title: '近3年' },
            { timeType: 48, title: '近4年' }
        ];

        listCopy:any[] = []; // navList copy体

        timeType:number = 0; // 当前所选的按钮
        strategyIdString:string = ''; // 策略ID
        strategyCapital:string = ''; // 策略本金
        strategyId:string = ''; // 策略本金

        historyProfit:number = 11.33; // 历史年化率
        maxWithdrawal:number = 15567.18; // 最大回撤
        profit:number = -8.84; // 年化率
        sharpRate:number = 0; // 夏普率

        maxVal:number = 0; // 数据最大值
        minVal:number = 0; // 数据最小值

        chart1Dom:any= {};
        curId:number = 0;

        curSlideObj:any = {
            historyProfit: '', // 累计盈亏
            fundTopLimit: '', // 资金上限
            maxWithdrawal: '' // 最大回撤
        }

        mounted() {
            this.listCopy = JSON.parse(JSON.stringify(this.navList));
            this.getViewData();
        }

        initSwiper() {
            const _this = this;
            this.$nextTick(() => {
                // eslint-disable-next-line no-new
                this.swipeDom = new Swiper('#mySwiper', {
                    loop: true,
                    // 如果需要分页器
                    speed: 300,
                    initialSlide: 0,
                    observer: true, // 启动动态检查器(OB/观众/观看者)
                    observeParents: true, // 修改swiper的父元素时，自动初始化swiper
                    on: {
                        slideChangeTransitionStart(swiper) {
                            _this.nearData = [];
                            _this.nearDataY = [];
                            _this.nearDataTwo = [];
                            if (swiper.activeIndex > _this.dataList.length - 1) {
                                swiper.activeIndex = 1;
                                _this.swipeDom.slideToLoop(0, 1000, false); // 切换到第一个slide，速度为1秒
                            }
                            if (swiper.activeIndex < 1) {
                                swiper.activeIndex = _this.dataList.length - 1;
                                _this.swipeDom.slideToLoop(_this.dataList.length - 2, 1000, false); // 切换到第一个slide，速度为1秒
                            }
                            _this.getPicData(swiper.activeIndex);// 切换结束时，告诉我现在是第几个slide
                        }
                    }
                });
            });
        }

        async getViewData() {
            const [err, resp] = await postAsync('/strategy/strategyDisplayList', {
                pageType: this.mode,
                useClient: 1
            });
            if (resp?.code === '000000') {
                // 缓存一下
                this.dataList = resp?.data;
                const obj = this.dataList[this.dataList.length - 1];
                this.dataList.push(obj);
                setTimeout(() => {
                    this.initSwiper();
                }, 0);
            }
        }

        getPicData (id:number) {
            const arr:any[] = [];
            this.curId = id - 1;
            (this.dataList[this.curId] as any).strategyProfitChartConfigList.forEach((x:any) => {
                this.listCopy.filter((y:any) => {
                    return y.timeType === x.timeType;
                }).map((z:any, i:number) => {
                    arr.push(z);
                });
            });
            this.timeType = arr[0].timeType;
            this.strategyIdString = (this.dataList[this.curId] as any).strategyIdString;
            this.strategyCapital = (this.dataList[this.curId] as any).strategyCapital;
            this.strategyId = (this.dataList[this.curId] as any).strategyId;
            this.navList = arr;
            this.init();
            this.getRightData();
        }

        async getRightData() {
            // 取得右边的数据统计
            const requestData = {
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/queryStrategyByStrategyId', requestData);
            if (resp?.code === '000000') {
                const {
 historyProfit, strategyProfitChartConfigList, fundTopLimit,
                    maxWithdrawal
} = resp?.data;
                    this.curSlideObj.fundTopLimit = fundTopLimit || 0; // 资金上限
                    this.curSlideObj.maxWithdrawal = maxWithdrawal || 0; // 最大回撤
                    this.curSlideObj.historyProfit = historyProfit || 0; // 7天
                    const arr:any[] = [];
                    strategyProfitChartConfigList.forEach((x:any) => {
                        this.navList.filter((y:any) => {
                            return y.timeType === x.timeType;
                        }).map((z:any) => {
                            z.value = x.profit;
                            arr.push(z);
                        });
                    });
                    this.navList = arr;
            } else {
                this.$showToast(resp!.message);
            }
        }

        init() {
            // 近7天
            setTimeout(() => {
                const chart1Dom = document.getElementById('chart1');
                if (!chart1Dom) {
                    throw new Error('选择器 #chart1 对应的dom不存在');
                }
                const canvasDomCur = document.getElementsByClassName('echartBox' + this.curId)[0];
                const width = getComputedStyle(canvasDomCur).width;
                const size = {
                    width: parseFloat(width),
                    height: 320
                };
                chart = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化
                this.chart1Dom = chart1Dom;
                this.getDetail(String(this.timeType));
            }, 0);
        }

        timeChange() {
            // 切换时间
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
            const [err, resp] = await postAsync('/strategy/queryStrategyByStrategyIdString', requestData);

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
                // dataZoom: [
                //     {
                //         orient: 'horizontal',
                //         show: true,
                //         start: 0,
                //         end: 100,
                //         height: 10,
                //         bottom: 0
                //     },
                //     {
                //         type: 'inside'
                //     },
                //     {
                //         xAxisIndex: [0, 1]
                //     }
                // ],

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
                        show: false,
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
                        max: this.maxVal,
                        min: this.minVal
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
            const canvasDomCur = document.getElementsByClassName('echartBox' + this.curId)[0];
            canvasDomCur.appendChild(this.chart1Dom);
        }

        goDetail(item:any) {
            // 去策略详情页面
            this.$router.push({
                path: '/strategy/detail',
                query: {
                    id: item.strategyId
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .swiper-container {
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        overflow: hidden;
        list-style: none;
        padding: 0;
        cursor: pointer;
        z-index: 1;
        .swiper-wrapper{
            height: 100%;
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 1;
            display: flex;
            transition-property: transform;
            box-sizing: content-box;
        }
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        height:100%;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        transition-property: transform;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        .slide-wrap {
            width: 100%;

            .title {
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;

                .l1 {
                    color: #333;
                    font-size: 16px;
                }

                .l2 {
                    color: #999;
                    font-size: 14px;

                    &.sp {
                        color: #ff1a02;
                    }
                }
            }

            .hbb-box{
                display: flex;
                width: 100%;
                .bottom-part {
                    display: flex;
                    width: calc(100% - 300px);

                    .chart {
                        display: flex;
                        flex-direction: column;
                        background-color: #fff;
                        width: 100%;
                        border-radius: 5px;
                        .hbb-selectBox{
                            display: flex;
                            width: 100%;
                            justify-content: space-between;
                            align-items: center;
                            padding: 0 20px;
                            div{
                                span{
                                    margin-right: 5px;
                                    padding: 5px 6px;
                                    background: #E3F2FF;
                                    color: #0086FF;
                                }
                            }
                            .el-select{
                                width: 100px;
                            }
                        }

                    }
                }

                .menus {

                    display: flex;
                    width: 300px;
                    flex-wrap: wrap;
                    /*justify-content: space-between;*/
                    margin-left: 10px;
                    display: flex;
                    border-radius: 5px;
                }
            }

            .cap {
                width: 50%;
                text-align: center;
                margin-bottom: 4px;
                border-radius: 4px;
                flex-direction: column;
                display: flex;
                justify-content: center;

                .text1 {
                    font-size: 20px;
                    &.up{
                        color: #FF5D5A;
                    }
                    &.down{
                        color: #00e700;
                    }
                }

                .text2 {
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
                }
            }

            .top-cap {
                background-color: #fff;
                width: 100%;
                height: 75px;
            }

            .common-cap {
                background-color: #fff;
                width: calc(50% - 2px);
                /*height: 50px;*/
                border-radius: 0;
                margin-bottom: 0;
                margin-left: 0;
                border: 1px solid #eee;
                border-top: 0;
                border-left: 0;
                .text1 {
                    font-size: 16px;
                }

                .text2 {
                    font-size: 12px;
                    margin-top: 2px;
                }
            }

            .bottom-cap {
                text-align: center;
                width: 100%;
                background-color: #ff8c57;
                height: 44px;

                line-height: 44px;
                color: #fff;
                font-size: 16px;
                border: none;
                -webkit-appearance: none;
                padding: 0;
                margin: 0;
                margin-top: 15px;
                border-radius: 4px;
                outline: none;
                cursor: pointer;
                display: block;
                flex-direction: row;

                &:active {
                    outline: none;
                }
            }
        }
    }
</style>
