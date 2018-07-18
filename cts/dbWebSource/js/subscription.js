 zsi.ready(function(){
    displayRecords();
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button>' );
    }    
    
    $("select[name='company_filter']").dataBind({
        url: procURL + "dd_subscribe_client_sel" 
        , text : "client_name"
        , value: "client_id"
        , onComplete: function(){
                $("#company_filter").change(function(){
                    if(this.value){
                        displayRecords();
                    } 
                });
            }
    });
    

    function displayRecords(){   
        var cId = $("#company_filter").val();
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
    	     url            : procURL + "subscribe_appl_sel @client_id=" + (cId ? cId : 0)  
    	    ,width          : $("#main-content").width() - 40
    	    ,height         : $("#main-content").height() - 150
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                    { text : cb , type : "hidden" , width : 25 , style : "text-align:left;"       
            		    , onRender : function(d) {
                    	    return bs({name:"app_id",type:"hidden",value: svn(d,"app_id")})
                    	        + bs({name:"client_id",type:"hidden",value: svn(d,"client_id")})
                    	        + bs({name:"type_id",type:"hidden",value: svn(d,"type_id")})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    }
                    ,{text  : "Application Name"        , name  : "app_name"    , type  : "input"    , width : 300    , style : "text-align:left;"}
                    ,{text  : "Application Desc"        , name  : "app_desc"    , type  : "input"    , width : 300    , style : "text-align:left;"}
             		,{text  : "Is Active?"              , name  : "is_active"   , type  : "yesno"    , width : 80     , style : "text-align:left;"  ,defaultValue:"Y"}
    	    ]
    	     ,onComplete: function(){
    	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
    	         $("select[name='category_id']").dataBind("categories");
            }  
        });    
    }

    $("#btnSave").click(function() {
        $("#grid").jsonSubmit({
            procedure: "types_upd"
            , optionalItems: ["is_active"]
            ,onComplete: function (data) {
                $("#grid").clearGrid(); 
                displayRecords();
            }
        });
    });

    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0004"
            ,onComplete : function(data){
                            displayRecords();
                        }
        });      
    });
});    
    
   