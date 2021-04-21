<template>
	<div id="productCategroys">
		<!-- 面包导航 -->
		<el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>采购计划</el-breadcrumb-item>
			<el-breadcrumb-item>我的采购计划</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 右侧卡片区域 -->
		<el-card class="box-card">
			<!--<el-container style="margin-bottom:20px;">-->
			<!--<el-alert-->
			<!--show-icon-->
			<!--title="友情提示:  商品的分类只支持三级分类"-->
			<!--type="warning">-->
			<!--</el-alert>-->
			<!--</el-container>-->
			<el-row :gutter="7">
				<el-col :span="7">
					<el-input
							clearable
							size="small"
							v-model="queryMap.name"
							placeholder="请输入项目名称查询"
							@clear="search"
							class="input-with-select"
					></el-input>
				</el-col>
				<el-col :span="5">
					<template>
						<el-select size="small" v-model="queryMap.status" @click="search" placeholder="请选择状态">
							<el-option label="全部" :value="-1"></el-option>
							<el-option label="创建" :value="0"></el-option>
							<el-option label="指派分配" :value="1"></el-option>
							<el-option label="指派采购" :value="2"></el-option>
							<el-option label="入库完成" :value="3"></el-option>
							<el-option label="验收完成" :value="4"></el-option>
						</el-select>
					</template>
				</el-col>

				<el-col :span="8">
					<el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
					<el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置
					</el-button>
					<el-button size="small" type="success" icon="el-icon-circle-plus-outline" @click="openAdd"
					           v-hasPermission="'project:add'">添加
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
						height="500"
				>
					<el-table-column prop="id" type="index" label="ID"></el-table-column>


					<el-table-column prop="projectName" label="项目名称"></el-table-column>


					<el-table-column prop="imageUrl" label="项目资料" align="center" width="150px" padding="0px">
						<template slot-scope="scope">
							<el-popover placement="right" trigger="hover">
								<img :src="scope.row.imageUrl"
								     style="height: 200px;width: 200px"/>
								<img slot="reference" :src="scope.row.imageUrl"
								     :alt="scope.row.imageUrl" style="height: 38px;width: 38px;cursor: pointer">
							</el-popover>
						</template>
					</el-table-column>


					<el-table-column align="center" label="创建者(项目部)" width="250px">
						<template slot-scope="scope">
							<div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi">
								<div>id：{{scope.row.creatorId}}</div>
								<div>姓名：{{scope.row.creatorName}}</div>
								<div>电话：{{scope.row.creatorPhoneNumber}}</div>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="分配者(资源管理中心)" width="250px">
						<template slot-scope="scope">
							<div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi">
								<div>id：{{scope.row.allocatorId}}</div>
								<div>姓名：{{scope.row.allocatorName}}</div>
								<div>电话：{{scope.row.allocatorPhoneNumber}}</div>
							</div>
						</template>
					</el-table-column>


					<el-table-column prop="remark" label="备注"></el-table-column>
					<el-table-column prop="status" label="状态" width="100">
						<template slot-scope="scope">

							<el-tag size="mini" effect="plain" v-if="scope.row.status==0">创建</el-tag>
							<el-tag size="mini" type="info" effect="plain" v-if="scope.row.status==1">指派分配</el-tag>
							<el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==2">指派采购</el-tag>

							<el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==3">入库完成</el-tag>
							<el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==4">验收完成</el-tag>


						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<!--              给管理员提供的恢复和删除-->

							<span v-if="scope.row.status==1">
                                <el-popconfirm
		                                @onConfirm="back(scope.row.id)"
		                                style="margin-left:10px;"
		                                confirmButtonText='好的'
		                                cancelButtonText='不用了'
		                                icon="el-icon-info"
		                                iconColor="green"
		                                title="这是一段内容确定恢复吗？">

                                    <el-button type="text" size="mini" slot="reference"
                                               icon="el-icon-back">恢复</el-button>
                                </el-popconfirm>

								<!--<el-button type="text" size="mini"  icon="el-icon-back" :onclick="onDetails(scope.row.id)">详情</el-button>-->


                                <el-button style="margin-left:10px;" type="text" size="mini" icon="el-icon-back"
                                           @click="onDetails(scope.row.id)">详情</el-button>

                                <el-button style="margin-left:10px;" type="text" size="mini" icon="el-icon-delete"
                                           @click="del(scope.row.id)">删除</el-button>
                            </span>

							<!--              给操作员提供的编辑和回收-->
							<span v-if="scope.row.status==0">
                                <el-button style="margin-left:10px;" type="text" size="mini" icon="el-icon-edit"
                                           @click="edit(scope.row.id)">编辑</el-button>

                                <el-popconfirm
		                                @onConfirm="del(scope.row.id)"
		                                style="margin-left:10px;"
		                                confirmButtonText='好的'
		                                cancelButtonText='不用了'
		                                icon="el-icon-info"
		                                iconColor="red"
		                                title="确定要删除该项目吗？">
                                    <el-button type="text" slot="reference" size="mini"
                                               icon="el-icon-s-operation">删除</el-button>
                                </el-popconfirm>

                                <el-button style="margin-left:10px;" type="text" size="mini" icon="el-icon-back"
                                           @click="onDetails(scope.row.id)">详情</el-button>


                            </span>

							<!--          给管理员提供的审核和不通过-->
							<span v-if="scope.row.status==2">

                                <el-popconfirm
		                                @onConfirm="publish(scope.row.id)"
		                                style="margin-left:10px;"
		                                confirmButtonText='是的'
		                                cancelButtonText='不用了'
		                                icon="el-icon-info"
		                                iconColor="blue"
		                                title="确定审核通过吗？">

                                    <el-button type="text" slot="reference" size="mini"
                                               icon="el-icon-s-operation">通过</el-button>
                                </el-popconfirm>

                            <el-button style="margin-left:10px;" type="text" size="mini" icon="el-icon-delete"
                                       @click="del(scope.row.id)">删除</el-button>
                            </span>

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
			<el-dialog title="发起采购计划" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">

				<span>


					<el-form
							size="mini"
							:model="addRuleForm"
							:rules="addRules"
							ref="addRuleFormRef"
							label-width="100px"
							class="demo-ruleForm">


						<el-form-item label="计划名称" prop="projectName">

		                <el-input v-model="addRuleForm.projectName"></el-input>

	                </el-form-item>


						<el-form-item label="资料" prop="imageUrl">

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


						<el-row>

							<el-col :span="12">

				            <div class="grid-content bg-purple">


					            <el-form-item label="资源管理中心" required>

						            <el-select v-model="addRuleForm.allocatorId" placeholder="请指派物资管理人员"
						                       style="width: 100%">

							            <el-option

									            v-for="item in allocators"

									            :key="item.id"

									            :label="item.username"

									            :value="item.id">

							            </el-option>

						            </el-select>

					            </el-form-item>


				            </div>

			            </el-col>

						</el-row>


						<el-row>
				            <el-col :span="12">
					            <div class="grid-content bg-purple-light">
						            <el-form-item label="优先级别" prop="sort">
							            <el-input-number v-model="addRuleForm.sort" :min="1" :max="10"
							                             label="优先级别"></el-input-number>
						            </el-form-item>
					            </div>
				            </el-col>
			            </el-row>




						<el-form-item label="备注信息" >

			                <el-input type="textarea" v-model="addRuleForm.remark"></el-input>

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
					title="更新项目"
					:visible.sync="editDialogVisible"
					width="50%"
					@close="closeEditDialog"
			>

				<span>
					<el-form
							size="mini"
							:model="editRuleForm"
							:rules="addRules"
							ref="editRuleFormRef"
							label-width="100px"
							class="demo-ruleForm">


						<el-form-item label="项目名称" prop="projectName">

							<el-input v-model="editRuleForm.projectName"></el-input>

						</el-form-item>

						<el-form-item label="项目资料" prop="imageUrl">

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
									:on-preview="edithandlePictureCardPreview"
									:file-list="imgFilesList"
							>

								<i class="el-icon-plus"></i>

							</el-upload>

						</el-form-item>

						<el-row>
							<el-col :span="12">

								<div class="grid-content bg-purple">

									<el-form-item label="物资管理" required>

										<el-select v-model="editRuleForm.allocatorId" placeholder="请指派物资管理人员"
										           style="width: 100%">

											<el-option

													v-for="item in allocators"

													:key="item.id"

													:label="item.username"

													:value="item.id">

											</el-option>

										</el-select>

									</el-form-item>


								</div>

							</el-col>

						</el-row>

						<el-row>

							<el-col :span="12">

								<div class="grid-content bg-purple-light">


									<el-form-item label="优先级别" prop="sort">

										<el-input-number v-model="editRuleForm.sort" :min="1" :max="10"
										                 label="优先级别"></el-input-number>

									</el-form-item>

								</div>

							</el-col>

						</el-row>

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
                addRuleForm: {
                    sort : 1
				}, //添加表单数据
                editRuleForm: {}, //修改表单数据
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
                        {min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur"}
                    ],

                    sort: [{required: true, message: "请输入地址信息", trigger: "blur"}],
                    // categoryKeys: [
                    //     {required: true, message: "请选择物资分类", trigger: "blur"}
                    // ]
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
                    status: -1,
                };
            },
            /**
             * 打开添加物资弹框
             */
            openAdd() {
                this.getCatetorys();
                this.addDialogVisible = true;

                this.addRuleForm.sort = 1;
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
            async publish(id) {
                const {data: res} = await this.$http.put("business/product/publish/" + id);
                if (!res.success) {
                    return this.$message.error("审核失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    return this.$message.success("物资已审核通过");
                }
            },
            // /**
            //  * 删除物资
            //  */
            // async del(id) {
            //     var res = await this.$confirm(
            //         "此操作将永久删除该物资, 是否继续?",
            //         "提示",
            //         {
            //             confirmButtonText: "确定",
            //             cancelButtonText: "取消",
            //             type: "warning"
            //         }
            //     ).catch(() => {
            //         this.$message({
            //             type: "info",
            //             message: "已取消删除"
            //         });
            //     });
            //     if (res === "confirm") {
            //         const {data: res} = await this.$http.delete("business/product/delete/" + id);
            //         if (res.success) {
            //             this.$message.success("物资删除成功");
            //             await this.getproductList();
            //         } else {
            //             this.$message.error(res.data.errorMsg);
            //         }
            //     }
            // },
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
                            "project/update/" + this.editRuleForm.id,
                            this.editRuleForm
                        );
                        if (res.success) {
                            this.$notify({
                                title: "成功",
                                message: "项目信息更新",
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

                this.getCatetorys();

                const {data: res} = await this.$http.get("project/info/" + id);
                if (res.success) {
                    this.editRuleForm = res.data;
                    const item = res.data;
                    this.imgFilesList.push({
                        url:  item.imageUrl,
                        name: item.name,
                        id: item.id
                    });
                } else {
                    return this.$message.error("物资信息编辑失败" + res.data.errorMsg);
                }
                const array = [];
                array.push(res.data.oneCategoryId);
                array.push(res.data.twoCategoryId);
                array.push(res.data.threeCategoryId);
                this.editRuleForm.categoryKeys = array;
                this.editDialogVisible = true;
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
                            "project/add",
                            this.addRuleForm
                        );
                        if (res.success) {
                            this.$message.success("物资添加成功");
                            this.addRuleForm = {};
                            await this.getproductList();


                            this.onDetails(res.data.id);
                        } else {
                            return this.$message.error("物资添加失败:" + res.data.errorMsg);
                        }
                        this.addDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },

            onDetails(id) {

                console.log("details " + id);

                this.$router.push({
                    path: '/project/details',
                    query: {
                        id: id
                    }
                })

            },

            /**
             * 移除回收站
             */
            async del(id) {
                const {data: res} = await this.$http.delete("project/delete/" + id);
                if (!res.success) {
                    return this.$message.error("物资删除失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    this.$message.success("物资删除成功");
                    return this.$message.success("移入回收站成功");
                }
            },

            /**
             * 从回收站恢复
             */
            async back(id) {
                const {data: res} = await this.$http.put("product/back/" + id);
                if (!res.success) {
                    return this.$message.error("从回收站恢复失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    return this.$message.success("从回收站中已恢复");
                }
            },
            /**
             * 加载项目列表
             */
            async getproductList() {
                const {data: res} = await this.$http.get("project/findMyProjectList", {
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
                    "system/user/findUserList?roleId=147"
                );
                if (!res.success) {
                    return this.$message.error("获取物资类别失败");
                } else {
                    this.allocators = res.data.rows;
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
            },

            edithandlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.editRuleForm.imageUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.editRuleForm.imageUrl);

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
            this.getproductList();
            this.getCatetorys();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>


