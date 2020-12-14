<template>
    <div class="hbb-meowCoin-page">
        <img width='100%' src="@assets/images/mbbg.jpg" alt="">
        <div class="top">
            <van-tabs v-model="coursesCurrent">
                <van-tab
                        v-for="(item, index) in navList"
                        :key="index"
                        :title="item.title"
                >
                <template v-if='index === 1'>
                    <ClassView></ClassView>
                </template>
                <template v-else>
                    <div class="hbb-noData">
                        暂无数据
                    </div>
                </template>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ClassView from './class.vue';

    @Component({
        components:{ClassView}
    })
    export default class extends Vue {
        coursesCurrent = 0;
        navList:any[] = [
            {
                id:1,
                title: '广场'
            },
            {
                id:2,
                title: '班级'
            },
            {
                id:3,
                title: '同学'
            },
            {
                id:4,
                title: '律师'
            },
            {
                id:5,
                title: '工具'
            }
        ];

        mounted() {

        }
        goMore() {
            this.$router.push({
                path: '/personal/meowCoinMore'
            })
        }
    }
</script>

<style lang="scss">
.hbb-meowCoin-page{
    .top{
        width: 100%;
        margin-top: 30px;
         .van-tabs--line .van-tabs__wrap {
                    height:60px !important;
                    border-bottom: 1px solid #eee !important;
                }
        .van-tabs {
            width: 100%;
            height: 60px !important;
            .van-tab {
                width: 122px !important;
                padding: 0 !important;
                height: 60px !important;
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
                width: 70px !important;
                height: 4px !important;
            }
        }

        .van-tabs__content {
            margin-top: 20px;
        }
    }
        .hbb-noData{
            display: flex;
            width: 100%;
            height: 150px;
            justify-content: center;
            align-items: center;
            font-size: 26px;
            color: $color-gray;
        }
}
</style>
