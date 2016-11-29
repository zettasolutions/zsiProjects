var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "flight_operation_upd"
            , optionalItems: ["status_id","flight_operation_type_id","unit_id","aircraft_id","pilot_id","co_pilot_id"]
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
	     url            : execURL + "flight_operation_sel"
	    ,width          : 550
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"flight_time_id",type:"hidden",value: svn (d,"flight_time_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Flight Operation"  , name  : "flight_operation_id"      , type  : "select"    , width : 200       , style : "text-align:left;"}
        		,{text  : "Take Off Time"     , name  : "flight_take_off_time"     , type  : "input"     , width : 100       , style : "text-align:left;"}
        		,{text  : "Landing Time"      , name  : "flight_landing_time"      , type  : "input"     , width : 100       , style : "text-align:left;"}
        		,{text  : "Status"            , name  : "status_id"                , type  : "select"    , width : 100       , style : "text-align:left;"}

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='flight_operation_id']").dataBind( "flight_operation_type");
                $("select[name='status_id']").dataBind("status");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0014"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                           