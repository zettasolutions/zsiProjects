var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,tblModalNew = "tblModalNew"
   ,tblModalUpdate = "tblModalUpdate"
   ,tblIDdetails = "tableIDdetails"
   ,modalNew    = 0
   ,dataIssuance
   ,dataIssuanceIndex =-1
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
                        +'        <label class=" col-xs-2 control-label">Issued To</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="issued_directive_to_id" id="issued_directive_to_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'    <div class="form-group  ">  '
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
                        +'<div class="modalGrid zPanel"><h4> Issuance Directive Detail </h4><div id="tblModalIssuanceDirectiveDetails" class="zGrid Detail" ></div></div>'
                        +'</div>'
                        
                        
            };
            
var contextModalUpdate = { 
                  id    :"modalUpdate"
                , sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitUpdate();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Update</button></div>' 
                        
                , body  : '<div id="frm_modalUpdate" class="form-horizontal" style="padding:5px">'
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Issuance No.</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="issuance_directive_id" id="issuance_directive_id" >'
                        +'             <input type="text" name="issuance_directive_no" id="issuance_directive_no" class="form-control input-sm" >'
                        +'        </div> ' 
                        +'        <label class=" col-xs-2 control-label">Issued To</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="issued_directive_to_id" id="issued_directive_to_id" class="form-control input-sm"  ></select>'
                        +'        </div>'
                        +'    </div>'
                        +'        <label class=" col-xs-2 control-label">Issued From</label>'
                        +'        <div class=" col-xs-4">'
                        +'           <select type="text" name="issued_directive_from_id" id="issued_directive_from_id" class="form-control input-sm" ></select>'
                        +'         </div>'
                        +'    <div class="form-group  ">  '
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

                        +'<div class="modalGrid zPanel"><h4> Issuance Directive Detail </h4><div id="tblModalUpdateIssuanceDirectiveDetails" class="zGrid Detail" ></div></div>'
                        +'</div>'
                        
            }; 

var contextIDdetails = { id:"modalWindowIDdetails"
                        , title: "Issuance Directive Details"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsIDdetails();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageSquadronInactive();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'
                                //+ '<button type="button" onclick="NewSpecsProperty();" class="btn btn-primary btn-sm" id="btnNew"><span class="glyphicon glyphicon-plus"></span> New</button>'  

                        , body:            
                        '<div id="' + tblIDdetails + '" class="zGrid"></div>'
};

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalNew));
        $("body").append(template(contextModalUpdate));
        $("body").append(template(contextIDdetails));
    });    
}

function manageItemIDdetails(id,name){
         issuance_directive_id=id;
         issuance_directive_no=name;
         displayRecordsSquadron(id);
         $("#modalWindowIDdetailsLabel .modal-title").text("Issuance Directive for » " + name);
         $('#modalWindowIDdetails').modal({ show: true, keyboard: false, backdrop: 'static' });
         $('#modalWindowIDdetails');//.setCloseModalConfirm();
}

$("#btnNew").click(function () {
    $("#modalNew .modal-title").text("New Issuance Directive");
    $('#modalNew').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayListBoxes();
    displayNewIssuanceDirectiveDetails();

    zsi.initDatePicker();
});

function submitItemNew(){    
         $("#frm_modalNew").jsonSubmit({
             procedure : "issuance_directive_upd"
            ,optionalItems : ["issuance_directive_id","issued_directive_from_id","issued_directive_to_id","process_id","action_id"]
            ,onComplete: function (data) {
             if(data.isSuccess===true){ 
                zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalNew').modal('hide');
                clearForm();
                submitNewIssuanceDD();
             }
             else {
                    console.log(data.errMsg);
                }
            }
            
        });
}

function submitNewIssuanceDD(){
        console.log("agi");
        $("#tblModalIssuanceDirectiveDetails").jsonSubmit({
             procedure : "issuance_directive_detail_upd"
            ,optionalItems : ["issuance_directive_detail_id","issuance_directive_id","item_id","aircraft_id","unit_of_measure_id"]
        });
}
function submitUpdate(){    
         $("#frm_modalUpdate").jsonSubmit({
             procedure : "issuance_directive_upd"
            ,optionalItems : ["issuance_directive_id","issued_directive_to_id","process_id","action_id"]
            ,onComplete: function (data) {
             if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#modalUpdate').modal('hide');
                clearForm();
            }
        });
}

function showModalUpdateIssuance(index,id) {
   var _info = dataIssuance[index];
  
    $("#modalUpdate .modal-title").text("Issuance Directive » " + _info.issuance_directive_no);
 
    $("#modalUpdate").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalUpdate #issuance_directive_id").val(id);
    displayListBoxes();
    displayIssuanceDirective(_info);
    displayUpdateIssuanceDirectiveDetails();
}

function displayListBoxes(){
    $("select[name='issued_directive_from_id']").dataBind( "squadron");
    $("select[name='issued_directive_to_id']").dataBind( "squadron");
    $("select[name='process_id']").dataBind( "status");   
    $("select[name='action_id']").dataBind( "status");  
}

function displayIssuanceDirective(d){
 
    $("#modalUpdate #issuance_directive_id").val( d.issuance_directive_id );
    $("#modalUpdate #issuance_directive_no").val(  d.issuance_directive_no );
    $("#modalUpdate #attached_filename").val(  d.attached_filename );

    $("#modalUpdate #issued_directive_from_id").attr("selectedvalue",  d.issued_directive_from_id );
    $("#modalUpdate #issued_directive_to_id").attr("selectedvalue",  d.issued_directive_to_id ); 
    $("#modalUpdate #process_id").attr("selectedvalue",   d.process_id );
    $("#modalUpdate #action_id").attr("selectedvalue",  d.action_id );
}

function clearForm(){ 
    $("input [type='text']").val("");
    $("input [type='select']").attr("selectedvalue", "" ).val("");
    dataIssuanceIndex=-1;
}
function displayRecords(){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : execURL + "issuance_directive_sel"
	    ,width          : $(document).width() -55
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
                ,{text  : "Issuance No."                    , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataIssuanceIndex++;
        		        return "<a href='javascript:showModalUpdateIssuance(\"" + dataIssuanceIndex + "\",\"" +  svn(d,"flight_Issuance_id") + "\");'>" 
        		        + svn(d,"issuance_directive_no") + " </a>";
        		    }
        		}
        	    ,{text  : "Issued From"                    , type  : "label"     , width : 300       , style : "text-align:left;"
        	        ,onRender : function(d){ return svn(d,"issued_directive_from_id")}
        	    }
        		,{text  : "Issued To"                    , type  : "label"     , width : 200        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"issued_directive_to_id")}
        		}
        		,{text  : "Upload Reference"         , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"attached_filename")}
        		}
        		,{text  : "Process"                         , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"process_id")}  
        		}
        		,{text  : "Action"         , type  : "label"     , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"action_id")}
        		}
        		/*
        		,{text  : "Details"      , width : 70                                     , style : "text-align:center;"      
        		    ,onRender  : 
                        function(d){return "<a href='javascript:manageItemIDdetails(" + svn(d,"issuance_directive_id") + ",\"" +  svn(d,"issuance_directive_no")  + "\");'>" 
                        + svn(d,"countIssuanceDirectiveDetail") + "</a>"; 
                    }
                }
                */

	    ]  
    	     ,onComplete: function(data){
    	         dataIssuance = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
function displayNewIssuanceDirectiveDetails(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#tblModalIssuanceDirectiveDetails").dataBind({
	     url            : execURL + "issuance_directive_detail_sel"
	    ,width          : 800
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_directive_detail_id",type:"hidden",value: svn (d,"issuance_directive_detail_id")})
                		                             + bs({name:"issuance_directive_id",type:"hidden",value: svn (d,"issuance_directive_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
        	    ,{text  : "Item"                , name  : "item_id"             , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Aircraft"            , name  : "aircraft_id"         , type  : "select"      , width : 250       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"  , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Qty"                 , name  : "quantity"            , type  : "input"       , width : 150       , style : "text-align:left;"}

	    ]  
    	     ,onComplete: function(data){
               // $("#cbFilter2").setCheckEvent("#" + tblModalIssuanceDirectiveDetails + " input[name='cb']");
                $("select[name='item_id']").dataBind( "items");
                $("select[name='aircraft_id']").dataBind( "aircraft_type");
                $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
                 
                 
        }  
    });    
}
function displayUpdateIssuanceDirectiveDetails(){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#tblModalUpdateIssuanceDirectiveDetails").dataBind({
	     url            : execURL + "issuance_directive_detail_sel"
	    ,width          : 800
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_directive_detail_id",type:"hidden",value: svn (d,"issuance_directive_detail_id")})
                		                             + bs({name:"issuance_directive_id",type:"hidden",value: svn (d,"issuance_directive_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
        	    ,{text  : "Item"                , name  : "item_id"             , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Aircraft"            , name  : "aircraft_id"         , type  : "select"      , width : 250       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"  , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Qty"                 , name  : "quantity"            , type  : "input"       , width : 150       , style : "text-align:left;"}

	    ]  
    	     ,onComplete: function(data){
               // $("#cbFilter3").setCheckEvent("#" + tblModalUpdateIssuanceDirectiveDetails + "input[name='cb']");
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
        
                                                      