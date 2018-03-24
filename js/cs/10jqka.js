/**
 * Created by j on 18/3/9.
 */

//alert('I am 10jqka.js.');

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log(11, request.tab);
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
    }
);


STOCK_CODE = STOCK_CODE.map(function (x) {
    return x[0];
});
var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = STOCK_CODE.indexOf(current);
var prev = index - 1 < 0 ? STOCK_CODE.length - 1 : index - 1;
var next = index + 1 > STOCK_CODE.length - 1 ? 0 : index + 1;

chrome.runtime.sendMessage({code: current});

/*chrome.extension.sendRequest({code: current}, function (response) {
    console.log(response);
});*/


//var kw = window.open('http://finance.sina.com.cn/realstock/company/*/nc.shtml'.replace('*', code));

var href = location.href;
var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';
var $body = $(document.body);
$body.append('<iframe src="*"></iframe>'.replace('*', url));

var callback = function (e) {

    //kw && kw.close();

    //正负值表示滚动方向
    var isUp = e && e.originalEvent.deltaY < 0;

    var href = location.href.replace(reg, '/' + ( isUp ? STOCK_CODE[prev] : STOCK_CODE[next] ) + '/');

    console.log(href);

    location.href = href;

    return false;
};

$body.on('mousewheel', callback);

//setTimeout(callback, 2 * 60 * 1000);

/*$(function($){
 console.log('timer');
 setTimeout(function(){
 $('#tableList .check_details').click();
 }, 1000);
 });*/
