var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblCP = "tblComponents"
    ,aircraft_info_id = null
    ,aircraft_info_name = ""
    ,parent_item_id = null
    ,table_name = ""
    ,g_organization_name = ''
    ,g_organization_id = null
    ,g_aircraft_type_id = null
;

zsi.ready(function(){
    getTemplate();
    getUserInfo(function(){
        $(".pageTitle").append(' for » <select name="dd_squadron" id="dd_squadron"></select>');
        $("#dd_squadron").dataBind({
            url: procURL + "dd_organizations_sel @squadron_type='aircraft'"
            , text: "organization_name"
            , value: "organization_id"
            , required :true
            , onComplete: function(){
                g_organization_id = $("select#dd_squadron option:selected").val();
                displayRecords();
                $("select#dd_squadron").change (function(){
                    g_organization_id = null;
                    if(this.value)
                        g_organization_id = this.value;
                        displayRecords();
                });
            }
        });  
    });   
});

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        g_organization_id = null;
        if (d.rows !== null && d.rows.length > 0) {
            g_organization_id =  d.rows[0].organization_id;
            g_organization_name =  d.rows[0].organizationName;
        }
        if(callBack) callBack();
    });
}

var contextComponents = { id:"modalWindowComponents"
                , title: "Components"
                , sizeAttr: "modal-lg fullWidth"
                , footer: '<div class="pull-left"><button type="button" onclick="submitAssembly();" class="btn btn-primary">'
                + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                + '<button type="button" onclick="btnDeleteAssembly();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button>'
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
    if( zsi.form.checkMandatory()!==true) return false;
    $("#grid").jsonSubmit({
          procedure: "aircraft_info_upd"
        , optionalItems: ["squadron_id"]
        , onComplete: function (data) {
            $("#grid").clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayRecords();
        }
    });
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0028"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});
    
function btnDeleteAssembly(){
     $("#frm_modalWindowComponents").deleteData({
        code       : "ref-0029"
        ,onComplete : function(data){
            displayRecords();
            if(table_name==="ASSEMBLY"){
                displayRecordsAssembly(_info_id);
            }else if(table_name==="COMPONENT"){
                displayRecordsComponents(parent_item_id);
            }      
        }
    });  
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "aircraft_info_sel @squadron_id=" + g_organization_id
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender: function(d){ 
                		                    return     bs({name:"aircraft_info_id",type:"hidden",value: svn (d,"aircraft_info_id")})
                		                            +  bs({name:"is_edited",type:"hidden"}) 
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
        		,{text  : "Squadron"                    , width : 500       , style : "text-align:left;"
        		    ,onRender: function(d){
        		                            return      bs({name:"squadron_id",type:"select",value: svn (d,"squadron_id")});
        		    }
        		}
        		,{text  : "Code"                        , name  : "aircraft_code"               , type : "input"         , width : 100       , style : "text-align:left;"}
        		,{text  : "Name"                        , name  : "aircraft_name"               , type : "input"         , width : 170       , style : "text-align:left;"}
                ,{text  : "Type"                                                                                         , width : 150       , style : "text-align:left;"       
        		    , onRender: function(d){ 
                		                    return     bs({name:"aircraft_type_id",type:"select",value: svn (d,"aircraft_type_id")});
                            }
                }	 
        		,{text  : "Aircraft Time (Hours)"      , type : "input"                                                  , width : 150       , style : "text-align:right; padding-right:3px"
        		      
        		           ,onRender : function(d){  return bs({name:"aircraft_time" ,type:"input" ,value: formatCurrency(svn(d,"aircraft_time"))});
        		           }
        		}
        		,{text  : "Hours Left to Inspection"    , name  : "service_time"                , type : "input"          , width : 100       , style : "text-align:center;"}
        		,{text  : "Aircraft Source"             , name  : "aircraft_source_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Aircraft Dealer"             , name  : "aircraft_dealer_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
         		,{text  : "Item Class"                  , name  : "item_class_id"               , type : "select"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Status"                      , name  : "status_id"                   , type : "select"         , width : 130       , style : "text-align:left;"}
        		,{text  : "# of Assembly / Components"               , width : 120                           , style : "text-align:center;"      
                    ,onRender:  
                        function(d){return "<a href='javascript:manageAssembly(" + svn(d,"aircraft_info_id") + ",\"" +  svn(d,"aircraft_name")  + "\","+ svn(d,"aircraft_type_id")  +");'>" + svn(d,"countItems") + "</a>"; 
                    }
                }

	    ]
    	     ,onComplete: function(){
    	        setMandatoryEntries();
                
                $("#squadron_id").dataBind({
                    url: procURL + "dd_organizations_sel @squadron_type='aircraft'"
                    , text: "organization_name"
                    , value: "organization_id"
                    , required :true
                    ,onChange  : function(){
                        $("select[name='squadron_id']") === this.value;
                    }
                });


    	        $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
 
                });            

                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='aircraft_type_id']").dataBind({
                    url : optionsURL + "aircraft_type"
                    /*
                    ,onComplete: function(){
                         $("input[name='squadron_id']").val( $("#dd_squadron").val() );
                    }
                    */
                });
                
                $("select[name='squadron_id']").dataBind({
                     url: procURL + "dd_organizations_sel @squadron_type='aircraft '"
                    , text: "organization_name"
                    , value: "organization_id"
                }); 
                
                $("select[name='aircraft_source_id']").dataBind( "supply_source");
                $("select[name='aircraft_dealer_id']").dataBind( "dealer");
                $("select[name='item_class_id']").dataBind( "item_class");
                $("select[name='status_id']").dataBind( "aircraftStatuses");
        }  
    });    
}

function manageAssembly(id,title, aircraft_type_id){
    aircraft_info_id=id;
    aircraft_info_name=title;
    g_aircraft_type_id = aircraft_type_id;
    table_name = "ASSEMBLY";
    displayRecordsAssembly(id);
    $("#modalWindowComponents .modal-title").html("Assembly / Components for » " + title);
    $('#modalWindowComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalWindowComponents .modal-body").css("height","450px");
}
    
function displayRecordsAssembly(id){
    var cb = bs({name:"cbFilter2",type:"checkbox"});
    $("#" + tblCP).dataBind({
	     url            : execURL + "items_sel @aircraft_info_id=" + id + ",@item_cat_code='A|C'"
	    ,width          : $(document).width() - 40
	    ,height         : 395
        ,blankRowsLimit : 5
        ,dataRows       : [
        		 {text  : cb        , width : 25        , style : "text-align:left;"  
        		     ,onRender  :  function(d){
        		         return     bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
        		                  + bs({name:"is_edited",type:"hidden"})
        		                  + bs({name:"parent_item_id",type:"hidden",value: svn (d,"parent_item_id")})
                                  + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                                  + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
        		 }
        		,{text  : "Part No."                 , name  : "part_no"                , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Nomenclature"             , name  : "item_name"              , type  : "input"         , width : 350       , style : "text-align:left;"}
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
            		,{text  : "Remaining"           , width : 120                     , style : "text-align:right; padding-right:3px"
        		           ,onRender : function(d){  return bs({name:"remaining_time" ,type:"input"    ,value:formatCurrency(svn(d,"remaining_time"))});}
        		}
        		,{text  : "Monitoring Type"         , name  : "monitoring_type"      , width : 120       , style : "text-align:center;"}
        		,{text  : "# of Components"         , width : 150                    , style : "text-align:center;"
        		    ,onRender  :  
                        function(d){
                            
                            return bs({name:"date_delivered",type:"hidden",value: svn (d,"date_delivered")})
                                  +  bs({name:"aircraft_info_id",type:"hidden",value: id})
                                  +  bs({name:"date_issued",type:"hidden",value: svn (d,"date_issued")})
                                  +  bs({name:"status_id",type:"hidden",value: svn (d,"status_id")})
                                  + "<a href='javascript:manageComponent(" + svn(d,"item_id") + ",\""+ svn(d,"item_name") +" / "+  svn(d,"serial_no") +"\","+ svn(d,"g_aircraft_type_id") +");'>" + svn(d,"countAircraftAC") + "</a>"; 
                    }
        		}
 	    ] 
 	    ,onComplete: function(){
 	        $("#cbFilter2").setCheckEvent("#" + tblCP + " input[name='cb']");
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
        , notInclude  : "#part_no,#national_stock_no,#item_name,#monitoring_type"
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayRecords();
            if(table_name==="ASSEMBLY"){
                displayRecordsAssembly(aircraft_info_id);
            }else if(table_name==="COMPONENT"){
                displayRecordsComponents(parent_item_id);
            }
        }
    });
}

function manageComponent(id, title){
    parent_item_id = id;
    table_name = "COMPONENT";
    displayRecordsComponents(id);
    var backBtn = "<a title='Go Back' href='javascript:void(0);' class='btn-lg' onclick='manageAssembly("+ aircraft_info_id +",\""+ aircraft_info_name +"\","+ g_aircraft_type_id +");'><span class='glyphicon glyphicon-circle-arrow-left'></span></a>";
    
    $("#modalWindowComponents .modal-title").html(backBtn + " Component for » " + title);
    $('#modalWindowComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalWindowComponents .modal-body").css("height","450px");
}

function displayRecordsComponents(id){
    var cb = bs({name:"cbFilter3",type:"checkbox"});
    $("#" + tblCP).dataBind({
	     url            : execURL + "items_sel @aircraft_info_id=" + aircraft_info_id + ",@parent_item_id=" + id
	    ,width          : $(document).width() - 40
	    ,height         : 395
        ,blankRowsLimit : 5
        ,dataRows       : [
                 {text  : cb        , width : 25        , style : "text-align:left;"
        		     ,onRender  :  function(d){
        		         return     bs({name:"item_id",type:"hidden",value: svn (d,"item_id")})
        		                  + bs({name:"is_edited",type:"hidden"})
        		                  + bs({name:"parent_item_id",type:"hidden",value: id})
                                  + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                                  + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
        		 }
        		,{text  : "Part No."                 , name  : "part_no"                , type  : "input"         , width : 200        , style : "text-align:left;"}
        		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Nomenclature"             , name  : "item_name"              , type  : "input"         , width : 350       , style : "text-align:left;"}
        		,{text  : "Serial No."               , name  : "serial_no"              , type  : "input"         , width : 150       , style : "text-align:left;"}
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
        		,{text  : "Remaining"   , width : 100       ,style : "text-align:right; padding-right:3px"
        		    ,onRender  :  
                        function(d){
                            return   bs({name:"remaining_time",type:"input",value: formatCurrency(svn(d,"remaining_time"))})
                                  +  bs({name:"date_delivered",type:"hidden",value: svn (d,"date_delivered")})
                                  +  bs({name:"aircraft_info_id",type:"hidden",value: aircraft_info_id})
                                  +  bs({name:"date_issued",type:"hidden",value: svn (d,"date_issued")})
                                  +  bs({name:"status_id",type:"hidden",value: svn (d,"status_id")}); 
                    }
        		}
        		,{text  : "Monitoring Type"     , name  : "monitoring_type"      , width : 120       , style : "text-align:center;"}
 	    ]
 	    ,onComplete: function(){
 	        $("#cbFilter3").setCheckEvent("#" + tblCP + " input[name='cb']");
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
        tableCode: "ref-0049"
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , condition: "'aircraft_type_id=''" + g_aircraft_type_id + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0049"
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , condition: "'aircraft_type_id=''" + g_aircraft_type_id + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0049"
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Item Name"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , condition: "'aircraft_type_id=''" + g_aircraft_type_id + "'''"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
        }
    });
}

// Set the mandatory fields.
function setMandatoryEntries(){
    zsi.form.markMandatory({       
        "groupNames":[
            {
                 "names" : ["squadron_id", "aircraft_code", "aircraft_name", "aircraft_type_id", "status_id"]
                ,"type":"M"
            }             
        ]      
        ,"groupTitles":[ 
             {"titles" : ["Squadron", "Code", "Name", "Type", "Status"]}
        ]
    });    
}

function formatCurrency(number){
    var result = "";
    if(number!==""){
        result = parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return result;
}            