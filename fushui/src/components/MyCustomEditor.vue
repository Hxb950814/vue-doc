<template>
    <div>
        <vue-editor
            v-model="content"
            class="myui-richtext-editor"
            :editor-toolbar="editorTabbarConf"
            :disabled="disabled"
            :use-custom-image-handler="true"
            placeholder=""
            @image-added="handleImageAdded"
        />
    </div>
</template>

<script lang="ts">
    // 文档地址： https://www.vue2editor.com/
    import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {
            VueEditor
        }
    })
    export default class MyCustomEditor extends Vue {
        @Prop({type: String, required: true, default: ''})
        content?: string;

        @Prop({type: Boolean, default: false})
        disabled?: boolean;

        editorTabbarConf = [
            // 'bold', {'color': ['#fff', '#333', '#666', '#999']},
            // {'background': ['#fff', '#fffbf5', '#f4fbff', '#fff8ff', '#f5fff3', '#fbfbff', '#f7fafa']},
            // 'blockquote'
        ];

        mounted() {
            // console.log(this.disabled);
        }

        @Watch('content')
        onContentChange(val: string) {
            this.$emit('update:content', val);
        }

        @Watch('disabled')
        onDisabledChange(val: string) {
            // console.log('disabled变化', this.disabled);
        }

        handleImageAdded(file: File, Editor: any, cursorLocation: any, resetUploader: any) {
            // An example of using FormData
            const formData = new FormData();
            formData.append('fileName', file);
            this.$post('/upload/fileUpload', formData, {
                paramType: 'file'
            }).then((res: any) => {
                if (res.code === '000000') {
                    const url = res.data.fileUrl; // Get url from response
                    Editor.insertEmbed(cursorLocation, 'image', url);
                    resetUploader();
                }
            });
        }
    }
</script>
