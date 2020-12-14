<template>
    <div class="hbb-guide-page">
        <div class="hbb-guide-box">
            <div class="top">
                <span>今日6只新股，1只新债可申购</span>
                <span @click="goDetail">打新须知</span>
            </div>
            <div class="bottom">
                <van-tabs v-model="guideCurrent" @click="guideClick">
                    <van-tab
                        v-for="(item, index) in navList"
                        :key="index"
                        :title="item.title"
                    >
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="content">
            <NewSharesView v-if="guideCurrent === 0"></NewSharesView>
            <NewSharesDateView v-if="guideCurrent === 2"></NewSharesDateView>
            <NewDebtView v-if="guideCurrent === 1"></NewDebtView>
            <NewDebtDateView v-if="guideCurrent === 3"></NewDebtDateView>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NewSharesView from './guideDetail/newShares.vue';
    import NewSharesDateView from './guideDetail/newSharesDate.vue';
    import NewDebtView from './guideDetail/newDebt.vue';
    import NewDebtDateView from './guideDetail/newDebtDate.vue';

    @Component({
        components:{
            NewSharesView,
            NewSharesDateView,
            NewDebtView,
            NewDebtDateView
        }
    })
    export default class extends Vue {
        guideCurrent = 0;
        navList:any[] = [
            {
                id:1,
                title: '新股新购'
            },
            {
                id:2,
                title: '新债申购'
            },
            {
                id:3,
                title: '新股日历'
            },
            {
                id:4,
                title: '新债日历'
            }
        ];

        guideClick(name:any, title:any) {
            this.guideCurrent = name;
        }

        goDetail() {
            this.$router.push({
                path: '/home/guideDetail'
            })
        }
    }
</script>

<style lang="scss">
    .hbb-guide-page{
        .hbb-guide-box{
            display: flex;
            width: 100%;
            height: 170px;
            background: #ff2c27;
            flex-direction: column;
            border-bottom: 2px solid #eee;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            .top{
                display: flex;
                width: 100%;
                justify-content:space-between;
                align-items: center;
                padding: 0 30px;
                height: 90px;
                font-size: 24px;
                color: #fff;
                span{
                    &:nth-of-type(2){
                        color: #ffe291;
                        font-size: 26px;
                    }
                }
            }
            .bottom{
                display: flex;
                width: 100%;
                height: 80px;
                background: #fff;
                .van-tabs--line .van-tabs__wrap {
                    height:100% !important;
                    border-bottom: 1px solid #eee !important;
                }
                .van-tabs {
                    width: 100%;
                    height: 100% !important;
                    .van-tab {
                        width: 122px !important;
                        padding: 0 !important;
                        height: 100% !important;
                        font-size: 28px !important;
                        color: $base-font-color !important;
                        margin-right: 30px;


                        .van-tab__text--ellipsis {
                            overflow: inherit !important;
                        }

                        &.van-tab--active {
                            color: $color-main !important;
                        }
                    }

                    .van-tabs__line {
                        width: 112px !important;
                        height: 4px !important;
                    }
                }

                .van-tabs__content {
                    margin-top: 20px;
                }
            }
        }
        .content{
            display: flex;
            width: 100%;
            margin-top: 170px;
        }
    }

</style>
