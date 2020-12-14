<template>
    <div>
        <div class="page-cap-title">
            月卡记录
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <el-form :inline="true" :model="search" class="demo-form-inline">

                    <el-form-item label="购买时间" class="hbb">
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            @change="timeChange"
                        />
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model.trim="search.mobile" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="hbb-page-table">
                <el-table
                    :data="tableData.data"
                    border
                    style="width: 100%"
                >
                    <el-table-column
                        prop="date"
                        align="center"
                        label="序号"
                        width="50"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>>
                    </el-table-column>
                    <el-table-column
                        prop="create_time"
                        label="购买时间"
                        align="center"
                    />
                    <el-table-column
                        prop="mobile"
                        align="center"
                        label="手机号"
                    />
                    <el-table-column
                        prop="cardName"
                        align="center"
                        label="商品名称"
                    />
                    <el-table-column
                        prop="day"
                        label="有效天数"
                        align="center"
                        width="120"
                    />
                    <el-table-column
                        prop="over_time"
                        label="到期日期"
                        align="center"
                    />
                    <el-table-column
                        prop="mouth_fee"
                        label="消耗K豆"
                        align="center"
                    />
                </el-table>
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
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';
    @Component({
        components: {}
    })

    export default class extends Mixins(commonTable) {
        time:string = ''; // 选择时间的占位
        search: any = {
            mobile: '',
            endTime: '', // 结束时间
            startTime: '' // 开始时间
        };

        mounted() {
            // this.tableData.currentPage = 1;
            this.getDataList();
        }

        onSubmit() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();

            const [err, resp] = await this.$postAsync('/dealSignal/selectMouthCardListPage', {
                page: this.tableData.currentPage,
                endTime: this.search.endTime,
                startTime: this.search.startTime,
                mobile: this.search.mobile
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                this.tableData.data = resp?.data?.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
            this.$closeLoading();
        }

        timeChange(val:any) {
            // 判断是否有值
            if (val) {
                this.search.startTime = dayjs(val[0]).format('YYYY-MM-DD');
                this.search.endTime = dayjs(val[1]).format('YYYY-MM-DD');
            } else {
                this.search.startTime = '';
                this.search.endTime = '';
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-top{
        display: flex;
        width: 100%;
        margin: 10px 0;
    }

</style>
