<template>
	<div id="productCategroys">
		<!-- 面包导航 -->
		<el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据分析</el-breadcrumb-item>
			<el-breadcrumb-item>采购计划</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 右侧卡片区域 -->
		<el-card class="box-card">


			<el-row :gutter="8">

				<el-col :span="12">
					<el-select
							v-model="selectProductId"
							placeholder="请选择采购计划"
							style="width:100%"
							@change="selectChange"
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
					<el-button size="small" type="primary" icon="el-icon-s-data" @click="analysis">分析</el-button>
				</el-col>
			</el-row>

			<!-- 表格区域 -->
			<template>

				<el-col :span="24">
					<div class="grid-content bg-purple-dark">
						<el-card class="box-card">
							<!-- 库存饼图 -->
							<div id="bingtu" style="width: 100%;height:350px;"></div>
						</el-card>
					</div>
				</el-col>

			</template>

		</el-card>
	</div>
</template>

<script>
    import echarts from "echarts";

    export default {
        data() {
            return {
                selectProductId: '', // 选择项目id
                selectProject:{},
                echartsData:[],

                cateories: [], //类别选择
                listData: [], // 商品 列表
                projectData: [], // 项目数据

                projectTaskData: {},

                queryMap: {
                    pageNum: 1,
                    pageSize: 999,
                    name: "",
                    categoryId: "",
                    supplier: "",
                    status: 0,
                }, //查询对象

            };
        },
        methods: {

            // 选择区
            selectChange(val) {
                console.log(JSON.stringify(val));
                this.selectProductId = val;

                for (var i = 0; i < this.projectData.length; i++) {
                    if (this.selectProductId == this.projectData[i].id) {
                        this.selectProject = this.projectData[i];
                    }
                }
            },

            /**
             * 项目列表
             */
            async getProjectList() {
                const {data: res} = await this.$http.get("project/findProjectList", {
                    params: this.queryMap
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.projectData = res.data.rows;
                }
            },


            /**
             * 加载物资列表
             */
            async analysis() {

                const {data: res} = await this.$http.get("task/projectAnalysis", {
                    params:  {
                        projectId:  this.selectProductId,

                    }
                });
                if (!res.success) {
                    return this.$message.error("获取物资列表失败");
                } else {
                    this.total = res.data.total;
                    this.projectTaskData = res.data;


                    // var careaList = this.projectTaskData.get("创建");
                    // var careaList = this.projectTaskData.get("已发货");
                    // var careaList = this.projectTaskData.get("驳回");
                    // var careaList = this.projectTaskData.get("入库");
                    // var careaList = this.projectTaskData.get("创建");
                    //
                    // var careaList = this.projectTaskData.get("审核价格");
                    //
                    // echartsData.push({value: careaList.size, name: '创建'},);


                }


                var chartDom = document.getElementById('bingtu');
                var myChart = echarts.init(chartDom);
                var option;

                option = {
                    title: {
                        text:  this.selectProject.projectName,
                        subtext: '采购任务分析',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '50%',
                            data: this.projectTaskData.chartData

	                         //    [
                            //     {value: 1048, name: '搜索引擎'},
                            //     {value: 735, name: '直接访问'},
                            //     {value: 580, name: '邮件营销'},
                            //     {value: 484, name: '联盟广告'},
                            //     {value: 300, name: '视频广告'}
                            // ]
	                        ,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                option && myChart.setOption(option);
            },


        },


        created() {
            this.getProjectList();

        }
    };
</script>


