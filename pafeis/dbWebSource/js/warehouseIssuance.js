var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,cls =".right .zHeaders .item"
    ,queDataProcedures
    ,g_user_id = null
    ,g_recieving_id = null
    ,g_organization_id = null
    ,g_organization_name = ""
    ,g_location_name = ""
    ,g_tab_name = "AIRCRAFT"
    ,warehouse_id = null
    ,g_warehouse_id = null
    ,g_issuance_id = null
    ,g_today_date = new Date() + ""
;
    const IssuanceType = {
    Aircraft: 'Aircraft',
    Warehouse: 'Warehouse',
    Maintenance: 'Maintenance',
    Disposal: 'Disposal',
    Directive: 'Directive',
};

zsi.ready(function(){
    $("#aircraft-tab").click(function(){
        g_tab_name = "AIRCRAFT";
        displayAircraft($(this).html());  
    });
    $("#warehouse-tab").click(function() {
        g_tab_name = "WAREHOUSE";
        displayWarehouse($(this).html());    
    });
    $("#maintenance-tab").click(function() {
        g_tab_name = "MAINTENANCE";
        displayMaintenance($(this).html());    
    });
    $("#disposal-tab").click(function() {
        g_tab_name = "DISPOSAL";
        displayDisposal($(this).html());
    });
    $("#directive-tab").click(function() {
        g_tab_name = "DIRECTIVE";
        displayDirective($(this).html());
    });
   
    getTemplate();
    setCurrentTab();
    getUserInfo(function(){
        displayAircraft(g_tab_name);
    });
    
    $(window).keydown(function(event){
        if(event.target.tagName != 'TEXTAREA') {
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        }
    });
});

// Create modal window for the receiving
var contextModalIssuance = {
    id: "modalIssuance"
    , title: ""
    , sizeAttr: "modal-lg"
    , footer: '<div id="issuance-footer" class="pull-left">'
            + '<button type="button" onclick="resetFields(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Reset</button>'
    , body: '<div id="tblModalIssuanceHeader" class="zGrid header ui-front"></div><br/><div><h4>Details</h4></div><div class="zPanel"><div id="tblModalIssuanceDetails" class=" zGrid zPanel detail"></div></div>'
 };
 
 var contextUploadFile = { 
          id    : "modalUploadFile"
        , title : "Upload File"
        , footer: '<div class="pull-left"><button type="button" onclick="uploadFile();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span> Upload</button>'
                   + '</div>' 
    };

// Reset the input fields.
function resetFields(obj) {
    var result = confirm("This will clear the items. Continue?");
    if (result) {
        clearEntries();
    }
}

function clearEntries() {
    $('input[type=text]').val('');
    $('select').val('');    
}

// Initialize the input with the id of date into a datepicker.
function initDatePicker(){
    zsi.initDatePicker();
    $('input[id*=date]').datepicker();
}

// Initialize the values for the select options.
function initSelectOptions(callbackFunc){
    $("#tblModalIssuanceHeader #issued_by").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id
        , text: "userFullName"
        , value: "user_id"
        , onComplete : function(){
            $("#tblModalIssuanceHeader select#accepted_by").dataBind({
                url: base_url +  "selectoption/code/employees_fullnames_v"
                , onComplete : function(){
                    if(callbackFunc) callbackFunc();
                }
            });
        } 
    });
    
    $("select, input").on("keyup change", function(){
            $("#tblModalIssuanceHeader").find("#is_edited").val("Y");
    }); 
    
    $("select, input").on("keyup change", function(){
        var $zGrid  = $(this).closest(".zGrid ");
        $zGrid.find("#is_edited").val("Y");
    });
}

// Get the template for the initialization of the modal windows.
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalIssuance));
        $("body").append(template(contextUploadFile));
    });    
}

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_warehouse_id = (d.rows[0].warehouse_id ? d.rows[0].warehouse_id : null);
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            
            $(".pageTitle").append(' for ' + g_organization_name + g_location_name);
        }
        if(callBack) callBack();
    });
}

// Set the current tab when the page loads.
function setCurrentTab(){
    var $tabs = $("#tabPanel > div");
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    // Set supplier delivery tab as current tab.
    $($tabs.get(0)).addClass("active"); 
    $($navTabs.get(0)).addClass("active");
}

// Add a click event for the li elements.
$("ul.nav-tabs >li").click(function(){
    var i = $(this).index();
    createCookie("receiving_tab_index",i,1);
    $("#tabPanel > div").each(function(){
        var obj =  $(this);
        var cur_div_index = obj.index();
        obj.removeClass("active");
        if(i===cur_div_index)
           obj.addClass("active");
    });
});

// Display the grid for the aircraft issuance.
function displayAircraft(tab_name){
    $("#gridAircraft").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Aircraft + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\",\"" +  svn(d,"aircraft_id")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by_name"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issued To"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Aircraft"       , name  : "aircraft_name"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"aircraft_name"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Status"       , name  : "status_name"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_name"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            , {text  : "Upload File"       , width : 100                   , style:"text-align:center;" 
    		    , onRender : function(d){ 
    		        var h = "<a href='javascript:void(0);' onclick='showUploadFile(" + svn(d,"issuance_id") +");'><span class='glyphicon glyphicon-upload' style='font-size:12pt;'></span></a>";
    		        return (d!==null ? h : "");
        		}
            }
        ]   
    });    
}

// Display the grid for the warehouse issuance.
function displayWarehouse(tab_name){
    $("#gridWarehouse").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
             {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Warehouse + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\",\"" +  svn(d,"transfer_warehouse_id")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issued To"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_organization_warehouse"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_name"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
        ]   
    });    
}

// Display the grid for the maintenance issuance.
function displayMaintenance(tab_name){
    $("#gridMaintenance").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
             {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Maintenance + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\",\"" +  svn(d,"transfer_warehouse_id")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issued To"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_organization_warehouse"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_name"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
        ]   
    });    
}

// Display the grid for the disposal issuance.
function displayDisposal(tab_name){
    $("#gridDisposal").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Disposal + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\",\"" +  svn(d,"transfer_warehouse_id")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issued To"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_warehouse_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
        ]   
    });
}

// Display the grid for the directive issuance.
function displayDirective(tab_name){
    $("#gridDirective").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Disposal + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\",\"" +  svn(d,"transfer_warehouse_id")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issued To"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_warehouse_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
        ]   
    });
}

// Build the issuance form.
function buildIssuance(tbl_obj) {
    buildIssuanceHeader(tbl_obj);
    initSelectOptions(function() {
        initDatePicker();
        buildIssuanceDetails(function() {
            buildIssuanceButtons();        
        });
    });
}

// Build the issuance header form.
function buildIssuanceHeader(tbl_obj) {
    var $table = $(tbl_obj);
    $table.html('');
    var html = '<div class="form-horizontal" style="padding:5px">' +
        '<input type="hidden" name="issuance_id" id="issuance_id" class="form-control input-sm" >' +
        '<input type="hidden" name="is_edited" id="is_edited" class="form-control input-sm" >' +
        '<input type="hidden" name="orgranization_id" id="orgranization_id" class="form-control input-sm" >' +
        '<div class="form-group  ">' +
            '<label class=" col-xs-2 control-label">Issuance No.</label>' +
            '<div class=" col-xs-2">' +
                '<input type="text" name="issuance_no" id="issuance_no" class="form-control input-sm" >' +
            '</div>' +
            
            '<label class=" col-xs-2 control-label">Issued By</label>' +
            '<div class=" col-xs-2">' +
                '<select type="text" name="issued_by" id="issued_by" class="form-control input-sm"></select>' +
            '</div>' +
            
            '<label class=" col-xs-2 control-label">Issued Date</label>' +
            '<div class=" col-xs-2">' +
                '<input type="text" name="issued_date" id="issued_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'" >' +
                '<input type="hidden" name="issuance_directive_code" id="issuance_directive_code" class="form-control input-sm">' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm" >' +
                '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm">' +
                '<input type="hidden" name="dealer_id" id="dealer_id">' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
            '<div class="hide" id="issuance_directive_code_filter_div">'+
                '<label class=" col-xs-2 control-label">Directive Code</label>' +
                '<div class=" col-xs-2">' +
                    '<input type="text" name="issuance_directive_code_filter" id="issuance_directive_code_filter" class="form-control input-sm">' +
                '</div>' +
            '</div>'+

            '<label class=" col-xs-2 control-label">Authority Ref</label>' +
            '<div class=" col-xs-2">' +
                '<input type="text" name="authority_ref" id="authority_ref" class="form-control input-sm" >' +
            '</div>' +
            
            '<label class=" col-xs-2 control-label">Accepted By</label>' +
            '<div class=" col-xs-2">' +
                '<select name="accepted_by" id="accepted_by" class="form-control input-sm"></select>' +
                '<input type="hidden" name="issued_to_organization_id" id="issued_to_organization_id" class="form-control input-sm">' +
            '</div>' +
            

        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-2 control-label">Status</label>' +
            '<div class=" col-xs-2">' +
                '<label class="control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' +
            '</div>' +
            '<label class=" col-xs-2 control-label">Status Remarks</label>' +
            '<div class=" col-xs-6">' +
                '<textarea type="text" name="status_remarks" id="status_remarks" rows="3"  class="form-control input-sm" ></textarea>' +
                '<input type="hidden" name="issuance_type" id="issuance_type" value="'+ g_tab_name +'"class="form-control input-sm" >' +
            '</div>' +

            '<div class="hide" id="dealer_filter_div">' +
                '<label class=" col-xs-2 control-label">Dealer</label>' +
                '<div class=" col-xs-2">' +
                     '<select name="dealer_filter" id="dealer_filter" class="form-control input-sm"></select>' +
                '</div>' +
            '</div>'+
        '</div>' +

        '</div>';
    
    $table.append(html);
}

// Build the issuance details form.
function buildIssuanceDetails(callback) {
    $("#tblModalIssuanceDetails").dataBind({
        url: procURL + "issuance_details_sel"
        ,width:  $(document).width() - 220
        ,height: 200 
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){ 
                    return bs({name:"issuance_detail_id",type:"hidden", value: svn (d,"issuance_detail_id")})
                        +  bs({name:"is_edited",type:"hidden"}) 
                        +  bs({name:"issuance_id",type:"hidden", value: svn (d,"issuance_id")})
                        +  bs({name:"item_inv_id",type:"hidden", value: svn (d,"item_inv_id")});
                       // +  bs({name:"serial_no",type:"hidden", value: svn (d,"serial_no")});
                }
            }    
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure"          , type  : "label"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Stock Qty."          , name  : "stock_qty"                , type  : "label"       , width : 100       , style : "text-align:left;" }
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });            

            $("[name='quantity']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                var stock_qty = $zRow.find('#stock_qty').text();
                if(parseInt(this.value) > stock_qty){
                    alert("Please enter quantity less than or equal to stock qty.");
                    this.value = "";
                } 
            });            
            
            setSearchMulti();
            setMandatoryEntries();
            if(callback) callback();
        }  
    });
}

// Build the issuance buttons.
function buildIssuanceButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=66,@doc_id=" + $("#issuance_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            if(!g_issuance_id || g_issuance_id===null){
                $("#status_name").text(d.rows[0].status_name);
            }
            $(".added-button").remove();
            $("#issuance-footer").append(html);
        }
    });
}

// Add a click event for the aircraft issuance button.
$("#aircraftBtnNew").click(function () {
    g_issuance_id = null;
    $("#modalIssuance .modal-title ").html("Issue Items from " + g_organization_name + g_location_name + ' to <select name="aircraft_filter" id="aircraft_filter"></select>');
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    
    $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
        $("#dealer_filter_div, #issuance_directive_code_filter_div").addClass("hide");
        $("select[name='aircraft_filter']").dataBind({ url: base_url + "selectoption/code/aircraft_info"});
        $("select[name='aircraft_filter']").change(function(){
            $("#aircraft_id").val(this.value);
        });
    });
});

// Add a click event for the warehouse issuance button.
$("#warehouseBtnNew").click(function () {
    g_issuance_id = null;
    $("#modalIssuance .modal-title").html('Transfer Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_warehouse_transfer_filter" id="dd_warehouse_transfer_filter"></select>');
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    
    $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
        $("#dealer_filter_div, #issuance_directive_code_filter_div").addClass("hide");
        $("select[name='dd_warehouse_transfer_filter']").dataBind({
            url: procURL + "dd_transfer_warehouses_sel"
            , text: "organization_warehouse"
            , value: "warehouse_id"
            , required :true
            , onComplete: function(){
                $transferWID = $("select[name='dd_warehouse_transfer_filter']").val();
                $("#transfer_warehouse_id").val($transferWID);
               
                $("select[name='dd_warehouse_transfer_filter']").change(function(){
                    $("#transfer_warehouse_id").val(this.value);
                    setSearchMulti();
                });
            }
        });
    });
});

// Add a click event for the maintenance issuance button.
$("#maintenanceBtnNew").click(function () {
    g_issuance_id = null;
    $("#modalIssuance .modal-title").html('Maintenance Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_warehouse_filter" id="dd_warehouse_filter"></select>');
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    
    $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
        $("#dealer_filter_div, #issuance_directive_code_filter_div").addClass("hide");
        $("select[name='dd_warehouse_filter']").dataBind({
            url: procURL + "dd_organizations_sel @squadron_type='maintenance'"
            , text: "organization_name"
            , value: "organization_id"
            ,onComplete: function(){
                $transferWID = $("select[name='dd_warehouse_filter']").val();
                $("#transfer_warehouse_id").val($transferWID);
               
                $("select[name='dd_warehouse_filter']").change(function(){
                    $("#transfer_warehouse_id").val(this.value);
                    setSearchMulti();
                });
            }        
        });
    });
});

// Add a click event for the disposal issuance button.
$("#disposalBtnNew").click(function () {
    g_issuance_id = null;
    $("#modalIssuance .modal-title").html("Dispose Items from " + g_organization_name + g_location_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    
    $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
        $("#dealer_filter_div, #issuance_directive_code_filter_div").addClass("hide");
    });
});

// Add a click event for the directive issuance button.
$("#directiveBtnNew").click(function () {
    g_issuance_id = null;
    $("#modalIssuance .modal-title").html('Directive Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_directive_filter" id="dd_directive_filter"></select>');
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    
    $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
        $("#tblModalIssuanceHeader").find("#dealer_filter_div").addClass("hide");
        $("#tblModalIssuanceHeader").find("#issuance_directive_code_filter_div").removeClass("hide");
        
        $("select[name='dd_directive_filter']").dataBind({
            url: procURL + "dd_directive_wings_sel"
            , text: "organization_name"
            , value: "organization_id"
            ,onComplete: function(){
                $transferWID = $("select[name='dd_directive_filter']").val();
                $("#transfer_warehouse_id").val($transferWID);
               
                $("select[name='dd_directive_filter']").change(function(){
                    $("#transfer_warehouse_id").val(this.value);
                    setSearchMulti();
                });
            }        
        });
        
        $("input#issuance_directive_code_filter").keyup(function(){
            console.log(this.value);
            if($.trim(this.value)){
                $("#issuance_directive_code").val(this.value);
            }
        });
    });
});

// Save the new issuance entry.
function Save(page_process_action_id) {
   if( zsi.form.checkMandatory()!==true) {
        return false;
    }
    var result = confirm("Entries will be saved. Continue?");
    if (result) {
        $("#tblModalIssuanceHeader").find("#is_edited").val("Y");
        $("#status_id").val(page_process_action_id);
        $("#tblModalIssuanceHeader").jsonSubmit({
            procedure: "issuances_upd"
            , notInclude: "#dealer_filter, #issuance_directive_code_filter"
            , onComplete: function (data) {
                console.log(data);
                if (data.isSuccess === true) {
                    var _issuance_id = (data.returnValue==0 ? g_issuance_id : data.returnValue);
                    $("#tblModalIssuanceDetails input[name='issuance_id']").val(_issuance_id);
                    //Saving of details.
                    SaveDetails(page_process_action_id);
                } else {
                    console.log(data.errMsg);
                }
            }
        });
    }
}

// Save the new issuance details entry.
function SaveDetails(page_process_action_id) {
    $("#tblModalIssuanceDetails").jsonSubmit({
        procedure: "issuance_details_upd"
        , notInclude: "#part_no,#national_stock_no,#item_name,#unit_of_measure,#stock_qty"
        , optionalItems: ["issuance_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                setStatusName(page_process_action_id);
                clearEntries();
            } else {
                console.log(data.errMsg);
            }
            $("#modalIssuance").modal('hide');
            
            if(g_tab_name==="AIRCRAFT"){
                 displayAircraft(g_tab_name);   
            }
            else if(g_tab_name==="WAREHOUSE"){
                 displayWarehouse(g_tab_name);   
            }
            else if(g_tab_name==="MAINTENANCE"){
                 displayMaintenance(g_tab_name);   
            }
            else if(g_tab_name==="DISPOSAL"){
                 displayDisposal(g_tab_name);   
            }
            else if(g_tab_name==="DIRECTIVE"){
                 displayDirective(g_tab_name);   
            }
        }
    });
}

// Set the label for the status.
function setStatusName(page_process_action_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + page_process_action_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}

// Show the modal window for the update of issuance.
function showModalUpdateIssuance(issuance_type, issuance_id, issuance_no, id) {
    g_issuance_id = issuance_id;
    $("#dealer_filter_div, #issuance_directive_code_filter_div").addClass("hide");
    
    if (issuance_type == IssuanceType.Aircraft) {
        $("#modalIssuance .modal-title").html('Issue Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="aircraft_filter" id="aircraft_filter"></select>');
        $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
        buildIssuanceHeader("#tblModalIssuanceHeader");
        
        $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
            $("select[name='aircraft_filter']").attr("selectedvalue", id);
            $("select[name='aircraft_filter']").dataBind({ url: base_url + "selectoption/code/aircraft_info"});
            $("select[name='aircraft_filter']").change(function(){
                $("#aircraft_id").val(this.value);
            });
        });
    }
    if (issuance_type == IssuanceType.Warehouse) {
        $("#modalIssuance .modal-title").html('Transfer Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_warehouse_transfer_filter" id="dd_warehouse_transfer_filter"></select>');
        $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
        buildIssuanceHeader("#tblModalIssuanceHeader");
        
        $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
            $("select[name='dd_warehouse_transfer_filter']").attr("selectedvalue", id);
            $("select[name='dd_warehouse_transfer_filter']").dataBind({
            url: procURL + "dd_transfer_warehouses_sel"
            , text: "organization_warehouse"
            , value: "warehouse_id"
            , required :true
            , onComplete: function(){
                $("select[name='dd_warehouse_transfer_filter']").change(function(){
                    $("#transfer_warehouse_id").val(this.value);
                    setSearchMulti();
                });
            }
            });
        });
    }
    if (issuance_type == IssuanceType.Maintenance) {
        $("#modalIssuance .modal-title").html('Maintenance Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_warehouse_filter" id="dd_warehouse_filter"></select>');
        $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
        buildIssuanceHeader("#tblModalIssuanceHeader");
        
        $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
            $("select[name='dd_warehouse_filter']").attr("selectedvalue", id);
            $("select[name='dd_warehouse_filter']").dataBind({
                url: procURL + "dd_warehouses_sel"
                , text: "warehouse"
                , value: "warehouse_id"
                , required :true
                , onComplete: function(){
                    $("select[name='dd_warehouse_filter']").change(function(){
                        $("#transfer_warehouse_id").val(this.value);
                        setSearchMulti();
                    });
                }
            });
        });
    }
    if (issuance_type == IssuanceType.Disposal) {
        $("#modalIssuance .modal-title").html("Dispose Items from " + g_organization_name + g_location_name);
        $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
        buildIssuanceHeader("#tblModalIssuanceHeader");
    }
    if (issuance_type == IssuanceType.Directive) {
        $("#modalIssuance .modal-title").html('Directive Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_directive_filter" id="dd_directive_filter"></select>');
        $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
        buildIssuanceHeader("#tblModalIssuanceHeader");
        
        $('#modalIssuance').on('shown.bs.modal', function (e) { //This event is fired when the modal has been made visible to the user
            $("#issuance_directive_code_filter_div").removeClass("hide");
            $("select[name='dd_directive_filter']").dataBind({
                url: procURL + "dd_directive_wings_sel"
                , text: "organization_name"
                , value: "organization_id"
                ,onComplete: function(){
                    $transferWID = $("select[name='dd_directive_filter']").val();
                    $("#transfer_warehouse_id").val($transferWID);
                   
                    $("select[name='dd_directive_filter']").change(function(){
                        $("#transfer_warehouse_id").val(this.value);
                        setSearchMulti();
                    });
                }        
            });
            
            $("#issuance_directive_code_filter").keyup(function(){
                if($.trim(this.value)){
                    $("#issuance_directive_code").val(this.value);
                }
            });
        });
    }
    
    initDatePicker();
    initSelectOptions(function(){
        $("#issuance_id").val(issuance_id);
        $.get(procURL + "issuances_sel @issuance_id=" + issuance_id + "&@tab_name=" + g_tab_name, function(d) {
            if (d.rows !== null) {
                $("#tblModalIssuanceHeader #issuance_no").val(d.rows[0].issuance_no);
                $("#tblModalIssuanceHeader #issued_by").val(d.rows[0].issued_by);
                $("#tblModalIssuanceHeader #issued_date").val(d.rows[0].issued_date);
                $("#tblModalIssuanceHeader #issuance_directive_code").val(d.rows[0].issuance_directive_code);
                $("#tblModalIssuanceHeader #aircraft_id").val(d.rows[0].aircraft_id);
                $("#tblModalIssuanceHeader #authority_ref").val(d.rows[0].authority_ref);
                $("#tblModalIssuanceHeader #transfer_warehouse_id").val(d.rows[0].transfer_warehouse_id);
                $("#tblModalIssuanceHeader #accepted_by").val(d.rows[0].accepted_by);
                $("#tblModalIssuanceHeader #issued_to_organization_sel").val(d.rows[0].issued_to_organization_sel);
                $("#tblModalIssuanceHeader #status_name").html(d.rows[0].status_name);
                $("#tblModalIssuanceHeader #status_remarks").val(d.rows[0].status_remarks);
                $("#tblModalIssuanceHeader #dealer_id").val(d.rows[0].dealer_id);
                $("#tblModalIssuanceHeader #dealer_filter").val(d.rows[0].dealer_id);
                
                loadIssuanceDetails(issuance_id);
                buildIssuanceButtons(); 
            }
        });
    });
}

// Load the values for the issuance details.
function loadIssuanceDetails(issuance_id) {
    $("#tblModalIssuanceDetails").dataBind({
        url: procURL + "issuance_details_sel @issuance_id=" + issuance_id
        ,width:  $(document).width() - 265
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){ 
                    return bs({name:"issuance_detail_id",type:"hidden", value: svn (d,"issuance_detail_id")})
                        +  bs({name:"is_edited",type:"hidden"}) 
                        +  bs({name:"issuance_id",type:"hidden", value: issuance_id})
                        +  bs({name:"item_inv_id",type:"hidden", value: svn (d,"item_inv_id")});
               }
            }    
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , width : 150       , style : "text-align:left;"
                ,onRender: function(d){ return "<span id='_unit_of_measure'>" + svn(d,"unit_of_measure") + "</span>"; }  
            }
            ,{text  : "Stock Qty."         , width : 100       , style : "text-align:left;"
                ,onRender: function(d){ return "<span id='_stock_qty'>" + svn(d,"stock_qty") + "</span>"; }
            }
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
                else
                    $("#tblModalIssuanceHeader").find("#is_edited").val("Y");
            });
            /*
            $("input[name='item_inv_id']").each(function(){
                if(this.value){
                    var $row = $(this).closest(".zRow");
                        $row.find("select[id='serial_no']").dataBind({ 
                             url : execURL + "dd_warehouse_items_sel @item_inv_id="+ this.value 
                            ,text: "serial_no"
                            ,value: "serial_no"
                        });
                } 
            });
            */
            $("[name='quantity']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                var stock_qty = $zRow.find("input[name='stock_qty']").val();
                if(parseInt(this.value) > stock_qty){
                    alert("Please enter quantity less than or equal to stock qty.");
                    this.value = "";
                } 
            });            
            
            setSearchMulti();
            setMandatoryEntries();
        }  
    });
}

function showUploadFile(issuance_id){
    $('#modalUploadFile').find(".modal-title").text("Upload File");
    $('#modalUploadFile').modal("show");
    $('#modalUploadFile').find("form").attr("enctype","multipart/form-data");
    
    $.get(base_url + 'page/name/tmplImageUpload'
        ,function(data){
            $('#modalUploadFile').find('.modal-body').html(data);
            $("#frm_modalUploadFile").find("#prefixKey").val("warehouseIssuance.");
           initChangeEvent();
        }
    ); 
}

function initChangeEvent(){
    $("input[name='file_thumbnail']").change(function(){
        fileNameThumbNail= this.files[0].name;
        var fileSize1 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize1 > 100){ 
            alert("Please make sure that file size must not exceed 100 KB.");
            this.value="";
        }
    });
    
    $("input[name='file']").change(function(){
        fileNameOrg=this.files[0].name;
        var fileSize2 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize2 > 800){ //1mb
            alert("It is recommended that file size must not exceed 800 KB.");
            this.value="";
        }
    });
}

function uploadFile(){
    var frm = $("#frm_modalUploadFile");
    var fileOrg=frm.find("#file").get(0);

    if( fileOrg.files.length<1 ) { 
         alert("Please select image.");
        return;
    }
    var formData = new FormData( frm.get(0));
    $.ajax({
        url: base_url + 'file/UploadImage',  //server script to process data
        type: 'POST',

        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess) {
                //submit filename to server
                $.get(execURL  + "dbo.image_file_users_upd @user_id=" + user_id
                                + ",@img_filename='warehouseIssuance." +  fileOrg.files[0].name + "'"
                ,function(data){
                    zsi.form.showAlert("alert");
                    $('#modalUploadFile').modal('toggle');
                    //refresh latest records:
                    displayRecords("");
                });

                    
            } else {
                alert(data.errMsg);
            }
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


function setSearchMulti(){
    var _tableCode = "ref-0027";
        new zsi.search({
        tableCode: _tableCode
        , colNames: ["part_no","item_inv_id","item_name","national_stock_no","unit_of_measure","stock_qty","with_serial"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , condition: "'warehouse_id=" + g_warehouse_id + "'"
        , input: "input[name=part_no]"
        , url: execURL + "searchData "
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            setSearchSerial(data, $zRow);
        }
    });

    new zsi.search({
        tableCode: _tableCode
        , colNames: ["national_stock_no","item_inv_id","item_name","part_no","unit_of_measure","stock_qty","with_serial"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , condition: "'warehouse_id=" + g_warehouse_id + "'"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            setSearchSerial(data, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: ["item_name","item_inv_id","part_no","national_stock_no","unit_of_measure","stock_qty","with_serial"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , condition: "'warehouse_id=" + g_warehouse_id + "'"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            setSearchSerial(data,$zRow);
        }
    });
}

 
function setSearchSerial(d, row){
    row.find("#serial_no").val(d.serial_no);
    row.find("#item_inv_id").val(d.item_inv_id);
    row.find("#part_no").val(d.part_no);
    row.find("#item_name").val(d.item_name);
    row.find("#national_stock_no").val(d.national_stock_no);
    row.find("#unit_of_measure").text(d.unit_of_measure);
    row.find("#stock_qty").text(d.stock_qty);

    row.find("#_unit_of_measure").html(d.unit_of_measure);
    row.find("#_stock_qty").html(d.stock_qty);

    var $serial_no = row.find("select[id='serial_no']");
    var _status = ""
    if(g_tab_name==="AIRCRAFT"){
        _status = 23
    }
    else if(g_tab_name==="MAINTENANCE"){
        _status = 24
    }
    else if(g_tab_name==="DISPOSAL"){
        _status = 60
    }
    else _status = 0
    
    if(d.with_serial==="Y"){
        $serial_no.removeAttr("readonly");
        $serial_no.dataBind({ 
             url : execURL + "dd_warehouse_items_sel @item_inv_id="+ d.item_inv_id +",@status_id=" + _status
            ,text: "serial_no"
            ,value: "serial_no"
        });
        
        $serial_no.change(function(){
           if(this.value != ""){
              row.find("input[name='quantity']").text(1);
               
           } 
        });
    }


} 


// Set the mandatory fields.
function setMandatoryEntries(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["issuance_no","issued_date"]
                ,"type":"M"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" : ["Issuance No.","Issued Date"]}
      ]
    });    
}
                                                              