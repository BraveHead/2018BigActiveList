<template>
    <div>
        <div class="banner">
            <h2>banner</h2>
        </div>
        <div id="home">
            <div class="home-top">
                <div class="home-time">
                    红包发放
                </div>
                <router-link class="home-lq-list" :to="{name:'redList'}">领取列表</router-link>
            </div>
            <div class="home-center">
                <div class="home-red-pic">
                    红包图
                </div>
                <router-link :to="{name:'setPhone'}" id="to-get-money">马上抢钱</router-link>
                <p>100个红包剩余99个</p>
                <p style="text-align: right">
                    <router-link to="home" >领取规则</router-link>
                </p>
            </div>
        </div>
        <footer class="footer">
            投资有风险，理财需谨慎
        </footer>
    </div>
</template>

<style scoped type="text/css" lang="scss" rel="stylesheet/scss">
   #home{
       display: flex;
       width: 100%;
       height: 6rem;
       font-size: 0.30rem;
       flex-direction: column;
   }
   .banner {
       display: flex;
       width: 100%;
       height: 4.00rem;
       background-color: red;
       justify-content: center;
       flex-direction: column;
   }

   .banner h2 {
       font-size: 0.50rem;
   }

   .footer {
       display: flex;
       height: 1.00rem;
       font-size: 0.28rem;
       justify-content: center;
       flex-direction: column;
   }

   .home-top{
        position: relative;
        height: 1.00rem;
    }
        .home-time{
            position: absolute;
            width: 2.00rem;
            height: 0.8rem;
            left: 50%;
            top: 50%;
            margin-left: -1.00rem;
            margin-top: -0.40rem;
            background-color: antiquewhite;
            text-align: center;
            line-height: 0.80rem;
        }
        .home-lq-list{
            position: absolute;
            top: 0.70rem;
            right: 0.50rem;
        }
    .home-center{
        width: 80%;
        height: 4.00rem;
        margin: 0.40rem auto;
        border: 0.01rem solid red;
        position: relative;
    }
        .home-red-pic{
            width: 2.60rem;
            height: 2.00rem;
            margin-top: 0.50rem;
            margin-left: auto;
            margin-right: auto;
            background-color: red;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        #to-get-money{
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 2.00rem;
            margin-left: auto;
            margin-right: auto;
            padding-top: 0.40rem;
        }

</style>


<script>
    export default {
        name: "home",
        data() {
            return {
                msg: '我是首页！',
                transitionName: 'fade',
            }
        }
    }
</script>
