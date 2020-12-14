<template>
    <div>
        <div class="page-cap-title">
            页面ID管理
        </div>

        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">页面名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.pageName"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入页面名称"
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
                    <el-button type="primary" @click="clickAddBanner">
                        <i class="el-icon-plus" />
                        添加页面ID
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="pageName" label="页面名称" />
                <el-table-column prop="pageValue" width="300" label="页面ID" />
                <el-table-column prop="key" label="key值" />
                <el-table-column prop="display" label="展示状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">
                            {{ scope.row.status === '1' ? '启用' : '禁用' }}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
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
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
         search: any = {
             pageName: ''
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
            const [err, resp] = await this.$postAsync('/icon/getpageList', {
                page: this.tableData.currentPage,
                pageName: this.search.pageName
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.pageId),
                        key: item.pageKey || '--', // key
                        pageName: item.pageName,
                        pageValue: item.pageValue, // pageValue
                        status: String(item.display ? 1 : 0) // 状态
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

         clickAddBanner() {
            this.$router.push({
                path: '/image_manage/page_id/add'
            });
        }

         clickEdit(id: string) {
            this.$router.push({
                path: '/image_manage/page_id/edit',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
