<template>
    <div id="productCategroys">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购计划</el-breadcrumb-item>
            <el-breadcrumb-item>我的任务</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 右侧卡片区域 -->
        <el-card class="box-card">

            <el-row :gutter="7">
                <!--<el-col :span="7">-->
                <!--<el-input-->
                <!--clearable-->
                <!--size="small"-->
                <!--v-model="queryMap.name"-->
                <!--placeholder="请输入项目名称查询"-->
                <!--@clear="search"-->
                <!--class="input-with-select"-->
                <!--&gt;</el-input>-->
                <!--</el-col>-->
                <el-col :span="6">
                    <template>
                        <el-select
                                style="width:100%"
                                size="small"
                                v-model="queryMap.status"
                                @click="search"
                                placeholder="请选择状态"
                        >
                            <!--<el-option label="全部" :value="-1"></el-option>-->
                            <!--<el-option label="删除" :value="0"></el-option>-->
                            <!--<el-option label="创建" :value="1"></el-option>-->
                            <!--<el-option label="待发货" :value="2"></el-option>-->
                            <!--<el-option label="已发货" :value="3"></el-option>-->
                            <el-option label="待结算" :value="4"></el-option>
                            <!--<el-option label="驳回" :value="5"></el-option>-->
                            <el-option label="已结算" :value="6"></el-option>


                        </el-select>
                    </template>
                </el-col>




                <el-col :span="6">
                    <template>

                        <el-select
                                v-model="queryMap.supplierId"
                                placeholder="选择供应商"
                                size="small"
                                style="width: 100%;"
                        >

                            <el-option
                                    v-for="item in supplierList"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.id">

                                <span style="float: left">{{ item.username }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nickname }}</span>
                            </el-option>
                        </el-select>

                    </template>
                </el-col>

                <el-col :span="12">
                    <el-select
                            size="small"
                            v-model="this.queryMap.projectId"
                            placeholder="请选择采购计划"
                            style="width:100%"
                            @change="selectProjectChange"
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
                </el-col>

                <el-col :span="8">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置</el-button>
                    <el-button size="small" icon="el-icon-refresh" @click="getTaskList">刷新</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <template>


                <el-table :data="tableData" border stripe style="width: 100%;">

                    <el-table-column prop="index" type="index" label="编号" width="50px"></el-table-column>

                    <el-table-column prop="payee_name" label="物资型号" width="150px">
                        <template slot-scope="scope">
                            <div   v-if="null!=scope.row.product">
                                <div>{{scope.row.product.name}}-{{scope.row.product.model}}</div>
                            </div>
                        </template>

                    </el-table-column>


                    <el-table-column prop="productNumber" label="采购数量" width="100px">
                        <template slot-scope="scope">
                            <span>{{scope.row.productNumber}}</span>
                        </template>
                    </el-table-column>



                    <el-table-column prop="payee_name" label="供应商">

                        <template slot-scope="scope"  >
                            <div  >
                                <div>{{scope.row.supplier.username}} </div>

                            </div>

                        </template>
                    </el-table-column>


                    <el-table-column prop="payee_name" label="仓储中心">
                        <template slot-scope="scope">
                            <div  v-if="null!=scope.row.warehousing">
                                <div>{{scope.row.warehousing.username}}</div>
                            </div>

                        </template>
                    </el-table-column>


                    <el-table-column prop="sort" label="优先级别" width="50px">
                        <template slot-scope="scope">
                            <!--v-if="scope.row.edit"-->
                            <!--<el-input v-model="scope.row.sort" placeholder="优先级别"></el-input>-->
                            <span>{{scope.row.sort}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column prop="projectName" label="采购计划" >
                        <template slot-scope="scope">
                            <span>{{scope.row.projectName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="sort" label="入库数量" width="100px">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.status==3" size="mini" v-model="scope.row.warehousingNumber" placeholder="入库数量"></el-input>
                            <span v-else>{{scope.row.warehousingNumber}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column  prop="sort" label="审核价格" width="80px">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.status==4" size="mini" v-model="scope.row.reviewPrice" placeholder="审核价格"></el-input>
                            <span v-else >{{scope.row.reviewPrice}}</span>
                        </template>
                    </el-table-column>

					<el-table-column  prop="sort" label="总价" width="80px"  >
						<template slot-scope="scope">
							<span >{{scope.row.totalPrice}}</span>
						</template>
					</el-table-column>


                    <el-table-column prop="status" label="状态" width="100px">
                        <template slot-scope="scope">
                            <el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==1">创建</el-tag>
                            <el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==2">待发货</el-tag>
                            <el-tag size="mini" type="info" effect="plain" v-if="scope.row.status==3">已发货</el-tag>
                            <el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==4">入库</el-tag>
                            <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==5">驳回</el-tag>
                            <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==6">已结算</el-tag>

                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">

                            <div >

                                <!--<el-popconfirm title="是否验收合格？" >-->
                                <el-button type="text" size="mini" icon="el-icon-finished" v-if="scope.row.status==4"
                                           @click="save(scope.row)">保存
                                </el-button>
                                <!--</el-popconfirm>-->

                                <!--<el-popconfirm title="质量不合格退回吗？" >-->
                                <el-button type="text" size="mini" icon="el-icon-finished" v-if="scope.row.status==4"
                                           @click="settlement(scope.row,6)">提交结算
                                </el-button>
                                <!--</el-popconfirm>-->

                            </div>

                        </template>
                    </el-table-column>
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
    import store from '../../store'//引入store

    export default {
        data() {
            return {
                userInfo: {},
                roleId: 0,

                uploadApi: this.BASE_API_URL + 'system/upload/image',
                btnLoading: false,
                btnDisabled: false,
                loading: true,
                headerObject: {
                    Authorization: LocalStorage.get(LOCAL_KEY_XINGUAN_ACCESS_TOKEN)
                }, //图片上传请求头
                allocators: [], //资源管理
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

                activeNames: ['1'], // 展开框

                editDialogVisible: false,
                editWarehousingDialogVisible: false,
                receiveDialogVisible: false, //添加弹框是否显示
                total: 0, //总共多少条数据

                tableData: [],
                productData: [], //表格数据

                queryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    supplierId: "",
                    projectId: "",
                    status: 4,
                }, //查询对象

                addRuleForm: {}, //添加表单数据
                editRuleForm: {}, //修改表单数据


                warehousingRuleForm: {}, //入库表单数据

                uploadDisabled: false,
                limitCount: 1,
                dialogImageUrl: "",
                dialogVisible: false,
                addRules: {
                    projectName: [
                        {required: true, message: "请输入项目名称", trigger: "blur"},
                        {min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur"}
                    ],
                    allocatorId: [
                        {required: true, message: "分配者id (资源管理部)", trigger: "blur"},
                        {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
                    ],
                    // model: [
                    //     {required: true, message: "请输入物资规格", trigger: "blur"},
                    //     {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    // ],
                    remark: [
                        {required: true, message: "请输入物资说明备注", trigger: "blur"},
                        {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    ],
                    // categorys: [
                    //     {required: true, message: "请输入物资分类", trigger: "blur"}
                    // ],
                    sort: [{required: true, message: "请输入地址信息", trigger: "blur"}],
                    // categoryKeys: [
                    //     {required: true, message: "请选择物资分类", trigger: "blur"}
                    // ]
                }, //添加验证
                imgFilesList: [],
                categorykeys: [], //搜索类别
                role:[],
                projectData: [], // 项目数据

                selectProject:{},
                supplierList: [],        // 供应商列表
                selectedSupplierId: '',

            };
        },
        methods: {


            //入库
            async save(row) {
                console.log(JSON.stringify(row));
                const {data: res} = await this.$http.put("task/update/" + row.id,
                    row
                );
                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "项目信息更新",
                        type: "success"
                    });
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }
                await this.getTaskList();

            },

            //重置查询表单
            resetForm() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 10,
                    supplierId: "",
                    projectId: "",
                    status: 4,
                };
            },

            /**
             * 搜索物资
             */
            search() {
                this.queryMap.pageNum = 1;
                this.getTaskList();
            },

            /**
             * 结算
             */
            async settlement(row,status) {
                row.status = status;
                const {data: res} = await this.$http.put("task/update/" + row.id,
                    row
                );
                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "项目信息更新",
                        type: "success"
                    });
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }
                await this.getTaskList();

            },


            handleChange(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
            },
            handleRemove(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
                this.addRuleForm.imageUrl = "";
            },
            //改变页码
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.getTaskList();
            },
            //翻页
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getTaskList();
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

            //关闭弹出框
            closeWarehousingDialog() {
                this.$refs.editRuleFormRef.clearValidate();
                this.editRuleForm = {};
                this.$refs.upload2.clearFiles();
                this.imgFilesList = [];
            },



            handleSuccess(response, file, fileList) {
                this.addRuleForm.imageUrl = response.data;
                console.log("handleSuccess imageUrl " + this.addRuleForm.imageUrl);
                console.log("handleSuccess file " + file.url);
                console.log("handleSuccess fileList " + fileList.length);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.addRuleForm.deliveryImageUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.addRuleForm.deliveryImageUrl);

                this.dialogVisible = true;
            },
            //编辑
            editHandleSuccess(response, file, fileList) {
                this.editRuleForm.deliveryImageUrl = response.data;
            },

            //编辑 入库
            editWarehousingHandleSuccess(response, file, fileList) {
                this.warehousingRuleForm.invoiceImageUrl = response.data;
            },
            warehousingHandlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.warehousingRuleForm.invoiceImageUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.warehousingRuleForm.invoiceImageUrl);

                this.dialogVisible = true;
            },


            // 选择区
            selectProjectChange(val) {
                console.log(JSON.stringify(val));

                this.queryMap.projectId = val;

                for (var i = 0; i < this.projectData.length; i++) {
                    if (this.queryMap.projectId == this.projectData[i].id) {
                        this.selectProject = this.projectData[i];
                    }
                }
            },
            /**
             * 分类搜索改变时
             */
            selectChange() {
                var str = "";
                for (var i = 0; i < this.categorykeys.length; i++) {
                    str += this.categorykeys[i] + ",";
                }
                str = str.substring(0, str.length - 1);
                this.queryMap.categorys = str;
            },

            async getTaskList() {
                const {data: res} = await this.$http.get("task/taskList", {
                    params: this.queryMap
                });

                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.tableData = res.data.rows;

                    // deliveryNumber
                    for (var i = 0; i < this.tableData.length; i++) {

                        if (null == this.tableData[i].warehousingNumber){
                            this.tableData[i].warehousingNumber = this.tableData[i].deliveryNumber;
                        }

                    }
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
                    // this.total = res.data.total;
                    this.projectData = res.data.rows;
                }
            },

            /**
             * 获取供应商
             */
            async getSupplier() {
                const {data: res} = await this.$http.get("system/user/findUserList?roleId=149");
                if (!res.success) {
                    return this.$message.error("获取物资类别失败");
                } else {
                    this.supplierList = res.data.rows;
                }
            },

        },
        created() {
            this.getSupplier();

            this.getProjectList();

            this.getTaskList();

            setTimeout(() => {
                this.loading = false;
            }, 500);
        }

    };
</script>


