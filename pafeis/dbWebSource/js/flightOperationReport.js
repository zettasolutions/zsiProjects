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
   // displayRecords();
    getTemplate();
});

$("select[name='aircraft_organization_filter']").dataBind({
    url: procURL + "dd_aircraft_organizations_sel" 
    , text: "organization_name"
    , value: "organization_id"
});

$("#btnGo").click(function(){
    if($("#aircraft_organization_filter").val() === ""){
        alert("Please select organization.");
    }
    else{
       displayRecords();
       $("#btnPdf").css({display: "block"});
    }
});

function displayRecords(){
    var oId      = $("#aircraft_organization_filter").val();
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();

     $("#grid").dataBind({
	     url            : execURL + "flight_operations_report_sel @organization_id=" + (oId ? oId : null)
                                  + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                  + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                  
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,isPaging : false
        ,dataRows : [
    		 {text:"Wing"                      , name:"wing"                    , width:200         , style:"text-align:left;"   }	 
    		,{text:"Squadron"                  , name:"squadron"                , width:200         , style:"text-align:left;"   }	  
            ,{text:"Aircraft Type"             , name:"aircraft_type"           , width:200         , style:"text-align:left;"   }
    		,{text:"Aircraft Name"             , name:"aircraft_name"           , width:150         , style:"text-align:left;"   }
    		,{text: "Aircraft Time"            , name:"aircraft_time"           , width:200         , style:"text-align:left;"   }
    		,{text: "Status"                   , name:"status_name"             , width:200         , style:"text-align:left;"   }
	    ]
	   ,onComplete : function(data){
	        g_masterData = data.rows;
	   }
    });    
}

$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Flight Operation Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "flightOperationReport.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
       // ,masterKey          : "organization_id"
        ,columnHeader       :  [   
                                 {name:"wing"               ,title:"Wing"               ,titleWidth:100 ,width:200}
                                ,{name:"squadron"           ,title:"Squadron"           ,titleWidth:100 ,width:200}
                                ,{name:"aircraft_name"      ,title:"Aircraftt Name"     ,titleWidth:100 ,width:150}
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
            o.doc.text(o.margin.left, o.row, "Flight Operation Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
    });         
});


 
                      