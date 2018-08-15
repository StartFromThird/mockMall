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

            // 大图默认显示第一张
            var defaultBigUrl = imgs[0].imgUrl;
            _this.defaultBigImg(defaultBigUrl);

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

        });
    },
    // 大图默认显示第一张
    defaultBigImg:function(bigImgUrl){       
        var _this=this;
        _this.bigImgId.attr('src',bigImgUrl);  
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

 