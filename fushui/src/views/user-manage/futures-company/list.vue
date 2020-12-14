<!-- 期货公司 -->
<template>
    <div>
        <div class="page-cap-title">
            期货公司
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">期货公司:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.company"
                            style="width: 200px"
                            type="text"
                            clearable
                            placeholder="请输入期货公司名称"
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'05050101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="futureCompanyName" label="期货公司" />
                <el-table-column prop="apiType" label="交易席位" />
                <el-table-column prop="bankTransfer" label="银期转账">
                    <template slot-scope="scope">
                        <a v-if="scope.row.bankTransfer === 1" class="list-status">支持</a>
                        <a v-else-if="scope.row.bankTransfer === 0" class="list-status red">不支持</a>
                    </template>
                </el-table-column>
                <el-table-column prop="bindNum" label="绑定人数" />
                <el-table-column prop="traderNum" label="交易人数" />
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 1" class="list-status">显示</a>
                        <a v-else-if="scope.row.status === 0" class="list-status red">隐藏</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a v-permission="'05050102'" class="link-btn color normal" @click="clickEdit(scope.row.id)">查看</a>
                        <span v-if="checkPermissionNotExist('05050102')">--</span>
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
            phone: '', // 联系方式
            company: '', // 状态
            accountStatus: '', // 账号状态
            strategyStatus: '' // 策略状态
        };

        algin = '';

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/futureCompany/queryFutureCompanyListPage', {
                page: this.tableData.currentPage,
                futureCompanyName: this.search.company
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.futureCompanyId),
                        futureCompanyName: item.futureCompanyName, // 期货公司名
                        apiType: item.apiTypeString, // api类型  todo: 现在只有两种, 写死了
                        traderNum: item.traderNum, // 交易人数
                        bindNum: item.bindNum, // 绑定人数
                        status: Number(item.status), // 状态
                        bankTransfer: Number(item.bankTransfer) // 状态
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
                path: '/user_manage/futures_company/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/user_manage/futures_company/detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
