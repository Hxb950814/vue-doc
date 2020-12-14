<!--K豆订单-->
<template>
    <div>
        <div class="page-cap-title">
            K豆订单
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
                    <span class="words">支付通道:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.channel"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入支付通道"
                            maxlength="50"
                            autocomplete="off"
                        />
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
                    <span class="words">状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option
                                v-for="(item,index) in statusList"
                                :key="index"
                                :value="item.value"
                                :label="item.name"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'04020102'" type="primary" @click="clickDownload">
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
                <el-table-column prop="channel" label="支付通道" />
                <el-table-column prop="orderNumber" label="商家订单号" />
                <el-table-column prop="time" label="交易时间" />
                <el-table-column prop="title" label="购买产品" />
                <el-table-column prop="money" label="支付金额/元">
                    <template slot-scope="scope">
                        {{ scope.row.money | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === '5'" class="list-status red">{{ scope.row.statusName }}</a>
                        <a v-else class="list-status">{{ scope.row.statusName }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a
                            v-permission="'04020101'"
                            class="link-btn color green"
                            @click="clickEdit(scope.row.id)"
                        >查看</a>
                        <span v-if="checkPermissionNotExist('04020101')">--</span>
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
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            phone: '', // 联系方式
            channel: '', // 支付通道
            startTime: '', // 交易时间
            endTime: '', // 结束时间
            status: '' // 状态
        };

        searchStartTimeOpt: any = {};
        searchEndTimeOpt: any = {};
        statusList: any[] = [];

        async mounted() {
            this.searchDateTimeLimit();
            await this.getTagsListData();
            await this.getDataList();
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.search, [
                'startTime', /* 第一个输入框 */
                'endTime' /* 第二个输入框 */
            ]);

            this.searchStartTimeOpt.disabledDate = limitFuns[0];
            this.searchEndTimeOpt.disabledDate = limitFuns[1];
            this.searchStartTimeOpt.shortcuts = [{
                text: '昨天',
                onClick(picker: any) {
                    picker.$emit('pick', new Date(Date.now() - 3600 * 1000 * 24));
                }
            }, {
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

        async getTagsListData() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'status'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.statusList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

        async getDataList() {
            const [err, resp] = await this.$postAsync('/beanOrderCtrl/beanOrderList', {
                page: this.tableData.currentPage,
                mobile: this.search.phone, // 支付通道
                passagewayName: this.search.channel, // 支付通道
                startTime: this.search.startTime || '', // 起始时间
                endTime: this.search.endTime || '', // 结束时间
                status: this.search.status // 状态
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.orderId),
                        phone: item.mobile, // 联系方式
                        channel: item.passagewayName || '-', // 渠道名
                        orderNumber: item.orderNumber || '--', // 订单号
                        time: item.createTime, // 交易时间
                        title: item.title, // title
                        money: item.amount, // money
                        status: String(item.status), // 状态
                        statusName: (this.statusList.find((union: any) => {
                            return String(item.status) === union.value;
                        }) || {}).name // 状态名字
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
            //     mobile: this.search.phone, // 支付通道
            //     passagewayName: this.search.channel, // 支付通道
            //     startTime: this.search.startTime || '', // 起始时间
            //     endTime: this.search.endTime || '', // 结束时间
            //     status: this.search.status // 状态
            // };
            // let params = '';
            // for(let i in conf){
            //     if(conf.hasOwnProperty(i)){
            //         params += `&${i}=${encodeURIComponent(conf[i])}`;
            //     }
            // }
            // params = params.substring(1);
            //
            // window.open(location.origin + '/api/beanOrderCtrl/beanOrderExcel?' + params, '__blank');

            this.$showLoading();
            this.$get('/beanOrderCtrl/beanOrderExcel', {
                mobile: this.search.phone, // 支付通道
                passagewayName: this.search.channel, // 支付通道
                startTime: this.search.startTime || '', // 起始时间
                endTime: this.search.endTime || '', // 结束时间
                status: this.search.status // 状态
            }, {
                paramType: 'form',
                responseType: 'blob'
            }).then((resp: any) => {
                this.$closeLoading();
                if (resp?.data?.type === 'application/json') { // 如果不是文件类型，则被请求拦截掉了
                    const reader = new FileReader();
                    reader.onload = () => {
                        const content = reader.result;
                        try {
                            const re = JSON.parse(content as string);
                            this.$showToast(re?.message || '下载失败');
                        } catch (e) {
                            this.$showToast('下载失败');
                        }
                    };
                    reader.readAsText(resp.data, 'utf-8');
                } else {
                    const disposition = resp?.headers?.['content-disposition'] || '';
                    downloadFileFromBlob(resp.data, getDownloadFileName(disposition)); // 下载这个文件
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
