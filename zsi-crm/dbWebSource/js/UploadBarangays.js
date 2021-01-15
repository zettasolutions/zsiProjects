   var barangaysUpd = (function(){
    var _pub = {}  
        ,gMdlUploadExcel    =   "modalWindowUploadExcel"
        ,gtw                =   null
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Upload Barangays"); 
        gtw = new zsi.easyJsTemplateWriter();
        getTemplates();
    };
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : gMdlUploadExcel
            , sizeAttr  : "modal-lg"
            , title     : ""
            , body      : gtw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
        });
    }
    
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
                console.log("data",data);
                if(data.isSuccess){  
                    zsi.executeCmd({
                            sqlCode  : "T1312" 
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
    
    _pub.showModalUpload = function(o,name){ 
        zsi.executeCmd({
               sqlCode      : "E18"
             ,parameters    : {
                load_name   :name
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
         
    }; 
    
    return _pub;
})();                         