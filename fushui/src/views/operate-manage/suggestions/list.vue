<!-- 查看意见反馈列表-->
<template>
    <div>
        <div class="page-cap-title">
            意见反馈
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">反馈人:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="反馈人联系方式"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">提交时间:</span>
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
                            <el-option value="0" label="未处理" />
                            <el-option value="1" label="处理中" />
                            <el-option value="2" label="已处理" />
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
                <el-table-column prop="content" width="220" label="意见内容">
                    <template slot-scope="scope">
                        <template v-if="scope.row.content.length > 20">
                            <el-tooltip
                                class="item"
                                popper-class="poshytips"
                                :visible-arrow="false"
                                placement="bottom"
                                :content="scope.row.content"
                            >
                                <span class="ellipsis">{{ scope.row.content.substr(0,20) + '...' }}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            {{ scope.row.content }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="user" label="反馈人" />
                <el-table-column prop="deviceInfo" label="设备信息" />
                <el-table-column prop="appInfo" label="APP信息" />
                <el-table-column prop="time" label="提交时间" width="150" />
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === '0'" class="list-status red">{{ '未处理' }}</a>
                        <a v-else-if="scope.row.status === '1'" class="list-status">{{ '处理中' }}</a>
                        <a v-else-if="scope.row.status === '2'" class="list-status gray">{{ '已处理' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="adminName" label="处理人" />
                <el-table-column prop="processTime" label="处理时间" />
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a v-permission="'03070101'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id, scope.row.status)">
                            查看</a>
                        <span v-if="checkPermissionNotExist('03070101')">--</span>
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
            name: '', // 图片名称
            position: '', // 图片位置
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

         searchStartTimeOpt: any = {};
         searchEndTimeOpt: any = {};

        mounted() {
            // this.tableData.currentPage = 1;
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
            const [err, resp] = await this.$getAsync('/suggestion/getSuggestionList', {
                page: this.tableData.currentPage,
                userMobile: this.search.name,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || '',
                status: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.suggestionId),
                        content: item.content, // 反馈内容
                        user: item.userMobile, // 类型
                        adminName: item.adminName || '--', // 处理人
                        time: item.createTime, // 发布时间
                        deviceInfo: item.deviceInfo || '-', // device信息
                        appInfo: item.appVersion, // app信息
                        processTime: item.processTime || '--', // 处理时间
                        status: String(item.status) // 状态
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

         clickEdit(id: string, status: string) {
            if (status === '2') {
                // 处理完成了
                this.$router.push({
                    path: '/operate_manage/suggestions/check',
                    query: {
                        id
                    }
                });
            } else {
                this.$router.push({
                    path: '/operate_manage/suggestions/edit',
                    query: {
                        id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
