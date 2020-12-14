<template>
    <div>
        <tk-nav-bar>
            K豆订单
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <div v-if="dataLoaded && dataList.length > 0">
                    <ul class="record-ul">
                        <li v-for="(item,idx) in dataList" :key="idx">
                            <p class="code">
                                订单号：{{ item.orderNumber }}
                            </p>
                            <p class="top">
                                <span v-if="!item.isFrozen" class="money" :class="item.number >= 0 ? 'red' : 'green'">
                                    {{ item.number >=0 ? '+': '' }}{{ item.number }}
                                </span>
                                <span v-else class="money frozen">
                                    {{ item.number }}
                                </span>
                                <span class="time">{{ item.createTime }}</span>
                            </p>
                            <p class="bottom">
                                <span>{{ item.orderTypeName }}</span>
                                <span>{{ item.statusName }}</span>
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
    import {postAsync} from '~/utils/request';
    import dataListMixins from '~/mixins/dataListMixins';

    @Component({
        middleware: 'auth',
        async asyncData(context) {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyBeanOrderList');
            console.log(resp);
        }
    })
    export default class extends dataListMixins {
        mounted() {
            console.log('pages', this.page);
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyBeanOrderList', {
                userId: 1,
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
                        orderNumber: item.orderNumber,
                        orderTypeName: item.orderTypeName,
                        statusName: item.statusName,
                        isFrozen: (item.statusName || '').includes('冻结'),
                        createTime: item.createTime,
                        number: +item.number || 0
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
    .container {
        min-height: 100vh;
        padding-bottom: 20px;
    }

    .record-ul {
        li {
            padding: 20px 30px;
            background: #fff;
            @include thinBorder();

            .code {
                font-size: 24px;
                color: #666;
                margin-bottom: 10px;
            }

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

                    &.frozen{
                        color: #666;
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
