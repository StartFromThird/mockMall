/******************************
 * date:2018/08/09
 * name:整个项目的公共方法
 */
/******************************
 * date:2018/08/11
 * name:ajax公共方法
 */
function getAjax( _url, callback ){
	$.ajax({
		url: _url,
		type:'get',
		dataType:'json',
		jsonp:'callback',
		success:function( d ){
			callback( d );
		}
	});
}
/******************************
 * date:2018/08/14
 * name:首页轮播广告的动画 滑动效果
 * param : 
 * id，ul的id
 * i，滑动到第i张
 * w，每张图移动的距离
 */
function slideAnimate( id, i, w ){
    id.stop().animate({
        left: -( i * w )
    },200);
}
