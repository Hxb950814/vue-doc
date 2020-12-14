<template>
    <div>
        <div style="height: 0" v-wechat-title="pageData.courseName"></div>
        <img :src="pageData.sectionImgUrl" alt="">
        <!--   悬浮框部分   -->
        <FloatModal  v-if="floatModalState" page="course" @closeEvent="closeFloatModal"  @bookClick="bookClick"  @IntroductionEvent="Introduction" :courseListenSectionId="id"  @finishEvent="finishEvent"></FloatModal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import FloatModal from '@components/floatModal/index.vue';
    import {appweixin} from "@/utils/wechart";

    @Component({
        components:{
            FloatModal
        }
    })
    export default class extends Vue {
        floatModalState: boolean = false; // 悬浮弹层 是否启动
        id:string = ''; // 小节id
        type:string = ''; // 小节id
        pageData:any = {
            sectionImgUrl: '',
            courseImgUrl: '',
            courseDescribe: '',  // 描述.
            shareTitleImgUrl: '',   // 分享图片.
            courseName: ''  // 详情名称.
        }
        currentAudio:any = {
            contendUrl: ''
        }

        mounted() {
            // 启动悬浮弹层3
            this.id = String(this.$route.query.id)
            this.type = String(this.$route.query.type)
            this.getDetail();
        }

        getDetail() {
            let url = HomeModule.getUId ? location.href + '?abcde=' + HomeModule.getUId : location.href;
            HomeModule.getTryNoListenSectionInfo(this.id).then((res:any) => {
                this.pageData.sectionImgUrl = res?.data.sectionImgUrl;
                this.pageData.courseName = res?.data.courseName;
                this.pageData.courseDescribe = res?.data.courseDescribe;
                this.pageData.shareTitleImgUrl = res?.data.shareTitleImgUrl;
                this.currentAudio.contendUrl = res?.data.contendUrl;
                this.pageData.courseImgUrl = res?.data.courseImgUrl;
                this.$route.meta.title = res?.data.sectionTitle;
                appweixin.onMenuShare({
                    title: this.pageData.courseName,
                    desc: this.pageData.courseDescribe,
                    link: url,
                    show: location.href,
                    imgUrl: this.pageData.shareTitleImgUrl
                });
                this.floatModalState = true;
            })
        }

        finishEvent() {
            // 监听音频已经播放完毕
            location.reload()
        }

        closeFloatModal() {
            // 关闭悬浮弹层
            this.$router.back();
            this.floatModalState = false;
        }

        Introduction() {
            // 悬浮层的课程介绍
            let url = this.type === '1' ? '/home/curriculum' : '/home/seekCurriculum'
            this.$router.push({
                path:url,
                query: {
                    t: '1',

                }
            })
        }

        bookClick() {
            // 悬浮层的课程介绍
            let url = this.type === '1' ? '/home/curriculum' : '/home/seekCurriculum'
            this.$router.push({
                path:url,
                query: {
                    t: '0'
                }
            })
        }

    }
</script>

<style lang="scss" scoped>

</style>
