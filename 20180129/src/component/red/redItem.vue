<template>
    <div id="redItem">
        <p class="red-item-title">恭喜您成功领取现金</p>
        <span class="to-yq-friends">邀请好友拆红包</span>
        <span @click="backFun">返回上一页</span>
    </div>
</template>

<script>
    export default {
        name: "redItem",
        data() {
            return {

            }
        },
        methods: {
            backFun() {
                this.$store.commit('backFun');
            }
        }
    }
</script>

<style scoped>
    #redItem{
        width: 100%;
        height: auto;
    }
    .red-item-title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 2.00rem;
        font-size: 0.50rem;
    }
    .to-yq-friends{
        width: 3.00rem;
        height: 1.00rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        font-size: 0.30rem;
        background-color: red;
        color: #ffffff;
    }
</style>