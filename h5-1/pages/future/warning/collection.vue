<template>
    <div>
        <tk-nav-bar>
            我的预警
            <template slot="right">
                <div class="right-icons">
                    <nuxt-link class="menu-icon" to="/future/warning/trigger">
                        <img src="https://rs.tanxingk.com/images/small_icon_caution_trans.png" alt="">
                    </nuxt-link>
                    <nuxt-link class="menu-icon" to="/future/setting/warning">
                        <img src="https://rs.tanxingk.com/images/small_icon_add_noborder.png" alt="">
                    </nuxt-link>
                </div>
            </template>
        </tk-nav-bar>
        <div class="warning-bar-wrap">
            <div class="warning-tab">
                <div>
                    <div class="l1 sp">
                        {{ contractName }}
                    </div>
                    <div class="l2">
                        {{ contractCode }}
                    </div>
                </div>
                <div>
                    <div class="l1">
                        最新
                    </div>
                    <div class="l2" :class="isUp ? 'up' : 'down'">
                        {{ price }}
                    </div>
                </div>
                <div>
                    <div class="l1">
                        涨跌幅度
                    </div>
                    <div class="l2" :class="isUp ? 'up' : 'down'">
                        {{ raiseRate }}
                    </div>
                </div>
            </div>
            <div class="warning-bar clearfix">
                <div>序号</div>
                <div>预警条件</div>
                <div>创建时间</div>
            </div>
        </div>

        <div class="container">
            <div>
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                              @init="mescrollInit"
                >
                    <div v-if="dataLoaded && dataList.length > 0" class="warning-list">
                        <van-cell-group>
                            <div v-for="(item,idx) in dataList" :key="idx" :class="{'show-func': item.isFold}">
                                <div @touchstart="touchStart(idx, $event)" @touchmove="touchMove(idx, $event)"
                                     @touchend="touchEnd(idx, $event)"
                                >
                                    <van-cell>
                                        <template #title>
                                            <div class="custom-title">
                                                {{ idx + 1 }}
                                            </div>
                                        </template>
                                        <template>
                                            <div class="part1">
                                                <span class="desc-text">{{ item.warnCondition }}</span>
                                            </div>
                                            <div class="part2 time-part">
                                                <div>{{ item.createTime2 }}</div>
                                                <div>{{ item.createTime1 }}</div>
                                            </div>
                                        </template>
                                    </van-cell>
                                </div>
                                <div class="function-line" @click.stop="">
                                    <div>
                                        <div class="item pause" @click.stop="clickPause(idx)">
                                            <img v-show="item.state === 2"
                                                 src="https://rs.tanxingk.com/images/small_icon_run.png"
                                                 alt="" class="icon"
                                            >
                                            <img v-show="item.state === 0"
                                                 src="https://rs.tanxingk.com/images/small_icon_pause.png" alt=""
                                                 class="icon"
                                            >
                                            {{ item.state === 2 ? '启动' : '暂停' }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="item modify" @click.stop="clickModify(idx)">
                                            <img src="https://rs.tanxingk.com/images/small_icon_edit.png" alt=""
                                                 class="icon"
                                            >
                                            修改
                                        </div>
                                    </div>
                                    <div>
                                        <div class="item delete" @click.stop="clickDelete(idx)">
                                            <img src="https://rs.tanxingk.com/images/small_icon_delete.png" alt=""
                                                 class="icon"
                                            >
                                            删除
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-cell-group>
                    </div>
                    <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                        <div class="icon">
                            暂无数据
                        </div>
                    </div>
                </mescroll-vue>
            </div>
            <div class="warn-bottom-tip">
                <p class="title">
                    提示：
                </p>
                <p class="other">
                    首次提醒：一次性提醒，预警后会删除此预警单
                </p>
            </div>

            <div v-show="showModifyPanel" class="warning-modify-mask" @click="clickOnMaskScreen" />
            <div v-show="showModifyPanel" class="warning-modify-panel">
                <p class="title">
                    修改预警
                </p>
                <div class="func-area">
                    <div class="text1">
                        {{ modifyTitle }}
                    </div>
                    <div>
                        <input ref="modifyInput" v-model.trim="modifyText" type="tel" maxlength="8">
                    </div>
                    <div>
                        <van-button type="primary" @click="clickSaveModify">
                            确定
                        </van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { ContractDataSocket, EnumContractDataKey, getSituationData } from '@common/src/future';
    import {getAsync, postAsync} from '@/utils/request';
    import dataListMixins from '@/mixins/dataListMixins';

    let dataSocketInstance: any = null;
    @Component({
        middleware: 'auth',
        async asyncData() {
        }
    })
    export default class extends dataListMixins {
        keepModifyIndex = -1;
        showModifyPanel = false;
        modifyTitle = '';
        modifyText = '';

        apiCode = '';
        price = '--';
        isUp = false;
        raiseRate = '--';
        contractName = '--';
        contractCode = '--';

        async mounted() {
            this.$showLoading();
            await this.getContract();
            await this.getData(1);
            this.$closeLoading();
            this.getSocketData();
        }

        beforeDestroy() {
            // if (dataSocketInstance) {
            //     /* 退订 */
            //     dataSocketInstance.sendCancelContractTickMessage(this.apiCode);
            //     dataSocketInstance.destroy();
            // }
            window.clearTimeout(this.timeOutEvent);// 清除定时器
            this.timeOutEvent = 0;
        }

        async getContract() {
            const [_, resp] = await getAsync('/warn/getWarnIndex', {
                quotationContractId: this.$route.query.id
            });
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                this.contractName = data.contractName || '--';
                this.contractCode = data.contractCode || '--';
                this.apiCode = data.apiCode || '--';
            }
        }

        async getData(page: number) {
            const [_, resp] = await getAsync('/warn/getSetWarnListPage', {
                quotationContractId: this.$route.query.id,
                page
            });
            // console.log(resp?.data);
            console.log('page:', page);
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        id: String(item.preWarnId),
                        quotationContractId: String(item.quotationContractId),
                        contractCode: item.contractCode,
                        contractName: item.contractName,
                        condition: item.condition,
                        isFold: false,
                        warnValue: item.warnValue,
                        state: +item.state,
                        createTime1: (item.createTime || '').split(' ')?.[0],
                        createTime2: (item.createTime || '').split(' ')?.[1],
                        warnCondition: item.warnCondition
                    });
                });

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(list);
                this.handleRefresh(true, data.totalPage > data.pageNo);
            } else {
                this.handleRefresh(false);
            }
        }

        async getSocketData() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener(this.handleSituationData);
            const results = await dataSocketInstance.connect();
            if (results?.[1]) {
                dataSocketInstance.sendContractTickMessage(this.apiCode);
            }
        }

        timeOutEvent = 0;
        touchX = 0;
        touchY = 0;
        touchStart(idx: number, ev:any) {
            this.touchX = ev.touches?.[0]?.pageX;
            this.touchY = ev.touches?.[0]?.pageY;
            window.clearTimeout(this.timeOutEvent);// 清除定时器
            this.timeOutEvent = window.setTimeout(() => {
                this.openFolder(idx);
            }, 200);// 这里设置定时
        }

        touchEnd(idx: number) {
            if (this.timeOutEvent) { // 说明是点击事件
                // 相当于点击事件
                this.clickOnFolder(idx);
            }
            clearTimeout(this.timeOutEvent);
        }

        touchMove(idx:number, ev: any) {
            const touchX = ev.touches?.[0]?.pageX;
            const touchY = ev.touches?.[0]?.pageY;
            if (Math.abs(this.touchX - touchX) > 10 || Math.abs(this.touchY - touchY) > 10) {
                console.log('timeout, move 移動超出範圍');
                window.clearTimeout(this.timeOutEvent);// 清除定时器
                this.timeOutEvent = 0;
            }
        }

        openFolder(idx: number) {
            this.dataList.forEach((item: any, index: number) => {
                if (index === idx) {
                    item.isFold = !item.isFold;
                } else {
                    item.isFold = false;
                }
            });
            this.timeOutEvent = 0;
        }

        clickOnFolder(idx: number) {
            let flag = false;
            this.dataList.forEach((item: any, index: number) => {
                if (item.isFold) {
                    flag = true;
                }
                item.isFold = false;
            });
        }

        /* 暂停 */
        async clickPause(idx: number) {
            this.$showLoading('处理中...');
            const obj = this.dataList[idx];
            const [_, resp] = await postAsync('/warn/stopPreWarn', {
                preWarnId: obj.id,
                state: obj.state === 0 ? 2 : 0
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast(`${obj.state === 2 ? '启动' : '暂停'}成功`);
                obj.state = obj.state === 0 ? 2 : 0;
            } else {
                this.$showToast('操作失败');
            }
        }

        /* 修改 */
        clickModify(idx: number) {
            this.keepModifyIndex = idx;
            this.showModifyPanel = true;
            this.modifyText = this.dataList[idx].warnValue;
            this.modifyTitle = this.dataList[idx].condition;
            setTimeout(() => {
                (this.$refs.modifyInput as HTMLInputElement).focus();
            }, 0);
        }

        async clickSaveModify() {
            // 校验数据
            if (!this.modifyText) {
                this.$showToast('请输入');
                return;
            }
            if (isNaN(Number(this.modifyText))) {
                this.$showToast('请输入数字');
                return;
            }

            this.$showLoading('处理中...');
            const obj = this.dataList[this.keepModifyIndex];
            if (!obj) {
                return;
            }
            const [_, resp] = await postAsync('/warn/updatePreWarn', {
                preWarnId: obj.id,
                warnValue: this.modifyText
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                this.showModifyPanel = false;
            } else {
                this.$showToast('修改失败');
            }
        }

        clickOnMaskScreen() {
            (this.$refs.modifyInput as HTMLInputElement).blur();
            this.showModifyPanel = false;
        }

        /* 删除 */
        async clickDelete(idx: number) {
            try {
                const resp = await this.$showMessageBox('温馨提示', '是否删除该预警设置', '取消', '确定');
            } catch (e) {
                return;
            }
            this.$showLoading('处理中...');
            const obj = this.dataList[idx];
            const [_, resp] = await postAsync('/warn/deletePreWarn', {
                preWarnId: obj.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('删除成功');
                this.$delete(this.dataList, idx);
            } else {
                this.$showToast('删除失败');
            }
        }

        handleSituationData(errCode: number, data: any) {
            const showData: any = data;
            if (showData) {
                this.price = showData[EnumContractDataKey.price] || '--';
                this.raiseRate = showData[EnumContractDataKey.changeRate];
                this.raiseRate = !this.raiseRate || this.raiseRate === 'NaN' ? '--' : this.raiseRate + '%';
                this.isUp = showData[EnumContractDataKey.changeValue] >= 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        min-height: 100vh;

        .mescroll {
            top: calc(#{$nav-height} + 190px);
            padding-bottom: 150px;
        }
    }

    .show-func .function-line {
        height: 80px;
        transition: all .2s;
        touch-action: none;
        user-select: none;
    }

    .van-cell{
        @include border-bottom();
    }
</style>
