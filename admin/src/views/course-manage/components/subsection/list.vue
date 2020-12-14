<template>
    <div>
        <div class="page-cap-title">
            {{ title }}课程小节
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
                    <span class="words">课程:</span>
                    <div class="input-text">
                        <el-select v-model="search.courseTypeId" style="margin-right: 15px;width: 80%" placeholder="请选择课程名称" @change="queryAllNoListenCourseType">
                            <el-option value="" label="全部" />
                            <el-option v-for="(item, index) in nolistenCourse" :key="index" :label="item.courseName" :value="item.courseTypeId" />
                        </el-select>
                    </div>
                </div>

                <div class="search-union">
                    <span class="words">目录:</span>
                    <div class="input-text">
                        <el-select v-model="search.courseChapterId" style="margin-right: 15px;width: 80%" placeholder="请选择课程目录">
                            <el-option value="" label="全部" />
                            <el-option v-for="(item, index) in noListenCourseType" :key="index" :label="item.chapterNo + '-' + item.chapterTitle" :value="item.courseChapterId" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">小节目录:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.sectionTitle"
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
                        {{ title }}课程小节
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
                <el-table-column width="300" label="小节目录">
                    <template slot-scope="scope">
                        <span>{{ '第' + scope.row.sectionNo + '节-'+ scope.row.sectionTitle }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="归属课程" />
                <el-table-column label="课程目录">
                    <template slot-scope="scope">
                        <span>{{ scope.row.chapterNo + '-' +scope.row.chapterTitle }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="讲课形式">
                    <template slot-scope="scope">
                        <span>{{ ['视频', '音频', '视频+音频'] [scope.row.courseFrom] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="课程作者" />
                <el-table-column label="是否试听">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isAudition ? '是' : '否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="展示状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.display ? '显示' : '隐藏' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作" width="100">
                    <template slot-scope="scope">
                        <a
                            class="link-btn color normal"
                            style="margin: 0 5px"
                            @click="clickEdit(scope.row.chapterSectionId)"
                        >查看</a>
                        <a
                            class="link-btn"
                            style="margin: 0 5px;color: #ff2f2f"
                            @click="clickDelete(scope.row.chapterSectionId)"
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
            sectionTitle: '', // 图片名称
            status: '', // 状态
            courseChapterId: '', // 课程章节主键id
            courseTypeId: '' // 课程主键id
        };

        nolistenCourse:any[] = []; // 所有课程
        noListenCourseType:any[] = []; // 所有章节

        mounted() {
            this.queryAllNoListenCourse();
            this.queryAllNoListenCourseType();
            this.searchData();
        }

        async queryAllNoListenCourse() {
            const [err, resp] = await this.$postAsync('/course/queryAllNoListenCourse', {courseId: this.mode});
            if (resp?.code === '000000') {
                this.nolistenCourse = resp?.data;
            }
        }

        async queryAllNoListenCourseType() {
            const [err, resp] = await this.$postAsync('/course/queryAllNoListenCourseType',
                {
                    courseId: this.mode,
                    courseTypeId: this.search.courseTypeId
                });
            if (resp?.code === '000000') {
                this.noListenCourseType = resp?.data;
            }
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryChapterSectionListPage', {
                page: this.tableData.currentPage,
                courseId: this.mode,
                display: this.search.status,
                sectionTitle: this.search.sectionTitle,
                courseChapterId: this.search.courseChapterId, // 课程章节主键id
                courseTypeId: this.search.courseTypeId// 课程主键id
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
                path: '/course_manage/stock/subsectionAdd',
                query: {
                    title: this.title,
                    mode: this.mode
                }
            });
        }

        clickEdit(id:number) {
            this.$router.push({
                path: '/course_manage/stock/subsectionEdit',
                query: {
                    id: String(id),
                    mode: this.mode,
                    title: this.title
                }
            });
        }

        async clickDelete(id: string) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/course/deleteNoListenCourseChapterSectionInfoById', {
                        chapterSectionId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
            });
        }

        getChannelStr(code: string) {
            const codeArr = code.split(',');
            const map = new Map();
            map.set('0', '初级');
            map.set('1', '进阶');
            map.set('2', '小白');
            map.set('3', '其他');
            return codeArr.sort().map((item: string) => {
                return map.get(item) || '';
            }).filter((item: string) => {
                return item !== '';
            }).join(',') || '-';
        }
    }
</script>

<style lang="scss" scoped>

</style>
