<template>
    <div id="welcome">
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商户信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container style="margin-bottom:20px;">
            <el-alert
                    show-icon
                    title="提示:  商户信息通过审核后,才能接受任务。请尽快提交审核!"
                    type="warning">
            </el-alert>
        </el-container>

        <el-card class="box-card" style="width:50%; margin-left: 25%">
            <div slot="header" class="clearfix">
                <span>商户信息</span>
                <el-button icon="el-icon-edit" style="float: right; padding: 3px 0" type="text" @click="edit()">编辑</el-button>
            </div>

            <div style="text-align: center">
                <el-form label-position="right" v-model="merchantInfo" label-width="30%" size="mini">
                    <el-form-item label="公司名称">
                        <div>{{merchantInfo.companyName}}</div>
                    </el-form-item>
                    <el-form-item label="备注">
                        <div>{{merchantInfo.remark}}</div>
                    </el-form-item>

                    <el-form-item label="对公账户姓名">
                        <div>{{merchantInfo.bankAccountName}}</div>
                    </el-form-item>

                    <el-form-item label="对公账户银行名称">
                        <div>{{merchantInfo.bankName}}</div>
                    </el-form-item>

                    <el-form-item label="对公账户银行账号">
                        <div>{{merchantInfo.bankAccount}}</div>
                    </el-form-item>

                    <el-form-item label="营业执照">

                        <img :src="merchantInfo.businessLicenseImgUrl"
                             style="height: 200px;width: 200px"
                        />

                    </el-form-item>


                    <el-row>

                        <el-button type="primary" @click.native="onSubmit()" v-if="merchantInfo.status===0">提交审核</el-button>

                        <el-button v-else-if="merchantInfo.status===1">审核中</el-button>

                        <el-button type="primary" v-else-if="merchantInfo.status===2">审核通过</el-button>

                    </el-row>

                </el-form>



            </div>
        </el-card>





        <!-- 物资编辑弹出框 -->
        <el-dialog
                title="更新项目"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editClose" >
            <span>


                <el-form
                      size="mini"
                      :model="merchantInfo"
                      :rules="addRules"
                      ref="editRuleFormRef"
                      label-width="100px"
                      class="demo-ruleForm" >




                    <el-form-item label="公司名称" prop="companyName">

                        <el-input v-model="merchantInfo.companyName"></el-input>


                    </el-form-item>



                    <el-form-item label="备注" prop="remark">


                        <el-input v-model="merchantInfo.remark"></el-input>


                    </el-form-item>





                    <el-form-item label="银行对公账户 姓名" prop="bankAccountName">


                        <el-input v-model="merchantInfo.bankAccountName"></el-input>


                    </el-form-item>




                    <el-form-item label="银行对公账户 银行名称" prop="bankName">
                        <el-input v-model="merchantInfo.bankName"></el-input>
                    </el-form-item>



                    <el-form-item label="银行对公账户 银行账号" prop="bankAccount">
                        <el-input v-model="merchantInfo.bankAccount"></el-input>
                    </el-form-item>



                    <el-form-item label="营业执照照片" prop="businessLicenseImgUrl">



                      <!--图片上传部分 -->


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
                          :file-list="imgFilesList" >

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
                        :loading="btnLoading">确 定</el-button>
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
            return {
                uploadDisabled: false,
                limitCount: 1,
                uploadApi: this.BASE_API_URL + 'system/upload/image',
                headerObject: {
                    Authorization: LocalStorage.get(LOCAL_KEY_XINGUAN_ACCESS_TOKEN)
                },
                imgFilesList: [],

                value: new Date(),
                merchantInfo: {},


                tableInfo: [],
                editDialogVisible: false, //修改对话框
                editForm: {}, //更新表单
                btnLoading: false,
                btnDisabled: false,
                defineUrl:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190823%2Fae7c64b8ecaf4188aa31fefe5e6731d9.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617197154&t=538694ad1fd4e8c978c6a00269bf6023"

                ,

                addRules: {
                    projectName: [
                        {required: true, message: "请输入项目名称", trigger: "blur"},
                        {min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur"}
                    ],
                    allocatorId: [
                        {required: true, message: "分配者id (资源管理部)", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],

                    remark: [
                        {required: true, message: "请输入物资说明备注", trigger: "blur"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ],

                    sort: [{required: true, message: "请输入地址信息", trigger: "blur"}],

                }, //添加验证

            };
        },
        methods: {


            async onSubmit(){

                this.merchantInfo.status = 1;

                const {data: res} = await this.$http.put(
                    "merchantInfo/updateStatus/" + this.merchantInfo.id,
                    this.merchantInfo
                );
                if (res.success) {
                    this.$notify({
                        title: "成功",
                        message: "项目信息更新",
                        type: "success"
                    });
                    this.merchantInfo = {};
                    await this.getInfo();
                } else {
                    this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                }

            },

            /**
             * 更新物资
             */
            async update() {
                // if (merchantInfo.status == 1) {
                //     this.$notify({
                //         title: "资料审核中",
                //         message: "资料审核中,请耐心等待",
                //         type: "success"
                //     });
                // }

                if (null == this.merchantInfo.id) {

                    this.add();
                } else {

                    this.$refs.editRuleFormRef.validate(async valid => {
                        if (!valid) {
                            return;
                        } else {
                            this.btnDisabled = true;
                            this.btnLoading = true;
                            const {data: res} = await this.$http.put(
                                "merchantInfo/update/" + this.merchantInfo.id,
                                this.merchantInfo
                            );
                            if (res.success) {
                                this.$notify({
                                    title: "成功",
                                    message: "项目信息更新",
                                    type: "success"
                                });
                                this.merchantInfo = {};
                                await this.getInfo();
                            } else {
                                this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                            }
                            this.editDialogVisible = false;
                            this.btnDisabled = false;
                            this.btnLoading = false;
                        }
                    });
                }

            },


            add() {
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        const {data: res} = await this.$http.post(
                            "merchantInfo/add",
                            this.merchantInfo
                        );
                        if (res.success) {
                            this.$message.success("物资添加成功");
                            this.merchantInfo = {};
                            await this.getInfo();
                        } else {
                            return this.$message.error("物资添加失败:" + res.data.errorMsg);
                        }
                        this.editDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },

            /**
             获取用户信息
             */
            async getInfo() {
                const { data: res } = await this.$http.get("merchantInfo/info");
                if(!res.success){
                    return this.$message.error("获取用户信息失败:" + res.msg);
                } else {
                    this.merchantInfo = res.data;
                }
            },

            /**
             * 修改用户信息
             */
            async edit() {
                this.editDialogVisible = true;

                this.imgFilesList = [] ;
                this.imgFilesList.push({
                    url:  this.merchantInfo.businessLicenseImgUrl,
                    name: "businessLicenseImgUrl",
                    id: 1
                });
            },

            /**
             * 关闭编辑弹出框
             */
            editClose() {
                this.$refs.editFormRef.clearValidate();
                this.editForm = {};
            },

            //编辑
            editHandleSuccess(response, file, fileList) {
                this.merchantInfo.businessLicenseImgUrl = response.data;
            },


            handlePictureCardPreview(file) {
                // this.dialogImageUrl = file.url;
                this.merchantInfo.businessLicenseImgUrl = file.url;
                console.log("handlePictureCardPreview imageUrl " + this.merchantInfo.businessLicenseImgUrl);

                // this.dialogVisible = true;
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
        },

        created() {

        },
        mounted: function() {

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
