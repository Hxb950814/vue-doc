<template>
    <div>
        <div class="page-cap-title">
            图片管理
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">图片名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入图片名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">图片位置:</span>
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
                    <span class="words">发布时间:</span>
                    <div class="input-text">
                        <el-date-picker
                            v-model="search.startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="开始时间"
                            :picker-options="searchStartTimeOpt"
                            style="width:185px"
                        />
                        <span class="connecting-line">-</span>
                        <el-date-picker
                            v-model="search.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="结束时间"
                            :picker-options="searchEndTimeOpt"
                            style="width:185px"
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
                    <el-button v-permission="'03020101'" type="primary" @click="clickAddBanner">
                        <i class="el-icon-plus" />
                        添加Banner
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" width="300" label="图片名称">
                    <template slot-scope="scope">
                        <template v-if="scope.row.name.length > 20">
                            <el-tooltip
                                class="item"
                                popper-class="poshytips"
                                :visible-arrow="false"
                                placement="bottom"
                                :content="scope.row.name"
                            >
                                <span class="ellipsis">{{ scope.row.name.substr(0,20) + '...' }}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            {{ scope.row.name }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="图片位置" />
                <el-table-column prop="order" label="顺序" />
                <el-table-column prop="channel" label="显示渠道" width="150" />
                <el-table-column prop="pv" label="PV" />
                <el-table-column prop="uv" label="UV" />
                <el-table-column prop="publishTime" label="发布时间" width="150" />
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1' ? '显示' : '隐藏' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="120">
                    <template slot-scope="scope">
                        <a v-permission="'03020102'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">查看</a>
                        <a v-if="scope.row.status === '1'" v-permission="'03020103'" class="link-btn color red" style="margin: 0 5px" @click="clickShow(scope.row.id)">隐藏</a>
                        <a v-if="scope.row.status !== '1'" v-permission="'03020103'" class="link-btn color orange" style="margin: 0 5px" @click="clickShow(scope.row.id)">显示</a>
                        <span v-if="checkPermissionNotExist('03020102,03020103')">---</span>
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
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

         searchStartTimeOpt: any = {};
         searchEndTimeOpt: any = {};
         listIconPrice: any[] = [];

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

         async getSearchSelectList() {
            const [err, resp] = await this.$postAsync('/banner/bannerSelectInfo');
            if (resp?.code === '000000') {
                this.listIconPrice = (resp?.data || []).map((item: any) => ({
                    name: item.name,
                    value: String(item.value)
                }));
            }
        }

         searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.search, [
                'startTime', /* 第一个输入框 */
                'endTime' /* 第二个输入框 */
            ]);

            this.searchStartTimeOpt.disabledDate = limitFuns[0];
            this.searchEndTimeOpt.disabledDate = limitFuns[1];
        }

         async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/banner/getBannerList', {
                page: this.tableData.currentPage,
                imageTitle: this.search.title,
                startTime: this.search.startTime,
                endTime: this.search.endTime,
                positionId: this.search.position,
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
                        id: String(item.bannerId),
                        name: item.imageTitle, // 名字
                        position: item.positionName, // 位置
                        order: item.sortby, // 顺序
                        publishTime: item.startTime || '--', // 发布时间
                        pv: item.pv, // pv
                        uv: item.pv, // uv
                        channel: this.getChannelStr(String(item.displayPlatform || '')),
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

         handleCurrentChange() {
            this.getDataList();
        }

         clickAddBanner() {
            this.$router.push({
                path: '/operate_manage/pictures/add'
            });
        }

         clickEdit(id: string) {
            this.$router.push({
                path: '/operate_manage/pictures/edit',
                query: {
                    id
                }
            });
        }

         async clickShow(id: string) {
            this.$showMessageBox('是否确定显示?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/banner/updateBanner', {
                        bannerId: id
                    }, {
                        paramType: 'form'
                    });
                    this.getDataList();
                })();
            }).catch(() => {
            });
        }

         async clickHide(id: string) {
            this.$showMessageBox('是否确定隐藏?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/banner/updateBanner', {
                        bannerId: id
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
