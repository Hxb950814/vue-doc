<template>
    <div :class="mode === '1' ? 'nav-bar nav-barBlock': 'nav-bar'">
        <div class="left">
            <slot name="left">
                <i class="arrow" @click="clickBack" />
            </slot>
        </div>
        <div class="text">
            <slot />
        </div>
        <div class="right">
            <slot name="right" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({
        asyncData() {
            return {
                // abc: 1
            };
        }
    })
    export default class TkNavBar extends Vue {
        pageTitle = 'hello Typescript';
        @Prop({type: String, default: '', required: false})
        private mode?: string;
        // abc = 23;

        clickBack() {
            // console.log(process.env.APP_ENV);
            // console.log(process.env.SERVER_PORT);

            // debugger;
            window.history.go(-1);
        }
    }
</script>

<style lang="scss" scoped>

</style>
