<template>
    <el-dialog
        v-if="handicapVisible"
        :title="title"
        :visible.sync="handicapVisible"
        width="900px"
    >
        <div class="hbb-hand-box">
            <table style="width: 100%">
                <tr>
                    <td>
                        卖价
                    </td>
                    <td class="a" :class="{
                        up: dataObj.changeValue > 0,
                        down: dataObj.changeValue < 0
                    }"
                    >
                        <span>
                            {{ dataObj && dataObj.askPrice }}
                        </span>
                    </td>
                    <td class="b">
                        卖量
                    </td>
                    <td class="a">
                        {{ dataObj && dataObj.askVolume }}
                    </td>
                </tr>
                <tr>
                    <td>
                        买价
                    </td>
                    <td class="a" :class="{
                        up: dataObj.changeValue > 0,
                        down: dataObj.changeValue < 0
                    }"
                    >
                        <span>
                            {{ dataObj && dataObj.bidPrice }}
                        </span>
                    </td>
                    <td class="b">
                        买量
                    </td>
                    <td class="a">
                        {{ dataObj && dataObj.bidVolume }}
                    </td>
                </tr>
                <tr>
                    <td>
                        最新
                    </td>
                    <td class="a" :class="{
                        up: dataObj.changeValue > 0,
                        down: dataObj.changeValue < 0,
                        top: dataObj.price >= dataObj.highLimited || dataObj.price <= dataObj.lowLimited
                    }"
                    >
                        <span>
                            {{ dataObj && dataObj.price }}
                        </span>
                    </td>
                    <td class="b">
                        涨跌
                    </td>
                    <td class="a" :class="{
                        up: dataObj.changeValue > 0,
                        down: dataObj.changeValue < 0
                    }"
                    >
                        <span><b>{{dataObj.changeValue > 0 ? '+' : '-'}}</b>{{ dataObj && Number(dataObj.changeValue).toFixed(2) }}</span>
                        <span>
                            /
                            <b>{{dataObj.changeRate > 0 ? '+' : '-'}}</b>
                            {{ dataObj && Number(dataObj.changeRate).toFixed(2) }} %
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                        开盘
                    </td>
                    <td class="a"  :class="{
                        up: dataObj.open >= dataObj.preSettle,
                        down: dataObj.open < dataObj.preSettle
                    }">
                        <span>
                            {{ dataObj && dataObj.open }}
                        </span>
                    </td>
                    <td class="b">
                        成交量
                    </td>
                    <td class="a">
                        {{ dataObj && dataObj.volume }}
                    </td>
                </tr>
                <tr>
                    <td>
                        最高
                    </td>
                    <td class="a"  :class="{
                                        up: dataObj.high - dataObj.preSettle > 0,
                                        down: dataObj.high - dataObj.preSettle < 0
                                    }">
                        <span>
                            {{ dataObj && dataObj.high }}
                        </span>
                    </td>
                    <td class="b">
                        持仓量
                    </td>
                    <td class="a">
                        {{ dataObj && dataObj.position }}
                    </td>
                </tr>
                <tr>
                    <td>
                        最低
                    </td>
                    <td class="a" :class="{
                                        up: dataObj.low - dataObj.preSettle > 0,
                                        down: dataObj.low - dataObj.preSettle < 0
                                    }">
                        <span>
                            {{ dataObj && dataObj.low }}
                        </span>
                    </td>
                    <td class="b">
                        日增仓
                    </td>
                    <td class="a">
                        <span>{{ dataObj && dataObj.positionDelta ? dataObj.positionDelta : '~' }}</span> /
                        <span v-if="dataObj.prePosition">{{ dataObj && ((Number(dataObj.positionDelta) / Number(dataObj.prePosition)) * 100).toFixed(2) }}%</span>
                        <span v-else>~</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        均价
                    </td>
                    <td class="a" :class="{
                        up: dataObj.average >= dataObj.preSettle,
                        down: dataObj.average < dataObj.preSettle
                    }">
                        <span>
                            {{ dataObj && dataObj.average }}
                        </span>
                    </td>
                    <td class="b">
                        外盘
                    </td>
                    <td class="a">
                        <span>{{ dataObj && dataObj.outsideVolume ? dataObj.outsideVolume : '~' }}</span> /
                        <span v-if="dataObj.outsideVolume">{{ dataObj && ((Number(dataObj.outsideVolume) * 100) / Number(dataObj.totalVolume)).toFixed(2) }}%</span>
                        <span v-else>~</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        结算
                    </td>
                    <td class="a" :class="{
                        up: dataObj.settle >= dataObj.preSettle,
                        down: dataObj.settle < dataObj.preSettle
                    }">
                        <span>
                            {{ dataObj && dataObj.settle }}
                        </span>
                    </td>
                    <td class="b">
                        内盘
                    </td>
                    <td class="a">
                        <span>{{ dataObj && dataObj.insideVolume ? dataObj.insideVolume : '~' }}</span> /
                        <span v-if="dataObj.insideVolume">{{ dataObj && ((Number(dataObj.insideVolume) * 100) / Number(dataObj.totalVolume)).toFixed(2) }}%</span>
                        <span v-else>~</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        昨结
                    </td>
                    <td class="a" :class="{
                        up: dataObj.preSettle > 0,
                        down: dataObj.preSettle < 0
                    }">
                        <span>
                            {{ dataObj && dataObj.preSettle }}
                        </span>
                    </td>
                    <td class="b">
                        涨停
                    </td>
                    <td class="a up">
                        <span>{{ dataObj && dataObj.highLimited }}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        昨收
                    </td>
                    <td class="a" :class="{
                        up: dataObj.preClose >= dataObj.preSettle,
                        down: dataObj.preClose < dataObj.preSettle
                    }">
                        <span>
                            {{ dataObj && dataObj.preClose }}
                        </span>
                    </td>
                    <td class="b">
                        跌停
                    </td>
                    <td class="a down">
                        <span>{{ dataObj && dataObj.lowLimited }}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        杠杆
                    </td>
                    <td class="a">
                        --
                    </td>
                    <td class="b">
                        &nbsp;
                    </td>
                    <td>
                        &nbsp;
                    </td>
                </tr>
            </table>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        handicapVisible:boolean = false;
        title:string = '';

        dataObj:any = {
            price: 10
        };

        mounted() {

        }

        active(row:any) {
            console.log(row, '21221');
            this.title = '盘口-' + row.contractName;
            this.handicapVisible = true;
            this.$nextTick(() => {
                this.dataObj = row;
            });
        }
    }
</script>

<style lang="scss" scoped>
    .el-dialog__header{
        border-bottom: 1px solid #ddd;
    }
    .el-dialog__headerbtn{
        line-height: 24px !important;
    }
    .hbb-hand-box{
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
                    padding: 10px;
                    width: 50%;
                    &.a{
                        text-align: right;

                    }
                    &.up span{
                        color: $color-up;
                    }

                    &.down span{
                        color: $color-down;
                    }
                    &.b{
                        border-left: 1px solid #ddd;
                    }
                }
            }
        }
    }
</style>
