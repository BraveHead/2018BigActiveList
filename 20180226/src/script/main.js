$(document).ready(function () {
    NativeJs();
    let choiceType = null,  //选择的答案
        number = 0,   //是不是连续答对
        canAnswer = true;   //是否可以答题
    let $submit = $('.submit');
    let list = $('.deng-list');
    //点击弹出规则
    $('.hd-btn').on('touchstart', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        $('.alert-text').html(`
             <div class="alert-text-center">
                <h3 class="hd-rules-title">活动规则</h3>
                <p class="hd-rules-text">
                    活动期间，晴天助每天上线猜灯谜活动，用户参与猜灯谜活动且猜对灯谜可随机获得奖励(现金、抵扣红包还有花灯随机发放)，每天每个用户仅有一次猜灯谜机会，猜错则不获得奖励且机会失效。
                </p>
            </div>
        `);
        $('.alert-container').show();
        $('.alert-content').fadeIn();
        $('.close-bg').on('touchstart', function (event) {
            let e = window.event||event;
            e.stopPropagation();
            $('.alert-container,.alert-content').hide();
        })
    });
    //页面滚动，去投资按钮隐藏
    // $(document).off().on('touchstart', function (event) {
    //     let e = window.event||event;
    //     e.stopPropagation();
    //     alert('start');
    // });
    // alert('123');
    $(document).off().on('touchmove', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        $('.go-project-list').hide();
    });
    $(document).on('touchend', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        $('.go-project-list').show();
    });
    //去投资
    $('.go-project-list').on('touchstart', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        goOrNotLogin(function () {
            NativeJs.prototype.androidIosJs({
                'android': 'androidToToList',
                'ios': 'activityToList',
                'url': '/project/list'
            });
        })
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
            })
        }
    }

    //加载题目
    function loadQuestions() {
        $.ajax({
            url: window.commonRequestPrefix + 'get_lantern_question',
            dataType: 'json',
            method: 'GET',
            data: {}
        }).done((res) => {
            if (res.rcd === '0000') {
                $('.question-title').html(res.data.question);
                $('.question-a').html(res.data.a);
                $('.question-b').html(res.data.b);
                loadingFriends();
            } else {
                $submit.attr('src', './assets/submit-end.png');
                list.html('');
                for (let i = 0; i < 10; i++) {
                    list.append(`<img src="./assets/deng-no.png"/>`);
                }
            }
        })
    }

    //加载投资好友和红灯数量
    function loadingFriends() {
        if (NativeJs.prototype.isLogin()) {
            $.ajax({
                url: window.commonRequestPrefix + 'get_yuanxiao_num',
                dataType: 'json',
                method: 'POST',
                data: {
                    token: NativeJs.prototype.getToken(),
                }
            }).done((res) => {
                if (res.rcd === '0000') {
                    number = res.data.continueTime;
                    //花灯展示
                    list.html('');
                    for (let i = 0; i < res.data.totalNum; i++) {  //点亮的
                        list.append(`<img src="./assets/deng-active.png"/>`);
                    }
                    for (let i = 0; i < 10 - Number(res.data.totalNum); i++) {
                        list.append(`<img src="./assets/deng-no.png"/>`);
                    }
                    if (res.data.flag === 1) {    //今天答题完成后置灰
                        $submit.attr('src', './assets/submit-over.png');
                        canAnswer = false;
                    }
                    $('.friends-number').html(res.data.friendNum);
                    $('.deng-number').html(res.data.totalNum);
                } else {
                    canAnswer = false;
                    list.html('');
                    for (let i = 0; i < 10; i++) {
                        list.append(`<img src="./assets/deng-no.png"/>`);
                    }
                }
                submitAnswer(number);   //提交答案
            });
        } else {
            list.html('');
            for (let i = 0; i < 10; i++) {
                list.append(`<img src="./assets/deng-no.png"/>`);
            }
            submitAnswer(number);   //提交答案
        }
    }

    //邀请好友，点击分享链接
    $('.yq-btn').on('touchstart', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        goOrNotLogin(function () {
            //APP端点击分享直接调用各自的方法，禁止app内内置浏览器的分享
            if (window.location.href.indexOf('isAPP') === -1) {
                $('.bg-alert').fadeIn();
                $('.bot').on('touchstart', function (event) {
                    let e = window.event||event;
                    e.stopPropagation();
                    $('.bg-alert').fadeOut();
                });
            } else {
                //
            }
            $.ajax({
                url: window.commonRequestPrefix + 'friendInvite',
                dataType: 'json',
                method: 'POST',
                data: {
                    token: NativeJs.prototype.getToken(),
                }
            }).done((res) => {
                let self = this;
                //正式
                // let shareArr = res.tgNo.split('?');
                // let shareUrl = shareArr[0] + 'index.html?' + shareArr[1];
                let shareUrl = res.tgNo;
                NativeJs.prototype.androidIosJs({
                    android: 'activityToShare',
                    ios: 'activityToShare',
                    url: 'activityToShare',
                    fx: {
                        shareUrl: shareUrl,
                        shareTitle: '正月十五福利来袭',
                        shareDesc: "点花灯、猜灯谜，壕气返现等你领取。",
                        shareIcon: 'https://www.qtz360.com/h5/html/activity/20180302/assets/share-icon.jpg'
                    },
                    wxfx: function () {
                        wxfx({
                            title: '正月十五福利来袭',
                            desc: "点花灯、猜灯谜，壕气返现等你领取。",
                            link: shareUrl,
                            imgUrl: 'https://www.qtz360.com/h5/html/activity/20180302/assets/share-icon.jpg',
                            cancel: function () {
                            },       //取消分享回调方法  可省略
                            success: function () {
                            }       //完成分享回调方法  可省略
                        });
                    }
                });
            });
        });
    });

    //查看收货地址
    $('.address-btn').on('touchstart', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        goOrNotLogin(function () {
            if (isMallAddressSet === 0) {
                NativeJs.prototype.androidIosJs({
                    android: 'androidToAddress',
                    ios: 'activityToAddress',
                    url: 'activityToAddress',
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
    //选择答案
    let $choice = $('.choice-answer');
    $choice.on('touchstart', function (event) {
        let e = window.event||event;
        e.stopPropagation();
        let index = $choice.index(this);
        console.log(index);
        index === 0 ? choiceType = 'a' : choiceType = 'b';
        $('.choice').attr({
            'src': './assets/no-choice.png'
        });
        $('.choice').eq(index).attr({
            'src': './assets/choice.png',
        });
    });

    //点击提交答案
    function submitAnswer(number) {
        if (canAnswer) {
            $submit.on('touchstart', function (event) {
                let e = window.event||event;
                e.stopPropagation();
                if (choiceType === null) {
                    $('.alert-text').html(`
                                      <div class="alert-text-center">
                                        <h3 class="q-title"><img src="./assets/ku.png"/><span>请先选择答案哦！</span></h3>
                                      </div>
                                    `);
                    $('.alert-container').show();
                    $('.alert-content').fadeIn();
                    $('.close-bg').on('touchstart', function (event) {
                        let e = window.event||event;
                        e.stopPropagation();
                        $('.alert-container,.alert-content').hide();
                    })
                } else {
                    goOrNotLogin(function () {
                        $.ajax({
                            url: window.commonRequestPrefix + 'answer_question',
                            dataType: 'json',
                            method: 'POST',
                            data: {
                                token: NativeJs.prototype.getToken(),
                                rightAnswer: choiceType,
                            }
                        }).done((res) => {
                            canAnswer = false;
                            switch (res.rcd) {
                                case '0000':   //答题正确
                                    if (number > 0) {
                                        number -=1;  //答完题之后题目数量展示少1
                                        if(number < 0){
                                            number = 0;
                                        }
                                        $('.alert-text').html(`
                                      <div class="alert-text-center">
                                        <h3 class="q-title" style="padding-top: 0.75rem;"><img src="./assets/xiao.png"/><span>猜对了，请明天再来吧！</span></h3>
                                        <p class="q-text">您获得了${res.data.name}</p>
                                        <p class="q-text-two">Tips:再连续<span>${number}</span>天答对灯谜，即可获得一个花灯奖励</p>
                                      </div>
                                    `);
                                    } else {
                                        $('.alert-text').html(`
                                      <div class="alert-text-center">
                                        <h3 class="q-title"><img src9="./assets/xiao.png"/><span>猜对了，请明天再来吧！</span></h3>
                                        <p class="q-text">您获得了${res.data.name}</p>
                                      </div>
                                    `);
                                    }
                                    $('.alert-container').show();
                                    $('.alert-content').fadeIn();
                                    loadingFriends();   //数据提交，刷新
                                    break;
                                case '1111':   //答题错误
                                    $('.alert-text').html(`
                                      <div class="alert-text-center">
                                        <h3 class="q-title"><img src="./assets/ku.png"/><span>猜错了，请明天再来吧！</span></h3>
                                        <p class="q-text">正确答案：${res.rmg}</p>
                                      </div>
                                    `);
                                    $('.alert-container').show();
                                    $('.alert-content').fadeIn();
                                    loadingFriends();   //数据提交，刷新
                                    break;
                                default:     //今日已经答题
                                    $('.alert-text').html(`
                                      <div class="alert-text-center">
                                        <h3 class="q-title"><img src="./assets/xiao.png"/><span>今日已答题，请明天再来吧！</span></h3>
                                      </div>
                                    `);
                                    $('.alert-container').show();
                                    $('.alert-content').fadeIn();
                                    loadingFriends();   //数据提交，刷新
                                    break;
                            }
                            $('.close-bg').on('touchstart', function (event) {
                                let e = window.event||event;
                                e.stopPropagation();
                                $('.alert-container,.alert-content').hide();
                            })
                        });
                    });
                }
            });
        }
    }

    function init() {
        NativeJs.prototype.topLeftBack();   //左上角关闭按钮
        //隐藏APP右上角本地分享按钮
        //android部分机型方法可执行，但是报错，故用try catch
        try {
            NativeJs.prototype.androidIosJs({
                android: 'androidToGetUrl',
                ios: 'activityShareUrl',
                url: 'activityShareUrl',
                fx: {
                    url: 'https://www.qtz360.com/h5/html/activity/20180302/index.html'
                },
                toggle: 0
            });
        } catch (e) {

        }
        loadQuestions();
    }

    init();
});