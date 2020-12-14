<template>
    <div>
        <div class="page-cap-title">
            支付设置
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="passagewayName" label="支付通道" />
                <el-table-column prop="chanle_text" label="显示渠道" />
                <el-table-column prop="passagewaySetId" label="通道ID" />
                <el-table-column prop="studentNo" label="当前状态">
                    <template slot-scope="scope">
                        {{ scope.row.display ? '展示': '隐藏' }}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" @click="clickErase(scope.row)">查看</a>
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
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {
        }
    })
    export default class extends Mixins(commonTable) {
        mounted() {
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/finance/getPassagewaySetList', {
                page: this.tableData.currentPage
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.data.forEach((x:any) => {
                    x.chanle_text = this.getChannelStr(x.displayPlatform);
                });
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickErase(item:any) {
            this.$router.push({
                path: '/finance_manage/settings/pay/detail',
                query: {
                    id: item.passagewaySetId
                }
            });
        }

        getChannelStr(code: string) {
            const codeArr = code.split(',');
            const map = new Map();
            map.set('0', 'Android');
            map.set('1', 'IOS');
            map.set('2', 'H5');
            map.set('3', '小程序');
            map.set('4', 'PC');
            return codeArr.sort().map((item: string) => {
                return map.get(item) || '';
            }).filter((item: string) => {
                return item !== '';
            }).join('，') || '-';
        }
    }
</script>

<style lang="scss">
</style>
