  var payment = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
        ,gPaymentId      = ""
        ,gPaoId1         = null
        ,gPaoId2         = null
        ,gDriverId1      = null
        ,gDriverId2      = null
        ,gRouteId1       = null
        ,gRouteId2       = null
        ,gVehicleId1     = null
        ,gVehicleId2     = null
        ,gzGrid1         = "#gridTransactions"
        ,gzGrid2         = "#gridPostedTransactions" 
        ,gzGrid3         = "#gridDailyFareCollections"
        ,gSubTabName     = ""
        ,gTabName        = ""
    ;
    
    zsi.ready = function(){ 
        
        $(".page-title").html("Fare Collections");
        $(".panel-container").css("min-height", $(window).height() - 190);
        dateValidation();
        displayTransactions();
        displayPostedTransactions(); 
        dropdowns();  
    };
    
   
    $(".nav-tab-main").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text());
        gSubTabName = "";

        $("#wrapOrderStatus").show();
        $(".nav-tab-sub").find(".nav-item").removeClass("active");
        $(".nav-tab-sub").find(".nav-item:first-child()").addClass("active");

        if(gTabName === "Daily Fare Collection"){
            gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());
        } 
        displayDailyFareCollection();
    });  
    $(".nav-tab-sub").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());
        displayDailyFareCollection(); 
    }); 
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        switch(target){
            case "#nav-posted":
                gActiveTab = "posted";
                setFooterFreezed(gzGrid2);
                break;
            case "#nav-forPosting":
                gActiveTab = "for-posting";
                setFooterFreezed(gzGrid1);
                break; 
          default:break;
        }
    });
    function dropdowns(){
        gActiveTab = "for-posting";
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
            
            
        $('.PAOForRemitted').select2({allowClear: true});
        $('#dailyFare_pao').select2({allowClear: true});
        $('#dailyFare_vehicle').select2({allowClear: true});
        $('#vehicleRemitted').select2({allowClear: true});
        $('#dailyFare_route').select2({allowClear: true});
        $('#dailyFare_driver').select2({allowClear: true});
        $('#routeIdPosted').select2({allowClear: true});
        $('#driverIdPosted').select2({allowClear: true});  
        $("#dailyFare_driver").dataBind({
            sqlCode      : "D1262" //dd_drivers_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _driver_id         = isUD(_info) ? "" : _info.user_id;
                gDriverId1 = _driver_id;
           }
        }); 
        $("#dailyFare_vehicle").dataBind({
            sqlCode      : "D1264" //dd_vehicle_sel
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _vehicle_id     = isUD(_info) ? "" : _info.vehicle_id;
                   gVehicleId1 = _vehicle_id;
           }
        });
        $("#driverIdPosted").dataBind({
            sqlCode      : "D1262" //dd_drivers_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _driver_id         = isUD(_info) ? "" : _info.user_id;
                gDriverId2 = _driver_id;
           }
        }); 
        $("#routeIdPosted").dataBind({
            sqlCode      : "R1224" //route_ref_sel
           ,text         : "route_code"
           ,value        : "route_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _route_id         = isUD(_info) ? "" : _info.route_id;
                gRouteId2 = _route_id;
           }
        }); 
        $("#dailyFare_pao").dataBind({
            sqlCode      : "D1263" //dd_pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId1 = _pao_id;
           }
        });
        $(".PAOForRemitted").dataBind({
            sqlCode      : "D1263" //dd_pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId2 = _pao_id;
           }
        }); 
        
        $("#vehicleRemitted").dataBind({
            sqlCode      : "D1264" //dd_vehicle_sel
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _vehicle_id     = isUD(_info) ? "" : _info.vehicle_id;
                   gVehicleId2 = _vehicle_id;
           }
        });
        $("#paymentTypeIdPosted").fillSelect({
            data: [
                 { text: "QR"       , value: "QR"  }
                ,{ text: "CASH"     , value: "CASH"}
                
            ]
            ,onChange : function(){
                gPaymentId = this.val();
                
            }
            ,onComplete     : function(){
                $("option:first-child",this).text("PAYMENT TYPE");
                $("option:first-child",this).val("");
            }
        });
        
    }
    function dateValidation(){
        $("#dailyFare_to").attr("disabled",true); 
        $("#posted_date_to").attr("disabled",true); 
       // $("#dailyFare_from").datepicker({ endDate: new Date()}); 
        $("#dailyFare_from").datepicker({
             autoclose : true 
             ,endDate: new Date()  
        }).datepicker("setDate",'-0d').on("changeDate",function(e){  
            $("#dailyFare_to").removeAttr("disabled",true);  
            
            $("#dailyFare_to").datepicker('setStartDate', e.date); 
        });
         
        $("#dailyFare_to").datepicker({
             autoclose : true
            ,endDate: new Date() 
        }) ;
        
        
        
        
        
        
        $("#posted_date_from").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).datepicker("setDate","0").on("changeDate",function(e){ 
            gVfrom = $(this).val();
            $("#posted_date_to").removeAttr("disabled",true);  
            $("#posted_date_to").datepicker('setStartDate', e.date).on("change",function(){
               gVtoDate = $(this).val();
            }); 
        });
        $("#posted_date_to").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).datepicker("setDate","0"); 
    }
    
    function displayTransactions(dateFrm,dateTo,routeId,vehicleId,driverId,paoId){
        zsi.getData({
                 sqlCode    : "P1231" //payment_for_posting_sel
                ,parameters : {payment_frm:(dateFrm ? dateFrm : ""),payment_to:(dateTo ? dateTo : ""),route_id:(routeId ? routeId : ""),vehicle_id:(vehicleId ? vehicleId : ""),driver_id:(driverId ? driverId : ""),pao_id:(paoId ? paoId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             payment_date       : ""
                            ,inspector_id       : ""
                            ,route_code         : ""
                            ,from_location      : ""
                            ,to_location        : ""
                            ,no_klm             : "Total Amount"
                            ,no_reg             : _tot.reg_no
                            ,no_stu             : _tot.stu_no
                            ,no_sc              : _tot.sc_no
                            ,no_pwd             : _tot.pwd_no
                            ,reg_amount         : _tot.reg
                            ,stu_amount         : _tot.stu
                            ,sc_amount          : _tot.sc
                            ,pwd_amount         : _tot.pwd
                            ,total_paid_amount  : _tot.total
                            ,post_id            : ""
                            ,qr_id              : ""
                            ,driver             : ""
                            ,pao                : ""
                            ,vehicle_plate_no   : ""
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid1).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(1)
                        ,onComplete: function(o){
                            var _this   = this;
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            if(o.data.length <= 1)$("#btnSaveTransations").attr("disabled",true);
                            else $("#btnSaveTransations").removeAttr("disabled");
                            var _$dateFr = _this.find(".zRow:first-child()").find("[name='payment_date']").val();
                            var _$dateTo = _this.find(".zRow:nth-last-child(2)").find("[name='payment_date']").val();
                            var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                            var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates();
                            
                    }
                });

            }
        });
    }
    
    function displayPostedTransactions(fromDate,toDate,paymentId,routeId,vehicleId,driverId,paoId){
        zsi.getData({
                 sqlCode    : "P1235" //payment_posted_sel
                ,parameters : {posted_frm:(fromDate ? fromDate : ""),posted_to:(toDate ? toDate : ""),payment_type:(paymentId ? paymentId : ""),route_id:(routeId ? routeId : ""),vehicle_id:(vehicleId ? vehicleId : ""),driver_id:(driverId ? driverId : ""),pao_id:(paoId ? paoId : "")} 
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = { reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                         payment_id         : ""
                        ,payment_date       : ""
                        ,inspector_id       : ""
                        ,route_code         : ""
                        ,from_location      : ""
                        ,to_location        : ""
                        ,no_klm             : "Total Amount"
                        ,no_reg             : _tot.reg_no
                        ,no_stu             : _tot.stu_no
                        ,no_sc              : _tot.sc_no
                        ,no_pwd             : _tot.pwd_no
                        ,reg_amount         : _tot.reg
                        ,stu_amount         : _tot.stu
                        ,sc_amount          : _tot.sc
                        ,pwd_amount         : _tot.pwd
                        ,total_paid_amount  : _tot.total
                        ,post_id            : ""
                        ,qr_id              : ""
                        ,driver             : ""
                        ,pao                : ""
                        ,vehicle_plate_no   : ""
                        //,posted_date        : ""
                        ,company_code       : ""
                        ,created_by         : ""
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid2).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(2)
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            if(o.data.length <= 1)$("#btnExportTransations").attr("disabled",true);
                            else $("#btnExportTransations").removeAttr("disabled");
                           /* var _$dateFr = _this.find(".zRow:first-child()").find("[name='posted_date']").val();
                            var _$dateTo = _this.find(".zRow:nth-last-child(2)").find("[name='posted_date']").val();
                            var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                            var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates(); */
                            setFooterFreezed(gzGrid1);

                    }
                });
            }
        });
    }
    
    function getFilters(){ 
        var  _$filter       = $("#nav-dailyFareCollection")
            ,_clientId      = app.userInfo.company_id
            ,_vehicleId     = _$filter.find('#dailyFare_vehicle').val() 
            ,_driverId      = _$filter.find('#dailyFare_driver').val()
            ,_dateFrom      = _$filter.find('#dailyFare_from').val()
            ,_dateTo        = _$filter.find("#dailyFare_to").val() ;
            
        return {
             client_id      : _clientId
            ,vehicle_id     : _vehicleId   
            ,driver_id      : _driverId
            ,pdate_from     : _dateFrom
            ,pdate_to       : _dateTo 
        };
    }      
    
    function displayDailyFareCollection(){
        var _$tabPanel = $("#nav-dailyFareCollection")
            ,_$navGrid = "gridDailyFareCollections"
            ,_sqlCode  = "P1338" //DEFAUL SQL payment_recent_sel
            ,_o        = getFilters()
            ,_params = {
                 client_id   : _o.client_id
                ,vehicle_id  : _o.vehicle_id
                ,driver_id   : _o.driver_id  
            }
            ,_paramsHistory ={
                 client_id   : _o.client_id
                ,vehicle_id  : _o.vehicle_id
                ,driver_id   : _o.driver_id 
                ,pdate_from  : _o.pdate_from 
                ,pdate_to    : _o.pdate_to  
            };
            switch(gTabName){  
                case "Daily Fare Collection":  
                    switch (gSubTabName) { 
                        case "Recent Collection": 
                            $("#nav-dailyFareCollection").find("#dateHide,#dateHideTo").addClass("hide"); 
                            _sqlCode = "P1338"; //payment_recent_sel
                            _params = _params
                            setFooterFreezed(gzGrid3);  
                            break;
                        case "History Collection": 
                           $("#nav-dailyFareCollection").find("#dateHide,#dateHideTo").removeClass("hide"); 
                           _sqlCode = "P1337";    //payment_history_sel
                           _params = _paramsHistory;
                            setFooterFreezed(gzGrid3);  
                            break;
                    }
                break;
            } 
           
            var _getDataRows = function(){ 
                if(gSubTabName === "Recent Collection" || gSubTabName === "History Collection"){ 
                    var _dataRows =[
                         {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
                		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
                		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
                		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
                		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
                		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                            ,onRender: function(d){
                                return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                                    +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                            }
                        }
                                        
                    ]; 
                    
                    _dataRows.push(
                         {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1} 
                        ,{text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Driver"                    ,name:"full_name"               ,type:"input"       ,width : 130   ,style : "text-align:center;"       ,groupId : 1} 
                        ,{text: "Distance"                  ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Base Fare"                  ,name:"base_fare"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                            ,onRender: function(d){
                                return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                            ,onRender: function(d){
                                return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                            ,onRender: function(d){
                                return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                            ,onRender: function(d){
                                return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                            }
                        }
                        ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                            ,onRender: function(d){
                                return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                            }
                        } 
                    );
                    
                    return _dataRows;  
                }
            };  
            
        zsi.getData({
                 sqlCode    : _sqlCode //payment_for_posting_sel
                ,parameters :  _params
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             payment_date       : ""
                            ,inspector_id       : ""
                            ,route_code         : ""
                            ,from_location      : ""
                            ,to_location        : ""
                            ,no_klm             : "Total Amount"
                            ,no_reg             : _tot.reg_no
                            ,no_stu             : _tot.stu_no
                            ,no_sc              : _tot.sc_no
                            ,no_pwd             : _tot.pwd_no
                            ,reg_amount         : _tot.reg
                            ,stu_amount         : _tot.stu
                            ,sc_amount          : _tot.sc
                            ,pwd_amount         : _tot.pwd
                            ,total_paid_amount  : _tot.total
                            ,post_id            : ""
                            ,qr_id              : ""
                            ,driver             : ""
                            ,pao                : ""
                            ,vehicle_plate_no   : ""
                    };
                    
                    d.rows.push(_total);
                    $("#"+_$navGrid).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 500
                        ,dataRows       : _getDataRows()
                        ,onComplete: function(o){
                            var _this   = this;
                            console.log("o",o);
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                            /*$("#dailyFare_driver").val(o.)*/
                    }
                });

            }
        });
    }
    
    
    
    
    function getDataRowsByStatus(statusId){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
             {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
    		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
    		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
    		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
    		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
    		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
    		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
            ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                ,onRender: function(d){
                    return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                        +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                }
            }
                            
        ];
        
       /* if(statusId === 2){
            _dataRows.push(                    
                {text: "Posted Date"                                                      ,width : 150          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "posted_date"          ,type: "input"     ,value: app.svn(d,"posted_date")    ,style : "text-align:center;"});
                    }
                }
            );
        }*/
        
        _dataRows.push(
             {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "PAO"                       ,name:"pao"                     ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Driver"                    ,name:"driver"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Inspector"                 ,name:"inspector_id"            ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Route"                     ,name:"route_code"              ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Distance"                  ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                ,onRender: function(d){
                    return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                }
            }
            ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                ,onRender: function(d){
                    return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                ,onRender: function(d){
                    return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                ,onRender: function(d){
                    return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                }
            }
            ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                ,onRender: function(d){
                    return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                }
            }
            ,{text: "Payment Type"               ,name:"payment_type"           ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 7}
                        
        );
        
        return _dataRows;
    }
    
    function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 40;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight});
        _zTotal.prev().css({"margin-bottom":23 }); 
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }
    
    $("#btnSaveTransations").click(function () {
      $("#gridTransactions").jsonSubmit({
           procedure: "payment_posting_upd"
          ,notIncludes : ["payment_date","vehicle_plate_no","pao","driver","inspector_id","route_id","from_location","to_location","no_klm","no_reg","reg_amount","no_stu","stu_amount","no_sc","sc_amount","no_pwd","pwd_amount","total_paid_amount","payment_type","route_code"]
          ,onComplete: function (data) {
              displayTransactions();
              displayPostedTransactions();
              if(data.isSuccess===true) zsi.form.showAlert("alert");
              
              $("#gridTransactions").convertToTable(
                function($table){
                    $("#ExcelgridTransactions").find("th").remove();
                    setTimeout(function(){
                        var _confirmation = confirm("Do you want to print this data?");
                        if (_confirmation === true) {
                            var mywindow = window.open('', 'PRINT');
                            mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;}</style></head><body>');
                            mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                            mywindow.document.write('<div style="text-align:center;"><h4>Run Date: '+gDate+'</h4></div>');
                            mywindow.document.write('<table style="border-collapse: collapse;">');
                            mywindow.document.write('<thead><tr><td colspan="9">&nbsp;</td><td colspan="2">Regular</td><td colspan="2">Student</td><td colspan="2">Senior</td><td colspan="2">PWD</td><td ></td><td></td></tr>');
                            mywindow.document.write('<tr><td>Date</td><td>Vehicle</td><td>PAO</td><td>Driver</td><td>Inspector</td><td>Route</td><td>From</td><td>To</td><td>Distance</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Total Amount</td><td>Payment Type</td></tr></thead>');
                            mywindow.document.write(document.getElementById("ExcelgridTransactions").innerHTML);
                            mywindow.document.write('</table></body></html>');
                            mywindow.document.close();
                            mywindow.focus();
                            mywindow.print();
                            mywindow.close();
                        }
                        return true;
                    }, 1000);
                });
            }
        });
    });
     
   
    $("#btnExportTransations").click(function () {
      $("#gridPostedTransactions").convertToTable(
        function($table){
            $table.find("th").closest("tr").remove();
            $("#ExcelgridPostedTransactions tbody").before('<thead><tr><th colspan="10"></th><th colspan="2">Regular</th><th colspan="2">Student</th><th colspan="2">Senior</th><th colspan="2">PWD</th><th ></th><th></th></tr>'
                        + '<tr><th>Payment Date</th><th>Posted Date</th><th>Vehicle</th><th>PAO</th><th>Driver</th><th>Inspector</th><th>Route</th><th>From</th><th>To</th><th>Distance</th><th>Qty</th><th>Total</th><th>Qty</th>'
                        + '<th>Total</th><th>Qty</th><th>Total</th><th>Qty</th><th>Total</th><th>Total Amount</th><th>Payment Type</th></tr></thead>'
            );
            $table.htmlToExcel({
               fileName: "Posted Payments"
           });
        });
    });
    
    //for posting tab
    $("#btnFilterCollection").click(function(){  
        displayDailyFareCollection();
        setTimeout(function(){
            setFooterFreezed(gzGrid1);
        }, 1000);
    }); 

    $("#btnResetDailyFareVal1").click(function(){
        $("#paymentTypeId1").val("");
        $("#dailyFare_route").val(null).trigger('change');
        $("#dailyFare_vehicle").val(null).trigger('change');
        $("#dailyFare_driver").val(null).trigger('change');
        $("#PAOForRemitt").val(null).trigger('change');
        displayTransactions();
    });
    
    //posted tab
    $("#btnFilterVal2").click(function(){ 
        var _from = $.trim($("#posted_date_from").val()); 
        var _to = $.trim($("#posted_date_to").val()); 
        displayPostedTransactions(_from,_to,gPaymentId,gRouteId2,gVehicleId2,gDriverId2,gPaoId2);
        setTimeout(function(){
            setFooterFreezed(gzGrid2);
        }, 1000);
    }); 

    $("#btnResetPosted").click(function(){
        $("#paymentTypeId2").val("");
        $("#routeIdPosted").val(null).trigger('change');
        $("#vehicleRemitted").val(null).trigger('change');
        $("#driverIdPosted").val(null).trigger('change');
        $("#PAOForRemitted").val(null).trigger('change');
        displayPostedTransactions();
    });
    
    
    return _pub;
})();                                                                          