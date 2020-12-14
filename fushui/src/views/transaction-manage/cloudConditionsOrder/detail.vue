<template>
    <div>
        <div class="hbb-modalTitle">
           交易详情-<span>{{contractName}}</span>
        </div>
        <el-table
            :data="tableData.data"
            border
            style="width: 100%"
        >
            <el-table-column
                prop="date"
                label="序号"
                align="center"
                width="50"
            >
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                </template>>
            </el-table-column>
            <el-table-column
                prop="createTime"
                align="center"
                label="交易时间"
            />
            <el-table-column
                prop="sideName"
                align="center"
                label="操作方向"
            />
            <el-table-column
                prop="amount"
                align="center"
                label="交易手数"
            />
            <el-table-column
                prop="price"
                align="center"
                label="交易价格"
            />
            <el-table-column
                prop="orderStatusName"
                align="center"
                label="交易备注"
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
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';

    @Component({})
    export default class extends Mixins(commonTable) {
        contractName:string = '';
        couldOrderId:number = 0;

        active(row:any) {
            this.tableData.currentPage = 1;
            this.contractName = row.contractName;
            this.couldOrderId = row.couldOrderId;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();

            const [err, resp] = await this.$postAsync('/userOrder/getcouldOrderDetail', {
                page: this.tableData.currentPage,
                couldOrderId: this.couldOrderId
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                this.tableData.data = resp.data.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
            this.$closeLoading();
        }

        handleCurrentChange() {
            this.getDataList();
        }
    }
</script>

<style lang="scss" scoped>
.hbb-modalTitle{
    font-size: 20px;
    font-weight: bold;
    margin-top: -40px;
    margin-bottom: 30px;
    span{
        color: #ff2f2f;
        font-size: 16px;
    }
}
</style>
