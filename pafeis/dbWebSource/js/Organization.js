var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

var levelNo;
var levelNoMain = null;
var levelNoModal = null;
var g_organization_id = null;
var g_warehouse_id = null;
var orgPid;
var orgArr  = [];

var context = { 
      id: "modalDynamic"
    , title: "Dynamic Modal"
    , sizeAttr: "fullWidth"
    , footer: '<div class="pull-left"><button type="button" onclick="submitOrgType(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveOrgType(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="gridModal" class="zGrid"></div>'
};
var contextOrgBins = { 
      id: "modalBins"
    , title: "OrgBins Modal"
    , sizeAttr: "modal-xs"
    , footer: '<div class="pull-left"><button type="button" onclick="submitOrgBins(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveOrgBins(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="gridOrgBinsModal" class="zGrid"></div>'
};
var contextLocations = { 
      id: "modalLocations"
    , title: "Location Modal"
    , sizeAttr: "modal-xs"
    , footer: '<div class="pull-left"><button type="button" onclick="submitLocations(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveLocations(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="gridLocations" class="zGrid"></div>'
            + '<h4 id="gridOrgBinsTitle"></h4>'
            + '<div id="gridOrgBinsModal" class="zGrid"></div>'
};
var contextInactiveLocations = { 
      id: "modalInactiveLocations"
    , title: "Inactive Location Modal"
    , sizeAttr: "modal-xs"
    , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveLocations(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
    , body: '<div id="gridInactiveLocations" class="zGrid"></div>'
};

zsi.ready(function(){
    displayRecords(function(){
        levelNoMain = levelNo;
    });
    getTemplate();
});

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
          procedure: "organizations_upd"
        , optionalItems: ["is_active","organization_id","organization_pid","organization_type_id"] 
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            $("#grid").clearGrid();
            displayRecords();
        }
    });
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0012"
        ,onComplete : function(data){
            displayRecords();
        }
    });      
}); 

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(context));
        $("body").append(template(contextLocations));
        $("body").append(template(contextInactiveLocations));
        $("body").append(template(contextOrgBins));
    });    
}

function getOrgHeaders(callBack){
    $.get(execURL + "organization_header_sel" + (levelNo ? " @level_no="+ levelNo : "")
    ,function(data){
        if(callBack) callBack(data.rows[0]);
    });
}

function displayRecords(callBack){
    setGridLayout({
        gridID   : "grid"
        ,params  : ""
        ,isModal : 0
    });
    
    if(callBack) callBack();
}

function setGridLayout(o){
    getOrgHeaders(function(data){
        var _keyHeaders = Object.keys(data).map(function(key) {
             return data[key];
        });
        var _levelNo = data.level_no;
        var orgTypeId = data.organization_type_id;
        
        if(levelNoMain===null) levelNoMain = _levelNo;
            
        $.get(execURL + "organizations_sel "+ o.params
        , function(d){
      
            var _rows = d.rows;
            var cb    = bs({name:"cbFilter",type:"checkbox"});
            var _keyHeaders2 = (_rows.length > 0 ? Object.keys(_rows[0]) : null);
            var _dataRows = [
                {    
                    text  : cb                                                           
                    , width : 25        
                    , style : "text-align:left;"       
        		    , onRender  :  function(d){
                        return  bs({name:"organization_id",type:"hidden",value: svn (d,"organization_id")})
                              + bs({name:"is_edited",type:"hidden"})
                              + bs({name:"organization_type_id",type:"hidden",value: orgTypeId})
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                ,{    
                    text  : _keyHeaders[4]       
                    , name : "organization_code"
                    , type : "input"
                    , width : 150        
                    , style : "text-align:left;"       
                }
                ,{    
                    text  : _keyHeaders[5]       
                    , name : "organization_name"
                    , type : "input"
                    , width : 210        
                    , style : "text-align:left;"       
                }
                ,{    
                    text  : _keyHeaders[6]
                    , width : 200        
                    , style : "text-align:left;"
                    , onRender : function(d){
            		    return  bs({name:"organization_pid",type:"hidden",value: orgPid})
            		          + bs({name:"organization_head_id",type:"select",value: svn (d,"organization_head_id")});
            		}
                }
                ,{    
                    text  : _keyHeaders[7]       
                    //, name : "organization_address"
                    //, type : "input"
                    , width : 200        
                    , style : "text-align:left;"
                    ,onRender : function(d){
            		    return  bs({name:"organization_address",type:"input",value: svn (d,"organization_address")})
            		          + (_levelNo!==2 ? bs({name:"organization_group_id",type:"hidden", value: svn (d,"organization_group_id")}) : "")
            		          + (_levelNo!==5 ? bs({name:"squadron_type_id",type:"hidden", value: svn (d,"squadron_type_id")}) : "");
                    }
                }
            ]; 
            
            var keyHeaderCount = _keyHeaders.length -1;

            if(_levelNo === 1){
               keyHeaderCount -= 2;
            }
            else if(_levelNo === 2){
                keyHeaderCount -= 1;
                
                _dataRows.push({    
                      text  : "ORGANIZATION GROUP"            
            		, width : 210          
            		, style : "text-align:center;"
                    ,onRender : function(d){
            		    return  bs({name:"organization_group_id",type:"select",value: svn (d,"organization_group_id")})
            		           + (_levelNo!==5 ? bs({name:"squadron_type_id",type:"hidden",value: svn (d,"squadron_type_id")}) : "");
                    }
        		});
            }
            else if(_levelNo === 5){
                _dataRows.push({    
                      text  : "SQUADRON TYPE"            
            		, width : 190          
            		, style : "text-align:center;"
                    ,onRender : function(d){
            		    return  bs({name:"squadron_type_id",type:"select",value: svn (d,"squadron_type_id")});
                    }
        		});
            }
            
            for(var i=8; i < keyHeaderCount ; i++){
                var _fn = (_keyHeaders2 !== null ? new Function('d', 'return  svn(d,"' +  _keyHeaders2[i] + '")') : "");
                var _text = _keyHeaders[i].split("_")[0];
                _dataRows.push({    
                          text  : _text
                        , width : 130        
                        , style : "text-align:center;"
                        , type: "text"
                        , onRender : _fn
                    }
                );
            }
    		
            _dataRows.push({    
                  text  : "ACTIVE?"                       
        		, name  : "is_active"                   
        		, type  : "yesno"             
        		, width : 60          
        		, style : "text-align:center;"
        		, defaultValue:"Y"
    		});
    		
    		if(_levelNo === 5){
                _dataRows.push({    
                      text  : "LOCATIONS"            
            		, width : 80          
            		, style : "text-align:center;"
                    ,onRender : function(d){
            		    return  "<a href='javascript:void(0);' onclick='manageLocations("+ svn (d,"organization_id") +",\""+ svn (d,"organization_name")  +"\");'>"+ svn (d,"warehouseCount") +"</a>";
                    }
        		});
            }

            $("#"+ o.gridID).dataBind({
        	     rows           : _rows
        	    ,width          : $(document).width() - (o.isModal ? 45 : 35)
        	    ,height         : $(document).height() - 250
        	    ,selectorType   : "checkbox"
                ,blankRowsLimit : (_levelNo > 1 ? 5 : 1)
                ,isPaging : false
                ,dataRows : _dataRows
                ,onComplete: function(){
                    $("#cbFilter").setCheckEvent("#grid input[name='cb']");
                    $("select[name='organization_head_id']").dataBind("employees_fullnames_v");
                    
                    if(_levelNo === 2){
                        $("select[name='organization_group_id']").dataBind({
                            url : execURL + "orgranization_groups_sel"
                            ,text: "organization_group_name"
                            ,value: "organization_group_id"
                        });
                    }
                    
                    if(_levelNo === 5){
                        $("select[name='squadron_type_id']").dataBind({
                            url : execURL + "squadron_types_sel"
                            ,text: "squadron_type"
                            ,value: "squadron_type_id"
                        });
                    }
                    
                    if(o.isModal){
                        $("#modalDynamic").on('hide.bs.modal', function(e){
                            orgArr = [];
                        });
                    }
                    
                    $("input, select").on("keyup change", function(){
                        var $zRow = $(this).closest(".zRow");
                        $zRow.find("#is_edited").val("Y");
                    });
                }  
            });
        });
    });
}

function myFunction(levelid, orgName, orgId){
    var backBtn = "";
    orgPid = orgId;
    levelNo = levelid;
    levelNoModal = levelid;
    displayOrgType(function(){
        if(orgArr.length > 0){
            backBtn = "<a href='javascript:void(0);' class='btn-lg' onclick='backFunction("+ orgArr[0].level_no +",\""+ orgArr[0].org_name +"\","+ orgArr[0].org_pid +");'><span class='glyphicon glyphicon-circle-arrow-left'></span></a>";
        }
        
        var title = "";
        if(levelNo===1){
            title = "Head Quarter";
        }else if(levelNo===2){
            title = "Command";
        }else if(levelNo===3){
            title = "Wing";
        }else if(levelNo===4){
            title = "Group";
        }else if(levelNo===5){
            title = "Squadron";
        }
    
        $("#modalDynamic .modal-title").html(backBtn + orgName +" » "+ title);
        $("#modalDynamic .modal-body").css("overflow","hidden");
        $("#modalDynamic").modal({ show: true, keyboard: false, backdrop: 'static' });
        
        orgArr.push({
             org_pid  : orgId 
            ,level_no : levelid
            ,org_name : orgName
        }); 
    });
}

function displayOrgType(callBack){
    levelNo = levelNoModal;
    setGridLayout({
        gridID   : "gridModal"
        ,params  : "@organization_id=" + orgPid + ",@level_no=" + levelNoModal
        ,isModal : 1
    });
    
    if(callBack) callBack();
}

function backFunction(levelid, orgName, orgId){
    var secToLastItem = orgArr[orgArr.length - 2];
    orgArr.pop();
    orgArr.pop();
    
    myFunction(secToLastItem.level_no, secToLastItem.org_name, secToLastItem.org_pid);
}

function submitOrgType(o){
    $("#frm_modalDynamic").jsonSubmit({
          procedure: "organizations_upd"
        , optionalItems: ["is_active","organization_id","organization_type_id","organization_pid"] 
        , onComplete: function (data) {
            $("#tblDynamic").clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");

            displayOrgType(function(){
                levelNo = levelNoMain;
                displayRecords(); 
            });
        }
    });
}

function manageLocations(id, name){
    g_organization_id = id;
    g_warehouse_id = null;
    $("#modalLocations .modal-title").html(name +" » Locations");
    $("#modalLocations .modal-body").css("overflow","hidden");
    $("#modalLocations").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#gridOrgBinsTitle, #gridOrgBinsModal").empty();
    
    displayLocations(g_organization_id);
}

function displayLocations(id){
    $("#gridLocations").dataBind({
         url   : execURL + "warehouses_sel @squadron_id=" + id +",@is_active='Y'"
         ,width          : $(document).width() - 800
	    ,height         : "200"
        ,blankRowsLimit : 5
        ,dataRows       :[
    		 { text: "Code"             , width:160       , style:"text-align:left;" 
    		    ,onRender : function(d){ 
                    return  bs({name:"warehouse_id",type:"hidden",value: svn(d,"warehouse_id")})  
                            + bs({name:"is_edited",type:"hidden"}) 
                            + bs({name:"squadron_id",type:"hidden",value: id})
                            + bs({name:"warehouse_code",type:"input",value: svn(d,"warehouse_code")});
                }
    		 }	 
    		 ,{ text: "Location"        , width:240       , style:"text-align:left;" 
		        ,onRender : function(d){ 
                    return bs({name:"warehouse_location",type:"input",value:svn (d,"warehouse_location")});
                }
    		 }	 
    		,{ text:"Active?"       , width:80  , style:"text-align:left;"    ,type:"yesno"  ,name:"is_active"  ,defaultValue:"Y" }
    		,{    
                  text  : "Bins"         
        		, width : 80          
        		, style : "text-align:center;"
                ,onRender : function(d){ return "<a href='javascript:manageItemBins("+ svn(d,"warehouse_id") +",\""+  svn(d,"warehouse_location") +"\");'>" + svn(d,"countWarehouseBins") + "</a>"; }
    		}
 	    ]
        ,onComplete: function(){
            $("#gridLocations input").on("keyup", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });
        }
    });   
}

function submitLocations(){
    $("#gridLocations").jsonSubmit({
          procedure: "warehouses_upd"
        , optionalItems: ["warehouse_id","squadron_id","is_active"] 
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            
            displayLocations(g_organization_id);
            displayOrgType(); 
            
            if(g_warehouse_id) submitOrgBins();
        }
    });
}

function manageInactiveLocations(){
    $("#modalInactiveLocations .modal-title").html("Inactive Locations");
    $("#modalInactiveLocations .modal-body").css("overflow","hidden");
    $("#modalInactiveLocations").modal({ show: true, keyboard: false, backdrop: 'static' });
    
    displayInactiveLocations();
}

function displayInactiveLocations(){
    $("#gridInactiveLocations").dataBind({
         url   : execURL + "warehouses_sel @is_active='N'"
         ,width          : $(document).width() - 800
	    ,height         : $(document).height() - 250
        ,blankRowsLimit : 0
        ,dataRows       :[
    		 { text: "Code"             , width:240       , style:"text-align:left;" 
    		    ,onRender : function(d){ 
                    return  bs({name:"warehouse_id",type:"hidden",value: svn(d,"warehouse_id")})  
                            + bs({name:"is_edited",type:"hidden"}) 
                            + bs({name:"squadron_id",type:"hidden",value: svn(d,"squadron_id")})
                            + bs({name:"warehouse_code",type:"input",value: svn(d,"warehouse_code")});
                }
    		 }	 
    		 ,{ text: "Location"        , width:240       , style:"text-align:left;" 
		        ,onRender : function(d){ 
                    return bs({name:"warehouse_location",type:"input",value:svn (d,"warehouse_location")});
                }
    		 }	 
    		,{ text:"Active?"       , width:80  , style:"text-align:left;"    ,type:"yesno"  ,name:"is_active"  ,defaultValue:"Y" }	 	 
 	    ]
        ,onComplete: function(){
            $("#gridInactiveLocations input").on("keyup", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });
        }
    });   
}

function submitInactiveLocations(){
    $("#frm_modalInactiveLocations").jsonSubmit({
          procedure: "warehouses_upd"
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            
            displayInactiveLocations();
            displayLocations(g_organization_id);
        }
    });
}

function manageItemBins(id, location){
    g_warehouse_id =id;
    displayOrgBins(g_warehouse_id);
    $("#gridOrgBinsTitle").text(location +" » Bins");
    /*$("#modalBins .modal-title").text(location +" » Bins");
    $("#modalBins").modal("show");
    if (modalBins===0) {
        modalBins=1;
        $("#modalBins").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    */
}
function displayOrgBins(id){   
     $("#gridOrgBinsModal").dataBind({
         url   : execURL + "warehouse_bins_sel @warehouse_id=" + id
         ,width          : $(document).width() - 800
	    ,height         : "200"
        ,blankRowsLimit : 5
        ,dataRows       :[
    		 { text: "Code"     , width:465 , style:"text-align:left;" 
		        ,onRender : function(d){ 
                    return  bs({name:"bin_id",type:"hidden",value:svn (d,"bin_id")})  
                            + bs({name:"is_edited",type:"hidden"}) 
                            + bs({name:"warehouse_id",type:"hidden",value: id})
                            + bs({name:"bin_code",type:"input",value: svn(d,"bin_code")});
                }   
    		 }	 
    		,{ text:"Active?"   , width:80  , style:"text-align:left;"  ,type:"yesno"   ,name:"is_active"    ,defaultValue:"Y" }	 	 
 	    ]
 	    ,onComplete: function(){
 	        $("#gridOrgBinsModal input, #gridOrgBinsModal select").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
            });
 	    }
    });    
}

function submitOrgBins(){
    $("#gridOrgBinsModal").jsonSubmit({
          procedure: "warehouse_bins_upd"
        , optionalItems: ["bin_id","warehouse_id","is_active"] 
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            
            displayLocations(g_organization_id);
            displayOrgBins(g_warehouse_id);
        }
    });
} 