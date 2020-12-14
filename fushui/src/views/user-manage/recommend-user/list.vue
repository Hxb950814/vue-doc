<!-- 推荐用户 -->
<template>
    <div>
        <div class="page-cap-title">
            推荐用户
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
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'05040101'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
            <div class="search-line" style="margin-top: 20px">
                <div class="search-union">
                    <span class="words">排序:</span>
                    <el-radio-group v-model="search.orderType">
                        <el-radio-button label="0">
                            更新时间
                        </el-radio-button>
                        <el-radio-button label="1">
                            推荐人数
                        </el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="mobile" label="联系方式" />
                <el-table-column prop="recommenderNum" label="推荐人数" />
                <el-table-column prop="futureAccountNum" label="-">
                    <template slot="header">
                        期货账户人数
                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">
                            <i class="el-icon-warning-outline" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="traderNum" label="交易人数" />
                <el-table-column prop="strategyNum" label="策略人数" />
                <el-table-column prop="rewardBeanNum" label="奖励K豆" />
            </el-table>
            <div class="form-under-text">
                奖励K豆：{{ kCoin }}
            </div>
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
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            phone: '', // 联系方式
            orderType: '0'
        };

        kCoin = 0; // k豆

        @Watch('search.orderType')
        onOrderTypeChange(val: string) {
            this.searchData();
        }

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/queryRecommendUserListPage', {
                page: this.tableData.currentPage,
                mobile: this.search.phone,
                orderType: this.search.orderType
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.userId),
                        mobile: item.mobile, // 手机号
                        recommenderNum: item.recommenderNum, // 推荐人数
                        futureAccountNum: item.futureAccountNum, // 期货账户人数
                        traderNum: item.traderNum, // 交易人数
                        strategyNum: item.strategyNum, // 策略人数
                        rewardBeanNum: item.rewardBeanNum // 奖励k豆
                    });
                });
                this.kCoin = resp?.data?.otherData?.rewardBeans || 0;
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

        clickDownload() {
            this.$showLoading();
            this.$post('/user/recommendUserListExcel', {
                mobile: this.search.phone,
                orderType: this.search.orderType
            }, {
                paramType: 'form',
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
