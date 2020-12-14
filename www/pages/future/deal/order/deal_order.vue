<template>
    <div>
        <el-table
            :header-cell-style="{background:'#efefef'}"
            :data="dealData"
            border
            class="hbb-table"
            style="width: 100%;max-height:calc(100% - 25px)"
        >
            <el-table-column
                prop="codeName"
                label="合约名称"
                width="120"
            />
            <el-table-column
                prop="origin"
                label="委托来源"
                width="80"
            />
            <el-table-column
                prop="side"
                label="操作类型"
                width="80"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.operation === 1">
                        <span>{{ scope.row.side === 1 ? '卖空' : '买多' }}</span>
                    </span>
                    <span v-else-if="scope.row.operation === 2">
                        <span>{{ scope.row.side === 1 ? '平多' : '平空' }}</span>
                    </span>
                    <span v-else-if="scope.row.operation === 3">
                        <span>{{ scope.row.side === 1 ? '平多' : '平空' }}</span>
                    </span>
                    <span v-else>
                        <span>{{ scope.row.side === 1 ? '平空' : '平多' }}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="成交价格"
                width="80"
            /><el-table-column
                prop="amount"
                label="成交手数"
                width="80"
            /><el-table-column
                prop="timestamp"
                label="成交时间"
                width="140"
            /><el-table-column
                prop="orderID"
                label="委托编号"
                width="180"
            /><el-table-column
                prop="fillID"
                label="成交编号"
                width="180"
            />
        </el-table>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import dayjs from 'dayjs';
    interface dealData {
        codeName: string; // 合约名称
        origin: string; // 委托来源
        side: number; // 操作类型
        price: number; // 成交价格
        amount: number; // 成交手数
        timestamp: number; // 成交时间
        orderID: string; // 委托编号
        fillID: string; // 成交编号
    }
    @Component({})
    export default class OrderSure extends Vue {
        dealData:dealData[] = []; // 持仓数据的列表
        dealDataCopy:dealData[] = []; // 持仓数据的列表拷贝
        active(data:any) {
            const arr = data.filter((x:any) => x.status === 2 || x.status === 3).map((item: any, idx: number) => {
                return {
                    codeName: String(item.codeName), // 合约名称
                    origin: String(item.origin), // 委托来源
                    side: Number(item.side), // 操作类型
                    price: Number(item.price), // 成交价格
                    amount: Number(item.amount), // 成交手数
                    status: Number(item.status), // 委托状态
                    timestamp: dayjs(item.timestamp).format('HH:mm:ss'), // 成交时间
                    orderID: String(item.orderID) || '', // 委托编号
                    fillID: String(item.fillID) || '', // 成交编号
                    operation: Number(item.operation)
                };
            });
            this.dealData = arr;
            this.dealDataCopy = JSON.parse(JSON.stringify(this.dealData));
        }

        screen(id:number) {
            // 进行筛选 0：当天 1：历史
            switch (id) {
                case 0:
                    this.dealData = this.dealDataCopy;
                    break;
                case 1:
                    this.dealData = this.dealDataCopy.filter((x:any) => x.status === 0 || x.status === 1);
                    break;
                default:
                    break;
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
