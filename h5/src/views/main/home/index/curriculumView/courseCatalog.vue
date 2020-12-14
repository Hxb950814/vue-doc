<template>
    <div>
        <van-collapse v-model="courseChapterId" accordion class="hbb-fff">
            <!-- 页面来源 type:1 直接进入课程目录  2：视频页面弹起课程列表 -->
            <template v-if="type === 1">
                <template v-if="list.length > 1">
                    <van-collapse-item v-for="(item,index) in list" :key="index" :name="(item.courseChapterId)+''">
                                <template #title>
                                    <div class="c-van-top">
                                        <h2>{{item.chapterNo}}</h2>
                                        <p>{{item.chapterTitle}}</p>
                                    </div>
                                </template>
                                <ul class="hbb-ke-ul1" v-if="item.chapterSectionBoList.length > 0">
                                    <li style="height: 45px" v-for="(ite,ind) in item.chapterSectionBoList" :key="ind" @click="doPlay(ite)">
                                        <div class="l">
                                            <p style="display: flex;">第{{ite.sectionNo}}节 <span style="margin-left: 8px"></span>{{ite.sectionTitle}}
                                                    <span class="ke-type ke-type1">
                                                        <img  width="14px" src="@assets/images/video.png" v-if="ite.courseFrom === 0" alt="">
                                                        <img  width="14px" src="@assets/images/audio.png" v-if="ite.courseFrom === 1" alt="">
                                                        <img  width="14px" src="@assets/images/audiovideo.png" v-if="ite.courseFrom === 2" alt="">
                                                    </span>
                                            </p>
                                        </div>
                                        <div class="r">
                                            <span class="tt" v-if="hasBuy === 0 && ite.isAudition === 1">{{ite.courseFrom !== 1 ? '试看': '试听'}}</span>
                                            <span class="tt" v-if="ite.isAudition === 0" style="border: none">
                                                <span class="bb" style="background:none" v-if="hasBuy === 0 || ite.status === 3"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="1" style="height: 15px; width: 15px;"><path d="M224 799.936v-319.84L223.744 480 800 480.096 800.256 800 224 799.936z m170.304-483.328A124.672 124.672 0 0 1 518.72 192a124.704 124.704 0 0 1 124.48 124.608V416h-248.896V316.608zM800.256 416H707.2V316.608A188.736 188.736 0 0 0 518.72 128c-103.904 0-188.416 84.608-188.416 188.608V416h-106.56A64 64 0 0 0 160 480.096v319.84A64 64 0 0 0 223.744 864h576.512A64 64 0 0 0 864 799.936v-319.84A64 64 0 0 0 800.256 416z M512 544a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0v-128a32 32 0 0 0-32-32" style="fill: rgb(102, 102, 102);"></path></svg></span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                    </van-collapse-item>
                </template>
                <template v-else>
                    <ul class="hbb-ke-ul1" v-if="list.length === 1">
                        <li style="height: 45px" v-for="(ite,ind) in list[0].chapterSectionBoList" :key="ind" @click="doPlay(ite)">
                            <div class="l">
                                <p  style="display: flex;">第{{ite.sectionNo}}节 <span style="margin-left: 8px"></span>{{ite.sectionTitle}}
                                    <span class="ke-type ke-type1">
                                        <img  width="14px" src="@assets/images/video.png" v-if="ite.courseFrom === 0" alt="">
                                        <img  width="14px" src="@assets/images/audio.png" v-if="ite.courseFrom === 1" alt="">
                                        <img  width="14px" src="@assets/images/audiovideo.png" v-if="ite.courseFrom === 2" alt="">
                                    </span>
                                </p>
                            </div>
                            <div class="r">
                                <span class="tt" v-if="hasBuy === 0 && ite.isAudition === 1">{{ite.courseFrom !== 1 ? '试看': '试听'}}</span>
                                <span class="tt" v-if="ite.isAudition === 0" style="border: none">
                                    <span class="bb" style="background:none" v-if="hasBuy === 0 || ite.status === 3"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="1" style="height: 15px; width: 15px;"><path d="M224 799.936v-319.84L223.744 480 800 480.096 800.256 800 224 799.936z m170.304-483.328A124.672 124.672 0 0 1 518.72 192a124.704 124.704 0 0 1 124.48 124.608V416h-248.896V316.608zM800.256 416H707.2V316.608A188.736 188.736 0 0 0 518.72 128c-103.904 0-188.416 84.608-188.416 188.608V416h-106.56A64 64 0 0 0 160 480.096v319.84A64 64 0 0 0 223.744 864h576.512A64 64 0 0 0 864 799.936v-319.84A64 64 0 0 0 800.256 416z M512 544a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0v-128a32 32 0 0 0-32-32" style="fill: rgb(102, 102, 102);"></path></svg></span>
                                </span>
                            </div>
                        </li>
                    </ul>
                </template>
            </template>
            <!-- 课程列表 -->
            <template v-if="type === 2 || type === 3">
                <template v-if="list.length > 1">
                    <van-collapse-item  v-for="(item,index) in list" :key="index" :title="item.chapterNo" :name="(item.courseChapterId)+''">
                        <ul class="hbb-ke-ul1" v-if="item.chapterSectionBoList.length > 0">
                            <li style="flex-direction: column;"  v-for="(ite,ind) in item.chapterSectionBoList" :key="ind" @click="doPlay(ite)" :class="chapterSectionId === ite.chapterSectionId ? 'chapterSectionIdActive': ''">
                                <div class="l hasBuy">
                                    <p>第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}第{{ite.sectionNo}}节 <span style="margin-left: 5px"></span>{{ite.sectionTitle}}
                                    </p>
                                </div>
                                <div class="l hasBuy">
                                    <span class="ke-type" style="font-size: 12px;">{{ ['视频', '音频', '音频+视频'][ite.courseFrom]}}</span>
                                    <span class="ke-type"  style="font-size: 12px;">{{['待学习', '学习中', '已学习', '待解锁' ][ite.status]}}</span>
                                    <span style="color: #999;font-size: 12px;margin-left: 5px">{{daySet(ite.date)}}</span>
                                    <span class="tt" v-if="ite.isAudition === 0" style="border: none">
                                     <span class="bb" style="background:none"  v-if="ite.status === 3"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="1" style="height: 15px; width: 15px;"><path d="M224 799.936v-319.84L223.744 480 800 480.096 800.256 800 224 799.936z m170.304-483.328A124.672 124.672 0 0 1 518.72 192a124.704 124.704 0 0 1 124.48 124.608V416h-248.896V316.608zM800.256 416H707.2V316.608A188.736 188.736 0 0 0 518.72 128c-103.904 0-188.416 84.608-188.416 188.608V416h-106.56A64 64 0 0 0 160 480.096v319.84A64 64 0 0 0 223.744 864h576.512A64 64 0 0 0 864 799.936v-319.84A64 64 0 0 0 800.256 416z M512 544a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0v-128a32 32 0 0 0-32-32" style="fill: rgb(102, 102, 102);"></path></svg></span>
                                     </span>
                                </div>
<!--                                <div class="r">-->
<!--                                    <span class="tt" v-if="hasBuy === 0 && ite.isAudition === 1">{{ite.courseFrom === 0 ? '试看': '试听'}}</span>-->
<!--                                    <span class="tt" v-if="ite.isAudition === 0" style="border: none">-->
<!--                                        <span class="b" v-if="ite.status === 0"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: calc(100% - 0px); width: calc(100% - 0px);"><path d="M224 799.936v-319.84L223.744 480 800 480.096 800.256 800 224 799.936z m170.304-483.328A124.672 124.672 0 0 1 518.72 192a124.704 124.704 0 0 1 124.48 124.608V416h-248.896V316.608zM800.256 416H707.2V316.608A188.736 188.736 0 0 0 518.72 128c-103.904 0-188.416 84.608-188.416 188.608V416h-106.56A64 64 0 0 0 160 480.096v319.84A64 64 0 0 0 223.744 864h576.512A64 64 0 0 0 864 799.936v-319.84A64 64 0 0 0 800.256 416z M512 544a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0v-128a32 32 0 0 0-32-32" style="fill: rgb(102, 102, 102);"></path></svg></span>-->
<!--                                    </span>-->
<!--                                </div>-->
                            </li>
                        </ul>
                    </van-collapse-item>
                </template>
                <template v-else>
                    <ul class="hbb-ke-ul1" v-if="list.length === 1">
                        <li style="flex-direction: column;" v-for="(ite,ind) in list[0].chapterSectionBoList" :key="ind" @click="doPlay(ite)">
                            <div class="l hasBuy">
                                <p>第{{ite.sectionNo}}节 <span style="margin-left: 8px"></span>{{ite.sectionTitle}} </p>
                            </div>
                            <div class="l hasBuy">
                                <span class="ke-type" style="font-size: 12px;">{{['视频', '音频', '音频+视频'][ite.courseFrom]}}</span> <span class="ke-type"  style="font-size: 12px;">{{['待学习', '学习中', '已学习', '待解锁' ][ite.status]}}</span>
                                <span style="color: #999;font-size: 12px;margin-left: 5px">{{daySet(ite.date)}}</span>
                                <span class="tt" v-if="ite.isAudition === 0" style="border: none">
                                    <span class="bb" style="background:none" v-if="ite.status === 3"><svg style="width:15px;height:15px;" viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="1"><path d="M224 799.936v-319.84L223.744 480 800 480.096 800.256 800 224 799.936z m170.304-483.328A124.672 124.672 0 0 1 518.72 192a124.704 124.704 0 0 1 124.48 124.608V416h-248.896V316.608zM800.256 416H707.2V316.608A188.736 188.736 0 0 0 518.72 128c-103.904 0-188.416 84.608-188.416 188.608V416h-106.56A64 64 0 0 0 160 480.096v319.84A64 64 0 0 0 223.744 864h576.512A64 64 0 0 0 864 799.936v-319.84A64 64 0 0 0 800.256 416z M512 544a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0v-128a32 32 0 0 0-32-32" style="fill: rgb(102, 102, 102);"></path></svg></span>
                                </span>
                            </div>
<!--                            <div class="r">-->
<!--                                <span class="tt" v-if="hasBuy === 0 && ite.isAudition === 1">{{ite.courseFrom === 0 ? '试看': '试听'}}</span>-->
<!--                                <span class="tt" v-if="ite.isAudition === 0" style="border: none">-->
<!--                                    -->
<!--                                </span>-->
<!--                            </div>-->
                        </li>
                    </ul>
                </template>
            </template>
        </van-collapse>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import dayjs from "dayjs";
    import {tabIndexFn} from "@/utils";

    @Component({})
    export default class extends Vue {
        @Prop({type: Array, default: [], required: false})
        list!:[]
        @Prop({type: Number, default: 0, required: false})
        hasBuy!:number
        @Prop({type: Number, default: 1, required: false})
        type!:number
        @Prop({type: Number, default: 0, required: false})
        chapterSectionId!:number
        @Prop({type: String, default: '', required: false})
        courseChapterId!:string

        isUnlock:boolean = false;

        daySet(s:any) {
            return dayjs(s).format('YYYY-MM-DD');
        }

        doPlay(ite:any) {
            if(this.hasBuy === 0 && ite.isAudition === 0) {
                this.$toast('尚未购买此课程，无法观看');
                return false;
            } else if(ite.status === 3) {
                this.$toast('该课程未解锁');
                return false;
            } else {
                this.isUnlock = false;
                if(ite.courseFrom === 1) {
                    this.$router.push({
                        path:"/home/audition",
                        query: {
                            id: ite.chapterSectionId,
                            type: String(this.type)
                        }
                    })
                } else {
                    if(this.type === 1 || this.type === 2) {
                        this.$router.push({
                            path:"/home/lookVideo",
                            query: {
                                id: ite.chapterSectionId,
                                cId: this.$route.query.id
                            }
                        })
                    } else {
                        this.$emit('lookVideoEvent', ite)
                    }

                }
            }
        }
    }
</script>

<style lang="scss">
.hbb-ke-ul1{
    display: flex;
    width: 100%;
    flex-direction: column;
    li{
        display: flex;
        width: 100%;
        padding: 0 30px;
        justify-content: space-between;
        border-bottom: 2px solid #eee;
        align-items: center;
        &.chapterSectionIdActive{
            background: #efefef;
        }
        .l{
            width: calc(100% - 100px);

            p{
                @include ellipsis(1);
                &:nth-of-type(1){
                    color: $base-font-color;
                    font-size: 26px;
                }

            }
            &.hasBuy{
                align-items: center;
                display: flex;
                width: 100%;
                margin-bottom: 8px;
            }
            .ke-type{
                 margin-left: 5px;
                 padding: 5px 10px;
                 background: #eee;
                 color: #FDA11D;
                font-size: 24px;
                border-radius: 5px;
                &.ke-type1{
                    background: none;
                    border-radius: 0;
                }
             }
        }
        .r{
            display: flex;
            width: 100px;
            justify-content: flex-end;
            .tt{
                display: flex;
                width: 80px;
                height: 50px;
                justify-content: center;
                align-items: center;
                border: 2px solid #ffc000;
                border-radius: 20px;
                color: #ffc000;
            }
            .bb{
                width: 40px;
                height: 48px;
                border-radius: 6px;
                font-size: 24px;
                color: #fff;
                text-align: center;
            }
        }
    }
}
.c-van-top{
    display: flex;
    align-items: center;
    h2{
        font-size: 28px;
        color: #333;
        font-weight: normal;
    }
    p{
        margin-left: 10px;
        font-size: 26px;
        color: #666;
    }
}
</style>
