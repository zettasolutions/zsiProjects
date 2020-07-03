 var signup = (function(){
    var  _public            = {}
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
        ,gCompanyId         = null
    ;
    zsi.ready = function(){
        $(".pageTitle").html("");
        selects();
    };
    function selects(){
        //$("#bank_id").select2({placeholder: "",allowClear: true});
        //$("#state_id").select2({placeholder: "",allowClear: true});
        //$("#city_id").select2({placeholder: "",allowClear: true});
        $("#company_code").datepicker({
              pickTime  : false
            , autoclose : true
            , todayHighlight: true 
        });
        
        $("#bank_id").dataBind({
            sqlCode      : "B1245" //banks_sel
           ,text         : "bank_name"
           ,value        : "bank_id"
        });
        
        $("#state_id").dataBind({
            sqlCode : "D1275" //dd_states_sel
            ,text : "state_name"
            ,value : "state_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,state_id = isUD(_info) ? "" : _info.state_id;
                   
                $("#city_id").dataBind({
                    sqlCode      : "D1273" //dd_cities_sel
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
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    
    /*$("#company_landline").on("keyup", function() {
        console.log("sulod");
      var myMask = "(___) ___-____";
      var myCaja = $("#company_landline");
      var myText = "";
      var myNumbers = [];
      var myOutPut = "";
      var theLastPos = 1;
      myText = myCaja.val();
      //get numbers
      for (var i = 0; i < myText.length; i++) {
        if (!isNaN(myText.charAt(i)) && myText.charAt(i) != " ") {
          myNumbers.push(myText.charAt(i));
        }
      }
      //write over mask
      for (var j = 0; j < myMask.length; j++) {
        if (myMask.charAt(j) == "_") { //replace "_" by a number 
          if (myNumbers.length === 0)
            myOutPut = myOutPut + myMask.charAt(j);
          else {
            myOutPut = myOutPut + myNumbers.shift();
            theLastPos = j + 1; //set caret position
          }
        } else {
          myOutPut = myOutPut + myMask.charAt(j);
        }
      }
      $("#company_landline").val(myOutPut);
    });*/
    
   $("#btnSubmit").click(function(){ 
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
    	
    });
    
    /*$("#btnSave").click(function () {
        var _$frm = $("#frmSignUp"); 
	        _$frm.jsonSubmit({
                 procedure: "admin_user_upd" 
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    if(data.isSuccess){
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                       $("form").removeClass('was-validated');
                       $("#myModal").find("#msg").text("Data successfully saved.");
                       $("#myModal").find("#msg").css("color","green"); 
                       modalTxt();
                       setTimeout(function(){
                           $("#myModal").modal('toggle');
                           location.href = "/";
                       },1000);
                    }else{
                       $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                       $("#myModal").find("#msg").css("color","red");
                       modalTxt();
                    }
                }
            }); 
			       
    });*/
    
    $("#btnSave").click(function () {
        var _$div1 = $("#companySaveDiv");
        var _$div2 = $("#usersSaveDiv");
        _$div1.find("input,select,textarea").removeAttr("disabled");
        _$div2.find("input,select").attr("disabled", true);
        var _$frm = $("#frmSignUp"); 
        _$frm.jsonSubmit({
             procedure: "company_info_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                gCompanyId = data.returnValue;
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#btnSubmit").removeAttr("disabled");
                    _$div1.find("input,select,textarea").attr("disabled", true);
                    _$div2.find("input,select").removeAttr("disabled");
                    _$frm.find("#company_id").val(gCompanyId);
                    _$frm.find("#companyId").val(gCompanyId);
			        setTimeout(function(){
    			        _$frm.jsonSubmit({
                             procedure: "admin_user_upd" 
                            ,isSingleEntry: true
                            ,onComplete: function (data) {
                                if(data.isSuccess){
                                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                   $("form").removeClass('was-validated');
                                   $("#myModal").find("#msg").text("Data successfully saved.");
                                   $("#myModal").find("#msg").css("color","green"); 
                                   modalTxt();
                                   setTimeout(function(){
                                       $("#myModal").modal('toggle');
                                       location.href = "/";
                                   },1000);
                                }else{
                                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                   $("#myModal").find("#msg").css("color","red");
                                   modalTxt();
                                }
                            }
                        }); 
			        },1000);
			       
                }
            }
        });
    });
      
    return _public;
    
    
    
})();                  