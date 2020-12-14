<!--交易账户-->
<template>
    <div>
        <div class="account-section-title">
            交易账户
            <a class="back-btn" @click="clickAddAccount">{{ isInAdd ? '返回' : '添加' }}</a>
        </div>
        <div v-if="isNoBind" class="account-section-content no-bind">
            <tk-loading-cap v-if="!dataLoaded" style="width: 100%" />
            <template v-else>
                <div v-if="toBindStatus === 0">
                    你还没有绑定交易账户
                    <button type="primary" class="bind" @click="clickToBind">
                        去绑定
                    </button>
                </div>
                <div v-if="toBindStatus === 1" class="vs-form">
                    <div>
                        <el-select v-model="companyName" placeholder="请选择期货公司" style="width:100%"
                                   @change="onCompanyChange"
                        >
                            <el-option v-for="(item,idx) in bindCompanyList" :key="idx"
                                       :value="item.companyName"
                            >
                                {{ item.companyName }}
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select v-model="apiType" placeholder="请选择接口方式" style="width:100%">
                            <el-option v-for="(item,idx) in bindApiTypeList"
                                       :key="idx"
                                       :value="item.id"
                                       :label="item.apiTypeName"
                            />
                        </el-select>
                    </div>
                    <div>
                        <el-input v-model="account" type="text" placeholder="请输入资金账号" maxlength="15" />
                    </div>
                    <div>
                        <div class="rule">
                            <label />
                            <div class="checkbox-theme">
                                <input id="checkbox_rand" v-model="isChecked" type="checkbox">
                                <label for="checkbox_rand" />
                            </div>
                            我已经阅读并同意<a class="service-rule" target="_blank" href="/agreement/risk">《下单大师实际盘风险提示书》</a>
                        </div>
                    </div>
                    <div>
                        <button type="danger" style="width: 100%;line-height: 40px" :disabled="!isChecked"
                                @click="clickBind"
                        >
                            确定
                        </button>
                    </div>
                </div>
            </template>
        </div>
        <div v-else class="account-section-content bind">
            <div class="bind-blocks">
                <div v-for="(item,idx) in myAccountList" :key="idx">
                    <p class="title">
                        {{ item.companyName }}- {{ item.apiTypeName }} {{ item.account }}
                    </p>
                    <p class="status">
                        <template v-if="item.status === 0">
                            {{ item.accountStatusString }}
                        </template>
                        <template v-else-if="item.status === 1">
                            <a class="login-btn" @click="clickLogin(item.id)">去登录</a>
                            <a class="unlink" @click="clickUnBind(item.accountId)">解绑</a>
                        </template>
                        <!--                        <template v-else-if="item.status === 2">-->
                        <!--                            <a class="login-btn disabled">已解绑</a>-->
                        <!--                            <a class="unlink" @click="clickDelete(item.accountId)">删除</a>-->
                        <!--                        </template>-->
                        <template v-else-if="item.status === 2">
                            <a class="login-btn disabled">未通过</a>
                            <a class="unlink" @click="clickDelete(item.accountId)">删除</a>
                        </template>
                    </p>
                </div>
            </div>
        </div>
        <div class="account-section-content no-bind">
            <p class="com-tips">
                目前仅支持以下期货公司CTP主席（CTP:首次登录必须修改密码）
            </p>
            <div class="companies">
                <tk-loading-cap v-show="!dataLoaded" style="width: 100%" />
                <div v-for="(item,idx) in companyList" :key="idx" class="block">
                    {{ item.companyName }}
                </div>
            </div>
        </div>
        <tk-transaction-login
            ref="transaction-login"
            :account-list="myAccountList.filter(item => item.status === 1)"
            :select-id="keepSelectLoginId"
            :visible.sync="showTransactionLoginPanel"
            @login-success="onTransactionLoginSuccess"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Ref } from 'vue-property-decorator';
    import TkPagination from '@/components/ui/TkPagination.vue';
    import { postAsync } from '@/utils/request';
    import TkLoadingCap from '@/components/ui/TkLoadingCap.vue';
    import TkTransactionLogin from '@/components/common/TkTransactionLogin.vue';

    @Component({
        components: {
            TkPagination,
            TkLoadingCap,
            TkTransactionLogin
        }
    })
    export default class TransactionAccount extends Vue {
        dataLoaded = false;
        isNoBind = true; // 是否没有绑定
        toBindStatus = 0; //

        companyName = ''; // 公司名
        apiType = ''; // 席位id
        account = ''; // 席位
        isChecked = false; // 是否确定

        companyList: any[] = []; // 期货公司
        bindCompanyList: any[] = []; // 可绑定期货公司列表
        bindApiTypeList: any[] = []; // 接口方式
        myAccountList: any[] = []; // 我的账户

        isInAdd = false;

        tableData = {
            pageSize: 10,
            count: 1,
            currentPage: 1
        };

        keepSelectLoginId = '';
        showTransactionLoginPanel = false;

        @Ref('transaction-login')
        transactionLoginRef: any;

        mounted() {
            this.getData();
            this.getCompany();
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/queryFutureCompanyList');
            if (resp?.code === '000000') {
                const list: any[] = [];
                // 账户数据
                (resp?.data?.listCompany || []).forEach((item: any) => {
                    list.push({
                        id: item.futureCompanyId + '',
                        companyName: `${item.futureCompanyName}-${item.apiTypeName}`
                    });
                });
                this.companyList = list;
                // 我的数据
                const list2: any[] = [];
                (resp?.data?.listAccount || []).forEach((item: any) => {
                    list2.push({
                        id: item.futureCompanyId + '',
                        idx: item.futureCompanyId + '',
                        status: Number(item.status), // 状态
                        account: item.futureAccountNumber, // 账户名
                        accountId: String(item.futureAccountId),
                        accountStatusString: item.accountStatusString,
                        companyName: item.futureCompanyName,
                        apiTypeName: item.apiTypeName
                    });
                });
                if (list2.length > 0) {
                    this.isNoBind = false;
                }
                this.myAccountList = list2;
            } else {
            }
            this.dataLoaded = true;
            this.$closeLoading();
        }

        async getCompany() {
            const [err, resp] = await postAsync('/transIndex/queryFutureCompanyListSelcet');
            if (resp?.code === '000000') {
                const list: any[] = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: item.futureCompanyId + '',
                        companyName: item.futureCompanyName
                    });
                });
                this.bindCompanyList = list;
                this.bindCompanyList = list.concat();
            } else {
            }
            this.dataLoaded = true;
        }

        async getApiType(name: string) {
            const [err, resp] = await postAsync('/transIndex/queryFutureCompanyListplace', {
                FutureCompanyName: name
            });
            if (resp?.code === '000000') {
                const list: any[] = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: item.futureCompanyId + '',
                        apiTypeName: item.apiTypeName
                    });
                });
                this.bindApiTypeList = list;
            } else {
            }
        }

        onCompanyChange(val: string) {
            this.getApiType(val);
        }

        clickLogin(id: string) {
            this.keepSelectLoginId = id;
            this.showTransactionLoginPanel = true;
        }

        clickAddAccount() {
            if (!this.isInAdd) {
                this.clickToBind();
                this.isInAdd = true;
                this.isNoBind = true;
                this.toBindStatus = 1;
            } else {
                this.isInAdd = false;
                this.isNoBind = this.bindApiTypeList.length > 0;
                this.toBindStatus = 0;
            }
        }

        clickUnBind(accountId: string) {
            this.$confirm('是否确定解绑该期货交易账户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.doUnBind(accountId);
            }).catch(() => {
            });
        }

        clickDelete(accountId: string) {
            this.$confirm('是否确定删除该期货交易账户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ((async () => {
                    const [err, resp] = await postAsync('/transIndex/deleteFutureAccount', {
                        futureAccountId: accountId
                    });
                    if (resp?.code === '000000') {
                        this.$showToast('删除成功');
                        this.getData();
                    } else {
                        this.$showToast('删除失败');
                    }
                })());
            }).catch(() => {
            });
        }

        clickToBind() {
            this.toBindStatus = 1;
            this.companyName = '';
            this.account = ''; // 席位
            this.isChecked = false;
        }

        async doUnBind(accountId: string) {
            const [err, resp] = await postAsync('/transIndex/unBindFutureAccount', {
                futureAccountId: accountId
            });
            if (resp?.code === '000000') {
                this.$showToast('解绑成功');
                this.getData();
            } else {
                this.$showToast('解绑失败');
            }
        }

        async clickBind() {
            // this.isNoBind = false;
            const [err, resp] = await postAsync('/transIndex/bindFutureAccount', {
                futureCompanyId: this.apiType,
                account: this.account
            });
            if (resp?.code === '000000') {
                this.$showToast('绑定成功');
                this.getData();
            } else {
                this.$showToast('绑定失败');
            }
        }

        onTransactionLoginSuccess(data: any) {
            this.showTransactionLoginPanel = false;
            console.log('登录成功');
        }
    }
</script>

<style lang="scss" scoped>
    .account-section-title {
        .back-btn {
            margin-left: auto;
            margin-right: 15px;
            line-height: 30px;
            font-size: 14px;
            background-color: #f2f2f2;
            color: $color-main;
            padding: 0 10px;
            cursor: pointer;
            font-weight: normal;
        }
    }

    .account-section-content {
        background-color: #fff;
        padding: 10px 15px;
    }

    .no-bind {
        padding: 20px 15px;
        font-size: 15px;
        color: #333;

        .bind {
            margin-left: 20px;
        }

        border-bottom: 1px solid #eaeaea;
    }

    .bind {
        border-bottom: 1px solid #eaeaea;
    }

    .companies {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;

        .block {
            width: 158px;
            line-height: 44px;
            text-align: center;
            color: $color-main;
            border: 1px solid #ddd;
            @include ellipsis();
            margin-right: 2px;
            margin-bottom: 2px;
        }
    }

    .com-tips {
        color: #333;
        font-size: 15px;
    }

    .vs-form {
        margin-top: 20px;
        width: 340px;

        > div {
            margin-bottom: 15px;
        }
    }

    .checkbox-theme {
        margin-right: 5px;
    }

    .rule {
        font-size: 14px;
        display: flex;
        align-items: center;
    }

    .service-rule {
        color: $color-main;
    }

    .bind-blocks {
        display: flex;
        flex-wrap: wrap;

        > div {
            width: calc(50% - 5px);
            border: 1px solid #eaeaea;
            margin-right: 10px;
            margin-bottom: 10px;

            &:nth-child(2n) {
                margin-right: 0;
            }

            padding: 15px;
        }

        .login-btn {
            color: $color-up;
            cursor: pointer;
            display: inline-block;
            padding: 0 10px;
            font-size: 14px;

            &.disabled {
                color: #666;
            }
        }

        .unlink {
            color: #666;
            float: right;
            font-size: 14px;
            line-height: 1.2;
            padding-top: 2px;
            cursor: pointer;
        }

        .title {
            font-size: 18px;
            color: #333;
        }

        .status {
            text-align: center;
            margin-top: 20px;
            font-size: 15px;
            color: #999;

            .login {
                color: #ff2f2f;
            }
        }
    }
</style>
