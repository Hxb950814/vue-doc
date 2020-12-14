<!--波段-->
<template>
    <div class="situation-chart-body">
        <div class="menu-list-tab">
            <div :class="{'active': !isOpen}" @click="clickClose">
                关闭
            </div>
            <div :class="{'active': isOpen}" @click="clickOpen">
                开启
            </div>
        </div>
        <div class="slider-wrap">
            <van-slider v-model="value"
                        active-color="#ff4338"
                        :bar-height="10" :min="0" :max="100" :disabled="!isOpen" @change="onValueChange"
            />
        </div>
        <div class="value-text">
            {{ value + '%' }}
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        async asyncData({route}) {
        }
    })
    export default class ChartSetting1 extends Vue {
        chartId = -1;

        value = 0;
        isOpen = false;
        voList: any[] = [];

        async mounted() {
        }

        async getData(id: number) {
            this.chartId = id;
            this.$showLoading();
            const [_, resp] = await postAsync('/userChart/getChartDetail', {
                chartId: this.chartId
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const data = resp?.data?.chartIndicatorsVoList?.[0]?.indicatorsValue || '0';
                this.voList = resp?.data?.chartIndicatorsVoList || [];
                this.value = Number(data);
            }
            if (Array.isArray(this.voList) && this.voList[0]) {
                this.value = parseInt(this.voList[0]?.indicatorsValue || '0');
                this.isOpen = this.voList[0]?.status === 1;
            }
        }

        clickClose() {
            if (!this.isOpen) {
                return;
            }
            this.isOpen = false;
            this.doSave();
        }

        clickOpen() {
            if (this.isOpen) {
                return;
            }
            this.isOpen = true;
            this.doSave();
        }

        onValueChange(value: number) {
            this.doSave();
        }

        async doSave() {
            const chartId = this.chartId;
            const [_, resp] = await postAsync('/userChart/updateOrAddUserChart', {
                chartId,
                content: {
                    indicatorsSwitch: this.isOpen,
                    indicatorsValue: this.value
                }
            }, {
                paramType: 'json'
            });
            console.log(this.voList);
            console.log(resp);
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .slider-wrap {
        margin-top: 120px;
        height: 40px;
        width: $chart-setting-rp-width;

        .van-slider {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
        }
    }

    .custom-button {
        width: 46px;
        color: #fff;
        font-size: 20px;
        line-height: 28px;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 100px;
    }

    .value-text {
        text-align: center;
        margin-top: 60px;
        font-size: 28px;
        color: #333;
        width: $chart-setting-rp-width;
    }

    /deep/ .van-slider__bar {
        // background-color: #ff4338;
    }
</style>
