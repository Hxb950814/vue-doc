<!--设置-->
<template>
    <div>
        <div class="account-section-title">
            账号设置
        </div>
        <div class="account-section-content">
            <ul class="menu-list">
                <li>
                    <div>
                        <embed class="icon checked" src="/icons/svg/icon_check.svg">
                        <div class="item-name">
                            用户昵称
                        </div>
                        <div class="item-value">
                            <span v-if="!visibleModifyNick">{{ nickName }}</span>
                            <modify-nick v-else v-model="nickName" @save="onModifyNickSave"
                                         @cancel="onModifyNickCancel"
                            />
                        </div>
                    </div>
                    <div>
                        <a v-if="!visibleModifyNick" class="btn" @click="showModifyNick">修改</a>
                    </div>
                </li>
                <li>
                    <div>
                        <embed class="icon checked" src="/icons/svg/icon_check.svg">
                        <div class="item-name">
                            联系方式
                        </div>
                        <div class="item-value">
                            <span v-if="!visibleModifyPhone">{{ phone | mobileMask }}</span>
                            <modify-phone v-else v-model="phone" @cancel="cancelModifyPhone" />
                        </div>
                    </div>
                    <div>
                        <a v-if="!visibleModifyPhone" class="btn" @click="showModifyPhone">更换</a>
                    </div>
                </li>
                <li>
                    <div>
                        <embed class="icon" :class="{checked: isTradePassword}" src="/icons/svg/icon_check.svg">
                        <div class="item-name">
                            交易密码
                        </div>
                        <div class="item-value">
                            <template v-if="!visibleModifyPassword && !visibleFindPassword && !visibleSetPassword">
                                <span v-if="!dataLoaded">--</span>
                                <span v-else-if="!isTradePassword" class="no">K豆消费密码，请完成设置</span>
                                <span v-else>已设置</span>
                            </template>
                            <template v-else-if="visibleSetPassword">
                                <set-trade-password @hide="cancelSetPassword" @set="onSetPasswordSuccess" />
                            </template>
                            <template v-else-if="visibleModifyPassword">
                                <modify-trade-password @hide="cancelModifyPassword" />
                            </template>
                            <template v-else-if="visibleFindPassword">
                                <find-trade-password :mobile="phone" @hide="cancelFindPassword" />
                            </template>
                        </div>
                    </div>
                    <div v-if="!visibleModifyPassword && !visibleFindPassword">
                        <a v-if="!isTradePassword" class="btn" @click="showSetPassword">设置</a>
                        <a v-if="isTradePassword" class="btn" @click="showModifyPassword">修改</a>
                        <a v-if="isTradePassword" class="btn" @click="showFindPassword">找回</a>
                    </div>
                </li>
                <li>
                    <div>
                        <embed class="icon" :class="{checked: isReal}" src="/icons/svg/icon_check.svg">
                        <div class="item-name">
                            实名信息
                        </div>
                        <div class="item-value">
                            <template v-if="!visibleModifyRealName && !visibleSetRealName">
                                <span v-if="!dataLoaded">--</span>
                                <span v-else-if="!isReal" class="no">填写实名信息，便于进行授权验证</span>
                                <span v-else>已设置</span>
                            </template>
                            <template v-else>
                                <modify-real-name v-if="visibleModifyRealName" @hide="cancelModifyRealName" @set="onModifyRealNameSuccess" />
                                <set-real-name v-if="visibleSetRealName" @hide="cancelSetRealName" @set="onSetRealNameSuccess" />
                            </template>
                        </div>
                    </div>
                    <div v-if="!visibleModifyRealName && !visibleSetRealName">
                        <a v-if="!isReal && !visibleModifyRealName" class="btn" @click="showSetRealName">认证</a>
                        <a v-if="isReal && !visibleSetRealName" class="btn" @click="showModifyRealName">修改</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ModifyNick from './_modify_nick.vue';
    import ModifyPhone from './_modify_phone.vue';
    import ModifyRealName from './_modify_realname.vue';
    import ModifyTradePassword from './_modify_trade_password.vue';
    import SetTradePassword from './_set_trade_password.vue';
    import FindTradePassword from './_find_trade_password.vue';
    import SetRealName from './_set_realname.vue';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {
            ModifyPhone,
            ModifyNick,
            ModifyRealName,
            ModifyTradePassword,
            SetTradePassword,
            FindTradePassword,
            SetRealName
        }
    })
    export default class Setting extends Vue {
        dataLoaded = false;
        isReal = false; // 是否实名
        isTradePassword = false; // 是否设置了交易密码

        nickName = '--';
        nickNameModify = '';
        visibleModifyNick = false;

        phone = '--';
        phoneModify = '';
        visibleModifyPhone = false;

        visibleModifyRealName = false;

        visibleSetRealName = false;

        visibleModifyPassword = false;
        visibleFindPassword = false;

        visibleSetPassword = false;

        mounted() {
            this.nickName = this.$store.getters.userName;
            this.getInfo();
        }

        async getInfo() {
            this.$showLoading();
            const [err, resp] = await postAsync('/systemInstall/queryAccountInstallInfo');
            if (resp?.code === '000000') {
                this.isTradePassword = Number(resp?.data?.isTradePassword) === 1;
                this.isReal = Number(resp?.data?.isReal) === 1;
                this.phone = resp?.data?.mobile;
            }
            this.dataLoaded = true;
            this.$closeLoading();
        }

        showModifyNick() {
            this.visibleModifyNick = true;
            this.nickNameModify = this.nickName;
        }

        onModifyNickCancel() {
            this.visibleModifyNick = false;
        }

        onModifyNickSave() {
            this.visibleModifyNick = false;
        }

        /* ********************* */
        showModifyPhone() {
            this.visibleModifyPhone = true;
            this.phoneModify = this.phone;
        }

        cancelModifyPhone() {
            this.visibleModifyPhone = false;
        }

        /**********/
        showModifyRealName() {
            this.visibleModifyRealName = true;
        }

        cancelModifyRealName() {
            this.visibleModifyRealName = false;
        }

        onModifyRealNameSuccess() {
            this.visibleModifyRealName = false;
        }

        /* ******  */
        showSetRealName() {
            this.visibleSetRealName = true;
        }

        cancelSetRealName() {
            this.visibleSetRealName = false;
        }

        onSetRealNameSuccess() {
            this.isReal = true;
            this.visibleSetRealName = false;
        }

        /* *****  */
        showSetPassword() {
            this.visibleSetPassword = true;
        }

        cancelSetPassword() {
            this.visibleSetPassword = false;
        }

        onSetPasswordSuccess() {
            this.visibleSetPassword = false;
            this.isTradePassword = true;
        }

        /************/
        showModifyPassword() {
            this.visibleModifyPassword = true;
        }

        cancelModifyPassword() {
            this.visibleModifyPassword = false;
        }

        /*************/

        showFindPassword() {
            this.visibleFindPassword = true;
        }

        cancelFindPassword() {
            this.visibleFindPassword = false;
        }
    }
</script>

<style lang="scss" scoped>
    .menu-list {
        li {
            padding: 20px 20px 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            overflow: hidden;

            > div {
                display: flex;
                align-items: center;
            }

            .icon {
                width: 20px;
                height: 20px;
                overflow: hidden;

                &.checked {
                    // filter: drop-shadow(0 0 0.75rem crimson);
                    // fill: $color-main;
                    filter: drop-shadow(#09bb07 80px 0);
                    transform: translateX(-80px);
                }
            }

            .item-name {
                padding-left: 10px;
                font-size: 15px;
                color: #333;
                display: inline-block;
                width: 140px;
            }

            .item-value {
                padding-left: 10px;
                font-size: 15px;
                color: #333;
                display: inline-block;

                .no {
                    color: #666;
                }
            }

            .btn {
                display: inline-block;
                font-size: 15px;
                color: $color-main;
                padding-left: 20px;
                cursor: pointer;
            }
        }
    }

    .form-area {
        > div {
            margin-bottom: 10px;
            vertical-align: top;
        }

        .msgcode {
            height: 40px;
            width: 100px;
            outline: none;
            border: 1px solid #ccc;
            display: inline-block;
            vertical-align: bottom;
        }
    }
</style>
