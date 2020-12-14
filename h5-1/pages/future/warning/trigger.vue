<template>
    <div>
        <tk-nav-bar>
            已触发预警记录
            <template slot="right">
                <div class="right-icons">
                    <a class="text-btn" @click="clickRemoveAll">
                        清空
                    </a>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container">
            <div>
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                              @init="mescrollInit"
                >
                    <div v-if="dataLoaded && dataList.length > 0" class="">
                        <van-cell-group>
                            <div v-for="(item,idx) in dataList" :key="idx" :class="{'show-func': item.isFold}">
                                <van-swipe-cell :before-close="onBeforeClose" :idx="idx">
                                    <van-cell :border="false" title="单元格" :value="item.time">
                                        <template #title>
                                            {{ item.contractName }}
                                        </template>
                                        <template #label>
                                            <div class="title-w">
                                                触发原因：{{ item.warnNote }}(<span :class="item.warnType == 0 || item.warnType === 2 ? 'up' : 'down'">{{ item.currentValue }}</span>)
                                            </div>
                                        </template>
                                    </van-cell>
                                    <template #right>
                                        <van-button square type="danger" text="删除" />
                                    </template>
                                </van-swipe-cell>
                            </div>
                        </van-cell-group>
                    </div>
                    <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                        <div class="icon">
                            暂无数据
                        </div>
                    </div>
                </mescroll-vue>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {getAsync, postAsync} from '@/utils/request';
    import dataListMixins from '@/mixins/dataListMixins';

    @Component({
        middleware: 'auth',
        async asyncData() {
        }
    })
    export default class extends dataListMixins {
        async mounted() {
            this.$showLoading();
            await this.getData(1);
            this.$closeLoading();
        }

        async getData(page: number) {
            const [_, resp] = await getAsync('/warn/getUsedWarnListPage', {
                page
            });
            // console.log(resp?.data);
            console.log('page:', page);
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        id: String(item.preWarnId),
                        quotationContractId: String(item.quotationContractId),
                        contractCode: item.contractCode,
                        contractName: item.contractName,
                        condition: item.condition,
                        warnValue: item.warnValue,
                        time: item.warnTime,
                        warnNote: item.warnNote,
                        warnType: item.warnType,
                        currentValue: item.currentValue
                    });
                });

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(list);
                this.handleRefresh(true, data.totalPage > data.pageNo);
            } else {
                this.handleRefresh(false);
            }
        }

        async removeOne(idx: number) {
            // // console.log(data);
            this.$showLoading('处理中...');
            const obj = this.dataList[idx];
            const [_, resp] = await postAsync('/warn/deletePreWarn', {
                preWarnId: obj.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('删除成功');
                this.$delete(this.dataList, idx);
            } else {
                this.$showToast('删除失败');
            }
        }

        async onBeforeClose({ position, instance }: any) {
            switch (position) {
                case 'left':
                case 'cell':
                case 'outside':
                    instance.close();
                    break;
                case 'right':
                    try {
                        const resp = await this.$showMessageBox('温馨提示', '是否删除此预警记录', '取消', '确定');
                        // console.log(resp);
                    } catch (e) {
                        return;
                    }
                    this.removeOne(instance.$attrs.idx);
                    break;
            }
        }

        async clickRemoveAll() {
            try {
                const resp = await this.$showMessageBox('温馨提示', '是否清空已触发预警记录', '取消', '确定');
                // console.log(resp);
            } catch (e) {
                return;
            }
            this.$showLoading('处理中...');
            const [_, resp] = await postAsync('/warn/batchDeletePreWarn', {
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('清空成功');
                this.dataList = [];
                this.page = 1;
                // this.mescroll.endSuccess(10, true);
            } else {
                this.$showToast('操作失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        min-height: 100vh;

        .mescroll {
            top: $nav-height;
        }
    }

    /deep/ .van-cell{
        background-color: #fff;
        @include thinBorder(bottom);
        padding: 20px;
        .van-cell__title{
            color: #333;
            font-size: 32px;
            width: 50%;
        }
        .van-cell__label{
            font-size: 24px;
            margin-top: 20px;
        }
        .van-cell__value{
            >span{
                color: #999;
                font-size: 24px;
            }
        }
    }
    /deep/ .van-swipe-cell{
        .van-button--square{
            height: 100%;
            border: 0;
            .van-button__text{
                color: #fff;
            }
        }
    }
    .title-w{
        width: 600px;
        font-size: 24px;
        .up{
            color: $color-up;
            font-size: 24px;
        }
        .down{
            color: $color-down;
            font-size: 24px;
        }
    }
    .van-cell::after{
        border: none;
    }
    .van-hairline--top-bottom::after{
        border: none;
    }
</style>
