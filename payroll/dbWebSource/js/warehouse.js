(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready = function(){
        $(".page-title").html("Warehouses");
        displayRecords();
      
    };
    
    
    
    $("#btnSave").click(function () {
       $("#gridWarehouse").jsonSubmit({
                 procedure: "warehouses_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    console.log("agi");
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                }
        });
    });
    
    
    function displayRecords(){
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#gridWarehouse").dataBind({
    	     sqlCode        : "W163"
    	    ,width          : $(".zContainer").width()
    	    ,height         : 300
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  bs({name:"warehouse_id",type:"hidden",value: svn (d,"warehouse_id")}) 
                                + bs({name:"is_edited",type:"hidden"})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" ); 
                        }
                }	 
    	        ,{text  : "Warehouse Code"          , name  : "warehouse_code"      , type  : "input"   , width : 200     , style : "text-align:left;"}
    	        ,{text  : "Warehouse Name"          , name  : "warehouse_name"      , type  : "input"   , width : 300     , style : "text-align:left;"}
    	        ,{text  : "Warehouse Addrress"      , name  : "warehouse_address"   , type  : "input"   , width : 300     , style : "text-align:left;"}
    	        ,{text  : "Is Active?"              , name  : "is_active"           , type  : "yesno"   , width : 85      , style : "text-align:center;"    ,defaultValue:"Y"}
            ]
        	,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }  
        });    
    }
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0002"
            ,onComplete : function(data){
                            displayRecords();
                          }
        });       
    });
})();

           