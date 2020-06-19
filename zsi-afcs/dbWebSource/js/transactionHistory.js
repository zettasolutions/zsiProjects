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
        validation();
    };
    
    _pub.showModalTransaction = function (eL,id,vehiclePlateNo,fileName,Fname,Pdate) { 
        var _frm = $("#frm_modalTransactionHistory"); 
        var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png"; 
        _frm.find("#plateNoId").text(vehiclePlateNo); 
        _frm.find("#imgFilename").attr("src", _imgFilename); 
        _frm.find("#passenger_id").text(Fname); 
        _frm.find("#payment_date").text(Pdate.toShortDate()); 
        $('#modalTransactionHistory').modal({ show: true, keyboard: false, backdrop: 'static' }); 
        
    }; 
    function validation(){ 
       $("#V_toDate").attr("readonly",true);
        $("#btnAppend").attr("readonly",true); 
        $("#V_fromDate").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).on("changeDate",function(e){ 
            gVfrom = $(this).val();
            $("#V_toDate").removeAttr("readonly",true);
            $("#btnAppend").removeAttr("readonly",true);
            $("#V_toDate").datepicker('setStartDate', e.date).on("change",function(){
               gVtoDate = $(this).val();
            }); 
        }); 
        $("#V_last_name,#V_first_name").on("keyup change",function(){
            gVLName = $.trim($(this).val());
            gVfName = $.trim($(this).val());    
        });
         
    } 
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
                {text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "<div id='Transactions'>Transactions</div>"        , width : 150           , style : "text-align:center;"   
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View Transactions'onclick='th.showModalTransaction(this,"+ app.svn (d,"consumer_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\",\""+ app.svn (d,"full_name") +"\",\""+ app.svn (d,"payment_date") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
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
        $("#gridVehicleHistory").dataBind({
             sqlCode        : "V1296" //vehicle_travel_history_sel 
             ,parameters     : {
                                 last_name      :  (gVLName ? gVLName : '')
                                ,first_name     :  (gVfName ? gVfName : '')
                                ,time_start     : (gVfrom ? gVfrom : '')
                                ,time_end       : (gVtoDate ? gVtoDate : '')
            }
    	    ,height         : $(window).height() - 300  
            ,dataRows       : [
                 {text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "Date & Time"         , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"payment_date"}
                 
            ] 
            ,onComplete: function(o){
                gUsersData = o.data.rows;
                $('.has-tooltip').tooltip();  
            }
        });
        
    }
    /*Validation for Passenger*/
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
    
    /*Validation for Vehicle*/
    $("#btnClearVehicle").click( function() {
        $("#vehicleForm").find("input").val("");
        $("#VehicleRow").addClass("hide"); 
    });  
    $("#btnVehicle").click( function() {  
        displayVehicleHistory();
        $("#VehicleRow").removeClass("hide"); 
    });
    $("#btnAppend").click(function(){
        displayVehicleHistory();  
        $("#VehicleRow").removeClass("hide");
    });
    return _pub;
})();                                    