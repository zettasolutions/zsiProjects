var vehicledriverpao = (function(){
    var   bs                    = zsi.bs.ctrl
        ,gTw                    = null
        , tblName               = "tblusers"
        ,_public                = {}
        ,mdlAddNewVehicleUser   = "modalWindowAddNewVehicleUser"
        ,mdlImageVehicleUser    = "modalWindowImageVehicleUser"
        ,mdlImageEmpl           = "modalWindowImageEmployee"
        ,mdlImageDriverUser     = "modalWindowImageDriverUser"
        ,mdlImageDriverLicence  = "modalWindowImageDriverLicence"
        ,gRoleId                = 1
        ,gPosition              = "DRIVER"
        ,gCompanyId             = app.userInfo.company_id
        ,mdlAddNewDriverUser    = "modalWindowAddNewDriverUser"
        ,mdlInactive            = "modalWindowInactive"
        ,gMdlUploadExcel        = "modalWindowUploadExcel"
        ,gName                  = ""
        ,gUser                  =  app.userInfo
        ,gActiveTab             = ""
        ,gSubTabName            = ""
        ,gTabName               = ""
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Vehicle Driver/PAO");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        gTw = new zsi.easyJsTemplateWriter();
        displayVehicles(gCompanyId);
        //displayDrivers(gCompanyId);
        displayDrivers();
        displayPAO(gCompanyId);
        getTemplates();
        gActiveTab = "vehicles";
        gName = "Driver(s)";
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-vehicles":
                gActiveTab = "vehicles";
                gName = "Driver(s)";
                break;
            case "#nav-drivers":
                gRoleId = 1;
                gPosition = "DRIVER";
                gActiveTab = "drivers";
                gName = "Driver(s)";
                break;
            case "#nav-pao":
                gRoleId = 2;
                gPosition = "PUBLIC ASSISTANCE OFFICER (PAO)";
                gActiveTab = "pao";
                gName = "PAO(s)";
                break;
          default:break;
      }
    });
    
    gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());  
    gTabName = $.trim($(".nav-tab-main").find(".nav-item.active").text());  
    $(".nav-tab-main").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text());
        $(".nav-tab-sub").find(".nav-item").removeClass("active");
        $(".nav-tab-sub").find(".nav-item:first-child()").addClass("active"); 
        if(gTabName === "Drivers"){
            gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());  
             displayDrivers();
        }
        
    });  
    $(".nav-tab-sub").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text()); 
        displayDrivers();
    });  
    
    _public.excelFileUpload = function(){
        var frm      = $("#frm_modalWindowUploadExcel");
        var formData = new FormData(frm.get(0));
        var files    = frm.find("input[name='file']").get(0).files; 
    
        if(files.length===0){
            alert("Please select excel file.");
            return;    
        }
        
        //disable button and file upload.
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
        });
    };   
    function displayDrivers(searchVal){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var ctr = 0
            ,_params = {
                client_id: app.userInfo.company_id
                ,tab_id : 0
            };
        ctr=-1;
        switch(gTabName){  
            case "Drivers":  
                switch (gSubTabName) { 
                    case "Active":   
                       /*_params.tab_id = 1;*/
                    break;
                    case "(15)Days for Renewal":  
                        _params.tab_id = 2;
                    break;
                    case "(30)Days for Renewal":  
                        _params.tab_id = 3;
                    break;
                    case "Expired License":  
                       _params.tab_id = 4;
                    break;
                    case "Inactive":  
                       //_params.tab_id = 4;
                    break;
                }
            break; 
        }  
        $("#gridDriversLicensed").dataBind({
             sqlCode        : "D1232"  
            ,parameters     : _params
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox" 
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showModalUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
		        ,{ text:"Driver's Licence"             , width:90      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"driver_licence_img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showModalUploadDriverLicenceImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewId(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"userFullName") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"role_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Academy No."         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no" }
                ,{text  : "License No."         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no" }
                ,{text  : "License Exp. Date"   , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"driver_license_exp_date" }
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
            
                this.find("[name='role_id']").dataBind("roles");
            }
        });    
    }
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : mdlImageVehicleUser
            , sizeAttr  : "modal-md"
            , title     : "Image Vehicle Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageVehicleUser({onClickUploadImageVehicleUser:"vehicledriverpao.uploadImageVehicleUser();"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewVehicleUser
            , sizeAttr  : "modal-full"
            , title     : "New Vehicle User"
            , body      : gTw.new().modalBodyAddVehicleUsers({grid:"gridNewVehicles",onClickSaveNewVehicleUsers:"vehicledriverpao.submitNewVehicles();"}).html()  
        })
        .bsModalBox({
              id        : gMdlUploadExcel
            , sizeAttr  : "modal-lg"
            , title     : ""
            , body      : gTw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
        })
        .bsModalBox({
              id        : mdlImageDriverUser
            , sizeAttr  : "modal-md"
            , title     : "Image Driver Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageDriverUser({onClickUploadImageDriverUser:"vehicledriverpao.uploadImageDriverUser();"}).html()  
        })
        .bsModalBox({
              id        : mdlImageDriverLicence
            , sizeAttr  : "modal-md"
            , title     : "Driver's Licence"
            , body      : ""
            , footer    : gTw.new().modalBodyImageDriverLicence({onClickUploadImageDriverLicence:"vehicledriverpao.uploadImageDriverLicence();"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewDriverUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddDriverUsers({grid:"gridNewDriverUsers",onClickSaveNewDriverUsers:"vehicledriverpao.submitNewDriverUsers();"}).html()  
        })
        .bsModalBox({
              id        : mdlInactive
            , sizeAttr  : "modal-lg"
            , title     : "Inactive Users"
            , body      : gTw.new().modalBodyInactive({grid:"gridInactiveUsers",onClickSaveInactive:"vehicledriverpao.submitInactive();"}).html()  
        });
        
    }
    
    function displayVehicles(gUser,company_id,searchVal){
        $("#gridVehicles").dataBind({
             sqlCode        : "V1229" 
            ,parameters     : {client_id: gUser, searchVal:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 240
            ,dataRows       : [
                { text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicles.mouseover(\"" +  app.svn(d,"vehicle_img_filename") + "\");' onmouseout='vehicles.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicles.showModalUploadUserImage(" + app.svn(d,"vehicle_id") +",\"" 
    		                           + app.svn(d,"vehicle_plate_no") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
                ,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicles.showModalViewInfo(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Vehicle Plate No."                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"company_id"               ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ;
                                 
                        }
                }
                ,{text: "Route"                                                                 ,width : 100   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_id"                  ,type:"select"      ,value: app.svn(d,"route_id")})  
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                                 
                        }
                }
                ,{text: "Vehicle Type"                      ,name:"vehicle_type_id"             ,type:"select"      ,width : 160   ,style : "text-align:left;"}
                ,{text: "Transfer Type"                     ,name:"transfer_type_id"            ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Bank"                              ,name:"bank_id"                     ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Transfer No"                       ,name:"transfer_no"                 ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Account Name"                      ,name:"account_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "R1224"
                   ,text         : "route_code"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "D1307"
                   ,text         : "vehicle_type"
                   ,value        : "fare_id"
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
            }
        });
    }
    
    function displayAddNewVehicle(company_id){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        
        $("#gridNewVehicles").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: "Vehicle Plate No."                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"company_id"               ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ;
                                 
                        }
                }
                ,{text: "Route"                                                                 ,width : 100   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_id"                  ,type:"select"      ,value: app.svn(d,"route_id")})  
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                                 
                        }
                }
                ,{text: "Vehicle Type"                      ,name:"vehicle_type_id"             ,type:"select"      ,width : 160   ,style : "text-align:left;"}
                ,{text: "Transfer Type"                     ,name:"transfer_type_id"            ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Bank"                              ,name:"bank_id"                     ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Transfer No"                       ,name:"transfer_no"                 ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Account Name"                      ,name:"account_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "R1224"
                   ,text         : "route_code"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "V1230"
                   ,text         : "vehicle_type"
                   ,value        : "vehicle_type_id"
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
            }
        });    
    }
    
    function displayInactiveVehicles(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveVehicles").dataBind({
             sqlCode        : "V1229" 
            ,parameters     : {is_active:'N'}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                            
                        }
                }
                ,{text: "Vehicle Plate No."                                                                  ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_plate_no"          ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")})
                                 + app.bs({name:"route_id"                  ,type:"hidden"      ,value: app.svn(d,"route_id")})
                                 + app.bs({name:"company_code"              ,type:"hidden"      ,value: app.svn(d,"company_code")})
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                 + app.bs({name:"vehicle_type_id"           ,type:"hidden"      ,value: app.svn(d,"vehicle_type_id")});
                                 
                        }
                }
                ,{text: "Active?"                      ,name:"is_active"               ,type:"yesno"       ,width : 55   ,style : "text-align:left;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveVehicles input[name='cb']");
            }
        });
    }
     _public.mouseover = function(filename){
         $("#user-box").css("display","block");
         $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _public.mouseout = function (){
        $("#user-box").css("display","none");
    };
    _public.showModalViewInfo = function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
        var _frm = $("#frm_modalVehicleId");
        var _fileName = fileName ? "/file/loadFile?filename="+ fileName : "../images/no-image2.jpg";
        var _$vehicleType = $(eL).closest(".zRow").find('[name="vehicle_type_id"] option[value="'+vehicleType+'"]').text();
        _frm.find("#plateNoId").text(vehiclePlateNo);
        _frm.find("#vehicleTypeId").text(_$vehicleType);
        _frm.find("#imgFilename").attr("src", _fileName);
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    };
    _public.submitNewVehicles = function(){
        $("#gridNewVehicles").jsonSubmit({
                 procedure: "vehicle_upd"
                ,optionalItems: ["route_id","vehicle_type_id","is_active"]
                ,onComplete : function (data) {
                    if(data.isSuccess===true){
                       zsi.form.showAlert("alert");
                       isNew = false;
                       displayVehicles(gCompanyId);
                       displayAddNewVehicle(gCompanyId);
                    }
                }
        });
        
    };
    
    _public.showModalUploadUserImage = function(UserId, name){
        vehicle_id = UserId;
        var m=$('#' + mdlImageUser);
        
        m.find(".modal-title").text("Vehicle image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };
    
    _public.uploadImageUser = function(){
        var frm = $("#frm_" + mdlImageUser);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',  //server script to process data
            type: 'POST',
    
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    //submit filename to server
                    $.get(base_url  + "sql/exec?p=image_vehicles_upd @vehicle_id=" + vehicle_id
                                    + ",@vehicle_img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageUser).modal('toggle');
                        
                        //refresh latest records:
                        displayVehicles(gCompanyId);
                    });   
                }else
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
    },
    
    $("#btnAddVehichles").click(function () {
        var _$mdl = $('#' + mdlAddNewVehicleUser);
        _$mdl.find(".modal-title").text("Add New Vehicle(s)");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewVehicle(gCompanyId);
    });
    
    $("#btnInactive").click(function(){
       var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactiveVehicles");
        g$mdl.find(".modal-title").text("Inactive Vehicles") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveVehicles();
    });
    
    $("#btnSaveVehicles").click(function () {
       $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["route_id","vehicle_type_id","is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
            }
        });
    });
    
    $("#btnSaveInactiveVehicles").click(function () {
       $("#gridInactiveVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
                $('#modalInactiveVehicles').modal('toggle');
            }
        });
    });
    
    $("#btnDeleteVehicles").click(function(){
        zsi.form.deleteData({
             code       : "ref-00015"
            ,onComplete : function(data){
                $('#gridVehicles').trigger('refresh');
                $('#modalInactiveVehicles').modal('toggle');
            }
        });       
    });
   
    
    
    function displayPAO(gUser, searchVal){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var ctr = 0;
        ctr=-1;
        $("#gridPAO").dataBind({
             sqlCode        : "P1233" 
            ,parameters     : {client_id: gUser, searchVal:(searchVal ? searchVal : "")}
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicledriverpaoloader.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='vehicledriverpaoloader.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpaoloader.showModalUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
    		   
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++;
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpaoloader.showModalViewId(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"userFullName") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"role_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
            
                this.find("[name='role_id']").dataBind("roles");
            }
        });    
    }
    
    function displayAddNewDriverUser(role_id,position,company_id){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var _dataRows = [];
        
        _dataRows.push(
                 {text  : "First Name"     , width : 150           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")})
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"company_id"         ,type:"hidden"     ,value: company_id})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
        		}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" }
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
            
            );
        
        if(role_id === 1){
            _dataRows.push(
                 {text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return app.bs({name:"name_suffix"       ,type:"input"       ,value: app.svn(d,"name_suffix")})
                            +  app.bs({name:"hash_key"          ,type:"hidden"      ,value: app.svn(d,"hash_key")})  
                            +  app.bs({name:"position"          ,type:"hidden"      ,value: position});
                    }
                }
                ,{text  : "Academy No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no"}
                ,{text  : "License No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no"}
                ,{text  : "License Expr. Date"          ,width : 120           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_exp_date"}
                ,{text  : "Transfer Type"               ,width : 160           ,style : "text-align:center;"          ,type:"select"      ,name:"transfer_type_id"}
                ,{text  : "Bank"                        ,width : 160           ,style : "text-align:center;"          ,type:"select"      ,name:"bank_id"}
                ,{text  : "Transfer No"                 ,width : 130           ,style : "text-align:center;"          
                    ,onRender : function(d){ 
                        return app.bs({name:"transfer_no"       ,type:"input"       ,value: app.svn(d,"transfer_no")})
                            +  app.bs({name:"role_id"           ,type:"hidden"      ,value: role_id});
                    }
                }
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            );
        }else{
            _dataRows.push(
                 {text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return app.bs({name:"name_suffix"       ,type:"input"       ,value: app.svn(d,"name_suffix")})
                            +  app.bs({name:"hash_key"          ,type:"hidden"      ,value: app.svn(d,"hash_key")})  
                            +  app.bs({name:"position"          ,type:"hidden"      ,value: position})
                            +  app.bs({name:"transfer_type_id"          ,type:"hidden"      ,value: app.svn(d,"transfer_type_id")})
                            +  app.bs({name:"bank_id"          ,type:"hidden"      ,value: app.svn(d,"bank_id")})
                            +  app.bs({name:"transfer_no"          ,type:"hidden"      ,value: app.svn(d,"transfer_no")})
                            +  app.bs({name:"role_id"          ,type:"hidden"      ,value: role_id});
                    }
                }
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            );
            
        }
        
        
        $("#gridNewDriverUsers").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : _dataRows
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "tranfer_type"
                   ,value        : "tranfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
            }
        });    
    }
    
    function displayInactiveUsers(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveUsers").dataBind({
             sqlCode    : "U77"
            ,parameters : {is_active: "N"}
     	    ,width      : $("#frm_modalWindowInactive").width() - 15
    	    ,height     : 360
            ,dataRows   : [
                
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender :function(d){
                                    return     app.bs({name:"user_id"   ,type:"hidden"  ,value: d.user_id})
                                             + app.bs({name:"is_edited" ,type:"hidden"})
                                             + app.bs({name:"oem_ids"   ,type:"hidden"  ,value:d.oem_ids })
                                             + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );                          
                                } 
                }
                
                
        	   ,{text  : "Corplear logon "     , width : 200           , style : "text-align:center;"          ,type:"input"      ,name:"logon"}
               ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"   }
               ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"    }
               ,{text  : "Middle Initial"      , width : 100           , style : "text-align:center;"           
                   ,onRender: function(d){
                        return  app.bs({name:"middle_name"   ,type:"input"   ,value: d.middle_name})  
                              + app.bs({name:"name_suffix"   ,type:"hidden"  ,value: d.name_suffix})   
                              + app.bs({name:"role_id"       ,type:"hidden"  ,value: d.role_id})
                              + app.bs({name:"is_admin"      ,type:"hidden"  ,value: d.is_admin })
                              +  app.bs({name:"plant_id"     ,type:"hidden"  ,value: d.plant_id})
                              +  app.bs({name:"warehouse_id" ,type:"hidden"  ,value: d.warehouse_id});
                   }
               }
               ,{text  : "Active?"  , width : 70    , style : "text-align:center;"  ,type:"yesno"  ,name:"is_active"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveCustomers input[name='cb']");
            }
        });  
    }
    
    _public.showModalViewId = function (eL,id,fullName,fileName,positionId,hashKey) {
        var _frm = $("#frm_modalEmpoloyeeId");
        var _$position = $(eL).closest(".zRow").find('[name="role_id"] option[value="'+positionId+'"]').text();
        var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png";
        _frm.find("#nameId").text(fullName);
        _frm.find("#positionId").text(_$position);
         _frm.find("#idNo").text(id);
        _frm.find("#imgFilename").attr("src", "../img/avatar-m.png");
        $('#modalEmployeesId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    };
    
    _public.showModalUploadUserImage = function(UserId, name){
        user_id = UserId;
        var m =$('#' + mdlImageUser);
        m.find(".modal-title").text("Image User for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
              
            }
        ); 
    };
    
    _public.showModalUploadDriverLicenceImage = function(UserId, name){
        user_id = UserId;
        var m=$('#' + mdlImageDriverLicence);
        m.find(".modal-title").text("Driver's licence image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };
    
    _public.uploadImageUser = function(){
        var frm = $("#frm_" + mdlImageUser);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',  //server script to process data
            type: 'POST',
    
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    //submit filename to server
                    $.get(base_url  + "sql/exec?p=image_driver_pao_upd @user_id=" + user_id
                                    + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageUser).modal('toggle');
                        //refresh latest records:
                        displayDrivers();
                        displayPAO();
                    });   
                }else
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
    },
    
    _public.uploadImageDriverLicence = function(){
        var frm = $("#frm_" + mdlImageDriverLicence);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',  //server script to process data
            type: 'POST',
    
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    //submit filename to server
                    $.get(base_url  + "sql/exec?p=image_drivers_image_licence_upd @user_id=" + user_id
                                    + ",@driver_licence_img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageDriverLicence).modal('toggle');
                        
                        //refresh latest records:
                        displayDrivers();
                        displayPAO();
                    });   
                }else
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
    },
    _public.mouseover = function(filename){
         $("#user-box").css("display","block");
         $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _public.mouseout = function (){
        $("#user-box").css("display","none");
    };
    _public.submitInactive = function(){
        var _$grid = $("#gridInactiveUsers");
            _$grid.jsonSubmit({
                 procedure: "users_upd"
                ,optionalItems: ["is_active","is_contact"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayDrivers();
                    displayInactiveUsers();
                }
            });
        $('#' + mdlInactive).modal('hide');     
    };
    _public.submitNewDriverUsers = function(){
        $("#gridNewDriverUsers").jsonSubmit({
                 procedure  : "drivers_pao_upd"
                 ,optionalItems: ["is_active","transfer_type_id","bank_id"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayDrivers();
                        displayAddNewDriverUser(gRoleId,gPosition,gCompanyId);
                     }
                }
        });
        
    };
    
    $("#btnNactive").click(function () {
        var g$mdl = $("#" + mdlInactive);
        g$mdl.find(".modal-title").text("Inactive Users") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveUsers();
    });
    
    $(".btnAddDrivers").click(function () {
        var _$mdl = $('#' + mdlAddNewDriverUser);
        _$mdl.find(".modal-title").text("Add New " + gName);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewDriverUser(gRoleId,gPosition,gCompanyId);
    });
    
    $("#btnSave").click(function () {
        $("#grid").jsonSubmit({
             procedure  : "users_upd"
            ,optionalItems: ["is_active"]
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    $("#grid").trigger("refresh");
                }
            }
        });
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "vehicle") displayVehicles(gCompanyId,_searchVal);
        
        else displayDrivers(_searchVal); displayPAO(_searchVal);
        
    }); 
    
    $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(gActiveTab === "vehiclee")   displayVehicles(gCompanyId,_searchVal);
           else  displayDrivers(_searchVal); displayPAO(_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "vehicle") displayVehicles(gCompanyId); 
            else displayDrivers(); displayPAO();
        }
    });
    
    
    return _public;
})();                                                       