<!--detail-->
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
                            </div>
                        </div>
                        <article class="content">
                            <p>5月6日晚间起，国内商品期货交易所正式恢复夜盘交易。证券时报记者从业内了解到，夜盘交易恢复的首个交易日运行平稳。</p>
                            <p>尽管整体成交量变化不大，但黄金等传统国际品种的成交量有了明显上升。</p>
                            大好处，策略也可以重新丰富起来。”有私募机构人士称。
                            据文华财经数据，追踪国内商品期货市场的文华商品指数5月7日（含6日晚夜盘）成交量为1946.1万手，较前日增长310.5万手，与前期比变化并不明显。不过，部分品种的成交量增长则相当突出。其中，上期所黄金期货当日成交21.4万手，较前日增长10.5万手，几乎翻倍。
                        </article>
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
            const [err, result] = await getAsync('/affiche/getAfficheDetail', {
                afficheId: route.query.id
            });
            let title = '';
            let time = '';
            if (result?.code === '000000') {
                title = result.data.title;
                time = result.data.publishTime;
            }
            return {
                title,
                time
            };
        }
    })
    export default class extends Vue {
        title = '22';
        time = '';

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
        margin-top: 20px;
        padding: 0 20px;
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
