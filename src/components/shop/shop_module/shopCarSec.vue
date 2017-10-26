<template>
    <div class="box">
        <div class="mid">
            <searchM></searchM>
        </div>
        <div class="left"></div>
        <div class="right">
            <shioCarM></shioCarM>
        </div>
    </div>
</template>

<script>
import shioCarM from './goodsCarM.vue'
import searchM from './searchM.vue'
export default {
    components: {
        shioCarM,
        searchM
    }
}
</script>

<style lang="scss" scoped>
.box {
    max-width: 1200px;
    min-width: 980px;
    height: 80px;
    margin: 0 auto;
    div {
        height: 80px;
    }
    .left {
        width: 300px;
        background: red;
        float: left;
        margin-left: -100%;
    }
    .mid {
        width: 100%;
        float: left;
        background: darkblue; // float: left;
    }
    .right {
        width: 300px;
        background: darkcyan;
        float: right;
        margin-left: -300px;
    }
}
</style>
