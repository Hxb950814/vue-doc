<!-- 账号管理 -->
<template>
    <div>
        <div class="page-cap-title">
            账号管理
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">系统账号:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.account"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入客户联系方式"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">操作人姓名:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入姓名"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">当前状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="正常" />
                            <el-option value="2" label="锁定" />
                            <el-option value="3" label="已注销" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'09010101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        新增账号
                    </el-button>
                    <el-button v-permission="'09010104'" type="primary" @click="clickAddPermission">
                        <i class="el-icon-s-custom" />
                        新增权限字段
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="系统账号" />
                <el-table-column prop="realityName" label="操作者姓名" />
                <el-table-column prop="telephone" label="操作者联系方式" />
                <el-table-column prop="appInfo" label="当前状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.isErased" class="list-status gray">已注销</a>
                        <a v-else-if="scope.row.isLocked" class="list-status red">锁定</a>
                        <a v-else class="list-status">正常</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="260">
                    <template slot-scope="scope">
                        <div v-if="!checkPermissionNotExist('09010102,09010103')">
                            <div v-if="!scope.row.isErased">
                                <a
                                    v-if="!scope.row.isLocked"
                                    v-permission="'09010103'"
                                    class="link-btn color orange"
                                    style="margin: 0 5px"
                                    @click="clickLock(scope.row.id)"
                                >锁定</a>
                                <a
                                    v-if="scope.row.isLocked"
                                    v-permission="'09010103'"
                                    class="link-btn color green"
                                    style="margin: 0 5px"
                                    @click="clickUnLock(scope.row.id)"
                                >解锁</a>
                                <a
                                    v-permission="'09010103'"
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickPermission(scope.row.id)"
                                >权限</a>
                                <a
                                    v-permission="'09010102'"
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickEdit(scope.row.id)"
                                >查看</a>
                                <a
                                    v-permission="'09010103'"
                                    class="link-btn color red"
                                    style="margin: 0 5px"
                                    @click="clickErase(scope.row.id)"
                                >注销</a>
                                <a
                                    v-permission="'09010103'"
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickResetPassword(scope.row.id)"
                                >密码重置</a>
                            </div>
                            <div v-else>
                                --
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
            account: '', // 账号
            name: '', // 名字
            status: '' // 状态
        };
        //  addPanelShow = false;

        editData = {
            level1Id: '',
            level2Id: '',
            level3Id: '',
            permissionName: ''
        };

        dataRule = {
            permissionName: [{required: true, message: '请输入权限名称'}]
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
            const [err, resp] = await this.$postAsync('/admin/list', {
                page: this.tableData.currentPage,
                name: this.search.account,
                createrName: this.search.name,
                isErased: this.search.status
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.supervisorId),
                        name: item.name, // 系统账号
                        realityName: item.realityName, // 操作者姓名
                        telephone: item.telephone, // 操作者联系方式
                        isLocked: !item.isAllowLogin, // 0 = 不能登录（锁定）
                        isErased: Number(item.isErased) === 3 // 注销
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
                path: '/permission_manage/accounts/add'
            });
        }

        clickAddPermission() {
            this.$router.push({
                path: '/permission_manage/accounts/permission_menu_add'
            });
        }

        clickEdit(id: string, status: string) {
            this.$router.push({
                path: '/permission_manage/accounts/edit',
                query: {
                    id
                }
            });
        }

        clickLock(id: string) {
            this.$showMessageBox('是否确定要锁定该账号?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/admin/updateAllowLogin', {
                        id,
                        falg: 2
                    }, {
                        paramType: 'form'
                    });
                    if (resp?.code === '000000') {
                        this.$showToast('锁定成功');
                        this.tableData.currentPage = 1;
                        this.getDataList();
                    } else {
                        this.$showToast('锁定失败');
                    }
                })();
            }).catch(() => {
            });
        }

        clickUnLock(id: string) {
            this.$showMessageBox('是否确定要解锁该账号？', '账号解除锁定').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/admin/updateAllowLogin', {
                        id,
                        falg: 1
                    }, {
                        paramType: 'form'
                    });
                    if (resp?.code === '000000') {
                        this.$showToast('解除锁定成功');
                        this.tableData.currentPage = 1;
                        this.getDataList();
                    }
                })();
            });
        }

        clickPermission(id: string) {
            this.$router.push({
                path: '/permission_manage/accounts/permission_setting',
                query: {
                    id
                }
            });
        }

        clickErase(id: string) {
            this.$showMessageBox('是否要确定要注销该账号?', '账号注销').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/admin/delete', {
                        id
                    }, {
                        paramType: 'form'
                    });
                    if (resp?.code === '000000') {
                        this.$showToast('注销账号成功');
                        this.tableData.currentPage = 1;
                        this.getDataList();
                    } else if (resp?.message) {
                        this.$showToast(resp.message);
                    } else {
                        this.$showToast('注销账号失败');
                    }
                })();
            }).catch(() => {
            });
        }

        clickResetPassword(id: string) {
            this.$showMessageBox('是否确定要重置该账号的密码?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/admin/resetPassword', {
                        id
                    }, {
                        paramType: 'form'
                    });
                    if (resp?.code === '000000') {
                        this.$showToast('密码重置成功');
                        this.tableData.currentPage = 1;
                        this.getDataList();
                    } else if (resp?.message) {
                        this.$showToast(resp.message);
                    } else {
                        this.$showToast('密码重置失败');
                    }
                })();
            }).catch(() => {
            });
        }

        clickSureAddPermission() {

        }
    }
</script>

<style lang="scss" scoped>
</style>
