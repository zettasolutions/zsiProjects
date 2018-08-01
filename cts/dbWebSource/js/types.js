zsi.ready(function(){
    displayRecords();
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button> <button type="button" class="btn btn-primary btn-sm col-12 col-md-auto" id="btnDelete"><i class="fa fa-trash-alt"></i> Delete</button>' );
    }    

    function displayRecords(){   
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
    	     url            : procURL + "types_sel" 
    	    ,width          : $("#main-content").width() - 40
    	    ,height         : $("#main-content").height() - 150
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                    { text : cb , type : "hidden" , width : 25 , style : "text-align:left;"       
            		    , onRender : function(d) {
                    	    return bs({name:"type_id",type:"hidden",value: svn(d,"type_id")})
                    	        + bs({name:"is_edited",type:"hidden",value: svn(d,"is_edited")})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    }
                    ,{text  : "Category"        , name  : "category_id"         , type  : "select"   , width : 300    , style : "text-align:left;"}
                    ,{text  : "Type"            , name  : "type_desc"           , type  : "input"    , width : 300    , style : "text-align:left;"}
             		,{text  : "Is Active"       , name  : "is_active"           , type  : "yesno"    , width : 80     , style : "text-align:left;"  ,defaultValue:"Y"}
    	    ]
    	     ,onComplete: function(){
    	        $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
    	         
    	        $("select[name='category_id']").dataBind({
                    url: procURL + "dd_categories_sel "
                    , text: "category_desc"
                    , value: "category_id"
                    , required :false
                });  
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
    
  