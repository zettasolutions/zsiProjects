var bs                      = zsi.bs.ctrl
   ,svn                     = zsi.setValIfNull
   ,tblPhysicalInvDetail    = "tblModalPhysicalInventoryDetails"
   ,dataPhysicalInv
   ,dataPhysicalInvIndex    =-1
   ,g_user_id               = null
   ,g_warehouse_id          = null
   ,g_organization_id       = null
   ,g_organization_name     = ""
   ,g_location_name         = ""
   ,g_today_date            = new Date() +""
   ,g_physical_inv_id       = null
   ,g_item_code_id          = null
   ,gTw
;
zsi.ready(function(){
    gTw = new zsi.easyJsTemplateWriter();
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            g_warehouse_id =  (d.rows[0].warehouse_id ? d.rows[0].warehouse_id : null);
            
            $(".pageTitle").append(' for ' + g_organization_name + ' » <select name="dd_warehouses" id="dd_warehouses"></select>');
            
            $("select[name='dd_warehouses']").dataBind({
                url: execURL + "dd_warehouses_sel @user_id=" + g_user_id
                , text: "warehouse"
                , value: "warehouse_id"
                , required :true
                , onComplete: function(){
                    
                    g_warehouse_id = $("select[name='dd_warehouses'] option:selected" ).val();
                    
                    $("select[name='dd_warehouses']").change (function(){
                       if(this.value){
                            g_warehouse_id = this.value;
                       }
                    });
                }
            });  
        }
    });
  
    displayRecords();      
    writeTemplate();

});

function writeTemplate(){
    new zsi.easyJsTemplateWriter("body")
        .bsModalBox({ 
              id        : "ctxMW"
            , sizeAttr  : "fullWidth"
            , title     : "New"
            , footer    : gTw.div({id:"physicalInv-footer",class:"pull-left"}).html()  
            , body      : gTw.newEntryTemplate({ todayDate : g_today_date.toShortDate(), gridId : tblPhysicalInvDetail}).html() 
        })
        .bsModalBox({ 
              id        : "modalWindowFileUpload"
            , title     : "File Upload"
            , sizeAttr  : "modal-xs"
            , body      :  gTw.fileUploadTemplate().html()
        })
        .bsModalBox({ 
              id        : "modalWindowSerialNos"
            , title     : "File Upload"
            , sizeAttr  : "modal-lg"
            , footer    : gTw.SerialNoFooterTemplate().html()
            , body      : gTw.div({id:"tblSerialNos",class:"zGrid"}).html()
        });
    
}

$("#btnNew").click(function () {
    g_physical_inv_id = null;
    $("#ctxMW .modal-title").html('Physical Inventory' + ' » ' +  g_organization_name + g_location_name +" <span id='inventoryNo'></span>");
    $("#ctxMW").modal({ show: true, keyboard: false, backdrop: 'static' });

    clearForm();
    displayPhysicalInvDetails('');
    buildPhysicalInvButtons();
    
    

    $("select[name='done_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id  
            , text: "userFullName"
            , value: "user_id"
    });
});

function Save(status_id, page_process_action_id){   
    $("#frmPhysicalInv").find("#status_id").val(status_id);
    $("#frmPhysicalInv").find("#page_process_action_id").val(page_process_action_id);
    $("#frmPhysicalInv").jsonSubmit({
         procedure : "physical_inv_upd"
        ,optionalItems : ["physical_inv_id"]
        ,onComplete: function (data) {
         if(data.isSuccess===true){ 
             
            if( zsi.form.checkMandatory()!==true) return false;
            var $tbl = $("#" + tblPhysicalInvDetail);
            $tbl.find("[name='physical_inv_id']").val((data.returnValue==0 ? g_physical_inv_id : data.returnValue));
            $tbl.jsonSubmit({
                 procedure : "physical_inv_details_upd"
                ,optionalItems : ["physical_inv_id"]
                ,notInclude: "#part_no,#national_stock_no,#item_name"
                ,onComplete: function (data) {
                    if(data.isSuccess===true){  
                        clearForm();
                        zsi.form.showAlert("alert");
                        setStatusName(status_id);
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

function showModalEditPhysicalInv(index,physical_inv_no) {
   var _info = dataPhysicalInv[index];
    g_physical_inv_id = _info.physical_inv_id;
     $("#ctxMW .modal-title").html('Physical Inventory' + ' » ' +  g_organization_name + g_location_name +" <span id='inventoryNo'></span>");
    //$("#ctxMW .modal-title").text("Physical Inventory » " + physical_inv_no);
    $("#ctxMW").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxMW #physical_inv_no").val(physical_inv_no);
       
    $("select[name='done_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id 
            , text: "userFullName"
            , value: "user_id"
    });
    zsi.initDatePicker();
    displayPhysicalInv(_info);
    displayPhysicalInvDetails(g_physical_inv_id);
    buildPhysicalInvButtons();
}

function showUploadFile(){
    $("#modalWindowFileUpload .modal-title").text("Upload File");
    $('#modalWindowFileUpload').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#frm_modalWindowFileUpload").attr("enctype","multipart/form-data");
    
    $.get(execURL + "excel_upload_sel @load_name='Physical Count'", function(data){
        $("#tmpData").val('');
        if(data.rows.length > 0){
            $("#tmpData").val(data.rows[0].value);
        } 
    });
}

// Set the label for the status name.
function setStatusName(status_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + status_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}

function buildPhysicalInvButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=1113,@doc_id=" + $("#physical_inv_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            //html += '<button type="button" onclick="showUploadFile();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-upload"></span>&nbsp;Upload File</button>';
            html += '<button type="button" onclick="DeletePhysicalInvDetails();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>';
            
            if(g_physical_inv_id===null){
                $("#status_name").text(d.rows[0].status_name);
            }
            $(".added-button").remove();
            $("#physicalInv-footer").append(html);
        }
    });
}

function displayPhysicalInv(d){
  var $f = $("#frmPhysicalInv");
   $f.find("#physical_inv_id").val( d.physical_inv_id );
   $f.find("#physical_inv_date").val(  d.physical_inv_date.toDateFormat() );
   $f.find("#organization_id").attr("selectedvalue",  d.organization_id );
   $f.find("#warehouse_id").val( d.warehouse_id );
   $f.find("#done_by").attr("selectedvalue",  d.done_by ); 
   $f.find("#status_id").val( d.status_id );
   $f.find("#status_name").text( d.status_name );
   $f.find("#status_remarks").val( d.status_remarks );
}

function clearForm(){ 
    $('input[type=text], input[type=hidden]').val('');
    $('select[type="text"]').attr('selectedvalue','').val('');  
    $("#status_name").text('');
    dataPhysicalInvIndex=-1;
    zsi.initDatePicker();
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "physical_inv_sel"
	    ,width          : $(document).width() -35
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"physical_inv_id",type:"hidden",value: svn (d,"physical_inv_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Physical Inv No."       , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataPhysicalInvIndex++;
        		        return "<a href='javascript:showModalEditPhysicalInv(\"" + dataPhysicalInvIndex + "\",\""+ svn(d,"physical_inv_no") +"\");'>" 
        		        + svn(d,"physical_inv_no") + " </a>";
        		    }
        		}
                ,{text  : "Physical Inv Date"       , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"physical_inv_date").toDateFormat(); }
        		}
        		,{text  : "Warehouse"               , type  : "label"       , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"warehouse")}
        		}
        		,{text  : "Done By"                 , type  : "label"       , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"emp_done_by")}
        		}
        		,{text  : "Status"                  , type  : "label"       , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"status_name")}  
        		}
        		,{text  : "Remarks"                 , type  : "label"       , width : 470       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"status_remarks")}
        		}
	    ]  
    	     ,onComplete: function(o){
    	         dataPhysicalInv = o.data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayPhysicalInvDetails(physical_inv_id){
    var rowNo = 0;
    var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblPhysicalInvDetail).dataBind({
	     url            : procURL + "physical_inv_details_sel @physical_inv_id=" + physical_inv_id
	    ,width          : $(document).width() -40
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"physical_inv_detail_id",type:"hidden",value: svn (d,"physical_inv_detail_id")})
                		                             + bs({name:"is_edited",type:"hidden"})
                		                             + bs({name:"physical_inv_id",type:"hidden",value: (physical_inv_id===0 ? "":physical_inv_id) })
                		                             + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }
                ,{text  : "#"                   , width : 30                        , style : "text-align:center;"       
        		    , onRender      :  function(d){ 
                        rowNo++;
                        return (d !==null ? rowNo : "");
                    }
                }	
                ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
                ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
                ,{text  : "Nomenclature"        , name  : "item_name"                , type  : "input"       , width : 300       , style : "text-align:left;"}
        	    ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 120       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure"          , width : 120           , style : "text-align:left;"}
        	    ,{text  : "Status"              , name  : "item_status_id"          , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Bin"                 , name  : "bin"                      , type  : "input"       , width : 120       , style : "text-align:left;"}
        	    ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 300       , style : "text-align:left;"}
        	    ,{text  : "Serial No."          , width : 120       , style : "text-align:center;"
        	        , onRender      :  function(d){ 
        	            return (d ? "<a href='javascript:showModalSerialNos(" + physical_inv_id + ","+ svn(d,"item_code_id") +",\""+ svn(d,"part_no") +"\");'><span class='glyphicon glyphicon-list'></span></a>" : "");
        	        }
        	    }

	    ]  
    	     ,onComplete: function(data){
	            setMandatoryEntries();
                $("#cbFilter2").setCheckEvent("#" + tblPhysicalInvDetail + " input[name='cb']");
                
                $("select[name='item_status_id']").dataBind({
                    url: execURL + "statuses_sel @is_item='Y'"
                    , text: "status_name"
                    , value: "status_id"
                });
                
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#tblModalReceivingHeader").find("#is_edited").val("Y");
                });
                $("[name='serial_no']").keyup(function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#quantity").val("1");
                });  
                setMultipleSearch();
        }  
    });    
}

function setMultipleSearch(){
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
                $zRow.find("#item_name").val(data.item_name);
               // setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#item_name").val(data.item_name);
               // setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
        }
    });
}


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0032"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});
        
function DeletePhysicalInvDetails(){
    zsi.form.deleteData({
         code       : "ref-0033"
        ,onComplete : function(data){
            displayPhysicalInvDetails(g_physical_inv_id);
        }
    });   
}

function DeleteSerialNo(){
    zsi.form.deleteData({
         code       : "ref-0034"
        ,onComplete : function(data){
            displaySerialNumbers(g_physical_inv_id, g_item_code_id);
        }
    });   
}
        
function excelFileUpload(){
    var frm      = $("#frm_modalWindowFileUpload");
    var formData = new FormData(frm.get(0));
    var files    = frm.find("input[name='file']").get(0).files;

    if(files.length===0){
        alert("Please select excel file.");
        return;    
    }
    
    //disable button and file upload.
    frm.find("input[name='file']").attr("disabled","disabled");
    $("btnUploadFile").hide();
    $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");

    $.ajax({
        url: base_url + 'file/templateUpload',  //server script to process data
        type: 'POST',
        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess){
                alert("Data has been successfully uploaded.");
                frm.find("input[name='file']").attr("disabled",false);
            }
            else
                alert(data.errMsg);
        },
        error: errorHandler = function() {
            console.log("error");
        },
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    }, 'json');        
}               

function showModalSerialNos(physical_inv_id, item_code_id, part_no){
    g_item_code_id = item_code_id;
    $("#modalWindowSerialNos .modal-title").text("Serial Number(s) for » "+ part_no);
    $('#modalWindowSerialNos').modal({ show: true, keyboard: false, backdrop: 'static' });
    
    displaySerialNumbers(physical_inv_id, item_code_id);
}

function displaySerialNumbers(physical_inv_id, item_code_id){
    var cb = bs({name:"cbFilter4",type:"checkbox"});
    $("#tblSerialNos").dataBind({
	     url            : procURL + "physical_inv_sn_sel @physical_inv_id=" + physical_inv_id +",@item_code_id="+ item_code_id
	    ,width          : $(document).width() -510
	    ,height         : $(document).height() -450
        ,blankRowsLimit :5
        ,dataRows       : [
            {
                text  : cb                                                          
                , width : 25
                , style : "text-align:left;"       
    		    , onRender  :  function(d){ 
	                    return     bs({name:"physical_inv_sn_id",type:"hidden",value: svn (d,"physical_inv_sn_id")})
                                 + bs({name:"is_edited",type:"hidden"})
                                 + bs({name:"physical_inv_id",type:"hidden", value: physical_inv_id})
                                 + bs({name:"item_code_id",type:"hidden", value: item_code_id})
                                 + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }
            ,{
                  text  : "Serial No."       
                , name  : "serial_no"
                , type  : "input"
                , width : 120
                , style : "text-align:left;"
            }	
            ,{
                  text  : "Status"   
                , name  : "status_id"
                , type  : "select"   
                , width : 120
                , style : "text-align:left;"
            }	
            ,{
                  text  : "Remaining Time"   
                , name  : "remaining_time"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }	
            ,{
                  text  : "No. of Repairs"   
                , name  : "no_repairs"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }
            ,{
                  text  : "No. of Overhauls"   
                , name  : "no_overhauls"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }
            ,{
                  text  : "Remarks"   
                , name  : "remarks"
                , type  : "input"   
                , width : 250
                , style : "text-align:left;"
            }
	    ]  
        ,onComplete: function(){
            $("#cbFilter4").setCheckEvent("#grid input[name='cb']");
            $("select[name='status_id']").dataBind("inv_serial_status");
           
        }  
    }); 
}
   
function SaveSerialNo(){
    $("#tblSerialNos").jsonSubmit({
         procedure : "physical_inv_sn_upd"
        ,optionalItems : ["physical_inv_id","item_code_id"]
        ,onComplete: function (data) {
            if(data.isSuccess===true){  
                zsi.form.showAlert("alert");
                $("#tblSerialNos").trigger("refresh");
                $('#modalWindowSerialNos').modal('hide');
            }
            else {
                console.log(data.errMsg);
            }
        }

    });
}  

// Set the mandatory fields.
function setMandatoryEntries(){
    zsi.form.markMandatory({       
        "groupNames":[
            {
                 "names" : ["status_id"]
                ,"type":"M"
            }             
        ]      
        ,"groupTitles":[ 
             {"titles" : ["Status"]}
        ]
    });    
}
         