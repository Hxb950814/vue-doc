<!--签到记录-->
<template>
    <div>
        <div class="page-cap-title">
            签到记录
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">手机号/姓名:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="手机号/姓名"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">签到时间:</span>
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
                            default-time="23:59:59"
                            style="width:185px"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'04050201'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="mobile" label="签到手机号" />
                <el-table-column prop="name" label="用户姓名" />
                <el-table-column prop="signTime" label="签到时间" />
                <el-table-column prop="reward" label="签到奖励" />
            </el-table>
            <my-pagination
                :page-size="tableData.pageSize"
                :total="tableData.count"
                :current-page.sync="tableData.currentPage"
                @current-change="handleCurrentChange"
            />
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
            channel: '', // 支付通道
            startTime: '', // 交易时间
            endTime: '', // 结束时间
            status: '' // 状态
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};
        statusList: any[] = [];

        async mounted() {
            this.searchDateTimeLimit();
            await this.getDataList();
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
            const [err, resp] = await this.$postAsync('/signRecordCtrl/signRecordList', {
                page: this.tableData.currentPage,
                mobile: this.search.phone,
                minTime: this.search.startTime || '', // 起始时间
                maxTime: this.search.endTime || '' // 结束时间
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.orderId),
                        mobile: item.mobile, // 联系方式
                        name: item.name || '-', // 姓名
                        signTime: item.signTime || '--', // 签到时间
                        reward: (item.reward || 0) + ' K豆'// 签到奖励
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

        clickEdit(id: string) {
            this.$router.push({
                path: '/kcoin_manage/orders/edit',
                query: {
                    id
                }
            });
        }

        /* 下载 */
        clickDownload() {
            this.$showLoading();
            this.$get('/signRecordCtrl/signRecordListExcel', {
                mobile: this.search.phone,
                minTime: this.search.startTime || '', // 起始时间
                maxTime: this.search.endTime || '' // 结束时间
            }, {
                paramType: 'form',
                responseType: 'blob'
            }).then((resp: any) => {
                this.$closeLoading();
                if (resp?.data?.type === 'application/json') { // 如果不是文件类型，则被请求拦截掉了
                    const reader = new FileReader();
                    reader.onload = () => {
                        const content = reader.result;
                        try {
                            const re = JSON.parse(content as string);
                            this.$showToast(re?.message || '下载失败');
                        } catch (e) {
                            this.$showToast('下载失败');
                        }
                    };
                    reader.readAsText(resp.data, 'utf-8');
                } else {
                    const disposition = resp?.headers?.['content-disposition'] || '';
                    downloadFileFromBlob(resp.data, getDownloadFileName(disposition)); // 下载这个文件
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
