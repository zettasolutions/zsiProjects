var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,dataFlightOperations
   ,dataFlightOperationsIndex =-1
   ,tblFD = "tblFlightDetails"
   ,g_flight_operation_id = null
;


zsi.ready(function(){
    getTemplate();
    $(".pageTitle").append(' for ' + ' » <select name="dd_squadron" id="dd_squadron"></select>');
    $("#dd_squadron").dataBind({
        url: procURL + "dd_organizations_sel @squadron_type='aircraft '"
        , text: "organization_name"
        , value: "organization_id"
        , required :true
        , onComplete: function(){
            displayRecords($("#dd_squadron").val());
            $("select[name='dd_squadron']").change (function(){
                displayRecords(this.value);
            });
        }
    });  
});

var contextFlightOperation = { 
                  id    :"ctxFO"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div id="flightOperation-footer" class="pull-left">'

                , body  : '<div id="frm_modalFlightOperation" class="form-horizontal" style="padding:5px">'
                        
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Operaion Code</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="flight_operation_id" id="flight_operation_id" >'
                        +'    <input type="hidden" name="is_edited" id="is_edited">' 
                        +'             <input type="text" name="flight_operation_code" id="flight_operation_code" class="form-control input-sm" >'
                        +'        </div> ' 
                        +'        <label class=" col-xs-2 control-label">Operation Name</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <input type="text" name="flight_operation_name" id="flight_operation_name" class="form-control input-sm" >'
                        +'         </div>'
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Operation Type</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="flight_operation_type_id" id="flight_operation_type_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'        <label class=" col-xs-2 control-label">Flight Schedule</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="flight_schedule_date" id="flight_schedule_date" class="form-control input-sm" >'
                        +'        </div>'  
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Aircraft</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <input type="hidden" name="unit_id" id="unit_id" class="form-control input-sm" >'
                        +'           <select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'        <label class=" col-xs-2 control-label">Pilot</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="pilot_id" id="pilot_id" class="form-control input-sm" ></select>'
                        +'        </div>  '

                        +'    </div>'

                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Co Pilot</label>'
                        +'        <div class=" col-xs-4">'
                        +'            <select type="text" name="co_pilot_id" id="co_pilot_id" class= "form-control input-sm" > </select>'
                        +'        </div>'
                        +'        <label class=" col-xs-2 control-label">Origin</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="origin" id="origin" class="form-control input-sm" >'
                        +'        </div>  '
                        +'    </div>'
   
                        +'    <div class="form-group  ">  '
                        +'         <label class=" col-xs-2 control-label">Destination</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <input type="text" name="destination" id="destination" class="form-control input-sm" >'
                        +'         </div>'
                        +'        <label class=" col-xs-2 control-label">Status </label>'
                        +'        <div class=" col-xs-3"><label class="control-label" id="status_name">Open</label>'
                        +'             <input type="hidden" name="status_id" id="status_id" class="form-control input-sm"  >'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">No. of Cycles</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="no_cycles" id="no_cycles" class="form-control input-sm"  >'
                        +'        </div>'
                        +'    </div>'
                        +'</div>'

                        +'<div class="modalGrid zPanel"><h4> Flight Details </h4><div id="'+ tblFD +'" class="zGrid Detail" ></div></div>'
            }; 

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextFlightOperation));
       
    });    
}

$("#btnNew").click(function () {
    var $mdl  = $("#ctxFO");
    $mdl.find(".modal-title").html("New Flight Operation" + ' for ' + ' » <select name="dd_unit" id="dd_unit"></select>');
    $("#dd_unit").dataBind({
        url: procURL + "dd_organizations_sel @squadron_type='aircraft '"
        , text: "organization_name"
        , value: "organization_id"
        , required :true
        , onComplete: function(){
            $("#unit_id").val($("#dd_unit").val());
            $("select[name='dd_unit']").change (function(){
                $("#unit_id").val($("#dd_unit").val());
            });
        }
    }); 
    $mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    $mdl.find("#flight_schedule_date").dateTimePicker({ format:'m.d.Y H:i'});
    $("select, input").on("keyup change", function(){
        $("#frm_modalFlightOperation").find("#is_edited").val("Y");
    }); 

    clearForm();
    displayListBoxes();
    displayFlightDetails(-1);
    buildReceivingButtons();
});

function showModalUpdateOperation(index, flight_operation_id) {
   var _info = dataFlightOperations[index];
    $('#ctxFO .modal-title').html('Flight Operation for ' + ' » <select name="dd_unit" id="dd_unit"></select>');
     $("#dd_unit").dataBind({
        url: procURL + "dd_organizations_sel @squadron_type='aircraft '"
        , text: "organization_name"
        , value: "organization_id"
        , required :true
        , onComplete: function(){
            $("#unit_id").val($("#dd_unit").val());
            $("select[name='dd_unit']").change (function(){
                $("#unit_id").val($("#dd_unit").val());
            });
        }
    }); 
    $("#ctxFO").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxFO").find("#flight_schedule_date").dateTimePicker({ format:'m.d.Y H:i'});
    $("#ctxFO #flight_operation_id").val(_info.flight_operation_id);
    buildReceivingButtons();
    displayFlightOperation(_info);
    displayFlightDetails(_info.flight_operation_id);
    
}

function displayListBoxes(){
    $("select[name='flight_operation_type_id']").dataBind( "flight_operation_type");    
    $("select[name='aircraft_id']").dataBind( "aircraft_info");
    $("select[name='pilot_id']").dataBind( "employees_fullnames_v");
    $("select[name='co_pilot_id']").dataBind( "employees_fullnames_v");
}

function displayFlightOperation(d){
 
    $("#ctxFO #flight_operation_id").val( d.flight_operation_id );
    $("#ctxFO #flight_operation_code").val(  d.flight_operation_code );
    $("#ctxFO #flight_operation_name").val(  d.flight_operation_name );
    $("#ctxFO #flight_schedule_date").val(  d.flight_schedule_date.toMDateTimeFormat() ); 
    $("#ctxFO #origin").val(  d.origin );
    $("#ctxFO #destination").val(  d.destination );  
    $("#ctxFO #no_cycles").val( d.no_cycles );    
    
    $("#ctxFO #flight_operation_type_id").attr("selectedvalue",   d.flight_operation_type_id );
    $("#ctxFO #unit_id").attr("selectedvalue",  d.unit_id );
    $("#ctxFO #aircraft_id").attr("selectedvalue",   d.aircraft_id );
    $("#ctxFO #pilot_id").attr("selectedvalue",  d.pilot_id );
    $("#ctxFO #co_pilot_id").attr("selectedvalue",   d.co_pilot_id );
    $("#ctxFO #status_name").text(d.status_name);

    displayListBoxes();
}

function clearForm(){ 
    
    $('input[type=text], input[type=hidden]').val('');
    $("select[type='text']").attr("selectedvalue", "" ).val("");
    dataFlightOperationsIndex=-1;
}

function displayRecords(squadron_id){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : procURL + "flight_operation_sel @squadron_id=" + squadron_id
	    ,width          : $(document).width() -55
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"flight_operation_id",type:"hidden",value: svn (d,"flight_operation_id")})
                		                             + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Code"                    , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataFlightOperationsIndex++;
        		        return "<a href='javascript:showModalUpdateOperation(\"" + dataFlightOperationsIndex + "\");'>" 
        		        + svn(d,"flight_operation_code") + " </a>";
        		    }
        		}
        	    ,{text  : "Flight Operation Title"                    , type  : "label"     , width : 300       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"flight_operation_name")}
        	    }
        		,{text  : "Type"                    , type  : "label"     , width : 150        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"operation_type_name")}
        		}
        		,{text  : "Flight Schedule"         , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return bs({name:"flight_schedule_date", type:"input" ,value:svn(d,"flight_schedule_date").toMDateTimeFormat()});
        		    } 
        		}
            	,{text  : "Unit"                    , type  : "label"     , width : 300       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"unit_name")}
        		}
            	,{text  : "Aircraft Name"                , type  : "label"     , width : 150       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"aircraft_name")}
        	    }
                ,{text  : "Pilot"                   , type  : "label"     , width : 200        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"pilot")}
        		}
        		,{text  : "Co Pilot"               , type  : "label"     , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"co_pilot")}
        		}
        		,{text  : "Flight Origin"          , type  : "label"     , width : 200      , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"origin")}
        		}
        	    ,{text  : "Flight Destination"            , type  : "label"     , width : 200       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"destination")}
        	    }
        		,{text  : "Status"                 , type  : "label"     , width : 100        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"status_name")}
        		}
        		,{text  : "No. of Cycles"                 , type  : "label"     , width : 100        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"no_cycles")}
        		}
  
	    ]  
    	     ,onComplete: function(data){

    	         dataFlightOperations = data.rows;
                 $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayFlightDetails(flight_operation_id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblFD).dataBind({
	     url            : execURL + "flight_time_sel @flight_operation_id=" + flight_operation_id
	    ,width          : $(document).width() -55
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"flight_operation_detail_id",type:"hidden",value: svn (d,"flight_operation_detail_id")}) 
                		                            + bs({name:"is_edited",type:"hidden"})
                		                            + bs({name:"flight_operation_id",type:"hidden",value: (flight_operation_id===0 ? "":flight_operation_id)})
                                                    + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	                                     
        	    ,{text  : "Take Off Time"          , width : 200     , style : "text-align:left;"
        	        ,onRender : function(d){ return bs({name:"flight_take_off_time", type:"input" ,value:svn(d,"flight_take_off_time").toMDateTimeFormat()});
        	        }
                }   			
        		,{text  : "Landing Time"           , width : 200     , style : "text-align:left;"
        	        ,onRender : function(d){ return bs({name:"flight_landing_time", type:"input" ,value:svn(d,"flight_landing_time").toMDateTimeFormat()});
        	        }
        		    
        		}
        		,{text  : "No. of Hours"           , name : "no_hours"              , type : "input"     , width : 100     , style : "text-align:center;"}
            	,{text  : "Engine off?"            , name : "is_engine_off"         , type : "yesno"     , width : 100     , style : "text-align:left;"}
            	,{text  : "Remarks"                , name : "remarks"               , type : "input"     , width : 470     , style : "text-align:left;"}
	    ]      
	    ,onComplete: function(data){
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#" + tblFD).find("#is_edited").val("Y");
                });
	        
                $("#cbFilter2").setCheckEvent("#" + tblFD + " input[name='cb']");
                $("input[name='flight_take_off_time']").dateTimePicker({ format:'m.d.Y H:i'});
                $("input[name='flight_landing_time']").dateTimePicker({ format:'m.d.Y H:i'});
                
                $("input[name='flight_landing_time']").change( function(){
                    var $zRow = $(this).closest(".zRow");
                    var date1 = $zRow.find("#flight_take_off_time").val();
                    var date2 = $zRow.find("#flight_landing_time").val();
                    if( date1 !== "" && date2 !== "" ){
                        var hours = Math.abs( Date.parse(date1) - Date.parse(date2)) / 36e5;
                        $zRow.find("#no_hours").val(hours.toFixed(2));
                    
                    }
                    else
                        $zRow.find("#no_hours").val("");
                });
                
        }  
    });    
}

function buildReceivingButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=82,@doc_id=" + $("#flight_operation_id").val(), function(d) {
        if (d.rows !== null) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return submitFlightOperations(' 
                    + v.page_process_action_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            $(".added-button").remove();
            $("#flightOperation-footer").append(html);
        }
    });
}

function submitFlightOperations(page_process_action_id){   
        $("#frm_modalFlightOperation").find("#is_edited").val("Y");
        $("#status_id").val(page_process_action_id);
        $("#frm_modalFlightOperation").jsonSubmit({
             procedure : "flight_operation_upd"
            ,optionalItems : ["flight_operation_id"]
            ,notInclude: "#dd_unit"
            ,onComplete: function (data) {
              if(data.isSuccess===true){ 
                var $tbl = $("#" + tblFD);
                var _flight_operation_id = (data.returnValue==0 ? g_flight_operation_id : data.returnValue);
                $tbl.find("[name='flight_operation_id']").val( _flight_operation_id);
                $tbl.jsonSubmit({
                     procedure : "flight_time_upd"
                    ,optionalItems : ["flight_operation_id","is_edited","is_engine_off"]
                     , notInclude: "#dealer_filter"
                    ,onComplete: function (data) {
                        if(data.isSuccess===true){  
                            zsi.form.showAlert("alert");
                            setStatusName(page_process_action_id);
                            $("#grid").trigger("refresh");
                            $('#ctxFO').modal('hide');
                            clearForm();
                        }
                        else {
                            console.log(data.errMsg);
                        }
                    }

                });
             }
             else {
                    console.log(data.errMsg);
                }
            }
        });
}

function setStatusName(page_process_action_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + page_process_action_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}
          