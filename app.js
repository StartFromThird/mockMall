var koa = require('koa');
var route = require('koa-route');
var app = new koa();

// 渲染模板
var views = require('co-views')
var render = views('./view', {
  map: { html: 'ejs' }
});

// 模拟数据接口
var service = require('./service/webAppService');
// 调用 webAppService 方法，返回JSON
var apitest = function(ctx) {
    // 返回头设为不缓存
    ctx.set('Cache-Control','no-cache');
    ctx.response.body = service.get_test_data();    
}
app.use(route.get('/api_test', apitest));

// 首页json
// http://127.0.0.1:3001/ajax/leftNav
var get_leftNav_json = function(ctx) {
    ctx.set('Cache-Control','no-cache');
    ctx.response.body = service.get_leftNav_data();    
}
app.use(route.get('/ajax/leftNav', get_leftNav_json));

// http://127.0.0.1:3001/ajax/productBlock
var get_productBlock_json = function(ctx) {
    ctx.set('Cache-Control','no-cache');
    ctx.response.body = service.get_productBlock_data();    
}
app.use(route.get('/ajax/productBlock', get_productBlock_json));

// 商品详情页json get要获取参数
// http://127.0.0.1:3001/ajax/goods?id=180807
var querystring = require('querystring');
var get_goods_json = function(ctx) {
    ctx.set('Cache-Control', 'no-cache');
    var params = querystring.parse(ctx.req._parsedUrl.query);
    var id = params.id;
    if(!id){
        id = "";
    }
    ctx.body = service.get_goods_data(id);
} 
app.use(route.get('/ajax/goods', get_goods_json));

// 商品详情页 省市地址json
// http://127.0.0.1:3001/ajax/city
var get_city_json = function(ctx) {
    ctx.response.body = service.get_city_data();    
}
app.use(route.get('/ajax/city', get_city_json));

// 商品详情页 区地址json
// http://127.0.0.1:3001/ajax/area?id=1309
var get_area_json = function(ctx) {
    ctx.set('Cache-Control', 'no-cache');
    var params = querystring.parse(ctx.req._parsedUrl.query);
    var id = params.id;
    if(!id){
        id = "";
    }
    ctx.body = service.get_area_data(id);
}
app.use(route.get('/ajax/area', get_area_json));


// 静态文件目录
// http://127.0.0.1:3001/js/common.js
var path = require('path');
var serve = require('koa-static');
var staticPath = './static'
var main = serve(path.join( __dirname,  staticPath));
app.use(main);


// 页面
var koa_static = require('koa-static-server');
app.use(route.get('/ejs_test', async function(ctx, next) {
    ctx.set('Cache-Control', 'no-cache');
    ctx.body = await render('test',{title:'title_test'});
}));

// 首页
app.use(route.get('/', async function(ctx, next){
    ctx.set('Cache-Control', 'no-cache');
    ctx.body = await render('index', {title:'商城首页'});
}));
// 商品详情
// http://127.0.0.1:3001/goodsDetail?id=180807
app.use(route.get('/goodsDetail', async function(ctx, next){
    ctx.set('Cache-Control', 'no-cache');
    var params = querystring.parse(ctx.req._parsedUrl.query);
    var goodsId = params.id;
    console.log(goodsId);
    ctx.body = await render('goodsDetail', {goodsId:goodsId});
}));
app.listen(3001);
console.log('koa is started');