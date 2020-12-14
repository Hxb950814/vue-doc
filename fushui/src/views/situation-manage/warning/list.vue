<!-- 行情种类 -->
<template>
    <div>
        <div class="page-cap-title">
            预警信息
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">合约名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">操作人联系方式:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.mobile"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="10"
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
                            style="width:200px"
                        />
                        <span class="connecting-line">-</span>
                        <el-date-picker
                            v-model="search.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="结束时间"
                            :picker-options="searchEndTimeOpt"
                            style="width:200px"
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
                            clearable
                        >
                            <el-option value="" label="全部" />
                            <el-option value="0" label="启动中" />
                            <el-option value="1" label="已触发" />
                            <el-option value="2" label="已暂停" />
                            <el-option value="3" label="已删除" />
                        </el-select>
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
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="合约名称" />
                <el-table-column prop="warnCondition" label="预警条件" />
                <el-table-column prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" @click="clickShowChangeLog(scope.row.id)">{{ scope.row.createTime }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="预警状态">
                    <template slot-scope="scope">
                        {{ scope.row.stateName }}
                    </template>
                </el-table-column>
                <el-table-column prop="warnTime" label="触发时间">
                    <template slot-scope="scope">
                        <a class="link-btn color normal">{{ scope.row.warnTime || '--' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="操作人" />
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

        <el-dialog
            title="预警信息变更记录"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="changeLogShow"
            width="650px"
        >
            <div class="form-input-area" style="width: 100%;padding:0;margin: 10px 0 -10px 0">
                <div class="common-table" style="width: 100%;">
                    <el-table :data="changeDataList">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateTime" label="操作时间" />
                        <el-table-column prop="operationName" label="操作原因" />
                        <el-table-column prop="condition" label="修改后条件" />
                    </el-table>
                </div>
                <div class="my-pagination-wrap">
                    <my-pagination
                        :page-size="changeDataPageSize"
                        :total="changeDataCount"
                        :current-page.sync="changeDataCurrentPage"
                        @current-change="handleCurrentChange2"
                    />
                </div>
            </div>
        </el-dialog>
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
            name: '', // 名称
            mobile: '', // 联系方式
            status: '', // 状态
            startTime: '', // 开始时间
            endTime: '' // 结束时间
        };

        changeLogShow = false;
        sourceList: any[] = [];

        changeDataList: any[] = [];
        changeDataPageSize = 10;
        changeDataCount = 0;
        changeDataCurrentPage = 1;
        changeDataKeepId = '-1';

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        mounted() {
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
            const [err, resp] = await this.$postAsync('/warn/getWarnListPage', {
                page: this.tableData.currentPage,
                mobile: this.search.mobile,
                name: this.search.name,
                startTime: this.search.startTime,
                endTime: this.search.endTime,
                state: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.preWarnId),
                        name: item.contractName,
                        warnCondition: item.warnCondition,
                        createTime: item.createTime,
                        stateName: item.stateName,
                        warnTime: item.warnTime || '',
                        mobile: item.mobile
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        /* 预警信息变更记录 */
        async getDataLogList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/warn/getWarnLogListPage', {
                page: this.changeDataCurrentPage,
                preWarnId: this.changeDataKeepId
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        updateTime: item.updateTime,
                        operationName: item.operationName,
                        condition: item.condition + item.warnValue
                    });
                });
                this.changeDataList = list;
                this.changeDataCount = resp.data.totalCount;
            } else {
                this.changeDataList = [];
                this.changeDataCount = 0;
            }
        }

        async clickShowChangeLog(id: string) {
            this.changeDataKeepId = id;
            this.changeDataCurrentPage = 1;
            this.$showLoading();
            await this.getDataLogList();
            this.$closeLoading();
            this.changeLogShow = true;
        }

        handleCurrentChange() {
            this.getDataList();
        }

        handleCurrentChange2() {
            this.getDataLogList();
        }

        clickAdd(id: string) {
            this.$router.push({
                path: '/situation_manage/type/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/type/detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
