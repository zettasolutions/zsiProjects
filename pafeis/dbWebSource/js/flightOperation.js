var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,tblModalNew = "tblModalNew"
   ,tblModalUpdate = "tblModalUpdate"
   ,modalNew    = 0
   ,dataFlightOperations
   ,dataFlightOperationsIndex =-1
;



zsi.ready(function(){
    displayRecords();
    getTemplate();
});

var contextModalNew = { 
                  id    :"modalNew"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitItemNew();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>' 
                        
                , body  : '<div id="frm_modalNew" class="form-horizontal" style="padding:5px">'
                        
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
                        +'             <input type="text" name="flight_schedule_date" id="flight_schedule_dated" class="form-control input-sm" >'
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
var contextModalUpdate = { 
                  id    :"modalUpdate"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitUpdate();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Update</button></div>' 
                        
                , body  : '<div id="frm_modalUpdate" class="form-horizontal" style="padding:5px">'
                        
                        +'<div class="col-xs-12" style="padding:5px">'
                        
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Operaion Code</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="flight_operation_id" id="flight_operation_id" class="form-control input-sm">'
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
        $("body").append(template(contextModalNew));
        $("body").append(template(contextModalUpdate));
    });    
}

function initDatePicker(){
    $('input[id*=date]').datepicker();
}

$("#btnNew").click(function () {
    $("#modalNew .modal-title").text("New Flight Operation");
    $('#modalNew').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayListBoxes();
    initDatePicker();

});

function submitItemNew(){    
         $("#frm_modalNew").jsonSubmit({
             procedure : "flight_operation_upd"
            ,optionalItems : ["flight_operation_id","flight_operation_type_id","unit_id","aircraft_id","pilot_id","co_pilot_id","status_id"]
          //  ,notInclude : "#pproperty_name"
            ,onComplete: function (data) {
             if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalNew').modal('hide');
                clearForm();
            }
        });
}
function submitUpdate(){    
         $("#frm_modalUpdate").jsonSubmit({
             procedure : "flight_operation_upd"
            ,optionalItems : ["flight_operation_id","flight_operation_type_id","unit_id","aircraft_id","pilot_id","co_pilot_id","status_id"]
          //  ,notInclude : "#pproperty_name"
            ,onComplete: function (data) {
             if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalUpdate').modal('hide');
                $("input [type='text']").val("");
                $("input [type='select']").val("");
                //displayRecords();
            }
        });
}


function showModalUpdateOperation(index) {
   var _info = dataFlightOperations[index];
  
    $("#modalNew .modal-title").text("Flight Operation for » " + _info.flight_operation_code);
 
    $("#modalNew").modal({ show: true, keyboard: false, backdrop: 'static' });
    displayFlightOperation(_info);
    displayListBoxes();
    initDatePicker();
 
}


function displayListBoxes(){
    $("select[name='flight_operation_type_id']").dataBind( "flight_operation_type");    
    $("select[name='unit_id']").dataBind( "squadron");
    $("select[name='aircraft_id']").dataBind( "aircraft_info");
    $("select[name='pilot_id']").dataBind( "users");
    $("select[name='co_pilot_id']").dataBind( "users");
    $("select[name='status_id']").dataBind( "status");   
}

function displayFlightOperation(d){ 
    $("#flight_operation_id").val( d.flight_operation_id );
    console.log($("[name='flight_operation_id'").lenght);
    
    $("#flight_operation_code").val(  d.flight_operation_code );
    $("#flight_operation_name").val(  d.flight_operation_name );
    $("#flight_schedule_date").val(  d.flight_schedule_date.toDateFormat() );    
    $("#origin").val(  d.origin );
    $("#destination").val(  d.destination );  
    
    
    $("#flight_operation_type_id").attr("selectedvalue",   d.flight_operation_type_id );
    $("#unit_id").attr("selectedvalue",  d.unit_id );
    $("#aircraft_id").attr("selectedvalue",   d.aircraft_id );
    $("#pilot_id").attr("selectedvalue",  d.pilot_id );
    $("#co_pilot_id").attr("selectedvalue",   d.co_pilot_id );
    $("#status_id").attr("selectedvalue",   d.status_id );
}

function clearForm(){ 
    
    $("input [type='text']").val("");
    $("input [type='select']").attr("selectedvalue", "" ).val("");
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
                /*
        		,{text  : "Code"                    , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"flight_operation_code")}
        		}
        		*/
        	    ,{text  : "Name"                    , type  : "label"     , width : 300       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"flight_operation_name")}
        	    }
        		,{text  : "Type"                    , type  : "label"     , width : 200        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"flight_operation_type_id")}
        		}
        		,{text  : "Flight Schedule"         , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"flight_schedule_date")}
        		}
            	,{text  : "Unit"                    , type  : "label"     , width : 300       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"unit_id")}
        		}
            	,{text  : "Aircraft"                , type  : "label"     , width : 150       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"aircraft_id")}
        	    }
                ,{text  : "Pilot"                   , type  : "label"     , width : 150        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"pilot_id")}
        		}
        		,{text  : "Co Pilot"               , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"co_pilot_id")}
        		}
        		,{text  : "Take Off Time"          , type  : "label"     , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"origin")}
        		}
        	    ,{text  : "Destination"            , type  : "label"     , width : 300       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"destination")}
        	    }
        		,{text  : "Status"                 , type  : "label"     , width : 100        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"status_id")}
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
        
                                                