<template>
    <div id="welcome">
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>



        <el-card class="box-card" style="width:50%; margin-left: 25%">
            <div slot="header" class="clearfix">
                <span>个人信息</span>
                <el-button icon="el-icon-edit" style="float: right; padding: 3px 0" type="text" @click="edit()">编辑</el-button>
                <el-button icon="el-icon-edit" style="float: right; padding: 3px 5px" type="text" @click="pwdDialog()">修改密码</el-button>

            </div>
            <div style="text-align: center">
                <el-form label-position="right" v-model="userInfo" label-width="30%" size="mini">

                    <el-form-item label="id">
                        <div>{{userInfo.id}}</div>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <div>{{userInfo.username}}</div>
                    </el-form-item>
                    <el-form-item label="电话">
                        <div>{{userInfo.phoneNumber}}</div>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <div>{{userInfo.email}}</div>
                    </el-form-item>
                    <el-form-item label="公司/部门">
                        <div>{{userInfo.nickname}}</div>
                    </el-form-item>
                    <el-form-item label="角色">
                        <div>{{userInfo.roleName}}</div>
                    </el-form-item>

                    <el-form-item label="性别">
                        <el-tag size="small" type="success" v-if="userInfo.sex===1">男</el-tag>
                        <el-tag size="small"  type="warning" v-else>女</el-tag>
                    </el-form-item>

                    <el-form-item label="生日">
                        <div>{{userInfo.birth}}</div>
                    </el-form-item>

                    <el-form-item label="创建时间">
                        <div>{{userInfo.createTime}}</div>
                    </el-form-item>

                    <el-form-item label="地区">
                        <div>{{userInfo.province}}/{{userInfo.city}}/{{userInfo.origin}}</div>
                    </el-form-item>

                    <el-form-item label="地址">
                        <div>{{userInfo.address}}</div>
                    </el-form-item>

                </el-form>
            </div>
        </el-card>



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

                    </el-row>

                    <el-row>
                      <el-col :span="10">
                        <div class="grid-content bg-purple">
                          <el-form-item label="公司/部门" prop="nickname">
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





        <!-- 修改密码 对话框 -->
        <el-dialog title="修改密码" :visible.sync="pwdDialogVisible" width="50%" @close="pwdEditClose">
            <div id='test'>
                <el-form
                        :rules="pwdRules"
                        ref="editPwdFormRef"
                        :model="formPassword"
                        labelWidth="80px"
                        label-position="left">

                    <el-form-item label="旧密码">
                        <el-input type="oldPassword" v-model="formPassword.oldPassword" placeholder="请输入旧密码"></el-input>
                    </el-form-item>

                    <el-form-item v-if="pwdVisible" label="新密码">
                        <el-input type="password" v-model="formPassword.newPassword" placeholder="请输入新密码">
                            <i slot="suffix" title="显示密码" @click="changePass('show')" style="cursor:pointer;"
                               class="el-input__icon iconfont icon-xianshi"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item v-else label="新密码">
                        <el-input type="text" v-model="formPassword.newPassword" placeholder="请输入新密码">
                            <i slot="suffix" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"
                               class="el-input__icon iconfont icon-yincang"></i>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>


            <span slot="footer" class="dialog-footer">

                <el-button @click="pwdDialogVisible = false">取 消</el-button>

                <el-button
                        type="primary"
                        @click="updatePwd"
                        :loading="btnLoading"
                        :disabled="btnDisabled"

                >确 定</el-button>

            </span>
        </el-dialog>



    </div>
</template>
<script>
    import echarts from "echarts";
    import aplayer from "vue-aplayer";
    export default {
        components: {
            //别忘了引入组件
            aplayer: aplayer
        },

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

                value: new Date(),
                userInfo: {},
                tableInfo: [],
                editDialogVisible: false, //修改对话框
                editForm: {}, //更新表单
                btnLoading: false,
                btnDisabled: false,


                labelPosition: "right", //lable对齐方式

                provinceList: [], // 省列表
                cityList: [], // 市列表
                originList: [], // 区列表
                cityOptions: [], // 市下拉框数据
                originOptions: [], // 区下拉框数据

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
                pwdRules: {
                    oldPassword: [
                        { required: true, message: "请输入就密码", trigger: "blur" },
                        { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
                    ],
                    newPassword: [
                        { required: true, message: "请输入新密码", trigger: "blur" },
                        { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
                    ],
                },


                pwdDialogVisible: false, //修改密码 对话框

                formPassword: {
                    oldPassword: '',
                    newPassword: ''
                },
                pwdVisible: true
            };
        },
        methods: {

            async pwdDialog() {
                this.pwdDialogVisible = true;
            },
            changePass(value) {
                this.pwdVisible = !(value === 'show');
            },   //判断渲染，true:暗文显示，false:明文显示


            /**
             获取用户信息
             */
            async getInfo() {
                const { data: res } = await this.$http.get("system/user/me");
                if(!res.success){
                    return this.$message.error("获取用户信息失败:" + res.msg);
                } else {
                    this.userInfo = res.data;
                    // this.$store.commit("setUserInfo", res.data);
                }
            },

            /**
             * 修改用户信息
             */
            async edit() {
                const { data: res } = await this.$http.get("system/user/me/edit/" );
                if(res.success){
                    this.editForm = res.data;
                    this.editDialogVisible = true;


                    this.editDefaultProvince(this.editForm.provinceValue);

                    this.editDefaultCity(this.editForm.cityValue);

                    this.editDefaultOrigin(this.editForm.originValue);

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
             * 关闭编辑弹出框
             */
            editClose() {
                this.$refs.editFormRef.clearValidate();
                this.editForm = {};
            },


            /**
             * 关闭编辑弹出框
             */
            pwdEditClose() {
                this.$refs.editPwdFormRef.clearValidate();
                this.formPassword = {
                    oldPassword: '',
                    newPassword: ''
                };
            },


            /**
             * 更新用户
             */
            async updatePwd() {
                this.$refs.editPwdFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnLoading = true;
                        this.btnDisabled = true;
                        const { data: res } = await this.$http.put(
                            "system/user/pwd/update/",
                            this.formPassword
                        );
                        if(res.success){
                            this.$notify({
                                title: "操作成功",
                                message: "密码已更新",
                                type: "success"
                            });

                            await this.getInfo();
                        } else {
                            this.$message.error("密码更新失败:" + res.data.errorMsg);
                        }
                        this.pwdDialogVisible = false;
                        this.btnLoading = false;
                        this.btnDisabled = false;
                        this.pwdEditClose();

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
                            "system/user/me/update/",
                            this.editForm
                        );
                        if(res.success){
                            this.$notify({
                                title: "操作成功",
                                message: "用户基本信息已更新",
                                type: "success"
                            });

                            await this.getInfo();
                        } else {
                            this.$message.error("用户信息更新失败:" + res.data.errorMsg);
                        }
                        this.editDialogVisible = false;
                        this.btnLoading = false;
                        this.btnDisabled = false;
                        this.editClose();

                    }
                });
            },

            // 选择省
            editchangeProvince(val) {
                this.provinceList.forEach((province, index) => {
                    if (val.toString() === this.provinceList[index].value) {
                        this.cityOptions = this.provinceList[index].children;
                        this.editForm.cityValue = this.provinceList[index].children[0].value; //设置市的值
                        this.editForm.city = this.provinceList[index].children[0].label;

                        this.editForm.originValue = this.provinceList[index].children[0].children[0].value; //设置县的值
                        this.editForm.origin = this.provinceList[
                            index
                            ].children[0].children[0].label;

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



        },

        created() {
            this._getJsonData();


        },
        mounted: function() {
            // this.loginReport(this.userInfo.username);
            // this.draw();
            this.getInfo();
        },

    };
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
        background-image: url("http://myforum.oss-cn-beijing.aliyuncs.com/postImages/1582867606734617c9668-8086-4c9b-867e-efda0bff78d63.png?Expires=1677475607&OSSAccessKeyId=LTAI4FsV5R1tnt8W8kqFqBYh&Signature=3xKM18EXDDD%2BQmsg%2B0t7uDC%2FMGg%3D");
        background-size: 100% 100%;
    }

    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
        background-image: url("http://myforum.oss-cn-beijing.aliyuncs.com/postImages/15828676585536f809b01-a5c3-4229-8ce6-ed29a7bdaaa22.png?Expires=1677475658&OSSAccessKeyId=LTAI4FsV5R1tnt8W8kqFqBYh&Signature=k2fJfFzwKwp7f2c%2BRD7rdH%2FAj%2Bs%3D");
        background-size: 100% 100%;
    }
</style>
