<!-- 添加常见问题-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加常见问题
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="问题名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入问题名称"
                        maxlength="50"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="问题分类：" prop="category" label-width="120px">
                    <el-select v-model.trim="editData.category" type="text" autocomplete="off" placeholder="请选择">
                        <el-option value="" label="全部" />
                        <el-option
                            v-for="(item,index) in tagsList"
                            :key="index"
                            :value="item.value"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="问题内容：" prop="content" label-width="120px">
                    <my-custom-editor :content.sync="editData.content" :disabled="false" />
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="发布时间：" prop="publishTime" label-width="120px">
                        <el-date-picker
                            v-model="editData.publishTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            style="width:185px"
                        />
                    </el-form-item>
                </div>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 850px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';

    let editDataSnapshot = '';
    @Component({
        components: {
            MyCustomEditor
        },
        mixins: [commonTable]
    })
    export default class extends Vue {
         editData: any = {
            name: '', // 名称
            category: '', // 分类别
            status: '1', // 状态
            publishTime: '', // 发布时间
            content: '' // 问题内容
        };

         dataRule: any = {
            name: [{required: true, message: '请输入问题名称', trigger: 'blur'}],
            content: [{required: true, message: '请输入问题内容', trigger: 'change'}],
            publishTime: [{required: true, message: '请选择发布时间', trigger: 'blur'}],
            category: [{required: true, message: '请选择问题分类', trigger: 'change'}]
        };

         tagsList: any[] = [];

        mounted() {
            setTimeout(() => {
                // 保存未更改的快照, 用于对比数据是否发生更改
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
            this.getTagsListData();
        }

         clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {});
        }

         clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    });
                }
            });
        }

         async getTagsListData() {
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'problem_type'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.tagsList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

         async doSave() {
            this.$showLoading();
            const data = {
                type: 2,
                title: this.editData.name, // 标题
                articleCategoryId: this.editData.category, // 问题分类
                publishTime: this.editData.publishTime, // 结束时间
                content: this.editData.content, // 文章内容
                display: this.editData.status // 是否显示
            };
            const [err, resp] = await this.$postAsync('/contentCtrl/addArticle', data, {
                paramType: 'json'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }
    }
</script>
