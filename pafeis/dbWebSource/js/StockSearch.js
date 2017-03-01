 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var g_user_id = null;

zsi.ready(function(){
//    setInputs();
  //  setSearch();
//    displayRecords(organization_id_filter.val());
  
    displayWarehouse();
    loadCategories();
    loadTypes();
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
           
        }
    });
});

/*
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
*/
$("#btnGo").click(function(){
  displayRecords($("#stock_search_filter").val());
});

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
function displayRecords(filter){   
    console.log(filter);
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "stock_monitoring_sel @search='"+ filter +"'" 
        ,width          : $(document).width() - 80
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
    		,{ text:"Item Name"                          , width:300     , style:"text-align:left;"
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

function setCheckedParameters(pText,pValue,isChecked,onComplete){
    var isFound=false;
    var index=-1;

    for(var x=0;x<parameters.length;x++){
        index=x;
       if(parameters[x].text.toLowerCase()===pText.toLowerCase()  &&  parameters[x].value.toLowerCase()===pValue.toLowerCase()  ){
           isFound=true;
           break;
       }
    }

    if(isChecked){
        if(!isFound) parameters.push({text:pText,value:pValue});
    }else{
        if(isFound) parameters.splice(index,1);
        switch(pText){
            case "my" :cleanParameters("my"); break;
            case "vt" :cleanParameters("my,vt"); break;
            case "oem" :cleanParameters("my,vt,oem"); break;
            default:break;
            
        }
    } 
    
    if(tmr) clearTimeout(tmr);
    tmr =setTimeout(function(){    
            onComplete();
    }, 50);   
}

function cleanParameters(group){
    var _params = [];
    for(var x=0;x<parameters.length;x++){
        index=x;
       if(group.toLowerCase().indexOf( parameters[x].text.toLowerCase()) > -1 )  _params.push(parameters[x]);
    }    
    parameters=_params;
}
function displayWarehouse(id){   
   var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#WarehouseGrid").dataBind({
	     url   : procURL + "dd_warehouses_sel" 
        ,width          : 310
	    ,height         : 70
	    ,selectorType   : "checkbox"
        //,blankRowsLimit :0
       // ,isPaging : trues
        ,dataRows       :[
     		 {text  : cb                   , width:25     , style:"text-align:left;"        
     		    ,onRender: function(d){     return    bs({name:"warehouse"   ,value: svn (d,"warehouse")    ,type:"hidden"})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
    		    }
     		 }
     	
     		 ,{ text:""
                , width: 250       
                , style: "text-align:left;"
                , class: "test"
                , onRender: function(d) { 
                    return     d.warehouse;
                }
            }
    		
	    ]
        ,onComplete: function(){
             //$("#cbFilter1").setCheckEvent("#WarehouseGrid input[name='cb']");
             
            var jCBName = "#WarehouseGrid input[name='cb']";
            $("#cbFilter1").setCheckEvent(jCBName);
           
            
            $("#cbFilter1").change(function(){
            
                if( ! this.checked ) {
                    $("#cbFilter2").hide();
                    $("#cbFilter3").hide();
                    $("#cbFilter4").hide();
                    
                }
            });/*
            //add checkboxes event.
            $(jCBName).change(function(){
                var val = $(this.parentNode).find("input[type='hidden']").val();
                setCheckedParameters(
                     "my"
                    ,val
                    ,this.checked
                    ,function(){
                        $("#vehicleTypeGrid").clearGrid();
                        $("#oemGrid").clearGrid();
                        $("#vehicleModelGrid").clearGrid();
                        
                        $("#cbFilter2").prop('checked',false);
                        $("#cbFilter3").prop('checked',false);
                        $("#cbFilter4").prop('checked',false);
                        clearImages();
                        
                        displayVehicleType();  
                    }
                );
            });
            $("#modelyearGrid").setEventOnTRClickForSelection();*/
        }
    });    
}
function loadCategories(callback) {
    var select = $("#stocksearch #item_cat_id");
    $(select).dataBind({
        url: base_url + "selectoption/code/item_category"
        , onComplete : function(){
            if (callback) callback();
        }
    });
}
function loadTypes(callback) {
    var select = $("#stocksearch #item_type_id");
    $(select).dataBind({
        url: base_url + "selectoption/code/item_type"
        , onComplete : function(){
            if (callback) callback();
        }
    });
}
            