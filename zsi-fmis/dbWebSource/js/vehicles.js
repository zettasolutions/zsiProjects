var vehicles = (function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
        ,gVehicleMakerId   = null
        ,gActiveTab = ""
        ,_public = {}
        ,gClientName
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Vehicles");
        gActiveTab = "Active";
        zsi.getData({
             sqlCode    : "G292" 
            ,parameters  : {client_id: app.userInfo.company_id} 
            ,onComplete : function(d) {
                gClientName = d.rows[0].client_name;
                
            }
        });
        displayVehicles(); 
        displaySchedPMSVehicles();
    }; 
    
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gActiveTab = $.trim($(e.target).text()); 
        displayVehicles();
        $("#btnActivate").addClass("hide");
        $("#btnDelete").addClass("hide");
        $("#btnInactivate").removeClass("hide");
        $("#btnPrint").removeClass("hide");
        if(gActiveTab === "Inactive"){
            $("#btnInactivate").addClass("hide");
            $("#btnPrint").addClass("hide");
            $("#btnActivate").removeClass("hide");
            $("#btnDelete").removeClass("hide");
            
        }
    }); 
    
    function displaySelects(){
        $("#vehicleMakerId").dataBind({
             sqlCode    : "D234"
            ,text       : "maker_name"
            ,value      : "vehicle_maker_id" 
            ,required   : true
            ,onChange   : function(){ 
                gVehicleMakerId = this.val();  
            }
        });
    }
    
    function printQR(id){
        $('#myModal').modal('hide');
        setTimeout(function(){ 
            var _win = window.open('/');
            var _objDoc = _win.document;
            _objDoc.write('<html><body style="text-align:center;font-family: Arial, Helvetica, sans-serif;">');
            _objDoc.write('<div style="justify-content:center;display:flex;">');
            _objDoc.write( document.getElementById(id).innerHTML ); 
            _objDoc.write('</div>');
            _objDoc.write('</body></html>');
            _objDoc.close();
            _win.focus();
            _win.print();
            _win.close(); 
            
            return true;
        }, 500);
    }
    
    
    function displayVehicles(){  
        var _cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var _rows;
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;padding:0 50px 50px 0;";
        var _searchVal = $.trim($("#searchVal").val());  
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:144, height:144}).makeCode(text);};
        var _params = {
                         tab_id     : 1
                        ,search_val : (_searchVal ? _searchVal : "")
                        ,client_id  : app.userInfo.company_id
                        ,is_active  : 'Y'
                     };
        
        switch(gActiveTab){
            case "(15)Days for Renewal":
                _params.tab_id = 2;
                break;
            case "(30)Days for Renewal":
                _params.tab_id = 3;
                break;
            case "Expired License":
                _params.tab_id = 4;
                break;
            case "Inactive":
                _params.is_active  = 'N';
                break;
        }
                    
        $("#gridVehicle").dataBind({
             sqlCode     : "V232"
            ,parameters  : _params
	        ,height             : $(window).height() - 340
            ,dataRows           : [
                    {text: _cb                                                                          ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                             return app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                  + app.bs({name:"dummy"                    ,type:"hidden"      ,value: app.svn(d,"vehicle_plate_no")})
                                  + app.bs({name:"dummy"                    ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                  + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                  + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                        ,onRender : function(d){
                                var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicles.showModalViewInfoVehicles(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                                return (d !== null ? _link : "");
                        }
                    }
                    ,{text:"Plate No"                            ,type:"input"          ,name:"vehicle_plate_no"        ,width:100       ,style:"text-align:left"}
                    ,{text:"Vehicle Maker"                       ,type:"select"         ,name:"vehicle_maker_id"        ,width:150       ,style:"text-align:left"}
                    ,{text:"Conduction No"                       ,type:"input"          ,name:"conduction_no"           ,width:100       ,style:"text-align:left"}
                    ,{text:"Chassis No"                          ,type:"input"          ,name:"chassis_no"              ,width:150       ,style:"text-align:left"}
                    ,{text:"Engine No"                           ,type:"input"          ,name:"engine_no"               ,width:100       ,style:"text-align:left"}
                    ,{text:"Date Acquired"                                                                              ,width:120       ,style:"text-align:center"
                        ,onRender: function(d){ return app.bs({name:"date_acquired"     ,type:"input"    ,value: app.svn(d,"date_acquired").toShortDate()       ,style:"text-align:center"});
                
                        }
                    }
                    ,{text:"Registration Exp Date"                                                                      ,width:120       ,style:"text-align:center"
                        ,onRender: function(d){ return app.bs({name:"exp_registration_date"     ,type:"input"    ,value: app.svn(d,"exp_registration_date").toShortDate()       ,style:"text-align:center"});
                           
                        }
                    }
                    ,{text:"Insurance Exp Date"                                                                         ,width:120       ,style:"text-align:center"
                        ,onRender: function(d){ 
                            return app.bs({name:"exp_insurance_date"        ,type:"input"       ,value: app.svn(d,"exp_insurance_date").toShortDate()       ,style:"text-align:center"});
                        }
                    }
                    ,{text:"Franchise Exp Date"                                                                      ,width:120       ,style:"text-align:center"
                        ,onRender: function(d){ return app.bs({name:"franchise_exp_date"     ,type:"input"    ,value: app.svn(d,"franchise_exp_date").toShortDate()     ,style:"text-align:center"});
                           
                        }
                    }
                    ,{text:"Loan Bank Id"                       ,type:"input"       ,name:"loan_bank_id"                ,width:90       ,style:"text-align:left"}
                    ,{text:"Loan Amount"                                                                                ,width:90       ,style:"text-align:right"
                        ,onRender: function(d){
                            return app.bs({name:"loan_amount"   ,type:"input"       ,value: commaSeparateNumber(app.svn(d,"loan_amount"))       ,style : "text-align:right"});
                        }
                    }
                    ,{text:"Down Payment Amount"                ,type:"input"       ,name:"dp_amount"                   ,width:130       ,style:"text-align:left"
                        ,onRender: function(d){
                            return app.bs({name:"dp_amount"     ,type:"input"       ,value: commaSeparateNumber(app.svn(d,"dp_amount"))  ,style : "text-align:right"});
                        }
                    }
                    ,{text:"Monthly Amortization"                                                                       ,width:125       ,style:"text-align:right"
                        ,onRender: function(d){
                            return app.bs({name:"monthly_amort" ,type:"input"       ,value: commaSeparateNumber(app.svn(d,"monthly_amort"))       ,style : "text-align:right"});
                        }
                    }
                    ,{text:"Years Amortization"                 ,type:"input"          ,name:"years_amort"              ,width:115       ,style:"text-align:left"}
                    ,{text:"Start Date Amortization"                                                                    ,width:130       ,style:"text-align:center"
                        ,onRender: function(d){ return app.bs({name:"start_date_amort"     ,type:"input"    ,value: app.svn(d,"start_date_amort").toShortDate()     ,style:"text-align:center"});
                           
                        }
                    }
                    ,{text:"Odometer Reading"                                                                           ,width:100       ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"odometer_reading"         ,type:"input"       ,value: app.svn(d,"odometer_reading")}) 
                                  + app.bs({name:"is_active"                ,type:"hidden"      ,value: app.svn(d,"is_active")});
                         }
                    }
                    ,{text:"PMS Odometer"                       ,type:"input"          ,name:"pms_odometer"             ,width:100       ,style:"text-align:left"}
                    ,{text:"Last PMS Date"                                                                              ,width:100       ,style:"text-align:center"
                        ,onRender: function(d){ return app.svn(d,"last_pms_date").toShortDate();
                           
                        }
                    }
                    ,{text:"Next PMS Km"                        ,type:"input"          ,name:"next_pms_km"              ,width:100       ,style:"text-align:left"}
                    ,{text:"Status"                                                                                     ,width:80        ,style:"text-align:left"
                        ,onRender: function(d){ 
                            return app.bs({name:"status_id"                 ,type:"select"      ,value: app.svn(d,"status_id")})
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                
                        }
                    }
                ] 
                ,onComplete : function(d){
                    this.find("[name='cbFilter1']").setCheckEvent("#gridVehicle input[name='cb']");
                    this.find("[name='date_acquired'],[name='start_date_amort'],[name='exp_registration_date'],[name='exp_insurance_date'],[name='franchise_exp_date'],[name='last_pms_date']").datepicker({todayHighlight:true}); 
                    this.find("[name='loan_amount'],[name='dp_amount'],[name='monthly_amort']").maskMoney();
                    this.find("[name='pms_odometer']").attr("readonly",true);
                    this.find("select[name='status_id']").dataBind({
                         sqlCode    : "S122"
                        ,text       : "status_code"
                        ,value      : "status_desc"
                    }); 
                    this.find("select[name='vehicle_maker_id']").dataBind({
                         sqlCode    : "D234"
                        ,text       : "maker_name"
                        ,value      : "vehicle_maker_id"
                    });
                    
                    this.find('input[name="pms_odometer"],input[name="next_pms_km"]').keyup(function(e){
                      if (/\D/g.test(this.value))
                      {
                        this.value = this.value.replace(/\D/g, '');
                      }
                    });
                } 
            });
        
        
    }
    
    function displaySchedPMSVehicles(){  
        var _cb = app.bs({name:"cbFilter2",type:"checkbox"});
        
        $("#gridSchedulePMS").dataBind({
             sqlCode     : "V296"
            ,parameters  : {client_id  : app.userInfo.company_id}
	        ,height      : $(window).height() - 306
            ,dataRows    : [
                    {text: _cb                                                                          ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                             return app.bs({name:"pms_id"               ,type:"hidden"      ,value: app.svn(d,"pms_id")}) 
                                  + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                  + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"PMS Schedule Date"                                                                              ,width:120       ,style:"text-align:center"
                        ,onRender: function(d){ return app.bs({name:"sched_pms_date"     ,type:"input"    ,value: app.svn(d,"sched_pms_date").toShortDate()       ,style:"text-align:center"});
                
                        }
                    }
                    ,{text:"Plate No"                            ,type:"input"          ,name:"vehicle_plate_no"        ,width:100       ,style:"text-align:left"}
                    ,{text:"Engine No"                           ,type:"input"          ,name:"engine_no"               ,width:100       ,style:"text-align:left"}
                    ,{text:"Odometer Reading"                                                                           ,width:100       ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"odometer_reading"         ,type:"input"       ,value: app.svn(d,"odometer_reading")}) 
                                  + app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")});
                         }
                    }
                    ,{text:"PMS Odometer"                       ,type:"input"          ,name:"pms_odometer"             ,width:100       ,style:"text-align:left"}
                    ,{text:"Last PMS Date"                      ,type:"input"          ,name:"last_pms_date"            ,width:100       ,style:"text-align:center"}
                    ,{text:"Next PMS Km"                        ,type:"input"          ,name:"next_pms_km"              ,width:100       ,style:"text-align:left"}
                    ,{text:"Status"                                                                                     ,width:80        ,style:"text-align:left"
                        ,onRender: function(d){ 
                            return app.bs({name:"status_id"                 ,type:"select"      ,value: app.svn(d,"status_id")});
                        }
                    }
                    
                ] 
                ,onComplete : function(d){
                    this.find("[name='cbFilter2']").setCheckEvent("#gridSchedulePMS input[name='cb']");
                    this.find("[name='sched_pms_date'],[name='last_pms_date']").datepicker({todayHighlight:true}); 
                    this.find('input[name="odometer_reading"],input[name="pms_odometer"]').keyup(function(e){
                      if (/\D/g.test(this.value))
                      {
                        this.value = this.value.replace(/\D/g, '');
                      }
                    });
                } 
            });
        
        
    }
        
   
    
    function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    }
    
    _public.showModalViewInfoVehicles = function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
        var _frm = $("#frm_modalVehicleId");
        _frm.find("#plateNoId").find("u").text(vehiclePlateNo);
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        
    }; 
    
    $("#btnPrintSaveId").click(function(){
        printQR("printThis");
    });
    
    $("#btnPrint").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:1px solid black; margin-left: 5px; margin-top: 5px;width: 204px !important;padding:3px;";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:160, height:160}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $("#gridVehicle").find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 vehicle_plate_no     : data[1]
                ,hash_key             : data[2]
            }
            
            _data.push(obj);
        }
        
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                var _hashKey = _o.hash_key;
                var _plateNo = _o.vehicle_plate_no;
                
                _h += "<td><div style='"+ _style +"'><span style='font-size:20px;'>"+_plateNo+"</span><div style='width:100%;justify-content:center;display:flex;'><div id='"+ _hashKey +"'></div></div><div style='width:100%;text-align:center;'><span style='font-size:15px !important; text-align:left !important'><b>"+gClientName+"</b></span></div></div></td>";
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this vehicle QR's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
    });
    
    $("#btnInactivate").click(function(){
        if($("#gridVehicle").find("input[name='cb']:checked").length > 0){
            if(confirm("Are you sure you want to inactivate selected items?")) {
                var _$grid = $("#gridVehicle");
                var _$loanAmt = _$grid.find("input[name='loan_amount']");
                var _$dpAmt = _$grid.find("input[name='dp_amount']");
                var _$monthlyAmort = _$grid.find("input[name='monthly_amort']");
                    _$loanAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                    _$dpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                    _$monthlyAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$grid.find("input[name='cb']:checked").closest(".zRow").find("input[name='is_active']").each(function(){this.value = "N"});
                _$grid.jsonSubmit({
                     procedure: "vehicles_upd"
                    ,notIncludes: ["dummy","cb"]
                    ,optionalItems: ["is_active","status_id"] 
                    ,onComplete: function (data) { 
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                        _$grid.trigger("refresh");
                    } 
                }); 
            }
        }
        
    });
    
    $("#btnActivate").click(function(){
        if($("#gridVehicle").find("input[name='cb']:checked").length > 0){
            if(confirm("Are you sure you want to activate selected items?")) {
                var _$grid = $("#gridVehicle");
                var _$loanAmt = _$grid.find("input[name='loan_amount']");
                var _$dpAmt = _$grid.find("input[name='dp_amount']");
                var _$monthlyAmort = _$grid.find("input[name='monthly_amort']");
                    _$loanAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                    _$dpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                    _$monthlyAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$grid.find("input[name='cb']:checked").closest(".zRow").find("input[name='is_active']").each(function(){this.value = "Y"});
                _$grid.jsonSubmit({
                     procedure: "vehicles_upd"
                    ,notIncludes: ["dummy","cb"]
                    ,optionalItems: ["is_active","status_id"] 
                    ,onComplete: function (data) { 
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                        _$grid.trigger("refresh");
                    } 
                }); 
            }
        }
        
    });
            
    $("#btnSaveVehicle").click(function(){ 
        var _$grid = $("#gridVehicle");
        var _$loanAmt = _$grid.find("input[name='loan_amount']");
        var _$dpAmt = _$grid.find("input[name='dp_amount']");
        var _$monthlyAmort = _$grid.find("input[name='monthly_amort']");
            _$loanAmt.each(function(){this.value = this.value.replace(/,/g, "");});
            _$dpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
            _$monthlyAmort.each(function(){this.value = this.value.replace(/,/g, "");});
        _$grid.jsonSubmit({
             procedure: "vehicles_upd"
            ,notIncludes: ["dummy","cb"]
            ,optionalItems: ["is_active","status_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                _$grid.trigger("refresh");
                $("#gridSchedulePMS").trigger("refresh");
            } 
        }); 
    });
    
    $("#btnSaveSchedPMS").click(function(){ 
        var _$grid = $("#gridSchedulePMS");
        _$grid.jsonSubmit({
             procedure: "vehicle_pms_sched_upd"
            ,notIncludes: ["vehicle_plate_no","cb","engine_no","pms_odometer","last_pms_date","status_id"]
            //,optionalItems: ["is_active","status_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                _$grid.trigger("refresh");
            } 
        }); 
    });
    
    $("#btnDelete").click(function(){ 
        zsi.form.deleteData({ 
            code:"ref-00012"
           ,onComplete:function(data){
                $("#gridVehicle").trigger("refresh");
                $("#gridSchedulePMS").trigger("refresh");
           }
        });
    });
    
    $("#btnFilterAsset").click(function(){ 
        displayVehicles(gVehicleMakerId);
    });
    
    $("#btnSearchVal").click(function(){ 
        displayVehicles();
        
    }); 
   $("#searchVal").on('keypress',function(e){
        if(e.which == 13) {
           displayVehicles();
        }
    });

    $("#searchVal").keyup(function(){
        displayVehicles();
    });
    
    $("#btnResetVal").click(function(){
        $("#searchVal").val("");
        displayVehicles();
    });
    
    return _public;
})();                           