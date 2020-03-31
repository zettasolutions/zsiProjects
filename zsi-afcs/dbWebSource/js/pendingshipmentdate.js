 var ppsd=(function(){

        var      bs             = zsi.bs.ctrl
                ,svn            = zsi.setValIfNull 
                ,_pub           = {}
                ,gOrderListData     = []
        ;        
        zsi.ready = function(){ 
            $(".page-title").html("Pending Shipment Dates");
             var _$form = $(".panel-row");
                 _$form.find("#model_year").dataBind({
                     sqlCode    : "D211" //dd_program_bp_sel
                   ,parameters : {program_id:5}
                    ,text       : "model_year_name"
                    ,value      : "model_year" 
                }); 
                _$form.find("#order_type").dataBind({
                     sqlCode    : "D263" //dd_order_order_types_sel
                   ,parameters : {program_id:5}
                    ,text       : "order_type"
                    ,value      : "order_type_id" 
                }); 
                 _$form.find("#ship_location").dataBind({
                     sqlCode    : "D264" //dd_order_sites_sel
                   ,parameters : {program_id:5}
                    ,text       : "site_code"
                    ,value      : "site_id" 
                }); 
                _$form.find("#filter_build_phase_id").dataBind({
                     sqlCode    : "D210" //dd_program_bp_sel
                    ,parameters : {program_id:5}
                    ,text       : "build_phase_abbrv"
                    ,value      : "build_phase_id" 
                });
                _$form.find("#filter_po_no").dataBind({
                     sqlCode    : "D272" //dd_order_status_sel
                   ,parameters : {program_id:5}
                    ,text       : "status_desc"
                    ,value      : "status_id"
                });
                _$form.find("#filter_customer_id").dataBind({
                     sqlCode    : "D266" //dd_order_customers_sel
                    ,parameters : {program_id:5}
                    ,text       : "customer"
                    ,value      : "customer_id"
                }); 
                _$form.find("#filter_plants").dataBind({
                     sqlCode    : "D230" //dd_order_plants_sel 
                   ,parameters : {program_id:5}
                    ,text       : "plant"
                    ,value      : "plant_id"
                }); 
                _$form.find("#filter_opStatus").dataBind({  
                    sqlCode    : "D267" //dd_order_parts_status_sel
                    ,parameters : {program_id:5}
                    ,text       : "op_status"
                    ,value      : "op_status_id"
                }); 
                
                displayPendingShipDate();
                btnClear();
                filterDropdown();
            
        };  
        _pub.ShowModalTargetShipDate = function(po,lineNo,sqlCode){ 
                var _$form = $("#frm_modalWindowPendingShipmentDate").find(".modal-body");   
                g$mdl = $("#modalWindowPendingShipmentDate"); 
                g$mdl.find(".modal-title").html("PO No » " + po + " | "+"Line No.» "+ lineNo) ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });  
                if(sqlCode === "O257")  $("#modalWindowPendingShipmentDate").find("#navManufacturing").trigger("click"); 
                _$form.find("#model_year").dataBind({
                     sqlCode    : "D211" //dd_program_bp_sel
                   ,parameters : {program_id:5}
                    ,text       : "model_year_name"
                    ,value      : "model_year" 
                }); 
                _$form.find("#order_type").dataBind({
                     sqlCode    : "D263" //dd_order_order_types_sel
                   ,parameters : {program_id:5}
                    ,text       : "order_type"
                    ,value      : "order_type_id" 
                }); 
                 _$form.find("#ship_location").dataBind({
                     sqlCode    : "D264" //dd_order_sites_sel
                   ,parameters : {program_id:5}
                    ,text       : "site_code"
                    ,value      : "site_id" 
                }); 
                _$form.find("#filter_build_phase_id").dataBind({
                     sqlCode    : "D210" //dd_program_bp_sel
                    ,parameters : {program_id:5}
                    ,text       : "build_phase_abbrv"
                    ,value      : "build_phase_id" 
                });
                _$form.find("#filter_po_no").dataBind({
                     sqlCode    : "D272" //dd_order_status_sel
                   ,parameters : {program_id:5}
                    ,text       : "status_desc"
                    ,value      : "status_id"
                });
                _$form.find("#filter_customer_id").dataBind({
                     sqlCode    : "D266" //dd_order_customers_sel
                    ,parameters : {program_id:5}
                    ,text       : "customer"
                    ,value      : "customer_id"
                }); 
                _$form.find("#filter_plants").dataBind({
                     sqlCode    : "D230" //dd_order_plants_sel 
                   ,parameters : {program_id:5}
                    ,text       : "plant"
                    ,value      : "plant_id"
                }); 
                _$form.find("#filter_opStatus").dataBind({  
                    sqlCode    : "D267" //dd_order_parts_status_sel
                    ,parameters : {program_id:5}
                    ,text       : "op_status"
                    ,value      : "op_status_id"
                }); 
               displayPopUpOrderList();
            };
        
        function btnClear(){
            var _$popColumns = $("#modalWindowPendingShipmentDate");
            var _$filterCulomns = $(".panel-row") 
              ,_filterData = function(){ 
                _$filterCulomns.find('#model_year').val(" ");  
                _$filterCulomns.find("#order_type").val(' ');  
                _$filterCulomns.find("#ship_location").val(' ');
                _$filterCulomns.find("#filter_build_phase_id").val(' ');
                _$filterCulomns.find("#filter_order_status_id").val(' ');
                _$filterCulomns.find("#filter_customer_id").val(' ');
                _$filterCulomns.find("#filter_po_no").val(' ');
                _$filterCulomns.find("#filter_plants").val(' ');
                /***************************************************/
                _$popColumns.find('#model_year').val(" ");  
                _$popColumns.find("#order_type").val(' ');  
                _$popColumns.find("#ship_location").val(' ');
                _$popColumns.find("#filter_build_phase_id").val(' ');
                _$popColumns.find("#filter_order_status_id").val(' ');
                _$popColumns.find("#filter_customer_id").val(' ');
                _$popColumns.find("#filter_po_no").val(' ');
                _$popColumns.find("#filter_plants").val(' ');
            };
            $("#btnClear").on("click",function(){  
                _filterData();
               displayPendingShipDate();
            });
            $("#btnPopClear").on("click",function(){  
                _filterData();
               displayPopUpOrderList();
            });
        } 
           
        function getFilters(){  
            var  _$filterTab = $(".panel-row"); 
            var  _$filter   = $("#frm_modalWindowPendingShipmentDate").find(".modal-body"); 
            var _$modelY  = _$filter.find('#model_year').val()
                ,_$orderT  = _$filter.find("#order_type").val()
                ,_shipLoc  = _$filter.find("#ship_location").val()
                ,_opStatus = _$filter.find("#filter_opStatus").val()
                ,_$fbpId   = _$filter.find("#filter_build_phase_id").val()
                ,_$fstId   = _$filter.find("#filter_order_status_id").val()
                ,_$fcId    = _$filter.find("#filter_customer_id").val()
                ,_$fplant  = _$filter.find("#filter_plants").val();
            
                /**********************/
                 
            return { 
                 model_year     : _$modelY  
                ,op_status_id   : _opStatus
                ,order_type_id  : _$orderT
                ,site_id        : _shipLoc
                ,plant_id       : _$fplant
                ,bpId           : _$fbpId
                ,statusId       : _$fstId
                ,customerId     : _$fcId 
            };
        }  
        
        function filterDropdown(){
             var  _$filterTab = $(".panel-row") 
                ,_$modelY  = _$filterTab.find('#model_year').val()
                ,_$orderT  = _$filterTab.find("#order_type").val()
                ,_shipLoc  = _$filterTab.find("#ship_location").val()
                ,_opStatus = _$filterTab.find("#filter_opStatus").val()
                ,_$fbpId   = _$filterTab.find("#filter_build_phase_id").val()
                ,_$fstId   = _$filterTab.find("#filter_order_status_id").val()
                ,_$fcId    = _$filterTab.find("#filter_customer_id").val()
                ,_$fplant  = _$filterTab.find("#filter_plants").val(); 
                 
            return { 
                 model_year     : _$modelY  
                ,op_status_id   : _opStatus
                ,order_type_id  : _$orderT
                ,site_id        : _shipLoc
                ,plant_id       : _$fplant
                ,bpId           : _$fbpId
                ,statusId       : _$fstId
                ,customerId     : _$fcId 
            };
        }
           
        function displayPendingShipDate(){
                var _o = filterDropdown()
                    /*,_params = {
                         program_id     : 5  
                        ,oem_id         : _o.oem_id 
                        ,bp_id          : _o.bpId 
                        ,status_id      : _o.statusId  
                        ,customer_id    : _o.customerId
                        ,model_year     : _o.model_year
                        ,order_type_id  : _o.order_type_id
                        ,site_id        : _o.site_id
                        ,plant_id       : _o.plant_id 
                    }*/;                   
                var  _ctr = -1
                     ,count  = 0
                     ,_sqlCode = "O257";
                    $("#grid").dataBind({
                 	    sqlCode         : _sqlCode  //order_pending_target_ship_date_sel
                	    ,height         : $(window).height() - 400 
                       // ,parameters     : _params
                        ,dataRows       : [
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                               ,onRender : function(d){
                                   count++; 
                                  return app.bs({value: count}); 
                              }
                          }
                           ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                              ,onRender : function(d){ 
                                  _ctr++;
                                  var _link = "<a href='javascript:void(0)' id='po_no'  onclick='ppsd.ShowModalTargetShipDate(\""+ app.svn (d,"po_no") +"\",\""+ app.svn (d,"line_no") +"\",\""+ _sqlCode +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                  return (d !== null ? _link : "");    
                              }
                          } 
                           ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                              ,onRender : function(d){    
                                  var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='ppsd.ShowModalTargetShipDate(\""+ app.svn (d,"po_no") +"\",\""+ app.svn (d,"line_no") +"\",\""+ _sqlCode +"\")'>"+ app.svn (d,"line_no") +"</a>";
                                  return (d !== null ? _link : "");    
                              } 
                          }  
                          ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                              ,onRender: function(d){
                                  return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                              }
                          } 
                          ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                          ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                          ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                          ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 } 
                          ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80         ,style : "text-align:right; padding-right: 2px"} 
                          ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                          ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80         ,style : "text-align:center"     ,sortColNo: 11} 
                          ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                          ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                              ,onRender: function(d){
                                  return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                              }
                          } 
                          ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                  ,onRender: function(d){
                                      return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                  }
                              } 
                              ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                  ,onRender: function(d){
                                      return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                  }
                              } 
                          ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                          ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17}   
    	                    ]
                    	    ,onComplete: function(){
                                this.find(".zRow").find("[name='oem_id']").attr('readonly', true);
                                this.find("input").attr("readonly", true);
                                 
                        }
                    }); 
             }  
        
       
        function displayPopUpOrderList(){  
            var _o = getFilters()     
                ,_navItem = ""  
                ,_navGrid = "" 
                ,_params = {
                     program_id     : 1  
                    ,oem_id         : _o.oem_id 
                    ,bp_id          : _o.bpId 
                    ,status_id      : _o.statusId  
                    ,customer_id    : _o.customerId
                    ,model_year     : _o.model_year
                    ,order_type_id  : _o.order_type_id
                    ,site_id        : _o.site_id
                    ,plant_id       : _o.plant_id 
                    //,op_status_id   : _o.op_status_id 
                    ,search_val     : ""      
                    ,search_col     : "" 
                }
                ,_params1 = {
                     program_id     : 1  
                    ,oem_id         : _o.oem_id 
                    ,bp_id          : _o.bpId 
                    ,status_id      : _o.statusId  
                    ,customer_id    : _o.customerId
                    ,model_year     : _o.model_year
                    ,order_type_id  : _o.order_type_id
                    ,site_id        : _o.site_id
                    ,plant_id       : _o.plant_id 
                    //,op_status_id   : _o.op_status_id 
                     
                }
                ,_params2 = {
                     program_id : 1 
                    ,oem_id     : 5
                } 
                ,_params3 = {
                     program_id     : 1 
                    ,oem_id         : _o.oem_id 
                    ,bp_id          : _o.bpId 
                    ,status_id      : _o.statusId  
                    ,customer_id    : _o.customerId
                } 
                ,_params4 = {
                     
                };
                console.log("_o",_o);
                var _sqlCode = "O181" //DEFAULT SQL CODE 
                ,_setNavByRoleId = function(){ 
                    var _$navCoordinator = $("#nav-tab")
                        ,_$navMfg = $("#nav-tab-mfg")
                        ,_$navWhs = $("#nav-tab-whs")
                        ,_$navSubMfg = $(".nav-sub-mfg")
                        ,_$navSubWhs = $(".nav-sub-whs")
                        ,_$navSubPlpd = $("#nav-sub-plpd"); 
                        
                        _navItem = _$navCoordinator.find(".nav-item.active").text();
                        if(_navItem === "Manufacturing"){
                            _navGrid = "gridMfg";
                            _navItem = _$navSubMfg.find(".nav-item.active").text();
                        }else if(_navItem === "Warehouse"){
                            _navGrid = "gridWhs";
                            _navItem = _$navSubWhs.find(".nav-item.active").text();
                        }else if(_navItem==="MLD Replacements"){   
                            _navGrid = "gridMLD";
                            _sqlCode = "O235"; //order_pending_promise_date_sel NO PROCEDURE YET
                            //_params = _params4;
                        }
                        else if(_navItem==="Red Border"){   
                            _navGrid = "gridRedBorder";
                            _sqlCode = "O271"; // order_red_borders_sel
                            //_params = _params4;
                        }else if(_navItem === "Pending Lear Promise Date"){ 
                            _navGrid = "gridPlpd";
                            _sqlCode = "O235";  // order_pending_promise_date_sel  
                           // _params = _params4;  
                        }  
                
                    console.log("_navItem",_navItem);
                    console.log("_navGrid",_navGrid);
                 
    //**************************************************************************************************************//                   
                     
                    if(_navItem==="Order List"){
                        _navGrid = "gridOrderList"; 
                        _sqlCode = "O181"; //order_list_sel
                    }
                    else if(_navItem.indexOf("MRD's") !== -1){                                 
                        _sqlCode = "O247";  //order_upcoming_customer_mrd_sel        
                        _params = _params3; 
                    } 
                    else if(_navItem.indexOf("warehouse") !== -1){                                         
                        _sqlCode = "O256";  //order_enroute_to_warehouse_sel   
                        _params = _params4;  
                    }                                                                           
                    else if(_navItem.indexOf("customer") !== -1){                       
                        _sqlCode = "O255"; //order_enroute_to_customer_sel
                        _params = _params4;  
                    }                                                                  
                    else if(_navItem.indexOf("Proof") !== -1){   
                        _sqlCode = "P279"; //PROOF DELIVERY SEL
                        _params = _params4;
                    }   
                    else{
                        if(_navItem.indexOf("Pending Plant Target Ship Dates") !== -1){ 
                            _sqlCode = "O257"; //order_pending_target_ship_date_sel
                            _params = _params4;
                        }
                        else if(_navItem.indexOf("Upcoming") !== -1){ 
                            _sqlCode = "O241"; //order_upcoming_ship_dates_sel
                           _params = _params2;
                            
                            _index = _$navMfg.find(".nav-link.active").index(); 
                            if(app.userInfo.role_id===11 || app.userInfo.role_id===5){
                                _index = _$navSubMfg.find(".nav-link.active").index(); 
                            }
                            _params.level_no = _index -1;  
                        }
                        else if(_navItem.indexOf("Overdue") !== -1){ 
                            _sqlCode = "O254"; //order_overdue_ship_dates_sel 
                            _params = _params4;
                        }  
                    } 
                } 
                
                ,_displayRecords = function(){ 
                    var  _ctr = -1
                        ,count       = 0
                        ,_datarows = [
                          {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                               ,onRender : function(d){
                                   count++; 
                                  return app.bs({value: count}); 
                              }
                          }
                          ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                              ,onRender : function(d){ 
                                  _ctr++;
                                  var _link = "<a href='javascript:void(0)' id='po_no' '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                  return (d !== null ? _link : "");    
                              }
                          } 
                           ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                              ,onRender : function(d){    
                                  var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                  return (d !== null ? _link : "");    
                              } 
                          }  
                          ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                              ,onRender: function(d){
                                  return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                              }
                          } 
                          ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                          ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                          ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                          ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 } 
                          ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80         ,style : "text-align:right; padding-right: 2px"} 
                          ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                          ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80         ,style : "text-align:center"     ,sortColNo: 11} 
                          ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                          ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                              ,onRender: function(d){
                                  return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                              }
                          } 
                          ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                              ,onRender: function(d){
                                  return bs({name:"mfg_target_ship_date"                  ,value : app.svn(d,"mfg_target_ship_date").toShortDate()});
                              }
                          } 
                          ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                              ,onRender: function(d){
                                  return bs({name:"lear_promise_date"                  ,value : app.svn(d,"lear_promise_date").toShortDate()});
                              }
                          } 
                          ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                          ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                      ]; 
                       
                    if(_navItem === "Order List"){ 
                        _datarows =  [ //Pending Lear promise Date Table 
                        {text: ''                                               ,width : 25                 ,style : "text-align:left"  
                                ,onRender : function(d){
                                    _ctr++;  
                                    return  (d !==null ? (app.userInfo.role_id===5 && _navItem==="Order List" ? app.bs({name:"rb",type:"radio",style:" width: 13px; margin:0 5px;", value: _ctr}) : "") : ""); 
                                }
                            }
                            ,{text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            } 
                            ,{text: "Order Status"                                  ,type:"input"               ,name:"status_desc"            ,width : 130         ,style : "text-align:left"    ,sortColNo: 1 } 
                            ,{text: "PO No"                                         ,width : 140                ,style : "text-align:left"   ,sortColNo: 2 
                                ,onRender : function(d){ 
                                    var _link = "<a href='javascript:void(0)' id='po_no'  '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                            ,{text: "Line No"                                       ,width : 70                 ,style : "text-align:center" 
                                ,onRender : function(d){  
                                    var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 } 
                            
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"      } 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100         ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){ 
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                  ,onRender: function(d){
                                      return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                  }
                              } 
                              ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                  ,onRender: function(d){
                                      return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                  }
                              } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    } //tapot
                    
                    if( _navItem === "Red Border"){ 
                        _datarows =  [ //
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            }
                            ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                                ,onRender : function(d){ 
                                    _ctr++;
                                    var _link = "<a href='javascript:void(0)' id='po_no'  '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                             ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                                ,onRender : function(d){    
                                    var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "Part Status"                                   ,width : 165                ,style : "text-align:left;padding-left: 2px"        ,sortColNo: 8
                                ,onRender : function(d){  
                                    var _link = "<a href='javascript:void(0)'  '>"+ app.svn (d,"op_status") +"</a>";
                                    return (d !== null ? _link : "");   
                                } 
                            }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                ,onRender: function(d){
                                    return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                }
                            } 
                            ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                ,onRender: function(d){
                                    return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                }
                            } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    }//tapot 
                    
                    if( _navItem === "MRD's"){ 
                        _datarows =  [ //
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            }
                            ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                                ,onRender : function(d){ 
                                    _ctr++;
                                    var _link = "<a href='javascript:void(0)' id='po_no' '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                             ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                                ,onRender : function(d){    
                                    var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "Part Status"                                   ,width : 165                ,style : "text-align:left;padding-left: 2px"        ,sortColNo: 8
                                ,onRender : function(d){  
                                    var _link = "<a href='javascript:void(0)'  '>"+ app.svn (d,"op_status") +"</a>";
                                    return (d !== null ? _link : "");   
                                } 
                            }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                ,onRender: function(d){
                                    return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                }
                            } 
                            ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                ,onRender: function(d){
                                    return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                }
                            } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    }
                    
                    if( _navItem === "MLD Replacements"){ //MLD 
                        _datarows =  [ //
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            }
                            ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                                ,onRender : function(d){ 
                                    _ctr++;
                                    var _link = "<a href='javascript:void(0)' id='po_no'  '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                             ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                                ,onRender : function(d){    
                                    var _link = "<a href='javascript:void(0)'  id='line_no' '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "Part Status"                                   ,width : 165                ,style : "text-align:left;padding-left: 2px"        ,sortColNo: 8
                                ,onRender : function(d){  
                                    var _link = "<a href='javascript:void(0)'  '>"+ app.svn (d,"op_status") +"</a>";
                                    return (d !== null ? _link : "");   
                                } 
                            }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                ,onRender: function(d){
                                    return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                }
                            } 
                            ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                ,onRender: function(d){
                                    return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                }
                            } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    }//tapot 
                    
                    if(_navItem === "Pending Lear Promise Date"){ 
                        _datarows =  [ //
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            }
                            ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                                ,onRender : function(d){ 
                                    _ctr++;
                                    var _link = "<a href='javascript:void(0)' id='po_no'  '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                             ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                                ,onRender : function(d){    
                                    var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                ,onRender: function(d){
                                    return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                }
                            } 
                            ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                ,onRender: function(d){
                                    return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                }
                            } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    }//tapot  
                    
                    if(_navItem==="Proof of Delivery"){ 
                         _datarows =  [ 
                            {text: ''                                               ,width : 25                 ,style : "text-align:left"  
                                ,onRender : function(d){
                                    _ctr++;  
                                    return  app.bs({name:"rb",type:"radio",style:" width: 13px; margin:0 5px;", value: _ctr}); 
                                }
                            }
                            ,{text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            } 
                            ,{text: "Receiving Location"                            ,type:"input"               ,name:"receiving_location"     ,width : 150         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "GPIRS Order No"                                ,type:"input"               ,name:"gpirs_order_no"         ,width : 150         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "GPIRS ORDER Line No"                           ,type:"input"               ,name:"gpirs_order_line_no"    ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Part No"                                       ,type:"input"               ,name:"part_no"                ,width : 150         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"qty"               ,width : 80         ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Pod Attached"                                  ,type:"yesno"               ,name:"pod_attached"           ,width : 150        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Packing Slip Attached"                         ,type:"yesno"               ,name:"packing_slip_attached"  ,width : 150        ,style : "text-align:left"       ,sortColNo: 12}  
                        ];   
                    }  
                    
                    if(_navItem.indexOf("Pending Plant Promise Ship Dates") !== -1){  
                        _datarows =  [ //
                            {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                                 ,onRender : function(d){
                                     count++; 
                                    return app.bs({value: count}); 
                                }
                            }
                            ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                                ,onRender : function(d){ 
                                    _ctr++;
                                    var _link = "<a href='javascript:void(0)' id='po_no'  '>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                }
                            } 
                             ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                                ,onRender : function(d){    
                                    var _link = "<a href='javascript:void(0)'  id='line_no'  '>"+ app.svn (d,"line_no") +"</a>";
                                    return (d !== null ? _link : "");    
                                } 
                            }  
                            ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                                ,onRender: function(d){
                                    return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                                }
                            } 
                            ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"            ,width : 160         ,style : "text-align:left"    ,sortColNo: 4 }
                            ,{text: "Customer"                                      ,type:"input"               ,name:"customer"               ,width : 180         ,style : "text-align:left"    ,sortColNo: 5 }
                            ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"       ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                            ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"             ,width : 100         ,style : "text-align:left"    ,sortColNo: 7 }
                            ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 80       ,style : "text-align:right; padding-right: 2px"} 
                            ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 100        ,style : "text-align:left"       ,sortColNo: 10} 
                            ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 80        ,style : "text-align:center"     ,sortColNo: 11} 
                            ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 100        ,style : "text-align:left"       ,sortColNo: 12}  
                            ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100        ,style : "text-align:left"       ,sortColNo: 13
                                ,onRender: function(d){
                                    return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                                }
                            } 
                            ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 140        ,style : "text-align:left"      ,sortColNo: 14
                                ,onRender: function(d){
                                    return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                                }
                            } 
                            ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 140        ,style : "text-align:left"       ,sortColNo: 15
                                ,onRender: function(d){
                                    return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                                }
                            } 
                            ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 85        ,style : "text-align:left"       ,sortColNo: 16} 
                            ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} 
                        ];   
                    }//tapot
                    
                    
                    $("#" + _navGrid).dataBind({
                         sqlCode            : _sqlCode 
                         ,parameters        : _params  
                         ,width             : $(".zContainer").width() 
                         ,height            : $(window).height() - 400
                         ,dataRows          : _datarows 
                        ,onComplete         : function(o){
                            gOrderListData  = o.data.rows;  
                            var _zRow       = this.find(".zRow");
                            var _$modalUpc  =  $("#modalUpcoming");
                            var _$gridMfg   =  $("#gridMfg");
                            var _$gridWhs   =  $("#gridWhs"); 
                            _zRow.find("input[type='text']").attr('readonly',true); 
                            //this.find(".zPageFooter .pagectrl").css("display","none");
                            if(gOrderListData){
                                if(_navItem.indexOf("Upcoming") !== -1 && _navItem.indexOf("Overdue") !== -1){
                                    $(".btn-mfg").removeClass("hide");
                                }
                            }else{
                                $(".btn-ol, .btn-mfg").addClass("hide");
                            }
                           // exportToExcel(this,_navItem);
                        }
                    });
                }; 
                _setNavByRoleId();
                _displayRecords();
            } 
       
       $(".panel-row").find("#btnTabFilter").click(function(){
           console.log("click");
           displayPendingShipDate();
       });
       
        $("#modalWindowPendingShipmentDate").find('a[data-toggle="tab"], a[data-toggle="pill"]').unbind().on('shown.bs.tab', function (e) { 
             displayPopUpOrderList();
        }); 
        $("#modalWindowPendingShipmentDate").find("#btnFilter").on("click",function(){  
            displayPopUpOrderList();   
        });
       
        
    return _pub;
           
})();                                                                       