<template>
    <div id="redList">
        <div class="red-item-number" style="margin-top: 4.55rem;position: relative;">
            <span>{{this.award}}</span>
        </div>
        <div style="margin-top: 0.389rem;position: relative;">
            <div class="redList-title-one">
                <p>{{this.award}}元现金已发放至晴天助账户，实名注册后可提现 并帮助好友{{this.toStringPhone(this.friendPhone)}}完成拆红包任务。</p>
            </div>
        </div>
        <p class="current-phone">当前账户：{{toStringPhone(this.nowRegisterPhoneNumber())}}</p>
        <div class="traffic_from">
            <div class="register-form">
                <div class="register-center">
                    <!--<div class="input-container" style="margin-top: 0">-->
                        <!--<input placeholder="请输入手机号" class="input-same"-->
                               <!--type="text" v-model="phoneNumber" v-on:blur="checkPhone(phoneNumber)" maxlength="11"/>-->
                        <!--<img src="../../assets/correct-icon@2x.png" v-show="checkPhone(phoneNumber)"/>-->
                        <!--<p v-show="phoneNumShow" v-bind:style="{'display': phoneDisplay}">{{phoneTitle}}</p>-->
                    <!--</div>-->
                    <div class="input-container">
                        <input placeholder="请设置8~20位数字与字母组合密码" class="input-same"
                               type="password" v-model="passwordText" v-on:blur="checkPassword(passwordText)" maxlength="20" minlength="8"/>
                        <img src="../../assets/correct-icon@2x.png" v-show="checkPassword(passwordText)"/>
                        <p v-show="passwordShow">{{passwordTitle}}</p>
                    </div>
                    <div class="input-container">
                        <input placeholder="请输入图形验证码" class="input-same"
                               type="text" v-model="picCodeText" maxlength="4"/>
                        <!--<img src="assets/correct-icon@2x.png" style="right: 1.97rem" v-show="picCodeShow"/>-->
                        <img v-on:click="changePicCodeFun"
                             style="width: 1.72rem;height: 0.64rem;top: 0.12rem;right: 0.12rem;cursor: pointer;position: absolute;" class="picCode"/>
                        <!--<a class="get-check" v-on:click="isPhoneExistence()" v-bind:style="{'color':clickColor}">{{getCheckWordButton}}</a>-->
                        <p v-show="picCodeTitle">{{checkPicCode}}</p>
                    </div>
                    <div class="input-container">
                        <input placeholder="短信验证码" class="input-same"
                               type="text" v-model="checkNumberText" v-on:blur="checkWord(checkNumberText)" maxlength="6"/>
                        <img src="../../assets/correct-icon@2x.png" style="right: 1.97rem" v-show="checkWord(checkNumberText)"/>
                        <a class="get-check" v-on:click="getPhoneCheckCode" v-bind:style="{'color':clickColor}">{{getCheckWordButton}}</a>
                        <p v-show="checkShow" v-bind:style="{'display':checkDisplay}">{{checkWordTitle}}</p>
                    </div>
                    <div class="agree-consent">
                        <span>注册即视为同意</span>
                        <a href="https://www.qtz360.com/h5/html/regxy/index.html" v-on:click="serviceAgreement()">《服务协议》</a>
                    </div>
                    <a class="now-register"  v-on:click="submitClick()"></a>
                    <p class="readyed-register">
                        <span>已经注册</span>
                        <a href="https://www.qtz360.com/h5/home.html#/user/login" v-on:click="login()">立即登录</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'setPhone',
        data() {
            return {
                button: false,
                isUp: false,
                overflow: 'hidden',
                // phoneTitle: '请输入正确的手机号',
                passwordTitle: '请输入正确格式的密码',
                checkWordTitle: '请输入正确的验证码',
                checkPicCode: '请输入正确的图形验证码',
                getCheckWordButton: '获取验证码',
                phoneNumber: NativeJs.prototype.getUrl('registerPhone',window.location.href.slice(window.location.href.indexOf('registerPhone='))),     //手机号码
                phoneNumShow: false,   //号码弹框提醒判断
                passwordText: '',    //密码
                passwordShow: false,  //密码弹框提醒判断
                picCodeText: '',   //图形验证码
                picCodeTitle: false,  //图形验证码弹框提醒
                checkNumberText: '',     //验证码
                checkShow: false,   //验证码弹框提醒判断
                isClick: false,  //点击在验证码
                isDuable: false,  //多次点击验证码
                clickColor: '#ffc000',   //点击按钮的颜色,
                // baseUrl: 'https://www.qtz360.com/api2.2.2/rest/',   //正式url2.2根路径
                baseUrl: window.commonRequestPrefix,   //正式url2.3根路径
                // baseUrl: 'https://test.qtz360.com/api/rest/',  //url测试
                phoneDisplay: 'none',
                checkDisplay: 'none',
                // sn: 8932543,  //ETC渠道码
                sn:'',  //测试渠道码
                channelId: '',  //渠道id
                channelCookie: '',  //渠道cookie
                timeStamp : '',
                award:'',     //获取红包
                friendPhone:''   //好友手机号
            }
        },
        created: function () {
            this.loadPicCode();
            this.submitClick();
        },
        methods:{
            //返回上一页
            backFun(){
                this.$store.commit('backFun')
            },
            //手机号格式化
            toStringPhone(val){
                let phoneHeader = val.substr(0,3);
                let phoneFooter = val.slice(7);
                return phoneHeader + '****' + phoneFooter;
            },
            //当前注册手机号码
            nowRegisterPhoneNumber(){
                return NativeJs.prototype.getUrl('registerPhone',window.location.href.slice(window.location.href.indexOf('registerPhone=')));
            },
            //初始化加载红包和好友信息
            loadStartMessage(){
                this.award = NativeJs.prototype.getUrl('redNumber',window.location.href.slice(window.location.href.indexOf('redNumber=')));
                this.friendPhone = NativeJs.prototype.getUrl('invitePhone',window.location.href.slice(window.location.href.indexOf('invitePhone=')));
            },
            //图形验证码点击切换
            changePicCodeFun() {
                this.timeStamp = Math.random().toFixed(6)*1000000+1;
                this.loadPicCode();   //冲新加载图形验证码
            },
            // //手机号码格式验证
            // checkPhone: (text) => {
            //     let filter = /^1[3456789]\d{9}$/;
            //     if((filter.test(text))) {
            //         this.phoneNumShow = false;
            //     }
            //     return (filter.test(text));
            // },
            //8-20位数字和字母的密码格式验证
            checkPassword: (text)=> {
                let filter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
                if(filter.test(text)){
                    this.passwordShow = false;
                }
                return (filter.test(text));
            },
            //6位验证码的格式验证
            checkWord: (text)=> {
                let filter = (/^\d{6}$/);
                if(filter.test(text)){
                    this.checkShow = false;
                }
                return filter.test(text);
            },
            //初始化加载图片验证码
            loadPicCode () {
                this.timestamp = Math.random().toFixed(6)*1000000+1;
                this.$http.get( this.baseUrl + 'CodeOnle?imgKey=' + this.timestamp, {'imgKey': this.timestamp}).then((res)=>{
                    $('.picCode').attr('src',this.baseUrl + 'CodeOnle?imgKey=' + this.timestamp);
                    // console.log(this.timeStamp);
                });
            },
            //获取验证码后样式改变
            checkWordChange () {
                if(!this.isClick){
                    let i = 60;
                    this.Duable = true;
                    let id= setInterval(()=>{
                        this.clickColor = '#adadad';
                        this.isClick = true;
                        i--;
                        this.getCheckWordButton = i + 's';
                        if(i <= 0){
                            i = 0;
                            this.clickColor = '#ffc000';
                            this.isClick = false;
                            this.getCheckWordButton = '再次获取';
                            this.Duable = false;
                            clearInterval(id);
                            this.loadPicCode();  //60s之后重新加载图片验证码   图片验证码接口在验证正确后会自动清除当前缓存的图片验证码
                        }
                        // console.log(this.isClick, '样式改变中..');
                    },1000)
                }
            },
            //注册按钮点击事件
            submitClick () {
               if(!this.checkPassword(this.passwordText) || this.passwordText === ''){//输入密码
                    this.passwordShow = true;
                    setTimeout(() => {
                        this.passwordShow = false;
                    }, 1200)
                }else if(!this.checkWord(this.checkNumberText) || this.checkNumberText === ''){//输入验证码
                    this.checkShow = true;
                    setTimeout(() => {
                        this.checkShow = false;
                    }, 1400)
                }else if(this.checkPassword(this.passwordText) && this.checkWord(this.checkNumberText)){//输入校验全部正确,点击提交
                    // this.getChannelMessage();
                    this.register();   //注册
                }else if(this.phoneNumber === '' && this.passwordText === '' && this.checkNumberText === ''){//没有输入点击
                    this.checkShow = true;
                    // this.phoneNumShow = true;
                    this.passwordShow = true;
                    setTimeout(()=>{
                        // this.phoneNumShow = false;
                        setTimeout(()=>{
                            this.passwordShow = false;
                            setTimeout(()=>{
                                this.checkShow = false;
                            }, 200)
                        },200)
                    },1000)
                }else{
                    //
                }
            },
            //验证手机号是否注册
            // isPhoneExistence() {
            //     if(this.checkPhone(this.phoneNumber) && !this.Duable){
            //         let _this = this;
            //         this.$http.post(this.baseUrl+'isPhoneUsed',{phoneReg:this.phoneNumber}, {emulateJSON:true})
            //             .then(function (res) {
            //                 if(res.data.rcd === 'A0001' || res.data.rcd === 'M0008_23'){
            //                     _this.phoneTitle = '手机号已注册！';
            //                     _this.phoneNumShow = true;
            //                     _this.phoneDisplay = 'block';
            //                     setTimeout(()=>{
            //                         _this.phoneNumShow = false;
            //                         _this.phoneDisplay = "none";
            //                         _this.phoneTitle = '请输入正确的手机格式';
            //                     },1000);
            //                 }else if(res.data.rcd === 'A0002' && _this.checkPhone(_this.phoneNumber)){
            //                     //获取验证码
            //                     _this.isDuable = true;
            //                     _this.getPhoneCheckCode();
            //                 }
            //             })
            //     }else{
            //         this.phoneNumShow = true;
            //         setTimeout(()=>{
            //             this.phoneNumShow = false;
            //         },1000)
            //     }
            // },
            //获取验证码
            getPhoneCheckCode() {
                let _this = this;
                // console.log(this.isClick+ '获取验证码之前判断');
                if(!_this.isClick){   //防止多次点击
                    _this.$http.post(_this.baseUrl + 'sendPCode',{
                        phoneReg : _this.phoneNumber,
                        imgKey: _this.timestamp,
                        imgCode: _this.picCodeText,
                        source: 'pc'
                    }, {emulateJSON:true})
                        .then(function (res) {
                            if(res.data.rcd === 'R0001' || res.data.rcd === 'M0008_23'){
                                _this.checkWordChange();
                            }
                            if(res.data.rcd === 'M0008_24' || res.data.rcd === 'M0008_25'){
                                this.picCodeTitle = true;
                                setTimeout(()=>{
                                    this.picCodeTitle = false;
                                }, 1000)
                                // alert('图形验证码不正确！');
                            }
                        })
                }
            },
            //注册
            register() {
                this.$http.post(this.baseUrl + 'reg', {
                    'user.phone': this.phoneNumber,
                    'user.password': this.passwordText,
                    codeReg: this.checkNumberText,
                    inviteuserid: '',
                    cr: '',
                    invitePhone: this.friendPhone,   //好友邀请手机号
                    sourceFrom: 2,
                    im:'mobile',
                    deviceName:'触屏版',
                    deviceType:4,
                    award: this.award,    //添加注册红包字段
                },{emulateJSON:true}).then(function (res) {
                    switch (res.data.rcd){
                        case 'R0001':
                            window.location.href = "https://www.qtz360.com/link.html";
                            break;
                        case 'M0008_2':
                            this.phoneDisplay = 'block';
                            // this.phoneTitle = '手机号已注册！';
                            setTimeout(()=>{
                                this.phoneDisplay = 'none';
                                // this.phoneTitle = '请输入正确的手机格式！';
                            },1000);
                            break;
                        default   :
                            //验证码错误
                            this.checkDisplay = 'block';
                            setTimeout(()=>{
                                this.checkDisplay = 'none';
                            },1000);
                            break;
                    }
                }).catch(function (res) {
                    alert(res + '请求失败');
                })
            },
            serviceAgreement: function () {

            },
            login () {

            }
        },
        mounted(){
            this.$nextTick(function () {
                this.loadStartMessage();
            });
        }
    };
  /*  Vue.nextTick(function () {
        loadingPage.loadPicCode();
        loadingPage.submitClick();
    });*/
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    body{
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
        font-size: 0.24rem;
    }
    #redList{
        width: 100%;
        height: auto;
        background: url("../../assets/redList-bg.png") no-repeat center;
        background-size: 100% 100%;
        padding-bottom: 0.70rem;
    }
    a{text-decoration: none;-webkit-tap-highlight-color:rgba(0,0,0,0);}

    input{outline: none;-webkit-appearance: none;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(255,255,255,0);font-size: 0.24rem;}
    input:focus{
        border: 0.02rem solid #ffc000;
        border-radius:0.10rem ;
    }
    ::-webkit-scrollbar{
        width: 0.08rem;
        margin-right: 0.08rem;
    }
    ::-webkit-scrollbar-thumb{
        border-radius: 0.06rem;
        background-color: #cfcfcf;
        height: 0.40rem;
    }
    .current-phone{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: rgb(255,255,255);
        padding-top: 0.20rem;
        padding-bottom: 0.23rem;
    }
    .redList-title-one{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: url("../../assets/redList-title-bg.png") no-repeat center;
        background-size: 100% 100%;
        width: 6.29rem;
        height: 1.04rem;
        margin-left: auto;
        margin-right: auto;
        font-size: 0.24rem;
        color: rgb(255,255,255);
        p{
            max-width: 5.20rem;
        }
    }
    .qtz-promise{
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }
    .red-item-number{
        background: url("../../assets/redList-red-number.png") no-repeat center;
        background-size: 100% 100%;
        width: 2.89rem;
        height: 1.38rem;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        span{
            position: absolute;
            font-size: 0.50rem;
            font-weight: bold;
            color: rgb(255,250,84);
            text-align: center;
            width: 1.00rem;
            height: 0.50rem;
            top: 0.26rem;
            right: 0.47rem;
        }
    }
    .input-same{
        display: block;
        width: 6.28rem;
        height: 0.86rem;
        padding-left: 0.30rem;
        outline: hidden;
        border: 0.02rem solid #adadad;
        border-radius: 0.10rem;
    }
    .register-form{
        width: 7.04rem;
        height: 7.00rem;
        margin-left: auto;
        margin-right: auto;
        top: 0;
        position: relative;
        border: 0.03rem solid #ffb423;
        border-radius: 0.10rem;
        background-color: #ffffff;
        color: #adadad;
        font-size: 0.28rem;
    }
    .traffic_register_bg{
        position: relative;
        width: 100%;
        padding: 0;
        border: 0;
        margin: 0;
        display: block;
    }
    .traffic_from{
        width: 100%;
        position: relative;
        /*top: 9.50rem;*/
        height: auto;
        padding-top: 0.27rem;
        padding-bottom: 0.10rem;
    }
    .register-center{
        width: 6.60rem;
        height: 7.15rem;
        margin: 0 auto;
    }
    .input-container{
        width: 100%;
        height: 0.89rem;
        margin-top: 0.50rem;
        position: relative;
    }
    .input-container>p{
        display: block;
        position: absolute;
        width: 3.00rem;
        height: 0.66rem;
        background: rgba(0,0,0, 0.5);
        color: #ffffff;
        text-align: center;
        line-height: 0.66rem;
        top: -0.33rem;
        left: 1.80rem;
        border-radius: 0.15rem;
    }
    .input-container>img{
        position: absolute;
        width: 0.44rem;
        height: 0.44rem;
        top: 0.22rem;
        right: 0.29rem;
    }
    .input-same{
        display: block;
        width: 6.28rem;
        height: 0.86rem;
        padding-left: 0.30rem;
        outline: hidden;
        border: 0.02rem solid #adadad;
        border-radius: 0.10rem;
    }
    .get-check{
        width: 1.72rem;
        border-left:0.01rem solid  #adadad;
        height: 0.50rem;
        text-align: center;
        line-height: 0.50rem;
        color:#ffc000;
        position: absolute;
        top: 0.18rem;
        right: 0;
    }
    .agree-consent{
        width: 100%;
        height: 0.72rem;
        text-align: left;
        line-height: 0.72rem;
        a{
            color: #ffc000;
        }
    }
    .now-register{
        display: block;
        width: 100%;
        height: 0.97rem;
        background: url("../../assets/register-button.png") no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;
    }
    .now-register:hover{
        animation: registerButton 0.5s 0.1s ease both;
    }
    @keyframes registerButton {
        0%{background-size: 100% 100%;}
        50%{background-size: 102% 102%}
        100%{background-size: 100% 100%}
    }
    .readyed-register{
        width: 100%;
        display: block;
        height: 0.56rem;
        text-align: center;
        line-height: 0.56rem;
        a{
            color: #ffc000;
        }
    }
   /* !*弹框*!
    .red-bg-container{
        display: none;
        width: 7.50rem;
        background: rgba(0,0,0, 0.6);
        height: 24.10rem;
        position: fixed;
        top: 0;
        z-index: 2;
    }
    .rules-list-bg{
        width: 7.03rem;
        height: 7.16rem;
        position: absolute;
        top: 0.90rem;
        background: url("../assets/red-rule-list@2x.png") no-repeat center;
        background-size: 7.03rem 7.16rem;
        left: 0.42rem;
    }
    .rules-black-bg{
        position: absolute;
        top: 0.90rem;
        left: 0.17rem;
        width: 6.42rem;
        height: 5.18rem;
        overflow: hidden;
    }
    .close-bg{
        width: 0.68rem;
        height: 0.68rem;
        position: absolute;
        left: 2.90rem;
        bottom: -0.68rem;
        background: url('./../assets/close-bg@2x.png') no-repeat center;
        background-size: 100% 100%;
    }
    !*红包列表进入效果*!
    .animationRulesText{
        animation:bounceInText 1s .2s ease both;}
    @keyframes bounceInText{
        0%{opacity:0;
            transform:scale(.3)}
        50%{opacity:1;
            transform:scale(1.05)}
        70%{transform:scale(.9)}
        100%{transform:scale(1);}
    }
    !*红包出去效果*!
    .animationRulesOutContent{
        animation:bounceOutContent 1s .2s ease both;}
    @keyframes bounceOutContent{
        0%{transform:scale(1);}
        25%{transform:scale(.95)}
        50%{opacity:1;
            transform:scale(1.1)}
        100%{opacity:0;
            transform:scale(.3);}
    }*/
</style>
