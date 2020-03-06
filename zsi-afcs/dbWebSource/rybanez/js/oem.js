var oem =  (function(){
        var _public = {};
            var      bs                     = zsi.bs.ctrl
                    ,svn                    = zsi.setValIfNull
                    ,hashParams             = app.hash.getPageParams(["oem_id","program_id"])
                    ,gMdlProgParts          = "modalProgramParts"
                    ,gMdlCustomers          = "modalCustomers"
                    ,gMdlCustomerContacts   = "modalCustomerContacts"
                    ,gtw                    = null
                    ,gMdlProgramDetail      = "modalWindowProgramDetail"
                    ,gMdlProgramPlants      = "modalWindowProgramPlants"
                    ,gMdlProgramWarehouse   = "modalWindowProgramWarehouse"
                    ,gMdlUploadExcel        = "modalWindowUploadExcel"
                    ,gOemId                 = null
                    ,gProgId                = null
                    ,gProgramId             = null
                    ,gProgramData           = ""
                    ,gBPData                = "" 
                    ,gHFData                = ""
                    ,gHFSearch              = ""
            ;
 
            $.fn.setValueIfChecked = function(){
                var _$zRow = this.closest(".zRow");
                var _userId = _$zRow.find("#user_id");
                var _tempId = _$zRow.find("#tempUser_id").val();
                if(this.prop("checked") === true){
                    _userId.val(_tempId);
                    
                }else{
                    _userId.val("");
                    
                }
            };
            $.fn.setPlantValueIfChecked = function(){
                var _$zRow = this.closest(".zRow");
                var _plantId = _$zRow.find("#plant_id");
                var _tempId = _$zRow.find("#tempPlant_id").val();
                if(this.prop("checked") === true){
                    _plantId.val(_tempId);
                    
                }else{
                    _plantId.val("");
                    
                }
            };
            $.fn.setWarehouseValueIfChecked = function(){
                var _$zRow = this.closest(".zRow");
                var _warehouseId = _$zRow.find("#warehouse_id");
                var _tempId = _$zRow.find("#tempWarehouse_id").val();
                if(this.prop("checked") === true){
                    _warehouseId.val(_tempId);
                    
                }else{
                    _warehouseId.val("");
                    
                }
            };

            zsi.ready = function(){
                $(".page-title").html("OEM");
                gtw = new zsi.easyJsTemplateWriter();
                displayRecords();
                getTemplates(); 
                setSearch();
            }; 
            
            //Public funtions
            _public.deleteDataPrograms = function(){
                zsi.form.deleteData({
                     code       : "ref-0004"
                    ,onComplete : function(data){
                        displayProgram($("#grid-P").data("id"));
                      }
                });       
            };
            _public.deleteDataBuildPhase = function(){
                zsi.form.deleteData({
                     code       : "ref-0005"
                    ,onComplete : function(data){
                        displayBuildPhase($("#grid-BP").data("id"));
                     }
                });       
            };
            _public.deleteDataHarnessFamily = function(){
                zsi.form.deleteData({
                     code       : "ref-0008"
                    ,onComplete : function(data){
                        displayHarnessFamily($("#grid-HF").data("id"));
                      }
                });
            };
            _public.deleteDataProgramParts = function(){
                var _$grid = $("#gridProgParts");
                zsi.form.deleteData({
                     code       : "ref-0007"
                    ,onComplete : function(data){
                        $("#gridProgParts").trigger("refresh");
                      }
                });       
            };
            _public.deleteDataCustomers = function(){
                var _$grid = $("#gridCustomers");
                zsi.form.deleteData({
                     code       : "ref-00022"
                    ,onComplete : function(data){
                        displayCustomers(_$grid.data("id"));
                      }
                });       
            };
            _public.deleteDataCustomerContacts = function(){
                var _$grid = $("#gridCustomerContacts");
                zsi.form.deleteData({
                     code       : "ref-00032"
                    ,onComplete : function(data){
                        _$grid.trigger("refresh");
                      }
                });       
            };
            _public.excelFileUpload = function(){
                var frm      = $("#frm_modalWindowUploadExcel");
                var formData = new FormData(frm.get(0));
                var files    = frm.find("input[name='file']").get(0).files; 
            
                if(files.length===0){
                    alert("Please select excel file.");
                    return;    
                }
                
                //disable button and file upload.
                //frm.find("input[name='file']").attr("disabled","disabled");
                $("btnUploadFile").hide();
                $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");
            
                $.ajax({
                    url: base_url + 'file/templateUpload',  //server script to process data
                    type: 'POST',
                    //Ajax events
                    success: completeHandler = function(data) {
                        if(data.isSuccess){
                             alert("Data has been successfully uploaded.");
                        }
                        else
                            alert(data.errMsg);
                    },
                    error: errorHandler = function() {
                        console.log("error");
                    },
                    // Form data
                    data: formData,
                    //Options to tell JQuery not to process data or worry about content-type
                    cache: false,
                    contentType: false,
                    processData: false
                }, 'json');
            };  
            _public.showModal = function(tabName, id,name){
                var _$body = $("#frm_modalOEM").find(".modal-body").find("#nav-tab");
                
                g$mdl = $("#modalOEM");
                g$mdl.find(".modal-title").text("OEM » " + name ) ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                
                if(tabName === "Programs") {
                    _$body.find("[aria-controls='nav-p']").trigger("click");
                    g$mdl.find("#dummyDiv").removeClass("d-none");
                    //displayProgram(id);
                }
                else if(tabName === "Build Phase") {
                    _$body.find("[aria-controls='nav-bp']").trigger("click");
                    g$mdl.find("#dummyDiv").removeClass("d-none");
                   //displayBuildPhase(id);
                }
                else {
                    _$body.find("[aria-controls='nav-hf']").trigger("click");
                    g$mdl.find("#searchHarness").removeClass("d-none");
                    g$mdl.find("#dummyDiv").addClass("d-none");
                }
                g$mdl.find('a[data-toggle="tab"]').unbind().on('show.bs.tab', function (e) {
                    //e.target // newly activated tab
                    //e.relatedTarget // previous active tab
                    g$mdl.find("#dummyDiv").removeClass("d-none");
                    g$mdl.find("#searchHarness").addClass("d-none");
                    if($.trim($(e.target).text()) === "Harness Family"){
                        g$mdl.find("#searchHarness").removeClass("d-none");
                        g$mdl.find("#dummyDiv").addClass("d-none");
                    }
                });
                
                //gOemId = id;
                displayProgram(id);
                displayBuildPhase(id);
                displayHarnessFamily(id);
            };
            _public.showModalUpload = function(o,tabName){
                $.get(app.execURL +  "excel_upload_sel @load_name ='" + tabName +"'"
                ,function(data){
                    g$mdl = $("#" + gMdlUploadExcel);
                    g$mdl.find(".modal-title").text("Upload Excel for » " + tabName ) ;
                    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                     
                    $("#tmpData").val(data.rows[0].value);
                    
                    $("input[name='file']").val("");
                    
                //    excelFileUpload();
                });
            };    
            _public.showModalParts = function(oemId,progId,progCode,progCoordinatorId) {
                
                gOemId = oemId;
                gProgId = progId;
                var  _programsFormBtn   = $("#frm_modalProgramParts").find("#btnPerUserHide")
                    ,_customersFormBtn  = $("#frm_modalCustomers").find("#hideBtnForUserId")
                    ,_customerContactsFormBtn  = $("#frm_modalCustomerContacts").find("#hideBtnForUserIds");
                if(progCoordinatorId != userId){
                    _programsFormBtn.hide();
                    _customersFormBtn.hide();
                    _customerContactsFormBtn.hide();
                }else{
                    _programsFormBtn.show();
                    _customersFormBtn.show();
                    _customerContactsFormBtn.show();
                }
                
                g$mdl = $("#" + gMdlProgParts);
                g$mdl.find(".modal-title").html(" <div class='row'> Program » " + progCode + "</div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                var _$bpFilter = $("#frm_modalProgramParts").find("select[name='build_phase_filter_id']");
                var _$myFilter =  $("#frm_modalProgramParts").find("select[name='dd_model_year']");
                _$bpFilter.dataBind({
                     sqlCode    : "D210" //dd_program_bp_sel
                    ,parameters : {program_id : progId}
                    ,text       : "build_phase_abbrv"
                    ,value      : "build_phase_id"
                    //,selectedValue : "VP" //VP Default Value
                    ,onComplete : function(){
                        //$("option", this).filter(function(){ return $.trim($(this).text()) == "VP" }).attr('selected', true);
                        //$("option:nth-child(2)", this).attr("selected", true);
                        var _buildPhaseId = $(this).val();
                        
                        _$myFilter.dataBind({
                             sqlCode    : "D211" //dd_program_model_year_sel
                            ,parameters : {program_id : progId, bp_id : _buildPhaseId}
                            ,text       : "model_year"
                            ,value      : "model_year_name"
                            //,selectedValue : "2019" //Default Value
                            ,onComplete : function(){
                                //$("option", this).filter(function(){ return $.trim($(this).text()) == "2019" }).attr('selected', true);
                                //$("option:nth-child(2)", this).attr("selected", true);
                                
                                displayProgramParts(oemId,progId);
                            }
                        });
                    }
                });
            };
            _public.showPrograms = function(){ 
               
                var _buildPhaseId = $("#frm_modalProgramParts").find("#build_phase_filter_id").val();
                var _modelYearId = $("#frm_modalProgramParts").find("#dd_model_year").val();
                displayProgramParts(gOemId,gProgId,_buildPhaseId,_modelYearId); 
                 
            };
            _public.showModalCustomers = function(oemId,oemPartNo) {
                g$mdl = $("#" + gMdlCustomers);
                g$mdl.find(".modal-title").text("OEM Part Number  » " + oemPartNo) ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayCustomers(oemId);
            };
            _public.showModalCustomerContacts = function(id,oemId) {
                var _$frm = $("#frm_modalCustomers").find("#gridCustomers").find(".zRow").find('select[name="customer_id"] option[value="'+id+'"]').text();
                var name = [];
                $.each(_$frm.trim().split(" "),function(i,v){
                   if(i === 0)name.push(v);
                });
                g$mdl = $("#" + gMdlCustomerContacts);
                g$mdl.find(".modal-title").text("Customer  » " + name) ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayCustomerContacts(id,oemId);
            };
            _public.showModalProgramDetails = function(name,oemId,progId,roleId) {
                g$mdl = $("#" + gMdlProgramDetail);
                g$mdl.find(".modal-title").html(" <div class='row'> "+ name +" </div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayProgramDetails(oemId,progId,roleId);
            };
            _public.showModalProgramPlants = function(name,progId) {
                g$mdl = $("#" + gMdlProgramPlants);
                g$mdl.find(".modal-title").html(" <div class='row'> "+ name +" </div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayProgramPlants(progId);
            };
            _public.showModalProgramWarehouse = function(name,progId) {
                g$mdl = $("#" + gMdlProgramWarehouse);
                g$mdl.find(".modal-title").html(" <div class='row'> "+ name +" </div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayProgramWarehouse(progId);
            };
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
            };
            _public.submitCustomerContacts = function(){
                var _$grid = $("#gridCustomerContacts");
                    _$grid.jsonSubmit({
                         procedure: "contact_program_parts_upd"
                        ,optionalItems: ["contact_id", "is_main"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            _$grid.trigger("refresh");
                        }
                    });
            };
            _public.submitProgramDetails = function(){
                var _$frm = $("#frm_modalWindowProgramDetail");
                var _$grid = _$frm.find("#gridProgramDetails");
                    _$grid.jsonSubmit({
                         procedure: "program_users_upd"
                        ,notInclude: "#tempUser_id,#program_user"
                        ,onComplete: function(data){
                            if(data.isSuccess===true) zsi.form.showAlert("alert");  
                            $("#gridProgramDetails").trigger("refresh");
                            $("#grid-P").trigger("refresh");
                        }
                    });
            };
            _public.submitProgramPlants = function(){
                var _$frm  = $("#frm_modalWindowProgramPlants");
                var _$grid = _$frm.find("#gridProgramPlants");
                    _$grid.jsonSubmit({
                         procedure: "program_plants_upd"
                        ,notInclude: "#tempPlant_id,#plant_name,#plant_code"
                        ,onComplete: function(data){
                            if(data.isSuccess===true) zsi.form.showAlert("alert");  
                            $("#gridProgramPlants").trigger("refresh");
                            $("#grid-P").trigger("refresh");
                        }
                    });
            };
            _public.submitProgramWarehouse = function(){
                var _$frm  = $("#frm_modalWindowProgramWarehouse");
                var _$grid = _$frm.find("#gridProgramWarehouse");
                    _$grid.jsonSubmit({
                         procedure: "program_warehouses_upd"
                        ,notInclude: "#tempWarehouse_id,#warehouse_name,#warehouse_code"
                        ,onComplete: function(data){
                            if(data.isSuccess===true) zsi.form.showAlert("alert");  
                            $("#gridProgramWarehouse").trigger("refresh");
                            $("#grid-P").trigger("refresh");
                        }
                    });
            };
            _public.submitProgParts = function(){
                if( zsi.form.checkMandatory()!==true) return false;
                var _$grid = $("#gridProgParts");
                    _$grid.jsonSubmit({
                         procedure: "oem_program_parts_upd"
                        ,optionalItems: ["build_phase_id", "harness_family_id"] 
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                             $("#gridProgParts").trigger("refresh");
                        }
                    });
            }
            
            //Private functions
            function displayRecords(id){ 
                var _$sidebar = $(".page-sidebar").width();
                $("#grid").dataBind({
             	     sqlCode        : "O149" //oem_sel
            	    ,height         : $(window).height() - 240
            	    ,blankRowsLimit : 5
                    ,isPaging       : false
                    ,dataRows       : [
                                        {text : "OEM Id"                                                           ,width : 70       , style : "text-align:left;" ,sortColNo : 0
                        		            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_id"                    ,type:"input"      ,value: svn (d,"oem_id") }) 
                                                     + app.bs({name:"is_edited"                 ,type:"hidden"     ,value: svn (d,"is_edited")}); }
                        		        }
                                        ,{text : "OEM Name"                                                         ,width : 200       , style : "text-align:left;" ,sortColNo : 1
                        		            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_name"                  ,type:"input"      ,value: svn (d,"oem_name") }); }
                        		        }
                        		        ,{text : "OEM Shortname"       , name : "oem_sname"     ,type : "input"    ,width : 200       , style : "text-align:left;" ,sortColNo : 2 
                        		            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_sname"                  ,type:"input"      ,value: svn (d,"oem_sname") })
                        		                    + app.bs({name:"img_filename"                  ,type:"hidden"      ,value: svn (d,"img_filename")}); 
                        		            }
                        		        }
                        		        ,{text : "Active?"             , name : "is_active"     ,type : "yesno"    , width : 50       , style : "text-align:center;"          ,defaultValue:"Y"}
                                        ,{text : "Build Phase"                                  ,type : "input"    ,width : 100       ,style : "text-align:center"          
                                                ,onRender : function(d){
                                                        var _link = "<a href='javascript:void(0)' id='link_bp' title='OEM > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Build Phase" + "\","+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                        return (d !== null ? _link : "");
                                                    
                                                }
                                        }
                                        ,{text : "Program"                                      ,type : "input"    ,width : 90        ,style : "text-align:center"
                                                ,onRender : function(d){
                                                        var _link = "<a href='javascript:void(0)' id='link_programs' title='OEM > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Programs" + "\" ,"+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                        return (d !== null ? _link : "");
                                                    
                                                }
                                         }
                                        ,{text : "Harness Family"                               ,type : "input"    ,width : 90        ,style : "text-align:center"
                                                ,onRender : function(d){
                                                        var _link = "<a href='javascript:void(0)' id='link_hf' title='HARNESS FAMILY > "+ app.svn (d,"oem_name") +"' onclick='oem.showModal(\""+ "Harness Family" + "\" ,"+ app.svn (d,"oem_id") +",\""+ app.svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                                        return (d !== null ? _link : "");
                                                    
                                                }
                                         }
            	                    ]
                	    ,onComplete: function(){
                            this.find(".zRow").find("#oem_id").attr('readonly', true);
                            
                            if(hashParams.oem_id){
                                var _$zRow = $("#grid").find("input[name='oem_id'][value='"+ hashParams.oem_id +"']").closest(".zRow");
                                _$zRow.find("#link_programs").click();
                            }
                    }
                });    
            }
            function displayInactiveRecords(){
                var _$sidebar = $(".page-sidebar").width();
                
                var cb = app.bs({name:"cbFilter1",type:"checkbox"});
                $("#gridInactiveRecords").dataBind({
             	     sqlCode        : "O149" //oem_sel
             	    ,parameters     : {is_active: "N"}
            	    ,height         : 600
                    ,blankRowsLimit : 5
                    ,isPaging       : false
                    ,dataRows       : [
                                        { text : cb , width : 25   , style : "text-align:left;" 
                                            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_id"                    ,type:"hidden"      ,value: svn (d,"oem_id")})
                                                    + (d !==null ? app.bs({name:"cb"            ,type:"checkbox"}) : "" ); }
                                        }
                                        ,{text : "OEM Id"                                                          ,width : 50       , style : "text-align:left;"
                        		            ,onRender  :  function(d){ 
                                                return app.bs({name:"dummy_oem_id"              ,type:"input"      ,value: svn (d,"oem_id")}) 
                                                     + app.bs({name:"is_edited"                 ,type:"hidden"     ,value: svn (d,"is_edited")}); }
                        		        }
                        		        ,{text : "OEM Name"            , name : "oem_name"      ,type : "input"    ,width : 200       , style : "text-align:left;"}
                        		        ,{text : "OEM Shortname"       , name : "oem_sname"     ,type : "input"    ,width : 200       , style : "text-align:left;"
                        		            ,onRender  :  function(d){ 
                                                return app.bs({name:"oem_sname"                 ,type:"input"      ,value: svn (d,"oem_sname")})
                        		                    + app.bs({name:"img_filename"               ,type:"hidden"      ,value: svn (d,"img_filename")}); 
                        		            }
                        		        }
                        		        ,{text : "Active?"             , name : "is_active"     ,type : "yesno"    ,width : 50        , style : "text-align:center;"          ,defaultValue:"N"}
                                        
            	                    ]
                	    ,onComplete: function(){
                            $("[name='cbFilter1']").setCheckEvent("#gridInactiveRecords input[name='cb']");
                            this.find(".zRow").find("input[name='oem_id']").attr('readonly', true);
                    }
                });
            }
            function displayProgramPlants(progId){
                var  cb          = app.bs({name:"cbFilterPlants",type:"checkbox"})
                    ,_cbChecked  = true
                ;
                $("#gridProgramPlants").dataBind({
                         sqlCode     : "D220" //dd_oem_program_plants
                        ,parameters  : {oem_program_id: progId}
                        ,height      : 360
                        ,dataRows    : [
                            {text: cb  ,width : 25   ,style : "text-align:left"
                                ,onRender  :  function(d){ 
                                    if(!app.svn(d,"oem_program_plant_id")) _cbChecked = false;
                                    
                                    var _r="";
                                    _r  += app.bs({name:"oem_program_plant_id"  ,type:"hidden"      ,value: app.svn (d,"oem_program_plant_id")}); 
                                    _r  += app.bs({name:"oem_program_id"        ,type:"hidden"      ,value: progId});
                                    _r  += app.bs({name:"tempPlant_id"          ,type:"hidden"      ,value: app.svn(d,"plant_id")});
                                    
                                    if( app.svn(d,"oem_program_plant_id") ){
                                        _r  +=app.bs({name:"cb"                 ,type:"checkbox"    ,checked: true });
                                        _r  += app.bs({name:"plant_id"          ,type:"hidden"      ,value: app.svn(d,"plant_id")});

                                    }else{
                                        _r  +=app.bs({name:"cb"                 ,type:"checkbox"    ,checked: false });
                                        _r  += app.bs({name:"plant_id"          ,type:"hidden"      ,value: ""});
                                    }
                                    return _r;     
                                }
                            }
                            ,{text: "Plant Code" ,name : "plant_code"           ,type : "input"     ,width : 100  ,style : "text-align:left"}
                            ,{text: "Plants"     ,name : "plant_name"           ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterPlants']");
                            var _progForm = $("#frm_modalProgramPlants");
                            _cbFilter.setCheckEvent("#gridProgramPlants input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            this.find('input[type="checkbox"]').click(function(){
                               $(this).setPlantValueIfChecked();
                            });
                    
                        }
                });
             
            }  
            function displayProgramWarehouse(progId){
                var  cb          = app.bs({name:"cbFilterWarehouse",type:"checkbox"})
                    ,_cbChecked  = true
                ;
                $("#gridProgramWarehouse").dataBind({
                         sqlCode     : "D221" //dd_oem_program_warehouses
                        ,parameters  : {oem_program_id: progId}
                        ,height      : 360
                        ,dataRows    : [
                            {text: cb  ,width : 25   ,style : "text-align:left"
                                ,onRender  :  function(d){ 
                                    if(!app.svn(d,"oem_program_warehouse_id")) _cbChecked = false;
                                    
                                    var _r="";
                                    _r  += app.bs({name:"oem_program_warehouse_id"      ,type:"hidden"      ,value: app.svn (d,"oem_program_warehouse_id")}); 
                                    _r  += app.bs({name:"oem_program_id"                ,type:"hidden"      ,value: progId});
                                    _r  += app.bs({name:"tempWarehouse_id"              ,type:"hidden"      ,value: app.svn(d,"warehouse_id")});
                                    
                                    if( app.svn(d,"oem_program_warehouse_id") ){
                                        _r  +=app.bs({name:"cb"                         ,type:"checkbox"    ,checked: true });
                                        _r  += app.bs({name:"warehouse_id"              ,type:"hidden"      ,value: app.svn(d,"warehouse_id")});

                                    }else{
                                        _r  +=app.bs({name:"cb"                         ,type:"checkbox"    ,checked: false });
                                        _r  += app.bs({name:"warehouse_id"              ,type:"hidden"      ,value: ""});
                                    }
                                    return _r;     
                                }
                            }
                            ,{text: "Warehouse Code"    ,name : "warehouse_code"        ,type : "input"     ,width : 100  ,style : "text-align:left"}
                            ,{text: "Warehouses"        ,name : "warehouse_name"        ,type : "input"     ,width : 200  ,style : "text-align:left"}
                        ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterWarehouse']");
                            var _progForm = $("#frm_modalProgramWarehouse");
                            _cbFilter.setCheckEvent("#gridProgramWarehouse input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            this.find('input[type="checkbox"]').click(function(){
                    
                               $(this).setWarehouseValueIfChecked();
                            });
                    
                        }
                });
             
            }  
            function displayProgramDetails(oemId,progId,roleId){
                var  cb          = app.bs({name:"cbFilterProg",type:"checkbox"})
                    ,_cbChecked  = true
                    ,_dataRows   = [];
                
                _dataRows.push(
                            {text: cb  ,width : 25   ,style : "text-align:left"
                                ,onRender  :  function(d){ 
                                    if(!app.svn(d,"oem_program_user_id")) _cbChecked = false;
                                    
                                    var _r="";
                                    _r  += app.bs({name:"oem_program_user_id"       ,type:"hidden"      ,value: app.svn (d,"oem_program_user_id")}); 
                                    _r  += app.bs({name:"oem_program_id"            ,type:"hidden"      ,value: progId});
                                    _r  += app.bs({name:"tempUser_id"               ,type:"hidden"      ,value: app.svn(d,"user_id")});
                                    
                                    if( app.svn(d,"oem_program_user_id") ){
                                        _r  +=app.bs({name:"cb"                     ,type:"checkbox"    ,checked: true });
                                        _r  += app.bs({name:"user_id"               ,type:"hidden"      ,value: app.svn(d,"user_id")});

                                    }else{
                                        _r  +=app.bs({name:"cb"                     ,type:"checkbox"    ,checked: false });
                                        _r  += app.bs({name:"user_id"               ,type:"hidden"      ,value: ""});
                                    }
                                    return _r;     
                                }
                            }
                    );
                    
                if(roleId == 2){
                    _dataRows.push(
                            {text: "Program Managers"        ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        
                    );
                }else if(roleId == 6){
                    _dataRows.push(
                            {text: "Car Leaders"             ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        
                    );
                }else if(roleId == 4){
                    _dataRows.push(
                            {text: "Launch Managers"         ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        
                    );
                }else if(roleId == 9){
                    _dataRows.push(
                            {text: "Warehouse Contacts"      ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        
                    );
                }else if(roleId === ""){
                    _dataRows.push(
                            {text: "Plants"                  ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                        
                    );
                }else{
                    _dataRows.push(
                            {text: "Warehouses"              ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
   
                    );
                }
                
                $("#gridProgramDetails").dataBind({
                         sqlCode     : "D216" //dd_program_users_sel
                        ,parameters  : {oem_id: oemId, oem_program_id: progId, role_id: roleId}
                       // ,width       : $(".modal-body").width("")
                        ,height      : 360
                        ,dataRows    : _dataRows
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterProg']");
                            var _progForm = $("#frm_modalProgramParts");
                            _cbFilter.setCheckEvent("#gridProgramDetails input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            if(_progForm.find("#build_phase_filter_id").val() === " " || _progForm.find("#dd_model_year").val() === ""){
                                
                            }
                            this.find('input[type="checkbox"]').click(function(){
                                

                               $(this).setValueIfChecked();
                            });
                    
                        }
                });
             
            }  
            function displayBuildPhase(id){
                var cb = app.bs({name:"cbFilter3",type:"checkbox"});
                //var _data = $.grep(gBPData, function(x){
                //    return x.oem_id === id;
                //});
                
                $("#grid-BP").dataBind({
                     url            : app.execURL + "oem_build_phases_sel @oem_id=" + id
                   // ,width          : $("#nav-tabContent").width() - 50
                    // rows           : _data
                    ,height         : $(window).height() - 200
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
                        ,{text: "Build Phase Code"                ,name:"build_phase_abbrv"        ,type:"input"       ,width : 200   ,style : "text-align:left"}
                        ,{text: "Build Phase Name"                ,name:"build_phase_name"         ,type:"input"       ,width : 400   ,style : "text-align:left"}
                        ,{text: "Active?"                         ,name:"is_active"                ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"Y"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("[name='cbFilter3']").setCheckEvent("#grid-BP input[name='cb']");
                    }
                });
            }  
            function displayProgram(id){
                var cb = app.bs({name:"cbFilter2",type:"checkbox"});

                $("#grid-P").dataBind({
                     url            : app.execURL + "oem_programs_sel @oem_id=" + id
                    ,height         : $(window).height() - 200
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"program_id" ,type:"hidden"      ,value: svn (d,"program_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            + app.bs({name:"oem_id"                     ,type:"hidden"      ,value: id })
                                            + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); }
                        }
                        ,{text: "Program Code"              ,name : "program_code"              ,type : "input"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Program Coordinator"       ,name : "program_coordinator_id"    ,type : "select"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Engr. Manager"             ,name : "engr_manager_id"           ,type : "select"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Program Manager(s)"                                                                 ,width : 200  ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _progMngrs = (app.svn(d,"program_managers") ? app.svn(d,"program_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalProgramDetails(\"" + 'Program Manager(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + 2 + "\");'>" + _progMngrs + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
                        ,{text: "Car Leader(s)"             ,width : 200     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _carLeaders = (app.svn(d,"car_leaders") ?app.svn(d,"car_leaders") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalProgramDetails(\"" + 'Car Leader(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + 6 + "\");'>" + _carLeaders + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
            
                        ,{text: "Launch Manager(s)"         ,width : 200     ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _launchMngr = (app.svn(d,"launch_managers") ? app.svn(d,"launch_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalProgramDetails(\"" + 'Launch Manager(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + 4 + "\");'>" + _launchMngr + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
            
                        ,{text: "Warehouse Contacts(s)"      ,width : 200     ,style: "text-align:center"
                            ,onRender : function(d){
                                var _warehouseContacts = (app.svn(d,"warehouse_contacts") ? app.svn(d,"warehouse_contacts") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;' href='javascript:oem.showModalProgramDetails(\"" + 'Warehouse Contact(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + 9 + "\");'>" + _warehouseContacts + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }
                        ,{text: "Active?"           ,name : "is_active"             ,type : "yesno"     ,width : 50   ,style : "text-align:left" ,defaultValue: "Y"}
                        ,{text: "Model Year/Build Phase"                            ,type : "input"     ,width : 160  ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='PROGRAM > "+ app.svn (d,"program_code") +"' onclick='oem.showModalParts("+ app.svn (d,"oem_id") +",\""+ app.svn (d,"program_id") +"\",\""+ app.svn (d,"program_code") +"\",\""+ app.svn (d,"program_coordinator_id") +"\")'>   <i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                         }
            
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("[name='cbFilter2']").setCheckEvent("#grid-P input[name='cb']"); 
                        this.find("select[name='program_coordinator_id']").dataBind({
                             sqlCode : "D180" //dd_program_coordinators_sel 
                            ,parameters: {oem_id : id}
                            ,text: "program_coordinator"
                            ,value: "user_id"
                        });
                        this.find("select[name='engr_manager_id']").dataBind({
                             sqlCode : "D179" //dd_engr_managers_sel 
                            ,parameters: {oem_id : id}
                            ,text: "engr_manager"
                            ,value: "engr_manager_id" 
                        });
                        
                    }
                });
            }  
            function displayHarnessFamily(id,harness){
                gOemId = id;
                var cb = app.bs({name:"cbFilter4",type:"checkbox"});
                $("#grid-HF").dataBind({
                     sqlCode        : "H168" //oem_program_parts_sel
                    ,parameters     : {oem_id: id, keyword: harness}
                    ,height         : $(window).height() - 200
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
                        ,{text: "Harness Name"                    ,name:"harness_family"             ,type:"input"       ,width : 400   ,style : "text-align:left"  ,sortColNo : 1}
                        ,{text: "Base"                            ,name:"base"                       ,type:"input"       ,width : 150   ,style : "text-align:left"  ,sortColNo : 2}
                        ,{text: "Active?"                         ,name:"is_active"                  ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"Y"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("input[name='harness_family']").checkValueExists({code : "ref-00031", colName : "harness_family"}); 
                        this.find("[name='cbFilter4']").setCheckEvent("#grid-HF input[name='cb']");
                    }
                });
            }
            function displayProgramParts(oemId,progId,buildPhaseId,modelYearId){
                var cb = app.bs({name:"cbFilter5",type:"checkbox"});
                $("#gridProgParts").dataBind({
                     sqlCode        : "O170" //oem_program_parts_sel
                    ,parameters     : {oem_id:oemId,program_id:progId,bp_id:buildPhaseId,model_year:modelYearId}
                   // ,width          : $(".modal-body").width()
                    ,height         : $(window).height() - 280
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"oem_program_part_id"    ,type:"hidden"          ,value: app.svn(d,"oem_program_part_id")}) 
                                        + app.bs({name:"is_edited"                                  ,type:"hidden"          ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"program_id"                                 ,type:"hidden"          ,value: progId})
                                        + (d !==null ? app.bs({name:"cb"                            ,type:"checkbox"}) : "" ); 
                            }
            
                        }
                        ,{text: "Build Phase"            ,name : "build_phase_id"                   ,type : "select"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Model Year"             ,name : "model_year"                       ,type : "input"       ,width : 150  ,style : "text-align:center"}
                        ,{text: "Harness Family"         ,name : "harness_family_id"                ,type : "select"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Prefix"                 ,name : "prefix"                           ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Base"                   ,name : "base"                             ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Suffix"                 ,name : "suffix"                           ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "OEM Part Number"        ,name : "oem_part_no"                      ,type : "input"       ,width : 200  ,style : "text-align:left"}
                        ,{text: "Plant"                  ,name : "plant_id"                         ,type : "select"      ,width : 200  ,style : "text-align:left"}
                        ,{text: "Warehouse"              ,name : "warehouse_id"                     ,type : "select"      ,width : 200  ,style : "text-align:left"}
                        ,{text: "Customers"                                                                               ,width : 80   ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='CUSTOMER > "+ app.svn (d,"oem_program_part_id") +"' onclick='oem.showModalCustomers("+ app.svn (d,"oem_program_part_id") +",\""+ app.svn (d,"oem_part_no") +"\")'>   <i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                        }
                    ]
                    ,onComplete: function(){
                        var _oemId = 5;
                        var _this = this;
                        var _zRow = _this.find(".zRow");
                        _this.data("oemId",oemId);
                        _this.data("progId",progId);
                        _this.data("buildPhaseId",buildPhaseId);
                        _this.data("modelYearId",modelYearId);
                        _this.find("[name='cbFilter5']").setCheckEvent("#gridProgParts input[name='cb']");
                       
                        _zRow.find("select[name='build_phase_id']").dataBind({
                             sqlCode    : "O148" //oem_build_phases_sel
                            ,parameters : {oem_id : oemId}
                            ,text       : "build_phase_abbrv"
                            ,value      : "oem_build_phase_id"
                        });
                        
                        _zRow.find("select[name='harness_family_id']").dataBind({
                             sqlCode    : "H168" //harness_family_sel
                            ,parameters : {oem_id : oemId}
                            ,text       : "harness_family"
                            ,value      : "hf_id"
                           ,onChange    : function(d){
                                var  _info   = d.data[d.index - 1]
                                    ,_base   = (isUD(_info) ? "" : _info.base)
                                    ,_$zRow  = $(this).closest(".zRow");
                                
                                if (this.val() === "") {
                                    console.log("agi")
                                    _$zRow.find("input[name='base']").val("");
                                }
                                _$zRow.find("input[name='base']").val(_base);
                                _$zRow.find("input[name='prefix'], input[name='suffix']").val("");
                                _$zRow.find("input[name='oem_part_no']").val(_base);
                                
                            }
                        });
                        _zRow.find("#plant_id").dataBind({
                             url         : app.execURL + "plants_sel" //plants_sel
                            ,text        : "plant_name"
                            ,value       : "plant_id"
                        });
                        
                        _zRow.find("#warehouse_id").dataBind({
                             sqlCode     : "W163" //warehouse_sel
                            ,text        : "warehouse_name"
                            ,value       : "warehouse_id"
                        });
                        if(oemId !== _oemId){
                            _zRow.find("input[name='prefix'], input[name='base'], input[name='suffix']").attr('disabled',true);
                        }else{
                            _zRow.find("input[name='prefix'], input[name='base'], input[name='suffix']").attr('disabled',false);
                        }
                        _zRow.find("input[name='oem_part_no']").attr("readonly",true);
                        var _prefix = "";
                        var _base = "";
                        var _suffix = "";
                        var _$row   = "";
                        var _val = []; 
                        _zRow.find("input[name='prefix'], input[name='base'], input[name='suffix']").keyup(function(){
                            var _$zRow      = $(this).closest(".zRow");
                            var _colName    = $(this)[0].name;
                            var _thisValue  = "";
                            if (_colName == "prefix" ) {
                                _thisValue  = _$zRow.find("input[name='prefix']").val();
                                _prefix     = _thisValue;
                                _base       = _$zRow.find("input[name='base']").val();
                                _suffix     = _$zRow.find("input[name='suffix']").val();
                            
                            } else if (_colName == "base" ) {
                                _thisValue  = _$zRow.find("input[name='base']").val();
                                _prefix     = _$zRow.find("input[name='prefix']").val();
                                _base       = _thisValue
                                _suffix     = _$zRow.find("input[name='suffix']").val();
                        
                            }else {
                                _thisValue = _$zRow.find("input[name='suffix']").val();
                                _prefix     = _$zRow.find("input[name='prefix']").val();
                                _base       = _$zRow.find("input[name='base']").val();
                                _suffix     = _thisValue
                            
                                
                            } 
                            OEMPartNumber(_$zRow,_prefix,_base,_suffix);
                        });
                        markProgramPartsMandatory();
                    }
                });
            }
            function displayCustomers(id){
                var cb = app.bs({name:"cbFilter6",type:"checkbox"});
                $("#gridCustomers").dataBind({
                     sqlCode        : "C156" //customer_programs_sel
                    ,parameters     : {oem_program_part_id : id }
                    //,width          : $("#frm_modalCustomers").width() - 20
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"customer_program_id"                   ,type:"hidden"         ,value: app.svn(d,"customer_program_id")})
                                        + (d !==null ? app.bs({name:"cb"                       ,type:"checkbox"}) : "" );
                                    
                                }
                        }
                        ,{text: "Customer Name"                    ,width : 260   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"customer_id"                           ,type:"select"         ,value: app.svn(d,"customer_id")})
                                         + app.bs({name:"is_edited"                             ,type:"hidden"         ,value: app.svn(d,"is_edited") })
                                         + app.bs({name:"oem_program_part_id"                   ,type:"hidden"         ,value: id});
                                         
                                         
                                }
                        }
                        ,{text: "Customer Part Number"                      ,name:"customer_part_no"     ,type:"input"          ,width : 230    ,style : "text-align:left"}
                        ,{text: "Contacts"                                                                                      ,width : 60   ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='CONTACTS > "+ app.svn (d,"customer_id") +"' onclick='oem.showModalCustomerContacts("+ app.svn (d,"customer_id") + ",\""+ app.svn (d,"oem_program_part_id") +"\")'>   <i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                        }
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("[name='cbFilter6']").setCheckEvent("#gridCustomers input[name='cb']");
                         this.find("select[name='customer_id']").dataBind({
                             sqlCode    : "C142" //customers_sel
                            ,text       : "customer_name"
                            ,value      : "customer_id"
                        });
                    }
                    
                });
            }  
            function displayCustomerContacts(id,oemId){
                var cb = app.bs({name:"cbFilter9",type:"checkbox"});
                $("#gridCustomerContacts").dataBind({
                     sqlCode        : "C250" //contact_program_parts_sel
                    ,parameters     : {customer_id : id, oem_program_part_id : oemId }
                    ,height         : 360
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return  app.bs({name:"contact_program_id"                    ,type:"hidden"         ,value: app.svn(d,"contact_program_id")})
                                        + (d !==null ? app.bs({name:"cb"                       ,type:"checkbox"}) : "" );
                                    
                                }
                        }
                        ,{text: "Contact"                    ,width : 260   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"contact_id"                            ,type:"select"         ,value: app.svn(d,"contact_id")})
                                         + app.bs({name:"customer_id"                           ,type:"hidden"         ,value: id})
                                         + app.bs({name:"is_edited"                             ,type:"hidden"         ,value: app.svn(d,"is_edited") })
                                         + app.bs({name:"oem_program_part_id"                   ,type:"hidden"         ,value: oemId});
                                         
                                         
                                }
                        }
                        ,{text: "Main?"                      ,name:"is_main"     ,type:"yesno"          ,width : 55    ,style : "text-align:left"   ,defaultValue:"N"}
                    ]
                    ,onComplete: function(o){
                        this.data("id",id);
                        this.find("select[name='contact_id']").checkValueExists({code : "ref-00033", colName : "contact_id"});
                        this.find("[name='cbFilter9']").setCheckEvent("#gridCustomerContacts input[name='cb']");
                        this.find("select[name='contact_id']").dataBind({
                             sqlCode    : "D252" //dd_customer_contacts_sel
                            ,parameters : {customer_id : id}
                            ,text       : "contact_name"
                            ,value      : "customer_contact_sp_id"
                        });
                        
                    }
                    
                });
            }  
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
                      id        : gMdlCustomerContacts
                    , sizeAttr  : "modal-lg"
                    , title     : "Customer Contacts"
                    , body      : gtw.new().modalBodyCustomerContacts({grid:"gridCustomerContacts",onClickSaveCustomerContacts:"submitCustomerContacts();",deleteDataCustomerContacts:"deleteDataCustomerContacts();"}).html()
                })
                .bsModalBox({
                      id        : gMdlProgramDetail
                    , sizeAttr  : "modal-md"
                    , title     : ""
                    , body      : gtw.new().modalBodyProgramDetails({grid:"gridProgramDetails",onClickSaveProgramDetails:"submitProgramDetails();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlProgramPlants
                    , sizeAttr  : "modal-md"
                    , title     : ""
                    , body      : gtw.new().modalBodyProgramPlants({grid:"gridProgramPlants",onClickSaveProgramPlants:"submitProgramPlants();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlProgramWarehouse
                    , sizeAttr  : "modal-md"
                    , title     : ""
                    , body      : gtw.new().modalBodyProgramWarehouse({grid:"gridProgramWarehouse",onClickSaveProgramWarehouses:"submitProgramWarehouse();"}).html()  
                })
                
                .bsModalBox({
                      id        : gMdlUploadExcel
                    , sizeAttr  : "modal-lg"
                    , title     : ""
                    , body      : gtw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
                });
            }
            function markProgramPartsMandatory(){
                zsi.form.markMandatory({       
                  "groupNames":[
                        {
                             "names" : ["build_phase_id","model_year"]
                            ,"type":"M"
                        }             
                      
                  ]      
                  ,"groupTitles":[ 
                         {"titles" : ["Build Phase","Model Year"]}
                  ]
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
            function setSearch(){
                var _$body = $("#frm_modalOEM");
                var  _harness = "";
                _$body.find("#search_harness").keyup(function(){
                    if($(this).val() === "") displayHarnessFamily(gOemId);
                });
                
                _$body.find("#search_harness").on('keypress',function(e) {
                    _harness = $.trim(_$body.find("#search_harness").val());
                    if(e.which == 13) {
                        zsi.getData({
                             sqlCode : "H168" //oem_program_parts_sel
                            ,parameters: {oem_id: gOemId, keyword: _harness}
                            ,onComplete : function(d) {
                                displayHarnessFamily(gOemId,_harness);
                            }
                        });
        
                    }
                });
                
                _$body.find("#btnSearchHarness").click(function(){ 
                    _harness = $.trim(_$body.find("#search_harness").val());
                    zsi.getData({
                         sqlCode : "H168" //oem_program_parts_sel
                        ,parameters: {oem_id: gOemId, keyword: _harness}
                        ,onComplete : function(d) {
                            displayHarnessFamily(gOemId,_harness);
                        }
                    });
                        
                }); 
                
                _$body.find("#btnResetHarness").click(function(){
                    _$body.find("#search_harness").val("");
                    displayHarnessFamily(gOemId);
                        
                });
            
                
            }
            
            //Buttons
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
            $("#btnSaveInactiveRecords").click(function () {
               $("#gridInactiveRecords").jsonSubmit({
                         procedure      : "oem_upd"
                        ,optionalItems  : ["is_active"]
                        ,notInclude     : "#dummy_oem_id"
                        ,onComplete     : function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayRecords();
                            displayInactiveRecords();
                        }
                });
            });
            $("#btnInactiveRecords").click(function () {
                $(".modal-title").text("Inactive OEM");
                $('#modalInactiveRecords').modal({ show: true, keyboard: false, backdrop: 'static' });
                displayInactiveRecords();
                
            });
            $("#btnDeleteOEM").click(function(){
                zsi.form.deleteData({
                     code       : "ref-00026"
                    ,onComplete : function(data){
                        displayInactiveRecords();
                      }
                });       
            });
    
    return _public;
  
 })();
  

                                                                                                                                                 