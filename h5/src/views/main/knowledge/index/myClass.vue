<template>
    <div>
        <img width='100%' src="@assets/images/mbbg.jpg" alt="">
        <ClassView></ClassView>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {KnowledgeModule} from "@/store/modules/user/knowledge";
    import ClassView from '../learningCircle/class.vue';
    @Component({
        components:{ClassView}
    })
    export default class extends Vue {
        couponCurrent = 1;
        navList:any[] = [];

        mounted() {
            KnowledgeModule.getmyClassList().then((res:any) => {
                this.navList = res?.data || [];
            })
        }

    }
</script>

<style lang="scss" scoped>

</style>
