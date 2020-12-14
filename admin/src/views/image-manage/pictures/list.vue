<template>
    <div>
        <div class="page-cap-title">
            Banner管理
        </div>
        <viewMain mode="7" title="Banner" />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import viewMain from '../components/viewMain.vue';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {
            viewMain
        }
    })
    export default class extends Mixins(commonTable) {}
</script>

<style lang="scss" scoped>
</style>
