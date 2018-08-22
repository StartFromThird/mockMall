/******************************
 * date:2018/08/21
 * name:购物车页面
 */
 function ShopCarFn( config ){
    for( var i in config ){
        this[i] = config[i]
    }
    this.init();
}
ShopCarFn.prototype = {
    init: function(){
        var _this = this;
        _this.getJson();
    },
    getJson: function(){
        var _this = this;
        var userId = getParam('user-id=');
        var userGoodsUrl = APILIST.userGoods + userId;
        // console.log(userGoodsUrl);
        getAjax(userGoodsUrl, function(d){
            // console.log(d.data);
            _this.createDom(d.data);

            // 某种商品 checkbox
            _this.checkboxGoodsEvent();
            // 全选 ckeckbox
            _this.checkboxAllEvent();

        })

    },
    createDom: function(d){
        var _this = this;
        var len = d.length;
        for(var i = 0; i < len; i++){
            // 四舍五入保留小数点N位置 .toFixed(2)
            var totalPrice = (d[i].price * d[i].num).toFixed(2);
            $(`
            <div class="border2px"></div>
            <div class="goodsItem">
                <input data-price=${d[i].price} data-goodsNum=${d[i].num} type="checkbox" checked class="chkBtn">
                <label for="">
                    <img src="${d[i].goodsimg}" alt="${d[i].name}">
                </label>

                <span>${d[i].name}</span>
                <p class="p1">${d[i].introduce}</p>
                <p class="p2">￥${d[i].price}</p>

                <div class="goodsNumInput">
                    <input type="button" value="-" class="a minusNumBtn" />
                    <input type="text" value=${d[i].num} class="b enterNumInput" />
                    <input type="button" value="+" class="c addNumBtn" />
                </div>

                <p class="p3 totalPrice">￥${totalPrice}</p>
                <p class="p4 delBtn">删除</p>
            </div>`).appendTo(this.cartWrapId);
        }
    },

    // 某种商品 checkbox 点击事件
    checkboxGoodsEvent: function(){
        var _this = this;
        var chkBtn = _this.cartWrapId.find('input.chkBtn');

        var checkAllBtn = $('.checkAllBtn');

        chkBtn.on('click', function(){
            var isChecked = $(this).is('.isChkBtn');

            if(isChecked){
                // 选中
                $(this).removeClass('isChkBtn');
                // console.log("T")

            }else{
                // 取消选中 全选打勾去掉
                $(this).addClass('isChkBtn');
                checkAllBtn.removeAttr('checked');
            }
        });
    },
    // 全选按钮 checkbox 点击事件 
    checkboxAllEvent: function(){
        var _this = this;
        var checkAllBtn = $('.checkAllBtn');
        var chkBtn = _this.cartWrapId.find('input.chkBtn');
        // 修改某个商品 checkbox， 修改另一个全选 checkbox
        checkAllBtn.on('click', function(){
            var isAll = $(this).is(':checked');
            if(isAll){
                // 选中
                chkBtn.attr('checked', 'true');
                checkAllBtn.attr('checked', 'true');
            }else{
                // 取消全选
                chkBtn.removeAttr('checked');
                checkAllBtn.removeAttr('checked');
            }            
        });

    }


}
 var shopCarConfig = {
    cartWrapId : $('#cartWrapId'),
    topTotalGoods: $('#topTotalGoods'),
    selectGoodsNumId : $('#selectGoodsNumId'),
    goodsTotalMoneyId : $('#goodsTotalMoneyId')
}
new ShopCarFn( shopCarConfig );