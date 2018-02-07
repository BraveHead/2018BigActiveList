import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        token: ''
    },
    mutations: {
        getGoIndex: ()=> {
            if(window.history.length <= 1){
                if(location.href.indexOf('?') === -1){
                    window.location.href = location.href + '?goIndex=true'
                }else if(location.href.indexOf('?') !== -1 && location.href.indexOf('goIndex') === -1){
                    window.location.href = location.href + '&goIndex=true'
                }
            }
        },
        backFun() {
            /*console.log(Vue.$route);
            if(Vue.$route.query.goIndex === 'true'){
                Vue.$router.push('/')
            }else{
                Vue.$router.back(-1)
            }*/
            window.history.go(-1);
        }
    },
    getters: {

    },
    actions: {

    }
})

export default store