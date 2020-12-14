<template>
    <div class="form-input-area">
        <tableOfContentsView mode="3" title="保险" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import tableOfContentsView from '../components/tableOfContents/list.vue';

    @Component({
        components: {
            tableOfContentsView
        }
    })
    export default class extends Vue {
    }
</script>

<style lang="scss" scoped>

</style>
