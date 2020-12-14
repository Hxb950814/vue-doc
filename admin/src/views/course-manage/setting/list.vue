<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                课程设置
            </div>
            <div class="common-table" style="width: 100%;">
                <el-table :data="tableData.data">
                    <el-table-column prop="idx" label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="courseTypeName" width="300" label="课程类别" />
                    <el-table-column label="课程级别">
                        <template slot-scope="scope">
                            <span>{{ getChannelStr(scope.row.courseLevel) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="主页导航展示状态">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isHomePage ? '隐藏' : '显示' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="求职导航状态">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isSeekKnowledge ? '隐藏' : '显示' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="展示顺序" />
                    <el-table-column prop="operator" label="操作" width="100">
                        <template slot-scope="scope">
                            <a
                                class="link-btn color normal"
                                style="margin: 0 5px"
                                @click="clickEdit(scope.row.courseId)"
                            >查看</a>
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
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        mounted() {
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryCourseListPage', {
                page: this.tableData.currentPage
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp.data.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickEdit(id:number) {
            this.$router.push({
                path: '/course_manage/setting/edit',
                query: {
                    id: String(id)
                }
            });
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
