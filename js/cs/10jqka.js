/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

//alert('I am 10jqka.js.');
STOCKS = STOCKS || [];
STOCKS = STOCKS.map(function (x) {
    return x[0];
});
var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = STOCKS.indexOf(current);
var prev = index - 1 < 0 ? STOCKS.length - 1 : index - 1;
var next = index + 1 > STOCKS.length - 1 ? 0 : index + 1;

//发送消息给background.js，通过background.js同步个股K线页面
if (STOCKS.indexOf(current) > -1) {
    chrome.runtime.sendMessage({id: '10jqka', code: current});
}

var href = location.href;
var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';

var $body = $(document.body);

//如果是个股资料页面 http://basic.10jqka.com.cn/300677/
if (/^\/\d{6}\/?$/img.test(location.pathname)) {

    $('.wrapper').addClass('J');
    $body.append('<iframe src="*"></iframe>'.replace('*', url));

    var callback = function (e) {
        //正负值表示滚动方向
        var isUp = e && e.originalEvent.deltaY < 0;
        location.href = location.href.replace(reg, '/' + ( isUp ? STOCKS[prev] : STOCKS[next] ) + '/');
        return false;
    };

    var interval = 40;
    var timer = 300;
    var is_auto = 1;
    var $title = $('title');
    var title = $title.text();
    var win;
    var site_url;
    var ycj_url;
    var go_next_stock = function () {
        chrome.runtime.sendMessage({id: '10jqka', close_url: site_url});
        setTimeout(function () {
            callback({originalEvent: {deltaY: 1}});
        }, 1000 * interval * 1);
    };
    var open_ycj = function(){
        ycj_url = 'http://www.yuncaijing.com/quote/*.html'.replace('*', (/^6/.test(current) ? 'sh' : 'sz') + current);
        window.open(ycj_url);
        setTimeout(open_site, 1000 * interval * 1);
    };
    var open_site = function () {
        chrome.runtime.sendMessage({id: '10jqka', close_url: 'http://www.yuncaijing.com/quote'});
        site_url = $('iframe').contents().find('#detail a').eq(0).attr('href');
        window.open(site_url);
        setTimeout(go_next_stock, 1000 * interval * 2);
    };


    chrome.storage.sync.get(['is_stock_auto', 'interval'], function (result) {
        console.log(result);
        if (result.is_stock_auto) {

            interval = result.interval || interval;
            timer = interval * (3 + 2 + 1 + 1);

            //定时打开云财经页面
            setTimeout(open_ycj, 1000 * interval * 3);

            setInterval(function () {
                timer -= 1;
                $title.text(timer + ' # ' + title);
            }, 1000);

        } else {

            $body.on('mousewheel', callback);

        }
    });

}




