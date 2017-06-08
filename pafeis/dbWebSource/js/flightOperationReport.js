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
    var _dataRows   = [
	         { id:  1  ,groupId: 0 ,text: "" }	 
    		,{ id:  2  ,groupId: 0 ,text: "" }	 
    		,{ id:  3  ,groupId: 0 ,text: ""}
    		,{ id:  4  ,groupId: 0 ,text: ""}
    		//,{ id:  4  ,groupId: 0 ,text: "Pilot" }	
    		,{ id:  5  ,groupId: 0 ,text: "A/C" }	
    		,{ id:  6  ,groupId: 0 ,text: "Msn Symbol" }
    		,{ id:  7  ,groupId: 0 ,text: "" }	
    		,{ id:  8  ,groupId: 0 ,text: "" }
    		,{ id:  9  ,groupId: 0 ,text: "" }
    		,{ id:  10 ,groupId: 0 ,text: "T/O" }
    		,{ id:  11  ,groupId: 0 ,text: "Ldg" }
    		,{ id:  12  ,groupId: 0 ,text: "" }
    		,{ id:  13  ,groupId: 0 ,text: "HF" }
    		,{ id:  14  ,groupId: 0 ,text: "" }
    		,{ id:  15  ,groupId: 0 ,text: "" }
    		,{ id:  16  ,groupId: 0 ,text: "Pax" }
    		,{ id:  17  ,groupId: 0 ,text: "Pnt" }
    		,{ id:  18  ,groupId: 0 ,text: "" }
    		,{ id:  19  ,groupId: 0 ,text: "Gas up" }
    		,{ id:  20  ,groupId: 0 ,text: "Bal" }
    		,{ id:  21  ,groupId: 0 ,text: "" }
    		,{ 
    		      id            : 101
                , groupId       : 1    		      
    		    , text          : "Auth"
    		    , name          : "flight_operation_code"
    		    , width         : 100  
    		    , style         : "text-align:center;"
            }	 
    	 	,{ 
    		      id            : 102
                , groupId       : 2    		      
    		    , text          : "Stn" 
    		    , name          : "station"
    		    , width         : 120 
    		    , style         : "text-align:center;"
    		}	 
    		,{ 
    		      id            : 103
                , groupId       : 3    		      
    		    , text          : "Unit"
    		    , name          : "squadron"
    		    , width         : 200 
    		    , style         : "text-align:center;"
    		}	 
    		,{ 
    		      id            : 104
                , groupId       : 4    		      
    		    , text          : "Pilot (SN / Rank / Duty)"
    		    , name          : "pilots"
    		    , width         : 300 
    		    , style         : "text-align:center;"
    		}
    		/*,{ 
    		      id            : 105
                , groupId       : 4    		      
    		    , text          : "Rank"
    		    , name          : "rank"
    		    , width         : 120 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 106
                , groupId       : 4    		      
    		    , text          : "SN"
    		    , name          : "rank"
    		    , width         : 120 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 107
                , groupId       : 4    		      
    		    , text          : "Dty"
    		    , name          : "duty"
    		    , width         : 120 
    		    , style         : "text-align:center;"
    		}*/
    		,{ 
    		      id            : 108
                , groupId       : 5    		      
    		    , text          : "Type"
    		    , name          : "type"
    		    , width         : 100 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 109
                , groupId       : 5  		      
    		    , text          : "Nr"
    		    , name          : "aircraft_name"
    		    , width         : 100 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 110
                , groupId       : 6		      
    		    , text          : "Catg"
    		    , name          : "ms_category"
    		    , width         : 80 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 111
                , groupId       : 6	      
    		    , text          : "Typ"
    		    , name          : "ms_type"
    		    , width         : 80 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 112
                , groupId       : 6		      
    		    , text          : "Dtl"
    		    , name          : "ms_detail"
    		    , width         : 80 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 113
                , groupId       : 7	      
    		    , text          : "Msn Essential"
    		    , name          : "ms_essential"
    		    , width         : 150 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 114
                , groupId       : 8	      
    		    , text          : "Itinerary"
    		    , name          : "itinerary"
    		    , width         : 200 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 115
                , groupId       : 9     
    		    , text          : "EngStrt"
    		    , name          : "engine_start"
    		    , width         : 115 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 116
                , groupId       : 10	      
    		    , text          : "T"
    		    , name          : ""
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 117
                , groupId       : 11	      
    		    , text          : "T"
    		    , name          : ""
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 118
                , groupId       : 12	      
    		    , text          : "EngSdn"
    		    , name          : "engine_stop"
    		    , width         :  115 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 119
                , groupId       : 13	      
    		    , text          : "HOUR"
    		    , name          : "total_hours"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 120
                , groupId       : 13	      
    		    , text          : "MIN"
    		    , name          : "total_cycles"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 121
                , groupId       : 14	      
    		    , text          : "FLT Cond"
    		    , name          : "flt_cond"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 122
                , groupId       : 15    
    		    , text          : "Srt"
    		    , name          : "sort"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 123
                , groupId       : 16  
    		    , text          : "Mil"
    		    , name          : "pax_mil"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{ 
    		      id            : 124
                , groupId       : 16  
    		    , text          : "Civ"
    		    , name          : "pax_civ"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 125
                , groupId       : 17
    		    , text          : "Mil"
    		    , name          : "fnt_mil"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 126
                , groupId       : 17
    		    , text          : "Civ"
    		    , name          : "fnt_civ"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 127
                , groupId       : 18
    		    , text          : "Cargo (Lbs)"
    		    , name          : "cargo"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 128
                , groupId       : 19
    		    , text          : "Loc"
    		    , name          : "gas_up_loc"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 129
                , groupId       : 19
    		    , text          : "(Ltrs)"
    		    , name          : "gas_up"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 130
                , groupId       : 20
    		    , text          : "(Ltrs)"
    		    , name          : "gas_bal"
    		    , width         : 50 
    		    , style         : "text-align:center;"
    		}
    		,{    id            : 131
                , groupId       : 21
    		    , text          : "Remarks"
    		    , name          : "remarks"
    		    , width         : 150 
    		    , style         : "text-align:center;"
    		}
    ];
    
    $("#grid").dataBind({
	     url            : execURL + "flight_operations_report_sel @organization_id=" + (oId ? oId : null)
                                  + ",@date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                  + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                  
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,isPaging : false
        ,dataRows : _dataRows /*[
    		 {text:"Auth"                      , name:"flight_operation_code"                    , width:120         , style:"text-align:left;"   }	 
    		,{text:"Stn"                      , name:"station"                    , width:120         , style:"text-align:left;"   }	
    		,{text:"Unit"                      , name:"squadron"                    , width:200         , style:"text-align:left;"   }	 
    		,{text:"Wing"                      , name:"wing"                    , width:200         , style:"text-align:left;"   }	 
    		,{text:"Squadron"                  , name:"squadron"                , width:200         , style:"text-align:left;"   }	  
            ,{text:"Aircraft Type"             , name:"aircraft_type"           , width:200         , style:"text-align:left;"   }
    		,{text:"Aircraft Name"             , name:"aircraft_name"           , width:150         , style:"text-align:left;"   }
    		,{text: "Aircraft Time"            , name:"aircraft_time"           , width:200         , style:"text-align:left;"   }
    		,{text: "Status"                   , name:"status_name"             , width:200         , style:"text-align:left;"   }
	    ]*/
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
                                 {name:"flight_operation_code"  ,title:"Auth"               ,titleWidth:100 ,width:50}
                                ,{name:"station"                ,title:"Stn"                ,titleWidth:100 ,width:50}
                                ,{name:"squadron"               ,title:"Unit"               ,titleWidth:100 ,width:160}
                                ,{name:"type"                   ,title:"A/C Type"           ,titleWidth:100 ,width:60}
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
    });         
});


 
                         