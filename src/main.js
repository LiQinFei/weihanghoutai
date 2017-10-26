// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import axios from 'axios'

import "babel-polyfill"



//判断是否登录
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user')
    }
    let user = sessionStorage.getItem('user')
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

//axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})