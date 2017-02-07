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
    ,g_today_date = new Date()
;
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
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_warehouse_id = d.rows[0].warehouse_id;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            $(".pageTitle").append(' for ' + g_organization_name + g_location_name);
            
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
            $("#tblModalIssuanceHeader #issuance_directive_id").dataBind({
                url: base_url +  "selectoption/code/issuance_directive"
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
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Aircraft"       , name  : "aircraft_name"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"aircraft_name"); }
            }
            ,{text  : "Status"       , name  : "status_name"                   , type  : "label"       , width : 110       , style : "text-align:left;"
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
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 110       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_warehouse_id"); }
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
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 110       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_warehouse_id"); }
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
            ,{text  : "Issued Date"       , name  : "issued_date"                   , type  : "label"       , width : 150       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issued_date"); }
            }
            ,{text  : "Issuance Directive"       , name  : "issuance_directive_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"issuance_directive_id"); }
            }
            ,{text  : "Status"       , name  : "status_id"                   , type  : "label"       , width : 110       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_id"); }
            }
            ,{text  : "Status Remarks"       , name  : "status_remarks"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"status_remarks"); }
            }
            ,{text  : "Authority Ref"       , name  : "authority_ref"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"authority_ref"); }
            }
            ,{text  : "Transfer To"       , name  : "transfer_warehouse_id"                   , type  : "label"       , width : 200       , style : "text-align:left;"
                ,onRender : function(d){ return svn(d,"transfer_warehouse_id"); }
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
                '<input type="text" name="issued_date" id="issued_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'" >' +
            '</div>' +
            '<label class=" col-xs-2 control-label">Issuance Directive</label>' +
            '<div class=" col-xs-3">' +
                '<select type="text" name="issuance_directive_id" id="issuance_directive_id" class="form-control input-sm"></select>' +
            '</div>' +
            '<label class="  control-label show-hide-label"></label>' +
            '<div class="  show-hide">' +
            '</div>' +        '</div>' +
        
        '<div class="form-group  "> ' +
             '<label class=" col-xs-2 control-label">Status</label>' +
            '<div class=" col-xs-3">' +
                '<label class=" col-xs-2 control-label" name="status_name" id="status_name">&nbsp;</label>' +
                '<input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' +
            '</div>' +

            '<label class=" col-xs-2 control-label">Authority Ref</label>' +
            '<div class=" col-xs-3">' +
                '<input type="text" name="authority_ref" id="authority_ref" class="form-control input-sm" >' +
            '</div>' +
        '</div>' +
        
        '<div class="form-group  "> ' +
            '<label class=" col-xs-2 control-label">Status Remarks</label>' +
            '<div class=" col-xs-3">' +
                '<textarea type="text" name="status_remarks" id="status_remarks" cols="62" rows="1"  class="form-control input-sm" ></textarea>' +
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
                        +  bs({name:"is_edited",type:"hidden"}) 
                        +  bs({name:"issuance_id",type:"hidden", value: svn (d,"issuance_id")})
                        +  bs({name:"item_inv_id",type:"hidden", value: svn (d,"item_inv_id")})
                        +  bs({name:"serial_no",type:"hidden", value: svn (d,"serial_no")});
                }
            }    
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure"          , type  : "label"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Stock Qty."          , name  : "stock_qty"                , type  : "label"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 100       , style : "text-align:left;"}
            ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });            
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");

            $("[name='quantity']").keyup(function(){
                var $zRow = $(this).closest(".zRow");
                var stock_qty = $zRow.find("label[name='stock_qty']").text();
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
    $("#modalIssuance .modal-title").html("Issue Items from " + g_organization_name + g_location_name + ' to <select name="aircraft_filter" id="aircraft_filter"></select>');
    $("select[name='aircraft_filter']").dataBind({ url: base_url + "selectoption/code/aircraft_info"});
    $("select[name='aircraft_filter']").change(function(){
        $("#aircraft_id").val(this.value);
    });
    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
  //  $(".show-hide-label").html('Aircraft');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm" >' +
                '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm">';
    $(".show-hide").append(html);
    $("select, input").on("keyup change", function(){
        var $zGrid  = $(this).closest(".zGrid ");
        $zGrid.find("#is_edited").val("Y");
    });    
    buildIssuanceDetails();
    zsi.initDatePicker();
});

// Add a click event for the transfer issuance button.
$("#transferBtnNew").click(function () {
    $("#modalIssuance .modal-title").html('Transfer Items from' + ' » ' + g_organization_name + g_location_name + ' to <select name="dd_warehouse_transfer_filter" id="dd_warehouse_transfer_filter"></select>');
    $("select[name='dd_warehouse_transfer_filter']").dataBind({
    url: procURL + "dd_transfer_warehouses_sel"
    , text: "organization_warehouse"
    , value: "warehouse_id"
    , required :true
    
    , onComplete: function(){
    //    warehouse_id = $("select[name='dd_warehouse_transfer_filter'] option:selected" ).val();
        $("select[name='dd_warehouse_transfer_filter']").change(function(){
            $("#transfer_warehouse_id").val(this.value);
            setSearchMulti();
        });
    }
    
    });

    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
                '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" >';
    $(".show-hide").append(html);
    
    $("select, input").on("keyup change", function(){
        var $zGrid  = $(this).closest(".zGrid ");
        $zGrid.find("#is_edited").val("Y");
    });
    buildIssuanceDetails();
    zsi.initDatePicker();
});

// Add a click event for the repair issuance button.
$("#repairBtnNew").click(function () {
    $("#modalIssuance .modal-title").html("Repair Items from " + g_organization_name + g_location_name + ' to <select name="dd_warehouse_transfer_filter" id="dd_warehouse_transfer_filter"></select>');
    $("select[name='dd_warehouse_transfer_filter']").dataBind({
    url: procURL + "dd_transfer_warehouses_sel"
    , text: "organization_warehouse"
    , value: "warehouse_id"
    , required :true
    
    , onComplete: function(){
        //warehouse_id = $("select[name='dd_warehouse_transfer_filter'] option:selected" ).val();
        $("select[name='dd_warehouse_transfer_filter']").change(function(){
            $("#transfer_warehouse_id").val(this.value);
            setSearchMulti();
        });
    }
    
    });

    $("select[name='dd_warehouse_transfer_filter']").change(function(){
        $("#transfer_warehouse_id").val(this.value);
    });

    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
   // $(".show-hide-label").html('Transfer To');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
               '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" >';
    $(".show-hide").append(html);
    $("select, input").on("keyup change", function(){
        var $zGrid  = $(this).closest(".zGrid ");
        $zGrid.find("#is_edited").val("Y");
    });    
    buildIssuanceDetails();
    zsi.initDatePicker();
});

// Add a click event for the overhaul issuance button.
$("#overhaulBtnNew").click(function () {
    $("#modalIssuance .modal-title").html("Overhaul Items from " + g_organization_name + g_location_name + ' to <select name="dd_warehouse_transfer_filter" id="dd_warehouse_transfer_filter"></select>');
    $("select[name='dd_warehouse_transfer_filter']").dataBind({
    url: procURL + "dd_transfer_warehouses_sel"
    , text: "organization_warehouse"
    , value: "warehouse_id"
    , required :true
    
    , onComplete: function(){
      //  warehouse_id = $("select[name='dd_warehouse_transfer_filter'] option:selected" ).val();
        $("select[name='dd_warehouse_transfer_filter']").change(function(){
            $("#transfer_warehouse_id").val(this.value);
            setSearchMulti();
        });
    }
    
    });

    $("select[name='dd_warehouse_transfer_filter']").change(function(){
        $("#transfer_warehouse_id").val(this.value);
    });

    $("#modalIssuance").modal({ show: true, keyboard: false, backdrop: 'static' });
    buildIssuance($("#tblModalIssuanceHeader"));
    //$(".show-hide-label").html('Transfer To');            
    $(".show-hide").html('');            
    var html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
               '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" >';
    $(".show-hide").append(html);
    $("select, input").on("keyup change", function(){
        var $zGrid  = $(this).closest(".zGrid ");
        $zGrid.find("#is_edited").val("Y");
    });    
    buildIssuanceDetails();
    zsi.initDatePicker();
    
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
            //, optionalItems: ["aircraft_id", "transfer_warehouse_id"]
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
            '<input type="hidden" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm">';
    }
    if (issuance_type == IssuanceType.Transfer) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" ></select>';
    }
    if (issuance_type == IssuanceType.Repair) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" ></select>';
    }
    if (issuance_type == IssuanceType.Overhaul) {
        title = "Update Issuance Tranfer for ";
        label = 'Organization';
        html = '<input type="hidden" name="aircraft_id" id="aircraft_id" class="form-control input-sm">' +
            '<select type="text" name="transfer_warehouse_id" id="transfer_warehouse_id" class="form-control input-sm" ></select>';
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
                        +  bs({name:"is_edited",type:"hidden"}) 
                        +  bs({name:"issuance_id",type:"hidden", value: svn (d,"issuance_id")})
                        +  bs({name:"item_inv_id",type:"hidden", value: svn (d,"item_inv_id")})
                        +  bs({name:"serial_no",type:"hidden", value: svn (d,"serial_no")});
                }
            }
            ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Description"         , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
            ,{text  : "Serial No."          , name  : "serial_no"                , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"       , type  : "select"      , width : 150       , style : "text-align:left;"}
            ,{text  : "Stock Qty."          , name  : "stock_qty"                , type  : "label"       , width : 100       , style : "text-align:left;"}
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
                var stock_qty = $zRow.find("label[name='stock_qty']").text();
                if(parseInt(this.value) > stock_qty){
                    alert("Please enter quantity less than or equal to stock qty.");
                    this.value = "";
                } 
            });            

            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            setSearchMulti();
            setMandatoryEntries();
        }  
    });
}

function setSearchMulti(){
    var _tableCode = "ref-0027";
        new zsi.search({
        tableCode: _tableCode
        , colNames: ["part_no","item_inv_id","item_name","national_stock_no","unit_of_measure","stock_qty"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , condition: "'warehouse_id=" + g_warehouse_id + "'"
        , input: "input[name=part_no]"
        , url: execURL + "searchData "
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#serial_no").val(data.serial_no);
            $zRow.find("#item_inv_id").val(data.item_inv_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
            $zRow.find("#unit_of_measure").text(data.unit_of_measure);
            $zRow.find("#stock_qty").text(data.stock_qty);
            setSearchSerial(data.item_inv_id, $zRow);
        }
    });

    new zsi.search({
        tableCode: _tableCode
        , colNames: ["national_stock_no","item_inv_id","item_name","part_no","unit_of_measure","stock_qty"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#serial_no").val(data.serial_no);
            $zRow.find("#item_inv_id").val(data.item_inv_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
            $zRow.find("#unit_of_measure").text(data.unit_of_measure);
            $zRow.find("#stock_qty").text(data.stock_qty);
           
            setSearchSerial(data.item_inv_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: _tableCode
        , colNames: ["item_name","item_inv_id","part_no","national_stock_no","unit_of_measure","stock_qty"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#serial_no").val(data.serial_no);
            $zRow.find("#item_inv_id").val(data.item_inv_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#unit_of_measure").text(data.unit_of_measure);
            $zRow.find("#stock_qty").text(data.stock_qty);
            
            setSearchSerial(data.item_inv_id, $zRow);
        }
    });
}

function setSearchSerial(id, row){
    var $serial_no = row.find("select[id='serial_no']");
    
    $serial_no.dataBind({ 
         url : execURL + "dd_warehouse_items_sel @item_inv_id="+ id
        ,text: "serial_no"
        ,value: "serial_no"
    });
    
    $serial_no.change(function(){
       if(this.value != ""){
           row.find("label[name='unit_of_measure']").text("EACH");
           row.find("label[name='stock_qty']").text(1);
           row.find("input[name='quantity']").val(1);
       } 
    });
    
 
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
                      