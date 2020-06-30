 var signup = (function(){
    var _pub         = {}
        gClientId    = null
    ;
    
    zsi.ready = function(){
        $(".pageTitle").remove();
        $(":input").inputmask();
        displaySelects();
    };

    $("#btnSubmit").click(function(){ 
        var forms = document.getElementsByClassName('needs-validation'); 
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
    		    $("form").removeClass('was-validated');
    			if (form.checkValidity() === false) {
    				event.preventDefault();
    				event.stopPropagation();
    			    $("form").addClass('was-validated');
    			}else{
        			event.preventDefault();
        			event.stopPropagation();
    			    $('#myModal').modal('show');
    			    $("form").addClass('was-validated');
    			}
    		}, false);
    	});
    	
    });
    
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
    
    $("#is_ready").click(function(){
       if($(this).is(":checked")){
           $("#clientInformationDiv").toggle("top");
           $("#adminUserDiv").toggle("top");
       }else{
           $("#clientInformationDiv").toggle("down");
           $("#adminUserDiv").toggle("down");
       } 
    });
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#btnConfirm").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
        $("#formClients").find("input,select").val("");
    });
    
    $("#btnSave").click(function () {
        var _$div1 = $("#clientInformationDiv");
        var _$div2 = $("#adminUserDiv");
        _$div2.find("input,select").attr("disabled", true);
        var _$frm = $("#formClients"); 
        _$frm.jsonSubmit({
             procedure: "clients_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                gClientId = data.returnValue;
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    _$div1.find("input,select").attr("disabled", true);
                    _$div2.find("input,select").removeAttr("disabled");
                    _$frm.find("#clientId").val(gClientId);
                    $("#newClientModal").modal('toggle');
                    displayClients();
			        setTimeout(function(){
    			        _$frm.jsonSubmit({
                             procedure: "admin_user_upd" 
                            ,isSingleEntry: true
                            ,onComplete: function (data) {
                                console.log("data",data);
                                var _userId = data.returnValue;
                                var _firstName = $("#first_name").val();
                                var _email = $("#logon").val();
                                $("#clientPassword").dataBind({
                                    sqlCode    : "D1282" //dd_clients_password_sel
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
                                    $("#mail_body").val('Hi '+_firstName+'! Thank you for signing up on our website. Your logon password is ' + _password);
                                    if(data.isSuccess){
                                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                       _$frm.removeClass('was-validated');
                                       $(".yesno").addClass("hide");
                                       $("#myModal").find("#msg").text("Data successfully saved. Please check your email for your password.");
                                       $("#myModal").find("#msg").css("color","green");
                                       $("#btnConfirm").removeClass("hide");
                                       _$div1.find("input,select").removeAttr("disabled");
                                       
                                       $("#formEmail").jsonSubmit({
                                             procedure: "send_mail_upd" 
                                            ,isSingleEntry: true
                                            ,onComplete: function (data) {
                                                if(data.isSuccess){
                                                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                }
                                            }
                                        });
                                    }else{
                                       $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                       $("#myModal").find("#msg").css("color","red");
                                       modalTxt();
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