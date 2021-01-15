var banks = (function(){
    var _pub = {}  
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull
        ,gtw                = null
        ,mdlUploadLogo      = "modalWindowUploadLogo"
        ,gBankId            = null
        ,gId                = null
        ,gRowsLength        = null
    ;
    
    zsi.ready = function(){
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Banks"); 
        displaySuppliers();
        getTemplates();
        $(":input").inputmask();
    };
    
    _pub.submitNewSupplier = function(){
        event.preventDefault();    
    };
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : mdlUploadLogo 
            , title     : "Inactive Employee(s)"
            , body      : "" 
            , footer    : '<div class="col-11 ml-auto"><button type="button" onclick="banks.uploadImageEmpl(this);" class="btn btn-primary"><span class="fas fa-file-upload"></span> Upload</button>'
        });
    }
    
    function displaySuppliers(searchVal){
        $("#gridBanks").dataBind({
             sqlCode     : "B1324"
            ,height      : $(window).height() - 248
            ,blankRowsLimit : 5
            ,dataRows    : [
                { text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{ text:"Logo"             , width:40      , style:"text-align:center;" 
        		    ,onRender : function(d){ 
                        var image_url = base_url + "dbimage/ref-00017/bank_id/"+ app.svn(d,"bank_id") + "/bank_logo" +"?ts=" + new Date().getTime();                               
                        var mouseMoveEvent= "onmouseover='banks.mouseover(\"" + image_url  + "\");' onmouseout='banks.mouseout();'";  
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='banks.showModalUploadEmplImage(" + svn(d,"bank_id") +",\"" 
    		                           + svn(d,"bank_code") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
                ,{text:"Bank Code"            ,width:100         ,style:"text-align:center"
                    ,onRender : function(d){
                        return app.bs({name:"bank_id"               ,type:"hidden"      ,value: app.svn(d,"bank_id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                             + app.bs({name:"bank_code"             ,type:"input"       ,value: app.svn(d,"bank_code") });
                    } 
                }
                ,{text:"Bank Name"              ,type:"input"       ,name:"bank_name"           ,width:500        ,style:"text-align:left"}
                ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:60         ,style:"text-align:left"      ,defaultValue: "Y"}
                
            ]
            ,onComplete  : function(o){
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            gId = _data.bank_id;
    	            $("#modalWindowBank").find("#userTitle").text("Add user for " + _data.bank_code);
    	            $("#bank_id").val(_data.bank_id);
                });
            }
        });
    }
    
    function displayInactiveBanks(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveBanks").dataBind({
             sqlCode     : "B1324"
            ,parameters  : {is_active:'N'}
            ,height      : 400
            ,dataRows    : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"bank_id"               ,type:"hidden"      ,value: app.svn(d,"bank_id")})
                                + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" ); }
                }
                ,{text:"Bank Code"            ,width:235         ,style:"text-align:center"
                    ,onRender : function(d){
                        return app.bs({name:"bank_code"             ,type:"input"       ,value: app.svn(d,"bank_code") })
                             + app.bs({name:"bank_name"             ,type:"hidden"      ,value: app.svn(d,"bank_name")}) ;
                    } 
                }
                ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:60         ,style:"text-align:left"      ,defaultValue: "Y"}
                
            ]
            ,onComplete  : function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveBanks input[name='cb']");
            }
        });
    }
    
    function randomPassword(){
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < 10; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }
    
    function encryptedPassword(password){
        var url = base_url + "account/getnewpassword?pwd=" + password;
        
        $.get(url,function(data){
           $("#password").val(data);
        });
    }
    
    function checkValueExist(tableName,colName,keyWord){
        zsi.getData({
             sqlCode    : "C1295" 
            ,parameters  : {table_name: tableName, colname: colName, keyword: keyWord} 
            ,onComplete : function(d) {
                var _rows= d.rows;
                gRowsLength = _rows.length;
                if(_rows.length >= 1) {
                    $('#popLogonAdd').popover("show", 400);
                }else {
                    setTimeout(function(){
                        $('#popLogonAdd').popover("hide", 500);
                    });
                }
            }
        });
    }
    
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
                        $.get(base_url  + "sql/exec?p=bank_logo_upd @bank_id=" + gBankId+ ",@tmp_file_id='" +  data.tmp_file_id + "'"
                        ,function(data){
                            zsi.form.showAlert("alert");
                            setTimeout(function(){ 
                                $('#gridBanks').trigger( 'refresh' );    
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
    
    _pub.mouseover = function(img_url){
        $("#user-box").css("display","block"); 
        $("#userImage").attr("src",img_url);
        
    },
    
    _pub.mouseout = function (){
        $("#user-box").css("display","none");
    },
    
    $("#logon").on("keyup", function(){
        var _logonEmailAdd = $(this).val();
        var tmr;
        clearTimeout(tmr);
		tmr = setTimeout(
		function(){
			checkValueExist("users","logon",_logonEmailAdd);
		},600);
    });
    
    $("#btnSubmit").click(function () {
        var _$frm = $("#formBankUser");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            _$frm.addClass('was-validated');
        }else if(gRowsLength >= 1) {
            $('#popLogonAdd').popover("show", 400);
        }else{   
            _$frm.removeClass('was-validated');
            
            $(".yesno").show();
            $('#myModal').modal('show');
        }
    });
    
    $("#btnAddUser").click(function() {
        var _$mdl = $("#modalWindowBank");
        if(gId){
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
            _$mdl.find(".modal-footer").addClass("justify-content-start");
        }if(!gId) alert("Please select radio button to proceed.");
    });
    
    $("#btnInactiveBank").click(function () {
        $(".modal-title").text("Inactive Banks");
        displayInactiveBanks();
        $('#modalInactiveBanks').modal({ show: true, keyboard: false, backdrop: 'static' });
    }); 
    
    $("#btnSaveUser").click(function () {
        $("#formBankUser").jsonSubmit({
             procedure: "admin_user_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                var _userId = data.returnValue;
                var _firstName = $("#first_name").val();
                var _email = $("#logon").val();
                var _password = randomPassword();
                encryptedPassword(_password);
                setTimeout (function(){
                    $("#mail_recipients").val(_email);
                    $("#ename").val(_firstName);
                    $("#epassword").val(_password);
                    if(data.isSuccess){
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                       $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                       $("#myModal").find("#msg").css("color","green");
                       $(".yesno").hide();
                       
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
                            $("#modalWindowBank").modal('toggle');
                        },1000);
                    }else{
                       $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                       $("#myModal").find("#msg").css("color","red");
                       modalTxt();
                    }
                },2000);
                
            }
        }); 
    });
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#btnSave").click(function () {
        var _$grid = $("#gridBanks");
        _$grid.jsonSubmit({
             procedure: "banks_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                _$grid.trigger("refresh");
            }
        });
    });
    
    $("#btnDeleteInactiveBanks").click(function (){  
        $("#gridInactiveSections").deleteData({
    		sqlCode: "D248"  
    		,parameters: {client_id:app.userInfo.company_id,table:'dept_sect',id:'dept_sect_id'}
    		,onComplete : function(d){
    			$("#gridInactiveSections").trigger("refresh");
    		}
    	 });  
    });
    
    $("#btnDeleteInactiveBanks").click(function(){
        $("#gridInactiveBanks").deleteData({
    		tableCode: "ref-00019"  
    		,onComplete : function(d){
    			$("#gridInactiveBanks").trigger("refresh");
    		}
    	 }); 
    });

    $("#btnSaveInactiveBanks").click(function () {
        $("#gridInactiveBanks").jsonSubmit({
             procedure: "banks_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayInactiveBanks();
                $("#gridBanks").trigger("refresh");
            }
        });
    });
    
    $("#keyValue").keyup(function(){
       if($(this).val() === "")  displaySuppliers();
    });
    
    $("#btnSearch").click(function(){
        var _keyValue = $("#keyValue").val();
        
        displaySuppliers(_keyValue);
        
    });
    
    return _pub;
})();                          