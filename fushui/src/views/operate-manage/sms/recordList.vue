<template>
    <div>
        <div class="page-cap-title">
            短信记录
        </div>

        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">联系方式:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入联系方式"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">短信内容:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.content"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入内容关键字"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">发送时间:</span>
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
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="成功" />
                            <el-option value="0" label="失败" />
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
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="content" label="短信内容">
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
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1' ? '成功' : '失败' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="发送时间" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a v-permission="'03050101'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <span v-if="checkPermissionNotExist('03050101')">--</span>
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
    import {formatMoney} from '@/utils/number';
    import * as validator from '@/utils/validate';
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
         search: any = {
            phone: '', // 联系方式
            content: '', // 内容
            startTime: '', // 发送时间起始
            endTime: '', // 发送时间结束
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
            const [err, resp] = await this.$getAsync('/message/getMessageRecordList', {
                page: this.tableData.currentPage,
                mobile: this.search.phone,
                content: this.search.content,
                endTime: this.search.endTime,
                startTime: this.search.startTime,
                status: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.messageRecordId),
                        phone: item.mobile, // phone
                        content: item.content, // 位置
                        time: item.createTime, // 发布时间
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

         clickAddBanner() {
            this.$router.push({
                path: '/operate_manage/sms/record_add'
            });
        }

         clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/sms/record/edit',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
