<template>
    <div class="home-container">
        <div id="home">
            <img src="../../assets/home-title.png" style="padding-top: 7.50rem;margin-left: auto;margin-right: auto;display: block;width: 5.52rem;"/>
            <div class="get-money-container">
                <img src="../../assets/home-get-money.png" class="now-get-money red-default-animation" @click="nowGetMoney"/>
                <img src="../../assets/home-red-list.png" class="lq-red-list" @click="checkRedsList"/>
            </div>
            <div class="sy-red">
                <p>100个红包剩余{{this.hasRedNumber}}个</p>
            </div>
            <div class="home-rules">
                <div class="check-rules" @click="checkRules">
                    <span>查看活动规则</span>
                    <img src="../../assets/home-up.png" class="base-time"/>
                </div>
                <div class="rules-content">
                    <p>活动规则：</p>
                    <p>1.活动期间每天12:00限量发放现金红包，每个用户每天限抢一次。</p>
                    <p>2.现金红包随机抽取，抽取红包完成相应任务现金自动发放到平台账户，可提现。</p>
                    <p>3.未完成红包领取任务，下一个时间点红包自动清零，您可进行下一轮抢红包。</p>
                </div>
            </div>
            <footer class="footer">
                投资有风险，理财需谨慎
            </footer>
        </div>
    </div>
</template>

<style scoped type="text/scss" lang="scss">
    .base-time{
        transition: all 0.5s ease-in-out;
    }
    .rotateAnimation{
        transform: rotateX(180deg);
    }
    .home-container {
        width: 100%;
        height: auto;
        background: url("../../assets/home-bg.png") no-repeat top;
        background-size: 7.5rem 16.84rem;
    }
    .red-default-animation{
        animation: scaleAnimate 2.0s ease-in-out 0.5s infinite;
    }
    @keyframes scaleAnimate {
        0%{
            transform: scale3d(1.0,1.0,1.0);
            opacity: 1;
        }
        50%{
            transform: scale3d(1.10,1.10,1.10);
            opacity: 0.85;
        }
        100%{
            transform: scale3d(1.0,1.0,1.0);
            opacity: 1;
        }
    }
    .animationButton {
        animation: flipOutY 1s .2s ease both
    }

    @keyframes flipOutY {
        0% {
            -webkit-transform: scale3d(1, 1, 1) rotateY(0);
            transform: scale3d(1, 1, 1) rotateY(0);
            opacity: 1
        }
        10% {
            -webkit-transform: scale3d(1.2, 1.2, 1.2) rotateY(0);
            transform: scale3d(1.2, 1.2, 1.2) rotateY(0);
            opacity: 1
        }
        80% {
            -webkit-transform: scale3d(1.2, 1.2, 1.2) rotateY(360deg);
            transform: scale3d(1.2, 1.2, 1.2) rotateY(360deg);
            opacity: 1
        }
        100% {
            -webkit-transform: scale3d(1, 1, 1) rotateY(360deg);
            transform: scale3d(1, 1, 1) rotateY(360deg);
            opacity: 1
        }
    }
    .get-money-container{
        width: 100%;
        height: 2.00rem;
        margin-top: 0.30rem;
        position:relative;
        .now-get-money{
            width: 1.80rem;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -1.025rem;
            margin-top: -0.75rem;
        }
        .lq-red-list{
            position: absolute;
            width: 1.49rem;
            right:0.05rem;
            bottom: 0.24rem;
            img{
                width: 1.49rem;
            }
        }
    }
    .sy-red{
        border: 0.02rem solid rgb(255,223,122);
        width: 3.56rem;
        height: 0.66;
        font-size: 0.30rem;
        text-align: center;
        line-height: 0.70rem;
        margin-left: auto;
        margin-right: auto;
        border-radius: 0.20rem;
        color: rgb(255,223,122);
        margin-top: 0.61rem;
    }
    .home-rules{
        height: auto;
        width: 100%;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select:none;
        .check-rules{
            font-size: 0.30rem;
            color: rgb(255,223,122);
            text-align:center;
            margin-top: 0.73rem;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select:none;
            span{
                vertical-align: middle;
            }
            img{
                vertical-align: middle;
                width: 0.29rem;
            }
        }
    }
    .rules-content{
        color: rgb(255,223,122);
        font-size: 0.24rem;
        text-align: left;
        line-height: 0.34rem;
        width: 6.74rem;
        margin-left: auto;
        margin-right: auto;
        display: none;
    }
    .footer {
        display: flex;
        height: 0.28rem;
        font-size: 0.24rem;
        line-height: 0.28rem;
        justify-content: center;
        flex-direction: column;
        margin-top: 0.58rem;
        padding-bottom: 0.30rem;
        color: rgb(103,0,0);
    }
    #topLeftBack{
        width: 0.88rem;
        height: 0.88rem;
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
    }
</style>


<script type="es6">
    export default {
        name: "home",
        data() {
            return {
                msg: '我是首页！',
                transitionName: 'fade',
                isHideRules: true,
                hasRedNumber: 100,
                isZero: false,    //库存量是否不足
            }
        },
        methods:{
            //点击查看活动规则
            checkRules(){
                $('.check-rules img').toggleClass('rotateAnimation');
                $('.rules-content').slideToggle();
            },
            //获取该红包大小
            loadUserRed(){
                $.ajax({
                    url: window.commonRequestPrefix + 'rob_money',
                    dataType:'json',
                    method:'POST',
                    data: {
                        token: NativeJs.prototype.getToken(),
                    }
                }).done((res)=>{
                    this.renderFriendsList();
                }).fail((error)=>{
                    console.log(error.msg);
                });
            },
            //马上领取红包
            nowGetMoney(){
                if(NativeJs.prototype.isLogin()){
                    $('.now-get-money').removeClass('red-default-animation').addClass('animationButton');
                    $.ajax({
                        url: window.commonRequestPrefix + 'rob_money',
                        dataType:'json',
                        method:'POST',
                        data: {
                            token: NativeJs.prototype.getToken(),
                        }
                    }).done((res)=>{
                        if(res.rcd === '0000' || res.rcd === 'E0007'){
                            //判断APP和H5
                            if(window.location.href.indexOf('isAPP') === -1){
                                this.$router.push({path: '/red/redList/redItem'});
                            }else{
                                this.$router.push({path: '/red/redList/redItem',query:{
                                        token:NativeJs.prototype.getUrl('token',window.location.href.slice(window.location.href.indexOf('token='))),
                                        isAPP:1}});
                            }
                        }else{
                            alert(res.rmg);
                        }
                    }).fail((error)=>{
                        console.log(error.msg);
                    });
                }else{
                    NativeJs.prototype.androidIosJs({
                        android: 'androidToLogin',
                        ios: 'activityToLogin',
                        url: 'activityToLogin'
                    })
                }
            },
            //点击查看领取列表
            checkRedsList(){
                if(NativeJs.prototype.isLogin()){
                    if(window.location.href.indexOf('isAPP') === -1){
                        this.$router.push({path: '/red/redList'});
                    }else{
                        this.$router.push({path: '/red/redList',query:{
                                token:NativeJs.prototype.getUrl('token',window.location.href.slice(window.location.href.indexOf('token='))),
                                isAPP:1}});
                    }
                }else{
                    NativeJs.prototype.androidIosJs({
                        url: 'activityToLogin'
                    })
                }
            },
            //加载剩余红包
            loadRedNumber(){
                $.ajax({
                    url: window.commonRequestPrefix + 'hongbao_num',
                    dataType: 'json',
                    method:'GET',
                    data:{

                    }
                }).done((res)=>{
                   if(res.rcd === '0000'){
                        this.hasRedNumber = res.data.hongbaoNum;
                   }else{
                       // alert(res.rmg);
                   }
                })
            }
        },
        mounted(){
            this.$nextTick(function () {
                this.loadRedNumber();
                NativeJs();
                NativeJs.prototype.topLeftBack();
                //隐藏APP右上角本地分享按钮
                //android部分机型方法可执行，但是报错，故用try catch
                try {
                    NativeJs.prototype.androidIosJs({
                        android: 'androidToGetUrl',
                        ios: 'activityShareUrl',
                        url: 'activityShareUrl',
                        fx: {
                            url: 'https://www.qtz360.com/h5/html/activity/20180212/1/index.html#/red/redList/redItem'
                        },
                        toggle: 0
                    });
                } catch (e) {

                }
            });
        }
    }
</script>
