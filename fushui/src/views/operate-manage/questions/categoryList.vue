<template>
    <div>
        <div class="page-cap-title">
            问题分类
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">类型名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入类型名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">创建时间:</span>
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
                            <el-option value="0" label="可用" />
                            <el-option value="1" label="禁用" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'03060201'" type="primary" @click="clickAddCategory">
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
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">
                            {{ scope.row.status === '1' ? '可用' : '禁用' }}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a v-permission="'03060202'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <a v-permission="'03060203'">
                            <a v-if="scope.row.status === '1'" class="link-btn color red" style="margin: 0 5px" @click="clickHide(scope.row.id)">隐藏</a>
                            <a v-if="scope.row.status !== '1'" class="link-btn color orange" style="margin: 0 5px" @click="clickShow(scope.row.id)">显示</a>
                        </a>
                        <span v-if="checkPermissionNotExist('03060202,03060203')">--</span>
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
            const [err, resp] = await this.$postAsync('/contentCtrl/articleProblemList', {
                page: this.tableData.currentPage,
                title: this.search.name,
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
                        id: String(item.id),
                        name: item.title, // 名字
                        category: item.problemType, // 类型
                        count: item.count, // 关联问题数
                        createTime: item.createTime, // 创建时间
                        pv: item.pv, // pv
                        uv: item.pv, // uv
                        status: item.display ? '0' : '1' // 状态
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
                path: '/operate_manage/questions_category/add'
            });
        }

         clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/questions_category/edit',
                query: {
                    id
                }
            });
        }

         async clickHide(id: string) {
            this.$showMessageBox('是否确定隐藏?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/contentCtrl/changeDeleted', {
                        id
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
                    const [err, resp] = await this.$postAsync('/contentCtrl/changeDeleted', {
                        id
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
