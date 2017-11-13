var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,item_cat_id = zsi.getUrlParamValue("item_cat_id")
    ,g_warehouse_id = null
    ,pageName = location.pathname.split('/').pop()
    ,g_column_name = ""
    ,g_keyword= ""
;

function setInputs(){
    $keyword  = $("#keyword");
    $column   = $("#column");
}

zsi.ready(function(){
    wHeight = $(window).height();
    setInputs();

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
                            displayRecords();
                       }
                    });
                     displayRecords();
                }
            });  
        }
    });
    
});

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "item_status_upd"
            ,optionalItems: ["item_id"]
            ,onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

$("#btnGo").click(function(data){
    getFilterValue();
    displayRecords(g_warehouse_id);
});

$("#btnClear").click(function(){
    g_keyword = "";
    g_column_name = "";
    $column.val('');
    $keyword.val('');
    displayRecords(g_warehouse_id);
});

function getFilterValue(){
    g_keyword = $.trim($keyword.val());
    g_column_name = ($column.val() ? $column.val(): "");
}

function displayRecords(){
     var columnName = (g_column_name ? ",@col_name='"+ g_column_name +"'" : "");
     var keyword    = (g_keyword ? ",@keyword='"+ g_keyword +"'" : "");
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     if(!g_warehouse_id) {alert("Warehouse is required");return;}
     $("#grid").dataBind({
	     url            : execURL + "items_inv_with_serials_sel @warehouse_id='" + g_warehouse_id +"'" + columnName + keyword
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
                		                            + bs({name:"is_edited",type:"hidden"})
                                                    + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Serial #"                , name  : "serial_no"                                       , width : 120       , style : "text-align:left;"}
        		,{text  : "Part No."                , name  : "part_no"                                         , width : 100       , style : "text-align:left;"}
        		,{text  : "National Stock No."      , name  : "national_stock_no"                               , width : 200       , style : "text-align:left;"}
        		,{text  : "Nomenclature"            , name  : "item_name"                                       , width : 400       , style : "text-align:left;"}        		
        		,{text  : "Remaining Time"          , name  : "remaining_time"       , type  : "input"          , width : 120       , style : "text-align:left;"}        		
        		,{text  : "Status"                  , name  : "status_id"            , type  : "select"         , width : 150       , style : "text-align:center;"}
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='status_id']").dataBind({
                    url: execURL + "statuses_sel @is_item=Y"  
                        , text: "status_name"
                        , value: "status_id"
                });
        }  
    });    
}              
         