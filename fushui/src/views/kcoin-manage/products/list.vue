<!--K豆产品-->
<template>
    <div>
        <div class="page-cap-title">
            K豆产品
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">产品名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入产品名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">状态:</span>
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
                </div>
                <div class="search-union right">
                    <el-button v-permission="'04010101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />添加产品
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="title" width="300" label="产品名称">
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
                <el-table-column prop="price" label="产品价格/元">
                    <template slot-scope="scope">
                        {{ scope.row.price | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="K豆数量/个" />
                <el-table-column prop="time" label="购买次数/次" />
                <el-table-column prop="amount" label="销售金额/元">
                    <template slot-scope="scope">
                        {{ scope.row.amount | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">
                            {{ scope.row.status === '1' ? '已上架' : '已下架' }}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="120">
                    <template slot-scope="scope">
                        <a
                            v-if="!scope.row.isTop"
                            v-permission="'04010102'"
                            class="link-btn color green"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <span v-if="checkPermissionNotExist('04010102')">--</span>
                    </template>
                </el-table-column>
            </el-table>
            <my-pagination
                :page-size="tableData.pageSize"
                :total="tableData.count"
                :current-page.sync="tableData.currentPage"
                @current-change="handleCurrentChange"
            />
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
            title: '', // 产品名称
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
            const [err, resp] = await this.$postAsync('/beanProductCtrl/beanProductList', {
                page: this.tableData.currentPage,
                title: this.search.title,
                putaway: this.search.status
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.productId),
                        title: item.title, // 标题
                        price: item.price, // 价格
                        publishTime: item.publishTime, // 发布时间
                        number: item.number, // k豆数量
                        time: item.time, // 购买次数
                        amount: item.amount, // 销售金额
                        status: Number(item.putaway) ? '1' : '0' // 状态 0 = 隐藏 ， 1 = 显示
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
                path: '/kcoin_manage/products/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/kcoin_manage/products/edit',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
