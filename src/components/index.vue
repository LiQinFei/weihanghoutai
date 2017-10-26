<template>
  <div class="box">
    <div class="header">
      <h1>威航后台管理系统</h1>
    </div>
    <div class="container">

      <div width="200px" class="aside">
        <el-menu :default-active="active" router unique-opened>
          <el-submenu v-for="(item,index) in menu" :index="item.titleList.index" v-if="item.titleList.isShow" :key="index">
            <template slot="title">
              <i :class="item.titleList.icon"></i>
              {{item.titleList.title}}
            </template>
            <el-menu-item v-for="(list,index) in item.itemList" :index="list.path" v-if="list.isShow" :key="index">
              {{list.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roles: [],
        active: "/goodsList",
        menu: [
          {
            titleList: {
              title: "商品管理",
              index: "1",
              is: [99],
              isShow: 0,
              icon: "el-icon-erp-guanli"
            },
            itemList: [
              {name: "商品类别", path: "/goodsSort", is: [99], isShow: 0},
              {name: "商品规格", path: "/goodsStandard", is: [99], isShow: 0},
              {name: "商品品牌", path: "/goodsBrand", is: [99], isShow: 0},
              {name: "商品列表", path: "/goodsList", is: [99], isShow: 0}
            ]
          },
          {
            titleList: {
              title: "订单管理",
              index: "2",
              is: [99, 7, 1, 6, 8],
              isShow: 0,
              icon: "el-icon-erp-weibiaoti3"
            },
            itemList: [
              {
                name: "商品订单",
                path: "/goodsOrder/commonOrder",
                is: [99, 1, 8],
                isShow: 0
              },

              {
                name: "预约服务",
                path: "/reservationOrder",
                is: [99, 1, 8],
                isShow: 0
              },
              {
                name: "服务订单",
                path: "/serverOrder/maintainOrder",
                is: [99, 7],
                isShow: 0
              },
              {name: "售后申请", path: "/afterApplication", is: [99, 7], isShow: 0}
            ]
          },
          {
            titleList: {
              title: "活动管理",
              index: "3",
              is: [8, 99],
              isShow: 0,
              icon: "el-icon-erp-huodongguanli"
            },
            itemList: [{name: "活动列表", path: "/activeList", is: [99], isShow: 0}]
          },
          {
            titleList: {
              title: "广告管理",
              index: "4",
              is: [99, 8],
              isShow: 0,
              icon: "el-icon-erp-guanggao2"
            },
            itemList: [
              {name: "广告位管理", path: "/adPosition", is: [99, 8], isShow: 0},
              {name: "广告列表", path: "/advertList", is: [99, 8], isShow: 0}
            ]
          },
          {
            titleList: {
              title: "资讯管理",
              index: "5",
              is: [99],
              isShow: 0,
              icon: "el-icon-erp-zixunguanli"
            },
            itemList: [{name: "资讯列表", path: "5-1", is: [99], isShow: 0}]
          },
          {
            titleList: {
              title: "会员管理",
              index: "6",
              is: [99],
              isShow: 0,
              icon: "el-icon-erp-huiyuanguanli"
            },
            itemList: [
              {name: "会员列表", path: "/memberList", is: [99], isShow: 0},
              {name: "会员权益", path: "/memberEquity", is: [99], isShow: 0}
            ]
          },
          {
            titleList: {
              title: "营销管理",
              index: "7",
              is: [8, 99],
              isShow: 0,
              icon: "el-icon-erp-yingxiaoguanli"
            },
            itemList: [
              {name: "优惠券管理", path: "/coupon", is: [99], isShow: 0},
              {name: "优惠券兑换", path: "/exchange", is: [99], isShow: 0},
              {name: "积分规则", path: "/integration", is: [99], isShow: 0}
            ]
          },
          {
            titleList: {
              title: "物料管理",
              index: "8",
              is: [99, 6, 8],
              isShow: 0,
              icon: "el-icon-erp-wuliaoguanli"
            },
            itemList: [{name: "物料列表", path: "8-1", is: [99, 6, 8], isShow: 0}]
          },
          {
            titleList: {
              title: "系统设置",
              index: "9",
              is: [99],
              isShow: 0,
              icon: "el-icon-erp-xitongguanli"
            },
            itemList: [
              {name: "菜单设置", path: "9-1", is: [99], isShow: 0},
              {name: "角色管理", path: "9-1", is: [99], isShow: 0},
              {name: "用户管理", path: "9-1", is: [99], isShow: 0},
              {name: "参数设置", path: "9-1", is: [99], isShow: 0},
              {name: "基础数据", path: "9-1", is: [99], isShow: 0},
              {name: "日志管理", path: "9-1", is: [99], isShow: 0}
            ]
          }
        ]
      };
    },
    created() {
      let obj = JSON.parse(sessionStorage.user).roles;
      this.roles = obj.split(",");
      this.titShow();
      this.listShow();
      let path = this.$route.path;
      this.active = path;
    },

    methods: {
      //判断标题是否
      titShow() {
        let allList = this.menu;
        let roles = this.roles;
        for (let i = 0; i < allList.length; i++) {
          for (let x = 0; x < allList[i].titleList.is.length; x++) {
            for (let y = 0; y < roles.length; y++) {
              if (allList[i].titleList.is[x] == roles[y]) {
                allList[i].titleList.isShow = 1;
                continue;
              }
            }
          }
        }
      },
      //判断列表是否循环
      listShow() {
        let allList = this.menu;
        let roles = this.roles;
        for (let i = 0; i < allList.length; i++) {
          for (let x = 0; x < allList[i].itemList.length; x++) {
            for (let y = 0; y < allList[i].itemList[x].is.length; y++) {
              for (let z = 0; z < roles.length; z++) {
                if (allList[i].itemList[x].is[y] == roles[z]) {
                  allList[i].itemList[x].isShow = 1;
                  continue;
                }
              }
            }
          }
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .box {
    width: 100%;
    height: 100%;

    .header {
      background-color: rgba(51, 51, 51, 1);
      color: #333;
      line-height: 60px;
      color: #66ccff;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      h1 {
        margin-left: 20px;
      }
    }
    .container {
      width: 100%;
      height: 100%;
      padding-top: 60px;
      box-sizing: border-box;
      .aside {
        overflow: auto;
        background-color: #eef1f6;
        color: #333;
        width: 230px;

        height: 100%;
        float: left;
      }

      .main {
        box-sizing: border-box;
        background-color: #ffffff;
        color: #333;
        overflow: auto;
        height: 100%;
        padding: 15px;

        .warp {
          height: 100%;
        }
      }
    }
  }
</style>
<style lang="scss">
  .aside {
    .el-submenu .el-menu-item {
      padding-left: 65px !important;
    }
  }
</style>


