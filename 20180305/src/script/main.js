$(document).ready(function () {
    NativeJs();
    //线上图片地址
    let imgUrl = 'https://img.qtz360.com/mobile';
    //测试线上地址
    // let imgUrl = 'https://test.qtz360.com/web';
    //去投资
    $('.go-project-list').on('touchstart', function (event) {
        let e = window.event || event;
        e.stopPropagation();
        goOrNotLogin(function () {
            NativeJs.prototype.androidIosJs({
                'android': 'androidToToList',
                'ios': 'activityToList',
                'url': '/project/list'
            });
        });
    });

    //登录判断逻辑
    function goOrNotLogin(callback) {
        if (NativeJs.prototype.isLogin()) {
            callback();   //登录后的回调
        } else {
            NativeJs.prototype.androidIosJs({
                android: 'androidToLogin',
                ios: 'activityToLogin',
                url: 'activityToLogin'
            });
        }
    }
    //加载个人的投资额
    function loadUserInfo() {
        if (NativeJs.prototype.isLogin()) {
            $.ajax({
                url: window.commonRequestPrefix + 'get_user_info',
                dataType: 'json',
                method: 'POST',
                data: {
                    token: NativeJs.prototype.getToken(),
                }
            }).done((res) => {
                if (res.rcd === '0000') {
                    $('.my-account-all').html(res.data.tenderAccount + '元');   //投资总额度
                    $('.my-account-use').html(res.data.userKey.remainKey + '元');  //当前剩余可用总额度
                } else {
                    //未登录或者其他状态
                }
            })
        } else {
            $('.go-check-account').off().on('touchstart', function (e) {
                goOrNotLogin(function () {
                    //未登录直接登录
                });
            });

        }
    }

    //弹框的显示与隐藏
    function showAndHideAlert(callback) {
        $('.bg-alert').show();
        callback();
        $('.close-bg').on('touchstart', function (event) {
            let  e = event || window.event;
            e.stopPropagation();
            $('.bg-alert').fadeOut();
        });
    }

    //获取商品列表（未登录）
    function loadingCommodityList() {
        $.ajax({
            url: window.commonRequestPrefix + 'get_goods_list',
            dataType: 'json',
            method: 'GET',
            data: {}
        }).done((res) => {
            let moduleOneList = $('.module-one-list');
            moduleOneList.empty();
            if (res.rcd === '0000') {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].type === '1') {
                        moduleOneList.append(`
                              <li class="submit-exchange ${'type'+res.data[i].id}" dataType="${res.data[i].id}" 
                              typeOnce="${res.data[i].type}" style="background:url(${imgUrl + res.data[i].logo});background-size: 100% 100%;">
                                    <p class="module-item-name">${res.data[i].name}</p>
                                    <div class='module-submit-container'>
                                        <span>消耗投资额：</span>
                                        <span>${(parseInt(res.data[i].credits))/10000}万元</span>
                                        <img src="./assets/go-exchange.png" class="is-exchange"/>
                                    </div>
                                    <img src="./assets/exchange-once.png" class="exchange-once"/>
                              </li>
                        `);
                    } else {
                        moduleOneList.append(`
                              <li class="submit-exchange ${'type'+res.data[i].id}" dataType="${res.data[i].id}" 
                              typeOnce="${res.data[i].type}" style="background:url('${imgUrl + res.data[i].logo}');background-size: 100% 100%;">
                                    <p class="module-item-name" style="top: 2.20rem;">${res.data[i].name}</p>
                                    <p class="module-item-condition">(不限兑换次数)</p>
                                    <div class='module-submit-container'>
                                        <span>消耗投资额：</span>
                                        <span>${(parseInt(res.data[i].credits))/10000}万元</span>
                                        <img src="./assets/go-exchange.png" class="is-exchange"/>
                                    </div>
                              </li>
                        `);
                    }
                }
                if(NativeJs.prototype.isLogin()){
                    showUserExchangeable();   //登录展示用户可兑换
                }else{
                    exchangeSubmit();    //未登录直接绑定点击事件
                }
            } else {
                alert(res.rmg);
            }
        });
    }
    //展示用户可兑换的商品列表
    function showUserExchangeable() {
        $.ajax({
            url: window.commonRequestPrefix + 'get_user_for_record',
            dataType: 'json',
            method: 'POST',
            data: {
                token: NativeJs.prototype.getToken(),
            }
        }).done((res) => {
            for(let i=0;i<res.data.double11Order.length;i++){
                //只能兑换一次并且已经兑换
                if($('.type'+ res.data.double11Order[i].goodsId).attr('typeOnce') === '1'){
                    $('.type'+ res.data.double11Order[i].goodsId).find('.is-exchange').attr({
                        'src': './assets/exchange-over.png',
                        'isExchange': false,
                    });
                }
            }
            exchangeSubmit();   //点击兑换
        });
    }
    //点击兑换
    function exchangeSubmit() {
        $('.submit-exchange').off().on('click', function (e) {
            let dataType = $(this).attr('dataType');
            let currentDom = $(this);
            goOrNotLogin(function () {
                renderBackResult();
                function renderBackResult() {
                    $.ajax({
                        url: window.commonRequestPrefix + 'get_project',
                        dataType: 'json',
                        method: 'POST',
                        data: {
                            'token': NativeJs.prototype.getToken(),
                            'order.nums': 1,
                            'order.goodsId':  dataType
                        }
                    }).done((res) => {
                        if (res.rcd === '0000') {
                            //填充弹框  TODO  接口返回数添加消耗额度
                            $('.alert-contianer').css({
                                'height':'4.62rem',
                                'background': 'url("./assets/alert-bg.png")',
                                'background-size':'5.78rem 4.62rem'
                            }).html(`
                                 <div class="alert-content">
                                    <h3 class="alert-title" style="padding-top: 0.50rem;">兑换成功</h3>
                                    <p class="alert-same-text" style="padding-top: 0.30rem;">您成功兑换${res.data.name}</p>
                                    <p class="alert-same-text" style="padding-top: 0.12rem;">消耗兑换额度${res.data.residue}元</p>
                                    <img src="./assets/tz.png" class="same-submit go-tz" style="margin-left: 0.48rem;margin-top: 0.20rem;"/>
                                    <img src="./assets/go-dh.png" class="same-submit jx-dh" style="margin-left: 0.30rem;margin-top: 0.20rem;"/>
                                </div>
                                <img src="./assets/close-bg.png" class="close-bg"/>
                        `);
                            $('.my-account-use').html(res.data.credits + '元');
                            if(currentDom.attr('typeonce') === '1'){
                                currentDom.find('.is-exchange').attr('src','./assets/exchange-over.png');
                            }
                        }else{
                            $('.alert-contianer').css({
                                'height':'4.62rem',
                                'background': 'url("./assets/alert-bg.png")',
                                'background-size':'5.78rem 4.62rem'
                            }).html(`
                                 <div class="alert-content">
                                    <h3 class="alert-title" style="padding-top: 0.50rem;">兑换失败</h3>
                                    <p class="alert-same-text" style="padding-top: 0.40rem;">${res.rmg}</p>
                                    <img src="./assets/go-tz.png" class="same-submit go-tz" style='margin-left:1.40rem;margin-top: 0.50rem;'/>
                                </div>
                                <img src="./assets/close-bg.png" class="close-bg"/>
                            `);
                        }
                        //弹框关闭和显示
                        $('.bg-alert').show();
                        $('.close-bg, .jx-dh').on('touchstart', function (event) {
                            let e = event || window.event;
                            e.stopPropagation();
                            $('.bg-alert').fadeOut();
                        });
                        //去投资
                        goTz();
                    });
                }
            });
        });
    }

    //去投资或者关闭继续兑换
    function goTz() {
        $('.go-tz').off().on('touchstart', function () {
            goOrNotLogin(function () {
                NativeJs.prototype.androidIosJs({
                    'android': 'androidToToList',
                    'ios': 'activityToList',
                    'url': '/project/list'
                });
            });
        })
    }
    //查看兑换记录
    function checkExchangeHistroy() {
        $('.exchange-history').off().on('touchstart', function (e) {
            goOrNotLogin(function () {
                //加载弹框方法
                showAndHideAlert(function () {
                    //填充弹框
                    $('.bg-alert').html(`
                    <div class="alert-contianer" style="height: 5.20rem;background:url('./assets/alert-bg-two.png');background-size: 5.78rem 5.12rem;">
                        <div class="alert-content" style="margin-top: -0.70rem;">
                            <h3 class="alert-title" style="padding-top: 0.30rem;">兑换记录</h3>
                            <div class="histroy-container">
                                <p class="history-same-style">
                                    <span>兑换商品</span>
                                    <span>数量</span>
                                    <span>消耗投资额度</span>
                                </p>
                                <ul class="history-ul">
                                  
                                </ul>
                            </div>
                            <p class="shengyu-account">剩余可兑换额度：<span>10000</span>元</p>
                            <img src="./assets/go-tz.png" class="same-submit go-tz" style="margin-left: 0.48rem;margin-top: 0.10rem;"/>
                            <img src="./assets/get-address.png" class="same-submit go-address" style="margin-left: 0.30rem;margin-top: 0.10rem;"/>
                        </div>
                        <img src="./assets/close-bg.png" class="close-bg"/>
                    </div>
                `);
                });
                //填充兑换记录
                $.ajax({
                    url: window.commonRequestPrefix + 'get_user_for_record',
                    dataType: 'json',
                    method: 'POST',
                    data: {
                        token: NativeJs.prototype.getToken(),
                    }
                }).done((res) => {
                    let historyUl = $('.history-ul');
                    if (res.rcd === '0000') {
                        historyUl.empty();
                        if(res.data.double11Order.length>0){
                            for (let i = 0; i < res.data.double11Order.length; i++) {
                                historyUl.append(`
                                <li>
                                    <span>${res.data.double11Order[i].goodsName}</span>
                                    <span>${res.data.double11Order[i].nums}</span>
                                    <span>${res.data.double11Order[i].goodsCredits}</span>
                                </li>
                            `);
                            }
                        }else{
                            historyUl.html(`<li style="text-align: center;line-height: 1.30rem;width: 100%;">暂无兑换记录</li>`)
                        }
                        $('.shengyu-account span').html(res.data.userKey.remainKey);
                    } else {
                        historyUl.html(`<li style="text-align: center;line-height: 1.30rem;width: 100%;">${res.rmg}</li>`)
                    }
                    //去投资
                    goTz();
                    //去查看收货地址
                    $('.go-address').off().on('touchstart', function () {
                        if (isMallAddressSet === 0) {
                            NativeJs.prototype.androidIosJs({
                                android: 'androidToAddress',
                                ios: 'activityToAddress',
                                url: 'activityToAddress'
                            })
                        } else {
                            NativeJs.prototype.androidIosJs({
                                android: 'androidToAddress',
                                ios: 'activityToAddress',
                                url: 'activityToAddress',
                                mallAddress: mallAddress
                            })
                        }
                    });
                });
            })
        })
    }

    function init() {
        wxfx({
            title: '女神节福利',
            desc: "做一个精致的小公举，京东卡、现金，统统免费送。",
            link: 'https://www.qtz360.com/h5/html/activity/20180307/index.html',
            imgUrl: 'https://www.qtz360.com/h5/html/activity/20180307/assets/shareIcon.jpg',
            cancel: function () {
            },       //取消分享回调方法  可省略
            success: function () {
            }       //完成分享回调方法  可省略
        });
        NativeJs.prototype.topLeftBack();   //左上角关闭按钮
        loadUserInfo();
        loadingCommodityList();
        checkExchangeHistroy();
    }

    init();
});