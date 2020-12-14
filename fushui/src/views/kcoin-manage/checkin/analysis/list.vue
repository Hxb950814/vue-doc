<!--用户签到统计-->
<template>
    <div>
        <div class="page-cap-title">
            用户签到统计
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">手机号/姓名:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="手机号/姓名"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickSearch">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button v-permission="'04050301'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="name" label="用户姓名" />
                <el-table-column prop="mobile" label="手机号" />
                <el-table-column prop="number" label="累计签到次数" />
                <el-table-column prop="reward" label="累计签到奖励/K豆">
                    <template slot-scope="scope">
                        {{ scope.row.reward }}
                        <i class="el-icon-data-line icon-analysis" @click="clickOnReward(scope.row.id)" />
                    </template>
                </el-table-column>
                <el-table-column prop="signKeep" label="连续签到次数" />
                <el-table-column prop="minTime" label="首次签到时间" />
                <el-table-column prop="maxTime" label="最新签到时间" />
            </el-table>
            <my-pagination
                :page-size="tableData.pageSize"
                :total="tableData.count"
                :current-page.sync="tableData.currentPage"
                @current-change="handleCurrentChange"
            />
        </div>

        <el-dialog
            title="修改密码"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="panelShow"
            width="540px"
        >
            <div ref="chart1" class="chart1" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import echarts from 'echarts';
    import commonTable from '@/mixins/commonTable';
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    let chart1: any = null;
    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        panelShow = false;
        search: any = {
            phone: '' // 联系方式
        };

        async mounted() {
            await this.getDataList();
        }

        beforeDestroy() {
            if (chart1) {
                chart1.destroy();
                chart1 = null;
            }
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/signRecordCtrl/findSignRecordCountList', {
                page: this.tableData.currentPage,
                mobile: this.search.phone
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
                        mobile: item.mobile, // 联系方式
                        name: item.name,
                        number: item.number, // 累计签到次数
                        reward: item.reward, // 累计奖励
                        signKeep: item.signKeep, // 累计奖励
                        maxTime: item.maxTime, // 最大时间
                        minTime: item.minTime // 最小时间
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

        clickSearch() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        /* 下载 */
        clickDownload() {
            this.$showLoading();
            this.$get('/signRecordCtrl/signRecordCountListExcel', {
                mobile: this.search.phone
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

        async clickOnReward(id: string) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/signRecordCtrl/findUserBeanRecord', {
                userId: id
            });
            if (resp?.code === '000000') {
                this.panelShow = true;
                const configData = resp.data.map((item: any) => {
                    return {
                        date: item.date,
                        reward: item.reward
                    };
                });
                this.$nextTick(() => {
                    this.showChart(configData);
                });
            }
            this.$closeLoading();
        }

        showChart(dataList: any[]) {
            if (!chart1) {
                chart1 = echarts.init(this.$refs.chart1 as HTMLCanvasElement); // 表格初始化
            }

            const xAxisData = dataList.map((item: any) => item.date);
            const seriesData = dataList.map((item: any) => item.reward);

            chart1.setOption({
                title: {
                    text: 'K豆奖励'
                },
                grid: {
                    left: 0,
                    top: 40,
                    right: 0,
                    bottom: 20
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        inside: true,
                        verticalAlign: 'bottom',
                        interval: 2,
                        margin: 2
                    }
                },
                series: [{
                    data: seriesData,
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: '#409eff'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#409eff'
                        }
                    }
                }],
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 50,
                        end: 100
                    }
                ]
            });
        }
    }
</script>

<style lang="scss" scoped>
    .icon-analysis{
        font-size: 15px;
        cursor: pointer;
        color: $theme-font-color;
    }
    .chart1{
        width: 100%;
        height: 300px;
    }
</style>
