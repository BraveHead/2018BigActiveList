import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuex from 'vuex';

//开启debug
Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuex);

//定义组件
import home from './component/home/home'
import redList from './component/red/redList'
import redItem from './component/red/redItem'
import register from './component/register/register'
import setPhone from './component/register/setPhone'
//创建路由   配置
var baseRouter = '/xchd';
// var baseRouter = '';
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: baseRouter + '/',
            name:'index',
            component: home
        },
        {
            path:baseRouter + '/red/redList',
            name:'redList',
            component:redList
        },
        {
            path:baseRouter + '/red/redList/redItem',
            name:'redItem',
            component: redItem
        },
        {
            path: baseRouter + '/user/setPhone/register',
            name: 'register',
            component: register
        },
        {
            path: baseRouter + '/user/setPhone',
            name: 'setPhone',
            component: setPhone
        }
    ]
});


/*import {getGoIndex} from "./common/util";
//添加Vue的全局判断返回上一页是否有路由的函数
Vue.prototype.$getGoIndex = getGoIndex;*/

const app = new Vue({
    router: router,
    render: (h) => h(App)
}).$mount('#app');
