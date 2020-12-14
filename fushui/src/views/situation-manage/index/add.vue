<!-- 添加指数行情-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加指数行情
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="指数名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        placeholder="请输入指数名称"
                        clearable
                        maxlength="15"
                        style="width:500px"
                    />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource" label-width="120px">
                    <el-select v-model.trim="editData.dataSource">
                        <el-option label="外部数据" value="1" />
                        <el-option label="内部数据" value="0" />
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item v-if="editData.dataSource === '1'" label="" prop="dataIdentity" label-width="120px">
                        <el-input
                            v-model.trim="editData.dataIdentity"
                            type="text"
                            placeholder="请输入数据调用标志"
                            clearable
                            maxlength="15"
                            style="width:500px"
                        />
                    </el-form-item>
                    <div v-if="editData.dataSource === '0'" class="dis-flex">
                        <el-form-item label="" prop="quotationSourceId" label-width="120px">
                            <el-select
                                v-model.trim="editData.quotationSourceId"
                                style="width: 160px"
                                placeholder="请选择交易所"
                            >
                                <el-option value="" label="请选择交易所" />
                                <el-option
                                    v-for="(item,idx) in sourceList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="quotationSpeciesId" label-width="10px">
                            <el-select
                                v-model.trim="editData.quotationSpeciesId"
                                style="width: 160px"
                                placeholder="请选择品种"
                            >
                                <el-option value="" label="请选择品种" />
                                <el-option
                                    v-for="(item,idx) in speciesList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="quotationContractId" label-width="10px">
                            <el-select
                                v-model.trim="editData.quotationContractId"
                                style="width: 160px"
                                placeholder="请选择合约"
                            >
                                <el-option value="" label="请选择合约" />
                                <el-option
                                    v-for="(item,idx) in contractList"
                                    :key="idx"
                                    :value="item.id"
                                    :label="item.name"
                                />
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="指数数据：" prop="" label-width="120px">
                    <div class="price-label">
                        <div class="tab">
                            价格
                            <div :class="['tab-value', upDowns === '' ? '' : parseFloat(upDowns) > 0 ? 'up' : 'down']">
                                {{ price === '' ? '--' : price }}
                            </div>
                        </div>
                        <div class="tab">
                            涨跌
                            <div :class="['tab-value', upDowns === '' ? '' : parseFloat(upDowns) > 0 ? 'up' : 'down']">
                                {{ upDowns === '' ? '--' : parseFloat(upDowns) > 0 ? '+' + upDowns : upDowns }}
                            </div>
                        </div>
                        <div class="tab">
                            涨幅%
                            <div
                                :class="['tab-value', upDownsRate === '' ? '' : parseFloat(upDownsRate) > 0 ? 'up' : 'down']"
                            >
                                {{ upDownsRate === '' ? '--' : parseFloat(upDownsRate) > 0 ? '+' + upDownsRate :
                                    upDownsRate }}
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="顺序数字：" prop="sortby" label-width="120px">
                    <el-input
                        v-model.trim="editData.sortby"
                        type="order"
                        placeholder="请输入顺序数字"
                        clearable
                        maxlength="15"
                        style="width:500px"
                    />
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
    import {ContractDataSocket, EnumContractDataKey} from '@common/src/future';
    import {getValidateInteger} from '@/utils/validate';

    let dataSocketInstance: any = null;
    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        editData: any = {
            name: '', // 指数名称
            apiCode: '',
            dataSource: '1', // 数据来源  0=内部；1=外部
            dataIdentity: '', // 数据调用标志（dataSource===1有效）
            quotationSourceId: '', // 行情来源（交易所）id
            quotationSpeciesId: '', // 行情种类id
            quotationContractId: '', // 行情合约id
            sortby: '', // 顺序数字
            status: '1' // 状态
        };

        dataRule: any = {
            name: [{required: true, message: '请输入指数名称', trigger: 'blur'}],
            dataIdentity: [{required: true, message: '请输入数据调用标志', trigger: 'blur'}],
            quotationSourceId: [{required: true, message: '请选择交易所', trigger: 'change'}],
            quotationSpeciesId: [{required: true, message: '请选择种类', trigger: 'change'}],
            quotationContractId: [{required: true, message: '请选择合约', trigger: 'change'}],
            sortby: [
                {required: true, message: '请输入顺序数字', trigger: 'change'},
                {required: true, validator: getValidateInteger(), trigger: 'change'}
            ]
        };

        sourceList: any = []; // 行情来源数据
        speciesList: any = []; // 行情种类数据
        contractList: any = []; // 行情合约数据

        oldApi = '';
        upDowns = ''; // 涨跌
        price = ''; // 价格
        upDownsRate = ''; // 涨跌幅

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            });

            this.initDataSocket();
            this.getDataSource();
        }

        beforeDestroy() {
            dataSocketInstance = null;
        }

        @Watch('editData.quotationSourceId')
        onSourceChange() {
            this.editData.quotationSpeciesId = ''; // 先清空
            this.editData.quotationContractId = ''; // 先清空
            this.getDataSpecies();
        }

        @Watch('editData.quotationSpeciesId')
        onSpeciesChange() {
            this.editData.quotationContractId = ''; // 先清空
            this.getDataContract();
        }

        @Watch('editData.quotationContractId')
        onContractChange(id: string, oldValue: string) {
            // console.log(id);
            // if (!oldValue && id) {
            //     // 初始化
            //     return;
            // }
            const find = this.contractList.find((item: any) => {
                return item.id === id;
            });
            if (find && find.apiCode) {
                dataSocketInstance.sendCancelContractTickMessage(this.oldApi);
                this.oldApi = find.apiCode;
                dataSocketInstance.sendContractTickMessage(find.apiCode);
                this.editData.apiCode = find.apiCode;
            } else {
                this.upDowns = '--'; // 涨跌
                this.price = '--'; // 价格
                this.upDownsRate = '--'; // 涨跌幅
                this.editData.apiCode = '';
            }
        }

        /* 获得交易所数据 */
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

        /* 根据交易所数据获得种类数据 */
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

        /* 根据行情种类获得品类数据 */
        async getDataContract() {
            const [err, resp] = await this.$getAsync('/quotation/getQuotationContractByQuotationSpeciesId', {
                quotationSpeciesId: this.editData.quotationSpeciesId
            });
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationContractId),
                        name: item.contractName,
                        apiCode: item.apiCode
                    });
                });
                this.contractList = list;
            }
        }

        async initDataSocket() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                if (errCode === 0) {
                    this.handleSocketData(incomeData);
                }
            });
            // console.log('ss', dataSocketInstance2);
            /* 链接 */
            const results = await dataSocketInstance.connect();
        }

        handleSocketData(incomeData: any) {
            // console.log('ss', incomeData);
            this.upDowns = incomeData[EnumContractDataKey.changeValue]; // 涨跌
            this.price = incomeData[EnumContractDataKey.price] + '';
            this.upDownsRate = incomeData[EnumContractDataKey.changeRate] + '%';
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
            const data: any = {
                indexName: this.editData.name, // 指数名称
                dataSource: this.editData.dataSource,
                sortby: this.editData.sortby,
                status: this.editData.status
            };
            if (this.editData.dataSource === '1') {
                data.dataIdentity = this.editData.dataIdentity; // 指数名称
            } else {
                data.quotationContractId = this.editData.quotationContractId;
                data.quotationSpeciesId = this.editData.quotationSpeciesId;
                data.quotationSourceId = this.editData.quotationSourceId;
            }
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationIndex', data, {
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
    }
</script>

<style lang="scss">
    .price-label {
        display: flex;
        padding-top: 12px;

        .tab {
            width: 60px;
            text-align: center;
        }

        .tab-value {
            padding-top: 10px;

            &.up {
                color: #ff5855;
            }

            &.down {
                color: green;
            }
        }
    }
</style>
