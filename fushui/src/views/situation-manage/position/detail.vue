<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看持仓数据
            </div>
            <div class="nav-common-search">
                <div class="search-line">
                    <div class="search-union">
                        <span class="words">日期:</span>
                        <div class="input-text">
                            <el-date-picker
                                v-model="search.time"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                placeholder="请选择日期"
                                @change="searchData"
                                style="width:185px"
                            />
                        </div>
                    </div>
                    <div class="search-union">
                        <span class="words">交易所:</span>
                        <div class="input-text">
                            <el-select
                                v-model.trim="search.quotationSourceId"
                                style="width: 160px"
                                placeholder="请选择"
                                @change="searchData"
                            >
                                <el-option value="" label="全部"></el-option>
                                <el-option
                                    v-for="(item,idx) in sourceList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="search-union">
                        <span class="words">品质:</span>
                        <div class="input-text">
                            <el-select
                                v-model.trim="search.quotationSpeciesId"
                                style="width: 160px"
                                placeholder="请选择"
                                @change="searchData"
                            >
                                <el-option value="" label="全部"></el-option>
                                <el-option
                                    v-for="(item,idx) in speciesList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="search-union">
                        <span class="words">合约:</span>
                        <div class="input-text">
                            <el-select
                                v-model.trim="search.quotationContractId"
                                style="width: 160px"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item,idx) in contractList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="search-union">
                        <el-button type="primary" @click="searchData">
                            查询
                        </el-button>
                        <el-button type="primary" @click="showModifyPanel">
                            修改
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="data-map">
                <div class="data-union">
                    <div id="chart1" ref="chart1" class="chart-map" />
                    <div v-if="dataListVolume.length === 0" class="hbb-topNoData">
                        暂无数据
                    </div>
                    <div class="char-data-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>名次</th>
                                    <th>名称</th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeVolumeDir"
                                            @click="getTableDataSort(1,1, orderTypeVolumeDir === 'up' ? 'down' : 'up')"
                                        >成交量</span>
                                    </th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeIncreaseDecreaseDir"
                                            @click="getTableDataSort(1,2, orderTypeIncreaseDecreaseDir === 'up' ? 'down' : 'up')"
                                        >增减</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in dataListVolume" :key="idx">
                                    <td>{{ item.idx }}</td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.volume }}</td>
                                    <td>{{ item.increaseDecrease }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="dataListVolume.length === 0" class="hbb-bottomNoData">
                            暂无数据
                        </div>
                    </div>
                </div>
                <div class="data-union">
                    <div id="chart2" ref="chart2" class="chart-map" />
                    <div v-if="dataListNormalOpenInterest.length === 0" class="hbb-topNoData">
                        暂无数据
                    </div>
                    <div class="char-data-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>名次</th>
                                    <th>名称</th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeNormalOpenInterestDir"
                                            @click="getTableDataSort(2, 1, orderTypeNormalOpenInterestDir === 'up' ? 'down' : 'up')"
                                        >多单持仓</span>
                                    </th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeNormalIncreaseDecreaseDir"
                                            @click="getTableDataSort(2, 2, orderTypeNormalIncreaseDecreaseDir === 'up' ? 'down' : 'up')"
                                        >增减</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in dataListNormalOpenInterest" :key="idx">
                                    <td>{{ item.idx }}</td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.normalOpenInterest }}</td>
                                    <td>{{ item.normalIncreaseDecrease}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="dataListNormalOpenInterest.length === 0" class="hbb-bottomNoData">
                            暂无数据
                        </div>
                    </div>
                </div>
                <div class="data-union">
                    <div id="chart3" ref="chart3" class="chart-map" />
                    <div v-if="dataListInvertedOpenInterest.length === 0" class="hbb-topNoData">
                        暂无数据
                    </div>
                    <div class="char-data-list">
                        <table>
                            <thead>
                                <tr>
                                    <th><span>名次</span></th>
                                    <th><span>名称</span></th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeInvertedOpenInterestDir"
                                            @click="getTableDataSort(3, 1,orderTypeInvertedOpenInterestDir === 'up' ? 'down' : 'up')"
                                        >空单持仓</span>
                                    </th>
                                    <th>
                                        <span
                                            class="arrow-btn"
                                            :class="orderTypeInvertedIncreaseDecreaseDir"
                                            @click="getTableDataSort(3, 2,orderTypeInvertedIncreaseDecreaseDir === 'up' ? 'down' : 'up')"
                                        >增减</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in dataListInvertedOpenInterest" :key="idx">
                                    <td>{{ item.idx }}</td>
                                    <td>{{ item.futuresCompany || '--' }}</td>
                                    <td>{{ item.invertedOpenInterest }}</td>
                                    <td>{{ item.invertedIncreaseDecrease }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="dataListInvertedOpenInterest.length === 0" class="hbb-bottomNoData">
                            暂无数据
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="修改数据"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="modifyPanelShow"
            width="500px"
        >
            <el-form ref="dataForm" class="form-data form-style form-input-area" :model="editData" :rules="dataRule">
                <el-form-item label="数据日期：" prop="date" label-width="120px">
                    <el-date-picker
                        v-model="editData.date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="请选择时间"
                        style="width:185px"
                    />
                </el-form-item>
                <el-form-item label="数据：" prop="marketDataFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.marketDataFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传市场数据"
                        tips="只能上传excel文件，文件大小小于50M"
                    />
                </el-form-item>
                <el-form-item label="" prop="moreFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.moreFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传多单数据"
                        tips="只能上传excel文件，文件大小小于50M"
                        style="margin-top:12px"
                    />
                </el-form-item>
                <el-form-item label="" prop="shortFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.shortFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传空单数据"
                        tips="只能上传excel文件，文件大小小于50M"
                        style="margin-top:12px"
                    />
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px;margin-bottom: 10px">
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import echarts from 'echarts';
    import {ElForm} from 'element-ui/types/form';
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import MyFileUpload from '@/components/MyFileUpload.vue';

    let chart1: echarts.ECharts | undefined; // 图表
    let chart2: echarts.ECharts | undefined; // 图表
    let chart3: echarts.ECharts | undefined; // 图表

    @Component({
        components: {MyFileUpload}
    })
    export default class extends Vue {
        search: any = {
            time: '',
            quotationSourceId: '',
            quotationSpeciesId: '',
            quotationContractId: ''
        };

        editData: any = {
            date: '',
            marketDataFile: '',
            shortFile: '',
            moreFile: ''
        };

        dataRule: any = {
            date: [{required: true, message: '请输入数据日期', trigger: 'blur'}]
        };

        orderTypeVolumeDir = 'down'; // 市场成交量
        orderTypeIncreaseDecreaseDir = 'down'; // 市场增减
        orderTypeNormalOpenInterestDir = 'down'; // 多单持仓量
        orderTypeNormalIncreaseDecreaseDir = 'down'; // 多单增减
        orderTypeInvertedOpenInterestDir = 'down'; // 空单持仓量
        orderTypeInvertedIncreaseDecreaseDir = 'down'; // 空单增减

        modifyPanelShow = false;

        sourceList: any[] = []; // 行情来源数据
        speciesList: any[] = []; // 行情种类数据
        contractList: any[] = []; // 行情合约数据

        dataListVolume: any[] = [];
        dataListNormalOpenInterest: any[] = [];
        dataListInvertedOpenInterest: any[] = [];

        async mounted() {
            await Promise.all([
                this.getDataSource(),
                this.getData(),
                this.getTableDataSort(1),
                this.getTableDataSort(2),
                this.getTableDataSort(3)
            ]);
        }

        /* 获得交易所数据 */
        async getDataSource() {
            this.search.time = this.$route.query.time;
            const [err, resp] = await this.$getAsync('/quotation/selectQuotationSourceAll', {});
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
            const [err, resp] = await this.$getAsync('/quotation/getQuotationSpeciesByQuotationSourceId', {
                quotationSourceId: this.search.quotationSourceId
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
            const [err, resp] = await this.$getAsync('/quotation/getQuotationContractByQuotationSpeciesId', {
                quotationSpeciesId: this.search.quotationSpeciesId
            });
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationContractId),
                        name: item.contractName
                    });
                });
                this.contractList = list;
            }
        }

        @Watch('search.quotationSourceId')
        onSourceChange() {
            this.search.quotationSpeciesId = ''; // 先清空
            this.search.quotationContractId = ''; // 先清空
            this.getDataSpecies();
        }

        @Watch('search.quotationSpeciesId')
        onSpeciesChange() {
            this.search.quotationContractId = ''; // 先清空
            this.getDataContract();
        }

        @Watch('search.quotationContractId')
        onContractChange(val: string) {
            if (val) {
                // 查询一下接口
                // this.upDowns = '2'; // 涨跌
                // this.price = '3'; // 价格
                // this.upDownsRate = '4%'; // 涨跌幅
            } else {
                // this.upDowns = '--'; // 涨跌
                // this.price = '--'; // 价格
                // this.upDownsRate = '--'; // 涨跌幅
            }
        }

        showModifyPanel() {
            this.editData.date = '';
            this.editData.marketDataFile = '';
            this.editData.moreFile = '';
            this.editData.shortFile = '';
            this.modifyPanelShow = true;
        }

        searchData() {
            this.getData();
            this.getTableDataSort(1);
            this.getTableDataSort(2);
            this.getTableDataSort(3);
        }

        async getData() {

            this.$showLoading();
            const [err, resp] = await this.$getAsync('/position/selectPositionDataAll', {
                time: this.search.time,
                quotationContractId: this.search.quotationContractId,
                quotationSourceId: this.search.quotationSourceId,
                quotationSpeciesId: this.search.quotationSpeciesId
            });
            if (resp?.code === '000000') {
                const list: any = [];
                let char1Data: any[] = [];
                let char2Data: any[] = [];
                let char3Data: any[] = [];
                (resp?.data || []).forEach((item: any) => {
                    char1Data.push({
                        value: item.volume,
                        name: item.futuresCompany
                    });
                    char2Data.push({
                        value: item.normalOpenInterest,
                        name: item.futuresCompany
                    });
                    char3Data.push({
                        value: item.invertedOpenInterest,
                        name: item.futuresCompany
                    });
                });
                char1Data = char1Data.sort((x:any, y:any) => Number(x.value) - Number(y.value)).slice(0, 20);
                char2Data = char2Data.sort((x:any, y:any) => Number(x.value) - Number(y.value)).slice(0, 20);
                char3Data = char3Data.sort((x:any, y:any) => Number(x.value) - Number(y.value)).slice(0, 20);

                // this.initChart1(char1Data && char1Data); // invertedOpenInterest空单持仓量
                // this.initChart2(char2Data && char2Data); // normalOpenInterest多单持仓量
                // this.initChart3(char3Data && char3Data); // volume市场成交量
            }
            this.$closeLoading();
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
            const [err, resp] = await this.$getAsync('/position/selectPositionDataListPage', {
                time: this.search.time,
                quotationContractId: this.search.quotationContractId,
                quotationSourceId: this.search.quotationSourceId,
                quotationSpeciesId: this.search.quotationSpeciesId,
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
                });
                // 只取前20条数据
                const listSlice = list.slice(0, 20);
                if (type === 1) {
                    this.dataListVolume = listSlice;
                } else if (type === 2) {
                    this.dataListNormalOpenInterest = listSlice;
                } else if (type === 3) {
                    this.dataListInvertedOpenInterest = listSlice;
                }
                // // 重新组装chart的数据
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
                this.initChart1(char1Data && char1Data.splice(0, 20)); // invertedOpenInterest空单持仓量
                this.initChart2(char2Data && char2Data.splice(0, 20)); // normalOpenInterest多单持仓量
                this.initChart3(char3Data && char3Data.splice(0, 20)); // volume市场成交量
            }
        }

        private initChart1(data: any) {
            if (chart1) {
                chart1.dispose();
                chart1 = undefined;
            }
            if (!chart1) {
                chart1 = echarts.init(this.$refs.chart1 as HTMLCanvasElement); // 表格初始化
            }
            const option = {
                title: {
                    top: 15,
                    text: '成交量结构',
                    subtext: '',
                    left: 'center'
                },
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
            chart1.setOption(option as echarts.EChartOption); // 绘制
        }

        private initChart2(data: any) {
            if (chart2) {
                chart2.dispose();
                chart2 = undefined;
            }
            if (!chart2) {
                chart2 = echarts.init(this.$refs.chart2 as HTMLCanvasElement); // 表格初始化
            }
            const option = {
                title: {
                    top: 15,
                    text: '多单持仓比例',
                    subtext: '',
                    left: 'center'
                },
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
            chart2.setOption(option as echarts.EChartOption); // 绘制
        }

        private initChart3(data: any) {
            if (chart3) {
                chart3.dispose();
                chart3 = undefined;
            }
            if (!chart3) {
                chart3 = echarts.init(this.$refs.chart3 as HTMLCanvasElement); // 表格初始化
            }
            const option = {
                title: {
                    top: 15,
                    text: '空单持仓比例',
                    subtext: '',
                    left: 'center'
                },
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
            chart3.setOption(option as echarts.EChartOption); // 绘制
        }

        private getOptionData(data: any) {

        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    if (this.editData.marketDataFile === '' &&
                        this.editData.shortFile === '' &&
                        this.editData.moreFile === '') {
                        this.$showToast('请至少上传一份数据文件');
                        return;
                    }

                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                cover: 1, // 覆盖
                date: this.editData.date,
                inverted: this.editData.shortFile, // 空单文件
                market: this.editData.marketDataFile, // 市场文件
                normal: this.editData.moreFile // 多单文件
            };
            const [err, resp] = await this.$postAsync('/position/batchUpload', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.modifyPanelShow = false;
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .data-map {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        width: 1080px;

        .data-union {
            flex: 1;

            &:nth-child(2) {
                margin: 0 20px;
            }
        }

        .chart-map {
            border: 1px solid #ccc;
            width: 100%;
            height: 320px;
        }

        .char-data-list {
            margin-top: 20px;
            width: 100%;

            table {
                width: 100%;
                border: 1px solid #eaeaea;
                border-collapse: collapse;

                th {
                    &:first-child{
                        width: 60px;
                    }
                    &:nth-child(2){
                        width: 130px;
                    }
                    background-color: #eaeaea;
                    line-height: 40px;
                    color: #333;
                    text-align: center;

                    .arrow-btn {
                        user-select: none;
                        display: inline-block;
                        position: relative;
                        cursor: pointer;

                        &::after {
                            content: '';
                            position: absolute;
                            top: 5px;
                            right: -13px;
                            @include triangle(5px, #333, bottom);
                        }

                        &.up::after {
                            @include triangle(5px, #333, top);
                        }
                    }
                }

                td {
                    line-height: 35px;
                    text-align: center;
                }

                tbody tr {
                    border: 1px solid #eaeaea;
                }
            }
        }
    }
    .hbb-topNoData{
        width: 345px;
        height: 318px;
        margin-top: -318px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .hbb-bottomNoData{
        display: flex;
        width: 100%;
        height: 100px;
        justify-content: center;
        align-items: center;
    }
</style>
