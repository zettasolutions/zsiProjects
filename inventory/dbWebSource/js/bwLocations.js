  (function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
        ,_pub                = {}
    ;
    
    zsi.ready = function(){
        $(".page-title").html("BW Locationss");
        displayLocations(); 
         
    }; 
    
    function displayLocations(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridLocations").dataBind({
             sqlCode        : "B235" //bw_locations_sel
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"bw_id"               ,type:"hidden"              ,value: app.svn(d,"bw_id")}) 
                               /* +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})*/
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"BW Code"        ,type:"input"       ,name:"bw_code"                 ,width:120          ,style:"text-align:left"}
                    ,{text:"BW Name"        ,type:"input"       ,name:"bw_name"                 ,width:120          ,style:"text-align:left"}
                    ,{text:"BW Address"     ,type:"input"       ,name:"bw_address"              ,width:120          ,style:"text-align:left"}
                    ,{text:"Barangay"       ,type:"select"      ,name:"barangay_id"             ,width:120          ,style:"text-align:left"}
                    ,{text:"City"           ,type:"select"      ,name:"city_id"                 ,width:120          ,style:"text-align:left"}
                    ,{text:"State"          ,type:"select"      ,name:"state_id"                ,width:120          ,style:"text-align:left"}
                    ,{text:"Country"        ,type:"select"      ,name:"country_id"              ,width:120          ,style:"text-align:left"}
                    ,{text:"Is Branch"      ,type:"yesno"       ,name:"is_branch"               ,width:120          ,style:"text-align:left"}
                    ,{text:"Is Warehouse"   ,type:"yesno"       ,name:"is_warehouse"            ,width:120          ,style:"text-align:left"} 
                    
                  ]
                  ,onComplete : function(o){
                        var _this = this;
                        _this.find("select[name='barangay_id']").dataBind("barangays");
                        _this.find("select[name='city_id']").dataBind("cities");
                        _this.find("select[name='state_id']").dataBind("states");
                        _this.find("select[name='country_id']").dataBind("countries");
                        _this.find("input[name='cbFilter1']").setCheckEvent("#gridLocations input[name='cb']");
                    
                  } 
        });
    } 
    
    $("#btnSaveLocations").click(function(){  
        $("#gridLocations").jsonSubmit({
             procedure: "bw_locations_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayLocations();
            } 
        }); 
    });
    $("#btnDeleteLocations").click(function(){ 
        zsi.form.deleteData({
             code       : "ref-00017"
            ,onComplete : function(data){
                displayLocations();
            }
        });       
    });

    
    
     return _pub;
     
})();          