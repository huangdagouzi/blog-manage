<template>
    <div class="news-list">
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.active" clearable placeholder="发布状态" class="handle-select mr10">
                    <el-option key="1" label="已发布" value="true"></el-option>
                    <el-option key="2" label="待发布" value="false"></el-option>
                </el-select>
                <el-input v-model="query.keyWord" placeholder="岗位名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="tabId" label="岗位类别" width="105" align="center">
                    <template slot-scope="scope">
                        {{scope.row.tabId | changeTabId}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="pubDate" label="发布日期" width="155">
                    <template slot-scope="scope">{{ scope.row.publishTime }}</template>
                </el-table-column>
                <el-table-column prop="name" label="岗位名称"></el-table-column>
                <el-table-column prop="area" label="地区" width="105" align="center"></el-table-column>
                <el-table-column prop="money" label="薪资" width="105" align="center"></el-table-column>
                <el-table-column label="状态" width="105" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.active === true ? 'success' : scope.row.active === false ? 'warning' : ''">{{
                            scope.row.active | changeState
                        }}</el-tag>
                    </template>
                </el-table-column>
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
                keyWord: '',
                active: ''
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
            if (to.fullPath == '/recruit/list') {
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
            ajaxUrl
                .getEmploymentList(
                    `pageNum=${this.page.pageNum}&pageSize=${this.page.pageSize}&keyWord=${this.query.keyWord}&active=${this.query.active}`
                )
                .then(res => {
                    this.tableData = res.data.data.list.map(v => {
                        v.publishTime = v.publishTime ? common.fullTime(v.publishTime) : '';
                        return v;
                    });
                    this.page.total = res.data.data.total;
                });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleAdd() {
            this.$router.push({
                path: '/recruit/add'
            });
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    ajaxUrl.delEmployment(row.id).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功');
                            this.getData();
                        }
                    });
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$router.push({
                path: '/recruit/edit'
            });
            this.$store.commit('changeRecruitId', row.id);
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
                    ajaxUrl.revokeEmployment(params).then(res => {
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
                    ajaxUrl.publishEmployment(params).then(res => {
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
        changeState(val) {
            switch (val) {
                case false:
                    return '待发布';
                    break;
                case true:
                    return '已发布';
                    break;
                default:
                    break;
            }
        },
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
