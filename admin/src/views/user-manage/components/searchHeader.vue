<template>
    <div>
        <div class="search-line">
            <div v-if="mode === '1'" class="search-union">
                <span class="words">账号状态:</span>
                <div class="input-text">
                    <el-select v-model="search.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </div>
            </div>
            <div class="search-union">
                <span class="words">注册时间:</span>
                <div class="input-text">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                    />
                </div>
            </div>
            <div class="search-union">
                <span class="words">学号:</span>
                <div class="input-text">
                    <el-input
                        v-model.trim="search.studentNo"
                        style="width: 200px"
                        type="text"
                        clearable
                        placeholder="请输入学号"
                        maxlength="15"
                        autocomplete="off"
                    />
                </div>
            </div>
            <div class="search-union">
                <span class="words">联系方式:</span>
                <div class="input-text">
                    <el-input
                        v-model.trim="search.mobile"
                        style="width: 200px"
                        type="text"
                        clearable
                        placeholder="请输入手机号"
                        maxlength="15"
                        autocomplete="off"
                    />
                </div>
            </div>
            <div class="search-union right">
                <el-button type="primary" @click="searchData">
                    查询
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import dayjs from 'dayjs';

    @Component({})
    export default class extends Vue {
        @Prop({type: String, default: '', required: false})
        mode!:string;

        search: any = {
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            studentNo: '', // 学号
            mobile: '', // mobile手机号
            status: '' // 账号状态
        };

        statusList: any[] = [
            {id: '', name: '全部'},
            {id: '0', name: '未学习'},
            {id: '1', name: '学习中'},
            {id: '2', name: '锁定'}
        ]

        time = ''; // 时间桥接

        pickerOptions:any = {
            shortcuts: [{
                text: '最近一周',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        }

        mounted() {
            this.searchData();
        }

        searchData() {
            // 进行查询
            this.search.startTime = this.time ? dayjs(this.time[0]).format('YYYY-MM-DD') : '';
            this.search.endTime = this.time ? dayjs(this.time[1]).format('YYYY-MM-DD') : '';
            this.$emit('searchDataEvent', this.search);
        }
    }
</script>

<style lang="scss" scoped>

</style>
