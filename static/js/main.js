/******************************
 * date:2018/08/11
 * name:项目入口
 */
$(function(){
	// 首页header头的搜索框
	new SearchFn( $('#searchId') );

	// 首页左侧产品导航
	new SubNavFn( $('#subNavProductId') );

	// 首页的轮播图
	var _slideIdConfig = {
		imageDivId : $('#imageDivId'),
		iconListId : $('#iconListId'),
		slidePointBgId : $('#slidePointBgId'),
		toLeftBtnId : $('#toLeftBtnId'),
		toRightBtnId : $('#toRightBtnId')
	}
	new SlideWrapFn( _slideIdConfig );
	//首页享品质
	new ProductBlock($('#productId'));
});