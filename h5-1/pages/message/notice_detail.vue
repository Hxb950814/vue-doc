<template>
    <div class="container">
        <tk-nav-bar>平台公告</tk-nav-bar>
        <div class="container">
            <div class="content-wrapper">
                <h2 class="title">
                    {{ title }}
                </h2>
                <div class="content" v-html="content" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
    })
    export default class extends Vue {
        id = '';
        title = '';
        content = '';

        mounted() {
            this.id = this.$route.query.id + '';
            if (this.id === '' || this.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.getData();
        }

        async getData() {
            this.$showLoading();
            const [_, resp] = await postAsync('/operate/getAfficheDetail', {
                afficheId: this.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.title = resp.data.title;
                this.content = resp.data.content;
            } else {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        min-height: 100vh;
        background-color: #fff;
    }

    .content-wrapper {
        text-align: center;
        padding: 38px;

        .title {
            font-size: 40px;
            color: #333;
            padding-bottom: 20px;
        }

        /deep/ .content {
            text-align: left;
            font-size: 28px;
            line-height: 1.6;

            * {
                font-size: 28px;
                line-height: 1.6;
                color: #666;
            }

            img {
                width: 100%;
            }
        }
    }
</style>
