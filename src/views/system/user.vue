<template>
    <div id="users">
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表卡片区 -->
        <el-card class="box-card">
            <el-form :inline="true" ref="form" :model="queryMap" label-width="70px" size="small">
                <el-form-item label="部门">
                    <el-select
                            clearable
                            @change="searchUser"
                            @clear="searchUser"
                            v-model="queryMap.roleId"
                            placeholder="请选择角色"
                    >
                        <el-option
                                v-for="role in roles"
                                :label="role.roleName"
                                :key="role.id"
                                :value="role.id"
                        >
                            <span style="float: left">{{ role.roleName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                <!--<el-tag size="small" effect="plain" type="success">-->
                  <!--{{ role.total }}人-->
                <!--</el-tag>-->
              </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input
                            @keyup.enter.native="searchUser"
                            @clear="searchUser"
                            clearable
                            v-model="queryMap.username"
                            placeholder="请输入用户名查询"
                    ></el-input>
                </el-form-item>

                <el-form-item label="邮箱">
                    <el-input
                            @keyup.enter.native="searchUser"
                            clearable
                            @clear="searchUser"
                            v-model="queryMap.email"
                            placeholder="请输入邮箱查询"
                    ></el-input>
                </el-form-item>

                <el-form-item label="性别">
                    <el-radio v-model="queryMap.sex" label="1">男</el-radio>
                    <el-radio v-model="queryMap.sex" label="0">女</el-radio>
                    <el-radio v-model="queryMap.sex" label>全部</el-radio>
                </el-form-item>

                <el-form-item label="昵称">
                    <el-input clearable @clear="searchUser" v-model="queryMap.nickname" placeholder="请输入昵称查询"></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态">
                  <el-select
                    clearable
                    v-model="queryMap.isban"
                    @clear="searchUser"
                    placeholder="请选择用户状态"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="禁用" value="1"></el-option>
                    <el-option label="正常" value="0"></el-option>
                  </el-select>
                </el-form-item>-->

                <el-form-item style="margin-left:50px;">
                    <el-button  @click="reset" icon="el-icon-refresh">重置</el-button>
                    <el-button type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
                    <el-button
                            type="success"
                            icon="el-icon-plus"
                            @click="addDialogVisible=true"
                            v-hasPermission="'user:add'"
                    >添加</el-button>
                    <el-button @click="downExcel" v-hasPermission="'user:export'"  icon="el-icon-download">导出</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
            <el-table v-loading="loading" size="small" :data="userList" border style="width: 100%;" height="420">
                <!-- <el-table-column type="selection" width="40"></el-table-column> -->
                <el-table-column label="#" prop="id" width="50"></el-table-column>
                <el-table-column prop="username" label="用户名" width="110"></el-table-column>
                <el-table-column prop="roleName" label="角色" width="180" sortable></el-table-column>
                <el-table-column prop="phoneNumber" label="电话" width="150"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>

                <el-table-column prop="sex" :formatter="showSex" label="性别" width="100">
                    <template slot-scope="scope">
                        <el-tag size="small" type="success" v-if="scope.row.sex===1">男</el-tag>
                        <el-tag size="small"  type="warning" v-else>女</el-tag>
                    </template>
                </el-table-column>


                <el-table-column   label="地址"  >
                    <template slot-scope="scope">
                        <div>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.origin}}</div>
                        <div>{{scope.row.address}}</div>
                    </template>
                </el-table-column>



                <!--<el-table-column prop="birth" label="生日" width="180" sortable></el-table-column>-->
                <el-table-column prop="isban" label="是否禁用" width="100">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="changUserStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button   v-hasPermission="'user:edit'" size="small" type="primary" icon="el-icon-edit-outline" @click="edit(scope.row.id)"></el-button>
                        <el-button v-hasPermission="'user:delete'" type="danger" size="small" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
                        <!--<el-tooltip-->
                                <!--class="item"-->
                                <!--effect="dark"-->
                                <!--content="分配角色"-->
                                <!--placement="top"-->
                                <!--:enterable="false"-->
                        <!--&gt;-->
                            <!--<el-button-->
                                    <!--type="warning"-->
                                    <!--size="small"-->
                                    <!--icon="el-icon-s-tools"-->
                                    <!--@click="assignRoles(scope.row.id)"-->
                            <!--&gt;</el-button>-->
                        <!--</el-tooltip>-->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    style="margin-top:10px;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryMap.pageNo"
                    :page-sizes="[10, 20, 50,100]"
                    :page-size="queryMap.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>

            <!-- 添加对话框 -->
            <el-dialog title="添加用户" @close="closeDialog" :visible.sync="addDialogVisible" width="70%;">
                <!-- 表单 -->
                <span>
                  <el-form
                          :model="addForm"
                          :label-position="labelPosition"
                          :rules="addFormRules"
                          ref="addFormRef"
                          label-width="80px"
                  >
                    <el-row>
                      <el-col :span="10">
                        <div class="grid-content bg-purple">
                          <el-form-item label="用户名" prop="username">
                            <el-input v-model="addForm.username"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <el-form-item label="角色" prop="roleId">
                            <el-select v-model="addForm.roleId" placeholder="请选择角色">
                              <el-option
                                      v-for="role in roles"
                                      :key="role.id"
                                      :label="role.roleName"
                                      :value="role.id"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">
                        <div class="grid-content bg-purple">
                          <el-form-item label="公司/部门" prop="nickname">
                            <el-input v-model="addForm.nickname"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="addForm.sex">
                              <el-radio :label="1">男</el-radio>
                              <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="addForm.email"></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式" prop="phoneNumber">
                      <el-input v-model="addForm.phoneNumber"></el-input>
                    </el-form-item>


                      <el-form-item prop="birth" label="生日">


                          <el-col :span="11">

                              <el-date-picker
                                type="date"
                                value-format="yyyy年MM月dd日"
                                placeholder="选择出生日期"
                                v-model="addForm.birth"
                                style="width: 100%;"

                              ></el-date-picker>

                          </el-col>

                      </el-form-item>

                      <el-row>

                          <el-col :span="8">

                              <div class="grid-content bg-purple"></div>

                              <el-form-item label="省份" prop="provinceValue">

                                  <el-select
                                          v-model="addForm.provinceValue"
                                          placeholder="请选择省"
                                          @change="changeProvince"
                                  >

                                      <el-option
                                              v-for="item in provinceList"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value"
                                      ></el-option>

                                  </el-select>

                              </el-form-item>


                          </el-col>
                          <el-col :span="8">

                              <div class="grid-content bg-purple-light">
                              <el-form-item label="城市" prop="cityValue">
                                <el-select
                                        v-model="addForm.cityValue"
                                        placeholder="请选择市"
                                        @change="changeCity"
                                >
                                  <el-option
                                          v-for="item in cityOptions"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </div>
                          </el-col>
                          <el-col :span="8">
                              <div class="grid-content bg-purple">
                              <el-form-item label="区县" prop="originValue">
                                <el-select
                                        v-model="addForm.originValue"
                                        placeholder="请选择区"
                                        @change="changeOrigin"
                                >
                                  <el-option
                                          v-for="item in originOptions"
                                          :key="item.label"
                                          :label="item.label"
                                          :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </div>
                          </el-col>

                      </el-row>


                      <el-form-item label="详细地址" prop="name">
                          <el-input type="textarea" v-model="addForm.address"></el-input>
                      </el-form-item>

                  </el-form>
                </span>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="receiveDialogVisible = false">取 消</el-button>
                  <el-button
                          type="primary"
                          @click="addUser"
                          :loading="btnLoading"
                          :disabled="btnDisabled"
                  >确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
                <span>
                  <el-form
                          :model="editForm"
                          :label-position="labelPosition"
                          :rules="addFormRules"
                          ref="editFormRef"
                          label-width="80px"
                  >
                    <el-row>
                      <el-col :span="10">
                        <div class="grid-content bg-purple">
                          <el-form-item label="用户名" prop="username">
                            <el-input v-model="editForm.username" :disabled="true"></el-input>
                            <el-input
                                    type="hidden"
                                    v-model="editForm.id"
                                    :disabled="true"
                                    style="display:none;"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <el-form-item label="角色" prop="roleId">
                            <el-select v-model="editForm.roleId" placeholder="请选择角色">
                              <el-option
                                      v-for="role in roles"
                                      :key="role.id"
                                      :label="role.roleName"
                                      :value="role.id"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="10">
                        <div class="grid-content bg-purple">
                          <el-form-item label="公司/部门/职位" prop="nickname">
                            <el-input v-model="editForm.nickname"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="editForm.sex">
                              <el-radio :label="1">男</el-radio>
                              <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>

                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="editForm.email"></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式" prop="phoneNumber">
                      <el-input v-model="editForm.phoneNumber"></el-input>
                    </el-form-item>


                      <el-form-item prop="birth" label="生日">

                          <el-col :span="11">

                              <el-date-picker
                                type="date"
                                value-format="yyyy年MM月dd日"
                                placeholder="选择出生日期"
                                v-model="editForm.birth"
                                style="width: 100%;"

                              ></el-date-picker>

                          </el-col>

                      </el-form-item>

                      <el-row>

                          <el-col :span="8">

                              <div class="grid-content bg-purple"></div>

                              <el-form-item label="省份" prop="provinceValue">

                                  <el-select
                                          v-model="editForm.provinceValue"
                                          placeholder="请选择省"
                                          @change="editchangeProvince"
                                  >

                                      <el-option
                                              v-for="item in provinceList"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value"
                                      ></el-option>

                                  </el-select>

                              </el-form-item>


                          </el-col>
                          <el-col :span="8">

                              <div class="grid-content bg-purple-light">
                              <el-form-item label="城市" prop="cityValue">
                                <el-select
                                        v-model="editForm.cityValue"
                                        placeholder="请选择市"
                                        @change="editchangeCity"
                                >
                                  <el-option
                                          v-for="item in cityOptions"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </div>
                          </el-col>
                          <el-col :span="8">
                              <div class="grid-content bg-purple">
                              <el-form-item label="区县" prop="originValue">

                                  <el-select
                                        v-model="editForm.originValue"
                                        placeholder="请选择区"
                                        @change="editchangeOrigin" >

                                    <el-option
                                          v-for="item in originOptions"
                                          :key="item.label"
                                          :label="item.label"
                                          :value="item.value" ></el-option>

                                  </el-select>

                              </el-form-item>
                            </div>
                          </el-col>

                      </el-row>


                      <el-form-item label="详细地址" prop="name">
                          <el-input type="textarea" v-model="editForm.address"></el-input>
                      </el-form-item>



                  </el-form>
                </span>


                <span slot="footer" class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button
                          type="primary"
                          @click="updateUser"
                          :loading="btnLoading"
                          :disabled="btnDisabled"
                  >确 定</el-button>
                </span>
                    </el-dialog>


            <!-- 分配角色对话框 -->
            <el-dialog center title="分配角色" :visible.sync="assignDialogVisible" width="49%">
        <span>
          <template>
            <el-transfer
                    filterable
                    :titles="['未拥有','已拥有']"
                    :button-texts="['到左边', '到右边']"
                    v-model="value"
                    :data="roles"
            ></el-transfer>
          </template>
        </span>
                <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false" class="el-icon-close">取消分配</el-button>
          <el-button
                  v-hasPermission="'user:assign'"
                  type="primary"
                  @click="doAssignRoles"
                  class="el-icon-check"
                  :loading="btnLoading"
                  :disabled="btnDisabled"
          >确定分配</el-button>
        </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        data() {
            const checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                if (!value) {
                    return callback(new Error("邮箱不能为空"));
                }
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的邮箱格式"));
                    }
                }, 100);
            };
            const checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[34578]\d{9}$$/;
                if (!value) {
                    return callback(new Error("电话号码不能为空"));
                }
                setTimeout(() => {
                    if (!Number.isInteger(+value)) {
                        callback(new Error("请输入数字值"));
                    } else {
                        if (phoneReg.test(value)) {
                            callback();
                        } else {
                            callback(new Error("电话号码格式不正确"));
                        }
                    }
                }, 100);
            };
            return {
                btnLoading: false,
                btnDisabled: false,
                roles: [],
                loading: true,
                total: 0,
                addDialogVisible: false, //添加对话框,
                editDialogVisible: false, //修改对话框
                assignDialogVisible: false, //分配角色对话框
                labelPosition: "right", //lable对齐方式
                //查询对象
                queryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    username: "",
                    sex: "",
                    nickname: ""
                },
                userList: [],

                addForm: {
                    username: "",
                    nickname: "",
                    password: "",
                    email: "",
                    phoneNumber: "",
                    sex: "",
                    birth: ""
                }, //添加表单
                editForm: {}, //更新表单
                addFormRules: {
                    username: [
                        { required: true, message: "请输入用户名", trigger: "blur" },
                        { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
                    ],
                    password: [
                        { required: true, message: "请输入密码", trigger: "blur" },
                        { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
                    ],
                    roleId: [
                        { required: true, message: "请选择部门", trigger: "blur" }
                    ],
                    sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
                    birth: [{ required: true, message: "请填写出生日期", trigger: "blur" }],
                    email: [{ required: true, validator: checkEmail, trigger: "blur" }],
                    phoneNumber: [
                        {
                            required: true,
                            message: "请输入联系方式",
                            validator: checkPhone,
                            trigger: "blur"
                        }
                    ],
                    nickname: [
                        { required: true, message: "请输入昵称", trigger: "blur" },
                        { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
                    ]
                }, //添加表单验证规则
                roles: [], //角色
                value: [], //用户拥有的角色
                uid: "",

                provinceList: [], // 省列表
                cityList: [], // 市列表
                originList: [], // 区列表
                cityOptions: [], // 市下拉框数据
                originOptions: [], // 区下拉框数据
            };
        },
        methods: {

            /**
             * 重置
             */
            reset(){
                this.queryMap= {
                    pageNum: 1,
                    pageSize: 10,
                    username: "",
                    sex: "",
                    nickname: ""
                };
            },
            /**
             * 加载用户表格
             */
            downExcel() {
                const $this = this;
                const res = axios
                    .request({
                        url: "system/user/excel",
                        method: "post",
                        responseType: "blob"
                    })
                    .then(res => {
                        if (res.headers["content-type"] === "application/json") {
                            return $this.$message.error(
                                "Subject does not have permission [user:export]"
                            );
                        }
                        const data = res.data;
                        let url = window.URL.createObjectURL(data); // 将二进制文件转化为可访问的url
                        const a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = "用户列表.xls";
                        a.click();
                        window.URL.revokeObjectURL(url);
                    });
            },
            /**
             * 弹出用户分配角色
             */
            async assignRoles(id) {
                const loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                const { data: res } = await this.$http.get("system/user/" + id + "/roles");
                if (res.success) {
                    this.roles = res.data.roles;
                    this.value = res.data.values;
                    this.uid = id;
                    setTimeout(() => {
                        loading.close();
                        this.assignDialogVisible = true;
                    }, 400);
                } else {
                    this.$message.error("分配角色失败:" + res.data.errorMsg);
                }
            },
            /**
             * 确定分配角色
             */
            async doAssignRoles() {
                this.assignDialogVisible = true;
                this.btnLoading = true;
                this.btnDisabled = true;
                const { data: res } = await this.$http.post(
                    "system/user/" + this.uid + "/assignRoles",
                    this.value
                );
                if(res.success){
                    this.$notify.success({
                        title:'操作成功',
                        message:'用户分配角色成功',
                    });
                } else {
                    this.$message.error("分配角色失败:" + res.data.errorMsg);
                }
                this.assignDialogVisible = false;
                this.btnLoading = false;
                this.btnDisabled = false;
            },
            /**
             * 加载用户列表
             */
            async getUserList() {
                const { data: res } = await this.$http.get("system/user/findUserList", {
                    params: this.queryMap
                });
                if(!res.success){
                    return this.$message.error("获取用户列表失败:"+res.data.errorMsg);
                }
                this.total = res.data.total;
                this.userList = res.data.rows;
            },

            /**
             * 删除用户
             */
            async del(id) {
                const res = await this.$confirm(
                    "此操作将永久删除该用户, 是否继续?",
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
                    const { data: res } = await this.$http.delete("system/user/delete/" + id);
                    console.log(res);
                    if(res.success){
                        this.$notify.success({
                            title:'操作成功',
                            message:'用户删除成功',
                        });
                        await this.getUserList();
                        await this.getDepartmets();
                    }else {
                        this.$message.error(res.data.errorMsg);
                    }
                }
            },
            /**
             * 添加用户
             */
            async addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnLoading = true;
                        this.btnDisabled = true;
                        const { data: res } = await this.$http.post("system/user/add", this.addForm);
                        if(res.success){
                            this.$notify.success({
                                title:'操作成功',
                                message:'用户添加成功',
                            });
                            this.addForm = {};
                            await this.getUserList();
                            await this.getDepartmets();
                        } else {
                            return this.$message.error("用户添加失败:" + res.data.errorMsg);
                        }
                        this.addDialogVisible = false;
                        this.btnLoading = false;
                        this.btnDisabled = false;
                    }
                });
            },
            /**
             * 更新用户
             */
            async updateUser() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnLoading = true;
                        this.btnDisabled = true;
                        const { data: res } = await this.$http.put(
                            "system/user/update/" + this.editForm.id,
                            this.editForm
                        );
                        if(res.success){
                            this.$notify({
                                title: "操作成功",
                                message: "用户基本信息已更新",
                                type: "success"
                            });
                            this.editForm = {};
                            await this.getUserList();
                            await this.getDepartmets();
                        } else {
                            this.$message.error("用户信息更新失败:" + res.data.errorMsg);
                        }
                        this.editDialogVisible = false;
                        this.btnLoading = false;
                        this.btnDisabled = false;
                    }
                });
            },
            /**
             * 搜索用户
             */
            searchUser() {
                this.queryMap.pageNum = 1;
                this.getUserList();
            },
            /**
             * 修改用户信息
             */
            async edit(id) {
                const { data: res } = await this.$http.get("system/user/edit/" + id);
                if(res.success){
                    this.editForm = res.data;
                    this.editDialogVisible = true;

                    this.editDefaultProvince(this.editForm.provinceValue);


                    this.editDefaultCity(this.editForm.cityValue);
                    //
                    this.editDefaultOrigin(this.editForm.originValue);

                    // console.log(JSON.stringify(this.provinceList));
                    //
                    // console.log(JSON.stringify(this.cityList));
                    //
                    // console.log(JSON.stringify(this.originList));


                } else {
                    return this.$message.error("用户信息编辑失败:" + res.data.errorMsg);
                }
            },




            // 选择省
            editDefaultProvince(val) {
                this.provinceList.forEach((province, index) => {
                    if (val.toString() === this.provinceList[index].value) {
                        this.cityOptions = this.provinceList[index].children;

                        //set value
                        this.editForm.province = this.provinceList[index].label;
                    }
                });
            },

            // 选择市
            editDefaultCity(val) {
                this.cityList.forEach((city, index) => {
                    if (val.toString() === this.cityList[index].value) {

                        this.originOptions = this.cityList[index].children;

                        // this.editForm.originValue = this.cityList[index].children[0].value; //设置县的值;
                        //set value
                        this.editForm.city = this.cityList[index].label;
                    }
                });
            },

            // 选择区
            editDefaultOrigin(val) {
                this.editForm.originValue = val;

                this.originList.forEach((origin, index) => {
                    if (val.toString() === this.originList[index].value) {
                        //set value
                        this.editForm.origin = this.originList[index].label;
                    }
                });
                //添加this.$forceUpdate();进行强制渲染，效果实现。搜索资料得出结果：因为数据层次太多，render函数没有自动更新，需手动强制刷新。
                this.$forceUpdate();
            },


            /**
             *  改变页码
             */
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.getUserList();
            },
            /**
             * 翻页
             */
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getUserList();
            },

            /**
             * 关闭添加弹出框
             */
            closeDialog() {
                this.$refs.addFormRef.clearValidate();
                this.addForm.birth = "";
                this.addForm = {};
            },
            /**
             * 关闭编辑弹出框
             */
            editClose() {
                this.$refs.editFormRef.clearValidate();
                this.editForm = {};
            },
            /**
             * 禁用启用用户
             */
            async changUserStatus(row) {
                const { data: res } = await this.$http.put(
                    "system/user/updateStatus/" + row.id + "/" + row.status
                );
                if(!res.success){
                    this.$message.error("更新用户状态失败:" + res.data.errorMsg);
                    row.status = !row.status;
                } else {
                    const message = row.status ? '用户状态已禁用' : '用户状态已启用';
                    this.$notify.success({
                        title: '操作成功',
                        message: message,
                    });
                }
            },
            /**
             * 加载所有角色
             */
            async getDepartmets() {
                const { data: res } = await this.$http.get("system/role/findRoleList");
                if(!res.success){
                    return this.$message.error("获取部门列表失败:"+res.data.errorMsg);
                }
                this.roles = res.data.rows;

                console.log('roles' + this.roles);

            },
            /**
             * 显示用户性别
             */
            showSex(row, column) {
                return row.sex === 1 ? "男" : "女";
            },

            _getJsonData() {
                this.$http.get("/json/provinces.json").then(res => {
                    this.provinceList = [];
                    this.cityList = [];
                    this.originList = [];
                    res.data.forEach(item => {
                        if (item.value.match(/0000$/)) {
                            this.provinceList.push({
                                value: item.value,
                                label: item.name,
                                children: []
                            });
                        } else if (item.value.match(/00$/)) {
                            this.cityList.push({
                                value: item.value,
                                label: item.name,
                                children: []
                            });
                        } else {
                            this.originList.push({
                                value: item.value,
                                label: item.name
                            });
                        }
                    });
                    for (let index in this.provinceList) {
                        for (let index1 in this.cityList) {
                            if (
                                this.provinceList[index].value.slice(0, 2) ===
                                this.cityList[index1].value.slice(0, 2)
                            ) {
                                this.provinceList[index].children.push(this.cityList[index1]);
                            }
                        }
                    }
                    for (let item1 in this.cityList) {
                        for (let item2 in this.originList) {
                            if (
                                this.originList[item2].value.slice(0, 4) ===
                                this.cityList[item1].value.slice(0, 4)
                            ) {
                                this.cityList[item1].children.push(this.originList[item2]);
                            }
                        }
                    }
                });
            },
            // 选择省
            changeProvince(val) {
                this.provinceList.forEach((province, index) => {
                    if (val.toString() === this.provinceList[index].value) {
                        this.cityOptions = this.provinceList[index].children;
                        this.addForm.cityValue = this.provinceList[index].children[0].value; //设置市的值
                        this.addForm.city = this.provinceList[index].children[0].label;

                        this.addForm.originValue = this.provinceList[index].children[0].children[0].value; //设置县的值
                        this.addForm.origin = this.provinceList[
                            index
                            ].children[0].children[0].label;

                        this.originOptions = this.provinceList[index].children[0].children;
                        //set value
                        this.addForm.province = this.provinceList[index].label;
                    }
                });
            },
            // 选择市
            changeCity(val) {
                this.cityList.forEach((city, index) => {
                    if (val.toString() === this.cityList[index].value) {
                        this.originOptions = this.cityList[index].children;
                        this.addForm.originValue = this.cityList[index].children[0].value; //设置县的值;
                        //set value
                        this.addForm.city = this.cityList[index].label;
                    }
                });
            },
            // 选择区
            changeOrigin(val) {
                this.addForm.originValue = val;

                this.originList.forEach((origin, index) => {
                    if (val.toString() === this.originList[index].value) {
                        //set value
                        this.addForm.origin = this.originList[index].label;
                    }
                });
                //添加this.$forceUpdate();进行强制渲染，效果实现。搜索资料得出结果：因为数据层次太多，render函数没有自动更新，需手动强制刷新。
                this.$forceUpdate();
            },


            // 选择省
            editchangeProvince(val) {
                this.provinceList.forEach((province, index) => {
                    if (val.toString() === this.provinceList[index].value) {
                        this.cityOptions = this.provinceList[index].children;

                        this.editForm.cityValue = this.provinceList[index].children[0].value; //设置市的值
                        this.editForm.city = this.provinceList[index].children[0].label;

                        this.editForm.originValue = this.provinceList[index].children[0].children[0].value; //设置县的值
                        this.editForm.origin = this.provinceList[index].children[0].children[0].label;

                        this.originOptions = this.provinceList[index].children[0].children;
                        //set value
                        this.editForm.province = this.provinceList[index].label;
                    }
                });
            },

            // 选择市
            editchangeCity(val) {
                this.cityList.forEach((city, index) => {
                    if (val.toString() === this.cityList[index].value) {

                        this.originOptions = this.cityList[index].children;

                        this.editForm.originValue = this.cityList[index].children[0].value; //设置县的值;
                        //set value
                        this.editForm.city = this.cityList[index].label;
                    }
                });
            },

            // 选择区
            editchangeOrigin(val) {
                this.editForm.originValue = val;

                this.originList.forEach((origin, index) => {
                    if (val.toString() === this.originList[index].value) {
                        //set value
                        this.editForm.origin = this.originList[index].label;
                    }
                });
                //添加this.$forceUpdate();进行强制渲染，效果实现。搜索资料得出结果：因为数据层次太多，render函数没有自动更新，需手动强制刷新。
                this.$forceUpdate();
            },




        },
        created() {
            this.getUserList();
            this.getDepartmets();

            this._getJsonData();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>
