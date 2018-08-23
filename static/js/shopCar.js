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
            // 修改某种商品数量
            _this.addBtnEvent();
            _this.minusBtnEvent();
            _this.numInputEvent();
            // 删除某种商品
            _this.delectBtnEvent();
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

    },

    // 更改某种商品数量
    // 减号按钮 点击事件 商品数-1
    minusBtnEvent: function(){
        _this = this;
        var minusBtn = _this.cartWrapId.find('input.minusNumBtn');

        minusBtn.on('click', function(){
            var id = $(this).parents('.goodsItem').attr('index');
            var item = $(this).parents('.goodsItem').children('.chkBtn');
            // 取出原有的商品数量和单价
            var num = item.attr('data-goodsNum');
            var price = item.attr('data-price');
            // 更新输入框显示数字 和 记录数量
            if(num > 1){
                num--;
            }else{
                num =1;
            }
            $(this).next().val(num);
            item.attr('data-goodsNum', num);
            // 更新某种商品小计价格
            _this.updateTotalPrice(num, price, $(this));

        });

    },
    // 加号按钮 点击事件 商品数+1
    addBtnEvent: function(){
        _this = this;
        var addBtn = _this.cartWrapId.find('input.addNumBtn');

        addBtn.on('click', function(){
            var item = $(this).parents('.goodsItem').children('.chkBtn');
            // 取出原有的商品数量和单价
            var num = item.attr('data-goodsNum');
            var price = item.attr('data-price');

            num++;
            // 更新商品输入框
            $(this).prev().val(num);
            // 更新 记录数量
            item.attr('data-goodsNum', num);
            // 更新某种商品小计价格
            _this.updateTotalPrice(num, price, $(this));

        });
    },
    // 输入框 失焦事件 商品数直接写入
    numInputEvent: function(){
        _this = this;
        var enterBtn = _this.cartWrapId.find('input.enterNumInput');
        // 失焦时 更新数量
        enterBtn.on('blur', function(){
            var item = $(this).parents('.goodsItem').children('.chkBtn');
            var num = $(this).val();
            var price = item.attr('data-price');

            // 保证数量最小是1，且为整数
            if(num < 1){
                num = 1;
            }else{
                num = parseInt(num);                
            }
            $(this).val(num);
            item.attr('data-goodsNum', num);
            // 更新某种商品小计价格
            _this.updateTotalPrice(num, price, $(this));
        });
    },

    // 更新某种商品小计价格
    updateTotalPrice: function(num, price, goods){
        var totalPrice = goods.parents('.goodsItem').find('p.totalPrice');
        var sum = (num * price).toFixed(2);
        totalPrice.html(sum);
    },

    // 删除某种商品
    delectBtnEvent: function(){
        var _this = this;
        var delBtn = _this.cartWrapId.find('p.delBtn');
        delBtn.on('click', function(){
            var item = $(this).parent();
            // 先删除前后的 再删cartWrap 
            item.prev().remove();
            item.remove();
        
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