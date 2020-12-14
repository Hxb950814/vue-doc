<template>
    <div>
        <div class="page-cap-title">
            听书课程小节
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="显示" />
                            <el-option value="0" label="隐藏" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">书本名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
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
                <div class="search-union right">
                    <el-button type="primary" @click="clickIcon">
                        <i class="el-icon-plus" />
                        听书课程小节
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
                <el-table-column prop="courseName" width="300" label="书本名称" />
                <el-table-column prop="author" label="书本作者" />
                <el-table-column prop="start" label="推荐星级" />
                <el-table-column prop="num" label="小节数量" />
                <el-table-column label="展示状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.display ? '显示' : '隐藏' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="展示顺序" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.courseListenId)"
                        >查看</a>
                        <a
                            class="link-btn"
                            style="margin: 0 5px;color: #ff2f2f"
                            @click="clickDelete(scope.row.courseListenId)"
                        >删除</a>
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
    import {Component, Watch, Vue, Mixins, Prop} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            title: '', // 图片名称
            status: '' // 状态
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
            const [err, resp] = await this.$postAsync('/course/queryCourseListenListPage', {
                page: this.tableData.currentPage,
                courseId: 5,
                display: this.search.status,
                courseName: this.search.title
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

        clickIcon() {
            this.$router.push({
                path: '/course_manage/listenToBooks/add',
                query: {
                    mode: '5'
                }
            });
        }

        clickEdit(id:number) {
            this.$router.push({
                path: '/course_manage/listenToBooks/edit',
                query: {
                    id: String(id),
                    mode: '5'
                }
            });
        }

        async clickDelete(id: number) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/course/deleteCourseListenInfoById', {
                        courseListenId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
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
