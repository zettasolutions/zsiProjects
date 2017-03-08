var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,$rTypeId    = ""
;
 
	
	
zsi.ready(function(){
    enableFilter();
    $("#supplier_id").dataBind( "supply_source");
        $ ("#report_type_id").dataBind({
                               url: execURL + "dd_procurement_report_type_sel"
                               , text: "report_type"
                               , value: "report_type_id"
        
        ,onComplete: function(){
            $("#report_type_id").change(function(){
                rTypeId = this.value;
                if(rTypeId === "") $("#zPanelId").css({display:"none"});
            });
        }
                                
        });
     $("#proc_code_id").val("");
     $("input[name=proc_code]").on("keyup change", function(){
         clearform();
         disableFilter();
         if(this.value=== ""){ 
             $("#proc_code_id").val("");
             enableFilter();
          }     });
    
    zsi.initDatePicker();
    $('#proc_code').val('');
    clearform();
    setSearch();
});
	

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

function clearform(){
    $('#date_from').val('');
    $('#date_to').val('');
    $('select').val('');   
}

function setSearch(){
    new zsi.search({
        tableCode: "ref-0030"
        ,colNames : ["procurement_code"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"procurement_code"
        ,input:"input[name=proc_code]"
        ,url : execURL + "searchData"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.procurement_code;
            $("#proc_code_id").val(data.procurement_id);
       }
    });        
}

$("#btnGo").click(function(){
    if($("#report_type_id").val() === ""){ 
        alert("Please select Report Type.");
        return;
    }
    $("#zPanelId").css({display:"block"});
    displayRecords();
});

function displayRecords(){
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var suppId      = $("#supplier_id").val();
    var procId      = $("#proc_code_id").val();
    var rTypeId     = $("#report_type_id").val();
    
    $("#grid").dataBind({
        
         toggleMasterKey    : "procurement_id"
        ,height             : 400 
        ,width              : 1000
        ,url                : execURL + "procurement_summary_report_sel @date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@supplier_id="+ (suppId ?  suppId : null) 
                                      + ",@procurement_id="+ (procId ?  procId : null)
                                      + ",@report_type_id="+ (rTypeId ? rTypeId  : null)
        ,dataRows : [
                {text  : "&nbsp;"                                              , width : 25           , style : "text-align:left;"
                     ,onRender : function(d){
                          return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.procurement_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
                    }
                 }
        		,{text  : "Procurement Date"        , name  : "procurement_date"        , width : 180           , style : "text-align:left;"}
        		,{text  : "Procurement Name"        , name  : "procurement_name"        , width : 350           , style : "text-align:left;"}
        		,{text  : "Supplier Name"           , name  : "supplier_name"           , width : 150           , style : "text-align:left;"}
        		,{text  : "promised_delivery_date"  , name  : "promised_delivery_date"  , width : 150           , style : "text-align:left;"}
        		,{text  : "actual_delivery_date"    , name  : "actual_delivery_date"    , width : 150           , style : "text-align:left;"}
        		,{text  : "no_items"                , name  : "no_items"                , width : 150           , style : "text-align:left;"}
        		,{text  : "total_ordered_qty"       , name  : "total_ordered_qty"       , width : 150           , style : "text-align:left;"}
        		,{text  : "total_balance_qty"       , name  : "total_balance_qty"       , width : 150           , style : "text-align:left;"}
        		,{text  : "total_amount"            , name  : "total_amount"            , width : 150           , style : "text-align:left;"}
        		,{text  : "status_name"             , name  : "status_name"             , width : 150           , style : "text-align:left;"}
        		
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
            $grid.dataBindGrid({
                 width              : 1000
                ,url: execURL + "procurement_detail_sel @procurement_id="+ id
                ,dataRows : [
                		 {text  : "Item No."                , name  : "item_no"                     , width : 180           , style : "text-align:left;"}
                		,{text  : "Part No."                , name  : "part_no"                     , width : 350           , style : "text-align:left;"}
                		,{text  : "National Stock No."      , name  : "national_stock_no"           , width : 150           , style : "text-align:left;"}
                		,{text  : "Item Description"        , name  : "item_description"            , width : 150           , style : "text-align:left;"}
                		,{text  : "Unit of Measure"         , name  : "unit_of_measure_code"        , width : 150           , style : "text-align:left;"}
                		,{text  : "Total Delivered Qty."    , name  : "total_delivered_quantity"    , width : 150           , style : "text-align:left;"}
                		,{text  : "Balance Qty."            , name  : "balance_quantity"            , width : 150           , style : "text-align:left;"}
                		,{text  : "Unit Price"              , name  : "unit_price"                  , width : 150           , style : "text-align:left;"}
                		,{text  : "Amount"                  , name  : "amount"                      , width : 150           , style : "text-align:left;"}
                	    ]          
            });    

        }
    
    });
}

                                                                               