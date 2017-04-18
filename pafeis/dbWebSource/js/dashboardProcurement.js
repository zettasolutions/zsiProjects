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
		    text  : "Procurement Code"   
		    , name : "procurement_code"
		    , type  : "label"       
		    , width : 150       
		    , style : "text-align:left;"     
		    //, sortColNo: 1
		}
		,{
		    text  : "Supplier"    
		    , name : "supplier"
		    , type  : "label"       
		    , width : 150      
		    , style : "text-align:left;"
		}
		,{
		    text  : "Item No."
		    , name : "item_no"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:left;"
		}
		,{ 
		    text  : "National Stock No."    
		    , name : "national_stock_no"
		    , type  : "label"       
		    , width : 150       
		    , style : "text-align:left;"
		}
		,{ 
		    text  : "Part No."    
		    , name : "part_no"
		    , type  : "label"       
		    , width : 150       
		    , style : "text-align:left;"   
		}
		,{ 
		    text  : "Nomenclature"  
		    , name : "item_name"
		    , type  : "label"       
		    , width : 200       
		    , style : "text-align:left;" 
		}
		
    ];
    
    if(tab_name==="Purchase"){
         _dataRows.push({
		    text  : "Ordered Qty." 
		    , name : "ordered_quantity"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:right;"
		}   	
		,{
		    text  : "Delivered Qty." 
		    , name : "delivered_quantity"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:right;"
		}
		,{
		    text  : "Reference No." 
		    , name : "reference_no"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:left;"
		}
		,{
		    text  : "Unit" 
		    , name : "unit"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:left;"
		}
		,{
		    text  : "Unit Price" 
		    , name : "unit_price"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:right;"
		}
		,{
		    text  : "Amount" 
		    , name : "amount"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:right;"
		});
    }
    
    if(tab_name==="Repair"){
         _dataRows.push({
		    text  : "Serial No." 
		    , name : "serial_no"
		    , type  : "label"       
		    , width : 150       
		    , style : "text-align:left;"
		}
		,{
		    text  : "Amount" 
		    , name : "amount"
		    , type  : "label"       
		    , width : 120       
		    , style : "text-align:right;"
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
   