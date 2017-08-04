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

});

$("#btnPdf").click(function(){

    var rTypeId     = $("#receiving_type_id").val();
    var _headerColumn = [];
    var _detailColumn = [];
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Receiving Report");
    _headerColumn.push(
             {name:"receiving_no"           ,title:"RR #."                      ,titleWidth:100 ,width:100}
            ,{name:"received_date"          ,title:"RR Date"                    ,titleWidth:100 ,width:110}
            ,{name:"received_by_name"       ,title:"Received By"                ,titleWidth:100 ,width:150}
    );      
    
    if(rTypeId==="AIRCRAFT"){
        _headerColumn.push(
             {title  : "Doc #"                   , name:"doc_no"                ,titleWidth:100 , width : 100       }
            ,{title  : "Aircraft"                , name:"aircraft_name"         ,titleWidth:100 , width : 100       }
        );
    }else if(rTypeId==="DIRECTIVE"){
        _headerColumn.push(
             {title  : "IS #"                    , name  : "doc_no"             ,titleWidth:100 , width : 150       } 
            ,{title  : "IS Date"                                                ,titleWidth:100 , width : 150       
                ,onRender: function(d){ return svn(d,"doc_date").toDateFormat();}
            }
            ,{title : "Authority code"          , name  : "authority_ref"       ,titleWidth:100 , width : 150       } 
            ,{title : "Transfered From"         , name  : "transfered_from"     ,titleWidth:100 , width : 150       }
        );
        
    }else if(rTypeId==="DONATION"){
            _headerColumn.push(
             {title  : "Doc #"                   , name  : "doc_no"             ,titleWidth:100 , width : 150       } 
            ,{title  : "Donor"                   , name  : "donor"              ,titleWidth:100 , width : 150       }
        );          
    }else if(rTypeId==="PROCUREMENT") {
        _headerColumn.push(
             {title  : "DR #"                    , name  : "doc_no"             ,titleWidth:100 , width : 80       }
            ,{title  : "P.O Code"                , name  : "po_code"            ,titleWidth:100 , width : 100       }
            ,{title  : "Dealer"                  , name  : "dealer_name"        ,titleWidth:100 , width : 90       }
            ,{title  : "Mode"                    , name  : "procurement_mode"   ,titleWidth:100 , width : 60       }
            ,{title  : "Type"                    , name  : "procurement_type"   ,titleWidth:100 , width : 60       }
        );
    }else {
        _headerColumn.push(
             {text  : "IS #"                    , name  : "doc_no"              ,titleWidth:100 , width : 150       } 
            ,{text  : "IS Date"                                                 ,titleWidth:100 , width : 150       
               ,onRender: function(d){ return svn(d,"doc_date").toDateFormat();} 
            }
            ,{text  : "Transfered From"         , name  : "issuance_warehouse"  ,titleWidth:100 , width : 350       }
        );        
    }  

    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        //,masterColumnStyle  : "form"
        ,fileName           : "Receiving.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 600
        ,pageHeightLimit    : 550
        ,masterKey          : "receiving_id"
        ,masterColumn       : _headerColumn
        ,masterData         : g_masterData
        ,detailColumn       :  [
                         {title  : "Part No."                , name  : "part_no"                    ,titleWidth:100, width :100}
                        ,{title  : "Nat'l Stock No."         , name  : "national_stock_no"          ,titleWidth:100, width :100}
                        ,{title  : "Nomenclature"            , name  : "item_name"                  ,titleWidth:100, width :100}
                		,{title  : "Serial No."              , name  : "serial_no"                  ,titleWidth:100, width :100}
                        ,{title  : "Manufacturer"            , name  : "manufacturer_name"          ,titleWidth:100, width :100} 
                        ,{title  : "Unit of Measure"         , name  : "unit_of_measure"            ,titleWidth:100, width :100}
                        ,{title  : "Quantity"                , name  : "quantity"                   ,titleWidth:100, width :100}
        ]
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

            o.row +=15;
            o.doc.setFontSize(8);
            o.doc.text(o.margin.left + 60, o.row, g_masterData[0].receiving_warehouse);
              
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Receiving Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        /*
          ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(25, o.row, "Receiving No.");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(125, o.row, ": "  + o.data.receiving_no);

 
            
            return o.row;    
        }  
        */
    });   
});

function displayRecords(callback) {
    var wereHId     = $("#warehouse_id").val();
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var rTypeId     = $("#receiving_type_id").val();
    var _dataRows = [];
    //var rowCount = 0;
    
    _dataRows.push(
        {text  : "&nbsp;"                                                       , width : 25         , style : "text-align:left;"
             ,onRender : function(d){
                  return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.receiving_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
            }
         }
		,{text  : "RR #"                        , name  : "receiving_no"        , width : 100       , style : "text-align:left;"}
		,{text  : "RR Date"                                                     , width : 100       , style : "text-align:left;"
		    ,onRender: function(d){ return svn(d,"received_date").toDateFormat();}
		}
		,{text  : "Received By"                 , name  : "received_by_name"    , width : 250       , style : "text-align:left;"}

    );
    
    if(rTypeId==="AIRCRAFT"){
        _dataRows.push(
             {text  : "Doc #"                   , name:"doc_no"                 , width : 100       , style : "text-align:left;" }
            ,{text  : "Aircraft"                , name:"aircraft_name"          , width : 100       , style : "text-align:left;" }
        );
    }else if(rTypeId==="DIRECTIVE"){
        _dataRows.push(
             {text  : "IS #"                    , name  : "doc_no"              , width : 150       , style : "text-align:left;"} 
            ,{text  : "IS Date"                                                 , width : 150       , style : "text-align:left;"
                ,onRender: function(d){ return svn(d,"doc_date").toDateFormat();}
            }
            ,{text  : "Authority code"          , name  : "authority_ref"       , width : 150       , style : "text-align:left;"} 
            ,{text  : "Transfered From"         , name  : "transfered_from"     , width : 150       , style : "text-align:left;"}
        );
        
    }else if(rTypeId==="DONATION"){
            _dataRows.push(
             {text  : "Doc #"                   , name  : "doc_no"              , width : 150       , style : "text-align:left;"} 
            ,{text  : "Donor"                   , name  : "donor"               , width : 150       , style : "text-align:left;"}
        );          
    }else if(rTypeId==="PROCUREMENT") {
        _dataRows.push(
             {text  : "DR #"                    , name  : "doc_no"              , width : 100       , style : "text-align:left;"}
            ,{text  : "P.O #"                   , name  : "po_no"               , width : 100       , style : "text-align:left;"}
            ,{text  : "Dealer"                  , name  : "dealer_name"         , width : 250       , style : "text-align:left;"}
            ,{text  : "Mode"                    , name  : "procurement_mode"    , width : 150       , style : "text-align:left;"}
            ,{text  : "Type"                    , name  : "procurement_type"    , width : 150       , style : "text-align:left;"}
        );
    }else {
        _dataRows.push(
             {text  : "IS #"                    , name  : "doc_no"              , width : 150       , style : "text-align:left;"} 
            ,{text  : "IS Date"                                                 , width : 150       , style : "text-align:left;"
               ,onRender: function(d){ return svn(d,"doc_date").toDateFormat();} 
            }
            ,{text  : "Transfered From"         , name  : "issuance_warehouse"  , width : 350       , style : "text-align:left;"}
        );        
    }

    $("#grid").dataBind({
        
         toggleMasterKey    : "receiving_id"
        ,height             : 400 
        ,width              : $(document).width() - 27
        ,url                : execURL + "receiving_summary_report_sel @warehouse_id="+ (wereHId ? wereHId : null)
                                      + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@receiving_type="+ (rTypeId ? "'" + rTypeId + "'" : null)
        ,dataRows: _dataRows
        ,onComplete: function(data){
	        g_masterData = data.rows;
	        g_masterIds = "";
	        for(var x =0;x<g_masterData.length;x++ ){
	               if(g_masterIds!=="") g_masterIds +=",";
	                g_masterIds  += g_masterData[x].receiving_id;

	        }
	        $.post(execURL + "receiving_details_sel @master_ids='" + g_masterIds + "',@user_id=" + userId ,function(data){
	           g_detailData = data.rows;
	        });
	        
	        if( data.rows.length > 0)
	            $("#btnPdf").css({display: "inline"});
	        else 
	            $("#btnPdf").css({display: "none"});
        }  
    });
}

function displayDetail(o,id){
    zsi.toggleExtraRow({
         object     : o
        ,parentId   : id
        ,onLoad : function($grid){ 
            
            $grid.dataBind({
                 url        : procURL + "receiving_details_report_sel @receiving_id="+ id
                ,width      : $(document).width() - 60
                ,dataRows   : [
                         {text  : "Part No."                , name  : "part_no"                    , width : 150       , style : "text-align:left;"}
                        ,{text  : "Nat'l Stock No."         , name  : "national_stock_no"          , width : 150       , style : "text-align:left;"}
                        ,{text  : "Nomenclature"            , name  : "item_name"                  , width : 350       , style : "text-align:left;"}
                		,{text  : "Serial No."              , name  : "serial_no"                  , width : 150       , style : "text-align:left;"}
                        ,{text  : "Manufacturer"            , name  : "manufacturer_name"          , width : 150       , style : "text-align:left;"} 
                        ,{text  : "Unit of Measure"         , name  : "unit_of_measure"            , width : 160       , style : "text-align:left;"}
                        ,{text  : "Quantity"                , name  : "quantity"                   , width : 100       , style : "text-align:left;"}
                        ,{text  : "Item Class"              , name  : "item_class"                 , width : 150       , style : "text-align:left;"}
                        ,{text  : "Time Since New"          , name  : "time_since_new"             , width : 150       , style : "text-align:left;"}
                        ,{text  : "Time Since Overhaul"     , name  : "time_since_overhaul"        , width : 150       , style : "text-align:left;"}
                        ,{text  : "Status"                  , name  : "item_status"                , width : 150       , style : "text-align:left;" }
                        ,{text  : "Remarks"                 , name  : "remarks"                    , width : 260       , style : "text-align:left;"}
                	    ]                      });    

        }
    
    });
}

                                                                                                                  