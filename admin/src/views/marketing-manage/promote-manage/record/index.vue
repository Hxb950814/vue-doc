<template>
    <div>
        <div class="page-cap-title">
            邀请记录
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">学号:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.studentNo"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入学号"
                            maxlength="50"
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
                <el-table-column prop="userCount" label="邀请人数" />
                <el-table-column prop="userLearnCount" label="转化人数" />
                <el-table-column prop="sumMoney" label="奖励金额">
                    <template slot-scope="scope">
                        {{ scope.row.sumMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="sumScore" label="奖励积分">
                    <template slot-scope="scope">
                        {{ scope.row.sumScore }}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="邀请明细">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row)">查看</a>
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
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            studentNo: '' // 学号
        };

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/inviteSetting/getInviteUserListPage', {
                page: this.tableData.currentPage,
                studentNo: this.search.studentNo
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

        clickEdit(item: any) {
            this.$router.push({
                path: '/marketing_manage/promote-manage/record/detail',
                query: {
                    id: String(item.user_id),
                    student_no: item.student_no
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
