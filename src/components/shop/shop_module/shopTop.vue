<template>
    <div class="top">

        <el-row class="top-in">
            <el-col :span="12">
                <ul class="left">
                    <li>
                        <i class="iconfont icon-dingwei"></i>西安</li>
                    <li>你好请登录</li>
                </ul>
            </el-col>
            <el-col :span="12">
                <ul class="right">
                    <li>我的订单</li>
                    <li>我的威航</li>
                    <li>客服中心</li>
                    <li>手机威航</li>
                    <li>威航网站</li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<script></script>
export default {

}
</script>

<style lang="scss" scoped>
.top {
    width: 100%;
    height: 30px;
    .top-in {
        max-width: 1200px;
        min-width: 980px;
        margin: 0 auto;
        line-height: 30px;
        .left {
            li {
                display: inline-block;
            }
        }
        .right {
            text-align: right;
            li {
                display: inline-block;
            }
        }
        .icon-dingwei {
            color: #29b6f6;
            width: 20px;
            height: 30px;
        }
    }
}
</style>
