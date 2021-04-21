import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import( '../views/login.vue'), //登入页面
    },

    {
        path: '/home',
        component: () => import( '../views/home.vue'), //后台主体框架
        redirect: '/user/me',
        children: [
            {
                path: '/system/welcome',
                name: 'Welcome',
                component: () => import( '../views/welcome.vue'), //系统欢迎页
            }, {
                path: '/system/users',
                name: 'Users',
                component: () => import( '../views/system/user.vue'), //用户管理
            }, {
                path: '/system/roles',
                name: 'Roles',
                component: () => import( '../views/system/role.vue'), //角色管理
            }
            , {
                path: '/system/menus',
                name: 'Menus',
                component: () => import( '../views/system/menu.vue'), //菜单管理
            }
            , {
                path: '/system/departments',
                name: 'Departments',
                component: () => import( '../views/system/dept.vue'), // 部门管理
            },
            {
                path: '/system/files',
                name: 'Files',
                component: () => import('../views/system/file'),   //文件管理
            },
            {
                path: '/system/icon',
                name: 'Icons',
                component: () => import('../views/system/icon'),  //系统图标
            }



            /**********************************用户模块的路由******************************/
            , {
                path: '/user/me',
                name: 'Me',
                component: () => import( '../views/user/me.vue'), //我的
            }

            , {
                path: '/user/merchantInfo',
                name: 'MerchantInfo',
                component: () => import( '../views/user/merchant-info.vue'), //商户信息
            }


            /**********************************供应商 模块的路由******************************/
            , {
                path: '/supplier/review',
                name: 'supplierReview',
                component: () => import( '../views/supplier/supplier-review.vue'), //我的
            }

            , {
                path: '/supplier/list',
                name: 'supplierList',
                component: () => import( '../views/supplier/supplier-list.vue'), //商户信息
            }


            /**********************************商品管理模块的路由******************************/

            , {
                path: '/business/product/categories',
                name: 'ProductCategories',
                component: () => import( '../views/business/product/category'), //物资分类
            },


            , {
                path: '/business/product/list',
                name: 'ProductList',
                component: () => import( '../views/business/product/list.vue'), //物资列表
            }

            , {
                path: '/goods/myGoods',
                name: 'myGoods',
                component: () => import( '../views/goods/my-goods.vue'), //我的商品
            }
            , {
                path: '/goods/goodsReview',
                name: 'goodsReview',
                component: () => import( '../views/goods/goods-review.vue'), // 商品审核
            }

            /**********************************业务模块的路由******************************/

            , {
                path: '/business/product/in-stocks',
                name: 'ProductInStocks',
                component: () => import( '../views/business/product/in-stock'), //物资入库记录
            },
            {
                path: '/business/product/out-stocks',
                name: 'ProductOutStocks',
                component: () => import( '../views/business/product/out-stock'), //物资发放记录
            },

            {
                path: '/business/product/stocks',
                name: 'ProductStocks',
                component: () => import( '../views/business/product/stock'),  //库存明细
            }
            , {
                path: '/business/product/suppliers',
                name: 'ProductSuppliers',
                component: () => import( '../views/business/product/supplier'), //物资供应方
            },
            {
                path: '/business/product/consumers',
                name: 'ProductConsumers',
                component: () => import( '../views/business/product/consumer'), //物资消费方
            }
            , {
                path: '/business/product/add-stocks',
                name: 'ProductAddStocks',
                component: () => import( '../views/business/product/add-stock'), //物资入库
            },
            {
                path: '/business/product/publish',
                name: 'ProductPublish',
                component: () => import( '../views/business/product/publish'),   //物资发放
            },




            /**********************************项目模块的路由******************************/
            , {
                path: '/project/list',
                name: 'ProjectList',
                component: () => import( '../views/project/list.vue'), //项目列表
            },

            , {
                path: '/project/myproject',
                name: 'MyProject',
                component: () => import( '../views/project/my-project.vue'), //我的项目
            },



            , {
                path: '/project/details',
                name: 'details',
                component: () => import( '../views/project/details.vue'), //项目详情
            },

            , {
                path: '/project/warehousing-task',
                name: 'WarehousingTask',
                component: () => import( '../views/project/warehousing-task.vue'), //仓储任务
            },

            , {
                path: '/project/supplier-task',
                name: 'SupplierTask',
                component: () => import( '../views/project/supplier-task.vue'), // 供应商任务
            },


            /**********************************数据分析模块的路由******************************/


            , {
                path: '/data/baseStat',
                name: 'baseStat',
                component: () => import( '../views/data/baseStat.vue'), //项目详情
            },

            , {
                path: '/data/projectStat',
                name: 'projectStat',
                component: () => import( '../views/data/projectStat.vue'), //项目统计
            },

            , {
                path: '/data/priceStat',
                name: 'priceStat',
                component: () => import( '../views/data/priceStat.vue'), //项目统计
            },

            /**********************************资金管理模块的路由******************************/


            , {
                path: '/funds/settlement',
                name: 'settlement',
                component: () => import( '../views/funds/settlement.vue'), // 物资结算
            },


            /**********************************物资管理模块的路由******************************/



            {
                path: '/warehouse/allWarehouseSupplies',
                name: 'allWarehouseSupplies',
                component: () => import( '../views/warehouse/AllWarehouseSupplies.vue'), // 全部物资
            }
            , {
                path: '/warehouse/warehouseSupplies',
                name: 'warehouseSupplies',
                component: () => import( '../views/warehouse/WarehouseSupplies.vue'), // 仓库物资
            },



            , {
                path: '/warehouse/AllWarehouseSuppliesInRecord',
                name: 'allWarehouseSuppliesInRecord',
                component: () => import( '../views/warehouse/AllWarehouseSuppliesInRecord.vue'), // 全部 入库记录
            },


            , {
                path: '/warehouse/WarehouseSuppliesInRecord',
                name: 'warehouseSuppliesInRecord',
                component: () => import( '../views/warehouse/WarehouseSuppliesInRecord.vue'), // 入库记录
            },



            , {
                path: '/warehouse/WarehouseSuppliesOutRecord',
                name: 'warehouseSuppliesOutRecord',
                component: () => import( '../views/warehouse/WarehouseSuppliesOutRecord.vue'), // 出库记录
            },

            , {
                path: '/warehouse/AllWarehouseSuppliesOutRecord',
                name: 'allWarehouseSuppliesOutRecord',
                component: () => import( '../views/warehouse/AllWarehouseSuppliesOutRecord.vue'), // 全部入库记录
            },






            /**********************************监控模块的路由******************************/
            {
                path: '/monitor/logs',
                name: 'Logs',
                component: () => import( '../views/monitor/log'),     //操作日志
            },
            {
                path: '/monitor/login-log',
                name: 'LoginLogs',
                component: () => import( '../views/monitor/login-log'), //登入日志
            },
            {
                path: '/monitor/swagger-ui',
                name: 'SwaggerUI',
                component: () => import( '../views/monitor/swagger-ui'), //接口文档
            },
            {
                path: '/monitor/druid',
                name: 'Druid',
                component: () => import( '../views/monitor/druid'), //mysql监控
            },
            /**********************************疫情模块的路由******************************/
            // {
            //     path: '/covid19/map',
            //     name: 'Covid19Map',
            //     component: () => import( '../views/business/covid19/map'), //疫情地图
            // },
            // {
            //     path: '/covid19/health',
            //     name: 'Health',
            //     component: () => import( '../views/business/covid19/health'), //健康打卡
            // },

            {
                path: "/error/401",
                component: () => import( '../views/error/401'),
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

import store from '../store'//引入store

//白名单页面
const whiteList=[
    '/business/product/add-stocks',
    '/business/product/publish'
];

//路由导航守卫
router.beforeEach((to, from, next) => {

    const token = LocalStorage.get(LOCAL_KEY_XINGUAN_ACCESS_TOKEN);
    if (to.path === '/login') {
        if (!token) {
            return next();
        } else {
            return next({path: '/home'})
        }
    }

    if (to.path === '/error/401') {
        return next();
    }

    if (!token) {
        return next('/login');
    } else {
        //判断是否有访问该路径的权限
        const urls = store.state.userInfo.url;
        //如果是管理员
        if (store.state.userInfo.isAdmin) {
            return next();
        } else {
            if (urls.indexOf(to.path) > -1|| whiteList.indexOf(to.path)>-1) {
                //则包含该元素
                window.sessionStorage.setItem("activePath", to.path);
                return next();
            } else {
                return next("/error/401");
            }
        }
    }
})

export default router
