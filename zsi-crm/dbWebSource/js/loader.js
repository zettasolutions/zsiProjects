 var loader = (function(){
    var _pub         = {}
        ,gClientId    = null
        ,svn                = zsi.setValIfNull
        ,gBankId    = null
        ,gtw                = null
        ,mdlUploadLogo      = "modalWindowUploadLogo"
    ;
    
    zsi.ready = function(){
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Load Merchant");
        $(":input").inputmask();
        getTemplates();
        displayLoaders();
    };
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href"); 
        switch(target){
            case "#nav-company-information":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
            case "#nav-documents":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
            case "#nav-admin-information":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
          default:break; 
        } 
    });
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : mdlUploadLogo 
            , title     : "Inactive Employee(s)"
            , body      : "" 
            , footer    : '<div class="col-11 ml-auto"><button type="button" onclick="loader.uploadImageEmpl(this);" class="btn btn-primary"><span class="fas fa-file-upload"></span> Upload</button>'
        });
    }
    
    function displayLoaders(searchVal){
        $("#gridLoaders").dataBind({
             sqlCode     : "L1280"
            ,parameters  : {search_val : searchVal? searchVal: ""}
            ,height      : $(window).height() - 248
            ,dataRows    : [
                {text: "<div id='code'>Code</div>", width: 130, style: "text-align:center"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_code");
                    }
                }
                ,{text: "Name", width : 200, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_name");
                    }
                }
                ,{text: "Phone No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_phone_no");
                    }
                }
                ,{text: "Mobile No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_mobile_no");
                    }
                }
                ,{text: "Email Address", width: 200, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_email_add");
                    }
                }
                ,{text: "Billing Address", width: 300, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"billing_address");
                    }
                }
                ,{text  : "Load Personnel"                 , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"oem" 
                    , onRender      : function(d) {
                        var _link = "<a style='text-decoration:underline !important; color:#007bff!important;' href='javascript:void(0)'  onclick='loader.showModalList(this,\""+ app.svn (d,"client_id") +"\");'><i class='fas fa-link' aria-hidden='true' title='Load Personnels'></i></a>";
                    
                        return (d !== null ? _link : "");
                    }
                }
            ]
            ,onComplete  : function(o){
                
            }
        });
    }
    
     function displayLoadPersonnels(id){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridLoadPersonnel").dataBind({
             sqlCode     : "L1327"
            ,parameters  : {client_id:id}
            ,height      : 360
            ,blankRowsLimit : 5
            ,dataRows    : [
                {text:cb                                                                  ,width: 25            ,style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.bs({name:"id"                    ,type:  "hidden"      ,value: app.svn (d,"id")}) 
                             + app.bs({name:"is_edited"             ,type:  "hidden"      ,value: app.svn(d,"is_edited")})
                             + app.bs({name:"client_id"             ,type:  "hidden"      ,value: id}) 
                             + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                    
                    }
                }
                ,{ text:"Image"             , width:50      , style:"text-align:center;" 
        		    ,onRender : function(d){ 
                        var image_url = base_url + "dbimage/ref-00020/id/"+ app.svn(d,"id") + "/img_filename" +"?ts=" + new Date().getTime();                               
                        var mouseMoveEvent= "onmouseover='loader.mouseover(\"" + image_url  + "\");' onmouseout='loader.mouseout();'";  
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='loader.showModalUploadEmplImage(" + app.svn(d,"id") +",\"" 
    		                           + svn(d,"first_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
                ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:200          ,style:"text-align:left"}
                ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:200          ,style:"text-align:left"}
                ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:80          ,style:"text-align:center"}
                ,{text:"Name Suffix"                                                            ,width:80          ,style:"text-align:center"
                    ,onRender  :  function(d){ 
                        return app.bs({name:"name_suffix"           ,type:  "input"      ,value: app.svn (d,"name_suffix")      ,style:"text-align:center"}) 
                             + app.bs({name:"emp_hash_key"          ,type:  "hidden"     ,value: app.svn(d,"emp_hash_key")});
                                    
                    }
                }
                ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:60           ,style:"text-align:left"      ,defaultValue: "Y"}
                
            ]
            ,onComplete  : function(o){
                this.find("[name='cbFilter1']").setCheckEvent("#gridLoadPersonnel input[name='cb']");  
            }
        });
    }
    
    
    function checkValueExist(tableName,colName,keyWord,inputId){
        zsi.getData({
             sqlCode    : "C1295" 
            ,parameters  : {table_name: tableName, colname: colName, keyword: keyWord} 
            ,onComplete : function(d) {
                var _rows= d.rows;
                
                if(_rows.length === 1) {
                    
                    $(inputId).val("");
                    
                    if(inputId === "#client_email_add"){ 
                        $('#popEmailAdd').popover("show", 400);
                        setTimeout(function(){
                            $('#popEmailAdd').popover("hide", 400);
                        },2000);
                    }
                    else{ 
                        $('#popLogonAdd').popover("show", 400);
                        setTimeout(function(){
                            $('#popLogonAdd').popover("hide", 400);
                        },2000);
                    }
                    
                }
            }
        });
    }
    
    _pub.uploadImageEmpl = function(){
        var frm = $("#frm_" + mdlUploadLogo);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/uploadTmpDbFile',
            type: 'POST',
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    setTimeout(function(){
                        $.get(base_url  + "sql/exec?p=load_personnel_img_upd @id=" + gBankId+ ",@tmp_file_id='" +  data.tmp_file_id + "'"
                        ,function(data){
                            zsi.form.showAlert("alert");
                            setTimeout(function(){ 
                                $('#gridLoadPersonnel').trigger( 'refresh' );    
                                $(".close").click(); 
                            },1000);
                        });
                    });
                }else
                    alert(data.errMsg);
            },
            error: errorHandler = function() {
                console.log("error");
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
       
    },
    
    _pub.showModalUploadEmplImage = function(emplId, name){ 
        gBankId = emplId;
         
        var m=$('#' + mdlUploadLogo);
        m.find(".modal-title").text('Upload logo for ' + name);
        m.modal("show");
        $.get(base_url + 'page/name/tmplFileDbUpload'
            ,function(data){
               m.find('.modal-body').html(data);
               m.find("form").attr("enctype","multipart/form-data");
            }
        );  
        
    },
    
    _pub.mouseover = function(img_url){
        $("#user-box").css("display","block"); 
        $("#userImage").attr("src",img_url);
        
    },
    
    _pub.mouseout = function (){
        $("#user-box").css("display","none");
    },
    
    _pub.showModalList = function(el,id){  
        var $mdl = $("#myModalLoadPersonnel");
        
        displayLoadPersonnels(id);
        $mdl.find(".modal-title").text("Load Personnels");
        $mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    };
    
    $("#client_email_add,#logon").on("change", function(){
        var _colName    = $(this)[0].id;
        var _clientEmailAdd = $("#client_email_add").val();
        var _logonEmailAdd = $("#client_email_add").val();
        
        if(_colName === "client_email_add") checkValueExist("clients","client_email_add",_clientEmailAdd,"#client_email_add");
        else checkValueExist("users","logon",_logonEmailAdd,"#logon");
    });
    
    $("#btnSubmit").click(function(){
        var _$frmStep1 = $("#formClientsStep1One")
            ,_$frmStep2 = $("#formClientsStep2");
            
        var _frmStep1 = _$frmStep1[0]
            ,_frmStep2 = _$frmStep2[0];
            
        $('#pop1').popover("hide", 400);
        $('#pop2').popover("hide", 400);
        if( ! _frmStep1.checkValidity()){
            _$frmStep1.addClass('was-validated');
            $('#pop1').popover("show", 400);
        }else if( ! _frmStep2.checkValidity()){
            _$frmStep2.addClass('was-validated');
            $('#pop2').popover("show", 400);
        }else{   
            $('#myModal').modal('show');
        }
    });
    
    $("#btnNew").click(function() {
        var _$mdl = $('#newClientModal');
        //if($(window).height() <= 724) $("#clientInformationDiv").css({"height":$(window).height() - 208,"overflow-y":"auto","overflow-x":"hidden"});
        _$mdl.modal('show');
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id');
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        $("#formClients").find("input[type='text'],input[type='email'],select").val("");
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$country.dataBind({
            sqlCode : "D247" //dd_countries_sel
            ,text : "country_name"
            ,value : "country_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                _$state.dataBind({
                    sqlCode : "D248" //dd_states_sel
                    ,parameters : {country_id:country_id}
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                            sqlCode      : "D246" //dd_cities_sel
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id"
                            ,onChange     : function(d){
                                var _info = d.data[d.index - 1]
                                    ,city_id = isUD(_info) ? "" : _info.city_id;
                            }
                        });
                    }
                });
            }
        });
    });
    
    $("#btnSaveLoadPersonnel").click(function () {
        var _$grid = $("#gridLoadPersonnel");
        _$grid.jsonSubmit({
             procedure: "load_personnel_upd"
            ,notIncludes: ["cb"]
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                _$grid.trigger("refresh");
            }
        });
    });
    
    $("#btnDeleteLoadPersonnel").click(function (){  
        $("#gridInactiveSections").deleteData({
    		sqlCode: "D248"  
    		,parameters: {client_id:app.userInfo.company_id,table:'dept_sect',id:'dept_sect_id'}
    		,onComplete : function(d){
    			$("#gridInactiveSections").trigger("refresh");
    		}
    	 });  
    });
    
    $("#is_ready").click(function(){ 
       if($(this).is(":checked")){
           $("#clientInformationDiv").toggle("top");
           $("#adminUserDiv").toggle("top");
       }else{
           $("#clientInformationDiv").toggle("down");
           $("#adminUserDiv").toggle("down");
       } 
    });  
    
    $("#btnConfirm").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide"); 
        $("#is_ready").prop('checked', false);
        $("#clientInformationDiv").toggle("down");
        $("#adminUserDiv").toggle("down");
    });
    
    $("#viewImg1,#viewImg2,#viewImg3").click(function(){
       var _colName = $(this)[0].id;
       var _link = "/file/viewImage?fileName=";
       var _img = "";
       if(_colName === "viewImg1"){
           _img = _link + $("#img1").text();
           
           $("#viewImg1").attr("href", _img);
       }else if(_colName === "viewImg2"){
           _img = $("#img2").text();
           
           $("#viewImg2").attr("href", _img);
       }else{
           _img = $("#img3").text();
           
           $("#viewImg3").attr("href", _img);
       }
    });
    
    $("#btnSave").click(function () {
        $("#formClientsStep1One").jsonSubmit({
             procedure: "clients_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                var _$clientId = $("#clientIds").val();
                var _clientName = $("#client_name").val();
                gClientId = data.returnValue;
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#formClientsStep2").find("#clientId").val(gClientId? gClientId: "");
			        setTimeout(function(){
			            if(_$clientId === ""){
			                $("#newClientModal").modal('toggle');
        			        $("#formClientsStep2").jsonSubmit({
                                 procedure: "admin_user_upd" 
                                ,isSingleEntry: true
                                ,onComplete: function (data) {
                                    var _userId = data.returnValue;
                                    var _firstName = $("#first_name").val();
                                    var _email = $("#logon").val();
                                    var _password = "";
                                    zsi.getData({
                                         sqlCode    : "D1282" 
                                        ,parameters  : {id: _userId} 
                                        ,onComplete : function(d) {
                                            var _rows= d.rows;
                                            
                                            for(var i=0; i < _rows.length;i++ ){
                                                var _info = _rows[i];
                                                _password  +=_info.password;
                                            }
                                        }
                                    });
                                    setTimeout (function(){
                                        $("#clientPassword").val(_userId);
                                        $("#mail_recipients").val(_email);
                                        $("#ename").val(_firstName);
                                        $("#epassword").val(_password);
                                        if(data.isSuccess){
                                           if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                           $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                                           $("#myModal").find("#msg").css("color","green");
                                           $("#formEmail").jsonSubmit({
                                                 procedure: "send_mail_upd" 
                                                ,isSingleEntry: true
                                                ,onComplete: function (data) {
                                                    if(data.isSuccess){
                                                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    }
                                                }
                                            });
                                            setTimeout(function(){
                                               $("#myModal").find("#msg").text("Data successfully saved.");
                                                $("#myModal").find("#msg").css("color","green");
                                                setTimeout(function(){
                                                    $("#myModal").modal('toggle');
                                                    modalTxt();
                                                },1500);
                                            },1500);
                                        }else{
                                           $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                           $("#myModal").find("#msg").css("color","red");
                                           modalTxt();
                                        }
                                    },2000);
                                    
                                }
                            });
			            }else {
			                $("#myModal").find("#msg").text("Data successfully saved.");
                            $("#myModal").find("#msg").css("color","green");
                            setTimeout(function(){
                                $("#myModal").modal('toggle');
                                modalTxt();
                            },1500);
			            }
                        setTimeout (function(){
                            var frm = $("#formClientsStep1Two");
                            var frm1 = $("#formClientsStep1Three");
                            var frm2 = $("#formClientsStep1Four");
                            var  fileOrg1=frm.find("#file1").get(0)
                                ,fileOrg2=frm1.find("#file2").get(0)
                                ,fileOrg3=frm2.find("#file3").get(0);
                        
                            var formData = new FormData( frm.get(0));
                            var formData1 = new FormData( frm1.get(0));
                            var formData2 = new FormData( frm2.get(0));
                            
                            if(isUD(fileOrg1.files[0])){}
                            else {
                                $.ajax({
                                    url: base_url + 'file/UploadImage', 
                                    type: 'POST',
                                    success: completeHandler = function(data) {
                                        if(data.isSuccess){
                                            $.get(base_url  + "sql/exec?p=clients_mayor_pemit_img_upd @client_id=" + (gClientId? gClientId : _$clientId)
                                                        + ",@mayor_permit_img='" +  fileOrg1.files[0].name + "'"
                                            ,function(data){
                                                zsi.form.showAlert("alert");
                                                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                $("#img1").text(fileOrg1.files[0].name);
                                            });
                                            
                                        }else
                                            alert(data.errMsg);
                                    },
                                    error: errorHandler = function() {
                                        console.log("error");
                                    },
                                    data: formData,
                                    cache: false,
                                    contentType: false,
                                    processData: false
                                }, 'json');
                            }
                            if(isUD(fileOrg2.files[0])){}
                            else {
                                $.ajax({
                                    url: base_url + 'file/UploadImage',
                                    type: 'POST',
                            
                                    success: completeHandler = function(data) {
                                        if(data.isSuccess){
                                            $.get(base_url  + "sql/exec?p=clients_bir_img_upd @client_id=" + (gClientId? gClientId : _$clientId)
                                                        + ",@bir_img='" +  fileOrg2.files[0].name + "'"
                                            ,function(data){
                                                zsi.form.showAlert("alert");
                                                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                $("#img2").text(fileOrg2.files[0].name);
                                            });
                                            
                                            
                                        }else
                                            alert(data.errMsg);
                                    },
                                    error: errorHandler = function() {
                                        console.log("error");
                                    },
                                    data: formData1,
                                    cache: false,
                                    contentType: false,
                                    processData: false
                                }, 'json');
                            }
                            if(isUD(fileOrg3.files[0])){}
                            else{
                                $.ajax({
                                    url: base_url + 'file/UploadImage', 
                                    type: 'POST',
                                    success: completeHandler = function(data) {
                                        if(data.isSuccess){
                                            $.get(base_url  + "sql/exec?p=clients_sec_dti_img_upd @client_id=" + (gClientId? gClientId : _$clientId) 
                                                        + ",@sec_dti_img='" +  fileOrg3.files[0].name + "'"
                                            ,function(data){
                                                zsi.form.showAlert("alert");
                                                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                $("#img3").text(fileOrg3.files[0].name);
                                            });
                                            
                                            
                                        }else
                                            alert(data.errMsg);
                                    },
                                    error: errorHandler = function() {
                                        console.log("error");
                                    },
                                    data: formData2,
                                    cache: false,
                                    contentType: false,
                                    processData: false
                                }, 'json');
                            }
                        },2000);
                        
			        },1000);
			       
                }
            }
        });
    });
    
    $("#keyValue").keyup(function(){
       if($(this).val() === "")  displayLoaders();
    });
    
    $("#btnSearch").click(function(){
        var _keyValue = $("#keyValue").val();
        
        displayLoaders(_keyValue);
        
    });
    
    return _pub;
})();      













              