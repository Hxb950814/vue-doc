<!--平台公告-->
<template>
    <div>
        <tk-header class="normal" active-kind="deal"/>
        <div class="container">
            <div class="main-content">
                <div class="visual-area">
                    <div class="account-container">
                        <tk-account-sidebar ref="sidebar" />
                        <div class="effect-area">
                            <!--<component :is="currentTabComponent" ref="tabComp" />-->
                            <nuxt-child style="width: 100%" keep-alive :foobar="123" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import TkAccountSidebar from '@/components/common/TkAccountSidebar.vue';

    @Component({
        middleware: ['auth', 'redirect'],
        components: {
            TkHeader,
            TkFooter,
            TkAccountSidebar
        }
    })
    export default class extends Vue {
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
</style>
