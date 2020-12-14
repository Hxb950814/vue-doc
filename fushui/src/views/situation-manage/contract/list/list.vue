<!-- 行情合约 -->
<template>
    <div>
        <div class="page-cap-title">
            合约列表
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">合约名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.contractName"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">选择交易所:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.quotationSourceId"
                            style="width: 160px"
                            clearable
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
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
                    <span class="words">选择交易种类:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.quotationSpeciesId"
                            style="width: 160px"
                            clearable
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
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
                    <span class="words">选择标的状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.state"
                            style="width: 160px"
                            clearable
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="0" label="闭市" />
                            <el-option value="1" label="正常" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">选择策略状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.strategyStatus"
                            style="width: 160px"
                            clearable
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="支持" />
                            <el-option value="0" label="不支持" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">选择展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                            clearable
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="已上架" />
                            <el-option value="0" label="已下架" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">是否主力 :</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.mainBody"
                            style="width: 160px"
                            placeholder="全部"
                            clearable
                        >
                            <el-option value="" label="全部" />
                            <el-option value="0" label="否" />
                            <el-option value="1" label="是" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'06030101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="contractName" label="合约名称" />
                <el-table-column prop="contractCode" label="合约代码" />
                <el-table-column prop="sourceName" label="交易所" />
                <el-table-column prop="speciesName" label="种类" />
                <el-table-column prop="mainBody" label="是否主力">
                    <template slot-scope="scope">
                        {{ scope.row.mainBody ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="tickSize" label="最小单位" />
                <el-table-column prop="state" label="标的状态">
                    <template slot-scope="scope">
                        {{ scope.row.state ? '正常' : '闭市' }}
                    </template>
                </el-table-column>
                <el-table-column prop="situation" label="行情数据" width="220px">
                    <template slot="header">
                        <div style="padding: 8px 0">
                            <div style="padding-bottom: 10px">
                                行情数据
                            </div>
                            <div class="title-flex">
                                <span>价格</span>
                                <span>涨跌</span>
                                <span>涨幅%</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div class="title-flex" :class="scope.row.changeValue >= 0 ? 'up' : 'down'">
                            <span>{{ scope.row.price }}</span>
                            <span>{{ scope.row.changeValue }}</span>
                            <span>{{ scope.row.changeRate }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="策略状态">
                    <template slot-scope="scope">
                        {{ '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="appInfo" label="展示状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 1" class="list-status normal">已上架</a>
                        <a v-else-if="scope.row.status === 0" class="list-status red">已下架</a>
                        <a v-else class="list-status">正常</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <a
                            v-permission="'06030102'"
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit2(scope.row.id)">盘口</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="my-pagination-wrap">
                <my-pagination
                    :page-size="tableData.pageSize"
                    :total="tableData.count"
                    :current-page.sync="tableData.currentPage"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <el-dialog
            :title="`【${tickDataContractName}】-盘口`"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="positionShow"
            width="440px"
        >
            <table class="position-table">
                <tr>
                    <td>最新</td>
                    <td :class="tickData.changeValue >= 0 ? 'up' : 'down'">
                        {{ tickData.price }}
                    </td>
                    <td>涨跌</td>
                    <td :class="tickData.changeValue >= 0 ? 'up' : 'down'">
                        {{ tickData.changeValue + '/' }}
                        {{ tickData.changeRate + '%' }}
                    </td>
                </tr>
                <tr>
                    <td>卖价</td>
                    <td>{{ tickData.askPrice }}</td>
                    <td>卖量</td>
                    <td>{{ tickData.askVolume }}</td>
                </tr>
                <tr>
                    <td>买价</td>
                    <td>{{ tickData.bidPrice }}</td>
                    <td>买量</td>
                    <td>{{ tickData.bidVolume }}</td>
                </tr>
                <tr>
                    <td>开盘</td>
                    <td>{{ tickData.open }}</td>
                    <td>成交量</td>
                    <td>{{ tickData.totalVolume }}</td>
                </tr>
                <tr>
                    <td>最高</td>
                    <td>{{ tickData.high }}</td>
                    <td>持仓量</td>
                    <td>{{ tickData.position }}</td>
                </tr>
                <tr>
                    <td>最低</td>
                    <td>{{ tickData.low }}</td>
                    <td>日增仓</td>
                    <td>
                        {{ tickData.positionDelta ? tickData.positionDelta + '/' : '' }}
                        {{ tickData.positionDelta ? tickData.positionDeltaRate + '%' : '' }}
                    </td>
                </tr>
                <tr>
                    <td>均价</td>
                    <td>{{ tickData.average }}</td>
                    <td>结算</td>
                    <td>{{ tickData.settle }}</td>
                </tr>
                <tr>
                    <td>昨收</td>
                    <td>{{ tickData.preClose }}</td>
                    <td>昨结</td>
                    <td>{{ tickData.preSettle }}</td>
                </tr>
                <tr>
                    <td>涨停</td>
                    <td>{{ tickData.highLimited }}</td>
                    <td>跌停</td>
                    <td>{{ tickData.lowLimited }}</td>
                </tr>
                <tr>
                    <td>杠杆</td>
                    <td>-</td>
                    <td>收盘价</td>
                    <td>{{tickData.close}}</td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {ContractDataSocket, EnumContractDataKey, TypeContractData} from '@common/src/future';
    import { getSituationDataObject, setSituationData, resetSituationData } from './contractData';
    import commonTable from '@/mixins/commonTable';

    let dataSocketInstance: any = null;
    let keepCoedsData: string[] = [];
    let keepIncomeData: any[] = [];
    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            contractName: '', // 合约名称
            status: '', // 状态
            strategyStatus: '', // 策略状态
            state: '', // 标的状态
            quotationSourceId: '',
            quotationSpeciesId: '',
            mainBody: '' // 是否主力
        };

        positionShow = false;

        sourceList: any = []; // 交易所数据
        speciesList: any = []; // 品类数据

        tickDataContractName = '';
        tickDataCode = '';
        tickDataFlag = true;
        tickData: any = getSituationDataObject();

        @Watch('search.quotationSourceId')
        onSourceChange(newval: string) {
            if (newval) {
                this.search.quotationSpeciesId = '';
                this.getDataSpecies();
            }
        }

        @Watch('positionShow')
        onpositionShow(newval: boolean) {
            if (!newval) {
                this.tickDataFlag = false;
                this.tickDataCode = '';
                resetSituationData(this.tickData);
            }
        }

        async mounted() {
            await this.initDataSocket();
            this.getDataSource();
            this.getDataList();
        }

        async getDataSource() {
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

        async initDataSocket() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                keepIncomeData = incomeData;
                if (errCode === 0) {
                    this.handleSocketData(incomeData);
                }
            });
            await dataSocketInstance.connect();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();

            // 需要停止请求socket
            if (keepCoedsData && keepCoedsData.length > 0) {
                dataSocketInstance.sendCancelContractTickGroupMessage(keepCoedsData);
            }

            const [err, resp] = await this.$getAsync('/quotation/selectQuotationContractListPage', {
                page: this.tableData.currentPage,
                contractType: 1,
                contractName: this.search.contractName, // 合约名称
                quotationSourceId: this.search.quotationSourceId, // 行情来源, 交易所
                quotationSpeciesId: this.search.quotationSpeciesId, // 交易种类,种类id
                state: this.search.state, // 标的状态
                status: this.search.status, // 展示状态
                mainBody: this.search.mainBody // 是否主力
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.quotationContractId),
                        apiCode: item.apiCode, // 交易所名称
                        sourceName: item.sourceName, // 交易所名称
                        speciesName: item.speciesName, // 种类名称
                        contractName: item.contractName, // 合约名称
                        contractCode: item.contractCode, // 合约代码
                        quotationContractId: item.quotationContractId, // 交易所ID
                        quotationSpeciesId: item.quotationSpeciesId, // 种类ID
                        mainBody: Number(item.mainBody), // 是否主力
                        tickSize: String(item.tickSize), // 最小单位
                        state: Number(item.state), // 标的状态
                        status: Number(item.status), // 展示状态
                        price: '--',
                        changeValue: '--',
                        changeRate: '--'
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
                keepCoedsData = list.filter((item: any) => !!item.apiCode).map((item: any) => item.apiCode);
                keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
                if (keepCoedsData.length > 0) {
                    dataSocketInstance.sendContractTickGroupMessage(keepCoedsData); // 发送数据
                }
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        handleSocketData(incomeData: any) {
            // console.log(incomeData);
            if (Array.isArray(incomeData)) {
                    this.tableData.data.forEach((item: any, idx: number) => {
                        const find = incomeData.find((unit: TypeContractData) => {
                            return unit.code === item.apiCode;
                        });
                        if (find) {
                            item.price = find[EnumContractDataKey.price] + '';
                            item.changeValue = find[EnumContractDataKey.changeValue] >= 0 ? '+' + find[EnumContractDataKey.changeValue] : find[EnumContractDataKey.changeValue];
                            item.changeRate = find[EnumContractDataKey.changeValue] >= 0 ? '+' + find[EnumContractDataKey.changeRate] + '%' : find[EnumContractDataKey.changeRate] + '%';
                            if (item.apiCode && item.apiCode === this.tickDataCode) {
                                setSituationData(this.tickData, find);
                            }
                        }
                    });
                }
        }

        clickAdd(id: string) {
            this.$router.push({
                path: '/situation_manage/contract/list/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/contract/list/detail',
                query: {
                    id
                }
            });
        }

        clickEdit2(id: string) {
            // this.$alert('敬请期待');
            const find = this.tableData.data.find((item: any) => {
                return item.id === id;
            });
            if (find) {
                this.tickDataFlag = true;
                this.tickDataContractName = find.contractName;
                this.tickDataCode = find.apiCode;
            }
            this.positionShow = true;
            this.handleSocketData(keepIncomeData);
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .title-flex {
        display: flex;

        &.up > span {
            color: #ff1A02
        }

        &.down > span {
            color: #03b602;
        }

        > span {
            flex: 1;
        }
    }

    .position-table {
        border: 1px solid #ddd;
        width: 100%;
        border-collapse: collapse;

        td {
            &:nth-child(1),
            &:nth-child(3){
                width: 18%;
            }
            &:nth-child(2),
            &:nth-child(4){
                width: 32%;
            }
            &.up{
                color: #ff1A02
            }
            &.down{
                color: #03b602;
            }
            padding: 8px 10px;
            width: 25%;
            border: 1px solid #ddd;
        }
    }
</style>
