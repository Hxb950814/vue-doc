<!--主图 量仓  常用-->
<template>
    <div class="situation-chart-body">
        <div v-if="typeId === 3 || typeId === 4" class="menu-list-tab">
            <div :class="{'active': !isOpen}" @click="clickClose">
                关闭
            </div>
            <div :class="{'active': isOpen}" @click="clickOpen">
                开启
            </div>
        </div>
        <div class="param-line">
            <span @click="clickOnParam">参数</span>
        </div>
        <div class="list-combine">
            <div v-for="(item,idx) in listData" :key="idx" class="block" :class="{active: item.active}"
                 @click="clickOnBlock1(idx)"
            >
                {{ item.name }}
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
    export default class ChartSetting2 extends Vue {
        chartId = -1;
        typeId= -1;
        isOpen= true;

        listData: any[] = [];
        voList: any[] = [];

        mounted() {
            // console.log(this.typeId);
        }

        async getData(id: number, typeId?: number) {
            this.typeId = typeId || -1;
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
                // const data = resp?.data?.chartIndicatorsVoList?.[0]?.indicatorsValue || '0';
                this.voList = resp?.data?.chartIndicatorsVoList || [];
            }

            if (Array.isArray(this.voList)) {
                this.listData = this.voList.map((item: any) => {
                    return {
                        active: false,
                        id: +item.chartIndicatorsId,
                        name: item.indicatorsName
                    };
                });
            }

            if (resp2?.code === '000000') {
                const list = resp2?.data?.chartIndicatorsVoList;
                const listIdx = list.map((item: any) => {
                    return +item.chartIndicatorsId;
                });
                if (this.listData.length > 0) {
                    this.listData.forEach((item: any) => {
                        if (listIdx.includes(item.id)) {
                            item.active = true;
                        }
                    });
                }
            }
        }

        clearData() {
            this.listData = [];
        }

        clickOnBlock1(idx: number) {
            const obj = this.listData[idx];
            if (obj) {
                obj.active = !obj.active;
            }
            this.doSave();
        }

        async doSave() {
            const arrPush = this.listData.filter((item: any) => item.active).map((item: any) => {
               return item.id;
            });
            const [_, resp] = await postAsync('/userChart/updateOrAddUserChart', {
                    chartId: this.chartId,
                    content: arrPush
                }, {paramType: 'json'});
            console.log(this.voList);
            console.log(resp);
        }

        clickOnParam() {
            this.$router.push({
                path: '/future/setting/chart_setting2_param',
                query: {
                    chartid: this.chartId + ''
                }
            });
        }

        clickClose() {
            if (!this.isOpen) {
                return;
            }
            this.isOpen = false;
            this.listData.forEach((item: any) => {
                item.active = false;
            });
            this.doSave();
        }

        clickOpen() {
            if (this.isOpen) {
                return;
            }
            this.isOpen = true;
            this.listData.forEach((item: any) => {
                item.active = true;
            });
            this.doSave();
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .list-combine {
        display: flex;
        width: 100%;
        /*padding: 2px;*/

        .block {
            flex-basis: 50%;
            line-height: 80px;
            background-color: #fff;
            text-align: center;
            border-top: 2Px solid #f2f2f2;
            border-left: 2Px solid #f2f2f2;
            width: 100%;
            font-size: 32px;

            &.active {
                background-color: #FF5F51;
                color: #fff;
            }

            &:nth-child(2n-1) {
                border-right: 2Px solid #f2f2f2;
                border-left: 4Px solid #f2f2f2;
            }

            &:nth-child(2n) {
                border-left: 2Px solid #f2f2f2;
                border-right: 4Px solid #f2f2f2;
            }
        }
    }

    .param-line {
        padding: 20px 30px;
        font-size: 24px;
        text-align: right;

        > span {
            color: #ff4338;
            font-size: 24px;
        }
    }
</style>
