var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,$rTypeId    = ""
  
;
	
zsi.ready(function(){
    //enableFilter();
    $ ("#warehouse_id").dataBind({
                           url: procURL + "dd_warehouses_sel"
                           , text: "warehouse"
                           , value: "warehouse_id"
    });
    $("select[name='dealer_id']").dataBind("dealer");
    $("select[name='supply_source_id']").dataBind( "supply_source");
    $("select[name='receiving_type_id']").dataBind( "receiving_types");
    zsi.initDatePicker();
    $('#proc_code').val('');
    clearform();
});
	
/*
function disableFilter(){
     $("#supplier_id").attr('disabled','disabled');
     $("#date_from").attr('disabled','disabled');
     $("#date_to").attr('disabled','disabled');
}

function enableFilter(){
     $("#supplier_id").removeAttr('disabled');
     $("#date_from").removeAttr('disabled');
     $("#date_to").removeAttr('disabled');
}
*/
function clearform(){
    $('#date_from').val('');
    $('#date_to').val('');
    $('select').val('');   
}

$("#btnGo").click(function(){
    /*
    if($("#receiving_type_id").val() === ""){ 
        alert("Please select Report Type.");
        return;
    }
    */
    $("#zPanelId").css({display:"block"});
    displayRecords();
});

function displayRecords(){
    var wereHId     = $("#warehouse_id").val();
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var suppSId     = $("#supply_source_id").val();
    var dealerId    = $("#dealer_id").val();
    var rTypeId     = $("#receiving_type_id").val();

    
    $("#grid").dataBind({
        
         toggleMasterKey    : "receiving_id"
        ,height             : 400 
        ,width              : $(document).width() - 27
        ,url                : execURL + "receiving_summary_report_sel @warehouse_id="+ (wereHId ? wereHId : null)
                                      + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@supply_source_id="+ (suppSId ?  suppSId : null) 
                                      + ",@dealer_id="+ (dealerId ?  dealerId : null)
                                      + ",@receiving_type="+ (rTypeId ? "'" + rTypeId + "'" : null)
        ,dataRows : [
                {text  : "&nbsp;"                                              , width : 25           , style : "text-align:left;"
                     ,onRender : function(d){
                          return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.receiving_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
                    }
                 }
        		,{text  : "Doc No."                     , name  : "doc_no"                  , width : 180           , style : "text-align:left;"}
        		,{text  : "Doc Date"                    , name  : "doc_date"                , width : 350           , style : "text-align:left;"}
        		,{text  : "Dealer"                      , name  : "dealer_name"             , width : 150           , style : "text-align:left;"}
        		,{text  : "Source"                      , name  : "supply_source"           , width : 250           , style : "text-align:left;"}
        		,{text  : "Received By"                 , name  : "received_by_name"        , width : 250           , style : "text-align:left;"}
        		,{text  : "Date Received"               , width : 150           , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"received_date").toDateFormat(); }
        		}
        		,{text  : "Receiving Warehouse"         , name  : "receiving_warehouse"     , width : 150           , style : "text-align:left;"}

	    ]  

    });
}

 
function displayDetail(o,id){
    zsi.toggleExtraRow({
         object     : o
        ,parentId   : id
        ,onLoad : function($grid){ 
            
            /*  
            var formatter = new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP',
              minimumFractionDigits: 2,
            });
            */
            $grid.dataBind({
                // width      : $(document).width() - 49
                 url        : procURL + "receiving_details_sel @receiving_id="+ id
                ,dataRows   : [
                         {text  : "Part No."                , name  : "part_no"                    , width : 150       , style : "text-align:left;"}
                        ,{text  : "Nat'l Stock No."         , name  : "national_stock_no"          , width : 150       , style : "text-align:left;"}
                        ,{text  : "Nomenclature"            , name  : "item_name"                  , width : 150       , style : "text-align:left;"}
                		,{text  : "Serial No."              , name  : "serial_no"                  , width : 150       , style : "text-align:left;"}
                        ,{text  : "Manufacturer"            , name  : "manufacturer_id"            , width : 150       , style : "text-align:left;"} 
                        ,{text  : "Unit of Measure"         , name  : "unit_of_measure_id"         , width : 150       , style : "text-align:left;"}
                        ,{text  : "Quantity"                , name  : "quantity"                   , width : 100       , style : "text-align:left;"}
                        ,{text  : "Item Class"              , name  : "item_class_id"              , width : 150       , style : "text-align:left;"}
                        ,{text  : "Time Since New"          , name  : "time_since_new"             , width : 150       , style : "text-align:left;"}
                        ,{text  : "Time Since Overhaul"     , name  : "time_since_overhaul"        , width : 150       , style : "text-align:left;"}
                        ,{text  : "Status"                  , name  : "status_id"                  , width : 150       , style : "text-align:left;" }
                        ,{text  : "Remarks"                 , name  : "remarks"                    , width : 260       , style : "text-align:left;"}
                	    ]                      });    

        }
    
    });
}

                                                                                          