var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,$rTypeId    = ""
    ,receivingType= [
             {text:"Supplier",value:"S"}
            ,{text:"Donation",value:"D"}
            ,{text:"Transfer",value:"T"}
            ,{text:"Aircraft",value:"A"}
        ]      
;
	
zsi.ready(function(){
    //enableFilter();
    $("select[name='dealer_id']").dataBind("dealer");
    $("select[name='supp_source_id']").dataBind( "supply_source");
    $ ("#receiving_type_id").fillSelect({
             text: "report_type"
           , value: "report_type_id"
    });
    $("select[name='receiving_type_id']").fillSelect({data: receivingType});

    zsi.initDatePicker();
    $('#proc_code').val('');
    clearform();
   // setSearch();
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
/*
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
*/
$("#btnGo").click(function(){
    console.log($("#receiving_type_id").val());
    /*
    if($("#receiving_type_id").val() === ""){ 
        alert("Please select Receiving Type.");
        return;
    }
    */
    $("#zPanelId").css({display:"block"});
    displayRecords();
});

function displayRecords(){
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var suppSId     = $("#supp_source_id").val();
    var dealerId    = $("#dealer_id").val();
    var rTypeId     = $("#receiving_type_id").val();
    
    $("#grid").dataBind({
        
         toggleMasterKey    : "procurement_id"
        ,height             : 400 
        ,width              : $(document).width() - 27
        ,url                : execURL + "receiving_sel @date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@supp_source_id="+ (suppSId ?  suppSId : null) 
                                      + ",@dealer_id="+ (dealerId ?  dealerId : null)
                                      + ",@receiving_type_id="+ (rTypeId ? rTypeId  : null)
        ,dataRows : [
                {text  : "&nbsp;"                                              , width : 25           , style : "text-align:left;"
                     ,onRender : function(d){
                          return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.procurement_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
                    }
                 }
        		,{text  : "Doc No."                     , name  : "doc_no"              , width : 180           , style : "text-align:left;"}
        		,{text  : "Doc Date"                    , name  : "doc_date"            , width : 350           , style : "text-align:left;"}
        		,{text  : "Supplier Source"             , name  : "supply_source_name"  , width : 150           , style : "text-align:left;"}
        		,{text  : "Promised Delivery Date"      , name  : "received_by_name"    , width : 250           , style : "text-align:left;"}
        		,{text  : "Actual Delivery Date"        , name  : "received_date"       , width : 250           , style : "text-align:left;"}
        		,{text  : "No. of Items"                , name  : "status_name"         , width : 150           , style : "text-align:left;"}
        		,{text  : "Total Ordered Qty."          , name  : "status_remarks"      , width : 150           , style : "text-align:left;"}

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
                 url        : execURL + "procurement_detail_sel @procurement_id="+ id
                ,dataRows   : [
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

                                                                                       