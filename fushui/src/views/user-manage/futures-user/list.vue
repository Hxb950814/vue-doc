<!-- 期货用户 -->
<template>
    <div>
        <div class="page-cap-title">
            期货用户
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">期货公司:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.company"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入期货公司名称"
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
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
                    <span class="words">更新时间:</span>
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
                            <el-option value="-1" label="全部" />
                            <el-option value="0" label="待审核" />
                            <el-option value="1" label="已通过" />
                            <el-option value="2" label="已解绑" />
                            <el-option value="3" label="未通过" />
                            <el-option value="4" label="已删除" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'05020101'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
            <div class="search-line" style="margin-top: 20px">
                <div class="search-union">
                    <span class="words">排序:</span>
                    <el-radio-group v-model="search.order">
                        <el-radio-button label="0">
                            更新时间
                        </el-radio-button>
                        <el-radio-button label="1">
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
                <el-table-column prop="futureCompanyName" label="期货公司" />
                <el-table-column prop="futureAccountNumber" label="期货账户" />
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
                <el-table-column prop="appId" label="appId">
                    <template slot-scope="scope">
                        {{ scope.row.appId || '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="authCode" label="授权码">
                    <template slot-scope="scope">
                        {{ scope.row.authCode || '--' }}
                    </template>
                </el-table-column>
                <!--                <el-table-column prop="holdProfitLoss" label="-">-->
                <!--                    <template slot="header">-->
                <!--                        持仓盈亏/元-->
                <!--                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">-->
                <!--                            <i class="el-icon-warning-outline" />-->
                <!--                        </el-tooltip>-->
                <!--                    </template>-->
                <!--                    <template slot-scope="scope">-->
                <!--                        {{ scope.row.holdProfitLoss | money }}-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column prop="accountStatus" label="账号状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.accountStatus === 0" class="list-status">待审核</a>
                        <a v-if="scope.row.accountStatus === 1" class="list-status green">已通过</a>
                        <a v-if="scope.row.accountStatus === 2" class="list-status normal">已解绑</a>
                        <a v-if="scope.row.accountStatus === 3" class="list-status red ">未通过</a>
                        <a v-if="scope.row.accountStatus === 4" class="list-status disabled ">已删除</a>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" @click="clickDetail(scope.row.id)">{{ scope.row.updateTime
                        }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <!--                        <a class="link-btn color normal" @click="clickAuth(scope.row.id)">授权</a>-->
                        <!--                        <a class="link-btn color normal" @click="clickExamine(scope.row.id)">审核</a>-->
                        <template v-if="scope.row.accountStatus === 0 && checkPermission('05020102')">
                            <a class="link-btn color normal" @click="clickAuth(scope.row.id)">授权</a>
                            <a class="link-btn color normal" @click="clickExamine(scope.row.id)">审核</a>
                        </template>
                        <template v-else>
                            --
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="form-under-text">
                可用资金：{{ remainMoney | money }}元
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

        <el-dialog
            title="账户操作明细"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="detailPanelShow"
            width="650px"
        >
            <div class="common-table" style="margin-top: 0">
                <el-table :data="tableDataDetail.data">
                    <el-table-column prop="idx" label="序号" width="60" />
                    <el-table-column prop="desc" label="操作说明" />
                    <el-table-column prop="time" label="操作时间" />
                </el-table>
                <div class="my-pagination-wrap">
                    <my-pagination
                        :page-size="tableDataDetail.pageSize"
                        :total="tableDataDetail.count"
                        :current-page.sync="tableDataDetail.currentPage"
                        @current-change="handleCurrentChange2"
                    />
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="授权输入"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="authPanelShow"
            width="450px"
        >
            <div class="form-input-area">
                <el-form
                    ref="authInputDataForm"
                    class="form-data form-style"
                    label-position="left"
                    :rules="authInputDataRule"
                    :model="authInputData"
                    style="padding-left: 25px"
                >
                    <el-form-item label="APPID:" prop="appid">
                        <el-input
                            v-model.trim="authInputData.appid"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="授权码:" prop="authcode">
                        <el-input
                            v-model.trim="authInputData.authcode"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <div style="text-align: center">
                        <el-button type="primary" class="theme-button" @click="clickPassAuth">
                            确定
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>

        <el-dialog
            title="期货账号审核"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="examPanelShow"
            width="450px"
        >
            <div class="form-input-area">
                <el-form
                    ref="examInputDataForm"
                    disabled="disabled"
                    class="form-data form-style"
                    label-position="left"
                    :rules="examInputDataRule"
                    label-width="80px"
                    :model="examInputData"
                    style="padding-left: 25px"
                >
                    <el-form-item label="期货公司:" prop="companyName">
                        <el-input
                            v-model.trim="examInputData.companyName"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="期货账号:" prop="account">
                        <el-input
                            v-model.trim="examInputData.account"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="用户姓名:" prop="userName">
                        <el-input
                            v-model.trim="examInputData.userName"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="身份证号:" prop="idCard">
                        <el-input
                            v-model.trim="examInputData.idCard"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="联系方式:" prop="phone">
                        <el-input
                            v-model.trim="examInputData.phone"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="APPID:" prop="appid">
                        <el-input
                            v-model.trim="examInputData.appid"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="授权码:" prop="authcode">
                        <el-input
                            v-model.trim="examInputData.authcode"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入"
                            maxlength="20"
                            style="width:300px"
                        />
                    </el-form-item>
                </el-form>
                <div style="text-align: center">
                    <el-button type="default" class="theme-button" @click="clickPassExam(false)">
                        不通过
                    </el-button>
                    <el-button type="primary" class="theme-button" @click="clickPassExam(true)">
                        确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            phone: '', // 联系方式
            company: '', // 公司
            startTime: '', // 時間
            endTime: '', // 時間結束
            status: '-1', // 状态
            order: '0'
        };

        remainMoney = 0;

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};
        detailPanelShow = false;

        /* 明细数据 */
        tableDataDetail = {
            data: [],
            pageSize: 10,
            currentPage: 1,
            count: 0
        };

        keepDetailId = '';

        keepauthInputCompId = '';
        authPanelShow = false;
        examPanelShow = false;

        /* 授权输入信息 */
        authInputData = {
            appid: '',
            authcode: ''
        };

        authInputDataRule: any = {
        }

        /* 审核信息 */
        examInputData = {
            companyName: '',
            account: '',
            userName: '',
            idCard: '',
            phone: '',
            appid: '',
            authcode: ''
        };

        examInputDataRule: any = {}

        @Watch('search.order')
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
            const [err, resp] = await this.$postAsync('/futureAccount/queryFutureAccountListPage', {
                isTrade: 0,
                page: this.tableData.currentPage,
                orderType: this.search.order,
                futureCompanyName: this.search.company,
                mobile: this.search.phone,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || '',
                accountStatus: Number(this.search.status)
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.futureAccountId),
                        name: item.name, // 系统账号
                        mobile: item.mobile, // 联系方式
                        futureCompanyName: item.futureCompanyName, // 期货公司
                        accountStatus: Number(item.accountStatus), // 状态
                        updateTime: item.updateTime,
                        holdProfitLoss: item.holdProfitLoss,
                        appId: item.appId,
                        authCode: item.authCode,
                        ableUseMoney: item.ableUseMoney,
                        futureAccountNumber: item.futureAccountNumber
                    });
                });
                this.remainMoney = resp?.data?.otherData?.totalAbleUseMoney || '';
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

        clickDownload(id: string) {
            this.$showLoading();
            this.$post('/futureAccount/futureAccountListExcel', {
                isTrade: 0,
                orderType: this.search.order,
                futureCompanyName: this.search.company,
                mobile: this.search.phone,
                startTime: this.search.startTime || '',
                endTime: this.search.endTime || '',
                accountStatus: Number(this.search.status)
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

        handleCurrentChange2() {
            this.getOperateDetail();
        }

        async clickDetail(id: string) {
            this.$showLoading();
            this.tableDataDetail.currentPage = 1;
            this.keepDetailId = id;
            await this.getOperateDetail();
            this.$closeLoading();
        }

        async clickExamine(id: string) {
            const find = this.tableData.data.find((item: any) => id === item.id);
            if (find) {
                if (!find.appId || !find.authCode) {
                    this.$showToast('请先授权');
                    return;
                }
            }
            this.examPanelShow = true;
            this.$nextTick(() => {
                (this.$refs.examInputDataForm as ElForm).resetFields();
                this.keepauthInputCompId = id;
                this.examInputData.account = '';
                this.examInputData.companyName = find.futureCompanyName;
                this.examInputData.account = find.futureAccountNumber;
                this.examInputData.phone = find.mobile;
                this.examInputData.appid = find.appId;
                this.examInputData.authcode = find.authCode;
            });
        }

        async clickPassExam(isPass: boolean) {
            if (!this.examInputData.appid) {
                this.$showToast('APPID不能为空，请先授权');
                return;
            }
            if (!this.examInputData.authcode) {
                this.$showToast('授权码不能为空，请先授权');
                return;
            }
            this.$showLoading();
            const [err, data] = await this.$postAsync('/futureAccount/auditFutureAccount', {
                appId: this.examInputData.appid,
                authCode: this.examInputData.authcode,
                futureAccountId: this.keepauthInputCompId,
                status: isPass ? 1 : 3
            });
            this.$closeLoading();
            if (data?.code === '000000') {
                this.examPanelShow = false;
                this.$showToast('审核成功');
                this.getDataList();
            } else {
                this.$showToast('审核失败');
            }
        }

        async clickAuth(id: string) {
            this.keepauthInputCompId = id;
            this.authPanelShow = true;
            this.$nextTick(() => {
                (this.$refs.authInputDataForm as ElForm).resetFields();
                const find = this.tableData.data.find((item: any) => id === item.id);
                if (find) {
                    this.authInputData.appid = find.appId;
                    this.authInputData.authcode = find.authCode;
                }
            });
        }

        async clickPassAuth(isPass: boolean) {
            this.$showLoading();
            const [err, data] = await this.$postAsync('/futureAccount/authFutureAccount', {
                appId: this.authInputData.appid,
                authCode: this.authInputData.authcode,
                futureAccountId: this.keepauthInputCompId
            });
            this.$closeLoading();
            if (data?.code === '000000') {
                this.authPanelShow = false;
                this.$showToast('授权成功');
                this.authInputData.appid = '';
                this.authInputData.authcode = '';
                this.getDataList();
            } else {
                this.$showToast('授权失败');
            }
        }

        async getOperateDetail() {
            const [err, resp] = await this.$postAsync('futureAccount/queryFutureAccountInfoListPage', {
                futureAccountId: this.keepDetailId,
                page: this.tableDataDetail.currentPage
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.detailPanelShow = true;
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        desc: item.accountStatusString,
                        time: item.time
                    });
                });
                this.tableDataDetail.data = list;
                this.tableDataDetail.count = resp.data.totalCount;
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
