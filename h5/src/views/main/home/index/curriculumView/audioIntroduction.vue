<template>
    <div class="hbb-audio-box">
        <img :src="srcImg" alt="" />
        <!-- 已经到底了 -->
        <div class="hbb-noData">
            已经到底了哦~
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({type: String, default: '', required: false})
        srcImg!:string;


    }
</script>

<style lang="scss" scoped>
.hbb-audio-box{
    img{
        display: block;
        width: 100%;
    }
    .hbb-noData{
        display: flex;
        width: 100%;
        margin: 40px 0;
        justify-content: center;
        color: #bbb;
        font-size: 26px;
    }
}
</style>
