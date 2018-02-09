<template>
    <div id="redList">
        <div style="padding-top: 4.72rem;">
            <div class="redList-title-one">
                <p>您的新年现金红包需要邀{{this.hasFriends}}位好友实名注册才可领取<br/>明日12：00点前未完成任务，红包失效</p>
            </div>
        </div>
        <div class="red-item-number">
            <span style="font-size: 0.50rem;">{{this.carshMoney}}</span>
        </div>
        <img src="../../assets/redLIst-friend.png" class="friend-support" @click="toShareUrl"/>
        <div class="redList-friends-container">
            <div style="height: 0.47rem;"></div>
            <img src="../../assets/redList-jingdu.png" class="redList-jingdu"/>
            <p class="renwu-jingdu">
                <span>任务完成：</span>
                <span>{{this.todayRealNamePeople}}/{{this.todayAllPeople}}</span>
            </p>
            <div class="friends-recode-history">
                <div class="">
                    <span>好友</span>
                    <span>状态</span>
                </div>
                <ul>
                    <li v-for="item in this.redListData">
                        <span>{{item.phone}}</span>
                        <span class="shiming-type" v-if="item.status === 1">已实名</span>
                        <span class="weishiming-type" v-else="item.status === 1">未实名</span>
                    </li>
                </ul>
            </div>
            <navigation :pages="pages" :current.sync="pageNo" @navpage="this.msgListView" style="position: absolute; left: 50%;width: 6.00rem;margin-left: -3.00rem;bottom: 0.60rem;"></navigation>
        </div>
        <div class="bg-alert">
            <img src="../../assets/fx.png" class="top"/>
            <img src="../../assets/gb.png" class="bot"/>
        </div>
    </div>
</template>

<script>
    import navigation1 from '../plugins/navigation'
    export default {
        name: "redList",
        data() {
            return {
                redListData: [],
                hasFriends: '',  //还需要多少个好友
                todayRealNamePeople:'',
                todayAllPeople:'',
                pageNo:1,
                carshMoney:'',
                pages : 5,
                pageSize:9
            }
        },
        methods: {
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
            //好友拆红包进度
            renderFriendsList(){
                $.ajax({
                    url: window.commonRequestPrefix + 'rob_money_list',
                    dataType: 'json',
                    methods:"POST",
                    data:{
                        token: NativeJs.prototype.getToken(),
                    }
                }).done((res)=>{
                    this.hasFriends = res.data[0].activeNum;
                    this.carshMoney = res.data[0].awardMoney;
                })
            },
            //分享链接
            toShareUrl(){
                //提交给接口链接标识符和分享人手机号
                $.ajax({
                    url: window.commonRequestPrefix + 'get_share_info',
                    dataType:'json',
                    methods:'JOSN',
                    data:{
                        'token': NativeJs.prototype.getToken(),
                    }
                }).done((res)=>{
                    if(res.rcd === '0000'){
                        //APP端点击分享直接调用各自的方法，禁止app内内置浏览器的分享
                        if(window.location.href.indexOf('isAPP') === -1){
                            $('.bg-alert').fadeIn();
                            $('.bot').on('click', function (e) {
                                $('.bg-alert').fadeOut();
                            });
                        }else{
                           //
                        }
                        let self = this;
                        NativeJs.prototype.androidIosJs({
                            android: 'activityToShare',
                            ios: 'activityToShare',
                            url: 'activityToShare',
                            fx: {
                                shareUrl: 'https://test.qtz360.com/h5/activity/xchd/index.html#/user/setPhone?tgNo=' +
                                res.data.tgNo +'&timeStamp=' + res.data.timeStamp + '&invitePhone=' +res.data.invitePhone,
                                shareTitle: '新春大放送，准点抢现金',
                                shareDesc: "恭贺新春，我在晴天助领取了#"+self.carshMoney+"#元现金红包，快来帮我拆开吧！",
                                shareIcon: '分享icon，绝对地址'
                            },
                            wxfx: function(){
                                wxfx({
                                    title: '新春大放送，准点抢现金',
                                    desc: "恭贺新春，我在晴天助领取了#"+self.carshMoney+"#元现金红包，快来帮我拆开吧！",
                                    link: 'https://test.qtz360.com/h5/activity/xchd/index.html#/user/setPhone?tgNo=' +
                                    res.data.tgNo +'&timeStamp=' + res.data.timeStamp + '&invitePhone=' +res.data.invitePhone,
                                    imgUrl: '分享icon，绝对地址',
                                    cancel: function(){},       //取消分享回调方法  可省略
                                    success: function(){}       //完成分享回调方法  可省略
                                });
                            }
                        });
                    }else{
                        alert(res.rmg);
                    }
                });
            },
            msgListView(curPage){
                //根据当前页获取数据
                this.pageNo = curPage;
                this.getFriendsLIst();
            },
            //获取拆红包好友进度
            getFriendsLIst(){
                $.ajax({
                    url: window.commonRequestPrefix + 'help_users',
                    dataType: 'json',
                    methods:"POST",
                    data:{
                        token: NativeJs.prototype.getToken(),
                        pageSize: this.pageSize,
                        pageNumber: this.pageNo,
                    }
                }).done((res)=>{
                    if(res.rcd === '0000'){
                        this.todayAllPeople = res.data.totalUserNum;
                        this.todayRealNamePeople = res.data.realNum;
                        this.redListData = res.data.userList;
                        this.pages = res.data.totalPage;   //页数
                    }else{
                        alert(res.rmg)
                    }
                })
            }
        },
        mounted(){
            this.$nextTick(function () {
                this.loadUserRed();
                this.getFriendsLIst();
                //隐藏APP右上角本地分享按钮
                //android部分机型方法可执行，但是报错，故用try catch
                try {
                    NativeJs.prototype.androidIosJs({
                        android: 'androidToGetUrl',
                        ios: 'activityShareUrl',
                        url: 'activityShareUrl',
                        fx: {
                            url: 分享地址
                        },
                        toggle: 0
                    });
                } catch (e) {

                }

            });
        },
        components: {
            'navigation': navigation1
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    #redList {
        width: 100%;
        height: auto;
        background: url("../../assets/redList-bg.png") no-repeat center;
        background-size: 100% 100%;
        padding-bottom: 0.70rem;
    }
    .no-friends{
        padding-top: 0.50rem;
        padding-bottom: 0.50rem;
        border-top: 0.01rem solid #7f120b;
        color:#7f120b;
    }
    .bg-alert{
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        top: 0;
        left: 0;
        display: none;
        .top{
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .bot{
            display: block;
            margin-left: auto;
            margin-right: auto;
            padding-top: 50%;
        }
    }
    .redList-title-one {
        background: url("../../assets/redList-title-bg.png") no-repeat center;
        background-size: 100% 100%;
        width: 6.29rem;
        height: 1.04rem;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        font-size: 0.24rem;
        color: rgb(255, 255, 255);
        display: revert;
        top: 4.72rem;
        display: flex;
        align-items: center;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .red-item-number {
        background: url("../../assets/redList-red-number.png") no-repeat center;
        background-size: 100% 100%;
        width: 2.89rem;
        height: 1.38rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 0.47rem;
        position: relative;

    span {
        position: absolute;
        font-size: 0.50rem;
        font-weight: bold;
        color: rgb(255, 250, 84);
        text-align: center;
        width: 1.00rem;
        height: 0.50rem;
        top: 0.26rem;
        right: 0.47rem;
    }

    }
    .friend-support {
        width: 3.52rem;
        height: 0.90rem;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 0.56rem;
    }

    .redList-friends-container {
        width: 7.09rem;
        height: 7.08rem;
        background: url("../../assets/redList-friends-bg.png") no-repeat center;
        background-size: 100% 100%;
        margin-left: auto;
        margin-right: auto;
        font-size: 0.24rem;
        position: relative;
    }

    .redList-jingdu {
        width: 5.83rem;
        height: 0.84rem;
        margin-left: auto;
        margin-right: auto;
        position: relative;
    }

    .renwu-jingdu {
        padding-top: 0.20rem;
        margin-left: 0.74rem;
        text-align: left;
        color: #7f120b;
    }

    ul, li {
        list-style: none
    }

    .friends-recode-history {
        width: 4.00rem;
        height: auto;
        border: 0.01rem solid #7f120b;
        margin-left: auto;
        margin-right: auto;
        margin-top: 0.15rem;
    div {
        text-align: center;
        color: #7f120b;
        height: 0.40rem;
        line-height: 0.40rem;
        span {
            display: inline-block;
            height: 0.40rem;
            width: 1.99rem;

            &:nth-child(2) {
                border-left: 0.01rem solid #7f120b;
                float: right;
            }  }
    }
    ul {
        display: block;
        height: auto;
        text-align: center;
        color: #7f120b;
        line-height: 0.40rem;

    li {
        display: block;
        height: 0.40rem;

    span {
        display: inline-block;
        height: 0.39rem;

    &:nth-child(1) {
        border-top: 0.01rem solid #7f120b;
        width: 1.99rem;
        color: rgb(255, 172, 0);
    }
    &:nth-child(2) {
        border-top: 0.01rem solid #7f120b;
        border-left: 0.01rem solid #7f120b;
        float: right;
        width: 1.99rem;
    }
    }
    .shiming-type {
        color: rgb(206, 44, 33);
    }

        .weishiming-type {
            color: rgb(86, 86, 86);
        }

        }
        }
    }
    ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        font-size: 0.30rem;

    li {
        width: 100%;
        height: 0.80rem;

        span {
            float: left;
        }

        .to-get-detail {
            float: right;
            border: 0.01rem solid red;
        }

        }
    }
</style>