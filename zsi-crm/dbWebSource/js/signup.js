var signup = (function(){
    var _pub         = {}
        ,gClientId   = null
        ,gCtr        = 1
    ;
    
    zsi.ready = function(){
        $(".pageTitle").remove();
        $(":input").inputmask();
        displaySelects();
    };
    
    function displaySelects() {
        if($(window).height() <= 724) $("#clientInformationDiv").css({"height":$(window).height() - 290,"overflow-y":"auto","overflow-x":"hidden"});
        var _$country = $('#country_id')
            ,_$state = $('#state_id')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            ,_$city = $('#city_id');
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true});
        _$state.select2({placeholder: "",allowClear: true});
        _$city.select2({placeholder: "",allowClear: true});
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
    }
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#is_ready").click(function(){
        var _$this = $(this);
        var _$frmStep1 = $("#formClientsStep1One")
            _$frmStep2 = $("#formClientsStep2")
        var _frmStep1 = _$frmStep1[0]
            _frmStep2 = _$frmStep2[0];
            
        if(_$this.is(":checked")){
            if( ! _frmStep1.checkValidity()){
                _$frmStep1.addClass('was-validated');
                _$this.prop('checked', false);
            }else{   
                $("#clientInformationDiv").hide(600);
                $("#adminUserDiv").show(600);
            }
        }else{
            if( ! _frmStep2.checkValidity()){
                _$frmStep2.addClass('was-validated');
                $("#formClientsCB").addClass('was-validated');
                $("#clientInformationDiv").show(600);
                $("#adminUserDiv").hide(600);
            }else{ 
                _$frmStep1.addClass('was-validated');
                $("#formClientsCB").removeClass('was-validated');
                $("#clientInformationDiv").show(600);
                $("#adminUserDiv").hide(600);
            }
        } 
    });
    
    $("#btnSubmit").click(function(){
        console.log("asdadsa");
        var _$frmStep1 = $("#formClientsStep1One")
            ,_$frmStep2 = $("#formClientsStep2");
            
        var _frmStep1 = _$frmStep1[0]
            ,_frmStep2 = _$frmStep2[0];
        
        if( ! _frmStep1.checkValidity()){
            $("#formClientsStep1One").addClass('was-validated');
        }else if( ! _frmStep2.checkValidity()){
            $("#formClientsStep2").addClass('was-validated');
            $("#formClientsCB").addClass('was-validated');
        }else{   
            $('#myModal').modal('show');
        }
    });
    
    
    $("#btnConfirm").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
        $("#formClients").find("input,select").val("");
    });
    
    $("#btnSave").click(function () {
        $("#formClientsStep1One").jsonSubmit({
             procedure: "clients_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                var _clientName = $("#client_name").val();
                gClientId = data.returnValue;
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#formClientsStep2").find("#clientId").val(gClientId);
                    $("#newClientModal").modal('toggle');
			        setTimeout(function(){
    			        $("#formClientsStep2").jsonSubmit({
                             procedure: "admin_user_upd" 
                            ,isSingleEntry: true
                            ,onComplete: function (data) {
                                var _userId = data.returnValue;
                                var _firstName = $("#first_name").val();
                                var _email = $("#logon").val();
                                $("#clientPassword").dataBind({
                                    sqlCode    : "D1282" 
                                   ,text       : "password"
                                   ,value      : "user_id"
                                   ,onComplete : function(){
                                       $(this).val(_userId);
                                   }
                                });
                                 setTimeout (function(){
                                    $("#clientPassword").val(_userId);
                                    var _password = $("#clientPassword").find('option:selected').text();
                                    $("#mail_recipients").val(_email);
                                    $("#ename").val(_firstName);
                                    $("#epassword").val(_password);
                                    if(data.isSuccess){
                                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                       _$frm.removeClass('was-validated');
                                       $(".yesno").addClass("hide");
                                       $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                                       
                                       $("#myModal").find("#msg").css("color","green");
                                       
                                       $("#btnConfirm").attr("onclick", "client.showModalContracts(this, '', '', '"+ _clientName +"', '', "+ gClientId +")");
                                       $(".continuecancel").removeClass("hide");
                                       
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
                                           $("#myModal").find("#msg").text("Do you want to create contract(s) for this client?");
                                           $("#myModal").find("#msg").css("color","#000");
                                        },1500);
                                    }else{
                                       $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                       $("#myModal").find("#msg").css("color","red");
                                       modalTxt();
                                    }
                                },2000);
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
                                            url: base_url + 'file/UploadImage',  //server script to process data
                                            type: 'POST',
                                    
                                            //Ajax events
                                            success: completeHandler = function(data) {
                                                if(data.isSuccess){
                                                    //submit filename to server
                                                    $.get(base_url  + "sql/exec?p=clients_mayor_pemit_img_upd @client_id=" + gClientId
                                                                + ",@mayor_permit_img='" +  fileOrg1.files[0].name + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
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
                                    }
                                    if(isUD(fileOrg2.files[0])){}
                                    else {
                                        $.ajax({
                                            url: base_url + 'file/UploadImage',  //server script to process data
                                            type: 'POST',
                                    
                                            //Ajax events
                                            success: completeHandler = function(data) {
                                                if(data.isSuccess){
                                                    //submit filename to server
                                                    $.get(base_url  + "sql/exec?p=clients_bir_img_upd @client_id=" + gClientId
                                                                + ",@bir_img='" +  fileOrg2.files[0].name + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    });
                                                    
                                                    
                                                }else
                                                    alert(data.errMsg);
                                            },
                                            error: errorHandler = function() {
                                                console.log("error");
                                            },
                                            // Form data
                                            data: formData1,
                                            //Options to tell JQuery not to process data or worry about content-type
                                            cache: false,
                                            contentType: false,
                                            processData: false
                                        }, 'json');
                                    }
                                    if(isUD(fileOrg3.files[0])){}
                                    else{
                                        $.ajax({
                                            url: base_url + 'file/UploadImage',  //server script to process data
                                            type: 'POST',
                                    
                                            //Ajax events
                                            success: completeHandler = function(data) {
                                                if(data.isSuccess){
                                                    //submit filename to server
                                                    $.get(base_url  + "sql/exec?p=clients_sec_dti_img_upd @client_id=" + gClientId
                                                                + ",@sec_dti_img='" +  fileOrg3.files[0].name + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    });
                                                    
                                                    
                                                }else
                                                    alert(data.errMsg);
                                            },
                                            error: errorHandler = function() {
                                                console.log("error");
                                            },
                                            // Form data
                                            data: formData2,
                                            //Options to tell JQuery not to process data or worry about content-type
                                            cache: false,
                                            contentType: false,
                                            processData: false
                                        }, 'json');
                                    }
                                },2000);
                            }
                        }); 
                        
			        },1000);
			       
                }
            }
        });
    });
    
    return _pub;
})();                  