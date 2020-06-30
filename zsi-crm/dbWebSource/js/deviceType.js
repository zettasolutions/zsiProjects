 var dt = (function(){
    var _pub             = {}
        ,gDateType       = ""
        ,gDeviceTypeId   = null
        ,gDeviceModelId  = null
        ,gDeviceBrandId  = null
        ,gActiveTab = "";
    
     
    zsi.ready = function(){
        $(".page-title").html("Devices");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayDeviceTypes()
        displayDeviceModels();
        displayDeviceBrand();
        displayDeviceTerms();
        gActiveTab = "device-types";
        
        $("#deviceTypeId").select2({placeholder: "DEVICE TYPE",allowClear: true});
        $("#deviceModelId").select2({placeholder: "DEVICE MODEL",allowClear: true});
        $("#deviceBrandId").select2({placeholder: "DEVICE BRAND",allowClear: true});
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
            var target = $(e.target).attr("href"); 
            switch(target){
                case "#nav-device-types":
                    gActiveTab = "device-types";
                    $("#searchVal").val("");
                    $("#deviceTypeDiv").addClass("hide");
                    $("#deviceModelDiv").addClass("hide");
                    $("#deviceBrandDiv").addClass("hide");
                    break;
                case "#nav-device-models":
                    gActiveTab = "device-models";
                    $("#searchVal").val("");
                    $("#deviceBrandDiv").removeClass("hide");
                    $("#deviceModelDiv").addClass("hide");
                    $("#deviceTypeDiv").addClass("hide");
                    $("#deviceBrandId").val(gDeviceBrandId).trigger('change');
                    break;
                case "#nav-device-brands":
                    gActiveTab = "device-brands";
                    $("#searchVal").val("");
                    $("#deviceTypeDiv").removeClass("hide");
                    $("#deviceModelDiv").addClass("hide");
                    $("#deviceBrandDiv").addClass("hide");
                    $("#assetId").val(gDeviceTypeId).trigger('change');
                    break;
                case "#nav-device-terms":
                    gActiveTab = "device-terms";
                    $("#searchVal").val("");
                    $("#deviceModelDiv").removeClass("hide");
                    $("#deviceTypeDiv").addClass("hide");
                    $("#deviceBrandDiv").addClass("hide");
                    $("#deviceModelId").val(gDeviceModelId).trigger('change');
                    break;
              default:break;
            } 
        }); 
        
    }; 
    
    _pub.btnDeleteInActiveModels = function(){ 
            zsi.form.deleteData({ 
                code:"ref-00020" 
                ,onComplete:function(data){
                   console.log("inside delete");
                     displayInactiveModels();
                }
        });
    }; 
    
    _pub.btnDeleteInActiveTypes = function(){ 
            zsi.form.deleteData({ 
                code:"ref-0004" 
                ,onComplete:function(data){ 
                     displayInactiveDeviceTypes();
                }
        });
    };
    
    _pub.btnDeleteInActiveDeviceBrand = function(){
        console.log("ggg");
            zsi.form.deleteData({ 
                code:"ref-00021" 
                ,onComplete:function(data){ 
                     displayInactiveDeviceBrand();
                }
        });
    }; 
    
    _pub.btnDeleteDeviceTerms = function(){ 
            zsi.form.deleteData({ 
                code:"ref-00022" 
                ,onComplete:function(data){ 
                     displayDeviceTerms();
                }
        });
    };
    
    function displaySelects(){
        $("#deviceTypeId").dataBind({
             sqlCode    : "D267" //dd_device_types_sel
            ,text       : "device_type"
            ,value      : "device_type_id" 
            ,required   : true
            ,onChange   : function(){ 
                gDeviceTypeId = this.val();  
            }
        });
        
        $("#deviceModelId").dataBind({
             sqlCode    : "D277" //dd_device_models_sel
            ,text       : "model_name"
            ,value      : "device_model_id" 
            ,required   : true
            ,onChange   : function(){ 
                gDeviceModelId = this.val();  
            }
        });
        
        $("#deviceBrandId").dataBind({
             sqlCode    : "D271" //dd_device_brands_sel
            ,text       : "device_brand_name"
            ,value      : "device_brand_id"
            ,onChange   : function(){ 
                gDeviceBrandId = this.val();  
            }
        }); 
                    
    }
    
    function displayDeviceTypes(searchVal){  
        $("#gridDeviceTypes").dataBind({
             sqlCode        : "D263" //device_type_sel
            ,parameters     : {search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows       : [ 
                    {text:"Device Type Code"              ,width:100       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"device_type_id"        ,type:"hidden"      ,value: app.svn(d,"device_type_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")})  
                                        + app.bs({name:"device_type_code"               ,type:"input"       ,value: app.svn(d,"device_type_code")});
                                        
                        }
                    } 
                    ,{text:"Device Type"                  ,type:"input"       ,name:"device_type"               ,width:100          ,style:"text-align:left"}
                    ,{text:"Device Description"           ,type:"input"       ,name:"device_type_desc"          ,width:200          ,style:"text-align:left"}
                    ,{text:"Active?"                      ,type:"yesno"       ,name:"is_active"                 ,width:60           ,style:"text-align:left"    ,defaultValue:"Y"}
                    
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        if(_dRows.length < 1) $("#nav-tab").find("[aria-controls='nav-device-models'],[aria-controls='nav-device-brands'],[aria-controls='nav-device-terms']").hide();
        	        _zRow.unbind().click(function(){
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _deviceTypeId  = _data.device_type_id;
            	            gDeviceTypeId = _deviceTypeId;
            	            displaySelects();
            	            $("#nav-tab").find("[aria-controls='nav-device-brands']").show();
            	            setTimeout(function(){
            	                $("#deviceTypeId").val(_deviceTypeId).trigger('change');
            	            }, 200);
                            displayDeviceBrand(_deviceTypeId);

        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });
                    
                  } 
            });
        } 
    
    function displayDeviceModels(device_brand_id,searchVal){  
        $("#gridDeviceModels").dataBind({
             sqlCode            : "D266" //device_models_sel
            ,parameters         : {device_brand_id: device_brand_id,search_val:(searchVal ? searchVal : "")}
	        ,height             : $(window).height() - 308 
            ,blankRowsLimit     : 5
            ,dataRows           : [
                    {text:"Model No"                                                                                    ,width:100       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"device_model_id"        ,type:"hidden"      ,value: app.svn(d,"device_model_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"device_brand_id"         ,type:"hidden"     ,value: device_brand_id})
                                        + app.bs({name:"model_no"               ,type:"input"       ,value: app.svn(d,"model_no")});
                                        
                        }
                    } 
                    ,{text:"Model Name"                     ,type:"input"           ,name:"model_name"              ,width:100       ,style:"text-align:left"}
                    ,{text:"Model Description"              ,type:"input"           ,name:"model_desc"              ,width:100       ,style:"text-align:left"}
                    ,{text:"Active?"                        ,type:"yesno"           ,name:"is_active"               ,width:60        ,style:"text-align:left"     ,defaultValue:"Y"}
                    
                ] 
                ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        if(_dRows.length < 1) $("#nav-tab").find("[aria-controls='nav-device-terms']").hide();
        	        _zRow.unbind().click(function(){
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _deviceModelId  = _data.device_model_id;
            	            gDeviceModelId = _deviceModelId;
            	            displaySelects();
            	            $("#nav-tab").find("[aria-controls='nav-device-terms']").show();
            	            setTimeout(function(){
            	                $("#deviceBrandId").val(_deviceModelId).trigger('change');
            	            }, 200);
                            displayDeviceTerms(_deviceModelId);

        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });
                    
                } 
            });
        }
    
    function displayDeviceBrand(device_type_id,searchVal){  
       
        $("#gridDeviceBrand").dataBind({
             sqlCode        : "D268" //device_brands_sel
            ,parameters         : {device_type_id: device_type_id,search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 308
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: "Device Brand Code"                       ,width:150       ,style:"text-align:left"
                    ,onRender : function(d){
                        return app.bs({name:"device_brand_id"           ,type:"hidden"              ,value: app.svn(d,"device_brand_id")}) 
                            + app.bs({name:"is_edited"                  ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                            + app.bs({name:"device_type_id"             ,type:"hidden"              ,value: device_type_id})
                            + app.bs({name:"device_brand_code"          ,type:"input"               ,value: app.svn(d,"device_brand_code")});
                    }
                 }
                ,{text: "Device Brand Name"             ,width : 200    ,name:"device_brand_name"           ,type:"input"        ,style : "text-align:left;"} 
                ,{text: "Active?"                       ,width : 60     ,name:"is_active"                   ,type:"yesno"        ,style : "text-align:center;" ,defaultValue: "Y"}
            ]
            ,onComplete: function(o){
                var _dRows = o.data.rows;
                var _this  = this;
    	        var _zRow  = _this.find(".zRow");
    	        if(_dRows.length < 1) $("#nav-tab").find("[aria-controls='nav-device-models'],[aria-controls='nav-device-terms']").hide();
    	        _zRow.unbind().click(function(){
    	            var _self=this;
    	            setTimeout(function(){ 
        	            var _i      = $(_self).index();
        	            var _data   = _dRows[_i];
        	            var _deviceBrandId  = _data.device_brand_id;
        	            gDeviceBrandId = _deviceBrandId;
        	            displaySelects();
        	            $("#nav-tab").find("[aria-controls='nav-device-models']").show();
        	            setTimeout(function(){
        	                $("#deviceBrandId").val(_deviceBrandId).trigger('change');
        	            }, 200);
                        displayDeviceModels(_deviceBrandId);

    	            }, 200);
    	        });
    	        _this.on('dragstart', function () {
                    return false;
                });
                 
            }
        });
    }
    
    function displayDeviceTerms(device_model_id){ 
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        $("#gridDeviceTerms").dataBind({
             sqlCode            : "D273" //device_terms_sel 
            ,parameters         : {device_model_id: device_model_id}
            ,height             : $(window).height() - 308 
            ,blankRowsLimit     : 5
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"dm_term_id"             ,type:"hidden"      ,value: app.svn(d,"dm_term_id")})  
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"device_model_id"              ,type:"hidden"      ,value: device_model_id})
                                        + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                        
                        }
                    
                    }  
                    ,{text:"Term"                       ,type:"input"           ,name:"term_id"                         ,width:100       ,style:"text-align:left"}
                    ,{text:"Base Monthly Amount"        ,type:"input"           ,name:"base_monthly_amount"             ,width:150       ,style:"text-align:left"}
                    ,{text:"Interest Amount"            ,type:"input"           ,name:"interest_amount"                 ,width:150       ,style:"text-align:left"}
                    ,{text:"Total Monthly Amount"       ,type:"input"           ,name:"total_monthly_amount"            ,width:150       ,style:"text-align:left"}
                    
                ] 
                ,onComplete : function(d){
                    this.find("[name='cbFilter2']").setCheckEvent("#gridDeviceTerms input[name='cb']");  
                } 
            });
    }  
    
    function displayInactiveModels(){
         var cb = app.bs({name:"cbFilter2",type:"checkbox"});
         $("#gridInactiveModels").dataBind({
    	     sqlCode            : "D266" //device_models_sel
            ,parameters         : {is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                    return app.bs({name:"device_model_id"               ,type:"hidden"      ,value: app.svn(d,"device_model_id")}) 
                                         + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                         + app.bs({name:"device_type_id"               ,type:"hidden"      ,value: app.svn(d,"device_type_id")})
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                        
                        }
                    
                    } 
                    ,{text:"Model No"                                                           ,width:240       ,style:"text-align:left"
                        ,onRender: function(d){ 
                            return app.bs({name:"model_no"                  ,type:"input"       ,value: app.svn(d,"model_no")})
                                 + app.bs({name:"model_name"                ,type:"hidden"      ,value: app.svn(d,"model_name")})
                                 + app.bs({name:"model_desc"                ,type:"hidden"      ,value: app.svn(d,"model_desc")})
                                 + app.bs({name:"brand_id"                  ,type:"hidden"      ,value: app.svn(d,"brand_id")})
                                  
                
                        }
                    }
                    ,{text:"Active?"                                                            ,width:60        ,style:"text-align:left"     ,defaultValue:"N"
                        ,onRender: function(d){ 
                            return app.bs({name:"is_active"                 ,type:"yesno"       ,value: app.svn(d,"is_active")})
                        }
                    }
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter2']").setCheckEvent("#gridInactiveModels input[name='cb']");  
                }
        });    
    }
    
    function displayInactiveDeviceTypes(){
         var cb = app.bs({name:"cbFilter3",type:"checkbox"});
         $("#gridInactiveDeviceType").dataBind({
    	     sqlCode            : "D263" //device_type_sel
            ,parameters         : {is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                    return app.bs({name:"device_type_id"        ,type:"hidden"      ,value: app.svn(d,"device_type_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")})  
                                        + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                        
                        }
                    
                    } 
                    
                    ,{text:"Device Type Code"              ,width:240       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                    return  app.bs({name:"device_type_code"             ,type:"input"       ,value: app.svn(d,"device_type_code")})
                                        + app.bs({name:"device_type"                    ,type:"hidden"      ,value: app.svn(d,"device_type")}) 
                                        + app.bs({name:"device_type_desc"               ,type:"hidden"      ,value: app.svn(d,"device_type_desc")}) ;
                                        
                        }
                    }  
                    ,{text:"Active?"                      ,type:"yesno"       ,name:"is_active"                 ,width:60           ,style:"text-align:left"    ,defaultValue:"Y"}
                    
                    
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter3']").setCheckEvent("#gridInactiveDeviceType input[name='cb']");  
                }
        });    
    }
    
    function displayInactiveDeviceBrand(){
         var cb = app.bs({name:"cbFilter3",type:"checkbox"});
         $("#gridInactiveDeviceBrand").dataBind({
    	     sqlCode            : "D268" //device_brands_sel
            ,parameters         : {is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                    return app.bs({name:"device_brand_id"       ,type:"hidden"      ,value: app.svn(d,"device_brand_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")})  
                                        + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                        
                        }
                    
                    } 
                    
                    ,{text:"Device Brand Code"              ,width:240       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                    return  app.bs({name:"device_brand_code"            ,type:"input"       ,value: app.svn(d,"device_brand_code")})
                                        + app.bs({name:"device_brand_name"              ,type:"hidden"      ,value: app.svn(d,"device_brand_name")});
                                        
                        }
                    }  
                    ,{text:"Active?"                      ,type:"yesno"       ,name:"is_active"                 ,width:60           ,style:"text-align:left"    ,defaultValue:"Y"}
                    
                    
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter3']").setCheckEvent("#gridInactiveDeviceBrand input[name='cb']");  
                }
        });    
    } 
    
    $("#btnSaveDeviceTerms").click(function(){ 
        var _$grid = $("#gridDeviceTerms"); 
        _$grid.jsonSubmit({
             procedure: "device_terms_upd" 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDeviceTerms();
            } 
        }); 
    }); 
    
    $("#btnSaveDeviceBrand").click(function(){ 
        var _$grid = $("#gridDeviceBrand"); 
        _$grid.jsonSubmit({
             procedure: "device_brands_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDeviceBrand();
            } 
        }); 
    });
    
    $("#btnSaveInactiveBrand").click(function () {
        var _grid = $("#gridInactiveDeviceBrand");
        _grid.jsonSubmit({
                 procedure      : "device_brands_upd" 
                ,optionalItems  : ["is_active"] 
                ,onComplete     : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    displayInactiveDeviceBrand(_grid.data("id"));
                    $("#gridDeviceBrand").trigger("refresh");
                }
        });
    });
    
    $("#btnInactiveDeviceBrand").click(function(){ 
        $(".modal-title").text("Inactive Device Brand(s)");
        $('#modalInactiveDeviceBrand').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveDeviceBrand();
    }); 
    
    $("#btnSaveDeviceType").click(function(){
        $("#gridDeviceTypes").jsonSubmit({
            procedure:"device_types_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete:function(data){
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    displayDeviceTypes();
                    console.log("inside if")
                }else{
                    console.log("inside else")
                    alert("Data cannot be duplicated");
                }
            }
        });
    });
    
    $("#btnDeleteDeviceType").click(function(){ 
        zsi.form.deleteData({ 
            code:"ref-0004"
           ,onComplete:function(data){
                displayDeviceTypes();
             
           }
        });
    });
       
    $("#btnSaveInactive").click(function () {
        var _grid = $("#gridInactiveModels");
        _grid.jsonSubmit({
                 procedure      : "device_models_upd" 
                ,optionalItems  : ["is_active"] 
                ,onComplete     : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    displayInactiveModels(_grid.data("id"));
                    $("#gridDeviceModels").trigger("refresh");
                }
        });
    });
    
    $("#btnSaveInactiveTypes").click(function () {
        var _grid = $("#gridInactiveDeviceType");
        _grid.jsonSubmit({
                 procedure      : "device_types_upd" 
                ,optionalItems  : ["is_active"] 
                ,onComplete     : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    displayInactiveDeviceTypes(_grid.data("id"));
                    $("#gridDeviceTypes").trigger("refresh");
                }
        });
    });
     
    $("#btnInactiveDeviceType").click(function(){
        $(".modal-title").text("Inactive Device Type(s)");
        $('#modalInactiveDeviceType').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveDeviceTypes();
        
    });
      
    $("#btnInactiveDeviceModels").click(function(){
        $(".modal-title").text("Inactive Device Model(s)");
        $('#modalInactiveDeviceModels').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveModels();
        
    }); 
      
    $("#btnSaveDeviceModels").click(function(){ 
        $("#gridDeviceModels").jsonSubmit({
             procedure: "device_models_upd"
            ,optionalItems: ["is_active","brand_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDeviceModels(gDeviceTypeId);
            } 
        }); 
    });
    
    $("#btnFilterAsset").click(function(){ 
        displayDeviceBrand(gDeviceTypeId);
    });
    
     $("#btnFilterModel").click(function(){ 
        displayDeviceTerms(gDeviceModelId);
    });
    
    $("#btnFilterBrand").click(function(){ 
        displayDeviceModels(gDeviceBrandId);
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "device-models") displayDeviceModels(gDeviceBrandId,_searchVal);
        else if(gActiveTab === "device-brands") displayDeviceBrand(gDeviceTypeId,_searchVal);
        else displayDeviceTypes(_searchVal);
        
    }); 
    
    $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(gActiveTab === "device-models") displayDeviceModels(gDeviceBrandId,_searchVal);
           else if(gActiveTab === "device-brands") displayDeviceBrand(gDeviceTypeId,_searchVal);
           else displayDeviceTypes(_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "device-models") displayDeviceModels(gDeviceTypeId);
            else if(gActiveTab === "device-brands") displayDeviceBrand(gDeviceTypeId);
            else displayDeviceTypes(gDeviceTypeId);
        }
    });
    
   return _pub;
})();                                     