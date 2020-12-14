<!--查看Icon-->
<template>
    <div>
        <div class="page-cap-title">
            {{ $route.query.title }}-查看
        </div>

        <div class="form-input-area">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="icon名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入icon名称"
                        maxlength="8"
                        style="width:300px"
                    />
                </el-form-item>
                <template v-if="$route.query.mode === '3'">
                    <el-form-item label="工具类型：" prop="positionId" label-width="120px">
                        <el-select
                            v-model.trim="editData.positionId"
                            type="text"
                            autocomplete="off"
                            placeholder="请选择"
                            style="margin-right: 20px;width: 120px"
                        >
                            <el-option v-for="(item,index) in toolsData" :key="index" :value="item.value" :label="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否推荐：" prop="indexShow" label-width="120px">
                        <el-radio-group v-model="editData.indexShow">
                            <el-radio label="0">
                                是
                            </el-radio>
                            <el-radio label="1">
                                否
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
                <el-form-item v-if="$route.query.mode === '4'" label="icon备注：" prop="description" label-width="120px">
                    <el-input
                        v-model.trim="editData.description"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入icon备注"
                        maxlength="15"
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
                        <!--                        <el-radio label="2">-->
                        <!--                            平期账号-->
                        <!--                        </el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="ICON链接：" prop="linkType" label-width="120px">
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
                <el-form-item v-viewer label="ICON图标：" prop="image" label-width="120px">
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
                        placeholder="请输入icon顺序（1~99数字）"
                        maxlength="50"
                        style="width:300px"
                    />
                </el-form-item>
            </el-form>
            <div style="width: 100%;text-align: center">
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
    import {makeDatePickerLimit} from '@/utils/helper';
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
            id: -1,
            name: '', // 标题
            type: '', // 类型
            description: '', // 描述
            position: '', // 位置
            channel: [], // 渠道
            power: '', // 登录权限
            status: '1', // 状态
            image: '', // 图片地址
            order: '', // 顺序
            linkType: '', // 链接类型
            link: '', // 外部链接
            linkPageId: '', // 内部链接id
            linkKey: '', // 内部链接key
            linkValue: '', // 内部链接value
            isMain: '0', // 是否主页显示
            indexShow: '0', // 是否推荐
            positionId: '2' // 使用工具
        };

        dataRule: any = {
            name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            type: [{required: true, message: '请选择类型', trigger: 'change'}],
            description: [{required: true, message: '请输入描述', trigger: 'blur'}],
            position: [{required: true, message: '请选择位置', trigger: 'change'}],
            channel: [{required: true, message: '请选择显示渠道', trigger: 'change'}],
            linkType: [{required: true, message: '请选择链接类型', trigger: 'change'}],
            link: [{
                validator: (rule: any, value: string, callback: Function) => {
                    if (this.editData.linkType !== '2') {
                        return callback();
                    }
                    return value === '' ? callback(new Error('地址不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            linkPageId: [{
                validator: (rule: any, value: string, callback: Function) => {
                    if (this.editData.linkType !== '1') {
                        return callback();
                    }
                    return value === '' ? callback(new Error('Id不能为空')) : callback();
                },
                trigger: 'blur'
            }],
            // linkKey: [{
            //     validator: (rule: any, value: string, callback: Function) => {
            //         if (this.editData.linkType !== '1') {
            //             return callback();
            //         }
            //         return value === '' ? callback(new Error('key不能为空')) : callback();
            //     },
            //     trigger: 'blur'
            // }],
            // linkValue: [{
            //     validator: (rule: any, value: string, callback: Function) => {
            //         if (this.editData.linkType !== '1') {
            //             return callback();
            //         }
            //         return value === '' ? callback(new Error('value不能为空')) : callback();
            //     },
            //     trigger: 'blur'
            // }],
            publishTimeStart: [{required: true, message: '请选择发布起始时间', trigger: 'blur'}],
            publishTimeEnd: [{required: true, message: '请选择发布结束时间', trigger: 'blur'}],
            image: [{required: true, message: '请上传图片', trigger: 'change'}],
            order: [
                {required: true, message: '请输入顺序', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '0', compareType: '>='}),
                    trigger: 'blur'
                },
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '99', compareType: '<='}),
                    trigger: 'blur'
                }
            ]
        };

        publishTimeOpt: any = {};
        listIconPrice: any[] = [];
        listIconType: any[] = [];

        pageIdList: any[] = [];
        toolsData:any = []; // 工具栏下拉列表

        mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.publishTimeOpt.disabledDate = makeDatePickerLimit(new Date());
            this.getSearchSelectList();
            this.getPageIDList();
            this.getToolsData();
            this.getData();
        }

        getTypeStr() {
            const find = this.listIconType.find((item: any) => {
                return String(item.value) === String(this.editData.type);
            });
            return find ? find.name : '';
        }

        getPositionStr() {
            const find = this.listIconPrice.find((item: any) => {
                return String(item.value) === String(this.editData.position);
            });
            return find ? find.name : '';
        }

        async getToolsData() {
            const [err, resp] = await this.$postAsync('/icon/iconSelectToolInfo ');
            if (resp?.code === '000000') {
                this.toolsData = (resp?.data || []).map((item: any) => ({
                    name: item.name,
                    value: String(item.value)
                }));
            }
        }

        @Watch('editData.linkType')
        onLinkTypeChange(val: string, oldVal: string) {
            console.log('change');
            // 清除一些校验
            // if (oldVal === '2') {
            //     (this.$refs.dataForm as ElForm).clearValidate('linkPageId');
            //     (this.$refs.dataForm as ElForm).clearValidate('linkKey');
            //     (this.$refs.dataForm as ElForm).clearValidate('linkValue');
            // } else if (oldVal === '1') {
            //     (this.$refs.dataForm as ElForm).clearValidate('link');
            // } else {
                (this.$refs.dataForm as ElForm).clearValidate('link');
                (this.$refs.dataForm as ElForm).clearValidate('linkPageId');
                (this.$refs.dataForm as ElForm).clearValidate('linkKey');
                (this.$refs.dataForm as ElForm).clearValidate('linkValue');
            // }
        }

        async getSearchSelectList() {
            const [err, resp] = await this.$postAsync('/icon/iconSelectInfo');
            if (resp?.code === '000000') {
                this.listIconPrice = (resp?.data?.listIconPrice || []).map((item: any) => ({
                    name: item.name,
                    value: String(item.value)
                }));
                this.listIconType = (resp?.data?.listIconType || []).map((item: any) => ({
                    name: item.name,
                    value: String(item.value)
                }));
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

        onPageIdChange(val: string) {
            const find = this.pageIdList.find((item: any) => { return val === item.pageValue; });
            if (find) {
                this.editData.linkKey = find.pageKey;
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
                conCategoryId: this.$route.query.mode,
                imageTitle: this.editData.name, // 名称
                description: this.editData.description, // 描述
                displayPlatform: this.editData.channel.join(','), // 平台
                power: this.editData.power, // 权限
                iconCategoryId: this.editData.type, // 类型id
                iconCategoryName: this.getTypeStr(), // 类型Str
                sortby: this.editData.order, // 顺序
                positionId: this.editData.position, // 位置id
                positionName: this.getPositionStr(), // 位置Name
                imageUrl: this.editData.image, // 图片地址
                indexShow: this.editData.isMain, // 是否主页显示
                display: this.editData.status, // 是否显示
                urlType: this.editData.linkType
            };

            switch (this.$route.query.mode) {
                case '1':
                    break;
                case '2':
                    break;
                case '3':
                    data.indexShow = this.editData.indexShow;
                    data.positionId = this.editData.positionId;
                    break;
                case '4':
                    data.description = this.editData.description;
                    break;
                case '5':
                    break;
                case '6':
                    break;
                default:
                    break;
            }
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
            });
        }
    }
</script>
