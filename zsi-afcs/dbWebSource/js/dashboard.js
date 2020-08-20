 var db=(function(){ 
        $(".page-title").html("Dashboard");    
        $('[data-toggle="tooltip"]').tooltip();       
         
        function getYearlyData(){
            zsi.getData({
                 sqlCode : "P1389" 
                ,parameters : {client_id:app.userInfo.company_id}
                ,onComplete : function(d) {
                    var _rows = d.rows;  
                    var _getColor = function(cb){ 
                        var _colorSet = new am4core.ColorSet();
                        _colors = _colorSet;   
                        cb(_colors);
                    }; 
                    var _displayYearGraph = function(o){   
                        var _dataLength = o.data.length;
                        var _data = [];
                        var _colorSet = new am4core.ColorSet(); 
                        var _getCategoryColor = function(category, index){
                            var _color = $.grep(_colorRows, function(z) {
                                return z.field_name.toUpperCase() == category.toUpperCase();
                            });
                            return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                        };
                        var _setData = function(){  
                            $.each(o.data, function(i,v){  
                                var _json = {};  
                                    _json.category = v.pay_year;
                                    _json.value = v.total_fare;
                                    _json.color = _colorSet.next();  
                                _data.push(_json);
                                
                            });
                        
                        };
                        _setData();  
                        am4core.ready(function() { 
                             var chart = am4core.create(o.container, am4charts.XYChart); 
                            chart.numberFormatter.numberFormat = '###';
                            // Set data  
                            var generateChartData = function() { 
                                var chartData = [];  
                                for (var i = 0; i < _data.length; i++) {  
                                    chartData.push({
                                        category: _data[i].category,
                                        value: _data[i].value,
                                        color: _data[i].color,
                                        id: i
                                      }); 
                                    } 
                                return chartData; 
                            }; 
                            // Add data
                            chart.data = generateChartData();  
                           // Add and configure Series    
                            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                categoryAxis.dataFields.category = "category";
                                categoryAxis.renderer.minGridDistance = 20;    
                            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                            var series = chart.series.push(new am4charts.ColumnSeries());  
                                series.dataFields.categoryX = "category"; 
                                series.dataFields.valueY = "value";    
                                series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                                if(o.category==="pay_month") series.columns.template.tooltipText = "Month of "+"{categoryX}: [bold]{valueY}[/]";  
                            var series2 = chart.series.push(new am4charts.LineSeries());
                                series2.name = "category";
                                series2.stroke = am4core.color("#CDA2AB");
                                series2.strokeWidth = 3;
                                series2.dataFields.valueY = "value";
                                series2.dataFields.categoryX = "category";      
                                chart.cursor = new am4charts.XYCursor();   
                                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                series.columns.template.adapter.add("fill", function (fill, target) { 
                                	return chart.colors.getIndex(target.dataItem.index);
                                });
                            var title = chart.titles.create();
                                title.text = "Yearly Collection";   
                        });
                        displayMonthlyCharts(_rows);
                    }; 
                    var _container = "graph1"
                        ,_value = "total_fare"
                        ,_category = "pay_year"
                        ,_isColorSet = false
                        ,_json = {};
                        _json.title = "Collection";
                        _json.container = _container;
                        _json.value = _value;
                        _json.category = _category;
                        _json.isColorSet = _isColorSet;  
                        _getColor(function(colorSet){ 
                            _json.colorSet = colorSet;
                            _json.data = _rows;
                            _json.category; 
                            _json.title = "Collection";  
                            _displayYearGraph(_json); 
                             
                        });  
                
                    }
                });
           }getYearlyData();
       
        function displayMonthlyCharts(data){ 
            var gYear1 = ""
                ,gYear2 = ""
                ,gYear3 = ""
                ,gYear4 = ""
                ,gYear5 = ""
                ,_textTitle = " Monthly Collection";  
            for(var i = 0; i < data.length; i++) {  
                $(".spanYears1").text(data[0].pay_year + _textTitle); 
                gYear1 = data[0].pay_year; 
                $(".spanYears2").text(data[1].pay_year + _textTitle); 
                gYear2 = data[1].pay_year;  
                $(".spanYears3").text(data[2].pay_year + _textTitle);
                gYear3 = data[2].pay_year;  
                $(".spanYears4").text(data[3].pay_year + _textTitle);  
                gYear4 = data[3].pay_year;  
                if(data.length===5){
                    $(".spanYears5").text(data[4].pay_year + _textTitle); 
                    gYear5 = data[4].pay_year;   
                }else{ 
                    $(".spanYears5").text("No Collection found"); 
                    gYear5 = "";
                }    
            }  
            var _$spanYears5 = $(".spanYears5").text();
            var _$spanYears4 = $(".spanYears4").text();
            var _$spanYears3 = $(".spanYears3").text();
            var _$spanYears2 = $(".spanYears2").text(); 
            var _$spanYears1 = $(".spanYears1").text();   
            
            am4core.useTheme(am4themes_animated);
            // Enable queuing 
            am4core.options.queue = true;
            am4core.options.onlyShowOnViewport = true;     
            var _colors = [];
            var _colorRows = [];
            
            var _getData = function(sqlCode,params,cb){    
                zsi.getData({
                     sqlCode : sqlCode 
                    ,parameters : params
                    ,onComplete : function(d) {
                        var _rows = d.rows;  
                        cb(_rows);  
                    }
                });
            };
           
            var _getColor = function(cb){ 
                var _colorSet = new am4core.ColorSet();
                    _colors = _colorSet;  
                    cb(_colors);
            }; 
            var _displayBarGraph = function(o){ 
                var _dataLength = o.data.length;
                var _data = [];
                var _colorSet = new am4core.ColorSet(); 
                var _getCategoryColor = function(category, index){
                    var _color = $.grep(_colorRows, function(z) {
                        return z.field_name.toUpperCase() == category.toUpperCase();
                    });
                    return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                };
                var _setData = function(){ 
                    $.each(o.data, function(i,v){  
                        var _json = {};  
                        _json.category = v.pay_month;
                        _json.value = v.total_fare;
                        _json.color = _colorSet.next();   
                        _data.push(_json); 
                    });
                
                };
                _setData();  
                am4core.ready(function() { 
                    var chart = am4core.create(o.container, am4charts.XYChart); 
                    chart.numberFormatter.numberFormat = '###';
                    // Set data 
                    var _platform = ""; 
                    var selected;
                    var generateChartData = function() { 
                        var chartData = []; 
                        var _monthlyCtgry = ""; 
                        var _month = []; 
                            _month[1] = "January";
                            _month[2] = "February";
                            _month[3] = "March";
                            _month[4] = "April";
                            _month[5] = "May";
                            _month[6] = "June";
                            _month[7] = "July";
                            _month[8] = "August";
                            _month[9] = "September";
                            _month[10] = "October";
                            _month[11] = "November";
                            _month[12] = "December"; 
                        for (var i = 0; i < _data.length; i++) {      
                            for(var n =0;n<=_month.length; n++){ 
                                if(_data[i].category === n){ 
                                  _monthlyCtgry = _month[n]; 
                                } 
                            }  
                            chartData.push({
                                title       : o.title,
                                year        : o.year,
                                code        : o.sqlCode,
                                category    : _monthlyCtgry,
                                categorySub : _data[i].category,
                                container   : o.container, 
                                value       : _data[i].value,
                                color       : _data[i].color,
                                id: i
                            });  
                        }  
                        return chartData; 
                    }; 
                    // Add data
                    chart.data = generateChartData();  
                   // Add and configure Series     
                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                        categoryAxis.dataFields.category = "category"; 
                        categoryAxis.renderer.minGridDistance = 20;
                        
                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                    var series = chart.series.push(new am4charts.ColumnSeries());  
                        series.dataFields.categoryX = "category"; 
                        series.dataFields.valueY = "value";    
                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                        series.columns.template.tooltipText = "Month of "+"{categoryX}: [bold]{valueY}[/]";    
                        chart.cursor = new am4charts.XYCursor();   
                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                    var series2 = chart.series.push(new am4charts.LineSeries());
                        series2.name = "category";
                        series2.stroke = am4core.color("#CDA2AB");
                        series2.strokeWidth = 3;
                        series2.dataFields.valueY = "value";
                        series2.dataFields.categoryX = "category";
                        series.columns.template.adapter.add("fill", function (fill, target) { 
                        	return chart.colors.getIndex(target.dataItem.index);
                        });
                
                    var title = chart.titles.create();    
                        if(o.data.length===0)title.text = 'No Monthly Data ';
                        else title.text = 'Monthly Data ';
                        series.columns.template.events.on("hit", function(ev) {
                            if (typeof ev.target.dataItem.dataContext.category) { 
                            var _catgry     = ev.target.dataItem.dataContext.category;
                            var _month      = ev.target.dataItem.dataContext.categorySub;
                            var _yearly     = ev.target.dataItem.dataContext.year;
                            var _container  = ev.target.dataItem.dataContext.container;
                            var _code       = ev.target.dataItem.dataContext.code; 
                            var _title      = ev.target.dataItem.dataContext.title;  
                            
                            var _dailyData = function(sqlCode,params, cb){  
                                var _params = {
                                   client_id:params.client_id
                                   ,month:params.month 
                                   ,year:params.year
                                };
                                zsi.getData({
                                         sqlCode    : "P1387"
                                        ,parameters : _params
                                        ,onComplete : function(d) { 
                                          cb(d.rows);   
                                    }
                                });
                            };  
                            
                            var _getDynamicColor = function(cb){ 
                                var _colorSet = new am4core.ColorSet();
                                    _colors = _colorSet;  
                                    cb(_colors);
                            }; 
                             
                            var _sqlCode = "P1387"   
                                ,_value = "total_fare"
                                ,_category = "pay_day"
                                ,_isColorSet = false
                                ,_json = {};
                                _params = {
                                    client_id   :app.userInfo.company_id 
                                   ,month       :_month
                                   ,year        :_yearly
                                }; 
                            _getDynamicColor(function(colorSet){
                                _dailyData(_sqlCode,_params, function(data){
                                    _json.colorSet  = colorSet;
                                    _json.data      = data;
                                    _json.category  = _category; 
                                    _json.subCtgry  = _month; 
                                    _json.container = _container;
                                    _json.sqlCode   = _code; 
                                    _json.title     = _title;
                                    _displayNewGraph(_json); 
                                });
                            }); 
                            
                            var _displayNewGraph = function(o){  
                                var _o = o;
                                var _dataLength = o.data.length;
                                var _data = [];
                                var _colorSet = new am4core.ColorSet(); 
                                var _getCategoryColor = function(category, index){
                                    var _color = $.grep(_colorRows, function(z) {
                                        return z.field_name.toUpperCase() == category.toUpperCase();
                                    });
                                    return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                                };
                                var _setDailyData = function(){  
                                    $.each(o.data, function(i,v){  
                                        var _json       = {};     
                                        _json.category  = v.pay_day; 
                                        _json.container = _o.container;
                                        _json.value     = v.total_fare;
                                        _json.sqlCode   = _o.sqlCode;
                                        _json.title     = _o.title;
                                        _json.color     = _colorSet.next();  
                                        _data.push(_json); 
                                    });
                                    
                                };
                                    _setDailyData();
                                am4core.ready(function() { 
                                    var chart = am4core.create(_o.container, am4charts.XYChart); 
                                    chart.numberFormatter.numberFormat = '###';
                                    // Set data  
                                    var generateDailyChartData = function() {
                                        var _chartData = [];    
                                        for (var i = 0; i < _data.length; i++) {  
                                            _chartData.push({
                                                container   : _data[i].container,
                                                category    : "Day "+_data[i].category,   
                                                value       : _data[i].value,
                                                color       : _data[i].color,
                                                id: i
                                            }); 
                                            
                                        } 
                                        return _chartData;
                                    }; 
                                    // Add Pay day data
                                    chart.data = generateDailyChartData(); 
                                   // Add and configure Series    
                                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                        categoryAxis.dataFields.category = "category";
                                        categoryAxis.renderer.minGridDistance = 20;   
                                    
                                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                                    var series = chart.series.push(new am4charts.ColumnSeries());  
                                        series.dataFields.categoryX = "category";  
                                        series.dataFields.valueY = "value";    
                                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";   
                                        chart.cursor = new am4charts.XYCursor();   
                                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                        series.columns.template.adapter.add("fill", function (fill, target) { 
                                        	return chart.colors.getIndex(target.dataItem.index);
                                        }); 
                                    var series2 = chart.series.push(new am4charts.LineSeries());
                                        series2.name = "category";
                                        series2.stroke = am4core.color("#CDA2AB");
                                        series2.strokeWidth = 3;
                                        series2.dataFields.valueY = "value";
                                        series2.dataFields.categoryX = "category";  
                                        //Add scroll 
                                        chart.scrollbarY = new am4core.Scrollbar();
                                     
                                    //Add title 
                                    var title = chart.titles.create();
                                        title.text = 'Month of ' + _catgry; 
                                    var resetLabel = chart.plotContainer.createChild(am4core.Label);
                                        resetLabel.text = "[bold]<< Back to monthly data";
                                        resetLabel.valign = "top";
                                        resetLabel.x = 20;
                                        resetLabel.y = 200;
                                        resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                                        resetLabel.events.on('hit', function(ev) {
                                            resetLabel.hide();
                                            title.text = "Monthly Data";  
                                            var _initCol = function(name){ 
                                                var _sqlCode = _code
                                                    ,_params = {
                                                        client_id:app.userInfo.company_id
                                                        ,year : _yearly 
                                                    }
                                                    ,_isColorSet = false
                                                    ,_json = {};
                                                    
                                                switch (name) { 
                                                    case name:  
                                                        _category   = "pay_month";
                                                        _container  = _container;
                                                        _value      = "total_fare"; 
                                                    break; 
                                                     
                                                }  
                                                _json.title         = _title;
                                                _json.container     = _container;
                                                _json.value         = "total_fare";
                                                _json.category      = "pay_month";
                                                _json.isColorSet    = _isColorSet;  
                                                _getColor(function(colorSet){
                                                    _getData(_sqlCode,_params, function(data){
                                                        _json.colorSet = colorSet;
                                                        _json.data = data;
                                                        _json.category; 
                                                        _json.title = _title; 
                                                        _json.year =_yearly; 
                                                         _json.sqlCode = _code; 
                                                        _displayBarGraph(_json); 
                                                    });
                                                }); 
                                        }; 
                                        _initCol(o.title);   
                                        resetLabel.hide(); 
                                    }); 
                                    resetLabel.show(); 
                                });
                                
                            }; 
                        }
                      }, this); 
                });
            };  
            var _init = function(name){ 
                 
                var _params = {
                        client_id:app.userInfo.company_id  
                    }
                    ,_sqlCode = "P1388"
                    ,_container = "graph2"
                    ,_value = "total_fare"
                    ,_category = "pay_month"
                    ,_isColorSet = false
                    ,_name = ""
                    ,_json = {}; 
                   
                    switch (name) { 
                        case _$spanYears1:  
                            _container = "graph6";
                            _sqlCode = "P1388";
                            _name = _$spanYears1;  
                            _params = {
                                client_id:app.userInfo.company_id 
                               ,year : gYear1
                            };
                            break;  
                        case _$spanYears2: 
                            _container = "graph5";
                            _sqlCode = "P1388";
                            _name = _$spanYears2;  
                            _params = {
                                client_id:app.userInfo.company_id 
                               ,year : gYear2
                            };
                            break;  
                        case _$spanYears3: 
                            _container = "graph4";
                            _sqlCode = "P1388";
                            _name = _$spanYears3;  
                            _params = {
                                client_id:app.userInfo.company_id 
                               ,year : gYear3
                            };
                            break; 
                        case _$spanYears4: 
                            _container = "graph3";
                            _sqlCode = "P1388";
                            _name = _$spanYears4;  
                            _params = {
                                client_id:app.userInfo.company_id 
                               ,year : gYear4
                            };
                            break;  
                        case _$spanYears5: 
                            _container = "graph2";
                            _sqlCode = "P1388"; 
                            _name = _$spanYears5; 
                            _params = {
                                client_id:app.userInfo.company_id 
                               ,year : gYear5
                            };
                            break; 
                    } 
                       
                    _json.title = _name;
                    _json.container = _container;
                    _json.value = _value;
                    _json.category = _category;
                    _json.isColorSet = _isColorSet;  
                    _getColor(function(colorSet){
                        _getData(_sqlCode,_params, function(data){ 
                            _json.colorSet = colorSet;
                            _json.data = data;
                            _json.category = _category; 
                            _json.title = _name; 
                            _json.sqlCode = _sqlCode;  
                            _json.year = _params.year;  
                            _displayBarGraph(_json); 
                        });
                    }); 
            }; 
            
            _init(_$spanYears5); 
            _init(_$spanYears4);
            _init(_$spanYears3); 
            _init(_$spanYears2);
            _init(_$spanYears1);
            
        } 
        
     
})();           
           
                                                                                                               
                                                                                                                                                                                                                                                                                                                      