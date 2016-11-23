var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

//var header = [];
var orgPIds = [];
var levelNo = null;
var orgPId = null;
var modalId = "";
var tableId   = "";

var contextWing = { 
      id: "modalWing"
    , title: "Wing List"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="submitOrgType(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveOrgType(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="tblWing" class="zGrid"></div>'
};

var contextGroup = { 
      id: "modalGroup"
    , title: "Group List"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="submitOrgType(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveOrgType(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="tblGroup" class="zGrid"></div>'
};

var contextSquadron = { 
      id: "modalSquadron"
    , title: "Squadron List"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="submitOrgType(this);" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="manageInactiveOrgType(this);" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button>'
    , body: '<div id="tblSquadron" class="zGrid"></div>'
};

zsi.ready(function(){
    displayRecords();
    getTemplate();
});

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
          procedure: "organizations_upd"
        , optionalItems: ["is_active","organization_type_id"] 
        , onComplete: function (data) {
            $("#grid").clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");
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
   
        $("body").append(template(contextWing));
        $("body").append(template(contextGroup));
        $("body").append(template(contextSquadron));
    });    
}

function displayRecords(){
    levelNo = null;
    
    getOrgHeaders(function(data){
        var headers = data;
        var _keyHeaders = Object.keys(data).map(function(key) {
             return data[key];
        }); 
        $.get(execURL + "organizations_sel", function(d){
            var _rows = d.rows;
            var _dataRows = [];
            var cb        = bs({name:"cbFilter1",type:"checkbox"});
             var _keyHeaders2 = Object.keys(_rows[0]);
            _dataRows.push({    
                    text  : cb                                                           
                    , width : 25        
                    , style : "text-align:left;"       
        		    , onRender  :  function(d){
                        return  bs({name:"organization_id",type:"hidden",value: svn (d,"organization_id")})
                              + bs({name:"organization_type_id",type:"hidden",value: d.organization_type_id}) 
                              + bs({name:"organization_pid",type:"hidden",value: d.organization_pid})
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                });    
                
             _dataRows.push({    
                    text  : _keyHeaders[4]       
                    , name : "organization_code"
                    , width : 100        
                    , style : "text-align:left;"       
                });    
                
             _dataRows.push({    
                    text  : _keyHeaders[5]       
                    , name : "organization_name"
                    , width : 100        
                    , style : "text-align:left;"       
                });    
            
            console.log("count");
            console.log(_keyHeaders.length);
            for(var i=8; i < _keyHeaders.length -1 ; i++){

                //console.log(_keyHeaders2[i]);
               
               //var _fn = new Function('d',  
                //    'return  "<a href=\'javascript:manageOrgType(" + d.level_no + "," + d.organization_id + "," + d.organization_name + ");\'>" +  d.' +  _keyHeaders2[i] + ' + "</a>";' 
                //);

                 _dataRows.push({    
                          text  :  _keyHeaders[i] 
                        , width : 150        
                        , style : "text-align:left;"
                        , name :   _keyHeaders2[i] 
                        , type: "input"
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


         $("#grid").dataBind({
        	     rows           : _rows
        	    ,width          : $(document).width() - 35
        	    ,height         : $(document).height() - 250
        	    ,selectorType   : "checkbox"
                ,blankRowsLimit : 5
                ,isPaging : false
                ,dataRows : _dataRows
                ,onComplete: function(){
                  //  $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                   // $("select[name='organization_head_id']").dataBind("employees");
                }  
            });
            
            


            
        });
        
        /*var header = Object.keys(data).map(function(key) {
            return data[key];
        });

        var cb        = bs({name:"cbFilter1",type:"checkbox"});
        var _dataRows = [
            {    text  : cb                                                           
                , width : 25        
                , style : "text-align:left;"       
    		    , onRender  :  function(d){
                    return  bs({name:"organization_id",type:"hidden",value: svn (d,"organization_id")})
                          + bs({name:"organization_type_id",type:"hidden",value: header.organization_type_id}) 
                          + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }
            ,{    text  : header[0]                   
    		    , name  : "organization_code"               
    		    , type  : "input"           
    		    , width : 150       
    		    , style : "text-align:left;"
    		}
    		,{    text  : header[1]              
        		, name  : "organization_name"            
        		, type  : "input"          
        		, width : 200       
        		, style : "text-align:left;"
    		}
    		,{    text  : header[2]
        		, width : 200       
        		, style : "text-align:left;"
        		, onRender : function(d){
        		    return  bs({name:"organization_pid",type:"hidden",value: svn (d,"organization_pid")})
        		          + bs({name:"organization_head_id",type:"select",value: svn (d,"organization_head_id")});
        		}
    		}
        ];
        
        $.get(execURL + "organizations_sel", function(d){
            var _rows = d.rows;
            var content = Object.keys(_rows[0]);

            content.splice(0, 2); //Remove organization_id & organization_type_id from content[]
            content.splice(3, 1); //Remove level_no from content[]
            
            for(var i=0; i < header.length; i++){
                if(i > 2 && i != header.length - 1){
                    var _text = header[i].split("_");
                    var levelNum = _text[1];
                    
                    _dataRows.push({    
                          text  : _text[0]           
            		    , type  : "text"           
            		    , width : 150       
            		    , style : "text-align:left;"
                		, onRender :  function(d){
                            console.log(levelNum);
                		    return "<a href='javascript:manageOrgType("+ levelNum +","+ svn(d,"organization_id") +",\""+ svn(d,"organization_name") +"\")'>"+ (d ? svn(d, "subOrganization'"+ levelNum +"'") : "") +"</a>"; 
                		}
            		 });
                }
            }
            
            _dataRows.push({    
                  text  : "ACTIVE?"                       
        		, name  : "is_active"                   
        		, type  : "yesno"             
        		, width : 60          
        		, style : "text-align:center;"
        		, defaultValue:"Y"
    		});
    		
            $("#grid").dataBind({
        	     rows           : _rows
        	    ,width          : $(document).width() - 35
        	    ,height         : $(document).height() - 250
        	    ,selectorType   : "checkbox"
                ,blankRowsLimit : 5
                ,isPaging : false
                ,dataRows : _dataRows
                ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                    $("select[name='organization_head_id']").dataBind("employees");
                }  
            });
        });
        
        var dynamicCol = header.subOrgCount.split("_");
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        
        $("#grid").dataBind({
    	     url            : execURL + "organizations_sel"
    	    ,width          : $(document).width() - 35
    	    ,height         : $(document).height() - 250
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit:5
            ,isPaging : false
            ,dataRows : [
                 {    text  : cb                                                           
                    , width : 25        
                    , style : "text-align:left;"       
        		    , onRender  :  function(d){
                        return  bs({name:"organization_id",type:"hidden",value: svn (d,"organization_id")})
                              + bs({name:"organization_type_id",type:"hidden",value: header.organization_type_id}) 
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                 }	 
        		,{    text  : header.code                    
        		    , name  : "organization_code"               
        		    , type  : "input"           
        		    , width : 150       
        		    , style : "text-align:left;"
        		 }
        		,{    text  : header.name              
            		, name  : "organization_name"            
            		, type  : "input"          
            		, width : 200       
            		, style : "text-align:left;"
        		}
        		,{    text  : header.commander_name       
            		, width : 200       
            		, style : "text-align:left;"
            		, onRender : function(d){
            		    return  bs({name:"organization_pid",type:"hidden",value: svn (d,"organization_pid")})
            		          + bs({name:"organization_head_id",type:"select",value: svn (d,"organization_head_id")});
            		}
        		}
        		,{    text  : "dynamicCol[0]"
            		, width : 80                                    
            		, style : "text-align:center;"
        		    , onRender : function(d){
        		        return "<a href='javascript:manageOrgType("+ dynamicCol[1] +","+ svn(d,"organization_id") +",\""+ svn(d,"organization_name") +"\")'>"+ (d ? svn(d,"countSubOrganizations") : "") + "</a>"; 
                    }
                }
        		,{    text  : header.active                       
            		, name  : "is_active"                   
            		, type  : "yesno"             
            		, width : 60          
            		, style : "text-align:center;"
            		, defaultValue:"Y"
        		}
    	    ]
            ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='organization_head_id']").dataBind("employees");
            }  
        });*/
    });
}

function getOrgHeaders(callBack){
    $.get(execURL + "organization_header_sel" + (levelNo ? " @level_no="+ levelNo : "")
    ,function(data){
        if(callBack) callBack(data.rows[0]);
    });
}

function manageOrgType(levelid, orgId, orgName){
    orgPId = orgId;
    levelNo = levelid;
    
    if(levelNo == 2){
        modalId = "modalWing";
        tableId = "tblWing";
    }
    else if(levelNo == 3){
        modalId = "modalGroup";
        tableId = "tblGroup";
    }
    else if(levelNo == 4){
        modalId = "modalSquadron";
        tableId = "tblSquadron";
    }
    
    displayOrgType();
    
    $("#"+ modalId).attr("pid", orgPId);
    $("#"+ modalId).attr("level_id", levelNo);
    $("#"+ modalId + " .modal-title").text(orgName);
    $("#"+ modalId).modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindowIDdetails').setCloseModalConfirm();
}

function displayOrgType(callBack){
    getOrgHeaders(function(){
        console.log(header);
        /*var dynamicCol = header.subOrgCount.split("_");
        var cb = bs({name:"cbFilter1",type:"checkbox"});
    
        $("#"+ tableId).dataBind({
    	     url            : execURL + "organizations_sel @organization_id=" + orgPId + ",@level_no=" + levelNo
    	    ,width          : $(document).width() - 255
    	    ,height         : $(document).height() - 250
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit:5
            ,isPaging : false
            ,dataRows : [
                 {    text  : cb                                                           
                    , width : 25        
                    , style : "text-align:left;"       
        		    , onRender  :  function(d){
                        return  bs({name:"organization_id",type:"hidden",value: svn (d,"organization_id")})
                              + bs({name:"organization_type_id",type:"hidden",value: header.organization_type_id}) 
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                 }	 
        		,{    text  : header.code                    
        		    , name  : "organization_code"               
        		    , type  : "input"           
        		    , width : 150       
        		    , style : "text-align:left;"
        		 }
        		,{    text  : header.name              
            		, name  : "organization_name"            
            		, type  : "input"          
            		, width : 200       
            		, style : "text-align:left;"
        		}
        		,{    text  : header.commander_name       
            		, width : 200       
            		, style : "text-align:left;"
            		, onRender : function(d){
            		    return  bs({name:"organization_pid",type:"hidden",value: orgPId})
            		          + bs({name:"organization_head_id",type:"select",value: svn (d,"organization_head_id")});
            		}
        		}
        		,{    text  : dynamicCol[0]
            		, width : 110                   
            		, class : (levelNo==4 ? "hide" : "")
            		, style : "text-align:center;"      
        		    , onRender : function(d){
        		        return "<a href='javascript:manageOrgType("+ dynamicCol[1] +","+ svn(d,"organization_id") +",\""+ svn(d,"organization_name") +"\")'>"+ (d ? svn(d,"countSubOrganizations") : "") + "</a>"; 
                    }
                }
        		,{    text  : header.active                       
            		, name  : "is_active"                   
            		, type  : "yesno"             
            		, width : 60          
            		, style : "text-align:center;"
            		, defaultValue:"Y"
        		}
    	    ]
            ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='organization_head_id']").dataBind("employees");
                
                if(callBack) callBack();
            }  
        });*/
    });
}


function submitOrgType(o){
    getParams(o, function(){
        $("#frm_"+ modalId).jsonSubmit({
              procedure: "organizations_upd"
            , optionalItems: ["is_active","organization_type_id","organization_pid"] 
            , onComplete: function (data) {
                $("#"+ tableId).clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                
                displayOrgType(function(){
                    if(levelNo==2){
                        displayRecords();
                    }else{
                        var prevModal = $("#"+ modalId).prev();
                        orgPId  = prevModal.attr("pid");
                        levelNo = prevModal.attr("level_id");
                        tableId = prevModal.find(".zGrid").attr("id");
                        
                        displayOrgType();
                    }
                });
            }
        });
    });
}

function getParams(o, callBack){
    var modal = $(o).closest(".modal");
    orgPId  = modal.attr("pid");
    levelNo = modal.attr("level_id");
    modalId = modal.attr("id");
    tableId = modal.find(".zGrid").attr("id");
    
    if(callBack) callBack();
}
      