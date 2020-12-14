<!--k豆-->
<template>
    <div>
        <div class="account-section-title">
            我的K豆
            <a class="right-link">K豆是什么?</a>
        </div>
        <div class="account-section-content">
            <div class="k-coin-block">
                <div>
                    <p class="value color">
                        {{ totalBean }}
                    </p>
                    <p class="desc">
                        可用K豆<a class="theme1" @click="clickBuy">购买</a>
                    </p>
                </div>
                <div>
                    <p class="value">
                        {{ freezeBean }}
                    </p>
                    <p class="desc">
                        冻结K豆<a class="theme2" @click="clickRecordFrozen">记录</a>
                    </p>
                </div>
                <div>
                    <p class="value">
                        {{ consumptionBean }}
                    </p>
                    <p class="desc">
                        消费K豆<a class="theme2" @click="clickRecordCost">记录</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="account-section-title">
            K豆订单<span class="tips">(记录购买的k豆订单)</span>
            <nuxt-link class="right-link" to="/account/kcoin/order_list">
                更多
            </nuxt-link>
        </div>
        <div class="account-section-content">
            <div v-show="dataLoaded" class="table-wrap">
                <table class="setting-table">
                    <colgroup>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>订单编号</th>
                            <th>时间</th>
                            <th>K豆数量/个</th>
                            <th>金额/元</th>
                            <th>订单来源</th>
                            <th>当前状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in recordDataList" :key="item.id">
                            <td>{{ key + 1 }}</td>
                            <td>{{ item.orderNumber }}</td>
                            <td>{{ item.createTime }}</td>
                            <td>{{ item.count }}</td>
                            <td>{{ item.amount | money }}</td>
                            <td>{{ item.passagewayName }}</td>
                            <td>{{ item.statusName }}</td>
                        </tr>
                    </tbody>
                </table>
                <tk-pagination v-if="recordDataList.length !== 0"
                               :page-size="recordPaginationData.pageSize"
                               :total="recordPaginationData.count"
                               :current-page.sync="recordPaginationData.currentPage"
                               @current-change="handleCurrentChange"
                />
            </div>
            <tk-loading-cap v-show="!dataLoaded" style="margin:0 0;padding: 10px;" />
        </div>
        <div class="account-section-title" style="margin-top: 10px">
            K豆任务
        </div>
        <div class="account-section-content">
            <div class="mission-parts">
                <div v-for="(item,idx) in taskList" v-show="dataLoaded" :key="idx" class="sec">
                    <div>{{ item.name }}</div>
                    <div>
                        <span>{{ item.number }}K豆</span>
                        <el-button type="danger" round class="getbtn"
                                   :loading="taskGetLoadingIndex === idx" :disabled="!item.isReceive"
                                   @click="clickGetTaskReward(idx)"
                        >
                            领取
                        </el-button>
                    </div>
                </div>
                <tk-loading-cap v-show="!dataLoaded" style="width: 100%" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { postAsync } from '@/utils/request';
    import TkPagination from '@/components/ui/TkPagination.vue';
    import TkLoadingCap from '@/components/ui/TkLoadingCap.vue';

    @Component({
        components: {
            TkPagination,
            TkLoadingCap
        }
    })
    export default class kcoin extends Vue {
        dataLoaded = false;

        totalBean = '--'; // 总共
        availableBean = '--'; // 可用
        consumptionBean = '--'; // 消费
        freezeBean = '--'; // 冻结
        currentOrderPage = 1;
        recordDataList: any[] = [];

        taskList: any[] = [];

        taskGetLoadingIndex = -1;

        recordPaginationData = {
            pageSize: 3,
            count: 0,
            currentPage: 1
        };

        mounted() {
           this.getAllData();
        }

        getAllData() {
            Promise.all(
                [
                    this.getData(),
                    this.getOrderList(1),
                    this.getTaskList()
                ]
            ).then(() => {
                this.dataLoaded = true;
            });
        }

        async getData() {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyAccount');
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.banners || []).forEach((item: any) => {
                    list.push({
                        imageUrl: item.imageUrl,
                        urlType: String(item.urlType), // 类型 1=内部链接 2=外部链接
                        url: item.url, // url
                        pageId: item.pageId,
                        pageKey: item.pageKey,
                        pageValue: item.pageValue
                    });
                });

                this.totalBean = data.balance;
                this.freezeBean = data.freezeBean;
                this.consumptionBean = Math.abs(data.consumption) + '';
                // this.balanceBean = data.balance;
                this.availableBean = data.available;
                // this.iconsList = list;
            }
        }

        async getOrderList(page: number) {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyBeanOrderList', {
                page,
                rows: 3
            });
            if (resp?.code === '000000') {
                this.currentOrderPage = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        id: item.id,
                        orderNumber: item.orderNumber,
                        orderTypeName: item.orderTypeName,
                        amount: item.amount,
                        count: item.count,
                        statusName: item.statusName,
                        passagewayName: item.passagewayName,
                        isFrozen: (item.statusName || '').includes('冻结'),
                        createTime: item.createTime,
                        number: +item.number || 0
                    });
                });
                this.recordDataList = list;

                this.recordPaginationData.count = data?.totalCount || 0;
                this.recordPaginationData.currentPage = page;
            } else {
                this.recordDataList = [];
            }
        }

        async getTaskList() {
            const [_, resp] = await postAsync('/beanProductCtrl/findUserTask');
            if (resp?.code === '000000') {
                // 2
                    this.taskList = (resp.data || []).map((item: any) => {
                        return {
                            name: item.name,
                            id: item.beanRewardId,
                            isReceive: item.isReceive,
                            number: item.number
                        };
                    });
            } else {
                this.taskList = [];
            }
        }

        async clickGetTaskReward(idx: number) {
            const id = this.taskList[idx].id;
            this.taskGetLoadingIndex = idx;
            const [_, resp] = await postAsync('/beanProductCtrl/saveBeanRecord', {
                beanRewardId: id
            });
            if (resp?.code === '000000') {
                this.$showToast('领取成功');
                this.getAllData();
            } else {
                this.$showToast(resp?.message || '领取失败');
            }
            this.taskGetLoadingIndex = -1;
        }

        handleCurrentChange(page: number) {
            this.getOrderList(page);
        }

        clickRecordFrozen() {
            // clickRecord
            this.$router.push({
                path: '/account/kcoin/record_list_frozen'
            });
        }

        clickBuy() {
            this.$router.push({
                path: '/account/kcoin/buy'
            });
        }

        clickRecordCost() {
            this.$router.push({
                path: '/account/kcoin/record_list_cost'
            });
        }
    }
</script>

<style lang="scss" scoped>
    .k-coin-block {
        margin-bottom: 10px;
        display: flex;

        > div {
            flex: 1;
            text-align: center;
            padding: 20px 0;
        }

        .value {
            color: #666;
            font-size: 24px;

            &.color {
                color: $color-main;
            }

            margin-bottom: 20px;
        }

        .desc {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #333;
            font-size: 15px;

            > a {
                display: inline-block;
                width: 50px;
                margin-left: 10px;
                line-height: 24px;
                border-radius: 3px;
                color: #fff;
                // background-color: #ff2f2f;
                cursor: pointer;

                &.theme1 {
                    background-color: #ff4338;
                }

                &.theme2 {
                    background-color: #0ca2ff;
                }
            }
        }
    }

    .table-wrap {
        padding: 10px;
    }

    .mission-parts {
        display: flex;
        flex-wrap: wrap;
        padding: 15px;

        .sec {
            margin-bottom: 10px;
            width: 230px;
            margin-right: 10px;
            border: 1px solid #eee;
            border-radius: 2px;

            > div {
                font-size: 15px;
                line-height: 50px;
                height: 50px;
                color: #333;
                padding: 0 15px;

                &:first-child {
                    border-bottom: 1px solid #eaeaea;
                }

                &:last-child {
                    display: flex;
                    align-items: center;
                }
            }
        }

        .getbtn {
            line-height: 30px;
            height: 30px;
            margin-left: auto;
            padding: 0 18px;
        }
    }
</style>
