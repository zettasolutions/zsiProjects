var bs = zsi.bs.ctrl
  ,svn =  zsi.setValIfNull
  ,g_today_date = new Date() +"";

var contextModalWindow = { 
      id    : "mdlsysRequest"
    , sizeAttr : "modal-lg "
    , title : "System Request"
    , footer: '<div id="system-footer" class="pull-left"></div>' 
    , body  : '<div id="tblsysRequest" class="zContainer1 form-horizontal zForm" style="padding:5px">'
            +'<div class="col-sm-12">'
            +'      <div class="form-group  "> ' 
            +'          <label class=" col-xs-1 col-sm-1 col-md-1 col-lg-4 control-label">Ticket id: </label>'
            +'          <div style="margin:5px;" class=" col-xs-1 col-sm-1 col-md-1 col-lg-5">'
            +'                 <input type="text" name="ticket_id" id="ticket_id" class="form-control input-sm" readonly="readonly">'
            +'               <input type="hidden" name="is_edited" id="is_edited">'
            +'          </div> ' 
            
            +'          <label class=" col-xs-2 col-sm-2 col-md-2 col-lg-4 control-label">Ticket Date:</label>'
            +'          <div style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <input type="text" name="ticket_date" id="ticket_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'"  readonly="readonly">'
            +'          </div>'
         
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Request By:</label>'
            +'          <div style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select name="requested_by" id="requested_by" class="form-control input-sm" ></select>'
            +'          </div> ' 
           
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Request Type:</label>'
            +'          <div style="margin:5px;" class="col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select name="request_type_id" id="request_type_id" class="form-control input-sm" ></select>'
            +'          </div> ' 
               
            +'          <label class=" col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Description / Comment:</label>'
            +'          <div  style="margin:5px;" class=" col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'              <textarea style="height:150px;" name="request_desc" id="request_desc" class="form-control input-sm" ></textarea>' 
            +'          </div>'
            
            +'          <label  class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Urgent:</label>'
            +'          <div style="margin:5px;" class="col-xs-5 col-sm-5 col-md-5 col-lg-5">'
            +'               <select name="is_urgent" id="is_urgent" class="form-control input-sm" >'
            +'                    <option ></option>'
            +'                    <option value="Y">Yes</option>'
            +'                    <option value="N">No</option>'
            +'               </select>'
            +'          </div> ' 
            
            +'          <label class="col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label">Status:</label>'
            +               '<div  class=" col-lg-5 col-md-5 col-sm-5 col-xs-5">' 
            +               '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm">' 
            +               '<label class="control-label" name="status_name" id="status_name" >&nbsp;</label>' 
            +               '</div>' 
            +'          </div>'
            +'      </div>'
                
            +'</div>'
};

zsi.ready(function(){
    getTemplate();
    displayRecords();
});

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
    });    
}
    
function displayRecords(){
     //var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
	     url            : execURL + "sys_requests_sel"
	    ,width          : $(document).width() - 25
	    ,height         : $(document).height() - 210
	   // ,selectorType   : "checkbox"
        ,blankRowsLimit: 0
       // ,isPaging : false
        ,dataRows : [
            {text  : "Ticket id"  , name  : "ticket_id" , type  : "label" , width : 75        , style : "text-align:center;"       
    		    , onRender      :  function(d){ 
                    return    "<a href='javascript:modalUpdateSysRequest(" + svn(d,"ticket_id") + ")'>" + svn(d,"ticket_id")  + " </a>"
                        +  bs({name:"is_edited",type:"hidden"})  }
            }	
    		,{text  : "Ticket Date:"            , type  : "label"           , width : 160       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"created_date")}
    		}
    		,{text  : "Request By"              , type  : "label"          , width : 260       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"requested_by_name")}
    		}
    		,{text  : "Request Desc"            , type  : "label"           , width : 550       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"request_desc")}	    
    		}
     		,{text  : "Request Type"            , type  : "label"          , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"request_type_desc")}
     		}
     		,{text  : "Urgent"            , type  : "label"          , width : 70       , style : "text-align:center;"
                ,onRender : function(d){ return (d!==null ? (svn(d,"is_urgent")==="Y" ? "Yes" : "No") : "")}
     		}
            ,{text  : "Status"                  , type  : "label"           , width : 80       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_desc")}
            }
	    ]
        ,onComplete: function(){
            //$("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            
            /*$("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
                else
                    $("#mdlsysRequest").find("#is_edited").val("Y");
            });*/
        }
    });    
}

$("#addBtn").click(function () {
    $("#mdlsysRequest .modalWindow").text("SystemRequest");
    $('#mdlsysRequest').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    $("#status_name").html("NEW");
    
    $("select, input").on("keyup change", function(){
        $("#mdlsysRequest").find("#is_edited").val("Y");
    }); 
    
    loadEmployee(function(){
        loadRequestType(function(){
            buildSysRequestButtons();
        }); 
    }); 
});

function loadEmployee(callBack){
    $("#tblsysRequest select[name='requested_by']").dataBind({
        url: getOptionsURL("employees_fullnames_v")
        ,onComplete: function(){
            if(callBack) callBack();
        }
    });
}

function loadRequestType(callBack){
    $("#tblsysRequest select[name='request_type_id']").dataBind({
        url: getOptionsURL("request_types_v")
        ,onComplete: function(){
            if(callBack) callBack();
        }
    });
}

function clearForm(){
    $("#tblsysRequest select, #tblsysRequest input, #tblsysRequest textarea").val('');
}

function modalUpdateSysRequest(ticket_id) {
    $("#mdlsysRequest .modalWindow").text("System Request");
    $('#mdlsysRequest').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    loadEmployee(function(){
        loadRequestType(function(){
            buildSysRequestButtons(function(){
                $.get(execURL + "sys_requests_sel @ticket_id="+ ticket_id, function(d)  {
                    if(d.rows.length > 0){
                        $("#tblsysRequest #ticket_id").val(d.rows[0].ticket_id);
                        $("#tblsysRequest #ticket_date").val(d.rows[0].created_date);
                        $("#tblsysRequest #requested_by").val(d.rows[0].requested_by);
                        $("#tblsysRequest #request_type_id").val(d.rows[0].request_type_id);
                        $("#tblsysRequest #request_desc").val(d.rows[0].request_desc);
                        $("#tblsysRequest #is_urgent").val(d.rows[0].is_urgent);
                        $("#tblsysRequest #status_id").val(d.rows[0].status_id);
                        $("#tblsysRequest #status_name").text(d.rows[0].status_desc);
                    }
                });    
            }); 
        }); 
   }); 
}

function buildSysRequestButtons(callBack) {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=2139,@doc_id=" + $("#status_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button '+ (k===1 ? "hide" : "") +'">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            $("#status_name").text(d.rows[0].status_name);
            $(".added-button").remove();
            $("#system-footer").append(html);
        }
        if(callBack) callBack();
    });
}

function Save(status_id, page_process_action_id) {
    //var result = confirm("Entries will be saved. Continue?");
    $("#mdlsysRequest").find("#is_edited").val("Y");
    $("#mdlsysRequest").find("#status_id").val(status_id);
    $("#mdlsysRequest").jsonSubmit({
        procedure  : "sys_requests_upd"
        ,optionalItems: ["is_edited","status_id"]
        ,notInclude: "#ticket_date"
        ,onComplete : function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
             
            $('#mdlsysRequest').modal('hide');
            displayRecords();
        }
    });
}
 