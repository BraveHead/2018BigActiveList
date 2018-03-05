$(document).ready(function () {
    NativeJs();
    //线上图片地址
    // let imgUrl = 'https://img.qtz360.com/mobile';
    //测试线上地址
    let imgUrl = 'https://test.qtz360.com/web';
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
                    $('.my-account-all').html(res.data.tenderAccount);   //投资总额度
                    $('.my-account-use').html(res.data.userKey.remainKey);  //当前剩余可用总额度
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
            $('.bg-alert').hide();
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
                    if (res.data[i].type !== '1') {
                        moduleOneList.append(`
                              <li style="background:url(${imgUrl + res.data[i].logo});background-size: 100% 100%;">
                                    <p class="module-item-name" style="top: 2.20rem;">${res.data[i].name}</p>
                                    <p class="module-item-condition">(不限兑换次数)</p>
                                    <div class='module-submit-container'>
                                        <span>消耗投资额：</span>
                                        <span>${(parseInt(res.data[i].credits))/10000}万元</span>
                                        <img src="./assets/go-exchange.png" class="submit-exchange ${'type'+res.data[i].id}" dataType="${res.data[i].id}" typeOnce="${res.data[i].type}"/>
                                    </div>
                                    <img src="./assets/exchange-once.png" class="exchange-once"/>
                              </li>
                        `);
                    } else {
                        moduleOneList.append(`
                              <li style="background:url('${imgUrl + res.data[i].logo}');background-size: 100% 100%;">
                                    <p class="module-item-name">${res.data[i].name}</p>
                                    <div class='module-submit-container'>
                                        <span>消耗投资额：</span>
                                        <span>${(parseInt(res.data[i].credits))/10000}万元</span>
                                        <img src="./assets/go-exchange.png" class="submit-exchange ${'type'+res.data[i].id}" dataType="${res.data[i].id}" typeOnce="${res.data[i].type}"/>
                                    </div>
                              </li>
                        `);
                    }
                }
                showUserExchangeable();   //加载用户可兑换商品列表
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
            //  TODO get_user_for_record接口兑换记录为空状态码也为0000,有数据

            for(let i=0;i<res.data.double11Order.length;i++){
                //只能兑换一次并且已经兑换
                if($('.type'+ res.data.double11Order[i].goodsId).attr('typeOnce') === '1'){
                    $('.type'+ res.data.double11Order[i].goodsId).attr({
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
        $('.submit-exchange').off().on('touchstart', function (e) {
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
                            $('.alert-contianer').html(`
                                 <div class="alert-content">
                                    <h3 class="alert-title" style="padding-top: 0.50rem;">兑换成功</h3>
                                    <p class="alert-same-text" style="padding-top: 0.30rem;">您成功兑换${res.data.name}</p>
                                    <p class="alert-same-text" style="padding-top: 0.12rem;">消耗兑换额度40000元</p>
                                    <img src="./assets/tz.png" class="same-submit go-tz" style="margin-left: 0.48rem;margin-top: 0.20rem;"/>
                                    <img src="./assets/go-dh.png" class="same-submit jx-dh" style="margin-left: 0.30rem;margin-top: 0.20rem;"/>
                                </div>
                                <img src="./assets/close-bg.png" class="close-bg"/>
                        `);
                        }else{
                            $('.alert-contianer').html(`
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
                            if(dataType === '1'){
                                currentDom.attr('src','./assets/exchange-over.png');
                            }
                            $('.bg-alert').hide();
                        });
                        //去投资或者关闭继续兑换
                        $('.go-tz').off().on('touchstart', function () {
                            goOrNotLogin(function () {
                                NativeJs.prototype.androidIosJs({
                                    'android': 'androidToToList',
                                    'ios': 'activityToList',
                                    'url': '/project/list'
                                });
                            });
                        })
                    });
                }
            });
        });
    }
    //查看兑换记录
    function checkExchangeHistroy() {
        $('.exchange-history').off().on('touchstart', function (e) {
            goOrNotLogin(function () {
                //加载弹框方法
                showAndHideAlert(function () {
                    //填充弹框
                    $('.alert-contianer').html(`
                    <div class="alert-contianer" style="height: 5.20rem;background-size: 5.78rem 5.60rem;">
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
                            <img src="./assets/go-tz.png" class="same-submit go-tz" style="margin-left: 1.40rem;"/>
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
                        //TODO 兑换记录商品返回的数据名改下  无兑换记录也是0000状态
                        historyUl.empty();
                        for (let i = 0; i < res.data.double11Order.length; i++) {
                            historyUl.append(`
                                <li>
                                    <span>${res.data.double11Order[i].goodsName}</span>
                                    <span>${res.data.double11Order[i].nums}</span>
                                    <span>${res.data.double11Order[i].goodsCredits}</span>
                                </li>
                            `);
                        }
                        $('.shengyu-account span').html(res.data.userKey.remainKey);
                    } else {
                        historyUl.html(`<li style="text-align: center;line-height: 1.30rem;width: 100%;">${res.rmg}</li>`)
                    }
                });
            })
        })
    }

    function init() {
        NativeJs.prototype.topLeftBack();   //左上角关闭按钮
        loadUserInfo();
        loadingCommodityList();
        checkExchangeHistroy();
    }

    init();
});