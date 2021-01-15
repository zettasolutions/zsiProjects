var companyInfo = (function(){
    var _getData
        slideIndex = 1
        _pub = {}
    ;
    zsi.ready = function(){
        $(".page-title").html("Company Profile");
        $(".pageTitle").remove();
        getParams();
        
        if(app.userInfo.company_id === 0){
            $("#companyLogo").attr({src: base_url + 'img/logo.png'});
            $("#logoImg").attr({src: base_url + 'img/logo.png'});
        }
        else {
            $("#companyLogo").attr({src: base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/company_logo" }); 
            $("#mayorPermit").attr({src: base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/mayor_permit_img" }); 
            $("#birId").attr({src: base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/bir_img" }); 
            $("#dtiId").attr({src: base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/sec_dti_img" }); 
        }
        if(app.userInfo.is_admin === 'Y') {
            $("#btnUpdate").removeAttr('disabled');
            $("#uploadLogs").removeAttr('disabled');
            $("#myModalViewImg").find(".modal-footer").find("button").removeAttr('disabled');
        }else{
            $("#btnUpdate").attr('disabled',true);
            $("#uploadLogs").attr('disabled',true);
            $("#myModalViewImg").find(".modal-footer").find("button").attr('disabled',true);
        }
        $("#bg").css({"background-image":base_url +"images/high-banner.jpg"});
    };  
    
    _pub.plusSlides = function(n) {
        showSlides(slideIndex += n);
    },
    
    _pub.currentSlide = function(n) {
        showSlides(slideIndex = n);
    };
    _pub.uploadMayorPermit = function(){
        _sqlCode = "C261";
        _gEmpId = null;
        $("#myModalViewUploadImg").find("#image").cropper(options).attr({src: base_url + 'images/no-image3.jpg' }); 
        $("#myModalViewUploadImg").modal('show');
    };
    _pub.uploadBir = function(){
        _sqlCode = "C259";
        _gEmpId = null;
        $("#myModalViewUploadImg").find("#image").cropper(options).attr({src: base_url + 'images/no-image3.jpg' }); 
        $("#myModalViewUploadImg").modal('show');
    };
    _pub.uploadDti = function(){
        _sqlCode = "C262";
        _gEmpId = null;
        $("#myModalViewUploadImg").find("#image").cropper(options).attr({src: base_url + 'images/no-image3.jpg' }); 
        $("#myModalViewUploadImg").modal('show');
    };
    
    function showSlides(n) {
        var _$mdl = $("#myModalViewImg").find(".modal-footer");
        var i;
        var slides = document.getElementsByClassName("mySlides");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        if(slideIndex===1) {
            _$mdl.find("button").attr("onclick","companyInfo.uploadMayorPermit()");
            $("#myModalViewImg").find(".modal-title").text("Mayor's Permit");
        }
        if(slideIndex===2) {
            _$mdl.find("button").attr("onclick","companyInfo.uploadBir()");
            $("#myModalViewImg").find(".modal-title").text("BIR");
        }
        if(slideIndex===3) {
           _$mdl.find("button").attr("onclick","companyInfo.uploadDti()"); 
           $("#myModalViewImg").find(".modal-title").text("SEC/DTI");
        }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        
        setTimeout(function(){
            slides[slideIndex-1].style.display = "block";
        },10);
      
    }
    
    function getParams(){
        zsi.getData({
             sqlCode    : "C254"
            ,parameters : {client_id:app.userInfo.company_id}
            ,onComplete : function(d){
                var _rows = d.rows[0];
                var _isFmis = _rows.is_fmis === "Y"? "FMIS" : "";
                var _isAfcs = _rows.is_afcs === "Y"? "AFCS" : "";
                var _isHcm = _rows.is_hcm === "Y"? "HCM" : "";
                var _isCt = _rows.is_ct === "Y"? "CT" : "";
                var _apps = _isHcm + (_isAfcs? ", "+_isAfcs:"") + (_isFmis? ", "+_isFmis:"") + (_isCt? " & "+_isCt:"");
                $("#cName").text(_rows.client_name);
                $("#lclient_name").text(_rows.client_name);
                $("#lclient_email_add").text(_rows.client_email_add);
                $("#lbank_id").text(_rows.bank_name);
                $("#lbank_acct_no").text(_rows.bank_acct_no);
                $("#lclient_tin").text(_rows.client_tin);
                $("#lclient_phone_no").text(_rows.client_phone_no);
                $("#lclient_mobile_no").text(_rows.client_mobile_no);
                $("#lbill_to").text(_rows.bill_to);
                $("#lbilling_address").text(_rows.billing_address);
                $("#lapplications").text(_apps);
                
                _getData = _rows;
            }
        });
    }
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    $("#viewImgsId,#viewMayorPermitImg,#viewBirImg,#viewImgDtiImg").click(function(){
        var _colName = $(this)[0].id;
        var _arr = [];
        var _ojb = {};
        var _h = "";
        $("#myModalViewImg").find(".modal-body").html("");
        $("#myModalViewImg").find(".modal-footer").html("");
        if(_colName === "viewImgsId") _arr.push({img_src:base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/company_logo"});
        else{
            _arr.push(
                 {img_src:base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/mayor_permit_img",title: "Mayor's Permit"}
                ,{img_src:base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/bir_img",title: "BIR"}
                ,{img_src:base_url + 'dbimage/ref-0010/client_id/' + app.userInfo.company_id + "/sec_dti_img",title: "SEC/DTI"}
            );
            $("#myModalViewImg").find(".modal-footer").append('<div class="row col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"><button class="btn btn-primary btn-sm hvr-sweep-to-left" type="button"><i class="fas fa-upload"></i> Update Photo</button></div>');
        }
        for(var i=0; i<_arr.length;i++){
            var _info = _arr[i];
            
            if(_colName === "viewImgsId"){
                _h = '<div class="bg-image"></div>'
                    +'<div class="col-sm-12 col-md-12 col-12 mb-2 justify-content-center d-flex bg-text">'
                    +'  <img class="viewImages" src="'+_info.img_src+'" aria-roledescription="logo" style="width:500px;">'
                    +'</div>'
                ;
                $("#myModalViewImg").find(".modal-title").text("Company Logo");
                $("#myModalViewImg").find(".modal-body").append(_h);
            }else{
                _h = '<div class="col-sm-12 col-md-12 col-12 mb-2 justify-content-center d-flex d-none bg-text">'
                    +'  <img src="'+_info.img_src+'" class="viewImages" style="width:500px;">'
                    +'</div>'
                ;
                
                $("#myModalViewImg").find(".modal-body")
                .append('<div class="container">'
                    +   '<div class="mySlides"><div class="bg-image"></div>'
                    +       _h
                    +       '<a class="prev" onclick="companyInfo.plusSlides(-1)">&#10094;</a>'
                    +       '<a class="next" onclick="companyInfo.plusSlides(1)">&#10095;</a>'
                    +   '</div'
                    +'</div>'
                );
                if(_colName === "viewMayorPermitImg") slideIndex = 1;
                if(_colName === "viewBirImg") slideIndex = 2;
                if(_colName === "viewImgDtiImg") slideIndex = 3;
                showSlides(slideIndex);
            }    
            
        }
        $("#myModalViewImg").modal('show');
    });
    $("#uploadLogs").click(function(){
        _sqlCode = "C260";
        _gEmpId = null;
        $("#myModalViewUploadImg").find("#image").cropper(options).attr({src: base_url + 'images/no-image3.jpg' }); 
        $("#myModalViewUploadImg").modal('show');
    });
    
    $("#btnUpdate").click(function(){
        var _$mdl = $('#newClientModal');
        var _o = _getData;
        var _frm = $("#formClientsStep2");
        gActiveTab = "new";
        $(".popover ").hide();
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id');
        if(_o.is_fmis === 'Y'){ 
            _$mdl.find("#pms_km").val(_o.pms_km? _o.pms_km : "");
            _$mdl.find("#pmsDiv").removeClass("d-none");
        }
        $("#formClientsStep1One").removeClass('was-validated');
        $("#formClientsStep2").removeClass('was-validated');
        _$mdl.find("#client_name").val(_o.client_name? _o.client_name : "");
        _$mdl.find("#client_phone_no").val(_o.client_phone_no? _o.client_phone_no : "");
        _$mdl.find("#client_mobile_no").val(_o.client_mobile_no? _o.client_mobile_no : "");
        _$mdl.find("#client_email_add").val(_o.client_email_add? _o.client_email_add : "");
        _$mdl.find("#billing_address").val(_o.billing_address? _o.billing_address : "");
        _$mdl.find("#client_tin").val(_o.client_tin? _o.client_tin : "");
        _$mdl.find("#bill_to").val(_o.bill_to? _o.bill_to : "");
        _$mdl.find("#bank_acct_no").val(_o.bank_acct_no? _o.bank_acct_no : "");
        _$mdl.find("#clientIds").val(_o.client_id? _o.client_id : "");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").dataBind({
             sqlCode     : "D258"
            ,text        : "bank_name"
            ,value       : "bank_id"
            ,onComplete : function(){
                this.val(_o.bank_id? _o.bank_id : "").trigger("change");
            }
        });
        _$country.dataBind({
            sqlCode     : "D256"
            ,text       : "country_name"
            ,value      : "country_id"
            ,onComplete : function(){
                this.val(_o.country_id? _o.country_id : 139).trigger("change");
            }
            ,onChange   : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                _$state.dataBind({
                     sqlCode    : "D257"
                    ,parameters : {country_id:country_id}
                    ,text       : "state_name"
                    ,value      : "state_id"
                    ,onComplete : function(){
                        this.val(_o.state_id? _o.state_id : "").trigger("change");
                    }
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                             sqlCode      : "D255"
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id"
                            ,onComplete : function(){
                                this.val(_o.city_id? _o.city_id : "").trigger("change");
                            }
                        });
                    }
                });
            }
        });
        
        _$mdl.modal('show');
    });
    
    $("#btnSubmit").click(function(){
        var _$frmStep1 = $("#formClientsStep1One");
        var _frmStep1 = _$frmStep1[0];
            
        if( ! _frmStep1.checkValidity()){
            _$frmStep1.addClass('was-validated');
        }else $('#myModal').modal('show');
        
    });
    
    $("#btnSave").click(function (){
        $("#formClientsStep1One").jsonSubmit({
             procedure: "clients_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
			        $("#myModal").find("#msg").text("Data successfully saved.");
                    $("#myModal").find("#msg").css("color","green");
                    setTimeout(function(){
                        $("#myModal").modal('toggle');
                        $("#newClientModal").modal('toggle');
                        modalTxt();
                        getParams();
                    },1500);
                }else{
                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                   $("#myModal").find("#msg").css("color","red");
                   modalTxt();
                }
            }
        });
    });
    
    return _pub;
})();                