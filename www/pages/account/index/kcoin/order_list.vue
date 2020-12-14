<!--k豆订单-->
<template>
    <div>
        <div class="account-section-title">
            k豆订单
            <a class="back-btn" @click="clickBack">返回</a>
        </div>
        <div class="account-section-content">
            <div>
                <div class="search-line">
                    <el-select v-model="search.status" placeholder="当前状态" style="width: 200px" clearable>
                        <el-option value="" label="全部" />
                        <el-option
                            v-for="(item,index) in statusList"
                            :key="index"
                            :value="item.value"
                            :label="item.name"
                        />
                    </el-select>
                    <el-date-picker
                        v-model="search.startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="开始时间"
                        :picker-options="searchStartTimeOpt"
                        style="width:210px"
                        clearable
                    />
                    <span class="sep">-</span>
                    <el-date-picker
                        v-model="search.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="结束时间"
                        :picker-options="searchEndTimeOpt"
                        default-time="23:59:59"
                        style="width:210px"
                        clearable
                    />
                    <el-input v-model.trim="search.orderNumber" placeholder="订单编号" style="width: 200px" clearable />
                    <el-button style="width: 100px" type="primary" @click="clickSearch">
                        查询
                    </el-button>
                </div>
            </div>
            <div class="table-wrap">
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
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { makeDatetimePickerRelationLimit } from '@common/src/helper/elementui';
    import {postAsync} from '@/utils/request';
    import TkPagination from '@/components/ui/TkPagination.vue';

    @Component({
        components: {
            TkPagination
        }
    })
    export default class kcoin extends Vue {
        search = {
            status: '',
            startTime: '',
            endTime: '',
            orderNumber: ''
        };

        currentOrderPage = 1;
        recordDataList: any[] = [];

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        recordPaginationData = {
            pageSize: 10,
            count: 0,
            currentPage: 1
        };

        statusList: any[] = [];

        mounted() {
            this.searchDateTimeLimit();
            this.getDictionary();
            this.getOrderList(1);
        }

        async getDictionary() {
            const [_, resp] = await postAsync('/beanProductCtrl/findDictionaryByCode', {
                code: 'status'
            });
            if (resp?.code === '000000') {
                this.statusList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatetimePickerRelationLimit(this.search, [
                'startTime', /* 第一个输入框 */
                'endTime' /* 第二个输入框 */
            ]);

            this.searchStartTimeOpt.disabledDate = limitFuns[0];
            this.searchEndTimeOpt.disabledDate = limitFuns[1];
            // this.searchStartTimeOpt.shortcuts = [{
            //     text: '昨天',
            //     onClick(picker: any) {
            //         picker.$emit('pick', new Date(Date.now() - 3600 * 1000 * 24));
            //     }
            // }, {
            //     text: '一周前',
            //     onClick(picker: any) {
            //         picker.$emit('pick', new Date(Date.now() - 3600 * 1000 * 24 * 7));
            //     }
            // }];
        }

        async getOrderList(page = 1) {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyBeanOrderList', {
                page,
                orderNumber: this.search.orderNumber,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || '',
                status: this.search.status
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

        clickSearch() {
            this.currentOrderPage = 1;
            this.getOrderList(1);
        }

        handleCurrentChange(page: number) {
            this.getOrderList(page);
        }

        clickBack() {
            this.$router.back();
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
        padding: 15px;

        .sec {
            width: 230px;
            margin-right: 20px;
            border: 1px solid #eee;
            border-radius: 2px;

            > div {
                /*display: flex;*/
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
        }
    }

    .search-line{
        display: flex;
        padding-top: 10px;
        padding-left: 10px;
        >div{
            margin-right: 10px;
        }
        .sep{
            line-height: 40px;
            padding-right: 10px;
        }
    }
</style>
