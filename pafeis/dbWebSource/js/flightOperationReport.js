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
    $("#outputPane").addClass("hide");
    
    var oId      = $("#aircraft_organization_filter").val();
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    $("#grid1").loadData({
         url     : execURL + "flight_operations_report_sel @organization_id=" + (oId ? oId : null)
                                  + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                  + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
        ,td_body : [
            function(d) {
                return d.flight_operation_code;
            }
            ,function(d) {
                return d.station;
            }
            ,function(d) { 
                return d.squadron;
            }
            ,function(d) { 
                return d.pilots;
            }
            ,function(d) { 
                return d.aircraft_type;
            }
            ,function(d) { 
                return d.aircraft_name;
            }
            ,function(d) { 
                return d.ms_category;
            }
            ,function(d) { 
                return d.ms_type;
            }
            ,function(d) { 
                return d.ms_detail;
            }
            ,function(d) { 
                return d.ms_essential;
            }
            ,function(d) { 
                return d.itinerary;
            }
            ,function(d) { 
                return d.engine_start;
            }
            ,function(d) { 
                return "";
    		}
    		,function(d) { 
                return "";
    		}
    		,function(d) { 
                return d.engine_stop;
    		}
    		,function(d) { 
                return d.total_hours;
    		}
    		,function(d) { 
                return d.total_cycles;
    		}
    		,function(d) { 
                return d.flt_cond;
    		}
    		,function(d) { 
                return d.sort;
    		}
    		,function(d) { 
                return d.pax_mil;
    		}
    		,function(d) { 
                return d.pax_civ;
    		}
    		,function(d) { 
                return d.fnt_mil;
    		}
    		,function(d) { 
                return d.fnt_civ;
    		}
    		,function(d) { 
                return d.cargo;
    		}
    		,function(d) { 
                return d.gas_up_loc;
    		}
    		,function(d) { 
                return d.gas_up;
    		}
    		,function(d) { 
                return d.gas_bal;
    		}
    		,function(d) { 
                return d.remarks;
    		}
        ]
        ,td_properties: ["class='text-center'","class='text-center'","class='text-center'","class='text-center' style='width:470px'"
                         ,"class='text-center' style='min-width:50px'","class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'"
                         ,"class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'"
                         ,"class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'"
                         ,"class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'","class='text-center'"
        ]
        ,onComplete : function(data) {
            g_masterData = data.rows;
            $("#outputPane").find(".gridBox").css('height', $(document).height()-240)
            $("#outputPane").removeClass("hide");
        }            
    });
}

$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Flight Operation Report");
    
    var doc = new jsPDF("l", "pt", "Legal");
    doc.text("From HTML", 14, 16);
    var elem = document.getElementById("grid1");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});   
    document.getElementById("ifrmWindow").src = doc.output('datauristring');
    
    /*zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "flightOperationReport.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 550
       // ,masterKey          : "organization_id"
        ,columnHeader       :  [   
                                 {name:"flight_operation_code"  ,title:"Auth"               ,titleWidth:100 ,width:50}
                                ,{name:"station"                ,title:"Stn"                ,titleWidth:100 ,width:50}
                                ,{name:"squadron"               ,title:"Unit"               ,titleWidth:100 ,width:160}
                                ,{name:"pilots"          ,title:"Pilot (SN / Rank / Duty)"           ,titleWidth:100 ,width:450}
                                ,{name:"aircraft_type"          ,title:"A/C Type"           ,titleWidth:100 ,width:60}
                                ,{name:"aircraft_name"          ,title:"A/C Nr"             ,titleWidth:100 ,width:60}
                                ,{name:"ms_category"            ,title:"Msn Catg"           ,titleWidth:100 ,width:50}
                                ,{name:"ms_type"                ,title:"Msn Typ"            ,titleWidth:100 ,width:50}
                                ,{name:"ms_detail"              ,title:"Msn Dtl"            ,titleWidth:100 ,width:50}
                                ,{name:"ms_essential"           ,title:"Msn Essential"      ,titleWidth:100 ,width:100}
                                ,{name:"itinerary"              ,title:"Itinerary"          ,titleWidth:100 ,width:130}
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
    }); */
});


 
                            