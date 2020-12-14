<template>
    <div>
        <tk-header class="normal" active-kind="" />
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div class="page-cap-title page-cap-titleH">
                        <span>{{ pageData && pageData.strategyName }}</span>
                        <el-button v-if="pageData.status === 0 &&  pageData.orderStatus === 1" style="padding:5px 15px;margin-left:10px" type="primary" @click="doCloseStrategy">
                            关闭策略
                        </el-button>
                    </div>
                    <!--    内容部分    -->
                    <div class="hbb-contentBox1">
                        <div class="left-box1">
                            <div class="title">
                                <h2>{{ pageData && pageData.contractName }}</h2>
                                <p>交易合约</p>
                            </div>
                            <div class="con">
                                <p>交易合约：{{ pageData && pageData.contractName }}</p>
                                <p>启动时间：{{ pageData && pageData.startTime }}</p>
                                <p>交易时间：{{ pageData && pageData.dealTime }}</p>
                                <p>截止时间：{{ pageData && pageData.endTime }}</p>
                                <!--<span v-if="pageData.status === 0">（休市）</span>-->
                                <p >
                                    当前状态：
                                    <span v-if="pageData.orderStatus === 0">创建中</span>
                                    <span v-if="pageData.orderStatus  === 1 || pageData.orderStatus  === 4 || pageData.orderStatus === 5">{{ ['运行中', '已结束(止损)', '已结束(止盈)', '已结束(到期)', '已结束(手动)'][pageData.status] }}</span>
                                    <span v-if="pageData.orderStatus === 2">订单回冲</span>
                                    <span v-if="pageData.orderStatus === 3">撤单等待</span>
                                    <span v-if="pageData.status === 0 && pageData.orderStatus !== 0">{{ pageData && pageData.tradeStatus === 1 ? '（开市)' : '（休市)' }}</span>
                                </p>
                            </div>
                            <div class="con">
                                <h2>策略结束说明</h2>
                                <p>1：策略达到最大止盈设置，则触发止盈，成功后关闭策略；</p>
                                <p>2：策略达到最大止损设置，则触发止损，成功后关闭策略；</p>
                                <p>3：策略达到截止时间，则触发平仓，成功后关闭策略；</p>
                                <p>4：手动关闭策略。</p>
                            </div>
                            <p style="margin-top: 10px;color:#1a7ef8">
                                策略关闭后，无法再启动。
                            </p>
                        </div>
                        <div class="right-box1">
                            <!--数据汇总-->
                            <div class="hbb-dataAll">
                                <div>
                                    <h2
                                        :class="{
                                            up: pageData.totalProfitMoney > 0,
                                            down: pageData.totalProfitMoney < 0
                                        }"
                                    >
                                        <b v-if="pageData.totalProfitMoney !== 0">{{ pageData.totalProfitMoney > 0 ? '+' : '-' }}</b>{{ pageData && pageData.totalProfitMoney }}
                                    </h2>
                                    <span
                                        :class="{
                                            up: pageData.totalProfitRate > 0,
                                            down: pageData.totalProfitRate < 0
                                        }"
                                    ><b v-if="pageData.totalProfitRate !== 0">{{ pageData.totalProfitRate > 0 ? '+' : '-' }}</b>
                                        {{ pageData && pageData.totalProfitRate }}
                                        <b>%</b>
                                    </span>
                                    <p>累计盈利</p>
                                </div>
                                <div>
                                    <h2
                                        :class="{
                                            up: pageData.positionProfitAndLossMoney > 0,
                                            down: pageData.positionProfitAndLossMoney < 0
                                        }"
                                    >
                                        <b v-if="pageData.positionProfitAndLossMoney !== 0">{{ pageData.positionProfitAndLossMoney > 0 ? '+' : '-' }}</b>{{ pageData && pageData.positionProfitAndLossMoney }}
                                    </h2>
                                    <span
                                        :class="{
                                            up: pageData.positionProfitAndLossRate > 0,
                                            down: pageData.positionProfitAndLossRate < 0
                                        }"
                                    >
                                        <b v-if="pageData.positionProfitAndLossRate !== 0">
                                            {{ pageData.positionProfitAndLossRate > 0 ? '+' : '-' }}
                                        </b>
                                        {{ pageData && pageData.positionProfitAndLossRate }}
                                        <b>%</b>
                                    </span>
                                    <p>持仓盈亏</p>
                                </div>
                                <div>
                                    <h2
                                        :class="{
                                            up: pageData.marketProfitAndLossMoney > 0,
                                            down: pageData.marketProfitAndLossMoney < 0
                                        }"
                                    >
                                        <b v-if="pageData.marketProfitAndLossMoney !== 0">
                                            {{ pageData.marketProfitAndLossMoney > 0 ? '+' : '-' }}
                                        </b>
                                        {{ pageData && pageData.marketProfitAndLossMoney }}
                                    </h2>
                                    <span
                                        :class="{
                                            up: pageData.marketProfitAndLossMoney > 0,
                                            down: pageData.marketProfitAndLossMoney < 0
                                        }"
                                    >
                                        <b v-if="pageData.marketProfitAndLossRate !== 0">
                                            {{ pageData.marketProfitAndLossRate > 0 ? '+' : '-' }}
                                        </b>
                                        {{ pageData && pageData.marketProfitAndLossRate }}
                                        <b>%</b>
                                    </span>
                                    <p>盯市盈亏</p>
                                </div>
                                <div>
                                    <h2
                                        :class="{
                                            up: pageData.maxWithdrawal > 0,
                                            down: pageData.maxWithdrawal < 0
                                        }"
                                    >
                                        <b v-if="pageData.maxWithdrawal !== 0">
                                            {{ pageData.maxWithdrawal > 0 ? '+' : '-' }}
                                        </b>
                                        {{ pageData && pageData.maxWithdrawal }}
                                        <b>%</b>
                                    </h2>
                                    <p>最大回撤</p>
                                </div>
                                <div>
                                    <h2
                                        :class="{
                                            up: pageData.maxStopProfitRate > 0,
                                            down: pageData.maxStopProfitRate < 0
                                        }"
                                    >
                                        <b v-if="pageData.maxStopProfitRate !== 0">
                                            {{ pageData.maxStopProfitRate > 0 ? '+' : '-' }}
                                        </b>
                                        {{ pageData && pageData.maxStopProfitRate }}
                                        <b>%</b>
                                    </h2>
                                    <p>最大止盈</p>
                                </div>
                                <div>
                                    <h2
                                        :class="{
                                            down: pageData.maxStopPLossRate > 0
                                        }"
                                    >
                                        <b v-if="pageData.maxStopPLossRate !== 0">
                                            {{ pageData.maxStopPLossRate > 0 ? '-' : '' }}
                                        </b>
                                        {{ pageData && pageData.maxStopPLossRate }}
                                        <b>%</b>
                                    </h2>
                                    <p>最大止损</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.tradeLevel }}</h2>
                                    <p>交易杠杆</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.operateFund }}</h2>
                                    <p>实操资金</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.frozenBean }}</h2>
                                    <p>冻结K豆</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.payBean }}</h2>
                                    <p>支出K豆</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.backBean }}</h2>
                                    <p>退回K豆</p>
                                </div>
                                <div>
                                    <h2>{{ pageData && pageData.dealNum }}</h2>
                                    <p>交易次数</p>
                                </div>
                            </div>
                            <div class="hbb-echartBox">
                                <statisticsView ref="statisticsView" mode="2" />
                            </div>
                            <!--策略持仓-->
                            <div class="hbb-ownBox">
                                <div class="title">
                                    <span>策略持仓</span>
                                </div>
                                <el-table
                                    :data="tableData"
                                    :header-cell-style="{background: '#f3f3f3'}"
                                    border
                                    style="width: 100%;"
                                >
                                    <el-table-column
                                        prop="date"
                                        label="序号"
                                        align="center"
                                        width="55"
                                    >
                                        <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        prop="name"
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
                            <!--策略运行-->
                            <div class="hbb-ownBox">
                                <div class="title">
                                    <span>策略运行</span>
                                </div>
                                <el-table
                                    :data="tableData"
                                    :header-cell-style="{background: '#f3f3f3'}"
                                    border
                                    style="width: 100%;"
                                >
                                    <el-table-column
                                        prop="date"
                                        label="序号"
                                        align="center"
                                        width="55"
                                    >
                                        <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        prop="name"
                                        label="时间"
                                    />
                                    <el-table-column
                                        prop="name"
                                        label="合约名称"
                                    />
                                    <el-table-column
                                        prop="name"
                                        label="操作类型"
                                    />
                                    <el-table-column
                                        prop="name"
                                        label="订单类型"
                                    />
                                    <el-table-column
                                        prop="name"
                                        label="手数"
                                    />
                                    <el-table-column
                                        prop="name"
                                        label="价格"
                                    />
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import { Component, Watch, Vue, Mixins } from 'vue-property-decorator';
    import statisticsView from './compontent/statistics.vue';
    import { getAsync, postAsync } from '@/utils/request';
    import TkHeader from '~/components/common/TkHeader.vue';
    import TkFooter from '~/components/common/TkFooter.vue';

    @Component({
        components: {
            TkHeader,
            TkFooter,
            statisticsView
        }
    })

    export default class extends Vue {
        radio:string = '1';
        strategyOrderId:string = ''; // 当前策略id

        tableData:any[] = []; // 策略持仓

        pageData:any = {
            backBean: '', // 退回k豆
            contractName: '', // 交易合约
            dealLog: '', // 策略执行 0=不显示，1=显示
            dealNum: '', // 交易次数
            dealTime: '', // 交易时间
            endTime: '', // 截止时间
            frozenBean: '', // 截止时间
            futureAccount: '', // 期货账号
            futureCompanyName: '', // 期货公司
            isHandClose: '', // 是否支持手动关闭 0=不支持，2=支持
            marketProfitAndLossMoney: '', // 盯市盈
            marketProfitAndLossRate: '', // 盯市盈亏百分比
            maxWithdrawal: '', // 最大回撤
            maxStopPLossRate: '', //  最大止损
            maxStopProfitRate: '', // 最大止盈
            mobile: '', // 订阅人
            operateFund: '', // 实操资金
            payBean: '', // 支付k豆
            positionProfitAndLossMoney: '', // 持仓盈亏
            positionProfitAndLossRate: '', // 持仓盈亏百分比
            realDealProfitList: '', // 实盘收益
            speciesName: '', // 交易种类
            startTime: '', // 启动时间
            status: '', // 当前状态
            strategyExecuteList: '', // 策略执行
            strategyId: '', // 策略主键id
            strategyIdString: '', // 策略id
            strategyName: '', // 策略名称
            strategyOrderId: '', // 策略订单id
            strategyPosition: '', // 策略持仓 0=不显示，1=显示
            strategyPositionList: '', // 策略持仓
            strategyProfitChartConfigList: '', // 策略收益图表配置表
            totalProfitMoney: '', // 累计盈利
            totalProfitRate: '', // 累计盈利百分比
            tradeLevel: '', // 交易杠杆
            strategyCapital: '', // 策略本金
            orderStatus: '', // 订单状态
            tradeStatus: '' // 当前交易状态

        }; //

        mounted() {
            // 页面初始化执行
            this.initPage();
        }

        initPage() {
            // 页面初始化
            this.strategyOrderId = String(this.$route.query.id);
            // 取得详情数据
            this.getDetail();
        }

        async getDetail() {
            // 通过策略id取得查看的数据
            this.$showLoading();
            const [err, resp] = await postAsync('/strategy/queryStrategyInfoByStrategyOrderId', {
                strategyOrderId: this.strategyOrderId
            });

            if (resp?.code === '000000') {
                console.log(resp?.data);
                const {
                    backBean, contractName, dealLog, dealNum, dealTime, endTime, frozenBean, futureAccount, futureCompanyName,
                    isHandClose, marketProfitAndLossMoney, marketProfitAndLossRate, maxRetreatRate, maxStopPLossRate,
                    maxStopProfitRate, mobile, operateFund, payBean, positionProfitAndLossMoney, positionProfitAndLossRate, realDealProfitList,
                    speciesName, startTime, status, strategyExecuteList, strategyId, strategyIdString, strategyName, strategyOrderId,
                    strategyPosition, strategyPositionList, strategyProfitChartConfigList, totalProfitMoney, tradeStatus, strategyCapital, orderStatus, totalProfitRate, tradeLevel
                } = resp?.data;
                this.pageData.backBean = backBean || 0;
                this.pageData.contractName = contractName || '';
                this.pageData.dealLog = dealLog;
                this.pageData.dealNum = dealNum || 0;
                this.pageData.dealTime = dealTime || '--';
                this.pageData.endTime = endTime || '--';
                this.pageData.frozenBean = frozenBean || 0;
                this.pageData.futureAccount = futureAccount;
                this.pageData.futureCompanyName = futureCompanyName;
                this.pageData.isHandClose = isHandClose;
                this.pageData.marketProfitAndLossMoney = marketProfitAndLossMoney || 0;
                this.pageData.marketProfitAndLossRate = marketProfitAndLossRate || 0;
                // this.pageData.maxRetreatRate = maxRetreatRate || 0;
                this.pageData.maxStopPLossRate = maxStopPLossRate || 0;
                this.pageData.maxStopProfitRate = maxStopProfitRate || 0;
                this.pageData.mobile = mobile;
                this.pageData.operateFund = operateFund || 0;
                this.pageData.payBean = payBean || 0;
                this.pageData.positionProfitAndLossMoney = positionProfitAndLossMoney || 0;
                this.pageData.positionProfitAndLossRate = positionProfitAndLossRate || 0;
                this.pageData.realDealProfitList = realDealProfitList;
                this.pageData.speciesName = speciesName;
                this.pageData.startTime = startTime || '--';
                this.pageData.status = status;
                this.pageData.strategyExecuteList = strategyExecuteList;
                this.pageData.strategyId = strategyId;
                this.pageData.strategyIdString = strategyIdString;
                this.pageData.strategyName = strategyName;
                this.pageData.strategyOrderId = strategyOrderId;
                this.pageData.strategyPosition = strategyPosition;
                this.pageData.strategyPositionList = strategyPositionList;
                this.pageData.strategyProfitChartConfigList = strategyProfitChartConfigList;
                this.pageData.totalProfitMoney = totalProfitMoney || 0;
                this.pageData.totalProfitRate = totalProfitRate || 0;
                this.pageData.tradeLevel = tradeLevel || 0;
                this.pageData.strategyCapital = strategyCapital;
                this.pageData.orderStatus = orderStatus;
                this.pageData.tradeStatus = tradeStatus;
                (this.$refs.statisticsView as any).active(this.pageData.strategyProfitChartConfigList);
            } else {
                this.$showToast('请求失败');
            }
            this.$closeLoading();
        }

       doCloseStrategy() {
            // 关闭策略
            this.$confirm('温馨提示，关闭策略将会对当前策略持仓强行平仓，请谨慎操作, 是否继续执行?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                this.closeStrategy();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        }

        async closeStrategy() {
            // 关闭策略
            const [err, resp] = await postAsync('/strategy/closeStrategyOrder', {
                strategyOrderId: this.strategyOrderId
            });

            if (resp?.code === '000000') {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', {}, [
                        h('span', {}, '您将扣除的K豆数量 '),
                        h('b', { style: 'color: #FF5D5A;font-size:20px' }, resp?.data)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '扣除中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 1000);
                        } else {
                            done();
                        }
                    }
                }).then((action) => {
                    this.sureCloseFn();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            } else {
                this.$message({
                    type: 'info',
                    message: resp?.message || '网络异常'
                });
            }
        }

        async sureCloseFn() {
            this.$showLoading();
            const [err, resp] = await postAsync('/strategy/updateStrategyOrder', {
                strategyOrderId: this.strategyOrderId
            });

            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                this.$message({
                    type: 'error',
                    message: resp?.message || '网络异常'
                });
            }
            this.$closeLoading();
        }
    }

</script>

<style lang="scss" scoped>
    .page-cap-titleH{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        margin-top: 10px;
        span{
            font-size: 20px;
        }
        .el-button {
            span{
                font-size: 14px;
            }
        }
    }
    .hbb-contentBox1{
        display: flex;
        width: 100%;
        padding: 10px;
        background: #fff;
        margin-bottom: 15px;
        .left-box1{
            float: left;
            width: 20%;
            .title{
                display: flex;
                width: 100%;
                flex-direction: column;
                padding-bottom: 15px;
                border-bottom:1px solid #ddd;

                h2{
                    margin-bottom:15px;
                    font-size: 16px;
                }
            }
            .con{
                display: flex;
                width: 100%;
                margin-top: 10px;
                border-bottom:1px solid #ddd;
                flex-direction: column;
                h2{
                    margin-bottom:15px;
                    font-size: 16px;

                }
                p{
                    margin-bottom: 15px;
                    span{
                        color: #1a7ef8;
                    }
                }
            }
        }
        .right-box1{
            float: right;
            width: 80%;
            .hbb-dataAll{
                float: right;
                width: 95%;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #ddd;
                margin-bottom: 20px;
                div{
                    float: left;
                    width: 16.666%;
                    height: 80px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid #dddddd;
                    border-right: 0;
                    border-bottom: 0;
                    h2{
                        font-size: 16px;
                        color: #666;
                        &.up{
                            color: #FF5D5A;
                        }
                        &.down{
                            color: #00e700;
                        }

                    }
                    span{
                        color: #666;
                        font-size: 14px;
                        margin-top: 5px;
                        &.up{
                            color: #FF5D5A;
                        }
                        &.down{
                            color: #00e700;
                        }
                    }
                    p{
                        color: #666;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                }
            }
            .hbb-echartBox{
                display: flex;
                float: right;
                width: 95%;
                height: 450px;
                border: 1px solid #ddd;
            }
            .hbb-ownBox{
                display: flex;
                width: 95%;
                margin-top: 10px;
                float: right;
                flex-direction: column;
                .title{
                    display: flex;
                    width: 100%;
                    height: 50px;
                    align-items: center;
                    font-size: 14px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    span{
                        width: 120px;
                        height: 40px;
                        font-size: 15px;
                        line-height: 40px;
                        font-weight: bold;
                        text-align: center;
                        background: #D8ECFF;
                        color: #2F9CFF;
                    }
                }
            }
        }
    }
</style>
