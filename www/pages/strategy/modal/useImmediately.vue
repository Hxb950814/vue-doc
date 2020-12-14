<template>
    <div class="111">
        <el-dialog
            v-if="useVisible"
            title="策略订单确认"
            :visible.sync="useVisible"
            width="600px"
            append-to-body
            :before-close="handleClose"
        >
            <el-form ref="ruleForm" :model="submitForm" :rules="rules" label-width="120px">
                <el-form-item label="操作合约：" prop="strategyContractConfigId">
                    <div>
                        <el-select v-model="submitForm.strategyContractConfigId" style="width: 250px" placeholder="请选择合约" @change="getContract">
                            <el-option v-for="(item, index) in contractList" :key="index" :label="item.contractName" :value="item.strategyContractConfigId" />
                        </el-select>
                        <span class="tip">单次支持一种合约</span>
                    </div>
                    <p style="margin-top:10px">
                        最新：<span class="hb-newPrice" :class="{
                            up: newPrice>0,
                            down: newPrice<0
                        }"
                        >{{ newPrice }}</span>
                    </p>
                </el-form-item>
                <el-form-item label="操作资金：" prop="operateFund">
                    <div>
                        <el-input v-model="submitForm.operateFund" style="width: 250px" :placeholder="'最多可输入' + maxOperateFund + '万'" @input="inputCheck($event, 1)">
                            >
                            <i slot="suffix">
                                元
                            </i>
                        </el-input>
                        <span class="tip">资金上限{{ maxOperateFund }}万</span>
                    </div>
                    <div style="margin-top:10px">
                        <p>
                            <span>可操作资金:&nbsp;<b class="tip">{{ ableOperateFund }}</b></span>
                            <span style="margin-left: 20px">可用资金:&nbsp;&nbsp;<span>{{ ableUseMoney }}</span></span>
                        </p>
                        <p v-if="isLogined" style="margin-top:5px;color:#bbb">
                            {{ futureCompanyName }}  （{{ futureAccountNumber }}）
                        </p>
                        <p v-else style="margin-top:5px;color:#bbb">
                            <span style="color: #ff2f2f">未登录期货账户</span>
                            <el-button style="padding:5px 15px;margin-left:10px" type="primary" @click="showLoginPanel">
                                登录
                            </el-button>
                        </p>
                    </div>
                </el-form-item>
                <el-form-item label="最大止盈：" prop="strategyProfitId">
                    <div>
                        <el-select v-model="submitForm.strategyProfitId" style="width: 250px" placeholder="最大止盈" @change="calculation">
                            <el-option v-for="(item, index) in strategyProfitList" :key="index" :label="item.profitRate + '%'" :value="item.strategyProfitId" />
                        </el-select>
                        <span class="tip">可选择止盈参数</span>
                    </div>
                </el-form-item>
                <el-form-item label="最大止损：" prop="strategyLossId">
                    <div>
                        <el-select v-model="submitForm.strategyLossId" style="width: 250px" placeholder="最大止损">
                            <el-option v-for="(item, index) in strategyLossList" :key="index" :label="item.profitRate + '%'" :value="item.strategyProfitId" />
                        </el-select>
                        <span class="tip">可选择止损参数</span>
                    </div>
                </el-form-item>
                <el-form-item :label="frozenText">
                    <div>
                        <template v-if="serviceType === 0">
                            <el-input v-model="submitForm.frozenBean" disabled style="width: 250px" placeholder="冻结K豆" />
                        </template>
                        <template v-else>
                            <el-input v-model="submitForm.frozenBean" disabled style="width: 250px" placeholder="预计K豆" />
                        </template>
                        <span class="tip">支付后续产生的费用</span>
                    </div>
                    <p style="margin-top:10px">
                        可用k豆：{{ ableBean }}
                    </p>
                </el-form-item>
                <el-form-item label="K豆密码：" prop="tradePassword">
                    <div>
                        <el-input v-model="submitForm.tradePassword" type="password" style="width: 250px" placeholder="K豆密码" />
                        <span class="tip" @click="goSetPassword">忘记密码？</span>
                    </div>
                </el-form-item>
                <div class="btn">
                    <el-button type="primary" @click="onSubmit('ruleForm')">
                        确认使用
                    </el-button>
                </div>
            </el-form>
            <tk-transaction-login
                v-if="showTransactionLoginPanel"
                ref="transactionLogin"
                :account-list="myAccountList.filter(item => item.status === 1)"
                :select-id="keepSelectLoginId"
                :visible.sync="showTransactionLoginPanel"
                @login-success="onTransactionLoginSuccess"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Cookie from 'js-cookie';
    import { ContractDataSocket } from '@common/src/future';
    import { bcadd, bcsub, bcmul, bcdiv } from '@common/src/utils/number';
    import { postAsync } from '~/utils/request';
    import { integer, spliceStr } from '~/utils';
    import TkTransactionLogin from '@/components/common/TkTransactionLogin.vue';

    let scoketPrice: any = null;
    let keepCoedsData: string = ''; // 保存的code

    @Component({
        components: {
            TkTransactionLogin
        }
    })
    export default class extends Vue {
        isLogined = false; // 是否登陆期货用户账号
        dataLoaded = false; // 数据是否加载完成
        futureAccountId = ''; // 是否登陆期货用户账号id
        futureCompanyName = ''; // 是否登陆期货用户账号名称
        futureAccountNumber = ''; // 是否登陆期货用户账号号码
        showTransactionLoginPanel = false; // 登录期货账户的弹层 是否启动
        keepSelectLoginId = ''; // 保存选择的期货账户id
        myAccountList: any[] = []; // 我的账户

        useVisible:boolean = false; // 策略订单确认弹层  是否启动
        strategyId:string = ''; // 当前页面的策略id
        isCheck:number = 0; // 是否已经勾选了服务协议
        maxOperateFund:number = 0; // 资金上限（万）
        submitForm:any = {
            strategyContractConfigId: '', // 选择的合约id
            strategyProfitId: '', // 选择的最大止盈
            strategyLossId: '', // 选择的最大止损
            operateFund: '', // 操作资金
            frozenBean: '', // 冻结k豆
            tradePassword: '' // k豆密码
        };

        ableOperateFund:number = 0; // 可操作资金
        ableUseMoney:number = 0; // 可使用资金
        contractList:any[] = []; // 合约数据源
        strategyLossList:any[] = []; // 最大止损数据源
        strategyProfitList:any[] = []; // 最大止盈数据源
        ableBean:number = 0; // 可用K豆
        newPrice:number = 0; // 最新价

        timer:any = null; // 防抖

        rules:any = {
            strategyContractConfigId: [
                { required: true, message: '请选择操作合约', trigger: 'change' }
            ],
            strategyProfitId: [
                { required: true, message: '请选择最大止盈', trigger: 'change' }
            ],
            operateFund: [
                { required: true, message: '请输入操作资金', trigger: 'blur' }
            ],
            strategyLossId: [
                { required: true, message: '请选择最大止损', trigger: 'change' }
            ],
            tradePassword: [
                { required: true, message: '请输入交易密码', trigger: 'blur' }
            ]
        }; // 校验规则

        serviceType:number = 0; // 当前策略的服务模式 0：服务费率 1：订阅模式
        frozenText:string = '冻结K豆'; // 当前策略的服务模式 0：服务费率 1：订阅模式

        active(res:any) {
            this.useVisible = true;
            this.strategyId = res.strategyId;
            this.isCheck = res.isCheck;
            this.maxOperateFund = res.maxOperateFund;
            this.serviceType = (this.$parent as any).pageData.serviceType;
            this.frozenText = this.serviceType ? '预计K豆：' : '冻结K豆：';
            this.submitForm.frozenBean = this.serviceType ? bcmul((this.$parent as any).pageData.serviceBean, 10000) : 0;
            this.getModalData();
            this.getPriceSocket();
            this.getFutureCompany().then(() => {
                if (String(Cookie.get('futureToken')) && String(Cookie.get('futureToken')) !== 'undefined') {
                    this.isLogined = true;
                    this.getAccount();
                } else {
                    this.isLogined = false;
                }
            });
        }

       async getAccount() {
            // 取到当前登录的期货账户
           const [err, resp] = await postAsync('/strategy/queryFutureAccountId');
           if (resp?.code === '000000') {
               const id = resp?.data;
               const find = this.myAccountList.find((item: any) => String(item.accountId) === String(id));
               if (find) {
                   this.keepSelectLoginId = find.id;
                   this.futureCompanyName = find.companyName;
                   this.futureAccountNumber = spliceStr(find.account, 2);
                   this.getMoney();
               }
           } else {
               this.$showToast(resp!.message);
           }
       }

        getContract(ev:any) {
            console.log(ev);
            // 通过socket去获取列表的最新价格
            const apiCode = this.contractList.filter((x:any) => x.strategyContractConfigId === ev)[0].apiCode;
            scoketPrice.sendCancelContractTickMessage(keepCoedsData); // 先取消上一个
            scoketPrice.sendContractTickMessage(apiCode);
            keepCoedsData = apiCode;
        }

        async getPriceSocket() {
            /* 开启socket */
            const _this = this;
            scoketPrice = ContractDataSocket.getIdleDataSocket(this);
            scoketPrice.addListener((errCode: number, incomeData: any) => {
                if (JSON.stringify(incomeData) !== '{}') {
                    _this.newPrice = incomeData.price;
                }
            });
            await scoketPrice.connect();
        }

        async getMoney() {
            const [err, resp] = await postAsync('/strategy/queryMoneyByFutureAccountId');
            if (resp?.code === '000000') {
                this.ableOperateFund = resp?.data.ableOperateFund;
                this.ableUseMoney = resp?.data.ableUseMoney;
            } else {
                this.$showToast(resp!.message);
            }
        }

        async getModalData() {
            const requestData = {
                isCheck: this.isCheck,
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/queryStrategyContractList', requestData);
            if (resp?.code === '000000') {
                const { contractList, strategyLossList, strategyProfitList, ableBean } = resp?.data;
                this.contractList = contractList;
                this.strategyLossList = strategyLossList;
                this.strategyProfitList = strategyProfitList;
                this.ableBean = ableBean;
            } else {
                this.$showToast(resp!.message);
            }
        }

        inputCheck(v:any, mode:number) {
            // 如果输入框是百分比的话要进行限制不可超过100 否则不做限制
            // mode:1 只能输入整数 2：保留小数点后面2位 3：保留小数点后面1位
            // integer 判断/* 只能输入正整数 or 保留小数点后2位 or 保留小数点后1位 */
            v = integer(v, mode);
            if (v > this.maxOperateFund * 10000) {
                this.submitForm.operateFund = this.maxOperateFund * 10000;
                this.$message({
                    type: 'warning',
                    message: '操作资金不能超过资金上限' + this.maxOperateFund + '万'
                });
            } else {
                this.submitForm.operateFund = v;
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
               this.calculation();
            }, 500);
        }

        goSetPassword() {
            // 忘记k豆密码
            this.$router.push({
                path: '/account/setting'
            });
        }

        async calculation() {
            // 计算K豆
            if (!this.submitForm.operateFund) {
                this.$message({
                    type: 'info',
                    message: '操作资金不能小于0'
                });
                return;
            }
            const requestData = {
                strategyProfitId: this.submitForm.strategyProfitId,
                operateFund: this.submitForm.operateFund,
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/calculateFrozenBean', requestData);
            if (resp?.code === '000000') {
                this.submitForm.frozenBean = resp?.data || 0;
            } else {
                this.$showToast(resp!.message);
            }
        }

        async getFutureCompany() {
            // 取得我的账户数据源
            const [err, resp] = await postAsync('/transIndex/queryFutureCompanyList');
            if (resp?.code === '000000') {
                const list: any[] = [];
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
                this.myAccountList = list2;
            } else {
            }
            this.dataLoaded = true;
        }

        async showLoginPanel() {
            // 启动弹层
            const [err, resp] = await postAsync('/strategy/loginFutureAccount');
            if (resp?.code === '000000') {
                const find = this.myAccountList.find((item: any) => item.status === 1);
                if (find) {
                    this.keepSelectLoginId = find.id;
                    this.showTransactionLoginPanel = true;
                }
            } else {
                this.$showToast(String(resp?.message));
            };
        }

        onTransactionLoginSuccess() {
            this.showTransactionLoginPanel = false;
            this.isLogined = true;
            this.getAccount();
        }

        async onSubmit(formName:any) {
            (this.$refs[formName] as any).validate((valid:any) => {
                if (valid) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.doSubmit();
                    }, 800);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        doSubmit() {
            this.doSure();
        }

        async doSure() {
            this.$showLoading();
            const requestData = {
                frozenBean: this.submitForm.frozenBean,
                operateFund: this.submitForm.operateFund,
                strategyContractConfigId: this.submitForm.strategyContractConfigId,
                strategyId: this.strategyId,
                strategyLossId: this.submitForm.strategyLossId,
                strategyProfitId: this.submitForm.strategyProfitId,
                tradePassword: this.submitForm.tradePassword
            };
            const [err, resp] = await postAsync('/strategy/addStrategyOrder', requestData);
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: resp?.message || '操作成功'
                });
                this.useVisible = false;
                setTimeout(() => {
                    this.$router.push({
                        path: '/strategy/strategyDetail',
                        query: {
                            id: resp?.data
                        }
                    });
                }, 500);
            } else {
                this.$showToast(String(resp?.message));
            };
            this.$closeLoading();
        }

        handleClose() {
            this.useVisible = false;
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-malde{
        z-index: 2200 !important;
    }
    .tip{
        margin-left:10px;
        color: #0ca2ff;
        cursor: pointer;
    }
    .btn{
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .hb-newPrice{
        margin-top: 10px;
        &.up{
            color: #FF5D5A;
        }
        &.down{
            color: #00e700;
        }
    }
</style>
