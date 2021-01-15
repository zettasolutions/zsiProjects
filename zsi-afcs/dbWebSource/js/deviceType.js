 var dt = (function(){
    var _pub             = {}
        ,gDateType       = ""
        ,gDeviceTypeId   = null
        ,gDeviceModelId  = null
        ,gDeviceBrandId  = null
        ,gBatchId        = null
        ,gActiveTab = "";
    
    
     
    zsi.ready = function(){
        $(".page-title").html("Devices");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayDeviceTypes()
        displayDeviceBrand();
        displayDeviceBatch();
        /*displayDevices();*/
        gActiveTab = "device-types";
        
        $("#deviceTypeId").select2({placeholder: "DEVICE TYPE",allowClear: true});
        $("#deviceModelId").select2({placeholder: "DEVICE MODEL",allowClear: true});
        $("#deviceBrandId").select2({placeholder: "DEVICE BRAND",allowClear: true});
        
        
    }; 
   $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
       var target = $(e.target).attr("href"); 
       switch(target){
           case "#nav-device-types":
               gActiveTab = "device-types";
               $("#searchVal").val(""); 
               break;
           case "#nav-device-models":
               gActiveTab = "device-models";
               $("#searchVal").val(""); 
               $("#deviceBrandId").val(gDeviceBrandId).trigger('change');
               break;
           case "#nav-device-brands":
               gActiveTab = "device-brands";
               $("#searchVal").val(""); 
               $("#assetId").val(gDeviceTypeId).trigger('change');
               break;
           case "#nav-device-terms":
               gActiveTab = "device-terms";
               $("#searchVal").val(""); 
               $("#deviceModelId").val(gDeviceModelId).trigger('change');
               break;
         default:break;
       } 
   }); 
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
    
    _pub.btnInactiveDevices = function(){
        $(".modal-title").text("Inactive Device(s)");
        $('#modalInactiveDevices').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveDevices();
    };
    
    function displayInactiveDevices(){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
         $("#gridInactiveDevices").dataBind({
    	     sqlCode            : "D262" 
            ,parameters         : {is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                     {text:"Serial No"                                                                                    ,width:120       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"device_id"              ,type:"hidden"      ,value: app.svn(d,"device_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"batch_id"               ,type:"hidden"      ,value: gBatchId})
                                        + app.bs({name:"serial_no"              ,type:"input"       ,value: app.svn(d,"serial_no")})
                                        + app.bs({name:"tag_no"                 ,type:"hidden"      ,value: app.svn(d,"tag_no")})
                                        + app.bs({name:"client_id"              ,type:"hidden"      ,value: app.svn(d,"client_id")})
                                        + app.bs({name:"released_date"          ,type:"hidden"      ,value: app.svn(d,"released_date")})
                                        + app.bs({name:"device_type_id"         ,type:"hidden"      ,value: app.svn(d,"device_type_id")})
                                        
                                        ;
                                        
                        }
                    } 
                    ,{text:"Active?"                            ,width:120        ,style:"text-align:left"     ,defaultValue:"Y"
                        ,onRender : function(d){
                            return    app.bs({name:"is_active"              ,type:"yesno"      ,value: app.svn(d,"is_active")})
                                    + app.bs({name:"status_id"              ,type:"hidden"      ,value: app.svn(d,"status_id")});
                        }
                    } 
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter2']").setCheckEvent("#gridInactiveModels input[name='cb']");  
                }
        });  
    }
    
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
                    
                  } 
            });
        }  
    
    function displayDeviceBrand(device_type_id,searchVal){  
       
        $("#gridDeviceBrand").dataBind({
             sqlCode        : "D268"  
            ,parameters         : {device_type_id: device_type_id,search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 308
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: "Device Brand Code"                       ,width:150       ,style:"text-align:left"
                    ,onRender : function(d){
                        return app.bs({name:"device_brand_id"           ,type:"hidden"              ,value: app.svn(d,"device_brand_id")}) 
                            + app.bs({name:"is_edited"                  ,type:"hidden"              ,value: app.svn(d,"is_edited")}) 
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
    	         
            }
        });
    }
    
    function displayDeviceBatch(device_model_id){  
        $("#gridDeviceBatch").dataBind({
             sqlCode            : "D1292" 
            ,parameters         : {device_model_id: device_model_id}
            ,height             : $(window).height() - 308 
            ,blankRowsLimit     : 5
            ,dataRows           : [
                    {text:"Batch No"        ,width:100              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"batch_id"               ,type:"hidden"      ,value: app.svn(d,"batch_id")})  
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")})  
                                        + app.bs({name:"batch_no"               ,type:"input"      ,value: app.svn(d,"batch_no")});
                                        
                        }
                    
                    }   
                    ,{text:"Batch QTY"                      ,type:"input"           ,name:"batch_qty"                   ,width:150       ,style:"text-align:left"}
                    ,{text:"Invoice No"                     ,type:"input"           ,name:"invoice_no"                  ,width:150       ,style:"text-align:left"}
                    ,{text:"Invoice Date"                   ,type:"input"           ,name:"invoice_date"                ,width:150       ,style:"text-align:left"}
                    ,{text:"DR No"                          ,type:"input"           ,name:"dr_no"                       ,width:150       ,style:"text-align:left"}
                    ,{text:"Supplier"                       ,type:"select"          ,name:"supplier_id"                 ,width:150       ,style:"text-align:left"}
                    ,{text:"Received Date"                  ,type:"input"           ,name:"received_date"               ,width:150       ,style:"text-align:left"}
                    ,{text:"Received By"                    ,type:"select"          ,name:"received_by"                 ,width:150       ,style:"text-align:left"}
                    ,{text:"Status"                         ,type:"select"          ,name:"status_id"                   ,width:150       ,style:"text-align:left"}
                    
                ] 
                ,onComplete : function(o){ 
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow"); 
        	        var _statCode = null;
        	        _zRow.find("[name='invoice_date'],[name='received_date']").datepicker({
        	           autoClose : true
        	           ,todayHighlight: true
        	        }).datepicker("setDate","0");
        	        _zRow.find("[name='supplier_id']").dataBind({
        	            sqlCode : "D280"  
        	           ,text    : "supplier_name"
        	           ,value   : "supplier_id"
        	        });
        	        _zRow.find("[name='received_by']").dataBind({
        	            sqlCode : "D260"  
        	           ,text    : "userFullName"
        	           ,value   : "user_id"
        	        });
        	        _zRow.find("[name='status_id']").dataBind({
        	            sqlCode : "D1293"  
        	           ,text    : "status_desc"
        	           ,value   : "status_code"
        	           ,onComplete: function(d){
        	             _statCode = this.val();
        	           }
        	           ,onChange : function(d){
        	               _statCode = this.val();
        	              
        	           }
        	           
        	        });
        	         
        	         _zRow.unbind().click(function(){ 
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _batchId  = _data.batch_id; 
            	            gBatchId = _data.batch_id;
            	            console.log("_batchId",_batchId);
            	            if(!isUD(_i) ) $("#nav-tab").find("[aria-controls='nav-devices']").show(); 
            	            displayDevices(_batchId,_statCode);
            	            $("#nav-tab").find("[aria-controls='nav-devices']").show();
            	            setTimeout(function(){
            	                $("#deviceTypeId").val(_batchId).trigger('change');
            	            }, 200);
                             

        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });
                     
                } 
            });
    } 
    
    function displayDevices(batchId,statCode){ 
        console.log("statCoded",statCode);
        $("#gridDevices").dataBind({
             sqlCode            : "D262" //devices_sel
            ,parameters         : {batch_id:(batchId ? batchId : "")}
            ,height             : $(window).height() - 308 
            ,blankRowsLimit     : 5
            ,dataRows           : [
                    {text:"Serial No"                                                                                    ,width:100       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"device_id"              ,type:"hidden"      ,value: app.svn(d,"device_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"batch_id"               ,type:"hidden"      ,value: batchId})
                                        + app.bs({name:"serial_no"              ,type:"input"       ,value: app.svn(d,"serial_no")});
                                        
                        }
                    } 
                    ,{text:"Tag No"                         ,type:"input"           ,name:"tag_no"                  ,width:100       ,style:"text-align:left"}
                    ,{text:"Client"                         ,type:"select"          ,name:"client_id"               ,width:100       ,style:"text-align:left"}
                    ,{text:"Sim Number"                     ,type:"input"           ,name:"sim_number"              ,width:100       ,style:"text-align:left"}
                    ,{text:"Release Date"                   ,type:"input"           ,name:"released_date"           ,width:100       ,style:"text-align:left"} 
                    ,{text:"Device Type"                    ,type:"select"          ,name:"device_type_id"          ,width:100       ,style:"text-align:left"}  
                    ,{text:"Active?"                        ,type:"yesno"           ,name:"is_active"               ,width:60        ,style:"text-align:left"     ,defaultValue:"Y"}
                    ,{text:"Status"                         ,type:"select"          ,name:"status_id"               ,width:100       ,style:"text-align:left"}
                    
                ] 
                ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        _zRow.find("[name='released_date']").datepicker({
        	           autoClose : true
        	           ,todayHighlight: true
        	        }).datepicker("setDate","0");
        	        _zRow.find("[name='device_type_id']").dataBind({
        	            sqlCode : "D267"
        	           ,value   : "device_type_id"
        	           ,text    : "device_type"
        	        });
        	         _zRow.find("[name='status_id']").dataBind({
        	            sqlCode : "D1293"  
        	           ,text    : "status_desc"
        	           ,value   : "status_code"
        	           ,selectedValue : statCode
        	        });
        	        
        	       _zRow.find("[name='sim_number']").keypress(validateNumber);
                } 
        });
    } 
    function validateNumber(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46) {
            return true;
        } else if ( key < 48 || key > 57 ) {
            return false;
        } else {
            return true;
        }
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
    
    $("#btnSaveDevices").click(function(){ 
       console.log("clicked");
        var _$grid = $("#gridDevices"); 
        _$grid.jsonSubmit({
             procedure: "devices_upd" 
            ,optionalItems  : ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDevices(gBatchId);
            } 
        }); 
    }); 
    $("#btnSaveInactiveDevices").click(function(){  
        var _$grid = $("#gridInactiveDevices"); 
        _$grid.jsonSubmit({
             procedure: "devices_upd" 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDevices(gBatchId);
                 $("#gridInactiveDevices").trigger("refresh");
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
    $("#btnSaveDeviceBatch").click(function(){ 
        var _$grid = $("#gridDeviceBatch"); 
        _$grid.jsonSubmit({
             procedure: "device_batch_upd" 
             ,notIncludes: ["rb"]
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDeviceBatch();
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
      
  /*
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
    });*/
    
   return _pub;
})();                                          