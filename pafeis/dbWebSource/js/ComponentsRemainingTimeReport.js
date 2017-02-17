 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
});

$("#btnGo").click(function(){
   displayRecords($("#assembly_name_filter").val());
});
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "component_remaining_time_report_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
        		 {text  : "Unit"                    , name  : "unit"                    , width : 200        , style : "text-align:left;"}
        		,{text  : "Part No."                , name  : "part_no"                 , width : 130       , style : "text-align:left;"}
        		,{text  : "Item Code"               , name  : "item_code"               , width : 130       , style : "text-align:left;"}
        		,{text  : "Item Name"               , name  : "item_name"               , width : 280       , style : "text-align:left;"}
        	    ,{text  : "National Stock No"       , name  : "national_stock_no"       , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Serial No."              , name  : "serial_no"               , width : 130       , style : "text-align:left;"}
        	    ,{text  : "Organization Address"    , name  : "organization_address"    , width : 350       , style : "text-align:left;"}
        	    ,{text  : "Remaining Time"          , name  : "national_stock_no"       , width : 130       , style : "text-align:left;"}
        	    ,{text  : "Status Name"             , name  : "status_name"             , width : 130       , style : "text-align:left;"}
	    ]   
    	     ,onComplete: function(){
              
        }  
    });    
}
                             