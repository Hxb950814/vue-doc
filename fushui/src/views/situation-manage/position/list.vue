<!-- 持仓数据 -->
<template>
    <div>
        <div class="page-cap-title">
            持仓数据
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">时间:</span>
                    <div class="input-text">
                        <el-date-picker
                            v-model="search.startTime"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="开始时间"
                            :picker-options="searchStartTimeOpt"
                            style="width:185px"
                        />
                        <span class="connecting-line">-</span>
                        <el-date-picker
                            v-model="search.endTime"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="结束时间"
                            :picker-options="searchEndTimeOpt"
                            style="width:185px"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'06050101'" type="primary" @click="showModifyPanel">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                    <el-button type="primary" @click="clickDownload">
                        下载持仓数据
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="time" label="日期" />
                <el-table-column prop="volume" label="市场成交量" />
                <el-table-column prop="increaseDecrease" label="市场增减" />
                <el-table-column prop="normalOpenInterest" label="多单持仓量" />
                <el-table-column prop="normalIncreaseDecrease" label="多单增减" />
                <el-table-column prop="invertedOpenInterest" label="空单持仓量" />
                <el-table-column prop="invertedIncreaseDecrease" label="空单增减" />
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <div v-if="!checkPermissionNotExist('06050102')">
                            <div v-if="!scope.row.isErased">
                                <a
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickEdit(scope.row)"
                                >查看</a>
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

        <el-dialog
            title="修改数据"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="modifyPanelShow"
            width="500px"
        >
            <el-form ref="dataForm" class="form-data form-style form-input-area" :model="editData" :rules="dataRule">
                <el-form-item label="数据日期：" prop="date" label-width="120px">
                    <el-date-picker
                        v-model="editData.date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="请选择时间"
                        style="width:185px"
                    />
                </el-form-item>
                <el-form-item label="数据：" prop="marketDataFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.marketDataFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传市场数据"
                        tips="只能上传excel文件，文件大小小于50M"
                    />
                </el-form-item>
                <el-form-item label="" prop="moreFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.moreFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传多单数据"
                        tips="只能上传excel文件，文件大小小于50M"
                        style="margin-top:12px"
                    />
                </el-form-item>
                <el-form-item label="" prop="shortFile" label-width="120px">
                    <my-file-upload
                        :url.sync="editData.shortFile"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :max-size="50"
                        btn-text="上传空单数据"
                        tips="只能上传excel文件，文件大小小于50M"
                        style="margin-top:12px"
                    />
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px;margin-bottom: 10px">
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import MyFileUpload from '@/components/MyFileUpload.vue';

    @Component({
        components: {MyFileUpload}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            startTime: '',
            endTime: ''
        };

        editData: any = {
            date: '',
            marketDataFile: '',
            shortFile: '',
            moreFile: ''
        };

        dataRule: any = {
            date: [{required: true, message: '请输入数据日期', trigger: 'blur'}]
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};

        modifyPanelShow = false;

        mounted() {
            this.searchDateTimeLimit();
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

        showModifyPanel() {
            this.editData.date = '';
            this.editData.marketDataFile = '';
            this.editData.moreFile = '';
            this.editData.shortFile = '';
            this.modifyPanelShow = true;
            (this.$refs.dataForm as ElForm).resetFields();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        /* 下载 */
        async clickDownload() {
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/position/downFile', {
                date: this.search.startTime || '' // 起始时间
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.modifyPanelShow = false;
                this.$showToast('下载中，下载链接稍后发送到钉钉');
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/position/selectPositionDataTotalListPage', {
                page: this.tableData.currentPage,
                startTime: this.search.startTime,
                endTime: this.search.endTime
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.positionDataId),
                        time: dayjs(item.time).format('YYYY-MM-DD'), // 日期
                        volume: item.volume, // 市场成交量
                        increaseDecrease: item.increaseDecrease, // 市场增减
                        normalOpenInterest: item.normalOpenInterest, // 多单持仓量
                        normalIncreaseDecrease: item.normalIncreaseDecrease, // 多单增减
                        invertedIncreaseDecrease: item.invertedIncreaseDecrease, // 空单增减
                        invertedOpenInterest: item.invertedOpenInterest, // 空单持仓量
                        status: Number(item.status)
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

        clickEdit(row: any) {
            this.$router.push({
                path: '/situation_manage/position/detail',
                query: {
                    id: row.id,
                    time: row.time.split(' ')[0]
                }
            });
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    if (this.editData.marketDataFile === '' &&
                        this.editData.shortFile === '' &&
                        this.editData.moreFile === '') {
                        this.$showToast('请至少上传一份数据文件');
                        return;
                    }

                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                cover: 1, // 覆盖
                date: this.editData.date,
                inverted: this.editData.shortFile, // 空单文件
                market: this.editData.marketDataFile, // 市场文件
                normal: this.editData.moreFile // 多单文件
            };
            const [err, resp] = await this.$postAsync('/position/batchUpload', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.modifyPanelShow = false;
                this.$showToast('添加成功');
                // setTimeout(() => {
                //     、、this.$router.back();
                // }, 300);
                this.getDataList();
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
