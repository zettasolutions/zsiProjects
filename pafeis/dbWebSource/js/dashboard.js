var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,item_cat_id = zsi.getUrlParamValue("item_cat_id")
    ,optionId = zsi.getUrlParamValue("option_id")
    ,g_warehouse_id = null
    ,option_id = (optionId ? optionId : "A")
    ,pageName = location.pathname.split('/').pop()
    ,g_column_name = ""
    ,g_keyword= ""
;

function setInputs(){
    $optionId = $("#option_id");
    $keyword  = $("#keyword");
    $column   = $("#column");
}

zsi.ready(function(){
    $(".pageTitle").html('<select name="dd_dashboard" id="dd_dashboard"> </select>');
    
    wHeight = $(window).height();
    setInputs();
    $optionId.fillSelect({
        data : [
             { text: "All", value: "A" }
            ,{ text: "For Reorder", value: "R" }
        ]
        ,selectedValue : option_id
        ,defauleValue  : "A"
        ,required      : true
    });
    $("#option_id").val("A");
    
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_warehouse_id = d.rows[0].warehouse_id;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
           
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
                            displayTabs(); 
                       }
                    });
                    displayTabs();
                }
            });  
        }
    });
    
});

$("#btnGo").click(function(data){
    getFilterValue();
    displayItems(item_cat_id);
});

$("#btnClear").click(function(){
    g_keyword = "";
    g_column_name = "";
    $column.val('');
    $keyword.val('');
    displayItems(item_cat_id);
});

function getFilterValue(){
    option_id = ($optionId.val() ? $optionId.val(): "");
    g_keyword = $.trim($keyword.val());
    g_column_name = ($column.val() ? $column.val(): "");
}

function displayTabs(cbFunc){
    $.get(execURL + "item_categories_sel", function(data){
        var _rows      = data.rows;
        var tabList    = '<ul class="nav nav-tabs" role="tablist">';
        var tabContent = '<div class="tab-content">';
        var i,d;
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            var active      = (i===0 ? "active": "");
            tabList += '<li role="presentation" class="'+ active +'"><a id="'+ d.item_cat_id +'" href="#'+ d.item_cat_name +'" aria-controls="'+ d.item_cat_name +'" role="tab" data-toggle="tab">'+ d.item_cat_name +'</a></li>';
            tabContent += '<div role="tabpanel" class="tab-pane '+ active +'" id="'+ d.item_cat_name +'"><div class="zGrid" id="tabGrid'+   d.item_cat_id  +'" ></div></div>';
        }
        tabList += "</ul>";
        tabContent += "</div>";
        
        $("#tabWrapper").html(tabList + tabContent);
        
        var activeTabId = $("ul.nav-tabs").find("li.active a").attr("id");
        displayItems(activeTabId);
         
        $("a[role='tab']").click(function(){
            item_cat_id = $(this).attr("id");
            displayItems(item_cat_id);
        });
        
        //for(i=0; i < _rows.length; i++){
        //     d =_rows[i];
        //     displayItems(d.item_cat_id);
        //}
    });
} 

function displayItems(id){
    var counter = 0;
    var columnName = (g_column_name ? ",@col_name='"+ g_column_name +"'" : "");
    var keyword    = (g_keyword ? ",@keyword='"+ g_keyword +"'" : "");
    
    $("#tabGrid" + id).dataBind({
	     url      : procURL + "items_inv_sel @item_cat_id=" + id + ",@warehouse_id=" + g_warehouse_id + ",@option_id='" + option_id +"'" + columnName + keyword
	    ,width    : $(document).width() - 25
	    ,height   : $(document).height() - 310
	    ,isPaging : true
        ,dataRows : [
    		{text  : "Part No."                    , type  : "label"       , width : 150       , style : "text-align:left;"     ,sortColNo: 1
    		    ,onRender : function(d){ return  svn(d,"part_no"); }
    		}
    		,{text  : "National Stock No."           , type  : "label"       , width : 150      , style : "text-align:left;"    ,sortColNo: 2
    		    ,onRender : function(d){ return svn(d,"national_stock_no"); }
    		}
    		,{text  : "Nomenclature"                   , type  : "label"       , width : 300       , style : "text-align:left;"    ,sortColNo: 3
    		    ,onRender : function(d){ return svn(d,"item_name"); }
    		}
    		,{text  : "Nomenclature Type"                   , type  : "label"       , width : 150       , style : "text-align:left;"    ,sortColNo: 4
    		    ,onRender : function(d){ return svn(d,"item_type_name"); }
    		}
    		,{text  : "Stock Qty."                  , type  : "label"       , width : 100       , style : "text-align:right;"
    		    ,onRender : function(d){ return svn(d,"stock_qty").toLocaleString("en"); }
    		}
       		,{text  : "Reorder Level"               , type  : "label"       , width : 100       , style : "text-align:right;"
    		    ,onRender : function(d){ return svn(d,"reorder_level"); }
    		}
	    ]   
    });    
}                   
