<template>
  <div class="goodsOrder">
    <div class="tops">

      <el-breadcrumb separator="/" style="margin-bottom:10px">
        <el-breadcrumb-item :to="{ path: '/serverOrder' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品订单</el-breadcrumb-item>
      </el-breadcrumb>

      <el-tabs active-name="first" type="card" @tab-click="handleClick" :value="value">
        <el-tab-pane label="普通订单" name="first"></el-tab-pane>
        <el-tab-pane label="预购订单" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tabs">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "first"
    };
  },
  created() {
    if (this.$route.path == "/goodsOrder/commonOrder") {
      this.value = "first";
    } else {
      this.value = "second";
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) {
        this.$router.push({ name: "commonOrder" });
      } else {
        this.$router.push({ name: "presaleOrder" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.goodsOrder {
  width: 100%;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;
  position: relative;
  .tops {
    width: 100%;
    position: absolute;
    top: 0;
  }
  .tabs {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.goodsOrder .el-tabs__content {
  display: none;
}
</style>



