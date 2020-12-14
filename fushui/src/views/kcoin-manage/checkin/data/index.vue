<!--签到数据统计-->
<template>
    <div>
        <div class="page-cap-title">
            签到数据统计
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">统计维度:</span>
                    <el-button :type="analysisType === 1 ? 'primary' : 'default'" @click="changeAnalysisType(1)">
                        按天
                    </el-button>
                    <el-button :type="analysisType === 2 ? 'primary' : 'default'" @click="changeAnalysisType(2)">
                        按月
                    </el-button>
                </div>
                <div class="search-union">
                    <span class="words">单个用户统计:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入用户手机号码"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
            </div>
        </div>

        <div>
            <div ref="chart1" class="chart-block block1" />
            <div ref="chart2" class="chart-block block2" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import echarts from 'echarts';

    let chart1: any = null;
    let chart2: any = null;
    @Component({
        components: {}
    })
    export default class extends Vue {
        analysisType = 1; // 1=按天  2=按月
        search: any = {
            phone: '' // 用户手机号码
        };

        dataList1: any[] = [];
        dataList2: any[] = [];

        async mounted() {
            this.initChart();
            await this.getDataList();
        }

        beforeDestroy() {
            if (chart1) {
                chart1.dispose();
                chart1 = null;
            }
            if (chart2) {
                chart2.dispose();
                chart2 = null;
            }
        }

        searchData() {
            this.getDataList();
        }

        async changeAnalysisType(idx: number) {
            this.analysisType = idx;
            this.getDataList();
        }

        initChart() {
            if (!chart1) {
                chart1 = echarts.init(this.$refs.chart1 as HTMLCanvasElement); // 表格初始化
            }
            if (!chart2) {
                chart2 = echarts.init(this.$refs.chart2 as HTMLCanvasElement); // 表格初始化
            }
            chart1.setOption({
                title: {
                    text: '签到次数'
                },
                grid: {
                    left: 0,
                    top: 40,
                    right: 0,
                    bottom: 20
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        inside: true,
                        verticalAlign: 'bottom',
                        interval: 2,
                        margin: 2
                    }
                },
                series: [{
                    data: [],
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: '#409eff'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#409eff'
                        }
                    }
                }],
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ]
            });
            chart2.setOption({
                title: {
                    text: 'K豆奖励'
                },
                grid: {
                    left: 0,
                    top: 40,
                    right: 0,
                    bottom: 20
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        inside: true,
                        verticalAlign: 'bottom',
                        interval: 2,
                        margin: 2
                    }
                },
                series: [{
                    data: [],
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: '#ff5855'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ff5855'
                        }
                    }
                }],
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ]
            });
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/signRecordCtrl/findSignRecordTable', {
                mobile: this.search.phone, // 支付通道
                type: this.analysisType
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list1: any = [];
                const list2: any = [];
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list1.push({
                        date: String(item.date),
                        signKeep: item.signKeep // 签到次数
                    });
                    list2.push({
                        date: String(item.date),
                        reward: item.reward // 奖励
                    });
                });
                this.dataList1 = list1;
                this.dataList2 = list2;
                this.setChart1();
                this.setChart2();
            } else {
            }
        }

        setChart1() {
            if (!chart1) {
                return;
            }
            // console.log('a');
            const xAxisData = this.dataList1.map((item: any) => item.date);
            const seriesData = this.dataList1.map((item: any) => item.signKeep);
            chart1.setOption({
                xAxis: {
                    data: xAxisData
                },
                series: {
                    data: seriesData
                }
            });
        }

        setChart2() {
            if (!chart2) {
                return;
            }
            const xAxisData = this.dataList2.map((item: any) => item.date);
            const seriesData = this.dataList2.map((item: any) => item.reward);
            chart2.setOption({
                xAxis: {
                    data: xAxisData
                },
                series: {
                    data: seriesData
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .chart-block{
        width: 700px;
        height: 300px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
    }
</style>
