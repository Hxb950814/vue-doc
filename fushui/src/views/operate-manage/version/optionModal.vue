<template>
    <div>
        <el-form ref="form" :model="form" :rules="formRules" style="padding-right:40px">
            <el-form-item style="margin-bottom: 20px" label="版本号" prop="versionName" :label-width="formLabelWidth">
                <el-input v-model="form.versionName" :disabled="isEdit" autocomplete="off" />
            </el-form-item>
            <el-form-item style="margin-bottom: 20px" label="版本代码" prop="versionCode" :label-width="formLabelWidth">
                <el-input v-model="form.versionCode" :disabled="isEdit" autocomplete="off" />
            </el-form-item>
            <el-form-item label="系统类型" prop="typeArr" :label-width="formLabelWidth">
                <el-checkbox-group v-model="form.typeArr">
                    <el-checkbox label="IOS" :disabled="isEdit" name="typeArr" />
                    <el-checkbox label="Android" :disabled="isEdit" name="typeArr" />
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="强制更新" prop="flag" :label-width="formLabelWidth">
                <el-radio v-model="form.flag" :disabled="isEdit" label="0">
                    否
                </el-radio>
                <el-radio v-model="form.flag" :disabled="isEdit" label="1">
                    是
                </el-radio>
            </el-form-item>
            <el-form-item label="更新内容" prop="summary" :label-width="formLabelWidth">
                <el-input
                    v-model="form.summary"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    :disabled="isEdit"
                />
            </el-form-item>
            <el-form-item label="当前状态" prop="used" :label-width="formLabelWidth">
                <el-radio v-model="form.used" :disabled="isEdit" label="0">
                    关闭
                </el-radio>
                <el-radio v-model="form.used" :disabled="isEdit" label="1">
                    开启
                </el-radio>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer hbb-dialog">
            <el-button v-if="!isEdit && appEditionId" @click="clance">取消编辑</el-button>
            <el-button  v-permission="'03090103'" v-if="appEditionId>0" type="primary" @click="sureClick">{{sureText}}</el-button>
            <el-button v-if="appEditionId === 0" type="primary" @click="sureClick">保存</el-button>
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        sureText = '保存'; // 弹框模式
        isEdit:boolean = false; // 是否为编辑模式
        appEditionId = 0; // appEditionId主键id

        form:any = {
            versionName: '', // 版本号
            versionCode: '', // 版本
            summary: '', // 更新内容
            flag: '0', // 是否强制更新
            type: 0, //  系统
            used: '0', // 当前状态
            typeArr: [] // ios
        }; // 版本信息的表单配置项

        formRules:any = {
            versionName: [
                { required: true, message: '请输入版本号', trigger: 'blur' }
            ],
            versionCode: [
                { required: true, message: '请输入版本', trigger: 'blur' }
            ],
            summary: [
                { required: true, message: '请输入更新内容', trigger: 'blur' }
            ],
            flag: [
                { required: true, message: '请选择是否强制更新', trigger: 'change' }
            ],
            used: [
                { required: true, message: '请选择当前状态', trigger: 'change' }
            ],
            typeArr: [
                { type: 'array', required: true, message: '请至少选择一个系统类型', trigger: 'change' }
            ]
        }; // 版本信息的表单配置项的验证规则

        formLabelWidth:string = '100px'; // label的宽度

        active(id:number) {
            this.sureText = id ? '编辑' : '保存';
            this.isEdit = !!id;
            this.appEditionId = id;
            if (id > 0) {
                this.getAppEdition();
            }
        }

        async getAppEdition() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/app/getAppEdition', {
                appEditionId: this.appEditionId
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const resData = resp?.data;
                this.form.versionCode = resData.versionCode;
                this.form.versionName = resData.versionName;
                this.form.flag = String(resData.flag);
                this.form.summary = resData.summary;
                this.form.type = resData.type;
                this.form.used = String(resData.used);
                if (this.form.type === 3) {
                    this.form.typeArr = ['IOS', 'Android'];
                } else {
                    this.form.typeArr = this.form.type === 2 ? ['IOS'] : ['Android'];
                }
            }
        }

        sureClick() {
            // 点击确认按钮
            const _this = this;
            if (this.isEdit) {
                this.sureText = '保存';
                this.$emit('checkTitle', 1);
                this.isEdit = !this.isEdit;
                return false;
            }

            (this.$refs.form as any).validate((valid:any) => {
                if (valid) {
                    this.$confirm('是否进行' + _this.sureText + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (_this.form.typeArr.length === 2) {
                            this.form.type = 3;
                        } else {
                            if (_this.form.typeArr.includes('IOS')) {
                                this.form.type = 2;
                            }
                            if (_this.form.typeArr.includes('Android')) {
                                this.form.type = 1;
                            }
                        }
                        if (_this.isEdit) {
                            _this.goEdit();
                        } else {
                            _this.goSave();
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        goEdit() {
            // 编辑事件
            this.doSure(1);
        }

        goSave() {
            // 点击事件
            this.doSure(2);
        }

        async doSure(type:number) {
            const requestData = {
                appEditionId: this.appEditionId,
                flag: this.form.flag,
                summary: this.form.summary,
                type: this.form.type,
                versionCode: this.form.versionCode,
                versionName: this.form.versionName,
                used: this.form.used
            };
            if (this.appEditionId === 0) {
                delete requestData.appEditionId;
            }
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/app/updateOrAddAppEdition', requestData);

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '操作成功'
                });
                this.$emit('successEvent');
            } else {
                this.$message({
                    type: 'error',
                    message: resp?.message || ''
                });
            }
        }

        clance() {
            this.sureText = '编辑';
            this.isEdit = !this.isEdit;
            this.$emit('checkTitle', 2);
        }
    }
</script>

<style lang="scss">
.hbb-dialog{
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>
