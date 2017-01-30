var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var g_receiving_id;

zsi.ready(function(){

});

function initWarehouseReceivingDetailsTemplate(receiving_id){
    g_receiving_id = receiving_id;
    displayWarehouseReceivingDetailsRecords(g_receiving_id);
}
        
$("#wrdBtnSave").click(function () {
   $("#warehouseReceivingDetailsGrid").jsonSubmit({
            procedure: "warehouse_receiving_details_upd"
            , onComplete: function (data) {
                $("#warehouseReceivingGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayWarehouseReceivingDetailsRecords(g_receiving_id);
            }
    });
});

function displayWarehouseReceivingDetailsRecords(id){
     $("#warehouseReceivingDetailsGrid").dataBind({
	     url            : execURL + "warehouse_receiving_details_sel @receiving_id=" + id
	    ,width          : 850
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"receiving_detail_id", type:"hidden",value: svn (d,"receiving_detail_id")})
                		                        + bs({name:"receiving_id",type:"hidden", value: id})
                                                +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Item"                    , name  : "item_id"                     , type  : "select"          , width : 150       , style : "text-align:left;"}
        		,{text  : "Unit of Measure"         , name  : "unit_of_measure_id"          , type  : "select"          , width : 200       , style : "text-align:left;"}
        		,{text  : "Quantity"                , name  : "quantity"                    , type  : "input"           , width : 200       , style : "text-align:left;"}
	    ]   
    	     ,onComplete: function(){
                $("select[name='item_id']").dataBind("items");
                $("select[name='unit_of_measure_id']").dataBind("unit_of_measures");
                markMandatory();
        }  
    });    
}
   
$("#wrdBtnReset").click(function(){
    displayWarehouseReceivingDetailsRecords(g_receiving_id);
});

function markMandatory(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["quantity"]
                ,"type":"M"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" :["Quantity"]}
      ]
   });
}   