<template>
    <div class="tk-loading-cap">
        <div class="block">
            <i class="ball"></i>
            <i class="ball"></i>
            <i class="ball"></i>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class TkLoadingCap extends Vue {
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .tk-loading-cap {
        min-height: 120px;

        .block {
            background-color: #fafafa;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;

            .ball {
                display: block;
                border-radius: 50%;
                background-color: #eaeaea;
                width: 8px;
                margin: 0 5px;
                height: 8px;

                &:nth-child(1) {
                    animation: change .9s infinite steps(1, start);
                }

                &:nth-child(2) {
                    animation: change .9s .3s infinite steps(1, start);
                }

                &:nth-child(3) {
                    animation: change .9s .6s infinite steps(1, start);
                }
            }
        }
    }

    @keyframes change {
        33% {
            background-color: #eaeaea;
        }
        66% {
            background-color: #ddd;
        }
    }
</style>
