<!--k豆列表-->
<template>
    <div>
        <tk-nav-bar>
            K豆通知
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="kcoin-message-block">
                        <p class="time">
                            {{ item.time }}
                        </p>
                        <div class="body" @click="clickOnMessage(item.id)">
                            <div class="head">
                                <img src="https://rs.tanxingk.com/images/logo_ico40.png" alt="" class="icon">
                                <span class="item">购买K豆</span>
                                <span class="value">{{ item.count }}</span>
                            </div>
                            <div class="content">
                                <div class="line">
                                    <div>支付金额: {{ item.amount | money }}元</div>
                                    <div>K豆入账: {{ item.beanAccountEnter }}</div>
                                </div>
                                <div class="line">
                                    <div>支付方式: {{ item.payType }}</div>
                                    <div>奖励K豆: {{ item.beanReward }}</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                    <div class="icon">
                        暂无记录
                    </div>
                </div>
            </mescroll-vue>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import dataListMixins from '@/mixins/dataListMixins';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth'
    })
    export default class extends dataListMixins {
        mounted() {
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/beanProductCtrl/queryMyKBeanMessageNotice', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        id: item.beanOrderId + '',
                        time: item.createTime, //
                        amount: item.amount, //
                        beanAccountEnter: item.beanAccountEnter, //
                        count: item.count,
                        payType: item.payType,
                        beanReward: item.beanReward
                    });
                });

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(list);
                this.handleRefresh(true, false);
            } else {
                this.handleRefresh(false);
            }
        }

        clickOnMessage(id: string) {
            // todo 暂时不能点击
            // window.location.href = '/message/kcoin_detail?id=' + id;
        }
    }
</script>

<style lang="scss" scoped>
    .kcoin-message-block{
        .time{
            text-align: center;
            font-size: 25px;
            padding: 22px 0;
            color: #999;
        }
        .body{
            background-color: #fff;
            border-radius: 6px;
            margin: 0 20px;
            padding: 20px;
            .head{
                display: flex;
                position: relative;
                padding-bottom: 20px;
                @include thinBorder();
                .icon{
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    margin-right: 15px;
                    align-items: center;
                }
                >span{
                    line-height: 1;
                    font-size: 36px;
                    align-items: center;
                }
                .value{
                    color: $color-main;
                    margin-left: 20px;
                }
            }
            .content{

                .line{
                    display: flex;
                    padding-top: 20px;
                    >div{
                        flex: 1;
                        font-size: 26px;
                        color: #666;
                    }
                }
            }
        }
    }
</style>
