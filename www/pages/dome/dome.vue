<template>
    <div>
        这是scoket连接Dome的页面
        <div class="hbb-nav">
            <span v-for="(item,index) in navData" :key="index" :class="curIndex === index ? 'active': ''" @click="handClick(item,index)">{{ item.title }}</span>
        </div>
        <div class="charts">
            <div id="chart1" ref="chart1" style="width:700px" class="chart-map" />
        </div>
        <!-- 瀑布流 布局-->
        <div class="swiper-container">
            <div v-if="dataList.length>0" class="swiper-wrapper">
                <div v-for="(item,index) in dataList" :key="index" class="swiper-slide">
                    <div class="slide-wrap">
                        <div class="title">
                            <span class="l1">这是第{{ index+1 }}个策略</span>
                            <span class="l2">使用人数<span class="sp">{{ item.id }}</span>人</span>
                        </div>
                        <div class="bottom-part">
                            <div class="chart" />
                            <div class="menus">
                                <div class="cap top-cap">
                                    <p class="text1">
                                        -13.00%
                                    </p>
                                    <p class="text2">
                                        累计盈利2
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        -3.00%
                                    </p>
                                    <p class="text2">
                                        近7天
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        -3.00%
                                    </p>
                                    <p class="text2">
                                        近1月
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        -3.00%
                                    </p>
                                    <p class="text2">
                                        近3月
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        -3.00%
                                    </p>
                                    <p class="text2">
                                        近6月
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        30.00%
                                    </p>
                                    <p class="text2">
                                        最大回撤
                                    </p>
                                </div>
                                <div class="cap common-cap">
                                    <p class="text1">
                                        30万
                                    </p>
                                    <p class="text2">
                                        资金上限
                                    </p>
                                </div>
                                <button class="cap bottom-cap">
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
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { ContractDataSocket } from '@common/src/future';
    import echarts from 'echarts'; // 图表
    let dataSocketInstance: any;
    let chart: echarts.ECharts | undefined;
    @Component({
        components: {  }
    })
    export default class extends Vue {
        nearData:any[] = []; // 折线图下方的x配置 最近一周  最近3个月 最近6个月
        navData:any[] = [
            { id: 1, title: '近7天' },
            { id: 2, title: '近一个月' },
            { id: 3, title: '近三个月' },
            { id: 4, title: '近半年' },
            { id: 5, title: '近一年' },
            { id: 6, title: '近两年' }
        ];

        curIndex:number = 0;
        dataList:any[] = [
            { id: 1, title: '12111' },
            { id: 2, title: '12111' },
            { id: 3, title: '12111' }
        ]

        swipeDom:any = {};

        async mounted() {
            const _this = this;
           const chart1Dom = document.getElementById('chart1');
            if (!chart1Dom) {
                throw new Error('选择器 #chart1 对应的dom不存在');
            }
            const width = getComputedStyle(chart1Dom).width;
            const size = {
                width: parseFloat(width),
                height: parseFloat(width)
            };
            chart = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化

            // 创建
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                if (errCode === 0) {
                    console.log(incomeData);
                } else {
                    console.log('error');
                }
            });
            await dataSocketInstance.connect();
            // 链接socket进行数据获取
            /* 开启socket */

            dataSocketInstance.sendContractTickGroupMessage(['CJ007MSP.ZCE', 'AL2009ASP160.SHFE']);
            setTimeout(() => {
                dataSocketInstance.sendCancelContractTickGroupMessage(['CJ007MSP.ZCE', 'AL2009ASP160.SHFE']);
            }, 4000);
            this.init();
        }

        init() {
            // 近7天
            this.getKmonth(1, 7);
        }

        getKmonth(type:number, n:number) {
            // type:1 取天数 2：月份  3：年份
            // 先取到当前日期对象
            const date = new Date();
            const month = date.getMonth();
            const years = date.getFullYear();
            let curMonth:any = month + 1;
            if (type === 1) {
                // 取最近一周
                for (let i = 0; i < n; i++) {
                    this.nearData.push(n - i);
                }
                if (curMonth < 10) {
                    curMonth = '0' + curMonth;
                }
                this.nearData = this.nearData.sort((a, b) => a - b).map((x) => {
                    if (x < 10) {
                        x = '0' + x;
                    }
                    return (x = String(years) + '-' + curMonth + '-' + x);
                });
            } else {
                // 取月份
                this.nearData.push(curMonth);
                for (let i = 1; i <= n; i++) {
                    this.nearData.push(curMonth - i);
                }
                this.nearData = this.nearData.sort((a, b) => a - b).map((x) => {
                    if (x < 10) {
                        x = '0' + x;
                    }
                    return (x = String(years) + '-' + x);
                });
            }

            console.log(this.nearData);

            setTimeout(() => {
                this.getData();
            }, 500);
        }

        handClick (item:any, index:number) {
            // 点击导航切换下方的配置

            // 获取当前月份的天数
            const curDate = new Date();
            const curMonth = curDate.getMonth() + 1;
            curDate.setMonth(curMonth, 0);
            const days = curDate.getDate();
            // 每次切换重置x的数据
            this.nearData = [];
            this.curIndex = index;
            switch (index) {
                case 0:
                    this.getKmonth(1, 7);
                    break;
                case 1:
                    this.getKmonth(1, days);
                    break;
                case 2:
                    this.getKmonth(2, 2);
                    break;
                case 3:
                    this.getKmonth(2, 5);
                    break;
                case 4:
                    this.getKmonth(2, 11);
                    break;
                case 5:
                    this.getKmonth(2, 23);
                    break;
                default:
                    break;
            }
        }

        getData() {
            const option = {
                title: {
                    text: 'test'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#ffaa00'
                        }
                    }
                },
                dataZoom: [
                    {
                        orient: 'horizontal',
                        show: true,
                        start: 0,
                        end: 100,
                        height: 20,
                        bottom: 0
                    },
                    {
                        type: 'inside'
                    }
                ],

                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        },
                        data: this.nearData
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [1200, 132, 101, 134, 90, 230, 210, 90]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310, 90]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410, 90]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [320, 332, 301, 334, 390, 330, 320, 90]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {},
                        data: [820, 932, 901, 934, 1290, 10, 1320, 90]
                    }
                ]
            };
            chart && chart.setOption(option as echarts.EChartOption); // 绘制
        }
    }
</script>

<style lang="scss">
.hbb-nav{
    display: flex;
    width: 800px;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    span{
        &.active{
            color: #e74c3c;
            font-weight: bold;
        }
    }
}
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

        .bottom-part {
            display: flex;
            justify-content: space-between;

            .chart {
                background-color: #fff;
                width: 590px;
                border-radius: 5px;
            }
        }

        .menus {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-left: 10px;
            border-radius: 5px;
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
            height: 50px;
            border-radius: 4px;

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
