<!-- 预警通知 -->
<template>
    <div>
        <tk-nav-bar>
            预警通知
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="warning-message-block">
                        <p class="time">
                            {{ item.time }}
                        </p>
                        <div class="body" @click="clickOnMessage(item.contractId)">
                            <div class="head">
                                <img src="https://rs.tanxingk.com/images/logo_ico40.png" alt="" class="icon">
                                <span class="item">{{ item.title }}</span>
                            </div>
                            <div class="content">
                                {{ item.content }}
                            </div>
                            <div class="bottom">
                                查看详情
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
    import {Component, Vue} from 'vue-property-decorator';
    import dataListMixins from '@/mixins/dataListMixins';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth'
    })
    export default class extends dataListMixins {
        mounted() {
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/wmessage/getUsedWarnListPage', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        id: item.preWarnId + '',
                        title: item.title, //
                        content: item.content, //
                        contractId: String(item.quotationContractId) //
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
            // this.$router.push({
            //     path: 'todo'
            // });
            window.location.href = '/future/trend?id=' + id;
        }
    }
</script>

<style lang="scss" scoped>
    .warning-message-block{
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
                position: relative;
                @include thinBorder(bottom);
                padding: 20px 0;
                color: #666;
                font-size: 26px;
                line-height: 1.4;
            }
            .bottom{
                position: relative;
                height: 70px;
                line-height: 70px;
                font-size: 26px;
                color: #666;
                margin-bottom: -20px;
                @include rightArrow(#666, 15px, 28px,8px);
            }
        }
    }
</style>
