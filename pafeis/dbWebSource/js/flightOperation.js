var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayFlightTime();
    $("select[name='flight_operation_type_id']").dataBind( "flight_operation_type");
    $("select[name='unit_id']").dataBind( "squadron");
    $("select[name='aircraft_id']").dataBind( "aircraft_info");
    $("select[name='pilot_id']").dataBind( "users_fullnames_v");
    $("select[name='co_pilot_id']").dataBind( "users_fullnames_v");
    $("select[name='status_id']").dataBind( "status");
});


function displayFlightOperation(){ 
    
    $.get( execURL + "flight_operation_sel " 
    ,function(data){
        var d = data.rows[0];
        if(data.rows.lenght > 0){
            $("#flight_operation_id").val(  d.flight_operation_id );
            $("#flight_operation_code").val(  d.flight_operation_code );
            $("#flight_operation_name").val(  d.flight_operation_name );
            $("#flight_operation_type_id").val(  d.flight_operation_type_id );
            $("#flight_schedule_date").val(  d.flight_schedule_date.toDateFormat() );
            $("#unit_id").val(  d.unit_id );
            $("#aircraft_id").val(  d.aircraft_id );
            $("#pilot_id").val(  d.pilot_id );
            $("#co_pilot_id").val(  d.co_pilot_id );
            $("#origin").val(  d.origin );
            $("#destination").val(  d.destination );
            $("#status_id").val(  d.status_id );
        }

    });

}

    
function displayFlightTime(id){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "flight_time_sel"
	    ,width          : 900
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"flight_time_id",type:"hidden",value: svn (d,"flight_time_id")})
                		                             + bs({name:"flight_operation_id",type:"hidden", value: svn (d,"flight_operation_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
            }	 
        		,{text  : "Take Off Time"     , name  : "flight_take_off_time"     , type  : "input"     , width : 300       , style : "text-align:left;"}
        	    ,{text  : "Landing Time"      , name  : "flight_landing_time"      , type  : "input"     , width : 300       , style : "text-align:left;"}
        		,{text  : "Engine Off?"       , name  : "is_engine_off"            , type  : "yesno"     , width : 85        , style : "text-align:left;"       , defaultValue : "Y"}
        		,{text  : "No. of Hours"      , name  : "no_hours"                 , type  : "input"     , width : 150       , style : "text-align:left;"
        		    //,onRender : function(d){ return svn(d,"no_hours")}
        		}

	    ]  
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='flight_operation_id']").dataBind( "flight_operation");
                //$("[name='flight_take_off_time']").datetimepicker();
        }  
    });    
}
    
/*
$("#btnSave").click(function (page_process_action_id) {
    $("#status_id").val(page_process_action_id);
    $("#frmFlightOperation").jsonSubmit({
        procedure: "flight_operation_upd"
        , optionalItems: ["flight_operation_type_id","aircraft_id","pilot_id","co_pilot_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                console.log(data);
                $("#frmFlightOperation input[name='flight_time_id']").val(data.returnValue);
                //Saving of details.
                saveFlightTime(page_process_action_id);
            } else {
                console.log(data.errMsg);
            }
        }
    });
});
*/

$("#btnSave").click(function () {
    console.log($("#frmFlightOperation input[name='flight_operation_id']").val);
   $("#frmFlightOperation").jsonSubmit({
             procedure: "flight_operation_upd"
            , optionalItems: ["flight_operation_type_id","aircraft_id","pilot_id","co_pilot_id"]
            , onComplete: function (data) {
             if (data.isSuccess === true) { 
                $("#frmFlightOperation input[name='flight_operation_id']").val(data.returnValue);
                saveFlightTime();
                displayFlightOperation();
            } else {
                console.log(data.errMsg);
            }
        } 
    });
});

function saveFlightTime() {
    $("#grid").jsonSubmit({
        procedure: "flight_time_upd"
        , optionalItems: ["flight_time_id","flight_operation_id","is_engine_off"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                //console.log(data);
               // setStatusName(page_process_action_id);
                displayFlightOperation();
                displayFlightTime(flight_operation_id);
            } else {
                console.log(data.errMsg);
            }
        }
    });
}

/*
function setStatusName(page_process_action_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + page_process_action_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            console.log(d.rows[0]);
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}
*/
    
                                              