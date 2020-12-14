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
            <div class="warning-bar clearfix">
                <div>合约名称</div>
                <div>预警条件</div>
                <div>创建时间</div>
            </div>
        </div>
        <div class="container">
            <div>
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                              @init="mescrollInit"
                >
                    <div v-if="dataLoaded && dataList.length > 0">
                        <van-cell-group>
                            <div v-for="(item,idx) in dataList" :key="idx" class="cell-wrap" :class="{'show-func': item.isFold}">
                                <div @touchstart="touchStart(idx, $event)" @touchmove="touchMove(idx,$event)" @touchend="touchEnd(idx)">
                                    <van-cell is-link>
                                        <template #title>
                                            <div class="custom-title">
                                                {{ item.contractName }}
                                            </div>
                                        </template>
                                        <template #label>
                                            <div class="custom-label">
                                                {{ item.contractCode }}
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
    import {getAsync, postAsync} from '@/utils/request';
    import dataListMixins from '@/mixins/dataListMixins';

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

        async mounted() {
            this.$showLoading();
            await this.getData(1);
            this.$closeLoading();
        }

        beforeDestroy() {
            window.clearTimeout(this.timeOutEvent);// 清除定时器
            this.timeOutEvent = 0;
        }

        async getData(page: number) {
            const [_, resp] = await getAsync('/warn/getSetWarnListPage', {
                userId: 1,
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
            if (!flag) {
                this.$router.push({
                    path: '/future/warning/collection',
                    query: {
                        id: this.dataList[idx].quotationContractId
                    }
                });
            }
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
               console.log(resp);
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
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        min-height: 100vh;
        padding-bottom: 100px;
        .mescroll {
            top: calc(#{$nav-height} + 70px);
            padding-bottom: 150px;
        }
    }

    .warning-list {
        li {
            height: 110px;
            background-color: #fff;
            padding: 30px;
        }
    }

    .van-cell-group{

    }

    /deep/ .van-cell {
        padding: 30px;
        user-select: none;
        /*display: flex;*/
        align-items: center;

        .van-cell__title {
            width: $width-1;
            flex: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .van-cell__value {

            text-align: left;
            flex: auto;
            display: flex;

            > div {
                &:first-child {
                    width: 65%;
                    font-size: 24px;
                    color: #333;
                    display: flex;
                    align-items: center;

                    .desc-text {
                        font-size: 24px;
                        line-height: 40px;
                        display: inline-block;
                    }
                }

                &:last-child {
                    width: 35%;
                }
            }
        }

        .custom-title {
            font-size: 28px;
            width: 100%;
            color: #333;
            display: inline-block;
            padding-bottom: 4px;
        }

        .van-cell__label {
            width: 100%;
            text-align: left;
        }

        .custom-label {
            font-size: 24px
        }

        .time-part {
            display: flex;
            justify-content: right;
            flex-direction: column;
            text-align: right;

            > div {
                color: #666;
                font-size: 24px;

                &:first-child {
                    margin-bottom: 10px;
                }
            }
        }

        .van-cell__right-icon {
            /*display: flex;*/
            /*flex-direction: column;*/
            /*justify-content: center;*/
            /*!*align-items: center;*!*/
            /*height: 100%;*/
        }
    }

    .function-line {
        background-color: #f6f6f6;
        transition: all .3s;
        overflow: hidden;
        display: flex;
        flex: 1;
        padding: 0 20px;
        height: 0;

        > div {
            flex: 1;
            text-align: center;
        }

        .item {
            user-select: none;
            margin: 0 auto;
            width: 150px;
            line-height: 80px;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            font-size: 28px;
            color: #666;

            .icon {
                user-select: none;
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
    }

    .show-func .function-line {
        height: 80px;
        transition: all .2s;
    }

    .cell-wrap{
        position: relative;
        @include border-bottom(#ccc);
    }
</style>
