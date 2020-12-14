<template>
    <div>
        <el-dialog
            title="配置策略合约"
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
                            <el-form-item label="" class="hbb-elForm">
                                <span :class="formInline.contractMethods === '0' ? 'hbb-o-span active': 'hbb-o-span'" @click="handClick('0')">按合约种类</span>
                                <span style="margin: 0 8px" :class="formInline.contractMethods === '1' ? 'hbb-o-span active': 'hbb-o-span'" @click="handClick('1')">按合约名称</span>
                            </el-form-item>
                            <el-form-item class="hbb-elForm">
                                <el-select v-model="formInline.quotationSourceId" placeholder="请选择交易所" @change="onMainChange">
                                    <el-option label="全部" value="" />
                                    <el-option v-for="(item,index) in querySourceList" :key="index" :label="item.sourceName" :value="item.id" />
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
                            prop="name"
                            align="center"
                            :label="contractLable"
                        />
                        <el-table-column
                            prop="sourceName"
                            align="center"
                            label="交易所"
                        />
                        <el-table-column
                            prop="contractNum"
                            align="center"
                            label="合约数量"
                        />
                    </el-table>
                </div>
                <div class="m-t-middle">
                    <el-button class="sure-button" type="primary" @click="addClick">
                        添加
                    </el-button>
                    <!--                    <el-button class="sure-button sure-button1" type="danger" @click="delClick">-->
                    <!--                        删除-->
                    <!--                    </el-button>-->
                </div>
                <div class="m-t-right">
                    <!--顶部信息-->
                    <div class="title">
                        配置的合约
                    </div>
                    <!--表格数据-->
                    <el-table
                        :data="operationData"
                        border
                        :header-cell-style="{background:'#efefef'}"
                        style="width: 100%;"
                        class="hbb-table2"
                    >
                        <el-table-column
                            prop="contractName"
                            align="center"
                            label="合约名称"
                            width="120"
                        />
                        <el-table-column
                            prop="speciesName"
                            align="center"
                            label="合约种类"
                        />
                        <el-table-column
                            prop="sourceName"
                            align="center"
                            label="交易所"
                        />
                        <el-table-column
                            prop=""
                            align="center"
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <span style="cursor: pointer;color: #1a7ef8" @click="delClick(scope.row)">移除</span>
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
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    @Component({
        components: {}
    })
    export default class extends Vue {
        operationVisible:boolean = false; // 确认下单弹层 是否启动

        formInline = {
            quotationSourceId: '',
            contractMethods: '0'
        };

        mainDataCopy = {}; // 深拷贝一个对象作为临时存储的仓库

        contractLable:string = '品类名称'; // 根据快捷方式去展示不同的文案

        querySourceList:any[] = []; // 交易所/主力列表数据

        multipleSelection: any[] = []; // 选择的数据 作为宿主

        initSelectData: any[] = []; // 初始化选择的数据 copy体

        initData:any[] = []; // 初始化数据
        operationData: any[] = []; // 自选的数据

        list:any[] = []; // 所有的主力合约 选中的桥梁

        active() {
            // 激活组件
            this.operationVisible = true;
            // 初始化数据源
            this.initData = [];
            // 取得详情的配置合约的数据
            this.operationData = JSON.parse(JSON.stringify((this.$parent as any).pageData.strategyContractConfigDoList));
            this.$nextTick(() => {
                this.initPage();
            });
        }

        initPage() {
            // 初始化页面 启动获取主力合约
            this.queryAllContractRelationInfo();
            // 弹层初始化
            this.formInline.quotationSourceId = '';
            this.formInline.contractMethods = '0';
        }

        handClick(t:string) {
            // 点击切换按那种合约方式查询
            this.formInline.contractMethods = t;
            this.formInline.quotationSourceId = '';
            let listObj:any[] = [];
            // 取得所有的合约
            if (t === '0') {
                // 按种类区分
                this.contractLable = '品类名称';
                listObj = (this.mainDataCopy as any).speciesList.map((x:any) => {
                    return {
                        id: x.quotationSpeciesId, // 主力合约id
                        sourceName: x.sourceName || '', // 交易所
                        name: x.speciesName || '', // 合约种类
                        contractNum: x.contractNum || 1 // 合约数量
                    };
                });
            } else {
                // 按名称区分
                this.contractLable = '合约名称';
                listObj = (this.mainDataCopy as any).contractList.map((x:any) => {
                    return {
                        id: x.quotationContractId, // 主力合约id
                        contractCode: x.contractCode, // 合约代码
                        name: String(x.contractName), // 合约名称
                        speciesName: String(x.speciesName), // 合约种类
                        sourceName: x.sourceName || '', // 交易所
                        contractNum: x.contractNum || 1 // 合约数量
                    };
                });
            }
            this.initData = listObj;
        }

        async queryAllContractRelationInfo() {
            // 获取所有合约
            const [err, resp] = await this.$postAsync('/strategy/queryAllContractRelationInfo', {quotationSourceId: ''});
            if (resp?.code === '000000') {
                const dataObj = resp?.data || {};
                this.mainDataCopy = JSON.parse(JSON.stringify(dataObj));
                // 取得所有的交易所
                this.querySourceList = dataObj.sourceList.map((x:any) => {
                    return {
                        id: x.quotationSourceId, // 主力合约id
                        sourceName: String(x.sourceName) // 交易所
                    };
                });
                // 默认展示按合约种类的数据 contractMethods:0 走合约种类  1：走合约名称
                if (this.formInline.contractMethods === '0') {
                    this.initData = dataObj.speciesList.map((x:any) => {
                        return {
                            id: x.quotationSpeciesId, // 主力合约id
                            sourceName: x.sourceName || '', // 交易所
                            name: x.speciesName || '', // 合约种类
                            contractNum: x.contractNum || 0 // 合约数量
                        };
                    });
                } else {
                    this.initData = dataObj.contractList.map((x:any) => {
                        return {
                            id: x.quotationContractId, // 主力合约id
                            name: String(x.contractName), // 合约名称
                            contractCode: x.contractCode, // 合约代码
                            speciesName: String(x.speciesName), // 合约种类
                            sourceName: x.sourceName || '', // 交易所
                            contractNum: x.contractNum || 1 // 合约数量
                        };
                    });
                }
            }
        }

        onMainChange(value: string) {
            // 交易所/主力切换;
            if (value === '') {
                // 初始化页面 启动获取主力合约
                this.queryAllContractRelationInfo();
            } else {
                this.getSelect(value);
            }
        }

        addClick() {
            // 选中合约，点击【添加】进入到自选合约
            // 按合约种类 走接口模式  按合约名称不走接口模式
            if (this.formInline.contractMethods !== '0') {
                if (!this.initSelectData.length) {
                    this.$showToast('请选择需要添加到配置合约的数据');
                    return false;
                }
                let obj:any;
                let row:any;
                this.initSelectData.forEach((x:any) => {
                    row = this.operationData.filter((y:any) => {
                        return y.quotationContractId === x.id;
                    });
                    if (row.length > 0) {
                        this.$showToast('配置合约已存在');
                        this.initSelectData = [];
                        return false;
                    } else {
                        obj = {
                            quotationContractId: x.id, // 主力合约id
                            contractName: x.name, // 合约名称
                            contractCode: x.contractCode, // 合约代码
                            speciesName: String(x.speciesName), // 合约种类
                            sourceName: x.sourceName || '', // 交易所
                            contractNum: x.contractNum || 1 // 合约数量
                        };
                        this.operationData.push(obj);
                    }
                });
                // 点击添加到配置合约之后自动勾选
                (this.$refs.multipleTable as any).clearSelection();
            } else {
                // 按合约种类去添加
                this.queryContractBySpeciesId();
            }
        }

        delClick(row:any) {
            // 移除添加的数据
            const index = this.operationData.indexOf(row);
            this.operationData.splice(index, 1);
        }

        async queryContractBySpeciesId() {
            // 点击添加至配置合约
            const arr:any[] = [];
            this.multipleSelection.forEach((x:any) => {
                arr.push(x.id);
            });
            const requestStr = arr.join(',');
            const [err, resp] = await this.$postAsync('/strategy/queryContractBySpeciesId', {quotationSpeciesIdString: requestStr}, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                const list = resp?.data || [];
                list.forEach((x:any) => {
                    this.operationData.push(x);
                });
                const obj:any = {};
                this.operationData = this.operationData.reduce((cur:any, next:any) => {
                    // eslint-disable-next-line no-unused-expressions
                    obj[next.quotationContractId] ? '' : obj[next.quotationContractId] = true && cur.push(next);
                    return cur;
                }, []);
                // 点击添加到配置合约之后自动勾选
                (this.$refs.multipleTable as any).clearSelection();
            }
        }

        async getSelect(id:string) {
            const request_data = {
                quotationSourceId: id
            };
            const [err, resp] = await this.$postAsync('/strategy/queryContractRelationInfoById', request_data);
            if (resp?.code === '000000') {
                const list = resp?.data?.listSpecies || [];
                const list1 = resp?.data?.listContract || [];
                if (this.formInline.contractMethods === '0') {
                    this.initData = list.map((x:any) => {
                        return {
                            id: x.quotationContractId, // 主力合约id
                            sourceName: String(x.sourceName), // 交易所
                            name: String(x.speciesName), // 合约种类
                            contractNum: x.contractNum ? x.contractNum : 0// 合约数量
                        };
                    });
                } else {
                    this.initData = list1.map((x:any) => {
                        return {
                            id: x.quotationContractId, // 主力合约id
                            contractCode: x.contractCode, // 合约代码
                            sourceName: String(x.sourceName), // 交易所
                            speciesName: String(x.speciesName), // 合约种类
                            name: String(x.contractName), // 合约名称
                            contractNum: x.contractNum ? x.contractNum : 0// 合约数量
                        };
                    });
                }
            }
        }

        operationSure() {
            // 点击【确定】，更新自选合约列表
            this.operationVisible = false;
            (this.$parent as any).pageData.strategyContractConfigDoList = this.operationData;
        }

        close() {
            // 关闭弹层击 【取消】，关闭操作，不影响自选合约  列表
            this.$emit('closeEvent');
            this.operationVisible = false;
        }

        rowClick(row:any, column:any, event:any) {
            // list -- 已选的数据 主力合约
            this.selectFn(row, column, event, 1);
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

        handleInitChange(val:any) {
            // 初始化选择的数据
            this.multipleSelection = [];
            this.multipleSelection = val;
            this.initSelectData = this.multipleSelection;
        }
    }

</script>

<style lang="scss">
    .hbb-el-dialog1{
        .el-dialog__headerbtn{
            display: none;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ddd;
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
                    span{
                        color: #fff;
                    }
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
                    background: #ccc;
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
    .hbb-o-span{
        float: left;
        width: 152px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #ccc;
        cursor: pointer;
        &.active{
            background:#1a7ef8 ;
            color: #fff;
        }
    }
    .hbb-elForm{
        margin-right: 0 !important;
        .el-form-item__content{
            line-height: 40px;
            .el-select{
                height: 40px !important;
                .el-input{
                    height: 40px;
                    .el-input__inner{
                        height: 40px !important;
                        line-height: 40px !important;
                    }
                }
            }
        }
    }
</style>
