<!--时间 坐标 幅图-->
<template>
    <div class="situation-chart-body">
        <van-cell>
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
                <span class="custom-title">开启</span>
            </template>
            <template>
                <van-switch v-model="isOpen"
                            size="20px"
                            active-color="#00B600"
                            inactive-color="#ccc" @change="onValueChange"
                />
            </template>
        </van-cell>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        async asyncData({route}) {
        }
    })
    export default class ChartSetting4 extends Vue {
        chartId = -1;
        isOpen = false;

        voList: any[] = [];

        async mounted() {}

        async getData(id: number) {
            this.$showLoading();
            this.chartId = id;
            // this.clearData();
            const [_, resp] = await postAsync('/userChart/getChartDetail', {
                chartId: this.chartId
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.voList = resp?.data?.chartIndicatorsVoList || [];
                const data = this.voList?.[0]?.indicatorsSwitch || 0;
                this.isOpen = !!data;
            }
        }

        clearData() {
        }

        async doSave() {
            const chartId = this.chartId;
            const [_, resp] = await postAsync('/userChart/updateOrAddUserChart', {
                chartId,
                content: {
                    indicatorsSwitch: this.isOpen ? 1 : 0
                }
            }, {
                paramType: 'json'
            });
            // console.log(this.voList);
            // console.log(resp);
        }

        onValueChange(value: boolean) {
          //  if (this.voList && this.voList[0]) {
             //   this.voList[0].indicatorsSwitch = value ? 1 : 0;
                this.doSave();
           // }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-title{
        line-height: 50px;
        display: inline-block;
    }
    /deep/ .van-cell{
        padding: 20px 30px;
        .custom-title{
            color: #666;
            font-size: 30px;
        }
        .van-cell__value{
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
    /*/deep/ .van-switch{*/
    /*    width: 90px;*/
    /*    height: 50px;*/
    /*}*/
    /deep/ .van-switch__node{
        font-size: 20PX;
    }
    /*/deep/ .van-switch--on .van-switch__node{*/
    /*    transform: translateX(calc(90px - 4PX - 44px));*/
    /*}*/
</style>
