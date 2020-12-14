<template>
    <div class="container">
        <tk-header :class="{normal: topNavStyle === 1}" />
        <main class="main-content">
            <div class="banner" />
            <div class="hot-index">
                <div class="content">
                    <div class="title">
                        热门指数
                    </div>
                    <div class="data-line">
                        <el-carousel ref="indexSlide" height="60px" direction="vertical" :autoplay="false" :loop="true" :interval="5">
                            <el-carousel-item v-for="(item,idx) in hotIndex" :key="idx" style="display: flex">
                                <div>
                                    <span class="name">{{ item.item1Name }}</span>
                                    <span class="value" v-html="item.item1ValueStr" />
                                </div>
                                <div>
                                    <span class="name">{{ item.item2Name }}</span>
                                    <span class="value" v-html="item.item2ValueStr" />
                                </div>
                                <div>
                                    <span class="name">{{ item.item3Name }}</span>
                                    <span class="value" v-html="item.item3ValueStr" />
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <div class="updown-menu">
                        <div class="button up" @click="clickIndexTick('up')" />
                        <div class="button down" @click="clickIndexTick('down')" />
                    </div>
                </div>
            </div>
            <div class="data-block">
                <div class="content">
                    <div class="left-part">
                        <SwiperView  mode="1" ref="SwiperView" />
                    </div>
<!--                    <div class="right-part">-->
<!--                        <img src="//rs.tanxingk.com/images/tk_wx_ding.jpg" alt="" class="pic">-->
<!--                        <p class="title">-->
<!--                            下单大师-->
<!--                        </p>-->
<!--                        <p class="desc">-->
<!--                            行业行情更清晰,助你一臂之力-->
<!--                        </p>-->
<!--                    </div>-->
                </div>
            </div>
            <div class="news-block">
                <div class="content">
                    <div>
                        <div class="title">
                            <div class="text">
                                期货资讯
                            </div>
                            <nuxt-link class="more" to="/news/list">
                                更多
                            </nuxt-link>
                        </div>
                        <ul class="news-ul">
                            <template v-if="newsList.length > 0">
                                <li v-for="(item,idx) in newsList" :key="item.idx" @click="clickArticle(item.id)">
                                    <template v-if="item.showDetail">
                                        <div class="news-show">
                                            <div>
                                                <img class="news-pic" :src="item.pic" alt="">
                                            </div>
                                            <div class="content-block">
                                                <p class="t-title">
                                                    {{ item.title }}
                                                </p>
                                                <time class="time">{{ item.time }}</time>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="!item.showDetail">
                                        <div class="common" @mouseenter="showNewsLi(idx)">
                                            <span class="stitle">{{ item.title }}</span>
                                            <time class="time">{{ item.time }}</time>
                                        </div>
                                    </template>
                                </li>
                            </template>
                            <template v-else>
                                <div class="no-data">
                                    暂无资讯
                                </div>
                            </template>
                        </ul>
                    </div>
                    <div>
                        <div class="title">
                            <div class="text">
                                平台公告
                            </div>
                            <nuxt-link class="more" to="/message/notice_list">
                                更多
                            </nuxt-link>
                        </div>
                        <ul class="news-ul">
                            <template v-if="noticeList.length > 0">
                                <li v-for="item in noticeList" :key="item.id" class="common" @click="clickNotice(item.id)">
                                    <span class="stitle">{{ item.title }}</span>
                                    <time class="time">{{ item.time }}</time>
                                </li>
                            </template>
                            <template v-else>
                                <div class="no-data">
                                    暂无公告
                                </div>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { ContractDataSocket } from '@common/src/future';
    import SwiperView from '@/components/common/HBSwiperView.vue';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import { getAsync, postAsync } from '@/utils/request';

    let dataSocketInstance: any;
    @Component({
        components: {
            TkHeader,
            TkFooter,
            SwiperView
        }
    })
    export default class extends Vue {
        topNavStyle = 0;
        hotIndex: any[] = []; // 热门指数数据
        newsList: any[] = []; // 新闻数据
        noticeList: any[] = []; // 公告数据

        mounted() {
            // 监听页面滚动
            window.addEventListener('scroll', (ev) => {
                const scrollTop = document.documentElement.scrollTop ||
                    document.body.scrollTop;
                if (scrollTop > 10) {
                    this.topNavStyle = 1;
                } else {
                    this.topNavStyle = 0;
                }
            });

            window.addEventListener('pagehide', () => {
            });
            this.getIndexData();
            this.getHotIndexData();
            this.getArticleData();
        }

        async getArticleData() {
            const result = await Promise.all([
                postAsync('/affiche/getArticleIndex'), // 新闻5条
                postAsync('/affiche/getAfficheIndex') // 新闻
            ]);
            // console.log(result[0]?.[1]);
            const result1 = result[0]?.[1];
            const result2 = result[1]?.[1];
            const newsList: any[] = [];
            const noticeList: any[] = [];
            if (result1 && result1.code === '000000') {
                (result1.data || []).forEach((item: any, idx: number) => {
                    newsList.push({
                        id: String(item.articleId),
                        title: item.title,
                        pic: item.imgName,
                        time: item.publishTime.split(' ')?.[0],
                        isHot: false,
                        showDetail: idx === 0
                    });
                });
            }
            if (result2 && result2.code === '000000') {
                (result2.data || []).forEach((item: any, idx: number) => {
                    noticeList.push({
                        id: item.afficheId,
                        time: item.publishTime.split(' ')?.[0],
                        title: item.title
                    });
                });
            }

            this.newsList = newsList;
            this.noticeList = noticeList;
        }

        async getHotIndexData() {
            const [err, resp] = await postAsync('/quotation/getAllQuotationIndex'); // 新闻
            if (resp?.code === '000000') {
                const data = resp?.data || [];
                const list:any[] = [];
                const contractCodes: any[] = [];
                for (let i = 0; i < data.length; i += 3) {
                    if (data?.[i]?.contractCode) {
                        contractCodes.push(data[i].contractCode);
                    }
                    if (data?.[i + 1]?.contractCode) {
                        contractCodes.push(data[i + 1].contractCode);
                    }
                    if (data?.[i + 2]?.contractCode) {
                        contractCodes.push(data[i + 2].contractCode);
                    }
                    contractCodes.push();
                    list.push({
                        item1Name: data?.[i]?.contractName || '',
                        item2Name: data?.[i + 1]?.contractName || '',
                        item3Name: data?.[i + 2]?.contractName || '',
                        item1Code: data?.[i]?.contractCode || '',
                        item2Code: data?.[i + 1]?.contractCode || '',
                        item3Code: data?.[i + 2]?.contractCode || '',
                        item1ValueStr: '',
                        item2ValueStr: '',
                        item3ValueStr: ''
                    });
                }
                this.hotIndex = list;
                // 根据数据来显示指数数据
                // 链接socket进行数据获取
                /* 开启socket */
                if (dataSocketInstance) {
                    const results = await dataSocketInstance.connect();
                    if (dataSocketInstance) {
                        dataSocketInstance.sendContractTickGroupMessage(contractCodes);
                    }
                }
            }
        }

        getIndexData() {
            // 创建
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                if (errCode === 0) {
                    this.handleSocketData(incomeData);
                } else {
                    console.log('error');
                }
            });
            // 主动清除
            this.$once('hook:beforeDestroy', () => {
                dataSocketInstance && dataSocketInstance.close();
                dataSocketInstance = null;
            });
        }

        handleSocketData(incomeDatas: any[]) {
            // console.log('接收数据1', incomeData);
            if (!incomeDatas || incomeDatas.length === 0) {
                return;
            }
            console.log('接收数据', incomeDatas);
           // const compareList = this.hotIndex.slice(0); // 浅拷贝
            for (let i = 0; i < incomeDatas.length; ++i) {
                const code = incomeDatas[i].code;
                const price = incomeDatas[i].price;
                const changeValue = incomeDatas[i].changeValue;
                const changeRate = incomeDatas[i].changeRate + '%';
                const htmlStr = `<span class="${price < 0 ? 'down' : 'up'}">${price}&nbsp;&nbsp;&nbsp;&nbsp;${changeValue}&nbsp;&nbsp;&nbsp;&nbsp;${changeRate}</span>`;
                this.hotIndex.forEach((item: any) => {
                    if (item.item1Code === code) {
                        item.item1ValueStr = htmlStr;
                    }
                    if (item.item2Code === code) {
                        item.item2ValueStr = htmlStr;
                    }
                    if (item.item3Code === code) {
                        item.item3ValueStr = htmlStr;
                    }
                });
            }
        }

        clickIndexTick(dir: string) {
            if (dir === 'up') {
                (this.$refs.indexSlide as any).prev();
            } else {
                (this.$refs.indexSlide as any).next();
            }
        }

        showNewsLi(idx: number) {
            // console.log(idx);
            this.newsList.forEach((item: any, i: number) => {
                item.showDetail = i === idx;
            });
        }

        clickArticle(id: string) {
            this.$router.push({
                path: '/news/detail',
                query: {
                    id
                }
            });
        }

        clickNotice(id: string) {
            this.$router.push({
                path: '/message/notice_detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .main-content {
        color: $color-main;
    }

    .banner {
        background-color: #7f828b;
        height: 578px;
    }

    .hot-index {
        background-color: #fff;
        height: 60px;

        .content {
            width: $width-visual-area;
            margin: 0 auto;
            height: 100%;
            display: flex;

            .title {
                width: 100px;
                line-height: 60px;
                font-size: 16px;
                color: #333;
                border-right: 1px solid #ddd;
            }

            .data-line {
                flex: 1;
                display: flex;
                align-items: center;

                > div {
                    flex: 1;
                    height: 34px;
                    line-height: 34px;
                    vertical-align: middle;

                    &:nth-child(2) {
                        border-right: 1px solid #ddd;
                        border-left: 1px solid #ddd;
                    }

                    padding-left: 40px;
                }

                .name {
                    color: #333;
                    font-size: 14px;
                    margin-right: 10px;
                    line-height: 34px;
                    display: inline-block;
                }

                /deep/ .value {
                    color: $color-up;
                    font-size: 14px;
                    line-height: 34px;
                    display: inline-block;
                    .up{
                        color: $color-up;
                    }
                    .down{
                        color: $color-down;
                    }
                }
            }

            .updown-menu {
                background-color: #f6f6f6;
                border-radius: 2px;
                width: 22px;
                height: 36px;
                align-self: center;

                .button {
                    height: 50%;
                    position: relative;
                    cursor: pointer;

                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        left: 0;
                        margin: 0 auto;
                        width: 8px;
                        height: 8px;
                    }

                    &.up::after {
                        top: 8px;
                        transform-origin: center;
                        transform: rotate(135deg); //translateY(-15px, 15px);
                        border-left: 1px solid #aaa;
                        border-bottom: 1px solid #aaa;
                    }

                    &.down::after {
                        top: 1px;
                        border-right: 1px solid #aaa;
                        border-top: 1px solid #aaa;
                        transform-origin: center;
                        transform: rotate(135deg);
                    }
                }
            }
        }
    }

    .data-block {
        margin: 20px 0;

        .content {
            width: $width-visual-area;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
        }

        .left-part {
            width: 100%;
            margin-right: 15px;
            border-radius: 5px;
            padding: 0 10px 10px 10px;
            background-color: #eaeef1;


        }

        .right-part {
            width: 308px;
            border-radius: 5px;
            background-color: #fff;
            text-align: center;
            padding-bottom: 50px;
            padding-top: 50px;

            .pic {
                width: 160px;
                height: 160px;
                display: block;
                margin: 0 auto;
            }

            .title {
                color: #333;
                padding-top: 20px;
                font-size: 16px;
            }

            .desc {
                color: #666;
                padding-top: 20px;
                font-size: 14px;
            }
        }
    }

    .news-block{
        margin-bottom: 20px;
        .title{
            height: 50px;
            padding: 0 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            .text{
                line-height: 50px;
                color: #333;
                font-size: 16px;
            }
            .more{
                cursor: pointer;
                color: #999;
                font-size: 14px;
                padding-right: 5px;
                position: relative;
                @include rightArrow(#ccc, 8px, 3px, -5px);
            }
        }
        .content{
            width: $width-visual-area;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            >div{
                width: calc(50% - 5px);
                background-color: #fff;
                border-radius: 5px;
                /*min-height: 290px;*/
            }
        }
        .news-ul{
            list-style: none;
            padding: 10px 15px;
            .no-data{
                text-align: center;
                padding-top: 120px;
                padding-bottom: 120px;
                color: #333;
                font-size: 15px;
            }
            li{
                color: #333;
                font-size: 15px;
                list-style: none;
                .stitle{
                    @include ellipsis(1);
                    width: 450px;
                    font-size: 15px;
                   // line-height: 40px;
                    display: inline-block;
                    cursor: pointer;
                    &:hover{
                        color: #0086ff;
                    }
                }

                .time{
                    float: right;
                    color: #999;
                    font-size: 13px;
                }
            }
            .common{
                height: 40px;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-left: 20px;
                &::after{
                    position: absolute;
                    content: '';
                    top: 17px;
                    left: 0;
                    width: 8px;
                    height: 8px;
                    border-radius: 100%;
                    background-color: #0086ff;
                }
            }
            .news-show{
                display: flex;
                margin: 10px 0;
                cursor: pointer;
                .news-pic{
                    width: 100px;
                    height: 100px;
                    display: block;
                    border: 1px solid #eaeaea;
                }
                .content-block{
                    margin-left: 13px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .t-title{
                        color: #0086ff;
                        font-size: 16px;
                        max-width: 450px;
                        @include ellipsis();
                    }
                    .time{
                        font-size: 13px;
                        color: #999;
                    }
                }
            }
        }
    }

    /deep/.banner .el-carousel,
    /deep/.banner .el-carousel__container{
        height: 100%;
    }
    /deep/ .el-carousel__item{
        display: flex;
        >div{
            width: 300px;
        }
    }

    /deep/ .banner{
        height: 540px;
        width: 100%;
        min-width: 1200px;
        margin: 0 auto;
        background:
            url(#{$cdn-path}/images/pc_banner_words.png) center / 350px 80px no-repeat,
            url(#{$cdn-path}/images/pc_banner.jpg) top / auto 100% no-repeat;

    }
</style>
