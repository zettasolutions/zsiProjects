   var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "TODO_upd"
            , optionalItems: ["is_item", "is_aircraft", "is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "TODO_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"status_id",type:"hidden",value: svn (d,"status_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"        , name  : "status_code"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"        , name  : "status_name"     , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Color"       , name  : "status_color"    , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Item?"       , name  : "is_item"         , type  : "yesno"         , width:50          , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		,{text  : "Aircraft?"   , name  : "is_aircraft"     , type  : "yesno"         , width:80          , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		,{text  : "Active?"     , name  : "is_active"       , type  : "yesno"         , width:60          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0004"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                          