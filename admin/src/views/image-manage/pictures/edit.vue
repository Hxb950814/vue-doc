<!--查看Banner-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看Banner
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item :label="$route.query.title + '名称：'" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入名称"
                        maxlength="8"
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
                <el-form-item label="登录权限：" prop="power" label-width="120px">
                    <el-radio-group v-model="editData.power">
                        <el-radio label="0">
                            无
                        </el-radio>
                        <el-radio label="1">
                            平台账号
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item :label="$route.query.title + '链接：'" prop="linkType" label-width="120px">
                        <el-select
                            v-model.trim="editData.linkType"
                            type="text"
                            autocomplete="off"
                            placeholder="请选择"
                            style="margin-right: 20px;width: 120px"
                        >
                            <el-option value="1" label="内部链接" />
                            <el-option value="2" label="外部链接" />
                            <el-option value="-1" label="无链接" />
                        </el-select>
                    </el-form-item>
                    <div>
                        <template v-if="editData.linkType === '1'">
                            <el-form-item label="页面ID：" prop="linkPageId" label-width="80px">
                                <el-select
                                    v-model.trim="editData.linkPageId"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请选择"
                                    style="margin-right: 20px;width: 250px"
                                    @change="onPageIdChange"
                                >
                                    <el-option v-for="(item, idx) in pageIdList" :key="idx" :value="item.pageValue">
                                        <span style="float: left;padding-top: 8px">{{ item.pageValue }}</span>
                                        <span style="float: right;padding-top: 8px">{{ item.pageName }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="dis-flex">
                                <el-form-item label="key：" prop="linkKey" label-width="80px">
                                    <el-input
                                        v-model.trim="editData.linkKey"
                                        type="text"
                                        autocomplete="off"
                                        placeholder=""
                                        maxlength="100"
                                        style="width:120px"
                                    />
                                </el-form-item>
                                <el-form-item label="value：" prop="linkValue" label-width="80px">
                                    <el-input
                                        v-model.trim="editData.linkValue"
                                        type="text"
                                        autocomplete="off"
                                        placeholder=""
                                        maxlength="100"
                                        style="width:100px"
                                    />
                                </el-form-item>
                            </div>
                        </template>
                        <template v-if="editData.linkType === '2'">
                            <el-form-item label="" prop="link" label-width="0">
                                <el-input
                                    v-model.trim="editData.link"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入链接地址"
                                    maxlength="100"
                                    style="width:300px"
                                />
                            </el-form-item>
                        </template>
                    </div>
                </div>
                <el-form-item v-viewer :label="$route.query.title + '图标：'" prop="image" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="editData.image" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="展示状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序：" prop="order" label-width="120px">
                    <el-input
                        v-model.trim="editData.order"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入顺序（1~99数字）"
                        maxlength="50"
                        style="width:300px"
                    />
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
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    let editDataSnapshot = '';
    @Component({
        components: {MyImageUpload},
        mixins: []
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            name: '', // 标题
            position: '', // 位置
            channel: [], // 渠道
            power: '', // 权限
            status: '', // 状态
            image: '', // 图片地址
            order: '', // 顺序
            linkType: '', // 链接类型
            link: '', // 外部链接
            linkPageId: '', // 内部链接id
            linkKey: '', // 内部链接key
            linkValue: '', // 内部链接value
            publishTimeStart: '', // 发布时间起始值
            publishTimeEnd: '' // 发布时间结束
        };

        dataRule: any = {
            name: [{required: true, message: '请输入图片名称', trigger: 'blur'}],
            position: [{required: true, message: '请选择图片位置', trigger: 'change'}],
            channel: [{required: true, message: '请选择显示渠道', trigger: 'change'}],
            linkType: [{required: true, message: '请选择链接类型', trigger: 'change'}],
            link: [{
                validator: (rule: any, value: string, callback: Function) => {
                    return this.editData.linkType === '2' && value === ''
                        ? callback(new Error('地址不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            linkPageId: [{
                validator: (rule: any, value: string, callback: Function) => {
                    return this.editData.linkType === '1' && value === '' ? callback(new Error('Id不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            // linkKey: [{
            //     validator: (rule: any, value: string, callback: Function) => {
            //         return this.editData.linkType === '1' && value === '' ? callback(new Error('key不能为空')) : callback();
            //     },
            //     trigger: 'blur'
            // }],
            // linkValue: [{
            //     validator: (rule: any, value: string, callback: Function) => {
            //         return this.editData.linkType === '1' && value === '' ? callback(new Error('value不能为空')) : callback();
            //     },
            //     trigger: 'blur'
            // }],
            publishTimeStart: [{required: true, message: '请选择发布起始时间', trigger: 'blur'}],
            publishTimeEnd: [{required: true, message: '请选择发布结束时间', trigger: 'blur'}],
            image: [{required: true, message: '请上传缩图片', trigger: 'change'}],
            order: [
                {required: true, message: '请输入顺序', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '1', compareType: '>='}),
                    trigger: 'blur'
                },
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '99', compareType: '<='}),
                    trigger: 'blur'
                }
            ]
        };

        publishTimeOpt1: any = {};
        publishTimeOpt2: any = {};
        listIconPrice: any[] = [];

        pageIdList: any[] = [];

        mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.getPageIDList();
            this.getData();
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

        @Watch('editData.linkType')
        onLinkTypeChange(val: string, oldVal: string) {
            // 清除一些校验
            (this.$refs.dataForm as ElForm).clearValidate('linkPageId');
            (this.$refs.dataForm as ElForm).clearValidate('linkKey');
            (this.$refs.dataForm as ElForm).clearValidate('linkValue');
            (this.$refs.dataForm as ElForm).clearValidate('link');
        }

        onPageIdChange(val: string) {
            const find = this.pageIdList.find((item: any) => {
                return val === item.pageValue;
            });
            if (find) {
                this.editData.linkKey = find.pageKey;
            }
        }

        async getPageIDList() {
            const [err, resp] = await this.$postAsync('/icon/getpageListAll');
            if (resp?.code === '000000') {
                this.pageIdList = (resp?.data || []).filter((item: any) => item.display).map((item: any) => ({
                    pageKey: item.pageKey,
                    pageName: item.pageName,
                    pageValue: item.pageValue
                }));
                // console.log(this.pageIdList);
            }
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/icon/geticonDetail', {
                iconId: this.id
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const {data} = resp;
                if (!data) {
                    return;
                }
                this.editData.name = data.imageTitle; // 标题
                this.editData.type = String(data.iconCategoryId); // 类型
                this.editData.image = data.imageUrl || ''; // 图片

                this.editData.description = data.description; // 描述
                this.editData.position = String(data.positionId); // 位置

                this.editData.channel = (data.displayPlatform || '').split(',') || []; // 渠道
                this.editData.power = data.power + ''; // 登录权限

                this.editData.status = String(data.display ? 1 : 0); // 状态
                this.editData.order = data.sortby; // 顺序
                this.editData.indexShow = String(data.indexShow ? 1 : 0); // 是否推荐
                this.editData.linkType = String(data.urlType); // 链接类型
                this.editData.positionId = String(data.positionId); // 工具类型

                switch (Number(data.urlType)) {
                    case 0:
                        break;
                    case 1:
                        this.editData.linkPageId = data.pageId; // 内部链接id
                        this.editData.linkKey = data.pageKey; // 内部链接key
                        this.editData.linkValue = data.pageValue; // 内部链接value
                        break;
                    case 2:
                        this.editData.link = data.url; // 外部链接
                        break;
                }
            }
            editDataSnapshot = JSON.stringify(this.editData);
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
                iconId: this.id,
                iconCategoryId: this.$route.query.mode,
                imageTitle: this.editData.name, // 名称
                displayPlatform: this.editData.channel.filter((item: string) => item !== '').join(','), // 平台
                power: this.editData.power, // 权限
                sortby: this.editData.order, // 顺序
                imageUrl: this.editData.image, // 图片地址
                imageName: '', // 图片名
                display: this.editData.status, // 是否显示
                urlType: this.editData.linkType // 链接类型
            };
            if (this.editData.linkType === '1') { // 内部链接
                data.pageKey = this.editData.linkKey;
                data.pageValue = this.editData.linkValue;
                data.pageId = this.editData.linkPageId;
            } else if (this.editData.linkType === '2') {
                data.url = this.editData.link;
            }
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/icon/saveIcon', data, {paramType: 'form'});
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
            // (this.$refs.dataForm as ElForm).clearValidate('name');
            // (this.$refs.dataForm as Vue).resetFields('name');
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
