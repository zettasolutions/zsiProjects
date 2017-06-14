var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var cls =".right .zHeaders .item";
var queDataProcedures;
var g_recieving_id = null;
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
var g_serials_arr = [];
const DeliveryType = {
    Procurement: 'Procurement',
    Donation: 'Donation',
    Warehouse: 'Warehouse',
    Aircraft: 'Aircraft',
    Maintenance: 'Maintenance',
    Directive: 'Directive'
};

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
    , footer: '<div id="receiving-footer" class="pull-left">'
            + '<button type="button" onclick="resetFields(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Reset</button></div>'
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
    $('modalReceiving select').val('');  
    zsi.initDatePicker(); 
}

// Reset the input fields.
function resetFields(obj) {
    var result = confirm("This will clear the items. Continue?");
    if (result) {
        clearEntries();
    }
}

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
            $("#receiving-footer").append('<button type="button" onclick="javascript:void(0); return Delete();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>');
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
            '<label class=" col-xs-1 control-label">RR No.</label>' +
            '<div class=" col-xs-1">' +
                '<input type="text" name="receiving_no" id="receiving_no" class="form-control input-sm" disabled>' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Doc No.</label>' +
            '<div class=" col-xs-1">' +
                '<input type="text" name="doc_no" id="doc_no" class="form-control input-sm">' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Doc Date</label>' +
            '<div class=" col-xs-1">' +
                '<input type="text" name="doc_date" id="doc_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Status</label>' +
            '<div class=" col-xs-1">' +
                '<label class=" col-xs-1 control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' +
            '</div>' +

        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-1 control-label">Received By</label>' +
            '<div class=" col-xs-3">' +
                '<select name="received_by" id="received_by" class="form-control input-sm"><option value=""></option></select>' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Received Date</label>' +
            '<div class=" col-xs-1">' +
                '<input type="text" name="received_date" id="received_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">' +
                '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
                '<input type="hidden" name="issuance_warehouse_id" id="issuance_warehouse_id">' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<input type="hidden" name="procurement_id" id="procurement_id" class="form-control input-sm">' +
                '<input type="hidden" name="donor" id="donor" class="form-control input-sm">' +
                '<input type="hidden" name="supply_source_id" id="supply_source_id" class="form-control input-sm">' +
            '</div>' +

            '<div id="wrap-proc" class="hide">' +
                '<label class="col-xs-1 control-label">P.O #</label>' +
                '<div class=" col-xs-2">' +
                    '<select name="procurement_filter" id="procurement_filter" class="form-control input-sm"></select>' +
                '</div>' +
            '</div>' +

        '</div>' +
        
        '<div class="form-group  ">' +

            '<div id="wrap-suppSource" class="hide">' +
                '<label class=" col-xs-1 control-label"> Source</label>' +
                '<div class=" col-xs-3">' +
                    '<select name="supply_source_filter" id="supply_source_filter" class="form-control input-sm"></select>' +
                '</div>' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Remarks</label>' +
            '<div class=" col-xs-7">' +
                 '<textarea name="status_remarks" id="status_remarks" class="form-control input-sm" ></textarea>' +
                 '<input type="hidden" name="receiving_type" id="receiving_type" value="'+ g_tab_name +'"class="form-control input-sm" >' +
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
                            + bs({name:"procurement_detail_id",type:"hidden", value: svn(d,"procurement_detail_id")})
                            + bs({name:"receiving_id",type:"hidden", value: svn(d,"receiving_id")})
                            + bs({name:"item_code_id",type:"hidden", value: svn(d,"item_code_id")})
                            + (d ? rowCount : "");
                }
        }
        ,{text  : "Part No."           , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nat'l Stock No."    , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nomenclature"       , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
    );
    
    if(g_tab_name==="AIRCRAFT"){
        _dataRows.push(
            {text  : "Serial No."           , width : 150                        , style : "text-align:left;",
                onRender:  function(d){
                    return    bs({name:"serial_no",type:"select", value: svn (d,"serial_no")})
                            + bs({name:"manufacturer_id",type:"hidden"})
                            + bs({name:"unit_of_measure_id",type:"hidden"})
                            + bs({name:"quantity",type:"hidden", value: 1 })
                            + bs({name:"item_class_id",type:"hidden"})
                            + bs({name:"time_since_new",type:"hidden"})
                            + bs({name:"time_since_overhaul",type:"hidden"});
                }
            }
            
            ,{text  : "Status"      , name:"status_id"    ,type:"select"     , width : 150         , style : "text-align:left;" }
            ,{text  : "Remarks"     , name:"remarks"      ,type:"input"      , width : 250         , style : "text-align:left;"}        );
    }else{
        _dataRows.push(
             {text  : "Serial No."          , width : 150       , style : "text-align:left;"
    	        ,onRender : function(d){
    	            return "<input name='serial_no' id='serial_no' class='form-control' readonly>";
    	        }
        	 }
            ,{text  : "Manufacturer"        , name  : "manufacturer_id"          , type  : "select"      , width : 150       , style : "text-align:left;"} 
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Quantity"            , width : 100                    , style : "text-align:right;"
    	        ,onRender: function(d){
    	             return bs({ name  : "quantity" ,style : "text-align:right;" ,value : svn(d,"quantity") ,class : "numeric" });
    	        } 
    	    } 
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"       , width : 150       , style : "text-align:left;"}
            //,{text  : "Status"              , name  : "status_id"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Remarks"             , width : 260       , style : "text-align:left;"
                ,onRender : function(d){
    	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to GOOD = 23 
    	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
    	        }
            }
        );
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
                url: execURL + "statuses_sel "+ (g_tab_name==="AIRCRAFT" ? "@is_returned='Y'" : "")
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
            
            $("[name='serial_no']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                var stock_qty = $zRow.find("input[name='quantity']").val();
                if(this.value){
                    $zRow.find("#quantity").val(1);
                }else{
                    $zRow.find("#quantity").val('');
                }
            });            

            setSearchMulti();
            if (callback) callback();
            zsi.initInputTypesAndFormats();
        }  
    });
}

// Build the receiving buttons.
function buildReceivingButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=70,@doc_id=" + $("#receiving_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            if(!g_recieving_id || g_recieving_id===null){
                $("#status_name").text(d.rows[0].status_name);   
            }
            $(".added-button").remove();
            $("#receiving-footer").append(html);
        }
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
    g_recieving_id = null;
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
    g_recieving_id = null;
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
function Save(page_process_action_id) {
    
    if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION"){
        
        if(validateWithSerial()!==true){
            alert("Please enter serial no.");
            return false;
        }
    }
    var result = confirm("Entries will be saved. Continue?");
    if (result) {
        $("#tblModalReceivingHeader").find("#is_edited").val("Y");
        $("#status_id").val(page_process_action_id);
        $("#tblModalReceivingHeader").jsonSubmit({
            procedure: "receiving_upd"
            ,notInclude: "#procurement_filter, #supply_source_filter"
            , onComplete: function (data) {
                if (data.isSuccess === true) { 
                    var _receiving_id = (data.returnValue==0 ? g_recieving_id : data.returnValue);
                    $("#tblModalReceivingDetails input[name='receiving_id']").val(_receiving_id);
                    //Saving of details.
                    SaveDetails(page_process_action_id);
                } else {
                    console.log(data.errMsg);
                }
            }
        });
    }
}

// Save the new receiving details entry.
function SaveDetails(page_process_action_id) {
    $("#tblModalReceivingDetails").jsonSubmit({
        procedure: "receiving_details_upd"
        , notInclude: "#item_search,#part_no,#national_stock_no,#item_name"
        , optionalItems: ["receiving_id","status_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                setStatusName(page_process_action_id);
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

// Set the label for the status name.
function setStatusName(page_process_action_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + page_process_action_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}

// Show the modal window for updating.
function showModalUpdateReceiving(delivery_type, receiving_id, receiving_no, id, donor) {
    var html = '';
    g_recieving_id = receiving_id;
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
                
                getStatuses(d.rows[0].status_name, function(){
                    loadReceivingDetails(receiving_id);
                    buildReceivingButtons();
                });
            }
        });
    });
}

// Load the values for the receiving details.
function loadReceivingDetails(receiving_id) {
    var _dataRows = [];
    var rowCount = 0;
    
    _dataRows.push(
        {text   : " "   , width:25, style : "text-align:center;", 
            onRender:  function(d){ 
                rowCount++;
                return    bs({name:"receiving_detail_id",type:"hidden", value: svn (d,"receiving_detail_id")})
                        + bs({name:"is_edited",type:"hidden"})
                        + bs({name:"procurement_detail_id",type:"hidden", value: svn(d,"procurement_detail_id")})
                        + bs({name:"receiving_id",type:"hidden", value: receiving_id})
                        + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")})
                        + (d ? rowCount : "");
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
    
    _dataRows.push(
         {text  : "Part No."           , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nat'l Stock No."    , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
        ,{text  : "Nomenclature"       , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
    );
        
    if(g_tab_name==="AIRCRAFT"){
        _dataRows.push(
            {text  : "Serial No."           , width : 150                        , style : "text-align:left;",
                onRender:  function(d){
                    return    bs({name:"serial_no",type:"select", value: svn (d,"serial_no")})
                            + bs({name:"manufacturer_id",type:"hidden"})
                            + bs({name:"unit_of_measure_id",type:"hidden"})
                            + bs({name:"quantity",type:"hidden", value: 1 })
                            + bs({name:"item_class_id",type:"hidden"})
                            + bs({name:"time_since_new",type:"hidden"})
                            + bs({name:"time_since_overhaul",type:"hidden"})
                }
            }
            ,{text  : "Status"      , name:"status_id"    ,type:"select"     , width : 150         , style : "text-align:left;" }
            ,{text  : "Remarks"     , name:"remarks"      ,type:"input"      , width : 250         , style : "text-align:left;"}
        );
    }else{
        _dataRows.push(
             {text  : "Serial No."          , width : 150       , style : "text-align:left;"
    	        ,onRender : function(d){
    	            return "<input type='text' name='serial_no' id='serial_no' class='form-control' value='"+ svn (d,"serial_no") +"'" +(svn(d,"with_serial")!=="Y" ? 'readonly': "")+ ">";
    	        }
        	 }
            ,{text  : "Manufacturer"        , name  : "manufacturer_id"          , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
    	    ,{text  : "Quantity"            , width : 90                    , style : "text-align:right;"
    	        ,onRender: function(d){
    	             return bs({ name  : "quantity" ,style : "text-align:right;" ,value : svn(d,"quantity") ,class : "numeric" });
    	        } 
    	    }
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Remarks"             , width : 260       , style : "text-align:left;"
                ,onRender : function(d){
    	            return bs({name:"status_id",type:"hidden", value: 23}) //set status id to GOOD = 23 
    	                 + bs({name:"remarks",type:"input", value: svn (d,"remarks")});
    	        }
            }
        );
    }
    
    $("#tblModalReceivingDetails").dataBind({
        url: procURL + "receiving_details_sel @receiving_id=" + receiving_id
        ,width:  $(document).width() - 170
        ,height: 200
        ,blankRowsLimit: (g_statuses.is_add==="Y" ? 10 : 0)
        ,isPaging: false
        ,dataRows: _dataRows
        ,onComplete: function(){
            if(g_tab_name==="WAREHOUSE"){
                $("#tblModalReceivingDetails").find("#table").addClass("warehouse-editable");
            }
            
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='manufacturer_id']").dataBind("manufacturer");
            $("select[name='item_class_id']").dataBind("item_class");
            $("select[name='status_id']").dataBind({
                url: execURL + "statuses_sel "+ (g_tab_name==="AIRCRAFT" ? "@is_returned='Y'" : "")
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
            setMandatoryEntries();
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
            $zRow.find("#quantity").val( data.balance_quantity);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION")
                checkSerialExist(data.item_code_id, data, $zRow);
                
           
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
            $zRow.find("#quantity").val(data.balance_quantity);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION")
                checkSerialExist(data.item_code_id, data, $zRow);
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
            $zRow.find("#quantity").val(data.balance_quantity);
            $zRow.find("#unit_of_measure_id").val(data.unit_of_measure_id);
            
            if(g_tab_name!=="PROCUREMENT")
                setSearchSerial(data.item_code_id, $zRow, selCode);
                
            if(g_tab_name==="PROCUREMENT" || g_tab_name==="DONATION")
                checkSerialExist(data.item_code_id, data, $zRow);
        }
    });
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
                                                                                                                       