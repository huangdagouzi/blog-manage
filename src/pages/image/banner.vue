<template>
    <div class="image-list">
        <el-upload
            class="upload-demo"
            ref="upload"
            action="http://47.97.119.229/api/file/uploadBanner"
            :on-preview="handlePreview"
            :before-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :headers="myHeaders"
            list-type="picture"
        >
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import * as ajaxUrl from '../../request/api';
import axios from 'axios';
export default {
    data() {
        return {
            fileList: [],
            myHeaders: {
                Authorization: 'Bearer ' + localStorage.getItem('blog_token')
            }
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.asyncReq(file, fileList); // 在这里真正的处理图片列表
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            return false; // 这是重点,不管上面的操作结果如何都返回false
        },
        asyncReq(file, fileList) {
            // 处理图片列表
            // 远请求服务器如果成功则把fileList中要删除的file移除即可
            ajaxUrl.delBanner(`id=${file._id}`).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('删除成功');
                    this.getData();
                }
            });
        },
        handlePreview(file) {
            // console.log(file);
        },
        getData() {
            ajaxUrl.getBanner().then(res => {
                this.fileList = res.data.data.map(v => {
                    v.name = v.originName;
                    v.url = axios.defaults.baseURL + '/public/uploads/' + v.address;
                    return v;
                });
            });
        }
    },
    components: {}
};
</script>

<style lang="less">
.image-list {
}
</style>
