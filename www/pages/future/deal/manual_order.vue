<template>
    <div class="manual-deal">
        <div class="top-part" style="cursor: pointer">
            <div>
                <div class="menu-line">
                    <span class="title-cap">合约</span>
                    <el-select
                        ref="contractSearchSelect"
                        v-model="value"
                        clearable
                        :filterable="true"
                        style="width: 150px;margin-right: 5px"
                        placeholder="输入/选择合约"
                        :filter-method="onContractSearchChange"
                        @change="onContractSelectChange"
                        @focus="onContractSearchFocus"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-button class="btn-tb" @click="hedgeTypeClick">
                        <span>{{ hedgeType === '1'? '套保': '投机' }}</span>
                    </el-button>
                </div>
                <div class="menu-line" style="display: flex;justify-content: flex-end">
<!--                    <span class="title-cap" />-->
                    <span style="width: 100px" @click="textClick(manualData.highLimited)">涨停：<span class="up">
                        {{ manualData.highLimited }}
                    </span></span>
                    <span style="padding-left: 0px" @click="textClick(manualData.lowLimited)">跌停：<span class="down">
                        {{ manualData.lowLimited }}
                    </span></span>
                </div>
                <div ref="pricePopup" class="menu-line">
                    <span class="title-cap">价格</span>
                    <div class="title-input">
                        <span @click="priceReduce(1)">-</span>
                        <el-input v-if="Number(priceVal_text)" v-model="priceVal" class="hbb-input" placeholder="最新价" style="width: 100px;" @input="priceInput" @focus="pricePopupFous" />
                        <el-input v-else v-model="priceVal_text" class="hbb-input" placeholder="最新价" style="width: 100px;" @input="priceInput" @focus="pricePopupFous" />
                        <span @click="priceAdd(1)">+</span>
                        <!--弹层部分-->
                        <div v-show="pricePopupState" class="hbb-popup">
                            <PopupPrice ref="popupPriceView" @selectEvent="selectPrice" @clearEvent="clearPrice" @addEvent="priceAdd" @reduceEvent="priceReduce" @otherEvent="priceOther" />
                        </div>
                    </div>
                </div>
                <div ref="handsPopup" class="menu-line">
                    <span class="title-cap">手数</span>
                    <div class="title-input">
                        <span @click="priceReduce(2)">-</span>
                        <el-input v-model="handsVal" class="hbb-input" placeholder="请输入手数" style="width: 100px;" @input="priceInput" @focus="handsPopupFous" />
                        <span @click="priceAdd(2)">+</span>
                        <!--弹层部分-->
                        <div v-show="handsPopupState" class="hbb-popup">
                            <PopupHands @selectEvent="selectHands" />
                        </div>
                    </div>
                </div>
                <div class="menu-line">
                    <span class="title-cap" />
                    <span v-if="priceVal || handsVal">预计保证金: {{ expectedMargin || 0 }}</span>
                    <span v-else>预计保证金: --</span>
                </div>
            </div>
            <div class="times-right"
                 :class="manualData.changeValue > 0 ? 'up' : manualData.changeValue < 0 ? 'down' : ''"
            >
                <div class="now-value">
                    <span @click="textClick(manualData.price)">新：<span class="value">{{ manualData.price }}</span></span>
                    <span class="value">
                        {{ manualData.changeRate }}%
                    </span>
                </div>
                <div class="now-value">
                    <span @click="textClick(manualData.bidPrice)">买：<span class="buysell"
                                                                          :class="manualData.bidPrice > manualData.preClose ? 'up'
                                                                              : manualData.bidPrice < manualData.preClose ? 'down' : ''"
                    >{{ manualData.bidPrice }}</span>
                    </span>
                    <span>{{ manualData.bidVolume }}</span>
                </div>
                <div class="now-value border-bottom">
                    <span @click="textClick(manualData.askPrice)">卖：<span class="buysell"
                                                                          :class="manualData.askPrice > manualData.preClose ? 'up'
                                                                              : manualData.askPrice < manualData.preClose ? 'down' : ''"
                    >{{ manualData.askPrice }}</span></span>
                    <span>{{ manualData.askVolume }}</span>
                </div>
                <div class="money-value">
                    <p class="title">
                        可用资金/元
                    </p>
                    <p class="number">
                        {{ manualData.available | money }}
                    </p>
                </div>
                <div class="money-value">
                    <p class="title">
                        可提资金/元
                    </p>
                    <p class="number">
                        {{ manualData.canDraw | money }}
                    </p>
                </div>
            </div>
        </div>
        <div class="operate-section">
            <div>
                <div class="btn buy" @click="clickManualDealBuy">
                    <div v-if="manualData.apiCode">
                        <div v-if="priceVal">
                            <span v-show="priceType === 0">{{ priceVal }}</span>
                            <span v-show="priceType === 1">{{ manualData.price }}</span>
                            <span v-show="priceType === 2">{{ manualData.askPrice }}</span>
                            <span v-show="priceType === 3">{{ manualData.highLimited }}</span>
                            <span v-show="priceType === 4">{{ manualData.bidPrice }}</span>
                        </div>
                        <div v-else>
                            <span>--</span>
                        </div>
                    </div>
                    <p>买多</p>
                </div>
                <div v-if="manualData.apiCode" class="amount">
                    可开约：<span v-if="buyCountObj.buycount > 0" class="color">{{ buyCountObj.buycount || 0 }}手</span>
                    <span v-else>--</span>
                </div>
            </div>
            <div>
                <div class="btn sell" @click="clickManualDealSell">
                    <p v-if="manualData.apiCode">
                        <template v-if="priceVal">
                            <span v-if="priceType === 0">{{ priceVal }}</span>
                            <span v-if="priceType === 1">{{ manualData.price }}</span>
                            <span v-if="priceType === 2">{{ manualData.bidPrice }}</span>
                            <span v-if="priceType === 3">{{ manualData.lowLimited }}</span>
                            <span v-if="priceType === 4">{{ manualData.askPrice }}</span>
                        </template>
                        <template v-else>
                            <span>--</span>
                        </template>
                    </p>
                    <p>卖空</p>
                </div>
                <div v-if="manualData.apiCode" class="amount">
                    可开约：<span v-if="buyCountObj.salecount > 0" class="color">{{ buyCountObj.salecount || 0 }}手</span>
                    <span v-else>--</span>
                </div>
            </div>
            <div>
                <div class="btn ping" :class="isHavePosition ? '' : 'noBg'" @click="clickManualDealFlat">
                    <p v-if="manualData.apiCode">
                        <template v-if="isHavePosition">
                            <template v-if="priceVal">
                                <span v-show="priceType === 0">{{ priceVal }}</span>
                                <span v-show="priceType === 1">{{ manualData.price }}</span>
                                <span v-show="priceType === 2 && havePositionData.side === 0">{{ manualData.bidPrice }}</span>
                                <span v-show="priceType === 2 && havePositionData.side === 1">{{ manualData.askPrice }}</span>
                                <span v-show="priceType === 3 && havePositionData.side === 0">{{ manualData.lowLimited }}</span>
                                <span v-show="priceType === 3 && havePositionData.side === 1">{{ manualData.highLimited }}</span>
                                <span v-show="priceType === 4 && havePositionData.side === 0">{{ manualData.askPrice }}</span>
                                <span v-show="priceType === 4 && havePositionData.side === 1">{{ manualData.bidPrice }}</span>
                            </template>
                            <template v-else>
                                <span>--</span>
                            </template>
                        </template>
                        <template v-else>
                            <!--根据上期所定义-->
                            <span v-if="isLastPeriod">优先平今</span>
                            <span v-else>先开先平</span>
                        </template>
                    </p>
                    <p v-if="isHavePosition && havePositionData.side === 0">
                        平多
                    </p>
                    <p v-if="isHavePosition && havePositionData.side === 1">
                        平空
                    </p>
                    <p v-if="!isHavePosition">
                        平仓
                    </p>
                </div>
                <div v-if="manualData.apiCode" class="amount">
                    可平仓：<span v-if="isHavePosition" class="color">{{ havePositionData && havePositionData.amount }}手</span>
                    <span v-else>-</span>
                </div>
            </div>
        </div>
        <!--确认下单弹层-->
        <OrderSure ref="orderSureView" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import { ContractDataSocket, TypeContractData } from '@common/src/future';
    import { bcadd, bcsub, bcmul, bcdiv } from '@common/src/utils/number';
    import debugModule from '@root/fushui-admin/src/router/modules/debugModule';
    import PopupPrice from './modal/popup_price.vue'; // 键盘价格弹层
    import PopupHands from './modal/popup_hands.vue'; // 手数弹层
    import OrderSure from './modal/order_sure.vue'; // 确认下单弹层
    import { postAsync } from '@/utils/request';

    interface TypeContractSelectOption {
        value: string,
        apiCode?: string,
        contractCode: String,
        label: string,
        level: number
    }

    const id = 0;
    let cachedSpeciesOptions: any[] = [];
    const mainSocketInstance: any = null;
    let manualDealSocketInstance: any = null;
    let manualDealContractCode: string = ''; // 保存的code

    @Component({ components: { PopupPrice, PopupHands, OrderSure } })
    export default class ManualOrder extends Vue {
        value = ''; // 选择合约
        options: Array<TypeContractSelectOption> = [];
        manualData = { // 手动下单的数据
            apiCode: '',
            contractName: '', // 名字
            price: '--', // 最新价
            changeValue: 0, // 涨跌幅
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

        priceVal: string = ''; // 价格
        priceVal_text: string = ''; // 中文展示
        pricePopupState: Boolean = false; // 选择价格弹层  是否启动
        handsVal: string = ''; // 手数
        handsPopupState: Boolean = false; // 选择手数弹层  是否启动
        contractParamsJson:any = {
            ticksize: Number, // 加减单位
            contractsize: Number // 手数单位
        }; // 通过json数据取得所需数据

        buyCountObj:any = {
            ableUseMoney: Number, // 可用资金
            buyLeverage: Number, // 可买杠杆
            buycount: Number, // 可买手数
            equity: Number, // 权益
            salecount: Number, // 可卖手数
            sellLeverage: Number // 卖出杠杆
        }; // 通过json数据取得所需数据

        contractType:number = 1; // 便于点击+或者-

       show_data:any = {
            code: String,
            codeName: String,
            originOrder: String,
            price: String,
            hands: String,
            priceType: String,
            side: String,
            hedgeType: String,
            orderOpera: String,
            securityDeposit: Number
        } // 确认下单的数据源

        isHavePosition:Boolean = false; // 该合约代码是否有持仓
        isLastPeriod:Boolean = false; // 该合约代码是否为上期所
        havePositionData = {}; // 该合约在持仓数据内的信息
        priceType: number = 0; // 点击价格键盘的 左边快捷价格类型0:自定义价格 1：最新价 2：对手价 3：市价 4：排队价

        timer:any = null; // 防抖函数

        priceTypeO: string = '0'; // 价格类型0限价单1市价单 => 用于确认下单参数桥梁
        hedgeType: string = '2'; // 0 // 套保 1 // 投机2 // 套利

        orderApiCode: string = ''; // 进行下单的合约代码
        orderApiName: string = ''; // 进行下单的合约名称
        expectedMargin: any = 0; // 预计保证金

        currentRow:any = ''; // 选中当前行的数据存储起来方便做业务判断

        mounted() {
            this.searchContractOption();
            this.getFundInfo();
            // 点击指定元素区域以外的区域执行特定的代码
            const _this = this;
            document.addEventListener('click', function(e) {
                if (!(_this.$refs.pricePopup as any).contains(e.target)) {
                    _this.pricePopupState = false;
                }
                if (!(_this.$refs.handsPopup as any).contains(e.target)) {
                    _this.handsPopupState = false;
                }
            });
        }

        async onContractSearchChange(value: string) {
            await this.searchLevel2ContractData(value, false, 2, {}, '');
        }

        async onContractSearchFocus() {
            if (this.value === '') {
                this.options = JSON.parse(JSON.stringify(cachedSpeciesOptions));
            }
        }

        async getFundInfo() {
            const [err, resp] = await postAsync('/transIndex/myFundInfo');
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                // available
                // canDraw
                this.manualData.available = data.available;
                this.manualData.canDraw = data.canDraw;
            }
        }

       async onContractSelectChange(value: string) {
            if (!value) {
                // 是空的，空的就把数据给拿掉
                this.setManualTickData();
                return;
            }
            const find:any = this.options.find((item: any) => item.value === value); ;
            if (!find) {
                return;
            }
            if (find.level === 1) { // 行情
                this.searchLevel2ContractData(value, true, 2, {}, '');
            } else if (find.level === 2) {
                this.manualData.apiCode = find.apiCode;
                // 选中了 并且判断选择的合约是否在持仓列表中
                // 默认展示1手
                this.orderApiCode = String(find.contractCode);
                this.orderApiName = find.label;
                this.handsVal = '1';
                setTimeout(() => {
                    this.priceVal = String(this.manualData.price);
                    this.priceVal_text = '最新价';
                    this.getPriceFn(this.contractParamsJson.contractsize, 1, true);
                }, 500);

                const isHave = (this.$parent as any).positionData.filter((x:any) => x.apiCode === find.apiCode);

                if (isHave.length > 0) {
                    this.havePositionData = isHave[0];
                    this.isHavePosition = true;
                } else {
                    this.isHavePosition = false;
                }
                // 判断是否为上期所 包含【SHFE】为上期所 则：相反
                if (find.contractCode.includes('SHFE')) {
                    this.isLastPeriod = true;
                } else {
                    this.isLastPeriod = false;
                }
                this.getManualTickData();
            }
        }

        async searchLevel2ContractData(value: number | string, resetSelect: boolean, type:number, codeApi:any, position:string) {
            if (!value) {
                return;
            }
            // type === 1 专门处理持仓联动
            if (type === 1) {
                const isHave = (this.$parent as any).positionData.filter((x:any) => {
                    return (x.apiCode === codeApi.apiCode);
                });
                // 用于展示下方的3个按钮 不设置就不会跟着webscoket动
                this.priceType = 1;
                if (isHave.length > 0) {
                    this.havePositionData = isHave.length === 1 ? isHave[0] : position === 'up' ? isHave[0] : isHave[codeApi.side];
                    this.isHavePosition = true;
                } else {
                    this.isHavePosition = false;
                }
                this.currentRow = codeApi; // 拷贝
                // 判断是否为上期所 包含【SHFE】为上期所 则：相反
                if (codeApi.code.includes('SHFE')) {
                    this.isLastPeriod = true;
                } else {
                    this.isLastPeriod = false;
                }
                // this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
            }
            // 获取搜索结果, 只能搜索合约
            const [err, resp] = await postAsync('/transIndex/querySpeciesAndContractList', {
                speciesId: value
            });

            if (resp?.code === '000000') {
                this.options = (resp?.data || []).map((item: any) => {
                    return {
                        value: String(item.contractId),
                        apiCode: String(item.apiCode),
                        contractCode: String(item.contractCode),
                        label: String(item.contractName),
                        level: 2
                    };
                });
                if (resetSelect) {
                    (this.$refs.contractSearchSelect as any).blur(); // 先blur
                    (this.$refs.contractSearchSelect as any).focus(); // 再弹出
                }
            } else {
                this.options = [];
            }
        }

        /* 搜索获取合约信息 */
        async searchContractOption(codeOrName?: string, type?: number/* 1=种类 2=合约 */) {
            const data: any = {};
            let mlevel = 1;
            if (type === 1) {
                data.speciesId = codeOrName;
            } else if (type === 2) {
                data.contractName = codeOrName;
                mlevel = 2;
            }
            const [err, resp] = await postAsync('/transIndex/querySpeciesAndContractList', data);
            if (resp?.code === '000000') {
                if (mlevel === 1) {
                    cachedSpeciesOptions = (resp?.data || []).map((item: any) => {
                        return {
                            value: String(item.quotationSpeciesId),
                            label: String(item.speciesName),
                            level: 1
                        };
                    });
                    this.options = JSON.parse(JSON.stringify(cachedSpeciesOptions));
                } else {
                    this.options = (resp?.data || []).map((item: any) => {
                        return {
                            value: String(item.contractId),
                            apiCode: String(item.apiCode),
                            contractCode: String(item.contractCode),
                            label: String(item.contractName),
                            level: 2
                        };
                    });
                }
            } else {
                this.options = [];
            }
        }

        /* 设置手动下单栏的一些tick数据 */
        setManualTickData(data?: TypeContractData) {
            if (!data) {
                this.manualData.price = '--'; // 最新价
                this.manualData.changeValue = 0; // 涨跌幅
                this.manualData.preClose = 0; // 昨收
                this.manualData.changeRate = '--'; // 最新价
                this.manualData.highLimited = '--'; // 涨停价
                this.manualData.lowLimited = '--'; // 跌停价
                this.manualData.bidPrice = '--'; // 买价
                this.manualData.bidVolume = '--'; // 买量
                this.manualData.askPrice = '--'; // 卖价
                this.manualData.askVolume = '--'; // 卖量
            }
            if (data?.code !== this.manualData.apiCode) {
                return;
            }
            this.manualData.price = String(data?.price || '--'); // 最新价
            this.manualData.changeValue = data?.changeRate || 0; // 最新价
            this.manualData.preClose = data?.preClose || 0; // 昨收
            this.manualData.changeRate = String(data?.changeRate || '--'); // 最新价
            this.manualData.highLimited = String(data?.highLimited || '--'); // 涨停价
            this.manualData.lowLimited = String(data?.lowLimited || '--'); // 跌停价
            this.manualData.bidPrice = String(data?.bidPrices?.[0] || '--'); // 买价
            this.manualData.bidVolume = String(data?.bidVolumes?.[0] || '--'); // 买量
            this.manualData.askPrice = String(data?.askPrices?.[0] || '--'); // 卖价
            this.manualData.askVolume = String(data?.askVolumes?.[0] || '--'); // 卖量
        }

        /* 设置手动下单栏的一些tick数据 */
        async getManualTickData() {
            if (!this.manualData.apiCode) {
                return;
            }
            if (this.manualData.apiCode === manualDealContractCode) {
                // 无变化
                return;
            }

            // 重新开一个socket去取
            if (!manualDealSocketInstance) {
                manualDealSocketInstance = ContractDataSocket.getIdleDataSocket(this); // 获取
                manualDealSocketInstance.addListener((code: string, incomeData: TypeContractData) => {
                    console.log('ttc', incomeData);
                    if (!incomeData || !incomeData.code) {
                        return;
                    }
                    this.setManualTickData(incomeData);
                });
                await manualDealSocketInstance.connect(); // 连接
            }
            manualDealSocketInstance.sendCancelContractTickMessage(manualDealContractCode); // 先取消上一个
            manualDealSocketInstance.sendContractTickMessage(this.manualData.apiCode);
            manualDealContractCode = this.manualData.apiCode;
            this.getContractParams(this.manualData.apiCode);
        }

        async getContractParams(code:any) {
            // 取得json内所需要的数据
            const [err, resp] = await postAsync('/quotation/getContractParams', { apiCode: code });
            if (resp?.code === '000000') {
                this.contractParamsJson = resp?.data;
                (this.$refs.popupPriceView as any).setSize(this.contractParamsJson.ticksize);
            }
        }

        clickManualDealBuy() {
            // 启动弹层 买多
            // 买多  卖多  平仓点击判断上方的输入框是否都已经输入
            if (Number(this.expectedMargin) > Number(this.manualData.available)) {
                this.$showToast('资金不足');
                return false;
            }
            const val = this.ManualDealFudge();
            if (val) {
                if (Number(this.priceVal) < Number(this.manualData.lowLimited)) {
                    this.$showToast('委托价不能低于跌停价');
                    return false;
                }
                if (Number(this.priceVal) > Number(this.manualData.highLimited)) {
                    this.$showToast('委托价不能高于涨停价');
                    return false;
                }
                if ((Number(this.priceVal) % Number(this.contractParamsJson.ticksize)) !== 0) {
                    this.$showToast('委托价不符合最小单位的整数倍');
                    return false;
                }
                // 判断是否在交易时间之内
                const val1 = this.ManualDealTime();
                if (val1) {
                    const requestObj = this.AssemblyData(1);
                    (this.$refs.orderSureView as any).active(requestObj, 1, 1);
                } else {
                    this.$showToast('当前非交易时段，无法操作');
                    return false;
                }
            }
        }

        clickManualDealSell() {
            // 启动弹层 买空
            // 买多  卖多  平仓点击判断上方的输入框是否都已经输入
            if (Number(this.expectedMargin) > Number(this.manualData.available)) {
                this.$showToast('资金不足');
                return false;
            }
            const val = this.ManualDealFudge();
            if (val) {
                if (Number(this.priceVal) < Number(this.manualData.lowLimited)) {
                    this.$showToast('委托价不能低于跌停价');
                    return false;
                }
                if (Number(this.priceVal) > Number(this.manualData.highLimited)) {
                    this.$showToast('委托价不能高于涨停价');
                    return false;
                }
                if ((Number(this.priceVal) % Number(this.contractParamsJson.ticksize)) !== 0) {
                    this.$showToast('委托价不符合最小单位的整数倍');
                    return false;
                }
                // 判断是否在交易时间之内
                const val2 = this.ManualDealTime();
                if (val2) {
                    const requestObj = this.AssemblyData(2);
                    (this.$refs.orderSureView as any).active(requestObj, 1, 1);
                } else {
                    this.$showToast('当前非交易时段，无法操作');
                    return false;
                }
            }
        }

        clickManualDealFlat() {
            // 启动弹层 平仓
            const val = this.ManualDealFudge();
            if (val) {
                // 判断当前合约持仓为0，并且平仓手数是否大于可平仓手数
                const curHands = Number((this.havePositionData as any).amount);
                if (curHands > 0) {
                    if (Number(this.handsVal) > curHands) {
                        this.$showToast('合约可平数量不足，请重新输入！');
                        return false;
                    } else {
                        if (Number(this.priceVal) < Number(this.manualData.lowLimited)) {
                            this.$showToast('委托价不能低于跌停价');
                            return false;
                        }
                        if (Number(this.priceVal) > Number(this.manualData.highLimited)) {
                            this.$showToast('委托价不能高于涨停价');
                            return false;
                        }
                        if ((Number(this.priceVal) % Number(this.contractParamsJson.ticksize)) !== 0) {
                            this.$showToast('委托价不符合最小单位的整数倍');
                            return false;
                        }
                        // 判断是否在交易时间之内
                        const val3 = this.ManualDealTime();
                        if (val3) {
                            const requestObj = this.AssemblyData(3);
                            (this.$refs.orderSureView as any).active(requestObj, 1, 2);
                        } else {
                            this.$showToast('当前非交易时段，无法操作');
                            return false;
                        }
                    }
                } else {
                    this.$showToast('当前合约无可持仓');
                    return false;
                }
            }
        }

        async ManualDealTime() {
            // 判断是否在交易时间内
            const [err, resp] = await postAsync('/transIndex/queryTransactionTime', { apiCode: this.manualData.apiCode });
            if (resp?.code === '000000') {
                return true;
            } else {
                return false;
            }
        }

        ManualDealFudge() {
            const errorArr = [];
            if (this.manualData.apiCode === '') { errorArr.push('请选择合约'); }
            if (this.priceVal === '') { errorArr.push('请输入价格'); }
            if (this.priceVal_text === '') { errorArr.push('请输入价格'); }
            if (this.handsVal === '') { errorArr.push('请输入手数'); }
            if (errorArr.length > 0) {
                this.$showToast(errorArr.join(','));
                return false;
            } else {
                return true;
            }
        }

        AssemblyData(type:number) {
            this.show_data.code = this.orderApiCode;
            this.show_data.codeName = this.orderApiName;
            this.show_data.originOrder = type;
            this.show_data.price = this.priceVal;
            this.show_data.amount = this.handsVal;
            this.show_data.side = type === 3 ? String(this.currentRow.side) : type === 1 ? '0' : '1';
            this.show_data.priceType = this.priceTypeO;
            this.show_data.hedgeType = this.hedgeType;
            this.show_data.orderOpera = type === 1 || type === 2 ? '1' : '2';
            // this.show_data.orderOpera = type === 1 || type === 2 ? '1' : this.isHavePosition ? '2' : '3';
            this.show_data.securityDeposit = ((Number(this.handsVal) * Number(this.priceVal) * this.contractParamsJson.contractsize)) / this.buyCountObj.buyLeverage;
            return this.show_data;
        }

        async searchContractName(code: string, name: string, contractCode: string) {
            await this.searchContractOption(name, 2); // 获取该数据
            this.priceVal_text = '最新价';
            if (this.options.length > 0) {
                const find = this.options.find((item: any) => code === item.apiCode);
                if (find) {
                    this.$nextTick(() => {
                        this.handsVal = '1';
                        this.orderApiCode = String(find.contractCode);
                        this.orderApiName = find.label;
                        setTimeout(() => {
                            this.priceVal = String(this.manualData.price);
                            this.getPriceFn(this.contractParamsJson.contractsize, 1, true);
                        }, 500);
                        this.orderApiCode = contractCode;
                        this.value = !String(find.value).includes('.') ? String(find.value) : this.subStrFn(String(find.value));
                        this.manualData.apiCode = find?.apiCode || '';
                        this.getManualTickData();
                    });
                }
            }
        }

        pricePopupFous() {
            // 启动价格的键盘弹层
            if (!this.manualData.apiCode) {
                this.$showToast('请选择合约');
                return false;
            }
            this.pricePopupState = true;
        }

        handsPopupFous() {
            // 启动手数的键盘弹层
            if (!this.manualData.apiCode) {
                this.$showToast('请选择合约');
                return false;
            }
            if (!this.priceVal) {
                this.$showToast('请输入价格');
                return false;
            }

            this.handsPopupState = true;
        }

        selectPrice(val:any) {
            // 点击数字单元格
            if (!this.manualData.apiCode) {
                this.$showToast('请选择合约');
                return false;
            }
            if (this.priceVal_text === '' || this.priceVal_text === '最新价' || this.priceVal_text === '对手价' || this.priceVal_text === '市价' || this.priceVal_text === '排队价') {
                this.priceVal_text = String(val.title);
                this.priceVal = '';
            }
            this.priceVal += String(val.title);
            this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
        }

        clearPrice() {
            // 清楚input内的价格
            this.priceVal = '';
            this.priceVal_text = this.priceVal;
        }

        priceAdd(t:number) {
            // 点击+ t:1: 点击价格 2: 手数
            clearInterval(this.timer);
            this.timer = setTimeout(() => {
                if (!this.manualData.apiCode) {
                    this.$showToast('请选择合约');
                    return false;
                }
                if (this.priceVal === '') {
                    this.priceVal += this.contractParamsJson.ticksize;
                    this.priceVal_text = this.priceVal;
                } else {
                    let cur;
                    this.contractType = 0;
                    this.priceType = 0;
                    switch (t) {
                        case 1:
                            cur = Number(this.priceVal);
                            cur += this.contractParamsJson.ticksize;
                            this.priceVal = String(cur);
                            this.priceVal_text = this.priceVal;
                            this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
                            break;
                        case 2:
                            cur = Number(this.handsVal);
                            cur++;
                            this.handsVal = String(cur);
                            this.expectedMargin = Number(bcdiv(bcmul(bcmul(this.handsVal, this.priceVal), this.contractParamsJson.contractsize), this.buyCountObj.buyLeverage)).toFixed(2);
                            // this.getPriceFn(this.contractType, 2, false);
                            break;
                    }
                }
            }, 500);
        }

        priceReduce(t:number) {
            clearInterval(this.timer);
            this.timer = setTimeout(() => {
                // 点击- t:1: 点击价格 2: 手数
                if (!this.manualData.apiCode) {
                    this.$showToast('请选择合约');
                    return false;
                }
                this.priceType = 0;
                let cur;
                if (t === 1) {
                    cur = Number(this.priceVal);
                    cur -= this.contractParamsJson.ticksize;
                    this.priceVal_text = this.priceVal;
                    if (cur <= 0) {
                        this.priceVal = '';
                    } else {
                        this.priceVal = String(cur);
                        this.priceVal_text = this.priceVal;
                        this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
                    }
                } else {
                    this.contractType = 0;
                    cur = Number(this.handsVal);
                    cur--;
                    if (cur <= 0) {
                        this.handsVal = '';
                    } else {
                        this.handsVal = String(cur);
                        // this.getPriceFn(this.contractType, 2, false);
                    }
                    this.expectedMargin = Number(bcdiv(bcmul(bcmul(this.handsVal, this.priceVal), this.contractParamsJson.contractsize), this.buyCountObj.buyLeverage)).toFixed(2);
                }
            }, 500);
        }

        priceOther(item:any) {
            // 点击除了 x + - 数字的区域 快捷操作
            if (!this.manualData.apiCode) {
                this.$showToast('请选择合约');
                return false;
            }
            switch (item.type) {
                case 1:
                    // 最新价
                    this.priceVal = String(this.manualData.price);
                    this.priceVal_text = '最新价';
                    this.priceType = 1;
                    this.priceTypeO = '0';
                    break;
                case 3:
                    // 对手价
                    this.priceVal = String(this.manualData.askPrice);
                    this.priceType = 2;
                    this.priceTypeO = '0';
                    this.priceVal_text = '对手价';
                    break;
                case 5:
                    // 市价
                    this.priceVal = String(this.manualData.highLimited);
                    this.priceType = 3;
                    this.priceTypeO = '1';
                    this.priceVal_text = '市价';
                    break;
                case 7:
                    // 排队价
                    this.priceVal = String(this.manualData.bidPrice);
                    this.priceType = 4;
                    this.priceTypeO = '0';
                    this.priceVal_text = '排队价';
                    break;
                case 8:
                    // 确认
                    this.priceType = 0;
                    this.priceTypeO = '0';
                    break;
                default:
                    break;
            }
            this.pricePopupState = false;
            this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
        }

        async getPriceFn(v:number, t:number, isInit: Boolean) {
            // 通过点击单元格进行去数据 t:1: 点击价格 2: 手数
            // const request_data = {
            //     code: this.selfContractCode, // 合约代码
            //     price: this.priceVal,  // 价格
            //     side: '',
            //     position: isInit ? '' : this.contractParamsJson.contractsize,
            //     unit: v
            // };

            const request_data = {
                code: this.orderApiCode, // 合约代码
                price: this.priceVal, // 价格
                side: '',
                position: isInit ? '' : v,
                unit: this.contractParamsJson.contractsize
            };
            this.expectedMargin = '正在计算中...';
            const [err, resp] = await postAsync('/transIndex/getCanBuyCount', request_data);
            if (resp?.code === '000000') {
                this.buyCountObj = resp?.data;
                this.expectedMargin = Number(bcdiv(bcmul(bcmul(this.handsVal, this.priceVal), this.contractParamsJson.contractsize), this.buyCountObj.buyLeverage)).toFixed(2);
                if (t === 2) {
                    this.handsVal = this.buyCountObj.buycount;
                } else {
                    return false;
                }
            } else {
                this.$showToast(String(resp?.message));
            }
        }

        selectHands(item:any) {
            // 点击手数 除了仓以外的单元格
            this.handsPopupState = false;
            if (!this.manualData.apiCode) {
                this.$showToast('请选择合约');
                return false;
            }
            if (!this.priceVal) {
                this.$showToast('请输入价格');
                return false;
            }
            if (item.type === 0) {
                this.handsVal = item.title;
                this.contractType = 0;
            } else {
                if (this.isHavePosition) {
                    const lastVal = (this.havePositionData as any).amount / item.type;
                    switch (item.type) {
                        case 1:
                            this.handsVal = (this.havePositionData as any).amount;
                            break;
                        case 2:
                            this.handsVal = String(parseInt(String(lastVal)));
                            break;
                        case 4:
                            this.handsVal = String(parseInt(String(lastVal)));
                            break;
                        default:
                            break;
                    }
                } else {
                    this.handsVal = '0';
                }
                this.contractType = item.type;
            }
            this.expectedMargin = Number(bcdiv(bcmul(bcmul(this.handsVal, this.priceVal), this.contractParamsJson.contractsize), this.buyCountObj.buyLeverage)).toFixed(2);
            // this.getPriceFn(this.contractType, 2, false);
        }

        priceInput(val:any) {
            // 输入价格的时候
            this.priceType = 0;
        }

        hedgeTypeClick() {
            // 投机、套保切换
            if (this.hedgeType === '1') {
                this.hedgeType = '2';
            } else {
                this.hedgeType = '1';
            }
        }

        pingClickFn(row:any) {
            // 点击父元素的平字触发的事件
            this.show_data.code = row.code;
            this.show_data.codeName = row.codeName;
            this.show_data.originOrder = 3;
            this.show_data.originOrder_text = '平仓';
            this.show_data.price = row.newPrice;
            this.show_data.amount = row.canamount;
            this.show_data.side = String(row.side);
            this.show_data.priceType = '0';
            this.show_data.hedgeType = 1;
            this.show_data.securityDeposit = 0;
            this.show_data.orderOpera = '2';
            (this.$refs.orderSureView as any).active(this.show_data, 1, 3);
        }

        allCheClickFn(arr:any, type:number) {
            // 点击一键撤单
            (this.$refs.orderSureView as any).active(arr, type);
        }

        subStrFn(str:string) {
            // 截取字符串
            const strLast = str.replace(str.substring(str.lastIndexOf('.')), '');
            return strLast;
        }

        textClick(v:any) {
            // 点击文字去赋值
            this.priceVal_text = v;
            this.priceVal = v;
            this.priceType = 0;
            this.getPriceFn(this.contractParamsJson.contractsize, 1, false);
        }
    }
</script>

<style lang="scss">
    @import "@/assets/style/business/deal";
</style >
