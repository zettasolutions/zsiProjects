  var contract = (function(){
    var  _pub = {};

    zsi.ready = function(){
        $(".page-title").html("Client Contract");
        $(".panel-container").css("min-height", $(window).height() - 160);
        initForm();
        validations();
    };
    
    $("#btnSaveContract").click(function () {
        $("#formContract").jsonSubmit({
             procedure: "client_contracts_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                   if(data.isSuccess===true) zsi.form.showAlert("alert");
                   $("#formClients").find("input").val("");
                   $("#formClients").find("textarea").val("");
                   $("#formClients").find("select").val(null).trigger('change');
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
        $("input[name$='date']").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        });
        $("#is_active").fillSelect({
           data : [{text: "Yes",value: "Y"},{text: "No",value: "N"}] 
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
    
    return _pub; 
})();     