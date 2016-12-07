var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var item_cat_id = zsi.getUrlParamValue("item_cat_id");

zsi.ready(function(){
    displayTabs();
    wHeight = $(window).height();
});
 
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
        
        
        for(i=0; i < _rows.length; i++){
             d =_rows[i];
             displayItems(d.item_cat_id);
        }
        
        
    });
} 

function displayItems(id){
    var counter = 0;
    $("#tabGrid" + id).dataBind({
	     url            : procURL + "items_inv_sel @item_cat_id=" + id
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,blankRowsLimit: 5
        ,isPaging : false
        ,dataRows : [
        		 {text  : "Part No."                    , type  : "label"       , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
        		                                    + svn(d,"part_no"); }
        		}
        		,{text  : "National Stock No."           , type  : "label"       , width : 120      , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"national_stock_no"); }
        		}
        		,{text  : "Item Name"                   , type  : "label"       , width : 300       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"item_name"); }
        		}
        		,{text  : "Reorder Level"               , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"reorder_level"); }
        		}
        		,{text  : "Organization"                , type  : "label"       , width : 300       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"organization_id"); }
        		}
        		,{text  : "Stock Qty."                  , type  : "label"       , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"stock_qty"); }
        		}
        		,{text  : "Active?"                     , type  : "label"       , width : 75        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"is_active"); }
        		}
        		,{text  : "Item Code"                   , type  : "label"       , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"item_code"); }
        		}
        		,{text  : "Item Type"                   , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"item_type_name"); }
        		}


	    ]   
    });    
}  