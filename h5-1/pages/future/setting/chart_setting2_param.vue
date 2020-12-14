<template>
    <div>
        <tk-nav-bar>
            {{ chartName }}
        </tk-nav-bar>
        <div class="container">
            <div class="situation-chart-setting">
                <div class="left-part">
                    <ul>
                        <li v-for="(item,idx) in listData"
                            :key="idx" class="menu"
                            :class="{selected: item.selected, active: item.active}"
                            @click="clickOnMenu(idx)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
                <div class="right-part">
                    <div class="field-area">
                        <van-field
                            v-for="(item,idx) in paramsData"
                            :key="idx"
                            v-model="item.parameterValue"
                            type="digit"
                            maxlength="6"
                            :label="item.parameterName"
                            input-align="right"
                        />
                    </div>
                    <div v-if="paramsData.length > 0">
                        <div class="func-button save" @click="clickOnSave">
                            保存修改
                        </div>
                        <div class="func-button" @click="clickOnReset">
                            恢复默认
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {getAsync, postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData() {
        }
    })
    export default class extends Vue {
        chartId= -1;
        chartIndicatorsId= -1;
        currIdx = -1;
        voList:any[] = [];
        listData:any[] = [];
        paramsData:any[] = [];
        chartName= '';

        mounted() {
            this.chartId = Number(this.$route.query.chartid || '-1');
            if (!this.chartId) {
                console.log('参数不正确');
            }
            this.getData();
        }

        async getData() {
            this.$showLoading();
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
                this.voList = resp?.data?.chartIndicatorsVoList || [];
            }

            if (Array.isArray(this.voList)) {
                this.listData = this.voList.map((item: any, idx: number) => {
                    return {
                        selected: idx === 0,
                        active: false,
                        id: +item.chartIndicatorsId,
                        chartIndicatorsId: +item.chartIndicatorsId,
                        name: item.indicatorsName
                    };
                });
            }

            let listIdx: any[] = [];
            if (resp2?.code === '000000') {
                const list = resp2?.data?.chartIndicatorsVoList;
                listIdx = list.map((item: any) => {
                    return +item.chartIndicatorsId;
                });
                this.chartName = resp2.data.chartName + '参数';
            }

            if (this.listData.length > 0) {
                this.listData.forEach((item: any) => {
                    if (listIdx.includes(item.id)) {
                        item.active = true;
                    }
                });

                this.currIdx = 0;
                this.chartIndicatorsId = this.listData[0].chartIndicatorsId;
            }
            await this.getParamsData();
        }

        async getParamsData() {
            const [_, resp3] = await getAsync('/userChart/getUserParameter', {
                chartIndicatorsId: this.chartIndicatorsId
            });
            if (resp3?.code === '000000') {
                this.paramsData = resp3?.data || [];
            } else {
                this.paramsData = [];
            }
        }

        async clickOnMenu(idxIn: number) {
            if (this.currIdx === idxIn) {
                return;
            }
            this.currIdx = idxIn;
            this.chartIndicatorsId = this.listData[idxIn].chartIndicatorsId;
            this.listData.forEach((item: any, idx: number) => {
                if (idx === idxIn && item.selected) {
                    // todo
                } else {
                    item.selected = idxIn === idx;
                    if (item.selected) {
                    }
                }
            });
            this.$showLoading();
            await this.getParamsData();
            this.$closeLoading();
        }

        async clickOnReset() {
            this.$showLoading();
            const [_, resp] = await postAsync('/userChart/updateOrAddUserParameter', {
                chartId: this.chartId,
                chartIndicatorsId: this.chartIndicatorsId,
                content: {default: 'default'}
            }, {paramType: 'json'});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('恢复成功');
                this.paramsData = resp?.data || [];
            } else {
                this.$showToast('恢复失败');
            }
        }

        async clickOnSave() {
            this.$showLoading();
            // 校验参数
            for (let i = 0; i < this.paramsData.length; ++i) {
                if (this.paramsData[i].parameterValue === '') {
                    this.$showToast(`请输入第${i + 1}个参数`);
                    return;
                }
            }
            const contentData = (this.paramsData || []).map((item: any) => {
                return {
                    indicatorsParameterId: item.indicatorsParameterId,
                    parameterValue: item.parameterValue
                };
            });
            this.$closeLoading();
            const [_, resp] = await postAsync('/userChart/updateOrAddUserParameter', {
                chartId: this.chartId,
                chartIndicatorsId: this.chartIndicatorsId,
                content: contentData
            }, {paramType: 'json'});
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
            } else {
                this.$showToast('保存失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";
    .field-area{
        padding: 15px;
    }
    /deep/ .van-cell{
        padding: 30px 30px;
    }
    /deep/ .van-cell__title{
        width: 200px;
        >span{
            font-size: 32px;
            line-height: 40px;
            color: #999;
            display: inline-block;
        }
    }
    /deep/ .van-field__body{
        height: 40px;
        .van-field__control{
            line-height: 40px;
            font-size: 32px;
        }
    }
    .func-button{
        line-height: 90px;
        font-size: 32px;
        color: #666;
        text-align: center;
        background-color: #fff;
        margin: 20px 15px;
        &.save{
            color: #FF4338;
        }
    }
</style>
