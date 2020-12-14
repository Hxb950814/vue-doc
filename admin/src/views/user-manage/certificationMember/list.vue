<!-- 账号管理 -->
<template>
    <div>
        <div class="page-cap-title">
            认证会员
        </div>
        <div class="nav-common-search">
            <SearchHeader mode="3" title="认证会员" @searchDataEvent="searchData" />
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="联系方式" />
                <el-table-column prop="studentNo" label="学号" />
                <el-table-column prop="wechatBind" label="微信绑定">
                    <template slot-scope="scope">
                        <a>{{ scope.row.wechatBind === 1 ? '已绑定': '未绑定' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间" />
                <el-table-column label="钱包余额 ￥">
                    <template slot-scope="scope">
                        <span>{{ scope.row.balance | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="积分余额">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pointBalance | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="目前在学课程" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color red" @click="clickErase(scope.row.userId)">查看</a>
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

    @Component({
        components: {
            SearchHeader
        }
    })
    export default class extends Mixins(commonTable) {
        search: any = {};

        searchData(reaData:any) {
            this.tableData.currentPage = 1;
            this.search = reaData;
            this.getDataList(reaData);
        }

        async getDataList(reaData:any) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/getUserList', {
                page: this.tableData.currentPage,
                pageMode: 3, // 查询页面模式
                auth: 1, // 查询页面模式
                startTime: reaData.startTime, // 开始时间
                endTime: reaData.endTime, // 结束时间
                studentNo: reaData.studentNo, // 学号
                mobile: reaData.mobile // 手机号
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList(this.search);
        }

        clickErase(id:number) {
            this.$router.push({
                path: '/user_manage/certificationMember/detail',
                query: {
                    id: String(id)
                }
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>
