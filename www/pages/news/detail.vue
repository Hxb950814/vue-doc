<!--新闻-->
<template>
    <div>
        <tk-header class="normal" />
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div class="news-detail-wrap">
                        <div class="title-block">
                            <p class="title">
                                {{ title }}
                            </p>
                            <div class="tools-line">
                                <time>{{ time }}</time>
                                <span class="from">来源： {{ from }}</span>
                                <span v-for="(item,idx) in tags" :key="idx" class="tag">{{ item }}</span>
                            </div>
                        </div>
                        <article class="content" v-html="content" />
                    </div>
                </div>
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {getAsync, postAsync} from '@/utils/request';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import TkPagination from '@/components/ui/TkPagination.vue';

    @Component({
        components: {
            TkHeader,
            TkFooter
        },
        async asyncData({route}) {
            const [err, result] = await postAsync('/affiche/findArticleById', {
                articleId: route.query.id
            });
            let title = '';
            let from = '';
            let time = '';
            let content = '';
            let tags = [];
            if (result?.code === '000000') {
                title = result.data.title;
                time = result.data.publishTime;
                from = result.data.articleFrom;
                content = result.data.content;
                tags = (result.data.articleCategoryText || '').split(',');
            }
            return {
                title,
                time,
                from,
                content,
                tags
            };
        }
    })
    export default class extends Vue {
        title = '';
        time = '';
        from = '';
        content = '';
        tags: any[] = [];

        mounted() {
        }

        clickMessage(id: string) {
            // this.$router.push('/message/notice_detail?id=' + id);
        }

        async getData(page: number) {
            // const [_, resp] = await postAsync('/operate/getAfficheList', {
            //     page
            // });
            // if (resp?.code === '000000') {
            //     this.page = page;
            //     const data = resp?.data || {};
            //     const list: any[] = [];
            //     (data?.result || []).forEach((item: any) => {
            //         list.push({
            //             title: item.title, // 反馈的问题
            //             publishTime: item.publish_time, // 反馈的问题的答复
            //             id: '' + item.affiche_id
            //         });
            //     });
            //
            //     if (this.page === 1) {
            //         this.dataList = [];
            //     }
            //     this.dataList = this.dataList.concat(list);
            //     this.handleRefresh(true, false);
            // } else {
            //     this.handleRefresh(false);
            // }
        }
    }
</script>

<style lang="scss" scoped>
    .news-detail-wrap{
        background-color: #fff;
        margin: 20px 0;
        padding: 20px;
        .title-block{
            border-bottom: 1px solid #eaeaea;
            padding: 40px 0 20px;
            .title{
                font-size: 24px;
                font-weight: bold;
                text-align: center;
            }
            .tools-line{
                text-align: center;
                padding-top: 20px;
                time{
                    display: inline-block;
                    color: #666;
                    font-size: 14px;
                }
                .from{
                    display: inline-block;
                    color: #666;
                    font-size: 14px;
                    margin-right: 20px;
                    margin-left: 20px;
                }
                .tag{
                    color: #333;
                    line-height: 20px;
                    padding: 0 5px;
                    background-color: #ffebe9;
                    font-size: 14px;
                    display: inline-block;
                    margin-right: 5px;
                }
            }
        }
        .content{
            padding: 30px 0;
            font-size: 14px;
            line-height: 2.5;
            color: #595959;
            >p{
                color: #595959;
                font-size: 14px;
                line-height: 2.5;
            }
        }
    }
</style>
