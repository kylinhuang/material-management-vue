<template>
    <div id="productCategroys">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库记录</el-breadcrumb-item>
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
                    <el-button size="small" icon="el-icon-refresh" @click="getWarehousingSuppliesList">刷新</el-button>
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
                        <template slot-scope="scope"   >
                            <div>{{scope.row.product.name}}-{{scope.row.product.model}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="物资数量">
                        <template slot-scope="scope"   >
                            <div>{{scope.row.number}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="领取人">
                        <template slot-scope="scope"   >
                            <div>{{scope.row.recipients}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="领取人电话">
                        <template slot-scope="scope"   >
                            <div>{{scope.row.recipientsPhoneNumber}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="领取人部门">
                        <template slot-scope="scope"   >
                            <div>{{scope.row.recipientsInfo}}</div>
                        </template>
                    </el-table-column>


                    <el-table-column label="物资去向">
                        <template slot-scope="scope"   >
                            <div>{{scope.row.whereabouts}}</div>
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


                    <el-table-column label="采购计划" >
                        <template slot-scope="scope"   >
                            <div>{{scope.row.projectName}}</div>
                        </template>
                    </el-table-column>

                    <!--<el-table-column label="供应商" >-->
                        <!--<template slot-scope="scope"   >-->
                            <!--<div>{{scope.row.supplier.username}}</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->



                    <el-table-column label="物资仓库" >
                        <template slot-scope="scope"   >
                            <div>{{scope.row.warehousing.username}}</div>
                        </template>
                    </el-table-column>



                    <el-table-column prop="createTime" label="出库时间" width="180"></el-table-column>


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


            <!--&lt;!&ndash;  添加 弹出框 &ndash;&gt;-->
            <!--<el-dialog title="添加物资" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">-->
                <!--<span>-->

	                <!--<el-form-->
                            <!--size="mini"-->
                            <!--:model="addRuleForm"-->
                            <!--:rules="addRules"-->
                            <!--ref="addRuleFormRef"-->
                            <!--label-width="100px"-->
                            <!--class="demo-ruleForm">-->
		                <!--<el-row>-->

			                <!--<el-col :span="12">-->
                            <!--<div class="grid-content bg-purple">-->
                              <!--<el-form-item label="分类" prop="categoryKeys">-->
                                <!--<el-cascader-->
                                        <!--:options="cateories"-->
                                        <!--clearable-->
                                        <!--filterable-->
                                        <!--:props="selectProps"-->
                                        <!--v-model="addRuleForm.categoryKeys"-->
                                        <!--@change="addSelectChange"-->
                                <!--&gt;</el-cascader>-->
                              <!--</el-form-item>-->
                            <!--</div>-->
                        <!--</el-col>-->


			                <!--<el-col :span="12">-->
                            <!--<div class="grid-content bg-purple-light">-->
                                <!--<el-form-item label="请选择商品" prop="model">-->
                                    <!--<el-select v-model="addRuleForm.productId" placeholder="请选择商品">-->
                                        <!--<el-option-->
                                                <!--v-for="item in addProductData"-->
                                                <!--:key="item.id"-->
                                                <!--:label="item.model"-->
                                                <!--:value="item.id">-->

                                            <!--<span style="float: left">{{ item.name }}</span>-->
                                            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.model }}</span>-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->


                                <!--</el-form-item>-->
                            <!--</div>-->
                        <!--</el-col>-->

		                <!--</el-row>-->


		                <!--<el-form-item label="物资图片" prop="name">-->


			                <!--&lt;!&ndash; 图片上传部分 &ndash;&gt;-->
			                <!--<el-upload v-model="addRuleForm.merchant_image_url"-->
                                       <!--:action="uploadApi"-->
                                       <!--:class="{ disabled: uploadDisabled }"-->
                                       <!--list-type="picture-card"-->
                                       <!--:limit="limitCount"-->
                                       <!--:on-change="handleChange"-->
                                       <!--:on-remove="handleRemove"-->
                                       <!--accept="image/*"-->
                                       <!--:on-success="handleSuccess"-->
                                       <!--:headers="headerObject"-->
                                       <!--ref="upload"-->
                                       <!--:on-preview="handlePictureCardPreview"-->
                            <!--&gt;-->
                        <!--<i class="el-icon-plus"></i>-->
                      <!--</el-upload>-->

		                <!--</el-form-item>-->

		                <!--<el-row>-->

			                <!--<el-col :span="12">-->
                        <!--<div class="grid-content bg-purple">-->
                          <!--<el-form-item label="价格(单位 元)" prop="unit">-->
                            <!--<el-input v-model="addRuleForm.price"></el-input>-->
                          <!--</el-form-item>-->
                        <!--</div>-->
                      <!--</el-col>-->

			                <!--<el-col :span="12">-->
                        <!--<div class="grid-content bg-purple-light">-->
                          <!--<el-form-item label="排序" prop="sort">-->
                            <!--<el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>-->
                          <!--</el-form-item>-->
                        <!--</div>-->
                      <!--</el-col>-->

		                <!--</el-row>-->


		                <!--<el-form-item label="备注信息" prop="remark">-->

			                <!--<el-input type="textarea" v-model="addRuleForm.remark"></el-input>-->

		                <!--</el-form-item>-->

	                <!--</el-form>-->

                <!--</span>-->
                <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="receiveDialogVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="add" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>-->
                <!--</span>-->
            <!--</el-dialog>-->


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
                userInfo:{},
                cateories: [], //类别选择
                listData: [], // 物资 列表
                projectData: [], // 项目数据
                uploadApi: this.BASE_API_URL + 'system/upload/image',
                btnLoading: false,
                btnDisabled: false,
                loading: true,
                addDialogVisible : false,
                headerObject: {
                    Authorization: LocalStorage.get(LOCAL_KEY_XINGUAN_ACCESS_TOKEN)
                }, //图片上传请求头
                selectProps: {
                    expandTrigger: "hover",
                    value: "id",
                    label: "name",
                    children: "children",
                    checkStrictly: false
                }, //级联选择器配置项
                searchSelectProps: {
                    expandTrigger: "hover",
                    value: "id",
                    label: "name",
                    children: "children",
                    checkStrictly: true
                }, //级联搜索选择器配置项


                editDialogVisible: false,
                receiveDialogVisible: false, //添加弹框是否显示
                total: 0, //总共多少条数据
                addProductData: [], //表格数据
                editProductData: [], //表格数据

                queryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    projectId: "",
                    warehousingId: ""
                }, //查询对象
                addQueryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: -1,
                }, //查询对象
                addRuleForm: {}, //添加表单数据
                editRuleForm: {}, //修改表单数据
                uploadDisabled: false,
                limitCount: 1,
                dialogImageUrl: "",
                dialogVisible: false,
                addRules: {
                    price: [
                        {required: true, message: "请输入物资价格", trigger: "blur"},
                        {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
                    ],
                    remark: [
                        {required: true, message: "请输入物资说明备注", trigger: "blur"},
                        {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    ],
                    categorys: [
                        {required: true, message: "请输入物资分类", trigger: "blur"}
                    ],
                    sort: [{required: true, message: "请输入优先级", trigger: "blur"}],
                    categoryKeys: [
                        {required: true, message: "请选择物资分类", trigger: "blur"}
                    ]
                }, //添加验证

                editRules: {
                    price: [
                        {required: true, message: "请输入物资价格", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],
                    remark: [
                        {required: true, message: "请输入物资说明备注", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],
                    categorys: [
                        {required: true, message: "请输入物资分类", trigger: "blur"}
                    ],
                    sort: [{required: true, message: "请输入优先级", trigger: "blur"}],
                    categoryKeys: [
                        {required: true, message: "请选择物资分类", trigger: "blur"}
                    ]
                },
                imgFilesList: [],
                categorykeys: [] //搜索类别
            };
        },
        methods: {

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
                const {data: res} = await this.$http.get("warehousingSuppliesOutRecord/list", {
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
             * 打开添加物资弹框
             */
            showAddDialog() {
                this.getCatetorys();
                this.addDialogVisible = true;
            },
            /**
             * 搜索物资
             */
            search() {
                this.queryMap.pageNum = 1;
                this.getWarehousingSupplies();
            },

            /**
             * 添加审核
             */
            async submit(value,status) {
                value.status = status;
                const {data: res} = await this.$http.put( "merchantInfo/updateStatus/" + value.id,
                    value
                );

                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "提交成功",
                        type: "success"
                    });
                    this.editRuleForm = {};
                    await this.getWarehousingSupplies();
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }

            },

            /**
             * 物资添加审核
             */
            async publish(id) {
                const {data: res} = await this.$http.put("business/product/publish/" + id);
                if (!res.success) {
                    return this.$message.error("审核失败:" + res.data.errorMsg);
                } else {
                    await this.getWarehousingSupplies();
                    return this.$message.success("物资已审核通过");
                }
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
            /**
             * 更新物资
             */
            async editGoods() {
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        const {data: res} = await this.$http.put("goods/update/" + this.editRuleForm.id,
                            this.editRuleForm
                        );
                        if (res.success) {
                            this.$notify({
                                title: "成功",
                                message: "物资信息更新",
                                type: "success"
                            });
                            this.editRuleForm = {};
                            await this.getWarehousingSupplies();
                        } else {
                            this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                        }
                        this.editDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },
            /**
             * 编辑物资
             */
            async showEditDialog(item) {

                this.editDialogVisible = true;

                this.editRuleForm = item;

                // alert(JSON.stringify(this.editRuleForm))

                this.imgFilesList = [];
                this.imgFilesList.push({
                    url: item.merchant_image_url,
                    name: item.name,
                    id: item.id
                });

                const array = [];
                if (null != item.oneCategoryId) array.push(item.oneCategoryId);
                if (null != item.twoCategoryId) array.push(item.twoCategoryId);
                if (null != item.threeCategoryId) array.push(item.threeCategoryId);
                this.editRuleForm.categoryKeys = array;

                this.editSelectChange(this.editRuleForm.categoryKeys);

            },
            /**
             * 添加物资
             */
            add() {
                console.log("add merchant_image_url " + this.addRuleForm.merchant_image_url);

                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        const {data: res} = await this.$http.post("goods/add",
                            this.addRuleForm
                        );
                        if (res.success) {
                            this.$message.success("物资添加成功");
                            this.addRuleForm = {};
                            await this.getWarehousingSupplies();
                        } else {
                            return this.$message.error("物资添加失败:" + res.data.errorMsg);
                        }
                        this.addDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
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
            //关闭弹出框
            closeAddDialog() {
                this.$refs.addRuleFormRef.clearValidate();
                this.addRuleForm = {};
                this.$refs.upload.clearFiles();
            },
            //关闭弹出框
            closeEditDialog() {
                this.$refs.editRuleFormRef.clearValidate();
                this.editRuleForm = {};
                this.$refs.upload2.clearFiles();
                this.imgFilesList = [];
            },
            handleSuccess(response, file, fileList) {
                this.addRuleForm.merchant_image_url = response.data;
                console.log("handleSuccess merchant_image_url " + this.addRuleForm.merchant_image_url);
                console.log("handleSuccess file " + file.url);
                console.log("handleSuccess fileList " + fileList.length);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.addRuleForm.merchant_image_url = file.url;
                console.log("handlePictureCardPreview merchant_image_url " + this.addRuleForm.merchant_image_url);

                this.dialogVisible = true;
            },
            //编辑
            editHandleSuccess(response, file, fileList) {
                this.editRuleForm.merchant_image_url = response.msg;
            },
            editHandlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.editRuleForm.merchant_image_url = file.url;
                console.log("handlePictureCardPreview merchant_image_url " + this.editRuleForm.merchant_image_url);
                this.dialogVisible = true;
            },

            editHandleSuccess(response, file, fileList) {
                this.editRuleForm.merchant_image_url = response.data;
                console.log("handleSuccess merchant_image_url " + this.editRuleForm.merchant_image_url);
                console.log("handleSuccess file " + file.url);
                console.log("handleSuccess fileList " + fileList.length);
            },

            editHandleRemove(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
                this.editRuleForm.merchant_image_url = "";
            },
            // 选择区
            selectChange(val) {
                console.log(JSON.stringify(val));


                // for (var i = 0; i < this.projectData.length; i++) {
                //     if (this.selectProductId == this.projectData[i].id) {
                //         this.selectProject = this.projectData[i];
                //     }
                // }
            },
            /**
             * 分类搜索改变时
             */
            addSelectChange(value) {
                console.log(" addSelectChange " + value)

                var str = "";
                for (var i = 0; i < value.length; i++) {
                    str += value[i] + ",";
                }
                str = str.substring(0, str.length - 1);
                this.addQueryMap.categorys = str;

                this.getAddProductList();
            },
            /**
             * 加载物资列表
             */
            async getAddProductList() {
                const {data: res} = await this.$http.get("business/product/findProductList", {
                    params: this.addQueryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    // this.total = res.data.total;
                    this.addProductData = res.data.rows;
                }
            },

            /**
             * 分类搜索改变时
             */
            editSelectChange(value) {
                console.log(" addSelectChange " + value)

                var str = "";
                for (var i = 0; i < value.length; i++) {
                    str += value[i] + ",";
                }
                str = str.substring(0, str.length - 1);
                this.addQueryMap.categorys = str;

                this.getEditProductList();
            },

            /**
             * 加载物资列表
             */
            async getEditProductList() {
                const {data: res} = await this.$http.get("business/product/findProductList", {
                    params: this.addQueryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.editProductData = res.data.rows;
                }
            },
        },
        created() {

            this.userInfo = this.$store.state.userInfo;
            console.log(JSON.stringify(this.userInfo));

            this.roleId = this.userInfo.roleId ;

            this.getProjectList();
            this.getWarehousingSupplies();


            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>


