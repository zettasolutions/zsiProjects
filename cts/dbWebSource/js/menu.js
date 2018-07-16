(function() {
    var bs = zsi.bs.ctrl
        ,svn = zsi.setValIfNull
    ;
    
    displayRecords();
    
    function displayRecords(){   
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
    	     url            : execURL + "menus_sel"
    	    ,width          : $("#main-content").width() - 40
    	    ,height         : $("#main-content").height() - 150
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                    { text : cb , type : "hidden" , width : 25 , style : "text-align:left;"       
            		    , onRender : function(d) {
                    	    return bs({name:"menu_id",type:"hidden",value: svn(d,"menu_id")})
                    	        + bs({name:"is_edited",type:"hidden",value: svn(d,"is_edited")})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    }
                    ,{text  : "Seq #"       , name  : "seq_no"      , type  : "input"   , width : 80    , style : "text-align:left;"}
                    ,{text  : "Icon"        , name  : "icon"        , type  : "input"   , width : 80    , style : "text-align:left;"}
            		,{text  : "Parent Menu" , name  : "pmenu_id"    , type  : "select"  , width : 200   , style : "text-align:left;"}
            		,{text  : "Menu Name"   , name  : "menu_name"   , type  : "input"    , width : 220   , style : "text-align:left;"}
            		,{text  : "Page Name"   , name  : "page_id"     , type  : "select"  , width : 220   , style : "text-align:left;"}   
            		,{text  : "Default"     , name  : "is_default"  , type  : "yesno"   , width : 80    , style : "text-align:left;"}
            		,{text  : "Is ZSI?"     , name  : "is_zsi_only" , type  : "yesno"   , width : 80    , style : "text-align:left;"}
    	    ]
    	     ,onComplete: function(){
    	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                 $("select[name='pmenu_id']").dataBind("menus");
                 $("select[name='page_id']").dataBind( "pages");
            }  
        });    
    }
    
    $("#btnSave").click(function() {
        $("#grid").jsonSubmit({
            procedure: "menus_upd"
            ,onComplete: function (data) {
                $("#grid").clearGrid(); 
                displayRecords();
            }
        });
    });
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "sys-0002"
            ,onComplete : function(data){
                            displayRecords();
                        }
        });      
    });
})(); 