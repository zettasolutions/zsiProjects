 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
});
$("#btnGo").click(function(){
   displayRecords($("#criticalstockpilereport_filter").val());
});

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "critical_stockpile_report_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        //,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : "Unit"                , name  :"organization_code"    , width : 150           , style : "text-align:left;"}
        		,{text  : "Part No."            , name  :"part_no"              , width : 150           , style : "text-align:left;"}
        		,{text  : "National Stock No."  , name  :"national_stock_no"    , width : 150           , style : "text-align:left;"}
        		,{text  : "Nomenclature"        , name  : "item_name"           , width : 300           , style : "text-align:left"}
        	    ,{text  : "Available Stocks"    , name  : "available_stocks"    , width : 130           , style : "text-align:center;"}
	    ]   
    	     ,onComplete: function(){
              
        }  
    });    
}
                             