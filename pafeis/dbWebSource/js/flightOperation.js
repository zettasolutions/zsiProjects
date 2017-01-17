var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,dataFlightOperations
   ,dataFlightOperationsIndex =-1
;



zsi.ready(function(){
    displayRecords();
    getTemplate();
});

var contextFlightOperation = { 
                  id    :"modalFlightOperation"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitFlightOperations();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>' 
                        
                , body  : '<div id="frm_modalFlightOperation" class="form-horizontal" style="padding:5px">'
                        
                        +'<div class="col-xs-12" style="padding:5px">'
                        
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Operaion Code</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="flight_operation_id" id="flight_operation_id" >'
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
                        +'        <label class=" col-xs-2 control-label">Unit</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="unit_id" id="unit_id" class="form-control input-sm" ></select>'
                        +'         </div>'
                        +'        <label class=" col-xs-2 control-label">Aircraft</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'    </div>'

                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Pilot</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="pilot_id" id="pilot_id" class="form-control input-sm" ></select>'
                        +'        </div>  '
                        +'        <label class=" col-xs-2 control-label">Co Pilot</label>'
                        +'        <div class=" col-xs-4">'
                        +'            <select type="text" name="co_pilot_id" id="co_pilot_id" class= "form-control input-sm" > </select>'
                        +'        </div>'
                        +'    </div>'
   
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Origin</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="origin" id="origin" class="form-control input-sm" >'
                        +'        </div>  '
                        +'         <label class=" col-xs-2 control-label">Destination</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <input type="text" name="destination" id="destination" class="form-control input-sm" >'
                        +'         </div>'
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Status</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="status_id" id="status_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'    </div>'

                        +'</div>'
                        +'</div>'
                        
            }; 

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextFlightOperation));
       
    });    
}

$("#btnNew").click(function () {
    $("#modalFlightOperation .modal-title").text("New Flight Operation");
    $('#modalFlightOperation').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayListBoxes();
    clearForm();
    zsi.initDatePicker();
});

function submitFlightOperations(){    
         $("#frm_modalFlightOperation").jsonSubmit({
             procedure : "flight_operation_upd"
            ,optionalItems : ["flight_operation_id"]
            ,onComplete: function (data) {
             if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalFlightOperation').modal('hide');
                clearForm();
            }
        });
}

function showModalUpdateOperation(index) {
   var _info = dataFlightOperations[index];
  
    $("#modalFlightOperation .modal-title").text("Flight Operation for » " + _info.flight_operation_code);
 
    $("#modalFlightOperation").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalFlightOperation #flight_operation_id").val(_info.flight_operation_id);
    
    displayFlightOperation(_info);
  
    zsi.initDatePicker();
}


function displayListBoxes(){
    $("select[name='flight_operation_type_id']").dataBind( "flight_operation_type");    
    $("select[name='unit_id']").dataBind( "squadron");
    $("select[name='aircraft_id']").dataBind( "aircraft_info");
    $("select[name='pilot_id']").dataBind( "employees_fullnames_v");
    $("select[name='co_pilot_id']").dataBind( "employees_fullnames_v");
    $("select[name='status_id']").dataBind( "status");   
}

function displayFlightOperation(d){
 
    $("#modalFlightOperation #flight_operation_id").val( d.flight_operation_id );
    $("#modalFlightOperation #flight_operation_code").val(  d.flight_operation_code );
    $("#modalFlightOperation #flight_operation_name").val(  d.flight_operation_name );
    $("#modalFlightOperation #flight_schedule_date").val(  d.flight_schedule_date.toDateFormat() ); 
    $("#modalFlightOperation #origin").val(  d.origin );
    $("#modalFlightOperation #destination").val(  d.destination );  
    
    
    $("#modalFlightOperation #flight_operation_type_id").attr("selectedvalue",   d.flight_operation_type_id );
    $("#modalFlightOperation #unit_id").attr("selectedvalue",  d.unit_id );
    $("#modalFlightOperation #aircraft_id").attr("selectedvalue",   d.aircraft_id );
    $("#modalFlightOperation #pilot_id").attr("selectedvalue",  d.pilot_id );
    $("#modalFlightOperation #co_pilot_id").attr("selectedvalue",   d.co_pilot_id );
    $("#modalFlightOperation #status_id").attr("selectedvalue",   d.status_id );
    
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
	     url            : execURL + "flight_operation_sel"
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
        		    ,onRender : function(d){ return svn(d,"flight_schedule_date")}
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
  
	    ]  
    	     ,onComplete: function(data){
    	         dataFlightOperations = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0013"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
        
                                                        