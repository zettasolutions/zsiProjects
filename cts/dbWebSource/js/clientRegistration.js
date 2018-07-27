zsi.ready(function() {
    var gForm1Data = [];
    (function() {
        var _$form1             = $("#registration1-form");
        var _$btnNext           = $("#btnNext");
        var _$secTab            = $("#second-tab");
        var _$inputs            = _$form1.find("input.validate");
        var _$txtClientName     = _$inputs.eq(0);
        var _$txtClientAddress  = _$inputs.eq(1);
        var _$txtClientContact  = _$inputs.eq(2);
        var _$txtContName       = _$inputs.eq(3);
        var _$txtContMobile     = _$inputs.eq(4);
        
        var _$invalidFeedback   = _$form1.find(".invalid-feedback");
        var _$ifClientName      = _$invalidFeedback.eq(0);
        var _$ifClientAddress   = _$invalidFeedback.eq(1);
        var _$ifClientContact   = _$invalidFeedback.eq(2);
        var _$ifContName        = _$invalidFeedback.eq(3);
        var _$ifContMobile      = _$invalidFeedback.eq(4);
        
        _$txtClientName.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifClientName.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifClientName.text('Enter company name.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtClientAddress.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifClientAddress.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifClientAddress.text('Enter company address.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtClientContact.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifClientContact.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifClientContact.text('Enter contact no.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtContName.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifContName.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifContName.text('Enter contact name.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtContMobile.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifContMobile.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifContMobile.text('Enter contact mobile no.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        function hasInvalid() {
            var _hasInvalid = false;
            for (var i = 0,length = _$inputs.length; i < length; i++) {
                if (_$inputs.eq(i).attr("valid") !== "true") { _hasInvalid = true; break; }
            }
            if ( ! _hasInvalid) {
                _$btnNext.removeAttr("disabled");
                _$secTab.removeClass("disabled");
            } else {
                _$btnNext.attr("disabled","disabled");
                _$secTab.addClass("disabled");
            }
        }
    })();
    
    (function() {
        var _$form2             = $("#registration2-form");
        var _$btnSignup         = $("#btnSignup");
        var _$inputs            = _$form2.find("input.validate");
        var _$txtLastname       = _$inputs.eq(0);
        var _$txtFirstname      = _$inputs.eq(1);
        var _$txtEmail          = _$inputs.eq(2);
        var _$txtLandline       = _$inputs.eq(3);
        var _$txtMobile         = _$inputs.eq(4);
        var _$txtLogon          = _$inputs.eq(5);
        var _$txtPassword       = _$inputs.eq(6);
        var _$txtCPassword      = _$inputs.eq(7);
        
        var _$invalidFeedback   = _$form2.find(".invalid-feedback");
        var _$ifLastname        = _$invalidFeedback.eq(0);
        var _$ifFirstname       = _$invalidFeedback.eq(1);
        var _$ifEmail           = _$invalidFeedback.eq(2);
        var _$ifLandline        = _$invalidFeedback.eq(3);
        var _$ifMobile          = _$invalidFeedback.eq(4);
        var _$ifLogon           = _$invalidFeedback.eq(5);
        var _$ifPassword        = _$invalidFeedback.eq(6);
        var _$ifCPassword       = _$invalidFeedback.eq(7);
        
        _$txtLastname.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifLastname.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifLastname.text('Enter last name.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtFirstname.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifFirstname.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifFirstname.text('Enter first name.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtEmail.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifEmail.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifEmail.text('Enter email address.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtLandline.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifLandline.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifLandline.text('Enter landline no.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtMobile.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifMobile.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifMobile.text('Enter mobile no.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtLogon.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifLogon.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifLogon.text('Enter username.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtPassword.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifPassword.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifPassword.text('Enter password.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        _$txtCPassword.on('keyup', function() {
            var _value = this.value;
            
            if (_value !== "") {
                _$ifCPassword.hide();
                this.setAttribute("valid","true");
            } else {
                _$ifCPassword.text('Confirm password.').show();
                this.setAttribute("valid","false");
            }
            hasInvalid();
        });
        
        function hasInvalid() {
            var _hasInvalid = false;
            for (var i = 0,length = _$inputs.length; i < length; i++) {
                if (_$inputs.eq(i).attr("valid") !== "true") { _hasInvalid = true; break; }
            }
            if ( ! _hasInvalid)
                _$btnSignup.removeAttr("disabled");
            else
                _$btnSignup.attr("disabled","disabled");
        }
        
        $(document).ready(function() {
            $("#btnNext").click(function() {
                $('#registration-tab a[href="#second-pane"]').tab('show');
                gForm1Data = $("#registration1-form").serializeArray();
            });
            
            _$btnSignup.click(function(e) {
                $.ajax({
                    type: 'POST'
                    ,url: procURL + "client_reg_upd @client_name='"+_form1Data[0].value+"',@address='"+_form1Data[1].value+"',@client_number='"+_form1Data[2].value+"',@contact_name='"+_form1Data[3].value+"',@mobile_no='"+_form1Data[4].value+"'"
                    ,contentType: 'application/json'
                    ,success : function(d) {
                        _$form2.find("#client_id").val(d.returnValue);
                        
                        $.get(base_url+ 'public/encrypt?text='+_$form2.find("#password").val()+'', function(d) {
                            _$form2.find("#password").val(d);
                            $("#registration2-form").jsonSubmit({
                                 procedure  : "client_admin_upd"
                                ,onComplete : function (data) {
                                    if(data.isSuccess===true) zsi.form.showAlert("progressWindow");
                                }
                            });
                        });
                    }
                });
                
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        });
    })(); 
});