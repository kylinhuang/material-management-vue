<template>
  <div id="stocks">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据分析</el-breadcrumb-item>
      <el-breadcrumb-item>物资统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="queryMap"  size="mini">
            <el-form-item >
                <el-select required
                        v-model="queryMap.supplierId"
                        placeholder="选择供应商"
                        size="small"
                        style="width: 100%;">
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
            <el-form-item >
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
                        v-model="queryMap.productId"
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
          <el-form-item>
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
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row ></el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-card class="box-card">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="tianxing" style="width: 500px;height:350px;"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-card class="box-card">
            <!-- 库存饼图 -->
            <div id="bingtu" style="width: 500px;height:350px;"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import echarts from "echarts";

    export default {
        data() {
            return {
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
                selectedProductId: '',
                selectedSupplierId: '',
                editProductData: [],
                supplierList: [],
                categorykeys: [], //搜索类别
                cateories: [],
                range: [],

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

                tableData: [],
                queryMap: {productId: '', supplierId: ''},
                xData: [],
                productPriceData: {
                    minPriceData: [],
                    maxPriceData: []
                },
                productNumData: {
                    applyNums: [],
                    deliveryNums: [],
                    warehousingNums: [],
                }
            };
        },
        created() {
            this.getSupplier();
            this.getCatetorys();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        methods: {
            search() {
                this.getStatGoodsData();
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
                        text: "物资数量统计",
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
    };
</script>
