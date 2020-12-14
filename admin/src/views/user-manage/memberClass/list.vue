<!-- 账号管理 -->
<template>
    <div>
        <div class="page-cap-title">
            会员班级
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">班级状态:</span>
                    <div class="input-text">
                        <el-select v-model="search.status" placeholder="请选择">
                            <el-option
                                label="全部"
                                value=""
                            />
                            <el-option
                                label="待开班"
                                value="0"
                            />
                            <el-option
                                label="开班中"
                                value="1"
                            />
                            <el-option
                                label="已结业"
                                value="2"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">班主任学号:</span>
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
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        班级
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
                <el-table-column prop="className" label="班级名称" />
                <el-table-column prop="courseTypeName" label="课程类型" />
                <el-table-column prop="courseLevel" label="课程级别">
                    <template slot-scope="scope">
                        <span>{{ getChannelStr(String(scope.row.courseLevel)) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" />
                <el-table-column prop="student" label="班级人数" />
                <el-table-column prop="status" label="班级状态">
                    <template slot-scope="scope">
                        <span>{{ ['待开班', '开班中', '已结业'][scope.row.status] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startDate" label="开班时间" />
                <el-table-column prop="endDate" label="结束时间" />
                <el-table-column prop="studentNo" label="班主任学号" />
                <el-table-column prop="amount" label="班主任奖励" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color red" @click="clickErase(scope.row.classId)">查看</a>
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
        components: {

        }
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            status: '', // 班级状态
            studentNo: '' // 班主任学号
        };

        mounted() {
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/class/getClassList', {
                page: this.tableData.currentPage,
                status: this.search.status,
                studentNo: this.search.studentNo
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        clickAdd() {
            this.$router.push({
                path: '/user_manage/memberClass/add'
            });
        }

        clickErase(id:number) {
            this.$router.push({
                path: '/user_manage/memberClass/detail',
                query: {
                    id: String(id)
                }
            });
        }

        handleCurrentChange() {
            this.getDataList();
        }

        getChannelStr(code: string) {
            const codeArr = code.split(',');
            const map = new Map();
            map.set('0', '初级');
            map.set('1', '进阶');
            map.set('2', '小白');
            map.set('3', '其他');
            return codeArr.sort().map((item: string) => {
                return map.get(item) || '';
            }).filter((item: string) => {
                return item !== '';
            }).join(',') || '-';
        }
    }
</script>

<style lang="scss" scoped>

</style>
