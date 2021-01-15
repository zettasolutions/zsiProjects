 (function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
        ,gClientId   = null
        ,gActiveTab = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Client Applications");
        displayClients()
        displayClientApplications(); 
        gActiveTab = "client";
        
        $("#clientId").select2({placeholder: "CLIENT",allowClear: true});
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
            var target = $(e.target).attr("href"); 
            switch(target){
                case "#nav-client":
                    gActiveTab = "client";
                    $("#searchVal").val("");
                    $("#searchDiv").removeClass("hide");
                    $("#vehicleMakerDiv").addClass("hide");
                    $("#dummyDiv").removeClass("hide");
                    $("#dummyDivSearch").addClass("hide");
                    displayClientApplications(gClientId);
                    break;
                case "#nav-client-applications":
                    gActiveTab = "client_applications";
                    $("#vehicleMakerDiv").removeClass("hide");
                    $("#dummyDiv").addClass("hide");
                    $("#dummyDivSearch").removeClass("hide");
                    $("#searchDiv").addClass("hide");
                    $("#assetId").val(gClientId).trigger('change');
                    break;
              default:break;
            } 
        }); 
        
        console.log("client",app.userInfo);
    }; 
    
    function displaySelects(){
        $("#clientId").dataBind({
             sqlCode    : "D243" //dd_client_sel
            ,text       : "client_name"
            ,value      : "client_id" 
            ,required   : true
            ,onChange   : function(){ 
                gClientId = this.val();  
            }
        });
    }
    
    function displayClients(searchVal){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridClient").dataBind({
             sqlCode        : "C241" //clients_sel
            ,parameters     : {search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            //,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                                                          ,width:25           ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"client_id"                    ,type:"hidden"              ,value: app.svn(d,"client_id")}) 
                                  + app.bs({name:"is_edited"                    ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                  + (d !== null ? app.bs({name:"cb"             ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Client Code"             ,type:"input"       ,name:"client_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Client Name"             ,type:"input"       ,name:"client_name"              ,width:400          ,style:"text-align:left"}
                    
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        if(_dRows.length < 1) $("#nav-tab").find("[aria-controls='nav-client-applications']").hide();
        	        _zRow.unbind().click(function(){
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _clientId  = _data.client_id;
            	            gClientId = _clientId;
            	            displaySelects();
            	            $("#nav-tab").find("[aria-controls='nav-client-applications']").show();
            	            setTimeout(function(){
            	                $("#clientId").val(_clientId).trigger('change');
            	            }, 200);
                            displayClientApplications(_clientId);

        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });
                    this.find("[name='cbFilter1']").setCheckEvent("#gridClient input[name='cb']");
                  } 
            });
        } 
    
    function displayClientApplications(client_id){  
        $("#gridClientApp").dataBind({
             sqlCode            : "C249" //client_applications_sel
            ,parameters         : {client_id: client_id}
	        ,height             : $(window).height() - 273 
            ,blankRowsLimit     : 5
            ,dataRows           : [
                    {text:"Application"                                                                                    ,width:200       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"client_app_id"          ,type:"hidden"       ,value: app.svn(d,"client_app_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                        + app.bs({name:"client_id"              ,type:"hidden"       ,value: client_id})
                                        + app.bs({name:"app_id"                 ,type:"select"       ,value: app.svn(d,"app_id")});
                                        
                        }
                    }
                    ,{text:"Active?"                            ,type:"yesno"           ,name:"is_active"                ,width:60        ,style:"text-align:left"     ,defaultValue:"Y"}
                    
                ] 
                ,onComplete : function(d){
                    this.find("select[name='app_id']").dataBind({
                         sqlCode    : "D245" //dd_applications_sel
                        ,text       : "app_code"
                        ,value      : "app_id"
                    }); 
                    
                } 
            });
        }
        
    function displayInactiveClientApp(client_id){
         var cb = app.bs({name:"cbFilter2",type:"checkbox"});
         $("#gridInactiveClientApp").dataBind({
    	     sqlCode            : "C249" //client_applications_sel
            ,parameters         : {client_id: client_id,is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                                     return app.bs({name:"client_app_id"          ,type:"hidden"       ,value: app.svn(d,"client_app_id")}) 
                                        + app.bs({name:"is_edited"              ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                        + app.bs({name:"client_id"              ,type:"hidden"       ,value: client_id})
                                        + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                        
                        }
                    
                    } 
                    ,{text:"Application"                        ,type:"select"          ,name:"app_id"                   ,width:200       ,style:"text-align:left"}
                    ,{text:"Active?"                            ,type:"yesno"           ,name:"is_active"                ,width:60        ,style:"text-align:left"     ,defaultValue:"Y"}
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter2']").setCheckEvent("#gridInactiveClientApp input[name='cb']");  
                    this.find("select[name='app_id']").dataBind({
                         sqlCode    : "D245" //dd_applications_sel
                        ,text       : "app_code"
                        ,value      : "app_id"
                    }); 
                }
        });    
    }
    
    $("#btnInactive").click(function(){
        $(".modal-title").text("Inactive Vehicle(s)");
        $('#modalInactive').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveClientApp(gClientId);
        
    });
    
    $("#btnSaveInactive").click(function(){
       $("#gridInactiveClientApp").jsonSubmit({
                 procedure: "client_applications_upd"
                ,optionalItems: ["is_active","app_id"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveClientApp(gClientId);
                    displayClientApplications(gClientId);
                    $('#modalInactive').modal('toggle');
                }
        });
    });
        
    $("#btnSaveClientAppMaker").click(function(){
        $("#gridClient").jsonSubmit({
            procedure:"vehicle_maker_upd"
            ,onComplete:function(data){
                if(data.isSuccess===true)zsi.form.showAlert("alert");
                displayClients();
            }
        });
    });
    
    $("#btnDeleteClient").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00012" 
               ,onComplete:function(data){
                     displayClients();
               }
        });
    });
            
    $("#btnSaveClientApp").click(function(){ 
        $("#gridClientApp").jsonSubmit({
             procedure: "client_applications_upd"
            ,optionalItems: ["is_active","app_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayClientApplications(gClientId);
            } 
        }); 
    });
    
    $("#btnDeleteClientApp").click(function(){ 
        zsi.form.deleteData({ 
            code:"ref-00010"
           ,onComplete:function(data){
                displayInactiveClientApp(gClientId);
                displayClientApplications(gClientId);
                $('#modalInactive').modal('toggle');
           }
        });
    });
    
    $("#btnFilterAsset").click(function(){ 
        displayClientApplications(gClientId);
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "nav-client-applications") displayClients(_searchVal);
        else displayClientApplications(gClientId,_searchVal);
        
    }); 
   $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(gActiveTab === "nav-client-applications") displayClients(_searchVal);
           else displayClientApplications(gClientId,_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "nav-client-applications") displayClients();
            else displayClientApplications(gClientId);
        }
    });
    
    $("#btnResetVal").click(function(){
        $("#searchVal").val("");
        $("#nav-tab").find("[aria-controls='nav-client-applications']").hide();
    });
    
})();      

// /*/*/*var clientApps = (function(){
//     var  _public            = {}
//         ,bs                 = zsi.bs.ctrl
//         ,svn                = zsi.setValIfNull 
//     ;
//     zsi.ready = function(){
//         $(".page-title").html("Client Applications");
//         $(".panel-container").css("min-height", $(window).height() - 160);
//         //$('.client_id').select2({placeholder: "SELECT CLIENT",allowClear: true});
        
//         $("#client_id").dataBind({
//             sqlCode      : "D243" //dd_clients_sel
//           ,text         : "client_name"
//           ,value        : "client_id"
//           ,onChange     : function(d){
//               /*var _info           = d.data[d.index - 1]
//                   _driver_id         = isUD(_info) ? "" : _info.user_id;
//                 gDriverId1 = _driver_id;*/
//           }
//         });
        
//         $("#app_id").dataBind({
//             sqlCode      : "D245" //dd_applications_sel
//           ,text         : "app_code"
//           ,value        : "app_id"
//           ,onChange     : function(d){
//               /*var _info           = d.data[d.index - 1]
//                   _driver_id         = isUD(_info) ? "" : _info.user_id;
//                 gDriverId1 = _driver_id;*/
//           }
//         });

//     };

//     $("#btnSaveClientApplications").click(function () {
//         $("#formClientApp").jsonSubmit({
//              procedure: "client_app_upd"
//             ,isSingleEntry: true
//             ,onComplete: function (data) {
//                 if(data.isSuccess){
//                   if(data.isSuccess===true) zsi.form.showAlert("alert");
//                   $("#formClientApp").find("select").val(isUD);
//                   $("#myModal").find("#msg").text("Data successfully saved.");
//                   $("#myModal").find("#msg").css("color","green");
//                   setTimeout(function(){
//                       $("#myModal").modal('toggle');
//                   },1000);
//                 }else{
//                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
//                   $("#myModal").find("#msg").css("color","red");
//                 }
//             }
//         }); 
//     });
   
    
//     return _public;
    
    
    
// })();
//                                           *