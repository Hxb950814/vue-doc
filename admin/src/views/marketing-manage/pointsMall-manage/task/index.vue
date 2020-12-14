<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            积分任务
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">当前状态:</span>
                    <div class="input-text">
                        <el-select v-model="search.status" placeholder="请选择">
                            <el-option
                                v-for="item in statusList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">任务名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.taskName"
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
                <el-table-column prop="taskName" label="任务名称" />
                <el-table-column prop="taskType" label="任务类型" />
                <el-table-column prop="rewardCount" label="奖励次数" />

                <el-table-column prop="oneScore" label="单次积分" />
                <el-table-column prop="dayScore" label="单日上限"></el-table-column>
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="finishUserCount" label="完成人次"></el-table-column>
                <el-table-column prop="drawUserCount" label="领取人次"></el-table-column>
                <el-table-column prop="sortby" label="展示顺序" />
                <el-table-column prop="sendScoreSum" label="发放积分总额">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sendScoreSum | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="150">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row)">
                            查看</a>
                        <a class="link-btn color normal" v-if="!scope.row.status" style="margin: 0 5px" @click="onOffTaskSetting(scope.row)">
                            启用</a>
                        <a class="link-btn"  v-if="scope.row.status" style="margin: 0 5px;color: #ff2f2f" @click="onOffTaskSetting(scope.row)">
                            禁用</a>
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
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {
        }
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            taskName: '', // 任务名称
            status: '' // 账号状态
        };

        statusList:any[] = [
            {id: 0, title: '禁用'},
            {id: 1, title: '启用'}
        ];

        mounted() {
            this.searchData();
        }


        async onOffTaskSetting(row:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/taskScore/onOffTaskSetting', {
                taskSettingId: row.taskSettingId
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '操作成功'
                })
                this.getDataList(this.search);
            } else {
                this.$message({
                    type: 'info',
                    message: '操作失败'
                })
            }
        }



        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList(this.search);
        }

        async getDataList(reaData:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/taskScore/getTaskSettingList', {
                page: this.tableData.currentPage,
                taskName: reaData.taskName,
                status: reaData.status
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
            this.getDataList(this.search);
        }

        clickIcon() {
            // 添加任务
            this.$router.push({
                path: '/marketing_manage/pointsMall-manage/task/add'
            });
        }

        clickEdit(row:any) {
            // 查看任务
            this.$router.push({
                path: '/marketing_manage/pointsMall-manage/task/edit',
                query: {
                    id: row.taskSettingId
                }
            });
        }
    }
</script>

<style lang="scss">
</style>
