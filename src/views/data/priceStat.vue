<template>
	<div id="stocks">
		<!-- 面包导航 -->
		<el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据分析</el-breadcrumb-item>
			<el-breadcrumb-item>价格统计</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<el-form ref="form" :model="form" label-width="120px" size="mini">

				<el-form-item label="选择物资类型">
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

					<el-select
							v-model="selectedProductId"
							placeholder="请选择商品"
							size="small">
						<el-option
								v-for="item in editProductData"
								:key="item.id"
								:label="item.model"
								:value="item.id">

							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.model }}</span>
						</el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="选择供应商">

					<el-select
							v-model="selectedSupplierId"
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

				</el-form-item>


				<el-form-item label="查询时间">

					<el-form size="small" :inline="true" :model="queryMap" class="demo-form-inline">
						<el-date-picker
								:clearable="false"
								v-model="range"
								type="daterange"
								:value-format="'yyyy-MM-dd'"
								:picker-options="pickerOptions"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								align="right">
						</el-date-picker>
					</el-form>

				</el-form-item>

				<el-form-item>
					<el-button size="small" type="primary" icon="el-icon-s-data" @click="analysis">分析</el-button>
					<el-button class="el-icon-refresh" @click="resetForm">重置</el-button>
				</el-form-item>

				<el-form-item>
					<div style="font-size: 15px;color: red;font-weight: bold">最高价格：{{this.priceData.maxPrice}} 元，
						最低价格：{{this.priceData.minPrice}} 元
					</div>
				</el-form-item>

			</el-form>


			<div id="tianxing" style="width: 100%;height:350px;"></div>


			<el-table :data="projectTaskData" border stripe style="width: 100%; margin-top: 20px">

				<el-table-column prop="index" type="index" label="编号" width="50"></el-table-column>

				<el-table-column prop="payee_name" label="物资型号" width="150px">
					<template slot-scope="scope">
						<div style="text-align:left;font-size: 10pt; display: flex; justify-content: space-around;"
						     v-if="null!=scope.row.product">

							<div v-if="''!=scope.row.product.id">
								<div>名称：{{scope.row.product.name}}</div>
								<div>型号：{{scope.row.product.model}}</div>
								<div>单位：{{scope.row.product.unit}}</div>
								<div>建议价格：{{scope.row.product.proposedPrice}}元</div>
							</div>
						</div>


					</template>

				</el-table-column>


				<el-table-column prop="productNumber" label="数量" width="100px">
					<template slot-scope="scope">

						<span>{{scope.row.productNumber}}</span>
					</template>
				</el-table-column>


				<el-table-column prop="payee_name" label="供应商" width="200px">

					<template slot-scope="scope">

						<div style="text-align:left;font-size: 10pt; display: flex; justify-content: space-around;"
						     v-if="null!=scope.row.supplier">

							<div v-if="''!=scope.row.supplier.id">
								<div>供应商名称：{{scope.row.supplier.username}}</div>
								<div>公司/职位：{{scope.row.supplier.nickname}}</div>
								<div>供应商电话：{{scope.row.supplier.phoneNumber}}</div>

								<div>区域
									{{scope.row.supplier.province}}/{{scope.row.supplier.city}}/{{scope.row.supplier.origin}}
								</div>
								<div>地址 {{scope.row.supplier.address}}</div>
							</div>

						</div>

					</template>
				</el-table-column>


				<el-table-column prop="payee_name" label="仓储中心" width="200px">
					<template slot-scope="scope">

						<div style="text-align:left;font-size: 10pt; display: flex; justify-content: space-around;"
						     v-if="null!=scope.row.warehousing">

							<div v-if="''!=scope.row.warehousing.id">
								<div>名称：{{scope.row.warehousing.username}}</div>
								<div>信息：{{scope.row.warehousing.nickname}}</div>
								<div>联系方式：{{scope.row.warehousing.phoneNumber}}</div>

								<div>区域
									{{scope.row.warehousing.province}}/{{scope.row.warehousing.city}}/{{scope.row.warehousing.origin}}
								</div>
								<div>地址 {{scope.row.warehousing.address}}</div>
							</div>

						</div>


					</template>
				</el-table-column>


				<el-table-column prop="sort" label="优先级别" width="60px">
					<template slot-scope="scope">
						<span>{{scope.row.sort}}</span>
					</template>
				</el-table-column>

				<el-table-column prop="sort" label="发货数量" width="100px">
					<template slot-scope="scope">
						<span>{{scope.row.deliveryNumber}}</span>
					</template>
				</el-table-column>


				<el-table-column prop="sort" label="发货价格" width="80px">
					<template slot-scope="scope">
						<span>{{scope.row.deliveryPrice}}</span>
					</template>
				</el-table-column>

				<el-table-column prop="sort" label="入库数量" width="100px">
					<template slot-scope="scope">
						<span>{{scope.row.warehousingNumber}}</span>
					</template>
				</el-table-column>


				<el-table-column prop="sort" label="审核价格" width="80px">
					<template slot-scope="scope">
						<span>{{scope.row.reviewPrice}}</span>
					</template>
				</el-table-column>


				<el-table-column prop="status" label="状态">
					<template slot-scope="scope">
						<el-tag size="mini" type="warning" effect="plain" v-if="scope.row.status==1">创建</el-tag>
						<el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==2">待发货</el-tag>
						<el-tag size="mini" type="primary" effect="plain" v-if="scope.row.status==3">已发货</el-tag>
						<el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==4">入库</el-tag>
						<el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==5">驳回</el-tag>
						<el-tag size="mini" type="success" effect="plain" v-if="scope.row.status==6">价格确认</el-tag>
					</template>
				</el-table-column>

			</el-table>


		</el-card>


	</div>
</template>

<script>
    import echarts from "echarts";

    export default {
        data() {
            return {
                selectedProductId: '',
                selectedSupplierId: '',
                categorykeys: [], //搜索类别
                range: [],

                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                editRuleForm: {}, //修改表单数据
                addProductData: [], //表格数据

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

                addQueryMap: {
                    pageNum: 1,
                    pageSize: 10,
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: 0,
                }, //查询对象

                editProductData: [],    //表格数据
                supplierList: [],        // 供应商列表
                loading: true,

                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近两个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近半年',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一年',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },

                range: [],
                tableData: [],
                queryMap: {
                    productId: 73,
					supplierId: 216,
                    startDate: '',
                    endDate: '',
                },
                xData: [],
                productPriceData: {
                    minPriceData: [],
                    maxPriceData: []
                },
                productNumData: {
                    applyNums: [],
                    deliveryNums: [],
                    warehousingNums: [],
                },
                priceData: [],

                projectTaskData: []
            };
        },
        methods: {

            /**
             * 加载物资列表
             */
            async analysis() {

                if (this.range != null && this.range.length === 1) {
                    this.queryMap.startDate = this.range[0];
                } else if (this.range != null && this.range.length === 2) {
                    this.queryMap.startDate = this.range[0];
                    this.queryMap.endDate = this.range[1];
                }

                const {data: res} = await this.$http.get("task/priceAnalysis", {
                    params: {
                        productId: this.selectedProductId,
                        supplierId: this.selectedSupplierId,
                        startDate: this.queryMap.startDate,
                        endDate: this.queryMap.endDate,
                    }
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.priceData = res.data;
                    this.projectTaskData = res.data.list;
                }

                var chartDom = document.getElementById('tianxing');
                var myChart = echarts.init(chartDom);


                var option;
                var xdata = [];
                var reviewPriceLineData = [];
                var orderNumberData = [];

                var warehousingNumberData = [];

                var maxPrice = 100;
                var maxProductNumber = 1000;


                if(null != this.projectTaskData){

                    for (var i = 0; i < this.projectTaskData.length; i++) {

                        xdata.push(this.projectTaskData[i].createTime);

                        reviewPriceLineData.push(this.projectTaskData[i].reviewPrice);

                        orderNumberData.push(this.projectTaskData[i].productNumber);
                        warehousingNumberData.push(this.projectTaskData[i].warehousingNumber);

                        maxPrice  = this.priceData.maxPrice;
                        maxProductNumber  = this.priceData.maxProductNumber;

                    }

				}

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data: ['订单数量', '入库数量', '审核价格']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xdata,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '数量',
                            min: 0,
                            max: maxProductNumber,

                            axisLabel: {
                                formatter: '{value} '
                            }
                        },
                        {
                            type: 'value',
                            name: '审核价格',
                            min: 0,
                            max: maxPrice,

                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '订单数量',
                            type: 'bar',
                            data: orderNumberData,
                        },
                        {
                            name: '入库数量',
                            type: 'bar',
                            data: warehousingNumberData,

                        },
                        {
                            name: '审核价格',
                            type: 'line',
                            yAxisIndex: 1,
                            data: reviewPriceLineData
                        }
                    ]
                };

                option && myChart.setOption(option);


            },
            //重置查询表单
            resetForm() {
                this.selectedProductId = '';
                this.selectedSupplierId = '';
                this.categorykeys = []; //搜索类别
                this.range = [];
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


            /**
             * 加载物资列表
             */
            async getProductList() {
                const {data: res} = await this.$http.get("business/product/findProductList", {
                    params: this.addQueryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.editProductData = res.data.rows;
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

            /**
             * 分类搜索改变时
             */
            selectChange() {
                var str = "";
                for (var i = 0; i < this.categorykeys.length; i++) {
                    str += this.categorykeys[i] + ",";
                }
                str = str.substring(0, str.length - 1);
                this.addQueryMap.categorys = str;

                this.getProductList();


            },

            search() {
                this.getStatGoodsData();
            },
            /**
             * 加载库存信息
             */
            async getStatGoodsData() {
                if (this.range != null && this.range.length === 1) {
                    this.queryMap.startDate = this.range[0];
                } else if (this.range != null && this.range.length === 2) {
                    this.queryMap.startDate = this.range[0];
                    this.queryMap.endDate = this.range[1];
                }

                const {data: res} = await this.$http.get("data/stat/goods", {
                    params: this.queryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资统计数据失败:" + res.data.errorMsg);
                } else {
                    this.tableData = res.data;
                    this.xData = [];
                    this.yData = [];
                    const $this = this;
                    //构建表格条形统计图的数据
                    this.tableData.forEach(function (e) {
                        console.log(e)
                        $this.xData.push(e.dateStr);
                        $this.productPriceData.minPriceData.push(e.minReviewPrice);
                        $this.productPriceData.maxPriceData.push(e.maxReviewPrice);

                        $this.productNumData.applyNums.push(e.productNum);
                        $this.productNumData.deliveryNums.push(e.deliveryNum);
                        $this.productNumData.warehousingNums.push(e.warehousingNum);
                    });
                    //重新绘制表
                    this.drawPriceLine();
                    this.drawNumberBar();
                }
            },

            /**
             * 绘制月份审核最低价格统计图
             */
            drawPriceLine() {
                var myChart = echarts.init(document.getElementById("tianxing"));
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: "物资审核价格走势"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {} // 导出图片
                        }
                    },
                    tooltip: {},
                    legend: {
                        data: ["最高价", "最低价"]
                    },
                    xAxis: {
                        data: this.xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: "最高价",
                            type: "line",
                            showBackground: true,
                            data: this.productPriceData.maxPriceData
                        }, {
                            name: "最低价",
                            type: "line",
                            showBackground: true,
                            data: this.productPriceData.minPriceData
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },

            /**
             * 绘制柱状图
             */
            drawNumberBar() {
                var myChart = echarts.init(document.getElementById("bingtu"));
                var option = {
                    title: {
                        text: "产品数量统计",
                        left: "left"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {} // 导出图片
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    legend: {
                        data: ['下发数量', '发货数量', '入库数量']
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: "下发数量",
                            type: "bar",
                            data: this.productNumData.applyNums
                        }, {
                            name: "发货数量",
                            type: "bar",
                            data: this.productNumData.deliveryNums
                        }, {
                            name: "入库数量",
                            type: "bar",
                            data: this.productNumData.warehousingNums
                        }
                    ]
                };
                myChart.setOption(option);
            },
        },
        created() {

            // this.userInfo = this.$store.state.userInfo;
            // const roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;


            this.getSupplier();
            this.getCatetorys();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>
