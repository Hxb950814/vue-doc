<template>
    <div class="hbb-noB">
        <div class="form-input-area">
            <MembersView mode="3" title="认证" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MembersView from '../components/members.vue';
    @Component({
        components: {
            MembersView
        }
    })
    export default class extends Vue {
        id = ''; // id
    }
</script>

<style lang="scss" scoped>
</style>
