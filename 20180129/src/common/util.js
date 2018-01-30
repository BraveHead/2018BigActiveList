import Vue from 'vue'

//添加Vue的全局判断返回上一页是否有路由的函数
export function getGoIndex() {
    if(window.history.length <= 1){
        if(location.href.indexOf('?') === -1){
            window.location.href = location.href + '?goIndex=true'
        }else if(location.href.indexOf('?') !== -1 && location.href.indexOf('goIndex') === -1){
            window.location.href = location.href + '&goIndex=true'
        }
    }
}

