<template>
    <div>
        <div class="hbb-all-nav" style="overflow-x: hidden">
            <van-tabs v-model="coursesCurrent" class="van-tabs__wrap--scrollable">
                <van-tab
                        v-for="(item, index) in navList"
                        :key="index"
                        :title="item.courseTypeName + '课程'"

                >
                    <template v-if="page === 'home'">
                        <HomeList
                            ref="HomeLists"
                            :mode="coursesCurrent"
                            :courseId="item.courseId"
                        ></HomeList>
                    </template>
                    <template v-if="page === 'knowledge'">
                        <KnowledgeList
                            ref="KnowledgeLists"
                            :mode="coursesCurrent"
                            :courseId="item.courseId"
                        ></KnowledgeList>
                    </template>


                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import HomeList from './listView/homeList.vue'; // 首页的推荐课程列表
    import KnowledgeList from './listView/knowledgeList.vue'; // 求知页面的今日课程列表

    @Component({
        components:{
            HomeList,
            KnowledgeList
        }
    })
    export default class extends Vue {
        @Prop({ type: Array, default: [], required: false })
        navList!: [];
        @Prop({ type: String, default: '', required: false })
        page!: string;

        coursesCurrent:number = 0;
        courseId:number = 0;
    }
</script>

<style lang="scss" scoped>


</style>
