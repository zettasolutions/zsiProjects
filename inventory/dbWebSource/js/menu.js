var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
   displayRecords();
});


$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
        procedure: "menus_upd"
        
        ,onComplete: function (data) {
            $("#grid").clearGrid(); 
            displayRecords();
        }
    });
    
});
    
function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
	     url            : execURL + "menus_sel"
	    ,width          : 1243
	    ,height         : $(document).height() - 250
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                        , type  : "hidden"        , width    : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                   return     bs({name:"menu_id",type:"hidden",value: svn (d,"menu_id")})
                                                       +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Menu Name"                , name  : "pmenu_id"             , type  : "select"        , width : 245       , style : "text-align:left;"}
        		,{text  : "Parent Menu"              , name  : "menu_name"            , type  : "input"         , width : 300       , style : "text-align:left;"}
        		,{text  : "Page Name"                , name  : "page_id"              , type  : "select"        , width : 250       , style : "text-align:left;"}
        		,{text  : "Parameters"               , name  : "parameters"           , type  : "input"         , width : 250       , style : "text-align:left;"}
        		,{text  : "Seq #"                    , name  : "seq_no"               , type  : "input"         , width : 50        , style : "text-align:left;"}
        		,{text  : "Default"                  , name  : "is_default"           , type  : "yesno"         , width : 100       , style : "text-align:left;"}
	    ]
	     ,onComplete: function(){
             $("select[name='pmenu_id']").dataBind("menus");
             $("select[name='page_id']").dataBind( "pages");
        }  
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0002"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});
    
    
    
    
    
                                           