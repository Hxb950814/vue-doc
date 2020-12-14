<!-- K线图表 -->
<template>
    <div>
        <div class="page-cap-title">
            K线图表
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">图表类型:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.type"
                            style="width: 160px"
                            clearable
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option v-for="(item,idx) in dataChartTypeList" :key="idx" :value="item.chartTypeId" :label="item.typeName" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">图表名称:</span>
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
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'06060201'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="图表名称" />
                <el-table-column prop="type" label="图表类型" />
                <el-table-column prop="order" label="显示顺序" />
                <el-table-column prop="status" label="是否展示">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '是' : '否' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a
                            v-if="checkPermission('06060202')"
                            class="link-btn color normal"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <span v-else>--</span>
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
            type: '',
            name: ''
        };

        dataChartTypeList: any[] = [];

        async mounted() {
            await this.getChartType();
            await this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getChartType() {
            const [err, resp] = await this.$getAsync('/chart/selectAllChartType');
            const list: any[] = [];
            if (resp?.code === '000000') {
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        chartTypeId: item.chartTypeId + '',
                        typeName: item.typeName + ''
                    });
                });
            }
            this.dataChartTypeList = list;
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/chart/selectChartListPage', {
                page: this.tableData.currentPage,
                chartTypeId: this.search.type,
                chartName: this.search.name
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.chartId),
                        name: String(item.chartName) || '--',
                        type: this.getTypeNameById(String(item.chartTypeId)) || '--',
                        order: item.sortby,
                        status: String(item.status)
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
                path: '/situation_manage/settings/kline_chart/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/settings/kline_chart/detail',
                query: {
                    id
                }
            });
        }

        getTypeNameById(id: string) {
            const find = this.dataChartTypeList.find((item: any) => {
                return item.chartTypeId + '' === id;
            });
            if (find) {
                return find.typeName;
            }
            return '';
        }
    }
</script>

<style lang="scss" scoped>
</style>
