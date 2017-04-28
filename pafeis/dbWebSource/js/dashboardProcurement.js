 var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,optionId = ""
    ,g_warehouse_id = null
    ,pageName = location.pathname.split('/').pop()
    ,g_tab_name = "Purchase" //Default Tab
;

function setInputs(){
    $optionId = $("#option_id");
}

zsi.ready(function(){
    $(".pageTitle").html('<select name="dd_dashboard" id="dd_dashboard"> </select>');
    
    wHeight = $(window).height();
    setInputs();
    $optionId.fillSelect({
        data : [
             { text: "All", value: "A" }
            ,{ text: "Shopping", value: "S" }
            ,{ text: "Bidding", value: "B" }
        ]
        ,required      : true
    });
    
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_name = d.rows[0].organizationName;
            g_warehouse_id = d.rows[0].warehouse_id;
           
            $(".pageTitle").append(' for ' + g_organization_name + ' » <select name="dd_warehouses" id="dd_warehouses"></select>');
            $("#dd_dashboard").dataBind({
                url: procURL + "dd_dashboard_sel"
                , text: "page_title"
                , value: "page_name"
                , required :true
                , onComplete: function(){
                    $("#dd_dashboard").val(pageName);
                    $("#dd_dashboard").change(function(){
                        if(this.value){
                            if(this.value.toUpperCase()!== pageName.toUpperCase())
                                location.replace(base_url + "page/name/" + this.value);
                        } 
                    });
                }
            });
            $("select[name='dd_warehouses']").dataBind({
                url: execURL + "dd_warehouses_sel @user_id=" + g_user_id
                , text: "warehouse"
                , value: "warehouse_id"
                , required :true
                , onComplete: function(){
                    
                    g_warehouse_id = $("select[name='dd_warehouses'] option:selected" ).val();
                    
                    $("select[name='dd_warehouses']").change (function(){
                       if(this.value){
                            g_warehouse_id = this.value;
                       }
                    });
                }
            });  
            
            displayRecord(g_tab_name);
        }
    });
    
});

$("a[role='tab']").click(function(){
    g_tab_name = $(this).attr("id");
    $(this).tab('show');
    
    displayRecord(g_tab_name);
});

$("#btnGo").click(function(data){
    getFilterValue();
    displayRecord(g_tab_name);
});

$("#btnClear").click(function(){
    g_tab_name = "Purchase";
    option_id = "A";
    $optionId.val('A');
    
    displayRecord(g_tab_name);
});

function getFilterValue(){
    option_id = ($optionId.val() ? $optionId.val(): "");
}

function displayRecord(tab_name){
    var _dataRows = [
		{
		    text  : "PR No."   
		    , name : "procurement_code"
		    , width : 100       
		    , style : "text-align:left;"     
		    //, sortColNo: 1
		}
		,{
		    text  : "Supplier"    
		    , name : "supplier_name"   
		    , width : 150      
		    , style : "text-align:left;"
		}
		,{
		    text  : "Item No."
		    , name : "item_no"      
		    , width : 120       
		    , style : "text-align:left;"
		}
		,{ 
		    text  : "National Stock No."    
		    , name : "national_stock_no"    
		    , width : 150       
		    , style : "text-align:left;"
		}
		,{ 
		    text  : "Part No."    
		    , name : "part_no"     
		    , width : 150       
		    , style : "text-align:left;"   
		}
		,{ 
		    text  : "Nomenclature"  
		    , name : "item_name"     
		    , width : 200       
		    , style : "text-align:left;" 
		}
		
    ];
    
    if(tab_name==="Purchase"){
         _dataRows.push({
		    text  : "Ordered Qty." 
		    , name : "quantity"  
		    , width : 120       
		    , style : "text-align:right;"
		}   	
		,{
		    text  : "Delivered Qty." 
		    , name : "total_delivered_quantity"  
		    , width : 120       
		    , style : "text-align:right;"
		}
		,{
		    text  : "Balance Qty." 
		    , name : "balance_quantity"  
		    , width : 120       
		    , style : "text-align:right;"
		}
		,{
		    text  : "Unit" 
		    , name : "unit_of_measure_name"      
		    , width : 120       
		    , style : "text-align:left;"
		}
		,{
		    text  : "Unit Price"   
		    , width : 120       
		    , style : "text-align:right;"
		    ,onRender: function(d){
		        return svn(d,"unit_price").toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
		    }
		}
		,{
		    text  : "Amount"   
		    , width : 120       
		    , style : "text-align:right;"
		    ,onRender: function(d){
		        return svn(d,"amount").toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
		    }
		});
    }
    
    if(tab_name==="Repair"){
         _dataRows.push({
		    text  : "Serial No." 
		    , name : "serial_no"     
		    , width : 150       
		    , style : "text-align:left;"
		}
		,{
		    text  : "Amount"    
		    , width : 120       
		    , style : "text-align:right;"
		    ,onRender: function(d){
		        return svn(d,"amount").toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
		    }
		});  
    }
	    
    $("#tbl" + tab_name).dataBind({
	     url      : procURL + "procurement_dashboard_sel @tab_name='" + tab_name + "'"
	    ,width    : $(document).width() - 30
	    ,height   : $(document).height() - 310
	    ,isPaging : true
        ,dataRows : _dataRows
    });    
}                   
      