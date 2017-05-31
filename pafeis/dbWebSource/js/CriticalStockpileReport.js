var bs  = zsi.bs.ctrl;
var svn = zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
});

$("select[name='warehouse_filter']").dataBind({
    url: procURL + "dd_warehouse_organizations_sel" 
    , text : "organization_warehouse"
    , value: "warehouse_id"
});

$("select[name='categories_filter']").dataBind({
    url: procURL + "item_categories_sel" 
    , text : "item_cat_name"
    , value: "item_cat_id"
});

$("#btnGo").click(function(){
   displayRecords();
});

function displayRecords(){
    var wId = $("#warehouse_filter").val();
    var catId = $("#categories_filter").val();
    console.log(wId);
    console.log(catId);
        $("#grid").dataBind({
             url            : execURL + "critical_stockpile_report_sel @warehouse_id=" + (wId ? wId : null) + ",@item_cat_id=" + (catId ? catId : null)
            ,width          : $(document).width() - 35
            ,height         : $(document).height() - 250
            ,isPaging : false
            ,dataRows : [
            		 {text  : "Part No."            , name  :"part_no"              , width : 150           , style : "text-align:left;"}
            		,{text  : "National Stock No."  , name  :"national_stock_no"    , width : 150           , style : "text-align:left;"}
            		,{text  : "Nomenclature"        , name  : "item_name"           , width : 450           , style : "text-align:left"}
            	    ,{text  : "Stock Qty."          , name  : "stock_qty"           , width : 130           , style : "text-align:center;"}
            	    ,{text  : "Unit of Measure."    , name  : "unit_of_measure"     , width : 130           , style : "text-align:center;"}
            	    ,{text  : "Reoder Level"        , name  : "reorder_level"       , width : 130           , style : "text-align:center;"}
            ]   
    });    
}
                              