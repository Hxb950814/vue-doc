<!-- 行情来源 -->
<template>
    <div>
        <div class="page-cap-title">
            行情来源
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">展示名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="已上架" />
                            <el-option value="0" label="已下架" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'06010101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="sourceName" label="展示名称" />
                <el-table-column prop="speciesNumber" label="种类数量" />
                <el-table-column prop="contractNumber" label="合约数量" />
                <el-table-column prop="sortby" label="展示顺序" />
                <el-table-column prop="status" label="展示状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 0" class="list-status red">已下架</a>
                        <a v-else-if="scope.row.status === 1" class="list-status normal">已上架</a>
                        <a v-else class="list-status">正常</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <div v-if="!checkPermissionNotExist('06010102')">
                            <div v-if="!scope.row.isErased">
                                <a
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickEdit(scope.row.id)"
                                >查看</a>
                            </div>
                            <div v-else>
                                -
                            </div>
                        </div>
                        <div v-else>
                            --
                        </div>
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
            name: '', // 名字
            status: '' // 状态
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
            const [err, resp] = await this.$getAsync('/quotation/selectQuotationSourceListPage', {
                page: this.tableData.currentPage,
                sourceName: this.search.name,
                status: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.quotationSourceId),
                        name: item.name, // 系统账号
                        sourceName: item.sourceName, // 展示名称
                        speciesNumber: item.speciesNumber, // 种类数量
                        fullName: item.fullName, // 交易所全称
                        contractNumber: item.contractNumber, // 合约数量
                        sortby: item.sortby, // 展示顺序
                        status: Number(item.status) // 展示顺序
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
            this.getDataList();
        }

        clickAdd() {
            this.$router.push({
                path: '/situation_manage/source/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/source/detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
