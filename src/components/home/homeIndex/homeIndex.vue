<template>
    <div>
        <div class="banner">
        <el-carousel arrow="never" interval="5000" indicator-position="none" height="600px">
            <el-carousel-item v-for="item in 4" :key="item">
            <img src="./raw_1503363571.jpeg" alt="">
            </el-carousel-item>
        </el-carousel>
        </div>
        我是主页
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
        .banner {
            max-width: 1360px;
            min-width: 1024px;
            margin: 0 auto;
        }
</style>
