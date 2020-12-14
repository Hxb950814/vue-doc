<!--交易数据-->
<template>
    <div class="color-bg">
        <div class="main-area">
            <div class="header">
                <div v-if="isFutureToken && isFutureToken !== 'undefined'">
                    <img src="//rs.tanxingk.com/images/logo_ico40.png" alt="">
                    下单大师交易下单-{{ nickName }}-{{ futureCompanyName }}-{{ name }}
                </div>
                <div v-else>
                    <img src="//rs.tanxingk.com/images/logo_ico40.png" alt="">
                    未登录-<span class="hbb-qNo" @click="clickGoBack">去登陆</span>
                </div>
                <div>
                    <i class="el-icon-plus button" @click="clickAddUserSelect" />
                    <i class="el-icon-close button" @click="clickGoBack" />
                </div>
            </div>
            <div class="situation-panel">
                <div class="hbb-tableNoR" :class="isFutureToken && isFutureToken !== 'undefined' ? 'table-data-area table-data-areaYes': 'table-data-area table-data-areaNo'" @mouseleave="curRowIndex = -1">
                    <div v-show="contractTabIndex === 1" class="contract-table">
                        <el-table ref="mainContractList" :style="{maxHeight: isFutureToken && isFutureToken !== 'undefined' ? '390px': '800px'}" :max-height="tableHeight" :data="mainContractList" :class="isFutureToken && isFutureToken !== 'undefined' ? 'hbb-loginQ': 'hbb-loginNQ'" border
                                  width="100%"
                                  highlight-current-row
                                  @row-click="clickOnDataRow"
                                  @cell-mouse-enter="trHover"
                                  @cell-mouse-leave="curRowIndex = -1"
                        >
                            <el-table-column prop="date" label="序号" type="index" align="right">
                                <template slot="header">
                                    <span class="value">序号<i class="el-icon-bottom" /></span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="contractName" label="名称" align="right" />
                            <el-table-column prop="contractCode_text" label="合约代码"
                                             align="right"
                            />
                            <el-table-column prop="price" label="最新价" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.changeValue > 0,
                                        down: scope.row.changeValue < 0,
                                        top: scope.row.price >= scope.row.highLimited || scope.row.price <= scope.row.lowLimited
                                    }"
                                    >
                                        {{ scope.row.price }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="changeValue" label="涨跌" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0}"
                                    >
                                        {{ scope.row.changeValue.toFixed(2) }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="changeRate" label="涨跌幅" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value hbb-tr" :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }">
                                        {{ scope.row.changeRate }}%
                                        <div v-if="curRowIndex === scope.row.key" class="hbb-prop" :style="{left: left_pop + 'px', top: top_pop + 'px'}" @mouseleave="curRowIndex = -1">
                                            <span v-for="(item,ind) in rowPropup" :key="ind" @click.stop="addTrPopup(scope.row,item.id)">
                                                {{ item.text }}
                                            </span>
                                        </div>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bidPrice" label="买价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }"
                                    >
                                        {{ scope.row.bidPrice }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bidVolume" label="买量" width="55" align="right" />
                            <el-table-column prop="askPrice" label="卖价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }"
                                    >
                                        {{ scope.row.askPrice }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="askVolume" label="卖量" width="50" align="right" />
                            <el-table-column prop="high" label="最高价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.high - scope.row.preSettle > 0,
                                        down: scope.row.high - scope.row.preSettle < 0
                                    }"
                                    >
                                        {{ scope.row.high }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="low" label="最低价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.low - scope.row.preSettle > 0,
                                        down: scope.row.low - scope.row.preSettle < 0
                                    }"
                                    >
                                        {{ scope.row.low }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="volume" label="成交量" width="75" align="right" />
                            <el-table-column prop="position" label="持仓量" width="70" align="right" />
                            <el-table-column prop="highLimited" label="涨停" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value up">
                                        {{ scope.row.highLimited }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="lowLimited" label="跌停" width="70" align="right">
                                <template slot-scope="scope">
                                    <span class="value down">
                                        {{ scope.row.lowLimited }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="open" label="开盘价" width="70" align="right" />
                            <el-table-column prop="preClose" label="昨收价" width="70" align="right" />
                            <el-table-column prop="preSettle" label="昨结价" width="70" align="right" />
                            <!--                            <el-table-column prop="buyLeverage" label="多杠杆" width="55" align="right">-->
                            <!--                                <template slot-scope="scope">-->
                            <!--                                    <span class="value wihte">-->
                            <!--                                        {{ scope.row.buyLeverage }}-->
                            <!--                                    </span>-->
                            <!--                                </template>-->
                            <!--                            </el-table-column>-->
                            <!--                            <el-table-column prop="sellLeverage" label="空杠杆" width="55" align="right">-->
                            <!--                                <template slot-scope="scope">-->
                            <!--                                    <span class="value wihte">-->
                            <!--                                        {{ scope.row.sellLeverage }}-->
                            <!--                                    </span>-->
                            <!--                                </template>-->
                            <!--                            </el-table-column>-->
                            <el-table-column prop="sourceName" label="交易所" align="right" />
                        </el-table>
                    </div>
                    <div v-show="contractTabIndex === 0" class="contract-table">
                        <el-table :data="userContractList"
                                  :style="{maxHeight: isFutureToken && isFutureToken !== 'undefined' ? '390px': '800px'}"
                                  :max-height="tableHeight"
                                  :class="isFutureToken && isFutureToken !== 'undefined' ? 'hbb-loginQ': 'hbb-loginNQ'"
                                  border width="100%"
                                  @row-click="clickOnDataRow"
                                  @cell-mouse-enter="trHover"
                                  @cell-mouse-leave="curRowIndex = -1"

                        >
                            <el-table-column prop="date" label="序号" type="index" align="right">
                                <template slot="header">
                                    <span class="value">序号<i class="el-icon-bottom" /></span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="contractName" label="名称" align="right" />
                            <el-table-column prop="contractCode_text" label="合约代码"
                                             align="right"
                            />
                            <el-table-column prop="price" label="最新价" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.changeValue > 0,
                                        down: scope.row.changeValue < 0,
                                        top: scope.row.price >= scope.row.highLimited || scope.row.price <= scope.row.lowLimited
                                    }"
                                    >
                                        {{ scope.row.price }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="changeValue" label="涨跌" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0}"
                                    >
                                        {{ scope.row.changeValue }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="changeRate" label="涨跌幅" width="65" align="right">
                                <template slot-scope="scope">
                                    <span class="value hbb-tr" :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }">
                                        {{ scope.row.changeRate }}%
                                        <div v-if="curRowIndex === scope.row.key" class="hbb-prop" :style="{left: left_pop + 'px', top: top_pop + 'px'}">
                                            <span v-for="(item,ind) in rowPropup" :key="ind" @click.stop="addTrPopup(scope.row,item.id)">
                                                {{ item.text }}
                                            </span>
                                        </div>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bidPrice" label="买价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }"
                                    >
                                        {{ scope.row.bidPrice }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bidVolume" label="买量" width="55" align="right" />
                            <el-table-column prop="askPrice" label="卖价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value"
                                          :class="{up: scope.row.changeValue > 0,down: scope.row.changeValue < 0 }"
                                    >
                                        {{ scope.row.askPrice }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="askVolume" label="卖量" width="60px" align="right" />
                            <el-table-column prop="high" label="最高价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.high - scope.row.preSettle > 0,
                                        down: scope.row.high - scope.row.preSettle < 0
                                    }"
                                    >
                                        {{ scope.row.high }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="low" label="最低价" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value" :class="{
                                        up: scope.row.low - scope.row.preSettle > 0,
                                        down: scope.row.low - scope.row.preSettle < 0
                                    }"
                                    >
                                        {{ scope.row.low }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="volume" label="成交量" width="75" align="right" />
                            <el-table-column prop="position" label="持仓量" width="70" align="right" />
                            <el-table-column prop="highLimited" label="涨停" width="60" align="right">
                                <template slot-scope="scope">
                                    <span class="value up">
                                        {{ scope.row.highLimited }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="lowLimited" label="跌停" width="60px" align="right">
                                <template slot-scope="scope">
                                    <span class="value down">
                                        {{ scope.row.lowLimited }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="open" label="开盘价" width="70" align="right" />
                            <el-table-column prop="preClose" label="昨收价" width="70" align="right" />
                            <el-table-column prop="preSettle" label="昨结价" width="70" align="right" />
                            <!--                            <el-table-column prop="buyLeverage" label="多杠杆" width="55" align="right">-->
                            <!--                                <template slot-scope="scope">-->
                            <!--                                    <span class="value wihte">-->
                            <!--                                        {{ scope.row.buyLeverage }}-->
                            <!--                                    </span>-->
                            <!--                                </template>-->
                            <!--                            </el-table-column>-->
                            <!--                            <el-table-column prop="sellLeverage" label="空杠杆" width="55" align="right">-->
                            <!--                                <template slot-scope="scope">-->
                            <!--                                    <span class="value wihte">-->
                            <!--                                        {{ scope.row.sellLeverage }}-->
                            <!--                                    </span>-->
                            <!--                                </template>-->
                            <!--                            </el-table-column>-->
                            <el-table-column prop="sourceName" label="交易所" align="right" />
                        </el-table>
                    </div>
                    <div v-if="contractTabIndex === 2" class="contract-table">
                        <PositionView ref="positionView" mode="2" />
                    </div>
                </div>
                <div class="menus">
                    <div :class="{active: contractTabIndex === 1}" @click="clickOnContractTab(1)">
                        主力合约
                    </div>
                    <div :class="{active: contractTabIndex === 0}" @click="clickOnContractTab(0)">
                        自选
                    </div>
                    <div :class="{active: contractTabIndex === 2}" @click="clickOnContractTab(2)">
                        龙虎数据
                    </div>
                </div>
            </div>
            <div v-if="isFutureToken && isFutureToken !== 'undefined'" class="operate-area">
                <div class="part1">
                    <div class="wrap-menus">
                        <button :class="{ active: menuIconActiveIndex === 0 }" @click="clickMenuIcon(0)">
                            手动下单
                        </button>
                        <button :class="{ active: menuIconActiveIndex === 1 }" @click="clickMenuIcon(1)">
                            设置云条件单
                        </button>
                        <button :class="{ active: menuIconActiveIndex === 2 }" @click="clickMenuIcon(2)">
                            设置云止损单
                        </button>
                        <button :class="{ active: menuIconActiveIndex === 3 }" @click="clickMenuIcon(3)">
                            设置策略单
                        </button>
                    </div>
                    <div class="part-content">
                        <manual-order v-show="menuIconActiveIndex === 0" ref="manualOrder" />
                    </div>
                </div>
                <div class="part2">
                    <div class="wrap-menus">
                        <div class="hbb-wrap">
                            <button :class="{ active: menuIconActiveIndex1 === 0 }">
                                持仓
                            </button>
                            <div class="list">
                                <el-table
                                    class="hbb-table hbb-table1"
                                    :header-cell-style="{background:'#efefef'}"
                                    :data="positionData"
                                    border
                                    style="width: 100%;"
                                    @row-click="clickOnDataRow1"
                                >
                                    <el-table-column
                                        prop="codeName"
                                        label="合约名称"
                                        width="170"
                                    >
                                        <template slot-scope="scope">
                                            <span>
                                                {{ scope.row.codeName }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="side"
                                        label="多空类型"
                                        width="80"
                                    >
                                        <template slot-scope="scope">
                                            <span>
                                                {{ scope.row.side === 0? '买多': '卖空' }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="amount"
                                        label="持仓手数"
                                        width="80"
                                    />
                                    <el-table-column
                                        prop="canamount"
                                        label="可用手数"
                                        width="80"
                                    >
                                        <template slot-scope="scope">
                                            <span class="hbb-ping" @click.stop="pingClick(scope.row)">平</span>
                                            <span>{{ scope.row.canamount }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="持仓均价"
                                    />
                                    <el-table-column
                                        prop="newPrice"
                                        label="最新价格"
                                    />
                                    <el-table-column
                                        prop="positionProfit"
                                        label="持仓盈亏"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.positionProfit > 0" style="color:#ff3232">+{{ scope.row.positionProfit }}</span>
                                            <span v-else-if="scope.row.positionProfit < 0" style="color:#00e700">{{ scope.row.positionProfit }}</span>
                                            <span v-else>{{ scope.row.positionProfit }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div class="hbb-wrap hbb-wrap1">
                            <div>
                                <button v-for="(item,index) in rightWrapNav" :key="index" :class="{ active: rightWrapNavIndex === index }" @click="clickMenuIcon3(index)">
                                    {{ item.title }}
                                </button>
                            </div>

                            <div class="list">
                                <EntrustOrder v-show="rightWrapNavIndex === 0" ref="entrustOrderView" />
                                <DealOrder v-show="rightWrapNavIndex === 4" ref="dealOrderView" />
                            </div>

                            <!--筛选部分 => 委托订单-->
                            <div v-show="rightWrapNavIndex === 0" class="hbb-w-btn">
                                <el-radio-group v-model="entrustIndex" @change="entrustCheck">
                                    <el-radio v-for="(item,index) in entrust_order" :key="index" :label="index">
                                        {{ item.title }}
                                    </el-radio>
                                </el-radio-group>
                                <el-button type="danger" class="hbb-cheBtn" @click="allCheClick">
                                    一键撤单
                                </el-button>
                            </div>

                            <!--筛选部分 => 成交订单 => 暂时不做-->
                            <!--                            <div v-show="rightWrapNavIndex === 4" class="hbb-w-btn">-->
                            <!--                                <el-radio-group v-model="dealIndex" @change="dealCheck">-->
                            <!--                                    <el-radio v-for="(item,index) in deal_order" :key="index" :label="index">-->
                            <!--                                        {{ item.title }}-->
                            <!--                                    </el-radio>-->
                            <!--                                </el-radio-group>-->
                            <!--                            </div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--自选操作界面-->
        <PopupOperation v-if="operationVisible" ref="userSelectView" @closeEvent="clickClose" @success="successClick" />
        <!--F10 弹窗-->
        <PopupF10 ref="F10View" />
        <!--盘口 弹窗-->
        <PopupHandicap ref="handicaView" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { ContractDataSocket, TypeContractData} from '@common/src/future';
    import { bcadd, bcsub, bcmul, bcdiv } from '@common/src/utils/number';
    import Cookie from 'js-cookie';
    import ManualOrder from './manual_order.vue'; // 手动下单
    import EntrustOrder from './order/entrust_order.vue'; // 委托订单
    import DealOrder from './order/deal_order.vue'; // 成交订单
    import PopupOperation from './modal/popup_operation.vue'; // 自选合约
    import PopupF10 from './modal/popup_F10.vue'; // f10
    import PopupHandicap from './modal/popup_handicap.vue'; // 盘口
    import PositionView from './component/position_view.vue'; // 持仓数据分析视图
    import { postAsync } from '@/utils/request';

    interface TypeContractSelectOption {
        value: string,
        apiCode?: string,
        label: string,
        level: number
    }

    interface ShowContractData {
        idx: number; // 序号
        key: number; // 序号key
        apiCode: string; // 合约查询代码
        sourceName: string; // 交易所
        contractName: string; // 合约名
        contractCode: string; // 合约代码
        buyLeverage: number; // 多杠杆
        sellLeverage: number; // 空杠杆
        price: number, // 最新价
        changeValue: number, // 涨幅值
        changeRate: number, // 涨幅
        bidPrice: number, // 买价
        bidVolume: number, // 买量
        askPrice: number, // 卖价
        askVolume: number, // 卖量
        volume: number, // 成交量
        position: number, // 持仓量
        highLimited: number, // 涨停价
        lowLimited: number, // 跌停价
        open: number, // 开盘价
        preSettle: number, // 昨结算价
        preClose: number, // 昨收价
        high: number, // 最高价
        low: number // 最低价
    }

    interface positionData {
        code: string; // 合约名称
        side: number; // 多空类型
        amount: number; // 持仓手数
        canamount: number; // 可用手数
        price: number; // 持仓均价
        newPrice: number; // 最新价格
        positionProfit: number; // 持仓盈亏
    }

    const id = 0;
    let cachedSpeciesOptions: any[] = [];
    let mainSocketInstance: any = null;
    const manualDealSocketInstance: any = null;
    const manualDealContractCode: string = ''; // 保存的code
    let manualDealSocketPositionsInfo: any = null;
    let keepCoedsData: string[] = [];
    @Component({
        components: {
            ManualOrder,
            EntrustOrder,
            DealOrder,
            PopupOperation,
            PopupF10,
            PopupHandicap,
            PositionView
        },
        async asyncData() {
            let isLoginFutures = false; // 是否登录期货账号
            let nickName = '';
            let name = '';
            let futureCompanyName = '';
            const [err, resp] = await postAsync('/transIndex/queryFutureAccountInfo');
            if (resp?.code === '200006') {
                isLoginFutures = false;
            } else {
                isLoginFutures = true;
                if (resp?.data) {
                    nickName = resp.data.nikeName;
                    name = resp.data.name;
                    futureCompanyName = resp.data.futureCompanyName;
                }
            }

            return {
                isLoginFutures,
                nickName,
                name,
                futureCompanyName
            };
        }
    })
    export default class extends Vue {
        isLoginFutures = false; // 是否已经登录了期货公司
        nickName = ''; // 个人昵称
        name = ''; // 席位
        futureCompanyName = ''; // 期货公司

        contractTabIndex = 1 // 数据栏 0=自选 1=主力 默认=1
        mainContractList: ShowContractData[] = [];
        userContractList: ShowContractData[] = [];

        mainSocketLock = false; // socket锁
        userSocketLock = false; // socket锁

        menuIconActiveIndex = 0; // 左边部分的索引
        menuIconActiveIndex1 = 0; // 右边部分的索引

        value = '';
        options: Array<TypeContractSelectOption> = [];
        manualData = { // 手动下单的数据
            apiCode: '',
            contractName: '', // 名字
            price: '--', // 最新价
            changeValue: 0, // 涨跌值
            preClose: 0, // 昨天收
            changeRate: '--', // 最新价
            highLimited: '--', // 涨停价
            lowLimited: '--', // 跌停价
            bidPrice: '--', // 买价
            bidVolume: '--', // 买量
            askPrice: '--', // 卖价
            askVolume: '--', // 卖量
            available: '', // 可用资金
            canDraw: '' // 可提资金
        };

        positionData: positionData[] = []; // 持仓数据的列表

        rightWrapNav: any[] = [
            { title: '委托订单' },
            { title: '云条件单' },
            { title: '云损盈单' },
            { title: '云策略单' },
            { title: '成交订单' }
        ]; // 右边部分下方的导航list

        rightWrapNavIndex: number = 0; // 右边部分下方的导航索引

        queryOrderData:any[] = []; // 我的交易页面挂单委托成交

        operationVisible:boolean = false; // 确认下单弹层 是否启动

        entrust_order:any[] = [
            { title: '全部' },
            { title: '未成交' },
            { title: '已成交' },
            { title: '部分成交' },
            { title: '已取消' },
            { title: '部分取消' }

        ]; // 委托订单的状态筛选

        deal_order:any[] = [
            { title: '当天' },
            { title: '历史' }

        ]; // 成交订单的状态筛选

        entrustIndex:number = 0; // 委托订单当前筛选的状态
        // dealIndex:number = 0; // 委托订单当前筛选的状态

        isFutureToken:string = '1'; // 用户是否登录期货账户

        tableHeight:number = 390; // table的最大高度

        rowPropup:any[] = [

        ];

        curRowIndex:number = -1; // 鼠标经过当前行的索引
        left_pop: number = 0; // 弹框的x
        top_pop: number = 0; // 弹框的y
        tableScrollHeight:number = 230; // 持仓数据的滚动的范围

        created() {
        }

        mounted() {
            // hb 在没有登录期货公司的情况下放开某些模块
            // if (!this.isLoginFutures) {
            //     // alert('请先登录期货账号');
            // }
            this.isFutureToken = String(Cookie.get('futureToken'));
            this.$nextTick(() => {
                if (this.isFutureToken && this.isFutureToken !== 'undefined') {
                    this.tableHeight = 390;
                    this.tableScrollHeight = 230;
                } else {
                    this.tableHeight = 800;
                    this.tableScrollHeight = 650;
                }
            });

            // todo先注释掉
           this.getScoket();
            this.getSpeciesAndContractList();
            setTimeout(() => {
                this.getPositionData();
            }, 1200);
            setTimeout(() => {
                this.getQueryOrder();
            }, 2400);
        }

        getScoket() {
            // todo先注释掉
            mainSocketInstance = ContractDataSocket.getIdleDataSocket(this); // 获取
            mainSocketInstance.addListener(this.handleTickData);
            mainSocketInstance.connect(); // 连接
            Promise.all([
                this.getMainContractList(),
                this.getUserContractList(),
                this.initDataSocket()
            ]).then(() => {
                this.getTickData(); // 获取数据
            });
        }

       async initDataSocket() {
            /* 开启socket */
           const _this = this;
            manualDealSocketPositionsInfo = ContractDataSocket.getIdleDataSocket(this);
            manualDealSocketPositionsInfo.addListener((errCode: number, incomeData: any) => {
                if (JSON.stringify(incomeData) !== '{}') {
                    incomeData.forEach((x:any) => {
                        _this.positionData.filter((item:any) => {
                            return item.code === x.code;
                        }).forEach((y: any) => {
                            y.newPrice = Number(x.price);
                            y.positionProfit = Number(y.side) === 0 ? bcmul(bcmul(bcsub(y.newPrice, y.price), y.amount), String(y.contractsize)) : bcmul(bcmul(bcsub(y.price, y.newPrice), y.amount), y.contractsize);// 持仓盈亏
                        });
                    });
                }
            });
            await manualDealSocketPositionsInfo.connect();
        }

        async getSpeciesAndContractList() {
            const [err, resp] = await postAsync('/transIndex/querySpeciesAndContractList');
            if (resp?.code === '000000') {
                // 缓存一下
                cachedSpeciesOptions = (resp?.data || []).map((item: any) => {
                    return {
                        value: String(item.quotationSpeciesId),
                        label: String(item.speciesName),
                        level: 1
                    };
                });
                this.options = JSON.parse(JSON.stringify(cachedSpeciesOptions));
            }
        }

        async getMainContractList() {
            const [err, resp] = await postAsync('/transIndex/queryMainContract', {
                mainBody: 1
            });
            if (resp?.code === '200006') {
                this.isLoginFutures = false; // 是未登录状态
                return;
            }
            if (resp?.code === '000000') {
                const list = resp?.data?.list || [];
                this.mainContractList = list.map((item: any, idx: number) => {
                    return {
                        apiCode: item.apiCode,
                        key: idx,
                        sourceName: item.sourceName, // 交易所
                        contractName: !item.contractName.includes('.') ? item.contractName : this.subStrFn(String(item.contractName)), // 合约名
                        contractCode_text: !item.contractCode.includes('.') ? item.contractCode : this.subStrFn(String(item.contractCode)), // 合约代码
                        contractCode: item.contractCode, // 合约代码
                        buyLeverage: parseFloat(item.buyLeverage) || '0', // 多杠杆
                        sellLeverage: parseFloat(item.sellLeverage) || '0', // 空杠杆
                        bidPrice: 0, // 买价
                        bidVolume: 0, // 买量
                        askPrice: 0, // 卖价
                        askVolume: 0, // 卖量
                        price: 0, // 最新价
                        changeValue: 0, // 涨幅值
                        volume: 0, // 成交量
                        position: 0, // 持仓量
                        highLimited: 0, // 涨停价
                        lowLimited: 0, // 跌停价
                        open: 0, // 开盘价
                        preSettle: 0, // 昨结算价
                        preClose: 0, // 昨收价
                        high: 0, // 最高价
                        low: 0, // 最低价
                        quotationContractId: item.quotationContractId, // 合约id
                        sourceId: item.sourceId, // 交易所id
                        quotationSpeciesId: item.quotationSpeciesId, // 种类id
                        optional: item.optional // 是否在合约内
                    };
                });
            }
        }

        async getUserContractList() {
            const [err, resp] = await postAsync('/transIndex/queryUserContract');
            if (resp?.code === '200006') {
                this.isLoginFutures = false; // 是未登录状态
                return;
            }
            if (resp?.code === '000000') {
                const list = resp?.data?.list || [];
                this.userContractList = list.map((item: any, idx: number) => {
                    return {
                        apiCode: item.apiCode,
                        key: idx,
                        sourceName: item.sourceName, // 交易所
                        contractName: !item.contractName.includes('.') ? item.contractName : this.subStrFn(String(item.contractName)), // 合约名
                        contractCode_text: !item.contractCode.includes('.') ? item.contractCode : this.subStrFn(String(item.contractCode)), // 合约代码
                        contractCode: item.contractCode, // 合约代码
                        buyLeverage: parseFloat(item.buyLeverage) || '0', // 多杠杆
                        sellLeverage: parseFloat(item.sellLeverage) || '0', // 空杠杆
                        optional: item.optional, // 是否在合约内
                        sourceId: item.sourceId, // 交易所
                        quotationContractId: item.quotationContractId, // 合约id
                        quotationSpeciesId: item.quotationSpeciesId // 品种id
                    };
                });
            }
        }

        async getTickData() {
            const contractList: string[] = [];
            this.mainContractList.forEach((item: any) => {
                contractList.push(item.apiCode);
            });
            this.userContractList.forEach((item: any) => {
                contractList.push(item.apiCode);
            });
            mainSocketInstance.sendContractTickGroupMessage(contractList);
        }

        handleTickData(code: string, dataArr: TypeContractData[]) {
            if (dataArr && dataArr.length > 0) {
                for (let i = 0; i < dataArr.length; ++i) {
                    const item = dataArr[i];
                    // 查询列表里面对应的code，然后进行设置
                    for (let j = 0; j < this.mainContractList.length; ++j) {
                        const unit = this.mainContractList[j];
                        if (item.code === unit.apiCode) {
                            this.setTickData(unit, item);
                        }
                    }
                    for (let j = 0; j < this.userContractList.length; ++j) {
                        const unit = this.userContractList[j];
                        if (item.code === unit.apiCode) {
                            this.setTickData(unit, item);
                        }
                    }
                    // 更新手动下单里面的数据
                    if (this.manualData.apiCode && item.code === this.manualData.apiCode) {
                        (this.$refs.manualOrder as any).setManualTickData(item);
                    }
                }
                // 排序
                this.mainContractList.sort((a: any, b: any) => b.changeRate - a.changeRate);
                this.userContractList.sort((a: any, b: any) => b.changeRate - a.changeRate);
            }
        }

        setTickData(unit: any, item: TypeContractData) {
            console.log(item, 'scoket');
            unit.price = item.price; // 最新价
            unit.changeValue = item.changeValue; // 涨幅值
            unit.changeRate = item.changeRate || 0; // 涨幅幅度
            unit.volume = item.totalVolume; // 总成交量
            unit.position = item.position; // 持仓量
            unit.highLimited = item.highLimited; // 涨停价
            unit.lowLimited = item.lowLimited; // 跌停价
            unit.open = item.open; // 开盘价
            unit.preSettle = item.preSettle; // 昨结算价
            unit.preClose = item.preClose; // 昨收价

            unit.bidPrice = item.bidPrices?.[0]; // 买价
            unit.bidVolume = item.bidVolumes?.[0]; // 买量
            unit.askPrice = item.askPrices?.[0]; // 卖价
            unit.askVolume = item.askVolumes?.[0]; // 卖量

            unit.high = item.high; // 最高价
            unit.low = item.low; // 最低价
            unit.positionDelta = item.positionDelta; // 日增仓
            unit.prePosition = item.prePosition; // 日增仓 %
            unit.average = item.average; // 均价
            unit.settle = item.settle; // 结算价
            unit.insideVolume = item.insideVolume; // 内盘
            unit.outsideVolume = item.outsideVolume; // 外盘
            unit.totalVolume = item.totalVolume; // 外盘
        }

        clickMenuIcon(idx: number) {
            if (idx > 0) {
                this.$showToast('敬请期待！');
                return false;
            }
            this.menuIconActiveIndex = idx;
        }

        clickMenuIcon3(idx: number) {
            // 委托订单范围的点击
            // 硬代码 暂不开放 临时代码 20200622 => hbb
            if (idx % 4 !== 0) {
                this.$showToast('敬请期待！');
                return false;
            }
            this.rightWrapNavIndex = idx;
            switch (idx) {
                case 0:
                    (this.$refs.entrustOrderView as any).active(this.queryOrderData);
                    this.entrustIndex = 0;
                    break;
                case 4:
                    (this.$refs.dealOrderView as any).active(this.queryOrderData);
                    break;
            }
        }

        clickOnContractTab(idx: number) {
            // 主力合约和自选合约
            this.contractTabIndex = idx;
            // if (idx === 0) {
            //     this.$router.push({
            //         path: '/news/detail?id=6'
            //     });
            // }
        }

        clickOnDataRow(rowData: any, column: any, event: Event) {
            if (!this.isFutureToken || this.isFutureToken === 'undefined') {
                this.$showToast('您未登期货账号，请登陆！');
                return;
            }
            (this.$refs.mainContractList as any).setCurrentRow(rowData);
            (this.$refs.manualOrder as any).searchContractName(rowData.apiCode, rowData.contractName, rowData.contractCode);
            (this.$refs.manualOrder as any).searchLevel2ContractData(1, false, 1, rowData, 'up');
        }

        clickOnDataRow1(rowData: any, column: any, event: Event) {
            // 持仓点击
            (this.$refs.mainContractList as any).setCurrentRow(rowData);
            (this.$refs.manualOrder as any).searchContractName(rowData.apiCode, rowData.codeName, rowData.code);
            (this.$refs.manualOrder as any).searchLevel2ContractData(rowData.quotationContractId, false, 1, rowData, 'down');
        }

        async getPositionData() {
            // 获取持仓数据

            const [err, resp] = await postAsync('/transIndex/myPositionsInfo');
            if (resp?.code === '000000') {
                const list = resp?.data || [];
                this.positionData = list.map((item: any, idx: number) => {
                    return {
                        apiCode: String(item.apiCode),
                        code: String(item.code), // 合约代码
                        codeName: !item.codeName.includes('.') ? item.codeName : this.subStrFn(String(item.codeName)), // 合约名称
                        key: idx, // 索引
                        side: Number(item.side), // 多空类型
                        amount: Number(item.amount), // 持仓手数
                        canamount: Number(item.canamount), // 可用持仓手数
                        price: Number(item.price) || '0', // 持仓均价
                        newPrice: this.manualData.price, // 合约最新价
                        quotationContractId: Number(item.quotationContractId),
                        positionProfit: '', // 持仓盈亏
                        contractsize: item.contractsize
                    };
                });

                // 通过socket去获取列表的最新价格
                keepCoedsData = this.positionData.filter((item: any) => !!item.code).map((item: any) => item.code);
                keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
                if (keepCoedsData.length > 0) {
                    manualDealSocketPositionsInfo.sendContractTickGroupMessage(keepCoedsData); // 发送数据
                }
            }
        }

        async getQueryOrder() {
            const [err, resp] = await postAsync('/transIndex/queryOrder');
            if (resp?.code === '000000') {
                const list = resp?.data?.data || [];
                this.queryOrderData = list;
                // 默认展示第一个tab的数据
                (this.$refs.entrustOrderView as any).active(this.queryOrderData);
            }
        }

        clickAddUserSelect() {
            // 自选操作界面 启动
            this.operationVisible = true;
            this.$nextTick(() => {
                (this.$refs.userSelectView as any).active();
            });
        }

        clickClose() {
            // 自选操作界面 关闭
            this.operationVisible = false;
        }

        successClick() {
            // 确认选择成功
            this.operationVisible = false;
            // 重新拉取自主合约
            this.getUserContractList();
        }

        entrustCheck(val:any) {
            // 进行筛选委托订单
            this.entrustIndex = Number(val);
            (this.$refs.entrustOrderView as any).screenFn(this.entrustIndex);
        }

        // dealCheck(val:any) {
        //     // 进行筛选委托订单
        //     this.dealIndex = Number(val);
        //     (this.$refs.dealOrderView as any).screen(this.dealIndex);
        // }

        pingClick(row:any) {
            // 点击持仓列表的平字触发的事件
            (this.$refs.manualOrder as any).pingClickFn(row);
        }

        allCheClick() {
            // 点击一键撤单
            const arr = this.queryOrderData.filter((x:any) => x.status === 0 || x.status === 1 || x.status === 2);
            (this.$refs.manualOrder as any).allCheClickFn(arr, 3);
        }

        clickGoBack() {
            // 点击返回上一页 登录下单大师情况下的我的账户
            this.$router.push({
                path: '/account/deal'
            });
        }

        subStrFn(str:string) {
            // 截取字符串
            const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
            return strLast;
        }

        trHover(row:any, column:any, cell:any, event:any) {
            event.stopPropagation();
            this.curRowIndex = row.key;
            const rowPdata = [
                { id: 1, text: '加自选' },
                { id: 3, text: 'F10' },
                { id: 4, text: '盘口' },
                { id: 5, text: '龙虎数据' }
            ];
            const rowPdata1 = [
                { id: 2, text: '删自选' },
                { id: 3, text: 'F10' },
                { id: 4, text: '盘口' },
                { id: 5, text: '龙虎数据' }
            ];
            if (row.optional === 1) {
                this.rowPropup = rowPdata1;
            }
            if (row.optional === 0) {
                this.rowPropup = rowPdata;
            }
            this.left_pop = event.pageX;
            this.top_pop = event.pageY - 5;
        }

        addTrPopup(row:any, type:number) {
            switch (type) {
                case 1:
                    this.addContractUserFn(row.quotationContractId);
                    break;
                case 2:
                    this.deleteContractUserFn(row.quotationContractId);
                    break;
                case 3:
                    (this.$refs.F10View as any).active(row);
                    break;
                case 4:
                    (this.$refs.handicaView as any).active(row);
                    break;
                case 5:
                    this.contractTabIndex = 2;
                    this.$nextTick(() => {
                        (this.$refs.positionView as any).setData(row);
                    });
                    break;
                default:
                    break;
            }
        }

        async addContractUserFn(id:number) {
            const requestData = {
                quotationContractId: id
            };
            const [err, resp] = await postAsync('/quotation/addContractUser', requestData);
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '添加成功'
                });
                this.getScoket();
            } else {
                this.$message({
                    type: 'error',
                    message: '请求失败'
                });
            }
        }

        async deleteContractUserFn(id:number) {
            const requestData = {
                quotationContractId: id
            };
            const [err, resp] = await postAsync('/quotation/deleteContractUser', requestData);
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                this.getScoket();
            } else {
                this.$message({
                    type: 'error',
                    message: '请求失败'
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/business/deal";
    .hbb-loginQ{
        height:400px;
    }
    .hbb-loginNQ{
        height: 800px;
        overflow: auto;
    }
    .table-data-areaYes{
        height:380px  !important;
    }
    .table-data-areaNo{
        height: 800px !important;
    }
    .hbb-qNo{
        background: #44A9FF;
        color: #fff;
        padding: 3px 8px;
        font-size: 13px;
        margin-left: 5px;
        cursor: pointer;
    }
    .hbb-tr{
        .hbb-prop{
            position: fixed;
            z-index: 99;
            top: 28px;
            left: 100px;
            width: 90px;
            background: #333;
            border: 2px solid #ff2f2f;
            border-radius: 5px;
            span {
                float: left;
                width: 100%;
                height: 28px;
                border-bottom: 1px solid #fff;
                color: #ff0;
                font-size: 12px;
                text-align: center;
                line-height: 28px;
                &:last-child{
                    border-bottom:0;
                }
            }
        }
    }
</style>
