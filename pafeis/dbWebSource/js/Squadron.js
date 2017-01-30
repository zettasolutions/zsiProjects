  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
    console.log("test");
   $("#grid").jsonSubmit({
             procedure: "squadrons_upd"
            , optionalItems: ["is_active"]
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
	     url            : execURL + "squadrons_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"squadron_id",type:"hidden",value: svn (d,"squadron_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Wing"                , name  : "wing_id"                    , type  : "select"        , width : 267       , style : "text-align:left;"}
        		,{text  : "Squadron Code"       , name  : "squadron_code"              , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Squadron Name"       , name  : "squadron_name"              , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "squadron_full_address"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Commander"           , name  : "squadron_commander_id"      , type  : "select"        , width : 267       , style : "text-align:left;"}
        		,{text  :"Active?"              , name  : "is_active"              , type  : "yesno"         , width:55          , style : "text-align:left;"   ,defaultValue:"Y"                 }
       	
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='wing_id']").dataBind( "wing");
                $("select[name='squadron_commander_id']").dataBind( "employee");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                    