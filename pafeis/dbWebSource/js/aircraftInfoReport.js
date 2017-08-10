var  bs             = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,g_masterData   =   null
    ,g_masterIds    =   ""
    ,g_imgData      =   null
    ,g_organization_id = null
    ,g_squadron_id = null
    ,g_aircraft_id = null
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
    });
    $("#squadron_filter").dataBind({
        url: procURL + "dd_organizations_sel @organization_id="+ g_organization_id +",@squadron_type='Aircraft'" 
        , text: "organization_name"
        , value: "organization_id"
        , onComplete: function(){
            $("select#squadron_filter").change (function(){
                g_squadron_id = $("select#squadron_filter option:selected").val();
                $("#aircraft_filter").dataBind({
                    url: procURL + "dd_aircrafts_sel @wing_id="+ g_organization_id +",@squadron_id="+ g_squadron_id 
                    , text: "aircraft_name"
                    , value: "aircraft_info_id"
                    , onComplete: function(){
                        $("select#aircraft_filter").change (function(){
                            g_aircraft_id = $("select#aircraft_filter option:selected").val();
                        });
                    }
                });
            });
        }
    });

    zsi.initDatePicker();
});

$("#btnDis").click(function(){
    if($("#aircraft_filter").val() === ""){ 
        alert("Please select Aircraft Type.");
        return;
    }
    $("#zPanelId").css({display:"block"});
    displayHeader("#tabWrapper");
    displayRecords();

});

$("#btnPdf").click(function(){
  var _headerColumn = [];
    //var _detailColumn = [];
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Aircraft Info Report");
    _headerColumn.push(
             {title  : "Part No."                , name  : "part_no"                    ,titleWidth:100, width :100}
            ,{title  : "Nat'l Stock No."         , name  : "national_stock_no"          ,titleWidth:100, width :100}
            ,{title  : "Nomenclature"            , name  : "item_name"                  ,titleWidth:100, width :100}
    		,{title  : "Serial No."              , name  : "serial_no"                  ,titleWidth:100, width :100}
    );      
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
        ,masterColumn       : _headerColumn
        ,masterData         : g_masterData
        /*
        ,detailColumn       :  [
                         {title  : "Part No."                , name  : "part_no"                    ,titleWidth:100, width :100}
                        ,{title  : "Nat'l Stock No."         , name  : "national_stock_no"          ,titleWidth:100, width :100}
                        ,{title  : "Nomenclature"            , name  : "item_name"                  ,titleWidth:100, width :100}
                		,{title  : "Serial No."              , name  : "serial_no"                  ,titleWidth:100, width :100}
        ]
        */
       // ,detailData         : g_detailData
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
            //o.doc.text(o.margin.left + 60, o.row, g_masterData[0].receiving_warehouse);
            o.doc.text(o.margin.left + 60, o.row, "testing");
              
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Aircraft Info Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
    });   
});

function displayHeader(cbFunc){
    $.get(execURL + "aircraft_info_sel @aircraft_info_id="+ (g_aircraft_id ? g_aircraft_id : null), function(data){
        var _rows      = data.rows;
        var content = '<div>';
        var i,d;
        
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            content += '<div role="tabpanel"'+ d.aircraft_info_id +'">' +
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
                           '<div class="zGrid" id="tabGrid'+   d.aircraft_info_id  +'" ></div></div>';
        }
        content += "</div>";
        $("#tabWrapper").html(content);
    });
} 

function displayRecords(callback) {
    var _dataRows  = [];
    _dataRows.push(
		 {text  : "Part No."            , name:"part_no"                , width : 200       , style : "text-align:left;" }
		,{text  : "National Stock No."  , name:"national_stock_no"      , width : 200       , style : "text-align:left;" }
		,{text  : "Nomenclature"        , name:"item_name"              , width : 400       , style : "text-align:left;" }
		,{text  : "Serial No."          , name:"serial_no"              , width : 150       , style : "text-align:left;" }
		,{text  : "Critical Level"      , width : 150                , style : "text-align:center;"
		    ,onRender : function(d){ return (formatCurrency(svn(d,"critical_level")) === "" ? 0 : formatCurrency(svn(d,"critical_level"))); }
		}
		,{text  : "Remaining"           , name:"remaining_time"         , width : 100       , style : "text-align:right; padding-right:3px;"}
		,{text  : "Monitoring Type"     , name:"monitoring_type"        , width : 150       , style : "text-align:center;"}
    );
    
    $("#grid").dataBind({
         toggleMasterKey    : "aircraft_info_id"
        ,height             : 400 
        ,width              : $(document).width() - 27
        ,url                : execURL + "items_sel @aircraft_info_id="+ (g_aircraft_id ? g_aircraft_id : null)
        ,dataRows: _dataRows
        ,onComplete: function(data){
	        g_masterData = data.rows;
	        g_masterIds = "";
	        for(var x =0;x<g_masterData.length;x++ ){
	               if(g_masterIds!=="") g_masterIds +=",";
	                g_masterIds  += g_masterData[x].aircraft_info_id;

	        }
	        if( data.rows.length > 0)
	            $("#btnPdf").css({display: "inline"});
	        else 
	            $("#btnPdf").css({display: "none"});
        }  
    });
}

function formatCurrency(number){
    var result = "";
    if(number!==""){
        result = parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return result;
}                                                                                                                                         