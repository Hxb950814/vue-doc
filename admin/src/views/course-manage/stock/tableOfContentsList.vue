<template>
    <div class="form-input-area">
        <tableOfContentsView mode="1" title="股票" />
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
