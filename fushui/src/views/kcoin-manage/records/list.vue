<!--  K豆记录-->
<template>
    <div>
        <div class="page-cap-title">
            K豆记录
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">联系方式:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入联系方式"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">类型:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.type"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,index) in typeList"
                                :key="index"
                                :value="item.value"
                                :label="item.name"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">交易时间:</span>
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
                            default-time="23:59:59"
                            style="width:185px"
                        />
                    </div>
                </div>

                <div class="search-union">
                    <span class="words">交易原因:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.causeText"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入交易原因"
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
                    <el-button v-permission="'04030101'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="phone" label="联系方式" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="time" label="交易时间" />
                <el-table-column prop="number" label="K豆数量/个" />
                <el-table-column prop="balance" label="交易后K豆数量/个" />
                <el-table-column prop="causeText" label="交易原因" />
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
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import {getDownloadFileName, downloadFileFromBlob} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            phone: '', // 联系方式
            type: '', // 类型id
            causeText: '', // 交易原因
            startTime: '', // 交易时间
            endTime: '', // 结束时间
            status: '' // 状态
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};
        typeList: any = [];

        mounted() {
            this.searchDateTimeLimit();
            this.getTypeListData();
            this.getDataList();
        }

        async getTypeListData() {
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'type_id'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.typeList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
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
            this.searchStartTimeOpt.shortcuts = [{
                text: '一周前',
                onClick(picker: any) {
                    picker.$emit('pick', new Date(Date.now() - 3600 * 1000 * 24 * 7));
                }
            }];
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/beanRecordCtrl/beanRecordList', {
                page: this.tableData.currentPage,
                mobile: this.search.phone, //
                typeId: this.search.type, // 类型
                causeText: this.search.causeText, // 交易原因
                startTime: this.search.startTime, // 起始时间
                endTime: this.search.endTime // 结束时间
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.recordId),
                        phone: item.mobile, // 电话
                        type: item.typeText, // 类型
                        time: item.createTime || '--', // 交易时间
                        number: item.number, // 交易数量
                        balance: item.balance, // 剩余数量
                        causeText: item.causeText // 交易原因
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

        clickEdit(id: string) {
            this.$router.push({
                path: '/kcoin_manage/orders/edit',
                query: {
                    id
                }
            });
        }

        /* 下载 */
        clickDownload() {
            // const conf: any = {
            //     mobile: this.search.phone, //
            //     typeId: this.search.type, // 类型
            //     causeText: this.search.causeText, // 交易原因
            //     startTime: this.search.startTime, // 起始时间
            //     endTime: this.search.endTime // 结束时间
            // };
            // let params = '';
            // for(let i in conf){
            //     if(conf.hasOwnProperty(i)){
            //         params += `&${i}=${encodeURIComponent(conf[i])}`;
            //     }
            // }
            // params = params.substring(1);

            // this.$get('').then();
            // window.open(location.origin  + '/api/beanRecordCtrl/recordListExcel?' + params, '__blank');

            // 下载文件
            this.$showLoading();
            this.$get('/beanRecordCtrl/recordListExcel', {
                mobile: this.search.phone, //
                typeId: this.search.type, // 类型
                causeText: this.search.causeText, // 交易原因
                startTime: this.search.startTime, // 起始时间
                endTime: this.search.endTime // 结束时间
            }, {
                responseType: 'blob'
            }).then((resp: any) => {
                this.$closeLoading();
                if (resp?.data?.type === 'application/json') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const content = reader.result;// 内容就在这里
                        try {
                            const re = JSON.parse(content as string);
                            this.$showToast(re?.message || '下载失败');
                        } catch (e) {
                            this.$showToast('下载失败');
                        }
                    };
                    reader.readAsText(resp.data, 'utf-8');
                } else {
                    downloadFileFromBlob(resp.data, getDownloadFileName(resp?.headers?.['content-disposition'] || '')); // 下载这个文件
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
