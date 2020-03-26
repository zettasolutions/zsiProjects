   (function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
        ,_pub                = {}
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Item Master");
        displayItemMaster(); 
         
    }; 
    
    function displayItemMaster(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridItemMaster").dataBind({
             sqlCode        : "I237" //item_master_sel
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"item_id"               ,type:"hidden"              ,value: app.svn(d,"item_id")})  
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Item Code"          ,type:"input"       ,name:"item_code"                   ,width:120          ,style:"text-align:left"}
                    ,{text:"Item Name"          ,type:"input"       ,name:"item_name"                   ,width:120          ,style:"text-align:left"}
                    ,{text:"Item Desc"          ,type:"input"       ,name:"item_desc"                   ,width:120          ,style:"text-align:left"}
                    ,{text:"Item Category"      ,type:"select"      ,name:"item_category_id"            ,width:120          ,style:"text-align:left"}
                    ,{text:"Item Class"         ,type:"select"      ,name:"item_class_id"               ,width:120          ,style:"text-align:left"}
                    ,{text:"Item Type"          ,type:"select"      ,name:"item_type_id"                ,width:120          ,style:"text-align:left"} 
                    ,{text:"Is Active"          ,type:"yesno"       ,name:"is_active"                   ,width:120          ,style:"text-align:left"} 
                    
                  ]
                  ,onComplete : function(o){
                        var _this = this;
                        _this.find("select[name='item_category_id']").dataBind("itemCategory");
                        _this.find("select[name='item_class_id']").dataBind("itemClass");
                        _this.find("select[name='item_type_id']").dataBind("itemTypes"); 
                        _this.find("input[name='cbFilter1']").setCheckEvent("#gridItemMaster input[name='cb']");
                    
                  } 
        });
    } 
    
    $("#btnSaveItemMaster").click(function(){  
        $("#gridItemMaster").jsonSubmit({
             procedure: "item_master_upd" 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayItemMaster();
            } 
        }); 
    });
    $("#btnDeleteItemMaster").click(function(){ 
        zsi.form.deleteData({
             code       : "ref-00018"
            ,onComplete : function(data){
                displayItemMaster();
            }
        });       
    });

    
    
     return _pub;
     
})();           