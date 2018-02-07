<template>
    <div class="red-list-container">
        <ul class="red-list-ul">
            <li v-for="item in redListData">
                <div class="red-li-top">
                    <span>{{item.awardMoney}}元现金</span>
                    <router-link class="is-youxiao" v-if="(item.status === 2)" :to="{name:'redItem'}">差{{item.activeNum}}人助力</router-link>
                    <a class="is-wuxiao" v-else-if="(item.status === 1)">奖励已派发</a>
                    <a class="is-wuxiao" v-else>奖励已派发</a>
                </div>
                <div class="red-li-bottom">
                    <span>领取时间：{{timeDataFilter(new Date(item.createDate))}}</span>
                    <time v-show="item.status === 2">剩余时间：{{timeDateFilterTwo(new Date(daoJiTime))}}</time>
                </div>
            </li>
        </ul>
        <p class="no-data">
            <s></s>
            <span>拉到底啦</span>
            <s></s>
        </p>
    </div>
</template>

<script>
    export default {
        name: "redList",
        data() {
            return {
                redListData: [

                ],
                daoJiTime:'',
                daoJiTimeHours:'',  //倒计时时间戳小时
                daoJiTimeMinutes:'',  //倒计时时间戳小时
                daoJiTimeSeconds:'',  //倒计时时间戳小时
            }
        },
        methods: {
            backFun() {
                this.$store.commit('backFun');
            },
            renderFriendsList(){
                $.ajax({
                    url: window.commonRequestPrefix + 'rob_money_list',
                    dataType: 'json',
                    methods:"POST",
                    data:{
                        token: NativeJs.prototype.getCookie('token')
                    }
                }).done((res)=>{
                    this.redListData = res.data;
                    this.daoJiTime = Number(res.data[0].modifyDate);
                    // this.jiangeTime();
                    this.toSharePage();
                    // $('.red-list-ul').empty();
                })
            },
            //添加状态
            historyRender(data){
                for(let i=0;i<data.length;i++){
                    if(data[i].status === 2){
                        console.log('>>>');
                        $('.red-list-ul .red-li-top').append(`<a class="is-youxiao">差{{data[i].activeNum}}人助力</a>`)
                    }else if(data[i].status === 0){
                        $('.red-li-top').append(`<a class="is-wuxiao">奖励已派发</a>`);
                        // $('.is-wuxiao').eq(i).html('奖励已派发');
                    }else{
                        $('.red-li-top').append(`<a class="is-wuxiao">奖励已过期</a>`);
                        // $('.is-wuxiao').eq(i).html('奖励已过期');
                    }
                }
            },
            timeDataFilter(now) {
                let year=now.getFullYear(),
                    month=now.getMonth()+1,
                    date=now.getDate(),
                    hours = now.getHours(),
                    minutes = now.getMinutes(),
                    seconds = now.getSeconds();
                return  year+"."+(month>=10?month:'0'+month)+"."+(date>=10?date:'0'+date)+' '+ (hours>=10?hours:'0'+hours)+':'+(minutes>=10?minutes:'0'+minutes)+':'+(seconds>=10?seconds:'0'+seconds);
            },
            // jiangeTime(){
            //     let self = this;
            //     setInterval(function (e) {
            //         self.numberTime += 1;
            //         self.daoJiTime -= self.numberTime;
            //         let now = new Date(self.daoJiTime);
            //         let hours = now.getHours(),
            //             minutes = now.getMinutes(),
            //             seconds = now.getSeconds();
            //         return  self.daoJiTimeHours = hours,
            //                 self.daoJiTimeMinutes = minutes,
            //                 self.daoJiTimeSeconds = seconds;
            //     }, 1000)
            // },
            timeDateFilterTwo: function (now1) {
                let now = new Date(now1);
                let hours = now.getHours(),
                    minutes = now.getMinutes(),
                    seconds = now.getSeconds();
                return  (hours>=10?hours:'0'+hours)+':'+(minutes>=10?minutes:'0'+minutes)+':'+(seconds>=10?seconds:'0'+seconds);
            },
            //点击助力去分享页面
            toSharePage(){
                let self = this;
                $('.is-youxiao').on('click',function () {
                    self.$http.push({name:'redItem'});
                });
            }
        },
        mounted(){

            this.$nextTick(function () {
                this.renderFriendsList();
                this.historyRender(this.redListData);
            });
        },
        filters: {

        },
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    ul,li {
        list-style: none;
    }
    .red-list-container{
        background-color: #ffffff;
    }
    .red-list-ul{
        width: 100%;
        height: auto;
        display: inline-block;
        background-color:#f7f7f7;
        li{
            display: block;
            width: 100%;
            height: 1.76rem;
            background-color: #ffffff;
            margin-bottom: 0.20rem;
        }
    }
    .red-li-top{
        height: 1.14rem;
        border-bottom: 0.02rem dashed #979797;
        span{
            float: left;
            font-family: PingFangSC-Regular;
            font-size: 0.28rem;
            color: #F3200E;
            line-height: 0.28rem;
            padding-left: 0.22rem;
            margin-top: 0.44rem;
        }
        .is-youxiao{
            float: right;
            margin-right: 0.20rem;
            width: 1.54rem;
            height: 0.40rem;
            border: 0.02rem solid #ff8b82;
            text-align: center;
            line-height: 0.40rem;
            font-family: PingFangSC-Regular;
            font-size: 0.28rem;
            color: #F3200E;
            border-radius: 0.10rem;
            margin-top: 0.36rem;
        }
        .is-wuxiao{
            display: block;
            width: 1.46rem;
            height: 0.40rem;
            background: #ECECEC;
            border-radius: 0.04rem;
            float: right;
            margin-right: 0.20rem;
            margin-top: 0.40rem;
            text-align: center;
            line-height: 0.40rem;
            font-family: PingFangSC-Regular;
            font-size: 0.24rem;
            color: #8D8D8D;
        }
    }
    .red-li-bottom{
        height: 0.60rem;
        font-family: PingFangSC-Regular;
        line-height: 0.60rem;
        span{
            font-size: 0.24rem;
            color: #ADADAD;
            float: left;
            padding-left: 0.22rem;
        }
        time{
            float: right;
            font-family: PingFangSC-Regular;
            font-size: 0.20rem;
            color: #F3200E;
            margin-right: 0.20rem;
        }
    }
    .no-data{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top:0.50rem;
        s{
            width: 2.00rem;
            height: 0.02rem;
            background-color: #dcdcdc;
        }
        span{
            font-family: PingFangSC-Regular;
            font-size: 0.24rem;
            color: #AFAFAF;
            letter-spacing: 0;
            line-height: 0.24rem;
            padding-left: 0.20rem;
            padding-right: 0.20rem;
        }
    }
</style>
