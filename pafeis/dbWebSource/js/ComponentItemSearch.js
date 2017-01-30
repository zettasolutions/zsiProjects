var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
     setSearch();

});

function setSearch(){
    new zsi.search({
        tableCode: "adm-0008"
        ,colNames : ["part_no"] 
        ,displayNames : ["Part No."]  
        ,searchColumn :"part_no"
        ,input:"input[name=component_item_filter_name]"
        ,url : execURL + "searchData"
        //,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.part_no;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#component_item_filter_id").val(data.part_no);
            displayRecords( data.part_no);
        }
    });        
}
$("#btnGo").click(function(){
   displayRecords($("#component_item_filter_id").val());
});

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
function displayRecords(filter){ 
    var rownum=0;
    $("#grid").dataBind({
	     url   : procURL + "component_item_search_sel @search='"+ filter +"'" 
        ,width          : $(document).width() - 250
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :0
        ,dataRows       :[
     		 { text:"Part No."                      , width:150      , style:"text-align:center;"        
     		    ,onRender: function(d){return svn(d, "part_no");}
     		 }	 
    		,{ text:"National Stock No."             , width:150     , style:"text-align:left;"    
    		      ,onRender: function(d){ return svn(d, "national_stock_no");}
    		}
    		,{ text:"Item Code"                      , width:150     , style:"text-align:left;"      
    		        ,onRender: function(d){return svn(d, "item_code");}
    		 }
    		,{ text:"Item Name"                      , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){return svn(d, "item_name");}
    		}
    		,{ text:"Item Type Name"                  , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){return svn(d, "item_type_name");}
    		}
    		,{ text:"Stock Qty."                      , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){ return svn(d, "stock_qty");}
    		}
	    ]

    
    });    
}

        