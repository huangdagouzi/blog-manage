<template>
    <div>
        <div class="container">
            <el-form ref="form" :model="form" label-position="left" label-width="80px">
                <el-form-item label="岗位名称">
                    <el-col :span="4">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-col :span="4">
                        <el-date-picker placeholder="选择时间" v-model="form.publishTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="学历">
                    <el-col :span="4">
                        <el-input v-model="form.education"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工作经验">
                    <el-col :span="4">
                        <el-input v-model="form.experience"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="招聘人数">
                    <el-col :span="4">
                        <el-input v-model="form.num"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="岗位类型">
                    <el-select v-model="form.tabId" placeholder="请选择">
                        <el-option v-for="item in jobTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-button style="margin-left:10px" type="primary" icon="el-icon-plus" @click="handleAdd">编辑</el-button>
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-col :span="4">
                        <el-input v-model="form.area"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="薪资范围">
                    <el-col :span="4">
                        <el-input v-model="form.money"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="投递邮箱">
                    <el-col :span="4">
                        <el-input v-model="form.email"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工作地址">
                    <el-col :span="4">
                        <el-input v-model="form.address"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="职位描述">
                    <quill-editor ref="myTextEditor" v-model="form.requirements" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
                </el-form-item>
            </el-form>
            <el-upload class="upload-pic" :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" :limit="1">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </div>
        <el-dialog title="岗位类型" :visible.sync="showDialog">
            <el-button type="primary" @click="openAddTypeDialog" style="margin-bottom:10px;">新增</el-button>
            <el-table :data="jobTypeList">
                <el-table-column property="name" label="类别" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加类型" :visible.sync="showAddTypeDialog">
            <el-input v-model="employ.name"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddTypeDialog = false">取 消</el-button>
                <el-button type="primary" @click="addTypeName(type)">确 定</el-button>
            </div>
        </el-dialog>
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
            url: '',
            jobTypeList: [],
            showDialog: false,
            showAddTypeDialog: false,
            employ: {},
            type: ''
        };
    },
    components: {
        quillEditor
    },
    created() {
        this.url = axios.defaults.baseURL;
        this.uploadUrl = axios.defaults.baseURL + '/static/upload';
        this.getJob();
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        openAddTypeDialog() {
            this.showAddTypeDialog = true;
            this.type = 'add';
            this.employ = {
                code: '',
                pcode: '',
                name: '',
                num: '',
                icon: ''
            };
        },
        submit() {
            ajaxUrl.addEmployment(this.form).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('提交成功！');
                    this.form = {};
                    this.$router.push('/recruit/list');
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
        getJob() {
            ajaxUrl.getJobType().then(res => {
                this.jobTypeList = res.data.data;
            });
        },
        handleAdd() {
            this.showDialog = true;
        },
        addTypeName(type) {
            if (this.employ.name) {
                this.employ.code = this.employ.name;
                if (type == 'add') {
                    ajaxUrl.addJobType(this.employ).then(res => {
                        this.showAddTypeDialog = false;
                        this.$message.success('保存成功');
                        this.getJob();
                    });
                } else {
                    ajaxUrl.updateJobType(this.employ).then(res => {
                        if (res.data.code == 200) {
                            this.showAddTypeDialog = false;
                            this.$message.success('保存成功');
                            this.getJob();
                        }
                    });
                }
            } else {
                this.$message.error('请输入类别名称');
            }
        },
        handleEdit(index, row) {
            this.showAddTypeDialog = true;
            this.type = 'edit';
            this.employ = row;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    ajaxUrl.delJobType(row.id).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功');
                            this.getJob();
                        }
                    });
                })
                .catch(() => {});
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
