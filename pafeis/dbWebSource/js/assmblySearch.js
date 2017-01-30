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
        ,input:"input[name=assembly_name_filter]"
        ,url : execURL + "searchData"
        //,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.serial_no;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#serial_no_filter").val(data.serial_no);
            displayRecords( data.serial_no);
        }
    });        
}
$("#btnGo").click(function(){
   displayRecords($("#assembly_name_filter").val());
});

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
function displayRecords(filter){   
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "assembly_item_search_sel  @search='"+ filter +"'"
        ,width          : $(document).width() - 30
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        // ,isPaging : true
        ,dataRows       :[
     		 { text:"Serial No."                      , width:110     , style:"text-align:center;"        
     		    ,onRender: function(d){
    		        return svn(d, "serial_no");
    		    }
     		 }	 
    		,{ text:"Part No."            , width:100     , style:"text-align:left;"    
    		      ,onRender: function(d){
    		        return svn(d, "part_no");
    		    }
    		}
    		,{ text:"National Stock No."                     , width:130     , style:"text-align:left;"      
    		        ,onRender: function(d){
    		        return svn(d, "national_stock_no");
    		    }
    		 }
    		,{ text:"Item Name"                          , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "item_name");
    		    }
    		}
    		,{ text:"Critical level"      , width:100     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "critical_level");
    		    }
    		}
    		,{ text:"Item type name"  , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "item_type_name");
    		    }
    		}
    		,{ text:"Time since new"  , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "time_since_new");
    		    }
    		}
    		,{ text:"Time before overhaul"  , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "time_before_overhaul");
    		    }
    		}
    			,{ text:"Time since overhaul"  , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "time_since_overhaul");
    		    }
    		}
    			,{ text:"Remaining Time(hr)"  , width:140     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "remaining_time_hr");
    		    }
    		}
    			,{ text:"Remaining Time(min)"  , width:140     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "remaining_time_min");
    		    }
    		}
    		,{ text:"Date delivered"  , width:100     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "date_delivered");
    		    }
    		}
    		,{ text:"Date issued"  , width:100     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "date_issued");
    		    }
    		}
    			,{ text:"Organization name"  , width:200     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "organization_name");
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

    