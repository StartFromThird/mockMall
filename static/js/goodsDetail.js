/******************************
 * date:2018/08/15
 * name:产品详情
 */
 /******************************
 * date:2018/08/15
 * name:大图切换，局部高清展示
 */
function GoodsDetailImg(config){
    for(var i in config){
        this[i] = config[i];
    }
    this.sum = 0;
    this.init();
}
GoodsDetailImg.prototype = {
    init: function(){
        var _this = this;     
        _this.getJson();
    },
    getJson: function(){
        var _this = this;
        // 获取页面地址goodsId
        var _id = getParam('id=');      
        var goodsurl = APILIST.goodsImage + _id;
        getAjax(goodsurl, function(d){
            var imgs = d.data[0].smallImg;
            // 生成底部小图片DOM, 给底部小图片及左右按钮绑定事件
            var imgsNum = imgs.length;
            _this.createDom(imgs);
            _this.eventSmallImg();
            _this.eventLeft(imgsNum);
            _this.eventRight(imgsNum);

            // 大图默认显示第一张
            var defaultBigUrl = imgs[0].imgUrl;
            _this.defaultBigImg(defaultBigUrl);

            // 鼠标在大图上移动显示局部高清
            _this.eventMouse();

        });
    },
    // 底部小图片DOM
    createDom: function(imgs){
        // console.log(_imgs);
        var _this = this;
        var len = imgs.length;
        for(let i=0; i<len; i++){
            $(`<li data-bigImg="${imgs[i].bigImg}"><img src="${imgs[i].imgUrl}"></li>`)
            .appendTo(_this.smallImgId);
        }
        // 设置ul宽度
        _this.smallImgId.css({'width': `${len*75}px`});
    },
    // 底部小图片绑定事件
    eventSmallImg: function(){
        var _this = this;
        var smallImg = _this.smallImgId.children();
        smallImg.on('click', function(){
            // 点小图，切换对应大图
            var bigImgUrl = $(this).attr('data-bigImg');
            _this.bigImgId.attr('src', bigImgUrl);
            // 切换对应详细图
            var datailId = _this.bigImgWrapId.children('img'); 
            $(datailId).attr('src',bigImgUrl);
            // 点击选中 加上红色边框
            $(this).addClass("red-border")
                    .siblings(".red-border").removeClass("red-border");
        });
    },
    // 底部小图片栏目 左右按钮点击事件
    eventLeft: function(n){
        var _this = this;
        var n = n - 4;
        _this.leftBtnId.on('click', function(){
            if(_this.sum < n){
                _this.sum++;                
            _this.smallImgId.css('left',-(_this.sum*75));
            }
        });
    },
    eventRight: function(n){
        var _this = this;
        var n = n - 4;
        _this.rightBtnId.on('click',function(){
            if (_this.sum > 0) {
                _this.sum--;
                _this.smallImgId.css('left',-(_this.sum*75));
            }
        });
    },

    // 大图和详细图 默认显示第一张
    defaultBigImg: function(bigImgUrl){
        var _this = this;
        _this.bigImgId.attr('src',bigImgUrl);
        var datailId = _this.bigImgWrapId.children('img'); 
        $(datailId).attr('src',bigImgUrl);
    },

    // 鼠标在大图上移入移出事件
    eventMouse: function(){
        var _this = this;
        _this.goodsBigImg.on({
            mouseover:function(){
                _this.bigImgMask.show();
                _this.eventMouseMove(_this.goodsBigImg);
                _this.bigImgWrapId.show();
            },
            mouseout:function(){
                _this.bigImgMask.hide();
                _this.bigImgWrapId.hide();
            }
        });
    },
    // 鼠标在大图滑动  Mask跟随鼠标移动 + 局部高清图位置变化
    eventMouseMove: function(bigImg){
        var _this = this;
        // 大图左上角坐标
        var goodsBigImgX = bigImg.offset().left;
        var goodsBigImgY = bigImg.offset().top;

        bigImg.on('mousemove',function(e){
            // console.log(e);
            // 鼠标相对 html 左上角坐标
            var _eL = e.pageX;
            var _eT = e.pageY;

            // 鼠标在 imgMask 中心，计算Mask左上角坐标 maskL maskT
            var imgMask = _this.bigImgMask;
            var maskL = _eL - goodsBigImgX - 0.5 * imgMask.width();
            var maskT = _eT - goodsBigImgY - 0.5 * imgMask.height();
            // 设置 imgMask 移动边界
            var _eLEdge = bigImg.width() - imgMask.width();
            var _eTEdge = bigImg.height() - imgMask.height();
            if(maskL < 0)      {maskL = 0;}         
            if(maskL > _eLEdge){maskL = _eLEdge;}
            if(maskT < 0)      {maskT = 0;} 
            if(maskT > _eTEdge){maskT = _eTEdge;}

            imgMask.css({
                'left': maskL,
                'top' : maskT,
            });
            // .html( maskL + " : " + _eL );

            // 计算详情图片左上角坐标
            // 详情框 495*495  mask 200*200
            var k = -1 *  495/ 200;
            var datailId = _this.bigImgWrapId.children('img'); 
            $(datailId).css({
                    'left': maskL * k,
                    'top': maskT * k
                    });
        })
    }    
}

var detailImgConfig = {
    smallImgId:$('#smallImgId'),
    bigImgId:$('#bigImgId'),
    leftBtnId:$('#leftBtnId'),
    rightBtnId:$('#rightBtnId'),
    goodsBigImg:$('#goodsBigImg'),
    bigImgMask:$('#bigImgMask'),
    bigImgWrapId:$('#bigImgWrapId')
}
 new GoodsDetailImg(detailImgConfig);

 /******************************
 * date:2018/08/18
 * name:修改购买商品数量
 */
function GoodsNumFn(_config){
    for(var i in _config){
        this[i] = _config[i];
    }
    this.init();
}
GoodsNumFn.prototype = {
    init: function(){
        _this = this;
        _this.btnPEvent();
        _this.btnMEvent();
    },
    // 加号 plus
    btnPEvent: function(){
        var _this = this;
        _this.input_btnP.on('click', function(){
            _this.inputVal++;
            _this.input_btnNum.val(_this.inputVal);
        });
    },
    // 减号 minus
    btnMEvent: function(){
        var _this = this;
        _this.input_btnM.on('click', function(){
            if(_this.inputVal > 1){
                _this.inputVal--;
                _this.input_btnNum.val(_this.inputVal); 
            }
        });
    },  
}
var _GoodsNumFnConfig = {
    input_btnNum : $('#input_btnNum'),
    input_btnP : $('#input_btnP'),
    input_btnM : $('#input_btnM'),
    inputVal : 1
}
new GoodsNumFn( _GoodsNumFnConfig );

 /******************************
 * date:2018/08/19
 * name:右侧顶部商品详细信息
 */
function GoodsDetailTxt(config){
    for(var i in config){
        this[i] = config[i];
    }
    this.init();
}
GoodsDetailTxt.prototype = {
    init: function(){
        var _this = this;
        _this.getJson();
    },
    getJson: function(){
        var _this = this;
        var goodsurl = APILIST.goodsImage + getParam('id=');
        getAjax(goodsurl, function(d){
            _this.createDom(d.data[0]);
        });
    },
    createDom: function(d){
        var _this = this;
        $(`<h1>${d.describe}</h1>
            <p>促销价 <span>￥${d.price}</span></p>
            `).appendTo( _this.goodsInfoId );   

    }
}
var detailTxtConfig = {
    goodsInfoId : $('#goodsInfoId')
}
new GoodsDetailTxt(detailTxtConfig);
 






