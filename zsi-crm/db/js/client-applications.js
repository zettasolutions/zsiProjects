var clientApps = (function(){
    var  _public            = {}
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
    ;
    zsi.ready = function(){
        $(".page-title").html("Client Applications");
        $(".panel-container").css("min-height", $(window).height() - 160);
        //$('.client_id').select2({placeholder: "SELECT CLIENT",allowClear: true});
        
        $("#client_id").dataBind({
            sqlCode      : "D243" //dd_clients_sel
           ,text         : "client_name"
           ,value        : "client_id"
           ,onChange     : function(d){
               /*var _info           = d.data[d.index - 1]
                   _driver_id         = isUD(_info) ? "" : _info.user_id;
                gDriverId1 = _driver_id;*/
           }
        });
        
        $("#app_id").dataBind({
            sqlCode      : "D245" //dd_applications_sel
           ,text         : "app_code"
           ,value        : "app_id"
           ,onChange     : function(d){
               /*var _info           = d.data[d.index - 1]
                   _driver_id         = isUD(_info) ? "" : _info.user_id;
                gDriverId1 = _driver_id;*/
           }
        });

    };

    $("#btnSaveClientApplications").click(function () {
        $("#formClientApp").jsonSubmit({
             procedure: "client_app_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                   if(data.isSuccess===true) zsi.form.showAlert("alert");
                   $("#formClientApp").find("select").val(isUD);
                   $("#myModal").find("#msg").text("Data successfully saved.");
                   $("#myModal").find("#msg").css("color","green");
                   setTimeout(function(){
                       $("#myModal").modal('toggle');
                   },1000);
                }else{
                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                   $("#myModal").find("#msg").css("color","red");
                }
            }
        }); 
    });
   
    
    return _public;
    
    
    
})();
                                          