<template>
    <div id="productCategroys">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>全部入库记录</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 右侧卡片区域 -->
        <el-card class="box-card">

            <el-row :gutter="6">

                <el-col :span="6">
                    <el-input
                            clearable
                            size="small"
                            v-model="queryMap.name"
                            placeholder="请输入物资名称查询"
                            @clear="search"
                            class="input-with-select"
                    ></el-input>
                </el-col>

                <el-col :span="5">
                    <template>
                        <el-select
                                v-model="queryMap.warehousingId"
                                placeholder="选择仓储"
                                size="small"
                                style="width: 100%;"
                        >

                            <el-option
                                    v-for="item in warehousingList"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.id">

                                <span style="float: left">{{ item.username }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nickname }}</span>
                            </el-option>
                        </el-select>
                    </template>
                </el-col>

                <el-col :span="5">
                    <template>
                        <el-select
                                v-model="queryMap.projectId"
                                placeholder="请选择采购计划"
                                style="width:100%"
                                size="small"
                                @change="selectChange"
                        >
                            <el-option
                                    v-for="item in projectData"
                                    :key="item.id"
                                    :label="item.projectName"
                                    :value="item.id">
                                <span style="float: left">{{ item.projectName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.creatorName }}</span>
                            </el-option>
                        </el-select>
                    </template>
                </el-col>

                <el-col :span="8">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置
                    </el-button>
                    <!--<el-button size="small" type="success" icon="el-icon-circle-plus-outline" @click="showAddDialog"-->
                    <!--v-hasPermission="'goods:add'">添加-->
                    <!--</el-button>-->
                    <el-button size="small" icon="el-icon-refresh" @click="getWarehousingSuppliesInRecord">刷新
                    </el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <template>
                <el-table
                        size="mini"
                        v-loading="loading"
                        border
                        stripe
                        :data="listData"
                        style="width: 100%;margin-top:20px;"
                        height="400"

                >
                    <el-table-column prop="id" type="index" label="ID"></el-table-column>


                    <el-table-column label="物资名称">
                        <template slot-scope="scope">
                            <div>{{scope.row.product.name}}-{{scope.row.product.model}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="物资数量" sortable>
                        <template slot-scope="scope">
                            <div>{{scope.row.number}}</div>
                        </template>
                    </el-table-column>

                    <!--<el-table-column prop="businessLicenseImgUrl" label="物资图片" align="center"   padding="0px">-->

                    <!--<template slot-scope="scope">-->
                    <!--<el-popover placement="right" trigger="hover">-->

                    <!--<img :src="scope.row.product.imageUrl"-->
                    <!--style="height: 200px;width: 200px"/>-->

                    <!--<img slot="reference" :src="scope.row.product.imageUrl"-->
                    <!--:alt="scope.row.product.imageUrl" style="height: 80px;width: 80px;cursor: pointer">-->
                    <!--</el-popover>-->
                    <!--</template>-->
                    <!--</el-table-column>-->


                    <el-table-column label="采购计划">
                        <template slot-scope="scope">
                            <div>{{scope.row.projectName}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="供应商">
                        <template slot-scope="scope">
                            <div>{{scope.row.supplier.username}}</div>
                        </template>
                    </el-table-column>


                    <el-table-column label="物资仓库">
                        <template slot-scope="scope">
                            <div>{{scope.row.warehousing.username}}</div>
                        </template>
                    </el-table-column>


                    <el-table-column prop="createTime" label="入库时间" width="180"></el-table-column>


                </el-table>
            </template>
            <!-- 分页 -->
            <el-pagination
                    style="margin-top:10px;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="this.queryMap.pageNum"
                    :page-sizes="[10, 20, 50,100]"
                    :page-size="this.queryMap.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>


            <!-- 图片预览 -->
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt/>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {

                listData: [], // 物资 列表
                projectData: [], // 项目数据

                btnLoading: false,
                btnDisabled: false,
                loading: true,

                total: 0, //总共多少条数据
                addProductData: [], //表格数据
                editProductData: [], //表格数据
                warehousingList: [],
                queryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    projectId: "",
                    warehousingId: ""
                }, //查询对象

                uploadDisabled: false,
                limitCount: 1,
                dialogImageUrl: "",
                dialogVisible: false,

                imgFilesList: [],
                categorykeys: [] //搜索类别
            };
        },
        methods: {

            async getWarehousing() {
                const {data: res} = await this.$http.get("system/user/findUserList?roleId=148");
                if (!res.success) {
                    return this.$message.error("获取物资类别失败");
                } else {
                    this.warehousingList = res.data.rows;
                }
            },

            /**
             * 项目列表
             */
            async getProjectList() {
                const {data: res} = await this.$http.get("project/findProjectList", {
                    params: {
                        pageNum: 1,
                        pageSize: 999,
                        name: "",
                        categoryId: "",
                        supplier: "",
                        status: 0,
                    }
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.projectData = res.data.rows;
                }
            },


            /**
             * 加载物资列表
             */
            async getWarehousingSupplies() {
                const {data: res} = await this.$http.get("warehousingSuppliesInRecord/allList", {
                    params: this.queryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.listData = res.data.rows;
                }
            },


            //重置查询表单
            resetForm() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    projectId: "",
                    warehousingId: ""
                };
            },

            /**
             * 搜索物资
             */
            search() {
                this.queryMap.pageNum = 1;
                this.getWarehousingSupplies();
            },

            /**
             * 删除物资
             */
            async del(value) {
                var res = await this.$confirm(
                    "此操作将永久删除该物资, 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
                if (res === "confirm") {
                    const {data: res} = await this.$http.delete("goods/delete/" + value.id);
                    if (res.success) {
                        this.$message.success("物资删除成功");
                        await this.getWarehousingSupplies();
                    } else {
                        this.$message.error(res.data.errorMsg);
                    }
                }
            },


            handleChange(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
            },
            handleRemove(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
                this.addRuleForm.merchant_image_url = "";
            },
            //改变页码
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.getList();
            },
            //翻页
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getList();
            },


            // 选择区
            selectChange(val) {
                console.log(JSON.stringify(val));


            },


        },
        created() {

            this.getProjectList();

            this.getWarehousing();

            this.getWarehousingSupplies();

            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>


