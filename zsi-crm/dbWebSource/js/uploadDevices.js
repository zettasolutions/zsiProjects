    var upldDevices = (function(){
    var _pub = {}  
        ,gMdlUploadExcel    =   "modalWindowUploadExcel"
        ,gtw                =   null
        ,gProc              =   ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Upload Devices"); 
        gtw = new zsi.easyJsTemplateWriter();
        getTemplates();
        $('#uploadDevice').select2({placeholder: "",allowClear: true});
        $('#client_id').select2({placeholder: "",allowClear: true});
        var menu_types = [
             {id:"zsi_afcs"  , menu_name:"AFCS"}
            ,{id:"zsi_ct"    , menu_name:"ZTRACE"}
            ,{id:"zsi_hcm"   , menu_name:"HCM"}   
            ,{id:"zsi_load"   , menu_name:"ZLOAD"} 
        ]; 
        $("#uploadDevice").fillSelect({
               data         : menu_types
              ,value        : "id"
              ,text         : "menu_name"    
              ,onChange     : function(d){
                  gProc = this.val();
              }
        });
        $("#client_id").dataBind({
             sqlCode      : "D243"
            ,text         : "client_name"   
            ,value        : "client_id" 
            ,onChange     : function(d){
                gProc = this.val();
            }
        });
        $("#no_devices").keyup(function(e){
          if (/\D/g.test(this.value))
          {
            this.value = this.value.replace(/\D/g, '');
          }
        });
    };
    
    _pub.excelFileUpload = function(){ 
        var frm      = $("#frm_modalWindowUploadExcel");
        var formData = new FormData(frm.get(0));
        var files    = frm.find("input[name='file']").get(0).files;  
         
        if(files.length===0){
           alert("Please select excel file.");
           return;    
        }  
        $("btnUploadFile").hide();
        $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");  
        $.ajax({
            url: base_url + 'file/templateUpload',  //server script to process data
            type: 'POST', 
            success: completeHandler = function(data) { 
                if(data.isSuccess){  
                     zsi.executeCmd({
                            sqlCode  : "U1309"
                           ,parameters :{database:gProc}
                         ,onComplete: function(data){
                            alert("Data has been successfully uploaded.");  
                            frm.find(".close").click(); 
                         } 
                     });                    
                }
                else
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
    };  
    
    _pub.showModalUpload = function(o){
        var _loadName = "Device Data";
        if(gProc==="") alert("Please select web apllication destination.");
        else {
                zsi.executeCmd({
                   sqlCode      : "E18"
                 ,parameters    : {
                    load_name   :_loadName
                 }
                 ,onComplete: function(data){
                    g$mdl = $("#" + gMdlUploadExcel);   
                    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });  
                    if(data.rows.length>0){ 
                        $("#tmpData").val(data.rows[0].value);
                    }
                    else{ 
                        $("#tmpData").val("");
                    } 
                    $("input[name='file']").val(""); 
                 }
                  
            });
        }

    }; 
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : gMdlUploadExcel
            , sizeAttr  : "modal-lg"
            , title     : ""
            , body      : gtw.new().modalBodyUploadDevice({onClickUploadDevice:"excelFileUpload();"}).html()  
        });
    }
    
    function modalTxt(){
       $("#myModal").find("#msg").text("Are you sure you want to save this number of devices?");
       $("#myModal").find("#msg").css("color","#000");
    }
    
    $("#submit").click(function () {
        var _$frm = $("#form");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            _$frm.addClass('was-validated');
        }else{   
            _$frm.removeClass('was-validated');
            $('#myModal').find(".yesno").show();
            $('#myModal').find(".close").removeAttr("id");
            modalTxt();
            $('#myModal').modal('show');
        }
    });
    
    $("#btnSave").click(function(){
       $("#form").jsonSubmit({
             procedure: "new_devices_for_reg_ins"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  $('#myModal').find(".yesno").hide();
                  $('#myModal').find(".close").attr("id","close");
                  $("#myModal").find("#msg").text("Data successfully saved.");
                  $("#myModal").find("#msg").css("color","green");
                }else{
                  $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                  $("#myModal").find("#msg").css("color","red");
                }
            }
        });  
    }); 
    $("#close").click(function(){
        var _$frm = $("#form");
        
        _$frm.find("#uploadDevice").val("").trigger("change");
        _$frm.find("#client_id").val("").trigger("change");
        _$frm.find("#no_devices").val("");
    });
    
    return _pub;
})();                          