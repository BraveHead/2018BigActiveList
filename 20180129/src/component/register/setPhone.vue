<template>
    <div class="set-phone-container">
        <p class="yaoqing-name">好友<span>{{toStringPhone(this.friendPhone)}}</span>邀您帮忙拆红包</p>
        <img src="../../assets/setPhone-open.png" class="setPhone-open"/>
        <div class="set-phone-div">
            <p v-show="phoneNumShow">{{this.phoneTitle}}</p>
            <input type="text" placeholder="请输入手机号" class="set-phone" v-model="phoneNumber" :maxlength="11"/>
        </div>
        <span class="now-get-red to-link-register" @click="this.nowGetFriendsRed">立即领取</span>
    </div>
</template>

<style scoped type="text/css" lang="scss" rel="stylesheet/scss">
    input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: rgb(145, 12, 6);
        /* placeholder字体大小  */
        font-size: 0.24rem;
    }
    .set-phone-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: url("../../assets/setPhone-bg.png") no-repeat center;
        background-size: 100% 100%;
    }

    .yaoqing-name {
        padding-top: 3.84rem;
        font-size: 0.30rem;
        color: rgb(255, 255, 255);
        text-align: center;
        line-height: 0.30rem;
    }

    .setPhone-open {
        width: 1.41rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 0.43rem;
    }
    .set-phone-div{
        margin-top: 0.57rem;
        position:relative;
        p{
            display: inline-block;
            width: auto;
            height: 0.50rem;
            background: rgba(0,0,0,0.5);
            text-align: center;
            line-height: 0.50rem;
            font-size: 0.24rem;
            color: #ffffff;
            border-radius: 0.15rem;
            padding-left: 0.40rem;
            padding-right: 0.40rem;
        }
    }
    .set-phone {
        display: block;
        width: 5.56rem;
        height: 0.90rem;
        font-size: 0.24rem;
        color: rgb(145, 12, 6);
        margin-left: auto;
        margin-right: auto;
        border-radius: 0.10rem;
        border: none;
        outline: none;
        text-indent: 0.20rem;
        margin-top: -0.25rem;
    }

    .to-link-register {
        height: 0.90rem;
        width: 5.56rem;
        margin-top: 0.53rem;
        border-radius: 0.10rem;
        background-color: rgb(255, 238, 123);
        font-size: 0.18rem;
        color: rgb(224, 5, 0);
        display: block;
        margin-left: auto;
        margin-right: auto;
        line-height: 0.90rem;
        font-size: 0.36rem;
        font-weight: bold;
    }
</style>
<script>
    export default {
        name: 'register',
        data() {
            return {
                phoneTitle: '请输入正确的手机号',
                phoneNumber: '',     //手机号码
                phoneNumShow: false,   //号码弹框提醒判断
                // baseUrl: 'https://www.qtz360.com/api2.2.2/rest/',   //正式url2.2根路径
                baseUrl: window.commonRequestPrefix,   //正式url2.3根路径
                // baseUrl: 'https://test.qtz360.com/api/rest/',  //url测试
                phoneDisplay: 'none',
                checkDisplay: 'none',
                friendPhone: '',   //好友链接手机号
                award: '',    //获取红包金额
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.friendPhone = NativeJs.prototype.getUrl('invitePhone',window.location.href.slice(window.location.href.indexOf('invitePhone=')));
                this.checkUrlIsCanUse();
            })
        },
        created: function () {

        },
        methods: {
            //返回上一页
            backFun() {
                this.$store.commit('backFun')
            },
            //手机号格式化
            toStringPhone(val){
                let phoneHeader = val.substr(0,3);
                let phoneFooter = val.slice(7);
                return phoneHeader + '****' + phoneFooter;
            },
            //手机号码格式验证
            checkPhone: (text) => {
                let filter = /^1[3456789]\d{9}$/;
                if ((filter.test(text))) {
                    this.phoneNumShow = false;
                }
                return (/^1[3456789]\d{9}$/.test(text));
            },
            //验证手机号是否注册
            isPhoneExistence() {
                if (this.checkPhone(this.phoneNumber) && !this.Duable) {
                    this.$http.post(this.baseUrl + 'isPhoneUsed', { phoneReg: this.phoneNumber },{emulateJSON:true})
                        .then(function (res) {
                            if(res.data.rcd === 'A0002') {
                                this.getRedNumberFun();
                            }else{
                                this.phoneTitle = res.data.rmg;
                                this.phoneNumShow = true;
                                this.phoneDisplay = 'block';
                                setTimeout(() => {
                                    this.phoneNumShow = false;
                                    this.phoneDisplay = "none";
                                    this.phoneTitle = '请输入正确的手机格式';
                                }, 1000);
                            }
                        })
                } else {
                    this.phoneNumShow = true;
                    setTimeout(() => {
                        this.phoneNumShow = false;
                    }, 1000)
                }
            },
            //手机号可用，领取红包
            getRedNumberFun(){
                this.$http.post(this.baseUrl + 'get_award',{'phone': this.friendPhone})
                    .then(function (res) {
                        if(res.data.rcd === '0000'){
                            this.award = res.data.data.award;
                            this.$router.push({name:'register',query:{invitePhone: this.friendPhone,redNumber: this.award}});
                        }
                    }).catch(function (res) {
                    //
                })
            },
            //获取渠道分享人的信息
            getChannelMessage() {
                this.$http.get(this.baseUrl + 'channel/' + this.sn)
                    .then(function (res) {
                        if (res.data.rcd === 'R0001') {
                            this.channelId = res.data.id;
                            this.channelCookie = res.data.cookie;
                            this.register();   //注册
                        } else {
                            // console.log('渠道获取成功'+ res.data.rmg);
                        }
                    }).catch(function (res) {
                })
            },
            //立即领取好友分享红包
            nowGetFriendsRed(){
                this.isPhoneExistence();
                // if(this.checkPhone(this.phoneNumber)){
                //
                // }else{
                //     this.phoneNumShow = true;
                //     let self = this;
                //     setTimeout(function () {
                //         self.phoneNumShow = false;
                //     }, 2000)
                // }
            },
            //检测链接是否有效
            checkUrlIsCanUse(){
                this.$http.post(this.baseUrl + 'check_share_url',{
                    'token':NativeJs.prototype.getUrl('token',window.location.href.slice(window.location.href.indexOf('token='))),
                    'timeStamp': NativeJs.prototype.getUrl('timeStamp',window.location.href.slice(window.location.href.indexOf('timeStamp='))),
                    'tgNo': NativeJs.prototype.getUrl('tgNo',window.location.href.slice(window.location.href.indexOf('tgNo='))),
                    'invitePhone':NativeJs.prototype.getUrl('invitePhone',window.location.href.slice(window.location.href.indexOf('invitePhone=')))
                })
                    .then(function (res) {
                        if(res.data.rcd === '0000'){
                            console.log(res.data);
                        }
                    })
            }
        }
    };

</script>
