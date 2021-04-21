<template>
    <div class="app-container">

        <el-form ref="form" :model="info" label-width="100px">


            <el-form-item label="项目名称">
                <el-input :disabled="true" v-model="info.projectName"></el-input>
            </el-form-item>


            <el-form-item label="项目编号">
                <el-input :disabled="true" v-model="info.projectNum"></el-input>
            </el-form-item>

            <el-form-item label="项目信息">
                <el-input :disabled="true" v-model="info.remark"></el-input>
            </el-form-item>

            <el-form-item label="优先级别">
                <el-input :disabled="true" v-model="info.sort"></el-input>
            </el-form-item>


            <el-form-item label="项目状态">

                <template>
                    <el-steps :space="200" :active="info.status"  align-center finish-status="success">
                        <el-step title="创建"     description="项目管理 创建项目完成" ></el-step>
                        <el-step title="指派分配" description="项目 已经指派 资源管理分配 处理" ></el-step>
                        <el-step title="指派采购" description="项目 已经指派供应商供货" ></el-step>
                        <el-step title="入库完成" description="项目 所有物资已经入库" ></el-step>
                        <el-step title="验收完成" description="项目 验收完成"></el-step>
                    </el-steps>
                </template>


                <!--<el-tag size="mini" effect="plain" v-if="info.status==0">创建</el-tag>-->
                <!--<el-tag size="mini" type="info"    effect="plain" v-if="info.status==1">指派分配</el-tag>-->
                <!--<el-tag size="mini" type="warning" effect="plain"  v-if="info.status==2">指派采购</el-tag>-->

                <!--<el-tag size="mini" type="danger" effect="plain"  v-if="info.status==3">入库完成</el-tag>-->
                <!--<el-tag size="mini" type="success" effect="plain"  v-if="info.status==4">验收完成</el-tag>-->
            </el-form-item>

            <el-collapse v-model="activeNames"  >
                <el-collapse-item title="项目管理  负责人" name="1">
                    <div>姓名: {{info.creatorName}}</div>
                    <div>电话: {{info.creatorPhoneNumber}}</div>
                </el-collapse-item>

                <el-collapse-item title="资源管理  负责人" name="2">
                    <div>姓名: {{info.allocatorName}}</div>
                    <div>电话: {{info.allocatorPhoneNumber}}</div>
                </el-collapse-item>
            </el-collapse>



            <el-form-item label="项目资料">

                <img :src="info.imageUrl"
                     style="height: 200px;width: 200px" />

            </el-form-item>


        </el-form>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {

                projectId : 0,

                info: { },

                inforesdata: '',
                activeNames: ['1'],
                restaurants: []

            }
        },
        created() {

            this.projectId = this.$route.query.id;

            // this.$route.query.id

            this.getInfo();

            // this.getList();

        },
        computed: {
            ...mapGetters([
                'userId'
            ])
        },
        methods: {

            async getInfo() {
                const {data: res} = await this.$http.get("project/info/" + this.projectId);
                if (res.success) {
                    this.info = res.data;
                } else {
                    return this.$message.error("物资信息编辑失败" + res.data.errorMsg);
                }
            },
        },
        mounted() {

        },




    }
</script>
