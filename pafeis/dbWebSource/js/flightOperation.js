var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,dataFlightOperations
   ,dataFlightOperationsIndex =-1
   //,tblFD = "tblFlightDetails"
   ,g_flight_operation_id = null
   ,g_user_id = null
   ,g_warehouse_id = null
   ,g_organization_id = null
   ,g_organization_name = ""
   ,g_location_name = ""
   ,squadron_id = null
   ,tblPilot = "tblFlightOperationPilot"
   ,tblFTime = "tblFlightTime"
   ,titleHeader ="#tabPanel > div#title"
   ,tabPanes ="#tabPanel > div.tabPane"
;


zsi.ready(function(){
    getTemplate();
    $.get(procURL + "user_info_sel", function(d) {
        g_organization_id = null;
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            g_warehouse_id =  (d.rows[0].warehouse_id ? d.rows[0].warehouse_id : null);
            $(".pageTitle").append(' for ' + g_organization_name);
           
        }
        displayRecords();
    });
});

var contextFlightOperation = { 
                  id    :"ctxFO"
                , sizeAttr : "fullWidth"
                , title : "New"
                , footer: '<div id="flightOperation-footer" class="pull-left">'

                , body  : '<div id="frm_modalFlightOperation" class="form-horizontal zContainer1" style="padding:5px">'
                        +'    <div class="form-group">' 
                        +'        <label class="col-xs-2 control-label">Operation Code</label>'
                        +'        <div class="col-xs-2">'
                        +'              <input type="hidden" name="flight_operation_id" id="flight_operation_id">'
                        +'              <input type="hidden" name="is_edited" id="is_edited">' 
                        +'              <input type="text" name="flight_operation_code" id="flight_operation_code" class="form-control input-sm">'
                        +'        </div>' 
                        +'        <label class="col-xs-2 control-label">Station</label>'
                        +'        <div class="col-xs-2">'
                        +'           <select name="station_id" id="station_id" class="form-control input-sm"><option value=""></option></select>'
                        +'         </div>'
                        +'        <label class="col-xs-2 control-label">Flight Schedule</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="flight_schedule_date" id="flight_schedule_date" class="form-control input-sm">'
                        +'             <input type="hidden" name="unit_id" id="unit_id">'
                        +'             <input type="hidden" name="aircraft_id" id="aircraft_id">'
                        +'        </div>'  
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">No. of Cycle</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="no_cycles" id="no_cycles" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Category</label>'
                        +'        <div class="col-xs-2">'
                        +'             <select name="ms_category_id" id="ms_category_id" class="form-control input-sm"><option value=""></option></select>'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Type</label>'
                        +'        <div class="col-xs-2">'
                        +'             <select name="ms_type_id" id="ms_type_id" class="form-control input-sm"><option value=""></option></select>'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group"> ' 
                        +'        <label class="col-xs-2 control-label">Detail</label>'
                        +'        <div class="col-xs-2">'
                        +'           <select name="ms_detail_id" id="ms_detail_id" class="form-control input-sm"><option value=""></option></select>'
                        +'         </div>'
                        +'        <label class="col-xs-2 control-label">Mission Essential</label>'
                        +'        <div class="col-xs-2">'
                        +'           <input type="text" name="ms_essential" id="ms_essential" class="form-control input-sm">'
                        +'         </div>'
                        +'        <label class="col-xs-2 control-label">Itinerary</label>'
                        +'        <div class="col-xs-2">'
                        +'           <input type="text" name="itinerary" id="itinerary" class="form-control input-sm">'
                        +'         </div>'
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">FLT Condition </label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="flt_cond" id="flt_cond" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Sort</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="sort" id="sort" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">PAX MIL </label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="pax_mil" id="pax_mil" class="form-control input-sm">'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">PAX CIV</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="pax_civ" id="pax_civ" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">FNT MIL </label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="fnt_mil" id="fnt_mil" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">FNT CIV</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="fnt_civ" id="fnt_civ" class="form-control input-sm">'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">Cargo(lbs) </label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="cargo" id="cargo" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Gas-up Location</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="gas_up_loc" id="gas_up_loc" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Gas-up(Ltr)</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="gas_up" id="gas_up" class="form-control input-sm">'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">Gas-up Balance(Ltr)</label>'
                        +'        <div class="col-xs-2">'
                        +'             <input type="text" name="gas_bal" id="gas_bal" class="form-control input-sm">'
                        +'        </div>'
                        +'        <label class="col-xs-2 control-label">Status:</label>'
                        +'        <div class="col-xs-2"><label class="col-xs-12 control-label" id="status_name" style="text-align:left !important"></label>'
                        +'             <input type="hidden" name="status_id" id="status_id" class="form-control input-sm">'
                        +'        </div>'
                        +'    </div>'
                        +'    <div class="form-group">'
                        +'        <label class="col-xs-2 control-label">Remarks</label>'
                        +'        <div class="col-xs-6">'
                        +'             <textarea name="remarks" id="remarks" class="form-control input-sm"></textarea>'
                        +'        </div>'
                        +'    </div>'
                        +'</div>'
                        +'<div class="modalGrid zContainer1" id="flightDetails"><div class="zHeaderTitle1"><label> Flight Details </label></div>'
                       // +'<div id="'+ tblFD +'" class="zGrid Detail" >'
                                +'<ul class="nav nav-tabs">'
                                    + '<li ><a href="#platforms" data-toggle="tab" id="platforms-tab">Flight Operation Pilot</a></li>'
                                    + '<li ><a href="#programs" data-toggle="tab" id="programs-tab">Flight Time</a></li>'
                                +'</ul>'
                                +'<div id="tabPanel" class="tab-pages zPanel">'
                                    +'<div id="title"></div>'
                                    +'<div id="tabPilot" class="tabPane">'
                                            +'<div id="platform" ><div id="' + tblPilot + '" class="zGrid"></div></div>'
                                    + '</div>' //<--end of tab platforms--->   
                                    +'<div id="tabFTime" class="tabPane">'
                                            +'<div id="program" ><div id="' + tblFTime + '" class="zGrid"></div></div>'
                                    + '</div>' //<--end of tab programs--->   
                                +'</div>'//<--end of col-xs-12--->   
                           // +'</div>' //<--end of tab tabPanel---> 
                        //+'</div>'
                        +'</div>'
                        
            }; 

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextFlightOperation));
    });    
}

function setCurrentTab(){
    var flightDetailsTabIndex = readCookie("flightD_tab_index");
    if(typeof flightDetailsTabIndex === ud) flightDetailsTabIndex=0;
    var $tabs = $(tabPanes);
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    $($tabs.get(flightDetailsTabIndex)).addClass("active");
    $($navTabs.get(flightDetailsTabIndex)).addClass("active");

    $("ul.nav-tabs >li").click(function(){
        var i = $(this).index();
        currentTabIndex = i;
        createCookie("flightD_tab_index",i,1);
        $tabs.removeClass("active");
        $($tabs.get(i)).addClass("active");
        
    });
}//local functions:

$("#btnDelete").click(function (){
    zsi.form.deleteData({
         code       : "ref-0013"
        ,onComplete : function(data){
            displayRecords();
        }
    });         
});

$("#btnNew").click(function () {
    setCurrentTab();
    g_flight_operation_id = null;
    var $mdl  = $("#ctxFO");
    $mdl.find(".modal-title").html("New Flight Operation" + ' for ' + ' » <select name="dd_unit" id="dd_unit"></select>');
    $("#dd_unit").dataBind({
        url: procURL + "dd_aircrafts_sel @squadron_id=" + g_organization_id
        , text: "aircraft_name"
        , value: "aircraft_info_id"
        , required :true
        , onComplete: function(){
            $("#aircraft_id, #unit_id").val($("#dd_unit").val());
            $("select[name='dd_unit']").change (function(){
                $("#aircraft_id, #unit_id").val(this.value);
            });
        }
    }); 
    $mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    $mdl.find("#flight_schedule_date").dateTimePicker({ format:'m.d.Y H:i'});

    clearForm();
    displayListBoxes();
    displayFlightTime(-1);
    displayFlightOperationPilot(-1);
    buildFlightOperationButtons();
});

function showModalUpdateOperation(index, flight_operation_id) {
   var _info = dataFlightOperations[index];
    $('#ctxFO .modal-title').html('Flight Operation for ' + ' » <select name="dd_unit" id="dd_unit"></select>');
    $("select[name='dd_unit']").dataBind({
         url: procURL + "dd_aircrafts_sel @squadron_id=" + g_organization_id
        , text: "aircraft_name"
        , value: "aircraft_info_id"
        , required :true
        , onComplete: function(){
            $("#aircraft_id, #unit_id").val($("#dd_unit").val());
            $("select[name='dd_unit']").change (function(){
                $("#aircraft_id, #unit_id").val(this.value);
            });
        }
    });  
    
    $("#ctxFO").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxFO").find("#flight_schedule_date").dateTimePicker({ format:'m.d.Y H:i'});
    $("#ctxFO #flight_operation_id").val(_info.flight_operation_id);
    setCurrentTab();
    buildFlightOperationButtons();
    displayFlightOperation(_info);
    displayFlightTime(_info.flight_operation_id);
    displayFlightOperationPilot(_info.flight_operation_id);
    
}

function displayListBoxes(){
   $("select[name='station_id']").dataBind({
         url: execURL + "stations_sel"
        , text: "station_code"
        , value: "station_id"
        ,onComplete: function(data){
            
            $("select[name='ms_category_id']").dataBind({
                 url: procURL + "mission_symbols_sel @ms_classification_code='C'"
                , text: "ms_description"
                , value: "ms_id"
                ,onComplete: function(data){
                    
                    $("select[name='ms_type_id']").dataBind({
                         url: procURL + "mission_symbols_sel @ms_classification_code='T'"
                        , text: "ms_description"
                        , value: "ms_id"
                        ,onComplete: function(data){
                            
                            $("select[name='ms_detail_id']").dataBind({
                                 url: procURL + "mission_symbols_sel @ms_classification_code='D'"
                                , text: "ms_description"
                                , value: "ms_id"
                                ,onComplete: function(data){
                                }
                            });
                            
                        }
                    });
                }
            });
        }
    });
}

function displayFlightOperation(d){
    g_flight_operation_id = d.flight_operation_id;
    $("#ctxFO #flight_operation_id").val( d.flight_operation_id );
    $("#ctxFO #flight_operation_code").val(  d.flight_operation_code );
    $("#ctxFO #flight_schedule_date").val(  d.flight_schedule_date); 
    $("#ctxFO #no_cycles").val( d.no_cycles );    
    $("#ctxFO #station_id").attr("selectedvalue", d.station_id );   
    $("#ctxFO #ms_category_id").attr("selectedvalue", d.ms_category_id );  
    $("#ctxFO #ms_type_id").attr("selectedvalue", d.ms_type_id );  
    $("#ctxFO #ms_detail_id").attr("selectedvalue", d.ms_detail_id );  
    $("#ctxFO #ms_essential").val(d.ms_essential );
    $("#ctxFO #itinerary").val(d.itinerary );
    $("#ctxFO #flt_cond").val(d.flt_cond );
    $("#ctxFO #sort").val(d.sort );
    $("#ctxFO #pax_mil").val(d.pax_mil );
    $("#ctxFO #pax_civ").val(d.pax_civ );
    $("#ctxFO #fnt_mil").val(d.fnt_mil );
    $("#ctxFO #fnt_civ").val(d.fnt_civ );
    $("#ctxFO #cargo").val(d.cargo );
    $("#ctxFO #gas_up_loc").val(d.gas_up_loc );
    $("#ctxFO #gas_up").val(d.gas_up );
    $("#ctxFO #gas_bal").val(d.gas_bal );
    $("#ctxFO #status_name").text(d.status_name);
    $("#ctxFO #remarks").text(d.remarks);

    displayListBoxes();
}

function clearForm(){
    $('input[type=text], input[type=hidden]').val('');
    $("select[type='text']").attr("selectedvalue", "" ).val("");
    dataFlightOperationsIndex=-1;
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "flight_operation_sel @squadron_id=" + g_organization_id 
	    ,width          : $(document).width() -40
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
    		        return "<a href='javascript:showModalUpdateOperation(\""
    		        + dataFlightOperationsIndex + "\"," 
    		        + svn(d,"flight_operation_id") + ");'>" 
    		        + svn(d,"flight_operation_code") + " </a>";
    		    }
    		}
    		,{text  : "Station"                    , type  : "label"     , width : 200        , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"station_code")}
    		}
    		,{text  : "Flight Schedule"         , type  : "label"     , width : 200       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"flight_schedule_date");
    		    } 
    		}
        	,{text  : "Aircraft Name"                , type  : "label"     , width : 230       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"aircraft_name")}
    	    }
    		,{text  : "Itinerary"          , type  : "label"     , width : 200      , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"itinerary")}
    		}
    	    ,{text  : "No. of Cycles"                 , type  : "label"     , width : 100        , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"no_cycles")}
    		}
    		,{text  : "Status"                 , type  : "label"     , width : 100        , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"status_name")}
    		}
	    ]  
        ,onComplete: function(data){
            dataFlightOperations = data.rows;
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayFlightTime(flight_operation_id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     var totalHours = 0;
     $("#" + tblFTime).dataBind({
	     url            : execURL + "flight_time_sel @flight_operation_id=" + flight_operation_id
	    ,width          : $(document).width() -40
	    //,height         : 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                      , width : 25                      , style : "text-align:left;"       
        		    , onRender : function(d){ 
        		        totalHours += svn (d,"no_hours");
	                    return    bs({name:"flight_operation_detail_id",type:"hidden",value: svn (d,"flight_operation_detail_id")}) 
	                            + bs({name:"is_edited",type:"hidden"})
	                            + bs({name:"flight_operation_id",type:"hidden",value: (flight_operation_id < 0 ? "":flight_operation_id)})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                              
                    }
                }	                                     
        		,{text  : "Engine Start"           , name : "engine_start"          , type : "input"     , width : 200     , style : "text-align:left;"}			
        		,{text  : "Engine Shutdown"        , name : "engine_shutdown"       , type : "input"     , width : 200     , style : "text-align:left;"}
        		,{text  : "No. of Hours"           , name : "no_hours"              , type : "input"     , width : 120     , style : "text-align:center;"}
            	,{text  : "Remarks"                , name : "remarks"               , type : "input"     , width : 500     , style : "text-align:left;"}
	    ]      
	    ,onComplete: function(data){
	            var gridFooter = '<div class="zRow odd active">'
                            +'  <div class="zCell no-data" style="width:425px;text-align:right;"><label>Total Hours:</label></div>'
                            +'  <div class="zCell no-data" style="width:120px;text-align:center;"><label>'+ totalHours +'</label></div>'
                            +'  <div class="zCell no-data " style="width:500px;text-align:left;"></div></div>';
                $("#tblFlightDetails .zGridPanel.right").find("#table").append(gridFooter);
                
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#" + tblFTime).find("#is_edited").val("Y");
                });
	        
                $("#cbFilter2").setCheckEvent("#" + tblFTime + " input[name='cb']");
                $("input[name='engine_start']").dateTimePicker({ format:'m.d.Y H:i'});
                $("input[name='engine_shutdown']").dateTimePicker({ format:'m.d.Y H:i'});
                
                $("input[name='engine_shutdown']").change( function(){
                    var $zRow = $(this).closest(".zRow");
                    var date1 = $zRow.find("#engine_start").val();
                    var date2 = $zRow.find("#engine_shutdown").val();
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

function displayFlightOperationPilot(flight_operation_id){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#" + tblPilot).dataBind({
	     url            : procURL + "flight_operation_pilots_sel @flight_operation_id=" + flight_operation_id
	    ,width          : $(document).width() - 35
	    //,height         : 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return       bs({name:"flight_operation_pilot_id",type:"hidden",value: svn (d,"flight_operation_pilot_id")})
                		                              +  bs({name:"is_edited",type:"hidden"}) 
                		                              +  bs({name:"flight_operation_id",type:"hidden",value: (flight_operation_id < 0 ? "":flight_operation_id)})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                
        		,{text  : "Pilot"          , width : 250        , style : "text-align:left;"
        		    ,onRender : function(d){ return  bs({name:"pilot_id",type:"select"  ,value: svn (d,"pilot_id")}) }
        		}
        		,{text  : "Duty"           , name  : "duty"           , type  : "input"           , width : 250        , style : "text-align:left;"}
	    ]
    	     ,onComplete: function(data){
                $("#cbFilter3").setCheckEvent("#" + tblPilot + " input[name='cb']");
    	        $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });            
                $("select[name='pilot_id']").dataBind({
                     url: procURL + "dd_pilots_sel @squadron_id=" + g_organization_id
                    , text: "userFullName"
                    , value: "user_id"
                });
            }  
    });    
}

function buildFlightOperationButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=82,@doc_id=" + $("input[name='flight_operation_id']").val(), function(d) {
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
            var $tblFTime = $("#" + tblFTime);
            var _ft_flight_operation_id = (data.returnValue ===0 ? g_flight_operation_id : data.returnValue);
            $tblFTime.find("input[name='flight_operation_id']").val( _ft_flight_operation_id);
            $tblFTime.jsonSubmit({
                 procedure : "flight_time_upd"
                ,optionalItems : ["flight_operation_id","is_edited"]
                , notInclude: "#dealer_filter"
                ,onComplete: function (data) {
                    if(data.isSuccess===true){ 
                        var $tblPilot = $("#" + tblPilot);
                        console.log("_ft_flight_operation_id:" + _ft_flight_operation_id );
                        $tblPilot.find("input[name='flight_operation_id']").val( _ft_flight_operation_id);
                        $tblPilot.jsonSubmit({
                             procedure : "flight_operation_pilots_upd"
                            ,optionalItems : ["flight_operation_id","is_edited"]
                            ,onComplete: function (data) {
                                if(data.isSuccess===true){ 
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
                            