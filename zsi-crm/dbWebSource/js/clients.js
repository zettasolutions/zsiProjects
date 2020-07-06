 var client = (function(){
    var  _pub               = {}
        ,gClientId          = null
        ,gBatchNoVal        = null
        ,gBatchQty          = null
        ,gClientContractid  = null
        ,gActiveTab         = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Clients");
        $(":input").inputmask();
        displayClients();
        displayClientContracts();
        //displaySelects();
        //validations();
        gActiveTab = "search";
        $('#keyWord').select2({placeholder: "",allowClear: true});
        
    };
    
    $('#keyWord').on("keyup change", function(){
        var _this = $(this);
        if(_this.val() === "client_name"){
            $("#keyValue").attr("placeholder", "Enter Client Name......");
            $("#keyValue").val("");
        }
        else{
            $("#keyValue").val("");
            $("#keyValue").attr("placeholder", "Enter Contract No......")
        }
    });
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-search":
                gActiveTab = "search";
                $("#searchVal").val("");
                break;
            case "#nav-new":
                gActiveTab = "new";
                $("#searchVal").val("");
                break;
          default:break;
      }
    });
    
    function displayClients(){
        $("#gridClients").dataBind({
             sqlCode     : "C241" //clients_sel
            ,height      : $(window).height() - 278
            ,dataRows    : [
                {text: "Code", width: 130, style: "text-align:center"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_code");
                    }
                }
                ,{text: "Name", width : 250, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_name");
                    }
                }
                ,{text: "Phone No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_phone_no");
                    }
                }
                ,{text: "Mobile No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_mobile_no");
                    }
                }
                ,{text: "Email Address", width: 200, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_email_add");
                    }
                }
                ,{text: "Billing Address", width: 300, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"billing_address");
                    }
                }
            ]
            ,onComplete  : function(o){
                
            }
        });
    }
    
    function displayClientContracts(keyword,searchVal){
        var _ctr = 1;
        $("#gridClientContracts").dataBind({
                 sqlCode    : "C1284" //client_contracts_sel
                ,parameters  : {keyword:keyword,search_val: searchVal} 
                ,height     : $(window).height() - 346
                ,blankRowsLimit : 0
                ,dataRows   : [
                     {text: "Line No."         ,width:60                   ,style:"text-align:center"
                         ,onRender : function(d){
                             return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   _ctr++;
                         }
                     }
                    ,{text:"Client Name"                                                                    ,width:250          ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"client_name"                    ,type:"input"                  ,value: app.svn(d,"client_name")}) ;
                         }
                    }
                    ,{text:"Contract Number"            ,type:"input"       ,name:"contract_no"             ,width:150          ,style:"text-align:center"
                        , onRender      : function(d) {
                            var _contractNo = (app.svn(d,"contract_no") ? app.svn(d,"contract_no") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                            return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='client.showModalContracts(this," + _ctr + ", \""+ app.svn (d,"client_contract_id") +"\", \""+ app.svn (d,"client_name") +"\", \""+ app.svn (d,"contract_no") +"\", \""+ app.svn (d,"client_id") +"\", \""+ app.svn (d,"contract_date").toShortDate() +"\", \""+ app.svn (d,"contract_term_id") +"\", \""+ app.svn (d,"activation_date").toShortDate() +"\", \""+ app.svn (d,"expiry_date").toShortDate() +"\", \""+ app.svn (d,"plan_id") +"\", \""+ app.svn (d,"plan_qty") +"\", \""+ app.svn (d,"device_model_id") +"\", \""+ app.svn (d,"device_qty") +"\", \""+ app.svn (d,"device_term_id") +"\", \""+ app.svn (d,"unit_assignment_type_id") +"\");'>" + _contractNo + "</a>";
                        }
                    }
                    ,{text:"Contract Date"                                                                          ,width:100           ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"contract_date"                    ,type:"input"                  ,value: app.svn(d,"contract_date").toShortDate()});
                         }
                    }
                  ]
                  ,onComplete : function(){
                    var _this = this;
                    
                }
        });
    
    }
    
    /*function displayClientContractDevice(client_contract_id,qty){
        var _ctr = 1;
        $("#gridContracts").dataBind({
                 sqlCode    : "C272" //client_contract_devices_sel
                ,parameters  : {client_contract_id: client_contract_id} 
                ,height     : $(window).height() - 390
                ,blankRowsLimit : (qty? qty: 0)
                ,dataRows   : [
                     {text: "Item No."         ,width:60                   ,style:"text-align:center"
                         ,onRender : function(d){
                             return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   _ctr++;
                         }
                     }
                    ,{text:"Subscription No."                                                                 ,width:140          ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"subscripton_no"               ,type:"input"                  ,value: app.svn(d,"subscripton_no")}) 
                                +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: (app.svn(d,"client_contract_id")? app.svn(d,"client_contract_id") : client_contract_id)});
                         }
                    }
                    ,{text:"Device"                ,type:"select"       ,name:"device_id"             ,width:130          ,style:"text-align:left"}
                    //,{text:"Device No."                ,type:"input"       ,name:"tag_no"             ,width:130          ,style:"text-align:left"}
                    //,{text:"Sim No."                                                                ,width:200          ,style:"text-align:left"
                    //    ,onRender : function(d){
                    //         return app.bs({name:"client_id"                ,type:"select"                  ,value: app.svn(d,"client_id")}) 
                    //            +   app.bs({name:"released_date"            ,type:"hidden"                  ,value: app.svn(d,"released_date")});
                    //     }
                    //}
                    //,{text:"Release Date"            ,type:"select"      ,name:"device_type_id"     ,width:130           ,style:"text-align:center"}
                    ,{text:"Unit Assignment"            ,type:"input"      ,name:"unit_assignment"     ,width:130           ,style:"text-align:center"}
                    //,{text:"Active?"                ,type:"yesno"       ,name:"is_active"          ,width:60            ,style:"text-align:left"    ,defaultValue: "Y"}
                    //,{text:"Status"                 ,type:"select"      ,name:"status_id"          ,width:120           ,style:"text-align:left"}
                  ]
                  ,onComplete : function(){
                    var _this = this;
                    
                    if (!qty){
                        _this.find("input").attr("disabled",true);
                        _this.find("select").attr("disabled",true);
                    }
                    _this.find("input,select").prop('required',true);
                    _this.find(".zRow").find("[name='device_id']").dataBind({
                        sqlCode      : "D276" //dd_devices_sel
                       ,text         : "serial_no"
                       ,value        : "device_id"
                    });
                    
                }
        });
    
    }*/
    
    function displayClientContractDevice(client_contract_id,qty){
        zsi.getData({
                 sqlCode    : "C272" //client_contract_devices_sel
                ,parameters  : {client_contract_id: client_contract_id} 
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _ctr = 1;
                    
                    $("#gridContracts").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 390
                        ,blankRowsLimit : (qty? qty - _rows.length: 0)
                        ,dataRows       : [
                             {text: "Item No."         ,width:60                   ,style:"text-align:center"
                                 ,onRender : function(d){
                                     return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                        +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                        +   _ctr++;
                                 }
                             }
                            ,{text:"Subscription No."                                                                 ,width:140          ,style:"text-align:left"
                                ,onRender : function(d){
                                     return app.bs({name:"subscripton_no"               ,type:"input"                  ,value: app.svn(d,"subscripton_no")}) 
                                        +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: (app.svn(d,"client_contract_id")? app.svn(d,"client_contract_id") : client_contract_id)});
                                 }
                            }
                            ,{text:"Device"                ,type:"select"       ,name:"device_id"             ,width:130          ,style:"text-align:left"}
                            //,{text:"Device No."                ,type:"input"       ,name:"tag_no"             ,width:130          ,style:"text-align:left"}
                            //,{text:"Sim No."                                                                ,width:200          ,style:"text-align:left"
                            //    ,onRender : function(d){
                            //         return app.bs({name:"client_id"                ,type:"select"                  ,value: app.svn(d,"client_id")}) 
                            //            +   app.bs({name:"released_date"            ,type:"hidden"                  ,value: app.svn(d,"released_date")});
                            //     }
                            //}
                            //,{text:"Release Date"            ,type:"select"      ,name:"device_type_id"     ,width:130           ,style:"text-align:center"}
                            ,{text:"Unit Assignment"            ,type:"input"      ,name:"unit_assignment"     ,width:130           ,style:"text-align:center"}
                            //,{text:"Active?"                ,type:"yesno"       ,name:"is_active"          ,width:60            ,style:"text-align:left"    ,defaultValue: "Y"}
                            //,{text:"Status"                 ,type:"select"      ,name:"status_id"          ,width:120           ,style:"text-align:left"}
                          ]
                          ,onComplete : function(){
                            var _this = this;
                            
                            if (!qty){
                                _this.find("input").attr("disabled",true);
                                _this.find("select").attr("disabled",true);
                            }
                            _this.find("input,select").prop('required',true);
                            _this.find(".zRow").find("[name='device_id']").dataBind({
                                sqlCode      : "D276" //dd_devices_sel
                               ,text         : "serial_no"
                               ,value        : "device_id"
                            });
                            
                        }
                });
            }
        });
    }
    
    
    
    
    
     _pub.showModalContracts = function (eL,ctr,clientContractId,clientName,contractNo,clientId,contractDate,contractTermId,activationDate,expiryDate,planId,planQty,deviceModelId,deviceQty,deviceTermId,unitAssignmentTypeId) {
         var _$mdl = $('#modalClientContracts');
         _$mdl.modal('show');
         gBatchQty = deviceQty;
         gClientContractid = clientContractId;
         $("#modalTitle").text(clientName + " " + "|" + " " + contractNo);
         $('#client_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         $('#device_model_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         $('#plan_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         
         $("#client_id").dataBind({
             sqlCode      : "D243" //dd_clients_sel
            ,text         : "client_name"
            ,value        : "client_id"
            ,onComplete   : function(){
                this.val(clientId).trigger('change');
            }
         });
         
         $("#plan_id").dataBind({
             sqlCode      : "D256" //dd_plans_sel
            ,text         : "plan_desc"
            ,value        : "plan_id"
            ,onComplete   : function(){
                this.val(planId).trigger('change');
            }
         });
         
         $("#device_model_id").dataBind({
             sqlCode      : "D277" //dd_device_models_sel
            ,text         : "model_name"
            ,value        : "device_model_id"
            ,onComplete   : function(){
                this.val(deviceModelId).trigger('change');
            }
         });
         
         $("input[name$='date']").datepicker({ 
               pickTime  : false
             , autoclose : true
             , todayHighlight: true
         }).datepicker("setDate","0");
         
         
         _$mdl.find("#client_contract_id").val(clientContractId);
         //_$mdl.find("#client_id").val(clientId).trigger('change');
         _$mdl.find("#contract_no").val(contractNo);
         _$mdl.find("#contract_date").datepicker("setDate", contractDate);
         _$mdl.find("#contract_term_id").val(contractTermId);
         _$mdl.find("#activation_date").datepicker("setDate", activationDate);
         _$mdl.find("#expiry_date").datepicker("setDate", expiryDate);
         //_$mdl.find("#plan_id").val(planId).trigger('change');
         //_$mdl.find("#device_model_id").val(deviceModelId).trigger('change');
         _$mdl.find("#device_qty").val(deviceQty);
         _$mdl.find("#device_term_id").val(deviceTermId);
         _$mdl.find("#unit_assignment_type_id").val(unitAssignmentTypeId);
         gBatchNoVal = clientContractId;
         displayClientContractDevice(clientContractId,deviceQty);
     };
    
    $("#btnNewContracts").click(function(){
        var _$mdl = $('#modalClientContracts');
         _$mdl.modal('show');
         $("#modalTitle").text("New Contracts");
         $('#client_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         $('#device_model_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         $('#plan_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
         
         $("#client_id").dataBind({
             sqlCode      : "D243" //dd_clients_sel
            ,text         : "client_name"
            ,value        : "client_id"
         });
         
         $("#plan_id").dataBind({
             sqlCode      : "D256" //dd_plans_sel
            ,text         : "plan_desc"
            ,value        : "plan_id"
         });
         
         $("#device_model_id").dataBind({
             sqlCode      : "D277" //dd_device_models_sel
            ,text         : "model_name"
            ,value        : "device_model_id"
         });
         
         $("input[name$='date']").datepicker({ 
               pickTime  : false
             , autoclose : true
             , todayHighlight: true
             , startDate: new Date()
         }).datepicker("setDate","0");
         displayClientContractDevice(-1);
    });
    
    /*$("#btnSubmit").click(function(){ 
        $("#formEmail").jsonSubmit({
             procedure: "send_mail_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                }
            }
        }); 
    	
    });*/
    $("#searchOption").on("change", function(){
        var _this = $(this);
        if(_this.val() === "name") $("#searchVal").attr("placeholder", "Type client name......");
        else $("#searchVal").attr("placeholder", "Type contract number......");
    });
    
    
    $("#btnSubmit").click(function () {
        var _$frm = $("#formClients");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            $("#formClients").addClass('was-validated');
        }else{   
            $("#formClients").removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
        
    /*$("#btnSubmit").click(function(){
        var forms = document.getElementsByClassName('needs-validation'); 
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
    		    $("form").removeClass('was-validated');
    			if (form.checkValidity() === false) {
    				event.preventDefault();
    				event.stopPropagation();
    			    $("form").addClass('was-validated');
    			}else{
        			event.preventDefault();
        			event.stopPropagation();
    			    $('#myModal').modal('show');
    			    $("form").addClass('was-validated');
    			}
    		}, false);
    	});
    	
    });*/
    
    $("#btnNew").click(function() {
        var _$mdl = $('#newClientModal');
        if($(window).height() <= 724) $("#clientInformationDiv").css({"height":$(window).height() - 208,"overflow-y":"auto","overflow-x":"hidden"});
        //else $("#clientInformationDiv").css({"height":$(window).height() - 578,"overflow-y":"auto","overflow-x":"hidden"}); 
        _$mdl.modal('show');
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id');
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        $("#formClients").find("input[type='text'],input[type='email'],select").val("");
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$country.dataBind({
            sqlCode : "D247" //dd_countries_sel
            ,text : "country_name"
            ,value : "country_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                _$state.dataBind({
                    sqlCode : "D248" //dd_states_sel
                    ,parameters : {country_id:country_id}
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                            sqlCode      : "D246" //dd_cities_sel
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
    
    /*function displaySelects(){
        console.log("window",$(window).height());
        var _$mdl = $('#newClientModal');
        if($(window).height() <= 567) $("#clientInformationDiv").css({"height":"auto"});
        else if($(window).height() <= 724) $("#clientInformationDiv").css({"height":$(window).height() - 208,"overflow-y":"auto","overflow-x":"hidden"});
        _$mdl.modal('show');
        var _$frm = _$mdl.find("form");
        var _$country = $('#country_id')
            ,_$state = $('#state_id')
            ,_$city = $('#city_id');
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        $("#formClients").find("input[type='text'],input[type='email'],select").val("");
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true});
        _$state.select2({placeholder: "",allowClear: true});
        _$city.select2({placeholder: "",allowClear: true});
        _$country.dataBind({
            sqlCode : "D247" //dd_countries_sel
            ,text : "country_name"
            ,value : "country_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                _$state.dataBind({
                    sqlCode : "D248" //dd_states_sel
                    ,parameters : {country_id:country_id}
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                            sqlCode      : "D246" //dd_cities_sel
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
        $('#client_id').select2({placeholder: "",allowClear: true});
        $("#client_id").dataBind({
            sqlCode      : "D243" //dd_clients_sel
           ,text         : "client_name"
           ,value        : "client_id"
        });
        $('#plan_id').select2({placeholder: "",allowClear: true});
        $("#plan_id").dataBind({
            sqlCode      : "D256" //dd_plans_sel
           ,text         : "plan_desc"
           ,value        : "plan_id"
        });
        $('#device_model_id').select2({placeholder: "",allowClear: true});
        $("#device_model_id").dataBind({
            sqlCode      : "D277" //dd_device_models_sel
           ,text         : "model_name"
           ,value        : "device_model_id"
        });
        $("input[name$='date']").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        $("#is_active").fillSelect({
           data : [{text: "Yes",value: "Y"},{text: "No",value: "N"}] 
        }); 
    }*/
    
    $("#is_ready").click(function(){
       if($(this).is(":checked")){
           $("#clientInformationDiv").toggle("top");
           $("#adminUserDiv").toggle("top");
       }else{
           $("#clientInformationDiv").toggle("down");
           $("#adminUserDiv").toggle("down");
       } 
    });
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#btnConfirm").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
        $("#is_ready").prop('checked', false);
        $("#clientInformationDiv").toggle("down");
        $("#adminUserDiv").toggle("down");
    });
    
    $("#btnSave").click(function (){
        if(gActiveTab === "search"){
            $("#formContract").jsonSubmit({
                 procedure: "client_contracts_upd"
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    gBatchNoVal = data.returnValue;
                    console.log("gBatchNoVal",gBatchNoVal);
                    gBatchQty = $("#formContract").find("#device_qty").val();
                    if(data.isSuccess){
                      if(data.isSuccess===true) zsi.form.showAlert("alert");
                      displayClientContractDevice(gBatchNoVal,gBatchQty);
                      $("#formContract").find("#batchId").text(gBatchNoVal);
                      $("#myModal").find("#msg").text("Data successfully saved.");
                      $("#myModal").find("#msg").css("color","green");
                      modalTxt();
                      setTimeout(function(){
                          $("#myModal").modal('toggle');
                          //$("#gridContracts").find("input").removeAttr("disabled");
                          //$("#gridContracts").find("select").removeAttr("disabled");
                      },1000);
                    }else{
                      $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                      $("#myModal").find("#msg").css("color","red");
                      modalTxt();
                    }
                }
            }); 
        }else{
            var _$div1 = $("#clientInformationDiv");
            var _$div2 = $("#adminUserDiv");
            _$div2.find("input,select").attr("disabled", true);
            var _$frm = $("#formClients"); 
            _$frm.jsonSubmit({
                 procedure: "clients_upd" 
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    gClientId = data.returnValue;
                    if(data.isSuccess){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        _$div1.find("input,select").attr("disabled", true);
                        _$div2.find("input,select").removeAttr("disabled");
                        _$frm.find("#clientId").val(gClientId);
                        $("#newClientModal").modal('toggle');
                        displayClients();
    			        setTimeout(function(){
        			        _$frm.jsonSubmit({
                                 procedure: "admin_user_upd" 
                                ,isSingleEntry: true
                                ,onComplete: function (data) {
                                    console.log("data",data);
                                    var _userId = data.returnValue;
                                    var _firstName = $("#first_name").val();
                                    var _email = $("#logon").val();
                                    $("#clientPassword").dataBind({
                                        sqlCode    : "D1282" //dd_clients_password_sel
                                       ,text       : "password"
                                       ,value      : "user_id"
                                       ,onComplete : function(){
                                           $(this).val(_userId);
                                       }
                                    });
                                     setTimeout (function(){
                                        $("#clientPassword").val(_userId);
                                        var _password = $("#clientPassword").find('option:selected').text();
                                        $("#mail_recipients").val(_email);
                                        $("#ename").val(_firstName);
                                        $("#epassword").val(_password);
                                        if(data.isSuccess){
                                           if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                           _$frm.removeClass('was-validated');
                                           $(".yesno").addClass("hide");
                                           $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email");
                                           $("#myModal").find("#msg").css("color","green");
                                           $("#btnConfirm").removeClass("hide");
                                           _$div1.find("input,select").removeAttr("disabled");
                                           
                                           $("#formEmail").jsonSubmit({
                                                 procedure: "send_mail_upd" 
                                                ,isSingleEntry: true
                                                ,onComplete: function (data) {
                                                    if(data.isSuccess){
                                                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    }
                                                }
                                            });
                                        }else{
                                           $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                           $("#myModal").find("#msg").css("color","red");
                                           modalTxt();
                                        }
                                    },2000);
                                    
                                }
                            }); 
                            
    			        },1000);
    			       
                    }
                }
            });
        }
        
        
    });
    
    $("#submit").click(function () {
        var _$frm = $("#formContract");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            $("#formContract").addClass('was-validated');
        }else{   
            $("#formContract").removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
    /*
     function validations(){
        var forms = $('.needs-validation');
    	// Loop over them and prevent submission
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
    			if (form.checkValidity() === false) {
    				event.preventDefault();
    				event.stopPropagation();
    			    $("#formContract").addClass('was-validated');
    			}else{
        			event.preventDefault();
        			event.stopPropagation();
    			    $('#myModal').modal('show');
    			    $("#formContract").addClass('was-validated');
    			}
    		}, false);
    	});
    }*/
    
    $("#btnSaveContracts").click(function(){ 
        $("#gridContracts").jsonSubmit({
             procedure: "client_contract_devices_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayClientContractDevice(gClientContractid,gBatchQty);
            } 
        }); 
    });
    
    $("#btnFilterVal").click(function(){
        var _keyWord = $("#keyWord").val()
        var _keyValue = $("#keyValue").val();
        
        if(gActiveTab === "search") displayClientContracts(_keyWord,_keyValue);
        //else displayClients();
        
    });
    
    $("#btnResetVal").click(function(){
        //displayClientContractDevice();
        $("#formContract").find("#batch_qty").val("");
        $("#formContract").find("#received_by").val(null).trigger('change');
        $("#formContract").find("#batchId").text("");
        $("#received_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            //, startDate: new Date()
        }).datepicker("setDate","0");
    })
    
    return _pub;
})();                        