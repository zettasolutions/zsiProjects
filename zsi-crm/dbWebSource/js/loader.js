 var loader = (function(){
    var _pub         = {}
        gClientId    = null
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Load Merchant");
        $(":input").inputmask();
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
    
    function displayLoaders(){
        $("#gridLoaders").dataBind({
             sqlCode     : "L1280"
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
            ]
            ,onComplete  : function(o){
                
            }
        });
    }
    
    function checkValueExist(tableName,colName,keyWord,inputId){
        zsi.getData({
             sqlCode    : "C1295" 
            ,parameters  : {table_name: tableName, colname: colName, keyword: keyWord} 
            ,onComplete : function(d) {
                var _rows= d.rows;
                
                $('#popEmailAdd').popover("hide", 400);
                $('#popLogonAdd').popover("hide", 400);
                
                if(_rows.length === 1) {
                    
                    $(inputId).val("");
                    
                    if(inputId === "#client_email_add") $('#popEmailAdd').popover("show", 400);
                    else $('#popLogonAdd').popover("show", 400);
                    
                }
            }
        });
    }
    
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
       var _colName    = $(this)[0].id;
       var _img = "";
       if(_colName === "viewImg1"){
           _img = $("#img1").text();
           
           $("#viewImg1").attr("href","/file/viewImage?fileName=" + _img);
       }else if(_colName === "viewImg2"){
           _img = $("#img2").text();
           
           $("#viewImg2").attr("href","/file/viewImage?fileName=" + _img);
       }else{
           _img = $("#img3").text();
           
           $("#viewImg3").attr("href","/file/viewImage?fileName=" + _img);
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
    
    return _pub;
})();      













          