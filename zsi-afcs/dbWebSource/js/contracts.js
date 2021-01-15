  var contract = (function(){
    var  _pub           = {}
        ,gBatchNoVal    = null
        ,gBatchQty      = null;

    zsi.ready = function(){
        $(".page-title").html("Device Subscriptions");
        //$(".panel-container").css("min-height", $(window).height() - 160);
        displayClientContractDevice();
        initForm();
        validations();
    };
    
    function initForm(){
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
    }
    
    function displayClientContractDevice(contract_id,qty){
        var _ctr = 1;
        $("#gridContracts").dataBind({
                 sqlCode    : "C272" //client_contract_devices_sel
                ,height     : $(window).height() - 455
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
                             return app.bs({name:"subscripton_no"                    ,type:"input"                  ,value: app.svn(d,"subscripton_no")}) 
                                +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: (app.svn(d,"client_contract_id")? app.svn(d,"client_contract_id") : contract_id)});
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
                    _this.find("input").attr("disabled",true);
                    _this.find("select").attr("disabled",true);
                    _this.find("input,select").prop('required',true);
                    _this.find(".zRow").find("[name='device_id']").dataBind({
                        sqlCode      : "D276" //dd_devices_sel
                       ,text         : "serial_no"
                       ,value        : "device_id"
                    });
                    
                }
        });
    
    }

    function validations(){
        var forms = $('.needs-validation');
    	// Loop over them and prevent submission
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
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
    }
    
    
    $("#btnSave").click(function () {
        $("#formContract").jsonSubmit({
             procedure: "client_contracts_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                gBatchNoVal = data.returnValue;
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
                      $("#gridContracts").find("input").removeAttr("disabled");
                      $("#gridContracts").find("select").removeAttr("disabled");
                      $("#formContract").find("#btnSaveContracts").removeClass("hide");
                      $("#formContract").find("#submit").addClass("hide");
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
    
    $("#btnSaveContracts").click(function(){ 
        $("#gridContracts").jsonSubmit({
             procedure: "client_contract_devices_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayClientContractDevice();
            } 
        }); 
    });
    
    $("#btnResetVal").click(function(){
        displayClientContractDevice();
        $("#formContract").find("#submit").removeClass("hide");
        $("#formContract").find("#btnSaveContracts").addClass("hide");
        $("#formContract").find("#batch_qty").val("");
        $("#formContract").find("#received_by").val(null).trigger('change');
        $("#formContract").find("#batchId").text("");
        $("#received_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
    })
    
    return _pub; 
})();       