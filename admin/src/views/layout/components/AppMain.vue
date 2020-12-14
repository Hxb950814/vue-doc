<template>
    <div id="appMainArea" class="app-main-area">
        <div class="app-content">
            <my-breadcrumb />
            <section class="main-format-section">
                <transition name="fade" mode="out-in">
                    <router-view v-if="!noPermission" />
                </transition>
                <div v-if="noPermission" class="text-center">
                    <span class="text">您没有该页面的访问权限</span><br>
                    <a class="back-btn" @click="clickLogin">返回登录</a>
                </div>
            </section>
        </div>

        <el-dialog
            title="修改密码"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="modifyPanelShow"
            width="440px"
        >
            <div class="form-input-area" style="width: 100%;padding:0;margin: 10px 0 -10px 0">
                <el-form ref="dataForm" :model="editData" :rules="dataRule">
                    <el-form-item label="原密码：" prop="oldPassword" label-width="120px">
                        <el-input
                            v-model.trim="editData.oldPassword"
                            type="password"
                            autocomplete="off"
                            placeholder="请输入原密码"
                            maxlength="16"
                            style="width: 250px;"
                        />
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPassword" label-width="120px">
                        <el-input
                            v-model.trim="editData.newPassword"
                            type="password"
                            autocomplete="off"
                            placeholder="请输入8-16位字母和数字新密码"
                            maxlength="16"
                            style="width: 250px;"
                        />
                    </el-form-item>
                    <el-form-item label="确认新密码：" prop="newPassword2" label-width="120px">
                        <el-input
                            v-model.trim="editData.newPassword2"
                            type="password"
                            autocomplete="off"
                            placeholder="请输入新密码"
                            maxlength="16"
                            style="width: 250px;"
                        />
                    </el-form-item>
                    <el-form-item style="text-align: center">
                        <el-button type="primary" @click="modify">
                            确定修改
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from 'vue-property-decorator';
    import {Route} from 'vue-router';
    import PubSub from 'pubsub-js';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';
    import * as config from '@/utils/config';
    import MyBreadcrumb from '@/components/MyBreadcrumb.vue';

    @Component({
        components: {MyBreadcrumb}
    })
    export default class AppMain extends Vue {
        modifyPanelShow = false;
        noPermission = false;

        editData = {
            oldPassword: '',
            newPassword: '',
            newPassword2: ''
        };

        dataRule: any = {
            oldPassword: [
                {required: true, message: '请输入原密码', trigger: 'blur'}
            ],
            newPassword: [
                {required: true, message: '请输入新密码', trigger: 'blur'},
                {required: true, validator: validator.getValidatePassword(), trigger: 'blur'}
            ],
            newPassword2: [
                {required: true, message: '请确认新密码', trigger: 'blur'},
                {required: true, validator: validator.getValidatePassword(), trigger: 'blur'},
                {
                    required: true,
                    validator: (rule: any, value: string, callback: (param?: any) => void) => {
                        if (value !== this.editData.newPassword) {
                            callback('两次密码不一致');
                            return;
                        }
                        callback();
                    },
                    trigger: 'blur'
                }
            ]
        };

        created() {
            PubSub.subscribe('popShowModifyPanel', (msg: any) => {
                this.modifyPanelShow = true;
                this.editData.oldPassword = '';
                this.editData.newPassword = '';
                this.editData.newPassword2 = '';
                (this.$refs.dataForm as ElForm).clearValidate();
            });
        }

        mounted() {
            // console.log(config.enablePermission);
            this.noPermission = this.$route.meta.permission === false;
        }

        // 路由发生了变化，重新渲染路由
        @Watch('$route')
        onRouterChange(route: Route) {
            // if(this.$route.meta.title){
            // document.title = this.$route.meta.title;
            // }
            this.noPermission = this.$route.meta.permission === false;
        }

        modify() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.doModify();
                }
            });
        }

        async doModify() {
            const [err, resp] = await this.$postAsync('/admin/updatePassword', {
                oldPassword: this.editData.oldPassword,
                password: this.editData.newPassword
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.$showToast('修改密码成功，请重新登录');
                this.$store.dispatch('removeToken');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 200);
            } else if (resp?.message) {
                this.$showToast(resp.message);
            } else {
                this.$showToast('请求发生错误，请重试');
            }
        }

        clickLogin() {
            this.$store.dispatch('removeToken'); // 清除去token
            this.$store.dispatch('removePermissionList'); // 清除permissionList
            window.location.href = '/login';
        }
    }
</script>

<style lang="scss" scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .text-center {
        background-color: #fff;
        height: 100%;
        text-align: left;
        padding-left: 20px;
        padding-bottom: 20px;
        margin-right: 10px;

        .text {
            display: inline-block;
            font-size: 20px;
            padding-top: 20px;
        }

        .page-table-btn {
            margin-top: 10px;
        }
    }

    .crop {
        font-size: 14px;
        color: #535b6c;
        padding-left: 25px;
        line-height: 60px;
    }

    .back-btn {
        display: inline-block;
        margin-top: 10px;
        border: 1px solid $theme-font-color;
        color: $theme-font-color;
        font-size: 14px;
        border-radius: 4px;
        padding: 3px 10px;
        cursor: pointer;

        &:hover {
            border: 1px solid $theme-font-color;
            background-color: $theme-font-color;
            color: #fff;
        }
    }
</style>
