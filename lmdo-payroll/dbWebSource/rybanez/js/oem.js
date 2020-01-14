  
 var oem =  (function(){
        var _public = {};
            var      bs                     = zsi.bs.ctrl
                    ,svn                    = zsi.setValIfNull
                    ,gMdlProgParts          = "modalProgramParts"
                    ,gMdlCustomers          = "modalCustomers"
                    ,gtw                    = null
                    ,gMdlProgramTeam        = "modalWindowProgramTeam"
                    ,gMdlLaunchManager      = "modalWindowLaunchManager"
                    ,gMdlProgMngr           = "modalWindowProgramManager"
                    ,gMdlCarLeader          = "modalWindowCarLeader"
                    ,gMdlWarehouseContact   = "modalWindowWarehouseContact"
                    ,gProgId                = null
                    ,gCarleaderIds          = []
                    ,gProgMngrIds           = []
                    ,gLaunchMngrIds         = []
                    ,gWarehouseContactIds   = []
                    ,gIds                   = []
            ;
            
            zsi.ready = function(){
                $(".page-title").html("OEM");
                gtw = new zsi.easyJsTemplateWriter();
                displayRecords();
                getTemplates();
            }; 
              
            function getTemplates(){
                new zsi.easyJsTemplateWriter("body")
                .bsModalBox({
                      id        : gMdlProgParts
                    , sizeAttr  : "modal-full"
                    , title     : "Program Parts"
                    , body      : gtw.new().modalBodyProgParts({grid:"gridProgParts",onClickSaveProgramParts:"submitProgParts();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlCustomers
                    , sizeAttr  : "modal-lg"
                    , title     : "Customers"
                    , body      : gtw.new().modalBodyCustomers({grid:"gridCustomers",onClickSaveCustomers:"submitCustomers();",deleteDataCustomers:"deleteDataCustomers();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlLaunchManager
                    , sizeAttr  : "modal-md"
                    , title     : "Launch Manager(s)"
                    , body      : gtw.new().modalBodyLaunchManager({launchManagerListGroup:"launchManagerList"}).html()  
                }) 
                .bsModalBox({
                      id        : gMdlProgMngr
                    , sizeAttr  : "modal-md"
                    , title     : "Program Manager(s)"
                    , body      : gtw.new().modalBodyProgramManagers({progMngrsListGroup:"progMngrList"}).html()  
                }) 
                .bsModalBox({
                      id        : gMdlCarLeader
                    , sizeAttr  : "modal-md"
                    , title     : "Car Leader(s)"
                    , body      : gtw.new().modalBodyCarLeaders({carLeaderListGroup:"carLeaderList"}).html()  
                })
                .bsModalBox({
                      id        : gMdlWarehouseContact
                    , sizeAttr  : "modal-md"
                    , title     : "Warehouse Contact(s)"
                    , body      : gtw.new().modalBodyWarehouseContact({warehouseContactsListGroup:"warehouseContactList"}).html()  
                })
                .bsModalBox({
                      id        : gMdlWarehouseContact
                    , sizeAttr  : "modal-md"
                    , title     : "Warehouse Contact(s)"
                    , body      : gtw.new().modalBodyWarehouseContact({warehouseContactsListGroup:"warehouseContactList"}).html()  
                });  
                
            }
            
            $("#btnSaveOEM").click(function () {
               $("#grid").jsonSubmit({
                         procedure: "oem_upd"
                        ,optionalItems: ["is_active"]
                        , onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayRecords();
                        }
                });
            });
            
            function displayRecords(){
                var _$sidebar = $(".page-sidebar").width();
                
                var cb = app.bs({name:"cbFilter1",type:"checkbox"});
                $("#grid").dataBind({
             	     sqlCode        : "O149" //oem_sel
            	    ,width          : $(".zContainer").width()
            	    ,height         : $(document).height() - 200
                    ,blankRowsLimit : 5
                    ,isPaging       : false
                    ,dataRows       : [
                                        { text : cb , width : 25   , style : "text-align:left;" 
                                            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_id"            ,type:"hidden"  ,value: svn (d,"oem_id")}) 
                                                     + app.bs({name:"is_edited"         ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                                     + (d !==null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" ); }
                                        }	 
                        		        ,{text : "OEM Name"            , name : "oem_name"      ,type : "input"    ,width : 200       , style : "text-align:left;"}
                        		        ,{text : "OEM Shortname"       , name : "oem_sname"     ,type : "input"    ,width : 200       , style : "text-align:left;"}
                        		        ,{text : "IMG Filename"        , name : "img_filename"  ,type : "input"    ,width : 250       , style : "text-align:left;"}
                        		        ,{text : "Is_Active?"          , name : "is_active"     ,type : "yesno"    , width : 60       , style : "text-align:center;"          ,defaultValue:"Y"}
                                        ,{text : "Build Phase"                                  ,type : "input"    ,width : 100       ,style : "text-align:center"          
                                                ,onRender : function(d){
                                                        return "<a href='javascript:void(0)' title='OEM > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Build Phase" + "\","+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                }
                                        }
                                        ,{text : "Program"                                      ,type : "input"    ,width : 90        ,style : "text-align:center"
                                                ,onRender : function(d){
                                                        return "<a href='javascript:void(0)' title='OEM > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Programs" + "\" ,"+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                }
                                         }
                                        ,{text : "Harness Family"                               ,type : "input"    ,width : 90        ,style : "text-align:center"
                                                ,onRender : function(d){
                                                        return "<a href='javascript:void(0)' title='HARNESS FAMILY > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Harness Family" + "\" ,"+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                }
                                         }
            	                    ]
                	    ,onComplete: function(){
                            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                    }  
                });    
            }
            
            $("#btnDeleteOEM").click(function(){
                zsi.form.deleteData({
                     code       : "ref-0003"
                    ,onComplete : function(data){
                        displayRecords();
                      }
                });       
            });
            
            _public.deleteDataPrograms = function(){
                zsi.form.deleteData({
                     code       : "ref-0004"
                    ,onComplete : function(data){
                        displayProgram($("#grid-P").data("id"));
                      }
                });       
            }
            
            _public.deleteDataBuildPhase = function(){
                zsi.form.deleteData({
                     code       : "ref-0005"
                    ,onComplete : function(data){
                        displayBuildPhase($("#grid-BP").data("id"));
                     }
                });       
            }
            
            _public.deleteDataHarnessFamily = function(){
                zsi.form.deleteData({
                     code       : "ref-0008"
                    ,onComplete : function(data){
                        displayHarnessFamily($("#grid-HF").data("id"));
                      }
                });       
            }
            
            _public.deleteDataProgramParts = function(){
                var _$grid = $("#gridProgParts");
                zsi.form.deleteData({
                     code       : "ref-0007"
                    ,onComplete : function(data){
                        displayProgramParts(_$grid.data("oemId"),_$grid.data("progId"));
                      }
                });       
            }
             
            _public.deleteDataCustomers = function(){
                var _$grid = $("#gridCustomers");
                zsi.form.deleteData({
                     code       : "ref-00022"
                    ,onComplete : function(data){
                        displayCustomers(_$grid.data("id"));
                      }
                });       
            }
            _public.showModal = function(tabName, id,name) {
                var _$body = $("#frm_modalOEM").find(".modal-body").find("#nav-tab");
                
                g$mdl = $("#modalOEM");
                g$mdl.find(".modal-title").text("OEM » " + name ) ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                
                if(tabName === "Programs") _$body.find("[aria-controls='nav-p']").trigger("click");
                else if(tabName === "Build Phase") _$body.find("[aria-controls='nav-bp']").trigger("click");
                else _$body.find("[aria-controls='nav-hf']").trigger("click");
                var _width = $(window).width();
                $("#nav-tabContent").css("width", _width);
                displayProgram(id);
                displayBuildPhase(id);
                displayHarnessFamily(id);
            }
            
            _public.showModalList = function(name,oemId,id,ids) {
                var  _$mdl       = ""
                    ,_$frmFilter = ""
                    ,_url        = ""
                    ,_text       = ""
                ;
                if(name === "Program Manager"){
                    _$mdl = $("#" + gMdlProgMngr);
                    _$frmFilter = $("#frm_modalWindowProgramManager").find("#prog_mngr_filter_id");
                    _url  = app.procURL + "dd_program_managers_sel @oem_id=" + oemId;
                    _text = "program_manager";
                    gProgId = id;
                    displayProgMngrs(id,ids);
            
                } else if(name === "Car Leader"){
                    _$mdl = $("#" + gMdlCarLeader);
                    _$frmFilter = $("#frm_modalWindowCarLeader").find("#car_leader_filter_id");
                    _url  = app.procURL + "dd_program_car_leaders_sel";
                    _text = "car_leader";
                    gProgId = id;
                    displayCarLeaders(id,ids);
                    
                } else if(name === "Launch Manager"){
                    _$mdl = $("#" + gMdlLaunchManager);
                    _$frmFilter = $("#frm_modalWindowLaunchManager").find("#launch_manager_filter_id");
                    _url  = app.procURL + "dd_program_launch_manager_sel";
                    _text = "launch_manager";
                    gProgId = id;
                    displayLaunchManager(id,ids);
                    
                } else {
                    _$mdl = $("#" + gMdlWarehouseContact);
                    _$frmFilter = $("#frm_modalWindowWarehouseContact").find("#warehouse_contacts_filter_id");
                    _url  = app.procURL + "dd_warehouse_contacts_sel";
                    _text = "program_coordinator";
                    gProgId = id;
                    displayWarehouseContacts(id,ids);
                    
                }
            
                
                _$mdl.find(".modal-title").text(name +"(s)") ;
                _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                
                _$frmFilter.dataBind({
                     url    : _url
                    ,text   : _text
                    ,value  : "user_id"
                });
                
            };
            
            _public.showModalParts = function(oemId,progId,progCode) {
                g$mdl = $("#" + gMdlProgParts);
                g$mdl.find(".modal-title").html(" <div class='row'> Program » " + progCode + "</div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                $("#frm_modalProgramParts").find("#build_phase_filter_id").dataBind({
                     sqlCode    : "D210" //dd_program_bp_sel
                    ,parameters : {program_id : progId}
                    ,text       : "build_phase_abbrv"
                    ,value      : "build_phase_id"
                });
                
                $("#frm_modalProgramParts").find("select[name='dd_model_year']").dataBind({
                     sqlCode    : "D211" //dd_program_model_year_sel
                    ,parameters : {program_id : progId}
                    ,text       : "model_year_name"
                    ,value      : "dd_model_year"
                    
                });
                
            };
            _public.showPrograms = function(){ 
               
                var _oemId = $("#frm_modalProgramParts").find("#dd_oem_program_part_id").val();
                var _progId = $("#frm_modalProgramParts").find("#dd_program_id").val();
               
                displayProgramParts(_oemId,_progId); 
                 
            };
            
            _public.showModalCustomers = function(oemId,progId) {
                g$mdl = $("#" + gMdlCustomers);
                g$mdl.find(".modal-title").text("Customers") ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayCustomers(oemId,progId);
            };
            
            function displayProgram(id){
            
                var cb = app.bs({name:"cbFilter2",type:"checkbox"});
                $("#grid-P").dataBind({
                     url            : app.execURL + "oem_programs_sel @oem_id=" + id
                    ,width          : $("#nav-tabContent").width() - 50
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"program_id" ,type:"hidden"      ,value: svn (d,"program_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            + app.bs({name:"oem_id"                     ,type:"hidden"      ,value: id })
                                            + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); }
                        }
                        ,{text: "Program Code"              ,name : "program_code"              ,type : "input"     ,width : 250  ,style : "text-align:left"}
                        //,{text: "Program Name"              ,name : "program_name"              ,type : "input"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Program Coordinator"       ,name : "program_coordinator_id"    ,type : "select"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Engr. Manager"             ,name : "engr_manager_id"           ,type : "select"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Program Manager"           ,width : 120     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _progMngrs = (app.svn(d,"program_managers") ? app.svn(d,"program_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalList(\"" + "Program Manager" + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\" ,\"" + app.svn(d,"program_manager_ids") + "\");'>" + _progMngrs + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
                        ,{text: "Car Leader(s)"             ,width : 90     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _carLeaders = (app.svn(d,"car_leaders") ?app.svn(d,"car_leaders") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalList(\"" + "Car Leader" + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"car_leader_ids") + "\");'>" + _carLeaders + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
            
                        ,{text: "Launch Manager(s)"         ,width : 90     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _launchMngr = (app.svn(d,"launch_managers") ? app.svn(d,"launch_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalList(\"" + "Launch Manager" + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"launch_manager_ids") + "\");'>" + _launchMngr + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
            
                        ,{text: "Warehouse Contacts(s)"      ,width : 90     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _warehouseContacts = (app.svn(d,"warehouse_contact_ids") ? app.svn(d,"warehouse_contact_ids") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalList(\"" + "Warehouse Contact" + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"warehouse_contact_ids") + "\");'>" + _warehouseContacts + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
            
                        ,{text: "Is Active?"        ,name : "is_active"             ,type : "yesno"     ,width : 85   ,style : "text-align:left" ,defaultValue: "Y"}
                        ,{text: "Model Year/Build Phase"                            ,type : "input"     ,width : 160  ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='PROGRAM > "+ app.svn (d,"program_code") +"' onclick='oem.showModalParts("+ app.svn (d,"oem_id") +",\""+ app.svn (d,"program_id") +"\",\""+ app.svn (d,"program_code") +"\")'>   <i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                         }
            
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("#cbFilter2").setCheckEvent("#grid-P input[name='cb']"); 
                        this.find("select[name='program_coordinator_id']").dataBind({
                             sqlCode : "D180" 
                            ,parameters: {oem_id : id}
                            ,text: "program_coordinator"
                            ,value: "user_id"
                        });
                        this.find("select[name='engr_manager_id']").dataBind({
                             sqlCode : "D179" 
                            ,parameters: {oem_id : id}
                            ,text: "engr_manager"
                            ,value: "user_id" 
                        });
                    }
                });
            }  
            
            //DISPLAY PROGRAM MANAGERS 
            function displayProgMngrs(progId,progMngrIds){ 
                gProgMngrIds = [];
                gIds = [];
            
                $.get(app.execURL + "program_managers_sel @program_id='" + progId + "',@program_manager_ids='" + progMngrIds + "'"  ,function(d){
                    var _d = d.rows;
                    var _h = "";
                    var _$frm = $("#frm_modalWindowProgramManager");
                    var _$progMngrListGroup = _$frm.find("#progMngrsListGroup");
                    if(progMngrIds !== ""){
                        _$frm.find("#btnSaveProgMngrs").removeClass("d-none");
                        $.each(_d, function(i,y){ 
                            _h += '<li class="list-group-item" id='+ y.program_manager_id + '>' + y.oem_name
                                +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ y.program_manager_id + ' onClick="oem.removeList(\'' + "Program Manager" +'\',this)" style="float: right; cursor:pointer;"></i>'
                                +  '</li>';
                            gProgMngrIds.push(y.program_manager_id);
                            gIds.push(y.program_manager_id);
                        });
                    } else {
                        _$frm.find("#btnSaveProgMngrs").addClass("d-none");
                    }
                    
                    _$progMngrListGroup.find("#progMngrsListItemGroup").html(_h);
                });    
             
            }   
            
            //DISPLAY CARLEADERS 
            function displayCarLeaders(progId,carLeadersIds){ 
                gCarleaderIds = [];
                gIds = [];
                $.get(app.execURL + "program_car_leaders_sel @program_id='" + progId + "',@car_leader_ids='" + carLeadersIds + "'"  ,function(d){
                    var _d = d.rows;
                    var _h = "";
                    var _$frm = $("#frm_modalWindowCarLeader");
                    var _$carLeaderListGroup = _$frm.find("#carLeaderListGroup");
                    if(carLeadersIds !== ""){
                        _$frm.find("#btnSaveCarLeader").removeClass("d-none");
                        $.each(_d, function(i,y){ 
                            _h += '<li class="list-group-item" id='+ y.car_leader_id + '>' + y.car_leader
                                +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ y.car_leader_id + ' onClick="oem.removeList(\'' + "Car Leader" +'\',this)" style="float: right; cursor:pointer;"></i>'
                                +  '</li>';
                            gCarleaderIds.push(y.car_leader_id);
                            gIds.push(y.car_leader_id);
                        });
                        
                    } else {
                        _$frm.find("#btnSaveCarLeader").addClass("d-none");
                    }
                    
                    _$carLeaderListGroup.find("#carLeaderListItemGroup").html(_h);
                });    
             
            }  
            
            //DISPLAY LAUNCH MANAGERS 
            function displayLaunchManager(progId,launchMngrIds){ 
                gLaunchMngrIds = [];
                gIds = [];
                $.get(app.execURL + "program_launch_managers_sel @program_id='" + progId + "',@launch_manager_ids='" + launchMngrIds + "'"  ,function(d){
                    var _d = d.rows;
                    var _h = "";
                    var _$frm = $("#frm_modalWindowLaunchManager");
                    var _$launchMngrListGroup = _$frm.find("#launchManagerListGroup");
                    if(launchMngrIds !== ""){
                        _$frm.find("#btnSaveLaunchManager").removeClass("d-none");
                        $.each(_d, function(i,y){ 
                            _h += '<li class="list-group-item" id='+ y.launch_manager_id + '>' + y.launch_manager
                                +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ y.launch_manager_id + ' onClick="oem.removeList(\'' + "Launch Manager" +'\',this)" style="float: right; cursor:pointer;"></i>'
                                +  '</li>';
                            gLaunchMngrIds.push(y.launch_manager_id);
                            gIds.push(y.launch_manager_id);
                        });
                    } else {
                        _$frm.find("#btnSaveLaunchManager").addClass("d-none");
                    }
                    
                    _$launchMngrListGroup.find("#launchManagerListItemGroup").html(_h);
                });    
             
            }  
            
            //DISPLAY LAUNCH MANAGERS 
            function displayWarehouseContacts(progId,warehouseContactIds){ 
                gWarehouseContactIds = [];
                gIds = [];
                $.get(app.execURL + "program_warehouse_contacts_sel @program_id='" + progId + "',@warehouse_contact_ids='" + warehouseContactIds + "'"  ,function(d){
                    var _d = d.rows;
                    var _h = "";
                    var _$frm = $("#frm_modalWindowWarehouseContact");
                    var _$warehouseContactListGroup = _$frm.find("#warehouseContactsListGroup");
                    var _$btnSave = _$frm.find("#btnSaveWarehouseContacts");
                    if(warehouseContactIds !== ""){
                        _$btnSave.removeClass("d-none");
                        $.each(_d, function(i,y){ 
                            _h += '<li class="list-group-item" id='+ y.warehouse_contact_ids + '>' + y.oem_name
                                +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ y.warehouse_contact_ids + ' onClick="oem.removeList(\'' + "Warehouse Contact" +'\',this)" style="float: right; cursor:pointer;"></i>'
                                +  '</li>';
                            gWarehouseContactIds.push(y.warehouse_contact_ids);
                            gIds.push(y.warehouse_contact_ids);
                        });
                    } else {
                        _$btnSave.addClass("d-none");
                    }
                    
                    _$warehouseContactListGroup.find("#warehouseContactsItemGroup").html(_h);
                });    
             
            }  
            
           _public.addList = function(name){  
                var  _$filterId         = ""
                    ,_selectedText      = ""
                    ,_selectedVal       = ""
                    ,_$btnsave          = ""
                    ,_$listGroup        = ""
                ;
                
                if(name === "PM"){ 
                    _$filterId    = $("#frm_modalWindowProgramManager").find("#prog_mngr_filter_id");
                    _selectedText = _$filterId.find(":selected").text();
                    _selectedVal  = _$filterId.find(":selected").val();
                    _$btnsave     = $("#frm_modalWindowProgramManager").find("#btnSaveProgMngrs");
                    _$listGroup   = $("#frm_modalWindowProgramManager").find("#progMngrsListGroup").find("#progMngrsListItemGroup");
                    
                    addDynamicLI(gProgMngrIds,_selectedVal,_selectedText,_$btnsave,_$listGroup,"Program Manager");
            
                }else if(name === "CL"){
                    _$filterId    = $("#frm_modalWindowCarLeader").find("#car_leader_filter_id");
                    _selectedText = _$filterId.find(":selected").text();
                    _selectedVal  = _$filterId.find(":selected").val();
                    _$btnsave     = $("#frm_modalWindowCarLeader").find("#btnSaveCarLeader");
                    _$listGroup   = $("#frm_modalWindowCarLeader").find("#carLeaderListGroup").find("#carLeaderListItemGroup");
            
                    addDynamicLI(gCarleaderIds,_selectedVal,_selectedText,_$btnsave,_$listGroup,"Car Leader");
            
                }else if(name === "LM") {
                    _$filterId    = $("#frm_modalWindowLaunchManager").find("#launch_manager_filter_id");
                    _selectedText = _$filterId.find(":selected").text();
                    _selectedVal  = _$filterId.find(":selected").val();
                    _$btnsave     = $("#frm_modalWindowLaunchManager").find("#btnSaveLaunchManager");
                    _$listGroup   = $("#frm_modalWindowLaunchManager").find("#launchManagerListGroup").find("#launchManagerListItemGroup");
            
                    addDynamicLI(gLaunchMngrIds,_selectedVal,_selectedText,_$btnsave,_$listGroup,"Launch Manager");
                    
                }else {
                    _$filterId    = $("#frm_modalWindowWarehouseContact").find("#warehouse_contacts_filter_id");
                    _selectedText = _$filterId.find(":selected").text();
                    _selectedVal  = _$filterId.find(":selected").val();
                    _$btnsave     = $("#frm_modalWindowWarehouseContact").find("#btnSaveWarehouseContacts");
                    _$listGroup   = $("#frm_modalWindowWarehouseContact").find("#warehouseContactsListGroup").find("#warehouseContactsItemGroup");
            
                    addDynamicLI(gWarehouseContactIds,_selectedVal,_selectedText,_$btnsave,_$listGroup,"Warehouse Contact");
                    
                }
            
                
            }
            
            function addDynamicLI(ids,val,text,btn,listGroup,name){
                var _li = '<li class="list-group-item" id='+ val +'>' + text 
                        +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ val + ' onClick="oem.removeList(\''+ name + '\',this)" style="float: right; cursor:pointer;"></i>'
                        + '</li>';
                
                if (ids.indexOf(val) !== -1) alert("Already exist.");
                else if (val === "") alert("Please Select " + name);
                else {
                    ids.push(val);
                    btn.removeClass("d-none");
                    listGroup.append(_li);
                }
            }
            
            _public.removeList = function(name,el){
                var _ids = [];
                if(name === "Program Manager") _ids = gProgMngrIds;
                if(name === "Car Leader") _ids = gCarleaderIds; 
                if(name === "Launch Manager") _ids = gLaunchMngrIds;
                if(name === "Warehouse Contact") _ids = gWarehouseContactIds;
                
                var _$li = $(el).closest("li");
                var _$value = _$li.attr("id");
                for( var i = 0; i < _ids.length; i++){ 
                   if ( _ids[i] === _$value) {
                     _ids.splice(i, 1); 
                   }
                }
                _$li.remove();
            }
            
            _public.onClickSaveProgMngrs = function(){
                $.post( app.procURL + "program_managers_upd "
                    + "@program_id='"               + gProgId + "'"
                    + ",@program_manager_ids='"     + gProgMngrIds.join(",") + "'" 
                    ,function(data){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");      
                        displayProgram($("#grid-P").data("id"));
                });
            
            }
            
            _public.onClickSaveLaunchManager = function(){
                $.post( app.procURL + "program_launch_manager_upd "
                    + "@program_id='"              + gProgId + "'"
                    + ",@launch_manager_ids='"     + gLaunchMngrIds.join(",") + "'" 
                    ,function(data){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");      
                        displayProgram($("#grid-P").data("id"));
                });
            
            }
            
            _public.onClickSaveCarLeader = function(){
                $.post( app.procURL + "program_car_leaders_upd "
                    + "@program_id='"           + gProgId + "'"
                    + ",@car_leader_ids='"      + gCarleaderIds.join(",") + "'" 
                    ,function(data){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");      
                        displayProgram($("#grid-P").data("id"));
                });
            
            }
            
            _public.onClickSaveWarehouseContacts = function(){
                $.post( app.procURL + "program_warehouse_contacts_upd "
                    + "@program_id='"                   + gProgId + "'"
                    + ",@warehouse_contact_ids='"       + gWarehouseContactIds.join(",") + "'" 
                    ,function(data){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");      
                        displayProgram($("#grid-P").data("id"));
                });
            
            }
            
            function displayBuildPhase(id){
                var cb = app.bs({name:"cbFilter3",type:"checkbox"});
                $("#grid-BP").dataBind({
                     url            : app.execURL + "oem_build_phases_sel @oem_id=" + id
                    ,width          : $("#nav-tabContent").width() - 50
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"oem_build_phase_id"    ,type:"hidden"  ,value: app.svn(d,"oem_build_phase_id")})
                                         + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                         + app.bs({name:"oem_id"                ,type:"hidden"  ,value: id })
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Build Phase Abbrevation"         ,name:"build_phase_abbrv"        ,type:"input"       ,width : 200   ,style : "text-align:left"}
                        ,{text: "Build Phase Name"                ,name:"build_phase_name"         ,type:"input"       ,width : 200   ,style : "text-align:left"}
                        ,{text: "Is Active?"                      ,name:"is_active"                ,type:"yesno"       ,width : 85    ,style : "text-align:center;"  ,defaultValue:"Y"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("#cbFilter3").setCheckEvent("#grid-BP input[name='cb']");
                    }
                });
            }  
            
            function displayHarnessFamily(id){
                var cb = app.bs({name:"cbFilter4",type:"checkbox"});
                $("#grid-HF").dataBind({
                     url            : app.execURL + "harness_family_sel @oem_id=" + id
                    ,width          : $("#nav-tabContent").width() - 50
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"hf_id"                  ,type:"hidden"         ,value: app.svn(d,"hf_id")}) 
                                         + app.bs({name:"oem_id"                 ,type:"hidden"         ,value: id })
                                         + app.bs({name:"region_id"              ,type:"hidden"         ,value: app.svn(d,"region_id") })
                                         + app.bs({name:"is_edited"              ,type:"hidden"         ,value: app.svn(d,"is_edited")})
                                         + (d !==null ? app.bs({name:"cb"        ,type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Harness Name"                    ,name:"harness_family"             ,type:"input"       ,width : 200   ,style : "text-align:left"}
                        ,{text: "Is Active?"                      ,name:"is_active"                  ,type:"yesno"       ,width : 85    ,style : "text-align:center;"  ,defaultValue:"Y"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("#cbFilter4").setCheckEvent("#grid-HF input[name='cb']");
                    }
                });
            }  
            
            
            function displayProgramParts(oemId,progId,modelYearId){
                var cb = app.bs({name:"cbFilter5",type:"checkbox"});
                $("#gridProgParts").dataBind({
                     url            : app.procURL + "oem_program_parts_sel @program_id=" + (progId ? progId : "") + ",@oem_program_part_id=" + (oemId ? oemId : "")
                    ,width          : $(window).width() - 20
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"oem_program_part_id"    ,type:"hidden"          ,value: app.svn (d,"oem_program_part_id")}) 
                                        + app.bs({name:"is_edited"                                  ,type:"hidden"          ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"program_id"                                 ,type:"hidden"          ,value: progId })
                                        + (d !==null ? app.bs({name:"cb"                            ,type:"checkbox"}) : "" ); 
                            }
            
                        }
                        ,{text: "Build Phase"            ,name : "build_phase_id"                 ,type : "select"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Model Year"             ,name : "model_year"                     ,type : "input"       ,width : 150  ,style : "text-align:center"}
                        ,{text: "Harness Family"         ,name : "harness_family_id"              ,type : "select"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Prefix"                 ,name : "prefix"                         ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Base"                   ,name : "base"                           ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Suffix"                 ,name : "suffix"                         ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "OEM Part Number"        ,name : "oem_part_no"                    ,type : "input"       ,width : 200  ,style : "text-align:left"}
                        ,{text: "Customer Part Number"   ,name : "customer_part_no"               ,type : "input"       ,width : 200  ,style : "text-align:left"}
                        ,{text: "Customers"                                                       ,width : 80   ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='CUSTOMERS > "+ app.svn (d,"program_code") +"' onclick='oem.showModalCustomers("+ app.svn (d,"oem_program_part_id") +")'>   <i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                        }
                    ]
                    ,onComplete: function(o){
                        var _zRow = $(".zRow");
                        var _this = this;
                        _this.data("oemId",oemId);
                        _this.data("progId",progId);
                        _this.find("#cbFilter5").setCheckEvent("#gridProgParts input[name='cb']");
                       
                        _this.find("select[name='build_phase_id']").dataBind({
                             sqlCode : "O148" //oem_build_phases_sel
                            ,parameters:{oem_id : oemId}
                            ,text: "build_phase_abbrv"
                            ,value: "oem_build_phase_id"
                        });
                        _this.find("select[name='harness_family_id']").dataBind({
                             sqlCode : "H168" //harness_family_sel
                            ,parameters:{oem_id : oemId}
                            ,text: "harness_family"
                            ,value: "hf_id"
                        });
                        _this.find("input[name='oem_part_no']").attr("readonly",true);
                       var _prefix = "";
                        var _base = "";
                        var _suffix = "";
                        var _$row   = "";
                        var _val = []; 
                        _zRow.find("#prefix, #base, #suffix").keyup(function(){
                            var _$zRow      = $(this).closest(".zRow");
                            var _colName    = $(this)[0].id;
                            var _thisValue  = "";
                            if (_colName == "prefix" ) {
                                _thisValue  = _$zRow.find("#prefix").val();
                                _prefix     = _thisValue;
                                _base       = _$zRow.find("#base").val();
                                _suffix     = _$zRow.find("#suffix").val();
                            
                            } else if (_colName == "base" ) {
                                _thisValue  = _$zRow.find("#base").val();
                                _prefix     = _$zRow.find("#prefix").val();
                                _base       = _thisValue
                                _suffix     = _$zRow.find("#suffix").val();
                        
                            }else {
                                _thisValue = _$zRow.find("#suffix").val();
                                _prefix     = _$zRow.find("#prefix").val();
                                _base       = _$zRow.find("#base").val();
                                _suffix     = _thisValue
                            
                                
                            } 
                            OEMPartNumber(_$zRow,_prefix,_base,_suffix);
                        });
                    }
                     
                });
            } 
            
           function OEMPartNumber(_$zRow,prefix,base,suffix) {
                var _prefix = (! isUD(prefix) ? prefix : "");
                var _base   = (! isUD(base) ? "-" + base : "");
                var _suffix = (! isUD(suffix) ? "-" + suffix : "");
                var _res = ""
                if(prefix === "" && suffix === "") _res = base;
                else if(prefix === "" && base === "") _res = suffix;
                else if(base === "" && suffix === "") _res = prefix;
                else if(prefix === "" && base !== "" &&  suffix !== "") _res = base.concat(_suffix);
                else if(prefix !== "" && base !== "" && suffix === "") _res = _prefix.concat(_base);
                else if(prefix !== "" && base === "" && suffix !== "") _res = _prefix.concat(_suffix);
                else _res = _prefix.concat(_base,_suffix);
        
                _$zRow.find("#oem_part_no").val(_res);
            };

            _public.submitProgParts = function(){
                var _$grid = $("#gridProgParts");
                    _$grid.jsonSubmit({
                         procedure: "oem_program_parts_upd"
                        ,optionalItems: ["build_phase_id, harness_family_id"] 
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayProgramParts(_$grid.data("oemId"),_$grid.data("progId"));
                        }
                    });
            } 
            
            function displayCustomers(id){
                var cb = app.bs({name:"cbFilter6",type:"checkbox"});
                $("#gridCustomers").dataBind({
                     //url            : app.execURL + "customer_programs_sel" 
                     sqlCode        : "C156"
                    ,parameters     : {oem_program_id : id }
                    ,width          : $("#frm_modalCustomers").width() - 20
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"customer_program_id"                   ,type:"hidden"         ,value: app.svn(d,"customer_program_id")})
                                        + (d !==null ? app.bs({name:"cb"                       ,type:"checkbox"}) : "" );
                                    
                                }
                        }
                        ,{text: "Customer Name"                    ,width : 230   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"customer_id"                           ,type:"select"         ,value:svn(d,"customer_id")})
                                         + app.bs({name:"is_edited"                             ,type:"hidden"         ,value: app.svn(d,"is_edited") })
                                         + app.bs({name:"oem_program_part_id"                   ,type:"hidden"         ,value: id});
                                         
                                         
                                }
                        }
                        ,{text: "Part Number"                      ,name:"customer_part_no"     ,type:"input"          ,width : 230    ,style : "text-align:left"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("#cbFilter6").setCheckEvent("#gridCustomers input[name='cb']");
                         this.find("select[name='customer_id']").dataBind({
                             sqlCode    : "C142" //customers_sel
                            ,text       : "customer_name"
                            ,value      : "customer_id"
                        });
                    }
                    
                });
            }  
            
            _public.submitDataPrograms = function(){
                var _$grid = $("#grid-P");
                    _$grid.jsonSubmit({
                         procedure: "oem_programs_upd"
                        ,optionalItems: ["is_active"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayProgram(_$grid.data("id"));
                        }
                    });
            } 
            _public.submitDataBuildPhase = function(){
                var _$grid = $("#grid-BP");
                    _$grid.jsonSubmit({
                         procedure: "oem_build_phases_upd"
                        ,optionalItems: ["is_active"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayBuildPhase(_$grid.data("id"));
                        }
                    });
            }   
            
            _public.submitDataHarnessFamily = function(){
                var _$grid = $("#grid-HF");
                    _$grid.jsonSubmit({
                         procedure: "harness_family_upd"
                        ,optionalItems: ["is_active"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayHarnessFamily(_$grid.data("id"));
                        }
                    });
            }
            _public.submitCustomers = function(){
                var _$grid = $("#gridCustomers");
                    _$grid.jsonSubmit({
                         procedure: "customer_programs_upd"
                        ,optionalItems: ["customer_id"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayCustomers(_$grid.data("id"));
                        }
                    });
            }
    
    return _public;
  
 })();
  

                                                                            