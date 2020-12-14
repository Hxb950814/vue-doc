<template>
    <div>
        <div class="help-con" v-html="content">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {KnowledgeModule} from "@/store/modules/user/knowledge";

    @Component({})
    export default class extends Vue {
        @Prop({type:Number, default: 0, required: false})
        questionId!:number;

        content = '';

        mounted() {
            this.getData();
        }

        getData() {
            let requestObj = {
                questionId: this.questionId
            }
            KnowledgeModule.getQueryQuestionById(requestObj).then((res:any) => {
                console.log(res)
                this.content = res?.data.content
            })
        }
    }
</script>

<style lang="scss">
.help-con{
    margin:40px 0;
    padding: 0 30px;
    line-height: 45px;
    width: 100%;
    font-size: 24px;
    img{
        width: 100% !important;
    }
    p{
        img{
            width: 100% !important;
        }
    }

}
</style>
