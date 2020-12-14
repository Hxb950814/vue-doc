<template>
    <div>
        <div class="page-cap-title">
            {{ title }}课程目录
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="显示" />
                            <el-option value="0" label="隐藏" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">课程名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.courseName"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
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
                    <el-button type="primary" @click="clickIcon">
                        <i class="el-icon-plus" />
                        {{ title }}课程类目
                    </el-button>
                </div>
            </div>
        </div>
        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" width="300" label="课程名称" />
                <el-table-column label="课程级别">
                    <template slot-scope="scope">
                        <span>{{ ['初级', '进阶', '小白', '其他'] [scope.row.courseLevel] }}</span>
                    </template>
                </el-table-column>
                <!--                <el-table-column prop="chapterNoAndTitle" label="章节目录" />-->
                <el-table-column label="市场价格">
                    <template slot-scope="scope">
                        <span>{{ scope.row.markPrice | money }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isSupportCoupon" label="优惠券">
                    <template slot-scope="scope">
                        <span>{{ ['不支持', '支持'] [scope.row.isSupportCoupon] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isLimitTimeDiscount" label="限时优惠">
                    <template slot-scope="scope">
                        <span>{{ ['禁用', '开启'] [scope.row.isLimitTimeDiscount] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isRecommend" label="是否推荐">
                    <template slot-scope="scope">
                        <span>{{ ['否', '是'] [scope.row.isRecommend] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isHotSale" label="是否热销">
                    <template slot-scope="scope">
                        <span>{{ ['否', '是'] [scope.row.isHotSale] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="display" label="当前状态">
                    <template slot-scope="scope">
                        <span>{{ ['隐藏', '显示'] [scope.row.display] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="展示顺序" />
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.courseTypeId)"
                        >查看</a>
                        <a
                            class="link-btn normal"
                            style="margin: 0 5px;color: #ff2f2f"
                            @click="clickDelete(scope.row.courseTypeId)"
                        >删除</a>
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
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins, Prop} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        @Prop({type: String, default: '1', required: false})
        mode!:string;

        @Prop({type: String, default: '添加ICON', required: false})
        title!:string;

        search: any = {
            courseName: '', // 课程名称
            display: '' // 状态
        };

        mounted() {
            this.searchData();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryNoListenCourseListPage', {
                page: this.tableData.currentPage,
                courseId: this.mode,
                display: this.search.display,
                courseName: this.search.courseName
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.tableData.data = resp.data.result || [];
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickIcon() {
            this.$router.push({
                path: '/course_manage/stock/tableOfContentsAdd',
                query: {
                    title: this.title,
                    mode: this.mode
                }
            });
        }

        clickEdit(id:number) {
            this.$router.push({
                path: '/course_manage/stock/tableOfContentsEdit',
                query: {
                    id: String(id),
                    mode: this.mode,
                    title: this.title
                }
            });
        }

        async clickDelete(id: number) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/course/deleteNoListenCourseInfoById', {
                        courseTypeId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>
