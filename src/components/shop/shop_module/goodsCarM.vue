<template>
    <div class="car" @click="click">
        购物车sdfs
    </div>
</template>

<script>
export default {
    methods: {
        click() {
            alert(9)
        }
    }, computed: {}
}
</script>

<style lang="scss" scoped>
.car {
    width: 150px;
    height: 50px;
    line-height: 50px;
}
</style>
