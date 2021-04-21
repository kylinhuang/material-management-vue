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
				<el-col :span="5">
					<template>
						<el-select size="small" v-model="queryMap.status" @click="search" placeholder="请选择状态">
							<el-option label="全部" :value="-1"></el-option>
							<!--<el-option label="删除" :value="0"></el-option>-->
							<!--<el-option label="创建" :value="1"></el-option>-->
							<el-option label="待发货" :value="2"></el-option>
							<el-option label="已发货" :value="3"></el-option>
							<el-option label="入库" :value="4"></el-option>
							<el-option label="驳回" :value="5"></el-option>

						</el-select>
					</template>
				</el-col>

				<el-col :span="8">
					<el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
					<!--<el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置</el-button>-->
					<el-button size="small" icon="el-icon-refresh" @click="getTaskList">刷新</el-button>
				</el-col>
			</el-row>

			<!-- 表格区域 -->
			<template>


				<el-table :data="tableData" border stripe style="width: 100%;">

					<el-table-column prop="index" type="index" label="编号" width="50px"></el-table-column>

					<el-table-column prop="payee_name" label="物资型号" width="150px">
						<template slot-scope="scope">
							<div  v-if="null!=scope.row.product">
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
							<div    >
								<div>{{scope.row.supplier.username}} </div>
								<!--<div>公司/职位:  {{scope.row.supplier.nickname}} </div>-->
								<!--<div>供应商电话:  {{scope.row.supplier.phoneNumber}} </div>-->

								<!--<div>区域:  {{scope.row.supplier.province}}/{{scope.row.supplier.city}}/{{scope.row.supplier.origin}}</div>-->
								<!--<div>地址:  {{scope.row.supplier.address}}</div>-->

							</div>

						</template>
					</el-table-column>


					<el-table-column prop="payee_name" label="仓储中心">
						<template slot-scope="scope">
							<div v-if="null!=scope.row.warehousing">
								<div>{{scope.row.warehousing.username}}</div>

								<!--<div>公司/职位：{{scope.row.warehousing.nickname}}</div>-->
								<!--<div>联系方式：{{scope.row.warehousing.phoneNumber}}</div>-->

								<!--<div>区域 {{scope.row.warehousing.province}}/{{scope.row.warehousing.city}}/{{scope.row.warehousing.origin}}</div>-->
								<!--<div>地址 {{scope.row.warehousing.address}}</div>-->

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


					<el-table-column prop="sort" label="发货数量" width="100px"  >
						<template slot-scope="scope">
							<el-input v-if="scope.row.status==2" size="mini" v-model="scope.row.deliveryNumber" placeholder="发货数量"></el-input>
							<span v-else>{{scope.row.deliveryNumber}}</span>
						</template>
					</el-table-column>


					<el-table-column prop="sort" label="发货价格"  width="100px" >
						<template slot-scope="scope">
							<el-input v-if="scope.row.status==2" size="mini" v-model="scope.row.deliveryPrice" placeholder="发货价格"></el-input>
							<span v-else>{{scope.row.deliveryPrice}}</span>

						</template>
					</el-table-column>



					<el-table-column prop="status" label="状态" width="100px">
						<template slot-scope="scope">
							<el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==1">创建</el-tag>
							<el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==2">待发货</el-tag>
							<el-tag size="mini" type="info" effect="plain" v-if="scope.row.status==3">已发货</el-tag>
							<el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==4">入库</el-tag>
							<el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==5">驳回</el-tag>
						</template>
					</el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">

							<div >
								<el-tooltip class="item" effect="dark" content="提交发货" placement="top-start" v-if="scope.row.status == 2" >
									<el-button
											type="text"
											size="mini"
											icon="el-icon-finished"
											@click="showEditDialog(scope.row)">提交发货

									</el-button>
								</el-tooltip>
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




			<!-- 发货编辑弹出框 -->
			<el-dialog
					title="提交发货"
					:visible.sync="editDialogVisible"
					width="50%"
					@close="closeEditDialog"
			>

				<span>
					<el-form
							size="mini"
							:model="editRuleForm"
							:rules="editRules"
							ref="editRuleFormRef"
							label-width="100px"
							class="demo-ruleForm"
					>


						<el-row v-if="null !=editRuleForm.product">
							<el-col :span="12">
								<div class="grid-content bg-purple">

									<el-form-item label="物资名称" prop="unit">
										<el-input v-model="editRuleForm.product.name" :disabled="true"></el-input>
									</el-form-item>
								</div>
							</el-col>

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="物资型号" prop="model">
										<el-input v-model="editRuleForm.product.model" :disabled="true"></el-input>
									</el-form-item>
								</div>
							</el-col>

						</el-row>


						<el-row v-if="null !=editRuleForm.product">

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="单位" prop="unit">
										<el-input v-model="editRuleForm.product.unit" :disabled="true"></el-input>
									</el-form-item>
								</div>
							</el-col>

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="厂商品牌" prop="remark">
										<el-input v-model="editRuleForm.product.remark" :disabled="true"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>

						<el-row v-if="null !=editRuleForm.product">

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="数量" prop="productNumber">
										<el-input v-model="editRuleForm.productNumber" :disabled="true"></el-input>
									</el-form-item>
								</div>
							</el-col>


						</el-row>

						<el-row >

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="发货数量" prop="deliveryNumber">
										<el-input v-model="editRuleForm.deliveryNumber" ></el-input>
									</el-form-item>
								</div>
							</el-col>

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="发货价格" prop="deliveryPrice">
										<el-input v-model="editRuleForm.deliveryPrice" ></el-input>
									</el-form-item>
								</div>
							</el-col>


						</el-row>


						<el-collapse v-model="activeNames"  >

							<el-collapse-item title="商品信息" name="1" v-if="null !=editRuleForm.goods" >
								<div>商品名称：{{editRuleForm.goods.name}}</div>
								<div>商品型号：{{editRuleForm.goods.model}}</div>
								<div>商品价格：{{editRuleForm.goods.price}}元</div>

								<div>供应商名称：{{editRuleForm.goods.merchantUserName}}</div>
								<div>供应商信息：{{editRuleForm.goods.merchantNickName}}</div>
								<div>供应商电话：{{editRuleForm.goods.merchantPhoneNumber}}</div>


								<div>区域： {{editRuleForm.goods.merchantProvince}}/{{editRuleForm.goods.merchantCity}}/{{editRuleForm.goods.merchantOrigin}}</div>
								<div>地址： {{editRuleForm.goods.merchantAddress}}</div>
							</el-collapse-item>

							<el-collapse-item title="仓储" name="2" v-if="null !=editRuleForm.warehousing">
								<div>仓储名称：{{editRuleForm.warehousing.username}}</div>
								<div>仓储信息：{{editRuleForm.warehousing.nickname}}</div>
								<div>仓储电话：{{editRuleForm.warehousing.phoneNumber}}</div>

								<div>区域： {{editRuleForm.warehousing.province}}/{{editRuleForm.warehousing.city}}/{{editRuleForm.warehousing.origin}}</div>
								<div>地址： {{editRuleForm.warehousing.address}}</div>
							</el-collapse-item>


						</el-collapse>

						<el-form-item label="发货图片" prop="deliveryImageUrl" >

							<!-- 图片上传部分 -->
							<el-upload
									:action="uploadApi"
									:class="{ disabled: uploadDisabled }"
									list-type="picture-card"
									:limit="limitCount"
									accept="image/*"
									:on-success="editHandleSuccess"
									:headers="headerObject"
									ref="upload2"
									:on-preview="handlePictureCardPreview"
									:file-list="imgFilesList">

								<i class="el-icon-plus"></i>

							</el-upload>

						</el-form-item>

					</el-form>

				</span>
				<span slot="footer" class="dialog-footer">

					<el-button @click="editDialogVisible = false">取 消</el-button>

					<el-button
							type="primary"
							@click="confirmDelivery()"
							:disabled="btnDisabled"
							:loading="btnLoading"
					>确 定</el-button>

				</span>
			</el-dialog>





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
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: 2,

                }, //查询对象
                addRuleForm: {}, //添加表单数据
                editRuleForm: {}, //修改表单数据


                warehousingRuleForm: {}, //入库表单数据


                uploadDisabled: false,
                limitCount: 1,
                dialogImageUrl: "",
                dialogVisible: false,
                editRules: {

                    deliveryNumber: [
                        {required: true, message: "请输入发货数量", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}

                    ],

                    deliveryPrice: [
                        {required: true, message: "请输入发货价格", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}

                    ],

                    deliveryImageUrl: [
                        {required: true, message: "请上传图片", trigger: "blur"},
                        {min: 1, max: 500, message: "长度在 1 到 500 个字符", trigger: "blur"}
                    ],

                }, //添加验证
                imgFilesList: [],
                categorykeys: [], //搜索类别
                role:[],
            };
        },
        methods: {



            //修改
            showEditDialog(row) {
                this.editRuleForm = row;

                this.editDialogVisible = true;

                console.log(JSON.stringify(this.editRuleForm));

                this.imgFilesList = [];
                this.imgFilesList.push({
                    url:  this.editRuleForm.deliveryImageUrl,
                    name: "",
                    id: this.editRuleForm.id
                });

            },

            //提交 入库
            async confirmWarehousing() {

                this.btnDisabled = true;
                this.btnLoading = true;

                this.warehousingRuleForm.status = 4;
                console.log(JSON.stringify(this.warehousingRuleForm));

                const {data: res} = await this.$http.put("task/editStatus/" + this.warehousingRuleForm.id,
                    this.warehousingRuleForm
                );
                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "项目信息更新",
                        type: "success"
                    });
                    await this.getTaskList();
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }
                this.editWarehousingDialogVisible = false;
                this.btnDisabled = false;
                this.btnLoading = false;
            },

            //提交 发货
			confirmDelivery() {


                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;

                        this.editRuleForm.status = 3;
                        console.log(JSON.stringify(this.editRuleForm));

                        const {data: res} = await this.$http.put("task/editStatus/" + this.editRuleForm.id,
                            this.editRuleForm
                        );
                        if (res.success) {
                            this.$notify({
                                title: "成功",
                                message: "项目信息更新",
                                type: "success"
                            });
                            await this.getTaskList();
                        } else {
                            this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                            await this.getTaskList();
                        }
                        this.editDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });

            },

            //重置查询表单
            resetForm() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: -1,
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
             * 更新物资
             */
            async updateStatus(row,status) {
                row.status = status;
                this.btnDisabled = true;
                this.btnLoading = true;
                const {data: res} = await this.$http.put("task/editStatus/" + row.id,
                    row
                );
                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "项目信息更新",
                        type: "success"
                    });
                    this.editRuleForm = {};
                    await this.getTaskList();
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }
                this.editDialogVisible = false;
                this.btnDisabled = false;
                this.btnLoading = false;
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
                const {data: res} = await this.$http.get("task/findMyTask", {
                    params: this.queryMap
                });

                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.tableData = res.data.rows;


                    // deliveryNumber
                    for (var i = 0; i < this.tableData.length; i++) {

                        if (null == this.tableData[i].deliveryNumber){
                            this.tableData[i].deliveryNumber = this.tableData[i].productNumber;
                        }

                    }
                }
            },


        },
        created() {

	        // this.role = store.state.userInfo.roles[0];

            this.getTaskList();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }

    };
</script>


