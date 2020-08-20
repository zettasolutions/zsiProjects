  var client = (function(){
    var  _pub = {} 
    
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Consumers Registration");
        $(":input").inputmask(); 
        $("#country_id").dataBind({
            sqlCode     : "D1274"
            ,text       : "country_name"
            ,value      : "country_id" 
            ,onChange   : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                $("#state_id").dataBind({
                     sqlCode    : "D1275"
                    ,parameters : {country_id:country_id}
                    ,text       : "state_name"
                    ,value      : "state_id" 
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        $("#city_id").dataBind({
                             sqlCode      : "D1273"
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id" 
                        });
                    }
                });
            }
        });
    };
      
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    } 
    
    $("#btnSave").click(function (){ 
        var _$frm = $("#formConsumer"); 
        _$frm.jsonSubmit({
             procedure: "zsi_register_consumer_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                _dataId = data.returnValue;  
                if(data.isSuccess){ 
                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    var _frm = $("#formConsumer");
                    var fileOrg=$("#file1").get(0); 
                    var _fileName = fileOrg.files[0].name;
                    var formData = new FormData(_frm.get(0)); 
                    $.ajax({
                        url: base_url + 'file/UploadImage',  //server script to process data
                        type: 'POST', 
                        //Ajax events
                        success: completeHandler = function(data) {
                            if(data.isSuccess) {
                                $.get(base_url  + "sql/exec?p=consumer_image_file_upd @consumer_id=" + _dataId 
                                                + ",@image_filename='" +  _fileName + "'"
                                ,function(data){   
                                    _frm.find("input,select").val(""); 
                                    _frm.removeClass('was-validated'); 
                                    $("#myModal").find("#msg").text("Data successfully saved.");
                                    $("#myModal").find("#msg").css("color","green");
                                    $("#myModal").toggle();
                                });               
                
                            }else {
                                alert(data.errMsg);
                            }
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
            } 
        });   
    });
    $("#btnSubmit").click(function(){
        var _$frmStep1 = $("#formConsumer"); 
        var _frmStep1 = _$frmStep1[0];    
        if( ! _frmStep1.checkValidity()){
            _$frmStep1.addClass('was-validated'); 
        }else{   
            $('#myModal').modal('show');
        }
    });
    $("#chkbx").click(function(){ 
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    });
    $("#btnNewConsumers").click( function() {
        var _$mdl = $('#newConsumersModal');
        var _$frm = _$mdl.find("form");   
        _$frm.removeClass('was-validated'); 
        _$frm.find("input").val("");
        _$mdl.modal('show');
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
    });
    return _pub;
})();                                                   