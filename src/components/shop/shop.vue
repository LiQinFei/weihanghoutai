<template>
    <div>
        <shopTop></shopTop>
        <ul class="box-warp" ref="mybox">
            <li v-for="(item,index) in datas" @mouseover="hover(index,$event)" @mouseout="out" v-bind:class="{ active: bin === index }">
                <div v-for="item1 in item.title">
                    {{item1}}
                </div>
                <div class="box-in" v-bind:class="{ boxactive: bin === index }" v-bind:style="{top:tops+'px'}">
                    <div v-for="item2 in item.list">
                        {{item2}}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import shopTop from "./shop_module/shopTop.vue"
export default {
    data() {
        return {
            bin: '',
            tops: 0,
            datas: [
                { title: ['小米'], list: ["node3", "node1", "node2"] },
                { title: ['华为'], list: ["华为1", "华为2", "华为3"] },
                { title: ['一家'], list: ["一家1", "一家2", "一家3"] }
            ]
        }
    },
    methods: {
        hover: function(index, event) {
            this.bin = index
            var heigt = this.$refs.mybox.offsetTop
            this.tops = heigt - (event.currentTarget.offsetTop)
            console.log(heigt)

        },
        out() {
            this.bin = ''
        }
    }, components: {
        shopTop
    }
}
</script>

<style scoped lang="scss">
ul {
    li {
        width: 300px;
        height: 50px;
        border: 1px solid darkblue;


        position: relative;
        .box-in {
            width: 100px;
            height: 500px;
            background: darkcyan;
            position: absolute;
            left: 300px; // top: 0;
            display: none;
        }
        .boxactive {
            display: block;
        }
    }
}

.active {
    background: pink;
}
</style>
