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

