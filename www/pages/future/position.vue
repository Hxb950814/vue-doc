<!--持仓数据-->
<template>
    <div>
        <tk-header class="normal" active-kind="position" />
        <div class="container">
            <div class="cap-banner">
                <div class="inner">
                    <img src="//rs.tanxingk.com/images/pc_banner_position_words.png" class="words">
                    <div>
                        <img src="//rs.tanxingk.com/images/tk_app_serve.png" alt="" class="icon">
                        <p class="tips">
                            扫码下载下单大师APP
                        </p>
                    </div>
                </div>
            </div>
            <PositionView mode="1" ref="positionView"></PositionView>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import echarts from 'echarts';
    import PositionView from './deal/component/position_view.vue'; // 持仓数据分析视图
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import TkPagination from '@/components/ui/TkPagination.vue';
    import { getAsync, postAsync } from '@/utils/request';

    let chart1: echarts.ECharts | undefined; // 图表
    let chart2: echarts.ECharts | undefined; // 图表
    let chart3: echarts.ECharts | undefined; // 图表

    @Component({
        components: {
            TkHeader,
            TkFooter,
            TkPagination,
            PositionView
        },
        async asyncData() {
        }
    })
    export default class extends Vue {

    }
</script>

<style lang="scss" scoped>
    .cap-banner {
        min-width: 1200px;
        height: 200px;
        margin: 0 auto;
        background: url(#{$cdn-path}/images/pc_banner_position.jpg) center /100% 100% no-repeat;

        .icon {
            width: 110px;
            height: 110px;
        }

        .inner {
            width: 800px;
            height: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .words {
                display: block;
                width: 420px;
                height: 60px;
            }
        }

        .icon {
            width: 110px;
            height: 110px;
            margin: 0 auto;
            display: block;
            background-color: #ffff63;
            margin-bottom: 10px;
        }

        .tips {
            display: inline-block;
            color: #fff;
            height: 30px;
            line-height: 30px;
            font-size: 15px;
            padding: 0 15px;
            border-radius: 200px;
            background-color: rgba(0, 0, 0, .5);
        }
    }

    .search-lines {
        background-color: #fff;
        display: flex;
        padding: 10px 20px;
        margin-top: 15px;

        .item {
            > span {
                display: inline-block;
                text-align: right;
                line-height: 40px;
                margin-right: 15px;
                margin-left: 15px;
                font-weight: bold;
            }

            display: flex;
        }

        .anounce {
            display: inline-flex;
            align-items: center;
            color: $color-main;
            font-weight: normal;
            cursor: pointer;
            font-size: 14px;
            line-height: 25px;
        }
    }

    .data-grip {
        margin-top: 10px;
        background-color: #fff;
        padding: 15px;
        display: flex;

        > div {
            flex: 1;
            text-align: center;

            &:nth-child(2) {
                margin: 0 10px;
            }
        }

        .charts {
            border: 1px solid #eaeaea;
            position: relative;

            &::after {
                content: '';
                display: block;
                padding-top: 100%;
            }

            .chart-map {
                position: absolute;
                width: 100%;
                height: 100%;
            }
        }
    }

    .detail-table-wrap {
        border: 1px solid #eaeaea;
        margin-top: 10px;

        .total {
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;

            > span {
                line-height: 40px;
                color: #666;
                font-weight: normal;

                &:first-child {
                    width: 150px;
                    text-align: left;
                }
            }
        }

        .no-data {
            height: 50px;
            line-height: 50px;
            color: #666;
            border-bottom: 1px solid #eaeaea;
        }
    }

    .detail-table {
        width: 100%;

        th {
            background-color: #f6f6f6;
            line-height: 40px;
            .label{
                cursor: pointer;
            }
            &:first-child{
                width: 60px;
            }
        }

        tbody tr{
            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3){
                td .rank{
                    color: #fff;
                    background-color: #ec1c1c;
                }
            }
            border-bottom: 1px solid #eaeaea;
            td{
                line-height: 40px;
            }
            .rank{
                display: inline-block;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                line-height: 25px;
                color: #666;
                background-color: #ddd;
            }
            .up{
                color: $color-up;
                display: inline-flex;
                align-items: center;
            }
            .down{
                color: $color-down;
                display: inline-flex;
                align-items: center;
            }
            .arrow{
                display: inline-block;
                font-size: 18px;
                vertical-align: middle;
            }
        }

    }

    .noduty-mask {
        background-color: rgba(0, 0, 0, .4);
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999999;

        .close {
            position: absolute;
            top: 15px;
            right: 20px;
            color: #999;
            font-size: 30px;
            cursor: pointer;
        }

        .panel {
            width: 600px;
            height: 347px;
            border-radius: 6px;
            background-color: #fff;
            margin: 50vh auto 0;
            transform: translateY(-50%);

            .title {
                text-align: center;
                font-size: 26px;
                color: #666;
                margin-bottom: 14px;
                padding-top: 14px;
            }

            .content {
                padding: 0 20px;

                p {
                    text-indent: 28px;
                    line-height: 2.2;
                    font-size: 14px;
                }
            }
        }
    }
    .hbb-noData{
        top: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
