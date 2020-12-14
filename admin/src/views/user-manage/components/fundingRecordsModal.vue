<template>
    <div>
        <el-dialog :title="title" center :visible.sync="dialogVisible">
            <div class="nav-common-search" style="display: flex;margin-top: -20px">
                <div class="search-union" style="width:380px;display: flex;align-items: center">
                    <span class="words">发生时间:</span>
                    <div class="input-text" style="margin-left:10px">
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            style="width: 300px"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
            </div>
            <div class="common-table" style="width: 100%;">
                <template v-if="mode === 1">
                    <el-table :data="tableData.data">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                <span>{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="发生金额" />
                        <el-table-column prop="createTime" label="发生时间" />
                        <el-table-column prop="operation" label="发生类型" />
                        <el-table-column prop="balance" label="可用余额" />
                        <el-table-column prop="reason" label="发生原因" width="300px" />
                    </el-table>
                </template>
                <template v-if="mode === 2">
                    <el-table :data="tableData.data">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                <span>{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="发生积分" />
                        <el-table-column prop="createTime" label="发生时间" />
                        <el-table-column prop="operation" label="发生类型" />
                        <el-table-column prop="balance" label="可用积分" />
                        <el-table-column prop="reason" label="发生原因" width="300px" />
                    </el-table>
                </template>
                <div class="my-pagination-wrap">
                    <my-pagination
                        :page-size="tableData.pageSize"
                        :total="tableData.count"
                        :current-page.sync="tableData.currentPage"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Mixins} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';
    @Component({})
    export default class extends Mixins(commonTable) {
        dialogVisible:boolean = false;
        title: string = '会员资金记录';
        search: any = {
            startTime: '', // 开始时间
            endTime: '' // 结束时间
        };

        mode:number = 1; // 启动弹层模式 1：资金记录  2：积分记录

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

        active(m:number) {
            this.mode = m;
            this.title = this.mode === 1 ? '会员资金记录' : '会员积分记录';
            this.dialogVisible = true;
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getData();
        }

        getData() {
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            if (this.mode === 1) {
                this.getMoneyRecord();
            } else {
                this.getDetPointRecord();
            }
        }

        async getDetPointRecord() {
            const [err, resp] = await this.$postAsync('/user/getPointRecord', {
                page: this.tableData.currentPage,
                userId: (this.$parent as any).userId,
                startTime: this.search.startTime,
                endTime: this.search.endTime
            });
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        async getMoneyRecord() {
            const [err, resp] = await this.$postAsync('/user/getMoneyRecord', {
                page: this.tableData.currentPage,
                userId: (this.$parent as any).userId
            });
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.searchData();
        }
    }
</script>

<style lang="scss" scoped>
</style>
