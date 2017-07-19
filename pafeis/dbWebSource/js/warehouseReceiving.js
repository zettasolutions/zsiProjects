var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var cls =".right .zHeaders .item";
var queDataProcedures;
var g_receiving_id = null;
var g_organization_id = null;
var g_organization_name = "";
var g_location_name = "";
var g_tab_name = "PROCUREMENT";
var g_warehouse_id = null;
var g_item_code_id = null;
var g_procurement_id = null;
var g_today_date = new Date() + "";
var g_statuses = [];
var g_squadron_type = "";
var g_serials_arr = []
    ,g_imgData  = null
    ,g_masterColumn = []
    ,g_masterData = []
    ,g_detailColumn = []
    ,g_detailData = [];
    
const DeliveryType = {
    Procurement: 'Procurement',
    Donation: 'Donation',
    Warehouse: 'Warehouse',
    Aircraft: 'Aircraft',
    Maintenance: 'Maintenance',
    Directive: 'Directive'
};

imgToBase64( base_url + 'images/airforce-logo.jpg'  , function(img){
    g_imgData = img;
});

zsi.ready(function(){
    getTemplate();
    setCurrentTab();
    
    $(window).keydown(function(event){
        if(event.target.tagName != 'TEXTAREA') {
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        }
    });
    
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            g_warehouse_id =  (d.rows[0].warehouse_id ? d.rows[0].warehouse_id : null);
            g_squadron_type = d.rows[0].squadron_type;
            
            
            $(".pageTitle").append(' for ' + g_organization_name + ' » <select name="dd_warehouses" id="dd_warehouses"></select>');
            $("select[name='dd_warehouses']").dataBind({
                url: execURL + "dd_warehouses_sel @user_id=" + g_user_id
                , text: "warehouse"
                , value: "warehouse_id"
                , required :true
                , onComplete: function(){
                    
                    g_warehouse_id = $("select[name='dd_warehouses'] option:selected" ).val();
                    
                    $("select[name='dd_warehouses']").change (function(){
                        g_warehouse_id = null;
                        if(this.value){
                            g_warehouse_id = this.value;
                        }
                        
                        if(g_tab_name==="PROCUREMENT"){
                             displayProcurement(g_tab_name);   
                        }
                        if(g_tab_name==="DONATION"){
                             displayDonation(g_tab_name);   
                        }
                        else if(g_tab_name==="AIRCRAFT"){
                             displayAircraft(g_tab_name);   
                        }
                        else if(g_tab_name==="WAREHOUSE"){
                             displayWarehouse(g_tab_name);   
                        }
                        else if(g_tab_name==="MAINTENANCE"){
                             displayMaintenance(g_tab_name);   
                        }
                        else if(g_tab_name==="DIRECTIVE"){
                             displayDirective(g_tab_name);   
                        }
                    });
                    
                    getStatusRoles(d.rows[0].role_id);
                    if(g_squadron_type!=="" && g_squadron_type!=="SUPPLY"){
                        $("#procurement-tab, #donation-tab, #tabProcurement, #tabDonation").hide();
                        if(g_squadron_type==="AIRCRAFT"){
                            $("#aircraft-tab").closest("li").addClass("active");
                            $("#tabAircraft").addClass("active");
                            g_tab_name="AIRCRAFT";
                            displayAircraft(g_tab_name); 
                        }else{
                            $("#aircraft-tab, #tabAircraft").hide();
                            $("#warehouse-tab").closest("li").addClass("active");
                            $("#tabWarehouse").addClass("active");
                            g_tab_name="WAREHOUSE";
                            displayWarehouse(g_tab_name); 
                        }
                    }else{
                        $("#aircraft-tab, #tabAircraft").hide();
                        displayProcurement(g_tab_name);
                    }
                }
            });
        }
    });

    $("#procurement-tab").click(function () {
        g_tab_name = "PROCUREMENT";
        displayProcurement(g_tab_name);    
    });
    $("#donation-tab").click(function () {
        g_tab_name = "DONATION";
        displayDonation(g_tab_name);    
    });    
    $("#warehouse-tab").click(function () {
        g_tab_name = "WAREHOUSE";
        displayWarehouse(g_tab_name);    
    });
    $("#aircraft-tab").click(function () {
        g_tab_name = "AIRCRAFT";
        displayAircraft(g_tab_name);    
    });
    $("#maintenance-tab").click(function() {
        g_tab_name = "MAINTENANCE";
        displayMaintenance(g_tab_name);
    });
    $("#directive-tab").click(function() {
        g_tab_name = "DIRECTIVE";
        displayDirective(g_tab_name);
    });
    
});

// Create modal window for the receiving
var contextModalNewReceiving = {
    id: "modalReceiving"
    , title: ""
    , sizeAttr: "modal-lg"
    , footer: '<div id="receiving-footer" class="pull-left"></div>'
            //+ '<button type="button" onclick="resetFields(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            //+ '</span>&nbsp;Reset</button>'
    , body: '<div id="tblModalReceivingHeader" class="zContainer1 header ui-front"></div>'
            +'<div class="modalGrid zContainer1"><div class="zHeaderTitle1"><label>Details</label></div><div id="tblModalReceivingDetails" class="zGrid detail ui-front"></div></div>'
};

var contextModalSubCategory = {
    id: "modalSubCategory"
    , title: ""
    , sizeAttr: "modal-lg"
    , footer: '<div id="receiving-footer" class="pull-left">'
            + '<button type="button" onclick="SaveSubCategory(this);" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk">'
            + '</span>&nbsp;Save</button>'
    , body: '<div ><div id="tblSubCategory" class="zGrid detail ui-front"></div></div>'
};

// Get the template for the initialization of the modal windows.
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalNewReceiving));
        $("body").append(template(contextModalSubCategory));
    });    
}

function clearEntries() {
    $('#modalReceiving input[type=text]').val('');
    $('#modalReceiving select').val('');  
    zsi.initDatePicker(); 
}

// Reset the input fields.
/*function resetFields(obj) {
    var result = confirm("This will clear the items. Continue?");
    if (result) {
        clearEntries();
    }
}*/

// Initialize inputs with the id of date into a date picker.
function initDatePicker(){
    $('input[id*=date]').datepicker();
}

// Initialize the data for the select options.
function initSelectOptions(callbackFunc){
 
    $("select[name='received_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id
        , text: "userFullName"
        , value: "user_id"
        , onComplete : function(){
            if(callbackFunc) callbackFunc(); 
        }
    });

    $("select[name='supply_source_filter']").dataBind({ url: base_url +  "selectoption/code/supply_source" });
    $("select[name='supply_source_filter']").change(function(){
        if(this.value){
            $("#supply_source_id").val(this.value);
        }else{
            $("#supply_source_id").val("");
        }
    
        $("#supply_source_id").val(this.value);
    });
}

// Set the current tab when the page loads.
function setCurrentTab(){
    var $tabs = $("#tabPanel > div");
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    // Set Procurement delivery tab as current tab.
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

function getStatusRoles(role_id){
    $.get(procURL + "roles_sel @role_id=" + role_id, function(d) {
       if(d.rows.length > 0){
            if(d.rows[0].is_add==="N"){
                $("#pdBtnNew, #ddBtnNew, #adBtnNew").addClass("hide");
            }
           
            if(d.rows[0].is_delete==="N"){
                $("#pdBtnDel, #ddBtnDel, #adBtnDel").addClass("hide");
            }
       }
    });   
}

function getStatuses(status_name, callBack){
    $.get(execURL + "statuses_sel @status_name='" + status_name + "'", function(d) {
        g_statuses = [];
        if (d.rows.length > 0) {
            g_statuses = d.rows[0];
        }
        
        var statusClass = "";
        if(g_statuses.is_edit==="N"){
            statusClass = "not-editable";
        }
        $("#tblModalReceivingDetails").find("#table").addClass(statusClass);
        
        if(g_statuses.is_delete==="Y"){
            $("#receiving-footer").append('<button type="button" onclick="javascript:void(0); return DeleteDetails();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>');
        }
        if(g_statuses.is_export_pdf==="Y"){
            $("#receiving-footer").append('<button type="button" onclick="javascript:void(0); return PrintToPDF();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-print"></span>&nbsp;Print</button>');
        }
        if(callBack) callBack();
    });
}

// Display the grid for the Procurement delivery.
function displayProcurement(tab_name){
    var counter = 0;
    $("#procurement").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 55
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "RR No."               , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Procurement + "\",\""
                        + svn(d,"receiving_id") + "\",\"" 
                        + svn(d,"receiving_no")  + "\",\"" 
                        + svn(d,"dealer_id") + "\");'>" 
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }
                ,{text  : "Doc Date"            , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_date").toDateFormat(); }
                }
                ,{text  : "Dealer"              , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"dealer_name"); }
                }
                ,{text  : "Received By"         , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"       , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"              , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the Donation.
function displayDonation(tab_name){
    var counter = 0;
    $("#donation").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 55
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                 {text  : "RR No."             , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Donation+ "\",\""
                        + svn(d,"receiving_id") + "\",\"" 
                        + svn(d,"receiving_no")  + "\",\""
                        + svn(d,"supply_source_id")  + "\",\""
                        + svn(d,"donor") + "\");'>"
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }                ,{text  : "Doc Date"            , name  : "doc_date"       , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_date").toDateFormat(); }
                }
                ,{text  : "Donor"               , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"donor"); }
                }
                ,{text  : "Supply Source"       , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"supply_source"); }
                }
                ,{text  : "Received By"         , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"       , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"              , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the warehouse delivery.
function displayWarehouse(tab_name){
    var counter = 0;
    $("#warehouse").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "RR No."               , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Warehouse + "\",\""
                        + svn(d,"receiving_id") + "\",\""
                        + svn(d,"receiving_no")  + "\",\""
                        + svn(d,"issuance_warehouse")  + "\",\""
                        + svn(d,"warehouse_id")  + "\");'>" 
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."               , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }                ,{text  : "Doc Date"             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Transferred From"      , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"issuance_warehouse"); }
                }
                ,{text  : "Received By"           , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"         , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"                , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"    , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the aircraft delivery.
function displayAircraft(tab_name){
    var counter = 0;
    $("#aircraft").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "RR No."               , type  : "input"               , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Aircraft + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"receiving_no")  + "\"," +  svn(d,"aircraft_id")  + ");'>" 
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."             , type  : "label"               , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }                ,{text  : "Doc Date"      , type  : "label"    , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
               /* ,{text  : "Transferred From"      , type  : "label"             , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"issuance_warehouse"); }
                }*/
                ,{text  : "Aircraft"              , type  : "label"             , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }
                
                ,{text  : "Received By"           , type  : "label"             , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"         , type  : "label"             , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"                , type  : "label"             , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"        , type  : "label"             , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the maintenance delivery.
function displayMaintenance(tab_name){
    var counter = 0;
    $("#maintenance").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "RR No."               , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Aircraft + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"receiving_no")  + "\");'>" 
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."             , type  : "label"               , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }                ,{text  : "Doc Date"      , type  : "label"    , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Transferred From"    , type  : "label"               , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"issuance_warehouse"); }
                }
                ,{text  : "Aircraft"            , type  : "label"               , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }
                
                ,{text  : "Received By"         , type  : "label"               , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"       , type  : "label"               , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"              , type  : "label"               , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"               , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the directive delivery.
function displayDirective(tab_name){
    var counter = 0;
    $("#directive").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "',@warehouse_id="+ g_warehouse_id
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "RR No."                   , type  : "input"           , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Aircraft + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"receiving_no")  + "\");'>" 
                        + svn(d,"receiving_no") + " </a>";
                    }
                }
                ,{text  : "Doc No."                 , type  : "label"           , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_no") }
                }                ,{text  : "Doc Date"      , type  : "label"    , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Transferred From"        , type  : "label"           , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"issuance_warehouse"); }
                }
                /*,{text  : "Aircraft"                , type  : "label"           , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }*/
                
                ,{text  : "Received By"             , type  : "label"           , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"           , type  : "label"           , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
                }
                ,{text  : "Status"                  , type  : "label"           , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"          , type  : "label"           , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Build the forms for the modal window for the receiving.
function buildReceiving(tbl_obj) {
    buildReceivingHeader(tbl_obj);
    initSelectOptions(function() {
        initDatePicker();
        buildReceivingDetails(function() {
            buildReceivingButtons();        
        });
    });
}

// Build the receiving header form.
function buildReceivingHeader(tbl_obj) {
    var $table = $(tbl_obj);
    $table.html('');
    var html = '<div class="form-horizontal" style="padding:5px">' +
        '<input type="hidden" name="receiving_id" id="receiving_id">' +
        '<input type="hidden" name="is_edited" id="is_edited">' +
        '<input type="hidden" name="receiving_no" id="receiving_no">' +
        '<div class="form-group  ">' +
            '<label class="col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label">RR No.</label>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xs-6">' +
                '<input type="text" name="receiving_no" id="receiving_no" class="form-control input-sm" disabled>' +
            '</div>' +
            '<label style="padding:0;"class=" col-lg-1 col-md-1 col-sm-1 col-xs-4  control-label">Doc No.</label>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-6">' +
                '<input type="text" name="doc_no" id="doc_no" class="form-control input-sm">' +
            '</div>' +
            '<label class="col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label">Doc Date</label>' +
            '<div class=" col-lg-1 col-md-1 col-sm-2 col-xs-6">' +
                '<input type="text" name="doc_date" id="doc_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">' +
            '</div>' +
            '<label class=" col-lg-1 col-md-2 col-sm-1 col-xs-4 control-label">Status</label>' +
            '<div class=" col-lg-1 col-md-2 col-sm-2 col-xs-6">' +
                '<label class="  col-lg-1 col-md-2 col-sm-2 col-xs-6 control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm">' +
            '</div>' +

        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label">Received By</label>' +
            '<div class=" col-lg-3 col-md-3 col-sm-3 col-xs-6">' +
                '<select name="received_by" id="received_by" class="form-control input-sm"><option value=""></option></select>' +
            '</div>' +
            '<label style="padding:0;" class=" col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label">Received Date</label>' +
            '<div class=" col-lg-1 col-md-1 col-sm-2 col-xs-6">' +
                '<input type="text" name="received_date" id="received_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">' +
                '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
                '<input type="hidden" name="issuance_warehouse_id" id="issuance_warehouse_id">' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<input type="hidden" name="procurement_id" id="procurement_id" class="form-control input-sm">' +
                '<input type="hidden" name="donor" id="donor" class="form-control input-sm">' +
                '<input type="hidden" name="supply_source_id" id="supply_source_id" class="form-control input-sm">' +
            '</div>' +

            '<div id="wrap-proc" class="hide">' +
                '<label class="col-lg-1 col-md-2 col-sm-1 col-xs-4 control-label">P.O #</label>' +
                '<div class=" col-lg-1 col-md-1 col-sm-2 col-xs-6">' +
                    '<select name="procurement_filter" id="procurement_filter" class="form-control input-sm"></select>' +
                '</div>' +
            '</div>' +

        '</div>' +
        
        '<div class="form-group  ">' +

            '<div id="wrap-suppSource" class="hide">' +
                '<label class=" col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label"> Source</label>' +
                '<div class=" col-lg-3 col-md-3 col-sm-3 col-xs-6">' +
                    '<select name="supply_source_filter" id="supply_source_filter" class="form-control input-sm"></select>' +
                '</div>' +
            '</div>' +
            '<label class=" col-lg-1 col-md-2 col-sm-2 col-xs-4 control-label">Remarks</label>' +
            '<div class=" col-lg-3 col-md-4 col-sm-5 col-xs-6">' +
                 '<textarea name="status_remarks" id="status_remarks" class="form-control input-sm" ></textarea>' +
                 '<input type="hidden" name="receiving_type" id="receiving_type" value="'+ g_tab_name +'" >' +
                 '<input type="hidden" name="page_process_action_id" id="page_process_action_id">' +
            '</div>' +
        '</div>' +

        '</div>';
    
    $table.append(html);
    fixTextAreaEvent();
}

function fixTextAreaEvent(){
    var insertAt=function(value, index, string) { 
        return value.substr(0, index) + string + value.substr(index);
    };
    
    $('textarea').keypress(function(e){
        if (e.keyCode == 13) {
            var startPos = this.selectionStart;
            this.value  = insertAt(this.value,startPos,"\r\n");
            this.selectionEnd =startPos + 1;
        }
    });
    
    //Set current date to Doc Date and Received Date
    $("#doc_date").val(g_today_date.toShortDate());
    $("#received_date").val(g_today_date.toShortDate());
    
    $("select, input").on("keyup change", function(){
        $("#tblModalIssuanceHeader").find("#is_edited").val("Y");
    });
}
// Build the receiving details form.
function buildReceivingDetails(callback) {
    var _dataRows = [];
    var rowCount = 0;
    
    _dataRows.push(
        {text   : " "                   , width:25,                         style : "text-align:center;", 
                onRender:  function(d){ 
                    rowCount++;
                    return    bs({name:"receiving_detail_id",type:"hidden", value: svn(d,"receiving_detail_id")})
                            + bs({name:"is_edited",type:"hidden"})
                            + bs({name:"balance_quantity",type:"hidden"})
                            + bs({name:"procurement_detail_id",type:"hidden", value: svn(d,"procurement_detail_id")})
                            + bs({name:"receiving_id",type:"hidden", value: svn(d,"receiving_id")})
                            + bs({name:"item_code_id",type:"hidden", value: svn(d,"item_code_id")})
                            + (d ? rowCount : "");
                }
        }
    );
    
    if(g_tab_name==="AIRCRAFT"){
        _dataRows.push(
             {text  : "Part No."           , width : 150       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='part_no'>" + svn(d,"part_no") + "</span>"
                }
            }
            ,{text  : "Nat'l Stock No."    , width : 150       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='national_stock_no'>" + svn(d,"national_stock_no") + "</span>"
                }
            }
            
            ,{text  : "Nomenclature"       , width : 400       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='item_name'>" + svn(d,"item_name") + "</span>"
                }
            }
            

            ,{text  : "Serial No."           , width : 150                        , style : "text-align:left;",
                onRender:  function(d){
                    return    bs({name:"serial_no",type:"input", value: svn (d,"serial_no")})
                            + bs({name:"manufacturer_id",type:"hidden"})
                            + bs({name:"unit_of_measure_id",type:"hidden"})
                            + bs({name:"quantity",type:"hidden", value: 1 })
                            + bs({name:"item_class_id",type:"hidden"})
                            + bs({name:"time_since_new",type:"hidden"})
                            + bs({name:"time_since_overhaul",type:"hidden"});
                }
            }
            
            ,{text  : "Status"      , name:"status_id"       ,type:"select"     , width : 150         , style : "text-align:left;" }
            ,{text  : "Remarks"     , name:"remarks"        ,type:"input"       , width : 400         , style : "text-align:left;" }
        );
    }else{
        _dataRows.push(
             {text  : "Part No."           , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."    , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nomenclature"       , name  : "item_name"                , type  : "input"       , width : 400       , style : "text-align:left;"}

            ,{text  : "Serial No."          , width : 150       , style : "text-align:left;"
    	        ,onRender : function(d){
    	            return "<input name='serial_no' id='serial_no' class='form-control' readonly>";
    	        }
        	 }
            ,{text  : "Manufacturer"        , name  : "manufacturer_id"          , type  : "select"      , width : 150       , style : "text-align:left;"} 
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Quantity"            , width : 100                       , style : "text-align:right;"
    	        ,onRender: function(d){
    	             return bs({ name  : "quantity" ,style : "text-align:right;" ,value : svn(d,"quantity") ,class : "numeric" });
    	        } 
    	    } 
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"       , width : 150       , style : "text-align:left;"}
            /*,{text  : "Status"              , name  : "status_id"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Remarks"             , width : 260       , style : "text-align:left;"
                ,onRender : function(d){
    	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to SERVICEABLE = 23 
    	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
    	        }
            }*/
        );
        
        if(g_tab_name==="PROCUREMENT"){
            _dataRows.push(
                {text  : "Remarks"              , width : 400       , style : "text-align:left;"
                    ,onRender : function(d){
        	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to SERVICEABLE = 23 
        	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
        	        }
                });
        }
        if(g_tab_name==="DONATION"){
            _dataRows.push(
                {text  : "Status"              , name  : "status_id"                , type  : "select"      , width : 150       , style : "text-align:left;"}
                ,{text  : "Remarks"            , name  : "remarks"                  , type  : "input"       , width : 400       , style : "text-align:left;"});
        }
    }
    
    $("#tblModalReceivingDetails").dataBind({
        url: procURL + "receiving_details_sel"
        ,width:  $(document).width() - 170
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: _dataRows
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='manufacturer_id']").dataBind("manufacturer");
            $("select[name='item_class_id']").dataBind("item_class");
            $("select[name='status_id']").dataBind({
                url: execURL + "statuses_sel @is_item='Y'"
                ,text: "status_name"
                ,value: "status_id"
            });
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
                else
                    $("#tblModalReceivingHeader").find("#is_edited").val("Y");
            });
            
            $("#tblModalReceivingDetails").find(".zRow").click(function(e){
                if($(this).find("#serial_no").hasClass("with-serial")){
                }else{
                    $("input[name='serial_no']").each(function(){
                        if($(this).hasClass("with-serial")){
                            $(this).focus().addClass('border-required');
                            alert("Please select serial no.");
                        }
                    });
                }
            });
            
            $("input[name='part_no'], input[name='national_stock_no'], input[name='item_name']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                if($.trim(this.value)===""){
                    $zRow.find("input, select").val('');
                }
            });
            
            $("[name='serial_no']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                var stock_qty = $zRow.find("input[name='quantity']").val();
                if(this.value){
                    $zRow.find("#quantity").val(1);
                }else{
                    $zRow.find("#quantity").val('');
                }
            });            
            if(g_tab_name=== "AIRCRAFT"){
                searchSerial();
            }
            setSearchMulti();
            setMandatoryEntries();
            zsi.initInputTypesAndFormats();
            if (callback) callback();
        }  
    });
}

// Build the receiving buttons.
function buildReceivingButtons(callBack) {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=70,@doc_id=" + $("#receiving_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            if(!g_receiving_id || g_receiving_id===null){
                $("#status_name").text(d.rows[0].status_name);   
            }
            $(".added-button").remove();
            $("#receiving-footer").append(html);
        }
        if(callBack) callBack();
    });
}

function setProcurementOptions(id, callBack){
    $("#procurement_id").val("");
    $("#procurement_filter").clearSelect();
    if(id){
        $("#procurement_filter").attr("selectedvalue", id);
        $("#procurement_filter").dataBind({
            url: execURL + "dd_procurement_sel @dealer_id=" + id
            ,text: "po_code"
            ,value: "procurement_id"
            ,selectedValue: id
            ,onComplete: function(){
                $("#procurement_filter").change(function(){
                    g_procurement_id = (this.value ? this.value : null);
                    $("#procurement_id").val(this.value);
                    setSearchMulti();
                });
            }
        });
    }
    if(callBack) callBack();
}

// Add a click event for the Procurement delivery button.
$("#pdBtnNew").click(function () {
    g_receiving_id = null;
    $("#modalReceiving .modal-title").html('Items Delivered to' + ' » ' +  g_organization_name + g_location_name + ' from <select name="dealer_filter" id="dealer_filter"></select>');
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    clearEntries();
    $("select[name='dealer_filter']").dataBind("dealer");
    $("select[name='dealer_filter']").change(function(){
        $("#dealer_id").val(this.value);
        setProcurementOptions(this.value);
    });
    buildReceiving($("#tblModalReceivingHeader"));
    
    $("#wrap-proc").removeClass("hide");
    $("#wrap-suppSource").removeClass("hide");
});

// Add a click event for the donation delivery button.
$("#ddBtnNew").click(function () {
    g_receiving_id = null;
    $("#modalReceiving .modal-title").html('Items Delivered to' + ' » ' +  g_organization_name + g_location_name + ' from <input name="donor_filter" id="donor_filter">');
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    clearEntries();
    $("input[name='donor_filter']").focusout(function(){
        $("#donor").val(this.value);
    });
    buildReceiving($("#tblModalReceivingHeader"));
    $("#wrap-suppSource").removeClass("hide");
});

// Add a click event for the aircraft delivery button.
$("#adBtnNew").click(function () {
    $("#modalReceiving .modal-title").html('Items Delivered to' + ' » ' +  g_organization_name + g_location_name + ' from <select name="aircraft_filter" id="aircraft_filter"></select>');
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    clearEntries();
    $("select[name='aircraft_filter']").dataBind({ 
        url: procURL + "dd_aircrafts_sel @squadron_id=" + g_organization_id
        ,text: "aircraft_name"
        ,value: "aircraft_info_id"
    });
    $("select[name='aircraft_filter']").change(function(){
        $("#aircraft_id").val(this.value);
    });
    buildReceiving($("#tblModalReceivingHeader"));
});

function validateWithSerial(){
    var $withSerial = $("#tblModalReceivingDetails").find("input.with-serial");
    
    if($withSerial.length > 0){
        $withSerial.addClass('border-required');
        return false;
    }else{
        return true;
    }
}

// Save the new receiving entry.
function Save(status_id, page_process_action_id) {
    
    if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION"){
        
        if(validateWithSerial()!==true){
            alert("Please enter serial no.");
            return false;
        }
    }
    if( zsi.form.checkMandatory()!==true) return false;
    var result = confirm("Entries will be saved. Continue?");
    if (result) {
        $("#tblModalReceivingHeader").find("#is_edited").val("Y");
        $("#tblModalReceivingHeader").find("#status_id").val(status_id);
        $("#tblModalReceivingHeader").find("#page_process_action_id").val(page_process_action_id);
        $("#tblModalReceivingHeader").jsonSubmit({
            procedure: "receiving_upd"
            ,notInclude: "#procurement_filter, #supply_source_filter"
            , onComplete: function (data) {
                if (data.isSuccess === true) { 
                    var _receiving_id = (data.returnValue==0 ? g_receiving_id : data.returnValue);
                    $("#tblModalReceivingDetails input[name='receiving_id']").val(_receiving_id);
                    //Saving of details.
                    SaveDetails(status_id);
                } else {
                    console.log(data.errMsg);
                }
            }
        });
    }
}

// Save the new receiving details entry.
function SaveDetails(status_id) {
    $("#tblModalReceivingDetails").jsonSubmit({
        procedure: "receiving_details_upd"
        , notInclude: "#item_search,#part_no,#national_stock_no,#item_name,#balance_quantity"
        , optionalItems: ["receiving_id","status_id","is_edited"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                setStatusName(status_id);
                clearEntries();
                
            } else {
                console.log(data.errMsg);
            }
            $("#modalReceiving").modal('hide');
            
            if(g_tab_name==="PROCUREMENT"){
                 displayProcurement(g_tab_name);   
            }
            if(g_tab_name==="DONATION"){
                 displayDonation(g_tab_name);   
            }
            else if(g_tab_name==="AIRCRAFT"){
                 displayAircraft(g_tab_name);   
            }
            else if(g_tab_name==="WAREHOUSE"){
                 displayWarehouse(g_tab_name);   
            }
            else if(g_tab_name==="MAINTENANCE"){
                 displayMaintenance(g_tab_name);   
            }
            else if(g_tab_name==="DIRECTIVE"){
                 displayDirective(g_tab_name);   
            }
        }
    });
}

function DeleteDetails(){
    zsi.form.deleteData({
         code       : "ref-0046"
        ,onComplete : function(data){
            loadReceivingDetails(g_receiving_id);
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

// Show the modal window for updating.
function showModalUpdateReceiving(delivery_type, receiving_id, receiving_no, id, donor) {
    var html = '';
    g_receiving_id = receiving_id;
    if (delivery_type == DeliveryType.Procurement) {
        $("#modalReceiving .modal-title").html('Items Delivered to ' +  g_organization_name + g_location_name + ' from <select name="dealer_filter" id="dealer_filter"></select>');
        
        $("select[name='dealer_filter']").attr("selectedvalue", id);
        $("select[name='dealer_filter']").dataBind({url: base_url + "selectoption/code/dealer"});
        $("select[name='dealer_filter']").change(function(){
            $("#dealer_id").val(this.value);
        });
    }
    
    if (delivery_type == DeliveryType.Donation) {
        $("#modalReceiving .modal-title").html('Items Delivered to' + ' » ' +  g_organization_name + g_location_name + ' from <input name="donor_filter" id="donor_filter">');
        $("input[name='donor_filter']").val(donor);
        $("input[name='donor_filter']").focusout(function(){
           $("#donor").val(this.value);
        });
    }
    
    if (delivery_type == DeliveryType.Warehouse) {
        $("#modalReceiving .modal-title").html("Items Transferred to " + g_organization_name + g_location_name + " from " +  id);
        $("#issuance_warehouse_id").val(id);
    }
    
    if (delivery_type == DeliveryType.Aircraft) {
        $("#modalReceiving .modal-title").html("Items Delivered to " + g_organization_name + g_location_name + ' from <select name="aircraft_filter" id="aircraft_filter"></select>');
        $("select[name='aircraft_filter']").attr("selectedvalue", id);
        
       // $("select[name='aircraft_filter']").dataBind({ url: base_url +  "selectoption/code/aircraft_info" });
        $("select[name='aircraft_filter']").dataBind({ 
            url: procURL + "dd_aircrafts_sel @squadron_id=" + g_organization_id
            ,text: "aircraft_name"
            ,value: "aircraft_info_id"
            ,onComplete : function(){
                 $("#aircraft_id").val(id);
            }
        });
        
        $("select[name='aircraft_filter']").change(function(){
            $("#aircraft_id").val(this.value);
        });
    }

    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceivingHeader($("#tblModalReceivingHeader"));
    $("#receiving_id").val(receiving_id);

    if(delivery_type == DeliveryType.Procurement){
        setProcurementOptions(id);
        $("#wrap-proc").removeClass("hide");
        $("#wrap-suppSource").removeClass("hide");
    }else if(delivery_type == DeliveryType.Donation){
        $("#wrap-suppSource").removeClass("hide");
    }
 
    initDatePicker();
    initSelectOptions(function(){
        $.get(procURL + "receiving_sel @receiving_id=" + receiving_id + "&@tab_name=" + g_tab_name, function(d) {
            if (d.rows !== null) {
                g_procurement_id = d.rows[0].procurement_id;
                
                $("#tblModalReceivingHeader #receiving_no").val(d.rows[0].receiving_no);
                $("#tblModalReceivingHeader #doc_no").val(d.rows[0].doc_no);
                $("#tblModalReceivingHeader #doc_date").val(d.rows[0].doc_date.toDateFormat());
                $("#tblModalReceivingHeader #status_name").html(d.rows[0].status_name);
                $("#tblModalReceivingHeader #issuance_warehouse_id").val(d.rows[0].issuance_warehouse_id);
                $("#tblModalReceivingHeader #received_by").val(d.rows[0].received_by);
                $("#tblModalReceivingHeader #received_date").val(d.rows[0].received_date.toDateFormat());
                $("#tblModalReceivingHeader #dealer_id").val(d.rows[0].dealer_id);
                $("#tblModalReceivingHeader #status_remarks").val(d.rows[0].status_remarks);
                $("#tblModalReceivingHeader #procurement_id").val(d.rows[0].procurement_id);
                $("#tblModalReceivingHeader #donor").val(d.rows[0].donor);
                $("#tblModalReceivingHeader #supply_source_id").val(d.rows[0].supply_source_id);
                $("#tblModalReceivingHeader #supply_source_filter").attr("selectedvalue", d.rows[0].supply_source_id);
                $("#tblModalReceivingHeader #procurement_filter").val(d.rows[0].procurement_id);
                
                buildReceivingButtons(function(){
                    getStatuses(d.rows[0].status_name, function(){
                        loadReceivingDetails(receiving_id);
                    });
                });
            }
        });
    });
}

// Load the values for the receiving details.
function loadReceivingDetails(receiving_id) {
    var cb = bs({name:"cbFilter2",type:"checkbox"});
    var _dataRows = [];
    var rowCount = 0;
    
    _dataRows.push(
        {text   : cb   , width:25, style : "text-align:center;", 
            onRender:  function(d){ 
                rowCount++;
                return    bs({name:"receiving_detail_id",type:"hidden", value: svn (d,"receiving_detail_id")})
                        + bs({name:"is_edited",type:"hidden"})
                        + bs({name:"balance_quantity",type:"hidden", value: svn (d,"balance_quantity")})
                        + bs({name:"procurement_detail_id",type:"hidden", value: svn(d,"procurement_detail_id")})
                        + bs({name:"receiving_id",type:"hidden", value: receiving_id})
                        + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")})
                        + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
            }
        }
        ,{text   : " "   , width:25, style : "text-align:center;", 
            onRender:  function(d){ 
                return  (d ? rowCount : "");
            }
        }
    );
    
    if(g_tab_name!=="AIRCRAFT"){
        _dataRows.push(
            {text   : "Sub-Category"   , width:98, style : "text-align:center;", 
                onRender : function(d){ 
                    return "<a href='javascript:showModalSubCategory(\""
                    + svn(d,"part_no") + "\","
                    + svn(d,"receiving_detail_id") + ");'>" 
                    + svn(d,"countSubCat") + " </a>";
                }
            }
        );
    }
    

    if(g_tab_name==="AIRCRAFT"){
        _dataRows.push(
             {text  : "Part No."           , width : 150       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='part_no'>" + svn(d,"part_no") + "</span>"
                }
            }
            ,{text  : "Nat'l Stock No."    , width : 150       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='national_stock_no'>" + svn(d,"national_stock_no") + "</span>"
                }
            }
            
            ,{text  : "Nomenclature"       , width : 400       , style : "text-align:left;"
                ,onRender: function(d){
                    return "<span id='item_name'>" + svn(d,"item_name") + "</span>"
                }
            }

            ,{text  : "Serial No."           , width : 150                        , style : "text-align:left;",
                onRender:  function(d){
                    return    bs({name:"serial_no",type:"input", value: svn (d,"serial_no")})
                            + bs({name:"manufacturer_id",type:"hidden"})
                            + bs({name:"unit_of_measure_id",type:"hidden"})
                            + bs({name:"quantity",type:"hidden", value: 1 })
                            + bs({name:"item_class_id",type:"hidden"})
                            + bs({name:"time_since_new",type:"hidden"})
                            + bs({name:"time_since_overhaul",type:"hidden"})
                }
            }
            ,{text  : "Status"      , name:"status_id"      ,type:"select"       , width : 150         , style : "text-align:left;" }
            ,{text  : "Remarks"     , name:"remarks"        ,type:"input"        , width : 400         , style : "text-align:left;" }
        );
    }else{
        _dataRows.push(
             {text  : "Part No."           , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."    , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nomenclature"       , name  : "item_name"                , type  : "input"       , width : 400       , style : "text-align:left;"}
            ,{text  : "Serial No."          , width : 150       , style : "text-align:left;"
    	        ,onRender : function(d){
    	            return "<input type='text' name='serial_no' id='serial_no' class='form-control' value='"+ svn (d,"serial_no") +"'" +(svn(d,"with_serial")!=="Y" ? 'readonly': "")+ ">";
    	        }
        	 }
            ,{text  : "Manufacturer"        , name  : "manufacturer_id"          , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Quantity"            , width : 90                    , style : "text-align:right;"
    	        ,onRender: function(d){
    	             return '<input name="quantity" id="quantity" type="text" class="form-control numeric" value="'+ svn(d,"quantity") +'" ids="'+svn(d,"item_code_id")+'" style="text-align:right;">';
    	        } 
    	    }
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"       , width : 150       , style : "text-align:left;"}
            /*,{text  : "Remarks"             , width : 260       , style : "text-align:left;"
                ,onRender : function(d){
    	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to GOOD = 23 
    	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
    	        }
            }*/
        );
        
        if(g_tab_name==="PROCUREMENT"){
            _dataRows.push(
                {text  : "Remarks"              , width : 400       , style : "text-align:left;"
                    ,onRender : function(d){
        	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to SERVICEABLE = 23 
        	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
        	        }
                });
        } else {
            _dataRows.push(
                {text  : "Status"              , name  : "status_id"                , type  : "select"      , width : 150       , style : "text-align:left;"}
                ,{text  : "Remarks"            , name  : "remarks"                  , type  : "input"       , width : 400       , style : "text-align:left;"});
        }
    }
    
    $("#tblModalReceivingDetails").dataBind({
        url: procURL + "receiving_details_sel @receiving_id=" + receiving_id
        ,width:  $(document).width() - 170
        ,height: 200
        ,blankRowsLimit: (g_statuses.is_add==="Y" ? (g_tab_name!=="WAREHOUSE" && g_tab_name!=="DIRECTIVE" ? 10 : 0) : 0)
        ,isPaging: false
        ,dataRows: _dataRows
        ,onComplete: function(){
            _validateQuantity();
            $("#cbFilter2").setCheckEvent("#tblModalReceivingDetails input[name='cb']");
            if(g_tab_name==="WAREHOUSE"){
                $("#tblModalReceivingDetails").find("#table").addClass("warehouse-editable");
            }
            
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='manufacturer_id']").dataBind("manufacturer");
            $("select[name='item_class_id']").dataBind("item_class");
            $("select[name='status_id']").dataBind({
                url: execURL + "statuses_sel @is_item='Y'"
                ,text: "status_name"
                ,value: "status_id"
                ,onComplete: function(){
                    if(g_tab_name==="WAREHOUSE" || g_tab_name==="DIRECTIVE"){
                        $("select[name='status_id']").parent().addClass("disabled");
                    }
                }
            });
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                    
                }
                else
                    $("#tblModalReceivingHeader").find("#is_edited").val("Y");
            });
            
            $("#tblModalReceivingDetails").find(".zRow").click(function(e){
                if($(this).find("#serial_no").hasClass("with-serial")){
                }else{
                    $("input[name='serial_no']").each(function(){
                        if($(this).hasClass("with-serial")){
                            $(this).focus().addClass('border-required');
                            alert("Please select serial no.");
                        }
                    });
                }
            });
            if(g_tab_name=== "AIRCRAFT"){
                searchSerial();
            }
           
            setSearchMulti();
            setMandatoryEntries();
            zsi.initInputTypesAndFormats();
        }  
    });
}

function showModalSubCategory(part_no, receiving_detail_id){
    $("#modalSubCategory .modal-title").html("Sub-category  » " + part_no);
    $("#modalSubCategory").modal({ show: true, keyboard: false, backdrop: 'static' });
    
    displaySubCategoryGrid(receiving_detail_id);
}

function displaySubCategoryGrid(receiving_detail_id) {
    var rowCount = 0;
    var _dataRows = [
        {text   : " "                   , width:25                          , style : "text-align:center;", 
            onRender:  function(d){ 
                rowCount++;
                return    bs({name:"receiving_detail_id",type:"hidden", value: receiving_detail_id})
                        + bs({name:"is_edited",type:"hidden"})
                        + bs({name:"procurement_detail_id",type:"hidden", value: svn(d,"procurement_detail_id")})
                        + bs({name:"receiving_id",type:"hidden", value: svn(d,"receiving_id")})
                        + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")})
                        + (d ? rowCount : "");
            }
        }
        ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nomenclature"        , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Serial No."          , name  : "serial_no"                , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Manufacturer"        , name  : "manufacturer_id"          , type  : "select"      , width : 150       , style : "text-align:left;"}
        ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
        ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
        ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
        ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 260       , style : "text-align:left;"}
    ];
        
    $("#tblSubCategory").dataBind({
        url: procURL + "receiving_details_sel @receiving_id=" + receiving_detail_id
        ,width:  $(document).width() - 208
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: _dataRows
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='manufacturer_id']").dataBind("manufacturer");
            $("select[name='item_class_id']").dataBind("item_class");
            
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
            });
            setSearchMulti();
        }  
    });
}

// Save the sub-cateogry entry.
function SaveSubCategory(e) {
    /*$("#tblSubCategory").jsonSubmit({
        procedure: "receiving_details_upd"
        , notInclude: "#item_search,#part_no,#national_stock_no,#item_name"
        , optionalItems: ["receiving_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
            } else {
                console.log(data.errMsg);
            }
            $("#modalSubCategory").modal('toggle');
        }
    });*/
}

function searchSerial(){
    new zsi.search({
        tableCode: "ref-0036"
        ,colNames : ["serial_no","part_no","national_stock_no","item_name","item_code_id","unit_of_measure_id" ] 
        ,displayNames : ["Serial"]  
        ,searchColumn :"serial_no"
        ,input:"input[name=serial_no]"
        ,url : execURL + "searchData"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.serial_no;
            var $zRow = $(currentObject).closest(".zRow");
            $zRow.find("#part_no").html(data.part_no);
            $zRow.find("#national_stock_no").html(data.national_stock_no);
            $zRow.find("#item_name").html(data.item_name);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
        }
    });        
}


function setSearchMulti(){
    var selCode = "items_on_arcraft_serials";
    var _tableCode = "";
    var _condition = "''";
    var _colname = "";

    if(g_tab_name==="PROCUREMENT"){
        _tableCode = "ref-0031"
        _colname = ["part_no","national_stock_no","item_name","item_code_id","procurement_detail_id","balance_quantity","unit_of_measure_id","with_serial"]
        _condition = "'"+ (g_procurement_id ? "procurement_id="+ g_procurement_id : "")  +"'";
    }
    else if(g_tab_name==="DONATION"){
        _tableCode = "ref-0023"
        _colname = ["part_no","national_stock_no","item_name","item_code_id","unit_of_measure_id","with_serial"]
    }
    else {
        _tableCode = "ref-0036"
        _colname = ["part_no","national_stock_no","item_name","item_code_id","unit_of_measure_id","with_serial","balance_quantity"] 
    }
    
    if(g_tab_name==="AIRCRAFT"){
        $("select[name='serial_no']").dataBind(selCode);
        $("input[name='item_code_id']").each(function(){
            if(this.value){
                var $row = $(this).closest(".zRow");
                    $row.find("#serial_no").dataBind(selCode +", 'item_code_id="+ this.value +"'");
            } 
        });
    }
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: _colname 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , condition : _condition
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            var $zRow = $(currentObject).closest(".zRow");
            $zRow.find("#serial_no").val('').prop('readonly',(data.with_serial==='Y' ? false : true));
            $zRow.find("#procurement_detail_id").val(data.procurement_detail_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
            //$zRow.find("#quantity").val( data.balance_quantity).attr("ids", data.item_code_id);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION"){
                checkSerialExist(data.item_code_id, data, $zRow);
                
                if(g_tab_name==="PROCUREMENT"){
                    $zRow.find("#balance_quantity").val(data.balance_quantity);
                    validateQuantity($zRow, data);
                }
            }
        }
    });

    new zsi.search({
        tableCode: _tableCode
        , colNames: _colname
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , condition : _condition
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            var $zRow = $(currentObject).closest(".zRow");
            $zRow.find("#serial_no").val('').prop('readonly',(data.with_serial==='Y' ? false : true));
            $zRow.find("#procurement_detail_id").val(data.procurement_detail_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
            //$zRow.find("#quantity").val(data.balance_quantity);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION"){
                checkSerialExist(data.item_code_id, data, $zRow);
                
                if(g_tab_name==="PROCUREMENT"){
                    $zRow.find("#balance_quantity").val(data.balance_quantity);
                    validateQuantity($zRow, data);
                }
            }
        }
    });
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: _colname 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , condition : _condition
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            var $zRow = $(currentObject).closest(".zRow");
            $zRow.find("#serial_no").val('').prop('readonly',(data.with_serial==='Y' ? false : true));
            $zRow.find("#procurement_detail_id").val(data.procurement_detail_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            //$zRow.find("#quantity").val(data.balance_quantity);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION"){
                checkSerialExist(data.item_code_id, data, $zRow);
                
                if(g_tab_name==="PROCUREMENT"){
                    $zRow.find("#balance_quantity").val(data.balance_quantity);
                    validateQuantity($zRow, data);
                }
            }
        }
    });
}

function _validateQuantity(){
    $("input[name='quantity']").unbind();
    $("input[name='quantity']").keyup(function(){
        var $zRow = $(this).closest(".zRow");
        var _balanceQty = parseInt($.trim($zRow.find("#balance_quantity").val()));
        var _itemCodeId = $(this).attr("ids");
        var _countQty = 0;

        $("input[ids='"+ _itemCodeId +"']").each(function(){
            if($.trim(this.value)!=="" && $.trim(this.value)!==null){
                _countQty += parseInt(this.value);
            }
        });
        
        if(_countQty > _balanceQty){
            alert("The value you enter is already exceeds its total quantity "+ _balanceQty);
        }
    });
}

function validateQuantity(row, data){
    var d = data;
    var countQty = 0;
    var balanceQty = parseInt($.trim(d.balance_quantity));
    var itemCodeId = d.item_code_id;
    var $quantity = row.find("#quantity");
    
    $("input[ids='"+ itemCodeId +"']").each(function(){
        if($.trim(this.value)!=="" && $.trim(this.value)!==null){
            countQty += parseInt(this.value);
        }
    });
    
    if(countQty < balanceQty){
        var remainingQty = balanceQty - countQty;
        $quantity.val(remainingQty).attr("ids", itemCodeId);
    }
    
    if(countQty === balanceQty){
        var hasIds = $quantity.attr("ids"); 
        if(hasIds!=="" && hasIds!==null){
            //$quantity.val($quantity.val());
        }else{
            alert("This item already exceeds its total quantity. Please select another item");
            row.find("input, select, input:hidden").val('');
        }
    }
    
    _validateQuantity();
}

function setSearchSerial(id, row, code){
    var aircraft_info_id = $("#aircraft_filter").val();
        row.find("#serial_no").dataBind({
            url: execURL + "items_sel @item_code_id='" + id + "'" + (g_tab_name==="AIRCRAFT" ? ",@aircraft_info_id='" + aircraft_info_id + "'" : "") 
            , text: "serial_no"
            , value: "serial_no"
        });
 }

function checkSerialExist(id, d, row){
    var $serial_no = row.find("input[name='serial_no']");
    $.get(execURL + "items_sel @item_code_id=" + id, function(data){
        var tempSerials = [];
        var globalTimeout = null;
        if(data.rows.length > 0){
            for(var i=0; i < data.rows.length; i++){
                tempSerials.push(data.rows[i].serial_no);
            }
        }
        
        if(typeof g_serials_arr[row.index()] === 'undefined'){
             g_serials_arr.push(tempSerials);
        }else{
            g_serials_arr[row.index()] = tempSerials;
        }

        $("input[name='serial_no']").unbind();
        if(d.with_serial==="Y"){
            $serial_no.addClass("with-serial");
            $serial_no.removeAttr("readonly");
            $("input[name='serial_no']").on("keyup",function(){
                var rowIndex = $(this).closest(".zRow").index();
                var value = $(this).val();
                if(value && value!==""){
    
                    row.find("input[name='quantity']").val(1);
                    $(this).removeClass('with-serial');
                    $(this).removeClass('border-required');
    
                    if (globalTimeout != null) {
                        clearTimeout(globalTimeout);
                    }
                    globalTimeout = setTimeout(function() {
                    globalTimeout = null;  
                        if(g_serials_arr[rowIndex].indexOf(value) > -1){
                            alert("Serial number already exist. Please enter different serial number");
                        }
                    }, 200); 
                }
                else{
                    $(this).addClass('with-serial');
                    $(this).addClass('border-required');
                }
            });
        }else{
            $serial_no.removeClass("with-serial");
        }      

    });
}

// Set the mandatory fields.
function setMandatoryEntries(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["doc_no","doc_date"]
                ,"type":"M"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" : ["Doc No.","Doc Date"]}
      ]
    });    
}

function displayPDFHeaderDetails(){
    zsi.createPdfReport({
         margin             : { top :20  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,rowHeight          : 14
        ,widthLimit         : 550
        ,pageHeightLimit    : 750
        //,isDisplay          : true
        ,MasterKey          : "receiving_id"
        ,masterColumn       : g_masterColumn
        ,masterData         : g_masterData
        ,detailColumn       : g_detailColumn
        ,detailData         : g_detailData
        ,onPrintHeader      : function(o){
            if (g_imgData) {
                o.doc.addImage(g_imgData, 'JPEG', o.margin.left,  o.row, 50, 50);
            }
            o.row +=27;
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left + 60, o.row, "Philippine Airforce");
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Warehouse Receiving Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14;  
            o.doc.text(25, o.row, "RR No.");   
            o.doc.text(110, o.row, ": "  + o.data.receiving_no);  
            
            o.doc.text(315, o.row, "Doc No.");
            o.doc.text(415, o.row,  ": "  + o.data.doc_no);
            
            //new row
            o.row +=18;  
            o.doc.text(25, o.row, "Received By");  
            o.doc.text(110, o.row, ": "  + o.data.received_by);
            
            o.doc.text(315, o.row, "Doc Date");  
            o.doc.text(415, o.row,  ": "  + o.data.doc_date.toDateFormat());
            
            //new row
            o.row +=18; 
            o.doc.text(25, o.row, "Received Date");
            o.doc.text(110, o.row, ": "  + o.data.received_date.toDateFormat());
            
            o.doc.text(315, o.row, "Remarks");
            o.doc.text(415, o.row,  ": "  + o.data.status_remarks);
            
            return o.row;    
        }
    });                  
}

function PrintToPDF(){
    $.get(procURL + "report_hdr @wing_id=null,@squadron_id=" + g_organization_id +",@warehouse_id="+ g_warehouse_id, function(d) {
        if (d.rows !== null) {
            g_masterColumn   = [   
                 {name:"receiving_no"    ,title:"RR No."       ,titleWidth:100 ,width:50}
                ,{name:"received_by"      ,title:"Received By"      ,titleWidth:100 ,width:80}
                ,{name:"doc_no"            ,title:"Doc No:"    ,titleWidth:100 ,width:100}
                ,{name:"doc_date"       ,title:"Doc Date"          ,titleWidth:100 ,width:100}
                ,{name:"received_date"   ,title:"Received Date"        ,titleWidth:100 ,width:100}
                ,{name:"status_remarks"   ,title:"Remarks"                 ,titleWidth:100 ,width:100}
            ];
            g_masterData = d.rows;
            
            $.get(procURL + "receiving_details_sel @receiving_id=" + g_receiving_id, function(data) {
                var d = data.rows;
                if(d.length > 0){
                    g_detailColumn   = [ 
                        {name:"part_no"       ,title:"Part #"      ,width:80}
                        ,{name:"national_stock_no"   ,title:"NS #"  ,width:100}
                        ,{name:"item_name"   ,title:"Nomenclature"  ,width:130}
                        ,{name:"quantity"   ,title:"Qty."   ,width:50}
                        ,{name:"unit_of_measure"   ,title:"Unit Measure"   ,width:70}
                        ,{name:"item_status"   ,title:"Item Status"   ,width:80}
                    ];
                    g_detailData = data.rows;
                    
                    displayPDFHeaderDetails();
                }
            });
        }
    });
}
    