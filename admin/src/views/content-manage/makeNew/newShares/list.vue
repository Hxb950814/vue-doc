<template>
    <div>
        <div class="page-cap-title">
            新股申购
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">新股名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入新股名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickAddNotice">
                        <i class="el-icon-plus" />
                        新股
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="newStockName" width="160" label="新股名称" />
                <el-table-column prop="stockType" width="80" label="新股类型" />
                <el-table-column prop="issuePrice" label="发行价格">
                    <template slot-scope="scope">
                        {{ scope.row.issuePrice | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="pERatio" label="市盈率/%">
                    <template slot-scope="scope">
                        {{ scope.row.pERatio | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="netIssueNum" label="发行总量">
                    <!--                    <template slot-scope="scope">-->
                    <!--                        {{ scope.row.isTop ? '是' : '否' }}-->
                    <!--                    </template>-->
                </el-table-column>
                <el-table-column prop="netApplyLimit" label="申购上限" width="150" />
                <el-table-column prop="applyDate" label="申购日期" width="150" />
                <el-table-column prop="allotmentNumberDate" label="配号日期" width="150" />
                <el-table-column prop="winResultDate" label="中签结果" width="150" />
                <el-table-column prop="listDate" label="上市日期" width="150" />
                <el-table-column prop="paymentBySign" label="一签缴款/元" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.paymentBySign | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.newStockId)">查看</a>
                        <a class="link-btn normal" style="margin: 0 5px;color:#F85E5E" @click="clickDelete(scope.row.newStockId)">删除</a>
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
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            title: '' // 新股名称
        };

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/newStock/queryNewStockListPage', {
                page: this.tableData.currentPage,
                newStockName: this.search.title
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                this.tableData.data = resp?.data?.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickAddNotice() {
            this.$router.push({
                path: '/content_manage/makeNew/newShares/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/content_manage/makeNew/newShares/edit',
                query: {
                    id
                }
            });
        }

        async clickDelete(id: number) {
            // 删除
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/newStock/deleteNewStockInfoById', {
                        newStockId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
