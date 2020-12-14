<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加权限字段
            </div>
            <div class="common-table" style="width: 100%;">
                <el-form>
                    <table class="permission-table">
                        <thead>
                            <tr>
                                <th style="width: 150px">
                                    一级菜单
                                    <a class="add-btn" @click="clickShowPanel(1, '', '', '','')">
                                        <el-icon class="el-icon-plus" />
                                    </a>
                                </th>
                                <th style="width: 150px">
                                    二级菜单
                                </th>
                                <th style="width: 150px">
                                    三级菜单
                                </th>
                                <th style="width: 150px">
                                    操作权限
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in dataList" :key="index">
                                <!--第1级-->
                                <td v-if="item.level1RowSpanNum > 0" :rowspan="item.level1RowSpanNum">
                                    <span class="level-span">{{ item.level1Name }}</span>
                                    <a class="add-btn" @click="clickShowPanel(2, item.level1Name, '','', item.level1Id)">
                                        <el-icon class="el-icon-plus" />
                                    </a>
                                </td>
                                <td v-if="item.level2RowSpanNum > 0" :rowspan="item.level2RowSpanNum">
                                    <!--第2级-->
                                    <span class="level-span">{{ item.level2Name }}</span>
                                    <a
                                        v-if="item.level2Name"
                                        class="add-btn"
                                        @click="clickShowPanel(3,item.level1Name, item.level2Name,'', item.level2Id)"
                                    >
                                        <el-icon class="el-icon-plus" />
                                    </a>
                                </td>
                                <td>
                                    <!--第3级-->
                                    <span class="level-span">{{ item.level3Name }}</span>
                                    <a
                                        v-if="item.level3Name"
                                        class="add-btn"
                                        @click="clickShowPanel(4, item.level1Name,item.level2Name,item.level3Name, item.level3Id)"
                                    >
                                        <el-icon class="el-icon-plus" />
                                    </a>
                                </td>
                                <td>
                                    <!--第4级-->
                                    <span v-for="(item3, idx3) in item.level3Items" :key="idx3" class="level-span">
                                        {{ item3.name }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-form>
            </div>
        </div>

        <el-dialog
            :title="`新增${addLevelString}权限`"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="addPanelShow"
            width="630px"
        >
            <div class="form-input-area" style="width: 100%;padding:0;margin: 10px 0 -10px 0">
                <el-form ref="dataForm" :model="editData" :rules="dataRule">
                    <el-form-item label="父级权限信息：" prop="oldPassword" label-width="120px">
                        <span v-if="addLevel === 1" style="font-weight: bold">
                            无
                        </span>
                        <span v-else-if="addLevel === 2" style="font-weight: bold">
                            【{{ editData.level1Name }}】
                        </span>
                        <span v-else-if="addLevel === 3" style="font-weight: bold">
                            【{{ editData.level1Name }}】-【{{ editData.level2Name }}】
                        </span>
                        <span v-else-if="addLevel === 4" style="font-weight: bold">
                            【{{ editData.level1Name }}】 - 【{{ editData.level2Name }}】 - 【{{ editData.level3Name }}】
                        </span>
                        <span style="margin-left: 20px;">{{ editData.levelCode }}</span>
                    </el-form-item>
                    <el-form-item label="添加权限等级：" prop="" label-width="120px">
                        {{ addLevelString }}
                    </el-form-item>
                    <el-form-item label="权限名称：" prop="permissionName" label-width="120px">
                        <el-input
                            v-model.trim="editData.permissionName"
                            autocomplete="off"
                            placeholder="请输入权限名称"
                            maxlength="6"
                            style="width: 250px;"
                        />
                    </el-form-item>
                    <el-form-item label="url：" prop="" label-width="120px">
                        <el-input
                            v-model.trim="editData.url"
                            autocomplete="off"
                            placeholder="请输入url"
                            maxlength="100"
                            style="width: 250px;"
                        />
                    </el-form-item>
                    <el-form-item style="text-align: center">
                        <el-button type="primary" @click="clickSureAddPermission">
                            确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Mixins} from 'vue-property-decorator';
    import menuMixins from './menumixins';

    const editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Mixins(menuMixins) {
        addPanelShow = false;
        addLevel = 1;
        addLevelString = '一级';

        editData = {
            level1Name: '', // 当前一级
            level2Name: '', // 当前2级
            level3Name: '', // 当前3级
            levelCode: '', // 当前code
            permissionName: '', // 添加的权限名
            url: '' // url
        };

        dataRule = {
            permissionName: [{required: true, message: '请输入权限名称'}]
        };

        mounted() {
            this.getData();
        }

        async getData() {
            this.$showLoading();
            const ret = await this.getAllMenu();
            if (ret !== 1) {
                return;
            }
            this.$closeLoading();
        }

        /* 渲染列表 */
        async getAllMenu() {
            const [err, resp] = await this.$getAsync('/menu/selectJsonMenu', {}, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                const data = resp.data;
                this.handleListData(data);
                return 1;
            } else {
                this.$closeLoading();
                this.$showToast('获取列表数据失败');
                return 0;
            }
        }

        clickShowPanel(level: number, level1Name: string, level2Name: string, level3Name: string, levelId: string) {
            this.addPanelShow = true;
            this.addLevel = level;
            this.addLevelString = ({
                1: '一级',
                2: '二级',
                3: '三级',
                4: '四级'
            } as any)[level];
            this.editData.level1Name = level1Name;
            this.editData.level2Name = level2Name;
            this.editData.level3Name = level3Name;
            this.editData.levelCode = levelId;
        }

        clickSureAddPermission() {
            this.$showMessageBox('确定保存吗').then(() => {
                this.doSave();
            }).catch(() => {
            });
        }

        async doSave() {
            // 获取这个list
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/menu/saveMenu', {
                levelnum: this.addLevel,
                name: this.editData.permissionName,
                parentCode: this.editData.levelCode,
                url: this.editData.url
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                this.getData();
                this.addPanelShow = false;
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
            this.$closeLoading();
        }

        async updatePermission() {
            const [_, resp2] = await this.$postAsync('/menu/getAllAuthCode', {});
            if (resp2?.code === '000000') {
                // 获取权限列表成功, 保存权限列表
                let list = resp2.data;
                if (!list) {
                    list = [];
                }
                const permissionList = list.map((item: any) => {
                    return String(item);
                });
                this.$store.dispatch('setPermissionList', {permissionList});
            }
        }

        clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.dataList);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch();
        }
    }
</script>

<style lang="scss" scoped>
    .common-table tbody tr:hover {
        background-color: transparent;
    }

    .permission-table {
        width: 100%;
        border: 1px solid #ddd;
        border-collapse: collapse;

        thead {
            tr th {
                font-size: 14px;
                color: #333;
                font-weight: normal;
                border: 1px solid #ddd;

                &:first-child,
                &:nth-child(2) {
                    width: 130px;
                }

                &:nth-child(3) {
                    width: 100px;
                }
            }
        }

        tbody {
            tr td {
                padding: 5px 15px;
                text-align: left;
                font-size: 14px;

                .el-checkbox {
                    margin: 8px 10px;
                }

                &:nth-child(3) {
                    /*text-align: center;*/
                }
            }

            tr td:last-child {
                padding-left: 20px;
            }
        }
    }

    .add-btn {
        color: $theme-font-color;
        font-weight: bold;
        border: 1px solid $theme-font-color;
        border-radius: 4px;
        font-size: 12px;
        padding: 0 4px;
        cursor: pointer;

        &:hover {
            border: 1px solid $theme-font-color;
            background-color: $theme-font-color;
            color: #fff;
        }
    }

    .level-span {
        font-size: 13px;
        display: inline-block;
        margin: 8px 10px;
        display: inline-block;
    }
</style>
