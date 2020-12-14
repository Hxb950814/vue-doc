<!--查看通道-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看通道
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="通道名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入通道名称"
                        maxlength="10"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="标识：" prop="tag" label-width="120px">
                    <el-input
                        v-model.trim="editData.tag"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入标识名称"
                        maxlength="20"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="显示渠道：" prop="channel" label-width="120px">
                    <el-checkbox-group v-model="editData.channel">
                        <el-checkbox label="0">
                            Android
                        </el-checkbox>
                        <el-checkbox label="1">
                            IOS
                        </el-checkbox>
                        <el-checkbox label="2">
                            H5
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-viewer label="图标：" prop="image" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="editData.image" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="累计交易额：" prop="" label-width="120px">
                    {{ editData.amount | money }}元
                </el-form-item>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            启用
                        </el-radio>
                        <el-radio label="0">
                            禁用
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="max-width:500px">
                <el-button @click="clickCancel">
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
    import MyImageUpload from '@/components/MyImageUpload.vue';

    let editDataSnapshot = '';
    @Component({
        components: {MyImageUpload},
        mixins: []
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            name: '', // 名称
            tag: '', // 标识
            channel: [], // 渠道
            image: '', // 名称
            amount: '', // 交易额
            status: '1' // 状态
        };

        dataRule: any = {
            name: [{required: true, message: '请输入通道名称', trigger: 'blur'}],
            tag: [{required: true, message: '请输入标识名称', trigger: 'blur'}],
            channel: [{required: true, message: '请选择显示渠道', trigger: 'change'}],
            image: [{required: true, message: '请上传图标', trigger: 'change'}]
        };

        mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.getData();
        }

        async getData() {
            this.$showLoading();
            const data = {
                kbeansPassagewaySetId: this.id // id
            };
            const [err, resp] = await this.$postAsync('/kbeansPassagewaySet/getKbeansPassagewaySetDetail', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.name = resp.data.passagewayName;
                this.editData.amount = resp.data.amount || '';
                this.editData.status = resp.data.display ? '1' : '0';

                this.editData.tag = resp.data.passagewayCode;
                this.editData.image = resp.data.passagewayImage; // 图片
                this.editData.channel = resp.data.displayPlatform ? resp.data.displayPlatform.split(',') : []; // 平台
            }

            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
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
            const data = {
                beanPassagewaySetId: this.id,
                passagewayCode: this.editData.tag, // tag
                passagewayImage: this.editData.image, // 图片
                displayPlatform: this.editData.channel.join(','), // 平台
                passagewayName: this.editData.name, // 名称
                display: this.editData.status // 状态
            };
            const [err, resp] = await this.$postAsync('/kbeansPassagewaySet/saveKbeansPassagewaySet', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }

        clickCancel() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {
            });
        }
    }
</script>
