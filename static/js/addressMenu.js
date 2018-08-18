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
        // 地址显示隐藏
        _this.addressTitleEvent();
        // 省市信息
        _this.getData();

        _this.tabAEvent();
        _this.tabBEvent();
        _this.tabCEvent();
    },   
    // 地址列表 点击事件 显示隐藏
    addressTitleEvent: function(){
        var _this = this;
        var addList = _this.addressListId;
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
        // 获取省市json
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
        // 先清空原有的
        if(cityEle.children()){
            cityEle.empty();
        }
        var len = citys.length;
        for(var i=0; i<len; i++){
            var cityId = add0(proId, 2) + add0(i, 2);
            $(`<p data-cityId='${cityId}'>${citys[i].citysName}</p>`)
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
        // 先清空原有的
        if(areaEle.children()){
            areaEle.empty();
        }
        // http://127.0.0.1:3001/ajax/area?id=1309
        var areaUrl = `${APILIST.area}?id=${cityId}`;
        getAjax(areaUrl, function(d){
            // console.log(d.areas);
            var len = d.areas.length;
            for(var i=0; i<len; i++){
                $(`<p data-areaId='${d.areas[i].areaId}'>${d.areas[i].areaName}</p>`)
                .on('click',function(){
                    // 区item点击事件
                    var areaName = $(this).html();
                    _this.areaEvent(areaName);

                })
                .appendTo(areaEle);
            }
        });
    },


    // 省item点击事件 保存省份名 显示隐藏tab及列表
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
        // 点击省item的时候，市tab显示，区tab隐藏
        // 以防止 在没有选择市的情况下，直接先区。
        _this.tabB
            .show()
            .html('请选择市')
            .addClass('yellow');
        _this.tabC.hide();
    },
    // 市item点击事件 保存城市名 显示隐藏tab及列表
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
    // 区item点击事件 保存区名 
    areaEvent: function(areaName){
        _this = this;
        _this.tabC.html( areaName );
        
        _this.addressTitle( areaName );
        // 整个省市区选择框隐藏 且删除数组里的区
        _this.addressListId.hide();
        _this.isShow = false;
        _this.arr.splice(2, 1);
    },
    // 保存选择的省市区
    addressTitle: function(n){
        _this = this;
        var _arr = _this.arr;

        if(_arr.length<3){
            _arr.push(n);   
        }
        _this.addressDivId.html('');
        for(var i=0;i<_arr.length;i++){
            $(`<p/>${_arr[i]}</p>`).appendTo(_this.addressDivId);
        }
    },

    // 点击tabABC修改样式及数组
    tabAEvent: function(){
        _this = this;
        _this.tabA.on('click', function(){
            $(this).addClass('yellow');
            _this.tabB.removeClass('yellow').hide();
            _this.tabC.removeClass('yellow').hide();

            _this.provinceId.show();
            _this.cityId.hide();
            _this.areaId.hide();
            // 数组清空
            _this.arr.splice(0,3);
        })
    },
    tabBEvent: function(){
        _this = this;
        _this.tabB.on('click',function(){
            _this.tabA.removeClass('yellow');
            $(this).addClass('yellow');
            _this.tabC.removeClass('yellow').hide();

            _this.provinceId.hide();
            _this.cityId.show();
            _this.areaId.hide();
            // 数组只保留省
            _this.arr.splice(1,2);
            // console.log( _this.arr );
        });
    },
    tabCEvent: function(){
        _this = this;
        _this.tabC.on('click', function(){
            _this.tabA.removeClass('yellow');
            _this.tabB.removeClass('yellow');
            _this.tabC.addClass('yellow');

            _this.provinceId.hide();
            _this.cityId.hide();
            _this.areaId.show();
        });
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
        isShow:false,
        arr:[]
 }
 new AddressMenuFn(_config);


