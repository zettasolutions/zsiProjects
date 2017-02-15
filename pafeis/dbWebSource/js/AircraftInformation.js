var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblCP = "tblComponents"
    ,aircraft_info_id = null
    ,aircraft_info_name = ""
;

zsi.ready(function(){
    displayRecords();
    getTemplate();
});

var contextComponents = { id:"modalWindowComponents"
                , title: "Components"
                , sizeAttr: "modal-lg"
                , footer: '<div class="pull-left"><button type="button" onclick="submitAssembly();" class="btn btn-primary">'
                + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'

                , body:            
                '<div id="' + tblCP + '" class="zGrid"></div>'
                     
};
      
function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextComponents));
       
        if(callback) callback();
    });    
}  
        
$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
          procedure: "aircraft_info_upd"
        , onComplete: function (data) {
            $("#grid").clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayRecords();
        }
    });
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "aircraft_info_sel"
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"aircraft_info_id",type:"hidden",value: svn (d,"aircraft_info_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                        , name  : "aircraft_code"               , type  : "input"         , width : 100       , style : "text-align:left;"}
        		,{text  : "Name"                        , name  : "aircraft_name"               , type  : "input"         , width : 170       , style : "text-align:left;"}
        		,{text  : "Type"                        , name  : "aircraft_type_id"            , type  : "select"        , width : 150       , style : "text-align:left;"}
        		,{text  : "Squadron"                    , name  : "squadron_id"                 , type  : "select"        , width : 220       , style : "text-align:left;"}
        		,{text  : "Aircraft Time"               , name  : "aircraft_time"               , type : "input"          , width : 130       , style : "text-align:left;"}
        		,{text  : "Aircraft Source"             , name  : "aircraft_source_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Aircraft Dealer"             , name  : "aircraft_dealer_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Status"                      , name  : "status_id"                   , type : "select"         , width : 150       , style : "text-align:left;"}
        		,{text  : "# of Assembly"             , width : 100                           , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageAssembly(" + svn(d,"aircraft_info_id") + ",\"" +  svn(d,"aircraft_name")  + "\");'>" + svn(d,"countItems") + "</a>"; 
                    }
                }

	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='aircraft_type_id']").dataBind( "aircraft_type");
                $("select[name='squadron_id']").dataBind( "squadronTypes");
                $("select[name='aircraft_source_id']").dataBind( "supply_source");
                $("select[name='aircraft_dealer_id']").dataBind( "dealer");
                $("select[name='status_id']").dataBind( "status");
        }  
    });    
}

function manageAssembly(id,title){
    aircraft_info_id=id;
    aircraft_info_name=title;
    displayRecordsAssembly(id);
    $("#modalWindowComponents .modal-title").html("Assembly for » " + title);
    $('#modalWindowComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $('#modalWindowComponents');//.setCloseModalConfirm();
    $("#modalWindowComponents .modal-body").css("height","450px");
}
    
function displayRecordsAssembly(id){
    $("#" + tblCP).dataBind({
	     url            : execURL + "items_sel @aircraft_info_id=" + id + ",@item_cat_code='A'"
	    ,width          : 850
	    ,height         : 400
        ,blankRowsLimit : 5
        ,dataRows       : [
        		 {text  : "Part No."                 , width : 100        , style : "text-align:left;"
        		     ,onRender  :  function(d){
        		         return    bs({name:"part_no",type:"input",value: svn (d,"part_no")})
        		                  + bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
        		                  + bs({name:"is_edited",type:"hidden"})
        		                  + bs({name:"parent_item_id",type:"hidden",value: svn (d,"parent_item_id")})
                                  + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")});
                    }
        		 }
        		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 160       , style : "text-align:left;"}
        		,{text  : "Item Name"                , name  : "item_name"              , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Serial No."               , name  : "serial_no"              , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Manufacturer Name"        , width : 200                      , style : "text-align:left;"
        		    ,onRender  :  function(d){
        		         return     bs({name:"manufacturer_id",type:"select",value: svn (d,"manufacturer_id")})
                                  + bs({name:"dealer_id",type:"hidden",value: svn (d,"dealer_id")})
                                  + bs({name:"supply_source_id",type:"hidden",value: svn (d,"supply_source_id")})
                                  + bs({name:"time_since_new",type:"hidden",value: svn (d,"time_since_new")})
                                  + bs({name:"time_before_overhaul",type:"hidden",value: svn (d,"time_before_overhaul")})
                                  + bs({name:"time_since_overhaul",type:"hidden",value: svn (d,"time_since_overhaul")});
                    }
        		}
        		,{text  : "Remaining Time(Hours)"     , name  : "remaining_time_hr"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Remaining Time(Minutes)"   , name  : "remaining_time_min"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "# of Components"          , width : 120                 , style : "text-align:center;"
        		    ,onRender  :  
                        function(d){
                            
                            return bs({name:"date_delivered",type:"hidden",value: svn (d,"date_delivered")})
                                  +  bs({name:"aircraft_info_id",type:"hidden",value: id})
                                  +  bs({name:"date_issued",type:"hidden",value: svn (d,"date_issued")})
                                  +  bs({name:"status_id",type:"hidden",value: svn (d,"status_id")})
                                  + "<a href='javascript:manageComponent(" + svn(d,"item_id") + ");'>" + svn(d,"countAircraftAC") + "</a>"; 
                    }
        		}
 	    ] 
 	    ,onComplete: function(){
 	        setSearch("A");
 	        $("select[name='manufacturer_id']").dataBind( "manufacturer");
 	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
            });
 	    }
    });    
}  

function submitAssembly(){
    $("#tblComponents").jsonSubmit({
          procedure: "items_upd"
        , optionalItems  : ["aircraft_info_id","parent_item_id"]
        , notInclude  : "#part_no,#national_stock_no,#item_name"
        , onComplete: function (data) {
            //$("#tblComponents").clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayRecords();
        }
    });
}

function manageComponent(id){
    displayRecordsComponents(id);
    var backBtn = "<a title='Go Back' href='javascript:void(0);' class='btn-lg' onclick='manageAssembly("+ aircraft_info_id +",\""+ aircraft_info_name +"\");'><span class='glyphicon glyphicon-circle-arrow-left'></span></a>";
    
    $("#modalWindowComponents .modal-title").html(backBtn + " Component for » " + aircraft_info_name);
    $('#modalWindowComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $('#modalWindowComponents');//.setCloseModalConfirm();
    $("#modalWindowComponents .modal-body").css("height","450px");
}

function displayRecordsComponents(id){
    $("#" + tblCP).dataBind({
	     url            : execURL + "items_sel @item_id=" + id + ",@aircraft_info_id=" + aircraft_info_id + ",@item_cat_code='C'"
	    ,width          : 850
	    ,height         : 400
        ,blankRowsLimit : 5
        ,dataRows       : [
        		 {text  : "Part No."                 , width : 100        , style : "text-align:left;"
        		     ,onRender  :  function(d){
        		         return    bs({name:"part_no",type:"input",value: svn (d,"part_no")})
        		                  + bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
        		                  + bs({name:"is_edited",type:"hidden"})
        		                  + bs({name:"parent_item_id",type:"hidden",value: id})
                                  + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")});
                    }
        		 }
        		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 160       , style : "text-align:left;"}
        		,{text  : "Item Name"                , name  : "item_name"              , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Serial No."               , name  : "serial_no"              , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Manufacturer Name"        , width : 200                      , style : "text-align:left;"
        		    ,onRender  :  function(d){
        		         return     bs({name:"manufacturer_id",type:"select",value: svn (d,"manufacturer_id")})
                                  + bs({name:"dealer_id",type:"hidden",value: svn (d,"dealer_id")})
                                  + bs({name:"supply_source_id",type:"hidden",value: svn (d,"supply_source_id")})
                                  + bs({name:"time_since_new",type:"hidden",value: svn (d,"time_since_new")})
                                  + bs({name:"time_before_overhaul",type:"hidden",value: svn (d,"time_before_overhaul")})
                                  + bs({name:"time_since_overhaul",type:"hidden",value: svn (d,"time_since_overhaul")});
                    }
        		}
        		,{text  : "Remaining Time(Hours)"     , name  : "remaining_time_hr"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Remaining Time(Minutes)"   , width : 200       , style : "text-align:left;"
        		    ,onRender  :  
                        function(d){
                            return   bs({name:"remaining_time_min",type:"input",value: svn (d,"date_delivered")})
                                  +  bs({name:"date_delivered",type:"hidden",value: svn (d,"date_delivered")})
                                  +  bs({name:"aircraft_info_id",type:"hidden",value: aircraft_info_id})
                                  +  bs({name:"date_issued",type:"hidden",value: svn (d,"date_issued")})
                                  +  bs({name:"status_id",type:"hidden",value: svn (d,"status_id")}); 
                    }
        		}
 	    ]
 	    ,onComplete: function(){
 	        setSearch("C");
 	        $("select[name='manufacturer_id']").dataBind( "manufacturer");
 	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
            });
 	    }
    });    
}

function setSearch(code){
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code=''" + code + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code=''" + code + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Item Name"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code=''" + code + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
        }
    });
}
    
