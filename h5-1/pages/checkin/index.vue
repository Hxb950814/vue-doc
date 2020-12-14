<template>
    <div>
        <!--    mode：1 表示可以再app内战时头部    -->
        <tk-nav-bar>
            每日签到
            <template #right>
                <div class="right-icons">
                    <nuxt-link class="menu-icon" to="/checkin/reward_list">
                        <img src="https://rs.tanxingk.com/images/icon_kcoin.png" alt="">
                    </nuxt-link>
                </div>
            </template>
        </tk-nav-bar>

        <div class="container">
            <div class="sign-title">
                {{ month }}月
            </div>
            <div class="sign-wrap">
                <div v-for="(item,idx) in dayList" :key="idx" class="block" :class="{today: idx === 3}">
                    {{ item.day }}
                    <template v-if="idx <= 3 && item.day">
                        <div v-if="item.isSign" class="bottom-ico" />
                        <div v-else class="bottom-ico no" />
                    </template>
                </div>
            </div>
            <div class="sign-days">
                <span>今日签到人数：<strong>{{ signCount }}</strong></span>
                <span>已连续签到：<strong>{{ continuityDay }}</strong>天</span>
            </div>
            <div class="pics-block">
                <img src="https://rs.tanxingk.com/images/checkin_img.png" alt="" class="placeholder">
                <p class="title">
                    {{ signText }}
                </p>
            </div>
            <div class="record-area">
                <p class="title">
                    签到记录
                </p>
                <div id="record_block" class="record-wrap-block">
                    <ul class="record-wrap">
                        <li v-for="(item,idx) in recordList" :key="idx" class="record-line">
                            <img alt="" class="head" :src="item.head">
                            <span class="phone">{{ item.mobile }}</span>
                            <span class="sign">{{ item.time }}签到  </span>
                            <span class="column">获得<strong>{{ item.reward }}K豆</strong>奖励</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="rules-wrap">
                <p class="title">
                    奖励规则
                </p>
                <div class="content" v-html="rules" />
            </div>
        </div>

        <!-- 预缓存 -->
        <img src="https://rs.tanxingk.com/images/checkin_kbeans.png" style="display: none">
        <img src="https://rs.tanxingk.com/images/checkin_img.png" style="display: none">
        <img src="https://rs.tanxingk.com/images/checkin_light_img.png" style="display: none">

        <div v-if="showSignSuccess" class="animation-mask">
            <div class="sun" />
            <div class="flower" />
            <p class="tips">
                签到成功<span v-if="rewardToday > 0">+{{ rewardToday }}K豆</span>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData(context) {
            let month = '--';
            let signCount = '--'; // 签到天数
            let signText = ''; //
            let rules = '--'; // 规则文字
            let recordList = [];
            let dayList = [];
            let continuityDay = '';
            let rewardToday = 0;
            let newSign = false;
            const results = await Promise.all([
                postAsync('/signIn/getSignIndex')
            ]);
            const resp1 = results?.[0]?.[1];
            const resp2 = results?.[1]?.[1];

            // console.log(resp1.data);
            if (resp1?.code === '000000') {
                const listRecord = resp1?.data?.listRecord || [];
                // console.log(listRecord);
                const list = resp1?.data?.list || [];
                recordList = listRecord.map((item: any) => {
                    return {
                        head: item.headImage,
                        mobile: item.mobile,
                        time: item.signTime.split(' ')?.[1] || '--',
                        reward: item.reward
                    };
                });
                dayList = list.map((item: any) => {
                    if (Number(item.isNowDate) === 1) {
                        month = item.month;
                    }
                    return {
                        day: item.day,
                        isNowDate: Number(item.isNowDate),
                        isSign: Number(item.isSign)
                    };
                });

                signText = '今日已签到';
                if (resp1.data.reward > 0) {
                    signText += '+' + resp1.data.reward + 'K豆';
                }
                continuityDay = resp1.data.signCount;
                rewardToday = resp1.data.kbeans || 0;
                signCount = resp1.data.signCount;
                rules = (resp1.data?.rule || '').split('\n').map((item: string) => `<p>${item}</p>`).join('');
                if (resp1.data.sign === 'hasSign') {
                    newSign = false;
                } else {
                    newSign = true;
                }
            }
            signText = '今日已签到';
            return {
                month,
                continuityDay,
                signCount,
                signText,
                rules,
                dayList,
                recordList,
                newSign,
                rewardToday
            };
        }
    })
    export default class extends Vue {
        month = '--';
        continuityDay = '--';
        signCount = '--';
        rules = '';
        signText = '';
        newSign = false;
        rewardToday = 0;
        showSignSuccess = false;
        dayList: any[] = [
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ];

        recordList: any[] = [];

        mounted() {
            // console.log(this.recordList);
            if (this.newSign) {
                this.showSignSuccess = true;
                setTimeout(() => {
                    this.showSignSuccess = false;
                }, 5000);
            }
            setTimeout(() => {
                if (this.recordList.length > 6) {
                     this.slide();
                }
            }, 500);
        }

        slide() {
            let timer = 0;
            let scroll_top = 0;
            const obj = document.getElementById('record_block');
            if (!obj) {
                return;
            }
            clearInterval(timer);
            const ul = obj.getElementsByTagName('ul');
            if (!ul || ul.length === 0) {
                return;
            }
            obj.appendChild(ul[0].cloneNode(true));
            const $height = parseFloat(getComputedStyle(ul[0]).height);
            timer = window.setInterval(function () {
                scroll_top++;
                if (scroll_top > $height) {
                    scroll_top = 0;
                }
                if (ul[0]) {
                    ul[0].style.webkitTransform = 'translateY( ' + -scroll_top + 'px)';
                    ul[0].style.transform = 'translateY( ' + -scroll_top + 'px)';
                }
                if (ul[1]) {
                    ul[1].style.webkitTransform = 'translateY( ' + (-scroll_top) + 'px)';
                    ul[1].style.transform = 'translateY( ' + (-scroll_top) + 'px)';
                }
            }, 20);
            this.$once('hook:beforeDestroy', () => {
                window.clearInterval(timer);
                timer = 0;
            });
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
        padding-bottom: 20px;
    }

    .sign-wrap {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;

        .block {
            margin: 0 10px;
            border-radius: 50%;
            color: #333;
            background-color: #f2f2f2;
            width: 70px;
            height: 70px;
            text-align: center;
            line-height: 70px;
            font-size: 25px;
            position: relative;

            .bottom-ico {
                position: absolute;
                bottom: -8px;
                right: -8px;
                width: 32px;
                height: 32px;
                background: url(#{$cdn-path}/images/check_mark.png) top/ 100% 100% no-repeat;

                &.no {
                    background-image: url(#{$cdn-path}/images/exclamation_mark.png);
                }
            }

            &.today {
                background-color: #ff5855;
                color: #fff;
            }
        }
    }

    .sign-title {
        text-align: center;
        font-size: 24px;
        color: #666;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .sign-days {
        margin-top: 35px;
        margin-bottom: 20px;
        display: flex;
        padding: 0 20px;
        justify-content: space-between;

        span {
            color: #666;
            font-size: 24px;
        }

        strong {
            color: #ff5855;
            font-weight: normal;
            font-size: 24px;
        }
    }

    .pics-block {
        text-align: center;

        > img {
            width: 280px;
            height: 200px;
            display: block;
            margin: 0 auto 20px;
        }

        .title {
            text-align: center;
            color: $color-main;
            font-size: 35px;
            min-height: 40px;
            line-height: 40px;
            font-weight: bold;
            margin-top: 20px;
        }
    }

    .record-area {
        margin: 60px 25px 0;
        background-color: #f6f6f6;
        padding: 0 30px 20px;

        .title {
            height: 80px;
            text-align: center;
            font-size: 28px;
            line-height: 80px;
            border-bottom: 1PX solid #ddd;
        }

        .record-wrap-block{
            height: 480px;
            overflow: hidden;
        }
        .record-wrap {
            strong{
                color: $color-main;
            }
        }

        .record-line {
            display: flex;
            padding: 10px 0;
            justify-content: space-between;
            align-items: center;

            > span {
                font-size: 24px;
            }

            .head {
                margin-right: 20px;
                height: 40px;
                width: 40px;
                border-radius: 100%;
            }
            strong{
                font-size: 24px;
                font-weight: normal;
            }

            .phone {
                display: inline-block;
                width: 180px;
            }

            .column{
                margin-left: auto;
            }
        }
    }

    .rules-wrap {
        margin: 25px;
        padding-top: 10px;
        /*padding-bottom: 10px;*/
        .title {
            text-align: center;
            color: #666;
            font-size: 30px;
            font-weight: bold;
        }

        /deep/ .content {
            margin-top: 20px;
            font-size: 24px;
            color: #666;

            > p {
                font-size: 24px;
                color: #666;
                line-height: 1.5;
            }
        }
    }

    .animation-mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5000;
        background-color: rgba(0,0,0, .5);
        .sun{
            position: fixed;
            z-index: 5001;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 750px;
            height: 750px;
            background: url(#{$cdn-path}/images/checkin_light_img.png) top/ 100% 100% no-repeat;
            display: flex;
            animation: animRotate 5s linear infinite;
        }
        .flower{
            position: fixed;
            z-index: 5002;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 300px;
            height: 300px;
            background: url(#{$cdn-path}/images/checkin_kbeans.png) top/ 100% 100% no-repeat;
        }
        @keyframes animRotate {
            from{
                transform: rotate(0deg);
            }
            to{
                transform: rotate(360deg);
            }
        }
        .tips{
            text-align: center;
            position: absolute;
            z-index: 5005;
            top: 50%;
            bottom: 0;
            margin: auto;
            transform: translateY(200px);
            width: 100%;
            font-weight: bold;
            font-size: 36px;
            color: #ffd869;
            >span{
                font-size: 36px;
                color: #ffd869;
            }
        }
    }
</style>
