 var th = (function(){ 
    var _pub                = {}
        ,bs                 = zsi.bs.ctrl
        ,gtw                = null
        ,mdlAddNewUser      = "modalWindowAddNewUser"
        ,gMdlUploadExcel    = "modalWindowUploadExcel"
        ,gCompanyId         = app.userInfo.company_id
        ,mdlImageUser       = "modalWindowImageUser" 
        ,gVLName            = ""
        ,gVfName            = ""
        ,gVfrom             = ""
        ,gVtoDate           = ""
        ,gPLName            = ""
        ,gPfName            = ""
        ,gTravelDate        = ""
    ;
    zsi.ready = function(){
        $(".page-title").html("Transaction History"); 
        $("#passengerRadio").click(function(){
            $("#passengerForm").removeClass("hide");
            $("#vehicleForm").addClass("hide");
            $("#passengerForm").find("input").val("");
             $("#VehicleRow").addClass("hide");
        });
        $("#vehicleRadio").click(function(){ 
            $("#vehicleForm").removeClass("hide");
            $("#passengerForm").addClass("hide");
            $("#PassengerRow").addClass("hide");
            $("#vehicleForm").find("input").val("");
        });
        $("#travel_date").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).datepicker("setDate", "0"); 
        $("#V_fromDate").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).datepicker("setDate", "0");
        $("#V_toDate").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).datepicker("setDate", "0");  
    };
    function displayPassengerHistory(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        ctr=-1;
        $("#gridPassengerHistory").dataBind({
             sqlCode        : "P1295" //passenger_travel_history_sel 
             ,parameters     : {
                                 last_name      :  (gPLName ? gPLName : '')
                                ,first_name     :  (gPfName ? gPfName : '')
                                ,travel_date     : (gTravelDate ? gTravelDate : '') 
            }
    	    ,height         : $(window).height() - 300  
            ,dataRows       : [
                { text:"image"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='th.mouseover(\"" +  svn(d,"image_filename") + "\");' onmouseout='th.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='th.showModalUploadUserImage(" + svn(d,"user_id") +",\"" 
    		                           + svn(d,"userFullName") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    } 
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "Transactions"        , width : 150           , style : "text-align:left;"            
                    ,onRender      : function(d) {
                        var _transaction = '<i class="far fa-comment-dollar" aria-hidden="true" ></i>';
                        return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='users.showModalAddNewOEM(this," + ctr + ");'>" + _transaction + "</a>";
                    }
                }
                 
            ]
            ,onPageChange : function(){
                ctr=-1; 
            }
            ,onComplete: function(o){
                gUsersData = o.data.rows;
                $('.has-tooltip').tooltip(); 
            
                
            }
        });
        
    }   
    function displayVehicleHistory(){ 
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        ctr=-1;
        $("#gridVehicleHistory").dataBind({
             sqlCode        : "V1296" //vehicle_travel_history_sel 
             ,parameters     : {
                                // last_name      :  (gVLName ? gVLName : '')
                                //,first_name     :  (gVfName ? gVfName : '')
                                 time_start     : (gVfrom ? gVfrom : '')
                                ,time_end       : (gVtoDate ? gVtoDate : '')
            }
    	    ,height         : $(window).height() - 300  
            ,dataRows       : [
                { text:"image"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='th.mouseover(\"" +  svn(d,"image_filename") + "\");' onmouseout='th.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='th.showModalUploadUserImage(" + svn(d,"user_id") +",\"" 
    		                           + svn(d,"userFullName") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    } 
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "Date & Time"         , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"payment_date"}
                 
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
                gUsersData = o.data.rows;
                $('.has-tooltip').tooltip(); 
            
                
            }
        });
        
    }
    $("#btnPassenger").click( function() {
            gPLName = $.trim($("#P_last_name").val());
            gPfName = $.trim($("#P_first_name").val()); 
            gTravelDate = $.trim($("#travel_date").val());  
            displayPassengerHistory();
            $("#PassengerRow").removeClass("hide");
        
    });
    $("#btnClearPassenger").click( function() {
        $("#passengerForm").find("input").val("");
    });
    $("#btnClearVehicle").click( function() {
        $("#vehicleForm").find("input").val("");
    }); 
    $("#btnVehicle").click( function() { 
            gVLName = $.trim($("#V_last_name").val());
            gVfName = $.trim($("#V_first_name").val());
            gVfrom = $.trim($("#V_fromDate").val());
            gVtoDate = $.trim($("#V_toDate").val());  
            displayVehicleHistory();
            $("#VehicleRow").removeClass("hide");
        
    });
    return _pub;
})();                             