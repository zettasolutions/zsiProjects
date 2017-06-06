var  bs         = zsi.bs.ctrl
    ,svn        = zsi.setValIfNull
    ,$rTypeId   = ""
    ,amount     = Number(0)
    ,procMode = [
        {text:"Shopping",value:"Shopping"}
        ,{text:"Bidding",value:"Bidding"}
    ]
    ,g_masterData   =   null
    ,g_masterIds    =   ""
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
    getTemplate();
    enableFilter();

    $ ("#wing_id").dataBind({
                           url: procURL + "organizations_dd_sel @organization_type_id=2"
                           , text: "organization_name"
                           , value: "organization_id"
    });
    $("#supplier_id").dataBind( "dealer");
    $ ("#report_type_id").dataBind({
                           url: execURL + "dd_procurement_report_type_sel"
                           , text: "report_type"
                           , value: "report_type_id"
    
        ,onComplete: function(){
            $("#report_type_id").change(function(){
                rTypeId = this.value;
                if(rTypeId === "") $("#zPanelId").css({display:"none"});
            });
        }
    });
    
    $("select[name='procurement_mode']").fillSelect({data: procMode});
    $("#proc_code_id").val("");
    $("input[name=proc_code]").on("keyup change", function(){
         clearform();
         disableFilter();
         if(this.value=== ""){ 
             $("#proc_code_id").val("");
             enableFilter();
          }     });
    
    zsi.initDatePicker();
    $('#proc_code').val('');
    clearform();
    setSearch();
});
	

function disableFilter(){
     $("#supplier_id").attr('disabled','disabled');
     $("#date_from").attr('disabled','disabled');
     $("#date_to").attr('disabled','disabled');
}

function enableFilter(){
     $("#supplier_id").removeAttr('disabled');
     $("#date_from").removeAttr('disabled');
     $("#date_to").removeAttr('disabled');
}

function clearform(){
    $('#date_from').val('');
    $('#date_to').val('');
    $('select').val('');   
}

function setSearch(){
    new zsi.search({
        tableCode: "ref-0030"
        ,colNames : ["procurement_code"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"procurement_code"
        ,input:"input[name=proc_code]"
        ,url : execURL + "searchData"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.procurement_code;
            $("#proc_code_id").val(data.procurement_id);
       }
    });        
}

$("#btnGo").click(function(){
    if($("#report_type_id").val() === ""){ 
        alert("Please select Report Type.");
        return;
    }
    $("#zPanelId").css({display:"block"});
    displayRecords();
});


$("#btnPdf").click(function(){
    var mw = $('#modalWindow');
    mw.modal({ show: true, keyboard: false, backdrop: 'static' });
    mw.find(".modal-title").text("Procurement Report");
    

    zsi.createPdfReport({
         margin             : { top :30  ,left:25 }
        ,cellMargin         : { left: 5 }
        ,isDisplay          : true
        ,fileName           : "procurement.pdf"  
        ,rowHeight          : 14
        ,widthLimit         : 520
        ,pageHeightLimit    : 800
        ,masterKey          : "procurement_id"
        /*
        ,masterColumn       :  [   
                                 {name:"procurement_code"       ,title:"Procurement No."    ,titleWidth:100 ,width:50}
                                ,{name:"procurement_date"       ,title:"Procurement Date"   ,titleWidth:100 ,width:120}
                                ,{name:"procurement_name"       ,title:"Procurement Name"   ,titleWidth:100 ,width:100}
                                ,{name:"supplier_name"          ,title:"Supplier"           ,titleWidth:100 ,width:100}
                            ]
        */
        ,detailColumn       : [   
                                 {name:"item_no"                ,title:"Item No."       ,width:100}
                                ,{name:"national_stock_no"      ,title:"Stock No."      ,width:100}
                                ,{name:"item_name"              ,title:"Nomenclature."  ,width:150}
                                ,{name:"unit_of_measure_code"   ,title:"Unit Measure"   ,width:100}
                            ]
        ,masterData         : g_masterData
        ,detailData         : g_detailData
        ,onPrintHeader      : function(o){
            if (g_imgData) {
                o.doc.addImage(g_imgData, 'JPEG', o.margin.left,  o.row, 50, 50);
            }
            o.row +=27;
            o.doc.setFontSize(12);
            o.doc.text(o.margin.left + 60, o.row, "Philippine Airforce");
            o.row +=40;
            o.doc.setFontSize(14);
            o.doc.text(o.margin.left, o.row, "Procurement Report");
            o.doc.setFontSize(10);
            o.row +=16;
            return o;
        }
        //customized master data printing
        
        ,onMasterDataPrint : function(o){
            if(o.index>0) o.row +=14; 
            //setBoxColor(o.doc,207, 226, 247);
            //o.doc.rect(20, o.row-10, 90,14, 'FD');    
            o.doc.text(25, o.row, "Procurement No.");
            
            //setBoxColor(o.doc,255, 255, 255);
            //o.doc.rect(120, o.row-10, 60,14, 'FD');    
            o.doc.text(125, o.row, ": "  + o.data.po_code);


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
    
    
    
});

function displayRecords(){
    var dateFrom    = $("#date_from").val();
    var dateTo      = $("#date_to").val();
    var suppId      = $("#supplier_id").val();
    var procId      = $("#proc_code_id").val();
    var rTypeId     = $("#report_type_id").val();


      //  console.log();
    
    $("#grid").dataBind({
         toggleMasterKey    : "procurement_id"
        ,height             : $(document).height() - 360 
        ,width              : $(document).width() - 25
        ,url                : execURL + "procurement_summary_report_sel @date_from="+ (dateFrom ? "'" + dateFrom + "'" : null)
                                      + ",@date_to="+ (dateTo ? "'" + dateTo + "'" : null)
                                      + ",@supplier_id="+ (suppId ?  suppId : null) 
                                      + ",@procurement_id="+ (procId ?  procId : null)
                                      + ",@report_type_id="+ (rTypeId ? rTypeId  : null)
        ,dataRows : [
                {text  : "&nbsp;"                                              , width : 25           , style : "text-align:left;"
                     ,onRender : function(d){
                          return "<a  href='javascript:void(0);' onclick='displayDetail(this,"+ d.procurement_id +");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"; 
                    }
                 }
                ,{text  : "Procurement No."         , name  : "po_code"                 , width : 120           , style : "text-align:left;"}
        		,{text  : "Procurement Date"                                            , width : 180           , style : "text-align:left;"
        		    ,onRender: function(d){ return svn(d,"procurement_d ate").toDateFormat();}
        		}
        		,{text  : "Procurement Name"        , name  : "procurement_name"        , width : 200           , style : "text-align:left;"}
        		,{text  : "Supplier Name"           , name  : "supplier_name"           , width : 150           , style : "text-align:left;"}
        		,{text  : "Promised Delivery Date"  , name  : "promised_delivery_date"  , width : 180           , style : "text-align:left;"}
        		,{text  : "Actual Delivery Date"    , name  : "actual_delivery_date"    , width : 150           , style : "text-align:left;"}
        		,{text  : "No. of items"            , name  : "no_items"                , width : 100           , style : "text-align:right;"}
        		,{text  : "Ordered Qty."            , name  : "total_ordered_qty"       , width : 100           , style : "text-align:right;"}
        		,{text  : "Balance Qty."            , name  : "total_balance_qty"       , width : 100           , style : "text-align:right;"}
        		,{text  : "Total Amount"                                                , width : 100           , style : "text-align:right;"
        		    ,onRender: function(d){ return svn(d,"total_amount").toLocaleString('en-PH', {minimumFractionDigits: 2})}
        		}
        		,{text  : "Delivery Status"         , name  : "delivery_status"         , width : 150           , style : "text-align:center;"}
        		,{text  : "Timing Status"           , name  : "timing_status"           , width : 150           , style : "text-align:center;"}
        		
	    ]
	    ,onComplete : function(data){
	        g_masterData = data.rows;
	        g_masterIds = "";
	        for(var x =0;x<g_masterData.length;x++ ){
	               if(g_masterIds!=="") g_masterIds +=",";
	                g_masterIds  += g_masterData[x].procurement_id;

	        }
	        $.post(execURL + "procurement_detail_sel @master_ids='" + g_masterIds + "'" ,function(data){
	           g_detailData = data.rows;
	        });
	        
	       //display pdf export button
	       $("#btnPdf").css({display:"block"});  

	    }

    });
}


function displayDetail(o,id){
   
    zsi.toggleExtraRow({
         object     : o
        ,parentId   : id
        ,onLoad : function($grid){ 
            
            var toCurrency = new Intl.NumberFormat('en-PH', {
                style: 'currency', 
                currency: 'PHP', 
                minimumFractionDigits: 2,
            });

            var amt = 0;
            $grid.dataBind({
                 url        : execURL + "procurement_detail_sel @procurement_id="+ id
                 //,width     : $(document.width) -100
                ,dataRows   : [
                		 {text  : "Item No."                , name  : "item_no"                     , width : 100           , style : "text-align:left;"}
                		,{text  : "Part No."                , name  : "part_no"                     , width : 100           , style : "text-align:left;"}
                		,{text  : "National Stock No."      , name  : "national_stock_no"           , width : 150           , style : "text-align:left;"}
                		,{text  : "Nomenclature"            , name  : "item_description"            , width : 250           , style : "text-align:left;"}
                		,{text  : "Unit of Measure"         , name  : "unit_of_measure_code"        , width : 150           , style : "text-align:left;"}
                		,{text  : "Ordered Qty."            , name  : "quantity"                    , width : 150           , style : "text-align:right;"}
                		,{text  : "Total Delivered Qty."    , name  : "total_delivered_quantity"    , width : 150           , style : "text-align:right;"}
                		,{text  : "Balance Qty."            , name  : "balance_quantity"            , width : 100           , style : "text-align:right;"}
                		,{text  : "Unit Price"              , name  : "unit_price"                  , width : 100           , style : "text-align:right;"
                		    ,onRender: function(d){ return svn(d,"unit_price").toLocaleString('en-PH', {minimumFractionDigits: 2})}
                		}
                		,{text  : "Amount"                                     , width : 100           , style : "text-align:right;"
                		    ,onRender: function(d){ amt += parseFloat(svn(d,"amount"));
                		                            return svn(d,"amount").toLocaleString('en-US', {minimumFractionDigits: 2});
                		    }
                		}
                	    ] 
                ,onComplete: function(){
                    var totalRow = "";
                    totalRow += '<div class="zRow total">'; 
                    totalRow +=    '<div class="zCell" style="width:1250px;text-align:right;"><span class="text">Total&nbsp;</span></div>';
                    totalRow +=    '<div class="zCell" style="width:100px;text-align:right;"><span class="text">' + toCurrency.format(amt) + '</span></div>';
                    totalRow += '</div>'; 
            		$grid.find(".right #table").append(totalRow);
                }        
            });    

        }
    
    });
}


                                                                                                             