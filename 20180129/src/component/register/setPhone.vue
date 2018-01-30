<template>
    <div class="set-phone-container">
        <p @click="backFun">返回上一页</p>
        <div>助力好友开红包</div>
        <div style="width: 80%;height: 4.00rem;background-color: red;margin-left: auto;margin-right: auto;"></div>
        <p class="qtz-promise">* 晴天助承诺不会泄露您手机号</p>
        <div class="input-container" style="margin-top: 0">
            <input placeholder="请输入手机号" class="input-same"
                   type="text" v-model="phoneNumber" v-on:blur="checkPhone(phoneNumber)" maxlength="11"/>
            <img src="../../assets/correct-icon@2x.png" v-show="checkPhone(phoneNumber)"/>
            <p v-show="phoneNumShow" v-bind:style="{'display': phoneDisplay}">{{phoneTitle}}</p>
        </div>
        <router-link :to="{name:'register'}">立即领取</router-link>
    </div>
</template>

<style scoped type="text/css" lang="scss" rel="stylesheet/scss">
    .set-phone-container{
        display: flex;
        flex-direction: column;
    }
    .qtz-promise{
        display: block;
        width: 100%;
        height: 0.76rem;
        text-align: center;
        line-height: 0.76rem;
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
        margin-left: auto;
        margin-right: auto;
    }
</style>


<script>

    export default {
        name:'register',
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
            }
        },
        mounted: function () {
            // this.$nextTick(function () {
            //     this.submitClick();
            // })
        },
        created: function () {

        },
        methods:{
            //返回上一页
            backFun(){
                this.$store.commit('backFun')
            },
            //手机号码格式验证
            checkPhone: (text) => {
                let filter = /^1[3456789]\d{9}$/;
                if((filter.test(text))) {
                    this.phoneNumShow = false;
                }
                return (/^1[34578]\d{9}$/.test(text));
            },
            //验证手机号是否注册
            isPhoneExistence() {
                if(this.checkPhone(this.phoneNumber) && !this.Duable){
                    let _this = this;
                    this.$http.get(this.baseUrl+'isPhoneUsed',{phoneReg:this.phoneNumber})
                        .then(function (res) {
                            if(res.data.rcd === 'A0001' || res.data.rcd === 'M0008_23'){
                                _this.phoneTitle = '手机号已注册！';
                                _this.phoneNumShow = true;
                                _this.phoneDisplay = 'block';
                                setTimeout(()=>{
                                    _this.phoneNumShow = false;
                                    _this.phoneDisplay = "none";
                                    _this.phoneTitle = '请输入正确的手机格式';
                                },1000);
                            }
                        })
                }else{
                    this.phoneNumShow = true;
                    setTimeout(()=>{
                        this.phoneNumShow = false;
                    },1000)
                }
            },
            //获取渠道分享人的信息
            getChannelMessage() {
                this.$http.get(this.baseUrl + 'channel/'+ this.sn)
                    .then(function (res) {
                        if(res.data.rcd === 'R0001'){
                            this.channelId = res.data.id;
                            this.channelCookie = res.data.cookie;
                            this.register();   //注册
                        }else{
                            // console.log('渠道获取成功'+ res.data.rmg);
                        }
                    }).catch(function (res) {
                })
            },
            backFun(){
                this.$store.commit('backFun')
            }
        }
    };

</script>