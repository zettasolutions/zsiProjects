var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,$rTypeId       = ""
  
     ,g_masterData  =   null
    ,g_masterIds    =   ""
    ,g_imgData      =   null
;


imgToBase64( base_url + 'images/airforce-logo.jpg'  , function(img){
    g_imgData = img;
});


function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "fullWidth"
                        , title: "PDF Report"
                        , body: '<iframe id="ifrmWindow" frameborder="0"></iframe>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}





zsi.ready(function(){
    getTemplate();
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


$("#btnDis").click(function(){
    if($("#receiving_type_id").val() === ""){ 
        alert("Please select Receiving Type.");
        return;
    }
    $("#zPanelId").css({display:"block"});
    displayRecords();
    $("#btnPdf").css({display:"block"});
});




$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Receiving Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "Receiving.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
        ,masterKey          : "Receiving_id"
        ,detailColumn       : [   
                                 {name:"part_no"                    ,title:"Part No."               ,width:100}
                                ,{name:"national_stock_no"          ,title:"Nat'l Stock No."        ,width:100}
                                ,{name:"item_name"                  ,title:"Nomenclature."          ,width:150}
                                ,{name:"unit_of_measure_id"         ,title:"Unit Measure"           ,width:75}
                                ,{name:"quantity"                   ,title:"Quantity"               ,width:75}
                            ]
        ,masterData         : g_masterData
        ,detailData         : g_detailData
        ,onPrintHeader      : function(o){
            if (g_imgData) {
                o.doc.addImage(g_imgData, 'JPEG', o.margin.left,  o.row, 50, 50);
            }
            o.row +=27;
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left + 60, o.row, "Philippine Airforce");
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Receiving Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 
            o.doc.text(25, o.row, "Warehouse");
            o.doc.text(125, o.row, ": "  + o.data.warehouse_id);

            o.doc.text(300, o.row, "Dealer");
            
            o.doc.text(400, o.row,  ": "  + o.data.dealer_name);
            
            //new row
            o.row +=18; 
            o.doc.text(300, o.row, "Supply Source");
            o.doc.text(400, o.row, ": "  + o.data.supply_source);
             
            o.doc.text(25, o.row, "Receiving Type");
            o.doc.text(125, o.row, ": "  + o.data.receiving_type);
            
            return o.row;    
        }  
    });         
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
        		,{text  : "Receiving Warehouse"         , name  : "receiving_warehouse"     , width : 250           , style : "text-align:left;"}

	    ]  

     ,onComplete : function(data){
	        g_masterData = data.rows;
	        g_masterIds = "";
	        for(var x =0;x<g_masterData.length;x++ ){
	               if(g_masterIds!=="") g_masterIds +=",";
	                g_masterIds  += g_masterData[x].receiving_id;

	        }
	        $.post(procURL + "receiving_details_sel @master_ids='" + g_masterIds + "'" ,function(data){
	           g_detailData = data.rows;
	        });
	        
	    }

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
                        ,{text  : "Nomenclature"            , name  : "item_name"                  , width : 200       , style : "text-align:left;"}
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

                                                                                                    