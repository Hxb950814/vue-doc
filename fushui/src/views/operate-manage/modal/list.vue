<template>
    <div>
        <div class="page-cap-title">
            弹窗管理
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">位置:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.popupPosition"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="0" label="主页" />
                            <el-option value="1" label="我的" />
                        </el-select>
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
                <div class="search-union">
                    <span class="words">弹窗名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.popupName"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入弹窗名称"
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
                    <el-button v-permission="'03100101'" type="primary" @click="clickAddNotice">
                        <i class="el-icon-plus" />
                        添加弹窗
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="popupName" width="300" label="弹窗名称" />
                <el-table-column label="弹窗位置">
                    <template slot-scope="scope">
                        <span>{{ ['主页', '我的'][scope.row.popupPosition]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="弹窗频率">
                    <template slot-scope="scope">
                        <span>{{ scope.row.popupFrequency ? '一日多次' : '一日一次' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" />
                <el-table-column prop="endTime" label="结束时间" />
                <el-table-column label="当前状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status ? '显示' : '隐藏' }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a v-permission="'03100102'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.popupId)">查看</a>
                        <span v-if="checkPermissionNotExist('03100102')">--</span>
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
             popupName: '', // 弹窗名称
             popupPosition: '', // 弹窗位置
            status: '' // 状态
        };

         searchStartTimeOpt: any = {};
         searchEndTimeOpt: any = {};

        mounted() {
            this.getDataList();
        }

         searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

         async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/popup/queryPopupListPage', {
                page: this.tableData.currentPage,
                popupName: this.search.popupName, // 弹窗名称
                popupPosition: this.search.popupPosition, // 弹窗位置
                status: this.search.status
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
            this.getDataList();
        }

         clickAddNotice() {
            this.$router.push({
                path: '/operate_manage/modal/add'
            });
        }

         clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/modal/edit',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
