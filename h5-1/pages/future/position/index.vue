<template>
    <div>
        <tk-nav-bar>
            <template #left>
                <i class="arrow" data-v-2f5af622="" @click="clickBack" />
                <div>
                    <div class="se-cat">
                        持仓数据
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
        <div class="container" :class="{'has-tab': contractName}">
            <div class="menu-tab">
                <div class="tab" :class="{active: showType === '0'}" @click="clickOnTab('0')">
                    成交量
                </div>
                <div class="tab" :class="{active: showType === '1'}" @click="clickOnTab('1')">
                    多单持仓
                </div>
                <div class="tab" :class="{active: showType === '2'}" @click="clickOnTab('2')">
                    空单持仓
                </div>
            </div>
            <div class="info-grid-block">
                <div>
                    <div class="title">
                        交易日期
                    </div>
                    <div class="value" @click="clickChooseTime">
                        {{ timeShow }}
                    </div>
                </div>
                <div>
                    <div class="title">
                        交易所
                    </div>
                    <div class="value" @click="clickOnChooseSource">
                        {{ currentSourceName }}
                    </div>
                </div>
                <div>
                    <div class="title">
                        交易品种
                    </div>
                    <div class="value" @click="clickOnChooseSpecies">
                        {{ currentSpeciesName }}
                    </div>
                </div>
                <div>
                    <div class="title">
                        合约名称
                    </div>
                    <div class="value" @click="clickOnChooseContract">
                        {{ currentContractName }}
                    </div>
                </div>
            </div>
            <div class="info-char-area">
                <div id="chart" ref="chart" class="chart-map" />
            </div>
            <table class="list-table">
                <thead>
                    <tr class="title">
                        <th>名称</th>
                        <th>期货公司</th>
                        <th>{{ showType === '0' ? '成交量' : showType === '1' ? '多单持仓' : '空单持仓' }}</th>
                        <th>日增仓</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,idx) in dataList" :key="idx">
                        <td>{{ item.idx }}</td>
                        <td>{{ item.futuresCompany || '--' }}</td>
                        <td v-if="showType === '0'">
                            {{ item.volume }}
                        </td>
                        <td v-if="showType === '1'">
                            {{ item.normalOpenInterest }}
                        </td>
                        <td v-if="showType === '2'">
                            {{ item.invertedOpenInterest }}
                        </td>
                        <td class="last">
                            <span v-if="item.increaseDecrease > 0" class="status1">{{ '+' + item.increaseDecrease }}</span>
                            <span v-if="item.increaseDecrease < 0" class="status2">{{ item.increaseDecrease }}</span>
                            <span v-if="item.increaseDecrease === 0" class="status0">{{ item.increaseDecrease }}</span>
                            <van-icon v-if="item.increaseDecrease > 0" name="down up" />
                            <van-icon v-if="item.increaseDecrease < 0" name="down" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <van-action-sheet v-model="showDatePanel">
            <van-datetime-picker
                v-model="time"
                type="date"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="clickOnTimePickerCancel"
                @confirm="clickOnChooseTime"
            />
        </van-action-sheet>

        <tk-situation-tab-bar v-if="contractName" :active-index="0" />

        <!-- 交易所 -->
        <van-action-sheet v-model="showSourcePanel"
                          :actions="sourceList"
                          cancel-text="取消"
                          @cancel="clickOnSourceCancel"
                          @select="clickOnSelectSource"
        />
        <!-- 品类 -->
        <van-action-sheet v-model="showSpeciesPanel"
                          :actions="speciesList"
                          cancel-text="取消"
                          @cancel="clickOnSpeciesCancel"
                          @select="clickOnSpeciesSource"
        />
        <!-- 合约 -->
        <van-action-sheet v-model="showContractPanel"
                          :actions="contractList"
                          cancel-text="取消"
                          @cancel="clickOnContractCancel"
                          @select="clickOnContractItem"
        />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from 'vue-property-decorator';
    import {formatTime} from '@common/src/utils/format';
    import {getAsync, postAsync} from '@/utils/request';
    import TkSituationTabBar from '@/components/TkSituationTabBar.vue';

    let chart: echarts.ECharts | undefined; // 图表
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/pie');
    require('echarts/lib/component/tooltip');

    let keepData1: any[] = [];
    let keepData2: any[] = [];
    let keepData3: any[] = [];

    @Component({
        components: {TkSituationTabBar},
        async asyncData({route}) {
            if (!route.query.id) {
                return {};
            }
            const [_, resp] = await postAsync('/quotation/getContractDetail', {
                quotationContractId: route.query.id
            });
            // console.log(resp?.data);
            let quotationContractId = '';
            let quotationSourceId = '';
            let quotationSpeciesId = '';
            let contractName = '';

            if (resp?.code === '000000') {
                quotationContractId = resp?.data?.quotationContractId || '';
                quotationSourceId = resp?.data?.quotationSourceId || '';
                quotationSpeciesId = resp?.data?.quotationSpeciesId || '';
                contractName = resp?.data?.contractName || '';
            } else {
            }
            return {
                currentContractId: quotationContractId,
                currentSourceId: quotationSourceId,
                currentSpeciesId: quotationSpeciesId,
                contractName
            };
        }
    })
    export default class extends Vue {
        showType = '0'; // 0=成交量 1=多单持仓 2=空单持仓
        titleName = '全部';
        contractName='';

        currentSourceId = ''; // 当前交易所Id
        currentSpeciesId = ''; // 当前品类Id
        currentContractId = ''; // 当前合同Id

        currentSourceName = '请选择'; // 当前交易所Name
        currentSpeciesName = '请选择'; // 当前品类Name
        currentContractName = '请选择'; // 当前合同Name

        dataList: any[] = [];

        minDate = new Date(2000, 0, 1);
        maxDate = new Date(Date.now() - 86400000); // 昨天
        time = new Date(Date.now() - 86400000); // 昨天

        showDatePanel = false;
        showSourcePanel = false;
        showSpeciesPanel = false;
        showContractPanel = false;

        sourceList: any[] = [];
        speciesList: any[] = [];
        contractList: any[] = [];

        get timeShow() {
            return formatTime(this.time, 'yyyy-MM-dd');
        }

        async mounted() {
            this.getData();
            await this.getDataSource();
            if (this.contractName) {
                this.titleName = this.contractName;
            }
            const find = this.sourceList.find((item: any) => {
                return item.id === String(this.currentSourceId);
            });
            if (find) {
                this.currentSourceName = find.name;
            }
            if (this.currentSourceId) {
                await this.getDataSpecies();
                const find = this.speciesList.find((item: any) => {
                    return item.id === String(this.currentSpeciesId);
                });
                if (find) {
                    this.currentSpeciesName = find.name;
                }
            }
            if (this.currentSpeciesId) {
                await this.getDataContract();
                const find = this.contractList.find((item: any) => {
                    return item.id === String(this.currentContractId);
                });
                if (find) {
                    this.currentContractName = find.name;
                }
            }
        }

        beforeDestroy() {
            if (chart) {
                chart.dispose();
                chart = undefined;
            }
        }

        async getData() {
            this.$showLoading();
            const [_, resp] = await getAsync('/quotation/getPositionDataList', {
                time: formatTime(this.time, 'yyyy-MM-dd'),
                quotationSourceId: this.currentSourceId,
                quotationSpeciesId: this.currentSpeciesId,
                quotationContractId: this.currentContractId
            });
            if (this.currentContractId) {
                this.titleName = this.currentContractName;
            } else if (this.currentSpeciesId) {
                this.titleName = this.currentSpeciesName;
            } else if (this.currentSourceId) {
                this.titleName = this.currentSourceName;
            } else {
                this.titleName = '全部';
            }
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any[] = [];
                const char1Data: any[] = [];
                const char2Data: any[] = [];
                const char3Data: any[] = [];
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        futuresCompany: item.futuresCompany,
                        volume: item.volume,
                        increaseDecrease: +item.increaseDecrease,
                        normalOpenInterest: +item.normalOpenInterest,
                        invertedOpenInterest: +item.invertedOpenInterest,
                        normalIncreaseDecrease: +item.normalIncreaseDecrease,
                        invertedIncreaseDecrease: +item.invertedIncreaseDecrease
                    });
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
                keepData1 = char1Data; // invertedOpenInterest空单持仓量
                keepData2 = char2Data; // normalOpenInterest多单持仓量
                keepData3 = char3Data; // volume市场成交量
                this.showChart(char1Data); // invertedOpenInterest空单持仓量
                this.dataList = list;
            } else {
                this.showChart([]);
                this.dataList = [];
            }
        }

        clickBack() {
            window.history.go(-1);
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
                quotationSourceId: this.currentSourceId
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
                quotationSpeciesId: this.currentSpeciesId
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

        @Watch('currentSourceId')
        onSourceChange() {
            this.currentSpeciesId = ''; // 先清空
            this.currentSpeciesName = '请选择'; // 先清空
            this.currentContractId = ''; // 先清空
            this.currentContractName = '请选择'; // 先清空
            this.getDataSpecies();
            this.getData();
        }

        @Watch('currentSpeciesId')
        onSpeciesChange() {
            this.currentContractId = ''; // 先清空
            this.currentContractName = '请选择'; // 先清空
            this.getDataContract();
            this.getData();
        }

        @Watch('currentContractId')
        onContractChange(val: string) {
            this.getData();
        }

        clickOnTab(idx: string) {
            if (idx === this.showType) {
                return;
            }
            this.showType = idx;
            switch (idx) {
                case '0':
                    this.showChart(keepData1);
                    break;
                case '1':
                    this.showChart(keepData2);
                    break;
                case '2':
                    this.showChart(keepData3);
                    break;
            }
        }

        showChart(data: any[]) {
            if (chart) {
                chart.dispose();
                chart = undefined;
            }
            if (!chart) {
                chart = echarts.init(this.$refs.chart as HTMLCanvasElement); // 表格初始化
            }
            const option = {
                color: ['#1666BF', '#0474BE', '#038ACE', '#029BEB',
                    '#05A8F5', '#27B7F6', '#4FD0E5', '#82C985',
                    '#51B150', '#439F4C', '#8DC34B', '#C1CA31',
                    '#FEC20C', '#FFA205', '#FF7000', '#FF4338'],
                title: {
                    top: 0,
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: this.showType === '0' ? '成交量' : this.showType === '1' ? '多单持仓' : '空单持仓',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
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
            chart && chart.setOption(option as echarts.EChartOption); // 绘制
        }

        clickChooseTime() {
            if (this.contractName) {
                return;
            }
            this.showDatePanel = true;
        }

        clickOnChooseSource() {
            if (this.contractName) {
                return;
            }
            this.showSourcePanel = true;
        }

        clickOnTimePickerCancel() {
            this.showDatePanel = false;
        }

        clickOnChooseTime(val: any) {
            this.showDatePanel = false;
            this.getData();
        }

        clickOnSourceCancel() {
            this.showSourcePanel = false;
        }

        clickOnSelectSource(data: any) {
            this.showSourcePanel = false;
            this.currentSourceId = data.id;
            this.currentSourceName = data.name;
        }

        clickOnChooseSpecies() {
            if (this.contractName) {
                return;
            }
            if (!this.currentSourceId || this.speciesList.length === 0) {
                this.$showToast('请选择交易所');
                return;
            }
            this.showSpeciesPanel = true;
        }

        clickOnSpeciesCancel() {
            this.showSpeciesPanel = false;
        }

        clickOnSpeciesSource(data: any) {
            this.showSpeciesPanel = false;
            this.currentSpeciesId = data.id;
            this.currentSpeciesName = data.name;
        }

        clickOnChooseContract() {
            if (this.contractName) {
                return;
            }
            if (!this.currentSpeciesId || this.contractList.length === 0) {
                this.$showToast('请选择交易品种');
                return;
            }
            this.showContractPanel = true;
        }

        clickOnContractCancel() {
            this.showContractPanel = false;
        }

        clickOnContractItem(data: any) {
            this.showContractPanel = false;
            this.currentContractId = data.id;
            this.currentContractName = data.name;
        }

        clickOnSetting() {
            this.$router.push('/future/setting/chart');
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        background-color: #fff;
        &.has-tab{
            padding-bottom: 120px;
        }
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

    .se-cat {
        padding-top: 10px;
        color: #fff;
        font-size: 28px;
    }

    .se-name {
        font-size: 30px;
        padding-top: 5px;
        color: #FDE543;
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

    .info-grid-block {
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        @include thinBorder(bottom);

        > div {
            text-align: left;
            width: 50%;
            position: relative;

            &:nth-child(2n) {
                @include thinBorder(top left);
            }

            &:nth-child(2n-1) {
                @include thinBorder(top);
            }

            padding-left: 35px;
        }

        .title {
            font-size: 26px;
            padding-top: 25px;
            color: #666;
        }

        .value {
            display: inline-block;
            font-size: 30px;
            line-height: 40px;
            min-height: 40px;
            padding-top: 10px;
            padding-bottom: 20px;
            color: #333;
            position: relative;
            @include rightArrow(#333, 15px, 20px, -20px);
        }
    }

    .info-char-area {
        background-color: #fff;
        height: 500px;
    }

    .list-table {
        background-color: #fff;
        width: 100%;

        thead {
            background-color: #F6F6F6;

            th {
                color: #8A8A8A;
                line-height: 80px;
                font-size: 32px;
                font-weight: normal;

                &:last-child {
                    text-align: right;
                    padding-right: 20px;
                }
            }
        }

        tbody {
            tr {
                border-bottom: 1PX solid #f2f2f2;

                &:nth-child(1) td:first-child,
                &:nth-child(2) td:first-child,
                &:nth-child(3) td:first-child {
                    color: $color-up;
                }
            }

            td {
                text-align: center;
                line-height: 80px;
                color: #333;
                font-size: 28px;

                &.last {
                    text-align: right;
                    padding-right: 20px;
                    font-size: 28px;
                    >span{
                        font-size: 28px;
                    }
                }

                .status0 {
                    padding-right: 30px;
                }

                .status1 {
                    color: $color-up;
                }

                .status2 {
                    color: $color-down;
                }

                /deep/ .van-icon {
                    line-height: 80px;
                    color: $color-down;

                    &.up {
                        color: $color-up;
                        transform: rotateZ(180deg);
                    }
                }
            }
        }
    }

    .chart-map {
        width: 100%;
        height: 100%;
    }
</style>
