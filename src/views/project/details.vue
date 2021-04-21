<template>
    <div id="productCategroys">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购计划</el-breadcrumb-item>
            <el-breadcrumb-item>任务详情</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card class="box-card">


            <div class="app-container">

                <el-tabs v-model="activeTab" value="detailsBasic" >
                    <el-tab-pane label="基本信息" name="detailsBasic" lazy> <detailsBasic/> </el-tab-pane>
                    <el-tab-pane label="采购任务" name="task" lazy> <task/> </el-tab-pane>
                    <!--<el-tab-pane label="批量转账" name="batchDesc" lazy> <batchDesc/> </el-tab-pane>-->
                </el-tabs>
            </div>



        </el-card>
    </div>
</template>

<script>

    import detailsBasic from './detailsBasic.vue'
    import task from './task.vue'
    // import multipleDesc from './transferMultipleDesc'


    export default {
        components: {detailsBasic,task},
        data() {
            return {
                activeTab: 'detailsBasic'
            };
        }

    }


</script>


