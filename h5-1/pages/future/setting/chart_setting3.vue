<!--K线-->
<template>
    <div class="situation-chart-body">
        <div class="menu-list-tab">
            <div>
                时间变化量
            </div>
            <div class="active">
                价格百分比
            </div>
        </div>
        <div class="list-combine">
            <div class="l1">
                <div v-for="(item,idx) in list1Data" :key="idx" class="block" :class="{active: item.active}" @click="clickOnBlock1(idx)">
                    {{ item.value }}
                </div>
            </div>
            <div class="l2">
                <div v-for="(item,idx) in list2Data" :key="idx" class="block" :class="{active: item.active}" @click="clickOnBlock2(idx)">
                    {{ item.value }}%
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {getAsync, postAsync} from '@/utils/request';

    @Component({
        async asyncData({route}) {
        }
    })
    export default class ChartSetting3 extends Vue {
        chartId = -1;
        voList: any[] = [];

        list1Data: any[] = [];
        list2Data: any[] = [];

        async mounted() {
        }

        async getData(id: number) {
            this.$showLoading();
            this.chartId = id;
            this.clearData();
            const result = await Promise.all([
                getAsync('/userChart/getSystemChart', {
                    chartId: this.chartId
                }),
                postAsync('/userChart/getChartDetail', {
                    chartId: this.chartId
                })
            ]);
            const resp = result?.[0]?.[1];
            const resp2 = result?.[1]?.[1];
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list = resp?.data?.chartIndicatorsVoList?.[0]?.parameterList || [];
                const list2 = resp?.data?.chartIndicatorsVoList?.[1]?.parameterList || [];
                this.list1Data = list.map((item: any) => {
                    return {
                        active: false,
                        id: +item.indicatorsParameterId,
                        name: item.parameterName || '--',
                        value: item.parameterValue
                    };
                });
                this.list2Data = list2.map((item: any) => {
                    return {
                        active: false,
                        id: +item.indicatorsParameterId,
                        name: item.parameterName || '--',
                        value: item.parameterValue
                    };
                });
            }
            if (resp2?.code === '000000') {
                const list = resp2?.data?.chartIndicatorsVoList?.[0]?.parameterList || [];
                const list2 = resp2?.data?.chartIndicatorsVoList?.[1]?.parameterList || [];
                this.voList = resp2?.data?.chartIndicatorsVoList || [];
                /* 将已经选择的转为数组 */
                const list1Idx = list.map((item: any) => {
                    return +item.indicatorsParameterId;
                });
                const list2Idx = list2.map((item: any) => {
                    return +item.indicatorsParameterId;
                });
                if (this.list1Data.length > 0) {
                    this.list1Data.forEach((item: any) => {
                        if (list1Idx.includes(item.id)) {
                            item.active = true;
                        }
                    });
                }
                if (this.list2Data.length > 0) {
                    this.list2Data.forEach((item: any) => {
                        if (list2Idx.includes(item.id)) {
                            item.active = true;
                        }
                    });
                }
            }
        }

        clearData() {
            this.list1Data = [];
            this.list2Data = [];
        }

        clickOnBlock1(idx: number) {
            const obj = this.list1Data[idx];
            if (obj) {
                obj.active = !obj.active;
            }
            this.doSave();
        }

        clickOnBlock2(idx: number) {
            const obj = this.list2Data[idx];
            if (obj) {
                obj.active = !obj.active;
            }
            this.doSave();
        }

        async doSave() {
            const idxArr1 = this.list1Data.filter((item: any) => item.active).map((item: any) => {
                return item.id;
            });
            const idxArr2 = this.list2Data.filter((item: any) => item.active).map((item: any) => {
                return item.id;
            });
            const chartId = this.chartId;
            const [_, resp] = await postAsync('/userChart/updateOrAddUserChart', {
                chartId,
                content: Array.from(new Set(idxArr1.concat(idxArr2)))
            }, {
                paramType: 'json'
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .menu-list-tab {
        display: flex;
        justify-content: space-between;
        > div {
            flex: 1;
            line-height: 80px;
            font-size: 30px;
            text-align: center;
            color: #333;
            background-color: #fff;

            &.active {
                background-color: #FF5F51;
                color: #fff;
            }
        }
    }

    .list-combine{
        display: flex;
        width: 100%;
        >div{
            flex: 1;
        }
        .block{
            flex: 1;
            line-height: 80px;
            background-color: #fff;
            text-align: center;
            border-top: 2Px solid #f2f2f2;
            border-left: 2Px solid #f2f2f2;
            width: 100%;
            font-size: 32px;
            &.active{
                background-color: #FF5F51;
                color: #fff;
            }
        }
        >div:first-child .block{
            border-right: 1Px solid #f2f2f2;
        }
        >div:last-child .block{
            border-left: 1Px solid #f2f2f2;
            border-right: 1Px solid #f2f2f2;
        }
    }
</style>
