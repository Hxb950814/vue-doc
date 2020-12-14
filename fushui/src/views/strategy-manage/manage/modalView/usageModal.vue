<template>
    <div>
        <el-dialog
            title="策略使用情况"
            :visible.sync="usageVisible"
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
                    prop="mobile"
                    label="订阅用户"
                    align="center"
                />
                <el-table-column
                    prop="time"
                    label="启动时间"
                    align="center"
                    width="160px"
                />
                <el-table-column
                    prop="contractName"
                    align="center"
                    label="操作合约"
                />
                <el-table-column
                    prop="endTime"
                    align="center"
                    label="终止时间"
                    width="160px"
                />
                <el-table-column
                    prop="stopType"
                    align="center"
                    label="终止形式"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.stopType === 0">运行中</span>
                        <span v-if="scope.row.stopType === 1">止损</span>
                        <span v-if="scope.row.stopType === 2">止盈</span>
                        <span v-if="scope.row.stopType === 3">到期</span>
                        <span v-if="scope.row.stopType === 4">手动</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="executeStatus"
                    label="当前状态"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.executeStatus === 0">运行中</span>
                        <span v-if="scope.row.executeStatus === 1">已停止</span>
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
        usageVisible:boolean = false; // 配置策略合约弹出层是否启动
        id:string = ''; // 当前id

        active(row:any) {
            // 激活弹层
            this.usageVisible = true;
            this.$nextTick(() => {
                this.id = row.id;
                this.getDataList(this.id);
            });
        }

        async getDataList(id:string) {
            const [err, resp] = await this.$postAsync('/strategy/queryStrategyUseTimesListPage', {
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
                        mobile: item.mobile, // 订阅用户
                        time: item.time, // 启用时间
                        contractName: item.contractName, // 操作合约
                        endTime: item.endTime, // 终止时间
                        stopType: item.stopType, // 终止形式
                        executeStatus: item.executeStatus // 当前状态
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList(this.id);
        }

        handleClose() {
            // 关闭弹框
            this.usageVisible = false;
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
