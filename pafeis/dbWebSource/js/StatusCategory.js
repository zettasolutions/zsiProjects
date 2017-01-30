  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "TODO_upd"
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
                		                    return     bs({name:"select_id",type:"hidden",value: svn (d,"select_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "wing_code"              , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "wing_name"              , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "wing_full_address"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Commander"           , name  : "wing_commander_id"      , type  : "select"        , width : 267       , style : "text-align:left;"}
        		,{text  :"Active?"              , name  : "is_active"              , type  : "yesno"         , width:55          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='wing_commander_id']").dataBind( "employee");
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
    
                                      