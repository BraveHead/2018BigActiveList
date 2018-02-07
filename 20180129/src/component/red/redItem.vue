<template>
    <div id="redList">
        <div style="padding-top: 4.72rem;">
            <div class="redList-title-one">
                <p>您的新年现金红包需要邀{{this.hasFriends}}位好友实名注册才可领取</p>
            </div>
        </div>
        <div class="red-item-number">
            <span>{{this.carshMoney}}</span>
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
                    <li>
                        <span>153****2345</span>
                        <span class="shiming-type">已实名</span>
                    </li>
                    <li>
                        <span>153****2345</span>
                        <span class="weishiming-type">未实名</span>
                    </li>
                    <li>
                        <span>153****2345</span>
                        <span class="shiming-type">未实名</span>
                    </li>
                    <li>
                        <span>153****2345</span>
                        <span class="weishiming-type">未实名</span>
                    </li>
                </ul>
            </div>
            <navigation :pages="pages" :current.sync="pageNo" @navpage="msgListView"></navigation>
            <p>当前是第<span v-text="pageNo"></span>页</p>
        </div>
        <!-- <span @click="backFun">返回上一页</span>
         <ul>
             <li v-for="item in redListData">
                 <span>{{item.title}}</span>
                 <router-link :to="{name:'redItem'}" class="to-get-detail">差一人助力</router-link>
             </li>
         </ul>-->
    </div>
</template>

<script>
    import navigation1 from '../plugins/navigation'
    export default {
        name: "redList",
        data() {
            return {
                redListData: [

                ],
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
                        token: NativeJs.prototype.getCookie('token')
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
                        token: NativeJs.prototype.getCookie('token'),
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
                        'token': NativeJs.prototype.getCookie('token')
                    }
                }).done((res)=>{
                    if(res.rcd === '0000'){
                        NativeJs.prototype.androidIosJs({
                            android: 'activityToShare',
                            ios: 'activityToShare',
                            url: 'activityToShare',
                            fx: {
                                shareUrl: 'localhost:8080/user/setPhone?tgNo=' +
                                res.data.thNo +'&timeStamp=' + res.data.timeStamp +
                                '&invitePhone=' + res.data.invitePhone +
                                    '&token=' + NativeJs.prototype.getToken(),
                                shareTitle: '测试拆红包分享',
                                shareDesc: '分享描述123123',
                                shareIcon: '分享icon，绝对地址'
                            },
                            wxfx: function(){
                                wxfx({
                                    title: '分享标题13',
                                    desc: '分享描述123123',
                                    link: 'localhost:8080',
                                    imgUrl: '分享icon，绝对地址',
                                    cancel: function(){},       //取消分享回调方法  可省略
                                    success: function(){}       //完成分享回调方法  可省略
                                });
                            }
                        });
                        window.open('http://localhost:8080/user/setPhone?tgNo='+ res.data.tgNo +'&timeStamp=' + res.data.timeStamp+'&invitePhone=' + res.data.invitePhone + '&token=' + NativeJs.prototype.getToken())
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
                        token: NativeJs.prototype.getCookie('token'),
                        pageSize: this.pageSize,
                        pageNumber: this.pageNo,
                    }
                }).done((res)=>{
                    if(res.rcd === '0000'){
                        this.todayAllPeople = res.data.totalUserNum;
                        this.todayRealNamePeople = res.data.realNum;
                        this.redListData = res.data.userList;
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
    .redList-title-one {
        background: url("../../assets/redList-title-bg.png") no-repeat center;
        background-size: 100% 100%;
        width: 6.29rem;
        height: 1.04rem;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        line-height: 1.04rem;
        font-size: 0.24rem;
        color: rgb(255, 255, 255);
        display: revert;
        top: 4.72rem;
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
        font-size: 0.62rem;
        font-weight: bold;
        color: rgb(255, 250, 84);
        text-align: center;
        width: 1.00rem;
        height: 0.62rem;
        top: 0.20rem;
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
        display: inline-block;
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