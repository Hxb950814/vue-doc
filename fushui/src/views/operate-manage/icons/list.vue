<template>
    <div>
        <div class="page-cap-title">
            Icon管理
        </div>

        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">icon名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入icon名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">icon位置:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.position"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,index) in listIconPrice"
                                :key="index"
                                :value="item.value"
                                :label="item.name"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">icon类型:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.type"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,index) in listIconType"
                                :key="index"
                                :value="item.value"
                                :label="item.name"
                            />
                        </el-select>
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
                            <el-option value="1" label="显示" />
                            <el-option value="0" label="隐藏" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'03030101'" type="primary" @click="clickAddBanner">
                        <i class="el-icon-plus" />
                        添加Icon
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" width="300" label="Icon名称" />
                <el-table-column prop="position" label="Icon位置" />
                <el-table-column prop="type" label="Icon类型" />
                <el-table-column prop="order" label="顺序" />
                <el-table-column prop="channel" label="显示渠道" width="120" />
                <el-table-column prop="pv" label="PV" />
                <el-table-column prop="uv" label="UV" />
                <el-table-column prop="isMain" label="主页显示" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.isMain ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '显示' : '隐藏' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            v-permission="'03030102'"
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <a
                            v-if="scope.row.status === '1'"
                            v-permission="'03030103'"
                            class="link-btn color red"
                            style="margin: 0 5px"
                            @click="clickHide(scope.row.id)"
                        >隐藏</a>
                        <a
                            v-if="scope.row.status !== '1'"
                            v-permission="'03030103'"
                            class="link-btn color orange"
                            style="margin: 0 5px"
                            @click="clickShow(scope.row.id)"
                        >显示</a>
                        <span v-if="checkPermissionNotExist('03030102,03030103')">--</span>
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
            title: '', // 图片名称
            position: '', // 图片位置
            type: '', // 類型
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

        listIconPrice: any[] = [];
        listIconType: any[] = [];

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        mounted() {
            // this.tableData.currentPage = 1;
            this.searchDateTimeLimit();
            this.getSearchSelectList();
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.search, [
                'startTime', /* 第一个输入框 */
                'endTime' /* 第二个输入框 */
            ]);

            this.searchStartTimeOpt.disabledDate = limitFuns[0];
            this.searchEndTimeOpt.disabledDate = limitFuns[1];
        }

        async getSearchSelectList() {
            const [err, resp] = await this.$postAsync('/icon/iconSelectInfo');
            if (resp?.code === '000000') {
                this.listIconPrice = (resp?.data?.listIconPrice || []).map((item: any) => ({
                    name: item.name,
                    value: item.value
                }));
                this.listIconType = (resp?.data?.listIconType || []).map((item: any) => ({
                    name: item.name,
                    value: item.value
                }));
            }
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/icon/geticonList', {
                page: this.tableData.currentPage,
                imageTitle: this.search.title,
                positionId: this.search.position,
                iconCategoryId: this.search.type,
                type: this.search.type,
                display: this.search.status
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.iconId),
                        name: item.imageTitle, // 名字
                        type: item.iconCategoryName, // 类型
                        position: item.positionName, // 位置
                        order: item.sortby, // 顺序
                        pv: item.pv, // pv
                        uv: item.uv, // uv
                        channel: this.getChannelStr(String(item.displayPlatform || '')),
                        isMain: !!item.indexShow, // 是否主页显示
                        status: String(item.display ? 1 : 0) // 状态
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

        clickAddBanner() {
            this.$router.push({
                path: '/operate_manage/icons/add'
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/icons/edit',
                query: {
                    id
                }
            });
        }

        async clickShow(id: string) {
            // debugger
            this.$showMessageBox('是否确定显示?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/icon/updateIcon', {
                        iconId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }

        async clickHide(id: string) {
            // debugger
            this.$showMessageBox('是否确定隐藏?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/icon/updateIcon', {
                        iconId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
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
            }).join(',') || '-';
        }
    }
</script>

<style lang="scss" scoped>
</style>
