  var  bs            = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,g_masterData   = null
    ,g_imgData      = null
    ,g_masterColumn = []
    ,g_masterData   = []
    ,g_detailColumn = []
    ,g_detailData   = []
    ,currentDate    = new Date();

imgToBase64( base_url + 'images/airforce-logo.jpg'  , function(img){
    g_imgData = img;
});
    
var header = '<div class="zContainer1 header ui-front">' +
               '<div id="tabBox" class="form-horizontal" style="padding:5px">' +
                    '<div class="col-xs-12 col-sm-6 col-md-3">' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 control-label text-left">Type:</label>' +
                            '<div class="col-xs-8">' +
                                '<span class="col-xs-12 control-label text-left" id="aircraft_type"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 control-label text-left">Origin:</label>' +
                            '<div class="col-xs-8">' +
                                '<span class="col-xs-12 control-label text-left" id="origin">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12 col-sm-6 col-md-3">' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 col-md-4 control-label text-left">Class:</label>' +
                            '<div class="col-xs-8 col-md-8">' +
                                '<span class="col-xs-12 control-label text-left" id="class">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 col-md-4 control-label text-left">Manufacturer:</label>' +
                            '<div class="col-xs-8 col-md-8">' +
                                '<span class="col-xs-12 control-label text-left" id="manufacturer">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12 col-sm-6 col-md-2">' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 control-label text-left">Role:</label>' +
                            '<div class="col-xs-8">' +
                                '<span class="col-xs-12 control-label text-left" id="role">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-xs-4 control-label text-left">Status:</label>' +
                            '<div class="col-xs-8">' +
                                '<span class="col-xs-12 control-label text-left" id="status">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12 col-sm-6 col-md-3">' +
                        '<div class="form-group">' +
                            '<label class="col-xs-6 col-sm-6 col-md-7 control-label text-left">Aircraft Time (Hours):</label>' +
                            '<div class="col-xs-6 col-sm-6 col-md-5">' +
                                '<span class="col-xs-12 control-label text-left" id="aircraft_time">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-xs-6 col-sm-6 col-md-7 control-label text-left">Hours Left to Inspection:</label>' +
                            '<div class="col-xs-6 col-sm-6 col-md-5">' +
                                '<span class="col-xs-12 control-label text-left" id="service_time">&nbsp;</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
        var context = { id:"modalWindow"
                        , sizeAttr: "fullWidth"
                        , title: "Aircraft Inventory Report"
                        , body: '<iframe id="ifrmWindow" style="width:100%;height:600px" frameborder="0"></iframe>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}
	
zsi.ready(function(){
    getTemplate();
    $("#header-content").html(header);
    $("#warehouse_id").dataBind({
           url: procURL + "dd_organizations_sel @squadron_type='aircraft'"
            , text: "organization_name"
            , value: "organization_id"
    });
    $("#aircraft_info_id").dataBind({
           url: execURL + "aircraft_info_sel"
           , text: "aircraft_name"
           , value: "aircraft_info_id"
    });
});

$("#btnGo").click(function(){
    if($("#warehouse_id").val() === ""){ 
        alert("Please select Warehouse.");
        return;
    }
    if($("#aircraft_info_id").val() === ""){ 
        alert("Please select Aircraft.");
        return;
    }
    clearHeaderInfo();
    displayBox();
    displayRecords();
});

function clearHeaderInfo(){
    $("#tabBox span").html('');
}

function displayBox(){
    var warehouse_id = $("#warehouse_id").val();
    var aircraft_info_id = $("#aircraft_info_id").val();
    $.get(execURL + "aircraft_info_sel @aircraft_info_id=" + aircraft_info_id +",@squadron_id="+ warehouse_id
    ,function(data){
        var d = data.rows;
        if(d.length > 0){
            $("#zPanelId, #btnPdf").show();
            $("#tabBox #aircraft_type").text(d[0].aircraft_type);
            $("#tabBox #origin").text(d[0].origin_name);
            $("#tabBox #class").text(d[0].aircraft_class_name);
            $("#tabBox #manufacturer").text(d[0].manufacturer_name);
            $("#tabBox #role").text(d[0].aircraft_role_name);
            $("#tabBox #aircraft_time").text(formatCurrency(d[0].aircraft_time));
            $("#tabBox #status").text(d[0].status_name);
            $("#tabBox #service_time").text(d[0].service_time);
            
            /*g_masterColumn = [   
                 {name:"aircraft_type"          ,title:"Type"                   ,titleWidth:100 ,width:50}
                ,{name:"origin_name"            ,title:"Origin"                 ,titleWidth:100 ,width:80}
                ,{name:"aircraft_class_name"    ,title:"Class"                  ,titleWidth:100 ,width:100}
                ,{name:"manufacturer_name"      ,title:"Manufacturer"               ,titleWidth:100 ,width:100}
                ,{name:"aircraft_role_name"     ,title:"Role"                       ,titleWidth:100 ,width:100}
                ,{name:"aircraft_time"          ,title:"Aircraft Time (Hours)"    ,titleWidth:110 ,width:100}
                ,{name:"status_name"            ,title:"Status"                     ,titleWidth:100 ,width:100}
                ,{name:"service_time"           ,title:"Hours Left to Inspection"   ,titleWidth:110 ,width:100}
            ];*/
            g_masterData = data.rows;
        }else{
            g_masterColumn = [];
            g_masterData = []; 
            $("#zPanelId, #btnPdf").hide();
        }
    });
}
    
function displayRecords(){
    var aircraft_info_id = $("#aircraft_info_id").val();
    var _dataRows = [
		{text  : "Part No."                    , type  : "label"       , width : 175       , style : "text-align:left;" 
		    ,onRender : function(d){ return  svn(d,"part_no"); }
		}
		,{text  : "National Stock No."           , type  : "label"       , width : 175      , style : "text-align:left;" 
		    ,onRender : function(d){ return svn(d,"national_stock_no"); }
		}
		,{text  : "Nomenclature"                   , type  : "label"       , width : 350       , style : "text-align:left;"
		    ,onRender : function(d){ return svn(d,"item_name"); }
		}
        ,{text  : "Serial No."                  , type  : "label"       , width : 150       , style : "text-align:center;"
            ,onRender : function(d){ 
                return svn(d,"serial_no");
            }
        }
		,{text  : "Critical Level"            , type  : "label"       , width : 150       , style : "text-align:center;" 
            ,onRender : function(d){ 
                return formatCurrency(svn(d,"critical_level"));
            }
		}
		,{text  : "Remaining"                  , type  : "label"       , width : 200       , style : "text-align:center;" 
		    ,onRender : function(d){ return formatCurrency(svn(d,"remaining_time")); }
		}
        ,{text  : "Monitoring Type"             , type  : "label"       , width : 150       , style : "text-align:center;"
		    ,onRender : function(d){ return svn(d,"monitoring_type"); }
		}
    ];
    
    $("#grid").dataBind({
	     url      : execURL + "items_sel @aircraft_info_id=" + aircraft_info_id
	    ,width    : $(document).width() - 25
	    ,height   : $(document).height() - 310
	    ,isPaging : true
        ,dataRows : _dataRows
        ,onComplete : function(data){
	        if(data.rows.length > 0){
	            g_detailColumn   = [   
                        {name:"part_no"             ,title:"Part No."           ,width:130}
                        ,{name:"national_stock_no"  ,title:"National Stock No." ,width:130}
                        ,{name:"item_name"          ,title:"Nomenclature"       ,width:180}
                        ,{name:"serial_no"          ,title:"Serial No."         ,width:100}
                        ,{name:"critical_level"     ,title:"Critical Level"     ,width:70}
                        ,{name:"remaining_time"     ,title:"Remaining"          ,width:70}
                        ,{name:"monitoring_type"    ,title:"Monitoring Type"    ,width:80} 
                ];
	            g_detailData = data.rows;
	            
	        }else{
	            g_detailColumn = [];
	            g_detailData = [];
	        }
        }
    });    
}  

$("#btnPdf").click(function(){
    var warehouseName = $("#warehouse_id option:selected").text();
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Aircraft Inventory Report");
    
    zsi.createPdfReport({
         margin             : { top :20  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,rowHeight          : 14
        ,widthLimit         : 550
        ,pageHeightLimit    : 750
        ,isDisplay          : true
        ,fileName           : "AircraftInventoryReport.pdf"  
        ,MasterKey          : "aircraft_info_id"
        ,masterColumn       : g_masterColumn
        ,masterData         : g_masterData
        ,detailColumn       : g_detailColumn
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
            o.doc.text(o.margin.left, o.row, "Aircraft Inventory Report");
            
            o.row +=15;
            o.doc.setFontSize(10);
            o.doc.text(o.margin.left, o.row, warehouseName);
            o.doc.text(o.margin.left + 635, o.row, "Inventory As of Date(" + currentDate.toString().toDateFormat() +")");
            o.row +=16;
            return o;
        }

        //customized master data printing
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14;  
            o.doc.text(25, o.row, "Type.");   
            o.doc.text(110, o.row, ": "  + o.data.aircraft_type);  
            
            o.doc.text(315, o.row, "Class");
            o.doc.text(415, o.row,  ": "  + o.data.aircraft_class_name);
            
            //new row
            o.row +=18;  
            o.doc.text(25, o.row, "Origin");  
            o.doc.text(110, o.row, ": "  + o.data.origin_name);
            
            o.doc.text(315, o.row, "Manufacturer");  
            o.doc.text(415, o.row,  ": "  + o.data.manufacturer_name);
            
            //new row
            o.row +=18; 
            o.doc.text(25, o.row, "Role");
            o.doc.text(110, o.row, ": "  + o.data.aircraft_role_name);
            
            o.doc.text(315, o.row, "Status");
            o.doc.text(415, o.row,  ": "  + o.data.status_name);
            
            //new row
            o.row +=18; 
            o.doc.text(25, o.row, "Aircraft Time (Hours)");
            o.doc.text(120, o.row, ": "  + formatCurrency(o.data.aircraft_time));
            o.doc.text(315, o.row, "Hours Left to Inspection");
            o.doc.text(425, o.row,  ": "  + o.data.service_time);
            
            return o.row;    
        }
    });
    
    /*zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "AircraftInventoryReport.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
        ,columnHeader       :  [   
            {name:"part_no"             ,title:"Part No."           ,width:130}
            ,{name:"national_stock_no"  ,title:"National Stock No." ,width:130}
            ,{name:"item_name"          ,title:"Nomenclature"       ,width:130}
            ,{name:"serial_no"          ,title:"Serial No."         ,width:60}
            ,{name:"critical_level"     ,title:"Critical Level"     ,width:55}
            ,{name:"remaining_time"     ,title:"Remaining"          ,width:80}
            ,{name:"monitoring_type"    ,title:"Monitoring Type"    ,width:70} 
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
            o.doc.text(o.margin.left, o.row, "Aircraft Inventory Report");
            
            o.row +=15;
            o.doc.setFontSize(10);
            o.doc.text(o.margin.left, o.row, warehouseName);
            o.doc.text(o.margin.left + 635, o.row, "Inventory As of Date(" + currentDate.toString().toDateFormat() +")");
            o.row +=16;
            return o;
        }
    }); */     
});

function formatCurrency(number){
    var result = "";
    if(number!==""){
        result = parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return result;
}  
