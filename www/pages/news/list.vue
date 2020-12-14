<!--新闻-->
<template>
    <div>
        <tk-header class="normal" />
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div class="news-container">
                        <div class="news-block" @click="clickOnDetail('1')">
                            <div>
                                <img src="" alt="" class="pic">
                            </div>
                            <div class="content">
                                <p class="title">
                                    我和你
                                </p>
                                <time class="time">2015-10-09</time>
                            </div>
                        </div>
                        <div class="news-block">
                            <div>
                                <img src="" alt="" class="pic">
                            </div>
                            <div class="content">
                                <p class="title">
                                    我和你
                                </p>
                                <time class="time">2015-10-09</time>
                            </div>
                        </div>
                        <div class="news-block">
                            <div>
                                <img src="" alt="" class="pic">
                            </div>
                            <div class="content">
                                <p class="title">
                                    我和你
                                </p>
                                <time class="time">2015-10-09</time>
                            </div>
                        </div>
                    </div>
                    <tk-pagination
                        :page-size="tableData.pageSize"
                        :total="tableData.count"
                        :current-page.sync="tableData.currentPage"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import TkPagination from '@/components/ui/TkPagination.vue';

    @Component({
        components: {
            TkHeader,
            TkFooter,
            TkPagination
        }
    })
    export default class extends Vue {
        tableData = {
            pageSize: 10,
            count: 9,
            currentPage: 1
        };

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

        clickOnDetail(id: string) {
            this.$router.push({
                path: '/news/detail',
                query: {
                    id
                }
            });
        }

        handleCurrentChange(page: number) {

        }
    }
</script>

<style lang="scss" scoped>
    .news-container {
        margin-top: 20px;
        background-color: #fff;
        padding: 30px 30px 20px 30px;
        display: flex;
        flex-flow: wrap;

        .news-block {
            width: 50%;
            display: flex;
            margin-bottom: 30px;

            .pic {
                width: 100px;
                height: 100px;
                display: block;
                background-color: #eaeaeA;
            }

            .content {
                margin-left: 13px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                    font-size: 16px;
                    color: #333;

                    &:hover {
                        color: #0086ff;
                    }
                }

                .time {
                    color: #999;
                    font-size: 13px;
                }
            }
        }
    }
</style>
