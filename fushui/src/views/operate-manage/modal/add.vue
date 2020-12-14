<!--添加Banner-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加弹窗
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="弹窗名称：" prop="popupName" label-width="120px">
                    <el-input
                        v-model.trim="editData.popupName"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入弹窗名称"
                        maxlength="12"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="弹窗位置：" prop="popupPosition" label-width="120px">
                    <el-select v-model.trim="editData.popupPosition" type="text" autocomplete="off" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in listIconPrice"
                            :key="index"
                            :value="item.value"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="弹窗频率：" prop="popupFrequency" label-width="120px">
                    <el-radio-group v-model="editData.popupFrequency">
                        <el-radio label="0">
                            一日一次
                        </el-radio>
                        <el-radio label="1">
                            一日多次
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="登录权限：" prop="isLogin" label-width="120px">
                    <el-radio-group v-model="editData.isLogin">
                        <el-radio label="0">
                            无
                        </el-radio>
                        <el-radio label="1">
                            平台账号
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="跳转链接：" prop="skipLink" label-width="120px">
                        <el-select
                            v-model.trim="editData.skipLink"
                            type="text"
                            autocomplete="off"
                            placeholder="请选择"
                            style="margin-right: 20px;width: 120px"
                            @change="skipLinkType"
                        >
                            <el-option value="1" label="内部链接" />
                            <el-option value="2" label="外部链接" />
                            <el-option value="0" label="无链接" />
                        </el-select>
                    </el-form-item>
                    <div>
                        <template v-if="editData.skipLink === '1'">
                            <el-form-item label="页面ID：" prop="linkPageId" label-width="100px">
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
<!--                            <div class="dis-flex">-->
<!--                                <el-form-item label="key：" prop="linkKey" label-width="100px">-->
<!--                                    <el-input-->
<!--                                        v-model.trim="editData.linkKey"-->
<!--                                        type="text"-->
<!--                                        autocomplete="off"-->
<!--                                        placeholder=""-->
<!--                                        style="width:180px"-->
<!--                                    />-->
<!--                                </el-form-item>-->
<!--                                <el-form-item label="value：" prop="linkValue" label-width="100px">-->
<!--                                    <el-input-->
<!--                                        v-model.trim="editData.linkValue"-->
<!--                                        type="text"-->
<!--                                        autocomplete="off"-->
<!--                                        placeholder=""-->
<!--                                        style="width:100px"-->
<!--                                    />-->
<!--                                </el-form-item>-->
<!--                            </div>-->
                        </template>
                        <template v-if="editData.skipLink === '2'">
                            <el-form-item label="" prop="skipLinkUrl" label-width="0">
                                <el-input
                                    v-model.trim="editData.skipLinkUrl"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入链接地址"
                                    style="width:300px"
                                />
                            </el-form-item>
                        </template>
                    </div>
                </div>
                <el-form-item v-viewer label="弹窗图片：" prop="popupImageUrl" label-width="120px">
                    <my-image-upload :url.sync="editData.popupImageUrl" />
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="弹窗时间：" prop="publishTimeStart" label-width="120px">
                        <el-date-picker
                            v-model="editData.publishTimeStart"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            :picker-options="publishTimeOpt1"
                            style="width:200px"
                        />
                    </el-form-item>
                    <span class="connecting-line">-</span>
                    <el-form-item label="" prop="publishTimeEnd" label-width="0">
                        <el-date-picker
                            v-model="editData.publishTimeEnd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            :picker-options="publishTimeOpt2"
                            style="width:200px"
                        />
                    </el-form-item>
                </div>
                <el-form-item label="弹窗状态：" prop="status" label-width="120px">
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
    import {makeDatePickerRelationLimit} from '@/utils/helper';
    import * as validator from '@/utils/validate';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    let editDataSnapshot = '';
    @Component({
        components: {
            MyImageUpload
        },
        mixins: []
    })
    export default class extends Vue {
        editData: any = {
            isLogin: '1', // 登录权限
            popupFrequency: '0', // 弹框频率  0=一日一次，1=一日多次
            popupImageUrl: '', // 图片地址
            popupName: '', // 弹窗名称
            popupPosition: '0', // 弹窗位置  0=主页，1=我的
            status: '1', // 弹窗状态 0=隐藏 1=显示
            skipLink: '1', // 链接类型  0=无、1=内部链接、2=外部链接
            skipLinkUrl: '', // 链接
            linkPageId: '', // 内部链接id
            linkKey: '', // 内部链接key
            linkValue: '', // 内部链接value
            publishTimeStart: '', // 发布时间起始值
            publishTimeEnd: '' // 发布时间结束
        };

        dataRule: any = {
            popupName: [{required: true, message: '请输入弹窗名称', trigger: 'blur'}],
            popupPosition: [{required: true, message: '请选择弹窗位置', trigger: 'change'}],
            isLogin: [{required: true, message: '请选择登录权限', trigger: 'change'}],
            popupFrequency: [{required: true, message: '请选择弹窗频率', trigger: 'change'}],
            status: [{required: true, message: '请选择登录状态', trigger: 'change'}],
            skipLink: [{required: true, message: '请选择链接类型', trigger: 'change'}],
            skipLinkUrl: [{
                validator: (rule: any, value: string, callback: Function) => {
                    return this.editData.linkType === '2' && value === '' ? callback(new Error('地址不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            linkPageId: [{
                validator: (rule: any, value: string, callback: Function) => {
                    return this.editData.linkType === '1' && value === '' ? callback(new Error('Id不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            publishTimeStart: [{required: true, message: '请选择发布起始时间', trigger: 'blur'}],
            publishTimeEnd: [{required: true, message: '请选择发布结束时间', trigger: 'blur'}],
            popupImageUrl: [{required: true, message: '请上传图片', trigger: 'change'}]
        };

        publishTimeOpt1: any = {};
        publishTimeOpt2: any = {};
        listIconPrice: any[] = [
            {
                value: '0', name: '主页'
            },
            {
                value: '1', name: '我的'
            }
        ];

        pageIdList: any[] = [];

        mounted() {
            this.searchDateTimeLimit();
            this.getPageIDList();
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

        @Watch('editData.skipLink')
        onLinkTypeChange(val: string, oldVal: string) {
            // 清除一些校验

            (this.$refs.dataForm as ElForm).clearValidate('linkPageId');
            // (this.$refs.dataForm as ElForm).clearValidate('linkKey');
            // (this.$refs.dataForm as ElForm).clearValidate('linkValue');
            (this.$refs.dataForm as ElForm).clearValidate('skipLinkUrl');
        }

        onPageIdChange(val: string) {
            const find = this.pageIdList.find((item: any) => {
                return val === item.pageValue;
            });
            if (find) {
                this.editData.linkKey = find.pageKey;
            }
        }

        skipLinkType() {
            this.editData.skipLinkUrl = '';
            this.editData.linkPageId = '';
        }

        async getPageIDList() {
            const [err, resp] = await this.$postAsync('/icon/getpageListAll');
            if (resp?.code === '000000') {
                this.pageIdList = (resp?.data || []).filter((item: any) => item.display).map((item: any) => ({
                    pageKey: item.pageKey,
                    pageName: item.pageName,
                    pageValue: item.pageValue
                }));
            }
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.editData, [
                'publishTimeStart', /* 第一个输入框 */
                'publishTimeEnd' /* 第二个输入框 */
            ]);

            this.publishTimeOpt1.disabledDate = limitFuns[0];
            this.publishTimeOpt2.disabledDate = limitFuns[1];
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
                isLogin: this.editData.isLogin,
                popupFrequency: this.editData.popupFrequency,
                popupImageUrl: this.editData.popupImageUrl,
                popupName: this.editData.popupName,
                popupPosition: this.editData.popupPosition,
                status: this.editData.status,
                skipLink: this.editData.skipLink,
                startTime: this.editData.publishTimeStart, // 开始时间
                endTime: this.editData.publishTimeEnd // 结束时间
            };
            if (this.editData.skipLink === '1') { // 内部链接
                // data.pageKey = this.editData.linkKey;
                // data.pageValue = this.editData.linkValue;
                data.skipLinkUrl = this.editData.linkPageId;
            } else if (this.editData.skipLink === '2') {
                data.skipLinkUrl = this.editData.link;
            } else if (this.editData.skipLink === '0') {
                data.skipLinkUrl = '';
            }
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/popup/addOrUpdatePopup', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                });
            } else {
                this.$showToast(resp?.message || '添加失败');
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
