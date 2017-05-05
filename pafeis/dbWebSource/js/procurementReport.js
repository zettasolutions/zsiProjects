var  bs         = zsi.bs.ctrl
    ,svn        = zsi.setValIfNull
    ,$rTypeId   = ""
    ,amount     = Number(0)
    ,procMode = [
        {text:"Shopping",value:"Shopping"}
        ,{text:"Bidding",value:"Bidding"}
    ]    
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
$("select[name='procurement_mode']").fillSelect({data: procMode});
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


      //  console.log();
    
    $("#grid").dataBind({
         toggleMasterKey    : "procurement_id"
        ,height             : $(document).height() - 308 
        ,width              : $(document).width() - 25
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
                ,{text  : "Procurement No."         , name  : "procurement_code"        , width : 120           , style : "text-align:left;"}
        		,{text  : "Procurement Date"                                            , width : 180           , style : "text-align:left;"
        		    ,onRender: function(d){ return svn(d,"procurement_date").toDateFormat();}
        		}
        		,{text  : "Procurement Name"        , name  : "procurement_name"        , width : 200           , style : "text-align:left;"}
        		,{text  : "Supplier Name"           , name  : "supplier_name"           , width : 150           , style : "text-align:left;"}
        		,{text  : "Promised Delivery Date"  , name  : "promised_delivery_date"  , width : 180           , style : "text-align:left;"}
        		,{text  : "Actual Delivery Date"    , name  : "actual_delivery_date"    , width : 150           , style : "text-align:left;"}
        		,{text  : "No. of items"            , name  : "no_items"                , width : 100           , style : "text-align:right;"}
        		,{text  : "Ordered Qty."            , name  : "total_ordered_qty"       , width : 100           , style : "text-align:right;"}
        		,{text  : "Balance Qty."            , name  : "total_balance_qty"       , width : 100           , style : "text-align:right;"}
        		,{text  : "Total Amount"                                                , width : 100           , style : "text-align:right;"
        		    ,onRender: function(d){ return svn(d,"total_amount").toLocaleString('en-PH', {minimumFractionDigits: 2})}
        		}
        		,{text  : "Status Name"             , name  : "status_name"             , width : 150           , style : "text-align:center;"}
        		
	    ]  

    });
}


function displayDetail(o,id){
   
    zsi.toggleExtraRow({
         object     : o
        ,parentId   : id
        ,onLoad : function($grid){ 
            
            var toCurrency = new Intl.NumberFormat('en-PH', {
                style: 'currency', 
                currency: 'PHP', 
                minimumFractionDigits: 2,
            });

            var amt = 0;
            $grid.dataBind({
                 url        : execURL + "procurement_detail_sel @procurement_id="+ id
                 //,width     : $(document.width) -100
                ,dataRows   : [
                		 {text  : "Item No."                , name  : "item_no"                     , width : 100           , style : "text-align:left;"}
                		,{text  : "Part No."                , name  : "part_no"                     , width : 100           , style : "text-align:left;"}
                		,{text  : "National Stock No."      , name  : "national_stock_no"           , width : 150           , style : "text-align:left;"}
                		,{text  : "Item Description"        , name  : "item_description"            , width : 250           , style : "text-align:left;"}
                		,{text  : "Unit of Measure"         , name  : "unit_of_measure_code"        , width : 150           , style : "text-align:left;"}
                		,{text  : "Ordered Qty."            , name  : "ordered_qty"                 , width : 150          , style : "text-align:right;"}
                		,{text  : "Total Delivered Qty."    , name  : "total_delivered_quantity"    , width : 150           , style : "text-align:right;"}
                		,{text  : "Balance Qty."            , name  : "balance_quantity"            , width : 100           , style : "text-align:right;"}
                		,{text  : "Unit Price"              , name  : "unit_price"                  , width : 100           , style : "text-align:right;"
                		    ,onRender: function(d){ return svn(d,"unit_price").toLocaleString('en-PH', {minimumFractionDigits: 2})}
                		}
                		,{text  : "Amount"                                     , width : 100           , style : "text-align:right;"
                		    ,onRender: function(d){ amt += parseFloat(svn(d,"amount"));
                		                            return svn(d,"amount").toLocaleString('en-US', {minimumFractionDigits: 2});
                		    }
                		}
                	    ] 
                ,onComplete: function(){
                    var totalRow = "";
                    totalRow += '<div class="zRow total">'; 
                    totalRow +=    '<div class="zCell" style="width:1250px;text-align:right;"><span class="text">Total&nbsp;</span></div>';
                    totalRow +=    '<div class="zCell" style="width:100px;text-align:right;"><span class="text">' + toCurrency.format(amt) + '</span></div>';
                    totalRow += '</div>'; 
            		$grid.find(".right #table").append(totalRow);
                }        
            });    

        }
    
    });
}


                                                                                           