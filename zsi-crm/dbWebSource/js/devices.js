var devices = (function(){
    var _pub = {},
        gBatchNoVal = null,
        gBatchQty   = null
    ;
    
    zsi.ready = function(){
        $(".page-title").html("New Devices");
        displayDevices();
        validations();
        $('#received_by').select2({placeholder: "",allowClear: true});
        $('#supplier_id').select2({placeholder: "",allowClear: true});
        $("#received_date,#invoice_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        $("#received_by").dataBind({
            sqlCode      : "D260" //dd_users_sel
           ,text         : "userFullName"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1];
                   
           }
        });
        $("#supplier_id").dataBind({
            sqlCode      : "D280" //dd_suppliers_sel
           ,text         : "supplier_name"
           ,value        : "supplier_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1];
           }
        });
    };
    
    function displayDevices(batch_id,qty){
        var _ctr = 1;
        $("#gridDevices").dataBind({
                 sqlCode    : "D262" //devices_sel
                ,height     : $(window).height() - 435
                ,blankRowsLimit : (qty? qty: 0)
                ,dataRows   : [
                     {text: "Item No."         ,width:60                   ,style:"text-align:center"
                         ,onRender : function(d){
                             return app.bs({name:"device_id"                ,type:"hidden"                  ,value: app.svn(d,"device_id")}) 
                                +   app.bs({name:"is_edited"                ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   app.bs({name:"batch_id"                 ,type:"hidden"                  ,value: (app.svn(d,"batch_id")? app.svn(d,"batch_id") : batch_id)})
                                +   _ctr++;
                         }
                     }
                    ,{text:"Serial No."             ,type:"input"       ,name:"serial_no"          ,width:140          ,style:"text-align:left"}
                    ,{text:"Tag No."                ,type:"input"       ,name:"tag_no"             ,width:130          ,style:"text-align:left"}
                    ,{text:"Client"                                                                ,width:200          ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"client_id"                ,type:"select"                  ,value: app.svn(d,"client_id")}) 
                                +   app.bs({name:"released_date"            ,type:"hidden"                  ,value: app.svn(d,"released_date")});
                         }
                    }
                    ,{text:"Device Type"            ,type:"select"      ,name:"device_type_id"     ,width:130           ,style:"text-align:center"}
                    ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"          ,width:60            ,style:"text-align:left"    ,defaultValue: "Y"}
                    ,{text:"Status"                 ,type:"select"      ,name:"status_id"          ,width:120           ,style:"text-align:left"}
                  ]
                  ,onComplete : function(){
                    var _this = this;
                    _this.find("input").attr("disabled",true);
                    _this.find("select").attr("disabled",true);
                    _this.find("input,select").prop('required',true);
                    _this.find(".zRow").find("[name='device_type_id']").dataBind({
                        sqlCode      : "D267" //dd_device_types_sel
                       ,text         : "device_type"
                       ,value        : "device_type_id"
                    });
                    
                    _this.find(".zRow").find("[name='client_id']").dataBind({
                        sqlCode      : "D243" //dd_clients_sel
                       ,text         : "client_name"
                       ,value        : "client_id"
                    });
                    
                }
        });
    
    } 
    
    function displayInactive(){
         var cb = app.bs({name:"cbFilter",type:"checkbox"});
         $("#gridInactive").dataBind({
    	     sqlCode            : "D262" //devices_sel
            ,parameters         : {is_active: "N"}
	        ,height             : 360 
            ,dataRows           : [
                    {text:cb        ,width:25              ,style : "text-align:left"
                        
                        ,onRender : function(d){
                             return app.bs({name:"device_id"                ,type:"hidden"                  ,value: app.svn(d,"device_id")}) 
                                +   app.bs({name:"is_edited"                ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   app.bs({name:"batch_id"                 ,type:"hidden"                  ,value: (app.svn(d,"batch_id")? app.svn(d,"batch_id") : batch_id)})
                                +   (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                         }
                    
                    } 
                    
                    ,{text:"Serial No."              ,width:240       ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                    return  app.bs({name:"serial_no"            ,type:"input"       ,value: app.svn(d,"serial_no")})
                                        + app.bs({name:"tag_no"                 ,type:"hidden"      ,value: app.svn(d,"tag_no")}) 
                                        + app.bs({name:"client_id"              ,type:"hidden"      ,value: app.svn(d,"client_id")}) 
                                        + app.bs({name:"released_date"          ,type:"hidden"      ,value: app.svn(d,"released_date")})
                                        + app.bs({name:"device_type_id"         ,type:"hidden"      ,value: app.svn(d,"device_type_id")});
                                        
                        }
                    }  
                    ,{text:"Active?"                                                                ,width:60           ,style:"text-align:left"    ,defaultValue:"Y"
                        ,onRender  :  function(d){ 
                                    return  app.bs({name:"is_active"            ,type:"yesno"       ,value: app.svn(d,"is_active")})
                                          + app.bs({name:"status_id"            ,type:"hidden"      ,value: app.svn(d,"status_id")}) ;
                                        
                        }
                    }
                    
                    
                ] 
                ,onComplete : function(d){    
                    this.find("[name='cbFilter']").setCheckEvent("#gridInactive input[name='cb']");  
                }
        });    
    }

    function validations(){
        var forms = document.getElementsByClassName('needs-validation');
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
      
    $("#btnInactive").click(function(){
        $(".modal-title").text("Inactive Device(s)");
        $('#modalInactive').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive();
        
    }); 
    
    $("#btnSave").click(function () {
        $("#formDevices").jsonSubmit({
             procedure: "device_batch_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                gBatchNoVal = data.returnValue;
                gBatchQty = $("#formDevices").find("#batch_qty").val();
                if(data.isSuccess){
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayDevices(gBatchNoVal,gBatchQty);
                  $("#formDevices").find("#batchId").text(gBatchNoVal);
                  $("#myModal").find("#msg").text("Data successfully saved.");
                  $("#myModal").find("#msg").css("color","green");
                  modalTxt();
                  setTimeout(function(){
                      $("#myModal").modal('toggle');
                      $("#gridDevices").find("input").removeAttr("disabled");
                      $("#gridDevices").find("select").removeAttr("disabled");
                      $("#formDevices").find("#btnSaveDevices").removeClass("hide");
                      $("#formDevices").find("#submit").addClass("hide");
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
    
    $("#btnSaveDevices").click(function(){ 
        $("#gridDevices").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDevices();
            } 
        }); 
    });
    
    $("#btnSaveInactive").click(function(){ 
        $("#gridInactive").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["client_id","is_active","status_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayDevices(gBatchNoVal);
                displayInactive();
                $("#myModal").modal('toggle');
            } 
        }); 
    });
    
    $("#btnDeleteInactive").click(function(){ 
        zsi.form.deleteData({ 
            code:"ref-0005"
           ,onComplete:function(data){
                displayInactive();
             
           }
        });
    });
    
    $("#btnResetVal").click(function(){
        displayDevices();
        $("#formDevices").find("#submit").removeClass("hide");
        $("#formDevices").find("#btnSaveDevices").addClass("hide");
        $("#formDevices").find("#batch_qty").val("");
        $("#formDevices").find("#received_by").val(null).trigger('change');
        $("#formDevices").find("#batchId").text("");
        $("#received_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
    })
    return _pub;
})();                     