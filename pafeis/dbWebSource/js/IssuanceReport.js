 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
});
$("#btnGo").click(function(){
   displayRecords($("#issuanceReport_filter").val());
});

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "issuance_report_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : "Issued To"           , name  : "issued_to"           , width : 150           , style : "text-align:left;"}
        		,{text  : "Issued From"         , name  : "issued_from"         , width : 180           , style : "text-align:left;"}
        		,{text  : "Component"           , name  : "component"           , width : 350           , style : "text-align:left;"}
        		,{text  : "Issued Date"         , name  : "issued_date"         , width : 150           , style : "text-align:left;"}
        		
	    ]  
    	    
    });    
}
                              