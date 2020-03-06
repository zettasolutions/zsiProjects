(function(){
    var  bs             = zsi.bs.ctrl
        ,gSearchCol     = ""
    ;
    var svn =  zsi.setValIfNull;
    
    zsi.ready=function(){
        $(".page-title").html("Plants");
        displayRecords();
        
        $("#searchVal").attr("placeholder", "Enter Keyword"); 
        $("#dd_search_id").fillSelect({
            data: [
                 { text: "Plant Name"       , value: "plant_name"       }
                ,{ text: "Plant Address"    , value: "plant_address"    }
                ,{ text: "City"             , value: "city"             }
                ,{ text: "State"            , value: "state"            }
                ,{ text: "ZIP Code"         , value: "zip_code"         }
                ,{ text: "Country"          , value: "country"          }
            ]
            ,onChange : function(){
                var _placeHolder = $('#dd_search_id option:selected').html();
                gSearchCol = this.val();
                $("#searchVal").attr("placeholder", _placeHolder);
                if($(this).val() === "") {
                    $("#searchVal").attr("placeholder", "Enter Keyword"); 
                    $("#searchVal").val("");
                }
            }
        });

    }; 
    
    //Private functions
    function displayRecords(searchCol,searchVal){
         $("#grid").dataBind({
    	     sqlCode        : "P144" //plants_sel
    	    ,parameters     : {search_col: (searchCol ? searchCol : ""),search_val: (searchVal ? searchVal : "")}
    	    ,height         : $(window).height() - 280
            ,blankRowsLimit : 5
            ,isPaging       : false
            ,dataRows       : [
                                {text  : "Plant Name"                               ,type  : "input"         , width : 200       , style : "text-align:left;" ,sortColNo : 0
                		            , onRender  :  function(d)
                                                { return  app.bs({name:"plant_id"           ,type:"hidden"           ,value: svn(d,"plant_id")}) 
                                                        + app.bs({name:"is_edited"          ,type:"hidden"           ,value: svn(d,"is_edited")}) 
                                                        + app.bs({name:"plant_code"         ,type:"hidden"           ,value: svn(d,"plant_code")})
                                                        + app.bs({name:"plant_name"         ,type:"input"            ,value: svn(d,"plant_name")})
                                                        ; 
                                                    
                                                }
                		        }
                		        ,{ text:"Plant Address"         ,name:"plant_address"              ,type:"input"                ,width:300              ,style:"text-align:left;" ,sortColNo : 1}
                        		,{ text:"City"                  ,width:100                         ,type:"input"                ,name:"city"            ,style:"text-align:left;" ,sortColNo : 2}
                        		,{ text:"State"                 ,width:200                         ,type:"input"                ,name:"state"           ,style:"text-align:left;" ,sortColNo : 3}
                        		,{ text:"ZIP Code"              ,width:70                          ,type:"input"                ,name:"zip_code"        ,style:"text-align:center;" ,sortColNo : 4}
                        		,{ text:"Country"               ,width:100                         ,type:"input"                ,name:"country"        ,style:"text-align:left;" }
                		        ,{ text:"Active?"               ,name:"is_active"                  ,type:"yesno"                ,width : 50             ,style:"text-align:center;"          ,defaultValue:"Y"}
    	                    ]
        	    ,onComplete: function(){
                    this.find('.zRow').find("[name='plant_address'],[name='city'],[name='state'],[name='country']").addClass('autoCaps');
                    this.find("input[name='plant_name']").checkValueExists({code : "ref-00037", colName : "plant_name"}); 
            }  
        });    
    }
    function displayInactive(){
         var cb = app.bs({name:"cbFilter2",type:"checkbox"});
         $("#gridInactivePlants").dataBind({
    	     url            : app.execURL + "plants_sel @is_active=N"
    	    ,width          : $("#frm_modalInactive").width() - 15
    	    ,height         : 360
            ,isPaging       : false
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-align:left;" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"plant_id"           ,type:"hidden"  ,value: svn(d,"plant_id")}) 
                                + app.bs({name:"is_edited"          ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                + app.bs({name:"plant_code"         ,type:"hidden"  ,value: svn(d,"plant_code")}) 
                                + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); 
                            
                        }
    
                }	 
    	        ,{text  : "Plant Name"          , name  : "plant_name"                  , type  : "input"         , width : 250       , style : "text-align:left;"
    	            ,onRender: function(d){
    	                return app.bs({name: "plant_name"   ,type:"input"   ,value: svn(d,"plant_name")})
    	                    +  app.bs({name:"plant_address" ,type:"hidden"  ,value:svn(d,"plant_address")})      
    	                    +  app.bs({name:"city"          ,type:"hidden"  ,value:svn(d,"city")})
    	                    +  app.bs({name:"state"         ,type:"hidden"  ,value:svn(d,"state")})
    	                    +  app.bs({name:"zip_code"      ,type:"hidden"  ,value:svn(d,"zip_code")})
    	                    +  app.bs({name:"country"       ,type:"hidden"  ,value:svn(d,"country")});}
    	        }
    	        ,{text  : "Active?"             , name  : "is_active"                   , type  : "yesno"         , width : 50        , style : "text-align:center;"          ,defaultValue:"N"}
            ]
        
    	    ,onComplete: function(){ 
                var _zRow = this.find(".zRow"); 
                this.find("[name='cbFilter2']").setCheckEvent("#gridInactivePlants input[name='cb']");
            }  
        });    
    }
    
    //Buttons
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
                    $('#modalInactive').modal('toggle');
                }
        });
    });
    $("#btnInactive").click(function () {
        $(".modal-title").text("Inactive Plant(s)");
        $('#modalInactive').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive();
        
    });
    $("#btnDeletePlant").click(function(){
        zsi.form.deleteData({
             code       : "ref-0001"
            ,onComplete : function(data){
                    displayInactive();
                    $('#modalInactive').modal('toggle');
                  }
        });       
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        console.log("_searchVal",_searchVal);
        if(_searchVal!==""){
            displayRecords(gSearchCol,_searchVal);
            
        }
    }); 
    $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(_searchVal!==""){
                displayRecords(gSearchCol,_searchVal);
            }
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayRecords();
        }
    });


    $("#btnResetVal").click(function(){
        $("#dd_search_id").val(isUD);
        $("#searchVal").val("").attr("placeholder", "Enter Keyword");
        displayRecords();
    });
})();

                                          