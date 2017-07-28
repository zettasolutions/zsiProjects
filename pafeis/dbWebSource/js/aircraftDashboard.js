var bs     = zsi.bs.ctrl
    ,svn    = zsi.setValIfNull
    ,aircraft_info_id = null
    ,parent_item_id = null
    ,g_user_id = null
    ,g_squadron_id = null
    ,g_aircraft_info_id = null
    ,g_organization_name = ""
    ,pageName = location.pathname.split('/').pop()
    ,g_option_id = ""
;

function setInputs(){
    $optionId = $("#option_id");
    $keyword  = $("#keyword");
    $column   = $("#column");
}

zsi.ready(function(){
    getTemplate();
    $(".pageTitle").html('<select name="dd_dashboard" id="dd_dashboard" class="col-xs-12 col-sm-4 col-md-3 col-lg-3" > </select>');

    wHeight = $(window).height();
    setInputs();
    $optionId.fillSelect({
        data : [
             { text: "All", value: "A" }
            ,{ text: "Critical Nomenclatures", value: "C" }
        ]
        ,selectedValue : option_id
        ,defauleValue  : "A"
        ,required      : true
    });
    $("#option_id").val("A");
    
    getUserInfo(function(){
        $(".pageTitle").append('<label class="col-xs-2 col-sm-1" style="text-align:right"> for » </label> <select name="dd_squadron" id="dd_squadron" class="col-xs-10 col-sm-7 col-md-6 col-lg-5"></select>');
        $("#dd_dashboard").dataBind({
            url: procURL + "dd_dashboard_sel"
            , text: "page_title"
            , value: "page_name"
            , required :true
            , onComplete: function(){
                $("#dd_dashboard").val(pageName);
                $("#dd_dashboard").change(function(){
                    if(this.value){
                        if(this.value.toUpperCase()!== pageName.toUpperCase())
                            location.replace(base_url + "page/name/" + this.value);
                    } 
                });
            }
        });
        
        $("#dd_squadron").dataBind({
            url: procURL + "dd_organizations_sel @squadron_type='aircraft'"
            , text: "organization_name"
            , value: "organization_id"
            , required :true
            , onComplete: function(){
                g_squadron_id = $("select#dd_squadron option:selected").val();
                if(g_squadron_id) displayTabs();
                
                $("select#dd_squadron").change (function(){
                    g_squadron_id = null;
                    $("#tabWrapper").empty();
                    if(this.value)
                        g_squadron_id = this.value;
                        
                    displayTabs();
                });
            }
        });  
    });
});

var contextModalSerial = {
    id: "modalSerial"
    , title: ""
    , sizeAttr: "modal-md"
    , body: '<div id="tblSerial" style="padding-top:5px""></div>'
};

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalSerial));
    });    
}

$("#btnGo").click(function(data){
    getFilterValue(function(){
        displayItems(g_aircraft_info_id);
    });
});

$("#btnClear").click(function(){
    g_keyword = "";
    g_column_name = "";
    $column.val('');
    $keyword.val('');
    getFilterValue(function(){
        displayItems(g_aircraft_info_id);
    });
});

function getFilterValue(callBack){
    g_aircraft_info_id = $(".nav-tabs > li.active").children("a").attr("id");
    g_option_id = ($optionId.val() ? $optionId.val(): "");
    g_keyword = $.trim($keyword.val());
    g_column_name = ($column.val() ? $column.val(): "");
    
    if(callBack) callBack();
}

function displayDetails(tbl_obj) {
    var $table = $(tbl_obj);
    $table.html('');
    var html =  '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Part No.:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="part_no" id="part_no" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">National Stock No.:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="national_stock_no"  id="national_stock_no" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label">Nomenclature:</label>' +
                    '<div class="  col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="item_name"  id="item_name" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label">Manufacturer:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="manufacturer_name"  id="manufacturer_name" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Dealer:</label>' +
                    '<div class="  col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="dealer_name"  id="dealer_name" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Supply Source:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="supply_source_name" id="supply_source_name" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Time Since New:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="time_since_new"  id="time_since_new" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Time Before Overhaul:</label>' +
                    '<div class="  col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="time_before_overhaul"  id="time_before_overhaul" class="fcontrol-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Time Since Overhaul:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="time_since_overhaul" id="time_since_overhaul" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Remaining Time:</label>' +
                    '<div class=" col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="remaining_time"  id="remaining_time" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group col-xs-12 ">' +
                    '<label class=" col-lg-4 col-md-4 col-sm-4 col-xs-5 control-label ">Monitoring Type:</label>' +
                    '<div class="  col-lg-8 col-md-8 col-sm-8 col-xs-7">' +
                        '<span name="monitoring_type"  id="monitoring_type" class="control-label">&nbsp;</span>' +
                    '</div>' +
                '</div>' ;
    $table.append(html);
}

function showModalSerial(id, item_id, serial_no) {
    $("#modalSerial .modal-title").text('Details for Serial No: ' + serial_no);
    $("#modalSerial").modal({ show: true, keyboard: false, backdrop: 'static' });
    displayDetails("#tblSerial");
    
    $.get(execURL + "items_sel @aircraft_info_id=" + id + ",@item_id=" + (item_id ? item_id : null) 
    ,function(data) {
        var d = data.rows;
        if (d.length > 0) {
            $("#tblSerial #part_no").text(d[0].part_no);
            $("#tblSerial #national_stock_no").text(d[0].national_stock_no);
            $("#tblSerial #item_name").text(d[0].item_name);
            $("#tblSerial #manufacturer_name").text(d[0].manufacturer_name);
            $("#tblSerial #dealer_name").text(d[0].dealer_name);
            $("#tblSerial #supply_source_name").text(d[0].supply_source_name);
            $("#tblSerial #time_since_new").text(d[0].time_since_new);
            $("#tblSerial #time_before_overhaul").text(d[0].time_before_overhaul);
            $("#tblSerial #time_since_overhaul").text(d[0].time_since_overhaul);
            $("#tblSerial #remaining_time").text(d[0].remaining_time);
            $("#tblSerial #monitoring_type").text(d[0].monitoring_type);
        }
    });
}

function showModalDetailSerial(id, item_id, parent_item_id, serial_no) {
    $("#modalSerial .modal-title").text('Details for Serial No: ' + serial_no);
    $("#modalSerial").modal({ show: true, keyboard: false, backdrop: 'static' });
    displayDetails("#tblSerial");
    
    $.get(execURL + "items_sel @aircraft_info_id=" + id + ",@item_id=" + (item_id ? item_id : null) + ",@parent_item_id=" + (parent_item_id ? parent_item_id : null) 
    ,function(data) {
        var d = data.rows;
        if (d.length > 0) {
            $("#tblSerial #part_no").text(d[0].part_no);
            $("#tblSerial #national_stock_no").text(d[0].national_stock_no);
            $("#tblSerial #item_name").text(d[0].item_name);
            $("#tblSerial #manufacturer_name").text(d[0].manufacturer_name);
            $("#tblSerial #dealer_name").text(d[0].dealer_name);
            $("#tblSerial #supply_source_name").text(d[0].supply_source_name);
            $("#tblSerial #time_since_new").text(d[0].time_since_new);
            $("#tblSerial #time_before_overhaul").text(d[0].time_before_overhaul);
            $("#tblSerial #time_since_overhaul").text(d[0].time_since_overhaul);
            $("#tblSerial #remaining_time").text(d[0].remaining_time);
            $("#tblSerial #monitoring_type").text(d[0].monitoring_type);
        }
    });
}


function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_name = d.rows[0].organizationName;
        }
        if(callBack) callBack();
    });
}

function displayTabs(cbFunc){
    $.get(execURL + "aircraft_info_sel @squadron_id="+ (g_squadron_id ? g_squadron_id : null), function(data){
        var _rows      = data.rows;
        var tabList    = '<ul class="nav nav-tabs" role="tablist">';
        var tabContent = '<div class="tab-content">';
        var i,d;
        
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            var active      = (i===0 ? "active": "");
            tabList += '<li role="presentation" class="'+ active +'"><a id="'+ d.aircraft_info_id +'" href="#tab'+ d.aircraft_info_id +'" aria-controls="'+ d.item_cat_name +'" role="tab" data-toggle="tab">'+ d.aircraft_name +'</a></li>';
            tabContent += '<div role="tabpanel" class="tab-pane '+ active +'" id="tab'+ d.aircraft_info_id +'">' +
                           '<div class="zContainer1 header ui-front" id="tabBox'+ d.aircraft_info_id +'">' +
                               '<div class="form-horizontal" style="padding:5px">' +
                                    '<div class="col-xs-2">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-3 control-label text-left">Type:</label>' +
                                            '<div class="col-xs-9">' +
                                                '<span class="col-xs-12 control-label text-left">'+ d.aircraft_type +'</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-3 control-label text-left">Origin:</label>' +
                                            '<div class="col-xs-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="origin">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-3">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-4 control-label text-left">Class:</label>' +
                                            '<div class="col-xs-8">' +
                                                '<span class="col-xs-12 control-label text-left" id="class">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-4 control-label text-left">Manufacturer:</label>' +
                                            '<div class="col-xs-8">' +
                                                '<span class="col-xs-12 control-label text-left" id="manufacturer">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-1">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-5 control-label text-left">Role:</label>' +
                                            '<div class="col-xs-7">' +
                                                '<span class="col-xs-12 control-label text-left" id="role">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-5 control-label text-left">Status:</label>' +
                                            '<div class="col-xs-7">' +
                                                '<span class="col-xs-12 control-label text-left" id="status">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-3">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-7 control-label text-left">Aircraft Time (Hours):</label>' +
                                            '<div class="col-xs-5">' +
                                                '<span class="col-xs-12 control-label text-left" id="aircraft_time">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-7 control-label text-left">Hours Left to Inspection:</label>' +
                                            '<div class="col-xs-5">' +
                                                '<span class="col-xs-12 control-label text-left" id="service_time">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-xs-2">' +
                                        '<div class="form-group">' +
                                            '<label class="col-xs-3 control-label text-left"></label>' +
                                            '<div class="col-xs-9">' +
                                                '<span class="col-xs-12 control-label text-left" id="">&nbsp;</span>' +
                                            '</div>' +
                                        '</div>' +

                                    '</div>' +
                                '</div>' +
                            '</div>' +
                           '<div class="zGrid" id="tabGrid'+   d.aircraft_info_id  +'" ></div></div>';
        }
        tabList += "</ul>";
        tabContent += "</div>";
        
        $("#tabWrapper").html(tabList + tabContent);
        
        for(i=0; i < _rows.length; i++){
            d =_rows[i];
            displayBox(d.aircraft_info_id);
            displayItems(d.aircraft_info_id);
        }
    });
} 

function displayBox(id){
    $.get(execURL + "aircraft_info_sel @aircraft_info_id=" + id +",@squadron_id="+ (g_squadron_id ? g_squadron_id : null)
    ,function(data){
        var d = data.rows;
        if(d.length > 0){
            $("#tabBox"+ id +" #origin").text(d[0].origin_name);
            $("#tabBox"+ id +" #class").text(d[0].aircraft_class_name);
            $("#tabBox"+ id +" #manufacturer").text(d[0].manufacturer_name);
            $("#tabBox"+ id +" #role").text(d[0].aircraft_role_name);
            $("#tabBox"+ id +" #year").text(d[0].introduced_year);
            $("#tabBox"+ id +" #aircraft_time").text(formatCurrency(d[0].aircraft_time));
            $("#tabBox"+ id +" #status").text(d[0].status_name);
            $("#tabBox"+ id +" #service_time").text(d[0].service_time);
        }
    });
}

function displayItems(id, callback){
    var counter = 0;
    $("#tabGrid" + id).dataBind({
	     url            : procURL + "items_sel @aircraft_info_id=" + id +",@option_id='" + g_option_id +"'"
	    ,toggleMasterKey    : "item_id"
	    ,width          : $(document).width() - 25
	    ,height         : $(document).height() - 360
	    ,isPaging : true
        ,dataRows : [

        	    {text  : "&nbsp;"               , width : 25                    , style : "text-align:left;"
        	        ,onRender : function(d){ 
        	            counter++;
                        return '<input class="form-control" type="text" name="item_no" id="item_no" value="' + counter + '" readonly>';
                    }
        	    }        	     
               ,{text  : "&nbsp;"              , width : 25         , style : "text-align:left;"
                     ,onRender : function(d){
                         return (   
                                  d.countAircraftAC !==0  
                                ? "<a  href='javascript:void(0);' onclick='displayRecordsComponents(this,"+ d.item_id + "," + id + ");'><span class='glyphicon glyphicon-collapse-down' style='font-size:12pt;' ></span> </a>"
                                : ""                         
                         );
                     }
                 }
        		,{text  : "Part No."            , name:"part_no"                , width : 200       , style : "text-align:left;" ,sortColNo: 2}
        		,{text  : "National Stock No."  , name:"national_stock_no"      , width : 200       , style : "text-align:left;" ,sortColNo: 3}
        		,{text  : "Nomenclature"        , name:"item_name"              , width : 400       , style : "text-align:left;" ,sortColNo: 4}
        		,{text  : "Serial No."                                          , width : 150       , style : "text-align:left;" ,sortColNo: 5
                    ,onRender : function(d){ return "<a href='javascript:showModalSerial(" 
                                            + svn(d,"aircraft_info_id") + ",\"" 
                                            + svn(d,"item_id") + "\",\"" 
                                            + svn(d,"serial_no") + "\");'>" 
                                            + svn(d,"serial_no") + "</a>"; 
                   }
        		}
        		,{text  : "Critical Level"      , width : 150                , style : "text-align:center;"
        		    ,onRender : function(d){ return (formatCurrency(svn(d,"critical_level")) === "" ? 0 : formatCurrency(svn(d,"critical_level"))) ; }
        		}
        		,{text  : "Remaining"           , width : 100       , style : "text-align:right; padding-right:3px" ,sortColNo: 7
        		    ,onRender : function(d){ 
        		         if(d.remaining_time < d.critical_level)
        		                return "<span id='remaining_time' class='remaining' >" + formatCurrency(svn(d,'remaining_time')) +"</span>";
        		         else 
        		                return formatCurrency(svn(d,"remaining_time"));
        		       
        		    }
        		}
        		,{text  : "Monitoring Type"    , name:"monitoring_type" , width : 150       , style : "text-align:center;"}
	    ]   
    });    
}          

function displayRecordsComponents(o,id,aircraft_info_id){
    zsi.toggleExtraRow({
         object     : o
        ,parentId   : id
        ,onLoad : function($grid){ 
            
            $grid.dataBind({
                 url        : execURL + "items_sel @parent_item_id=" + id + ",@aircraft_info_id=" + aircraft_info_id
                ,dataRows   : [
                         {text  : "Part No."                 , name  : "part_no"                , width : 200       , style : "text-align:left;"}
                		,{text  : "National Stock No."       , name  : "national_stock_no"      , width : 200       , style : "text-align:left;"}
                		,{text  : "Nomenclature"             , name  : "item_name"              , width : 400       , style : "text-align:left;"}
                		,{text  : "Serial No."                                          , width : 150       , style : "text-align:left;" ,sortColNo: 5
                            ,onRender : function(d){ return "<a href='javascript:showModalDetailSerial(" 
                                                    + svn(d,"aircraft_info_id") + ",\"" 
                                                    + svn(d,"item_id") + "\",\"" 
                                                    + svn(d,"parent_item_id") + "\",\""
                                                    + svn(d,"serial_no") + "\");'>" 
                                                    + svn(d,"serial_no") + "</a>"; 
                           }
                		}
                		,{text  : "Critical Level"           , width : 150                , style : "text-align:center;"
                		    ,onRender : function(d){ return (formatCurrency(svn(d,"critical_level")) === "" ? 0 : formatCurrency(svn(d,"critical_level"))) ; }
                		}
                		,{text  : "Remaining"           , width : 100       , style : "text-align:right; padding-right:3px" ,sortColNo: 7
                		    ,onRender : function(d){ 
                		         if(d.remaining_time < d.critical_level)
                		                return "<span id='remaining_time' class='remaining' >" + formatCurrency(svn(d,'remaining_time')) +"</span>";
                		         else 
                		                return formatCurrency(svn(d,"remaining_time"));
                		       
                		    }
                		}
                		,{text  : "Monitoring Type"          , name  : "monitoring_type"        , width : 150       , style : "text-align:center;"}
                ]                      
                
            });    
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