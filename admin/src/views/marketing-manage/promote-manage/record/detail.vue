<template>
    <div>
        <div class="page-cap-title">
            学号：{{ student_no }}的邀请明细
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">是否转化:</span>
                    <div class="input-text">
                        <el-select v-model="search.status" placeholder="请选择">
                            <el-option
                                label="否"
                                value="0"
                            />
                            <el-option
                                label="是"
                                value="1"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">注册时间:</span>
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
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="student_no" width="360" label="学号" />
                <el-table-column prop="create_time" label="注册时间" />
                <el-table-column prop="learn_state" label="是否转化">
                    <template slot-scope="scope">
                        {{ scope.row.learn_state ? '是': '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sumMoney" label="实际邀请人金额">
                    <template slot-scope="scope">
                        {{ scope.row.sumMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="sumScore" label="实际邀请人积分">
                    <template slot-scope="scope">
                        {{ scope.row.sumScore }}
                    </template>
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
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        id:string = '';
        student_no:string = '';
        search: any = {
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            studentNo: '', // 学号
            status: '' // 账号状态
        };

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

        time = ''; // 时间桥接

        mounted() {
            this.id = String(this.$route.query.id);
            this.student_no = String(this.$route.query.student_no);

            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            this.getDataList();
        }

        searchData() {
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/inviteSetting/getInviteUserDetailListPage', {
                page: this.tableData.currentPage,
                startTime: this.search.startTime,
                endTime: this.search.endTime,
                studentNo: this.search.studentNo,
                status: this.search.status,
                recommendUserId: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                this.tableData.data = resp?.data?.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }
    }
</script>

<style lang="scss" scoped>
</style>
