<template>
    <div>
        <div class="page-cap-title">
            短信场景
        </div>

        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">场景名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入场景名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">模板内容:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.content"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入模板内容"
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
                            <el-option value="1" label="启用" />
                            <el-option value="0" label="禁用" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'03050201'" type="primary" @click="clickAddScene">
                        <i class="el-icon-plus" />
                        添加场景
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="场景名称" />
                <el-table-column prop="content" label="模板内容">
                    <template slot-scope="scope">
                        <template v-if="scope.row.content.length > 20">
                            <el-tooltip
                                class="item"
                                popper-class="poshytips"
                                :visible-arrow="false"
                                placement="bottom"
                                :content="scope.row.content"
                            >
                                <span class="ellipsis">{{ scope.row.content.substr(0,20) + '...' }}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            {{ scope.row.content }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '启用' : '禁用' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            v-permission="'03050202'"
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEditScene(scope.row.id)"
                        >查看</a>
                        <span v-if="checkPermissionNotExist('03050202')">--</span>
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
            name: '', // 场景名称
            content: '', // 模板内容
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
            const [err, resp] = await this.$getAsync('/message/getMessageTemplateList', {
                page: this.tableData.currentPage,
                title: this.search.name,
                content: this.search.content,
                enable: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.messageTemplateId),
                        name: item.title, // 名称
                        content: item.content, // 位置
                        status: item.enable ? '1' : '0' // 状态
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

         clickAddScene() {
            this.$router.push({
                path: '/operate_manage/sms/scene/add'
            });
        }

         clickEditScene(id: string) {
            this.$router.push({
                path: '/operate_manage/sms/scene/edit',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
