
/***************************
 * date:2018/08/10
 * name:首页的header头的搜索框，重写
 */

// 这是构造器
function SearchFn(n){
	// console.log(n)
	this.searchId = n;
	this.init();
}
SearchFn.prototype = {
	init:function(){
		var _this = this;
		var _sId  = _this.searchId;

		_this.focusFn( _sId );
		_this.blurFn( _sId );
	},
	focusFn:function(n){
		n.on('focus',function(){
			$(this).val('');
		});
	},
	blurFn:function(n){
		n.on('blur',function(){
			$(this).val('818 惊喜购');
		});
	}
}

/******************************
 * date:2018/08/13
 * name:首页的左侧导航条
 */

function SubNavFn(n){
	this.subNavProductId = n;
	this.init();
}
SubNavFn.prototype = {
	init:function(){
		var _this = this;
		_this.getJson();
	},

	getJson:function(){
        var _this = this;
		getAjax(APILIST.subNavApi, function(d){
			// console.log("testMock", d);
			_this.createDom(d.productList);
		});
	},
	createDom:function(nav){
		var _this = this;
		// console.log(nav);
		var typeLen = nav.length;
		for( let i=0; i<typeLen; i++){
			var subLen = nav[i].products.length;
			console.log(subLen);
			$(`<li>
				<a href="#">${nav[i].type}</a>
				<div class="showNavPopup"></div>
			</li>`)
			.appendTo(_this.subNavProductId);
			for (let j = 0; j < subLen; j++) {
				$(`<p>${nav[i].products[j].name}</p>`).appendTo($('#subNavProductId>li>div:last'));
			}
		}
		// 给导航栏绑定事件
		var allNav = _this.subNavProductId.children();
		_this.mouseOverFn(allNav);
		_this.mouseOutFn(allNav);
	},

	// 次级导航的消失和隐藏
	mouseOverFn:function(allNav){
		allNav.on('mouseover', function(){
			$(this).find('div').show();
		});
		
	},
	mouseOutFn:function(allNav){
		allNav.on('mouseout', function(){
			$(this).find('div').hide();
		});
	}

}

/******************************
 * date:2018/08/13
 * name:首页的轮播图
 */
// 构造器
function SlideWrapFn( _slideIdConfig ){
	for( var i in _slideIdConfig ){
		this[i] = _slideIdConfig[i];
	}
	this.tempI 	 = 0;
	this.liWidth = 0;
	this.imgNum  = slideImgUrl.urls.length;
	this.timer = null;
	
	this.init();
}
SlideWrapFn.prototype = {
	init: function(){
		var _this    = this;
		var imagesId = _this.imageDivId;
		var dotId    = _this.iconListId;
		_this.ulDom(imagesId, dotId);
		// 左右按钮及底部小圆点，切换轮播图显示图片
		_this.leftBtn();
		_this.rightBtn();
		_this.dotBtn();
		// 自动滑动效果及聚焦停止滑动
		_this.autoSlide();
		_this.imageDivIdEvent();

	},

	// 生成图片栏 及小圆点 DOM, 并补小圆点的样式
	ulDom: function(imagesId, dotId){
		var _this = this;
		var imgUrls = slideImgUrl.urls;
		var imgNum  = this.imgNum;
		
		_this.createImageDom(imgUrls, imgNum, imagesId);
		_this.createDotDom(imgNum, dotId);

		_this.dotsStyle(imgNum);

	},
	// 生成图片栏Dom
	createImageDom: function(imgUrls, imgNum, imagesId){
		var _this = this;
		for (var i = 0; i < imgNum; i++) {
		 	$(`<li><img src = '${imgUrls[i]}' /></li>`).appendTo(imagesId);
		 } 
		this.liWidth = imagesId.children().first().width();
	},
	// 生成小圆点Dom
	createDotDom: function(n, dotId){
		// console.log("dotId",dotId);
		for (var i = 0; i < n; i++) {
			$(`<p></p>`).appendTo(dotId);
		}
		dotId.children().first().addClass('redD');
	},
	// 小圆点组及半透明背景样式设置
	dotsStyle: function(n){
		var _this = this;
		// 单个小圆点直径12px + 左右margin 6px 6px
		var dotsWidth = n * 28;
		var halfWidth = dotsWidth * 0.5 + 6;
 		// 小圆点组样式
		_this.iconListId.css({
			'margin-left': `${-1 * halfWidth}px`
		});
		// 小圆点背景样式
		_this.slidePointBgId.css({
			'width': `${dotsWidth}px`,
			'margin-left': `${-1 * halfWidth}px`
		});
	},

	// **** 以下是绑定事件

	// 左移按钮 图片栏左移动 切换到第I张
	leftBtn: function(){
		var _this = this;
		_this.toLeftBtnId.on('click', function(){
			if(_this.tempI < (_this.imgNum - 1)){
				_this.tempI++;
			}else{
				_this.tempI = 0;
			}
			// console.log(_this.tempI)
			_this.switchToI(_this.tempI);
		});
	},
	// 右移按钮 图片栏右移动 切换到第I张
	rightBtn: function(){
		var _this = this;
		_this.toRightBtnId.on('click', function(){
			// 图片栏移动
			if(_this.tempI > 0){
				_this.tempI--;
			}else{
				_this.tempI = _this.imgNum - 1;
			}
			// console.log(_this.tempI);
			_this.switchToI(_this.tempI);
		});
	},
	// 点击小圆点 切换到第I张
	dotBtn: function(){
		var _this = this;
		var dots = _this.iconListId.children();
 		dots.on('click', function(){
 			_this.tempI = $(this).index();
 			// console.log(_this.tempI);
 		// 	slideAnimate( imagesId, _this.tempI, _this.liWidth );
			// _this.tempIDot(_this.tempI);
			_this.switchToI(_this.tempI);
		});
	},

	// 图片及小圆点 切换到第 i 个 
	switchToI: function(i){
		var _this = this;
		var id = _this.imageDivId;
		var d = _this.liWidth;
		slideAnimate( id, i, d);
		_this.tempIDot(i);
	},
	// 第tempI个小圆点选中状态(变红 
	tempIDot: function(i){
		var _this = this;
		var dots = _this.iconListId.children();
		dots.removeClass('redD')
			.eq(i).addClass('redD');

	}

	// 图片组 自动滑动
	autoSlide: function(){
		var _this = this;
		// !!
		_this.timer = setInterval(function(){
			_this.toLeftBtnId.click();
		},2000);
	},
	// 停止滑动
	pauseSlide: function(){
		clearInterval(this.timer);
	},
	// 图片栏事件
	imageDivIdEvent: function(){
		var _this = this;
		var wrap = _this.slideWrapId;
		wrap.on('mouseover', function(){
			// console.log("pause");
			_this.pauseSlide();
		});
		wrap.on('mouseout', function(){
			// console.log("slide");
			_this.autoSlide();
		});

	}
	
}

/******************************
 * date:2018/08/12
 * name:首页的享品质
 */
function ProductBlock(n){
	this.productId = n;
	this.init();
}
ProductBlock.prototype={
	init:function(){
		var _this = this;
		_this.getJson();
	},
	getJson:function(){
        var _this = this;
		getAjax(APILIST.productBlock, function(d){
			// console.log("testMock", d);
			_this.createDom(d.pb);
		});
	},
	createDom:function(_pb){
		var _this = this;
		for(var i=0;i<_pb.length;i++){
			$(`<a class="producetItem">
				<dl class="bg_${i+1}">
					<dt>${_pb[i].name}</dt>
					<dd>${_pb[i].describe}</dd>
				</dl>
				<img src="${_pb[i].productImg}" />
			</a>`)
			.attr({
				// http://127.0.0.1:3001/ajax/goods?id=180807
				'href': `${SITEURL}/goods?id=${_pb[i].id}`,
				'tarfet': '_blank'
			})
			.appendTo(_this.productId);

		}
	}
}
