<template>
    <div class="form-input-area">
        <subsectionView mode="3" title="保险" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import subsectionView from '../components/subsection/list.vue';

    @Component({
        components: {
            subsectionView
        }
    })
    export default class extends Vue {
    }
</script>

<style lang="scss" scoped>

</style>
