<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                会员管控
            </div>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                style="width: 600px;margin-left:100px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="管控类型" prop="region">
                    <div style="width: 100%;position: relative">
                        <el-select v-model="ruleForm.region" style="margin-right: 15px;width: 80%" placeholder="请选择管控类型">
                            <el-option label="区域一" value="shanghai" />
                            <el-option label="区域二" value="beijing" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="任命班主任" prop="name">
                    <div>
                        <el-input v-model="ruleForm.name" style="width: 300px;margin-right: 20px" placeholder="输入学号查询" />
                        <el-button type="primary" @click="saveClick('ruleForm')">
                            查询
                        </el-button>
                    </div>
                    <div class="hbb-table-content">
                        <span>会员学号:</span>
                        <span>联系方式:</span>
                        <span>账号状态:</span>
                        <span>职业认证:</span>
                    </div>
                </el-form-item>
                <el-form-item label="职业类型" prop="region">
                    <div style="width: 100%;position: relative">
                        <el-select v-model="ruleForm.region" style="margin-right: 15px;width: 80%" placeholder="请选择管控类型">
                            <el-option label="区域一" value="shanghai" />
                            <el-option label="区域二" value="beijing" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="工作单位">
                    <div>
                        <el-input v-model="ruleForm.name" style="width:80%;margin-right: 20px" placeholder="请输入工作单位" />
                    </div>
                </el-form-item>
                <el-form-item label="单位介绍">
                    <div>
                        <el-input v-model="ruleForm.name" type="textarea" rows="4" style="width:80%;margin-right: 20px" placeholder="请输入工作单位" />
                    </div>
                </el-form-item>
                <el-form-item label="微信账号">
                    <div>
                        <el-input v-model="ruleForm.name" style="width:80%;margin-right: 20px" placeholder="请输入微信账号" />
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="微信二维码" prop="image" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="ruleForm.image" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveClick('ruleForm')">
                        保存
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        ruleForm:any= {
            name: '',
            region: '',
            date1: '',
            image: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        }

        rules:any= {
            name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            region: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            date1: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            ],
            date2: [
                { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
            ],
            type: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
            ],
            resource: [
                { required: true, message: '请选择活动资源', trigger: 'change' }
            ],
            desc: [
                { required: true, message: '请填写活动形式', trigger: 'blur' }
            ]
        }

        saveClick(formName:any) {
            (this.$refs[formName] as any).validate((valid:any) => {
                if (valid) {
                    this.doSave();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        doSave() {
            console.log(this.ruleForm);
        }
    }
</script>

<style lang="scss" scoped>
    .line-h{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
    }
    .hbb-table-content{
        float: left;
        width: 80%;
        border-bottom: 1px solid #ddd;
        border-right:1px solid #ddd;
        background:#F2F2F2;
        margin: 20px 0 10px 0;
        padding: 10px;
        span{
            float: left;
            width: 100%;
            height: 30px;
            text-align: left;
            line-height: 30px;
            color: #333;
        }
    }
</style>
