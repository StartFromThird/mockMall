# mockMall  
基于 jQuery + Koa2 制作的模拟商城（图片主要来源于JD.com）
## 页面展示
  <img align="middle" src="https://raw.githubusercontent.com/StartFromThird/mockMall/master/show/index.PNG"/>  
  <img align="middle" src="https://raw.githubusercontent.com/StartFromThird/mockMall/master/show/detail.PNG"/>  
  <img align="middle" src="https://raw.githubusercontent.com/StartFromThird/mockMall/master/show/shopCar.PNG"/>  

## Setup  
* 安装依赖 npm install  
* 本地开启服务 node app.js  
* 本地访问地址  
  * 首页：http://127.0.0.1:3001/    
  * 商品详情页：http://127.0.0.1:3001/goodsDetail?id=180807
  * 购物车：http://127.0.0.1:3001/shopCar?user-id=101010  

## 目录结构  
```
├─app.js 模拟数据接口，静态文件接口及启动服务器
├─service 各接口返回内容  
├─mock 模拟数据.json
│   ├─home 首页数据：左侧导航栏，底部“享品质”
│   ├─goods 商品详情页数据，文件名为商品id
│   ├─address 三级地址菜单数据： 省市，各个市对应地区文件（文件名为市id）
│   └─shopCar 用户购物车页面数据，文件名为用户id
├─view 首页index / 商品详情页goodsDetail / 用户购物车页shopCar html文件
├─static 页面静态资源    
│   ├─js
│   │   ├─main 首页入口文件  
│   │   ├─config 接口路径及整站的路径
│   │   ├─common 公共方法（ 获取数据，滑动效果，数字补0 )
│   │   ├─jQuery-1.7.1
│   │   └─index / goodsDetail / addressMenu / shopCar.js  各页面js
│   ├─css
│   │   ├─reset 
│   │   ├─common
│   │   └─index / goodsDetail / shopCar.css  各页面css
│   └─images 各种图片
├─package.json 配置依赖
└─node_modules 安装的依赖文件

```
## 记录  
* 面向对象写法  
```javascript
  function G构造器(ele, obj){
    this.e = ele
    for( var i in obj ){
      this[i] = obj[i];
    }
    // 各种数据初始化
    this.init()
  }
  G构造器.prototype = {
    init: function(){
      this.getJson(..)
      this.funA(..)
      // ...
    },
    getJson: function(..){
      // ...
      this.funB()
    },
    funA: function(..){
      // ...
    },
    funB: function(..){
      // ...
    }
    //...
  }
  new G构造器(ele, obj)
```
* **首页**
  * 搜索框：搜索框分别添加focus/blur事件修改input内容.val  
  * 左侧导航  
    获取导航栏数据，填充字符串模板，并添加到对应节点处。对导航栏所有子元素添加mouseover/mouseout, 当移入时对应次级菜单显示，移出时对应次级菜单隐藏。
  * 轮播图  
    init()先调用ulDOM, 生成图片栏DOM, 小圆点DOM, 给小圆点及背景加上初始样式。  
    给左右按钮&底部小圆点添加点击事件，点击按钮修改当前应显示的图片序号this.tempI，再调用switchToI使图片栏滑动到对应位置，对应序号小圆点变色。  
    switchToI  
      图片栏滑动：修改left = 图片序号i * 单张图片显示宽度w  
      ```javascript    
      function slideAnimate( ele, i, w ){
        ele.stop().animate({
          left: -( i * w )
        },500);
      }
      ```
    修改小圆点样式：移除所有小圆点.redD样式, 序列为this.tempI的小圆点添加.redD样式。
    init()调用autoSlide，间隔2s触发左移按钮点击事件，实现图片栏自动滑动。  
    图片栏添加事件，鼠标移入时清除定时器，图片栏停止滑动，鼠标移出时调用autoSlide继续滑动。  
    ```javascript
    // 初始化时定义一个定时器this.timer = null。 
    autoSlide: function(){
      _this.timer = setInterval(function(){
        _this.toLeftBtnId.click();
      },2000);
    }
    ```
  * 底部享品质：获取数据，填充字符串模板，添加href属性，并添加到对应节点处。  

* **商品详情页**  
  * goodsDetail 左侧展示商品图片详情  
    通过当前页地址获取商品id并拼接地址用于请求大小图片数据。 默认显示第一张图片。  
    * 底部小图片栏  
      拼接小图片DOM, 添加小图对应大图片地址作为属性。 
      底部小图添加点击事件，点击后通过属性获取对应大图地址，修改展示大图和详细图src。  
      底部左右按钮添加点击事件, 点击修改left值，使图片栏移动。
    * 大图上鼠标事件  
      鼠标在大图滑动，显示局部详细图和遮罩。 
      获取鼠标相对于html左上角坐标( e.pageX )减去大图左上角坐标( _this.goodsBigImg.offset().left )得到鼠标相对于大图左上角坐标。 由于鼠标默认在遮罩中部，故再减去遮罩一半尺寸，得到遮罩左上角相对于大图左上角坐标; 边界处遮罩左上角坐标设为默认值。  
      由于局部详细图是等比例放大, 比例 k = 详细图显示尺寸/遮罩尺寸, 局部详细图左上角坐标 = k * 遮罩左上角相对于大图左上角坐标。  
      鼠标移出，局部详细图和遮罩隐藏。
  * addressMenu 右侧地址选择栏 
    地址列表点击事件，每次点击通过参数isShow判断地址选择列表显示或隐藏，同时isShow取反。  
    由于直接获取全部省市区json数据较大，故先获取省市json渲染省市列表, 点击城市时再依据城市id请求对应区域json。
    省市区列表的每个item的点击事件还需要存入选中item，更新显示地址内容，隐藏当前列表，获取次一级列表数据并仅显示次一级列表，修改次级tab样式内容，隐藏次级tab。  
    省/市/区域标签同样绑定事件，主要是标签样式修改，次级地址标签及列表隐藏, 以及清空次级地址在数组中对应数据。  

* **购物车** 
  依据用户id请求购物车内容数据, 生成购物车商品列表, checkbox绑定商品单价及数量作为属性  
  * 商品选择
    点击单个商品的checkbox, 若是选中，则判断列表中checkbox数量和选中的checkbox数量是否相等，若相等则勾选全选checkbox; 若是取消选中，则全选checkbox也取消选中; 同时更新商品总价格。    
    点击全选的checkbox, 修改所有单个商品的checkbox及另一个全选的checkbox。  
  * 单个商品数量修改  
    点击加减按钮，先获取checkbox绑定商品单价及数量, 再加减商品数量并更新数量输入框数值。  
    数量输入框直接输入数值, 保证数值为正整数。
    两种修改方式都要更新checkbox绑定商品数量, 更新单个商品总价及所有商品总价。  
  * 单个商品删除  
    点击删除按钮，删除修饰线，删除对应商品，更新商品总价。  
  * 计算商品总价  
    遍历选中商品，通过checkbox属性获取商品数量及单价计算商品总价并更新到页面。  

* 利用 Koa 起一个本地测试服务器及模拟接口  
  详见：https://github.com/StartFromThird/JSpractice/blob/master/koa%E7%9B%B8%E5%85%B3.md

