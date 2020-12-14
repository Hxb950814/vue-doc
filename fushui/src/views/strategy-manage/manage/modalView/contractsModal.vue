<template>
    <div>
        <el-dialog
            title="配置策略合约"
            :visible.sync="contractsVisible"
            width="900px"
            :center="true"
            :before-close="handleClose"
            custom-class="hbb-modalBox"
        >
            <el-table
                border
                :data="tableData.data"
                style="width: 100%;border:1px solid #ddd"
            >
                <el-table-column
                    prop="contractName"
                    align="center"
                    label="合约名称"
                />
                <el-table-column
                    prop="speciesName"
                    align="center"
                    label="合约种类"
                />
                <el-table-column
                    align="center"
                    prop="sourceName"
                    label="交易所"
                />
            </el-table>
            <div class="my-pagination-wrap">
                <my-pagination
                    :page-size="tableData.pageSize"
                    :total="tableData.count"
                    :current-page.sync="tableData.currentPage"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';
    @Component({
        components: {}
    })

    export default class extends Mixins(commonTable) {
        contractsVisible:boolean = false; // 配置策略合约弹出层是否启动
        id:string = ''; // 当前id

        active(row:any) {
            // 激活弹层
            this.contractsVisible = true;
            this.$nextTick(() => {
                this.id = row.id;
                this.getDataList(this.id);
            });
        }

        async getDataList(id:string) {
            const [err, resp] = await this.$postAsync('/strategy/queryContractListPage', {
                page: this.tableData.currentPage,
                strategyId: id
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                const list: any = [];
                console.log(resp.data.result);
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        contractName: item.contractName, // 合约名称
                        speciesName: item.speciesName, // 合约种类
                        sourceName: item.sourceName // 交易所
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleClose() {
            // 关闭弹框
            this.contractsVisible = false;
        }

        handleCurrentChange() {
            this.getDataList(this.id);
        }
    }

</script>

<style lang="scss">
    .hbb-modalBox {
        .el-dialog__body{
            border-top: 1px solid #ddd !important;
        }
    }
</style>
