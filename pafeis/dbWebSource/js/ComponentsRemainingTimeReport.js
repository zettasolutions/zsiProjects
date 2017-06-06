var bs = zsi.bs.ctrl;
var svn = zsi.setValIfNull;
var g_masterData = null;
var g_imgData  = null;

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

$("#btnGo").click(function(){
   displayRecords();
   $("#btnPdf").css({display: "block"});
});
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "component_remaining_time_report_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,dataRows : [
        		 {text  : "Unit"                    , name  : "unit"                    , width : 200        , style : "text-align:left;"}
        		,{text  : "Part No."                , name  : "part_no"                 , width : 130       , style : "text-align:left;"}
        		,{text  : "National Stock No."      , name  : "national_stock_no"       , width : 150       , style : "text-align:left;"}
        		,{text  : "Nomenclature"            , name  : "item_name"               , width : 280       , style : "text-align:left;"}
        	    ,{text  : "Serial No."              , name  : "serial_no"               , width : 130       , style : "text-align:left;"}
        	    ,{text  : "Organization Address"    , name  : "organization_address"    , width : 350       , style : "text-align:left;"}
        	    ,{text  : "Remaining Time"          , name  : "remaining_time"       , width : 130       , style : "text-align:left;"}
        	    ,{text  : "Status Name"             , name  : "status_name"             , width : 130       , style : "text-align:left;"}
	    ]   
    	     ,onComplete: function(data){
                    g_masterData = data.rows;
        }  
    });    
}

$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Components Remaining Time Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "componentsRemainingTime.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
        ,columnHeader       :  [   
                                 {name:"unit"               ,title:"Unit"               ,titleWidth:100 ,width:200}
                                ,{name:"part_no"            ,title:"Part No."           ,titleWidth:100 ,width:200}
                                ,{name:"item_name"          ,title:"Nomenclature"       ,titleWidth:100 ,width:150}
                                ,{name:"remaining_time"     ,title:"Remaining Time"     ,titleWidth:100 ,width:150}
                                ,{name:"status_name"        ,title:"Status"             ,titleWidth:100 ,width:200}
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
            o.doc.text(o.margin.left, o.row, "Components Remaining Time Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
    });         
});


                               