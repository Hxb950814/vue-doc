<template>
    <div class="form-input-area">
        <subsectionView mode="1" title="股票" />
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
