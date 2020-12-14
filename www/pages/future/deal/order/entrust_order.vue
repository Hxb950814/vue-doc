<template>
    <div>
        <el-table
            :header-cell-style="{background:'#efefef'}"
            :data="entrustData"
            border
            class="hbb-table hbb-table1"
            style="width: 100%;"
        >
            <el-table-column
                prop="codeName"
                label="合约名称"
                width="170"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 2" class="hbb-che" @click.stop="cheClick(scope.row)">撤</span>
                    <span>{{ scope.row.codeName }}</span>
                </template>
            </el-table-column>
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
                         <span>{{ scope.row.side === 1 ? '平多' : '平空' }}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="委托价格"
                width="80"
            /><el-table-column
                prop="amount"
                label="委托手数"
                width="80"
            /><el-table-column
                prop="dealAmount"
                label="成交手数"
                width="80"
            /><el-table-column
                prop="status"
                label="委托状态"
                width="100"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0 || scope.row.status === 1">挂单中</span>
                    <span v-if="scope.row.status === 2">部分成交</span>
                    <span v-if="scope.row.status === 3">已成交</span>
                    <span v-if="scope.row.status === 4">取消中</span>
                    <span v-if="scope.row.status === 5">已取消</span>
                    <span v-if="scope.row.status === 6">部分取消</span>
                    <span v-if="scope.row.status === 7">订单错误</span>
                    <span v-if="scope.row.status === 8">订单终结</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="timestamp"
                label="委托时间"
                width="140"
            /><el-table-column
                prop="hedgeType"
                label="投保类型"
                width="80"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.hedgeType === 0">套保</span>
                    <span v-if="scope.row.hedgeType === 1">投机</span>
                    <span v-if="scope.row.hedgeType === 2">套利</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="lasttimestamp"
                label="最后一次成交时间"
                width="160"
            /><el-table-column
                prop="dealprice"
                label="成交均价"
                width="80"
            />
        </el-table>
        <OrderSureChe ref="orderQuView" />
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import OrderSureChe from '../modal/order_sure.vue';
    import login from '~/pages/auth/login.vue';

    interface entrustData {
        codeName: string; // 合约名称
        origin: string; // 委托来源
        side: number; // 操作类型
        price: number; // 委托价格
        amount: number; // 委托手数
        dealAmount: number; // 成交手数
        status: number; // 委托状态
        timestamp: string; // 委托时间
        hedgeType: number; // 投保类型  0: 套保 1:投机 2: 套利
        lasttimestamp: string; // 最后一次成交时间
        dealprice: string; // 成交均价
    }

    @Component({
        components: { OrderSureChe }
    })
    export default class OrderSure extends Vue {
        entrustData:entrustData[] = []; // 持仓数据的列表
        entrustDataCopy:entrustData[] = []; // 持仓数据的列表 copy便于做过滤
        active(data:any) {
            this.entrustData = data.map((item: any) => {
                    return {
                        code: String(item.code), // 合约名称
                        codeName: !item.codeName.includes('.') ? item.codeName : this.subStrFn(String(item.codeName)), // 合约名称
                        origin: String(item.origin), // 委托来源
                        side: Number(item.side), // 操作类型
                        price: Number(item.price), // 委托价格
                        amount: Number(item.amount), // 委托手数
                        dealAmount: Number(item.dealAmount), // 成交手数
                        status: Number(item.status), // 委托状态
                        timestamp: dayjs(item.timestamp).format('HH:mm:ss'), // 委托时间
                        hedgeType: Number(item.hedgeType), // 投保类型
                        lasttimestamp: item.lasttimestamp ? dayjs(item.lasttimestamp).format('YYYY-MM-DD HH:mm:ss') : '-', // 委托时间
                        dealprice: String(item.dealprice) || '-', // 成交均价
                        frontID: String(item.frontID) || '', // frontID
                        orderID: String(item.orderID) || '', // 订单id
                        sessionID: String(item.sessionID) || '', // sessionID
                        refString: String(item.refString) || '', // refString
                        operation: Number(item.operation)
                    };
                });
            this.entrustDataCopy = JSON.parse(JSON.stringify(this.entrustData));
        }

        screenFn(id:number) {
            // 进行筛选 0：全部 1：未成交 2：已成交 3：部分成交 4：已取消 5：部分取消
            switch (id) {
                case 0:
                    this.entrustData = this.entrustDataCopy;
                    break;
                case 1:
                    this.entrustData = this.entrustDataCopy.filter((x:any) => x.status === 0 || x.status === 1);
                    break;
                case 2:
                    this.entrustData = this.entrustDataCopy.filter((x:any) => x.status === 3);
                    break;
                case 3:
                    this.entrustData = this.entrustDataCopy.filter((x:any) => x.status === 2);
                    break;
                case 4:
                    this.entrustData = this.entrustDataCopy.filter((x:any) => x.status === 5);
                    break;
                case 5:
                    this.entrustData = this.entrustDataCopy.filter((x:any) => x.status === 6);
                    break;
                default:
                    break;
            }
        }

        cheClick(row:any) {
            // 点击撤销 单个
            (this.$refs.orderQuView as any).active(row, 2);
        }

    subStrFn(str:string) {
        // 截取字符串
        const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
        return strLast;
    }
    }
</script>
<style lang="scss" scoped>
.hbb-table1 {
    .el-table__body-wrapper{
        height: 150px !important;
        overflow: auto;
    }
}
</style>
