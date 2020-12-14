<!--通道设置-->
<template>
    <div>
        <div class="page-cap-title">
            通道设置
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">通道名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入通道名称"
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
                            <el-option value="1" label="可用" />
                            <el-option value="0" label="禁用" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'04040201'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加通道
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="通道名称" />
                <el-table-column prop="channelName" label="显示渠道" />
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '可用' : '禁用' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="累计交易额/元">
                    <template slot-scope="scope">
                        {{ scope.row.amount | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="person" label="最近操作人" />
                <el-table-column prop="time" label="最近操作时间" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a v-permission="'04040202'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <a
                            v-if="scope.row.status === '1'"
                            v-permission="'04040203'"
                            class="link-btn color red"
                            style="margin: 0 5px"
                            @click="clickHide(scope.row.id)"
                        >禁用</a>
                        <a
                            v-if="scope.row.status === '0'"
                            v-permission="'04040203'"
                            class="link-btn color green"
                            style="margin: 0 5px"
                            @click="clickShow(scope.row.id)"
                        >启用</a>
                        <span v-if="checkPermissionNotExist('04040202,04040203')">--</span>
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
    import {getChannelStr} from '@/utils/helper';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            name: '', // 通道名称
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
            const [err, resp] = await this.$postAsync('/kbeansPassagewaySet/getKbeansPassagewaySetList', {
                page: this.tableData.currentPage,
                passagewayName: this.search.name,
                display: this.search.status
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.beanPassagewaySetId),
                        name: item.passagewayName, // 名称
                        channelName: getChannelStr(item.displayPlatform) || '', // 名称
                        amount: item.amount, // 累计交易额
                        time: item.updateTime || '--', // 时间
                        person: item.adminUserName || '--', // 操作人
                        status: item.display ? '1' : '0' // 状态
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
                path: '/kcoin_manage/channel_settings/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/kcoin_manage/channel_settings/edit',
                query: {
                    id
                }
            });
        }

        async clickHide(id: string) {
            this.$showMessageBox('是否确定禁用?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/kbeansPassagewaySet/updateKbeansPassagewaySet', {
                        kbeansPassagewaySetId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }

        clickShow(id: string) {
            this.$showMessageBox('是否确定启用?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/kbeansPassagewaySet/updateKbeansPassagewaySet', {
                        kbeansPassagewaySetId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
