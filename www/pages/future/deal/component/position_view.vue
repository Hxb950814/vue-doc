<template>
    <div class="visual-area">
        <div :class="mode === '1' ? 'search-lines': 'search-lines search-linesNo'">
            <div class="item">
                <span>日期</span>
                <el-date-picker v-model="time"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                style="width: 180px" :picker-options="searchTimeOpt"
                />
            </div>
            <div class="item">
                <span>交易所</span>
                <el-select v-model="source" style="width: 180px">
                    <el-option value="" label="全部" />
                    <el-option
                        v-for="(item,idx) in sourceList"
                        :key="idx"
                        :value="item.id"
                        :label="item.name"
                    />
                </el-select>
            </div>
            <div class="item">
                <span>品种</span>
                <el-select v-model="species" style="width: 180px">
                    <el-option
                        v-for="(item,idx) in speciesList"
                        :key="idx"
                        :value="item.id"
                        :label="item.name"
                    />
                </el-select>
            </div>
            <div class="item">
                <span>合约</span>
                <el-select v-model="contracts" style="width: 180px">
                    <el-option
                        v-for="(item,idx) in contractsList"
                        :key="idx"
                        :value="item.id"
                        :label="item.name"
                    />
                </el-select>
            </div>
            <div class="item">
                <span class="anounce" @click="clickNoDuty">
                    <i class="el-icon-warning-outline" style="font-size: 18px" />
                    免责声明
                </span>
            </div>
        </div>
        <div :class="mode === '1' ? 'data-grip': 'data-grip search-linesNo'">
            <div>
                <div v-show="mode === '1'" class="charts">
                    <div id="chart1" ref="chart1" class="chart-map" />
                    <div v-show="dataListVolume.length === 0" class="hbb-noData">
                        暂无数据
                    </div>
                </div>
                <div class="detail-table-wrap">
                    <table class="detail-table">
                        <thead>
                            <tr class="">
                                <th>名次</th>
                                <th>名称</th>
                                <th>
                                    <span class="label">
                                        成交量
                                    </span>
                                    <!--                                    <i class="el-icon-d-caret" />-->
                                </th>
                                <th>
                                    <span class="label">增减</span>
                                    <!--                                    <i class="el-icon-d-caret" />-->
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div class="detail-out" :style="{maxHeight: mode === '2' ? tHeight + 'px': 'auto'}">
                        <table class="detail-table">
                            <tbody v-if="dataListVolume.length > 0">
                                <tr v-for="(item,idx) in dataListVolume" :key="item.idx">
                                    <td><span class="rank">{{ idx + 1 }}</span></td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.volume }}</td>
                                    <td>
                                        <span v-if="item.increaseDecrease > 0" class="up">
                                            {{ item.increaseDecrease }}
                                            <i class="arrow el-icon-top" />
                                        </span>
                                        <span v-else-if="item.increaseDecrease < 0" class="down">
                                            {{ item.increaseDecrease }}
                                            <i class="arrow el-icon-bottom" />
                                        </span>
                                        <span v-else>{{ item.increaseDecrease }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table v-if="dataListVolume.length > 0" class="detail-table">
                        <tr :style="{borderTop: mode === '1' ? '' : '1px solid #fff'}">
                            <td>总计</td>
                            <td>&nbsp;&nbsp;</td>
                            <td>{{ total11 }}</td>
                            <td>{{ total12 }}</td>
                        </tr>
                    </table>
                    <div v-if="dataListVolume.length === 0" class="no-data">
                        暂无数据
                    </div>
                </div>
            </div>
            <div>
                <div v-show="mode === '1'" class="charts">
                    <div id="chart2" ref="chart2" class="chart-map" />
                    <div v-show="dataListNormalOpenInterest.length === 0" class="hbb-noData">
                        暂无数据
                    </div>
                </div>
                <div class="detail-table-wrap">
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>名次</th>
                                <th>名称</th>
                                <th>
                                    <span class="label">
                                        多单持仓
                                    </span>
                                <!--                                            <i class="el-icon-caret-bottom" />-->
                                </th>
                                <th>
                                    <span class="label">
                                        增减
                                    </span>
                                <!--                                            <i class="el-icon-d-caret" />-->
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div class="detail-out" :style="{maxHeight: mode === '2' ? tHeight + 'px': 'auto'}">
                        <table class="detail-table">
                            <tbody v-if="dataListNormalOpenInterest.length > 0">
                                <tr v-for="(item,idx) in dataListNormalOpenInterest" :key="item.idx">
                                    <td><span class="rank">{{ idx + 1 }}</span></td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.normalOpenInterest }}</td>
                                    <td>
                                        <span v-if="item.normalIncreaseDecrease > 0" class="up">
                                            {{ item.normalIncreaseDecrease }}
                                            <i class="arrow el-icon-top" />
                                        </span>
                                        <span v-else-if="item.normalIncreaseDecrease < 0" class="down">
                                            {{ item.normalIncreaseDecrease }}
                                            <i class="arrow el-icon-bottom" />
                                        </span>
                                        <span v-else>{{ item.normalIncreaseDecrease }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table v-if="dataListNormalOpenInterest.length > 0" class="detail-table">
                        <tr :style="{borderTop: mode === '1' ? '' : '1px solid #fff'}">
                            <td>总计</td>
                            <td>&nbsp;&nbsp;</td>
                            <td>{{ total21 }}</td>
                            <td>{{ total22 }}</td>
                        </tr>
                    </table>
                    <div v-if="dataListVolume.length === 0" class="no-data">
                        暂无数据
                    </div>
                </div>
            </div>
            <div>
                <div v-show="mode === '1'" class="charts">
                    <div id="chart3" ref="chart3" class="chart-map" />
                    <div v-show="dataListInvertedOpenInterest.length === 0" class="hbb-noData">
                        暂无数据
                    </div>
                </div>
                <div class="detail-table-wrap">
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>名次</th>
                                <th>名称</th>
                                <th>
                                    <span class="label">空单持仓</span>
                                <!--                                            <i class="el-icon-caret-bottom" />-->
                                </th>
                                <th>
                                    <span class="label">增减</span>
                                <!--                                            <i class="el-icon-d-caret" />-->
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div class="detail-out" :style="{maxHeight: mode === '2' ? tHeight + 'px': 'auto'}">
                        <table class="detail-table">
                            <tbody v-if="dataListInvertedOpenInterest.length > 0">
                                <tr v-for="(item,idx) in dataListInvertedOpenInterest" :key="item.idx">
                                    <td><span class="rank">{{ idx + 1 }}</span></td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.invertedOpenInterest }}</td>
                                    <td>
                                        <span v-if="item.invertedIncreaseDecrease > 0" class="up">
                                            {{ item.invertedIncreaseDecrease }}
                                            <i class="arrow el-icon-top" />
                                        </span>
                                        <span v-else-if="item.invertedIncreaseDecrease < 0" class="down">
                                            {{ item.invertedIncreaseDecrease }}
                                            <i class="arrow el-icon-bottom" />
                                        </span>
                                        <span v-else>{{ item.invertedIncreaseDecrease }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table v-if="dataListInvertedOpenInterest.length > 0" class="detail-table">
                        <tr :style="{borderTop: mode === '1' ? '' : '1px solid #fff'}">
                            <td>总计</td>
                            <td>&nbsp;&nbsp;</td>
                            <td>{{ total31 }}</td>
                            <td>{{ total32 }}</td>
                        </tr>
                    </table>
                    <div v-if="dataListInvertedOpenInterest.length === 0" class="no-data">
                        暂无数据
                    </div>
                </div>
            </div>
        </div>
        <!--免责申明-->
        <div v-if="showDutyPanel" class="noduty-mask">
            <div class="panel">
                <div class="title">
                    免责声明
                </div>
                <i class="el-icon-close close" @click="closeDutyPanel" />
                <div class="content">
                    <p>
                        除非另有说明，武汉富水数据有限公司对本数据分析系统的服务及其内容的准确性、完整性不做任何形式的担保。
                        由于互联网以及卫星通讯方面的各个因素，武汉富水数据有限公司不担保服务的可靠性，对服务的及时性、安全性、出错发生均不作担保。
                        此数据分析系统所载的全部内容仅作参考之用，不构成对任何人的投资建议，且武汉富水数据有限公司不因接收人收到此数据分析的内容而视其为客户。
                    </p>
                    <p>
                        此数据分析系统服务可能不适合阁下，
                        我们建议阁下如有任何疑问应咨询独立投资顾问。此数据分析系统服务不构成投资、法律、会计或税务建议，且不担保任何投资及策略适合阁下。此数据分析系统服务并不构成给予阁下的私人咨询建议。
                    </p>
                    <p>
                        武汉富水数据有限公司保留一切权利。
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import echarts from 'echarts';
    import { getAsync } from '~/utils/request';
    let chart1: echarts.ECharts | undefined; // 图表
    let chart2: echarts.ECharts | undefined; // 图表
    let chart3: echarts.ECharts | undefined; // 图表
    @Component({})
    export default class extends Vue {
        time = ''; // 时间
        source = ''; // 交易所
        species = ''; // 品种
        contracts = ''; // 合约

        showDutyPanel = false; // 查看免责条款弹层是否启动

        sourceList: any[] = []; // 交易所数据
        speciesList: any[] = [] ; // 品种数据
        contractsList: any[] = []; // 合约数据

        searchTimeOpt: any = {};

        orderTypeVolumeDir = 'up'; // 市场成交量
        orderTypeIncreaseDecreaseDir = 'up'; // 市场增减
        orderTypeNormalOpenInterestDir = 'up'; // 多单持仓量
        orderTypeNormalIncreaseDecreaseDir = 'up'; // 多单增减
        orderTypeInvertedOpenInterestDir = 'up'; // 空单持仓量
        orderTypeInvertedIncreaseDecreaseDir = 'up'; // 空单增减

        dataListVolume: any[] = [];
        dataListNormalOpenInterest: any[] = [];
        dataListInvertedOpenInterest: any[] = [];

        total11 = 0;
        total12 = 0;

        total21 = 0;
        total22 = 0;

        total31 = 0;
        total32 = 0;

        tHeight:number = 0; // 高度范围

        @Prop({ type: String, default: '', required: false })
        mode!:string

        setData(row:any) {
            // 设置页面搜索初始数据
            this.source = row.sourceId;
            setTimeout(() => {
                this.species = String(row.quotationSpeciesId);
            }, 0);
            setTimeout(() => {
                this.contracts = String(row.quotationContractId); // 合约
            }, 10);
        }

        mounted() {
            // 初始化默认选择昨天的数据
            setTimeout(() => {
                if (this.mode === '2') {
                    this.tHeight = (this.$parent as any).tableScrollHeight;
                }
                const yesToday = new Date();
                yesToday.setTime(yesToday.getTime() - 24 * 60 * 60 * 1000);
                const yesTodayDate = yesToday.getFullYear() + '-' + (yesToday.getMonth() + 1) + '-' + yesToday.getDate();
                this.time = dayjs(yesTodayDate).format('YYYY-MM-DD');
                this.searchTimeOpt.disabledDate = (time: Date) => {
                    // 今天只能选昨天的时间, 不能选周六周日的时间
                    const now = new Date();
                    if (time.valueOf() >= new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`).valueOf()) {
                        return true;
                    }
                    const weekDay = time.getDay();
                    return weekDay === 6 || weekDay === 0;
                };

                const chart1Dom = document.getElementById('chart1');
                if (!chart1Dom) {
                    throw new Error('选择器 #chart1 对应的dom不存在');
                }
                const width = getComputedStyle(chart1Dom).width;
                const size = {
                    width: parseFloat(width),
                    height: parseFloat(width)
                };
                chart1 = echarts.init(this.$refs.chart1 as HTMLCanvasElement, undefined, size); // 表格初始化
                chart2 = echarts.init(this.$refs.chart2 as HTMLCanvasElement, undefined, size); // 表格初始化
                chart3 = echarts.init(this.$refs.chart3 as HTMLCanvasElement, undefined, size); // 表格初始化
                this.getDataSource();
                this.getData();
                this.getTableDataSort(1);
                this.getTableDataSort(2);
                this.getTableDataSort(3);
            }, 0);
        }

        /* 获得交易所数据 */
        async getDataSource() {
            const [err, resp] = await getAsync('/quotation/selectQuotationSourceAll', {});
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationSourceId),
                        name: item.sourceName
                    });
                });
                this.sourceList = list;
            }
        }

        /* 根据交易所数据获得种类数据 */
        async getDataSpecies() {
            const [err, resp] = await getAsync('/quotation/getQuotationSpeciesByQuotationSourceId', {
                quotationSourceId: this.source
            });
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationSpeciesId),
                        name: item.speciesName
                    });
                });
                this.speciesList = list;
            }
        }

        /* 根据行情种类获得品类数据 */
        async getDataContract() {
            const [err, resp] = await getAsync('/quotation/getQuotationContractByQuotationSpeciesId', {
                quotationSpeciesId: this.species
            });
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationContractId),
                        name: item.contractName
                    });
                });
                this.contractsList = list;
            }
        }

        @Watch('source')
        onSourceChange() {
            this.species = ''; // 先清空
            this.contracts = ''; // 先清空
            this.getDataSpecies();
            this.onSearch();
        }

        @Watch('species')
        onSpeciesChange() {
            this.contracts = ''; // 先清空
            this.getDataContract();
            this.onSearch();
        }

        @Watch('contracts')
        onContractChange(val: string) {
            this.onSearch();
        }

        @Watch('time')
        onTimeChange(val: string) {
            this.onSearch();
        }

        private onSearch() {
            if (this.contracts === '') {
                // id是空的，直接置空
            }
            this.getData();
            this.getTableDataSort(1);
            this.getTableDataSort(2);
            this.getTableDataSort(3);
        }

        clickNoDuty() {
            // 查看免责条款
            this.showDutyPanel = true;
        }

        closeDutyPanel() {
            // 关闭免责条款
            this.showDutyPanel = false;
        }

        async getData() {
            // hbb修改 不通过同个接口请求  根据每个组的数据去展示
            const char1Data: any[] = [];
            const char2Data: any[] = [];
            const char3Data: any[] = [];
            this.dataListVolume.forEach((item:any) => {
                char1Data.push({
                    value: item.volume,
                    name: item.futuresCompany
                });
            });
            this.dataListNormalOpenInterest.forEach((item:any) => {
                char2Data.push({
                    value: item.normalOpenInterest,
                    name: item.futuresCompany
                });
            });
            this.dataListInvertedOpenInterest.forEach((item:any) => {
                char3Data.push({
                    value: item.invertedOpenInterest,
                    name: item.futuresCompany
                });
            });
            this.initChart1(char1Data && char1Data.slice(0, 20)); // invertedOpenInterest空单持仓量
            this.initChart2(char2Data && char2Data.slice(0, 20)); // normalOpenInterest多单持仓量
            this.initChart3(char3Data && char3Data.slice(0, 20)); // volume市场成交量
        }

        async getTableDataSort(type: number, type2?: number, dir?: string) {
            // orderTypeVolumeDir = 'up'; // 市场成交量
            // orderTypeIncreaseDecreaseDir = 'up'; // 市场增减
            // orderTypeNormalOpenInterestDir = 'up'; // 多单持仓量
            // orderTypeNormalIncreaseDecreaseDir = 'up'; // 多单增减
            // orderTypeInvertedOpenInterestDir = 'up'; // 空单持仓量
            // orderTypeInvertedIncreaseDecreaseDir = 'up'; // 空单增减
            if (dir) {
                this.$showLoading();
            }
            const orderStrArr: string[] = [];
            if (type === 1) { // 请求市场成交量
                if (type2 === 1) {
                    this.orderTypeVolumeDir = dir || 'up';
                } else {
                    this.orderTypeIncreaseDecreaseDir = dir || 'up';
                }
                if (this.orderTypeVolumeDir === 'up') {
                    orderStrArr.push('volume asc');
                } else {
                    orderStrArr.push('volume desc');
                }
                if (this.orderTypeIncreaseDecreaseDir === 'up') {
                    orderStrArr.push('increaseDecrease asc');
                } else {
                    orderStrArr.push('increaseDecrease desc');
                }
            } else if (type === 2) { // 多单持仓比例
                if (type2 === 1) {
                    this.orderTypeNormalOpenInterestDir = dir || 'up';
                } else {
                    this.orderTypeNormalIncreaseDecreaseDir = dir || 'up';
                }
                if (this.orderTypeNormalOpenInterestDir === 'up') {
                    orderStrArr.push('normalOpenInterest asc');
                } else {
                    orderStrArr.push('normalOpenInterest desc');
                }
                if (this.orderTypeNormalIncreaseDecreaseDir === 'up') {
                    orderStrArr.push('normalIncreaseDecrease asc');
                } else {
                    orderStrArr.push('normalIncreaseDecrease desc');
                }
            } else if (type === 3) { // 空单持仓比例
                if (type2 === 1) {
                    this.orderTypeInvertedOpenInterestDir = dir || 'up';
                } else {
                    this.orderTypeInvertedIncreaseDecreaseDir = dir || 'up';
                }
                if (this.orderTypeInvertedOpenInterestDir === 'up') {
                    orderStrArr.push('invertedOpenInterest asc');
                } else {
                    orderStrArr.push('invertedOpenInterest desc');
                }
                if (this.orderTypeInvertedIncreaseDecreaseDir === 'up') {
                    orderStrArr.push('invertedIncreaseDecrease asc');
                } else {
                    orderStrArr.push('invertedIncreaseDecrease desc');
                }
            }
            const [err, resp] = await getAsync('/quotation/selectPositionDataListPage', {
                time: this.time,
                quotationContractId: this.contracts,
                quotationSourceId: this.source,
                quotationSpeciesId: this.species,
                order: orderStrArr.join(',')
                // volume市场成交量=1 increaseDecrease市场增减=2 normalOpenInterest多单持仓量=3
                // invertedOpenInterest空单持仓量=4   normalIncreaseDecrease多单增减=5  invertedIncreaseDecrease空单增减=6
            });
            if (dir) {
                this.$closeLoading();
            }
            if (resp?.code === '000000') {
                const list: any[] = [];
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        futuresCompany: item.futuresCompany,
                        volume: item.volume,
                        increaseDecrease: item.increaseDecrease,
                        normalOpenInterest: item.normalOpenInterest,
                        invertedOpenInterest: item.invertedOpenInterest,
                        normalIncreaseDecrease: item.normalIncreaseDecrease,
                        invertedIncreaseDecrease: item.invertedIncreaseDecrease
                    });
                    this.total11 += Number(item.volume) || 0;
                    this.total12 += Number(item.increaseDecrease) || 0;
                    this.total21 += Number(item.normalOpenInterest) || 0;
                    this.total22 += Number(item.invertedOpenInterest) || 0;
                    this.total31 += Number(item.normalIncreaseDecrease) || 0;
                    this.total32 += Number(item.invertedIncreaseDecrease) || 0;
                });
                if (type === 1) {
                    // 按照成交量排序
                    this.dataListVolume = list.sort((itemA: any, itemB:any) => itemB.volume - itemA.volume).splice(0, 20);
                } else if (type === 2) {
                    this.dataListNormalOpenInterest = list.sort((itemA: any, itemB:any) => itemB.normalOpenInterest - itemA.normalOpenInterest).splice(0, 20);
                } else if (type === 3) {
                    this.dataListInvertedOpenInterest = list.sort((itemA: any, itemB:any) => itemB.invertedOpenInterest - itemA.invertedOpenInterest).splice(0, 20);
                }

                // 重新组装chart的数据
                this.getData();
            }
        }

        private initChart1(data: any) {
            const option = {
                title: {
                    top: 15,
                    text: '成交量结构',
                    subtext: '',
                    left: 'center'
                },
                color: ['#1467BF', '#0374BE', '#0589D1', '#029BEC', '#07A7F5',
                    '#28B6F8', '#50D0E9', '#83C986', '#53B053', '#429F4E',
                    '#8FC24B', '#C2C92E', '#E8C20C', '#FEB30C', '#FE900C',
                    '#FE7032', '#FF4D0E', '#FF4338', '#FF3780', '#FF65C4', '#25C3EE'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '成交量',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart1 && chart1.setOption(option as echarts.EChartOption); // 绘制
        }

        private initChart2(data: any) {
            const option = {
                title: {
                    top: 15,
                    text: '多单持仓比例',
                    subtext: '',
                    left: 'center'
                },
                color: ['#1467BF', '#0374BE', '#0589D1', '#029BEC', '#07A7F5',
                    '#28B6F8', '#50D0E9', '#83C986', '#53B053', '#429F4E',
                    '#8FC24B', '#C2C92E', '#E8C20C', '#FEB30C', '#FE900C',
                    '#FE7032', '#FF4D0E', '#FF4338', '#FF3780', '#FF65C4', '#25C3EE'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '多单持仓',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart2 && chart2.setOption(option as echarts.EChartOption); // 绘制
        }

        private initChart3(data: any) {
            const option = {
                title: {
                    top: 15,
                    text: '空单持仓比例',
                    subtext: '',
                    left: 'center'
                },
                color: ['#1467BF', '#0374BE', '#0589D1', '#029BEC', '#07A7F5',
                    '#28B6F8', '#50D0E9', '#83C986', '#53B053', '#429F4E',
                    '#8FC24B', '#C2C92E', '#E8C20C', '#FEB30C', '#FE900C',
                    '#FE7032', '#FF4D0E', '#FF4338', '#FF3780', '#FF65C4', '#25C3EE'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '空单持仓',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart3 && chart3.setOption(option as echarts.EChartOption); // 绘制
        }

        beforeDestroyed() {
            chart1 && chart1.dispose();
            chart2 && chart2.dispose();
            chart3 && chart3.dispose();
        }
    }
</script>

<style lang="scss" scoped>
    .search-lines {
        background-color: #fff;
        display: flex;
        padding: 10px 20px;
        margin-top: 15px;
        .item {
            > span {
                display: inline-block;
                text-align: right;
                line-height: 40px;
                margin-right: 15px;
                margin-left: 15px;
                font-weight: bold;
                &.colorFFF{
                    color: #fff;
                }
            }

            display: flex;
        }

        .anounce {
            display: inline-flex;
            align-items: center;
            color: $color-main;
            font-weight: normal;
            cursor: pointer;
            font-size: 14px;
            line-height: 25px;
        }
    }

    .data-grip {
        margin-top: 10px;
        background-color: #fff;
        padding: 15px;
        display: flex;

        > div {
            flex: 1;
            text-align: center;

            &:nth-child(2) {
                margin: 0 10px;
            }
        }

        .charts {
            border: 1px solid #eaeaea;
            position: relative;

            &::after {
                content: '';
                display: block;
                padding-top: 100%;
            }

            .chart-map {
                position: absolute;
                width: 100%;
                height: 100%;
            }
        }
    }

    .detail-table-wrap {
        border: 1px solid #eaeaea;
        margin-top: 10px;

        .total {
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;

            > span {
                line-height: 40px;
                color: #666;
                font-weight: normal;

                &:first-child {
                    width: 150px;
                    text-align: left;
                }
            }
        }

        .no-data {
            height: 50px;
            line-height: 50px;
            /*color: #666;*/
            border-bottom: 1px solid #eaeaea;
        }
    }

    .detail-table {
        width: 100%;

        th {
            background-color: #f6f6f6;
            line-height: 40px;
            .label{
                cursor: pointer;
            }
            &:first-child{
                width: 60px;
            }
        }

        tbody tr{
            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3){
                td .rank{
                    color: #fff;
                    background-color: #ec1c1c;
                }
            }
            border-bottom: 1px solid #eaeaea;
            td{
                line-height: 40px;
            }
            .rank{
                display: inline-block;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                line-height: 25px;
                color: #666;
                background-color: #ddd;
            }
            .up{
                color: $color-up;
                display: inline-flex;
                align-items: center;
            }
            .down{
                color: $color-down;
                display: inline-flex;
                align-items: center;
            }
            .arrow{
                display: inline-block;
                font-size: 18px;
                vertical-align: middle;
            }
        }

    }

    .noduty-mask {
        background-color: rgba(0, 0, 0, .4);
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999999;

        .close {
            position: absolute;
            top: 15px;
            right: 20px;
            color: #999;
            font-size: 30px;
            cursor: pointer;
        }

        .panel {
            width: 600px;
            height: 347px;
            border-radius: 6px;
            background-color: #fff;
            margin: 50vh auto 0;
            transform: translateY(-50%);

            .title {
                text-align: center;
                font-size: 26px;
                color: #666;
                margin-bottom: 14px;
                padding-top: 14px;
            }

            .content {
                padding: 0 20px;

                p {
                    text-indent: 28px;
                    line-height: 2.2;
                    font-size: 14px;
                }
            }
        }
    }
    .hbb-noData{
        top: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .search-linesNo{
        background: none;
        color: #ff0;
        &.data-grip{
            padding-bottom:0 !important;
        }
        .item {
            > span {
                color: #ff0;
            }
            display: flex;
        }
        .detail-table-wrap{
            margin-top:0;
            .noData{
                color:#ff0 !important;
            }
            .detail-out{
                max-height: 650px;
                overflow: auto;
                /*滚动条样式*/
                &::-webkit-scrollbar {
                    width: 3px;
                    /*height: 4px;*/
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    background: red;
                }
                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    border-radius: 0;
                    background: rgba(0,0,0,0.1);

                }
            }
        }
        .detail-table {
            thead{
                border-bottom:1px solid #fff;
                th{
                    background: none;

                    span{
                        color:#ff0
                    }
                }

            }
            tr{
                td{
                    &:nth-of-type(1){
                        width: 60px;
                    }
                    &:nth-of-type(2){
                        width: 91px;
                    }
                    &:nth-of-type(3){
                        width: 138px;
                    }
                    &:last-child{
                        width:92px
                    }
                }
            }
        }
    }
</style>
