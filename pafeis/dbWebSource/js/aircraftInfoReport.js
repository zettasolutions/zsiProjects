var  bs                     = zsi.bs.ctrl
    ,svn                    = zsi.setValIfNull
    ,g_masterData           = null
    ,g_detailData           = []
    ,g_masterIds            = ""
    ,g_imgData              = null
    ,g_organization_id      = null
    ,g_squadron_id          = null
    ,g_aircraft_info_id     = null
    ,g_aircraft_length      = 0 
    ,g_aircraft_counter     = 0
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
    $("#wing_filter").dataBind({
        url: procURL + "dd_organizations_sel @organization_type_code='Wing',@squadron_type=''" 
        , text: "organization_name"
        , value: "organization_id"
        , onComplete: function(){
            $("select#wing_filter").change (function(){
                g_organization_id = $("select#wing_filter option:selected").val();   
                $("#squadron_filter").dataBind({
                    url: procURL + "dd_organizations_sel @organization_id="+ g_organization_id +",@squadron_type='Aircraft'" 
                    , text: "organization_name"
                    , value: "organization_id"
                    , onComplete: function(){
                        $("select#squadron_filter").change (function(){
                            g_squadron_id = $("select#squadron_filter option:selected").val();
                            $("#aircraft_filter").dataBind({
                                url: procURL + "dd_aircrafts_sel @squadron_id="+ g_squadron_id 
                                , text: "aircraft_name"
                                , value: "aircraft_info_id"
                                , onComplete: function(){
                                    $("select#aircraft_filter").change (function(){
                                        g_aircraft_info_id = $("select#aircraft_filter option:selected").val();
                                        $("#btnPdf").css({display:"none"});
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
    });
    zsi.initDatePicker();
});

$("#btnDis").click(function(){
    if(g_organization_id === null){ 
        alert("Please select Wing.");
        return;
    } else if(g_squadron_id === null){ 
        alert("Please select Squadron.");
        return;
    } else if(g_aircraft_info_id === null){ 
        alert("Please select Aircraft.");
        return;
    }
    else{
        $("#zPanelId").css({display:"block"});
        displayHeaders();
    }
});

$("#btnPdf").click(function(){
  var _headerColumn = [];
    //var _detailColumn = [];
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Aircraft Info Report");
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        //,masterColumnStyle  : "form"
        ,fileName           : "aircraftInfoReport.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 600
        ,pageHeightLimit    : 550
        ,masterKey          : "aircraft_info_id"
        ,masterColumn       : [
                                 {title  : "Type"                           , name  : "aircraft_type"               ,titleWidth:100, width :100}
                                ,{title  : "Class"                          , name  : "aircraft_class_name"         ,titleWidth:100, width :100}
                                ,{title  : "Role"                           , name  : "aircraft_role_name"          ,titleWidth:100, width :100}
                                ,{title  : "Aircraft Time(Hours)"           , name  : "aircraft_time"               ,titleWidth:100, width :100}
                                ,{title  : "Origin"                         , name  : "origin_name"                 ,titleWidth:100, width :100}
                                ,{title  : "Manufacturer"                   , name  : "manufacturer_name"           ,titleWidth:100, width :100}
                                ,{title  : "Status"                         , name  : "status_name"                 ,titleWidth:100, width :100}
                                ,{title  : "Hrs. Left to Inspection"        , name  : "service_time"                ,titleWidth:100, width :100}
                            ]
        ,masterData         : g_masterData
        ,detailColumn       :  [
                                 {title  : "Part No."                       , name  : "part_no"                     ,titleWidth:100, width :100}
                                ,{title  : "Nat'l Stock No."                , name  : "national_stock_no"           ,titleWidth:100, width :100}
                                ,{title  : "Nomenclature"                   , name  : "item_name"                   ,titleWidth:200, width :200}
                        		,{title  : "Serial No."                     , name  : "serial_no"                   ,titleWidth:100, width :100}
                                ,{title  : "Critical Level"                 , name  : "critical_level"              ,titleWidth:75 , width :75 }
                                ,{title  : "Remaining"                      , name  : "remaining_time"              ,titleWidth:75 , width :75 }
                        		,{title  : "Monitoring Type"                , name  : "monitoring_type"             ,titleWidth:100, width :100}
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
            o.doc.text(o.margin.left + 60, o.row, g_masterData[0].wing);

            o.row +=15;
            o.doc.setFontSize(8);
            o.doc.text(o.margin.left + 60, o.row, g_masterData[0].squadron);

            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Aircraft Info Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 

            o.row = o.checkAddPage(o.row);
            o.doc.text(25, o.row, "Type");
            o.doc.text(125, o.row, ": "  + o.data.aircraft_type);

            o.doc.text(305, o.row, "Class");
            o.doc.text(415, o.row,  ": "  + o.data.aircraft_class_name);
            
            o.doc.text(585, o.row, "Role");
            o.doc.text(705, o.row, ": "  + o.data.aircraft_role_name);

           //new row
            o.row +=18; 
            o.row = o.checkAddPage(o.row);
            o.doc.text(25, o.row, "Origin");
            o.doc.text(125, o.row, ": "  + o.data.origin_name);
            
            o.doc.text(305, o.row, "Manufacturer");
            o.doc.text(415, o.row,  ": "  + o.data.manufacturer_name);

            o.doc.text(585, o.row, "Status");
            o.doc.text(705, o.row, ": "  + o.data.status_name);

           //new row
            
            o.row +=18; 

            o.row = o.checkAddPage(o.row);
            o.doc.text(25, o.row, "Aircraft Time(Hours)");
            o.doc.text(125, o.row, ": "  + formatCurrency(o.data.aircraft_time));
            
            o.doc.text(305, o.row, "Hrs. Left to Inspection");
            o.doc.text(415, o.row,  ": "  + formatCurrency(o.data.service_time));
           return o.row;    
        }
    });   
});

function displayHeaders(){
    //var _aInfoId = $("select#aircraft_filter option:selected").val();
    $.get(execURL + "aircraft_info_sel @squadron_id=" + (g_squadron_id ? g_squadron_id : null) + ",@aircraft_info_id="+ (g_aircraft_info_id ? g_aircraft_info_id : null), function(data){
        var _rows      = data.rows;
        g_masterData  = _rows; //store master data
        g_detailData  = [];    //empty first
        var i,d;
        var $boxWrapper = $("#boxWrapper");
        $boxWrapper.empty();
        g_aircraft_length = _rows.length;
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            var content = '<div id="boxItem'+ d.aircraft_info_id +'">' +
                           '<div class="zContainer1 header ui-front"'+ d.aircraft_info_id +'">' +
                               '<div class="form-horizontal" style="padding:5px">' +
                                    '<div class="col-xs-12 col-sm-3">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Type:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left">'+ d.aircraft_type +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' + 
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Origin:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="origin">'+ d.origin_name +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-12 col-sm-3">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Class:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="class">'+ d.aircraft_class_name +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Manufacturer:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                 '<span class="col-xs-12 control-label text-left" id="manufacturer">'+ d.manufacturer_name +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-12 col-sm-2">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Role:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="role">'+ d.aircraft_role_name +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left">Status:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="status">'+ d.status_name +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-12 col-sm-4">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-5 control-label text-left">Aircraft Time (Hours):</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-7">' +
                                                '<span class="col-xs-12 control-label text-left" id="aircraft_time">'+ formatCurrency(d.aircraft_time) +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-5 control-label text-left">Hours Left to Inspection:</label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-7">' +
                                                '<span class="col-xs-12 control-label text-left" id="service_time">'+ formatCurrency(d.service_time) +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-12 col-sm-2">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-6 col-sm-6 col-md-6 col-lg-3 control-label text-left"></label>' +
                                            '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +

                                    '</div>' +
                                '</div>' +
                            '</div>' +
                           '<div class="zGrid" id="gridItem'+   d.aircraft_info_id  +'" ></div></div>';
            //write html content                
             $boxWrapper.append(content);
             
             displayRecords(d.aircraft_info_id);
             
        }//end of loop
        
        if(_rows.length>0) $("#btnPdf").css({display:"inline"});
    });
} 

function displayRecords(aircraft_info_id) {
    $("#gridItem" + aircraft_info_id).dataBind({
         width              : $(document).width() - 42
        ,url                : execURL + "items_sel @aircraft_info_id="+ aircraft_info_id
        ,dataRows: [
             {text  : "Part No."            , name:"part_no"                , width : 200       , style : "text-align:left;" }
            ,{text  : "National Stock No."  , name:"national_stock_no"      , width : 200       , style : "text-align:left;" }
            ,{text  : "Nomenclature"        , name:"item_name"              , width : 400       , style : "text-align:left;" }
            ,{text  : "Serial No."          , name:"serial_no"              , width : 150       , style : "text-align:left;" }
            ,{text  : "Critical Level"      , width : 150                , style : "text-align:center;"
            ,onRender : function(d){ 
                return (formatCurrency(svn(d,"critical_level")) === "" ? 0 : formatCurrency(svn(d,"critical_level"))); }
            }
            ,{text  : "Remaining"           , name:"remaining_time"         , width : 100       , style : "text-align:right; padding-right:3px;"}
            ,{text  : "Monitoring Type"     , name:"monitoring_type"        , width : 150       , style : "text-align:center;"}
		]
		,onComplete : function(data){

		    if(data.rows.length > 0) g_detailData = g_detailData.concat(data.rows);
		    
		    CheckAllCompleteAirCraftLoaded();
		}
    });
}

function CheckAllCompleteAirCraftLoaded(){
    g_aircraft_counter++;
    if( g_aircraft_length ===g_aircraft_counter){ // completed display
        console.log("All Aircraft Loaded");
    }
}

function formatCurrency(number){
    var result = "";
    if(number!==""){
        result = parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return result;
}                                                                                                                                                      