var bs  = zsi.bs.ctrl
   ,svn = zsi.setValIfNull
   ,g_procurement_id = null
   ,g_organization_id = null
   ,g_organization_name = ''
   ,g_today_date = new Date()
;

var contextModalWindow = { 
      id    : "mdlProcurement"
    , sizeAttr : "modal-lg fullWidth"
    , title : "New"
    , footer: '<div id="procurement-footer" class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>Save</button></div>' 
    , body  : '<div id="tblProcurement" class="form-horizontal zGrid" style="padding:5px">'
            +'    <div class="form-group  "> ' 
            +'        <label class=" col-xs-2 control-label">Procurement Date</label>'
            +'        <div class=" col-xs-3">'
            +'             <input type="hidden" name="procurement_id" id="procurement_id" >'
            +'             <input type="text" name="procurement_date" id="procurement_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">'
            +'        </div> ' 
            +'        <label class=" col-xs-2 control-label">Procurement Code</label>'
            +'        <div class=" col-xs-3">'
            +'           <input type="text" name="procurement_code" id="procurement_code" class="form-control input-sm" >'
            +'         </div>'
            +'    </div>'
            +'    <div class="form-group  ">  '
            +'        <label class=" col-xs-2 control-label">Procurement Name</label>'
            +'        <div class=" col-xs-3">'
            +'             <input type="text" name="procurement_name" id="procurement_name" class="form-control input-sm"  >'
            +'        </div>'
            +'        <label class=" col-xs-2 control-label">Supplier</label>'
            +'        <div class=" col-xs-3">'
            +'             <select name="supplier_id" id="supplier_id" class="form-control input-sm" ></select>'
            +'        </div>'  
            +'    </div>'
            +'    <div class="form-group  ">  '
            +'        <label class=" col-xs-2 control-label">Promised Delivery Date</label>'
            +'        <div class=" col-xs-3">'
            +'           <input type="text" name="promised_delivery_date" id="promised_delivery_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">'
            +'         </div>'
            +'        <label class=" col-xs-2 control-label">Status</label>'
            +'        <div class=" col-xs-3">'
            +'           <label class="control-label" id="status_name">Open</label>'
            +'           <input type="hidden" name="status_id" id="status_id" class="form-control input-sm" >'
            +'           <input type="hidden" name="is_edited" id="is_edited" class="form-control input-sm" >'
            +'         </div>'
            +'      </div>'
            +'</div>'
            +'<div class="modalGrid zPanel"><h4>Procurement Details</h4> <div id="tblProcurementDetails" class="zGrid Detail" ></div></div>'
};

zsi.ready(function(){
    getTemplate();
    getUserInfo(function(){
        displayRecords(); 
    });
});

$("#btnNew").click(function () {
    g_procurement_id = null;
    $("#mdlProcurement .modal-title").text("New Procurement for " + g_organization_name);
    $('#mdlProcurement').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    loadSupplier();
    $("#procurement_date").val( g_today_date.toShortDate());
    $("#promised_delivery_date").val( g_today_date.toShortDate());
    displayProcurementDetails();
    zsi.initDatePicker();
});

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_organization_id =  d.rows[0].organization_id;
            g_organization_name =  d.rows[0].organizationName;
        }
        if(callBack) callBack();
    });
}

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
    });    
}

function loadSupplier(){
    
    $("select[name='supplier_id']").dataBind({url: base_url + "selectoption/code/dealer"});

    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=1107,@doc_id=" + $("#procurement_id").val(), function(d) {
        if (d.rows !== null) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });

            $(".added-button").remove();
            $("#procurement-footer").html(html);
        }
    });
}

function displayRecords(){
    var cb = bs({name:"cbFilter1",type:"checkbox"}); 
    $("#grid").dataBind({
	     url            : procURL + "procurement_sel"
	    ,width          : $(document).width() -40
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
            {text  : cb                         , width : 25        , style : "text-align:left;"       
		        ,onRender : function(d){ 
                    return bs({name:"procurement_id",type:"hidden",value: svn(d,"procurement_id")})
                         + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }
            ,{text  : "Code"                   , width : 120       , style : "text-align:left;"
    		    ,onRender : function(d){ 
    		        return "<a href='javascript:showModalProcurement("+ svn(d,"procurement_id") +",\"" + svn(d,"procurement_name") + "\");'>" 
    		             + svn(d,"procurement_code") + " </a>";
    		    }
    		}
    	    ,{text  : "Name"            , type  : "label"       , width : 250       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"procurement_name")}
    	    }
    	    ,{text  : "Date"            , type  : "label"       , width : 200       , style : "text-align:left;"
    		     ,onRender : function(d){ return svn(d,"procurement_date").toDateFormat()}
    		}
    		,{text  : "Supplier"        , type  : "label"       , width : 250       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"supplier_name")}
    		}
    		,{text  : "Promised Delivery Date"         , type  : "label"   , width : 200   , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"promised_delivery_date").toDateFormat()}
    		}
    		,{text  : "Total Amount"         , type  : "label"   , width : 100   , style : "text-align:right;"
    		    ,onRender : function(d){ return svn(d,"total_amount").toLocaleString('en-PH', {minimumFractionDigits: 2})}
    		}
    		,{text  : "Status"          , type  : "label"       , width : 100       , style : "text-align:center;"
    		    ,onRender : function(d){ return  svn(d,"status_name")}  
    		}
	    ]  
        ,onComplete: function(data){
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function showModalProcurement(id, title) {
    g_procurement_id = id;
    $("select[name='supplier_id']").attr("selectedvalue", id);
    $("#mdlProcurement .modal-title").text("Update Procurement » " + title + " for " + g_organization_name);
    $("#mdlProcurement").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#mdlProcurement #procurement_id").val(g_procurement_id);
    $("select, input").on("keyup change", function(){
       $("#tblProcurement").find("#is_edited").val("Y");
    });    
    clearForm();
    displayProcurement(function(){
        loadSupplier();
        displayProcurementDetails();
    });
}

function displayProcurement(callBack){
    $.get(procURL + "procurement_sel @procurement_id=" + g_procurement_id, function(data){
        
        if(data.rows.length > 0){
            var d = data.rows[0];
            var $tbl = $("#tblProcurement");
            $tbl.find("#procurement_id").val(d.procurement_id);
            $tbl.find("#procurement_date").val(d.procurement_date.toDateFormat());
            $tbl.find("#procurement_code").val(d.procurement_code);
            $tbl.find("#procurement_name").val(d.procurement_name);
            $tbl.find("#supplier_id").attr("selectedvalue", d.supplier_id);
            $tbl.find("#promised_delivery_date").val(d.promised_delivery_date.toDateFormat());
            $tbl.find("#status_name").text(d.status_name);
        }
        if(callBack) callBack();
    });
}

function displayProcurementDetails(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#tblProcurementDetails").dataBind({
	     url            : execURL + "procurement_detail_sel " + (g_procurement_id ? "@procurement_id=" + g_procurement_id : "")
	    ,width          : $(document).width() -75
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
            {text  : cb                     , width : 25                    , style : "text-align:left;"       
    		    ,onRender : function(d){ 
                    return  bs({name:"procurement_detail_id",type:"hidden",value: svn (d,"procurement_detail_id")})
                          + bs({name:"is_edited", type:"hidden"})
                          + bs({name:"procurement_id",type:"hidden",value: (g_procurement_id ? g_procurement_id : "")})
                          + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
    	    ,{text  : "Item No."           , width : 130                    , style : "text-align:left;"
    	        ,onRender : function(d){ 
                    return  bs({name:"item_no",type:"input",value: svn (d,"item_no")})
                          + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")});
                }
    	    }
    	    ,{text  : "Part No."            , name  : "part_no"             , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"   , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"           , type  : "input"       , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"  , type  : "select"      , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Quantity"            , name  : "quantity"            , type  : "input"       , width : 130       , style : "text-align:right;"}
    	    ,{text  : "Unit Price"          , name  : "unit_price"          , type  : "input"       , width : 130       , style : "text-align:right;"}
    	    ,{text  : "Amount"              , name  : "amount"              , type  : "input"       , width : 130       , style : "text-align:right;"}

	    ]  
        ,onComplete: function(data){
            setMultipleSearch();
            $("#cbFilter2").setCheckEvent("#tblProcurementDetails input[name='cb']");
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
                else
                    $("#tblProcurement").find("#is_edited").val("Y");
            });
            
            $("input[name='quantity']").keyup(function(){
                var quantity  = $.trim(this.value);
                var $zRow     = $(this).closest(".zRow");
                var unitPrice = $.trim($zRow.find("#unit_price").val());
                
                if(unitPrice && quantity){
                    var amount = parseFloat(quantity) * parseFloat(unitPrice);
                    $zRow.find("#lbl_amount").text(amount.toFixed(2));
                    //$zRow.find("#amount").val(amount.toFixed(2));
                }else{
                    $zRow.find("#lbl_amount").text("");
                    //$zRow.find("#amount").val("");
                }
            });
            
            $("input[name='unit_price']").keyup(function(){
                var unitPrice = $.trim(this.value);
                var $zRow     = $(this).closest(".zRow");
                var quantity  = $.trim($zRow.find("#quantity").val());

                if(unitPrice && quantity){
                    var amount = parseFloat(quantity) * parseFloat(unitPrice);
                    $zRow.find("#lbl_amount").text(amount.toFixed(2));
                    //$zRow.find("#amount").val(amount.toFixed(2));
                }else{
                    $zRow.find("#lbl_amount").text("");
                    //$zRow.find("#amount").val("");
                }
            });
        }  
    });    
}

function Save(page_process_action_id){
    $("#status_id").val(page_process_action_id);
    $("#tblProcurement").jsonSubmit({
         procedure : "procurement_upd"
        ,optionalItems : ["procurement_id"]
        ,onComplete: function (data) {
         if(data.isSuccess===true){ 
             
            var $tbl = $("#tblProcurementDetails");
            $tbl.find("[name='procurement_id']").val((g_procurement_id ? g_procurement_id : data.returnValue));
            $tbl.jsonSubmit({
                 procedure : "procurement_detail_upd"
                ,optionalItems : ["procurement_id"]
                ,notInclude: "#part_no,#national_stock_no,#item_name"
                ,onComplete: function (data) {
                    if(data.isSuccess===true){  
                        zsi.form.showAlert("alert");
                        clearForm();
                        $("#grid").trigger("refresh");
                        $('#mdlProcurement').modal('hide');
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


function buildReceivingButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=70,@doc_id=" + $("#receiving_id").val(), function(d) {
        if (d.rows !== null) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            $(".added-button").remove();
            $("#receiving-footer").append(html);
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

function clearForm(){ 
    zsi.initDatePicker();
    $('input[type=text], input[type=hidden]').val('');
    $('select[type="text"]').attr('selectedvalue','').val('');    
}

/*$("#btnDelete").click(function(){
    zsi.form.deleteData({
        code        : "ref-0020"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});*/
        