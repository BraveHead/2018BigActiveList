<template>
    <div class="red-list-container">
        <ul class="red-list-ul">
            <li v-for="item in redListData">
                <div class="red-li-top">
                    <span>{{item.awardMoney}}元现金</span>
                    <a class="is-youxiao" v-if="(item.status === 2)" @click="toRedItem">差{{item.activeNum}}人助力</a>
                    <a class="is-wuxiao" v-else-if="(item.status === 1)">奖励已派发</a>
                    <a class="is-wuxiao" v-else>奖励已过期</a>
                </div>
                <div class="red-li-bottom">
                    <span>领取时间：{{timeDataFilter(new Date(item.createDate))}}</span>
                    <time v-show="item.status === 2">剩余时间：{{daoJiGeShi}}</time>
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

<script type="es6">
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
                daoJiGeShi:'',    //倒计时格式化
            }
        },
        methods: {
            callback(){
                return 'sb';
            },
            renderFriendsList(){
                $.ajax({
                    url: window.commonRequestPrefix + 'rob_money_list',
                    dataType: 'json',
                    methods:"POST",
                    async:true,
                    data:{
                        token: NativeJs.prototype.getToken(),
                    }
                }).done((res)=>{
                    let self = this;
                    self.redListData = res.data;
                    self.daoJiTime = Number(res.data[0].countdownTime);
                    self.daoJiTimeHours = Math.floor(self.daoJiTime/(60*60*1000));   //小时
                    self.daoJiTimeMinutes = Math.floor((Number(self.daoJiTime) - Number(self.daoJiTimeHours*60*60*1000))/(60*1000)); // 分钟
                    self.daoJiTimeSeconds =Math.floor((Number(self.daoJiTime)- Number(self.daoJiTimeHours*60*60*1000)- Number(self.daoJiTimeMinutes*60*1000))/1000);   //秒
                    self.toSharePage();   //
                    // self.daoJiGeShi =  (hours>=10?hours:'0'+hours)+':'+(minutes>=10?minutes:'0'+minutes)+':'+(seconds>=10?seconds:'0'+seconds);
                    self.timeDateFilterTwo(self.daoJiTime);
                    // setInterval(function (e) {
                    //     self.daoJiTime -= 1000;
                    //     console.log(self.daoJiTimeSeconds);
                    // }, 1000);
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
            timeDateFilterTwo: function (time) {
                let  self = this;
                let hours = Math.floor(time/(60*60*1000)),   //小时
                    minutes = Math.floor((time - Number(self.daoJiTimeHours*60*60*1000))/(60*1000)), // 分钟
                    seconds =Math.floor((time- Number(self.daoJiTimeHours*60*60*1000)- Number(self.daoJiTimeMinutes*60*1000))/1000);   //秒
                setInterval(function (e) {
                    time -= 1000;
                     hours = Math.floor(time/(60*60*1000)),   //小时
                        minutes = Math.floor((time - Number(self.daoJiTimeHours*60*60*1000))/(60*1000)), // 分钟
                        seconds =Math.floor((time- Number(self.daoJiTimeHours*60*60*1000)- Number(self.daoJiTimeMinutes*60*1000))/1000);   //秒
                }, 1000);
              self.daoJiGeShi = (hours>=10?hours:'0'+hours)+':'+(minutes>=10?minutes:'0'+minutes)+':'+(seconds>=10?seconds:'0'+seconds);
    },
            //点击助力去分享页面
            toSharePage(){
                let self = this;
                $('.is-youxiao').on('click',function () {
                    self.$http.push({name:'redItem'});
                });
            },
            toRedItem(){
                if(window.location.href.indexOf('isAPP')===-1){
                    this.$router.push({name:'redItem'});
                }else{
                    this.$router.push({name:'redItem',query:{
                            token:NativeJs.prototype.getUrl('token',
                                window.location.href.slice(window.location.href.indexOf('token='))),
                            isAPP:1
                        }})
                }
            }
        },
        mounted(){
            this.$nextTick(function () {
                this.renderFriendsList();
                this.historyRender(this.redListData);
            });
        },
    }
</script>

<style scoped type="text/scss" lang="scss">
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
