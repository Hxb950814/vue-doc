<!-- 查看意见反馈列表-->
<template>
    <div>
        <div class="page-cap-title">
            版本管理
        </div>

        <div class="options-btn" >
            <el-button  v-permission="'03090101'" type="primary" @click="clickEdit(0)">
                添加
            </el-button>
        </div>
        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="versionName" label="版本号" />
                <el-table-column prop="versionCode" label="版本代码" />
                <el-table-column label="系统类型">
                    <template slot-scope="scope">
                        <span>{{ ['', 'Android', 'IOS', 'Android,Ios'][scope.row.type] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否强制更新">
                    <template slot-scope="scope">
                        <span>{{ scope.row.flag === 0 ? '否': '是' }}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="当前状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.used === 0 ? '关闭': '启用' }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="operator" label="操作" width="150">
                    <template slot-scope="scope">
                        <a v-permission="'03090102'" class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.id)">
                            查看</a>
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
            <el-dialog
                v-if="optionsModalVisible"
                :title="modalText"
                :center="true"
                :visible.sync="optionsModalVisible"
                width="500px"
            >
                <OptionsModalView ref="OptionsModalView" @successEvent="successEvent" @checkTitle="checkTitle"/>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import OptionsModalView from './optionModal.vue';
    import commonTable from '@/mixins/commonTable';
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    @Component({
        components: {
            OptionsModalView
        }
    })
    export default class extends Mixins(commonTable) {
         search: any = {
            name: '', // 图片名称
            position: '', // 图片位置
            startTime: '', // 发布时间起始
            endTime: '', // 发布时间截止
            status: '' // 状态
        };

         searchStartTimeOpt: any = {};
         searchEndTimeOpt: any = {};

        optionsModalVisible = false // 操作管理版本的弹框  是否启动
        modalText = ''; // 弹框的title

        mounted() {
            this.searchData();
        }

         searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

         async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/app/findAppEditionListPage', {
                page: this.tableData.currentPage
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: item.appEditionId,
                        versionCode: item.versionCode, // versionCode版本
                        versionName: item.versionName, // versionName版本号
                        time: item.time, // 发布时间
                        used: item.used, // 当前状态
                        versionUrl: item.versionUrl || '-', // versionUrl下载链接
                        summary: item.summary, // summary更新内容
                        flag: item.flag, // lag是否强制更新： 0 否 1 是
                        type: item.type // type1 =ad ；2= ios ； 3=ad andIOS；
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

         clickEdit(id: number) {
           // id:为0则代表是添加操作  则代表为查看并且编辑操作
             this.modalText = id ? '查看版本' : '添加版本';
             this.optionsModalVisible = true;
             setTimeout(() => {
                 (this.$refs.OptionsModalView as any).active(id);
             }, 0);
        }

        successEvent() {
            // 操作成功
            this.optionsModalVisible = false;
            this.getDataList();
        }

        checkTitle(type:number) {
            // 改变弹框的title
            this.modalText = type === 1 ? '编辑版本' : '查看版本';
        }
    }
</script>

<style lang="scss" scoped>
    .options-btn{
        display: flex;
        width: 100%;
        margin: 10px 0;
        justify-content: flex-end;
    }
</style>
