var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
 
});

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
            displayRecords( data.serial_no);
        }
    });        
}

$("#btnGo").click(function(){
  displayRecords($("#field_search").val(),$("#stock_search_filter").val());
});

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
    
function displayRecords(field_name,keyword){   
    //console.log(filter);
    var rownum=0;
    if(keyword==="")
    {
        $("#grid").dataBind({
	     url   : execURL + "stock_monitoring_sel @field='"+field_name+"', @search='"+keyword+"'" 
        ,width          : $(document).width() - 50
	    ,height         : $(document).height() - 250
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
        ,width          : $(document).width() - 50
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
        }
    });   
    }
}   