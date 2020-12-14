<template>
    <div>
        <div class="page-cap-title">
            问题分类
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <!--                <div class="search-union">-->
                <!--                    <span class="words">类型名称:</span>-->
                <!--                    <div class="input-text">-->
                <!--                        <el-input-->
                <!--                            v-model.trim="search.name"-->
                <!--                            style="width: 160px"-->
                <!--                            type="text"-->
                <!--                            clearable-->
                <!--                            placeholder="请输入类型名称"-->
                <!--                            maxlength="50"-->
                <!--                            autocomplete="off"-->
                <!--                        />-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div class="search-union">-->
                <!--                    <span class="words">创建时间:</span>-->
                <!--                    <div class="input-text">-->
                <!--                        <el-date-picker-->
                <!--                            v-model="search.startTime"-->
                <!--                            value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                            format="yyyy-MM-dd HH:mm:ss"-->
                <!--                            type="datetime"-->
                <!--                            placeholder="开始时间"-->
                <!--                            :picker-options="searchStartTimeOpt"-->
                <!--                            style="width:185px"-->
                <!--                        />-->
                <!--                        <span class="connecting-line">-</span>-->
                <!--                        <el-date-picker-->
                <!--                            v-model="search.endTime"-->
                <!--                            value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                            format="yyyy-MM-dd HH:mm:ss"-->
                <!--                            type="datetime"-->
                <!--                            placeholder="结束时间"-->
                <!--                            :picker-options="searchEndTimeOpt"-->
                <!--                            style="width:185px"-->
                <!--                        />-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div class="search-union">-->
                <!--                    <span class="words">状态:</span>-->
                <!--                    <div class="input-text">-->
                <!--                        <el-select-->
                <!--                            v-model.trim="search.status"-->
                <!--                            style="width: 160px"-->
                <!--                            placeholder="全部"-->
                <!--                        >-->
                <!--                            <el-option value="" label="全部" />-->
                <!--                            <el-option value="0" label="可用" />-->
                <!--                            <el-option value="1" label="禁用" />-->
                <!--                        </el-select>-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div class="search-union right">-->
                <!--                    <el-button type="primary" @click="searchData">-->
                <!--                        查询-->
                <!--                    </el-button>-->
                <!--                </div>-->
                <div class="search-union right">
                    <el-button type="primary" @click="clickAddCategory">
                        <i class="el-icon-plus" />
                        添加分类
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="类型名称" />
                <el-table-column prop="count" label="关联问题数" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="status" label="展示状态" />
                <el-table-column prop="sort" label="展示顺序" />
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
            name: '', // 类型名称
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        mounted() {
            this.searchDateTimeLimit();
            this.getDataList();
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
            const [err, resp] = await this.$postAsync('/question/queryQuestionTypeListPage', {
                page: this.tableData.currentPage
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.questionTypeId),
                        name: item.typeName, // 类型
                        count: item.num, // 关联问题数
                        createTime: item.createTime, // 创建时间
                        sort: item.sort, // 顺序
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

        clickAddCategory() {
            this.$router.push({
                path: '/content_manage/classification/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/content_manage/classification/edit',
                query: {
                    id
                }
            });
        }

        async clickDelete(id: string) {
            // 删除
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/question/deletedQuestionTypeById', {
                        questionTypeId: id
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
