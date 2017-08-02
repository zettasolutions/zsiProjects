var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var wingFilter = null
    ,squadronFilter = null
    ,warehouseFilter = null
    ,statusFilter = null
    ,fieldFilter = ""
    ,keywordFilter = ""
    ,g_organization_id = null;
    
zsi.ready(function(){
    setInputs();
    loadWing();
    loadSquadron();
    loadWarehouse();
    loadStatus();
});

function setInputs(){
    $wingFilter = $("#wing_filter");
    $squadronFilter = $("#squadron_filter");
    $warehouseFilter = $("#warehouse_filter");
    $statusFilter = $("#status_filter");
    $fieldFilter = $("#field_filter");
    $keywordFilter = $("#keyword_filter");
}

function loadWing(){
    $wingFilter.dataBind({
        url: procURL + "dd_organizations_sel @organization_type_code='Wing',@squadron_type=''" 
        , text: "organization_name"
        , value: "organization_id"
        , onComplete: function(){
            $wingFilter.change(function(){
                g_organization_id = (this.value !==""? this.value: null);
                loadSquadron();
            });
        }
    });
}

function loadSquadron(){
    $squadronFilter.dataBind({
        url: procURL + "dd_organizations_sel @organization_id="+ g_organization_id +",@squadron_type='Supply'" 
        , text: "organization_name"
        , value: "organization_id"
    });
}

function loadWarehouse(){
    $warehouseFilter.dataBind({
       url: procURL + "dd_warehouses_sel"
       , text: "warehouse"
       , value: "warehouse_id"
    });
}

function loadStatus(){
    $statusFilter.dataBind({
        url: execURL + "statuses_sel @is_item='Y'"
        ,text: "status_name"
        ,value: "status_id"
    });
}

function setSearch(){
    new zsi.search({
        tableCode: "adm-0007"
        ,colNames : ["serial_no"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"serial_no"
        ,input:"input[name=stock_search_filter]"
        ,url : execURL + "searchData"
        //,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.serial_no;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#stocks_search_id_filter").val(data.serial_no);
            displayRecords();
        }
    });        
}

$("#btnGo").click(function(){
    squadronFilter = ($squadronFilter.val()!==""? $squadronFilter.val() : null);
    warehouseFilter = ($warehouseFilter.val()!==""? $warehouseFilter.val() : null);
    statusFilter = ($statusFilter.val()!==""? $statusFilter.val() : null);
    fieldFilter = $fieldFilter.val();
    keywordFilter = $.trim($keywordFilter.val());
    displayRecords();
});

function clearGrid(){
    $("#" + tblName).clearGrid();
}
    
function displayRecords(){   
    //console.log(filter);
    var rownum=0;
    if(keywordFilter==="")
    {
        $("#grid").dataBind({
	     url   : execURL + "stock_monitoring_sel @squadron_id="+ squadronFilter +",@aircraft_type_id="+ typeFilter +",@status_id="+ statusFilter +",@field='"+ fieldFilter +"', @search='"+keywordFilter+"'" 
        ,width          : $(document).width() - 25
	    ,height         : $(document).height() - 360
	   // ,selectorType   : "checkbox"
        ,blankRowsLimit :0
       // ,isPaging : true
        ,dataRows       :[
     		 { text:"Result"                      , width:$(document).width() - 56     , style:"text-align:center;"        
     		    ,onRender: function(d){
    		        return svn(d, "result");
    		    }
     		 }	 
     		 ]});
    }
    else{
    $("#grid").dataBind({
	     url   : execURL + "stock_monitoring_sel @field='"+field_name+"', @search='"+keyword+"'" 
        ,width          : $(document).width() - 25
	    ,height         : $(document).height() - 250
	   // ,selectorType   : "checkbox"
        ,blankRowsLimit :0
       // ,isPaging : true
        ,dataRows       :[
     		 { text:"Part No."                      , width:150     , style:"text-align:left;"        
     		    ,onRender: function(d){
    		        return svn(d, "part_no");
    		    }
     		 }	 
    		,{ text:"National Stock No."            , width:180     , style:"text-align:left;"    
    		      ,onRender: function(d){
    		        return svn(d, "national_stock_no");
    		    }
    		}
    		
    		,{ text:"Nomenclature Name"                          , width:300     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "item_name");
    		    }
    		}
    		,{ text:"Unit of Measure"      , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "unit_of_measure");
    		    }
    		}
    		,{ text:"Available Stocks"  , width:150     , style:"text-align:center;"
    		    ,onRender: function(d){
    		        return svn(d, "stock_qty");
    		    }
    		}
    		,{ text:"Warehouse Location"  , width:200   , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "warehouse_location");
    		    }
    		}
    		,{ text:"Bin"  , width:100   , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "bin");
    		    }
    		}
	    ]

	    ,onComplete: function(){
	        $("#grid").removeClass("hide");
        }
    });   
    }
}       