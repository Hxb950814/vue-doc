<!--系统消息列表-->
<template>
    <div class="container">
        <tk-nav-bar>系统消息</tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="common-message-block">
                        <div class="header">
                            <span class="title-s">通知类型</span>
                            <span class="time">1。2，,3</span>
                        </div>
                        <div class="content">
                            111222
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
    })
    export default class extends dataListMixins {
        mounted() {
        }

        clickMessage(id: string) {
            this.$router.push('/message/notice_detail?id=' + id);
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/operate/getAfficheList', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        title: item.title, // 反馈的问题
                        publishTime: item.publish_time, // 反馈的问题的答复
                        id: '' + item.affiche_id
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
    }
</script>

<style lang="scss" scoped>
</style>
