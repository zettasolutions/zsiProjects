var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,tblIssuanceDD ="tblModalIssuanceDirectiveDetails"
   ,dataIssuance
   ,dataIssuanceIndex =-1
   ,g_warehouse_id = null
;



zsi.ready(function(){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_warehouse_id =  d.rows[0].warehouse_id;
        }
    });
    displayRecords();
    getTemplate();
    
    
});

var contextModalWindow = { 
                  id    :"ctxMW"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>' 
                        
                , body  : '<div id="frmIssuanceDirective" class="form-horizontal" style="padding:5px">'
 
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Issuance No.</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="issuance_directive_id" id="issuance_directive_id" >'
                        +'             <input type="text" name="issuance_directive_no" id="issuance_directive_no" class="form-control input-sm" >'
                        +'        </div> ' 
                        +'        <label class=" col-xs-2 control-label">Issued From</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="issued_directive_from_id" id="issued_directive_from_id" class="form-control input-sm" ></select>'
                        +'         </div>'
                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Issued To</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="issued_directive_to_id" id="issued_directive_to_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        
                        +'        <label class=" col-xs-2 control-label">Upload Reference</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="text" name="attached_filename" id="attached_filename" class="form-control input-sm" >'
                        +'        </div>'  
                        +'    </div>'

                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Process</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="process_id" id="process_id" class="form-control input-sm" ></select>'
                        +'         </div>'
                        +'        <label class=" col-xs-2 control-label">Action</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="action_id" id="action_id" class="form-control input-sm" ></select>'
                        +'         </div>'
                        +'      </div>'
                        +'</div>'
                        +'<div class="modalGrid zPanel"><h4> Issuance Directive Detail </h4><div id="'+ tblIssuanceDD +'" class="zGrid Detail" ></div></div>'
                        
            };
            

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));

    });    
}


$("#btnNew").click(function () {
    $("#ctxMW .modal-title").text("New Issuance Directive");
    $('#ctxMW').modal({ show: true, keyboard: false, backdrop: 'static' });
    
    clearForm();
    displayListBoxes();
    
    displayIssuanceDirectiveDetails(0);

});

function submitData(){    
         $("#frmIssuanceDirective").jsonSubmit({
             procedure : "issuance_directive_upd"
            ,optionalItems : ["issuance_directive_id","issued_directive_from_id","issued_directive_to_id","process_id","action_id"]
            ,onComplete: function (data) {
             if(data.isSuccess===true){ 
                 
                var $tbl = $("#" + tblIssuanceDD);
                $tbl.find("[name='issuance_directive_id']").val( data.returnValue);
                $tbl.jsonSubmit({
                     procedure : "issuance_directive_detail_upd"
                    ,optionalItems : ["issuance_directive_id"]
                    ,onComplete: function (data) {
                        if(data.isSuccess===true){  
                            clearForm();
                            zsi.form.showAlert("alert");
                            $("#grid").trigger("refresh");
                            $('#ctxMW').modal('hide');
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

function showModalEditIssuance(index) {
   var _info = dataIssuance[index];
  
    $("#ctxMW .modal-title").text("Issuance Directive » " + _info.issuance_directive_no);
 
    $("#ctxMW").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxMW #issuance_directive_id").val(_info.issuance_directive_id);
    
    displayIssuanceDirective(_info);
    displayIssuanceDirectiveDetails(_info.issuance_directive_id);
}

function displayListBoxes(){
    $("select[name='issued_directive_from_id']").dataBind( "organization");
    $("select[name='issued_directive_to_id']").dataBind( "organization");
  /*  $("select[name='issued_directive_to_id']").dataBind({
                               // url: base_url +  "selectoption/code/employees_fullnames_v"
                                url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id
                               , text: "userFullName"
                               , value: "user_id"
                                });*/
    $("select[name='process_id']").dataBind( "status");   
    $("select[name='action_id']").dataBind( "status");  
}

function displayIssuanceDirective(d){
  var $f = $("#frmIssuanceDirective");
   $f.find("#issuance_directive_id").val( d.issuance_directive_id );
   $f.find("#issuance_directive_no").val(  d.issuance_directive_no );
   $f.find("#attached_filename").val(  d.attached_filename );
   $f.find("#issued_directive_from_id").attr("selectedvalue",  d.issued_directive_from_id );
   $f.find("#issued_directive_to_id").attr("selectedvalue",  d.issued_directive_to_id ); 
   $f.find("#process_id").attr("selectedvalue",   d.process_id );
   $f.find("#action_id").attr("selectedvalue",  d.action_id );
   
   displayListBoxes();
}

function clearForm(){ 
    $('input[type=text], input[type=hidden]').val('');
    $('select[type="text"]').attr('selectedvalue','').val('');    
    dataIssuanceIndex=-1;
}
function displayRecords(){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : execURL + "issuance_directive_sel"
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_directive_id",type:"hidden",value: svn (d,"issuance_directive_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Issuance No."            , type  : "input"       , width : 120       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataIssuanceIndex++;
        		        return "<a href='javascript:showModalEditIssuance(\"" + dataIssuanceIndex + "\");'>" 
        		        + svn(d,"issuance_directive_no") + " </a>";
        		    }
        		}
        	    ,{text  : "Issued From"             , type  : "label"     , width : 250       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"issued_directive_from_id")}
        	    }
        		,{text  : "Issued To"               , type  : "label"     , width : 250        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"issued_directive_to_id")}
        		}
        		,{text  : "Upload Reference"        , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"attached_filename")}
        		}
        		,{text  : "Process"                 , type  : "label"                , width : 250       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"process_id")}  
        		}
        		,{text  : "Action"                  , type  : "label"     , width : 250       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"action_id")}
        		}
	    ]  
    	     ,onComplete: function(data){
    	         dataIssuance = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
function displayIssuanceDirectiveDetails(issuance_directive_id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblIssuanceDD).dataBind({
	     url            : execURL + "issuance_directive_detail_sel @issuance_directive_id=" + issuance_directive_id
	    ,width          : 800
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_directive_detail_id",type:"hidden",value: svn (d,"issuance_directive_detail_id")})
                		                             + bs({name:"issuance_directive_id",type:"hidden",value: (issuance_directive_id===0 ? "":issuance_directive_id) })
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
        	    ,{text  : "Item"                , name  : "item_id"             , type  : "select"      , width : 200       , style : "text-align:left;"}
        	    ,{text  : "Aircraft"            , name  : "aircraft_id"         , type  : "select"      , width : 300       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"  , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Qty"                 , name  : "quantity"            , type  : "input"       , width : 100       , style : "text-align:left;"}

	    ]  
    	     ,onComplete: function(data){
                $("#cbFilter2").setCheckEvent("#" + tblIssuanceDD + " input[name='cb']");
                $("select[name='item_id']").dataBind( "items");
                $("select[name='aircraft_id']").dataBind( "aircraft_type");
                $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
                 
                 
        }  
    });    
}


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0020"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
        
                                                                     