<template>
    <div>
        <div class="page-cap-title">
            文章管理
        </div>
        <div class="nav-common-search">
            <SearchHeader mode="2" title="文章" @getDataEvent="searchData" />
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data" tooltip-effect="light">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="title" width="300" label="文章名称">
                    <template slot-scope="scope">
                        <template v-if="scope.row.title.length > 20">
                            <el-tooltip
                                class="item"
                                popper-class="poshytips"
                                :visible-arrow="false"
                                placement="bottom"
                                :content="scope.row.title"
                            >
                                <span class="ellipsis">{{ scope.row.title.substr(0,20) + '...' }}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            {{ scope.row.title }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="origin" label="文章来源" />
                <el-table-column label="外部调用">
                    <template slot-scope="scope">
                        {{ scope.row.isQuote ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="isTop" label="是否置顶">
                    <template slot-scope="scope">
                        {{ scope.row.isTop? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="展示状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '显示' : '隐藏' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="pv" label="累计PV" />
                <el-table-column prop="uv" label="累计UV" />
                <el-table-column prop="likeNum" label="点赞量" />
                <el-table-column prop="collectNum" label="收藏量" />
                <el-table-column prop="publishTime" label="发布时间" width="150" />
                <el-table-column prop="operator" label="操作" width="180">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <a class="link-btn normal" style="margin: 0 5px;color: #F85E5E" @click="clickDelete(scope.row.id)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="my-pagination-wrap">
                <my-pagination
                    :page-size="tableData.pageSize"
                    :total="tableData.count"
                    :current-page.sync="tableData.currentPage"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import SearchHeader from '../components/searchHeader.vue';
    import commonTable from '@/mixins/commonTable';
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    @Component({
        components: {SearchHeader}
    })
    export default class extends Mixins(commonTable) {
        search: any = {

        };

        searchData(res:any) {
            this.tableData.currentPage = 1;
            this.search = res;
            this.getDataList(res);
        }

        async getDataList(resData:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/article/articleList', {
                page: this.tableData.currentPage,
                title: resData.title,
                display: resData.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.articleId),
                        title: item.title, // 名字
                        isTop: item.isTop, // 是否置頂
                        publishTime: item.publishTime, // 发布时间
                        pv: item.pvNum ? item.uvNum : 0, // pv
                        uv: item.uvNum ? item.uvNum : 0, // uv
                        origin: item.articleFrom, // 是否置頂
                        likeNum: item.likeNum,
                        collectNum: item.collectNum,
                        isQuote: item.isQuote ? '1' : '0', // 是否外部调用
                        status: item.display ? '1' : '0' // 状态
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.searchData(this.search);
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/content_manage/article/edit',
                query: {
                    id
                }
            });
        }

        async clickDelete(id: string) {
            // 删除
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/article/deletedArticleById', {
                articleId: id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                this.getDataList(this.search);
            } else {
                this.$message({
                    type: 'error',
                    message: '操作异常'
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
