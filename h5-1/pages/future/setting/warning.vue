<!--预警设置-->
<template>
    <div>
        <tk-nav-bar>
            预警设置
        </tk-nav-bar>
        <div class="container">
            <div class="group-section">
                <van-cell-group>
                    <van-cell title="选择合约" is-link>
                        <template>
                            <span @click="clickContract">{{ contractName }}</span>
                        </template>
                    </van-cell>
                    <van-cell class="data-cell">
                        <template #title>
                            <span>最新价格</span>
                            <span class="color" :class="marketPriceIsDown ? 'down' : 'up'">{{ marketPrice }}</span>
                        </template>
                        <template>
                            <span>持仓成本</span>
                            <span class="color">{{ price }}</span>
                        </template>
                    </van-cell>
                </van-cell-group>
            </div>

            <div class="group-section">
                <van-cell-group>
                    <van-field v-model.trim="maxValue" type="number" label="价格上限" placeholder="请输入" maxlength="7" />
                </van-cell-group>
                <van-cell-group>
                    <van-field v-model.trim="minValue" type="number" label="价格下限" placeholder="请输入" maxlength="7" />
                </van-cell-group>
            </div>

            <div class="group-section">
                <van-cell-group>
                    <van-field v-model.trim="maxPercent" type="number" label="涨幅上限" placeholder="请输入" maxlength="7">
                        <template #button>
                            %
                        </template>
                    </van-field>
                </van-cell-group>
                <van-cell-group>
                    <van-field v-model.trim="minPercent" type="number" label="涨幅下限" placeholder="请输入" maxlength="7">
                        <template #button>
                            %
                        </template>
                    </van-field>
                </van-cell-group>
            </div>

            <div class="theme-button-wrap">
                <van-button type="primary" class="theme-button" @click="clickSave">
                    确定添加
                </van-button>
                <p class="warning-text">
                    该预警永久有效，触发后停止不再预警
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { ContractDataSocket, EnumContractDataKey } from '@common/src/future';
    import {getAsync, postAsync} from '@/utils/request';

    let dataSocketInstance: any = null;

    @Component({
        middleware: 'auth',
        async asyncData({route}) {
            const [_, resp] = await getAsync('/warn/getWarnIndex', {
                quotationContractId: route.query.id
            });
            let contractName = ''; // 合约名
            let price = ''; // 持仓成本
            let apiCode = '';
            if (resp?.code === '000000') {
                console.log(resp?.data);
                const data = resp.data || {};
                contractName = data.contractName || '';
                apiCode = data.apiCode || '';
                price = data.price || '--';
            }
            return {
                contractName, // 合约名
                apiCode, // 合约名
                price // 持仓成本
            };
        }
    })
    export default class extends Vue {
        contractName = '';
        price = '';
        marketPrice = '';
        marketPriceIsDown = false; // 是否下跌

        maxPercent = ''; // 涨幅上限
        minPercent = ''; // 涨幅下限
        maxValue = ''; // 价格上限
        minValue = ''; // 价格下限

        apiCode = ''; // code码

        async mounted() {
            // console.log(this.contractName);
            await this.getSocketData();
        }

        async clickSave() {
            // 条件判断
            const maxPercent = Number(this.maxPercent);
            const minPercent = Number(this.minPercent);
            const maxValue = Number(this.maxValue);
            const minValue = Number(this.minValue);
            if (!this.maxPercent && !this.minPercent && !this.maxValue && !this.minValue) {
                this.$showToast('请至少输入一个数据');
                return;
            }
            if (isNaN(maxPercent) || isNaN(minPercent) || isNaN(maxValue) || isNaN(minValue)) {
                this.$showToast('请输入数字');
                return;
            }
            if (this.maxValue && this.marketPrice && maxValue < Number(this.marketPrice)) {
                this.$showToast('价格上限不能小于最新价格');
                return;
            }
            if (this.minValue && this.marketPrice && minValue > Number(this.marketPrice)) {
                this.$showToast('价格下限不能大于最新价格');
                return;
            }
            /* abc */
            this.$showLoading();
            const [_, resp] = await postAsync('/warn/addPreWarn', {
                quotationContractId: this.$route.query.id,
                maxPercent: this.maxPercent, // 涨幅上限
                minPercent: this.minPercent, // 涨幅下限
                maxValue: this.maxValue, // 价格上限
                minValue: this.minValue // 价格下限
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                this.maxValue = '';
                this.minValue = '';
                this.maxPercent = '';
                this.minPercent = '';
                this.$router.push({
                    path: '/future/warning'
                });
            } else {
                this.$showToast('添加失败');
            }
        }

        clickContract() {
            this.$router.push({
                path: '/future/situation/search',
                query: {
                    to: encodeURIComponent(location.pathname)
                }
            });
        }

        beforeDestroy() {
            this.stopSocketData();
        }

        async getSocketData() {
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                this.handleSituationData(incomeData);
            });
            const results = await dataSocketInstance.connect();
            /* 合并code查询 */
            if (results?.[1]) {
                dataSocketInstance.sendContractTickMessage(this.apiCode);
            }
        }

        handleSituationData(data: any) {
            this.marketPrice = data[EnumContractDataKey.price] || '';
            this.marketPriceIsDown = data[EnumContractDataKey.changeValue] < 0;
        }

        stopSocketData() {
            dataSocketInstance = null;
        }
    }
</script>

<style lang="scss" scoped>
    .theme-button-wrap {
        padding: 0 55px;

        .theme-button {
            margin-top: 60px;
        }

        .warning-text {
            margin-top: 20px;
            color: #FF4338;
            font-size: 24px;
        }
    }

    .van-cell:not(:last-child)::after {
        left: 0;
    }

    /deep/ .van-cell {
        padding: 30px 30px;

        .van-cell__title {
            height: 40px;

            > span {
                line-height: 40px;
                font-size: 30px;
                color: #333;
            }

            .color.up {
                color: $color-up;
            }

            .color.down {
                color: $color-down;
            }
        }

        &.data-cell {
            .van-cell__value {
                text-align: left;

                > span {
                    font-size: 26px;
                    color: #666;
                }
            }

            .van-cell__title > span {
                font-size: 26px;
                color: #666;
                text-align: left;
            }
        }

        .van-cell__value {
            height: 40px;

            > span {
                line-height: 40px;
                font-size: 30px;
            }
        }
    }

    .van-cell__right-icon {
        line-height: 40px;
        font-size: 20px;
    }

    /deep/ .van-cell-group {
        // margin-bottom: 20px;
    }

    /deep/ .van-field__label {
        width: 120px;
    }

    /deep/ .van-field__body {
        height: 40px;

        .van-field__control {
            padding-left: 40px;
            font-size: 32px;
        }
    }

    /deep/ .van-field {
    }

    /deep/ .van-field__button {
        font-size: 30px;
        color: #333;
    }

    .group-section {
        margin-bottom: 20px;
    }
</style>
