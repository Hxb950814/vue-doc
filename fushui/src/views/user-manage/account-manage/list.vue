<!-- 账号管理 -->
<template>
    <div>
        <div class="page-cap-title">
            账号管理
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">客户手机号:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 200px"
                            type="text"
                            clearable
                            placeholder="请输入手机号"
                            maxlength="15"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="mobile" label="联系方式" />
                <el-table-column prop="createTime" label="注册时间" />
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === '2'" class="list-status gray">注销</a>
                        <a v-else-if="scope.row.status === '1'" class="list-status red">锁定</a>
                        <a v-else-if="scope.row.status === '0'" class="list-status">正常</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status === '0'">
                            <a v-permission="'05060101'" class="link-btn color green" @click="clickLock(scope.row.id)">锁定</a>
                            <a v-permission="'05060102'" class="link-btn color red" @click="clickErase(scope.row.id)">注销</a>
                        </template>
                        <template v-else-if="scope.row.status === '1'">
                            <a v-permission="'05060101'" class="link-btn color green" @click="clickUnlock(scope.row.id)">解锁</a>
                        </template>
                        <a v-permission="'05060103'" class="link-btn color normal" @click="clickShowChangeData(scope.row.id)">变更记录</a>
                        <span v-if="checkPermissionNotExist('05060101,05060102,05060103')">--</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--            <div class="my-pagination-wrap">-->
            <!--                <my-pagination-->
            <!--                    :page-size="tableData.pageSize"-->
            <!--                    :total="tableData.count"-->
            <!--                    :current-page.sync="tableData.currentPage"-->
            <!--                    @current-change="handleCurrentChange"-->
            <!--                />-->
            <!--            </div>-->
        </div>

        <el-dialog
            title="变更记录"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="panelChangeShow"
            width="680px"
        >
            <div class="form-input-area" style="width: 100%;padding:0;margin: 10px 0 -10px 0">
                <div class="common-table" style="width: 100%;">
                    <el-table :data="changeDataList">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="变更时间" />
                        <el-table-column prop="updateType" label="变更原因">
                            <template slot-scope="scope">
                                <span v-if="scope.row.updateType === '0'">正常触发</span>
                                <span v-if="scope.row.updateType === '1'">手动触发</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="变更人" />
                        <el-table-column prop="updateStatus" label="变更后状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.updateStatus === '0'">正常</span>
                                <span v-if="scope.row.updateStatus === '1'">锁定</span>
                                <span v-if="scope.row.updateStatus === '2'">注销</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="my-pagination-wrap">
                    <my-pagination
                        :page-size="changeDataPageSize"
                        :total="changeDataCount"
                        :current-page.sync="changeDataCurrentPage"
                        @current-change="handleCurrentChange2"
                    />
                </div>
            </div>
        </el-dialog>
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
            phone: '' // 联系方式
        };

        panelChangeShow = false;

        changeDataList: any[] = [];
        changeDataPageSize= 10;
        changeDataCount = 0;
        changeDataCurrentPage= 1;

        keepChangeRecordId = '';

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/queryUserAccountByMobile', {
                mobile: this.search.phone
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.userId),
                        mobile: item.mobile,
                        createTime: item.createTime, // 注册时间
                        status: String(item.status) // 当前状态
                    });
                });
                this.tableData.data = list;
                // this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                // this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        handleCurrentChange2() {
            this.getChangeDataList();
        }

        async clickLock(id: string) {
            try {
                await this.$showMessageBox('是否锁定该账号?');
            } catch (e) {
                return;
            }

            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/updateUserAccount', {
                userId: id,
                status: 1 // 锁定
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('锁定成功');
                this.getDataList();
            } else {
                this.$showToast(resp?.message || '锁定失败');
            }
        }

        async clickUnlock(id: string) {
            try {
                await this.$showMessageBox('是否解锁该账号?');
            } catch (e) {
                return;
            }

            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/updateUserAccount', {
                userId: id,
                status: 0 // 正常
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('解锁成功');
                this.getDataList();
            } else {
                this.$showToast(resp?.message || '解锁失败');
            }
        }

        async clickErase(id: string) {
            try {
                await this.$showMessageBox('是否要注销该账号?');
            } catch (e) {
                return;
            }

            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/updateUserAccount', {
                userId: id,
                status: 2 // 注销
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('注销成功');
                this.getDataList();
            } else {
                this.$showToast(resp?.message || '注销失败');
            }
        }

        async clickShowChangeData(id: string) {
             this.keepChangeRecordId = id;
             this.changeDataCurrentPage = 1;
             this.getChangeDataList();
        }

        async getChangeDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/queryUserAccountUpdateLogListPage', {
                userId: this.keepChangeRecordId,
                page: this.changeDataCurrentPage // 正常
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.accountChangeLogId),
                        mobile: item.mobile,
                        createTime: item.createTime, // 变更时间
                        operator: item.operator, // 操作人
                        updateStatus: String(item.updateStatus), // 变更后状态
                        updateType: String(item.updateType) // 变更类型
                    });
                });
                this.changeDataList = list;
                this.changeDataCount = resp.data.totalCount;
                this.panelChangeShow = true;
            } else {
                this.changeDataList = [];
                this.changeDataCount = 0;
                this.$showToast(resp?.message || '解锁失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
