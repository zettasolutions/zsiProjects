var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,$rTypeId    = ""
    ,g_masterData   =   null
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
    
    $("select[name='issuance_type_id']").dataBind( "issuance_types");
    
    zsi.initDatePicker();
    $('#proc_code').val('');
    clearform();
    });

/*function disableFilter(){
     //$("#supplier_id").attr('disabled','disabled');
     $("#date_from").attr('disabled','disabled');
     $("#date_to").attr('disabled','disabled');
}

function enableFilter(){
     //$("#supplier_id").removeAttr('disabled');
     $("#date_from").removeAttr('disabled');
     $("#date_to").removeAttr('disabled');
}*/

function clearform(){
    $('#date_from').val('');
    $('#date_to').val('');
    $('select').val('');   
}

$("#btnGo").click(function(){
    
    if($("#issuance_type_id").val() === ""){ 
        alert("Please select Issuance Type.");
        return;
    }
    

    $("#zPanelId").css({display:"block"});
    displayRecords();
    $("#btnPdf").css({display:"block"});
});
    

$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Issuance Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "Issuance.pdf"  
        ,rowHeight          : 16
        ,widthLimit         : 520
        ,pageHeightLimit    : 550
        ,masterKey          : "Issuance_id"
        /*
        ,masterColumn       :  [   
                                 {name:"warehouse_id"       ,title:"Warehouse"       ,titleWidth:100 ,width:50}
                                ,{name:"dealer_id"          ,title:"Dealer"          ,titleWidth:100 ,width:120}
                                ,{name:"supp_source_id"     ,title:"Supply Source"   ,titleWidth:100 ,width:100}
                                ,{name:"receiving_type_id"  ,title:"Receiving Type"  ,titleWidth:100 ,width:100}
                                
                            ]
        */
        ,detailColumn       : [   
                                 {name:"part_no"                  ,title:"Part No."             ,width:100}
                                ,{name:"national_stock_no"        ,title:"Nat'l Stock No."      ,width:100}
                                ,{name:"item_name"                ,title:"Nomenclature"         ,width:100}
                                ,{name:"serial_no"                ,title:"Serial No."           ,width:150}
                                ,{name:"unit_of_measure"          ,title:"Unit of Measure"      ,width:100}
                                ,{name:"stock_qty"                ,title:"Stock Qty."           ,width:100}
                                ,{name:"item_status"              ,title:"Status"              ,width:100}
                            ] 

  
        ,masterData         : g_masterData
        ,detailData         : g_detailData
        ,onInit             : function(){
            return new jsPDF("l", "pt", "A4");
        }
        
        ,onPrintHeader      : function(o){
            if (g_imgData) {
                o.doc.addImage(g_imgData, 'JPEG', o.margin.left,  o.row, 50, 50);
            }
            o.row +=27;
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left + 60, o.row, "Philippine Airforce");
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Issuances Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(25, o.row, "Warehouse");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(100, o.row, ": "  + o.data.warehouse_id);


            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(200, o.row-10, 100,14, 'FD');    
            o.doc.text(225, o.row, "Issuance No.");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(310, o.row-10, 110,14, 'FD');    
            o.doc.text(290, o.row,  ": "  + o.data.issuance_no);
            
             o.doc.text(445, o.row, "Issued By");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(500, o.row, ": "  + o.data.issued_by_name);
            //new row
            o.row +=16; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(225, o.row, "Issued Date");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(290, o.row, ": "  + o.data.issued_date);
            
             o.doc.text(25, o.row, "Issuance Type");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(100, o.row, ": "  + o.data.issuance_type);
            
           
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            //o.doc.text(425, o.row, "Status");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            //o.doc.text(500, o.row, ": "  + o.data.status_name);
            
            
            
            return o.row;    
        }  
        
        
    });         
    
    
    
});




function displayRecords(){
    var wereHId     = $("#warehouse_id").val();
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var rTypeId     = $("#issuance_type_id").val();

    
    $("#grid").dataBind({
        
         toggleMasterKey    : "issuance_id"
        ,height             : 400 
        ,width              : $(document).width() - 27
        ,url                : execURL + "issuances_summary_report_sel @warehouse_id="+ (wereHId ? wereHId : null)
                                      + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@issuance_type="+ (rTypeId ? "'" + rTypeId + "'" : null)
        ,dataRows : [
                {text  : "&nbsp;"                                              , width : 25           , style : "text-align:left;"
                     ,onRender : function(d){
                          return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.issuance_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
                    }
                 }
        		,{text  : "Issuance No."                , name  : "issuance_no"                     , width : 180           , style : "text-align:left;"}
        		,{text  : "Issued By"                   , name  : "issued_by_name"                  , width : 300           , style : "text-align:left;"}
        		,{text  : "Issued Date"                 , name  : "issued_date"                     , width : 150           , style : "text-align:left;"}
        		,{text  : "Issued To"                   , name  : "issuance_directive_id"           , width : 300           , style : "text-align:left;"}
        		,{text  : "Authority Ref"               , name  : "authority_ref"                   , width : 150           , style : "text-align:left;"}
        		,{text  : "Transfer To"                 , name  : "transfer_organization_warehouse"            , width : 250           , style : "text-align:left;"}
                ,{text  : "Status"                      , name  : "status_name"                     , width : 150           , style : "text-align:left;"}
	    ]  

        ,onComplete : function(data){
        	        g_masterData = data.rows;
        	        g_masterIds = "";
        	        for(var x =0;x<g_masterData.length;x++ ){
        	               if(g_masterIds!=="") g_masterIds +=",";
        	                g_masterIds  += g_masterData[x].issuance_id;
        
        	        }
        	        $.post(procURL + "issuance_details_sel @master_ids='" + g_masterIds + "'" ,function(data){
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
                 url        : procURL + "issuance_details_sel @issuance_id="+ id
                ,dataRows   : [
                		 
                                 {text  : "Part No."                       , name  : "part_no"           , width : 180           , style : "text-align:center;"}
                        		,{text  : "Nat'l Stock No."                , name  : "national_stock_no" , width : 200           , style : "text-align:center;"}
                        		,{text  : "Nomenclature"                   , name  : "item_name"         , width : 250           , style : "text-align:center;"}
                        		,{text  : "Serial No."                     , name  : "serial_no"         , width : 150           , style : "text-align:center;"}
                        		,{text  : "Unit of Measure"                , name  : "unit_of_measure"   , width : 120           , style : "text-align:center;"}
                        		,{text  : "Stock Qty."                     , name  : "stock_qty"                    , width : 150           , style : "text-align:center;"}
                                ,{text  : "Quantity"            , width : 80                    , style : "text-align:center;"
                        	        ,onRender: function(d){
                        	             return bs({ name  : "quantity" ,style : "text-align:left;" ,value : svn(d,"quantity") ,class : "numeric" });
                        	        } 
                        	    }
                                ,{text  : "Status"              , name  : "item_status"           , width : 120       , style : "text-align:left;"}
                                //,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 350       , style : "text-align:left;"}
                            ]    
            });    

        }
    
    });
}
                                                                                              