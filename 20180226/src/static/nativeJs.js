function NativeJs() {
    //跳转微信端前缀this
    // window.url = 'https://test.qtz360.com/h5/home.html#';     //测试环境
    this.url = 'https://www.qtz360.com/h5/home.html#';     //生产环境
    //跳转微信端首页
    // window.indexUrl = 'https://test.qtz360.com/h5/index.html';    //测试环境
    this.indexUrl = 'https://www.qtz360.com/h5/index.html';    //生产环境
    //获取body
    window.body = document.body;
    //返回首页关闭图片
    window.guanbi = 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYBAMAAACDuy0HAAAAD1BMVEUAAAAzMzM1NTU0NDQ1NTUvBFDLAAAABXRSTlMA/leKMCqUH30AAACJSURBVEjH7ZS7DYAwDAURsICBAZINYAPYfymEhOWOs+SC5l3l4uWUj+NBCCHEJ3OUJ4aP5tW4UnayxctuO4Qvs/aKzTYIj+bq/iwDPBOrWB1iVoeY1SHOqF2cUrs4pXZxSh1iVrOYw7yN+gH56vhR6s/NjcQtWm9+/lb8YeujgIcMjy8hhBD/cQPAXQ6dExWv1wAAAABJRU5ErkJggg==';
}

//左上角页面关闭按钮 obj.topLeftBack(),一次显示，再一次隐藏
NativeJs.prototype.topLeftBack = function () {
    console.log();
    if (document.getElementById('topLeftBack')) {
        window.body.removeChild(document.getElementById('topLeftBack'));
    } else if (!this.isApp()) {
        var dom = '<a id="topLeftBack" href="' + window.indexUrl + '"><img src="' + window.guanbi + '" alt="" style="width: 44px;position:' +
            ' absolute;top:0;left:0;background-color: rgba(255, 255, 255, .5);z-index: 100;"></a>';
        document.body.insertAdjacentHTML('afterBegin', dom);
    }
};

/******************* native js 交互部分 ****************************/
// ios js 交互需要的第三方库     外部不调用
NativeJs.prototype.setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
};

//是否为APP打开  obj.isApp()
NativeJs.prototype.isApp = function () {
    var result = false;

    if (window.location.href.indexOf('isAPP=') !== -1) {
        var isAPP = this.getUrl('isAPP', window.location.href.slice(window.location.href.indexOf('isAPP=')));
        if (isAPP == 1) {
            result = true;
        }
    }
    return result;
};
/**
 * 设置Cookie
 * @param c_name   key
 * @param value   value
 */
NativeJs.prototype.setCookie = function (c_name,value) {
   document.cookie = c_name + '=' + value;
};

//获取token   obj.getToken()
NativeJs.prototype.getToken = function () {
    var token = '';
    if (this.isApp()) {
        token = this.getUrl('token', window.location.href.slice(window.location.href.indexOf('token=')));
    } else {
        token = this.getCookie('token');
    }
    return token;
};

//获取url参数   obj.getUrl()
NativeJs.prototype.getUrl = function (key, pathname) {
    var name = key + "=";
    var ca = pathname.split('&');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

//获取cookie  obj.getCookie()
NativeJs.prototype.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

//用户是否登录    obj.isLogin()
NativeJs.prototype.isLogin = function () {
    console.log(this);
    var token = this.getToken() || '';
    var result = false;
    $.ajax({
        type: 'POST',
        url: window.commonRequestPrefix + 'user',
        dataType: 'json',
        data: {token: token},
        async: false,
        success: function (_data) {
            if (_data.rcd === 'R0001') {
                result = true;
                window.isMallAddressSet = _data.isMallAddressSet;
                window.mallAddress = _data.mallAddress;
            } else {
                result = false;
            }
        }
    });
    return result;
};
//nativeJS交互    obj.androidIosJs(obj)
NativeJs.prototype.androidIosJs = function (obj) {
    var o = obj || {};
    if (this.isApp()) {
        var fx = o.fx ? o.fx : {};
        var toggle = o.toggle ? o.toggle : 0; //1=显示 0=隐藏
        if (window[o.android]) {
            switch (o.android) {
                //收货地址判断
                case 'androidToAddress':
                    var mallAddress = o.mallAddress ? JSON.stringify(o.mallAddress) : '';
                    window[o.android][o.android](isMallAddressSet, mallAddress);
                    break;
                //页面加载直接分享
                case 'androidToGetUrl':
                    window[o.android][o.android](fx.shareUrl, toggle);
                    break;
                //点击分享,邀请好友
                case 'androidToShare':
                    window[o.android][o.android]('');
                    break;
                //点击分享,自定义参数
                case 'activityToShare':
                    window[o.android][o.android](fx.shareUrl, fx.shareTitle, fx.shareDesc, fx.shareIcon);
                    break;
                default:
                    window[o.android][o.android]();
                    break;
            }
        } else {
            this.setupWebViewJavascriptBridge(function (bridge) {
                /* Initialize your app here */
                //所有与iOS交互的JS代码放这里！
                switch (o.ios) {
                    //收货地址判断
                    case 'activityToAddress':
                        if (o.mallAddress) {
                            var mallAddress1 = o.mallAddress;
                            mallAddress1.isEdit = 1;
                            bridge.callHandler(o.ios, mallAddress1);
                        } else {
                            bridge.callHandler(o.ios);
                        }
                        break;
                    //页面加载直接分享
                    case 'activityShareUrl':
                        bridge.callHandler(o.ios, {shareUrl: fx.shareUrl, shareHidden: toggle});
                        break;
                    //点击分享 TODO 新版本写法
                    // case 'activityToShare':
                    //     bridge.callHandler(o.ios, fx);
                    //     break;
                        //旧版本ios兼容写法
                    case 'activityToShare':
                        bridge.callHandler(o.ios, fx.shareUrl);
                        break;
                    default:
                        bridge.callHandler(o.ios);
                        break;
                }
            });
        }
    } else {
        switch (o.url) {
            //收货地址
            case 'activityToAddress':
                window.location.href = window.url + '/user/address?entry=activity&url=' + window.location.href;
                break;
            //页面加载直接分享
            case 'activityShareUrl':
                break;
            //点击按钮分享
            case 'activityToShare':
                o.wxfx ? o.wxfx() : false;
                break;
            //跳转登录
            case 'activityToLogin':
                window.location.href = window.url + '/user/login?entry=activity&url=' + window.location.href;
                break;
            default:
                window.location.href = window.url + o.url;
                break;
        }
    }
};

//调用方法
// var nativeJs = new NativeJs();

// nativeJs.topLeftBack()       //微信端展示左上角X图片返回微信端首页，调用一次添加，再调用一次删除
// nativeJs.isApp()     //是否是APP访问，true是，false否
// nativeJs.isLogin()       //是否登录，true已登录，false未登录
// nativeJs.getToken()      //获取token

/**************  交互部分
 nativeJs.androidIosJs({
    android: '***',     //安卓方法名称
    ios: '***',     //ios方法名称
    url: '***'      //微信url地址  /user/login    hash地址
})
 ***************/

/**************  登录
 nativeJs.androidIosJs({
    android: 'androidToLogin',
    ios: 'activityToLogin',
    url: 'activityToLogin'
});
 *****************/

/**************  分享
 //隐藏APP右上角本地分享按钮
 //android部分机型方法可执行，但是报错，故用try catch
 try {
     nativeJs.androidIosJs({
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

 //传递参数分享
 nativeJs.androidIosJs({
     android: 'activityToShare',
     ios: 'activityToShare',
     url: 'activityToShare',
     fx: {
         shareUrl: '分享地址',
         shareTitle: '分享标题',
         shareDesc: '分享描述',
         shareIcon: '分享icon，绝对地址'
     },
     wxfx: function(){
        wxfx({
            title: '分享标题',
            desc: '分享描述',
            link: '分享地址',
            imgUrl: '分享icon，绝对地址',
            cancel: function(){},       //取消分享回调方法  可省略
            success: function(){}       //完成分享回调方法  可省略
        });
     }
 })
 **********************/