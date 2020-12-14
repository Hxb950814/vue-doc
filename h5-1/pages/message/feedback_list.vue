<!--反馈消息-->
<template>
    <div class="container">
        <tk-nav-bar>反馈消息</tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0">
                    <li v-for="(item,idx) in dataList" :key="idx" class="common-message-block">
                        <div class="header">
                            <span class="title-s">反馈答复</span>
                            <span class="time">{{ item.processTime }}</span>
                        </div>
                        <div class="content" v-html="item.replyContent" />
                        <div class="reply-wrap">
                            <div class="reply">
                                问题:{{ item.content }}
                            </div>
                            <div v-if="item.images.length > 0" class="images">
                                <img v-for="url in item.images" :key="url" alt="反馈图片" :src="url" @click="clickShowPic(url)">
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

        <van-image-preview v-model="show" :images="images" @change="onChange">
            <template v-slot:index>
                第{{ index }}张
            </template>
        </van-image-preview>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ImagePreview} from 'vant';
    import dataListMixins from '@/mixins/dataListMixins';
    import {postAsync} from '@/utils/request';

    Vue.use(ImagePreview);

    @Component({
        middleware: 'auth'
    })
    export default class extends dataListMixins {
        show = false;
        index = 0;
        images: any[] = [];

        mounted() {
        }

        onChange(index: number) {
            this.index = index;
        }

        clickShowPic(url: string) {
            const findIndex = this.images.findIndex((item: string) => url === item);
            this.index = findIndex + 1;
            this.show = true;
        }

        clickMessage(idx: number) {
            switch (idx) {
                case 1:
                    this.$router.push('/message/notice_list');
                    break;
                case 4:
                case 5:
                    this.$showToast('通知');
                    break;
            }
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/operate/getSuggestionList', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const list: any[] = [];
                const listImages: any[] = [];
                (data?.result || []).forEach((item: any) => {
                    list.push({
                        content: item.content, // 反馈的问题
                        replyContent: item.replyContent, // 反馈的问题的答复
                        processTime: item.processTime,
                        createTime: item.createTime,
                        images: (item.suggestionFile || []).map((item: any) => {
                            listImages.push(item.fileUrl);
                            return item.fileUrl;
                        })
                    });
                });

                if (this.page === 1) {
                    this.dataList = [];
                    this.images = [];
                }
                this.dataList = this.dataList.concat(list);
                this.images = this.images.concat(listImages);
                this.handleRefresh(true, false);
            } else {
                this.handleRefresh(false);
            }
        }
    }
</script>
