<template>
    <div id="redList">
        <p class="red-list-title">红包领取列表</p>
        <span @click="backFun">返回上一页</span>
        <ul>
            <li v-for="item in redListData">
                <span>{{item.title}}</span>
                <router-link :to="{name:'redItem'}" class="to-get-detail">差一人助力</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "redList",
        data() {
            return {
                redListData: [
                    {'title':'5元现金'},
                    {'title':'5元现金'},
                    {'title':'5元现金'},
                    {'title':'5元现金'},
                    {'title':'5元现金'},
                ]
            }
        },
        methods: {
            backFun() {
                this.$store.commit('backFun');
            }
        }
    }
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
    #redList{
        width: 100%;
        height: auto;
    }
    .red-list-title{
        font-size: 0.50rem;
    }
    ul{
        display:flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        font-size: 0.30rem;
        li{
            width: 100%;
            height: 0.80rem;
            span{
                float: left;
            }
            .to-get-detail{
                float: right;
                border: 0.01rem solid red;
            }
        }
    }
</style>