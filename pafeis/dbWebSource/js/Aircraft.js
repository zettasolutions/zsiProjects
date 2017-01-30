  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
    console.log("test");
   $("#grid").jsonSubmit({
             procedure: "wing_upd"
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
	     url            : execURL + "wing_sel"
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
                ,{text  : "Squadron"                , name  : "squadron_id"             , type  : "select"        , width : 100       , style : "text-align:left;"}
        		,{text  : "Aircraft Code"           , name  : "aircraft_code"           , type  : "input"         , width : 100       , style : "text-align:left;"}
        		,{text  : "Aircraft Name"           , name  : "aircraft_name"           , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Aircraft Type"           , name  : "aircraft_type_id"        , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Aircraft Time"           , name  : "aircraft_time"           , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Aircraft Source"         , name  : "aircraft_source_id"      , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Aircraft Dealer"         , name  : "aircraft_dealer_id"      , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Status"                  , name  : "status_id"               , type  : "select"        , width : 180       , style : "text-align:left;"}
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='squadron_id']").dataBind( "squadron");
                $("select[name='aircraft_type_id']").dataBind( "aircraft_type");
                $("select[name='aircraft_source_id']").dataBind( "aircraft_source");
                $("select[name='aircraft_dealer_id']").dataBind( "aircraft_dealer");
                $("select[name='status_id']").dataBind( "status");
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
    
                                   