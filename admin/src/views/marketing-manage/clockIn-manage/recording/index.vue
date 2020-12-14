<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            打卡记录
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">打卡时间:</span>
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
                            placeholder="请输入任务名称"
                            maxlength="15"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickIcon">
                        <i class="el-icon-plus" />
                        任务
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
                <el-table-column prop="student_no" label="学号" />
                <el-table-column prop="create_time" label="打卡时间" />
                <el-table-column prop="score" label="获得积分">
                </el-table-column>
                <el-table-column prop="coupon_ids" label="获得优惠券">
                </el-table-column>
                <el-table-column prop="last_time" label="上次打卡时间">
                </el-table-column>
                <el-table-column prop="continuity_day" label="连续打卡天数">
                </el-table-column>
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
    </div>
</template>

<script lang="ts">
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';
    import dayjs from "dayjs";

    @Component({
        components: {
        }
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            studentNo: '', // 学号
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
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            this.getDataList(this.search);
        }

        async getDataList(reaData:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/clockIn/selectClockInRecordListPage', {
                page: this.tableData.currentPage,
                startTime: reaData.startTime, // 开始时间
                endTime: reaData.endTime, // 结束时间
                studentNo: reaData.studentNo, // 学号
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            this.getDataList(this.search);
        }
    }
</script>

<style lang="scss">
</style>
