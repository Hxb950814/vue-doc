<template>
    <div>
        <el-dialog title="会员推荐详情" center :visible.sync="dialogVisible">
            <div class="nav-common-search" style="display: flex;margin-top: -20px">
                <div class="search-union " style="width:260px;display: flex;align-items: center">
                    <span class="words">账号状态:</span>
                    <div class="input-text border" style="margin-left:10px">
                        <el-select v-model="search.status" placeholder="请选择">
                            <el-option
                                v-for="item in statusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union" style="width:380px;display: flex;align-items: center">
                    <span class="words">注册时间:</span>
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
                <el-table :data="tableData.data">
                    <el-table-column prop="idx" label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mobile" label="联系方式" />
                    <el-table-column prop="wechatBind" label="微信状态">
                        <template slot-scope="scope">
                            <span>{{ scope.row.wechatBind ? '已绑定': '未绑定' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" width="160" label="注册时间" />
                    <el-table-column prop="createTime" label="是否转化" />
                    <el-table-column prop="status" label="奖励余额">
                        <template slot-scope="scope">
                            <a v-if="scope.row.status === '2'" class="list-status gray">注销</a>
                            <a v-else-if="scope.row.status === '1'" class="list-status red">锁定</a>
                            <a v-else-if="scope.row.status === '0'" class="list-status">正常</a>
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
        search: any = {
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            status: '' // 联系方式
        };

        statusList: any[] = [
            {id: '', name: '全部'},
            {id: '0', name: '未学习'},
            {id: '1', name: '学习中'},
            {id: '2', name: '锁定'}
        ]

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

       t = 1;

        active(t:number) {
            this.dialogVisible = true;
            this.t = t;
            this.searchData(t);
        }

        searchData(t:number) {
            this.tableData.currentPage = 1;
            this.getData(t);
        }

        getData(t:number) {
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            let requestData:any = {};
            if (t === 1) {
                requestData = {
                    page: this.tableData.currentPage,
                    startTime: this.search.startTime,
                    endTime: this.search.endTime,
                    recommendUserId: (this.$parent as any).userId
                };
            } else {
                requestData = {
                    page: this.tableData.currentPage,
                    startTime: this.search.startTime,
                    endTime: this.search.endTime,
                    recommendUserId: (this.$parent as any).userId,
                    status: 1
                };
            }
            this.getDataList(requestData);
        }

        async getDataList(data:any) {
            const [err, resp] = await this.$postAsync('/user/getUserList', data);
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.searchData(this.t);
        }
    }
</script>

<style lang="scss" scoped>
</style>
