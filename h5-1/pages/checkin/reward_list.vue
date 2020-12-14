<template>
    <div>
        <tk-nav-bar>
            签到获奖记录
        </tk-nav-bar>
        <div class="container">
            <div class="title-banner">
                已获得<span class="red">{{ sumReward }}K豆</span>奖励
            </div>
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="list-item">
                        <div>
                            {{ item.time }}
                        </div>
                        <div>
                            <span class="reward">{{ item.reward }}K豆</span>奖励
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
    import {Component, Vue} from 'vue-property-decorator';
    import {ImagePreview} from 'vant';
    import dataListMixins from '@/mixins/dataListMixins';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth'
    })
    export default class extends dataListMixins {
        sumReward = 0;
        mounted() {
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/signIn/getSignRecord', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data?.page || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        time: item.signTime, // 时间
                        reward: item.reward // 奖励k豆数
                    });
                });
                this.sumReward = resp.data.sumReward;

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(list);
                this.handleRefresh(true, false);
            } else {
                this.handleRefresh(false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
        padding-bottom: 20px;
        .mescroll{
            top: calc(#{$nav-height} + 90px)
        }
    }
    .title-banner{
        padding-left: 25px;
        font-size: 24px;
        line-height: 90px;
        background-color: #f2f2f2;
        .red{
            color: $color-main;
            font-size: 24px;
        }
    }
    .list-item{
        display: flex;
        line-height: 90px;
        justify-content: space-between;
        padding: 0 25px;
        height: 90px;
        >div{
            line-height: 90px;
            color: #666;
            font-size: 24px;
        }
        .reward{
            color: $color-main;
            font-size: 24px;
        }
        position: relative;
        @include border-bottom();
    }
</style>
