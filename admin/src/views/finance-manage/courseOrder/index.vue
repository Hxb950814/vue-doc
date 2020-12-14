<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            课程订单
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">购买时间:</span>
                    <div class="input-text">
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">学号:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.studentNo"
                            style="width: 200px"
                            type="text"
                            clearable
                            placeholder="请输入学号"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">课程名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.productName"
                            style="width: 200px"
                            type="text"
                            clearable
                            placeholder="请输入课程名称"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
            </div>
        </div>
        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="studentNo" width="300px" label="学号" />
                <el-table-column prop="orderNo" width="300px" label="订单编号" />
                <el-table-column prop="productName" label="课程名称" />

                <el-table-column prop="createTime" label="购买时间" />
                <el-table-column prop="totalAmount" label="商品总额 ￥">
                    <template slot-scope="scope">
                        <span>{{ scope.row.totalAmount | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="discountAmount" label="优惠总额 ￥">
                    <template slot-scope="scope">
                        <span>{{ scope.row.discountAmount | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="实付总额 ￥">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="passagewayName" label="支付通道" />
            </el-table>
            <div class="my-pagination-wrap">
                <my-pagination
                    :page-size="tableData.pageSize"
                    :total="tableData.count"
                    :current-page.sync="tableData.currentPage"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <p>实付金额：<span style="color: #ff1a02">{{ otherData }}</span>元</p>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {
        }
    })
    export default class extends Mixins(commonTable) {
        otherData = 0;
        search: any = {
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            studentNo: '', // 学号
            productName: '' // 课程名称
        };

        time = ''; // 时间桥接

        pickerOptions:any = {
            shortcuts: [{
                text: '最近一周',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        }

        mounted() {
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            this.getDataList(this.search);
        }

        async getDataList(reaData:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/finance/getOrderList', {
                page: this.tableData.currentPage,
                startBuyTime: reaData.startTime, // 开始时间
                endBuyTime: reaData.endTime, // 结束时间
                studentNo: reaData.studentNo, // 学号
                client: 2,
                productName: reaData.productName // 课程名称
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.otherData = resp?.data?.otherData;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList(this.search);
        }
    }
</script>

<style lang="scss">
</style>
