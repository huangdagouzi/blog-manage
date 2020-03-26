<template>
    <div class="news-list">
        <div class="container" v-loading="">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button> -->
                <!-- <el-select v-model="query.active" clearable  placeholder="发布状态" class="handle-select mr10">
                    <el-option key="1" label="已发布" value="true"></el-option>
                    <el-option key="2" label="待发布" value="false"></el-option>
                </el-select> -->
                <el-input v-model="query.keyWord" placeholder="标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <!-- <el-table-column prop="_id" label="ID" width="55" align="center"></el-table-column> -->
                <el-table-column prop="publishTime" label="发布日期" width="155"> </el-table-column>
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="type" label="类型">
                    <template slot-scope="scope">
                        {{ scope.row.type | changeType}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="views" label="阅读量" width="105" align="center"></el-table-column> -->
                <!-- <el-table-column label="状态" width="105" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.active === true ? 'success' : scope.row.active === false ? 'warning' : ''">{{
                            scope.row.active | changeState
                        }}</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            v-if="scope.row.active == false"
                            type="text"
                            icon="el-icon-s-promotion"
                            class="green"
                            @click="handlePublish(scope.$index, scope.row)"
                            >发布</el-button
                        >
                        <el-button
                            v-if="scope.row.active == true"
                            type="text"
                            icon="el-icon-refresh"
                            class="yellow"
                            @click="handleRevoke(scope.$index, scope.row)"
                            >撤回</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page.sync="page.pageNum"
                    :page-size="page.pageSize"
                    :total="page.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import * as ajaxUrl from '../../request/api';
import common from '../../utils/common';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                keyWord: ''
            },
            page: {
                total: 0,
                pageNum: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: []
        };
    },

    created() {
        this.getData();
    },
    watch: {
        $route(to, from) {
            if (to.fullPath == '/news/list') {
                this.getData();
            }
        },
        'page.pageNum'() {
            this.getData();
        },
        'query.active'() {
            this.getData();
        }
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            ajaxUrl.getBlogsList(`pageSize=${this.page.pageSize}&currentPage=${this.page.pageNum}&key=${this.query.keyWord}`).then(res => {
                // console.log(res);
                this.tableData = res.data.data.map(v => {
                    v.publishTime = v.publishTime ? common.fullTime(v.publishTime) : '';
                    return v;
                });
                this.page.total = res.data.total;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.page, 'pageNum', 1);
            this.getData();
        },
        handleAdd() {
            this.$router.push({
                path: '/news/add'
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    ajaxUrl.delBlog(`id=${row._id}`).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功');
                            this.getData();
                        }
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$router.push({
                path: '/news/edit'
            });
            this.$store.commit('changeNewsId', row._id);
        },
        // 分页导航
        handlePageChange(val) {
            this.page.pageNum = val;
        },
        //撤回
        handleRevoke(index, row) {
            this.$confirm('确定要撤回吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = { id: row.id };
                    ajaxUrl.revokeNews(params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('撤回成功');
                            this.getData();
                        }
                    });
                })
                .catch(() => {});
        },
        //发布
        handlePublish(index, row) {
            this.$confirm('确定要发布吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = { id: row.id };
                    ajaxUrl.publishNews(params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('发布成功');
                            this.getData();
                        }
                    });
                })
                .catch(() => {});
        }
    },
    filters: {
        changeType(val) {
            switch (val) {
                case '1':
                    return '生活';
                    break;
                case '2':
                    return '技术';
                    break;
                default:
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.news-list {
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .green {
        color: #67c23a;
    }
    .yellow {
        color: #e6a23c;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
}
</style>
