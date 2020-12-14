<template>
    <div>
        <tk-nav-bar>
            我的消息
            <template #right>
                <a v-if="dataList.length > 0" class="all-read" @click="clickAllRead">全部已读</a>
            </template>
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" @init="mescrollInit">
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="message-block" @click="clickMessage(item.messageType)">
                        <div class="icon" :class="{'no-read': !item.isRead}">
                            <img :src="`https://rs.tanxingk.com/images/icon_message_${item.messageType}.png`" alt="">
                        </div>
                        <div class="content">
                            <p class="title">
                                <span>{{ item.title }}</span>
                                <span class="time">{{ item.time }}</span>
                            </p>
                            <p class="detail">
                                {{ item.brief }}
                            </p>
                        </div>
                    </li>
                </ul>
                <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                    <div class="icon">
                        暂无消息
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

    /*
    *    1=平台公告，2=系统通知，3=K豆通知，4=预警通知，5=策略通知，6=云条件单通知，7=反馈通知
    */

    const configMap: any = {
        1: {
            title: '平台公告',
            listUrl: '/message/notice_list',
            isOpen: true
        },
        2: {
            title: '系统通知',
            listUrl: '/message/system_list',
            isOpen: false
        },
        3: {
            title: 'K豆通知',
            listUrl: '/message/kcoin_list',
            isOpen: true
        },
        4: {
            title: '预警通知',
            listUrl: '/message/warning_list',
            isOpen: true
        },
        5: {
            title: '策略通知',
            isOpen: false
        },
        6: {
            title: '云条件单通知',
            isOpen: false
        },
        7: {
            title: '反馈通知',
            listUrl: '/message/feedback_list',
            isOpen: true
        }
    };

    @Component({
    })
    export default class extends dataListMixins {
        mounted() {
            this.$showLoading();
        }

        async clickAllRead() {
            const [_, resp] = await postAsync('/myMessage/updateAllMessageNotice');
            if (resp?.code === '000000') {
                this.$showToast('全部已读成功');
                this.getData(1);
            } else {
                this.$showToast(resp?.message || '没有未读消息');
            }
        }

        async clickMessage(idx: number) {
            const url = configMap[idx]?.listUrl;
            const isOpen = configMap[idx]?.isOpen; // 是否开发
            if (!isOpen) {
                this.$showToast('功能开发中，敬请期待！');
                return;
            }
            const [_, resp] = await postAsync('myMessage/queryMessageNoticeInfo', {
                messageType: idx
            });
            if (url) {
                this.$router.push(url);
            }
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/myMessage/queryMyMessageNotice');
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || [];
                const list: any[] = [];
                data.forEach((item: any) => {
                    list.push({
                        messageType: +item.messageType,
                        isRead: Number(item.isRead) === 1,
                        title: (configMap[item.messageType] || {title: ''}).title,
                        brief: item.messageContent,
                        time: item.updateTime || ''
                    });
                });

                this.dataList = list;
                this.handleRefresh(true, false);
            } else {
                this.handleRefresh(false);
            }
            if (this.dataLoaded) {
                this.$closeLoading();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .message-block {
        display: flex;
        padding: 30px;
        background-color: #fff;
        @include thinBorder(bottom, #eee);

        .icon {
            width: 90px;
            height: 90px;
            position: relative;
            > img {
                width: 100%;
                height: 100%;
            }
            &.no-read{
                @include dot($color-main, 18px, -8px, -8px);
            }
        }

        .content {
            margin-left: 30px;
            flex: 1;
            .title {
                margin-top: 0;
                font-size: 32px;
                display: flex;
                justify-content: space-between;

                span {
                    font-size: 32px;
                }

                .time {
                    color: #999;
                    font-size: 24px;
                    padding-top: 5px;
                }
            }

            .detail {
                font-size: 24px;
                color: #666;
                margin-top: 15px;
                @include ellipsis(2);
            }
        }
    }

    .all-read {
        font-size: 26px;
        color: #fff;
        line-height: 88px;
        padding-right: 25px;
    }
</style>
