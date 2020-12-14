<template>
    <div>
        <el-dialog
            custom-class="hbb-el-dialog hbb-el-dialog1"
            :visible.sync="operationVisible"
            :center="true"
            width="1000px"
        >
            <!--内容部分-->
            <div class="my-transfer-box">
                <div class="m-t-left">
                    <!--顶部信息-->
                    <div class="title">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline">
                            <el-form-item label="交易所/主力">
                                <el-select v-model="formInline.id" placeholder="全部" @change="onMainChange">
                                    <el-option v-for="(item,index) in querySourceList" :key="index" :label="item.sourceName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="合约">
                                <el-select
                                    ref="contractSearchSelect"
                                    v-model="value"
                                    clearable
                                    :filterable="true"
                                    style="width: 150px;margin-right: 5px"
                                    placeholder="输入/选择合约"
                                    :filter-method="onContractSearchChange"
                                    @change="onContractSelectChange"
                                    @focus="onContractSearchFocus"
                                >
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!--表格数据-->
                    <el-table
                        ref="multipleTable"
                        :data="initData"
                        border
                        :header-cell-style="{background:'#efefef'}"
                        style="width: 100%;"
                        class="hbb-table2"
                        @row-click="rowClick"
                        @selection-change="handleInitChange"
                    >
                        <el-table-column
                            type="selection"
                            width="40"
                        />
                        <el-table-column
                            prop="contractCode_text"
                            align="center"
                            label="合约代码"
                        />
                        <el-table-column
                            prop="contractName"
                            align="center"
                            label="合约名称"
                        />
                        <el-table-column
                            prop="price"
                            align="center"
                            label="最新价"
                        />
                        <el-table-column
                            prop="preClose"
                            align="center"
                            label="昨收价"
                        />
                    </el-table>
                </div>
                <div class="m-t-middle">
                    <el-button class="sure-button" type="primary" @click="addClick">
                        添加
                    </el-button>
                    <el-button class="sure-button" type="danger" @click="delClick">
                        删除
                    </el-button>
                </div>
                <div class="m-t-right">
                    <!--顶部信息-->
                    <div class="title">
                        自选预览
                    </div>
                    <!--表格数据-->
                    <el-table
                        ref="multipleTable1"
                        :data="operationData"
                        border
                        :header-cell-style="{background:'#efefef'}"
                        style="width: 100%;"
                        class="hbb-table2"
                        @row-click="rowClick1"
                        @selection-change="handleOperationChange"
                    >
                        <el-table-column
                            type="selection"
                            width="40"
                        />
                        <el-table-column
                            prop="contractCode"
                            align="center"
                            label="合约代码"
                        />
                        <el-table-column
                            prop="contractName"
                            align="center"
                            label="合约名称"
                        />
                        <el-table-column
                            prop=""
                            align="center"
                            label="排序"
                            width="70px"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!--按钮部分-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="operationSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ContractDataSocket } from '@common/src/future';
    import { postAsync } from '~/utils/request';
    interface initData {
        contractCode: string; // 合约代码
        contractName: string; // 合约名称
        price: number; // 最新价
        preClose: number; // 昨收价
        quotationContractId: number // 合约id
    }
    interface operationData {
        contractCode: string; // 合约代码
        contractName: string; // 合约名称
        quotationContractId: number // 合约id
    }
    interface TypeContractSelectOption {
        value: string,
        apiCode?: string,
        label: string,
        level: number,
        contractCode:string
    }
    let cachedSpeciesOptions: any[] = [];
    let operationSocket: any = null;
    let keepCoedsData:any[] = [];
    @Component({})
    export default class OrderSure extends Vue {
        value = ''; // 选择合约
        apiCode = ''; // 选中的合约
        options: Array<TypeContractSelectOption> = [];
        operationVisible:boolean = false; // 确认下单弹层 是否启动
        formInline = {
            id: '',
            region: ''
        };

        mainContractList:any[] = []; // 拷贝一份主力合约的数据 便于切换
        querySourceList:any[] = []; // 交易所/主力列表数据

        multipleSelection: any[] = []; // 选择的数据 作为宿主

        initSelectData: any[] = []; // 初始化选择的数据 copy体
        operationSelectData: any[] = []; // 自主选择的数据 copy体

        initData:initData[] = []; // 初始化数据
        operationData: operationData[] = []; // 自选的数据

        list:any[] = []; // 所有的主力合约 选中的桥梁

        active() {
            // 激活组件
            this.operationVisible = true;
            this.initPage();
            // 初始化数据源
            this.initData = JSON.parse(JSON.stringify((this.$parent as any).mainContractList));
        }

        async initDataSocket() {
            /* 开启socket */
            operationSocket = ContractDataSocket.getIdleDataSocket(this);
            operationSocket.addListener((errCode: number, incomeData: any) => {
                console.log(incomeData);
                this.initData = incomeData.map((x:any) => {
                    const arr = this.initData.filter((y:any) => x.code === y.apiCode);
                    return {
                        price: Number(x.price),
                        preClose: Number(x.preClose),
                        contractCode: arr[0].contractCode, // 合约代码
                        contractCode_text: !arr[0].contractCode.includes('.') ? arr[0].contractCode : this.subStrFn(String(arr[0].contractCode)),
                        contractName: !arr[0].contractName.includes('.') ? arr[0].contractName : this.subStrFn(String(arr[0].contractName)), // 合约名称
                        quotationContractId: Number(arr[0].quotationContractId)
                    };
                });
            });
            await operationSocket.connect();
        }

        initPage() {
            // 初始化页面 启动获取主力合约
            this.mainContractList = JSON.parse(JSON.stringify((this.$parent as any).mainContractList));
            this.initData = this.mainContractList;
            this.getQuerySourceList();
            this.searchContractOption();
            this.initDataSocket();
            this.queryUserContract();
        }

        async onContractSearchChange(value: string) {
            await this.searchLevel2ContractData(value, false);
        }

        async onContractSearchFocus() {
            if (this.value === '') {
                this.options = JSON.parse(JSON.stringify(cachedSpeciesOptions));
            }
        }

        onContractSelectChange(value: string) {
            if (!value) {
                // 是空的，空的就把数据给拿掉
                return;
            }
            const find: any = this.options.find((item: any) => item.value === value);
            if (!find) {
                return;
            }
            if (find.level === 1) { // 行情
                this.searchLevel2ContractData(value, true);
            } else if (find.level === 2) {
                this.apiCode = find.apiCode;
                // 选中了
                // 快捷选择添加到自主合约并且选中
                const obj = {
                    contractCode: !find.contractCode.includes('.') ? find.contractCode : this.subStrFn(String(find.contractCode)), // 合约代码
                    contractName: !find.label.includes('.') ? find.label : this.subStrFn(String(find.label)), // 合约名称
                    quotationContractId: find.value // 合约id
                };
                this.operationData.push(obj);
                const currentAdd = this.operationData.filter((x:any) => x.quotationContractId === value)[0];
                (this.$refs.multipleTable1 as any).toggleRowSelection(currentAdd, true);
            }
        }

        async searchLevel2ContractData(value: number | string, resetSelect: boolean) {
            if (!value) {
                return;
            }
            // 获取搜索结果, 只能搜索合约
            const [err, resp] = await postAsync('/transIndex/querySpeciesAndContractList', {
                speciesId: value
            });
            if (resp?.code === '000000') {
                this.options = (resp?.data || []).map((item: any) => {
                    return {
                        value: String(item.contractId),
                        apiCode: String(item.apiCode),
                        label: String(item.contractName),
                        level: 2,
                        contractCode: String(item.contractCode)
                    };
                });
                if (resetSelect) {
                    (this.$refs.contractSearchSelect as any).blur(); // 先blur
                    (this.$refs.contractSearchSelect as any).focus(); // 再弹出
                }
            } else {
                this.options = [];
            }
        }

        /* 搜索获取合约信息 */
        async searchContractOption(codeOrName?: string, type?: number/* 1=种类 2=合约 */) {
            const data: any = {};
            let mlevel = 1;
            if (type === 1) {
                data.speciesId = codeOrName;
            } else if (type === 2) {
                data.contractName = codeOrName;
                mlevel = 2;
            }
            const [err, resp] = await postAsync('/transIndex/querySpeciesAndContractList', data);
            if (resp?.code === '000000') {
                if (mlevel === 1) {
                    cachedSpeciesOptions = (resp?.data || []).map((item: any) => {
                        return {
                            value: String(item.quotationSpeciesId),
                            label: String(item.speciesName),
                            level: 1
                        };
                    });
                    this.options = JSON.parse(JSON.stringify(cachedSpeciesOptions));
                } else {
                    this.options = (resp?.data || []).map((item: any) => {
                        return {
                            value: String(item.contractId),
                            apiCode: String(item.apiCode),
                            label: String(item.contractName),
                            level: 2
                        };
                    });
                }
            } else {
                this.options = [];
            }
        }

        async getQuerySourceList() {
            // 取得交易所主力下拉框
            const [err, resp] = await postAsync('/transIndex/querySourceList');
            if (resp?.code === '000000') {
                const list = resp?.data || [];
                let pushObj;
                list.map((x:any) => {
                    pushObj = {
                        id: Number(x.quotationSourceId), // 主力合约id
                        sourceName: String(x.sourceName) // 主力合约名称
                    };
                    this.querySourceList.push(pushObj);
                });
            }
        }

        async queryUserContract() {
            // 获取自选合约
            const [err, resp] = await postAsync('/transIndex/queryUserContract');
            if (resp?.code === '000000') {
                const list = resp?.data?.list || [];
                this.operationData = list.map((x:any, i:number) => {
                   return {
                       apiCode: x.apiCode,
                       contractCode: !x.contractCode.includes('.') ? x.contractCode : this.subStrFn(String(x.contractCode)),
                       contractName: !x.contractName.includes('.') ? x.contractName : this.subStrFn(String(x.contractName)),
                       quotationContractId: Number(x.quotationContractId)
                    };
                });
                // 初始化默认选中
                this.$nextTick(() => {
                    this.operationData.forEach((x:any, i:number) => {
                        (this.$refs.multipleTable1 as any).toggleRowSelection(this.operationData[i], true);
                    });
                });
            }
        }

        handleInitChange(val:any) {
            // 初始化选择的数据
            this.multipleSelection = [];
            this.multipleSelection = val;
            this.initSelectData = this.multipleSelection;
        }

        handleOperationChange(val:any) {
            // 自主选择的数据
            this.multipleSelection = [];
            this.multipleSelection = val;
            this.operationSelectData = this.multipleSelection;
        }

        addClick() {
            // 选中合约，点击【添加】进入到自选合约

            if (!this.initSelectData.length) {
                this.$showToast('请选择需要添加到自选合约的数据');
                return false;
            }
            this.initSelectData.forEach((x:any) => {
                const row = this.operationData.filter((y:any) => x.quotationContractId === y.quotationContractId);
                if (row.length > 0) {
                    this.$showToast('自选合约已存在');
                    return false;
                } else {
                    x.contractCode = !x.contractCode.includes('.') ? x.contractCode : this.subStrFn(String(x.contractCode));
                    this.operationData.push(x);
                    const index = this.initData.indexOf(x);
                    this.initData.splice(index, 1);
                }
            });
            this.operationData.map((x:any) => {
                const row = this.initSelectData.filter((y:any) => x.quotationContractId === y.quotationContractId)[0];
                (this.$refs.multipleTable1 as any).toggleRowSelection(row, true);
            });
            this.initSelectData = [];
        }

        delClick() {
            // 从自选合约中选中合约，点击【删除】，则从自选合约中删除
            if (!this.operationSelectData.length) {
                this.$showToast('请选择需要从自选合约中删除的数据');
                return false;
            }
            this.operationSelectData.forEach((x:any) => {
                x.contractCode_text = x.contractCode;
                this.initData.push(x);
                const delIndex = this.operationData.indexOf(x);
                this.operationData.splice(delIndex, 1);
            });
            keepCoedsData = this.initData.filter((item: any) => !!item.apiCode).map((item: any) => item.apiCode);
            keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
            if (keepCoedsData.length > 0) {
                operationSocket.sendContractTickGroupMessage(keepCoedsData); // 发送数据
            }

            this.operationSelectData = [];
        }

        onMainChange(value: string) {
            // 交易所/主力切换
            console.log(value);
            if (value === '0') {
                this.initData = this.mainContractList;
            } else {
                if (keepCoedsData.length > 0) {
                    operationSocket.sendCancelContractTickGroupMessage(keepCoedsData); // 先取消上一组的socket
                }
                this.getSelect(value);
            }
        }

        async getSelect(id:string) {
            const request_data = {
                quotationSourceId: id
            };
            const [err, resp] = await postAsync('/transIndex/queryContractListBySourceId', request_data);
            if (resp?.code === '000000') {
                const list = resp?.data || [];
                list.map((x:any) => {
                    return {
                        apiCode: String(x.apiCode),
                        contractCode: !x.contractCode.includes('.') ? x.contractCode : this.subStrFn(String(x.contractCode)),
                        contractName: !x.contractName.includes('.') ? x.contractName : this.subStrFn(String(x.contractName)),
                        quotationContractId: Number(x.quotationContractId)
                    };
                });
                this.initData = list;
                // 通过socket去获取列表的最新价格
                keepCoedsData = this.initData.filter((item: any) => !!item.apiCode).map((item: any) => item.apiCode);
                keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
                if (keepCoedsData.length > 0) {
                    operationSocket.sendContractTickGroupMessage(keepCoedsData); // 发送数据
                }
            }
        }

        async operationSure() {
            // 点击【确定】，更新自选合约列表
            console.log(this.operationData);
            if (this.operationSelectData.length === 0) {
                this.$showToast('请选择需要添加到自主预览的数据！');
                return false;
            }
            const request_list:any[] = [];
            this.operationSelectData.map((x:any) => {
                request_list.push(x.quotationContractId);
            });
            const requestStr = request_list.join(',');
            const [err, resp] = await postAsync('/transIndex/addUserContract', { contractIdArray: requestStr });
            if (resp?.code === '000000') {
                this.$showToast('设置成功');
                this.$emit('success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                return false;
            }
        }

        close() {
            // 关闭弹层击 【取消】，关闭操作，不影响自选合约  列表
           this.$emit('closeEvent');
            this.initData = (this.$parent as any).mainContractList;
        }

        rowClick(row:any, column:any, event:any) {
            // list -- 已选的数据 主力合约
            this.selectFn(row, column, event, 1);
        }

        rowClick1(row:any, column:any, event:any) {
            // list -- 已选的数据 自选合约
            this.selectFn(row, column, event, 2);
        }

        selectFn(row:any, column:any, event:any, type:number) {
            // list -- 已选的数据 方法
            let currentObj;
            if (type === 1) {
                currentObj = (this.$refs.multipleTable as any);
            } else {
                currentObj = (this.$refs.multipleTable1 as any);
            }
            const index = this.list.findIndex((item) => {
                // 判断已选数组中是否已存在该条数据
                return item.quotationContractId === row.quotationContractId;
            });
            if (index === -1) {
                // 如果未存在，设置已选状态，并在list中添加这条数据
                currentObj.toggleRowSelection(row, true); // 设置复选框为选中状态
                this.list.push(row);
            } else {
                // 如果已存在，设置未选状态，并在list中删除这条数据
                currentObj.toggleRowSelection(row, false); // 设置复选框为未选状态
                this.list.splice(index, 1);
            }
        }

        subStrFn(str:string) {
            // 截取字符串
            const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
            return strLast;
        }
    }
</script>
<style lang="scss">
    .hbb-el-dialog1{
        .el-dialog__headerbtn{
            display: none;
        }
        .el-dialog__header {
            padding: 0;
        }
        .el-dialog__footer{
            border-top: 1px solid #ddd;
            padding: 10px;
        }
        .my-transfer-box{
            display: flex;
            width: 100%;
            height:500px;
            .el-table td, .el-table th{
                border-left: 1px solid #e8e8e8;
                font-weight: normal;
                font-size: 14px;
                padding:5px 0;
            }
            .m-t-left{
                width: 450px;
                height: 100%;
                overflow: hidden;
                .title{
                    display: flex;
                    width: 100%;
                    .el-form-item{
                        margin-bottom: 10px;
                    }
                    .el-select{
                        width: 125px;
                        height: 30px;
                        .el-input__inner{
                            height: 30px;
                            line-height: 30px;
                        }
                        .el-input__icon{
                            line-height: 30px;
                        }

                    }
                }

            }
            .m-t-middle{
                width: 90px;
                height: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                button{
                    margin:5px 0;

                }
            }
            .m-t-right{
                width: calc(100% - 540px);
                height: 100%;
                display: flex;
                flex-direction: column;
                .title{
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    height:40px;
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
            }
        }
    }
    .hbb-table2{
        .el-table__body-wrapper{
            max-height:450px !important;
            overflow-y: auto;
        }
    }

</style>
