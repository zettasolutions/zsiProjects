 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var g_page_id;

zsi.ready(function(){
    displayWarehouseReceivingRecords();
});

function initWarehouseReceivingNewTemplate(){
    
}

$("#wrnBtnSave").click(function () {
   $("#warehouseReceivingNewGrid").jsonSubmit({
            procedure: "receiving_upd"
            //optionalItems: ["page_id", "is_active", "is_default"]
            , onComplete: function (data) {
                $("#warehouseReceivingNewGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                //displayPageProcessRecords(g_page_id);
            }
    });
});

    
function displayWarehouseReceivingRecords(){
    $("#warehouseReceivingNewGrid").dataBind({
	     //url            : procURL + "receiving_sel"
	    width          : 1050 //$(document).width() - 50
	    ,height         : 'auto' //$(document).height() - 250
	    //,selectorType   : "checkbox"
	    //,blankRowsLimit: 0
        ,isPaging : false
        ,dataRows : [
            {text   : "Invoice No."         , name  : "invoice_no"                  , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Invoice Date"        , name  : "invoice_date"                , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "DR No."              , name  : "dr_no"                       , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "DR Date"             , name  : "dr_date"                     , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Dealer"              , name  : "dealer_id"                   , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Organization"        , name  : "receiving_organization_id"   , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Authority"           , name  : "authority_id"                , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Transfer From"       , name  : "transfer_organization_id"    , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Stock Transfer No."  , name  : "stock_transfer_no"           , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Received By"         , name  : "received_by"                 , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Received Date"       , name  : "received_date"               , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Status"              , name  : "status_id"                   , type  : "input"       , width : 200       , style : "text-align:left;"}
        	,{text  : "Status Remarks"      , name  : "status_remarks"              , type  : "input"       , width : 200       , style : "text-align:left;"}
        ]
        ,onComplete: function(){
            //markMandatory();
        }  
    });    
}
   
function markMandatory(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["receiving_organization","authority_id"]
                ,"type":"M"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" :["Organization","Authority"]}
      ]
   });
}    