<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                编辑权限
            </div>
            <div style="font-size: 18px;padding-top: 20px">
                系统账号: {{ account }} <span style="padding-left: 20px" />账号操作人姓名: {{ name }}
            </div>
            <div class="common-table" style="width: 100%;">
                <el-form>
                    <table class="permission-table">
                        <thead>
                            <tr>
                                <th>一级菜单</th>
                                <th>二级菜单</th>
                                <th>三级菜单</th>
                                <th>操作权限</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in dataList" :key="index">
                                <!--第1级-->
                                <td v-if="item.level1RowSpanNum > 0" :rowspan="item.level1RowSpanNum">
                                    <el-checkbox
                                        v-model="item.level1Checked"
                                        :data-id="item.level1Id"
                                        :disabled="item.level1Id === '10000'"
                                        @change="onLevel1Change(item.level1Id, $event)"
                                    >
                                        {{ item.level1Name }}{{ item.level1Id }}
                                    </el-checkbox>
                                </td>
                                <td v-if="item.level2RowSpanNum > 0" :rowspan="item.level2RowSpanNum">
                                    <template v-if="item.level2Name">
                                        <el-checkbox
                                            v-model="item.level2Checked"
                                            :data-id="item.level2Id"
                                            @change="onLevel2Change(item.level2Id, $event)"
                                        >
                                            {{ item.level2Name }}{{ item.level2Id }}
                                        </el-checkbox>
                                    </template>
                                </td>
                                <td>
                                    <!--第3级-->
                                    <template v-if="item.level3Name">
                                        <el-checkbox
                                            v-model="item.level3Checked"
                                            :data-id="item.level3Id"
                                            @change="onLevel3Change(item.level3Id, $event)"
                                        >
                                            {{ item.level3Name }}{{ item.level3Id }}
                                        </el-checkbox>
                                    </template>
                                </td>
                                <td>
                                    <!--第4级-->
                                    <el-checkbox
                                        v-for="(item3, idx3) in item.level3Items"
                                        :key="idx3"
                                        v-model="item3.checked"
                                        :data-id="item3.id"
                                        @change="onLevel4Change(item3.id, $event)"
                                    >
                                        {{ item3.name }}{{ item3.id }}
                                    </el-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-form>
            </div>
            <div class="form-submit-line" style="width: 1000px;margin-top: 20px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button type="primary" @click="clickSavePermission">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import menuMixins from './menumixins';

    let editDataSnapshot = '';
    @Component({
        components: {}
    })
    export default class extends Mixins(menuMixins) {
        id = '';
        account = '';
        name = '';
        canEdit = true;

        mounted() {
            this.id = String(this.$route.query.id);
            if (this.id === '' || this.id === 'undefined') {
                this.$showToast('id参数不正确');
                return;
            }

            if (!this.$store.getters.permissionList.includes('60108')) {
                this.canEdit = false;
            }
            this.getPersonInfo();
            this.getData();
        }

        async getPersonInfo() {
            const [err, resp] = await this.$postAsync('/admin/findSupervisorId', {
                supervisorId: this.id
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.account = resp.data.name || '';
                this.name = resp.data.realityName || '';
            }
        }

        async getData() {
            this.$showLoading();
            const ret = await this.getAllMenu();
            if (ret !== 1) {
                return;
            }
            await this.getAllAuth();
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

        /* 获取权限 */
        async getAllAuth() {
            /* 查询我的字段 */
            const [err2, resp2] = await this.$postAsync('/menu/getAllAuthCode', {
                id: this.id
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp2?.code === '000000') {
                const permissionList = resp2.data || [];
                for (const i in this.dataList) {
                    if (!this.dataList.hasOwnProperty(i)) {
                        continue;
                    }
                    const objData = this.dataList[i];
                    if (objData.level1Id) {
                        objData.level1Checked = permissionList.includes(objData.level1Id);
                    }
                    if (objData.level2Id) {
                        objData.level2Checked = permissionList.includes(objData.level2Id);
                    }
                    if (objData.level3Id) {
                        objData.level3Checked = permissionList.includes(objData.level3Id);
                    }
                    if (objData.level3Items) {
                        for (let j = 0; j < objData.level3Items.length; ++j) {
                            const objData3 = objData.level3Items[j];
                            if (objData3.id) {
                                objData3.checked = permissionList.includes(objData3.id);
                            }
                        }
                    }
                }
            }

            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.dataList);
            }, 50);
        }

        clickSavePermission() {
            this.$showMessageBox('确定保存吗').then(() => {
                this.doSave();
            }).catch(() => {
            });
        }

        async doSave() {
            // 获取这个list
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/menu/updateAuthCode', {
                list: this.getUploadData(),
                supervisorId: this.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                this.getData();
                // 再刷新下权限
                this.updatePermission();
            }
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

        // 生成上传的数据
        getUploadData() {
            const listPermissionHub: string[] = [];
            // console.log(this.dataList);
            this.dataList.forEach((item: any) => {
                if (item.level1Checked) {
                    listPermissionHub.push(item.level1Id);
                }
                if (item.level2Checked) {
                    listPermissionHub.push(item.level2Id);
                }
                if (item.level3Checked) {
                    listPermissionHub.push(item.level3Id);
                }
                if (item.level3Items) {
                    for (let j = 0; j < item.level3Items.length; ++j) {
                        const objData4 = item.level3Items[j];
                        if (objData4.checked) {
                            // console.log(objData4.id);
                            listPermissionHub.push(objData4.id);
                        }
                    }
                }
            });
            const updateData = Array.from(new Set(listPermissionHub)); // 去重
            return updateData.sort(); // 变成字符串
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
</style>
