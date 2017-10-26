<template>
  <div class="index">

    <div class="top">
      <el-row class="top-in">
        <el-col :sm="7" :lg="8">
          <div class="grid-content bg-purple">
            <h1>陕西威航汽车维修服务有限公司</h1>
          </div>
        </el-col>
        <el-col :sm="17" :lg="16">
          <div class="grid-content bg-purple-light">
            <ul>
              <li>
                <router-link :to="{name:'homeIndex'}"> 威航首页</router-link>
              </li>
              <li>
                <router-link :to="{name:'shop'}"> 威航商城</router-link>
              </li>
              <li>
                汽车保险
              </li>
              <li>
                咨询&服务
              </li>
              <li>
                <router-link :to="{name:'about'}"> 关于我们</router-link>

              </li>
              <li>
                最新动态
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="child">

      <router-view></router-view>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }, methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.index {
  width: 100%;
  .top {
    width: 100%;
    height: 80px;
    .top-in {
      max-width: 1360px;
      min-width: 1024px;
      margin: 0 auto;
      .grid-content {
        height: 80px;
        h1 {
          font-size: 18px;
          text-align: left;
          line-height: 80px;
          margin-left: 30px;
          color: #29b6f6;
        }
        ul {
          text-align: right;
          li {
            display: inline-block;
            height: 80px;
            line-height: 80px;
            margin-right: 30px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
          }
        }
      }
    }
  }
  .child {

    max-width: 1360px;
    min-width: 1024px;
    margin: 0 auto;
  }
  .router-link-active {
    color: #29b6f6;
  }
}
</style>
