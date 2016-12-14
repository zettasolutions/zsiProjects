var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,dataFlightTime
   ,dataFlightTimeIndex =-1
;



zsi.ready(function(){
    displayRecords();
    getTemplate();
    
});

var contextFlightTime = { 
                  id    :"modalFlightTime"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitFlightTimeData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>' 
                        
                , body  : '<div id="frm_modalFlightTime" class="form-horizontal" style="padding:5px">'
                        
                        +'<div class="col-xs-12" style="padding:5px">'
                        
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Flight Operation</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="flight_time_id" id="flight_time_id" >'
                        +'             <select type="text" name="flight_operation_id" id="flight_operation_id" class="form-control input-sm" ></select>'
                        +'        </div> ' 
                        +'        <label class=" col-xs-2 control-label">Take Off Time</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <input type="text" name="flight_take_off_time" id="flight_take_off_time" class="form-control input-sm" >'
                        +'         </div>'
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Landing Time</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="flight_landing_time" id="flight_landing_time" class="form-control input-sm"  >'
                        +'        </div>'
                        +'        <label class=" col-xs-2 control-label">No of Hours</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="no_hours" id="no_hours" class="form-control input-sm" >'
                        +'        </div>'  
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Engine off?</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="is_engine_off" id="is_engine_off" class="form-control input-sm" >'
                        +'              <option value="N">No</option><option value="Y" selected="selected" >Yes</option>'
                        +'           </select>'
                        +'         </div>'
                        +'        <label class=" col-xs-2 control-label">Remarks</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <textarea type="text" name="remarks" id="remarks" cols="62" rows="2" class="form-control input-sm"></textarea>'
                        +'        </div>'
                        +'    </div>'

                        +'</div>'
                        +'</div>'
            }; 

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextFlightTime));
    });    
}

function fixTextAreaEvent(){
    var insertAt=function(value, index, string) { 
        return value.substr(0, index) + string + value.substr(index);
    };
    
    
    $('TEXTAREA').keypress(function(e){
        if (e.keyCode == 13) {
            var startPos = this.selectionStart;
            this.value  = insertAt(this.value,startPos,"\r\n");
            this.selectionEnd =startPos + 1;
        }
    }) ;   
}


$("#btnNew").click(function () {
    $("#modalFlightTime .modal-title").text("New Flight Time");
    $('#modalFlightTime').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("select[name='flight_operation_id']").dataBind( "flight_operation");  
    $("#flight_time_id").val("");
    clearForm();
    fixTextAreaEvent();
    //zsi.initDatePicker();

});

function submitFlightTimeData(){    
         $("#frm_modalFlightTime").jsonSubmit({
             procedure : "flight_time_upd"
            ,optionalItems : ["flight_time_id","flight_operation_id","is_engine_off"]
            ,onComplete: function (data) {
             if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalFlightTime').modal('hide');
                clearForm();
            }
        });
}

function showModalUpdateFlightTime(index) {
   var _info = dataFlightTime[index];
  
    $("#modalFlightTime .modal-title").text("Flight Operation for » " + _info.flight_operation_id);
 
    $("#modalFlightTime").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalFlightTime #flight_time_id").val(_info.flight_time_id);
    $("select[name='flight_operation_id']").dataBind( "flight_operation");  
    displayFlightTime(_info);
    fixTextAreaEvent();
    //zsi.initDatePicker();
 
}

function displayFlightTime(d){
 
    $("#modalFlightTime #flight_time_id").val( d.flight_time_id );
    $("#modalFlightTime #flight_take_off_time").val(  d.flight_take_off_time ).datetimepicker();
    $("#modalFlightTime #flight_landing_time").val(  d.flight_landing_time ).datetimepicker();
    $("#modalFlightTime #no_hours").val(  d.no_hours); 
    $("#modalFlightTime #is_engine_off").val(  d.is_engine_off );
    $("#modalFlightTime #remarks").val(  d.remarks );
    $("#modalFlightTime #flight_operation_id").attr("selectedvalue",   d.flight_operation_id );

}

function clearForm(){ 
    
    $("#flight_take_off_time").val("");
    $("#flight_landing_time").val("");
    $("#remarks").val("");
    $("#no_hours").val("");
    $("input [type='select']").attr("selectedvalue", "" ).val("");
    dataFlightTimeIndex=-1;
}

function displayRecords(){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : execURL + "flight_time_sel"
	    ,width          : $(document).width() -55
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"flight_time_id",type:"hidden",value: svn (d,"flight_time_id")})
                		                             + bs({name:"flight_operation_id",type:"hidden",value: svn (d,"flight_operation_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Operation Name"        , type  : "input"       , width : 150     , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataFlightTimeIndex++;
        		        return "<a href='javascript:showModalUpdateFlightTime(\"" + dataFlightTimeIndex + "\");'>" 
        		        + svn(d,"flight_operation_name") + " </a>";
        		    }
        		}
        	    ,{text  : "Take Off Time"           , type  : "label"     , width : 150       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"flight_take_off_time")}
        	    }
        		,{text  : "Landing Time"            , type  : "label"     , width : 150        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"flight_landing_time")}
        		}
        		,{text  : "No. of Hours"             , type  : "label"     , width : 100       , style : "text-align:center;"
        		    ,onRender : function(d){ return svn(d,"no_hours")}
        		}
            	,{text  : "Engine off?"             , type  : "label"     , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"is_engine_off")}
        		}
            	,{text  : "Remarks"                 , type  : "label"     , width : 500       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"remarks")}
        	    }
	    ]  
    	     ,onComplete: function(data){
    	         dataFlightTime = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
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
        
                                                     