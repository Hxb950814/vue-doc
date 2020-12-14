<template>
    <el-dialog
        v-if="F10Visible"
        title="详情"
        :visible.sync="F10Visible"
        width="900px"
    >
        <div class="hbb-p10-box">
            <table style="width: 100%">
                <tr>
                    <td class="a">
                        交易品种
                    </td>
                    <td class="b">
                        {{ dataObj.speciesName }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交易单位
                    </td>
                    <td class="b">
                        {{ dataObj.speciesUnit }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        报价单位
                    </td>
                    <td class="b">
                        {{ dataObj.speciesQuotedUnit }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        最小变动价位
                    </td>
                    <td class="b">
                        {{ dataObj.speciesMinUnit }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        涨跌停板幅度
                    </td>
                    <td class="b">
                        {{ dataObj.limitRange }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        合约交割月份
                    </td>
                    <td class="b">
                        {{ dataObj.contractMonth }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交易时间
                    </td>
                    <td class="b">
                        <p>每周一至周五</p>
                        <p>上午开盘&nbsp;&nbsp;{{ dataObj.dayAmStart }}  {{ dataObj.dayAmEnd }}</p>
                        <p>盘中休市&nbsp;&nbsp;{{ dataObj.closedStart }} - {{ dataObj.closedEnd }}</p>
                        <p>下午开盘&nbsp;&nbsp;{{ dataObj.dayPmStart }} - {{ dataObj.dayPmEnd }}</p>
                        <p>夜盘时间&nbsp;&nbsp;{{ dataObj.nightAmStart }} - {{ dataObj.nightAmEnd }}</p>
                        <p v-if="dataObj.timeNotes">
                            {{ dataObj.timeNotes }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        最后交易日
                    </td>
                    <td class="b">
                        {{ dataObj.lastTransDate }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        最后交割日
                    </td>
                    <td class="b">
                        {{ dataObj.lastTradingDay }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交割品级
                    </td>
                    <td class="b">
                        {{ dataObj.deliveryGrade }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交割地点
                    </td>
                    <td class="b">
                        {{ dataObj.deliveryPoints }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        最低交易保证金
                    </td>
                    <td class="b">
                        {{ dataObj.tradeKickerMin }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交割方式
                    </td>
                    <td class="b">
                        {{ dataObj.deliveryType }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        交易代码
                    </td>
                    <td class="b">
                        {{ dataObj.speciesCode }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        上市交易所
                    </td>
                    <td class="b">
                        {{ dataObj.quotationSourceName }}
                    </td>
                </tr>
                <tr>
                    <td class="a">
                        上市日期
                    </td>
                    <td class="b">
                        {{ dataObj.listingDate }}
                    </td>
                </tr>
            </table>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { postAsync } from '~/utils/request';

    @Component({})
    export default class extends Vue {
        F10Visible:boolean = false;

        dataObj:any = {
            speciesName: '', // 交易品种
            speciesCode: '', // 交易代码
            createTime: '', // 交易时间
            speciesUnit: '', // 交易单位
            quotationSourceName: '', // 交易锁
            speciesQuotedUnit: '', // 报价单位
            speciesMinUnit: '', // 最小变动单位
            limitRange: '', // 涨跌停板幅度
            contractMonths: '', // 合约月份度
            tradeKickerMin: '', // 最低交易保证金
            listingDate: '', // 上市日期
            lastTransDate: '', // 最后交易日
            deliveryUnit: '', // 交割单位
            deliveryType: '', // 交割方式
            contractMonth: '', // 合约交割月份
            lastTradingDay: '', // 最后交割日
            deliveryPoints: '', // 交割地点
            deliveryGrade: '', // 交割品级
            timeNotes: '', // 时间备注
            dayAmStart: '', // 上午开盘 - 开始时间
            dayAmEnd: '', // 上午开盘 - 结束时间
            closedStart: '', // 盘中休市 - 开始时间
            closedEnd: '', // 盘中休市 - 结束时间
            dayPmStart: '', // 下午开盘 - 开始时间
            dayPmEnd: '', // 下午开盘 - 结束时间
            nightAmStart: '', // 夜盘时间 - 开始时间
            nightAmEnd: '' // 夜盘时间 - 结束时间

        };

        active(row:any) {
            this.F10Visible = true;
            this.getModalData(row);
        }

        async getModalData(row:any) {
            console.log(row, '21221');
            const requestData = {
                quotationContractId: row.quotationContractId
            };
            const [err, resp] = await postAsync('/quotation/getQuotationSpeciesDetail', requestData);
            if (resp?.code === '000000') {
               const {
 speciesCode, speciesUnit, speciesQuotedUnit, speciesMinUnit, limitRange, contractMonths, tradeKickerMin,
                   listingDate, lastTransDate, deliveryUnit, deliveryType, contractMonth, lastTradingDay, deliveryPoints
                   , deliveryGrade, timeNotes, quotationSourceName, createTime, speciesName, dayAmStart, dayAmEnd, closedStart,
                   closedEnd, dayPmStart, dayPmEnd, nightAmStart, nightAmEnd
} = resp?.data;
                this.dataObj.speciesCode = speciesCode || '-';
                this.dataObj.quotationSourceName = quotationSourceName || '-';
                this.dataObj.createTime = createTime || '-';
                this.dataObj.speciesName = speciesName || '-';
                this.dataObj.speciesUnit = speciesUnit || '-';
                this.dataObj.speciesQuotedUnit = speciesQuotedUnit || '-';
                this.dataObj.speciesMinUnit = speciesMinUnit || '-';
                this.dataObj.limitRange = limitRange || '-';
                this.dataObj.contractMonths = contractMonths || '-';
                this.dataObj.tradeKickerMin = tradeKickerMin || '-';
                this.dataObj.listingDate = listingDate || '-';
                this.dataObj.lastTransDate = lastTransDate || '-';
                this.dataObj.deliveryUnit = deliveryUnit || '-';
                this.dataObj.deliveryType = deliveryType || '-';
                this.dataObj.contractMonth = contractMonth || '-';
                this.dataObj.lastTradingDay = lastTradingDay || '-';
                this.dataObj.deliveryPoints = deliveryPoints || '-';
                this.dataObj.deliveryGrade = deliveryGrade || '-';
                this.dataObj.timeNotes = timeNotes;
                this.dataObj.dayAmStart = dayAmStart;
                this.dataObj.dayAmEnd = dayAmEnd;
                this.dataObj.closedStart = closedStart;
                this.dataObj.closedEnd = closedEnd;
                this.dataObj.dayPmStart = dayPmStart;
                this.dataObj.dayPmEnd = dayPmEnd;
                this.dataObj.nightAmStart = nightAmStart;
                this.dataObj.nightAmEnd = nightAmEnd;
            } else {
                this.$message({
                    type: 'error',
                    message: '请求失败'
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-dialog__header{
        border-bottom: 1px solid #ddd;
    }
    .el-dialog__headerbtn{
        line-height: 24px !important;
    }
    .hbb-p10-box{
        display: flex;
        width: 100%;
        flex-direction: column;
        border-top: 1px solid #ddd;
        border-left: 1px solid #ddd;
        table{
            width: 100%;
            tr{
                display: flex;
                width: 100%;
                align-items: center;
                border-bottom: 1px solid #ddd;
                td{
                    color: #666;
                    font-size: 13px;
                    height: 100%;
                    padding: 5px 10px;
                    &.a{
                        width:200px;
                    }
                    &.b{
                        border-left: 1px solid #ddd;
                        width:calc(100% - 200px)
                    }
                }
            }
        }

    }
</style>
