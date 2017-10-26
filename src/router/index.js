import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
//登录
import login from '@/components/login/login'

//商品管理
import goodsList from '@/components/goods/goodsList'
import goodsBrand from '@/components/goods/goodsBrand'
import goodsStandard from '@/components/goods/goodsStandard'
import goodsSort from '@/components/goods/goodsSort'

//订单管理
import goodsOrder from '@/components/order/goodsOrder'
import commonOrder from '@/components/order/goodsChild/commonOrder'
import presaleOrder from '@/components/order/goodsChild/presaleOrder'
import reservationOrder from '@/components/order/reservationOrder'
import afterApplication from '@/components/order/afterApplication'
import serverOrder from '@/components/order/serverOrder'
import maintainOrder from '@/components/order/wmChild/maintainOrder'
import washOrder from '@/components/order/wmChild/washOrder'

//广告管理
import adPosition from '@/components/advert/adPosition'
import advertList from '@/components/advert/advertList'

//活动管理
import activeList from '@/components/active/activeList'

//营销管理
import coupon from '@/components/salesManagement/coupon'
import exchange from '@/components/salesManagement/exchange'
import integration from '@/components/salesManagement/integration'

//会员
import memberEquity from '@/components/member/memberEquity'
import memberList from '@/components/member/memberList'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Index',
        component: Index,
        children: [{
                path: 'goodsList',
                name: 'goodsList',
                component: goodsList //商品列表
            }, {
                path: 'goodsBrand',
                name: 'goodsBrand',
                component: goodsBrand //商品品牌
            }, {
                path: 'goodsStandard',
                name: 'goodsStandard',
                component: goodsStandard //商品规格
            }, {
                path: 'goodsSort',
                name: 'goodsSort',
                component: goodsSort //商品类别
            },
            {
                path: 'goodsOrder',
                name: 'goodsOrder',
                component: goodsOrder, //商品订单
                children: [{
                    path: 'commonOrder',
                    name: 'commonOrder',
                    component: commonOrder //普通订单
                }, {
                    path: 'presaleOrder',
                    name: 'presaleOrder',
                    component: presaleOrder //预购订单
                }]
            },
            {
                path: 'reservationOrder',
                name: 'reservationOrder',
                component: reservationOrder, //预约服务
            },
            {
                path: 'afterApplication',
                name: 'afterApplication',
                component: afterApplication, //售后申请

            },
            {
                path: 'serverOrder',
                name: 'serverOrder',
                component: serverOrder, //服务订单
                children: [{
                    path: 'maintainOrder',
                    name: 'maintainOrder',
                    component: maintainOrder //维修管理
                }, {
                    path: 'washOrder',
                    name: 'washOrder',
                    component: washOrder //洗车管理
                }]
            }, {
                path: 'adPosition',
                name: 'adPosition',
                component: adPosition //广告位管理
            }, {
                path: 'advertList',
                name: 'advertList',
                component: advertList //广告列表
            }, {
                path: 'activeList',
                name: 'activeList',
                component: activeList //活动列表
            },
            {
                path: 'coupon',
                name: 'coupon',
                component: coupon //优惠卷管理
            },
            {
                path: 'exchange',
                name: 'exchange',
                component: exchange //优惠卷兑换
            }, {
                path: 'integration',
                name: 'integration',
                component: integration //积分规则
            },
            {
                path: 'memberEquity',
                name: 'memberEquity',
                component: memberEquity //会员权益
            }, {
                path: 'memberList',
                name: 'memberList',
                component: memberList //会员列表
            }



        ]
    }, {
        path: '/login',
        name: 'login',
        component: login
    }]
})