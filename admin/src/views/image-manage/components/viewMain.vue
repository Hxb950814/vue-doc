<template>
    <div>
        <div class="nav-common-search">
            <div class="search-line">
                <div v-if="mode === '8'" class="search-union">
                    <span class="words">广告位置:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.positionId"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option v-for="(item,index) in toolsData" :key="index" :value="item.value" :label="item.name" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">展示状态:</span>
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
                <div class="search-union">
                    <span class="words">{{ mode === '8' ? 'Banner': title }}名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickIcon">
                        <i class="el-icon-plus" />
                        {{ title }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" width="300" :label="nameLabel" />
                <el-table-column v-if="mode === '8'" label="广告位置">
                    <template slot-scope="scope">
                        <span>{{ scope.row.positionName }}</span>
                    </template>
                </el-table-column>
                <template v-if="mode === '3'">
                    <el-table-column prop="positionName" width="130" label="工具类型" />
                    <el-table-column prop="indexShow" width="130" label="是否推荐">
                        <template slot-scope="scope">
                            {{ scope.row.indexShow ? '否': '是' }}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="H5">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channel.indexOf(0) !== -1 ? '支持' : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="IOS">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channel.indexOf(1) !== -1 ? '支持' : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Android">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channel.indexOf(2) !== -1 ? '支持' : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="展示状态" width="100">
                    <template slot-scope="scope">
                        <a class="list-status" :class="{disabled: scope.row.status !== '1'}">{{ scope.row.status === '1'
                            ? '显示' : '隐藏' }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="展示顺序" />
                <el-table-column prop="pv" label="累计PV" />
                <el-table-column prop="uv" label="累计UV" />

                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <a
                            class="link-btn color red"
                            style="margin: 0 5px"
                            @click="clickDelete(scope.row.id)"
                        >删除</a>
                        <!--                        <a-->
                        <!--                            v-if="scope.row.status !== '1'"-->
                        <!--                            class="link-btn color orange"-->
                        <!--                            style="margin: 0 5px"-->
                        <!--                            @click="clickShow(scope.row.id)"-->
                        <!--                        >显示</a>-->
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
    import {Component, Watch, Vue, Mixins, Prop} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({})
    export default class extends Mixins(commonTable) {
        @Prop({type: String, default: '1', required: false})
        mode!:string;

        @Prop({type: String, default: '添加ICON', required: false})
        title!:string;

        search: any = {
            title: '', // 图片名称
            status: '', // 状态
            positionId: ''
        };

        nameLabel = '';

        toolsData:any = [];

        mounted() {
            this.searchData();
            this.getToolsData();
            this.nameLabel = Number(this.mode) > 7 ? this.title + '名称' : 'ICON名称';
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList(this.search);
        }

        async getToolsData() {
            const [err, resp] = await this.$postAsync('/icon/iconSelectInfo ');
            if (resp?.code === '000000') {
                this.toolsData = (resp?.data || []).map((item: any) => ({
                    name: item.name,
                    value: String(item.value)
                }));
            }
        }

        async getDataList(data:any) {
            this.$showLoading();
            let requestObj = {};
            if (this.mode !== '8') {
                requestObj = {
                    page: this.tableData.currentPage,
                    imageTitle: data.title,
                    iconCategoryId: this.mode,
                    display: data.status
                };
            } else {
                requestObj = {
                    page: this.tableData.currentPage,
                    imageTitle: data.title,
                    iconCategoryId: this.mode,
                    display: data.status,
                    positionId: data.positionId
                };
            }
            const [err, resp] = await this.$postAsync('/icon/geticonList', requestObj, {
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
                        channel: item.displayPlatform,
                        indexShow: !!item.indexShow, // 是否主页显示
                        positionName: item.positionName, // 是否主页显示
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
            this.getDataList(this.search);
        }

        clickEdit(id: string) {
            let path = '/image_manage/';
            switch (this.mode) {
                case '7':
                    path = path + 'pictures/edit';
                    break;
                case '8':
                    path = path + 'notices/edit';
                    break;
                default:
                    path = path + 'icons/edit';
                    break;
            }
            this.$router.push({
                path,
                query: {
                    id,
                    mode: String(this.mode),
                    title: this.title
                }
            });
        }

        clickIcon() {
            let path = '/image_manage/';
            switch (this.mode) {
                case '7':
                    path = path + 'pictures/add';
                    break;
                case '8':
                    path = path + 'notices/add';
                    break;
                default:
                    path = path + 'icons/add';
                    break;
            }
            this.$router.push({
                path,
                query: {
                    mode: String(this.mode),
                    title: this.title
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
                    this.searchData();
                })();
            }).catch(() => {
            });
        }

        async clickDelete(id: string) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/icon/deleteIcon', {
                        iconId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
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
