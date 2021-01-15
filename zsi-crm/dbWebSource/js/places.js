  var places = (function(){
    var  _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Places");
        displayCountry();
        $("#country_id").select2({placeholder: "COUNTRY",allowClear: true});
        $("#state_id").select2({placeholder: "PROVINCE/STATE",allowClear: true});
        $("#city_id").select2({placeholder: "CITY",allowClear: true});
    };
    
    function displayCountry(searchVal){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridCountry").dataBind({
             sqlCode        : "C1321"
            ,parameters     : {search_val: searchVal? searchVal : ""}
            ,height         : $(window).height() - 336
            ,blankRowsLimit : 5
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"country_id"            ,type:"hidden"      ,value: app.svn(d,"country_id")}) 
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "Country Code"                          ,name:"country_code"                ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Country Name"                          ,name:"country_name"                ,type:"input"       ,width : 300   ,style : "text-align:left;"}
                ,{text: "Country Surname"                       ,name:"country_sname"               ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Default?"                              ,name:"is_default"                  ,type:"yesno"       ,width : 60   ,defaultValue : "N"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter1']").setCheckEvent("#gridCountry input[name='cb']");
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
                    
                    $("#country_id").dataBind({
                        sqlCode      : "D247"
                       ,text         : "country_name"
                       ,value        : "country_id"
                       ,onComplete   : function(){
                           $(this).val(_data.country_id).trigger("change");
                       }
                    });
    	            displayState(_data.country_id);
    	            $(".main-nav-tabs").find("[aria-controls='nav-state']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayState(id){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        var _countryId = parseInt($("#country_id").val());
        $("#gridState").dataBind({
             sqlCode        : "S1316"
            ,parameters     : {country_id:id? id : _countryId}
            ,blankRowsLimit : 5
            ,height         : $(window).height() - 337         
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"state_id"                  ,type:"hidden"      ,value: app.svn(d,"state_id")})
                                 + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"country_id"                ,type:"hidden"      ,value: _countryId? _countryId :id}) 
                                 + (d !==null ? app.bs({name:"cb"           ,type:"checkbox"}) : "" );
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "State Name"                      ,name:"state_name"           ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter2']").setCheckEvent("#gridState input[name='cb']");
                
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            var countryId = parseInt($("#country_id").val());
    	            
    	            $("#state_id").dataBind({
                        sqlCode      : "D248"
                       ,parameters   : {country_id:countryId? countryId :id}
                       ,text         : "state_name"
                       ,value        : "state_id"
                       ,onComplete   : function(){
                           $(this).val(_data.state_id).trigger("change");
                           
                           console.log("_data.state_id",_data.state_id);
                       }
                    });
    	            displayCity(_data.state_id);
    	            $(".main-nav-tabs").find("[aria-controls='nav-city']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayCity(id){
        var cb = app.bs({name:"cbFilter3",type:"checkbox"});
        var _stateId = parseInt($("#state_id").val());
        $("#gridCity").dataBind({
             sqlCode        : "C1319"
            ,parameters     : {state_id:id? id : _stateId}
            ,blankRowsLimit : 5
            ,height         : $(window).height() - 337         
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"city_id"                 ,type:"hidden"      ,value: app.svn(d,"city_id")})
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"state_id"                ,type:"hidden"      ,value: _stateId? _stateId :id}) 
                                 + (d !==null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "City Code"                      ,name:"city_code"           ,type:"input"       ,width : 60     ,style : "text-align:left;"}
                ,{text: "City Name"                      ,name:"city_name"           ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter3']").setCheckEvent("#gridCity input[name='cb']");
                
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            var stateId = parseInt($("#state_id").val());
    	            
    	            $("#city_id").dataBind({
                        sqlCode      : "D246"
                       ,parameters   : {state_id:stateId? stateId :id}
                       ,text         : "city_name"
                       ,value        : "city_id"
                       ,onComplete   : function(){
                           $(this).val(_data.city_id).trigger("change");
                       }
                    });
    	            displayBarangay(_data.city_id);
    	            $(".main-nav-tabs").find("[aria-controls='nav-barangay']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayBarangay(id){
        var cb = app.bs({name:"cbFilter4",type:"checkbox"});
        var _cityId = parseInt($("#city_id").val());
        $("#gridBarangay").dataBind({
             sqlCode        : "B1317"
            ,parameters     : {city_id:id? id : _cityId}
            ,blankRowsLimit : 5
            ,height         : $(window).height() - 337         
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"barangay_id"           ,type:"hidden"      ,value: app.svn(d,"barangay_id")})
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"city_id"               ,type:"hidden"      ,value: _cityId? _cityId :id}) 
                                 + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                        }
                }
                ,{text: "Barangay Name"                      ,name:"barangay_name"             ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                $("[name='cbFilter4']").setCheckEvent("#gridBarangay input[name='cb']");
            }
        });
    }
    
    $("#btnSearchVal,#btnFilterValCountry,#btnFilterValState,#btnFilterValCity").click(function(){
        var _colName = $(this)[0].id;
        var _searchVal = $("#searchVal").val();
        
        if(_colName === "btnSearchVal") displayCountry(_searchVal); 
        if(_colName === "btnFilterValCountry") displayState(); 
        if(_colName === "btnFilterValState") displayCity(); 
        if(_colName === "btnFilterValCity") displayBarangay(); 
        
    });
    $('#searchVal').bind('keypress', function(e) {
        var _searchVal = $(this).val();
        var code = e.keyCode || e.which;
        if(code == 13){
            displayCountry(_searchVal);
        }
    });
    //SAVES
    $("#btnSaveCountry").click(function () {
       $("#gridCountry").jsonSubmit({
             procedure: "countries_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridCountry").trigger("refresh");
            }
        });
    });
    $("#btnSaveState").click(function () {
       $("#gridState").jsonSubmit({
             procedure: "state_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridState').trigger('refresh');
            }
        });
    }); 
    $("#btnSaveCity").click(function () {
       $("#gridCity").jsonSubmit({
             procedure: "cities_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridCity').trigger('refresh');
            }
        });
    });
    $("#btnSaveBarangay").click(function () {
       $("#gridBarangay").jsonSubmit({
             procedure: "barangays_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridBarangay').trigger('refresh');
            }
        });
    });
    //DELETE
    $("#btnDeleteCountry").click(function(){ 
        $("#gridCountry").deleteData({
            tableCode: "ref-0006"
            ,onComplete : function(d){
                $('#gridCountry').trigger('refresh');
            }
         });      
    });
    $("#btnDeleteState").click(function(){ 
        $("#gridState").deleteData({
            tableCode: "ref-0007"
            ,onComplete : function(d){
                $('#gridState').trigger('refresh');
            }
         });      
    });
    $("#btnDeleteCity").click(function(){
        $("#gridCity").deleteData({
            tableCode: "ref-0008"
            ,onComplete : function(d){
                $('#gridCity').trigger('refresh');
            }
         }) ;     
    }); 
    $("#btnDeleteBarangay").click(function(){
        $("#gridBarangay").deleteData({
            tableCode: "ref-0009"
            ,onComplete : function(d){
                $('#gridBarangay').trigger('refresh');
            }
         }) ;     
    }); 
    
    return _pub;
})();            






     