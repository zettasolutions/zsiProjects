var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,$rTypeId    = ""
;

zsi.ready(function(){

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
         if(this.value=== "") $("#proc_code_id").val("");
     });
    
    zsi.initDatePicker();
    clearform();
    setSearch();
});

function clearform(){
    $('#date_from').val('');
    $('#date_to').val('');
    $('#proc_code').val('');
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
    dateFrom = $("#date_from").val();
    dateTo = $("#date_to").val();
    suppId = $("#supplier_id").val();
    procCodeId = $("#proc_code_id").val();
    rTypeId = $("#report_type_id").val();
    
    if(rTypeId == 1){
        $("#zPanelId").css({display:"block"});
        displayRecords();
    }   
    
    if(rTypeId == 2){
        $("#zPanelId").css({display:"block"});
        displayRecords();
    }  
    
    if(rTypeId == 3){
        $("#zPanelId").css({display:"block"});
        displayRecords();
    }
    if(rTypeId == 4){
        $("#zPanelId").css({display:"block"});
        displayRecords();
    }     
    if(rTypeId == 5){
        $("#zPanelId").css({display:"block"});
        displayRecords();
    }     

});

function displayRecords(){
    $("#grid").loadData({
        url: execURL + "procurement_summary_report_sel @date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                        + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                        + ",@supplier_id="+ (suppId ?  suppId : null) 
                        + ",@search="+ (procCodeId ? "'" + procCodeId + "'" : null)
                        + ",@report_type_id="+ (rTypeId ? "'" + rTypeId + "'" : null)
        ,td_body: [ 
             function(d){
                 return "<a name='aSummary'  procurement_id='" + d.procurement_id + "' href='javascript:void(0);'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
             }
            ,function(d){ return d.procurement_date; }
            ,function(d){ return d.procurement_code; }
            ,function(d){ return d.procurement_name; }
            ,function(d){ return d.supplier_name; }
            ,function(d){ return d.promised_delivery_date; }
            ,function(d){ return d.actual_delivery_date; }
            ,function(d){ return d.no_items; }
            ,function(d){ return d.total_ordered_qty; }
            ,function(d){ return d.total_balance_qty; }
            ,function(d){ return d.total_amount; }
            ,function(d){ return d.status_name; }
          ]
        ,onComplete:function(){
            var _id;
            $("a[name='aSummary']").expandCollapse({
                onInit  : function(obj){
                    _id = $(obj).attr("procurement_id");
                    return "<table id='data" + _id + "'></table>";
                }
               ,onAfterInit: function(){
                    displayDetail(_id);
                    
                }
          
            });
            addTREvent();

        }      

    });
}

function addTREvent(){
    var $tr = $("#grid tbody tr");
    
    var event = $._data($tr.get(0), 'events' ); 
    $tr.unbind("click");
    $tr.click(function(){
        if($(this).attr("class").indexOf("extraRow") === -1 ){
           $tr.removeClass("active");
           $(this).addClass("active"); 
        }
    });
}

function displayDetail(id){
    var formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    });
    $("#data" + id).html("<thead>"
     + "<tr>"
         + "<th >Item No.</th>"
         + "<th >Part No.</th>"
         + "<th >National Stock No.</th>"
         + "<th >Item Description</th>"
         + "<th >Unit of Measure</th>"
         + "<th >Total Ordered Qty.</th>"
         + "<th >Total Undelivered Qty.</th>" 
         + "<th >Unit Price</th>"
         + "<th >Amount</th>"
    +"</tr>"
    + "</thead>"
    + "<tfoot>"
    + "<tr>"
         + "<td ></td >"
         + "<td ></td >"
         + "<td ></td >"
         + "<td ></td >"
         + "<td ></td >"
         + "<td ></td >"
         + "<td ></td >"
         + "<td >Total</td >"
         + "<td ></td >"
     + "</tr>"
    + "</tfoot>");


    $("#data" + id).loadData({
        
        url: execURL + "procurement_detail_sel @procurement_id="+ id
       ,td_body: [
             function(d){ return d.item_no; }
            ,function(d){ return d.part_no; }
            ,function(d){ return d.national_stock_no; }
            ,function(d){ return d.item_description; }
            ,function(d){ return d.unit_of_measure_code; }
            ,function(d){ return d.total_delivered_quantity; }
            ,function(d){ return d.balance_quantity; }
            ,function(d){ return formatter.format(d.unit_price); }
            ,function(d){ return formatter.format(d.amount); }          
        ]
    });    
} 

                                                                             