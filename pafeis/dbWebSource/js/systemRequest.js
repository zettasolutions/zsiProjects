var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



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
	    ,width          : 1285
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"is_urgent",type:"hidden",value: svn (d,"is_urgent")}) 
                		                              // +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                 }
                 }	 
                 ,{text  : "Ticket id:"            , type  : "input"           , width : 200       , style : "text-align:left;"
        		                                    ,onRender : function(d){ return svn(d,"ticket_id")}
        		}
                 
        		,{text  : "Ticket Date:"            , type  : "input"           , width : 200       , style : "text-align:left;"
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
	            ,{text  : "Status"                  , type  : "label"           , width : 200       , style : "text-align:left;"
	                                                ,onRender : function(d){ return svn(d,"status_id")}
	            }
            	    ]
    	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
    });    
}


$("#addBtn").click(function () {
    $("#mdlsysRequest .modalWindow").text("SystemRequest");
    $('#mdlsysRequest').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
   // displayAddRequest();
    $("select[name='requested_by']").dataBind( "employees_fullnames_v");
    $("select[name='request_type_id']").dataBind( "request_types_v");
    
});

function submitData(){    
  $("#mdlsysRequest").jsonSubmit({
            procedure  : "sys_requests_upd"
          //  ,notInclude: "#requested_by,#request_type_id"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#mdlsysRequest").trigger('refresh');
                 //$('#mdlsysRequest').modal('hide');
                displayRecords();
               
            }
    });        
}
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
       // $("body").append(template(contextUploadFile));
    });    
}
/*
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "fullWidth"
                        , title: "SystemRequest"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>'
                                //+  ' <button type="button" onclick="deleteData();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button></div>'
                        , body: '<div id="addRequest" class="zGrid" ></div>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}



function displayAddRequest(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#addRequest").dataBind({
	     url            : execURL + "sys_requests_sel"
	    ,width          : 1285
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return      bs({name:"is_urgent",type:"hidden",value: svn (d,"is_urgent")}) 
                		                              // +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                 }
                ,{ text:"Ticket id:"       ,name:"ticket_id"          , type:"input"      , width:200          , style:"text-align:center;"  }
        		,{ text:"Ticket Date:"     ,name:"ticket_date"        , type:"input"      , width:200          , style:"text-align:center;"  }
        		,{ text:"Request By"       ,name:"requested_by"       , type:"select"     , width:250          , style:"text-align:center;"  }
        		,{ text:"Request Desc"     ,name:"request_desc"       , type:"input"      , width:500          , style:"text-align:center;"  }
        		,{ text:"Request Type"     ,name:"request_type_id"    , type:"select"     , width:100          , style:"text-align:center;"  }
        		,{ text:"Status"           ,name:"status_id"          , type:"input"      , width:200          , style:"text-align:center;"  }
        	
            	    ]
    	    
    	          ,onComplete: function(){
    	               $("#cbFilter2").setCheckEvent("#addRequest input[name='cb']");
                       $("select[name='requested_by']").dataBind( "employees_fullnames_v");
                       $("select[name='request_type_id']").dataBind( "request_types_v");
               
        }  
    });    
}*/

var contextModalWindow = { 
      id    : "mdlsysRequest"
    , sizeAttr : "modal-lg "
    , title : "System Request"
    , footer: '<div id="systemRequest-footer" class="pull-left"></div>' 
    , body  : '<div id="tblsysRequest" class="zContainer1 form-horizontal zForm" style="padding:5px">'
            +'<div class="col-sm-12">'
            +'      <div class="form-group  "> ' 
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Ticket id</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'               <input type="hidden" name="is_urgent" id="is_urgent" >'
            +'               <input type="text" name="ticket_id" id="ticket_id" class="form-control input-sm" >'
            +'          </div> ' 
            
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Ticket Date:</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'               <input type="text" name="ticket_date" id="ticket_date" class="form-control input-sm"  >'
            +'          </div>'
        
         
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Request By</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'               <select type="text" name="requested_by" id="requested_by" class="form-control input-sm" ></select>'
            +'          </div> ' 
            
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Request Desc</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'              <textarea name="request_desc" id="request_desc" class="form-control input-sm" ></textarea>' 
            +'          </div>'
         
           
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Request Type</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'               <select type="text" name="request_type_id" id="request_type_id" class="form-control input-sm" ></select>'
            +'          </div> ' 
            
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Status</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-7">'
            +'               <input type="text" name="status_id" id="status_id" class="form-control input-sm" >'
            +'          </div>'
            +'      </div>'
                
            +'</div>'
            +'</div>'
            +'     <div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>'  
            
};








                                                    