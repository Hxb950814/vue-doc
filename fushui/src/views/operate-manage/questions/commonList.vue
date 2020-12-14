<template>
    <div>
        <div class="page-cap-title">
            常见问题
        </div>
        <div class="nav-common-search">
            <div class="search-line">
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
                <div class="search-union">
                    <span class="words">分类:</span>
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
                    <span class="words">发布时间:</span>
                    <div class="input-text">
                        <el-date-picker
                            v-model="search.startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="开始时间"
                            :picker-options="searchStartTimeOpt"
                            style="width:185px"
                        />
                        <span class="connecting-line">-</span>
                        <el-date-picker
                            v-model="search.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="结束时间"
                            :picker-options="searchEndTimeOpt"
                            style="width:185px"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">状态:</span>
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
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'03060101'" type="primary" @click="clickAddQuestion">
                        <i class="el-icon-plus" />
                        添加问题
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" width="300" label="问题名称" />
                <el-table-column prop="category" label="问题分类" />
                <el-table-column prop="pv" label="PV" />
                <el-table-column prop="uv" label="UV" />
                <el-table-column prop="publishTime" label="发布时间" width="150" />
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '显示' : '隐藏' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a
                            v-permission="'03060102'"
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <span v-permission="'03060103'">
                            <a
                                v-if="scope.row.status === '1'"
                                class="link-btn color red"
                                style="margin: 0 5px"
                                @click="clickHide(scope.row.id)"
                            >隐藏</a>
                            <a
                                v-if="scope.row.status !== '1'"
                                class="link-btn color orange"
                                style="margin: 0 5px"
                                @click="clickShow(scope.row.id)"
                            >显示</a>
                        </span>
                        <span v-if="checkPermissionNotExist('03060102,03060103')">--</span>
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
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};
        tagsList: any[] = [];

        mounted() {
            this.searchDateTimeLimit();
            this.getTagsListData();
            this.getDataList();
        }

        async getTagsListData() {
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'problem_type'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.tagsList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.search, [
                'startTime', /* 第一个输入框 */
                'endTime' /* 第二个输入框 */
            ]);

            this.searchStartTimeOpt.disabledDate = limitFuns[0];
            this.searchEndTimeOpt.disabledDate = limitFuns[1];
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/contentCtrl/articleList', {
                page: this.tableData.currentPage,
                type: 2, // 0=文章 1=公告 2=常见问题
                rows: 10,
                articleCategoryId: this.search.category,
                title: this.search.title,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || '',
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
                        id: String(item.articleId),
                        name: item.title, // 名字
                        category: item.problemType, // 类型
                        publishTime: item.publishTime, // 发布时间
                        pv: item.pv, // pv
                        uv: item.pv, // uv
                        status: item.display ? '1' : '0' // 状态
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
                path: '/operate_manage/common_questions/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/common_questions/edit',
                query: {
                    id
                }
            });
        }

        async clickHide(id: string) {
            this.$showMessageBox('是否确定隐藏?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/contentCtrl/changeDisplay', {
                        articleId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }

        clickShow(id: string) {
            this.$showMessageBox('是否确定显示?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/contentCtrl/changeDisplay', {
                        articleId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
