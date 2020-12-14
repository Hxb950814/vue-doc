<template>
    <div>
        <div class="page-cap-title">
            问题列表
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">归属类别:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.category"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,index) in tagsList"
                                :key="index"
                                :value="item.value"
                                :label="item.name"
                            />
                        </el-select>
                    </div>
                </div>
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
                    <span class="words">问题名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入问题名称"
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
                    <el-button type="primary" @click="clickAddQuestion">
                        <i class="el-icon-plus" />
                        添加问题
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="问题名称" />
                <el-table-column prop="category" label="问题分类" />
                <el-table-column prop="publishTime" label="发布时间" />
                <el-table-column prop="status" label="状态" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <a class="link-btn normal" style="margin: 0 5px;color:#F85E5E" @click="clickDelete(scope.row.id)">删除</a>
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
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            title: '', // 问题名称
            category: '', // 问题分类
            status: '' // 状态
        };

        tagsList: any[] = [];

        mounted() {
            this.getTagsListData();
            this.getDataList();
        }

        async getTagsListData() {
            const [err, resp] = await this.$postAsync('/question/queryQuestionTypeListPage', {
                code: 'problem_type'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.tagsList = (resp?.data?.result || []).map((item: any) => ({
                    name: String(item.typeName),
                    value: String(item.questionTypeId)
                }));
            }
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/question/queryQuestionListPage', {
                page: this.tableData.currentPage,
                rows: 10,
                questionTypeId: this.search.category,
                questionName: this.search.title,
                display: this.search.status
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.questionId),
                        name: item.questionName, // 名字
                        category: item.questionType, // 类型
                        publishTime: item.publishTime, // 发布时间
                        status: item.display // 状态
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickAddQuestion() {
            this.$router.push({
                path: '/content_manage/help/problem/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/content_manage/help/problem/edit',
                query: {
                    id
                }
            });
        }

        async clickDelete(id: string) {
            // 删除
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/question/deletedQuestionById', {
                        questionId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
