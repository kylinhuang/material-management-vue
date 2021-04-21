<template>


    <div class="app-container">


        <el-table :data="tableData" border stripe style="width: 100%;">

            <el-table-column prop="index" type="index" label="编号" width="50"></el-table-column>


            <el-table-column prop="payee_name" label="物资型号" >
                <template slot-scope="scope"  >
                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi" v-if="null!=scope.row.product" >
                        <div>名称：{{scope.row.product.name}} </div>
                        <div>型号：{{scope.row.product.model}} </div>
                        <div>单位：{{scope.row.product.unit}} </div>
                        <el-button type="text"  @click="selectProduct(scope.$index)">
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>

                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi" v-else >
                        <el-button type="text"  @click="selectProduct(scope.$index)">
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>
                </template>

            </el-table-column>



            <el-table-column prop="productNumber" label="数量"  >
                <template slot-scope="scope">
                    <!--v-if="scope.row.edit"-->
                    <el-input v-model="scope.row.productNumber" placeholder="采购数量"></el-input>
                    <!--<span v-else>{{scope.row.productNumber}}</span>-->
                </template>
            </el-table-column>


            <el-table-column prop="payee_name" label="商品">



                <template slot-scope="scope"  >
                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi" v-if="null!=scope.row.goods" >
                        <div>商品价格：{{scope.row.goods.price}}元 </div>
                        <div>商品备注：{{scope.row.goods.remark}} </div>
                        <div>供应商名称：{{scope.row.goods.merchantUserName}} </div>
                        <div>供应商信息：{{scope.row.goods.merchantNickName}} </div>
                        <div>供应商电话：{{scope.row.goods.merchantPhoneNumber}} </div>
                        <el-button type="text"  @click="selectGoods(scope.$index)">
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>

                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi" v-else >
                        <el-button type="text"  @click="selectGoods(scope.$index)">
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>

                </template>
            </el-table-column>


            <el-table-column prop="payee_name" label="仓储中心">
                <template slot-scope="scope" >
                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi"  v-if="null!=scope.row.warehousing" >
                        <div>名称：{{scope.row.warehousing.username}} </div>
                        <div>信息：{{scope.row.warehousing.nickname}} </div>
                        <div>联系方式：{{scope.row.warehousing.phoneNumber}} </div>

                        <el-button type="text"  @click="selectWarehousing(scope.$index)" >
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>

                    <div style="text-align:left;font-size: 10pt;font-family: cursive, KaiTi" v-else>
                        <el-button type="text"  @click="selectWarehousing(scope.$index)">
                            <i class="el-icon-setting" aria-hidden="true"></i>
                        </el-button>
                    </div>

                </template>
            </el-table-column>


            <el-table-column prop="sort" label="优先级别"  >
                <template slot-scope="scope">
                    <!--v-if="scope.row.edit"-->
                    <el-input v-model="scope.row.sort" placeholder="优先级别"></el-input>
                    <!--<span v-else>{{scope.row.productNumber}}</span>-->
                </template>
            </el-table-column>


            <el-table-column  prop="status" label="状态">
                <template slot-scope="scope" >
                    <el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==1">创建</el-tag>
                    <el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==2">待发货</el-tag>
                    <el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==3">已发货</el-tag>
                    <el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==4">入库</el-tag>
                    <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==5">驳回</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">



                    <el-tooltip class="item" effect="dark" content="提交任务 通知相关人员开始完成任务" placement="top-start">
                        <el-button type="text" size="mini" icon="el-icon-finished" @click="submitTask(scope.row)">提交</el-button>
                    </el-tooltip>


                    <!--<el-button type="text" size="mini" icon="el-icon-date" @click="del(scope.row.id)">详情</el-button>-->

                </template>
            </el-table-column>
        </el-table>

        <el-button type="text" @click="addData">添加数据</el-button>
        <el-divider></el-divider>
        <el-button @click="submitData">提交 </el-button>



        <!-- 选择物资类型 弹出框 -->
        <el-dialog title="选择物资类型" :visible.sync="selectProductDialogVisible" width="60%" @close="selectProductDialogVisible = false">
            <el-row :gutter="6">
                <el-col :span="5">
                    <el-cascader
                            size="small"
                            placeholder="请选择分类查询"
                            :change-on-select="true"
                            v-model="categorykeys"
                            :props="searchSelectProps"
                            :options="cateories"
                            clearable
                    ></el-cascader>
                </el-col>

                <el-col :span="8">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getproductList">查找</el-button>
                </el-col>
            </el-row>



            <span>
                <el-form
                        size="mini"
                        label-width="100px"
                        class="demo-ruleForm" >

                    <el-table :data="productData" border>
                        <el-table-column width="60px" align="center">
                            <!-- label非常重要 -->
                            <template v-slot="props">
                                <el-radio
                                        v-model="selectGoodsId"
                                        :label="props.row.id"
                                        @change="handleProductChange(props.row)"
                                >{{""}}</el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column label="产品名称" prop="name"></el-table-column>
                        <el-table-column label="型号" prop="model"></el-table-column>
                        <el-table-column label="单位" prop="unit"></el-table-column>
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

                    </el-table>


                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectProductDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectProductSubmit()" >确 定</el-button>
            </span>
        </el-dialog>



        <!-- 物资添加弹出框 -->
        <el-dialog title="选择商品" :visible.sync="selectGoodsDialogVisible" width="60%" @close="selectGoodsDialogVisible = false">
            <span>
                <el-form
                        size="mini"
                        label-width="100px"
                        class="demo-ruleForm" >

                    <el-table :data="selectGoodsList" border>
                        <el-table-column width="60px" align="center">
                            <!-- label非常重要 -->
                            <template v-slot="props">
                                <el-radio
                                        v-model="selectGoodsId"
                                        :label="props.row.id"
                                        @change="handleGoodsChange(props.row)"
                                >{{""}}</el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column label="产品名称" prop="name"></el-table-column>
                        <el-table-column label="型号" prop="model"></el-table-column>
                        <el-table-column label="价格(元)" prop="price"></el-table-column>

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
                        <el-table-column label="供应商" >
                            <template slot-scope="scope">
                                <div>名称 {{scope.row.merchantUserName}}</div>
                                <div>电话 {{scope.row.merchantPhoneNumber}}</div>
                            </template>
                        </el-table-column>
                    </el-table>


                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectGoodsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectGoodsSubmit()" >确 定</el-button>
            </span>
        </el-dialog>



        <!-- 仓储 弹出框 -->
        <el-dialog title="选择仓储中心" :visible.sync="selectWarehousingDialogVisible" width="60%" @close="selectWarehousingDialogVisible = false">
            <span>
                <el-form
                        size="mini"
                        label-width="100px"
                        class="demo-ruleForm" >

                    <el-table :data="userWarehousingList" border>
                        <el-table-column width="60px" align="center">
                            <!-- label非常重要 -->
                            <template v-slot="props">
                                <el-radio
                                        v-model="selectGoodsId"
                                        :label="props.row.id"
                                        @change="handleWarehousingChange(props.row)"
                                >{{""}}</el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column label="名称" prop="username"></el-table-column>
                        <el-table-column label="信息" prop="nickname"></el-table-column>
                        <el-table-column label="电话" prop="phoneNumber"></el-table-column>

                    </el-table>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectWarehousingDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectWarehousingSubmit()" >确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                queryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    status: 0,
                }, //查询对象

                projectId : 0,

                selectProductIndex:0,// 操作物资 index
                selectProductDialogVisible: false,
                selectProductData:{},


                selectGoodsIndex:0,// 选择 商品对象
                selectGoodsDialogVisible: false,
                selectSupplierData:{},


                selectWarehousingIndex:0,// 选择 仓储
                selectWarehousingDialogVisible: false,
                selectWarehousingData:{},

                userWarehousingList:[], // 仓储中心

                task: {},

                infoDialogVisible: false,

                // drawer: false,
                direction: 'rtl',

                list : [],
                tableData: [],

                selectSupplierList: [], //选择类别 后 商品列表

                selectGoodsId : 0,
                searchSelectProps: {
                    expandTrigger: "hover",
                    value: "id",
                    label: "name",
                    children: "children",
                    checkStrictly: true
                }, //级联搜索选择器配置项

                cateories: [], //类别选择
                categorykeys: [], //搜索类别
                productData: [], //选择类别 后 查询的类型

            }
        },
        created() {
            this.projectId = this.$route.query.id;

            // this.projectId = this.$route.params.id;

            this.getTaskList();

            this.getCatetorys();
            this.getWarehousingList();

        },
        computed: {
            ...mapGetters([
                'userId'
            ])
        },
        methods: {
            /**
             * 选择物资 dialog
             */
            async selectProduct(index) {
                this.selectProductIndex = index ;
                this.selectProductDialogVisible = true;

                this.selectProductData =  this.tableData[this.selectProductIndex];
            },

            // 选择物资 dialog 选择改变
            handleProductChange(data) {
                this.selectProductData = data;
            },
            // 选择物资 dialog 确定
            selectProductSubmit(){ // 确定选择
                this.selectProductDialogVisible = false;
                this.tableData[this.selectProductIndex].product = this.selectProductData;
            },

            /**
             * 选择商品 dialog
             */
            async selectGoods(index) {
                this.selectGoodsIndex = index ;
                this.selectGoodsDialogVisible = true;

                this.getSelectGoodsList(this.tableData[this.selectGoodsIndex].product.id);
            },

            //  选择物资 dialog 选择改变
            handleGoodsChange(data) {
                this.selectGoodsData = data;
            },

            selectGoodsSubmit(){ // 确定选择
                this.selectGoodsDialogVisible = false;
                this.tableData[this.selectGoodsIndex].goods = this.selectSupplierData;
            },

            /**
             * 选择仓储 dialog
             */
            async selectWarehousing(index) {
                this.selectWarehousingIndex = index ;
                this.selectWarehousingDialogVisible = true;

            },
            //  选择仓储 dialog 选择改变
            handleWarehousingChange(data) {
                this.selectWarehousingData = data;
            },

            selectWarehousingSubmit(){ // 确定选择
                this.selectWarehousingDialogVisible = false;
                this.tableData[this.selectWarehousingIndex].warehousing = this.selectWarehousingData;
            },

            /**
             * 加载用户列表
             */
            async getWarehousingList() {
                const { data: res } = await this.$http.get("system/user/findUserList", {
                    params: {
                        pageNum: 1,
                        pageSize: 999,
                        username: "",
                        sex: "",
                        nickname: "",
                        roleId:148
                    }
                });
                if(!res.success){
                    return this.$message.error("获取用户列表失败:"+res.data.errorMsg);
                }
                // this.total = res.data.total;
                this.userWarehousingList = res.data.rows;
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

            //添加
            addData() {
                this.tableData.push(
                    {
                        edit: true,
                        goodsId:0,
                        product:{
                            id:'',
                            name:'',
                            model:'',
                            unit:'',
                            remark:'',
                            imageUrl:'',
                        },
                        goods:{
                            id:'',
                            price:'',
                            remark:'',
                            merchantUserName:'',
                            remark:'',
                            merchantPhoneNumber:'',
                        },
                        warehousing:{
                            id:'',
                            username:'',
                            nickname:'',
                            phoneNumber:'',
                        }


                    }
                );
            },

            //修改
            showInfoTask(row) {
                this.infoDialogVisible = true;
                this.task = row;
            },

            async submitData() {
                // alert(JSON.stringify(this.tableData))
                console.log(JSON.stringify(this.tableData));
                const {data: res} = await this.$http.put( "task/updateList/" + this.projectId,
                    this.tableData
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
            },



            //修改
            async submitTask(row) {
                row.status = 2;

                console.log(JSON.stringify(row));
                const {data: res} = await this.$http.put( "task/edit/" + row.id,
                    row
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
                }
            },




            /**
             * 加载物资列表
             */
            async getproductList(value) {

                var str = "";
                for (var i = 0; i < this.categorykeys.length; i++) {
                    str += this.categorykeys + ",";
                }
                str = str.substring(0, str.length - 1);
                value.categorys = str;

                const {data: res} = await this.$http.get("business/product/findProductList", {
                    params: {
                        pageNum: 1,
                        pageSize: 999,
                        name: "",
                        categoryId: "",
                        supplier: "",
                        status: 0,
                        categorys:value.categorys
                    }
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    // this.total = res.data.total;
                    this.productData = res.data.rows;
                }
            },


            async getSelectGoodsList(productId) {
                const {data: res} = await this.$http.get("goods/findSelectList", {
                    params: {
                        pageNum: 1,
                        pageSize: 999,
                        productId: productId,
                        status: 0,
                    }
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    // this.total = res.data.total;
                    this.selectGoodsList = res.data.rows;
                }
            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }

        },

    }
</script>
