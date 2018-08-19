
// 提供方法 用于读取并返回数据
// 模拟接口
var fs = require('fs');
exports.get_test_data = function(){
    var content = fs.readFileSync('./mock/test.json','utf-8');
    return content;
}
// 首页
exports.get_leftNav_data = function(){
    var content = fs.readFileSync('./mock/home/leftNav.json','utf-8');
    return content;
}
exports.get_productBlock_data = function(){
    var content = fs.readFileSync('./mock/home/productBlock.json','utf-8');
    return content;
}
// 商品详情页  图片
exports.get_goods_data = function(id){
    if(!id){
        id = "180817";
    }
    if(fs.existsSync('./mock/goods/' + id + '.json')){
        content = fs.readFileSync('./mock/goods/' + id + '.json', 'utf-8');
    }else{
        content = fs.readFileSync('./mock/goods/180807.json', 'utf-8');
    }
    return content;
}
// 商品详情页  省市
exports.get_city_data = function(){
    var content = fs.readFileSync('./mock/address/city.json','utf-8');
    return content;
}
// 商品详情页  区
exports.get_area_data = function(id){
    if(!id){
        id = "3500";
    }
    if(fs.existsSync('./mock/address/' + id + '.json')){
        content = fs.readFileSync('./mock/address/' + id + '.json', 'utf-8');
    }else{
        content = fs.readFileSync('./mock/address/3500.json', 'utf-8');
    }
    return content;
}
// 实际接口
// exports.get_search_data = function(start, end, keyword){
//     // 异步 接受数据后调用
//     return function(cb){
//         var http = require('http');
//         var qs = require('querystring');
//         var data = {
//             s: keyword,
//             start: start,
//             end: end
//         };
//         var content = qs.stringify(data);
//         var http_request = {
//             hostname : 'dushu.xiaomi.com',
//             port : 80,
//             path : '/store/v0/lib/query/onebox?' + content
//         }
//         req_obj = http.request(http_request, function(_res){
//             var content = '';
//             _res.setEncoding('utf8');
//             _res.on('data',function(chunk){
//                 content += chunk;
//             });
//             _res.on('end', function(){
//                 cb(null,content);
//             });
//         });
//         req_obj.on('error', function(){

//         });
//         req_obj.end();
//     }
// }