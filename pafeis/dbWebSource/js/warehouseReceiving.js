var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var cls =".right .zHeaders .item";
var queDataProcedures;
var g_recieving_id = null;
var g_organization_id = null;
var g_organization_name = "";
var g_location_name = "";
var g_tab_name = "SUPPLIER";
var g_today_date = new Date(); 

const DeliveryType = {
    Supplier: 'Supplier',
    Transfer: 'Transfer',
    Aircraft: 'Aircraft',
    Repair: 'Repair',
    Overhaul: 'Overhaul',
};

zsi.ready(function(){
    $("#supplier-tab").click(function(){
        g_tab_name = "SUPPLIER";
    });
    $("#transfer-tab").click(function() {
        g_tab_name = "TRANSFER";
    });
    $("#aircraft-tab").click(function() {
        g_tab_name = "AIRCRAFT";
    });
    $("#repair-tab").click(function() {
        g_tab_name = "REPAIR";
    });
    $("#overhaul-tab").click(function() {
        g_tab_name = "OVERHAUL";
    });
    
    getTemplate();
    setCurrentTab();
    displayNew(g_tab_name);
    
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
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            $(".pageTitle").append(' for ' + g_organization_name + g_location_name);
        }
    });
    
    $("#supplier-tab").click(function () {
        displayNew($(this).html());    
    });
    $("#transfer-tab").click(function () {
        displayTransfer($(this).html());    
    });
    $("#aircraft-tab").click(function () {
        displayAircraft($(this).html());    
    });
    $("#repair-tab").click(function () {
        displayRepair($(this).html());    
    });
    $("#overhaul-tab").click(function () {
        displayOverhaul($(this).html());    
    });
});

// Set the auto-complete search for the grid details.
/*function setSearch(){
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
}*/

// Create modal window for the receiving
var contextModalNewReceiving = {
    id: "modalReceiving"
    , title: ""
    , sizeAttr: "modal-lg"
    , footer: '<div id="receiving-footer" class="pull-left">'
            + '<button type="button" onclick="resetFields(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Reset</button>'
    , body: '<div id="tblModalReceivingHeader" class="zGrid header ui-front"></div><br/><div><h4>Details</h4></div><div class="zPanel"><div id="tblModalReceivingDetails" class="zGrid detail ui-front"></div></div>'
};

// Get the template for the initialization of the modal windows.
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalNewReceiving));
    });    
}

function clearEntries() {
    $('input[type=text]').val('');
    $('select').val('');    
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
    $("select[name='dealer_id']").dataBind({
        url: base_url + "selectoption/code/dealer"
        , onComplete : function(){
            $("select[name='receiving_organization_id']").dataBind({
                url: base_url +  "selectoption/code/organization"
                , onComplete : function(){
                    $("select[name='transfer_organization_id']").dataBind({
                        url: base_url +  "selectoption/code/organization"
                        , onComplete : function(){
                            $("select[name='received_by']").dataBind({
                                url: base_url +  "selectoption/code/employees_fullnames_v"
                                , onComplete : function(){
                                    $("select[name='aircraft_id']").dataBind({
                                        url: base_url +  "selectoption/code/aircraft_info"
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

// Display the grid for the supplier delivery.
function displayNew(tab_name){
    var counter = 0;
    $("#supplier").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 55
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "Doc No."             , name  : "doc_no"                      , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Supplier + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"doc_no")  + "\");'>" 
                        + svn(d,"doc_no") + " </a>";
                    }
                }
                ,{text  : "Doc Date"            , name  : "doc_date"                    , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"doc_date"); }
                }
                ,{text  : "Dealer"              , name  : "dealer_name"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"dealer_name"); }
                }
                ,{text  : "Received By"         , name  : "received_by_name"                 , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"       , name  : "received_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date"); }
                }
                ,{text  : "Status"              , name  : "status_name"                     , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , name  : "status_remarks"                  , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the transfer delivery.
function displayTransfer(tab_name){
    var counter = 0;
    $("#transfer").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "Doc No."            , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Transfer + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"doc_no")  + "\");'>" 
                        + svn(d,"doc_no") + " </a>";
                    }
                }
                ,{text  : "Doc Date"             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Transfer From"      , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"transfer_organization_name") 
                                         + bs({name:"aircraft_name",type:"hidden",value: svn (d,"aircraft_name")});
                    }
                }
                ,{text  : "Received By"           , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"                  , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date"); }
                }
                ,{text  : "Status"                        , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"    , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

// Display the grid for the return delivery.
function displayAircraft(tab_name){
    var counter = 0;
    $("#aircraft").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "Doc No."       , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Aircraft + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"doc_no")  + "\");'>" 
                        + svn(d,"doc_no") + " </a>";
                    }
                }
                ,{text  : "Doc Date"      , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Aircraft"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }
                
                ,{text  : "Received By"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"     , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date"); }
                }
                ,{text  : "Status"             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

function displayRepair(tab_name){
    var counter = 0;
    $("#repair").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "Doc No."       , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Repair + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"doc_no")  + "\");'>" 
                        + svn(d,"doc_no") + " </a>";
                    }
                }
                ,{text  : "Doc Date"      , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Aircraft"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }
                
                ,{text  : "Received By"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"     , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date"); }
                }
                ,{text  : "Status"             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"       , width : 250       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_remarks"); }
                }
        ]   
    });    
}

function displayOverhaul(tab_name){
    var counter = 0;
    $("#overhaul").dataBind({
         url            : procURL + "receiving_sel @tab_name='" + tab_name + "'"
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
                {text  : "Doc No."       , type  : "input"       , width : 100       , style : "text-align:left;"
                    ,onRender : function(d){ 
                        return "<a href='javascript:showModalUpdateReceiving(\""
                        + DeliveryType.Overhaul + "\",\""
                        + svn(d,"receiving_id") + "\",\"" +  svn(d,"doc_no")  + "\");'>" 
                        + svn(d,"doc_no") + " </a>";
                    }
                }
                ,{text  : "Doc Date"      , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ 
                                    return svn(d,"doc_date") 
                                         + bs({name:"dealer_name",type:"hidden",value: svn (d,"transfer_organization_name")});
                    }
                }
                ,{text  : "Aircraft"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"aircraft_name"); }
                }
                
                ,{text  : "Received By"    , type  : "label"       , width : 200       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_by_name"); }
                }
                ,{text  : "Received Date"     , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"received_date"); }
                }
                ,{text  : "Status"             , type  : "label"       , width : 150       , style : "text-align:left;"
                    ,onRender : function(d){ return svn(d,"status_name"); }
                }
                ,{text  : "Status Remarks"      , type  : "label"       , width : 250       , style : "text-align:left;"
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
        '<input type="hidden" name="receiving_id" id="receiving_id" class="form-control input-sm" >' +
        '<input type="hidden" name="receiving_no" id="receiving_no" class="form-control input-sm" >' +
        '<div class="form-group  ">' +
            '<label class=" col-xs-1 control-label">Doc No.</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="doc_no" id="doc_no" class="form-control input-sm">' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Doc Date</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="doc_date" id="doc_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Status</label>' +
            '<div class=" col-xs-3">' +
                '<label class=" col-xs-1 control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-1 control-label">Received By</label>' +
            '<div class=" col-xs-3">' +
                '<select type="text" name="received_by" id="received_by" class="form-control input-sm"></select>' +
            '</div>' +
            '<label class=" col-xs-1 control-label">Received Date</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="received_date" id="received_date" class="form-control input-sm" >' +
            '</div>' +
            '<label class=" col-xs-1 control-label show-hide-label">&nbsp;</label>' +
            '<div class=" col-xs-3 show-hide">' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  ">' +
            '<label class=" col-xs-1 control-label">Remarks</label>' +
            '<div class=" col-xs-7">' +
                 '<textarea type="text" name="status_remarks" id="status_remarks" class="form-control input-sm" ></textarea>' +
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
    
    
    $('TEXTAREA').keypress(function(e){
        if (e.keyCode == 13) {
            var startPos = this.selectionStart;
            this.value  = insertAt(this.value,startPos,"\r\n");
            this.selectionEnd =startPos + 1;
        }
    }) ;   
}
// Build the receiving details form.
function buildReceivingDetails(callback) {
    $("#tblModalReceivingDetails").dataBind({
        url: procURL + "receiving_details_sel"
        ,width:  $(document).width() - 200
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){ 
                    return     bs({name:"receiving_detail_id",type:"hidden", value: svn (d,"receiving_detail_id")})
                        +  bs({name:"is_edited",type:"hidden"})
                        +  bs({name:"receiving_id",type:"hidden", value: svn (d,"receiving_id")})
                        + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")});
                }
            }    
            /*,{text  : "Part No./Nat'l Stock No./Description"                , name  : "item_id"                  , type  : "input"      , width : 250       , style : "text-align:left;"
                , onRender: function(d) {
                    return "<input id='item_id' name='item_id' type='hidden'>"
                    + "<input id='item_search' class='form-control input-sm' name='item_search' type='text'>";
                }
            }
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "input"       , width : 150       , style : "text-align:left;"}*/
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : (g_tab_name==="SUPPLIER" ? "input" : "select"), width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 475       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='item_class_id']").dataBind("item_class");
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });
            //setSearch();
            setSearchMulti();
            if (callback) callback();
        }  
    });
}

// Build the receiving buttons.
function buildReceivingButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=70,@doc_id=" + $("#receiving_id").val(), function(d) {
        if (d.rows !== null) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.page_process_action_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            
            $(".added-button").remove();
            $("#receiving-footer").append(html);
        }
    });
}

// Add a click event for the supplier delivery button.
$("#sdBtnNew").click(function () {
    $("#modalReceiving .modal-title").text("Items from Supplier for " + g_organization_name + g_location_name);
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceiving($("#tblModalReceivingHeader"));
    $(".show-hide-label").html('Dealer');            
    $(".show-hide").html('');            
    var html = '<select type="text" name="dealer_id" id="dealer_id" class="form-control input-sm" ></select>' +
                '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">';
    $(".show-hide").append(html);
    $("select[name='dealer_id']").dataBind("dealer");
});
// Add a click event for the transfer delivery button.
$("#tdBtnNew").click(function () {
    $("#modalReceiving .modal-title").text("Items from Repair for " + g_organization_name + g_location_name);
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceiving($("#tblModalReceivingHeader"));
    $(".show-hide-label").html('Organization');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
                '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">';
    $(".show-hide").append(html);
    $("select[name='transfer_organization_id']").dataBind("organization");
});

// Add a click event for the return delivery button.
$("#rdBtnNew").click(function () {
    $("#modalReceiving .modal-title").text("Items from Aircraft for " + g_organization_name + g_location_name);
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceiving($("#tblModalReceivingHeader"));
    $(".show-hide-label").html('Aircraft');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
                '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">' +
                '<select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm" ></select>';
    $(".show-hide").append(html);
    $("select[name='aircraft_id']").dataBind("aircraft_info");
});

// Add a click event for the overhaul delivery button.
$("#odBtnNew").click(function () {
    $("#modalReceiving .modal-title").text("Items from Overhaul for " + g_organization_name + g_location_name);
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceiving($("#tblModalReceivingHeader"));
    $(".show-hide-label").html('Dealer');            
    $(".show-hide").html('');            
    var html = '<select type="text" name="dealer_id" id="dealer_id" class="form-control input-sm" ></select>' +
                '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">' +
                '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">';
    $(".show-hide").append(html);
    $("select[name='dealer_id']").dataBind("dealer");
});

// Save the new receiving entry.
function Save(page_process_action_id) {
    var result = confirm("Entries will be saved. Continue?");
    if (result) {
        $("#status_id").val(page_process_action_id);
        $("#tblModalReceivingHeader").jsonSubmit({
            procedure: "receiving_upd"
            , onComplete: function (data) {
                if (data.isSuccess === true) { 
                    var _receiving_id = (data.returnValue===0 ? g_recieving_id : data.returnValue);
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
        , optionalItems: ["receiving_id"]
        , onComplete: function (data) {
            if (data.isSuccess === true) { 
                zsi.form.showAlert("alert");
                setStatusName(page_process_action_id);
                clearEntries();
                $("#modalReceiving").modal('toggle');
            } else {
                console.log(data.errMsg);
            }
            displayNew(g_tab_name);    
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
function showModalUpdateReceiving(delivery_type, receiving_id, doc_no) {
    var title = '';
    var label = '';
    var html = '';
    g_recieving_id = receiving_id;
    if (delivery_type == DeliveryType.Supplier) {
        title = "Supplier Delivery for ";
        label = 'Dealer';
        html = '<select type="text" name="dealer_id" id="dealer_id" class="form-control input-sm" ></select>' +
            '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">' +
            '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">';
    }
    if (delivery_type == DeliveryType.Transfer) {
        title = "Tranfer Delivery for ";
        label = 'Organization';
        html = '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm" ></select>' +
            '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">';
    }
    if (delivery_type == DeliveryType.Return) {
        title = "Return Delivery for ";
        label = 'Aircraft';
        html = '<input type="hidden" name="dealer_id" id="dealer_id" class="form-control input-sm">' +
            '<input type="hidden" name="transfer_organization_id" id="transfer_organization_id" class="form-control input-sm">' +
            '<select type="text" name="aircraft_id" id="aircraft_id" class="form-control input-sm" ></select>';
    }
    $("#modalReceiving .modal-title").text(title + g_organization_name + g_location_name);
    $("#modalReceiving").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildReceivingHeader($("#tblModalReceivingHeader"));
    $(".show-hide-label").html(label);
    $(".show-hide").html('');
    $(".show-hide").append(html);
    $("#receiving_id").val(receiving_id);
    initDatePicker();
    initSelectOptions(function(){
        $.get(procURL + "receiving_sel @receiving_id=" + receiving_id + "&@tab_name=" + g_tab_name, function(d) {
            if (d.rows !== null) {
                $("#doc_no").val(d.rows[0].doc_no);
                $("#doc_date").val(d.rows[0].doc_date);
                $("#status_name").html(d.rows[0].status_name);
                $("#receiving_organization_id").val(d.rows[0].receiving_organization_id);
                $("#received_by").val(d.rows[0].received_by);
                $("#received_date").val(d.rows[0].received_date);
                $("#dealer_id").val(d.rows[0].dealer_id);
                $("#status_remarks").val(d.rows[0].status_remarks);
       
               // buildReceivingDetails(function() {
                    loadReceivingDetails(receiving_id);
                    buildReceivingButtons();        
                //});         
            }
        });
    });
}

// Load the values for the receiving details.
function loadReceivingDetails(receiving_id) {
    $("#tblModalReceivingDetails").dataBind({
        url: procURL + "receiving_details_sel @receiving_id=" + receiving_id
        ,width:  $(document).width() - 200
        ,height: 200
        ,blankRowsLimit: 10
        ,isPaging: false
        ,dataRows: [
            {text   : " "   , width: 26, style : "text-align:left;", 
                onRender:  function(d){
                    return     bs({name:"receiving_detail_id",type:"hidden", value: svn (d,"receiving_detail_id")})
                        +  bs({name:"is_edited",type:"hidden"})
                        +  bs({name:"receiving_id",type:"hidden", value: receiving_id })
                        + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")});
                }
            }
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : (g_tab_name==="SUPPLIER" ? "input" : "select"), width : 150       , style : "text-align:left;"}
            //,{text  : "Part No./Nat'l Stock No./Description"          , name  : "item_search"                , type  : "input"       , width : 250       , style : "text-align:left;"}
            //,{text  : "Serial No."          , name  : "serial_no"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Item Class"          , name  : "item_class_id"            , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since New"      , name  : "time_since_new"           , type  : "input"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Time Since Overhaul" , name  : "time_since_overhaul"      , type  : "input"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 260       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            $("select[name='item_class_id']").dataBind("item_class");
            
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });
            //setSearch();
            setSearchMulti();
            setMandatoryEntries();
        }  
    });
}

function setSearchMulti(){
    var selCode = "";
    var _tableCode = "";
    
    if(g_tab_name==="SUPPLIER"){
        _tableCode = "ref-0023";
    }
    else if(g_tab_name==="AIRCRAFT"){
        selCode = "items_on_arcraft_serials";
        _tableCode = "ref-0023";
    }
    else if(g_tab_name==="REPAIR"){
        selCode = "items_on_repair_serials";
        _tableCode = "ref-0023";
    }
    else if(g_tab_name==="OVERHAUL"){
        selCode = "items_on_overhaul_serials";
        _tableCode = "ref-0023";
    }
    
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
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
            
            if(g_tab_name!=="SUPPLIER")
                setSearchSerial(data.item_code_id, $zRow, selCode);
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
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
            
            if(g_tab_name!=="SUPPLIER")
                setSearchSerial(data.item_code_id, $zRow, selCode);
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
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            
            if(g_tab_name!=="SUPPLIER")
                setSearchSerial(data.item_code_id, $zRow, selCode);
        }
    });
}

function setSearchSerial(id, row, code){
    row.find("#serial_no").dataBind(code +", 'item_code_id="+ id +"'");
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
               