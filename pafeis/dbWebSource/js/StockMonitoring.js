var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
//    setInputs();
  //  setSearch();
//    displayRecords(organization_id_filter.val());
});

function setSearch(){
    var ofilterId =  $("#organization_id_filter");
    
    new zsi.search({
        tableCode: "adm-0006"
        ,colNames : ["organization_name"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"organization_name"
        ,input:"input[name=organization_name_filter]"
        ,url : execURL + "searchData"
        //,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.organization_name;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#organization_id_filter").val(data.organization_id);
            displayRecords( data.organization_id);
        }
       
    });        
}

$("#btnGo").click(function(){
  displayRecords($("#organization_name_filter").val());
});

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
function displayRecords(filter){   
    console.log(filter);
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "stock_monitoring_sel @search='"+ filter +"'" 
        ,width          : $(document).width() - 50
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :0
       // ,isPaging : true
        ,dataRows       :[
     		 { text:"Part No."                      , width:200     , style:"text-align:left;"        
     		    ,onRender: function(d){
    		        return svn(d, "part_no");
    		    }
     		 }	 
    		,{ text:"National Stock No."            , width:200     , style:"text-align:left;"    
    		      ,onRender: function(d){
    		        return svn(d, "national_stock_no");
    		    }
    		}
    		,{ text:"Item Code"                     , width:200     , style:"text-align:left;"      
    		        ,onRender: function(d){
    		        return svn(d, "item_code");
    		    }
    		 }
    		,{ text:"Item Name"                          , width:250     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "item_name");
    		    }
    		}
    		,{ text:"Item Type Name"      , width:250     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "item_type_name");
    		    }
    		}
    		,{ text:"Stock Qty."  , width:110     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "stock_qty");
    		    }
    		}
	    ]

        ,onComplete: function(){
        }
        /*
        ,onSortClick : function(colNo,orderNo){
            console.log(colNo);
            console.log(orderNo);
        }
        */
        
    });    
}

     