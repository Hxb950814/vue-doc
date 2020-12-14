<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            查看支付设置
        </div>

        <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
            <el-form-item label="支付通道：" prop="passagewayName" label-width="120px">
                <el-input
                    v-model.trim="editData.passagewayName"
                    type="text"
                    autocomplete="off"
                    placeholder="请输入名称（4个字以内）"
                    maxlength="4"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="通道ID：" prop="passagewayCode" label-width="120px">
                <el-input
                    v-model.trim="editData.passagewayCode"
                    type="text"
                    autocomplete="off"
                    placeholder="请输入通道ID"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="显示渠道：" prop="displayPlatform" label-width="120px">
                <el-checkbox-group v-model="editData.displayPlatform">
                    <el-checkbox label="0">
                        Android
                    </el-checkbox>
                    <el-checkbox label="1">
                        IOS
                    </el-checkbox>
                    <el-checkbox label="2">
                        H5
                    </el-checkbox>
                    <el-checkbox label="3">
                        小程序
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item v-viewer label="支付图标：" prop="passagewayImage" label-width="120px">
                <div class="dis-flex">
                    <my-image-upload :url.sync="editData.passagewayImage" class="small" />
                    <div style="padding: 80px 0 0 10px">
                        (100*100px)
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="展示状态：" prop="status" label-width="120px">
                <el-radio-group v-model="editData.display">
                    <el-radio label="1">
                        显示
                    </el-radio>
                    <el-radio label="0">
                        隐藏
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="form-submit-line" style="width: 600px">
            <el-button @click="clickCancel">
                关闭
            </el-button>
            <el-button type="primary" @click="clickSave">
                保存
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        id:string = '';
        editData: any = {
            passagewayName: '', // 支付通道
            passagewayCode: '', //  支付通道ID
            displayPlatform: [], // 渠道
            passagewayImage: '', // 支付图标
            display: '' // 状态
        };

        dataRule: any = {
            passagewayName: [{required: true, message: '请输入支付通道', trigger: 'blur'}],
            passagewayCode: [{required: true, message: '请输入支付通道ID', trigger: 'change'}],
            displayPlatform: [{required: true, message: '请选择显示渠道', trigger: 'change'}],
            passagewayImage: [{required: true, message: '请选择支付图片', trigger: 'change'}]
        };

        mounted() {
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/finance/getPassagewaySet', {passagewaySetId: this.id}, {paramType: 'form'});
            this.$closeLoading();
            if (resp?.code === '000000') {
               console.log(resp);
                this.editData.passagewayName = resp?.data.passagewayName;
                this.editData.passagewayCode = resp?.data.passagewayCode;
                this.editData.displayPlatform = resp?.data.displayPlatform.split(',');
                this.editData.passagewayImage = resp?.data.passagewayImage;
                this.editData.display = resp?.data.display ? '1' : '0';
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                passagewaySetId: this.id,
                display: this.editData.display,
                passagewayCode: this.editData.passagewayCode,
                passagewayImage: this.editData.passagewayImage,
                passagewayName: this.editData.passagewayName, // 名称
                displayPlatform: this.editData.displayPlatform.filter((item: string) => item !== '').join(',') // 平台
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/finance/editPassagewaySet', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }

        clickCancel() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .page-cap-titleH{
        margin-bottom: 40px;
    }
    .el-form-item{
        margin-bottom: 20px;
    }
</style>
