
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
