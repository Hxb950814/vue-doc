<template>
    <div>
        <div class="page-cap-title">
            求知ICON
        </div>
        <viewMain mode="2" title="求知ICON" />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import viewMain from '../../components/viewMain.vue';
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
