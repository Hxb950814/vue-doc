<!-- 添加合约-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加延展合约
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="合约名称：" prop="contractName" label-width="120px">
                    <el-input
                        v-model.trim="editData.contractName"
                        type="text"
                        placeholder="请输入行情品类名称"
                        clearable
                        maxlength="15"
                        style="width:440px"
                    />
                </el-form-item>
                <el-form-item label="合约代码：" prop="contractCode" label-width="120px">
                    <el-input
                        v-model.trim="editData.contractCode"
                        type="text"
                        placeholder="请输入合约代码"
                        clearable
                        maxlength="15"
                        style="width:440px"
                    />
                </el-form-item>
                <el-form-item label="接口代码：" prop="apiCode" label-width="120px">
                    <el-input
                        v-model.trim="editData.apiCode"
                        type="text"
                        placeholder="请输入接口代码"
                        clearable
                        maxlength="25"
                        style="width:360px"
                    />

                    <el-button type="primary" style="margin-left: 10px" @click="clickGetSituationData">
                        查询
                    </el-button>
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="交易所：" prop="quotationSourceId" label-width="120px">
                        <el-select v-model="editData.quotationSourceId" placeholder="请选择交易所">
                            <el-option
                                v-for="(item,idx) in sourceList"
                                :key="idx"
                                :value="item.id"
                                :label="item.name"
                            />
                        </el-select>
                    </el-form-item>
                    <span class="connecting-line">-</span>
                    <el-form-item label="" prop="quotationSpeciesId" label-width="0">
                        <el-select v-model="editData.quotationSpeciesId" placeholder="请选择期货种类">
                            <el-option
                                v-for="(item,idx) in speciesList"
                                :key="idx"
                                :value="item.id"
                                :label="item.name"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="标的状态：" prop="" label-width="120px">
                    {{ editData.state }}
                </el-form-item>
                <el-form-item label="是否主力：" prop="" label-width="120px">
                    {{ editData.mainBody === -1 ? '--' : editData.mainBody === 0 ? '否' : '是' }}
                </el-form-item>
                <el-form-item label="行情数据：" prop="" label-width="120px">
                    <table class="position-table">
                        <tr>
                            <td>最新</td>
                            <td :class="tickData.changeValue >= 0 ? 'up' : 'down'">
                                {{ tickData.price }}
                            </td>
                            <td>涨跌</td>
                            <td :class="tickData.changeValue >= 0 ? 'up' : 'down'">
                                {{ tickData.changeValue ? tickData.changeValue + '/' : '' }}
                                {{ tickData.changeValue ? tickData.changeRate + '%' : '' }}
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
                            <td />
                            <td />
                        </tr>
                    </table>
                </el-form-item>
                <el-form-item label="展示状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            已上架
                        </el-radio>
                        <el-radio label="0">
                            已下架
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {ContractDataSocket} from '@common/src/future';
    import {getSituationDataObject, setSituationData} from './contractData';

    let editDataSnapshot = '';
    let dataSocketInstance2: any = null;
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        editData: any = {
            contractCode: '', // 合约代码
            apiCode: '', // 接口代码
            contractName: '', // 合约名称
            quotationSourceId: '', // 行情来源，交易所id
            quotationSpeciesId: '', // 期货种类，种类id
            status: '1', // 展示状态
            state: '0', // 标的状态
            mainBody: -1 // 是否主力 -1=状态未知 0=不是 1=是
        };

        dataRule: any = {
            contractName: [{required: true, message: '请输入合约代码', trigger: 'blur'}],
            contractCode: [{required: true, message: '请输入合约名称', trigger: 'blur'}],
            apiCode: [{required: true, message: '请输入接口代码', trigger: 'blur'}],
            quotationSourceId: [{required: true, message: '请选择交易所', trigger: 'change'}],
            quotationSpeciesId: [{required: true, message: '请选择期货种类', trigger: 'change'}]
        };

        sourceList: any = []; // 行情来源列表数据
        speciesList: any = []; // 种类数据，期货数据

        oldApiCode = '';
        tickData: any = getSituationDataObject();

        @Watch('editData.quotationSourceId')
        onSourceChange() {
            this.editData.quotationSpeciesId = ''; // 先清空
            this.getDataSpecies();
        }

        mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            // console.log(dataSocketInstance2);
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            });
            // console.log(1, dataSocketInstance2);
            this.getDataSource();
            this.getDataSocket();
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
                quotationSourceId: this.editData.quotationSourceId
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

        clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {
            });
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data = {
                contractCode: this.editData.contractCode, // 合约代码
                apiCode: this.editData.apiCode, // 接口代码
                contractType: 2,
                contractName: this.editData.contractName, // 合约名称
                quotationSourceId: this.editData.quotationSourceId, // 行情来源，交易所id
                quotationSpeciesId: this.editData.quotationSpeciesId, // 期货种类，种类id
                status: this.editData.status, // 展示状态
                state: this.editData.state, // 标的状态
                mainBody: this.editData.mainBody // 是否主力
            };
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationContract', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        async getDataContract() {
            const [err, resp] = await this.$getAsync('/quotation/getQuotationContractByQuotationSpeciesId', {
                quotationSpeciesId: this.editData.quotationSpeciesId
            });
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

        async getDataSocket() {
            // if (dataSocketInstance2) {
            //     return;
            // }
            /* 开启socket */
            dataSocketInstance2 = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance2.addListener((errCode: number, incomeData: any) => {
                if (errCode === 0) {
                    this.handleSocketData(incomeData);
                } else {
                    console.log('ddd');
                }
            });
            // console.log('ss', dataSocketInstance2);
            /* 链接 */
            const results = await dataSocketInstance2.connect();
        }

        handleSocketData(incomeData: any) {
            setSituationData(this.tickData, incomeData);
        }

        async destroyDataSocket() {
            dataSocketInstance2 = null;
        }

        async clickGetSituationData() {
            if (!this.editData.apiCode) {
                this.$showToast('请输入接口代码');
                return;
            }
            if (dataSocketInstance2) {
                if (this.oldApiCode === this.editData.apiCode) {
                    return;
                }
                if (this.oldApiCode) {
                    dataSocketInstance2.sendCancelContractTickMessage(this.oldApiCode); // 先取消老的订阅
                }
                dataSocketInstance2.sendContractTickMessage(this.editData.apiCode); //
                this.oldApiCode = this.editData.apiCode;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .position-table {
        border: 1px solid #ddd;
        width: 400px;
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
            border: 1px solid #ddd;
        }
    }
</style>
