  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "items_upd"
            , optionalItems: ["item_code_id","manufacturer_id","dealer_id","supply_source_id","aircraft_info_id","status_id"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "items_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Item Code"               , name  : "item_code_id"            , type  : "select"        , width : 100       , style : "text-align:left;"}
        		,{text  : "Serial No."              , name  : "serial_no"               , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Manufacturer"            , name  : "manufacturer_id"         , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Dealer"                  , name  : "dealer_id"               , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Supply Source"           , name  : "supply_source_id"        , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Time Since New"          , name  : "time_since_new"          , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Time Before Overhaul"    , name  : "time_before_overhaul"    , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Time Since Overhaul"     , name  : "time_since_overhaul"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Remaining Time (Hrs.)"    , name  : "remaining_time_hr"      , type  : "input"        , width : 150       , style : "text-align:left;"}
        		,{text  : "Remaining Time (Min.)"  , name  : "remaining_time_min"       , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Date Delivered"          , name  : "date_delivered"          , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Aircraft"                , name  : "aircraft_info_id"        , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Date Issued"             , name  : "date_issued"             , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Status"                  , name  : "status_id"               , type  : "select"        , width:150          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ]   
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='item_code_id']").dataBind( "item_code");
                $("select[name='manufacturer_id']").dataBind( "manufacturer");
                $("select[name='dealer_id']").dataBind( "dealer");
                $("select[name='supply_source_id']").dataBind( "supply_source");
                $("select[name='aircraft_info_id']").dataBind( "aircraft_info");
                $("select[name='status_id']").dataBind( "status");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                           