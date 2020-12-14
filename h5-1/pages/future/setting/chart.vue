<template>
    <div>
        <tk-nav-bar>
            图表设置
        </tk-nav-bar>
        <div class="container">
            <div class="situation-chart-setting">
                <div class="left-part">
                    <ul>
                        <li v-for="(item,idx) in menusData"
                            :key="idx" class="menu"
                            :class="{active: item.active}"
                            @click="clickOnMenu(idx)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
                <div class="right-part">
                    <component :is="currentTabComponent" ref="tabComp" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ChartSetting1 from './chart_setting1.vue';
    import ChartSetting2 from './chart_setting2.vue';
    import ChartSetting3 from './chart_setting3.vue';
    import ChartSetting4 from './chart_setting4.vue';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: { ChartSetting1, ChartSetting2, ChartSetting3, ChartSetting4 },
        async asyncData({route}) {
            let menusData: any[] = [];
            const [_, resp] = await postAsync('/userChart/getAllChart');
            // let typeIdKeep = -1;
            // let idKeep = route.query.charid ? Number(route.query.charid) : -1;

            if (resp?.code === '000000') {
                const activeIndex = 0;
                menusData = (resp?.data || []).map((item: any, idx: number) => {
                    return {
                        id: +item.chartId,
                        typeId: +item.chartTypeId,
                        name: item.chartName,
                        active: idx === activeIndex
                    };
                });
            } else {
                menusData = [];
            }
            return {
                menusData
            };
        }
    })
    export default class extends Vue {
        menusData:any[] = [];
        chartId= -1;
        typeId= -1;
        currentTabComponent= 'ChartSetting1';

        mounted() {
            let idx = 0;
            if (this.$route.query.chartid) {
                this.chartId = Number(this.$route.query.chartid || '-1');
                const findIndex = this.menusData.findIndex((item: any) => item.id === this.chartId);
                if (findIndex >= 0) {
                    this.typeId = this.menusData[findIndex].typeId;
                    idx = findIndex;
                } else {
                    this.chartId = this.menusData[0].id;
                    this.typeId = this.menusData[0].typeId;
                    idx = 0;
                }
            } else {
                this.chartId = this.menusData[0].id;
                this.typeId = this.menusData[0].typeId;
                idx = 0;
            }
            console.log('typeId', this.typeId);
            console.log('chartId', this.chartId);
            this.switchPage(idx);
        }

        clickOnMenu(idxIn: number) {
            this.menusData.forEach((item: any, idx: number) => {
                if (idx === idxIn && item.active) {
                    // todo
                } else {
                    item.active = idxIn === idx;
                    if (item.active) {
                        this.switchPage(idx);
                    }
                }
            });
        }

        switchPage(idx: number) {
            console.log(idx);
            const menu = this.menusData[idx];
            this.typeId = menu.typeId;
            this.chartId = menu.id;
            // location.search = 'chartid=' + menu.id;
            switch (this.typeId) {
                case 1:
                    this.currentTabComponent = 'ChartSetting1';
                    break;
                case 2:
                case 3:
                case 4:
                    this.currentTabComponent = 'ChartSetting2';
                    break;
                case 5:
                    this.currentTabComponent = 'ChartSetting3';
                    break;
                case 6:
                case 7:
                case 8:
                    this.currentTabComponent = 'ChartSetting4';
                    break;
            }
            setTimeout(() => {
                const func = (this.$refs.tabComp as any).getData;
                if (func) {
                    func(this.chartId, this.typeId);
                }
            }, 0);
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";
    .container{
        height: auto;
        min-height: auto;
    }
</style>
