<template>
    <div style="width: 100%">
        <div class="assets-info-area">
            <div v-if="dataLoaded && isLogined === 0" class="mask">
                <!--蒙层-->
                <div class="box">
                    <p class="tips">
                        查看资产信息，需要登录期货账号
                    </p>
                    <el-button class="login" type="primary" @click="showLoginPanel">
                        去登录
                    </el-button>
                </div>
            </div>
            <div class="account-section-title" style="position: relative">
                资产信息
                <a class="account-info" @click="clickOnAssetsInfo($event)">{{ futureAccountNumber + futureCompanyName }}</a>
                <div v-show="showAssetsPanel" ref="account-menu-panel" class="panel">
                    <div @click="clickSwitchAccount($event)">
                        切换账号
                    </div>
                    <div @click="clickExitAccount">
                        退出交易
                    </div>
                </div>
            </div>
            <div class="account-base-wrap">
                <div class="account-base-line">
                    <div>
                        <p class="title">
                            当日权益
                        </p>
                        <p class="value">
                            {{ equity | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            上日权益
                        </p>
                        <p class="value">
                            {{ preEquity | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            当日入金
                        </p>
                        <p class="value" :class="inout >= 0 ? 'up' : 'down'">
                            {{ inout | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            持仓盈亏
                        </p>
                        <p class="value" :class="floatingPL >= 0 ? 'up' : 'down'">
                            {{ floatingPL | money }}
                        </p>
                        <p class="value" :class="floatingPL >= 0 ? 'up' : 'down'">
                            --.--%
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            盯市盈亏
                        </p>
                        <p class="value" :class="positionProfit >= 0 ? 'up' : 'down'">
                            {{ positionProfit | money }}
                        </p>
                        <p class="value" :class="positionProfit >= 0 ? 'up' : 'down'">
                            --.--%
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            当日平仓盈亏
                        </p>
                        <p class="value" :class="closeProfit >= 0 ? 'up' : 'down'">
                            {{ closeProfit | money }}
                        </p>
                        <p class="value" :class="closeProfit >= 0 ? 'up' : 'down'">
                            --.--%
                        </p>
                    </div>
                </div>
                <div class="account-base-line">
                    <div>
                        <p class="title">
                            手续费
                        </p>
                        <p class="value">
                            {{ accountFee | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            保证金
                        </p>
                        <p class="value">
                            {{ accountInitialMargin | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            挂单保证金
                        </p>
                        <p class="value">
                            {{ frozenDeposit | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            可用资金
                        </p>
                        <p class="value">
                            {{ available | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            可提资金
                        </p>
                        <p class="value">
                            {{ canDraw | money }}
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            资金使用率
                        </p>
                        <p class="value">
                            {{ capitalUtilizationRate | money }}%
                        </p>
                    </div>
                </div>
            </div>
            <div class="icons-wrap">
                <div class="item" @click="clickDeal(1)">
                    <img src="//rs.tanxingk.com/images/future_icon_1.png" alt="">
                    <p class="text">
                        手动下单
                    </p>
                </div>
                <div class="item" @click="clickDeal(2)">
                    <img src="//rs.tanxingk.com/images/future_icon_3.png" alt="">
                    <p class="text">
                        云条件单
                    </p>
                </div>
                <div class="item" @click="clickDeal(3)">
                    <img src="//rs.tanxingk.com/images/future_icon_2.png" alt="">
                    <p class="text">
                        云损盈单
                    </p>
                </div>
                <div class="item" @click="clickDeal(4)">
                    <img src="//rs.tanxingk.com/images/future_icon_5.png" alt="">
                    <p class="text">
                        策略订单
                    </p>
                </div>
                <div class="item" @click="clickDeal(5)">
                    <img src="//rs.tanxingk.com/images/future_icon_6.png" alt="">
                    <p class="text">
                        监控中心
                    </p>
                </div>
                <div class="item" @click="clickDeal(6)">
                    <img src="//rs.tanxingk.com/images/future_icon_4.png" alt="">
                    <p class="text">
                        银期转账
                    </p>
                </div>
            </div>
            <div class="hold-wraps">
                <div class="menus">
                    <div :class="{active: contractCatIndex === 0}" @click="clickOnContractMenuTab(0)">
                        持仓
                    </div>
                    <div :class="{active: contractCatIndex === 1}" @click="clickOnContractMenuTab(1)">
                        挂单
                    </div>
                    <div :class="{active: contractCatIndex === 2}" @click="clickOnContractMenuTab(2)">
                        委托
                    </div>
                    <div :class="{active: contractCatIndex === 3}" @click="clickOnContractMenuTab(3)">
                        成交
                    </div>
                </div>
                <div class="table-lists">
                    <div v-show="contractCatIndex === 0">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 200px">
                                        合约名称
                                    </th>
                                    <th>多空</th>
                                    <th>手数</th>
                                    <th>可用</th>
                                    <th>均价</th>
                                    <th>现价</th>
                                    <th>持仓盈亏</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="dataLoaded && positionDataList.length > 0">
                                    <tr v-for="(item,idx) in positionDataList" :key="idx">
                                        <td>{{ item.codeName }}</td>
                                        <td style="color: #ff2f2f">
                                            {{ item.side === 0 ? '多' : '空' }}
                                        </td>
                                        <td>
                                            {{ item.amount }}
                                        </td>
                                        <td style="color: #0ca2ff">
                                            {{ item.canAmount }}
                                        </td>
                                        <td>{{ item.price }}</td>
                                        <td>
                                            {{ item.newPrice || '--' }}
                                        </td>
                                        <td>
                                            <span v-if="item.positionProfit > 0" class="up">+{{ item.positionProfit }}</span>
                                            <span v-if="item.positionProfit < 0" class="down">{{ item.positionProfit }}</span>
                                            <span v-if="item.positionProfit === 0">0</span>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div v-if="dataLoaded && positionDataList.length === 0" class="no-data">
                            暂无数据
                        </div>
                    </div>
                    <div v-show="contractCatIndex === 1">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 200px">
                                        合约名称
                                    </th>
                                    <th>委托来源</th>
                                    <th>操作类型</th>
                                    <th>委托价格</th>
                                    <th>委托量</th>
                                    <th>挂单量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="dataLoaded && dealDataList.length > 0">
                                    <tr v-for="item in dealDataList" :key="item.idx">
                                        <td>{{ item.codeName }}</td>
                                        <td>
                                            {{ item.origin }}
                                        </td>
                                        <td>
                                            <template>
                                                <span v-if="item.operation === 1">
                                                    <span>{{ item.side === 1 ? '卖空' : '买多' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 2">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 3">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else>
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                            </template>
                                        </td>
                                        <td>
                                            {{ item.price }}
                                        </td>
                                        <td>{{ item.amount }}</td>
                                        <td>
                                            {{ item.billQuantity }}
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div v-if="dataLoaded && dealDataList.length === 0" class="no-data">
                            暂无数据
                        </div>
                    </div>
                    <div v-show="contractCatIndex === 2">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 200px">
                                        合约名称
                                    </th>
                                    <th>委托来源</th>
                                    <th>操作类型</th>
                                    <th>委托状态</th>
                                    <th>委托价格</th>
                                    <th>委托量</th>
                                    <th>未成交量</th>
                                    <th>已成交量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="dataLoaded && dealDataList.length > 0">
                                    <tr v-for="item in dealDataList" :key="item.idx">
                                        <td>{{ item.codeName }}</td>
                                        <td>
                                            {{ item.origin }}
                                        </td>
                                        <td>
                                            <template>
                                                <span v-if="item.operation === 1">
                                                    <span>{{ item.side === 1 ? '卖空' : '买多' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 2">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 3">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else>
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                            </template>
                                        </td>
                                        <td>
                                            <template>
                                                <span v-if="item.status === 0 || item.status === 1">挂单中</span>
                                                <span v-if="item.status === 2">部分成交</span>
                                                <span v-if="item.status === 3">已成交</span>
                                                <span v-if="item.status === 4">取消中</span>
                                                <span v-if="item.status === 5">已取消</span>
                                                <span v-if="item.status === 6">部分取消</span>
                                                <span v-if="item.status === 7">订单错误</span>
                                                <span v-if="item.status === 8">订单终结</span>
                                            </template>
                                        </td>
                                        <td>
                                            {{ item.price }}
                                        </td>
                                        <td>{{ item.amount }}</td>
                                        <td>
                                            {{ Number(item.amount) - Number(item.dealAmount) }}
                                        </td>
                                        <td>
                                            {{ item.dealAmount }}
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div v-if="dataLoaded && dealDataList.length === 0" class="no-data">
                            暂无数据
                        </div>
                    </div>
                    <div v-show="contractCatIndex === 3">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 200px">
                                        合约名称
                                    </th>
                                    <th>委托来源</th>
                                    <th>操作类型</th>
                                    <th>成交价格</th>
                                    <th>成交量</th>
                                    <th>成交时间</th>
                                    <!--                                    <th>委托编号</th>-->
                                    <!--                                    <th>成交编号</th>-->
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="dataLoaded && dealDataList.length > 0">
                                    <tr v-for="item in dealDataList" :key="item.idx">
                                        <td>{{ item.codeName }}</td>
                                        <td>
                                            {{ item.origin }}
                                        </td>
                                        <td>
                                            <template>
                                                <span v-if="item.operation === 1">
                                                    <span>{{ item.side === 1 ? '卖空' : '买多' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 2">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else-if="item.operation === 3">
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                                <span v-else>
                                                    <span>{{ item.side === 1 ? '平多' : '平空' }}</span>
                                                </span>
                                            </template>
                                        </td>
                                        <td>
                                            {{ item.price }}
                                        </td>
                                        <td>{{ item.amount }}</td>
                                        <td>{{ item.lasttimestamp }}</td>
                                        <!--                                        <td>{{ item.orderID }}</td>-->
                                        <!--                                        <td>{{ item.fillID }}</td>-->
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div v-if="dataLoaded && dealDataList.length === 0" class="no-data">
                            暂无数据
                        </div>
                    </div>
                    <tk-loading-cap v-if="!dataLoaded" />
                </div>
            </div>
            <div class="account-section-title" v-if="strategyData.length>0">
                <div class="top">
                    我的策略<p class="tips">
                        (数据信息可能存在误差，需要登录期货账号进行获取)
                    </p>
                    <a class="back-btn" @click="goMore">更多</a>
                </div>
                <el-table
                    :data="strategyData"
                    border
                    class="hbb-tableS"
                    style="width: 100%"
                >
                    <el-table-column
                        label="序号"
                        align="center"
                        width="50px"
                    >
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="strategyName"
                        align="center"
                        width="120px"
                        label="策略名称"
                    >
                        <template slot-scope="scope">
                            <span class="strategyName" @click="goDetail(scope.row)">{{ scope.row.strategyName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="speciesName"
                        label="交易品种"
                        align="center"
                        width="120px"
                    />
                    <el-table-column
                        prop="operateType"
                        label="类型"
                        align="center"
                        width="60px"
                    />
                    <el-table-column
                        prop="positionNum"
                        label="持仓手数"
                    />
                    <el-table-column
                        prop="positionAvg"
                        label="持仓均价"
                    />
                    <el-table-column
                        prop="positionProfitAndLoss"
                        label="持仓盈亏"
                    />
                    <el-table-column
                        prop="closePositionProfitAndLoss"
                        label="平仓盈亏"
                    />
                    <el-table-column
                        label="期货账号"
                        align="center"
                        width="120px"
                    >
                        <template slot-scope="scope">
                            <p>{{ scope.row.futureCompanyName }}</p>
                            <span>{{ scope.row.futureAccountNumber }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="frozenBean"
                        align="center"
                        label="冻结K豆"
                    />
                    <el-table-column
                        prop="payBean"
                        align="center"
                        label="支出K豆"
                    />
                    <el-table-column
                        prop="dealNum"
                        align="center"
                        label="交易次数"
                    />
                    <el-table-column
                        prop="status"
                        align="center"
                        label="当前状态"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderStatus === 0">
                                <span>创建中</span>
                            </div>
                            <div v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 4 || scope.row.orderStatus === 5">
                                <span>{{ ['运行中', '已结束(止损)', '已结束(止盈)', '已结束(到期)', '已结束(手动)'][scope.row.status] }}</span>
                            </div>
                            <div v-if="scope.row.orderStatus === 2">
                                <span>订单回冲</span>
                            </div>
                            <div v-if="scope.row.orderStatus === 3">
                                <span>撤单等待</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="hbb-strategy-box">
            <div class="title">
                <h2>推荐策略</h2>
                <p>（策略收益为模拟收益，请谨慎选择使用！）</p>
            </div>
            <div style="width:100%">
                <SwiperView ref="SwiperView" mode="2" style="width: 100%" />
            </div>
        </div>

        <tk-transaction-login
            v-if="showTransactionLoginPanel"
            ref="transactionLogin"
            :account-list="myAccountList.filter(item => item.status === 1)"
            :select-id="keepSelectLoginId"
            :visible.sync="showTransactionLoginPanel"
            @login-success="onTransactionLoginSuccess"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Ref, Vue } from 'vue-property-decorator';
    import { remove as removeCookie } from 'js-cookie';
    import { ContractDataSocket, EnumContractDataKey, pickSituationDataByOrder, TypeContractData } from '@common/src/future';
    import dayjs from 'dayjs';
    import { bcadd, bcsub, bcmul, bcdiv } from '@common/src/utils/number';
    import { postAsync } from '@/utils/request';
    import TkTransactionLogin from '@/components/common/TkTransactionLogin.vue';
    import SwiperView from '@/components/common/HBSwiperView.vue';
    import TkLoadingCap from '@/components/ui/TkLoadingCap.vue';

    let socketInstance: any = null;
    let manualDealSocketPositionsInfo: any = null;
    let keepCoedsData: string[] = [];
    @Component({
        components: {
            TkLoadingCap,
            TkTransactionLogin,
            SwiperView
        }
    })
    export default class extends Vue {
        dataLoaded = false; // 数据是否已经加载
        isLogined = -1; // 是否登陆期货用户账号

        futureAccountId = '';
        futureCompanyName = '';
        futureAccountNumber = '';

        inout = ''; // 出入金
        available= ''; // 可用资金
        canDraw= ''; // 可提金额
        equity= ''; // 当日权益
        preEquity= ''; // 上日权益
        balance = ''; // 当日结存
        frozenDeposit = ''; // 挂单保证金
        accountInitialMargin = ''; // 保证金
        accountFee = ''; // 手续费
        floatingPL = 0; // 持仓盈亏
        positionProfit = ''; // 叮市盈亏
        closeProfit = ''; // 平仓盈亏
        capitalUtilizationRate = ''; // 资金使用率

        /**************/
        contractCatIndex = 0;

        positionDataList: any[] = [];
        dealDataList: any[] = [];
        entrustDataCopy:any[] = []; // 持仓数据的列表 copy便于做过滤

        keepSelectLoginId = '';
        showTransactionLoginPanel = false;

        myAccountList: any[] = []; // 我的账户

        showAssetsPanel = false; // 是否显示按钮

        strategyData:any[] = []; // 我的策略

        @Ref('account-menu-panel')
        accountMenuPanelRef: any;

        mounted () {
            this.getData();
            this.getFutureCompany();
            window.addEventListener('click', this.clickOnArea);
            this.initDataSocket();
            this.initDataSocketP();
            this.initPage();
        }

        initPage() {
            // 初始化页面
            setTimeout(() => {
                if (this.isLogined === -1) {
                    // 防止某些不可控场景 如果没有登录期货账号直接清除期货账号的cookie
                    removeCookie('futureToken'); // 清除cookie
                } else {
                    return false;
                }
            }, 1000);
        }

        beforeDestroy() {
            window.removeEventListener('click', this.clickOnArea);
        }

        async getStrategyData() {
            // 获取我的策略
            const requestData = {
                page: 1
            };
            const [err, resp] = await postAsync('/strategy/queryMyStrategyListPage', requestData);
            if (resp?.code === '000000') {
                if (resp?.data?.result.length > 0) {
                    this.strategyData = resp?.data?.result.slice(0, 2);
                }
            }
        }

        async initDataSocket() {
            /* 开启socket */
            socketInstance = ContractDataSocket.getIdleDataSocket();
            socketInstance.addListener(this.handleSocketData);
            await socketInstance.connect();
        }

        handleSocketData(errCode: number, incomeData: any) {
            if (errCode === 0) {
                console.log(incomeData);
            }
        }

        clickOnArea(e: any) {
            const rect = this.accountMenuPanelRef.getBoundingClientRect();
            if (e.clientX > rect.x &&
                e.clientX < rect.x + rect.width &&
                e.clientY > rect.y &&
                e.clientY < rect.y + rect.height
            ) {
                return;
            }
            if (this.showAssetsPanel) {
                this.showAssetsPanel = false;
            }
        }

        async initDataSocketP() {
            /* 开启socket */
            const _this = this;

            manualDealSocketPositionsInfo = ContractDataSocket.getIdleDataSocket(this);
            manualDealSocketPositionsInfo.addListener((errCode: number, incomeData: any) => {
                _this.floatingPL = 0;
                if (JSON.stringify(incomeData) !== '{}') {
                   incomeData.forEach((x:any) => {
                      _this.positionDataList.filter((item:any) => {
                            return item.code === x.code;
                        }).forEach((y: any) => {
                            y.newPrice = Number(x.price);
                            y.positionProfit = Number(y.side) === 0 ? bcmul(bcmul(bcsub(y.newPrice, y.price), y.amount), y.contractsize) : bcmul(bcmul(bcsub(y.price, y.newPrice), y.amount), y.contractsize);// 持仓盈亏

                          _this.floatingPL += Number(y.positionProfit);
                        });
                    });
                    // 提交持仓盈亏到后台
                    this.getTloatingTo(_this.floatingPL);
                }
            });
            await manualDealSocketPositionsInfo.connect();
        }

        async getTloatingTo(val:any) {
            const requestData = {
                profitLoss: val
            };
            const [err, resp] = await postAsync('/transIndex/getFutureAccountHoldProfitLoss', requestData);
            if (resp?.code === '000000') {
            } else {
            }
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/transIndexInfo', {});
            if (resp?.code === '000000') {
                this.isLogined = 1;
                this.dataLoaded = true;
                this.futureAccountId = '' + resp.data.futureAccountId;
                this.futureCompanyName = resp.data.futureCompanyName;
                this.futureAccountNumber = resp.data.futureAccountNumber;
            } else {
                this.dataLoaded = true;
                this.isLogined = 0;
                this.$closeLoading();
            }
            // 未登录不请求后面数据
            if (this.isLogined) {
                Promise.all([
                    this.getFundInfo(),
                    this.getStrategyData()
                ]).then(() => {
                    this.dataLoaded = true;
                    this.$closeLoading();
                });
            }
            setTimeout(() => {
                this.getPositionData();
            }, 1200);
            setTimeout(() => {
                this.getQueryOrder();
            }, 2400);
        }

        async getFundInfo() {
            const [err2, resp2] = await postAsync('/transIndex/myFundInfo', {});
            if (resp2?.code === '000000') {
                const data = resp2.data;
                this.inout = '' + parseFloat(data.cashInValue); // 当日入金
                this.available = parseFloat(data.available).toFixed(2); // 可用资金
                this.canDraw = parseFloat(data.canDraw).toFixed(2); // 可提金额
                this.equity = parseFloat(data.equity).toFixed(2); // 权益
                this.preEquity = parseFloat(data.preEquity).toFixed(2); // 上日权益

                this.balance = parseFloat(data.balance).toFixed(2);
                this.frozenDeposit = parseFloat(data.frozenDeposit).toFixed(2);
                this.accountInitialMargin = parseFloat(data.accountInitialMargin).toFixed(2);
                this.accountFee = parseFloat(data.accountFee).toFixed(2);

                this.frozenDeposit = parseFloat(data.frozenDeposit).toFixed(2); // 挂单保证金
                this.accountInitialMargin = parseFloat(data.accountInitialMargin).toFixed(2); // 保证金
                this.accountFee = parseFloat(data.accountFee).toFixed(2); // 手续费

                // this.floatingPL = parseFloat(data.floatingPL).toFixed(2);

                this.positionProfit = parseFloat(data.positionProfit).toFixed(2); // 叮市盈亏
                this.closeProfit = parseFloat(data.closeProfit).toFixed(2); // 平仓盈亏
                this.capitalUtilizationRate = String(Number(bcdiv(bcsub(this.equity, this.available), this.equity)) * 100); // 资金使用率
            } else {
                this.inout = '';
                this.available = '';
                this.canDraw = '';
                this.equity = '';
                this.preEquity = '';

                this.balance = '';
                this.frozenDeposit = '';
                this.accountInitialMargin = '';
                this.accountFee = '';

                this.frozenDeposit = '';
                this.accountInitialMargin = '';
                this.accountFee = '';
                this.floatingPL = 0;
                this.positionProfit = '';
                this.closeProfit = '';
            }
        }

        async getPositionData() {
            const [err, resp] = await postAsync('/transIndex/myPositionsInfo', {});
            if (resp?.code === '000000') {
                const list: any[] = [];
                const codeList: any[] = [];
                (resp?.data || []).forEach((item: any, index: number) => {
                    codeList.push(item.apiCode);
                    list.push({
                        idx: index,
                        code: item.apiCode,
                        codeName: !item.codeName.includes('.') ? item.codeName : this.subStrFn(item.codeName),
                        amount: item.amount, // 持仓手数
                        canAmount: item.canamount, // 可用手数
                        side: Number(item.side), // 持仓 0=多  1=空
                        price: item.price, // 均价
                        contractsize: item.contractsize,
                        positionProfit: parseFloat(item.positionprofit || 0).toFixed(2) // 持仓数据
                    });
                });
                this.positionDataList = list;
                // {"id":1,"topic":"sub_group_tick","data":{"codes":["AL2008ASP160.SHFE","RB2010.SHFE","RU2009ASP240.SHFE","I2009ASP240.DCE","BU1912MSP.SHFE"]}}
                // socketInstance.sendContractTickGroupMessage(codeList);

                // 通过socket去获取列表的最新价格
                keepCoedsData = this.positionDataList.filter((item: any) => !!item.code).map((item: any) => item.code);
                keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
                if (keepCoedsData.length > 0) {
                    manualDealSocketPositionsInfo.sendContractTickGroupMessage(keepCoedsData); // 发送数据
                }
            }
        }

        async getFutureCompany() {
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

        clickOnContractMenuTab(index: number) {
            if (index > 0) {
                // 去查询委托订单的数据
                switch (index) {
                    case 1:
                        this.dealDataList = this.entrustDataCopy.filter((x:any) => x.status === 1 || x.status === 2);
                        break;
                    case 2:
                        this.dealDataList = this.entrustDataCopy;
                        break;
                    case 3:
                        this.dealDataList = this.entrustDataCopy.filter((x:any) => x.status === 2 || x.status === 3);
                        break;
                    default:
                        break;
                }
            }
            this.contractCatIndex = index;
        }

        async getQueryOrder() {
            const [err, resp] = await postAsync('/transIndex/queryOrder');
            if (resp?.code === '000000') {
                const list = resp?.data?.data || [];
                this.dealDataList = list.map((item:any) => {
                    return {
                        code: String(item.code), // 合约名称
                        codeName: !item.codeName.includes('.') ? item.codeName : this.subStrFn(String(item.codeName)), // 合约名称
                        origin: String(item.origin), // 委托来源
                        side: Number(item.side), // 操作类型
                        price: Number(item.price), // 委托价格
                        amount: Number(item.amount), // 委托手数
                        dealAmount: Number(item.dealAmount), // 成交手数
                        status: Number(item.status), // 委托状态
                        timestamp: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss'), // 委托时间
                        hedgeType: Number(item.hedgeType), // 投保类型
                        lasttimestamp: item.lasttimestamp ? dayjs(item.lasttimestamp).format('YYYY-MM-DD HH:mm:ss') : '-', // 委托时间
                        dealprice: String(item.dealprice) || '-', // 成交均价
                        frontID: String(item.frontID) || '', // frontID
                        orderID: String(item.orderID) || '', // 订单id
                        sessionID: String(item.sessionID) || '', // sessionID
                        refString: String(item.refString) || '', // refString
                        operation: Number(item.operation) || 0, // 操作类型判断
                        billQuantity: bcsub(item.amount, item.dealAmount), // 挂单量
                        fillID: String(item.fillID) || '' // 成交编号
                    };
                });

                this.entrustDataCopy = JSON.parse(JSON.stringify(this.dealDataList));
            }
        }

        showLoginPanel() {
            // keepSelectLoginId
            const find = this.myAccountList.find((item: any) => item.status === 1);
            if (find) {
                this.keepSelectLoginId = find.id;
                this.showTransactionLoginPanel = true;
            } else {
                this.$router.push({
                    path: '/account/transaction-account'
                });
            }
        }

        onTransactionLoginSuccess() {
            this.showTransactionLoginPanel = false;
            this.getData();
        }

        clickOnAssetsInfo(e: any) {
            e.stopPropagation();
            this.showAssetsPanel = !this.showAssetsPanel;
        }

        // 退出交易
        async clickExitAccount() {
            this.$showLoading();
            const [err, resp] = await postAsync('/transIndex/loginOutFutureAccount', {
                futureAccountId: this.futureAccountId
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('退出成功');
                removeCookie('futureToken'); // 清除cookie
                window.location.reload();
            } else {
                this.$showToast(resp?.message || '退出失败');
            }
        }

        clickSwitchAccount(e: any) {
            e.stopPropagation();
            const newArrs = this.myAccountList.filter((item: any) => item.status === 1);
            if (newArrs.length <= 1) {
                this.$showToast('没有更多账号可以切换');
            } else {
                // 选个不同的id
                const find = this.myAccountList.find((item: any) => item.status === 1 && item.id !== this.futureAccountId);
                if (find) {
                    this.keepSelectLoginId = find.id;
                    this.showTransactionLoginPanel = true;
                    setTimeout(() => {
                        (this.$refs.transactionLogin as any).active(find);
                    }, 0);
                }
            }
        }

        clickDeal(index: number) {
            if (index > 1) {
                this.$showToast('暂未开放');
                return false;
            }
            window.open('/future/deal', '_self');
        }

        subStrFn(str:string) {
            // 截取字符串
            const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
            return strLast;
        }

        goDetail(item:any) {
            // 去详情页
            this.$router.push({
                path: '/strategy/strategyDetail',
                query: {
                    id: item.strategyOrderId
                }
            });
        }

        goMore() {
            // 查看更多
            this.$router.push({
                path: '/account/strategy'
            });
        }
    }
</script>

<style lang="scss" scoped>
    .assets-info-area{
        position: relative;
        width:100%;

        .mask{
            background-color: rgba(0,0,0,.4);
            position: absolute;
            z-index: 99;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            .box{
                display: flex;
                width: 100%;
                height: 100px;
                flex-direction: column;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right:0;
                margin:auto;
                .tips{
                    color: #fff;
                    font-size: 16px;
                    text-align: center;
                }
                .login{
                    display: block;
                    width: 100px;
                    height: 45px;
                    margin: 20px auto 0;
                }
            }

        }
    }
    .account-info{
        margin-left: auto;
        font-weight: normal;
        color: $color-main;
        padding-right: 15px;
        cursor: pointer;
        +.panel{
            position: absolute;
            width: 150px;
            top: 40px;
            right: 0;
            border: 1px solid #eaeaea;
            background-color: #fff;
            >div{
                line-height: 45px;
                text-align: center;
                font-size: 15px;
                font-weight: normal;
                border-bottom: 1px solid #eaeaea;
                cursor: pointer;
                &:hover{
                    color: $color-main;
                }
                &:last-child{
                    border-bottom: 0;
                }
            }
        }
    }
    .account-base-line{
        background-color: #fff;
        border-bottom: 1px solid #eaeaea;
        display: flex;
        padding: 20px 0;
        >div{
            flex: 1;
            padding-left: 15px;
            border-left: 1px solid #eaeaea;
            &:first-child{
                border-left: none;
            }
        }
        .title{
            font-size: 15px;
            color: #333;
            margin-bottom: 15px;
        }
        .value{
            margin-bottom: 8px;
            &.up{
                color: $color-up;
            }
            &.down{
                color: $color-down;
            }
        }
    }
    .icons-wrap{
        background-color: #fff;
        display: flex;
        padding: 20px 0;
        .item{
            flex: 1;
            cursor: pointer;
            >img{
                display: block;
                width: 46px;
                height: 46px;
                margin: 0 auto;
            }
            .text{
                color: #333;
                font-size: 13px;
                margin-top: 6px;
                text-align: center;
            }
        }
    }
    .hold-wraps{
        border-top: 1px solid #eaeaea;
        background-color: #fff;
        padding: 10px;
        .menus{
            display: flex;
            >div{
                border-right: 1px solid #fff;
                width: 100px;
                line-height: 36px;
                background-color: #f2f2f2;
                text-align: center;
                cursor: pointer;
                &.active{
                    background-color: #ff433833;
                    font-weight: bold;
                }
                &.cell{
                    font-weight: normal;
                }
            }
        }
        .table-lists{
            margin-top: 10px;
            table{
                width: 100%;
            }
            th{
                background-color: #f2f2f2;
                line-height: 36px;
                font-weight: normal;
                color: #666;
                border-right: 1px solid #fff;
            }
            tbody{
                td{
                    text-align: center;
                    font-size: 14px;
                    line-height: 44px;
                    color: #666;
                    >span{
                        line-height: 44px;
                        color: #666;
                        &.up{
                            color: $color-up;
                        }
                        &.down{
                            color: $color-down;
                        }
                    }
                }
                tr{
                    border-bottom: 1px solid #eaeaea;
                }
            }
        }
    }
    .no-data{
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 15px;
        width: 100%;
        text-align: center;
    }
    .account-section-title{
        border-top: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        .top{
            display: flex;
            width: 100%;
            padding: 15px 0;
            align-items: center;
            font-size: 16px;
            span{
                color: #0ca2ff;
            }
        }
        .back-btn{
            margin-left: auto;
            margin-right: 15px;
            line-height: 30px;
            font-size: 14px;
            background-color:  #f2f2f2;
            color: $color-main;
            padding: 0 10px;
            cursor: pointer;
            font-weight: normal;
        }
    }
    .account-section-content{
        background-color: #fff;
        padding: 10px 15px;
    }
    .hbb-strategy-box{
        display: flex;
        width:100%;
        flex-direction: column;
        background: #fff;
        border-top: 1px solid #ddd;
        .title{
            display: flex;
            padding: 15px;
            width: 100%;
            align-items: center;
            h2{
                font-size: 16px;
            }
            p{
                color: #0ca2ff;
            }
        }
    }
    .strategyName{
        color: #0ca2ff;
        cursor: pointer;
    }
    .hbb-tableS{
        .el-table th>.cell{
            font-weight: normal !important;
        }
        .el-table td>.cell{
            font-weight: normal !important;
        }

    }
</style>
