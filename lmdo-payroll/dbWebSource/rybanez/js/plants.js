(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready=function(){
        $(".page-title").html("Plants");
        displayRecords();
    };
    
    
    $("#btnSave").click(function () {
       $("#grid").jsonSubmit({
                 procedure: "plants_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                }
        });
    });
    
    $("#btnSaveInactive").click(function () {
       $("#gridInactivePlants").jsonSubmit({
                 procedure: "plants_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactive();
                    displayRecords();
                }
        });
    });
    
    $("#btnInactive").click(function () {
        $(".modal-title").text("Inactive Parts");
        $('#modalInactive').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive();
        
    });
        
    function displayRecords(){
         //var cb = app.bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
    	     url            : app.execURL + "plants_sel"
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(document).height() - 300
            ,blankRowsLimit : 5
            ,isPaging       : false
            ,dataRows       : [
                                {text  : "Plant Code"                               ,type  : "input"         , width : 200       , style : "text-align:left;"
                		            , onRender  :  function(d)
                                                { return  app.bs({name:"plant_id"           ,type:"hidden"           ,value: svn(d,"plant_id")}) 
                                                        + app.bs({name:"is_edited"          ,type:"hidden"           ,value: svn(d,"is_edited")}) 
                                                        + app.bs({name:"plant_code"                                  ,value: svn(d,"plant_code")}); 
                                                    
                                                }
                		        }
                		        ,{text  : "Plant Name"          , name  : "plant_name"                  , type  : "input"         , width : 300       , style : "text-align:left;"}
                		        ,{text  : "Plant Address"       , name  : "plant_address"               , type  : "input"         , width : 300       , style : "text-align:left;"}
                		        ,{text  : "Is Active?"          , name  : "is_active"                   , type  : "yesno"         , width : 60        , style : "text-align:center;"          ,defaultValue:"Y"}
    	                    ]
        	    ,onComplete: function(){
                    //$("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }  
        });    
    }
    
    function displayInactive(){
         var cb = app.bs({name:"cbFilter2",type:"checkbox"});
         $("#gridInactivePlants").dataBind({
    	     url            : app.execURL + "plants_sel @is_active=N"
    	    ,width          : $("#frm_modalInactive").width() - 15
    	    ,height         : $(document).height() - 300
            ,blankRowsLimit : 5
            ,isPaging       : false
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-align:left;" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"plant_id"           ,type:"hidden"  ,value: svn(d,"plant_id")}) 
                                + app.bs({name:"is_edited"          ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); 
                            
                        }
    
                }	 
    	        ,{text  : "Plant Code"          , name  : "plant_code"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
    	        ,{text  : "Plant Name"          , name  : "plant_name"                  , type  : "input"         , width : 300       , style : "text-align:left;"
    	            ,onRender: function(d){
    	                return app.bs({name: "plant_name"   ,type:"input"   ,value: svn(d,"plant_name")})
    	                    +  app.bs({name:"plant_address" ,type:"hidden"  ,value:svn(d,"plant_address")})           		            }
    	        }
    	        ,{text  : "Is Active?"          , name  : "is_active"                   , type  : "yesno"         , width : 60        , style : "text-align:center;"          ,defaultValue:"Y"}
            ]
        
    	    ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#gridInactivePlants input[name='cb']");
            }  
        });    
    }
    
    $("#btnDeletePlant").click(function(){
        zsi.form.deleteData({
             code       : "ref-0001"
            ,onComplete : function(data){
                    displayInactive();
                  }
        });       
    });
})();

                     