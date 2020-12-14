<!-- 行情种类 -->
<template>
    <div>
        <div class="page-cap-title">
            行情种类
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">种类名称:</span>
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
                    <span class="words">交易所:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.exchangeId"
                            style="width: 160px"
                            placeholder=""
                            clearable
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,idx) in sourceList"
                                :key="idx"
                                :value="item.id"
                                :label="item.name"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                            clearable
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
                    <el-button v-permission="'06020101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="speciesName" label="种类名称" />
                <el-table-column prop="sourceName" label="交易所" />
                <el-table-column prop="contractNumber" label="合约数量" />
                <el-table-column prop="dayTime" label="白盘时间">
                    <template slot-scope="scope">
                        <template v-if="scope.row.supportDay === 1">
                            <div class="time-sep">
                                <span class="sep">上午开市</span>{{ scope.row.dayAmStart }}-{{ scope.row.dayAmEnd }}
                            </div>
                            <div class="time-sep border">
                                <span class="sep">盘中休市</span>{{ scope.row.closedStart }}-{{ scope.row.closedEnd }}
                            </div>
                            <div class="time-sep">
                                <span class="sep">下午开市</span>{{ scope.row.dayPmStart }}-{{ scope.row.dayPmEnd }}
                            </div>
                        </template>
                        <template v-else>
                            不支持
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="nightTime" label="夜盘时间">
                    <template slot-scope="scope">
                        <template v-if="scope.row.supportNight === 1">
                            <div class="time-sep">
                                <span class="sep">当日</span>{{ scope.row.nightPmStart }}-{{ scope.row.nightPmEnd }}
                            </div>
                            <div class="time-sep">
                                <span class="sep">次日</span>{{ scope.row.nightAmStart }}-{{ scope.row.nightAmEnd }}
                            </div>
                        </template>
                        <template v-else>
                            不支持
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="展示状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 1" class="list-status normal">已上架</a>
                        <a v-else-if="scope.row.status === 0" class="list-status red">已下架</a>
                        <a v-else class="list-status">正常</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <div v-if="!checkPermissionNotExist('06020102')">
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
            name: '', // 种类名称
            exchangeId: '', // 交易所id
            status: '' // 展示状态
        };

        sourceList: any = [];

        mounted() {
            this.getDataSource();
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataSource() {
            const [err, resp] = await this.$getAsync('/quotation/selectQuotationSourceAll', {});
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: item.quotationSourceId,
                        name: item.sourceName
                    });
                });
                this.sourceList = list;
            }
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/quotation/selectQuotationSpeciesListPage', {
                page: this.tableData.currentPage,
                speciesName: this.search.name,
                quotationSourceId: this.search.exchangeId,
                status: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.quotationSpeciesId),
                        name: item.name, // 系统账号
                        contractNumber: item.contractNumber,
                        speciesName: item.speciesName,
                        sourceName: item.sourceName,
                        status: Number(item.status),
                        supportDay: Number(item.supportDay),
                        supportNight: Number(item.supportNight),
                        closedStart: item.closedStart,
                        closedEnd: item.closedEnd,
                        dayAmEnd: item.dayAmEnd,
                        dayAmStart: item.dayAmStart,
                        dayPmEnd: item.dayPmEnd,
                        dayPmStart: item.dayPmStart,
                        nightAmEnd: item.nightAmEnd,
                        nightAmStart: item.nightAmStart,
                        nightPmEnd: item.nightPmEnd,
                        nightPmStart: item.nightPmStart
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

        clickAdd(id: string) {
            this.$router.push({
                path: '/situation_manage/type/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/type/detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .time-sep{
        margin:  5px 0;
        text-align: left;
        >.sep{
            margin-right: 5px;
        }
        &.border{
            color: $theme-font-color;
            >.sep{
                color: $theme-font-color;
            }
        }
    }
</style>
