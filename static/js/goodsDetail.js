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

    this.init();
}
GoodsDetailImg.prototype = {
    init: function(){
        var _this = this;     
        _this.getJson();
    },
    getJson: function(){
        getAjax(APILIST.goodsImage, function(d){
            // console.log(d);
            var imgs = d.data[0].smallImg;
            // 生成底部小图片DOM, 给底部x小图片绑定事件
            _this.createDom(imgs);
            _this.eventSmallImg();
            eventLeft();
            eventRight();

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
        });
    },
    // 底部小图片栏目 左右按钮点击事件
    eventLeft: function(){
        var _this = this;
        _this.leftBtnId.on('click',function(){

        });
    },
    eventRight: function(){
        var _this = this;
        _this.rightBtnId.on('click',function(){

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

 