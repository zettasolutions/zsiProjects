var bs = zsi.bs.ctrl
  ,svn =  zsi.setValIfNull
  ,g_today_date = new Date() +""



zsi.ready(function(){
    displayRecords();
    getTemplate();
});


/*$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "sys_requests_upd"
            //,optionalItems: ["is_active"]
            //,notInclude: "#requested_by,#request_type_id"
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
                getTemplate();
            }
    });
});*/
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "sys_requests_sel"
	    ,width          : 1300
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 30        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"ticket_id",type:"label",value: svn (d,"ticket_id")}) 
                		                               +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                 }
                 }	 
                 
                 
        		,{text  : "Ticket Date:"            , type  : "label"           , width : 200       , style : "text-align:left;"
        		                                    ,onRender : function(d){ return svn(d,"ticket_date")}
        		}
        		,{text  : "Request By"              , type  : "label"          , width : 250       , style : "text-align:left;"
        		                                    ,onRender : function(d){ return svn(d,"requested_by")}
        		}
        		,{text  : "Request Desc"            , type  : "label"           , width : 500       , style : "text-align:left;"
        		                                    ,onRender : function(d){ return svn(d,"request_desc")}	    
        		}
         		,{text  : "Request Type"            , type  : "label"          , width : 100       , style : "text-align:left;"
         		                                    ,onRender : function(d){ return svn(d,"request_type_id")}
         		}
         		,{text  : "Urgent"            , type  : "label"          , width : 100       , style : "text-align:left;"
         		                                    ,onRender : function(d){ return svn(d,"is_urgent")}
         		}
	            ,{text  : "Status"                  , type  : "label"           , width : 110       , style : "text-align:left;"
	                                                ,onRender : function(d){ return svn(d,"status_id")}
	            }
            	    ]
    	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                    
                    $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#mdlsysRequest").find("#is_edited").val("Y");
                });
            }
            
    });    
}




function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
        $("body").append(template(contextModalsysRequest));
       // $("body").append(template(contextUploadFile));
    });    
}

var contextModalWindow = { 
      id    : "mdlsysRequest"
    , sizeAttr : "modal-lg "
    , title : "System Request"
    , footer: '<div id="system-footer" class="pull-left"></div>' 
    , body  : '<div id="tblsysRequest" class="zContainer1 form-horizontal zForm" style="padding:5px">'
            +'<div class="col-sm-12">'
            +'      <div class="form-group  "> ' 
            +'          <label class=" col-xs-1 col-sm-1 col-md-1 col-lg-1 control-label"></label>'
            +'          <div class=" col-xs-1 col-sm-1 col-md-1 col-lg-1">'
            +'                 <input type="hidden" name="ticket_id" id="ticket_id" class="form-control input-sm"  readonly="readonly">'
            +'               <input type="hidden" name="is_edited" id="is_edited">'
            +'          </div> ' 
            
            +'          <label class=" col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">Ticket Date:</label>'
            +'          <div style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <input type="text" name="ticket_date" id="ticket_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'"  readonly="readonly">'
            +'          </div>'
        
         
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Request By:</label>'
            +'          <div style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select type="text" name="requested_by" id="requested_by" class="form-control input-sm" ></select>'
            +'          </div> ' 
         
           
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Request Type:</label>'
            +'          <div style="margin:5px;" class="col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select type="text" name="request_type_id" id="request_type_id" class="form-control input-sm" ></select>'
            +'          </div> ' 
            
               
            +'          <label class=" col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Description / Comment</label>'
            +'          <div  style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'              <textarea style="height:150px;"name="request_desc" id="request_desc" class="form-control input-sm" ></textarea>' 
            +'          </div>'
         
            
            +'          <label  class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Urgent</label>'
            +'          <div style="margin:5px;" class="col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select type="text" name="is_urgent" id="is_urgent" class="form-control input-sm" >'
            +'                    <option ></option>'
            +'                    <option value="Y">Yes</option>'
            +'                    <option value="N">No</option>'
            +'               </select>'
            +'          </div> ' 
            
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Status</label>'
            +               '<div  class=" col-lg-5 col-md-5 col-sm-5 col-xs-5">' 
            +               '<label id="status" class="control-label" name="status_name" id="status_name" >&nbsp;</label>' 
            +               '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' 
            +               '</div>' 
            +'          </div>'
            +'      </div>'
                
            +'</div>'
};



$("#addBtn").click(function () {
    $("#mdlsysRequest .modalWindow").text("SystemRequest");
    $('#mdlsysRequest').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
   // displayAddRequest();
   
    $("select[name='requested_by']").dataBind( "employees_fullnames_v");
    $("select[name='request_type_id']").dataBind( "request_types_v");
     $("select, input").on("keyup change", function(){
        $("#mdlsysRequest").find("#is_edited").val("Y");
    }); 
    
    $( "#status" ).html("NEW");
     buildSysRequestButtons();
     zsi.initDatePicker();
    
});



function buildSysRequestButtons(callBack) {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=2139,@doc_id=" + $("#status_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button '+ (k===1 ? "hide" : "") +'">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            //if(!g_issuance_id || g_issuance_id===null){
                $("#status_name").text(d.rows[0].status_name);
           // }
            $(".added-button").remove();
            $("#system-footer").append(html);
        }
        if(callBack) callBack();
    });
}


var contextModalsysRequest = {
    id: "modalSysRequest"
    , title: ""
    , sizeAttr: "modal-lg"
    , footer: '<div id="system-footer" class="pull-left"> </div>'
    , body: '<div id="tblModalSysRequestHeader" class="zContainer1 header ui-front"></div>'
            +'<div class="modalGrid zContainer1"><div class="zHeaderTitle1"><label>Details</label></div><div id="tblModalSysRequest" class="zGrid detail"></div></div>'
 };



function Save(status_id, page_process_action_id) {
    //var result = confirm("Entries will be saved. Continue?");
         $("#mdlsysRequest").find("#is_edited").val("Y");
         $("#mdlsysRequest").find("#status_id").val(status_id);
        $("#mdlsysRequest").jsonSubmit({
            procedure  : "sys_requests_upd"
           //,notInclude: "#ticket_id,#ticket_date,#status_id"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#mdlsysRequest").trigger('refresh');
                 $('#mdlsysRequest').modal('hide');
                  //$("#mdlsysRequest").find("#status_id").val(status_id);
                displayRecords();
               
            
            }
        });
    }



                                                            