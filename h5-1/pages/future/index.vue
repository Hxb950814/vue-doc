<template>
    <div>
        <tk-nav-bar :class="'skin-' + skinType">
            {{ title }}
            <template #left>
                <div class="index-icon-align-left">
                    <a class="index-icon folder" @click="clickOnFolder">
                        <img src="https://rs.tanxingk.com/images/icon_folder.png" alt="">
                    </a>
                </div>
            </template>
            <template #right>
                <div class="index-icon-align">
                    <nuxt-link class="index-icon search" to="/future/main/search">
                        <img src="https://rs.tanxingk.com/images/icon_search.png" alt="">
                    </nuxt-link>
                    <nuxt-link class="index-icon user" to="/my">
                        <img src="https://rs.tanxingk.com/images/icon_user.png" alt="">
                    </nuxt-link>
                    <a class="index-icon more" @click="clickShowMenu">
                        <img src="https://rs.tanxingk.com/images/icon_elliphis.png" alt="">
                    </a>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container" :class="'skin-' + skinType">
            <div class="situation-top-flag">
                <div class="title">
                    名称
                </div>
                <div class="menu-1" :class="{'more': titleCapList[0].length > 1}" @click="clickOnTitleMenu(1)">
                    {{ titleCapList[0][titleCapIndex1] ? titleCapList[0][titleCapIndex1].name : '' }}
                </div>
                <div class="menu-2" :class="{'more': titleCapList[1].length > 1}" @click="clickOnTitleMenu(2)">
                    {{ titleCapList[1][titleCapIndex2] ? titleCapList[1][titleCapIndex2].name : '' }}
                </div>
                <div class="menu-3" :class="{'more': titleCapList[2].length > 1}" @click="clickOnTitleMenu(3)">
                    {{ titleCapList[2][titleCapIndex3] ? titleCapList[2][titleCapIndex3].name : '' }}
                </div>
            </div>
            <div v-if="dataList.length > 0" class="situation-data-list">
                <ul class="situation-contract-list">
                    <li v-for="(item,idx) in dataList" :key="idx" :class="{active: item.isFold}">
                        <div class="content" :class="'status' + item.status"
                             @touchstart="touchStart(idx, $event)" @touchmove="touchMove(idx, $event)"
                             @touchend="touchEnd(idx)"
                        >
                            <div class="title">
                                {{ item.name }}
                            </div>
                            <div class="value-1" :class="item.value1class">
                                {{ item.value1 }}
                            </div>
                            <div class="value-2" :class="item.value2class">
                                {{ item.value2 }}
                            </div>
                            <div class="value-3" :class="item.value3class">
                                {{ item.value3 }}
                            </div>
                        </div>
                        <div class="menu-tool" @click.stop="">
                            <div class="choose" :class="'status' + (item.isUserSelected ? 1 : 0)"
                                 @click="clickAddSelect(idx, !item.isUserSelected)"
                            >
                                <span>{{ item.isUserSelected ? '删自选' : '加自选' }}</span>
                            </div>
                            <div class="alert" @click="clickWarning(idx)">
                                <span>设预警</span>
                            </div>
                            <div class="deal" @click="clickDeal">
                                <span>做交易</span>
                            </div>
                            <div class="quantification" @click="clickQuantification">
                                <span>量化</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="dataType === '2'" class="situation-user-add" @click="clickAddChoose">
                    <i class="plus" />
                    <span>添加自选</span>
                </div>
            </div>
            <div v-if="dataType === '1'">
                <!--主力-->
                <div v-if="dataType === '2'" class="situation-user-add" @click="clickAddChoose">
                    <i class="plus" />
                    <span>添加自选</span>
                </div>
            </div>
            <div v-if="dataList.length === 0">
                <div v-if="dataType === '2'">
                    <div class="situation-no-data" @click="clickAddChoose">
                        <div class="add-button" />
                        <span class="text">暂无自选 点击添加</span>
                    </div>
                </div>
                <div v-else>
                    <div class="situation-no-data-main">
                        暂无数据
                    </div>
                </div>
            </div>
        </div>

        <div class="situation-bottom-info">
            <div v-if="dataType === '3'" class="menu-cat-list">
                <div class="menu-main">
                    <div class="menu-left">
                        <van-icon name="arrow-left" />
                    </div>
                    <div class="move-area">
                        <span v-for="(item,idx) in speciesList" :key="idx">{{ item.speciesName }}</span>
                    </div>
                    <div class="menu-right">
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="right-btn">
                    <van-icon name="plus" />
                </div>
            </div>
            <div class="slide-info">
                <van-swipe style="height: .9rem" vertical :autoplay="5000" :loop="true"
                           :show-indicators="false" :duration="1000" :touchable="false"
                >
                    <van-swipe-item v-for="(item,idx) in messageScrollList" :key="idx">
                        <a class="bottom-slide" :class="'status' + item.status"
                           @click="clickOnMessageScroll(item.messageType, item.messageId, item.messageNoticeId)"
                        >
                            <span class="title">
                                {{ item.name }}
                            </span>
                            <span class="tab1">
                                {{ item.value1 }}
                            </span>
                            <span class="tab2">
                                {{ item.value2 }}
                            </span>
                            <span class="tab3">
                                {{ item.value3 }}
                            </span>
                        </a>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>

        <div class="menu-mask" :class="{show: showMenu}" @click="clickOnOtherArea">
            <div class="menu" :class="'skin-' + skinType" @click.stop="">
                <ul class="list">
                    <li @click="clickMenu(1)">
                        <img src="https://rs.tanxingk.com/images/icon_menu_setting.png" class="icon">
                        <span>行情设置</span>
                    </li>
                    <li @click="clickMenu(2)">
                        <img v-show="skinType === '1'" src="https://rs.tanxingk.com/images/icon_menu_skin.png"
                             class="icon"
                        >
                        <img v-show="skinType === '2'" src="https://rs.tanxingk.com/images/icon_menu_skin_sun.png"
                             class="icon"
                        ><span>切换皮肤</span>
                    </li>
                    <li @click="clickMenu(3)">
                        <img src="https://rs.tanxingk.com/images/icon_menu_analysis.png" class="icon">
                        <span>持仓分析</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ContractDataSocket, EnumContractDataKey, pickSituationDataByOrder} from '@common/src/future';
    import { firstLetterLowercase } from '@common/src/utils/string';
    import {getAsync, postAsync} from '@/utils/request';

    interface TypeSelectedDataUnit {
        id: string;
        name: string; // 名字
        code: string; // code
        apiCode: string; // code
        isFold: boolean; // 是否展开功能页
        isUserSelected: boolean; // 是否自选
        status: string;
        /* 数据 */
        value1: string | number;
        value2: string | number;
        value3: string | number;
        value1class: string;
        value2class: string;
        value3class: string;
    }

    let dataSocketInstance: any = null;
    let keepCoedsData: any[]; // 合约查询的code数据
    let keepLastSituationData: any; // 保存最后一次的请求数据

    @Component({
        async asyncData({route}) {
            /* 获取数据
            *   jys=*
            *   typeid=*
            */
            const jys = route.query.jys;
            let typeid = route.query.typeid + ''; // 1=主力  2=自选
            if (typeid !== '1' && typeid !== '2') {
                typeid = '1';
            }
            let title = '';
            let dataType;
            let reqFunc1 = null;
            if (jys) {
                // 如果有交易所
                dataType = '3';
                reqFunc1 = postAsync('/quotation/getContractList', {
                    quotationSourceId: jys
                });
            } else if (typeid === '1') {
                dataType = '1';
                reqFunc1 = postAsync('/quotation/getContractList', {
                    mainBody: 1
                });
            } else {
                dataType = '2';
                reqFunc1 = postAsync('/quotation/getUserContractList', {
                    mainBody: 2
                });
            }

            const result = await Promise.all([
                reqFunc1,
                postAsync('/quotation/getAllQuotationIndex'),
                postAsync('/quotation/getTitleUserByUserId')
            ]);
            const resp = result?.[0]?.[1];
            let dataList: TypeSelectedDataUnit[] = [];
            if (resp?.code === '000000') {
                const data = resp?.data?.list || [];
                title = resp?.data?.title || '';
                dataList = data.map((item: any) => {
                    return {
                        id: item.quotationContractId + '',
                        name: item.contractName,
                        code: item.contractCode + '',
                        apiCode: item.apiCode + '',
                        value1: '',
                        value2: '',
                        value3: '',
                        status: '', // 1=上涨 2=下跌
                        isFold: false, // 是否展开功能页
                        isUserSelected: !!item.optional
                    };
                });
            }

            const resp2 = result?.[1]?.[1];
            let data2Arr: any[] = [];
            if (resp2?.code === '000000') {
                const data = resp2?.data || [];
                // console.log(JSON.stringify(data));
                data2Arr = data.map((item: any) => {
                    return {
                        id: item.quotationContractId + '',
                        name: item.contractName,
                        code: item.contractCode + '',
                        apiCode: item.apiCode + '',
                        status: '1', // 1=涨 0=跌
                        value1: '',
                        value2: '',
                        value3: ''
                    };
                });
            }

            const titleCapList: any[] = [];
            const resp3 = result?.[2]?.[1];
            if (resp3?.code === '000000') {
                const data = resp3?.data || [];
                const list1 = data?.['1']?.map((item: any) => {
                    return {
                        id: item.quotationTitleId,
                        name: item.titleName,
                        titleCode: item.titleCode
                    };
                }) || [];
                const list2 = data?.['2']?.map((item: any) => {
                    return {
                        id: item.quotationTitleId,
                        name: item.titleName,
                        titleCode: item.titleCode
                    };
                }) || [];
                const list3 = data?.['3']?.map((item: any) => {
                    return {
                        id: item.quotationTitleId,
                        name: item.titleName,
                        titleCode: item.titleCode
                    };
                }) || [];
                titleCapList.push(list1);
                titleCapList.push(list2);
                titleCapList.push(list3);
                // console.log(JSON.stringify(data));
            } else {
                [1, 2, 3].forEach(() => {
                    titleCapList.push([]);
                });
            }

            return {
                title,
                titleCapList,
                dataType: String(dataType),
                dataList,
                messageScrollList: data2Arr
            };
        }
    })
    export default class extends Vue {
        showMenu = false;
        skinType = '1';
        timeOutEvent = 0;

        dataType = ''; // 1=主力  2=自选 3=交易所
        title = '';
        dataList: TypeSelectedDataUnit[] = [];

        speciesList: any[] = []; // 期货交易所种类的id

        titleCapList: any = [[], [], []];
        titleCapIndex1 = 0;
        titleCapIndex2 = 0;
        titleCapIndex3 = 0;

        /* 最新的行情数据 */
        dataNewSituation = {};

        selectSettingLock = false;
        messageScrollList: any[] = []; // 滚动的消息列表

        async mounted() {
            // alert('ss' + navigator.platform);
            this.skinType = localStorage.getItem('currentSkinType') || '1';
            // 数据检验
            if (!this.titleCapList[0] || !this.titleCapList[1] || !this.titleCapList[2]) {
                console.log('title cap data 数据错误');
                return;
            }
            await this.getSocketData();

            if (this.dataType === '3') { // 交易所
                const [_, resp] = await getAsync('/quotation/getQuotationSpeciesByQuotationSourceId?quotationSourceId=' + this.$route.query.jys);
                const data = resp?.data;
                if (data && Array.isArray(data)) {
                    this.speciesList = data.map((item: any) => {
                        return {
                            quotationSpeciesId: item.quotationSpeciesId,
                            speciesName: item.speciesName
                        };
                    });
                }
            }
        }

        beforeDestroy() {
             this.destroySocketData();
        }

        async getSocketData() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                if (errCode === 0) {
                    keepLastSituationData = incomeData as any;
                    this.handleSituationData(incomeData, 'auto');
                } else {
                    // todo
                }
            });
            /* 合并code查询 */
            const codesArray1 = this.dataList.map((item: TypeSelectedDataUnit) => item.apiCode);
            const codesArray2 = this.messageScrollList.map((item: any) => item.apiCode);
            keepCoedsData = Array.from(new Set(codesArray1.concat(codesArray2))); // 去重
            const results = await dataSocketInstance.connect();
            results?.[1] && dataSocketInstance.sendContractTickGroupMessage(keepCoedsData); // 发送
        }

        destroySocketData() {
            dataSocketInstance = null;
        }

        /* 处理行情数据 */
        handleSituationData(dataArr: any[], handleType: 'auto' | 'manual') {
            // console.log('收到数据：', dataArr);
            if (!dataArr) {
                return;
            }
            for (let i = 0; i < dataArr.length; ++i) {
                const data = dataArr[i];

                const key1 = firstLetterLowercase(this.titleCapList[0][this.titleCapIndex1]?.titleCode);
                const key2 = firstLetterLowercase(this.titleCapList[1][this.titleCapIndex2]?.titleCode);
                const key3 = firstLetterLowercase(this.titleCapList[2][this.titleCapIndex3]?.titleCode);
                const showData: any = pickSituationDataByOrder(data, [
                    key1,
                    key2,
                    key3,
                    EnumContractDataKey.price, // 价格
                    EnumContractDataKey.highLimited, // 跌停价
                    EnumContractDataKey.lowLimited, // 跌停价
                    EnumContractDataKey.changeValue // 涨跌值
                ]);
                const find = this.dataList.find((item: any) => {
                    if (item.apiCode === showData.code) {
                        return true;
                    }
                });

                // console.log('查找', find);
                if (find) {
                    find.value1 = showData.value1;
                    find.value2 = showData.value2;
                    find.value3 = showData.value3;
                    find.value1class = key1;
                    find.value2class = key2;
                    find.value3class = key3;
                    // 4,5,6
                    let status = showData.value7 > 0 ? '1' : '0'; // 涨了或跌了
                    const isUpStop = showData.value4 >= showData.value5; // 是否涨停
                    const isDownStop = showData.value4 <= showData.value6; // 是否跌停
                    if (isUpStop) {
                        status = '1s';
                    }
                    if (isDownStop) {
                        status = '0s';
                    }
                    find.status = status;
                }

                if (handleType === 'auto') {
                    const showData2: any = pickSituationDataByOrder(data, [
                        EnumContractDataKey.price,
                        EnumContractDataKey.changeValue,
                        EnumContractDataKey.changeRate]);
                    const find2 = this.messageScrollList.find((item: any) => {
                        if (item.code === showData2.code) {
                            return true;
                        }
                    });
                    if (find2) {
                        find2.value1 = showData2.value1;
                        find2.value2 = showData2.value2;
                        find2.value3 = showData2.value3 !== undefined || showData2.value3 !== 0 ? showData2.value3 + '%' : '';
                        find2.status = showData2.value2 > 0 ? '1' : '0';
                    }
                }
            }
        }

        clickShowMenu() {
            this.showMenu = !this.showMenu;
        }

        clickOnFolder() {
            this.$router.push({
                path: '/future/main/information' + location.search
            });
        }

        clickOnOtherArea() {
            this.showMenu = false;
        }

        /* 自选或者取消自选 */
        async clickAddSelect(idx: number, targetStatus: boolean) {
            if (this.selectSettingLock) {
                console.log('正在处理');
                return;
            }
            // if (!await checkAuth()) {
            //     return;
            // }
            const obj = this.dataList[idx];
            if (!obj) {
                return;
            }
            this.selectSettingLock = true;
            const [err, resp] = await postAsync('/quotation/updateContractUser', {
                quotationContractId: obj.id,
                type: targetStatus ? 1 : 0
            });
            if (resp?.code === '000000') {
                if (targetStatus) {
                    this.$showToast('已添加至自选');
                } else {
                    this.$showToast('已从自选移除');
                }
                obj.isUserSelected = targetStatus;
            }
            this.selectSettingLock = false;
        }

        clickWarning(idx: number) {
            const obj = this.dataList[idx];
            if (!obj) {
                return;
            }
            this.$router.push({
                path: '/future/setting/warning',
                query: {
                    id: obj.id
                }
            });
        }

        clickMenu(type: number) {
            switch (type) {
                case 1:
                    this.$router.push('/future/setting/chart');
                    break;
                case 2:
                    this.changeSkin();
                    this.showMenu = false;
                    break;
                case 3:
                    this.$router.push('/future/position');
                    break;
            }
        }

        changeSkin() {
            let skinType = localStorage.getItem('currentSkinType') || '1'; // 1是白色 2是黑色 0是未定
            if (skinType === '1') {
                skinType = '2';
            } else {
                skinType = '1';
            }
            this.skinType = skinType;
            localStorage.setItem('currentSkinType', skinType);
        }

        touchX = 0;
        touchY = 0;

        // js
        touchStart(idx: number, ev: any) {
            this.touchX = ev.touches?.[0]?.pageX;
            this.touchY = ev.touches?.[0]?.pageY;
            window.clearTimeout(this.timeOutEvent);// 清除定时器
            this.timeOutEvent = window.setTimeout(() => {
                // 执行长按要执行的内容，
                this.dataList.forEach((item: TypeSelectedDataUnit, index: number) => {
                    if (index === idx) {
                        item.isFold = !item.isFold;
                    } else {
                        item.isFold = false;
                    }
                });
                this.timeOutEvent = 0;
            }, 200);// 这里设置定时
            ev.preventDefault();
        }

        // 手释放，如果在200毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
        touchEnd(idx: number) {
            if (this.timeOutEvent) {
                // 相当于点击事件
                let flag = false;
                this.dataList.forEach((item: TypeSelectedDataUnit, index: number) => {
                    if (item.isFold) {
                        flag = true;
                    }
                    item.isFold = false;
                });
                if (!flag) {
                    this.destroySocketData();
                    setTimeout(() => {
                        window.location.href = '/future/trend?id=' + this.dataList[idx].id; // 采用刷新方式进入，可以释放部分内存
                    });
                }
                clearTimeout(this.timeOutEvent);
            }
        }

        // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
        touchMove(idx: number, ev: any) {
            const touchX = ev.touches?.[0]?.pageX;
            const touchY = ev.touches?.[0]?.pageY;
            // console.log(this.touchX, touchX, this.touchY, touchY);
            // 部分手机长按会出现触发 touchMove现象，比如华为荣耀，所以还要判断是是不是移动位置超过限定
            if (Math.abs(this.touchX - touchX) > 10 || Math.abs(this.touchY - touchY) > 10) {
                // console.log('timeout, move 移動超出範圍');
                window.clearTimeout(this.timeOutEvent);// 清除定时器
                this.timeOutEvent = 0;
            }
            // console.log('timeout, move', ev.touches[0]);
        }

        clickAlert() {
            this.$router.push({
                path: '/situation/ss'
            });
        }

        clickDeal() {
            this.$showToast('功能开发中，敬请期待！');
        }

        clickQuantification() {
            this.$showToast('功能开发中，敬请期待！');
        }

        clickOnTitleMenu(order: number) {
            if (order === 1) {
                if (this.titleCapList[0].length <= 1) {
                    return;
                }
                this.titleCapIndex1 = (this.titleCapIndex1 + 1) % this.titleCapList[0].length;
            } else if (order === 2) {
                if (this.titleCapList[1].length <= 1) {
                    return;
                }
                this.titleCapIndex2 = (this.titleCapIndex2 + 1) % this.titleCapList[1].length;
            } else if (order === 3) {
                if (this.titleCapList[2].length <= 1) {
                    return;
                }
                this.titleCapIndex3 = (this.titleCapIndex3 + 1) % this.titleCapList[2].length;
            }
            if (this.dataList.length === 0) {
                return;
            }
            this.handleSituationData(keepLastSituationData, 'manual');
        }

        clickAddChoose() {
            this.$router.push('/future/situation/search');
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style/situation.scss';
    .index-icon-align-left {
        margin-left: 20px;
        margin-top: 20px;
    }

    .index-icon-align {
        margin-top: 20px;
    }

    .index-icon {
        width: 50px;
        height: 50px;
        display: inline-block;

        > img {
            width: 100%;
            height: 100%;
        }
    }

    .menu-mask {
        display: none;
        position: fixed;
        top: $nav-height;
        right: 0;
        left: 0;
        width: 100%;
        max-width: $max-screen-width;
        margin: 0 auto;
        height: 100vh;
        background-color: rgba(0, 0, 0, .4);
        z-index: 3000;

        &.show {
            display: block;
        }

        .menu {
            width: 240px;
            background-color: #fff;
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 6px;

            &.skin-2 {
                background-color: #454344;

                .list > li {
                    color: #999;
                }

                .list::after {
                    @include triangle(10px, #454344, 'top')
                }
            }
        }

        .list {
            padding: 10px 25px;
            position: relative;

            &::after {
                position: absolute;
                right: 10px;
                top: -10px;
                content: '';
                @include triangle(10px, #fff, 'top')
            }

            > li {
                margin: 25px 0;
                display: flex;
                align-items: center;
                font-size: 28px;

                > span {
                    color: #333;
                    font-size: 28px;
                }
            }

            .icon {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
    }

    .container {
        background-color: #fff;

        .pic-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: calc(100vh - #{$nav-height});
        }

        .top-bg {
            background: url('https://rs.tanxingk.com/images/bai1.png') top / 100% 100% no-repeat;
            width: 100%;
            height: 470px;
        }

        .bottom-bg {
            background: url('https://rs.tanxingk.com/images/bai3.png') top / 100% 100% no-repeat;
            width: 100%;
            height: 160px;
        }

        &.skin-2 {
            background-color: $color-dark-bg;

            .top-bg {
                background-image: url('https://rs.tanxingk.com/images/hei1.png');
            }

            .bottom-bg {
                background-image: url('https://rs.tanxingk.com/images/hei3.png');
            }
        }
    }
</style>
