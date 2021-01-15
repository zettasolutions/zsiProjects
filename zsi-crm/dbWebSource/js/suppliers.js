  var supplier = (function(){
    var _pub = {}  
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Suppliers"); 
        displaySuppliers();
        $(":input").inputmask();
    };
    
    _pub.submitNewSupplier = function(){
        event.preventDefault();    
    };
    
    function displaySuppliers(searchVal){
        $("#gridSuppliers").dataBind({
             sqlCode     : "S278"
            ,parameters  : {search_val : searchVal? searchVal: ""}
            ,height      : $(window).height() - 248
            ,dataRows    : [
                {text: "Code", width: 150, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"supplier_code");
                    }
                }
                ,{text: "Name", width : 150, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"supplier_name");
                    }
                }
                ,{text: "Phone No.", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"supplier_phone_no");
                    }
                }
                ,{text: "Mobile No.", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"supplier_mobile_no");
                    }
                }
                ,{text: "Email Address", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"supplier_email_add");
                    }
                }
                ,{text: "Billing Address", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"billing_address");
                    }
                }
                ,{text: "Country", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"country");
                    }
                }
                ,{text: "State", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"state");
                    }
                }
                ,{text: "City", width: 150, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"city");
                    }
                }
            ]
            ,onComplete  : function(o){
                
            }
        });
    }
    
    $("#btnSubmit").click(function () {
        var _$frm = $("#formSupplier");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            $("#formSupplier").addClass('was-validated');
        }else{   
            $("#formSupplier").removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
    
    $("#btnNew").click(function() {
        var _$mdl = $("#modalWindowSupplier");
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id'); 
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$country.dataBind({
            sqlCode : "D247" 
            ,text : "country_name"
            ,value : "country_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                _$state.dataBind({
                    sqlCode : "D248" 
                    ,parameters : {country_id:country_id}
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                            sqlCode      : "D246" 
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
    
    $("#btnSaveSupplier").click(function () {
        $("#formSupplier").jsonSubmit({
             procedure: "suppliers_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                console.log("data",data);
                if(data.isSuccess){
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  $("#formSupplier").find("input").val("");
                  $("#formSupplier").find("textarea").val("");
                  $("#formSupplier").find("select").val(null).trigger('change');
                  $("#myModal").find("#msg").text("Data successfully saved.");
                  $("#myModal").find("#msg").css("color","green");
                  $("#gridSuppliers").trigger("refresh");
                  $('#formSupplier').removeClass('was-validated');
                  modalTxt();
                  setTimeout(function(){
                      $("#myModal").modal('toggle');
                  },1000);
                }else{
                  $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                  $("#myModal").find("#msg").css("color","red");
                  modalTxt();
                }
            }
        }); 
    });
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#keyValue").keyup(function(){
       if($(this).val() === "")  displaySuppliers();
    });
    
    $("#btnSearch").click(function(){
        var _keyValue = $("#keyValue").val();
        
        displaySuppliers(_keyValue);
        
    });
    
    return _pub;
})();                