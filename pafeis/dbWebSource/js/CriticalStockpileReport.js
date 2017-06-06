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
   $("#btnPdf").css({display: "block"});
});

function displayRecords(){
    var wId = $("#warehouse_filter").val();
    var catId = $("#categories_filter").val();
    
    console.log(wId);
    console.log(catId);
    
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
            
            ,onComplete : function(data){
	        g_masterData = data.rows;
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
        ,pageHeightLimit    : 800
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
            return o;
        }
       
        
    });         
    
    
    
});
                               