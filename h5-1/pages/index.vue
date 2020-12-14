<template>
    <div />
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    @Component({
        middleware: 'home_rewrite'
    })
    export default class extends Vue {
        beforeCreate() {
        }

        created() {
        }

        mounted() {
        }
    }
</script>
