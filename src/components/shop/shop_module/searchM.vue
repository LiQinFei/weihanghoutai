<template>
    <div class="search">
        <input type="text">
        <div class="button">
            搜索
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.search {
    width: 500px;
    height: 40px;
    position: relative;

    margin: 15px auto 0;
    input {
        width: 450px;
        height: 40px;
    }
    .button {
        width: 46px;
        height: 44px;
        line-height: 40px;
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
