 var  bs            = zsi.bs.ctrl
    ,svn            = zsi.setValIfNull
    ,g_masterData   = null
    ,g_imgData      = null
    ,currentDate    = new Date();

imgToBase64( base_url + 'images/airforce-logo.jpg'  , function(img){
    g_imgData = img;
});
    
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "fullWidth"
                        , title: "Running Inventory PDF Report"
                        , body: '<table id="tblPDF" class="table-bordered hide">'
                                +'<thead>'
                                +'    <tr>'
                                +'        <th>Part No.</th>'
                                +'        <th>National <br>Stock No.</th>'
                                +'        <th>Nomenclature</th>'
                                +'        <th class="text-center">Serviceable</th>'
                                +'        <th class="text-center">For Repair</th>'
                                +'        <th class="text-center">Total <br> Stock Qty.</th>'
                                +'        <th class="text-center">Reorder <br> Level</th>'
                                +'        <th class="text-center">Beyond <br>Repair</th>'
                                +'        <th class="text-center">UM</th>'
                                +'    </tr>'
                                +'</thead>'
                                +'</table>'
                                +'<iframe id="ifrmWindow" style="width:100%;height:600px" frameborder="0"></iframe>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}
	
zsi.ready(function(){
    getTemplate();
    $("#warehouse_id").dataBind({
           url: procURL + "dd_warehouses_sel"
           , text: "warehouse"
           , value: "warehouse_id"
    });
    $("#category_id").dataBind({
           url: procURL + "item_categories_sel"
           , text: "item_cat_name"
           , value: "item_cat_id"
    });
});

$("#btnGo").click(function(){
    if($("#warehouse_id").val() === ""){ 
        alert("Please select Warehouse.");
        return;
    }
    if($("#category_id").val() === ""){ 
        alert("Please select Category.");
        return;
    }
    displayRecords();
});
    
function displayRecords(){
    var warehouse_id = $("#warehouse_id").val();
    var category_id = $("#category_id").val();

    var _dataRows = [
		{text  : "Part No."                    , type  : "label"       , width : 150       , style : "text-align:left;"     ,sortColNo: 1
		    ,onRender : function(d){ return  svn(d,"part_no"); }
		}
		,{text  : "National Stock No."           , type  : "label"       , width : 150      , style : "text-align:left;"    ,sortColNo: 2
		    ,onRender : function(d){ return svn(d,"national_stock_no"); }
		}
		,{text  : "Nomenclature"                   , type  : "label"       , width : 450       , style : "text-align:left;"    ,sortColNo: 3
		    ,onRender : function(d){ return svn(d,"item_name"); }
		}
        ,{text  : "Serviceable"                  , type  : "label"       , width : 100       , style : "text-align:center;" ,sortColNo: 6
            ,onRender : function(d){ 
                return svn(d,"stock_qty").toLocaleString("en");
            }
        }
		,{text  : "For Repair"                  , type  : "label"       , width : 150       , style : "text-align:center;" 
            ,onRender : function(d){ 
                return svn(d,"for_repair").toLocaleString("en");
            }
		}
		,{text  : "Total Stock Qty."                  , type  : "label"       , width : 150       , style : "text-align:center;" 
		    ,onRender : function(d){ return svn(d,"ttl_stocks").toLocaleString("en"); }
		}
        ,{text  : "Reorder Level"               , type  : "label"       , width : 100       , style : "text-align:center;"
		    ,onRender : function(d){ return svn(d,"reorder_level"); }
		}
		,{text  : "Beyond Repair"                  , type  : "label"       , width : 150       , style : "text-align:center;" 
            ,onRender : function(d){
                return svn(d,"beyond_repair").toLocaleString("en");
            }
		}
   		,{text  : "Unit of Measure"               , type  : "label"       , width : 200       , style : "text-align:center;"
		    ,onRender : function(d){ return svn(d,"unit_of_measure"); }
		}    
    ];
    
    $("#grid").dataBind({
	     url      : procURL + "items_inv_sel @item_cat_id=" + category_id + ",@warehouse_id=" + warehouse_id
	    ,width    : $(document).width() - 25
	    ,height   : $(document).height() - 310
	    ,isPaging : true
        ,dataRows : _dataRows
        ,onComplete : function(o){
	        if(o.data.rows.length > 0){
	            g_masterData = o.data.rows;
	            $("#zPanelId, #btnPdf").show();
	        }
        }
    });    
}  

$("#btnPdf").click(function(){
    var warehouseName = $("#warehouse_id option:selected").text();
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Running Inventory Report");
    
    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "InventoryReport.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
        ,columnHeader       :  [   
            {name:"part_no"             ,title:"Part No."           ,width:130}
            ,{name:"national_stock_no"  ,title:"National Stock No." ,width:130}
            ,{name:"item_name"          ,title:"Nomenclature"       ,width:130}
            ,{name:"stock_qty"          ,title:"Serviceable"        ,width:60}
            ,{name:"for_repair"         ,title:"For Repair"         ,width:55}
            ,{name:"ttl_stocks"         ,title:"Total Stock Qty."   ,width:80}
            ,{name:"reorder_level"      ,title:"Reorder Level"      ,width:70}
            ,{name:"beyond_repair"      ,title:"Beyond Repair"      ,width:75}
            ,{name:"unit_of_measure"   ,title:"UM"                  ,width:60}
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
            o.doc.text(o.margin.left, o.row, "Inventory Report");
            
            o.row +=15;
            o.doc.setFontSize(10);
            o.doc.text(o.margin.left, o.row, warehouseName);
            o.doc.text(o.margin.left + 635, o.row, "Inventory As of Date(" + currentDate.toString().toDateFormat() +")");
            o.row +=16;
            return o;
        }
    });      
});

/*function appendPDFTable(){
    var warehouse_id = $("#warehouse_id").val();
    var category_id = $("#category_id").val();
    $("#tblPDF").loadData({
        url      : procURL + "items_inv_sel @item_cat_id=" + category_id + ",@warehouse_id=" + warehouse_id
        ,td_body : [
            function(d) {
                return d.part_no;
            }
            ,function(d) {
                return d.national_stock_no;
            }
            ,function(d) {
                return d.item_name;
            }
            ,function(d) {
                return d.stock_qty;
            }
            ,function(d) {
                return d.for_repair;
            }
            ,function(d) {
                return d.ttl_stocks;
            }
            ,function(d) {
                return d.reorder_level;
            }
            ,function(d) {
                return d.beyond_repair;
            }
            ,function(d) {
                return d.unit_of_measure;
            }
        ]
        ,td_properties: ["","","","class='text-center'","class='text-center'","class='text-center'","class='text-center'"]
    });
}

function generatePDFReport(){
    var warehouseName = $("#warehouse_id option:selected").text();
    console.log(warehouseName);
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Running Inventory Report");
    
    var doc = new jsPDF("l");
    doc.text("Running Inventory Report", 14, 16);
    doc.text(warehouseName, 84, 16);
    var elem = document.getElementById("tblPDF");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});   
    document.getElementById("ifrmWindow").src = doc.output('datauristring');
    
    /*zsi.generatePdfReport({
        sqlParameter : "items_inv_sel @item_cat_id=" + category_id + ",@warehouse_id=" + warehouse_id
        ,columnData : [
                         {title: "Part No."             ,dataKey: "part_no"             } 
                        ,{title: "National Stock No."   ,dataKey: "national_stock_no"   } 
                        ,{title: "Nomenclature"         ,dataKey: "item_name"           } 
                        ,{title: "Serviceable"          ,dataKey: "stock_qty"           } 
                        ,{title: "For Repair"           ,dataKey: "for_repair"          } 
                        ,{title: "Total Stock Qty."     ,dataKey: "ttl_stocks"          } 
                        ,{title: "Reorder Level"        ,dataKey: "reorder_level"       } 
                        ,{title: "Beyond Repair"        ,dataKey: "beyond_repair"       } 
                        ,{title: "Unit of Measure"      ,dataKey: "unit_of_measure"     }
                      ]
        ,logoURL     : base_url + 'images/airforce-logo.jpg'   
        ,reportTitle : "Running Inventory Report"
        ,isDisplay   : true
        ,fileName    : "RunningInvetoryReport.pdf"
    });  //
}*/

 