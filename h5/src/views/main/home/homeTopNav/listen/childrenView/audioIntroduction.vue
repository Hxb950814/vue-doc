<template>
    <div class="hbb-audio-box">
        <img :src="imgSrc" alt="" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {

        imgSrc:string = '';

        mounted() {

        }
        active(res:string) {
            this.imgSrc = res;
        }
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
