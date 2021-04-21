<template>
	<div id="productCategroys">
		<!-- 面包导航 -->
		<el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>物资管理</el-breadcrumb-item>
			<el-breadcrumb-item>物资型号</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 右侧卡片区域 -->
		<el-card class="box-card">
			<el-row :gutter="6">
				<el-col :span="5">
					<el-cascader
							size="small"
							placeholder="请选择分类查询"
							:change-on-select="true"
							@change="selectChange"
							v-model="categorykeys"
							:props="searchSelectProps"
							:options="cateories"
							clearable
					></el-cascader>
				</el-col>
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
						<el-select size="small" v-model="queryMap.status" @click="search" placeholder="请选择状态">
							<el-option label="全部" :value="-1"></el-option>
							<!--<el-option label="回收站" :value="0"></el-option>-->
							<el-option label="创建" :value="1"></el-option>
							<el-option label="审核中" :value="2"></el-option>
							<el-option label="审核通过" :value="3"></el-option>
						</el-select>
					</template>
				</el-col>
				<el-col :span="8">
					<el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
					<el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置
					</el-button>
					<el-button size="small" type="success" icon="el-icon-circle-plus-outline" @click="openAdd"
					           v-hasPermission="'product:add'">添加
					</el-button>
					<el-button size="small" icon="el-icon-refresh" @click="getproductList">刷新</el-button>
				</el-col>
			</el-row>

			<!-- 表格区域 -->
			<template>
				<el-table
						size="mini"
						v-loading="loading"
						border
						stripe
						:data="productData"
						style="width: 100%;margin-top:20px;"
						height="400"
				>
					<el-table-column prop="id" type="index" label="ID"></el-table-column>

					<el-table-column prop="name" label="物资名称"></el-table-column>

					<el-table-column label="物资规格" width="100">
						<template slot-scope="scope">
							<el-tag type="success" size="mini" closable v-text="scope.row.model"></el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="unit" label="单位" width="80"></el-table-column>
					<el-table-column prop="proposedPrice" :show-overflow-tooltip='true'
					                 label="建议价格(单位元)"></el-table-column>

					<el-table-column prop="imageUrl" label="图片" align="center" width="150px" padding="0px">
						<template slot-scope="scope">
							<el-popover placement="right" trigger="hover">
								<img :src="scope.row.imageUrl"
								     style="height: 200px;width: 200px"/>
								<img slot="reference" :src="scope.row.imageUrl"
								     :alt="scope.row.imgUrl" style="height: 38px;width: 38px;cursor: pointer">
							</el-popover>
						</template>
					</el-table-column>

					<el-table-column prop="remark" label="备注"></el-table-column>

					<el-table-column prop="status" label="状态" width="100">
						<template slot-scope="scope">

							<el-tag size="mini" type="danger"  effect="plain" v-if="scope.row.status==0">已删除</el-tag>
							<el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==1">创建</el-tag>
							<el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==2">审核中</el-tag>
							<el-tag size="mini" type="success" effect="plain"  v-if="scope.row.status==3">审核通过</el-tag>
						</template>
					</el-table-column>

					<el-table-column prop="createTime" label="创建时间"></el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">
							<!--     供应商     -->
							<div v-if="149 == userInfo.roleId">

								<div v-if="scope.row.userId == userInfo.userId">

									<!-- 创建状态  -->
									<span v-if="scope.row.status==1">
										<!-- 提交审核 -->
										<el-popconfirm
												@onConfirm="submitReview(scope.row.id)"
												style="margin-left:10px;"
												confirmButtonText='好的'
												cancelButtonText='不用了'
												icon="el-icon-info"
												iconColor="green" title="确定提交审核吗？"
										>

											<el-button
													type="text"
													size="mini"
													slot="reference"
													icon="el-icon-back">提交审核</el-button>

										</el-popconfirm>


										<el-button
												style="margin-left:10px;"
												type="text" size="mini" icon="el-icon-edit"
												@click="edit(scope.row.id)">编辑</el-button>

										<!-- 删除 -->
										<el-button
												style="margin-left:10px;"
												type="text"
												size="mini"
												icon="el-icon-delete"
												@click="remove(scope.row.id)">删除</el-button>


									</span>

									<!-- 审核中  -->
									<span v-if="scope.row.status==2"> </span>

									<!-- 审核通过  -->
									<span v-if="scope.row.status==3"> </span>

								</div>

							</div>


							<div v-else>


								<!--   创建 -->
								<span v-if="scope.row.status==1">

									<el-popconfirm
											@onConfirm="publish(scope.row.id)"
											style="margin-left:10px;"
											confirmButtonText='是的'
											cancelButtonText='不用了'
											icon="el-icon-info"
											iconColor="blue"
											title="确定审核通过吗？"
									>


										<el-button type="text" slot="reference" size="mini"
										           icon="el-icon-s-operation">通过</el-button>

									</el-popconfirm>

									<el-button
											style="margin-left:10px;"
											type="text" size="mini" icon="el-icon-edit"
											@click="edit(scope.row.id)">编辑</el-button>


									<el-button
											style="margin-left:10px;" type="text" size="mini" icon="el-icon-delete"
											@click="remove(scope.row.id)">删除</el-button>

								</span>


								<!--   审核中 -->
								<span v-if="scope.row.status==2">


									<el-popconfirm
											@onConfirm="publish(scope.row.id)"
											style="margin-left:10px;"
											confirmButtonText='是的'
											cancelButtonText='不用了'
											icon="el-icon-info"
											iconColor="blue"
											title="确定审核通过吗？"
									>
										<el-button type="text" slot="reference" size="mini"
										           icon="el-icon-s-operation">通过</el-button>

									</el-popconfirm>



									<el-button
											style="margin-left:10px;" type="text" size="mini" icon="el-icon-delete"
											@click="del(scope.row.id)">驳回</el-button>

								</span>


								<!--   审核通过 -->
								<span v-if="scope.row.status==3">

									<el-button
											style="margin-left:10px;"
											type="text" size="mini" icon="el-icon-edit"
											@click="edit(scope.row.id)">编辑</el-button>



									<el-button
											style="margin-left:10px;" type="text" size="mini" icon="el-icon-delete"
											@click="del(scope.row.id)">删除</el-button>

								</span>

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
			<!-- 物资添加弹出框 -->

			<el-dialog title="添加物资" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">

				<span>
					<el-form
							size="mini"
							:model="addRuleForm"
							:rules="addRules"
							ref="addRuleFormRef"
							label-width="100px"
							class="demo-ruleForm"
					>
						<el-row>
							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="物资名称" prop="name">
										<el-input v-model="addRuleForm.name"></el-input>
									</el-form-item>
				                </div>
				              </el-col>

							<el-col :span="12">
				                <div class="grid-content bg-purple">

					                <el-form-item label="建议价格" prop="proposedPrice">
										<el-input v-model="addRuleForm.proposedPrice"
										          placeholder="建议价格(单位元)"></el-input>
									</el-form-item>

				                </div>
							</el-col>
						</el-row>


						<el-row>

							<el-col :span="12">
								<div class="grid-content bg-purple-light">
				                  <el-form-item label="物资规格" prop="model">
				                    <el-input v-model="addRuleForm.model"></el-input>
				                  </el-form-item>
				                </div>
							</el-col>

							<el-col :span="12">
				                <div class="grid-content bg-purple">
				                  <el-form-item label="分类" prop="categoryKeys">
				                    <el-cascader
						                    :options="cateories"
						                    clearable
						                    filterable
						                    :props="selectProps"
						                    v-model="addRuleForm.categoryKeys"
				                    ></el-cascader>
				                  </el-form-item>

				                </div>
							</el-col>
						</el-row>

						<el-row>
			              <el-col :span="12">
			                <div class="grid-content bg-purple">
			                  <el-form-item label="单位" prop="unit">
			                    <el-input v-model="addRuleForm.unit"></el-input>
			                  </el-form-item>
			                </div>
			              </el-col>
			              <el-col :span="12">
			                <div class="grid-content bg-purple-light">
			                  <el-form-item label="排序" prop="sort">
			                    <el-input-number v-model="addRuleForm.sort" :min="1" :max="10"
			                                     label="排序"></el-input-number>
			                  </el-form-item>
			                </div>
			              </el-col>
			            </el-row>


						<el-form-item label="备注(品牌 材料质量)" prop="remark">

							<el-input type="textarea" v-model="addRuleForm.remark"></el-input>

						</el-form-item>


						<el-form-item label="物资图片" prop="name">

							<!-- 图片上传部分 -->
							<el-upload v-model="addRuleForm.imageUrl"
							           :action="uploadApi"
							           :class="{ disabled: uploadDisabled }"
							           list-type="picture-card"
							           :limit="limitCount"
							           :on-change="handleChange"
							           :on-remove="handleRemove"
							           accept="image/*"
							           :on-success="handleSuccess"
							           :headers="headerObject"
							           ref="upload"
							           :on-preview="handlePictureCardPreview"
							>

								<i class="el-icon-plus"></i>

							</el-upload>

						</el-form-item>


					</el-form>

				</span>
				<span slot="footer" class="dialog-footer">

					<el-button @click="receiveDialogVisible = false">取 消</el-button>

					<el-button type="primary" @click="add" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>

				</span>
			</el-dialog>

			<!-- 物资编辑弹出框 -->
			<el-dialog
					title="更新物资"
					:visible.sync="editDialogVisible"
					width="50%"
					@close="closeEditDialog">


				<span>
					<el-form
							size="mini"
							:model="editRuleForm"
							:rules="addRules"
							ref="editRuleFormRef"
							label-width="100px"
							class="demo-ruleForm"
					>
						<el-row>
							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="物资名称" prop="name">
										<el-input v-model="editRuleForm.name"></el-input>
									</el-form-item>
				                </div>
				              </el-col>

							<el-col :span="12">
				                <div class="grid-content bg-purple">

					                <el-form-item label="建议价格" prop="proposedPrice">
										<el-input v-model="editRuleForm.proposedPrice"
										          placeholder="建议价格(单位元)"></el-input>
									</el-form-item>

				                </div>
							</el-col>
						</el-row>

						<el-row>

							<el-col :span="12">
								<el-form-item label="物资规格" prop="model">
									<el-input v-model="editRuleForm.model"></el-input>
								</el-form-item>
							</el-col>


							<el-col :span="12">

								<div class="grid-content bg-purple">

									<el-form-item label="分类" prop="categoryKeys">

										<el-cascader
												:options="cateories"
												clearable
												filterable
												:props="selectProps"
												v-model="editRuleForm.categoryKeys"
										></el-cascader>

									</el-form-item>
								</div>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<div class="grid-content bg-purple">
									<el-form-item label="单位" prop="unit">
										<el-input v-model="editRuleForm.unit"></el-input>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label="排序" prop="sort">
										<el-input-number v-model="editRuleForm.sort" :min="1" :max="10"
										                 label="排序"></el-input-number>
									</el-form-item>
								</div>
							</el-col>
						</el-row>


						<el-form-item label="备注(品牌 材料质量)" prop="remark">
							<el-input type="textarea" v-model="editRuleForm.remark"></el-input>
						</el-form-item>


						<el-form-item label="物资图片" prop="name">
							<!-- 图片上传部分 -->

							<el-upload v-model="editRuleForm.imageUrl"
							           :action="uploadApi"
							           :class="{ disabled: uploadDisabled }"
							           list-type="picture-card"
							           :limit="limitCount"
							           :on-change="edithandleChange"
							           :on-remove="edithandleRemove"
							           accept="image/*"
							           :on-success="editHandleSuccess"
							           :headers="headerObject"
							           ref="upload2"
							           :on-preview="edithandlePictureCardPreview"
							           :file-list="imgFilesList"
							>


								<i class="el-icon-plus"></i>
							</el-upload>

						</el-form-item>

					</el-form>


                </span>

				<span slot="footer" class="dialog-footer">

					<el-button @click="editDialogVisible = false">取 消</el-button>

					<el-button
							type="primary"
							@click="update"
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
    export default {
        data() {
            return {
                uploadApi: this.BASE_API_URL + 'system/upload/image',
                btnLoading: false,
                btnDisabled: false,
                loading: true,
                headerObject: {
                    Authorization: LocalStorage.get(LOCAL_KEY_XINGUAN_ACCESS_TOKEN)
                }, //图片上传请求头
                cateories: [], //类别选择
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

                userInfo: {},

                editDialogVisible: false,
                receiveDialogVisible: false, //添加弹框是否显示
                total: 0, //总共多少条数据
                productData: [], //表格数据
                queryMap: {
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
                    name: [
                        {required: true, message: "请输入物资名称", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],
                    unit: [
                        {required: true, message: "请输入物资单位", trigger: "blur"},
                        {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
                    ],
                    model: [
                        {required: true, message: "请输入物资规格", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],
                    remark: [
                        {required: true, message: "请输入物资说明备注(品牌 材料质量)", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],
                    categorys: [
                        {required: true, message: "请输入物资分类", trigger: "blur"}
                    ],
                    sort: [{required: true, message: "请输入地址信息", trigger: "blur"}],
                    categoryKeys: [
                        {required: true, message: "请选择物资分类", trigger: "blur"}
                    ]
                }, //添加验证
                imgFilesList: [],
                categorykeys: [] //搜索类别
            };
        },
        methods: {
            //重置查询表单
            resetForm() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: 0,
                };
            },
            /**
             * 打开添加物资弹框
             */
            openAdd() {
                this.getCatetorys();
                this.addDialogVisible = true;
            },
            /**
             * 搜索物资
             */
            search() {
                this.queryMap.pageNum = 1;
                this.getproductList();
            },



            /**
             * 物资添加审核
             */
            async submitReview(id) {
                const {data: res} = await this.$http.put("business/product/submitReview/" + id);
                if (!res.success) {
                    return this.$message.error("提交审核失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    return this.$message.success("成功提交审核");
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
                    await this.getproductList();
                    return this.$message.success("物资已审核通过");
                }
            },

            /**
             * 更新物资
             */
            async update() {
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        const {data: res} = await this.$http.put(
                            "business/product/update/" + this.editRuleForm.id,
                            this.editRuleForm
                        );
                        if (res.success) {
                            this.$notify({
                                title: "成功",
                                message: "物资信息更新",
                                type: "success"
                            });
                            this.editRuleForm = {};
                            await this.getproductList();
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
            async edit(id) {
                const {data: res} = await this.$http.get("business/product/edit/" + id);
                if (res.success) {
                    this.editRuleForm = res.data;
                    const item = res.data;
                    this.imgFilesList.push({
                        url: item.imageUrl,
                        name: item.name,
                        id: item.id
                    });


                    const array = [];

                    if (null != item.oneCategoryId) array.push(item.oneCategoryId);
                    if (null != item.twoCategoryId) array.push(item.twoCategoryId);
                    if (null != item.threeCategoryId) array.push(item.threeCategoryId);

                    this.editRuleForm.categoryKeys = array;
                    this.editRuleForm.categoryKeys = array;
                    this.editDialogVisible = true;

                } else {
                    return this.$message.error("物资信息编辑失败" + res.data.errorMsg);
                }

            },
            /**
             * 添加物资
             */
            add() {
                console.log("add imageUrl " + this.addRuleForm.imageUrl);
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        const {data: res} = await this.$http.post(
                            "business/product/add",
                            this.addRuleForm
                        );
                        if (res.success) {
                            this.$message.success("物资添加成功");
                            this.addRuleForm = {};
                            await this.getproductList();
                        } else {
                            return this.$message.error("物资添加失败:" + res.data.errorMsg);
                        }
                        this.addDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },
            /**
             * 删除
             */
            async remove(id) {

                var res = await this.$confirm(
                    "删除该物资, 是否继续?",
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
                    const {data: res} = await this.$http.put("business/product/remove/" + id);
                    if (!res.success) {
                        return this.$message.error("删除失败:" + res.data.errorMsg);
                    } else {
                        await this.getproductList();
                        return this.$message.success("删除成功");
                    }
                }
            },


            async del(id) {

                var res = await this.$confirm(
                    "删除该物资, 是否继续?",
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
                    const {data: res} = await this.$http.put("business/product/remove/" + id);
                    if (!res.success) {
                        return this.$message.error("删除失败:" + res.data.errorMsg);
                    } else {
                        await this.getproductList();
                        return this.$message.success("删除成功");
                    }
                }
            },



            /**
             * 加载物资列表
             */
            async getproductList() {
                const {data: res} = await this.$http.get("business/product/findProductList", {
                    params: this.queryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.productData = res.data.rows;
                }
            },
            /**
             * 加载物资类别
             */
            async getCatetorys() {
                const {data: res} = await this.$http.get(
                    "business/productCategory/categoryTree"
                );
                if (!res.success) {
                    return this.$message.error("获取物资类别失败");
                } else {
                    this.cateories = res.data.rows;
                }
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
                this.getproductList();
            },
            //翻页
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getproductList();
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
                this.addRuleForm.imageUrl = response.data;
                console.log("handleSuccess imageUrl " + this.addRuleForm.imageUrl);
                console.log("handleSuccess file " + file.url);
                console.log("handleSuccess fileList " + fileList.length);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.addRuleForm.imageUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.addRuleForm.imageUrl);

                this.dialogVisible = true;
            },
            //编辑
            editHandleSuccess(response, file, fileList) {
                this.editRuleForm.imageUrl = response.data;

                console.log("handleSuccess imageUrl " + this.editRuleForm.imageUrl);
                console.log("handleSuccess file " + file.url);
                console.log("handleSuccess fileList " + fileList.length);


            },
            edithandleChange(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
            },


            edithandleRemove(file, fileList) {
                this.uploadDisabled = fileList.length >= this.limitCount;
                this.addRuleForm.imageUrl = "";
            },

            edithandlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.addRuleForm.imageUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.addRuleForm.imageUrl);

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
            }
        },
        created() {

            this.userInfo = this.$store.state.userInfo;
            // const roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;


            this.getproductList();
            this.getCatetorys();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>


