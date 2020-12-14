<template>
    <div>
        <tk-header class="normal" active-kind="" />
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div class="account-container account-containerHBB">
                        <div class="hbb-strategy-top">
                            <div class="left">
                                <div class="l-top">
                                    <h2>{{ pageData.strategyName }}</h2><p>使用人数：{{ pageData.userTime }}</p>
                                </div>
                                <div class="l-title">
                                    <span v-if="pageData.strategyLabel1">{{ pageData.strategyLabel1 }}</span>
                                    <span v-if="pageData.strategyLabel2">{{ pageData.strategyLabel2 }}</span>
                                    <span v-if="pageData.strategyLabel3">{{ pageData.strategyLabel3 }}</span>
                                </div>
                                <div class="l-meddle">
                                    <div>
                                        <h2 :class="{
                                            up: curSlideObj.historyProfit > 0,
                                            down: curSlideObj.historyProfit < 0
                                        }"
                                        >
                                            {{ curSlideObj.historyProfit }}<small>%</small>
                                        </h2>
                                        <p>累计盈利</p>
                                    </div>
                                    <div>
                                        <h2 class="down">
                                            {{ curSlideObj.maxWithdrawal }}<small>%</small>
                                        </h2>
                                        <p>最大回撤</p>
                                    </div>
                                    <div>
                                        <h2>{{ curSlideObj.fundTopLimit }}<small>万元</small></h2>
                                        <p>资金上限</p>
                                    </div>
                                    <div v-if="pageData.serviceType === '0'">
                                        <h2>{{ pageData.serviceRate }}<small>%</small></h2>
                                        <p>服务费率</p>
                                    </div>
                                    <div v-else>
                                        <h2>{{ pageData.serviceBean }}<small>万K豆</small></h2>
                                        <p>服务费</p>
                                    </div>
                                </div>
                                <div class="l-bottom">
                                    <template v-for="(item,index) in navList">
                                        <p v-if="index<4" :key="index">
                                            {{ item.title }}：<span :class="{
                                                up: item.value > 0,
                                                down: item.value < 0
                                            }"
                                            >{{ item.value }}%</span>
                                        </p>
                                    </template>
                                </div>
                            </div>
                            <div class="right">
                                <h2>
                                    资金上限：{{ curSlideObj.fundTopLimit }}万元
                                </h2>
                                <div class="r-ji">
                                    <el-select v-model="strategyProfitId" popper-class="hbb-strategySelect" style="width:150px;margin-right:5px" placeholder="请选择">
                                        <el-option
                                            v-for="item in takeProfit"
                                            :key="item.strategyProfitId"
                                            :label="item.profitRate + '%'"
                                            :value="item.strategyProfitId"
                                        />
                                    </el-select>
                                    <el-input v-model="operateFund"
                                              type="number"
                                              placeholder="输入操作资金计算K豆" @input="inputCheck($event, 1)"
                                    >
                                        <i slot="suffix">
                                            元
                                        </i>
                                    </el-input>
                                </div>
                                <p>
                                    <el-button style="padding:5px 20px;margin-right:10px" type="primary" @click="calculation">
                                        计算
                                    </el-button>预计K豆：{{ BeanVal }}
                                </p>
                                <el-button type="danger" style="width: 100%" @click="useClick">
                                    立即使用
                                </el-button>
                                <div class="r-last">
                                    <el-checkbox v-model="useChecked">
                                        我已阅读并同意<span @click.stop="readProtocol">《策略使用协议》</span>
                                    </el-checkbox>
                                </div>
                            </div>
                        </div>
                        <div class="hbb-strategy-title">
                            <span />
                            <p>策略支持<b>{{ pageData.contractNum }}</b>种合约</p>
                            <span />
                        </div>
                        <div class="hbb-strategy-main">
                            <div class="top">
                                <div class="a">
                                    模拟收益
                                </div>
                                <!--                                <div>-->
                                <!--                                    <el-select v-model="value1" placeholder="请选择">-->
                                <!--                                        <el-option-->
                                <!--                                            v-for="item in options"-->
                                <!--                                            :key="item.value"-->
                                <!--                                            :label="item.label"-->
                                <!--                                            :value="item.value"-->
                                <!--                                        />-->
                                <!--                                    </el-select>-->
                                <!--                                </div>-->
                                <!--                                <div>-->
                                <!--                                    <el-select v-model="value2" placeholder="品种">-->
                                <!--                                        <el-option-->
                                <!--                                            v-for="item in options"-->
                                <!--                                            :key="item.value"-->
                                <!--                                            :label="item.label"-->
                                <!--                                            :value="item.value"-->
                                <!--                                        />-->
                                <!--                                    </el-select>-->
                                <!--                                </div>-->
                                <!--                                <div>-->
                                <!--                                    <el-select v-model="value2" placeholder="合约">-->
                                <!--                                        <el-option-->
                                <!--                                            v-for="item in options"-->
                                <!--                                            :key="item.value"-->
                                <!--                                            :label="item.label"-->
                                <!--                                            :value="item.value"-->
                                <!--                                        />-->
                                <!--                                    </el-select>-->
                                <!--                                </div>-->
                                <!--                                <el-button type="primary">-->
                                <!--                                    查看-->
                                <!--                                </el-button>-->
                            </div>
                            <div class="chart">
                                <statisticsView mode="1" ref="statisticsView" />
                            </div>
                        </div>
                        <div class="hbb-strategy-main hbb-strategy-position">
                            <div class="top">
                                <div class="a">
                                    策略持仓
                                </div>
                            </div>
                            <el-table
                                :data="positionData"
                                height="250"
                                border
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="date"
                                    label="序号"
                                />
                                <el-table-column
                                    prop="name"
                                    label="操作用户"
                                />
                                <el-table-column
                                    prop="address"
                                    label="合约名称"
                                />
                                <el-table-column
                                    prop="name"
                                    label="操作类型"
                                />
                                <el-table-column
                                    prop="name"
                                    label="持仓手数"
                                />
                                <el-table-column
                                    prop="name"
                                    label="持仓均价"
                                />
                                <el-table-column
                                    prop="name"
                                    label="最新价格"
                                />
                                <el-table-column
                                    prop="name"
                                    label="持仓盈亏"
                                />
                            </el-table>
                        </div>
                        <div v-if="pageData.strategyIntroducePc" class="hbb-strategy-main hbb-strategy-position hbb-strategy-pcMobile">
                            <div class="top">
                                <div class="a">
                                    策略介绍
                                </div>
                            </div>
                            <div class="inputBox radioBox">
                                <img width="100%" :src="pageData.strategyIntroducePc" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <!--立即使用弹层-->
                <UseView ref="useView" />
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Cookie from 'js-cookie';
    import { bcadd, bcsub, bcmul, bcdiv } from '@common/src/utils/number';
    import statisticsView from './compontent/statistics.vue';
    import UseView from './modal/useImmediately.vue';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import { integer } from '@/utils';
    import { postAsync } from '~/utils/request';
    @Component({
        components: {
            TkHeader,
            TkFooter,
            statisticsView,
            UseView
        }
    })
    export default class extends Vue {
        useChecked:boolean = false;

        navList:any[] = [
            { timeType: 0, title: '近7天' },
            { timeType: 1, title: '近1月' },
            { timeType: 3, title: '近3月' },
            { timeType: 6, title: '近半年' },
            { timeType: 12, title: '近1年' },
            { timeType: 24, title: '近2年' },
            { timeType: 36, title: '近3年' },
            { timeType: 48, title: '近4年' }
        ];

        options:any[] = []; // 暂时不做
        value1:string = ''; // 暂时不做
        value2:string = ''; // 暂时不做

        strategyProfitChartConfigList:any[] = []; // 时间区域数据
        BeanVal:number = 0; // 计算出来的k豆
        takeProfit:any[] = []; // 最大止盈数据
        strategyProfitId:string = ''; // 选择的最大止盈的值
        operateFund:number = 0; // 操作资金
        pageData:any = {
            serviceType: '', // 服务模式
            serviceBean: '', // 订阅K豆
            serviceRate: '', // 服务费率
            fundTopLimit: '', // 资金上限
            contractNum: '', // 合约数量
            dealLog: '', // 交易记录
            strategyCapital: '', // 策略本金
            strategyId: '', // 策略id
            strategyIdString: '', // 策略id
            strategyIntroduceMobile: '', // 策略介绍图
            strategyIntroducePc: '', // 策略介绍图
            strategyLabel1: '', // 策略标签1
            strategyLabel2: '', // 策略标签2
            strategyLabel3: '', // 策略标签3
            strategyName: '', // 策略名称
            userTime: '' // 使用次数
        }; // 页面主体信息

        positionData:any[] = []; // 持仓盈亏数据源

        strategyId:string = '0'; // 当前页面的测略id

        curSlideObj:any = {
            historyProfit: '', // 累计盈亏
            fundTopLimit: '', // 资金上限
            maxWithdrawal: '' // 最大回撤
        }

        mounted() {
            this.strategyId = String(this.$route.query.id);
            this.getDetail();
            this.getRightData();
        }

        async getDetail() {
            const requestData = {
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/queryStrategyInfoForClient', requestData);
            if (resp?.code === '000000') {
                const {
fundTopLimit, contractNum, dealLog, strategyId, strategyIdString, strategyIntroduceMobile,
                    strategyIntroducePc, strategyLabel1, strategyLabel2, strategyLabel3, strategyName, userTime,
                    strategyProfitChartConfigList, strategyProfitList, strategyCapital, serviceBean, serviceRate, serviceType
} = resp?.data;
                    this.pageData.fundTopLimit = fundTopLimit;
                    this.pageData.contractNum = contractNum;
                    this.pageData.dealLog = dealLog;
                    this.pageData.strategyId = String(strategyId);
                    this.pageData.strategyIdString = strategyIdString;
                    this.pageData.strategyIntroduceMobile = strategyIntroduceMobile;
                    this.pageData.strategyIntroducePc = strategyIntroducePc;
                    this.pageData.strategyLabel1 = strategyLabel1;
                    this.pageData.strategyLabel2 = strategyLabel2;
                    this.pageData.strategyLabel3 = strategyLabel3;
                    this.pageData.strategyName = strategyName;
                    this.pageData.strategyCapital = strategyCapital;
                    this.pageData.userTime = userTime;
                    this.pageData.serviceBean = serviceBean;
                    this.pageData.serviceRate = serviceRate;
                    this.pageData.serviceType = String(serviceType);
                    this.strategyProfitChartConfigList = strategyProfitChartConfigList || [];
                    this.takeProfit = strategyProfitList.filter((x:any) => x.profitType === 0);
                    this.BeanVal = serviceType ? bcmul(serviceBean, 10000) : 0;
                    (this.$refs.statisticsView as any).active(this.strategyProfitChartConfigList);
            } else {
                this.$showToast(resp!.message);
            }
        }

        async getRightData() {
            // 取得右边的数据统计
            const requestData = {
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/queryStrategyByStrategyId', requestData);
            if (resp?.code === '000000') {
                const {
                    historyProfit, strategyProfitChartConfigList, fundTopLimit,
                    maxWithdrawal
                } = resp?.data;
                this.curSlideObj.fundTopLimit = fundTopLimit || 0; // 资金上限
                this.curSlideObj.maxWithdrawal = maxWithdrawal || 0; // 最大回撤
                this.curSlideObj.historyProfit = historyProfit || 0; // 7天
                const arr:any[] = [];
                strategyProfitChartConfigList.forEach((x:any) => {
                    this.navList.filter((y:any) => {
                        return y.timeType === x.timeType;
                    }).map((z:any) => {
                        z.value = x.profit;
                        arr.push(z);
                    });
                });
                this.navList = arr;
            } else {
                this.$showToast(resp!.message);
            }
        }

        inputCheck(v:any, mode:number) {
            // 如果输入框是百分比的话要进行限制不可超过100 否则不做限制
            // mode:1 只能输入整数 2：保留小数点后面2位 3：保留小数点后面1位
            // integer 判断/* 只能输入正整数 or 保留小数点后2位 or 保留小数点后1位 */
            v = integer(v, mode);
            if (v > this.pageData.fundTopLimit * 10000) {
                this.operateFund = this.pageData.fundTopLimit * 10000;
            } else {
                this.operateFund = v;
            }
        }

        readProtocol() {
            // 阅读协议
            this.$message({
                type: 'info',
                message: '阅读协议'
            });
        }

        async calculation() {
            // 计算K豆
            if (!this.operateFund) {
                this.$message({
                    type: 'info',
                    message: '操作资金不能小于0'
                });
                return;
            }
            const requestData = {
                strategyProfitId: this.strategyProfitId,
                operateFund: Number(this.operateFund),
                strategyId: this.strategyId
            };
            const [err, resp] = await postAsync('/strategy/calculateFrozenBean', requestData);
            if (resp?.code === '000000') {
                this.BeanVal = resp?.data;
                this.$message({
                    type: 'success',
                    message: '操作成功'
                });
            } else {
                this.$showToast(resp!.message);
            }
        }

        useClick() {
            if (!this.useChecked) {
                this.$message({
                    type: 'warning',
                    message: '请勾选并同意《策略使用协议》'
                });
                return false;
            }

            if (!String(Cookie.get('token')) || String(Cookie.get('token')) === 'undefined') {
                this.$message({
                    type: 'warning',
                    message: '请登录你的平台账号'
                });
                return false;
            }

            const activeObj = {
                isCheck: this.useChecked ? 1 : 0,
                strategyId: this.strategyId,
                serviceType: this.pageData.serviceType,
                maxOperateFund: this.pageData.fundTopLimit
            };
            (this.$refs.useView as any).active(activeObj);
        }
    }
</script>

<style lang="scss" scoped>
    .account-containerHBB{
        flex-direction: column;
        .hbb-strategy-top{
            display: flex;
            width: 100%;
            background: #fff;
            padding: 15px;
            .left{
                width: calc(100% - 300px);
                .l-top{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    h2{
                        font-size: 16px;
                    }
                }
                .l-title{
                    margin-top: 10px;
                    display: flex;
                    span{
                        width: 100px;
                        height: 30px;
                        margin-right: 10px;
                        color: #0086FF;
                        text-align: center;
                        line-height: 30px;
                        border: 1px solid #0086FF;
                    }
                }
                .l-meddle{
                    display: flex;
                    margin: 10px 0;
                    border-left: 1px solid #ddd;
                    div{
                        width: 25%;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        text-align: center;
                        padding: 20px 0;
                        border: 1px solid #ddd;
                        border-left: 0;
                        p{
                            font-size: 13px;
                            margin-bottom: 10px;
                        }
                        h2{
                            &.up{
                                color: #FF5D5A;
                            }
                            &.down{
                                color: #00e700;
                            }
                            font-size: 18px;
                        }
                    }
                }
                .l-bottom{
                    display: flex;
                    p{
                        margin-right: 20px;

                        span{
                            &.up{
                                color: #FF5D5A;
                            }
                            &.down{
                                color: #00e700;
                            }
                            font-weight: bold;
                        }

                    }
                }
            }
            .right{
                width: 300px;
                padding:0 15px;
                border-left: 1px solid #ddd;
                margin-left: 15px;
                h2{
                    margin-bottom: 10px;
                    font-weight: normal;
                    font-size: 16px;
                }
                .r-ji{
                    display: flex;
                    margin-bottom: 10px;
                    .el-button{
                        padding: 0 20px;
                        margin-left: 10px;
                    }
                }
                p{
                    margin-bottom: 10px;
                }
                .r-last{
                    margin-top: 10px;
                    span{
                        color: #0ca2ff;
                    }
                }
            }
        }
        .hbb-strategy-title{
            display: flex;
            width: 100%;
            background: #fff;
            padding: 15px 0;
            margin: 10px 0;
            justify-content: center;
            align-items: center;
            span{
                width: 120px;
                height: 1px;
                background: #ccc;
            }
            p{
                margin: 0 10px;
                font-size: 16px;
                letter-spacing: 2px;
                b{
                    color: #ff2f2f;
                    font-size: 17px;
                }
            }
        }
        .hbb-strategy-main{
            display: flex;
            width: 100%;
            background: #fff;
            flex-direction: column;
            padding: 15px;
            .top{
                display: flex;
                width: 100%;
                align-items: center;
                div{
                    width: 120px;
                    height: 40px;
                    background: none;
                    margin-right: 10px;
                    &.a{
                        text-align: center;
                        line-height: 40px;
                        background: #E3F2FF;
                        color: #0086FF;
                    }
                }
            }
        }
        .hbb-strategy-position{
            margin-top: 10px;
            .top{
                margin-bottom:10px;
            }
        }
    }

</style>
