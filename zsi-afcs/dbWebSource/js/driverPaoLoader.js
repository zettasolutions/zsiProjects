 var driverpaoloader = (function(){
    var   bs                    = zsi.bs.ctrl
        , tblName               = "tblusers"
        ,_public                = {}
        ,mdlImageEmpl           = "modalWindowImageEmployee"
        ,mdlImageUser           = "modalWindowImageUser"
        ,gRoleId                = ""
        ,mdlAddNewUser          = "modalWindowAddNewUser"
        ,mdlInactive            = "modalWindowInactive"
        ,gMdlUploadExcel        = "modalWindowUploadExcel"
        ,gTw                    = null
        
    ;

    zsi.ready = function(){
        $(".page-title").html("Driver/PAO/Loader");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        gTw = new zsi.easyJsTemplateWriter();
        displayRecords("");
        getTemplates();
        $("#driverpaoloaderId").fillSelect({
            data: [
                 { text: "DRIVER"       , value: "1"}
                ,{ text: "PAO"          , value: "2"}
                ,{ text: "LOADER"       , value: "4"}
                
            ]
            ,onChange : function(){
                gRoleId = this.val();
                
            }
            ,onComplete     : function(){
                $("option:first-child",this).text("DRIVER/PAO/LOADER");
                $("option:first-child",this).val("");
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
        console.log("tabName",tabName);
        $.get(app.execURL +  "excel_upload_sel @load_name ='" + tabName +"'"
        ,function(data){
            console.log("data",data);
            g$mdl = $("#" + gMdlUploadExcel);
            g$mdl.find(".modal-title").text("Upload Excel for » " + tabName ) ;
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            $("#tmpData").val(data.rows[0].value);
            
            $("input[name='file']").val(""); 
        });
    };     
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlUploadExcel
            , sizeAttr  : "modal-xs"
            , title     : ""
            , body      : gTw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
        })
    }
   
    function displayRecords(roleId,userName){   
        console.log("userName",userName);
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        ctr=-1;
        $("#grid").dataBind({
             sqlCode        : "U77"
            ,parameters     : {role_id:(roleId ? roleId : ""),userFullName:(userName ? userName : "")}
     	    ,width          : $("#frm").width()
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox"
            ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='driverpaoloader.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='driverpaoloader.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='driverpaoloader.showModalUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"img_filename") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='driverpaoloader.showModalViewId(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"userFullName") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"role_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Position"            , width : 160           , style : "text-align:center;"          ,type:"select"      ,name:"role_id"         ,displayText:"role_name"}
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
    
    function displayAddNewUser(){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridNewUsers").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
        		{text  : "Corplear logon "     , width : 155           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        ctr++;
                        return app.bs({name:"user_id"  ,type:"hidden"  ,value: app.svn(d,"user_id")})
                            +  app.bs({name:"is_edited",type:"hidden"})
                            +  app.bs({name:"oem_ids"  ,type:"hidden"  ,value:app.svn(d,"oem_ids") })
                            +  app.bs({name:"logon"    ,type:"input"   ,value:app.svn(d,"logon")});
                    }
        		}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" }
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Role"                , width : 160           , style : "text-align:center;"          ,type:"select"      ,name:"role_id"         ,displayText:"role_name"}
                ,{text  : "Admin?"              , width : 60            , style : "text-align:center;"          
                    ,onRender: function(d){
                        return app.bs({name:"is_admin"      ,type:"yesno"  ,value:app.svn(d,"is_admin") })
                            +  app.bs({name:"plant_id"      ,type:"hidden" ,value: app.svn(d,"plant_id")})
                            +  app.bs({name:"warehouse_id"  ,type:"hidden" ,value: app.svn(d,"warehouse_id")});
                    }
                }  
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
                
            ]
            ,onComplete: function(){
                this.find("input, select").on("change keyup ", function(){
                    $(this).closest(".zRow").find("[name='is_edited']").val("Y");
                });
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                this.find("[name='role_id']").dataBind("roles");
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
        var m=$('#' + mdlImageUser); 
        m = $("#" + gMdlUploadExcel); 
        m.modal({ show: true, keyboard: false, backdrop: 'static' }); 
        m.find(".modal-title").text("Image User for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
                //initChangeEvent();
            }
        ); 
    }
    
    _public.uploadImageEmpl = function(){
        var frm = $("#frm_" + mdlImageEmpl);
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
                    $.get(base_url  + "sql/exec?p=dbo.image_file_employees_upd @employee_id=" + employee_id
                                    + ",@img_filename='employee." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageEmpl).modal('toggle');
                        
                        //refresh latest records:
                        displayEmployees();
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
                    displayRecords();
                    displayInactiveUsers();
                }
            });
        $('#' + mdlInactive).modal('hide');     
    };
    _public.submitNewUsers = function(){
        if( zsi.form.checkMandatory()!==true) return false;
        var res = isRequiredInputFound("#gridNewUsers");
        if(!res.result){
            $("#gridNewUsers").jsonSubmit({
                     procedure  : "users_upd"
                     ,optionalItems: ["is_active","is_contact"]
                     ,onComplete : function (data) {
                         if(data.isSuccess===true){
                            zsi.form.showAlert("alert");
                            isNew = false;
                            displayRecords();
                            displayAddNewUser();
                         }
                    }
            });        
            $('#' + mdlAddNewUser).modal('hide');
        } else {
            alert("Enter " + res.inputName);
        }
    };
    
    $("#btnNactive").click(function () {
        var g$mdl = $("#" + mdlInactive);
        g$mdl.find(".modal-title").text("Inactive Users") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveUsers();
    });
    
    $("#btnAdd").click(function () {
        var _$mdl = $('#' + mdlAddNewUser);
        _$mdl.find(".modal-title").text("Add New Users");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            console.log("agi");
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewUser();
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
        if(_searchVal!==""){
            displayRecords("",_searchVal);
            
        }
    }); 
   $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(_searchVal!==""){
            displayRecords("",_searchVal);
            
        }
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayRecords();
        }
    });
    
    $("#btnResetVal").click(function(){
        $("#driverpaoloaderId").val("");
        $("#searchVal").val("");
        displayRecords();
    });
    
    $("#btnFilterVal").click(function(){ 
        displayRecords(gRoleId,"");
    });

    
    return _public;
})();
                                             