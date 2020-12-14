<!--平台公告-->
<template>
    <div>
        <tk-header class="normal" />
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div v-if="newsList.length !== 0" class="list-container">
                        <ul>
                            <li v-for="item in newsList" :key="item.id" class="list-item" @click="clickDetail(item.id)">
                                <div class="title">
                                    {{ item.title }}
                                </div>
                                <time class="time">
                                    {{ item.time }}
                                </time>
                            </li>
                        </ul>
                    </div>
                    <tk-pagination v-if="newsList.length !== 0"
                                   :page-size="tableData.pageSize"
                                   :total="tableData.count"
                                   :current-page.sync="tableData.currentPage"
                                   @current-change="handleCurrentChange"
                    />
                    <template v-if="dataLoaded && newsList.length === 0">
                        <div class="no-data">
                            暂无数据
                        </div>
                    </template>
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
    import {getAsync, postAsync} from '@/utils/request';

    @Component({
        components: {
            TkHeader,
            TkFooter,
            TkPagination
        },
        async asyncData() {
        }
    })
    export default class extends Vue {
        dataLoaded = false;
        newsList: any[] = [];
        tableData = {
            pageSize: 10,
            count: 0,
            currentPage: 1
        };

        async mounted() {
            await this.getData(1);
        }

        clickMessage(id: string) {
            this.$router.push('/message/notice_detail?id=' + id);
        }

        clickDetail(id: string) {
            this.$router.push({
                path: '/message/notice_detail',
                query: {
                    id
                }
            });
        }

        async getData(page: number) {
            this.$showLoading();
            const [err, result] = await getAsync('/affiche/getAfficheList', {
                page
            });

            const newsList: any[] = [];
            if (result && result.code === '000000') {
                (result?.data?.result || []).forEach((item: any, idx: number) => {
                    newsList.push({
                        id: String(item.afficheId),
                        title: item.title,
                        time: item.publishTime.split(' ')?.[0]
                    });
                });
                this.tableData.currentPage = page;
                this.tableData.count = result?.data?.totalCount;
            } else {
            }
            this.$closeLoading();
            this.dataLoaded = true;
            this.newsList = newsList;
        }

        handleCurrentChange(currPage: number) {
            this.getData(currPage);
        }
    }
</script>

<style lang="scss" scoped>
    .list-container {
        margin-top: 20px;
        background-color: #fff;
        padding: 10px 40px;
        /*min-height: 50px;*/
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px dashed #eee;

        &:last-child {
            border-bottom: none;
        }

        > div {
            font-size: 15px;
        }

        .title {
            position: relative;
            padding-left: 20px;
            max-width: 600px;
            @include ellipsis();
            cursor: pointer;

            &:hover {
                color: $color-main;
            }

            &:before {
                position: absolute;
                border-radius: 50%;
                top: 4px;
                content: '';
                left: 0;
                width: 8px;
                height: 8px;
                background-color: $color-main;
            }
        }

        .time {
            font-size: 13px;
            color: #999;
        }
    }

    .no-data {
        margin-top: 20px;
        padding: 40px 0;
        font-size: 15px;
        background-color: #fff;
        text-align: center;
    }
</style>
