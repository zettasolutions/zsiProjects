 var clients = (function(){
    var  _public            = {}
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
    ;
    zsi.ready = function(){
        $(".page-title").html("Clients");
        $(".panel-container").css("min-height", $(window).height() - 160);
        
        //$("#client_phone_no").inputmask({"mask": "(99) 9999 - 9999"});
        
        $('#country_id').select2({placeholder: "",allowClear: true});
        $('#state_id').select2({placeholder: "",allowClear: true});
        $('#city_id').select2({placeholder: "",allowClear: true});
        $("#country_id").dataBind({
            sqlCode      : "D247" //dd_countries_sel
           ,text         : "country_name"
           ,value        : "country_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   country_id         = isUD(_info) ? "" : _info.country_id;
               $("#state_id").dataBind({
                    sqlCode      : "D248" //dd_states_sel
                   ,parameters   : {country_id:country_id}
                   ,text         : "state_name"
                   ,value        : "state_id"
                   ,onChange     : function(d){
                       var _info           = d.data[d.index - 1]
                           state_id         = isUD(_info) ? "" : _info.state_id;
                           
                       $("#city_id").dataBind({
                            sqlCode      : "D246" //dd_cities_sel
                           ,parameters   : {state_id:state_id}
                           ,text         : "city_name"
                           ,value        : "city_id"
                           ,onChange     : function(d){
                               var _info           = d.data[d.index - 1]
                                   city_id         = isUD(_info) ? "" : _info.city_id;
                               
                           }
                        });
                       
                   }
                });
           }
        });
        
    };
    
    $("#btnSaveClient").click(function () {
        $("#formClients").jsonSubmit({
             procedure: "clients_upd"
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
    

  window.addEventListener('load', function() {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
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
  }, false);

   
    
    return _public;
    
    
    
})();   