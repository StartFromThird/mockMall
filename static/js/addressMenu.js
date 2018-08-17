/******************************
 * date:2018/08/17
 * name:配送地址选择
 */
 function AddressMenuFn(_config){
    for(var i in _config){
        this[i] = _config[i];
    }
    this.init();
 }
AddressMenuFn.prototype={
    init:function(){
        _this = this;
        //地址显示隐藏
        _this.addressTitleEvent();
        //省市信息
        _this.getData();
    },   
    // 地址列表 点击事件 显示隐藏
    addressTitleEvent: function(){
        var _this = this;
        var addList = _this.addressListId;
        _this.isShow = false;
        _this.addressTitleId.on('click', function(){
            if(!_this.isShow){
                addList.show();
            }else{
                addList.hide();
            }
            _this.isShow = !_this.isShow;
        });
    }, 
    getData: function(){
        _this = this;

        getAjax(APILIST.city, function(d){
            // console.log(d.provinces[0].citys[1].citysName);
            _this.createProvinceDom(d.provinces, _this.provinceId);

        });
    },
    createProvinceDom: function(provinces, proEle){
        var _this = this;
        var len = provinces.length;
        for(var i=0; i<len; i++){
            $(`<p data-proId='${i}'>${provinces[i].provinceName}</p>`)
            .on('click', function(){
                // 生成 市数据列表 DOM
                var proId = $(this).attr('data-proId');
                // console.log(data[proId].citys[1].citysName);
                _this.createCityDom(proId, provinces[proId].citys, _this.cityId);
                // 省item点击事件
                var proName = $(this).html();
                _this.provinceEvent(proName);
            })
            .appendTo(proEle);
        }
    },
    // 生成 市数据列表 DOM
    createCityDom: function(proId, citys, cityEle){
        var _this = this;
        var len = citys.length;
        for(var i=0; i<len; i++){
            $(`<p data-cityId='${proId}0${i}'>${citys[i].citysName}</p>`)
            .on('click',function(){
                // 生成 区数据列表 DOM, 市item点击事件
                var cityId = $(this).attr('data-cityId');
                _this.createAreaDom(cityId, _this.areaId);
                var citysName = $(this).html();
                _this.cityEvent(citysName);
            })
            .appendTo(cityEle);
        }
    },
    // 生成 区数据列表 DOM
    createAreaDom: function(cityId, areaEle){
        var _this = this;
        // http://127.0.0.1:3001/ajax/area?id=1309
        var areaUrl = `${APILIST.area}?id=${cityId}`;
        getAjax(areaUrl, function(d){
            // console.log(d.areas);
            var len = d.areas.length;
            for(var i=0; i<len; i++){
                $(`<p data-areaId='${d.areas[i].id}'>${d.areas[i].areaName}</p>`)
                .on('click',function(){
                    // 区item点击事件
                    var areaName = $(this).html();
                    _this.cityEvent(areaName);

                })
                .appendTo(areaEle);
            }
        });

    },
    // 省 item点击事件 保存省份名 显示隐藏tab及列表
    provinceEvent: function(proName){
        _this = this;
        // 省份名 写入tab
        _this.tabA
            .removeClass('yellow')
            .html( proName );
        // 省份名 存入数组
        _this.addressTitle( proName );
        // 省列表隐藏 市列表show
        _this.provinceId.hide();
        _this.cityId.show();
        // 点击省item的时候，市显示，区隐藏
        // 以防止 在没有选择市的情况下，直接先区。
        _this.tabB
            .show()
            .html('请选择市')
            .addClass('yellow');
        _this.tabC.hide();
    },
    cityEvent: function(cityName){
        _this = this;
        _this.tabB
            .removeClass('yellow')
            .html( cityName );
        _this.addressTitle( cityName );
        _this.cityId.hide();
        _this.areaId.show();
        _this.tabC
            .show()
            .html('请选择区')
            .addClass('yellow');
    },
    areaEvent: function(areaName){
        _this = this;
        _this.tabC
            .removeClass('yellow')
            .html( areaName );
        _this.addressTitle( areaName );
    },
    addressTitle:function(n){
        _self=this;
        var _arr=_self.arr;
        if(_arr.length<3){
            _arr.push(n);   
        }
        _self.addressDivId.html('');
        for(var i=0;i<_arr.length;i++){
            $('<p/>',{})
                .html(_arr[i])
                .appendTo(_self.addressDivId);
        }
    }
}


var _config = {
        addressTitleId:$('#addressTitleId'),
        addressListId:$('#addressListId'),
        addressDivId:$('#addressDivId'),
        //省市区 地域item
        provinceId:$('#provinceId'),
        cityId:$('#cityId'),
        areaId:$('#areaId'),
        //省市区tab
        tabA:$('#tabA'),
        tabB:$('#tabB'),
        tabC:$('#tabC'),
        isShow:0,
        arr:[]
 }
 new AddressMenuFn(_config);
