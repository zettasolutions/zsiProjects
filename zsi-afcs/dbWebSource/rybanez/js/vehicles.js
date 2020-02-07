var vehicles = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Vehicles");
        displayVehicles();
        
    };
    
    function displayVehicles(){
        $("#gridVehicles").dataBind({
             sqlCode        : "V1229" //vehicle_sel
            ,height         : $(window).height() - 240
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicles.showModalViewInfo(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Vehicle Plate No."                 ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ;
                                 
                        }
                }
                ,{text: "Route"                      ,name:"route_id"               ,type:"select"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Company Code"                                                                  ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"company_code"              ,type:"input"      ,value: app.svn(d,"company_code")}) 
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                                 
                        }
                }
                ,{text: "Vehicle Type"                      ,name:"vehicle_type_id"               ,type:"select"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Active?"                      ,name:"is_active"               ,type:"yesno"       ,width : 50   ,style : "text-align:left;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                //_zRow.find("[name='transaction']").datepicker({todayHighlight:true});
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "R1224"//route_ref_sel
                   ,text         : "route_code"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "V1230"//vehicle_types_sel
                   ,text         : "vehicle_type"
                   ,value        : "vehicle_type_id"
                });
            }
        });
    }
    
    function displayInactiveVehicles(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveVehicles").dataBind({
             sqlCode        : "V1229" //vehicle_sel
            ,parameters     : {is_active:'N'}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                            
                        }
                }
                ,{text: "Vehicle Plate No."                                                                  ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_plate_no"          ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")})
                                 + app.bs({name:"route_id"                  ,type:"hidden"      ,value: app.svn(d,"route_id")})
                                 + app.bs({name:"company_code"              ,type:"hidden"      ,value: app.svn(d,"company_code")})
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                 + app.bs({name:"vehicle_type_id"           ,type:"hidden"      ,value: app.svn(d,"vehicle_type_id")});
                                 
                        }
                }
                ,{text: "Active?"                      ,name:"is_active"               ,type:"yesno"       ,width : 50   ,style : "text-align:left;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveVehicles input[name='cb']");
            }
        });
    }
    
    _pub.showModalViewInfo = function (eL,id,vehiclePlateNo,vehicleType,hashKey) {
        var _frm = $("#frm_modalVehicleId");
        var _$vehicleType = $(eL).closest(".zRow").find('[name="vehicle_type_id"] option[value="'+vehicleType+'"]').text();
        //var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png";
        _frm.find("#plateNoId").text(vehiclePlateNo);
        _frm.find("#vehicleTypeId").text(_$vehicleType);
        _frm.find("#imgFilename").attr("src", "../images/no-image2.jpg");
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    };
    
    $("#btnInactive").click(function(){
       var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactiveVehicles");
        g$mdl.find(".modal-title").text("Inactive Vehicles") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveVehicles();
    });
    
    $("#btnSaveVehicles").click(function () {
       $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["route_id","vehicle_type_id","is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
            }
        });
    });
    
    $("#btnSaveInactiveVehicles").click(function () {
       $("#gridInactiveVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
                $('#modalInactiveVehicles').modal('toggle');
            }
        });
    });
    
    $("#btnDeleteVehicles").click(function(){
        zsi.form.deleteData({
             code       : "ref-00015"
            ,onComplete : function(data){
                $('#gridVehicles').trigger('refresh');
                $('#modalInactiveVehicles').modal('toggle');
            }
        });       
    });
    
    return _pub;
})();               