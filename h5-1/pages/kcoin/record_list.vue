<template>
    <div>
        <tk-nav-bar>
            K豆记录
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据" @init="mescrollInit">
                <div v-if="dataLoaded && dataList.length > 0">
                    <ul class="record-ul">
                        <li v-for="(item,idx) in dataList" :key="idx">
                            <p class="top">
                                <span class="money" :class="item.number >= 0 ? 'red' : 'green'">{{ item.number >=0 ? '+': '' }}{{ item.number }}</span>
                                <span class="time">{{ item.createTime }}</span>
                            </p>
                            <p class="bottom">
                                <span>{{ item.causeText }}</span>
                                <span>{{ item.typeText }}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                    <div class="icon">
                        暂无记录
                    </div>
                </div>
            </mescroll-vue>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';
    import dataListMixins from '@/mixins/dataListMixins';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData() {
        }
    })
    export default class extends dataListMixins {
        async getData(page: number) {
            const [_, resp] = await postAsync('/beanProductCtrl/beanRecordList', {
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
                        causeText: item.causeText,
                        createTime: item.createTime, // createTime
                        typeText: item.typeText,
                        number: +item.number // k豆金额
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
    }
</script>

<style lang="scss" scoped>
    .record-ul {
        li {
            padding: 20px 30px;
            background: #fff;
            /*&:not(:nth-last-child){*/
            @include thinBorder();
            /*}*/
            .top {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;

                > span {
                    font-size: 28px;
                }

                .money {
                    font-size: 36px;

                    &.red {
                        color: $color-up;
                    }

                    &.green {
                        color: $color-down;
                    }
                }

                .time {
                    color: #999;
                }
            }

            .bottom {
                display: flex;
                justify-content: space-between;

                > span {
                    font-size: 28px;
                    color: #666;
                }
            }
        }
    }
</style>
