<template>
    <div v-show="visible" class="transaction-wrap">
        <div class="transaction-login-mask" style="z-index: 200"/>
        <div class="transaction-login-panel"  style="z-index: 201">
            <div class="title-line">
                交易账户登录
                <div class="close el-icon-close" @click="clickClose" />
            </div>
            <div class="content-wrap">
                <div class="line">
                    <el-select v-model="id" style="width: 100%" popper-class="transaction-login-select-pop"
                               @change="onSelectChange"
                    >
                        <el-option v-for="item in accountList"
                                   :key="item.idx"
                                   :label="`${item.companyName}-${item.apiTypeName} ${item.account}`"
                                   :value="item.id"
                        />
                    </el-select>
                </div>
                <div class="line">
                    <el-input v-model="companyName" disabled />
                </div>
                <div class="line">
                    <el-input v-model="apiName" disabled />
                </div>
                <div class="line">
                    <el-input v-model="account" disabled />
                </div>
                <div class="line">
                    <el-input v-model="password"
                              type="password"
                              placeholder="请输入交易密码"
                    />
                </div>
                <div class="line">
                    <div class="rule">
                        <label />
                        <div class="checkbox-theme">
                            <input id="checkbox_rand_login" v-model="isChecked" type="checkbox">
                            <label for="checkbox_rand_login" />
                        </div>
                        我已经阅读并同意<a class="service-rule" target="_blank" href="/agreement/risk">《下单大师实际盘风险提示书》</a>
                    </div>
                </div>
                <div class="line">
                    <el-button type="danger" class="button" :disabled="!isChecked" @click="clickLogin">
                        确定
                    </el-button>
                </div>
            </div>
        </div>
        <!--确认账单-->
        <el-dialog
            title="结算账单确认"
            :visible.sync="confirmSettlementinfoVisible"
            width="60%"
            append-to-body
        >
            <span v-html="confirmSettlementinfoText"></span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmSettlementinfoClick">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
    import { set as setCookie } from 'js-cookie';
    import { postAsync } from '@/utils/request';

    @Component({
        components: {
        }
    })
    export default class TkTransactionLogin extends Vue {
        @Prop({ type: Boolean })
        visible!:boolean;

        /* 公司名 */
        @Prop({ type: Array, default: () => [] })
        accountList!: any[];

        /* 选择哪个 */
        @Prop({ type: String, default: 0 })
        selectId!: string;

        @Watch('selectId')
        onSelectValueChange() {
            this.onDataChanged();
        }

        @Watch('visible')
        onVisibleChange(val: boolean) {
            // if (val) {
                this.password = '';
                this.isChecked = false;
            // }
        }

        id = '';
        companyName = '';
        apiName = '';
        account = '';
        password = '';
        isChecked = false;
        confirmSettlementinfoVisible = false;
        confirmSettlementinfoText = '';
        futureTokenText = '';

        mounted() {
            // console.log(111, this.accountList);
        }

        active(res:any) {
            // 重新激活组件
            this.id = res.id;
            const find = this.accountList.find((item: any) => item.id === this.id);
            if (find) {
                this.id = find.id;
                this.companyName = find.companyName;
                this.apiName = find.apiTypeName;
                this.account = find.account;
            }
        }

        onDataChanged() {
            if (!this.accountList || this.accountList.length === 0) {
                return;
            }
            const find = this.accountList.find((item: any) => item.id === this.selectId);
            if (find) {
                this.id = find.id;
                this.companyName = find.companyName;
                this.apiName = find.apiTypeName;
                this.account = find.account;
            }
        }

        onSelectChange(id: string) {
            const find = this.accountList.find((item: any) => item.id === id);
            if (find) {
                this.companyName = find.companyName;
                this.apiName = find.apiTypeName;
                this.account = find.account;
            }
            this.password = '';
        }

        clickClose() {
            this.$emit('update:visible', false);
        }

        async clickLogin() {
            if (!this.password) {
                this.$showToast('请输入密码');
                return;
            }
            const find = this.accountList.find((item: any) => item.id === this.id);
            if (!find) {
                return;
            }
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/loginFutureAccount', {
                futureAccountId: find.accountId,
                password: this.password
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('登录成功');
                // // 把token注入到cookie里面
                setCookie('futureToken', resp.data);
                this.futureTokenText = resp.data;
                this.querySettlementinfo(this.futureTokenText);
            } else {
                this.$showToast('登录失败');
            }
        }

        async querySettlementinfo(futureToken:any) {
            //  结算账单查询
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/querySettlementinfo', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                if (resp?.data) {
                    this.confirmSettlementinfoVisible = true;
                    this.confirmSettlementinfoText = resp?.data?.data;
                    this.confirmSettlementinfoText = this.confirmSettlementinfoText.replace(/\\n/g, '<br/>');
                    this.confirmSettlementinfoText = this.confirmSettlementinfoText.replace(/\\r/g, '');
                } else {
                    setCookie('futureToken', futureToken, {
                        expires: 30,
                        path: '/'
                    });
                    this.$emit('login-success');
                }
            } else {
                setCookie('futureToken', futureToken, {
                    expires: 30,
                    path: '/'
                });
                this.$emit('login-success');
            }
        }

        async confirmSettlementinfoClick () {
            // 结算账单确认
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/confirmSettlementinfo', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                setCookie('futureToken', this.futureTokenText, {
                    expires: 30,
                    path: '/'
                });
                this.$emit('login-success');
            } else {
                this.$showToast('确认失败');
            }
        }
    }
</script>

<style lang="scss">
    .el-input.is-disabled .el-input__inner{
        color: #333 !important;
    }
</style>
