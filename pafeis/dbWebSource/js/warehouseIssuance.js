var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var g_receiving_id;
var cls =".right .zHeaders .item";
var queDataProcedures;
var g_organization_id;
var g_organization_name;
var g_tab_name = "AIRCRAFT";

const IssuanceType = {
    Aircraft: 'Aircraft',
    Transfer: 'Transfer',
    Repair: 'Repair',
    Overhaul: 'Overhaul'
};

zsi.ready(function(){
    $("#aircraft-tab").click(function(){
        g_tab_name = "AIRCRAFT";
    });
    $("#transfer-tab").click(function() {
        g_tab_name = "TRANSFER";
    });
    $("#repair-tab").click(function() {
        g_tab_name = "REPAIR";
    });
    $("#overhaul-tab").click(function() {
        g_tab_name = "OVERHAUL";
    });
    
    getTemplate();
    setCurrentTab();
    displayAircraft(g_tab_name);
    
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
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            $(".pageTitle").append(' for ' + g_organization_name);
            
        }
    });
                

    $("#aircraft-tab").click(function () {
        displayAircraft($(this).html());    
    });
    $("#transfer-tab").click(function () {
        displayTransfer($(this).html());    
    });
    $("#repair-tab").click(function () {
        displayRepair($(this).html());    
    });
    $("#overhaul-tab").click(function () {
        displayOverhaul($(this).html());    
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
    , body: '<div id="tblModalIssuanceHeader" class="zGrid header"></div><br/><div><h4>Details</h4></div><div id="tblModalIssuanceDetails" class="zGrid detail"></div>'
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
    $('input[id*=date]').datepicker();
}

// Initialize the values for the select options.
function initSelectOptions(callbackFunc){
    $("#tblModalIssuanceHeader #issued_by").dataBind({
        url: base_url +  "selectoption/code/employees_fullnames_v"
        , onComplete : function(){
            $("#tblModalIssuanceHeader #aircraft_id").dataBind({
                url: base_url +  "selectoption/code/aircraft_info"
                , onComplete : function(){
                    $("#tblModalIssuanceHeader #issuance_directive_id").dataBind({
                        url: base_url +  "selectoption/code/issuance_directive"
                        , onComplete : function(){
                            $("#tblModalIssuanceHeader #transfer_organization_id").dataBind({
                                url: base_url +  "selectoption/code/organization"
                                , onComplete : function(){
                                    if(callbackFunc) callbackFunc();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// Get the template for the initialization of the modal windows.
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalIssuance));
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
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by_name"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by_name"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 180       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Aircraft"       , name  : "aircraft_name"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"aircraft_name"); }
            }
            ,{text  : "Status"       , name  : "status_name"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_name"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
        ]   
    });    
}

// Display the grid for the transfer issuance.
function displayTransfer(tab_name){
    $("#gridTransfer").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Transfer + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_organization_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_organization_id"); }
            }
        ]   
    });    
}

// Display the grid for the repair issuance.
function displayRepair(tab_name){
    $("#gridRepair").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Repair + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_organization_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_organization_id"); }
            }
        ]   
    });
}

// Display the grid for the overhaul issuance.
function displayOverhaul(tab_name){
    $("#gridOverhaul").dataBind({
         url            : procURL + "issuances_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text  : "Issuance No."             , name  : "issuance_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                ,onRender : function(d){ 
                    return "<a href='javascript:showModalUpdateIssuance(\""
                    + IssuanceType.Overhaul + "\",\""
                    + svn(d,"issuance_id") + "\",\"" +  svn(d,"issuance_no")  + "\");'>" 
                    + svn(d,"issuance_no") + " </a>";
                }
            }
            ,{text  : "Issued By"         , name  : "issued_by"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_by"); }
            }
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_organization_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_organization_id"); }
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
        '<input type="hidden" name="orgranization_id" id="orgranization_id" class="form-control input-sm" >' +
        '<div class="form-group  ">' +
            '<label class=" col-xs-2 control-label">Issuance No.</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="issuance_no" id="issuance_no" class="form-control input-sm" >' +
            '</div>' +
            '<label class=" col-xs-2 control-label">Issued By</label>' +
            '<div class=" col-xs-3">' +
                '<select type="text" name="issued_by" id="issued_by" class="form-control input-sm"></select>' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
        '<label class=" col-xs-2 control-label">Issued Date</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="issued_date" id="issued_date" class="form-control input-sm" >' +
            '</div>' +
            '<label class=" col-xs-2 control-label">Issuance Directive</label>' +
            '<div class=" col-xs-3">' +
                '<select type="text" name="issuance_directive_id" id="issuance_directive_id" class="form-control input-sm"></select>' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-2 control-label show-hide-label">&nbsp;</label>' +
            '<div class=" col-xs-3 show-hide">' +
            '</div>' +
            '<label class=" col-xs-2 control-label">Authority Ref</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="authority_ref" id="authority_ref" class="form-control input-sm" >' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-2 control-label">Status</label>' +
            '<div class=" col-xs-2">' +
                '<label class=" col-xs-2 control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' +
            '</div>' +
            '<label class=" col-xs-3 control-label">Status Remarks</label>' +
            '<div class=" col-xs-5">' +
                '<input type="text" name="status_remarks" id="status_remarks" class="form-control input-sm" >' +
                '<input type="hidden" name="issuance_type" id="issuance_type" value="'+ g_tab_name +'"class="form-control input-sm" >' +
            '</div>' +
            
        '</div>' +

        '</div>';
    
    $table.append(html);
}

// Build the issuance details form.
function buildIssuanceDetails(callback) {
    $("#tblModalIssuanceDetails").dataBind({
        url: procURL + "issuance_details_sel"
        ,width:  $(document).width() - 190
        ,height: 200 
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){ 
                    return bs({name:"issuance_detail_id",type:"hidden", value: svn (d,"issuance_detail_id")})
                        +  bs({name:"issuance_id",type:"hidden", value: svn (d,"issuance_id")})
                        +  bs({name:"item_id",type:"hidden", value: svn (d,"item_id")})
                        +  bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")});
                }
            }    
            /*,{text  : "Part No./Nat'l Stock No./Description"                , name  : "item_id"                  , type  : "input"      , width : 300       , style : "text-align:left;"
                , onRender: function(d) {
                    return "<input id='item_id' name='item_id' type='hidden'>"
                    + "<input id='item_search' class='form-control input-sm' name='item_search' type='text'>";
                }
            }*/
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            //setSearch();
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
        if (d.rows !== null) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.page_process_action_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            $(".added-button").remove();
            $("#issuance-footer").append(html);
        }
    });
}

// Add a click event for the aircraft issuance button.
$("#aircraftBtnNew").click(function () {
    $("#modalIssuance .modal-title").text("New Aircraft Issuance for " + g_organization_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    $(".show-hide-label").html('Aircraft');            
    $(".show-hide").html('');            
    var html = '<select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm" ></select>' +
                '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">';
    $(".show-hide").append(html);
});

// Add a click event for the transfer issuance button.
$("#transferBtnNew").click(function () {
    $("#modalIssuance .modal-title").text("New Transfer Issuance for " + g_organization_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    $(".show-hide-label").html('Transfer To');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    $(".show-hide").append(html);
});

// Add a click event for the repair issuance button.
$("#repairBtnNew").click(function () {
    $("#modalIssuance .modal-title").text("New Repair Issuance for " + g_organization_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    $(".show-hide-label").html('Transfer To');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    $(".show-hide").append(html);
});

// Add a click event for the overhaul issuance button.
$("#overhaulBtnNew").click(function () {
    $("#modalIssuance .modal-title").text("New Overhaul Issuance for " + g_organization_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    $(".show-hide-label").html('Transfer To');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    $(".show-hide").append(html);
});

// Save the new issuance entry.
function Save(page_process_action_id) {
    if( zsi.form.checkMandatory()!==true) {
        return false;
    }
    var result = confirm("Entries will be saved. Continue?");
    if (result) {
        $("#status_id").val(page_process_action_id);
        $("#tblModalIssuanceHeader").jsonSubmit({
            procedure: "issuances_upd"
            //, optionalItems: ["aircraft_id", "transfer_organization_id"]
            , onComplete: function (data) {
                if (data.isSuccess === true) { 
                    $("#tblModalIssuanceDetails #issuance_id").val(data.returnValue);
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
        , notInclude: "#item_search,#item_code_id,#part_no,#national_stock_no,#item_name,#serial_no"
        , optionalItems: ["issuance_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                setStatusName(page_process_action_id);
                displayAircraft(g_tab_name);
                clearEntries();
                $("#modalIssuance").modal('toggle');
            } else {
                console.log(data.errMsg);
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
function showModalUpdateIssuance(issuance_type, issuance_id, issuance_no) {
    var title = '';
    var label = '';
    var html = '';
    if (issuance_type == IssuanceType.Aircraft) {
        title = "Update Issuance Aircraft for ";
        label = 'Aircraft';
        html = '<select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm" ></select>' +
            '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">';
    }
    if (issuance_type == IssuanceType.Transfer) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    }
    if (issuance_type == IssuanceType.Repair) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    }
    if (issuance_type == IssuanceType.Overhaul) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>';
    }
    $("#modalIssuance .modal-title").text(title + g_organization_name);
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuanceHeader("#tblModalIssuanceHeader");
    $(".show-hide-label").html(label);
    $(".show-hide").html('');
    $(".show-hide").append(html);
    $("#issuance_id").val(issuance_id);
    initDatePicker();
    initSelectOptions(function(){
        $.get(procURL + "issuances_sel @issuance_id=" + issuance_id + "&@tab_name=" + g_tab_name, function(d) {
            if (d.rows !== null) {
                $("#tblModalIssuanceHeader #issuance_no").val(d.rows[0].issuance_no);
                $("#tblModalIssuanceHeader #issued_by").val(d.rows[0].issued_by);
                $("#tblModalIssuanceHeader #issued_date").val(d.rows[0].issued_date);
                $("#tblModalIssuanceHeader #issuance_directive_id").val(d.rows[0].issuance_directive_id);
                $("#tblModalIssuanceHeader #aircraft_id").val(d.rows[0].aircraft_id);
                $("#tblModalIssuanceHeader #authority_ref").val(d.rows[0].authority_ref);
                $("#tblModalIssuanceHeader #status_name").html(d.rows[0].status_name);
                $("#tblModalIssuanceHeader #status_remarks").val(d.rows[0].status_remarks);
                
                buildIssuanceDetails(function() {
                    loadIssuanceDetails(issuance_id);
                    buildIssuanceButtons();        
                });
            }
        });
    });
}

// Load the values for the issuance details.
function loadIssuanceDetails(issuance_id) {
    $("#tblModalIssuanceDetails").dataBind({
        url: procURL + "issuance_details_sel @issuance_id=" + issuance_id
        ,width:  $(document).width() - 190
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){ 
                    return bs({name:"issuance_detail_id",type:"hidden", value: svn (d,"issuance_detail_id")})
                        +  bs({name:"issuance_id",type:"hidden", value: svn (d,"issuance_id")})
                        +  bs({name:"item_id",type:"hidden", value: svn (d,"item_id")})
                        +  bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")});
                }
            }
            //,{text  : "Part No./Nat'l Stock No./Description"          , name  : "item_search"                , type  : "input"       , width : 250       , style : "text-align:left;"}
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            //setSearch();
            setSearchMulti();
            setMandatoryEntries();
        }  
    });
}

// Set the auto-complete search for the grid details.
function setSearch(){
    new zsi.search({
        tableCode: "adm-0003"
        , colNames: ["item_description"] 
        , displayNames: ["item_description"]  
        , searchColumn:"item_description"
        , input: "input[name = item_search]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){ 
            $(currentObject).prev().val(data.item_code_id);
            currentObject.value = data.item_description;
        }
       , onChange: function(text){
          if(text === ""){ 
          }
       }
    });        
}
   
function setSearchMulti(){
    var _tableCode = "ref-0023";
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_id").val(data.item_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
            
            setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_id").val(data.item_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
            
            setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_id").val(data.item_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            
            setSearchSerial(data.item_code_id, $zRow);
        }
    });
}

function setSearchSerial(id, row){
    row.find("#serial_no").dataBind("good_items, 'item_code_id="+ id +"'");
    
    /*var param ="aircraft_info_id=null";
    
    if(id) param += " AND item_code_id="+ id;
    
    new zsi.search({
        tableCode: "ref-0022"
        , colNames: ["serial_no","item_id","item_code_id","item_name","part_no","national_stock_no"] 
        , displayNames: ["Serial No."]
        , searchColumn:"serial_no"
        , input: "input[name=serial_no]"
        , url: execURL + "searchData"
        , condition :"'"+ param +"'"
        , onSelectedItem: function(currentObject, data, i){ 
            currentObject.value = data.serial_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_id").val(data.item_id);
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#search_part_no").val(data.part_no);
            $zRow.find("#search_ns_no").val(data.national_stock_no);
            $zRow.find("#search_description").val(data.item_name);
        }
    });*/
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
          