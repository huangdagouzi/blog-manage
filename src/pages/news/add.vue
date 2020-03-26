<template>
    <div>
        <div class="container">
            <el-form ref="form" :model="form" label-position="left" label-width="80px">
                <el-form-item label="标题">
                    <el-col :span="8">
                        <el-input v-model="form.title"></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="封面图片">
                    <el-col :span="8">
                        <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadFile">
                            <img v-if="form.cover" :src="url + form.cover" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="发布时间">
                    <el-col :span="4">
                        <el-date-picker placeholder="选择时间" value-format="timestamp" v-model="form.publishTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="新闻作者">
                    <el-col :span="8">
                        <el-input v-model="form.author"></el-input>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="文字">
                    <el-col :span="16">
                        <el-input type="textarea" v-model="form.content"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option key="jr" label="生活" value="1"></el-option>
                        <el-option key="kj" label="技术" value="2"></el-option>
                        <!-- <el-option key="mtbd" label="媒体报道" value="3"></el-option>
                        <el-option key="zthd" label="专题活动" value="4"></el-option> -->
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="新闻来源">
                    <el-col :span="8">
                        <el-input v-model="form.source"></el-input>
                    </el-col>
                </el-form-item> -->
                <!-- <el-form-item label="正文">
                    <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
                </el-form-item> -->
                <el-form-item>
                    <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
                </el-form-item>
            </el-form>
            <el-upload class="upload-pic" :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" :limit="1">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </div>
    </div>
</template>

<script>
import * as ajaxUrl from '../../request/api';
import axios from 'axios';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'] // remove formatting button
];

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
    name: 'editor',
    data() {
        return {
            uploadUrl: '',
            content: '',
            form: {},
            editorOption: {
                placeholder: 'Hello World',
                modules: {
                    toolbar: {
                        container: toolbarOptions, // 工具栏
                        handlers: {
                            image: function(value) {
                                if (value) {
                                    // 调用图片上传
                                    document.querySelector('.el-upload').click();
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            url: ""
        };
    },
    components: {
        quillEditor
    },
    created() {
        this.url = axios.defaults.baseURL;
        this.uploadUrl = axios.defaults.baseURL + '/static/upload';
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        submit() {
            ajaxUrl.addBlog(this.form).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('提交成功！');
                    this.form = {};
                    this.$router.push('/news/list');
                }
            });
        },
        handleSuccess(res) {
            // 获取富文本组件实例
            let quill = this.$refs.myTextEditor.quill;
            console.log(res);
            // 如果上传成功
            if (res) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, 'image', axios.defaults.baseURL + '/static' + res.data);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                this.$message.error('图片插入失败');
            }
        },
        uploadFile(params) {
            const file = params.file,
                fileType = file.type,
                isImage = fileType.indexOf('image') != -1,
                isLt2M = file.size / 1024 / 1024 < 2;
            // 这里常规检验，看项目需求而定
            if (!isImage) {
                this.$message.error('只能上传图片格式png、jpg、gif!');
                return;
            }
            if (!isLt2M) {
                this.$message.error('只能上传图片大小小于2M');
                return;
            }
            // 根据后台需求数据格式
            const form = new FormData();
            // 文件对象
            form.append('file', file);
            // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
            form.append('clientType', 'xxx');
            // 项目封装的请求方法，下面做简单介绍
            ajaxUrl
                .staticUpload(form)
                .then(res => {
                    this.form.cover = '/static' + res.data.data;
                })
                .catch(() => {
                    // xxx
                });
        }
    }
};
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
.upload-pic {
    display: none;
}
</style>
