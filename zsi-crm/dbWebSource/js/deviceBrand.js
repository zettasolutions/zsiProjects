   var db = (function(){
    var _pub                = {}
        ,gPlansData         = []
        ,gPlansDataSelected = null;
    
    zsi.ready = function(){
        $(".page-title").html("Device Brand");
        $(".panel-container").css("min-height", $(window).height() - 500);
        displayDeviceBrand();
    };
   
    _pub.btnDeleteInActiveDeviceBrand = function(){ 
            zsi.form.deleteData({ 
                code:"ref-00021" 
                ,onComplete:function(data){ 
                     displayInactiveDeviceBrand();
                }
        });
    }; 
   
    function displayDeviceBrand(){  
       
        $("#gridDeviceBrand").dataBind({
             sqlCode        : "D268" //device_brands_sel
            ,height         : $(window).height() - 235
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
                ,{text: "Is Active?"                    ,width : 90     ,name:"is_active"                   ,type:"yesno"        ,style : "text-align:center;" ,defaultValue: "Y"}
            ]
            ,onComplete: function(o){
                
                 
            }
        });
    }
    function displayInactiveDeviceBrand(){
         var cb = app.bs({name:"cbFilter3",type:"checkbox"});
         $("#gridInactiveDeviceType").dataBind({
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
                    this.find("[name='cbFilter3']").setCheckEvent("#gridInactiveDeviceType input[name='cb']");  
                }
        });    
    }
  
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
        var _grid = $("#gridInactiveDeviceType");
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
    
    
    return _pub;
})();                                      