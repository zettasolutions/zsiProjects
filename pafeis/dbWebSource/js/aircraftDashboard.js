 var bs     = zsi.bs.ctrl
    ,svn    = zsi.setValIfNull
    ,g_user_id = null
    ,g_squadron_id = null
    ,g_organization_name = ""
    ,pageName = location.pathname.split('/').pop();

zsi.ready(function(){
    $(".pageTitle").html('<select name="dd_dashboard" id="dd_dashboard"> </select>');
    
    getUserInfo(function(){
        $(".pageTitle").append(' for » <select name="dd_squadron" id="dd_squadron"></select>');
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
        
        $("#dd_squadron").dataBind({
            url: procURL + "dd_organizations_sel @squadron_type='aircraft'"
            , text: "organization_name"
            , value: "organization_id"
            , required :true
            , onComplete: function(){
                g_squadron_id = $("select#dd_squadron option:selected").val();
                if(g_squadron_id) displayTabs();
                
                $("select#dd_squadron").change (function(){
                    g_squadron_id = null;
                    $("#tabWrapper").empty();
                    if(this.value)
                        g_squadron_id = this.value;
                        
                    displayTabs();
                });
            }
        });  
    });
});

//$("#btnGo").click(function(data){
//    displayTabs();
//});

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_name = d.rows[0].organizationName;
        }
        if(callBack) callBack();
    });
}

function displayTabs(cbFunc){
    $.get(execURL + "aircraft_info_sel @squadron_id="+ (g_squadron_id ? g_squadron_id : null), function(data){
        var _rows      = data.rows;
        var tabList    = '<ul class="nav nav-tabs" role="tablist">';
        var tabContent = '<div class="tab-content">';
        var i,d;
        
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            var active      = (i===0 ? "active": "");
            tabList += '<li role="presentation" class="'+ active +'"><a id="'+ d.aircraft_info_id +'" href="#tab'+ d.aircraft_info_id +'" aria-controls="'+ d.item_cat_name +'" role="tab" data-toggle="tab">'+ d.aircraft_name +'</a></li>';
            tabContent += '<div role="tabpanel" class="tab-pane '+ active +'" id="tab'+ d.aircraft_info_id +'"><div class="zGrid" id="tabGrid'+   d.aircraft_info_id  +'" ></div></div>';
        }
        tabList += "</ul>";
        tabContent += "</div>";
        
        $("#tabWrapper").html(tabList + tabContent);
        
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            displayItems(d.aircraft_info_id);
        }
    });
} 

function displayItems(id){
    var counter = 0;
    $("#tabGrid" + id).dataBind({
	     url            : execURL + "items_sel @aircraft_info_id=" + id
	    ,width          : $(document).width() - 30
	    ,height         : $(document).height() - 250
        ,dataRows : [
        		 {text  : "Item Code"                   , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return   bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
        		                                    + svn(d,"item_code"); }
        		}
        		,{text  : "Part No."                    , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"part_no"); }
        		}
        		,{text  : "National Stock No."           , type  : "label"       , width : 150      , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"national_stock_no"); }
        		}
        		,{text  : "Nomenclature"                   , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"item_name"); }
        		}
           		,{text  : "Category"               , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"category"); }
        		}
        		,{text  : "Item Type"                   , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"item_type_name"); }
        		}
        		,{text  : "Remaining Time in Hours"   , type  : "label"       , width : 150       , style : "text-align:center;"
        		    ,onRender : function(d){ return svn(d,"remaining_time_hr"); }
        		}
        		//,{text  : "<div id='colspan'>Minutes</div>"                   , type  : "label"       , width : 120       , style : "text-align:center;"
        		//    ,onRender : function(d){ return svn(d,"remaining_time_min"); }
        		//}
                ,{text  : "Critical Level"                   , type  : "label"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"critical_level"); }
        		}
	    ]   
    });    
}     