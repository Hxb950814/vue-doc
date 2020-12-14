<template>
    <div>
        <el-dialog
            v-if="orderSureVisible"
            :title="popupTitle"
            custom-class="hbb-el-dialog"
            :visible.sync="orderSureVisible"
            :width="popupWidth"
            style="margin-top:16vh"
            :before-close="handleClose"
        >
            <!--进行委托-->
            <div v-if="!entrustState" class="order-sure-con" :class="optType === 3? 'paddingNo' : ''">
                <!--下单确认-->
                <template v-if="optType === 1">
                    <span>合约名称：<b>{{ showData && !showData.codeName.includes('.')?showData.codeName : subStrFn(String(showData.codeName)) }}</b></span>
                    <span>合约代码：<b>{{ showData && !showData.code.includes('.')?showData.code :subStrFn(String(showData.code)) }}</b></span>
                    <span>下单方向：<b>{{ sideText }}</b></span>
                    <span>委托价格：<b>{{ showData && showData.price }}</b></span>
                    <span>委托手数：<b>{{ showData && showData.amount }}</b></span>
                    <span v-if="showData.originOrder !== 3">保证金约：<b>{{ showData && Number(showData.securityDeposit).toFixed(2) }}</b></span>
                </template>
                <!--撤单确认 【单条】-->
                <template v-if="optType === 2">
                    <span>合约名称：<b>{{ cheData && !cheData.codeName.includes('.')?cheData.codeName :subStrFn(String(cheData.codeName)) }}</b></span>
                    <span>合约代码：<b>{{ cheData && !cheData.code.includes('.')?cheData.code :subStrFn(String(cheData.code)) }}</b></span>
                    <span>下单方向：<b>{{ cheData && cheData.side === '0'? '买多' : '卖多' }}</b></span>
                    <span>委托价格：<b>{{ cheData && cheData.price }}</b></span>
                    <span>委托手数：<b>{{ cheData && cheData.amount }}</b></span>
                </template>
                <!--撤单确认 【多条】-->
                <template v-if="optType === 3">
                    <el-table
                        :header-cell-style="{background:'#efefef'}"
                        :data="cheAllData"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="code"
                            label="合约名称"
                            width="180"
                        >
                            <template slot-scope="scope">
                                <span>{{ !scope.row.code.includes('.')? scope.row.code : subStrFn(String(scope.row.code)) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="codeName"
                            label="合约代码"
                            width="180"
                        >
                            <template slot-scope="scope">
                                <span>{{ !scope.row.codeName.includes('.')? scope.row.codeName : subStrFn(String(scope.row.codeName)) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="side"
                            label="下单方向"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.side === 0">买多</span>
                                <span v-if="scope.row.side === 1">卖多</span>
                                <span v-if="scope.row.side === 2">卖平</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="委托价格"
                        />
                        <el-table-column
                            prop="amount"
                            label="委托手数"
                        />
                        <el-table-column
                            prop=""
                            label="撤销手数"
                        >
                            <template slot-scope="scope">
                                <span style="color: #ff2f2f">
                                    {{ Number(scope.row.amount) - Number(scope.row.dealAmount) }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <el-button class="sure-button" type="primary" @click="orderSureClick">
                    确 定
                </el-button>
            </div>

            <!--委托中-->
            <div v-else class="order-sure-con order-entrust">
                <b v-if="entrustTime !== 0">{{ tipText }}（{{ entrustTime }}）</b>
                <b v-else>{{ entrustText }}</b>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { postAsync } from '~/utils/request';

    interface cheAllData {
        code: string; // 合约名称
        codeName: string; // 合约名称
        side: number; // 下单方向
        price: number; // 委托价格
        amount: number; // 委托手数
    }

    @Component({})
    export default class OrderSure extends Vue {
        orderSureVisible:boolean = false; // 确认下单弹层 是否启动
        entrustState: boolean = false; // 是否进行委托
        entrustText: string = '委托中'; // 委托 所对应的不同文案
        entrustTime: number = 5; // 委托倒计时
        entrustTimer:any = null;// 时间对象
        showData:any = {}; // 展示数据
        cheData:any = {}; // 撤销单的数据
        optType:number = 1; // 点确认的时候该单据的类型
        popupTitle: string = '下单确认'; // 弹层title
        popupWidth: string = '450px'; // 弹层宽度
        cheAllData:cheAllData[] = []; // 一键撤销的数据
        sideText:string = ''; // 下单方向的展示字段
        tipText:string = ''; // 下单方向的展示字段
        sideType:number = 0; // 下单方向指定【平仓】

        active(data:any, type:number, side:any) {
            // 激活组件
            console.log(data);
            this.orderSureVisible = true;
            this.optType = type;
            this.sideType = side;
            if (type === 1) {
                this.showData = data;
                if (side === 1) {
                    this.sideText = this.showData.side === '0' ? '买多' : '卖空';
                } else {
                    this.sideText = this.showData.side === '0' ? '平多' : '平空';
                }
                this.popupTitle = '下单确认';
                this.popupWidth = '450px';
            } else if (type === 2) {
                // 单条数据的撤销
                this.cheData = data;
                this.popupTitle = '撤单确认';
                this.popupWidth = '450px';
            } else {
                // 多条数据的撤销
                this.cheAllData = data;
                this.popupTitle = '撤单确认';
                this.popupWidth = '750px';
            }
        }

        orderSureClick() {
            // 确认委托 并且执行倒计时]
            let objSide;
            if (this.sideType === 1) {
                objSide = String(this.showData.side);
            } else {
                objSide = String(this.showData.side) === '0' ? '1' : '0';
            }
            if (this.optType === 1) {
                const request_data = {
                    amount: String(this.showData.amount),
                    code: String(this.showData.code),
                    orderOpera: String(this.showData.orderOpera),
                    price: String(this.showData.price),
                    priceType: String(this.showData.priceType),
                    side: objSide,
                    hedgeType: String(this.showData.hedgeType)
                };
                this.sureOrderFn(request_data);
            } else if (this.optType === 2) {
                const che_data = {
                    code: this.cheData.code,
                    frontID: this.cheData.frontID,
                    orderID: this.cheData.orderID,
                    refString: this.cheData.refString,
                    sessionID: this.cheData.sessionID
                };
                const request_arr = [];
                request_arr.push(che_data);
                this.cheOrderFn(JSON.stringify(request_arr));
            } else {
                const request_all:any[] = [];
                let obj;
                this.cheAllData.map((x:any) => {
                    obj = {
                        code: x.code,
                        frontID: x.frontID,
                        orderID: x.orderID,
                        refString: x.refString,
                        sessionID: x.sessionID
                    };
                    request_all.push(obj);
                });
                this.cheOrderFn(JSON.stringify(request_all));
            }
        }

        async sureOrderFn(data:any) {
            // 确认下单
            this.tipText = '委托中';
            const [err, resp] = await postAsync('/transIndex/placeOrder', data);
            if (resp?.code === '000000') {
                this.entrustState = true;
                this.entrustText = '委托成功';
                this.entrustTime = 5;
                this.countDown();
            } else {
                this.entrustTime = 5;
                this.entrustText = '委托失败';
            }
        }

        async cheOrderFn(data:any) {
            // 撤销下单
            this.tipText = '撤销中';
            const [err, resp] = await postAsync('/transIndex/cancelOrder', { parameter: data });
            if (resp?.code === '000000') {
                this.entrustState = true;
                this.entrustTime = 5;
                this.entrustText = '撤销成功';
                this.countDown();
            } else {
                this.entrustTime = 5;
                this.entrustText = '撤销失败';
            }
        }

        countDown() {
            this.entrustTimer = setInterval(() => {
                if (this.entrustTime <= 0) {
                    this.entrustTime = 0;
                    clearInterval(this.entrustTimer);
                    this.orderSureVisible = false;
                    location.reload();
                    return;
                }
                this.entrustTime--;
            }, 1000);
        }

        handleClose() {
            this.orderSureVisible = false;
            this.entrustState = false;
        }

        subStrFn(str:string) {
            // 截取字符串
            const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
            return strLast;
        }
    }
</script>
<style lang="scss">
.hbb-el-dialog{
    .el-dialog__header{
        padding: 15px;
        border-bottom: 1px solid #ddd;

    &>.el-dialog__headerbtn{
            line-height: 10px;
            border:none;
            background: none;
            width:auto;
        }
    }
    justify-content: center;
    .order-sure-con{
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        padding: 0 70px;
        &.paddingNo{
            padding: 0;
        }
        &>span{
            display: flex;
            width: 100%;
            height: 35px;
            align-items: center;
        }
        .sure-button{
            width: 120px;
            margin: 30px auto 0 auto;

            background: rgb(255, 67, 56);
            border: none;
            height: 40px;
        }
        &.order-entrust{
            text-align: center;
            b{
                font-size: 16px;
            }
        }
    }

}
</style>
