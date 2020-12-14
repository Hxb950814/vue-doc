<template>
    <div>
        注册
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        message: string = 'hello Typescript2';

        mounted() {
            console.log(1);
        }
    }
</script>
