var bs                      = zsi.bs.ctrl
    ,svn                    = zsi.setValIfNull
    ,g_adjustment_id        = null
    ,dataAdjustment         = []
    ,dataAdjustmentIndex    = -1
    ,g_user_id              = null
    ,g_warehouse_id         = null
    ,g_organization_id      = null
    ,g_organization_name    = ""
    ,g_location_name        = ""
    ,g_today_date           = new Date() +""
    ,gTw
;

zsi.ready(function(){
    gTw = new zsi.easyJsTemplateWriter();
    getTemplate();
    displayRecords();
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
                url: procURL + "dd_warehouses_sel"
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
});

 
function getTemplate(){
    new zsi.easyJsTemplateWriter("body")
        .bsModalBox({ 
              id    :"modalAdjustment"
            , sizeAttr : "modal-lg fullWidth"
            , title : "New"
            , footer: '<div id="adjustment-footer" class="pull-left">'
            , body  : gTw.newEntryTemplate({gridId:"tblAdjustmentDetails"}).html() 
        });
      
}

$("#btnNew").click(function () {
    g_adjustment_id = null;
    $("#modalAdjustment .modal-title").html('Stock Adjustments' + ' » ' +  g_organization_name + g_location_name);
    $("#modalAdjustment").modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    $("#tblAdjustment").find("input#warehouse_id").val(g_warehouse_id);
    displayAdjustmentDetails('');
    buildAdjustmentButtons();
    
    /*$("select, input").on("keyup change", function(){
        $("#frmPhysicalInv").find("#is_edited").val("Y");
   }); */

    $("select[name='adjustment_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id  
        , text: "userFullName"
        , value: "user_id"
    });
});

function Save(status_id, page_process_action_id){   
    $("#tblAdjustment").find("#status_id").val(status_id);
    $("#tblAdjustment").find("#page_process_action_id").val(page_process_action_id);
    $("#tblAdjustment").jsonSubmit({
         procedure : "adjustments_upd"
        ,optionalItems : ["adjustment_id"]
        ,notInclude : "#adjustment_no,#status_name"
        ,onComplete: function (data) {
            if(data.isSuccess===true){
                var $tbl = $("#tblAdjustmentDetails");
                $tbl.find("[name='adjustment_id']").val((data.returnValue==0 ? g_adjustment_id : data.returnValue));
                $tbl.jsonSubmit({
                     procedure : "adjustment_details_upd"
                    ,optionalItems : ["adjustment_id"]
                    ,notInclude: "#part_no,#national_stock_no,#item_name"
                    ,onComplete: function (data) {
                        if(data.isSuccess===true){  
                            clearForm();
                            zsi.form.showAlert("alert");
                            setStatusName(status_id);
                            $("#grid").trigger("refresh");
                            $('#modalAdjustment').modal('hide');
                        }
                        else {
                            console.log(data.errMsg);
                        }
                    }
                });
            }
            else{
                console.log(data.errMsg);
            }
        }
    });
}

function showModalEditAdjustment(index, adjustment_id) {
    var _info = dataAdjustment[index];
    g_adjustment_id = _info.adjustment_id;
    
    $("#modalAdjustment .modal-title").text("Stock Adjustments" + " » " +  g_organization_name + g_location_name);
    $("#modalAdjustment").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalAdjustment #adjustment_id").val(g_adjustment_id);
    
    /*$("select, input").on("keyup change", function(){
     //   $("#tblAdjustment").find("#is_edited").val("Y");
    }); */    
    
    $("select[name='adjustment_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id 
        , text: "userFullName"
        , value: "user_id"
    });
    zsi.initDatePicker();
    displayAdjustment(_info);
    displayAdjustmentDetails(g_adjustment_id);
    buildAdjustmentButtons();
}

// Set the label for the status name.
function setStatusName(status_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + status_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}

function buildAdjustmentButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=1133,@doc_id=" + $("#adjustment_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            html += '<button type="button" onclick="DeleteAdjustmentDetails();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>';
            
            if(g_adjustment_id===null){
                $("#status_name").text(d.rows[0].status_name);
            }
            $(".added-button").remove();
            $("#adjustment-footer").append(html);
        }
    });
}

function displayAdjustment(d){
  var $f = $("#tblAdjustment");
   $f.find("#adjustment_no").val( d.adjustment_no );
   $f.find("#adjustment_date").val(  d.adjustment_date.toDateFormat() );
   $f.find("#warehouse_id").val( d.warehouse_id );
   $f.find("#adjustment_by").attr("selectedvalue",  d.adjustment_by ); 
   $f.find("#status_id").val( d.status_id );
   $f.find("#status_name").text( d.status_name );
   $f.find("#adjustment_remarks").val( d.adjustment_remarks );
}

function clearForm(){ 
    $("#modalAdjustment").find('input[type=text], input[type=hidden], textarea, select').val('');
    $("#modalAdjustment").find('select').attr('selectedvalue','').val('');  
    $("#modalAdjustment").find("#adjustment_date").val(g_today_date.toShortDate());
    $("#modalAdjustment").find("#status_name").text('');
    dataAdjustmentIndex=-1;
    zsi.initDatePicker();
}

function displayRecords(){
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
	     url            : procURL + "adjustments_sel"
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
             {text  : cb                                                            , width : 25        , style : "text-align:left;"       
    		    , onRender      :  function(d){ 
                    return     bs({name:"adjustment_id",type:"hidden",value: svn (d,"adjustment_id")})
                             + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
            ,{text  : "Adjustment No."          , width : 150       , style : "text-align:left;"
    		    ,onRender : function(d){ 
    		        dataAdjustmentIndex++;
    		        return "<a href='javascript:showModalEditAdjustment(" + dataAdjustmentIndex + ","+ svn(d,"adjustment_id") +");'>" 
    		                + svn(d,"adjustment_no") + " </a>";
    		    }
    		}
    		,{text  : "Adjustment Date"         , width : 150       , style : "text-align:left;"
    		    ,onRender : function(d){ return  svn(d,"adjustment_date").toDateFormat(); }
    		}
    		,{text  : "Warehouse"               , width : 200       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"warehouse_location")}
    		}
    		,{text  : "Adjusted By"                 , width : 200       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"adjusted_by")}
    		}
    		,{text  : "Status"                  , width : 100       , style : "text-align:left;"
    		    ,onRender : function(d){ return  svn(d,"status_name")}  
    		}
    		,{text  : "Remarks"                 , width : 480       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"adjustment_remarks")}
    		}
	    ]  
        ,onComplete: function(data){
            dataAdjustment = data.rows;
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayAdjustmentDetails(adjustment_id){
    var rowNo = 0;
    var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#tblAdjustmentDetails").dataBind({
	     url            : procURL + "adjustment_details_sel @adjustment_id=" + adjustment_id
	    ,width          : $(document).width() -175
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                        return     bs({name:"adjustment_detail_id",type:"hidden",value: svn (d,"adjustment_detail_id")})
                                 + bs({name:"is_edited",type:"hidden"})
                                 + bs({name:"adjustment_id",type:"hidden",value: (adjustment_id===0 ? "" : adjustment_id) })
                                 + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                ,{text  : "#"                   , width : 30                        , style : "text-align:center;"       
        		    , onRender      :  function(d){ 
                        rowNo++;
                        return (d !==null ? rowNo : "");
                    }
                }
                ,{text  : "Adjustment Type"     , width : 200                        , style : "text-align:center;"       
        		    , onRender      :  function(d){
                        return bs({name:"adjustment_type_id",type:"select", value: svn (d,"adjustment_type_id")})
                             + bs({name:"item_inv_id",type:"hidden", value: svn (d,"item_inv_id")});
                    }
                }
                ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 250       , style : "text-align:left;"}
                ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 250       , style : "text-align:left;"}
                ,{text  : "Nomenclature"        , name  : "item_name"                , type  : "input"       , width : 300       , style : "text-align:left;"}
                ,{text  : "Serial No."          , name  : "serial_no"                , type  : "input"       , width : 120       , style : "text-align:left;"}
                ,{text  : "Status"              , name  : "item_status_id"           , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Quantity"            , name  : "adjustment_qty"           , type  : "input"       , width : 120       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure"          , width : 120           , class : "unit_of_measure"    , style : "text-align:left;"}

	    ]  
    	     ,onComplete: function(data){
                $("#cbFilter2").setCheckEvent("#tblAdjustmentDetails input[name='cb']");
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#tblAdjustment").find("#is_edited").val("Y");
                });
                $("select[name='adjustment_type_id']").dataBind("adjustment_types");
                $("select[name='item_status_id']").dataBind({
                    url: execURL + "statuses_sel @is_item='Y'"
                    , text: "status_name"
                    , value: "status_id"
                });
                setMultipleSearch();
        }  
    });    
}

function setMultipleSearch(){
    new zsi.search({
        tableCode: "ref-0027"
        , colNames: ["part_no","item_inv_id","item_name","national_stock_no","unit_of_measure"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_inv_id").val(data.item_inv_id);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
                $zRow.find("#item_name").val(data.item_name);
                $zRow.find(".unit_of_measure span").text(data.unit_of_measure);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0027"
        , colNames: ["national_stock_no","item_inv_id","item_name","part_no","unit_of_measure"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_inv_id").val(data.item_inv_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#item_name").val(data.item_name);
                $zRow.find(".unit_of_measure span").text(data.unit_of_measure);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0027"
        , colNames: ["item_name","item_inv_id","part_no","national_stock_no","unit_of_measure"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_inv_id").val(data.item_inv_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
                $zRow.find(".unit_of_measure span").text(data.unit_of_measure);
        }
    });
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0044"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});
        
function DeleteAdjustmentDetails(){
    zsi.form.deleteData({
         code       : "ref-0045"
        ,onComplete : function(data){
            displayAdjustmentDetails(g_adjustment_id);
        }
    });   
}
          