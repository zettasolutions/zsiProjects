zsi.ready(function() {
    var _$validateDiv   = $("#validate-div")
        ,_$successDiv    = $("#success-div")
        ,_$btnSubmit     = $("#btnSubmit")
        ,_$pword         = $("#password")
        ,_$cpword        = $("#cpassword")
    ;
    
    _$cpword.prop('disabled', true);
    _$btnSubmit.attr("disabled", "disabled");
    
    _$pword.on("keyup", function(){
        _$cpword.prop('disabled', false);
    });
    
    _$cpword.on("keyup", function(){
        _$btnSubmit.removeAttr("disabled");
       
    });
         
    _$btnSubmit.click(function() {
        validatePassword();
    });
    
    function validatePassword() {
        if(_$pword.val() === _$cpword.val()){
            _$validateDiv.hide();
            _$successDiv.show();
        }else{
            alert("Enter Confirm Password Same as Password");
        }
    }    
});   