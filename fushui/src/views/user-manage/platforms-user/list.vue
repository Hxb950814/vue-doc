<!-- 平台用户 -->
<template>
    <div>
        <div class="page-cap-title">
            平台用户
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
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">注册时间:</span>
                    <div class="input-text">
                        <el-date-picker
                            v-model="search.startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="开始时间"
                            clearable
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
                            clearable
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
                            <el-option value="-1" label="全部" />
                            <el-option value="0" label="正常" />
                            <el-option value="1" label="锁定" />
                            <el-option value="2" label="已注销" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'05010101'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
            <div class="search-line" style="margin-top: 20px">
                <div class="search-union">
                    <span class="words">排序:</span>
                    <el-radio-group v-model="search.orderType">
                        <el-radio-button label="0">
                            注册时间
                        </el-radio-button>
                        <el-radio-button label="1">
                            可用K豆
                        </el-radio-button>
                        <el-radio-button label="2">
                            可用资金
                        </el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="mobile" label="联系方式" />
                <el-table-column prop="nikeName" label="用户昵称" />
                <el-table-column prop="createTime" label="注册时间" />
                <el-table-column prop="ableUseBean" label="可用K豆" />
                <el-table-column prop="freezeBean" label="冻结K豆" />
                <el-table-column prop="futureAccountNum" label="期货账户数量" />
                <el-table-column prop="ableUseMoney" label="-">
                    <template slot="header">
                        可用资金/元
                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">
                            <i class="el-icon-warning-outline" />
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.ableUseMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="holdProfitLoss" label="-">
                    <template slot="header">
                        持仓盈亏/元
                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">
                            <i class="el-icon-warning-outline" />
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.holdProfitLoss | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 0" class="list-status normal">正常</a>
                        <a v-else-if="scope.row.status === 1" class="list-status red">锁定</a>
                        <a v-else-if="scope.row.status === 2" class="list-status disabled">已注销</a>
                        <a v-else class="list-status">--</a>
                    </template>
                </el-table-column>
                <el-table-column prop="recommendMobile" label="推荐人手机号" />
            </el-table>
            <div class="form-under-text">
                可用K豆：{{ kCoin }}<span style="margin-left: 20px">可用资金</span>：{{ money | money }}元
            </div>
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
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            phone: '', // 联系方式
            status: '-1', // 状态
            startTime: '', // 時間
            endTime: '', // 時間結束
            orderType: '0'
        };

        kCoin = 0;
        money = 0;

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        @Watch('search.orderType')
        onOrderTypeChange(val: string) {
            this.searchData();
        }

        mounted() {
            this.searchDateTimeLimit();
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

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/queryUserListPage', {
                page: this.tableData.currentPage,
                orderType: this.search.orderType, // 排序类型 0=时间倒序（默认），1=可用k豆倒序， 2=可用资金倒序
                mobile: this.search.phone,
                status: this.search.status,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || ''
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.userId),
                        mobile: item.mobile, // 联系方式
                        nikeName: item.nikeName, // 昵称
                        createTime: item.createTime, // 注册时间
                        ableUseBean: item.ableUseBean || 0, // 可用k豆
                        freezeBean: item.freezeBean || 0, // 冻结k豆
                        futureAccountNum: item.futureAccountNum || 0, // 期货账户数量
                        ableUseMoney: item.ableUseMoney || 0, // 可用资金
                        holdProfitLoss: item.holdProfitLoss || 0, // 持仓盈亏
                        status: Number(item.status), // 当前状态
                        recommendMobile: item.recommendMobile || '--' // 推荐人手机号
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;

                // @ts-ignore
                this.kCoin = resp?.data?.otherData?.ableUseBeanTotal;
                // @ts-ignore
                this.money = resp?.data?.otherData?.ableUseMoneyTotal;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickDownload(id: string) {
            this.$showLoading();
            this.$post('/user/userListExcel', {
                orderType: this.search.orderType, // 排序类型 0=时间倒序（默认），1=可用k豆倒序， 2=可用资金倒序
                mobile: this.search.phone,
                status: this.search.status,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || ''
            }, {
                paramType: 'form',
                responseType: 'blob'
            }).then((resp: any) => {
                this.$closeLoading();
                if (resp?.data?.type === 'application/json') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const content = reader.result;// 内容就在这里
                        try {
                            const re = JSON.parse(content as string);
                            this.$showToast(re?.message || '下载失败');
                        } catch (e) {
                            this.$showToast('下载失败');
                        }
                    };
                    reader.readAsText(resp.data, 'utf-8');
                } else {
                    downloadFileFromBlob(resp.data, getDownloadFileName(resp?.headers?.['content-disposition'] || '')); // 下载这个文件
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
