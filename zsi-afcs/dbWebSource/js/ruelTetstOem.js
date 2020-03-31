 var oem =  (function(){
        var _public = {};
            var  bs                     = zsi.bs.ctrl
                ,svn                    = zsi.setValIfNull
                ,hashParams             = app.hash.getPageParams(["oem_id","program_id","oem_name"])
                ,gMdlProgParts          = "modalProgramParts"
                ,gMdlCustomers          = "modalCustomers"
                ,gtw                    = null
                ,gMdlProgramDetail      = "modalWindowProgramDetail"
                ,gMdlUploadExcel        = "modalWindowUploadExcel"
                ,gMdlUploadExcelPrograms = "modalWindowUploadExcelPrograms"
                ,gMdlCopyPrograms       = "modalWindowCopyPrograms"
                ,gMdlChangeToProgram    = "modalWindowChangeToProgram"
                ,gOEMId                 = null
                ,gProgId                = null
                ,gProgramId             = null
                ,gPlatformId            = null
                ,gHFSearch              = ""
                ,gOemsName              = ""
                ,gProgramName           = ""
                ,gPlatformName          = ""
                ,gCopyProgData          = []
                ,gOemVal                = ""
                ,gSearchCol             = ""
                ,gSearchProgPartsCol    = ""
                ,gHFData                = []
                ,gActiveTab             = ""
                ,gOEMData               = []
            ;
 
            $.fn.setValueIfChecked = function(){
                var _$zRow = this.closest(".zRow");
                var _userId = _$zRow.find("[name='user_id']");
                var _tempId = _$zRow.find("[name='tempUser_id']").val();
                if(this.prop("checked") === true){
                    _userId.val(_tempId);
                    
                }else{
                    _userId.val("");
                    
                }
            };

            zsi.ready = function(){
                $("#nav-tab").find("[aria-controls='nav-oem']").trigger("click");/*
                $("#nav-tab").css('width',$('.zContainer').width());*/
                $(".page-title").html("OEM");
                gtw = new zsi.easyJsTemplateWriter();
                displayRecords();
                getTemplates();  
                $("#oemId").select2();
                $("#oemId").dataBind({
                    sqlCode: "D259" //  dd_oem_sel
                    ,text: "oem_name"
                    ,value: "oem_id"
                    ,required: true
                    ,onChange : function(){ 
                        gOEMId = this.val();  
                    }
                });
                $("#searchVal").attr("placeholder","Search for OEM...");
                $("#defaultValue").val(gOEMId);
                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    var target = $(e.target).attr("href"); 
                    switch(target){
                        case "#nav-oem":
                            gActiveTab = "OEM";
                            $("#searchVal").val("");
                            $("#searchVal").attr("placeholder","Search for OEM...");  
                            $("#oemDiv").addClass("hide");
                            $("#platformDiv").addClass("hide");
                            $("#dummyDiv").removeClass("hide");
                            break;
                        case "#nav-bp":
                            gActiveTab = "BP"; 
                            $("#searchVal").val("");
                            $("#searchVal").attr("placeholder","Search for Build Phase...");
                            $("#oemDiv").removeClass("hide");
                            $("#dummyDiv").addClass("hide");
                            break;
                        case "#nav-hf":
                            gActiveTab = "hf"; 
                            $("#searchVal").val("");
                            $("#searchVal").attr("placeholder","Search for Harness Family..."); 
                            $("#oemDiv").removeClass("hide");
                            $("#platformDiv").addClass("hide");
                            $("#dummyDiv").addClass("hide"); 
                            break;
                        case "#nav-p":
                            gActiveTab = "p"; 
                            $("#searchVal").val("");
                            $("#searchVal").attr("placeholder","Search for Platform...");
                            $("#oemDiv").removeClass("hide");
                            $("#platformDiv").addClass("hide");
                            $("#dummyDiv").addClass("hide");
                            break;
                        case "#nav-pr": 
                            gActiveTab = "pr";
                            $("#searchVal").val("");
                            $("#searchVal").attr("placeholder","Search for Program...");
                            $("#dummyDiv").addClass("hide");
                            $("#oemDiv").addClass("hide");
                            $("#platformDiv").removeClass("hide");
                            break;
                      default:break; 
                    } 
                }); 
                
                
            };
            //Public funtions
            _public.deleteDataPrograms = function(){
                zsi.form.deleteData({
                     code       : "ref-0004"
                    ,onComplete : function(data){
                        displayPlatform($("#grid-P").data("id"));
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
            _public.uploadExcelFilePrograms = function(){
                var frm      = $("#frm_modalWindowUploadExcelPrograms");
                var formData = new FormData(frm.get(0));
                var files    = frm.find("input[name='file']").get(0).files; 
            
                if(files.length===0){
                    alert("Please select excel file.");
                    return;    
                }
                
                //disable button and file upload.
                //frm.find("input[name='file']").attr("disabled","disabled");
                $("btnUploadFilePrograms").hide();
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
            _public.showModalUploadPrograms = function(o,tabName){
                $.get(app.execURL +  "excel_upload_sel @load_name ='" + tabName +"'"
                ,function(data){
                    g$mdl = $("#" + gMdlUploadExcelPrograms);
                    g$mdl.find(".modal-title").text("Upload Excel for » " + tabName ) ;
                    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                    $("#tmpData").val(data.rows[0].value);
                    
                    $("input[name='file']").val("");
                    
                //    excelFileUpload();
                });
            };    
            _public.showModalParts = function(oemId,progId,progCode,progCoordinatorId) {  
                gProgId = progId;
                g$mdl = $("#" + gMdlProgParts);
                g$mdl.find(".modal-title").html(" <div class='row'>OEM » " + gOemsName + " | Program » " + progCode + "</div>");
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                var _$bpFilter = $("#frm_modalProgramParts").find("select[name='build_phase_filter_id']");
                var _$myFilter =  $("#frm_modalProgramParts").find("select[name='dd_model_year']");
                $.get(app.procURL + "harness_family_sel"
                    , function(d){
                        gHFData = d.rows;
                    }
                );

                _$bpFilter.dataBind({
                     sqlCode    : "D210" //dd_program_bp_sel
                    ,parameters : {program_id : progId}
                    ,text       : "build_phase_abbrv"
                    ,value      : "build_phase_id"
                    ,onChange   : function(){
                        var _buildPhaseId = $(this).val();
                        _$myFilter.dataBind({
                             sqlCode    : "D211" //dd_program_model_year_sel
                            ,parameters : {program_id : progId, bp_id : _buildPhaseId}
                            ,text       : "model_year"
                            ,value      : "model_year_name"
                        });
                    }
                    ,onComplete     : function(){
                        $("option:first-child",this).text("BUILD PHASE");
                        $("option:first-child",this).val("");
                        var _buildPhaseId = $(this).val();
                        
                        _$myFilter.dataBind({
                             sqlCode    : "D211" //dd_program_model_year_sel
                            ,parameters : {program_id : progId, bp_id : _buildPhaseId}
                            ,text       : "model_year"
                            ,value      : "model_year_name"
                            ,onComplete : function(){
                                $("option:first-child",this).text("MODEL YEAR");
                                $("option:first-child",this).val("");
                                displayProgramParts(oemId,progId);
                            }
                        });
                    }
                });
                $("#searchValProgParts").attr("placeholder", "Enter Keyword"); 
                $("#dd_search_prog_parts").fillSelect({
                        data: [
                              { text: "Harness Name", value: "harness_family" }
                             ,{ text: "OEM Part No.", value: "oem_part_no" }
                        ]
                        ,onChange : function(){
                            var _this = this;
                            gSearchProgPartsCol = _this.val();
                            var _searchValPP = $("#searchValProgParts");
                            var _placeHolder = $('#dd_search_prog_parts option[value="'+gSearchProgPartsCol+'"]').text();
                            _searchValPP.attr("placeholder", _placeHolder);
                            if(gSearchProgPartsCol === "") _searchValPP.attr("placeholder", "Enter Keyword"); 
                            _searchValPP.val("");
                        }
                        ,onComplete     : function(){
                            $("option:first-child",this).text("SEARCH FOR");
                            $("option:first-child",this).val("");
                        }
                    });
                
            };
            _public.searchPrograms = function(){ 
                var _buildPhaseId   = $("#frm_modalProgramParts").find("[name='build_phase_filter_id']").val();
                var _modelYearId    = $("#frm_modalProgramParts").find("[name='dd_model_year']").val();
                var _searchVal      = $.trim($("#searchValProgParts").val()); 
                displayProgramParts(gOEMId,gProgId,_buildPhaseId,_modelYearId,gSearchProgPartsCol,_searchVal); 
            };
            _public.showCopyPrograms = function(){
                if(gCopyProgData.length === 0) {
                    alert("No data selected.");
                    return;
                }
                var _$body = $("#frm_modalBodyCopyPrograms").find(".modal-body");
                gOemsName = name;
                g$mdl = $("#" + gMdlCopyPrograms);
                g$mdl.find(".modal-title").text("Copy OEM Programs Parts") ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                g$mdl.find("input[type=text], select").val("");
                g$mdl.find("#build_phase_filter_id").dataBind({
                     sqlCode    : "O148" //oem_build_phases_sel
                    ,parameters : {oem_id : gOEMId}
                    ,text       : "build_phase_abbrv"
                    ,value      : "oem_build_phase_id"
                    ,onChange   : function(d){
                        var _grid = this.closest("#frm_modalWindowCopyPrograms").find("#gridCopyPrograms");
                        var _zRow = _grid.find(".zRow");
                        _zRow.find("[name='build_phase_id']").val(this.val());
                        _zRow.find("[name='is_edited']").val("Y");
                    }
                });
                g$mdl.find("#harness_family_filter_id").dataBind({
                     sqlCode    : "H168" //harness_family_sel
                    ,parameters : {oem_id : gOEMId}
                    ,text       : "harness_family"
                    ,value      : "hf_id"
                   ,onChange    : function(d){
                        var  _info   = d.data[d.index - 1]
                            ,_base   = (isUD(_info) ? "" : _info.base);

                       if (this.val() === "") {
                           g$mdl.find("#base").val("");
                       }
                       g$mdl.find("#base").val(_base);
                       g$mdl.find("#oem_part_no").val(_base);
                       var _grid = this.closest("#frm_modalWindowCopyPrograms").find("#gridCopyPrograms");
                       var _zRow = _grid.find(".zRow");
                       
                       _zRow.find("[name='harness_family_id']").val(this.val());
                       //_zRow.find("[name='oem_part_no']").val(_base);
                       _zRow.find("[name='is_edited']").val("Y");
                       
                       OEMPartNumber(g$mdl,g$mdl.find("[name='prefix']").val(),_base,g$mdl.find("[name='suffix']").val());
                        
                    }
                });
                g$mdl.find("#plant_filter_id").dataBind({
                     sqlCode     : "P144" //plants_sel
                    ,text        : "plant_name"
                    ,value       : "plant_id"
                    ,onChange    : function(d){
                       var _grid = this.closest("#frm_modalWindowCopyPrograms").find("#gridCopyPrograms");
                       var _zRow = _grid.find(".zRow");
                       _zRow.find("[name='plant_id']").val(this.val());
                       _zRow.find("[name='is_edited']").val("Y");
                    }
                });
                g$mdl.find("#warehouse_filter_id").dataBind({
                     sqlCode     : "W163" //warehouse_sel
                    ,text        : "warehouse_name"
                    ,value       : "warehouse_id"
                    ,onChange    : function(d){
                       var _grid = this.closest("#frm_modalWindowCopyPrograms").find("#gridCopyPrograms");
                       var _zRow = _grid.find(".zRow");
                       _zRow.find("[name='warehouse_id']").val(this.val());
                       _zRow.find("[name='is_edited']").val("Y");
                    }
                });
                g$mdl.find("#model_year").keyup(function(){
                        var _grid = $(this).closest("#frm_modalWindowCopyPrograms").find("#gridCopyPrograms");
                        var _zRow = _grid.find(".zRow");
                        _zRow.find("[name='model_year']").val($(this).val());
                        _zRow.find("[name='is_edited']").val("Y");
                 });
                g$mdl.find("[name='prefix'], [name='base'], [name='suffix']").keyup(function(){
                    var _grid = g$mdl.find("#gridCopyPrograms");
                    if (_colName == "prefix" ) {
                        var _prefix = _grid.find(".zRow").find("[name='prefix']");
                        _prefix.val($(this).val());
                        _prefix.trigger("keyup");
                    }
                    else if (_colName == "base" ) {
                        var _base = _grid.find(".zRow").find("[name='base']");
                        _base.val($(this).val());
                        _base.trigger("keyup");
                    }
                    else {
                        var _suffix = _grid.find(".zRow").find("[name='suffix']");
                        _suffix.val($(this).val());
                        _suffix.trigger("keyup");
                    }
                });
                displayCopyProgramParts(gOEMId,gCopyProgData);
            };
            _public.resetSearch = function(){ 
                $("#frm_modalProgramParts").find("[name='build_phase_filter_id']").val("");
                $("#frm_modalProgramParts").find("[name='dd_model_year']").val("");
                $("#dd_search_prog_parts").val(isUD);
                $("#searchValProgParts").val("").attr("placeholder", "Enter Keyword");
                displayProgramParts(gOEMId,gProgId,'','',''); 
                 
            };
            _public.showModalCustomers = function(oemId,oemPartNo) {
                g$mdl = $("#" + gMdlCustomers);
                g$mdl.find(".modal-title").text("OEM Part Number  » " + oemPartNo);
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                displayCustomers(oemId);
            };
            _public.showModalProgramDetails = function(name,oemId,progId, progName) {
                $('#modalDisplayDetails').modal({ show: true, keyboard: false, backdrop: 'static' });
                $('#modalDisplayDetails').find(".modal-title").text("OEM » "+ gOemsName +" | Program » "+ progName) ;
                displayProgramDetails(oemId,progId);
            };
            _public.showModalChangeToProgram = function(o,tabName){
                var _$grid = $("#grid-P")
                    ,_programIds = [];

                $.each(_$grid.find("input[name='cb']:checked"), function(){
                    _programIds.push(_$grid.data("info")[this.value].program_id);
                });
                if(_programIds.length > 0){
                    g$mdl = $("#" + gMdlChangeToProgram);
                    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                    g$mdl.find("input[name='program_ids']").val(_programIds.join(","));
                    g$mdl.find("select[name='platform_id']").dataBind({
                        sqlCode: "D282"
                        ,parameters: {oem_id: gOEMId}
                        ,text: "program_code"
                        ,value: "program_id"
                    });
                    
                }else alert("Please select platform.");
            };
            _public.submitDataPlatform = function(){
                var _$grid = $("#grid-P");
                if( _$grid.checkMandatory()!==true) return false;
                    _$grid.jsonSubmit({
                         procedure: "oem_platforms_upd"
                        ,optionalItems: ["is_platform_only","is_active_platform"]
                        ,notIncludes: ["program_coordinator_id"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayPlatform(gOEMId);
                        }
                    });
            };
            _public.submitDataBuildPhase = function(){
                var _$grid = $("#grid-BP");
                if( _$grid.checkMandatory()!==true) return false;
                    _$grid.jsonSubmit({
                         procedure: "oem_build_phases_upd"
                        ,optionalItems: ["is_active"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayBuildPhase(_$grid.data("id"),_$grid.data("keyword"));
                            //$('#modalOEM').modal('toggle');
                        }
                    });
            }; 
            _public.submitDataHarnessFamily = function(){
                var _$grid = $("#grid-HF");
                if( _$grid.checkMandatory()!==true) return false;
                    _$grid.jsonSubmit({
                         procedure: "harness_family_upd"
                        ,optionalItems: ["is_active"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayHarnessFamily(_$grid.data("id"),"");
                            //_public.showModal(); 
                        }
                    });
            };
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
            _public.submitProgParts = function(){
                if( $("#gridProgParts").checkMandatory()!==true) return false;
                var _$grid = $("#gridProgParts");
                    _$grid.jsonSubmit({
                         procedure: "oem_program_parts_upd"
                        ,optionalItems: ["build_phase_id", "harness_family_id"] 
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            $("#gridProgParts").trigger("refresh");
                        }
                    });
            };
            _public.submitCopyPrograms = function(){
               // if( zsi.form.checkMandatory()!==true) return false;
                var _$grid = $("#gridCopyPrograms");
                    _$grid.jsonSubmit({
                         procedure: "oem_program_parts_upd"
                        ,optionalItems: ["build_phase_id", "harness_family_id"] 
                        ,onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                             $("#gridCopyPrograms").trigger("refresh");
                             $("#gridProgParts").trigger("refresh");
                             $("#" + gMdlCopyPrograms).modal("toggle");
                        }
                    });
            };
            _public.submitChangeToProgram = function(){
               // if( zsi.form.checkMandatory()!==true) return false;
                var _$mdl = $("#" + gMdlChangeToProgram);
                _$mdl.find("form").jsonSubmit({
                     procedure: "oem_platform_to_program_upd"
                    ,isSingleEntry: true
                    ,onComplete: function (data) {
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        _$mdl.modal("hide");
                        displayPlatform(gOEMId);
                    }
                });
            };
            _public.resetCopyPrograms = function(){
                $("#" + gMdlCopyPrograms).find("input[type=text], select").val("");
                displayCopyProgramParts(gOEMId,gCopyProgData);
            };
            _public.cancelCopyPrograms = function(){
                $("#" + gMdlCopyPrograms).modal("toggle");
            };
            _public.cancelChangeToProgram = function(){
                $("#" + gMdlChangeToProgram).modal("toggle");
            };
            
            //Private functions 
            
            function displayRecords(searchVal){ 
                var _$sidebar = $(".page-sidebar").width();
                $("#grid").dataBind({
             	     sqlCode        : "O149" //oem_sel
             	    ,parameters  : {search_val: (searchVal ? searchVal : "")}
            	    ,height         : $(window).height() - 265
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

            	   ]
            	   ,onComplete: function(o){
            	        var _dRows = o.data.rows;
            	        var _this  = this;
            	        var _zRow  = _this.find(".zRow");
            	        _zRow.unbind().click(function(){
            	            var _i      = $(this).index();
            	            var _data   = _dRows[_i];
            	            var _oemId  = _data.oem_id;
            	                gOEMId  = _oemId; 
            	            $("#nav-tab").find("[aria-controls='nav-bp'],[aria-controls='nav-hf'],[aria-controls='nav-p']").show();
                            displayBuildPhase(_oemId,"");
                            displayHarnessFamily(_oemId,"");
                            displayPlatform(_oemId,"");
                            $("#oemId").val(_oemId).trigger('change');
            	            $("#progTab").hide();
            	        });
            	        _this.on('dragstart', function () {
                            return false;
                        });
                      
            	   }
                });    
            }
            function displayBuildPhase(id,keyword){ 
                var cb = app.bs({name:"cbFilter3",type:"checkbox"});
                $("#grid-BP").dataBind({
                     sqlCode        : "O148"//app.execURL + "oem_build_phases_sel @oem_id=" + id +",@keyword='" + keyword + "'"
                    ,height         : $(window).height() - 265 
                    ,parameters     : {oem_id:id, keyword:keyword}
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
                        ,{text: "Build Phase Code"                ,name:"build_phase_abbrv"        ,type:"input"       ,width : 200   ,style : "text-align:left"    ,sortColNo : 1}
                        ,{text: "Build Phase Name"                ,name:"build_phase_name"         ,type:"input"       ,width : 400   ,style : "text-align:left"    ,sortColNo : 2}
                        ,{text: "Active?"                         ,name:"is_active"                ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"Y"}
                    ]
                    ,onComplete: function(o){
                        var _this = this;
                        _this.data("id",id);
                        _this.data("keyword",keyword);
                        _this.find("[name='cbFilter3']").setCheckEvent("#grid-BP input[name='cb']");
                        _this.find("input[name='build_phase_abbrv']").checkValueExists({code : "ref-0005", colName : "build_phase_abbrv"}); 
                        markMandatory(this);
                        _this.on('dragstart', function () {
                            return false;
                        });

                    }
                });
            } 
            function displayHarnessFamily(id,keyword){
               // gOEMId = id;
                var cb = app.bs({name:"cbFilter4",type:"checkbox"});
                var _dataRows = [];
                if(gOEMId !== 5){
                    _dataRows.push(
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)
                                { return   app.bs({name:"hf_id"                  ,type:"hidden"         ,value: app.svn(d,"hf_id")}) 
                                         + app.bs({name:"oem_id"                 ,type:"hidden"         ,value: id })
                                         + app.bs({name:"region_id"              ,type:"hidden"         ,value: app.svn(d,"region_id") })
                                         + app.bs({name:"is_edited"              ,type:"hidden"         ,value: app.svn(d,"is_edited")})
                                         + (d !==null ? app.bs({name:"cb"        ,type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Harness Name"                      ,width : 400   ,style : "text-align:left"  ,sortColNo : 1
                            ,onRender: function(d){
                                return bs({name:"harness_family"    ,type:"input"   ,value:app.svn(d,"harness_family")})
                                    +  bs({name:"base"              ,type:"hidden"   ,value:app.svn(d,"base")});
                            }
                        }
                        ,{text: "Active?"                         ,name:"is_active"                  ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"Y"}
    
                    );
                }else{
                    _dataRows.push(
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
    
                    );
                    
                }
                $("#grid-HF").dataBind({
                     sqlCode        : "H168" //harness_family_sel
                    ,parameters     : {oem_id: id, keyword: keyword}
                    ,height         : $(window).height() - 265
                    ,blankRowsLimit : 5
                    ,dataRows       : _dataRows
                    ,onComplete: function(o){
                        var _this = this;
                        _this.data("id",id);
                        _this.find("input[name='harness_family']").checkValueExists({code : "ref-00031", colName : "harness_family"}); 
                        _this.find("[name='cbFilter4']").setCheckEvent("#grid-HF input[name='cb']");
                        if(gOEMId === 5 ) markMandatory(this);
                        _this.on('dragstart', function () {
                            return false;
                        });

                    }
                });
            }
            function displayPlatform(id,keyword,callback){  
                var cb = app.bs({name:"cbFilter2",type:"checkbox"})
                    ,_ctr = -1; 
                $("#grid-P").dataBind({
                     sqlCode        : "O284" //oem_platforms_sel
                    ,parameters     : {oem_id : id, keyword: keyword}
                    ,height         : $(window).height() - 265
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ 
                                _ctr++;
                                return app.bs({name:"program_id"                ,type:"hidden"      ,value: svn (d,"program_id")})
                                    + app.bs({name:"platform_program_id"        ,type:"hidden"      ,value: svn (d,"platform_program_id")}) 
                                    + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                    + app.bs({name:"oem_id"                     ,type:"hidden"      ,value: id })
                                    + (d !==null ? app.bs({name:"cb",type:"checkbox",value: _ctr }) : "" );
                            }
                        }
                        ,{text: "Platform"                ,width : 250  ,style : "text-align:left"  ,sortColNo : 4
                            ,onRender : function(d){  
                                return app.bs({name:"program_code"              ,type:"input"      ,value: svn(d,"program_code") })
                                     + app.bs({name:"program_coordinator_id"    ,type:"hidden"     ,value: svn(d,"program_coordinator_id") })
                            }
                        } 
                        ,{text: "Engr. Manager"                                 ,width : 250  ,style : "text-align:left" 
                            ,onRender : function(d){  
                                return  app.bs({name:"engr_manager_id"                           ,type:"select"      ,value: svn(d,"engr_manager_id") })
                                    
                            }
                        }
                        ,{text: "Platform Only?"            ,name : "is_platform_only"             ,type : "yesno"     ,width : 85   ,style : "text-align:left" ,defaultValue: "Y"} 
                        ,{text: "Active?"                   ,name : "is_active_platform"           ,type : "yesno"     ,width : 50   ,style : "text-align:left" ,defaultValue: "Y"} 
                    ]
                    ,onComplete: function(o){
                        var _this = this;
                        var _dRows  = o.data.rows;
                        _this.find("[name='engr_manager_id']").on("change",function(){
                            $("option:nth-child(2)", this).attr("selected", true);
                        })
                        _this.data("id",id);
                        _this.data("info",_dRows);
                        _this.find("[name='cbFilter2']").setCheckEvent("#grid-P input[name='cb']");  
                        _this.find("input[name='program_code']").checkValueExists({code : "ref-0004", colName : "program_code"}); 
                        _this.find("select[name='engr_manager_id']").dataBind({
                             sqlCode : "D179" //dd_engr_managers_sel 
                            ,parameters: {oem_id : id}
                            ,text: "engr_manager"
                            ,value: "engr_manager_id" 
                        });
                        
                        _this.find(".zRow").click(function(){
                            var _i              = $(this).index();
            	            var _data           = _dRows[_i];
            	            var _progId         = _data.program_id;
            	            var _navPR          = _this.closest("#nav-tabContent").find("#nav-pr")
                            var _searchProgam   = _navPR.find("select[name='search_program']") 
            	                gProgId         = _progId;  
            	                _searchProgam.val(_progId).trigger('change');
            	               
            	            if(_progId == "") return;
                            $("#nav-tab").find("[aria-controls='nav-pr']").show(); 
                            displayProgram(gOEMId,_progId);
                            $("#btnSearchProgram").attr("disabled",true);
                        });
                        
                        markMandatory(this); 
                        var  _navPR = _this.closest("#nav-tabContent").find("#nav-pr")
                           ,_searchProgam =  _navPR.find("select[name='search_program']")
                        ;  
                        $("#search_program").select2();
                        _searchProgam.dataBind({
                           sqlCode: "D282" //dd_paltforms_sel
                           ,parameters: {oem_id:gOEMId}
                           ,text: "program_code"
                           ,value: "program_id"
                           ,required: true 
                           ,onChange: function(){ 
                                gPlatformId =  this.val(); 
                                $("#btnSearchProgram").removeAttr("disabled",true);
                           }
                        });
                       
                        
                        if(callback) callback();
                        _this.on('dragstart', function () {
                            return false;
                        });
                        
                        
                       /* if(hashParams.oem_id){
                           _this.find(".zRow").click(function(){
                            var _dRows  = o.data.rows;
                            var _progId = $(this).find("[name='program_id']").val()
                            //var _$mldOEM = $(this).closest("#modalOEM");
                            if(_progId == "") return;
                            _$mldOEM.find("[aria-controls='nav-pr']").show();
                        }); 
                        }*/

                    } 
                });
            }
            function displayProgram(id,platformId,keyword){  
                var cb = app.bs({name:"cbFilter2",type:"checkbox"})
                    ,_ctr = -1; 
                $("#grid-PROGRAM").dataBind({
                     sqlCode        : "O159" //oem_programs_sel
                    ,height         : $(window).height() - 265
                    ,width          : $(".panel-container").width()
                    ,parameters     : {oem_id:(id ? id : gOEMId), platform_id: (platformId ? platformId : gPlatformId), keyword: (keyword ? keyword : "")}
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                         {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ 
                                _ctr++;
                                return app.bs({name:"program_id"                ,type:"hidden"      ,value: svn (d,"program_id")})
                                    + app.bs({name:"platform_program_id"        ,type:"hidden"      ,value: platformId}) 
                                    + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                    + app.bs({name:"oem_id"                     ,type:"hidden"      ,value: id })
                                    + (d !==null ? app.bs({name:"cb",type:"checkbox",value: _ctr }) : "" );
                            }
                        }
                        ,{text: "Program"           ,name : "program_code"      ,type : "input"      ,width : 250  ,style : "text-align:left"   ,sortColNo : 1}
                        ,{text: "Program Coordinator"       ,width : 250  ,style : "text-align:left"    ,sortColNo : 2
                            ,onRender : function(d){ 
                                return app.bs({name:"program_coordinator_id"    ,type:"select"      ,value: app.svn(d, "program_coordinator_id") })
                                    + app.bs({name:"engr_manager_id"            ,type:"hidden"      ,value: app.svn(d, "engr_manager_id") });
                            }
                        }
                        ,{text: "Program Manager(s)"                            ,width : 200  ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _progMngrs = (app.svn(d,"program_managers") ? app.svn(d,"program_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;color:#007bff!important;' href='javascript:oem.showModalProgramDetails(\"" + 'Program Manager(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"program_code") + "\");'>" + _progMngrs + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
                        ,{text: "Car Leader(s)"             ,width : 200        ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _carLeaders = (app.svn(d,"car_leaders") ?app.svn(d,"car_leaders") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;color:#007bff!important;' href='javascript:oem.showModalProgramDetails(\"" + 'Car Leader(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"program_code") + "\");'>" + _carLeaders + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
                        ,{text: "Launch Manager(s)"         ,width : 200        ,style: "text-align:center"
                            ,onRender : function(d){ 
                                var _launchMngr = (app.svn(d,"launch_managers") ? app.svn(d,"launch_managers") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;color:#007bff!important;' href='javascript:oem.showModalProgramDetails(\"" + 'Launch Manager(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"program_code") + "\");'>" + _launchMngr + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }  
                        ,{text: "Warehouse Contacts(s)"      ,width : 200       ,style: "text-align:center"
                            ,onRender : function(d){
                                var _warehouseContacts = (app.svn(d,"warehouse_contacts") ? app.svn(d,"warehouse_contacts") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                                var _return =  "<a style='text-decoration:underline !important;color:#007bff!important;' href='javascript:oem.showModalProgramDetails(\"" + 'Warehouse Contact(s)' + "\",\"" + app.svn(d,"oem_id") + "\",\"" + app.svn(d,"program_id") + "\",\"" + app.svn(d,"program_code") + "\");'>" + _warehouseContacts + "</a>";
                                return (d !==null ? _return : "");
                            }
                         }
                        ,{text: "Active?"           ,name : "is_active"         ,type : "yesno"     ,width : 50   ,style : "text-align:left" ,defaultValue: "Y"}
                        ,{text: "Model Year/Build Phase"                        ,type : "input"     ,width : 160  ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link =  "<a href='javascript:void(0)' title='PROGRAM > "+ app.svn (d,"program_code") +"' onclick='oem.showModalParts("+ app.svn (d,"oem_id") +",\""+ app.svn (d,"program_id") +"\",\""+ app.svn (d,"program_code") +"\",\""+ app.svn (d,"program_coordinator_id") +"\")'><i class='fas fa-link link' style='color:#007bff!important;'></i></a>";
                                        return (d !== null ? _link : "");
                                }
                         }
            
                    ]
                    ,onComplete: function(o){
                        var _this = this;
                        _this.data("id",id);
                        _this.data("platformId",platformId);
                        _this.find("[name='cbFilter2']").setCheckEvent("#grid-PROGRAM input[name='cb']"); 
                        _this.find("input[name='program_code']").checkValueExists({code : "ref-0004", colName : "program_code"}); 
                        _this.find("select[name='program_coordinator_id']").dataBind({
                             sqlCode : "D180" //dd_program_coordinators_sel 
                            ,parameters: {oem_id : gOEMId}
                            ,text: "program_coordinator"
                            ,value: "user_id"
                        });
                        markMandatory(this);
                        _this.on('dragstart', function () {
                            return false;
                        });
                         
                    }
                });
            }  
            function displayProgramParts(oemId,progId,buildPhaseId,modelYearId,searchCol,searchVal){
                var cb = app.bs({name:"cbFilter5",type:"checkbox"})
                var _searchCol = (searchCol !== "" ? searchCol : "");
                var _searchVal = (searchVal !== "" ? searchVal : "");
                _dataRows = [];
                _dataRows.push(
                     {text: cb  ,width : 25   ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                            return app.bs({name:"oem_program_part_id"                           ,type:"hidden"          ,value: app.svn(d,"oem_program_part_id")})  
                                    +  app.bs({name:"is_edited"                                 ,type:"hidden"          ,value: "Y"})
                                    + app.bs({name:"program_id"                                 ,type:"hidden"          ,value: progId})
                                    + (d !==null ? app.bs({name:"cb"                            ,type:"checkbox"}) : "" ); 
                        }
        
                    }
                    ,{text: "Build Phase"            ,name : "build_phase_id"                   ,type : "select"      ,width : 250  ,style : "text-align:left"}
                    ,{text: "Model Year"             ,name : "model_year"                       ,type : "input"       ,width : 150  ,style : "text-align:center"}
                );
                    
                if(oemId === 5){
                    _dataRows.push(
                         {text: "Harness Family"         ,name : "harness_family_id"                ,type : "select"      ,width : 250  ,style : "text-align:left"}
                        ,{text: "Prefix"                 ,name : "prefix"                           ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Base"                   ,name : "base"                             ,type : "input"       ,width : 160  ,style : "text-align:left" }
                        ,{text: "Suffix"                 ,name : "suffix"                           ,type : "input"       ,width : 160  ,style : "text-align:left" }                    
                    );
                } else {
                    _dataRows.push(
                         {text: "Harness Family"                                                    ,width : 250  ,style : "text-align:left"
                            ,onRender : function(d){
                                return      app.bs({name:"harness_family_id"    ,type:"select"      ,value: svn (d,"harness_family_id")}) 
                                        +   app.bs({name:"prefix"               ,type:"hidden"      ,value: svn (d,"prefix")}) 
                                        +   app.bs({name:"base"                 ,type:"hidden"      ,value: svn (d,"base")}) 
                                        +   app.bs({name:"suffix"               ,type:"hidden"      ,value: svn (d,"suffix")}); 
                            }
                        }
                    );
                }
                _dataRows.push(
                     {text: "OEM Part Number"                      ,type : "input"       ,width : 200  ,style : "text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"oem_part_no"  ,value:app.svn(d,"oem_part_no")})
                         }
                     }
                    ,{text: "Plant"                  ,name : "plant_id"                         ,type : "select"      ,width : 200  ,style : "text-align:left"}
                    ,{text: "Warehouse"              ,name : "warehouse_id"                     ,type : "select"      ,width : 200  ,style : "text-align:left"}
                    ,{text: "Customers"                                                                               ,width : 80   ,style : "text-align:center"
                        ,onRender : function(d){
                                var _link =  "<a href='javascript:void(0)' title='CUSTOMER > "+ app.svn (d,"oem_program_part_id") +"' onclick='oem.showModalCustomers("+ app.svn (d,"oem_program_part_id") +",\""+ app.svn (d,"oem_part_no") +"\")'>   <i class='fas fa-link link' style='color:#007bff!important;'></i></a>";
                                return (d !== null ? _link : "");
                            }
                    }
                
                )                    
                $("#gridProgParts").dataBind({
                     sqlCode        : "O170" //oem_program_parts_sel
                    ,parameters     : {oem_id:oemId,program_id:progId,bp_id:buildPhaseId,model_year:modelYearId,search_col:_searchCol,search_val:_searchVal}
                    ,height         : $(window).height() - 250
                    ,blankRowsLimit : 5
                    ,dataRows       : _dataRows
                    ,onComplete: function(o){
                        var _this = this;
                        var _zRow = _this.find(".zRow");
                        var _harnessFam = _zRow.find("select[name='harness_family_id']");
                        var _hfData = {};
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
                        _harnessFam.dataBind({
                             sqlCode    : "H168" //harness_family_sel
                            ,parameters : {oem_id : oemId}
                            ,text       : "harness_family"
                            ,value      : "hf_id"
                           ,onChange    : function(d){
                                var  _info   = d.data[d.index - 1]
                                    ,_base   = (isUD(_info) ? "" : _info.base)
                                    ,_$zRow  = $(this).closest(".zRow");
                                if (this.val() === "") _$zRow.find("input[name='base']").val("");
                                _$zRow.find("input[name='base']").val(_base);
                    
                                if (oemId === 5) OEMPartNumber(_$zRow,_$zRow.find("input[name='prefix']").val(),_base,_$zRow.find("input[name='suffix']").val());
                                
                            }
                        });
                
                        if(oemId === 5){
                            
                            _zRow.find("[name='base']").keyup(function(){
                                $(this).addClass("baseVal");
                            });
                            
                            new zsi.search({
                                 tableCode: "ref-00031" //harness_family
                                ,colNames : ["base","hf_id"]
                                ,displayNames : ["Base"]  
                                ,searchColumn :"base"
                                ,input:"input[name='base']"
                                ,url : app.execURL + "searchData "
                                ,onSelectedItem: function(currentObject,data,i){ 
                                    if(isUD(data)) {
                                        return;  
                                    }
                                    
                                    currentObject.value = data.base;
                                    //$(currentObject).closest(".zRow").find("[name='base']").val(data.base);
                                    var _hfId = $(currentObject).closest(".zRow").find("select[name='harness_family_id']");
                                    
                                    OEMPartNumber($(currentObject).closest(".zRow"),"",data.base,"");
                                    _hfId.attr("selectedvalue",data.hf_id);
                                    _hfId.dataBind({
                                        sqlCode         : "H168" //harness_family_sel
                                       ,parameters      : {oem_id : oemId}
                                       ,text            : "harness_family"
                                       ,value           : "hf_id"
                                       ,seletedValue    : data.hf_id
                                    });
                                }
                            });  
                            
                            _zRow.find("input,select").not("[name='base']").unbind().click(function(){
                                var _zRow = $(this).closest(".zRow");
                                var _base = _zRow.find("[name='base']");
                                var _$grep = $.grep(gHFData, function(v,i) {
                                                return v.base === _base.val();
                                            });
                                
                                if(_zRow.find(".baseVal").length === 0) return;
                                            
                                if(_$grep.length == 0) {
                                    alert("Base not found...")
                                    _base.removeClass("baseVal");
                                    _base.val("");
                                    _zRow.find("select[name='harness_family_id']").val("");
                                    _zRow.find("[name='oem_part_no']").val("");
                                }
                            });
                        }
                        var _currYear = new Date().getFullYear();
                        _this.find("[name='model_year']").on("change",function(){
                            var _$this = $(this);
                            var _$zRow = _$this.closest(".zRow");
                            var _i = _$zRow.index();
                            var _info = o.data.rows;
                            if(_$this.val() < (_currYear - 7) || _$this.val() > (_currYear + 7)){ 
                                alert("Invalid Year! Year must not be less/more than 7 years on current year.");
                                _$this.closest(".zRow").find("[name='model_year']").val(_info[_i].model_year);
                            }
                        });
                        _zRow.find("select[name='plant_id']").dataBind({
                             url         : app.execURL + "plants_sel" //plants_sel
                            ,text        : "plant_name"
                            ,value       : "plant_id"
                        });
                        _zRow.find("select[name='warehouse_id']").dataBind({
                             sqlCode     : "W163" //warehouse_sel
                            ,text        : "warehouse_name"
                            ,value       : "warehouse_id"
                        });
                        _zRow.find("[name='prefix'], [name='base'], [name='suffix']").keyup(function(){
                            var _$zRow      = $(this).closest(".zRow");
                            var _colName    = $(this)[0].name;
                            var _thisValue  = "";
                            if (_colName == "prefix" ) {
                                _thisValue  = _$zRow.find("[name='prefix']").val();
                                _prefix     = _thisValue;
                                _base       = _$zRow.find("[name='base']").val();
                                _suffix     = _$zRow.find("[name='suffix']").val();
                            
                            } else if (_colName == "base" ) {
                                _thisValue  = _$zRow.find("[name='base']").val();
                                _prefix     = _$zRow.find("[name='prefix']").val();
                                _base       = _thisValue
                                _suffix     = _$zRow.find("[name='suffix']").val();
                            }else {
                                _thisValue  = _$zRow.find("[name='suffix']").val();
                                _prefix     = _$zRow.find("[name='prefix']").val();
                                _base       = _$zRow.find("[name='base']").val();
                                _suffix     = _thisValue
                            
                                
                            } 
                            OEMPartNumber(_$zRow,_prefix,_base,_suffix);
                        });
                        _zRow.find("[name='cb']").on('change', function() {
                            gCopyProgData = [];
                            _zRow.find("[name='cb']").each(function() {
                                if (this.checked) {
                                    var _i = $(this).closest(".zRow").index();
                                    var _data = o.data.rows[_i];
                                    gCopyProgData.push(_data);

                                }
                            });
                        });
                        markMandatory(_this);
                        
                        _this.on('dragstart', function () {
                            return false;
                        });
                        _this.find('[name="prefix"],[name="base"],[name="suffix"]').on("keyup change",function(){
                            var _$self = $(this);
                                _$self.val(_$self.val().toUpperCase());
                        });
                    }
                    
                });
            }
            function displayCopyProgramParts(oemId,data){
                var cb = app.bs({name:"cbFilter5",type:"checkbox"});
                $("#gridCopyPrograms").dataBind({
                     rows           : data
                    ,height         : $(window).height() - 450
                    ,dataRows       : [
                        {text: "Build Phase"             ,name : "build_phase_id"                   ,width : 250        ,style : "text-align:left"
                            ,onRender  :  function(d){ 
                                return app.bs({name:"oem_program_part_id"                           ,type:"hidden"      ,value: ""}) 
                                        + app.bs({name:"is_edited"                                  ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"program_id"                                 ,type:"hidden"      ,value: app.svn(d,"program_id")})
                                        + app.bs({name:"build_phase_id"                             ,type:"select"      ,value: app.svn(d,"build_phase_id")})
                            }
                        }
                        ,{text: "Model Year"             ,name : "model_year"                       ,type : "input"      ,width : 150  ,style : "text-align:center"}
                        ,{text: "Harness Family"         ,name : "harness_family_id"                ,type : "select"     ,width : 250  ,style : "text-align:left"}
                        ,{text: "Prefix"                 ,name : "prefix"                           ,type : "input"      ,width : 160  ,style : "text-align:left" }
                        ,{text: "Base"                   ,name : "base"                             ,type : "input"      ,width : 160  ,style : "text-align:left" }
                        ,{text: "Suffix"                 ,name : "suffix"                           ,type : "input"      ,width : 160  ,style : "text-align:left" }
                        ,{text: "OEM Part Number"        ,name : "oem_part_no"                      ,type : "input"      ,width : 200  ,style : "text-align:left"}
                        ,{text: "Plant"                  ,name : "plant_id"                         ,type : "select"     ,width : 200  ,style : "text-align:left"}
                        ,{text: "Warehouse"              ,name : "warehouse_id"                     ,type : "select"     ,width : 200  ,style : "text-align:left"}
                    ]
                    ,onComplete: function(o){
                        var _oemId = 5;
                        var _this = this;
                        var _zRow = _this.find(".zRow");
                        var _hfData = {};
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
                                    _$zRow.find("input[name='base']").val("");
                                }
                                _$zRow.find("input[name='base']").val(_base);
                                _$zRow.find("input[name='oem_part_no']").val(_base);
                                
                            }
                        });
                        if(oemId === 5){
                            
                            _zRow.find("[name='base']").keyup(function(){
                                $(this).addClass("baseVal");
                            });
                            
                            new zsi.search({
                                 tableCode: "ref-00031" //harness_family
                                ,colNames : ["base","hf_id"]
                                ,displayNames : ["Base"]  
                                ,searchColumn :"base"
                                ,input:"input[name='base']"
                                ,url : app.execURL + "searchData "
                                ,onSelectedItem: function(currentObject,data,i){ 
                                    if(isUD(data)) {
                                        return;  
                                    }
                                    
                                    currentObject.value = data.base;
                                    //$(currentObject).closest(".zRow").find("[name='base']").val(data.base);
                                    var _hfId = $(currentObject).closest(".zRow").find("select[name='harness_family_id']");
                                    
                                    OEMPartNumber($(currentObject).closest(".zRow"),"",data.base,"");
                                    _hfId.attr("selectedvalue",data.hf_id);
                                    _hfId.dataBind({
                                        sqlCode         : "H168" //harness_family_sel
                                       ,parameters      : {oem_id : oemId}
                                       ,text            : "harness_family"
                                       ,value           : "hf_id"
                                       ,seletedValue    : data.hf_id
                                    });
                                }
                            });  
                            
                            _zRow.find("input,select").not("[name='base']").unbind().click(function(){
                                var _zRow = $(this).closest(".zRow");
                                var _base = _zRow.find("[name='base']");
                                var _$grep = $.grep(gHFData, function(v,i) {
                                                return v.base === _base.val();
                                            });
                                
                                if(_zRow.find(".baseVal").length === 0) return;
                                            
                                if(_$grep.length == 0) {
                                    alert("Base not found...")
                                    _base.removeClass("baseVal");
                                    _base.val("");
                                    _zRow.find("select[name='harness_family_id']").val("");
                                    _zRow.find("[name='oem_part_no']").val("");
                                }
                            });
                        }

                        _zRow.find("select[name='plant_id']").dataBind({
                             url         : app.execURL + "plants_sel" //plants_sel
                            ,text        : "plant_name"
                            ,value       : "plant_id"
                        });
                        _zRow.find("select[name='warehouse_id']").dataBind({
                             sqlCode     : "W163" //warehouse_sel
                            ,text        : "warehouse_name"
                            ,value       : "warehouse_id"
                        });
                        if(oemId !== _oemId){
                            _zRow.find("[name='prefix'], [name='base'], [name='suffix']").attr('disabled',true);
                        }else{
                            _zRow.find("[name='prefix'], [name='base'], [name='suffix']").attr('disabled',false);
                        }
                        
                        _zRow.find("[name='prefix'], [name='base'], [name='suffix']").keyup(function(){
                            var _$zRow      = $(this).closest(".zRow");
                            var _colName    = $(this)[0].name;
                            var _thisValue  = "";
                            if (_colName == "prefix" ) {
                                _thisValue  = _$zRow.find("[name='prefix']").val();
                                _prefix     = _thisValue;
                                _base       = _$zRow.find("[name='base']").val();
                                _suffix     = _$zRow.find("[name='suffix']").val();
                            
                            } else if (_colName == "base" ) {
                                _thisValue  = _$zRow.find("[name='base']").val();
                                _prefix     = _$zRow.find("[name='prefix']").val();
                                _base       = _thisValue
                                _suffix     = _$zRow.find("[name='suffix']").val();
                        
                            }else {
                                _thisValue = _$zRow.find("[name='suffix']").val();
                                _prefix     = _$zRow.find("[name='prefix']").val();
                                _base       = _$zRow.find("[name='base']").val();
                                _suffix     = _thisValue
                            
                                
                            } 
                            OEMPartNumber(_$zRow,_prefix,_base,_suffix);
                        });
                        _zRow.find("[name='cb']").on('change', function() {
                            $(this).each(function() {
                                if (this.checked) {
                                    var _i = $(this).closest(".zRow").index();
                                    var _data = o.data.rows[_i];
                                    gCopyProgData.push(_data);
                                }else {
                                    var _i = $(this).closest(".zRow").index();
                                    gCopyProgData.splice(_i,1);
                                }
                            });
                        });
                    }                });
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
                        ,{text: "Customer Part Number"            ,name:"customer_part_no"                   ,type:"input"       ,width : 230    ,style : "text-align:left"}
                    ]
                    ,onComplete: function(o){
                        var _this = this;
                        _this.data("id",id);
                        _this.find("[name='cbFilter6']").setCheckEvent("#gridCustomers input[name='cb']");
                        _this.find("select[name='customer_id']").dataBind({
                             sqlCode    : "C142" //customers_sel
                            ,text       : "customer_name"
                            ,value      : "customer_id"
                            
                        })
                        var _zRow = this.find(".zRow");
                        _zRow.find("[name='customer_part_no']").keyup(function(){
                           $(this).val($(this).val().toUpperCase());
                        });
                        _this.on('dragstart', function () {
                            return false;
                        });
                    }
                    
                });
            }  
            function displayProgramDetails(oemId,progId){
                var  cb          = app.bs({name:"cbFilterProg",type:"checkbox"})
                    ,_cbChecked  = true;
                $("#gridProgramManagers").dataBind({
                         sqlCode     : "D216" //dd_program_users_sel
                        ,parameters  : {oem_id: oemId, oem_program_id: progId, role_id: 2}
                        ,height      : 360
                        ,dataRows    : [
                                    {text: ""  ,width : 25   ,style : "text-align:left"
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
                                    ,{text: "Program Managers"        ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                            ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterProg']");
                            var _progForm = $("#frm_modalProgramParts");
                            _cbFilter.setCheckEvent("#gridProgramDetails input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            
                            
                            if(_progForm.find("[name='build_phase_filter_id']").val() === " " || _progForm.find("[name='dd_model_year']").val() === ""){
                                
                            }
                            this.find('input[type="checkbox"]').click(function(){
                                

                               $(this).setValueIfChecked();
                            });
                    
                        }
                });
                
                $("#gridCarLeaders").dataBind({
                         sqlCode     : "D216" //dd_program_users_sel
                        ,parameters  : {oem_id: oemId, oem_program_id: progId, role_id: 6}
                        ,height      : 360
                        ,dataRows    : [
                                    {text: ""  ,width : 25   ,style : "text-align:left"
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
                                    ,{text: "Car Leaders"             ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                            ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterProg']");
                            var _progForm = $("#frm_modalProgramParts");
                            _cbFilter.setCheckEvent("#gridProgramDetails input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            
                            
                            if(_progForm.find("[name='build_phase_filter_id']").val() === " " || _progForm.find("[name='dd_model_year']").val() === ""){
                                
                            }
                            this.find('input[type="checkbox"]').click(function(){
                                

                               $(this).setValueIfChecked();
                            });
                    
                        }
                });
                
                $("#gridLaunchManagers").dataBind({
                         sqlCode     : "D216" //dd_program_users_sel
                        ,parameters  : {oem_id: oemId, oem_program_id: progId, role_id: 4}
                        ,height      : 360
                        ,dataRows    : [
                                    {text: ""  ,width : 25   ,style : "text-align:left"
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
                                    ,{text: "Launch Managers"         ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                            ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterProg']");
                            var _progForm = $("#frm_modalProgramParts");
                            _cbFilter.setCheckEvent("#gridProgramDetails input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            
                            
                            if(_progForm.find("[name='build_phase_filter_id']").val() === " " || _progForm.find("[name='dd_model_year']").val() === ""){
                                
                            }
                            this.find('input[type="checkbox"]').click(function(){
                                

                               $(this).setValueIfChecked();
                            });
                    
                        }
                });
                
                $("#gridWarehouseContacts").dataBind({
                         sqlCode     : "D216" //dd_program_users_sel
                        ,parameters  : {oem_id: oemId, oem_program_id: progId, role_id: 9}
                        ,height      : 360
                        ,dataRows    : [
                                    {text: ""  ,width : 25   ,style : "text-align:left"
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
                                    ,{text: "Warehouse Contacts"      ,name : "program_user"     ,type : "input"     ,width : 300  ,style : "text-align:left"}
                            ]
                        ,onComplete  : function(d){
                            var _cbFilter = this.find("[name='cbFilterProg']");
                            var _progForm = $("#frm_modalProgramParts");
                            _cbFilter.setCheckEvent("#gridProgramDetails input[name='cb']");
                            
                            if(_cbChecked){
                                _cbFilter.attr("checked", true);
                            }
                            
                            
                            if(_progForm.find("[name='build_phase_filter_id']").val() === " " || _progForm.find("[name='dd_model_year']").val() === ""){
                                
                            }
                            this.find('input[type="checkbox"]').click(function(){
                                

                               $(this).setValueIfChecked();
                            });
                    
                        }
                });
             
            } 
            
            //display inactive for BP, Harness Family, Platform, Program
            function displayInactive(tabName){
                var cb          = app.bs({name:"cbFilter1",type:"checkbox"});
                var _dataRows   = [];
                var _grid       = "";
                var _sqlCode    = ""
                    _params     = {is_active: "N",oem_id:gOEMId};
                if(tabName === "OEM"){
                    _grid       = "gridInactiveRecords";
                    _sqlCode    = "O149" //oem_sel
                    _dataRows.push(
                        { text : cb , width : 25   , style : "text-align:left;" 
                            ,onRender  :  function(d){ 
                                return app.bs({name:"oem_id"                    ,type:"hidden"      ,value: svn (d,"oem_id")})
                                    + (d !==null ? app.bs({name:"cb"            ,type:"checkbox"}) : "" ); }
                        }
                        ,{text : "OEM Id"                                                          ,width : 50       , style : "text-align:left;"
        		            ,onRender  :  function(d){ 
                                return app.bs({name:"dummy_oem_id"              ,type:"hidden"      ,value: svn (d,"oem_id")}) 
                                     + app.bs({name:"is_edited"                 ,type:"hidden"     ,value: svn (d,"is_edited")})
                                     + app.svn (d,"oem_id"); }
        		        }
        		        ,{text : "OEM Name"            , name : "oem_name"      ,type : "input"    ,width : 200       , style : "text-align:left;"
        		            ,onRender  :  function(d){ 
                                return app.bs({name:"oem_name"              ,type:"hidden"      ,value: svn (d,"oem_name")}) 
                                     + app.bs({name:"is_edited"                 ,type:"hidden"     ,value: svn (d,"is_edited")})
                                     + svn (d,"oem_name");
                            }
        		        }
        		        ,{text : "OEM Shortname"       , name : "oem_sname"     ,type : "input"    ,width : 200       , style : "text-align:left;"
        		            ,onRender  :  function(d){ 
                                return app.bs({name:"oem_sname"                 ,type:"hidden"      ,value: svn (d,"oem_sname")})
        		                    + app.bs({name:"img_filename"               ,type:"hidden"      ,value: svn (d,"img_filename")})
        		                    + svn (d,"oem_sname"); 
        		            }
        		        }
        		        ,{text : "Active?"             , name : "is_active"     ,type : "yesno"    ,width : 50        , style : "text-align:center;"          ,defaultValue:"N"}
                        
                    );
                }    
                else if(tabName === "Build Phase"){
                    _grid       = "gridInactiveBP";
                    _sqlCode    = "O148" //oem_build_phases_sel
                    _dataRows.push(
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"oem_build_phase_id"    ,type:"hidden"  ,value: app.svn(d,"oem_build_phase_id")})
                                         + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                         + app.bs({name:"oem_id"                ,type:"hidden"  ,value: gOEMId })
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Build Phase Code"                       ,width : 400   ,style : "text-align:left" 
                            ,onRender  :  function(d)
                                { return   app.bs({name:"build_phase_abbrv"     ,type:"hidden"        ,value: app.svn(d,"build_phase_abbrv")}) 
                                         + app.bs({name:"build_phase_name"      ,type:"hidden"        ,value: app.svn(d,"build_phase_name") })
                                         + app.svn(d,"build_phase_abbrv");
                                }
                        } 
                        ,{text: "Active?"        ,name:"is_active"              ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"N"});
                }
                else if(tabName === "Harness Family"){
                    _grid       = "gridInactiveHarness";
                    _sqlCode    = "H168" //harness_family_sel
                    _dataRows.push(
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)
                                { return   app.bs({name:"hf_id"                 ,type:"hidden"        ,value: app.svn(d,"hf_id")}) 
                                         + app.bs({name:"oem_id"                ,type:"hidden"        ,value: gOEMId })
                                         + app.bs({name:"region_id"             ,type:"hidden"        ,value: app.svn(d,"region_id") })
                                         + app.bs({name:"is_edited"             ,type:"hidden"        ,value: app.svn(d,"is_edited")})
                                         + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Harness Name"                       ,width : 400   ,style : "text-align:left" 
                            ,onRender  :  function(d)
                                { return   app.bs({name:"harness_family"        ,type:"hidden"        ,value: app.svn(d,"harness_family")}) 
                                         + app.bs({name:"base"                  ,type:"hidden"        ,value: app.svn(d,"base") })
                                         + app.svn(d,"harness_family");
                                }
                        } 
                        ,{text: "Active?"                         ,name:"is_active"                  ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"N"}
                    );
                }
                else if(tabName === "Platform"){
                    _grid       = "gridInactivePlatform";
                    _sqlCode    = "O284" //oem_platforms_sel
                    _dataRows.push(
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d){ 
                                
                                return app.bs({name:"program_id"                ,type:"hidden"      ,value: app.svn (d,"program_id")}) 
                                     + app.bs({name:"platform_program_id"        ,type:"hidden"      ,value: svn (d,"platform_program_id")}) 
                                     + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                     + app.bs({name:"oem_id"                    ,type:"hidden"      ,value: gOEMId })
                                     + (d !==null ? app.bs({name:"cb"           ,type:"checkbox"}) : "" );
                            }
                        }
                        ,{text: "Platform"                ,width : 250  ,style : "text-align:left"  
                            ,onRender : function(d){  
                                return app.bs({name:"program_code"              ,type:"hidden"      ,value: app.svn(d,"program_code") })
                                     + app.bs({name:"program_coordinator_id"    ,type:"hidden"      ,value: app.svn(d,"program_coordinator_id") })
                                     + app.bs({name:"engr_manager_id"           ,type:"hidden"      ,value: app.svn(d,"engr_manager_id") })
                                     + app.svn(d,"program_code");
                            }
                        }  
                        ,{text: "Platform Only?"            ,name : "is_platform_only"             ,type : "yesno"     ,width : 85   ,style : "text-align:left" ,defaultValue: "Y"} 
                        ,{text: "Active?"                   ,name : "is_active_platform"           ,type : "yesno"     ,width : 50   ,style : "text-align:left" ,defaultValue: "Y"} 
                    
                    );                
                }
                else{
                    _grid       = "gridInactiveProgram";
                    _sqlCode    = "O159"; //oem_programs_sel
                    _params.platform_id = gPlatformId;
                    _dataRows.push(
                        {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"program_id"                ,type:"hidden"  ,value: app.svn(d,"program_id")})
                                         + app.bs({name:"platform_program_id"       ,type:"hidden"  ,value: app.svn(d,"platform_program_id")})
                                         + app.bs({name:"is_edited"                 ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                         + app.bs({name:"oem_id"                    ,type:"hidden"  ,value: gOEMId })
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }
                        }
                        ,{text: "Program"                       ,width : 400        ,style : "text-align:left" 
                            ,onRender  :  function(d)
                                { return   app.bs({name:"program_code"              ,type:"hidden"  ,value: app.svn(d,"program_code")}) 
                                         + app.bs({name:"program_coordinator_id"    ,type:"hidden"  ,value: app.svn(d,"program_coordinator_id") })
                                         + app.bs({name:"engr_manager_id"           ,type:"hidden"  ,value: app.svn(d,"engr_manager_id") })
                                         + app.svn(d,"program_code");   
                                }
                        } 
                        ,{text: "Active?"        ,name:"is_active"                  ,type:"yesno"   ,width : 50    ,style : "text-align:center;"  ,defaultValue:"N"}
                    );
                }
                $("#" + _grid).dataBind({
             	     sqlCode        : _sqlCode
             	    ,parameters     : _params
            	    ,height         : 300
                    ,dataRows       : _dataRows
                    ,onComplete: function(){
                        this.find("[name='cbFilter1']").setCheckEvent("#" + _grid + " input[name='cb']");
                        this.data("tabName",tabName);
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
                      id        : gMdlProgramDetail
                    , sizeAttr  : "modal-full"
                    , title     : ""
                    , body      : gtw.new().modalBodyProgramDetails({grid:"gridProgramDetails",onClickSaveProgramDetails:"submitProgramDetails();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlUploadExcel
                    , sizeAttr  : "modal-lg"
                    , title     : ""
                    , body      : gtw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlUploadExcelPrograms
                    , sizeAttr  : "modal-lg"
                    , title     : ""
                    , body      : gtw.new().modalBodyUploadExcelPrograms({onClickUploadExcelPrograms:"uploadExcelFilePrograms();"}).html()  
                })
                .bsModalBox({
                      id        : gMdlCopyPrograms
                    , sizeAttr  : "modal-full"
                    , title     : "Copy OEM Program Parts"
                    , body      : gtw.new().modalBodyCopyPrograms({grid:"gridCopyPrograms",onClickSaveCopyPrograms:"submitCopyPrograms();",onClickCancelCopyPrograms:"cancelCopyPrograms();",onClickResetCopyPrograms:"resetCopyPrograms();"}).html()
                })
                .bsModalBox({
                      id        : gMdlChangeToProgram
                    , sizeAttr  : "modal-md"
                    , title     : "Change Platform to Program"
                    , body      : gtw.new().modalBodyChangeToProgram({grid:"gridChangeToProgram",onClickSaveChangeToProgram:"submitChangeToProgram();",onClickCancelChangeToProgram:"cancelChangeToProgram();"}).html()
                });
            }
            function delay(callback, ms) {
              var timer = 0;
              return function() {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                  callback.apply(context, args);
                }, ms || 0);
              };
            }   
            function markMandatory(grid){
                if(grid[0].id === "grid-P"){
                    grid.markMandatory({       
                        "groupNames":[
                            {
                                 "names" : ["program_code","engr_manager_id"]
                                ,"type":"M"
                            }             
                          
                        ]      
                        ,"groupTitles":[ 
                             {"titles" : ["Platform","Engr. Manager"]}
                        ]
                    }); 
                } else if(grid[0].id === "grid-PROGRAM"){
                    grid.markMandatory({       
                        "groupNames":[
                            {
                                 "names" : ["program_code","program_coordinator_id"]
                                ,"type":"M"
                            }             
                        ]      
                        ,"groupTitles":[ 
                             {"titles" : ["Program","Program Coordinator"]}
                        ]
                    }); 
                } else if(grid[0].id === "grid-BP"){
                    grid.markMandatory({       
                        "groupNames":[
                              {
                                   "names" : ["build_phase_abbrv","build_phase_name"]
                                  ,"type":"M"
                              } 
                        ]      
                        ,"groupTitles":[ 
                               {"titles" : ["Build Phase Code","Build Phase Name"]}
                        ]
                    });    
                } else if(grid[0].id === "grid-HF"){
                    grid.markMandatory({       
                        "groupNames":[
                              {
                                   "names" : ["harness_family","base"]
                                  ,"type":"M"
                              } 
                        ]      
                        ,"groupTitles":[ 
                               {"titles" : ["Harness Name","Base"]}
                        ]
                    });    
                    
                }else if(grid[0].id === "gridProgParts"){
                    grid.markMandatory({       
                        "groupNames":[
                              {
                                   "names" : ["build_phase_id","model_year","harness_family_id","oem_part_no"]
                                  ,"type":"M"
                              } 
                        ]      
                        ,"groupTitles":[ 
                               {
                                   "titles" : ["Build Phase","Model Year","Harness Family","OEM Part Number"]
                               }
                        ]
                    });    
                    
                }
                
            }
            function OEMPartNumber(target,prefix,base,suffix) {
                var res = prefix + "";
                if(res && base)     res += "-" + base   +"";    else res += base +"";
                if(res && suffix)   res += "-" + suffix +"";    else res += suffix  +"";
                target.find("[name='oem_part_no']").val(res.toUpperCase());
            } 
            //Buttons
            
            $("#savePrograms").click(function () {
                var _$grid = $("#grid-PROGRAM");
                if( _$grid.checkMandatory()!==true) return false;
                _$grid.jsonSubmit({
                     procedure: "oem_programs_upd"
                    ,optionalItems: ["is_active"]
                    ,notIncludes : ["engr_manager_id","program_managers","car_leaders","launch_managers","warehouse_contacts"]
                    , onComplete: function (data) {
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        displayProgram(gOEMId, _$grid.data("platformId"),"");
                    }
                });
            });
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
            $("#btnSaveProgramDetails").click(function(){
                var _$frm = $("#frm_modalDisplayDetails");
                var _$grid = _$frm.find("#gridProgramManagers,#gridCarLeaders,#gridLaunchManagers,#gridWarehouseContacts");
                    _$grid.jsonSubmit({
                         procedure: "program_users_upd" 
                        ,notIncludes : ["tempUser_id","program_user"]
                        ,onComplete: function(data){
                            if(data.isSuccess===true) zsi.form.showAlert("alert");  
                            _$frm.closest(".modal").modal("hide");
                            displayProgram(gOEMId, $("#grid-PROGRAM").data("platformId"));
                        }
                    });
            });
            $("#btnSaveInactiveRecords").click(function () {
               $("#gridInactiveRecords").jsonSubmit({
                         procedure      : "oem_upd"
                        ,optionalItems  : ["is_active"]
                        ,notInclude     : "[name='dummy_oem_id']"
                        ,notIncludes : ["dummy_oem_id"]
                        ,onComplete     : function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayRecords();
                            displayInactive();
                            $("#gridInactiveRecords").trigger("refresh");
                        }
                });
            });

            //Build Phase    
            $("#btnInactiveBP").click(function () {
                $(".modal-title").text("Inactive Build Phase");
                $('#modalInactiveBP').modal({ show: true, keyboard: false, backdrop: 'static' });
                var _tabName   = $("#nav-tab").find(".nav-item.active").text();
                displayInactive(_tabName);
            }); 
            $("#btnSaveInactiveBP").click(function () {
                var _grid = $("#gridInactiveBP");
                _grid.jsonSubmit({
                         procedure      : "oem_build_phases_upd" 
                        ,optionalItems  : ["is_active"] 
                        ,onComplete     : function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                            displayInactive(_grid.data("tabName"));
                          //  displayHarnessFamily($("#grid-BP").data("id"),);
                            $("#modalInactiveBP").modal('toggle');
                            
                        }
                });
            });
            $("#btnDeleteInactiveBP").click(function(){
                zsi.form.deleteData({
                     code       : "ref-0005"
                    ,onComplete : function(data){
                        displayInactive($("#gridInactiveBP").data("tabName"));
                      }
                });       
            });
            //---------------------------------------------------------------------------------//

            /*harness*/
            $("#btnHarnessInactive").click(function () {
                $(".modal-title").text("Inactive Harness Family");
                $('#modalInactiveHarness').modal({ show: true, keyboard: false, backdrop: 'static' });
                var _tabName   = $("#nav-tab").find(".nav-item.active").text();
                displayInactive(_tabName);
                
            }); 
            $("#btnSaveInactiveHarness").click(function () {
                var _grid = $("#gridInactiveHarness");
                _grid.jsonSubmit({
                     procedure      : "harness_family_upd" 
                    ,optionalItems  : ["is_active"] 
                    ,onComplete     : function (data) {
                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                        displayInactive(_grid.data("tabName"));
                        displayHarnessFamily($("#grid-HF").data("id"));
                        $("#modalInactiveHarness").modal('toggle');
                    }
                });
            });
            $("#btnDeleteInactiveHarness").click(function(){
                zsi.form.deleteData({
                     code       : "ref-0008"
                    ,onComplete : function(data){
                        displayInactive($("#gridInactiveHarness").data("tabName"));
                      }
                });       
            });
            //---------------------------------------------------------------------------------//

            /*platform*/
            $("#btnPlatformInactive").click(function () {
                $(".modal-title").text("Inactive Platform");
                $('#modalInactivePlatform').modal({ show: true, keyboard: false, backdrop: 'static' });
                var _tabName   = $("#nav-tab").find(".nav-item.active").text();
                displayInactive(_tabName);
                
            });
            $("#btnSaveInactivePlatform").unbind().click(function () {
                var _grid = $("#gridInactivePlatform");
                _grid.jsonSubmit({
                         procedure      : "oem_platforms_upd" 
                        ,optionalItems  : ["is_active"] 
                        ,notIncludes    : ["program_coordinator_id"]
                        ,onComplete     : function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                            displayInactive(_grid.data("tabName"));
                            displayPlatform($("#grid-P").data("id"));
                            $("#modalInactivePlatform").modal('toggle');
                        }
                });
            });
            $("#btnDeleteInactivePlatform").click(function(){
                zsi.form.deleteData({
                     code       : "ref-0004"
                    ,onComplete : function(data){
                        displayInactive($("#gridInactivePlatform").data("tabName"));
                        $("#modalInactivePlatform").modal('toggle');
                      }
                });       
            });
            //---------------------------------------------------------------------------------//
            
            //Program    
            $("#btnInactivePrograms").click(function () {
                $(".modal-title").text("Inactive Programs");
                $('#modalInactiveProgram').modal({ show: true, keyboard: false, backdrop: 'static' });
                var _tabName   = $("#nav-tab").find(".nav-item.active").text();
                displayInactive(_tabName);
                displayProgram(gOEMId, gPlatformId,"");
            }); 
            $("#btnSaveInactiveProgram").unbind().click(function () {
                var _grid = $("#gridInactiveProgram");
                _grid.jsonSubmit({
                     procedure      : "oem_programs_upd" 
                    ,optionalItems  : ["is_active"] 
                    ,notIncludes : ["engr_manager_id","program_managers","car_leaders","launch_managers","warehouse_contacts"]
                    ,onComplete     : function (data) {
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        displayProgram(gOEMId, $("#grid-PROGRAM").data("platformId"),"");
                        $("#modalInactiveProgram").modal('toggle');
                    }
                });
            });
            $("#btnDeleteInactiveProgram").click(function(){
                zsi.form.deleteData({
                     code       : "ref-0004"
                    ,onComplete : function(data){
                        displayInactive($("#gridInactiveProgram").data("tabName"));
                        $("#modalInactiveProgram").modal('toggle');
                      }
                });       
            });
            //---------------------------------------------------------------------------------//
            $("#btnInactiveRecords").click(function () {
                $(".modal-title").text("Inactive OEM");
                $('#modalInactiveRecords').modal({ show: true, keyboard: false, backdrop: 'static' });
                var _tabName   = $("#nav-tab").find(".nav-item.active").text();
                displayInactive(_tabName); 
            }); 
            $("#btnDeleteOEM").click(function(){
                zsi.form.deleteData({
                     code       : "ref-00026"
                    ,onComplete : function(data){
                        displayInactiveRecords();
                      }
                });       
            });
            $("#btnSearchVal").click(function(){ 
                var _searchVal = $.trim($("#searchVal").val());  
                if(gActiveTab === "BP") displayBuildPhase(gOEMId,_searchVal);
                else if(gActiveTab === "hf") displayHarnessFamily(gOEMId,_searchVal);
                else if(gActiveTab === "p") displayPlatform(gOEMId,_searchVal);
                else if(gActiveTab === "pr") displayProgram(gOEMId,gPlatformId,_searchVal);  
                else displayRecords(_searchVal);    
            }); 
            $("#searchVal").on('keypress',function(e) {
                var _searchVal = $.trim($("#searchVal").val()); 
                if(e.which == 13) {
                    displayRecords("",_searchVal);
                }
            }); 
            $("#btnResetVal").click(function(){
                var _$searchVal = $("#searchVal").val(""); 
                if(gActiveTab === "BP"){
                     _$searchVal;
                   displayBuildPhase(gOEMId);
                }
                else if(gActiveTab === "hf") { 
                     _$searchVal;
                    displayHarnessFamily(gOEMId);
                }
                else if(gActiveTab === "p") {
                    _$searchVal;
                    displayPlatform(gOEMId);
                }
                else if(gActiveTab === "pr"){
                    _$searchVal; 
                    displayProgram(gOEMId,(gProgId ? gProgId :gPlatformId ));
                }  
                else {
                    _$searchVal;
                    displayRecords();
                } 
            });
            
            $("#btnSearchProgram").click(function(){ 
                displayProgram(gOEMId,"",""); 
            });
            $(".btnSearchOEM").click(function(){ 
                $("#oemId").val(gOEMId);
                displayBuildPhase(gOEMId);
                displayHarnessFamily(gOEMId);
                displayPlatform(gOEMId);  
                $("#progTab").hide();
            });
    
    return _public;
  
 })();
  

                                                                                                                                                                                                                                      