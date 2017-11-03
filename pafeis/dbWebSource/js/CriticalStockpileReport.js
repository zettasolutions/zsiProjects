var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,g_masterData   =   null
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
    displayRecords();
    getTemplate();
});

$("select[name='warehouse_filter']").dataBind({
    url: procURL + "dd_warehouse_organizations_sel" 
    , text : "organization_warehouse"
    , value: "warehouse_id"
});

$("select[name='categories_filter']").dataBind({
    url: procURL + "item_categories_sel" 
    , text : "item_cat_name"
    , value: "item_cat_id"
});

$("#btnGo").click(function(){
   displayRecords();

});




function displayRecords(){
    var wId = $("#warehouse_filter").val();
    var catId = $("#categories_filter").val();
    
        $("#grid").dataBind({
             url            : execURL + "critical_stockpile_report_sel @warehouse_id=" + (wId ? wId : null) + ",@item_cat_id=" + (catId ? catId : null)
            ,width          : $(document).width() - 35
            ,height         : $(document).height() - 250
            ,isPaging : false
            ,dataRows : [
            		 {text  : "Part No."            , name  :"part_no"              , width : 150           , style : "text-align:left;"}
            		,{text  : "National Stock No."  , name  :"national_stock_no"    , width : 150           , style : "text-align:left;"}
            		,{text  : "Nomenclature"        , name  : "item_name"           , width : 450           , style : "text-align:left"}
            	    ,{text  : "Stock Qty."          , name  : "stock_qty"           , width : 130           , style : "text-align:center;"}
            	    ,{text  : "Unit of Measure."    , name  : "unit_of_measure"     , width : 130           , style : "text-align:center;"}
            	    ,{text  : "Reoder Level"        , name  : "reorder_level"       , width : 130           , style : "text-align:center;"}
            ]   
            
            ,onComplete : function(o){
	        g_masterData = o.data.rows;
	        
	        if( o.data.rows.length > 0)
	            $("#btnPdf").css({display: "block"});
	        else 
	            $("#btnPdf").css({display: "none"});

	   }
    });    
}

$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Critical Stock Pile Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "criticalstockpile.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 550
       // ,masterKey          : "organization_id"
        ,columnHeader       :  [   
                                 {name:"part_no"                ,title:"Part No."                           ,titleWidth:100 ,width:120}
                                ,{name:"national_stock_no"      ,title:"National Stock No."                 ,titleWidth:100 ,width:120}
                                ,{name:"item_name"              ,title:"Nomenclature"                       ,titleWidth:100 ,width:300}
                                ,{name:"stock_qty"              ,title:"Stock Qty."                         ,titleWidth:100 ,width:70}
                                ,{name:"unit_of_measure"        ,title:"Unit of Measure."                   ,titleWidth:100 ,width:90}
                                ,{name:"reorder_level"          ,title:"Reoder Level"                       ,titleWidth:100 ,width:90}
                            ]
        ,data               : g_masterData
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
            o.doc.text(o.margin.left, o.row, "Critical Stock Pile Report");
            o.doc.setFontSize(10);
            o.row +=16;
            
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left, o.row, "Warehouse: ");
            o.doc.setFontSize(10);
            o.row +=16;
            
            return o;
        }
        
       
        
    });         
    
    
    
});
/*
$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Procurement Report");
    

    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "criticalstockpile.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
      //  ,masterKey          : "procurement_id"
        ,columnHeader       :  [   
                                 {name:"part_no"                ,title:"Part No."                           ,titleWidth:100 ,width:120}
                                ,{name:"national_stock_no"      ,title:"National Stock No."                 ,titleWidth:100 ,width:120}
                                ,{name:"item_name"              ,title:"Nomenclature"                       ,titleWidth:100 ,width:300}
                                ,{name:"stock_qty"              ,title:"Stock Qty."                         ,titleWidth:100 ,width:70}
                                ,{name:"unit_of_measure"        ,title:"Unit of Measure."                   ,titleWidth:100 ,width:90}
                                ,{name:"reorder_level"          ,title:"Reoder Level"                       ,titleWidth:100 ,width:90}
                            ]
                            
        ,masterData         : g_masterData
//,detailData         : g_detailData
        ,onPrintHeader      : function(o){
            if (g_imgData) {
                o.doc.addImage(g_imgData, 'JPEG', o.margin.left,  o.row, 50, 50);
            }
            o.row +=27;
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left + 60, o.row, "Philippine Airforce");
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Critical Stock Pile Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        
       /* ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(25, o.row, "Warehouse:");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(125, o.row, ": "  + o.data.organization_warehouse);

/*
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(200, o.row-10, 100,14, 'FD');    
            o.doc.text(205, o.row, "Procurement Name");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(310, o.row-10, 110,14, 'FD');    
            o.doc.text(315, o.row,  ": "  + o.data.procurement_name);
            
            //new row
            o.row +=18; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(25, o.row, "Supplier");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(125, o.row, ": "  + o.data.supplier_name);
            
            return o.row;    
        }  
        
        
    });         
    
    
    
});*/
                                      