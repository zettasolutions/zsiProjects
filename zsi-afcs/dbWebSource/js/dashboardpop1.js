var pop1 = (function(){
    var  bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
        ,bsButton           = zsi.bs.button
        ,_pub               = {}
        ,_db                = db
        ,gg                 = _db.getGlobals()
        ,gProgId            = gg.program_id
        ,gProgCode          = gg.program_code
        ,gOEMId             = gg.oem_id
        ,gOEMName           = gg.oem_name
        ,gOrderId           = ""
        ,gOrderPartId       = ""
        ,gProgName          = ""
        ,gCustId            = ""
        ,gCustName          = ""
        ,gSiteId            = ""
        ,gSiteCode          = ""
        ,gPONo              = ""       
        ,gIsSearch          = gg.is_search
        ,gSearchCol         = gg.search_col
        ,gSearchVal         = gg.search_val
        ,gOrderListData     = []
        ,g$navGrid          = ""
        ,gOrderListIndex    = null
        ,gMdlDetails        = "modalWindowOrderPartDetails"
        ,gOrderPartsData    = []
    ;

    $(document).ready(function(){
        console.log("pop1 "); 
        gtw = new zsi.easyJsTemplateWriter();
        var _$mdl = $("#modalMoreInfo");
        _$mdl.find(".modal-title").html("OEM » "+gOEMName+ " | "+"Program No.» "+gProgCode) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        $(".button-group").hide(); 
        if(app.userInfo.role_id === 5) $(".button-group").show(); 
        _$mdl.find("#model_year").dataBind({
             sqlCode    : "D211" //dd_program_model_year_sel
            ,parameters : {program_id:gProgId}
            ,text       : "model_year_name"
            ,value      : "model_year" 
        }); 
        _$mdl.find("#order_type").dataBind({
             sqlCode    : "D263" //dd_order_order_types_sel
            ,parameters : {program_id:gProgId}
            ,text       : "order_type"
            ,value      : "order_type_id" 
        }); 
         _$mdl.find("#ship_location").dataBind({
             sqlCode    : "D264" //dd_order_sites_sel
            ,parameters : {program_id:gProgId}
            ,text       : "site_code"
            ,value      : "site_id" 
        }); 
        _$mdl.find("#filter_build_phase_id").dataBind({
             sqlCode    : "D210" //dd_program_bp_sel
            ,parameters : {program_id:gProgId}
            ,text       : "build_phase_abbrv"
            ,value      : "build_phase_id" 
        }); 
       _$mdl.find("#filter_order_status_id").dataBind({
             sqlCode    : "S122" //statuses_sel 
            ,text       : "status_desc"
            ,value      : "status_id"
        });
        _$mdl.find("#filter_customer_id").dataBind({
             sqlCode    : "D266" //dd_order_customers_sel
            ,parameters : {program_id:gProgId}
            ,text       : "customer"
            ,value      : "customer_id"
        }); 
        _$mdl.find("#filter_plants").dataBind({
             sqlCode    : "D230" //dd_order_plants_sel 
            ,parameters : {program_id:gProgId}
            ,text       : "plant"
            ,value      : "plant_id"
        }); 
        $("#modalMoreInfo").find("#dd_search_id").fillSelect({
            data: [
                 { text: "PO No.", value: "po_no" }
                ,{ text: "OEM Part No", value: "oem_part_no" }
                 
            ]
            ,onChange : function(){   
                setSearch($(this).val()); 
            }
            ,onComplete : function(){
                $(this).filter(function(){ return $.trim($(this).text()) == "PO No." }).attr('selected', true);
                $("option:nth-child(2)", this).attr("selected", true); 
                if($(this).children("option:selected"). val() == "po_no"){
                    $("#modalMoreInfo").find("#searchPo").attr("placeholder", $(this).val().replace(/_/g," "));
                    $("#modalMoreInfo").find("#searchPo").removeAttr("disabled",true) ;  
                } 
                
            }
        });
        displayOrderList(); 
        setSearch();
        getTemplates();   
        validation1();
        validation2();
        
    }); 
    _pub.getOrderListData = function(){
        return gOrderListData[gOrderListIndex]; 
    };
    _pub.showModalPop2 = function(index,sqlCode) {  
        g$navGrid = getNavgrid();
        console.log("g$navGrid",g$navGrid);
        gOrderListIndex = index;  
        gOrderListData[gOrderListIndex].sql_code = sqlCode; 
        _db.displayModal("dashboardpop2",sqlCode,g$navGrid);
    };  
    _pub.showRedBorder = function(orderPartId){  
        var _$mdl = $("#modalWindowRedBorder");
        var _$frm = $("#frm_modalWindowRedBorder");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
         _$frm.find("#order_part_id").val(orderPartId); 
        _$frm.find("input, textarea").on("keyup change", function(){ 
           _$frm.find("#is_edited").val("Y");
        }); 
        
    }; 

    _pub.showModalPop3 = function(index) {
        gOrderListIndex = index; 
        _db.displayModal("dashboardpop3");
    };
    _pub.searchPO = function() { 
       var _$mdl = $("#modalMoreInfo");
        var _searchVal = $.trim(_$mdl.find("#searchPo").val()); 
        if(_searchVal!==""){  
            displayOrderList();
        }
    
    };
    _pub.isOrderQtyLimitExceed = function(limit,target){
        var _$grid = $("#modalWindowOrderPartDetails").find("#orderPartDetailGrid"); 
        var _getSumTotal = function(){
          var _sum = 0;
          var _target = _$grid.find("input[name="+ target.attr("name") +"]");
          _target.each(function(){
            if($.trim(this.value)!==""){
            	_sum += parseFloat(this.value);
            }
          });
        
          return _sum;
        };
        gSumTotal = _getSumTotal();
        return _getSumTotal() > limit;
    };
    _pub.showDetails = function(index){
        var _o = gOrderPartsData[index]; 
        gOrderQty = _o.order_qty;
        var _$mdl = $("#" + gMdlDetails);
        var _$frm = $("#frm_modalWindowOrderPartDetails");
        _$mdl.find(".modal-title").text("Order Part Details for » " + "PO No. » " + _o.po_no + "." + _o.line_no + " | OEM Part No. » " + _o.oem_part_no + " | Customer MRD » " + _o.customer_mrd.toShortDate() + " | Order Part Qty. » " + _o.order_qty ) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$frm.css('height', '800px');
        displayOrderPartsDetails(_o.order_part_id, _o.customer_mrd, _o.order_qty, _o.rate_flow);
        _$frm.find(".modal-footer").addClass("justify-content-start");

    }; 
    _pub.submitOrderPartDetails = function(){
         if (gSumTotal < gOrderQty){
             alert( "Required/Promise quantiy must be = to "+ gOrderQty + "." );
             return;
         }

        var _$grid = $("#orderPartDetailGrid");
        var _zRow  = _$grid.find(".zRow");
        _zRow.find("input[name='customer_required_date']").removeAttr("disabled", true);

        _$grid.jsonSubmit({
             procedure: "order_part_details_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                displayOrderPartsDetails(_$grid.data("id"), _$grid.data("customerMRD"), _$grid.data("orderQty"), _$grid.data("rateFlow")); 
            }
        });
    };
    _pub.deleteOrderPartDetails = function(){
        var _$grid = $("#orderPartDetailGrid");
        zsi.form.deleteData({
             code       : "ref-00012"
            ,onComplete : function(data){
                if(data.isSuccess===true) zsi.form.showAlert("alert");  

                displayOrderPartsDetails(_$grid.data("id"), _$grid.data("customerMRD"), _$grid.data("orderQty"), _$grid.data("rateFlow")); 
            }
        });    
    };
    
    function getNavgrid(){
        var _$gridMfg   = $("#modalMoreInfo").find("#gridMfg"); 
        var _$gridOrderList   = $("#modalMoreInfo").find("#gridOrderList"); 
        
        return{
            _$gridMfg
            ,_$gridOrderList
        };
        
        
    }
    function displaySummerNote(){
        var _$tbl = $("#tableComment");
        _$tbl.find("#comment").summernote({
            code: ''
            ,toolbar: [
               
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
              ]
        });
        _$tbl.find("#comment").summernote('code','');
    }
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlDetails
            , sizeAttr  : "modal-full"
            , title     : "Order Part Details"
            , body      : gtw.new().modalBodyOrderPartDetails({grid:"orderPartDetailGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="pop1.submitOrderPartDetails();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
                        +'<div class="pull-left"><button type="button" onclick="pop1.deleteOrderPartDetails();" class="btn btn-sm btn-primary"><i class="far fa-trash-alt"></i> Delete</button></div>'
        });
    }
    function getFilters(){ 
        var  _$filter   = $("#frm_modalMoreInfo").find(".modal-body")
            ,_$modelY  = _$filter.find('#model_year').val()
            ,_$orderT  = _$filter.find("#order_type").val()
            ,_shipLoc  = _$filter.find("#ship_location").val() 
            ,_$fbpId   = _$filter.find("#filter_build_phase_id").val()
            ,_$fstId   = _$filter.find("#filter_order_status_id").val()
            ,_$fcId    = _$filter.find("#filter_customer_id").val()
            ,_$fplant  = _$filter.find("#filter_plants").val()
            ,_$searchPO  = _$filter.find("#searchPo").val();
            
        
        return {
            
             model_year     : _$modelY   
            ,order_type_id  : _$orderT
            ,site_id        : _shipLoc
            ,plant_id       : _$fplant
            ,bpId           : _$fbpId
            ,statusId       : _$fstId
            ,customerId     : _$fcId 
            ,po_no          : _$searchPO
        };
    } 
    function displayOrderList(searchCol,searchVal){  
        console.log("agi");
        var _o = getFilters()  
        ,_navItem = ""  
        ,_navGrid = "" 
        ,_params = {
             program_id     : gProgId  
            ,oem_id         : _o.oem_id 
            ,bp_id          : _o.bpId 
            ,status_id      : _o.statusId  
            ,customer_id    : _o.customerId
            ,model_year     : _o.model_year
            ,order_type_id  : _o.order_type_id
            ,site_id        : _o.site_id
            ,plant_id       : _o.plant_id 
            ,search_val     : searchVal      
            ,search_col     : searchCol 
        }
        ,_params1 = {
             program_id     : gProgId  
            ,oem_id         : _o.oem_id 
            ,bp_id          : _o.bpId  
            ,customer_id    : _o.customerId
            ,model_year     : _o.model_year
            ,order_type_id  : _o.order_type_id
            ,site_id        : _o.site_id
            ,plant_id       : _o.plant_id 
            //,op_status_id   : _o.op_status_id 
             
        }
        ,_params2 = {
             program_id : gProgId 
            ,oem_id     : gOEMId
        } 
        ,_params3 = {
             program_id     : gProgId 
            ,oem_id         : _o.oem_id 
            ,bp_id          : _o.bpId 
            ,status_id      : _o.statusId  
            ,customer_id    : _o.customerId
        }
        ,_params4 = {};  
        if(gIsSearch){ 
            _params2 = {};
            _params3 = { 
                 oem_id         : _o.oem_id 
                ,program_id : gProgId 
                ,bp_id          : _o.bpId 
                ,status_id      : _o.statusId  
                ,customer_id    : _o.customerId
            };
        }   
        var _sqlCode = "O181" //DEFAULT SQL CODE 
            ,_setNavByRoleId = function(){ 
                var _$navCoordinator = $("#nav-tab")
                    ,_$navMfg = $("#nav-tab-mfg")
                    ,_$navWhs = $("#nav-tab-whs")
                    ,_$navSubMfg = $(".nav-sub-mfg")
                    ,_$navSubWhs = $(".nav-sub-whs")
                    ,_$navSubPlpd = $("#nav-sub-plpd")
                    ,_$btnOrdList = $(".btn-ol")
                    ,_$btnMfg = $(".btn-mfg");
                     _$btnOrdList.addClass("hide");
                     _$btnMfg.addClass("hide");
                
                $(".nav-tab-main").addClass("hide"); 
                    _$navCoordinator.removeClass("hide");
                    _$navSubMfg.removeClass("hide");
                    _$navSubWhs.removeClass("hide");
                    _$btnOrdList.removeClass("hide");
                    
                    _navItem = _$navCoordinator.find(".nav-item.active").text();
                    if(_navItem === "Manufacturing"){
                        _navGrid = "gridMfg";
                        _navItem = _$navSubMfg.find(".nav-item.active").text();
                    }else if(_navItem === "Warehouse"){
                        _navGrid = "gridWhs";
                        _navItem = _$navSubWhs.find(".nav-item.active").text();
                    }else if(_navItem==="MLD Replacements"){   
                        _navGrid = "gridMLD";
                        _sqlCode = "M274"; //mld_list_sel
                        _params = _params4;
                    }
                    else if(_navItem==="Red Border"){   
                        _navGrid = "gridRedBorder";
                        _sqlCode = "O257"; // order_red_borders_sel
                        _params = _params4;
                    }else if(_navItem === "Pending Lear Promise Date"){ 
                        _navGrid = "gridPlpd";
                        _sqlCode = "O235";  // order_pending_promise_date_sel  
                        _params = _params4;  
                    }  
            
                
             
//**************************************************************************************************************//                   
                 
                if(_navItem==="Order List"){
                    _navGrid = "gridOrderList"; 
                    _sqlCode = "O181"; //order_list_sel
                }
                else if(_navItem.indexOf("MRD's") !== -1){                                 
                    _sqlCode = "O247";  //order_upcoming_customer_mrd_sel        
                    _params = _params1; 
                } 
                else if(_navItem.indexOf("warehouse") !== -1){                                         
                    _sqlCode = "O256";  //order_enroute_to_warehouse_sel   
                    _params = _params4;  
                }
                else if(_navItem.indexOf("Canceled") !== -1){   
                    _sqlCode = "P279"; //Proof Delivery Sel
                    _params = _params4;
                    _navGrid = "gridCanceledOrders";
                }  
                else if(_navItem.indexOf("customer") !== -1){                       
                    _sqlCode = "O255"; //order_enroute_to_customer_sel
                    _params = _params4;  
                }                                                                  
                else if(_navItem.indexOf("Proof") !== -1){   
                    _sqlCode = "P279"; //Proof Delivery Sel
                    _params = _params4;
                }   
                else{
                    if(_navItem.indexOf("Pending Plant Target Ship Dates") !== -1){ 
                        _sqlCode = "O257"; //order_pending_target_ship_date_sel
                        _params = _params1;
                    }
                    else if(_navItem.indexOf("Upcoming") !== -1){ 
                        _sqlCode = "O241"; //order_upcoming_ship_dates_sel
                        _params = _params1;
                        
                        _index = _$navMfg.find(".nav-link.active").index(); 
                        if(app.userInfo.role_id===11 || app.userInfo.role_id===5){
                            _index = _$navSubMfg.find(".nav-link.active").index(); 
                        }
                        _params.level_no = _index -1;  
                    }
                    else if(_navItem.indexOf("Overdue") !== -1){ 
                        _sqlCode = "O254"; //order_overdue_ship_dates_sel 
                        _params = _params2;
                    }  
                }
                console.log("_navItem",_navItem);
                console.log("_navGrid",_navGrid);
                
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
                      ,{text: "PO No"                                         ,width : 70                ,style : "text-align:left"   ,sortColNo: 2 
                            ,onRender : function(d){ 
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                        ,{text: "Line No"                                       ,width : 40                 ,style : "text-align:center"    ,sortColNo: 3
                            ,onRender : function(d){  
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
                                return (d !== null ? _link : "");    
                            } 
                        }  
                        ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                            ,onRender: function(d){
                                return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                            }
                        } 
                        ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"             ,width : 130       ,style : "text-align:left"    ,sortColNo: 4 }
                        ,{text: "Customer"                                      ,type:"input"               ,name:"customer"                ,width : 130       ,style : "text-align:left"    ,sortColNo: 5 }
                        ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"        ,width : 100       ,style : "text-align:left"    ,sortColNo: 6 }
                        ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"              ,width : 100       ,style : "text-align:left"    ,sortColNo: 7 } 
                        ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 70       ,style : "text-align:left; padding-right: 2px"} 
                        ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 80       ,style : "text-align:left"      } 
                        ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 70       ,style : "text-align:center"     ,sortColNo: 11} 
                        ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 80        ,style : "text-align:left"       ,sortColNo: 12}  
                        ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100       ,style : "text-align:left"       ,sortColNo: 13
                            ,onRender: function(d){ 
                                return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                            }
                        } 
                        ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 100        ,style : "text-align:left"      ,sortColNo: 14
                              ,onRender: function(d){
                                  return bs({name:"mfg_target_ship_date"                  ,value : app.svn(d,"mfg_target_ship_date").toShortDate()});
                              }
                          } 
                          ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 100        ,style : "text-align:left"       ,sortColNo: 15
                              ,onRender: function(d){
                                  return bs({name:"lear_promise_date"                  ,value : app.svn(d,"lear_promise_date").toShortDate()});
                              }
                          } 
                        ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 100        ,style : "text-align:left"       ,sortColNo: 16} 
                        ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 100        ,style : "text-align:left"       ,sortColNo: 17} 
                        
                        
                      /*
                      
                      
                      ,{text: "PO No"                                          ,width : 120                ,style : "text-align:left"   ,sortColNo: 1 
                          ,onRender : function(d){ 
                              _ctr++;
                              var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                              return (d !== null ? _link : "");    
                          }
                      } 
                       ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                          ,onRender : function(d){    
                              var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                      ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 150        ,style : "text-align:left"       ,sortColNo: 17} */
                  ]; 
                if(_navItem === "Order List"){ 
                    _datarows =  [ //Pending Lear promise Date Table 
                        {text: ''                                               ,width : 25                 ,style : "text-align:left"  
                            ,onRender : function(d){
                                _ctr++;  
                                return  (d !==null ? (app.userInfo.role_id===5 && _navItem==="Order List" ? app.bs({name:"rb",type:"radio",style:" width: 13px; margin:0 5px;", value: _ctr}) : "") : ""); 
                            }
                        }
                        ,{text: "Item No"                                   ,width : 30        ,style : "text-align:left"   
                             ,onRender : function(d){
                                 count++; 
                                return app.bs({value: count}); 
                            }
                        } 
                        ,{text: "Order Status"                                  ,type:"input"               ,name:"status_desc"            ,width : 70         ,style : "text-align:left"    ,sortColNo: 1 } 
                        ,{text: "PO No"                                         ,width : 70                ,style : "text-align:left"   ,sortColNo: 2 
                            ,onRender : function(d){ 
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                        ,{text: "Line No"                                       ,width : 30                 ,style : "text-align:center"    ,sortColNo: 3
                            ,onRender : function(d){  
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
                                return (d !== null ? _link : "");    
                            } 
                        }  
                        ,{text: "PO Date"                                       ,width : 100                ,style : "text-align:left"            ,sortColNo: 3
                            ,onRender: function(d){
                                return bs({name:"po_issue_date"                 ,value : app.svn(d,"po_issue_date").toShortDate()});
                            }
                        } 
                        ,{text: "OEM Part No."                                  ,type:"input"               ,name:"oem_part_no"             ,width : 130       ,style : "text-align:left"    ,sortColNo: 4 }
                        ,{text: "Customer"                                      ,type:"input"               ,name:"customer"                ,width : 130       ,style : "text-align:left"    ,sortColNo: 5 }
                        ,{text: "Customer Part No."                             ,type:"input"               ,name:"customer_part_no"        ,width : 100       ,style : "text-align:left"    ,sortColNo: 6 }
                        ,{text: "Order Type"                                    ,type:"input"               ,name:"order_type"              ,width : 100       ,style : "text-align:left"    ,sortColNo: 7 } 
                        ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"order_qty"               ,width : 70       ,style : "text-align:left; padding-right: 2px"} 
                        ,{text: "Ship To Location"                              ,type:"input"               ,name:"site_code"               ,width : 80       ,style : "text-align:left"      } 
                        ,{text: "<div id='modelYear'>Model Year</div>"          ,type:"input"               ,name:"model_year"              ,width : 70       ,style : "text-align:center"     ,sortColNo: 11} 
                        ,{text: "Build Phase"                                   ,type:"input"               ,name:"build_phase_abbrv"       ,width : 80        ,style : "text-align:left"       ,sortColNo: 12}  
                        ,{text: "Customer MRD"                                  ,type:"input"                                               ,width : 100       ,style : "text-align:left"       ,sortColNo: 13
                            ,onRender: function(d){ 
                                return bs({name:"customer_mrd"                  ,value : app.svn(d,"customer_mrd").toShortDate()});
                            }
                        } 
                        ,{text: "Plant Target Ship Date"                        ,type:"input"              ,width : 100        ,style : "text-align:left"      ,sortColNo: 14
                              ,onRender: function(d){
                                  return bs({name:"PlantTargetShipDate"                  ,value : app.svn(d,"PlantTargetShipDate").toShortDate()});
                              }
                          } 
                          ,{text: "Promise Delivery Date"                         ,type:"input"                                              ,width : 100        ,style : "text-align:left"       ,sortColNo: 15
                              ,onRender: function(d){
                                  return bs({name:"PromiseDate"                  ,value : app.svn(d,"PromiseDate").toShortDate()});
                              }
                          } 
                        ,{text: "Plant"                                         ,type:"input"               ,name:"plant_code"              ,width : 100        ,style : "text-align:left"       ,sortColNo: 16} 
                        ,{text: "Comments"                                      ,type:"input"               ,name:"comments"                ,width : 100        ,style : "text-align:left"       ,sortColNo: 17} 
                    ];   
                }  
                
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
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                         ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                            ,onRender : function(d){    
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                                var _link = "<a href='javascript:void(0)'  onclick='pop1.showModalPop3(\""+  _ctr +"\")'>"+ app.svn (d,"op_status") +"</a>";
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
                        ,{text: "Red Border"                                    ,width : 70                 ,style : "text-align:center"  
                            ,onRender : function(d){
                                var _link =  "<i class='fas fa-plus'  aria-hidden='true' onclick='pop1.showRedBorder(\"" + app.svn(d,"order_part_id") + "\")'></i>";
                                return (d !== null ? _link : ""); 
                            }
                        } 
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
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                         ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                            ,onRender : function(d){    
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                                var _link = "<a href='javascript:void(0)'  onclick='pop1.showModalPop3(\""+  _ctr +"\")'>"+ app.svn (d,"op_status") +"</a>";
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
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                         ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                            ,onRender : function(d){    
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                                var _link = "<a href='javascript:void(0)'  onclick='pop1.showModalPop3(\""+  _ctr +"\")'>"+ app.svn (d,"op_status") +"</a>";
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
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                         ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                            ,onRender : function(d){    
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                         {text: "Item No"                                   ,width : 50         ,style : "text-align:left"   
                             ,onRender : function(d){
                                 count++; 
                                return app.bs({value: count}); 
                            }
                        } 
                        ,{text: "Receiving Location"                            ,type:"input"               ,name:"receiving_location"     ,width : 150         ,style : "text-align:left"    ,sortColNo: 4 }
                        ,{text: "GPIRS Order No"                                ,type:"input"               ,name:"gpirs_order_no"         ,width : 150         ,style : "text-align:left"    ,sortColNo: 5 }
                        ,{text: "GPIRS ORDER Line No"                           ,type:"input"               ,name:"gpirs_order_line_no"    ,width : 150         ,style : "text-align:left"    ,sortColNo: 6 }
                        ,{text: "Part No"                                       ,type:"input"               ,name:"part_no"                ,width : 150         ,style : "text-align:left"    ,sortColNo: 7 }
                        ,{text: "<div id='orderedqty'>Ordered Qty</div>"        ,type:"input"               ,name:"qty"                     ,width : 80         ,style : "text-align:right; padding-right: 2px"} 
                        ,{text: "Pod Attached"                                  ,type:"yesno"               ,name:"pod_attached"           ,width : 150        ,style : "text-align:left"       ,sortColNo: 12}  
                        ,{text: "Packing Slip Attached"                         ,type:"yesno"               ,name:"packing_slip_attached"  ,width : 150        ,style : "text-align:left"       ,sortColNo: 12}  
                    ];   
                }  
                
                if(_navItem.indexOf("Pending Plant Target Ship Dates") !== -1){  
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
                                var _link = "<a href='javascript:void(0)' id='po_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>&nbsp;"+ app.svn (d,"po_no") +"</a>";
                                return (d !== null ? _link : "");    
                            }
                        } 
                         ,{text: "Line No"                                      ,width : 70                 ,style : "text-align:center"  ,sortColNo: 2
                            ,onRender : function(d){    
                                var _link = "<a href='javascript:void(0)'  id='line_no'  onclick='pop1.showModalPop2(\""+ _ctr +"\",\""+ _sqlCode  +"\")'>"+ app.svn (d,"line_no") +"</a>";
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
                     ,rowsPerPage       : 1000
                     ,isPaging          : true
                     ,width             : $(".zContainer").width() 
                     ,height            : $(window).height() - 400
                     ,dataRows          : _datarows 
                    ,onComplete         : function(o){
                        gOrderListData  = o.data.rows; 
                        var _zRow       = this.find(".zRow");
                        var _$modalUpc  =  $("#modalUpcoming");
                        var _$gridMfg   =  $("#gridMfg");
                        var _$gridWhs   =  $("#gridWhs");
                        $("#frm_modalWindowRedBorder").find("#red_border_date").datepicker({ 
                              pickTime  : false
                            , autoclose : true
                            , todayHighlight: true
                        })
                        //_zRow.find("input[type='text'] ,select").attr('readonly',true); 
                        if(gOrderListData){
                            if(_navItem.indexOf("Upcoming") !== -1 && _navItem.indexOf("Overdue") !== -1){
                                $(".btn-mfg").removeClass("hide");
                            }
                        }else{
                            $(".btn-ol, .btn-mfg").addClass("hide");
                        }
                         
                        exportToExcel(this,_navItem);
                    }
                });
            };  
            _setNavByRoleId();
            _displayRecords();
        } 
    function displayCopyPO(o){   
        var _dataRows  = [
                {text: "Build Phase"                            ,width: 100      ,style: "text-align:left"
                    ,onRender  :  function(d){  
                        return app.bs({name:"order_part_id"     ,type:"hidden" }) 
                            +  app.bs({name:"order_id"          ,type:"hidden"  ,value: o.order_id }) 
                            +  app.bs({name:"ref_order_part_id" ,type:"hidden"  ,value: o.order_part_id }) 
                            +  app.bs({name:"is_edited"         ,type:"hidden" })
                            +  app.bs({name:"build_phase"       ,type:"input"   ,value: o.build_phase_abbrv })
                            +  app.bs({name:"status_id"         ,type:"hidden"  ,value: o.status_id }) 
                            +  app.bs({name:"site_id"         ,type:"hidden"  ,value: o.site_id }) 
                            +  app.bs({name:"line_no"           ,type:"hidden"  ,value: o.line_no }); 
                    }
                } 
                //,{text:"Model Year"          ,name:"model_year"                 ,type:"input"   ,width:100      ,value: o.model_year   ,style:"text-align:left"}
                ,{text:"Harness Family"    ,width:150       ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"harness_family"    ,type:"input"       ,value: o.harness_family });
                    }
                }
                ,{text:"OEM Part No."     ,width:200        ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"oem_program_part_id"   ,type:"hidden"      ,value: o.oem_program_part_id })
                            + bs({name:"oem_part_no"       ,type:"input"      ,value: o.oem_part_no });
                    }
                } 
                ,{text:"Plants"             ,width:200      ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"plant_id"   ,type:"hidden"      ,value: o.plant_id })
                            + bs({name:"plant_code"   ,type:"input"      ,value: o.plant_code });
                    }
                }
                ,{text:"Warehouses"          ,name:"warehouse"                  ,type:"input"   ,width:200      ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"warehouse_id"   ,type:"hidden"         ,value: o.warehouse_id })
                            + bs({name:"warehouse_contacts"      ,type:"input"          ,value: o.warehouse_contacts });
                    }
                } 
                ,{text:"Customer Part No."                                                      ,width:200      ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"customer_program_id"   ,type:"hidden"  ,value: o.customer_program_id })
                            +  bs({name:"customer_part_no"      ,type:"input"   ,value: o.customer_part_no });
                    }
                }
                ,{text:"Customer MRD"            ,width:120        
                    ,onRender: function(d){ 
                        return bs({type:"input"  ,name:"customer_mrd" ,value:"" ,style:"text-align:center"});
                    }
                }
                ,{text:"MLD Replacement Qty"      ,width:120       
                    ,onRender: function(d){
                        return bs({name:"order_qty"   ,style:"text-align:right" ,type:"input"  ,value:""});
                    }
                }   
                ,{text:"Rate and Flow"              ,width:150        ,style:"text-align:left"   
                    ,onRender: function(d){
                        return bs({name:"rate_flow_name"    ,type:"input"       ,value: (o.rate_flow==="N"? "No" : "Yes") ,style:"text-align:left"})
                            + bs({name:"rate_flow"          ,type:"hidden"      ,value: o.rate_flow })
                            +  bs({name:"comment"           ,type:"hidden"      ,value: o.comment });
                    }
                }
            ];
        
        $("#gridCopyPO").dataBind({
            //width             : 
             height             : $(window).height() - 300
            ,blankRowsLimit     : 1
            ,dataRows           : _dataRows
            ,onComplete: function(o){
                var _zRow = this.find(".zRow");
                _zRow.find("input[type='text']").not("[name='customer_mrd'],[name='order_qty']").attr('disabled',true);  
                _zRow.find("[name='customer_mrd']").datepicker({ 
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                }).on("hide", function(e) {
                    $(this).closest(".zRow").find("[name='order_qty']").focus();
                });
            }
        });
    }        
    function displayMLDOrderParts(o,retVal){
        console.log("retVal",retVal);
        var  cb         = app.bs({name:"cbFilter1",type:"checkbox"})
            ,_ctr       = -1
            ,_$grid     = $("#gridMLDOrderParts")
            ,_dataRows  = [];
            
        gOrderId    = o.orderId;
        gOEMId      = o.oemId;
        gOEMName    = o.oemName;
        gProgId     = o.progId;
        gProgName   = o.progName;
        gCustId     = o.custId; 
        gCustName   = o.custName; 
        gSiteId     = o.siteId;
        gSiteCode   = o.siteCode;
        gPONo       = o.poNo;
        if(gOEMId == 5){
            _dataRows.push(
                 {text: cb                       ,width : 25   ,style : "text-align:left"
                    ,onRender  :  function(d){ 
                        _ctr++;
                        return app.bs({name:"order_part_id"         ,type:"hidden"      ,value: (isUD(retVal) ? "" : app.svn(d,"order_part_id"))})
                            +  app.bs({name:"order_id"              ,type:"hidden"      ,value: gOrderId })
                            +  app.bs({name:"ref_order_part_id"     ,type:"hidden"      ,value: app.svn(d,"order_part_id")}) 
                            +  app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"status_id"             ,type:"hidden"      ,value: app.svn(d,"op_status_id")})
                            +  (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                    }
                }
                ,{text:"Site Code"              ,width:70        ,style:"text-align:left"  
                     ,onRender : function(d){
                        return app.svn(d,"site_code")
                             + app.bs({name:"site_id"   ,type:"hidden"  ,value:app.svn(d,"site_id")});
                     }
                 }
                ,{text:"Line No."                                                                       ,width:55        ,style:"text-align:center"
                     ,onRender : function(d){
                        return app.svn(d,"line_no")
                             + app.bs({name:"line_no"  ,type:"hidden"      ,value: app.svn(d,"line_no")}); 
                     }
                 }
                ,{text:"Harness Family"         ,type:"select"          ,name:"harness_family_id"       ,width:200       ,style:"text-align:left"  
                     ,onRender : function(d){
                        return app.svn(d,"harness_family")
                             + app.bs({name:"harness_family_id" ,type:"hidden"  ,value:app.svn(d,"harness_family_id")});
                     }
                 }
                ,{text:"Prefix"                 ,width:80        ,style:"text-align:left"
                     ,onRender : function(d){
                        return app.svn(d,"prefix")
                             + app.bs({name:"prefix"    ,type:"hidden"  ,value:app.svn(d,"prefix")});
                     }
                 } 
                ,{text:"Base"                   ,width:80        ,style:"text-align:left"
                     ,onRender : function(d){
                        return app.svn(d,"base")
                             + app.bs({name:"base"    ,type:"hidden"  ,value:app.svn(d,"base")});
                     }
                     
                 } 
                ,{text:"Suffix"                 ,width:80        ,style:"text-align:left"
                     ,onRender : function(d){
                        return app.svn(d,"suffix")
                             + app.bs({name:"suffix"    ,type:"hidden"  ,value:app.svn(d,"suffix")});
                     }
                 } 
                ,{text:"OEM Part No."           ,width:120       ,style:"text-align:left"  
                     ,onRender : function(d){
                        return app.svn(d,"oem_part_no")
                             + app.bs({name:"oem_program_part_id"    ,type:"hidden"  ,value:app.svn(d,"oem_program_part_id")});
                     }
                 } 
                ,{text:"Plants"                 ,width:100       ,style:"text-align:left"  
                     ,onRender : function(d){
                        return app.svn(d,"plant_name")
                             + app.bs({name:"plant_id"    ,type:"hidden"  ,value:app.svn(d,"plant_id")});
                     }
                 } 
                ,{text:"Warehouses"                                                                     ,width:100       ,style:"text-align:left" 
                     ,onRender: function(d){
                         return app.svn(d,"warehouse_name")
                             +  app.bs({name:"warehouse_id"          ,type:"hidden"  ,value:app.svn(d,"warehouse_id")})
                             +  app.bs({name:"customer_program_id"   ,type:"hidden"  ,value:app.svn(d,"customer_program_id")})
                             +  app.bs({name:"customer_part_no"      ,type:"hidden"  ,value:app.svn(d,"customer_part_no")});
                     }
                 } 
            );
        }else{
            _dataRows.push(
                 {text: cb                       ,width : 25   ,style : "text-align:left"
                    ,onRender  :  function(d){ 
                        _ctr++;
                        return app.bs({name:"order_part_id"         ,type:"hidden"      ,value: (isUD(retVal) ? "" : app.svn(d,"order_part_id")) }) 
                             + app.bs({name:"order_id"              ,type:"hidden"      ,value: gOrderId}) 
                             + app.bs({name:"ref_order_part_id"     ,type:"hidden"      ,value: app.svn(d,"order_part_id")}) 
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                             + app.bs({name:"status_id"             ,type:"hidden"      ,value: app.svn(d,"status_id")})
                             + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                    }
                }
                ,{text:"Site Code"                 ,width:70       ,style:"text-align:center"
                    ,onRender: function(d){
                        return app.svn(d,"site_code") 
                             + app.bs({name:"site_id"    ,type:"hidden"      ,value: svn(d,"site_id")}) 
                             + app.bs({name:"line_no"    ,type:"hidden"      ,value: svn(d,"line_no")});
                    }
                }
                ,{text:"Build Phase"            ,width:100       ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"build_phase_abbrv")
                            + app.bs({name:"build_phase_id"    ,type:"hidden"  ,value:app.svn(d,"build_phase_id")});
                    }
                } 
                ,{text:"Model Year"             ,width:70        ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"model_year")
                            + app.bs({name:"model_year"    ,type:"hidden"  ,value:app.svn(d,"model_year")});
                    }
                } 
                ,{text:"Harness Family"         ,width:200       ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"harness_family")
                            + app.bs({name:"harness_family_id"    ,type:"hidden"  ,value:app.svn(d,"harness_family_id")});
                    }
                } 
                ,{text:"OEM Part No."           ,width:120       ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"oem_part_no")
                            + app.bs({name:"oem_program_part_id"    ,type:"hidden"  ,value:app.svn(d,"oem_program_part_id")});
                    }
                } 
                ,{text:"Plants"                 ,width:100       ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"plant_name")
                            + app.bs({name:"plant_id"    ,type:"hidden"  ,value:app.svn(d,"plant_id")});
                    }
                }
                ,{text:"Warehouses"             ,width:100       ,style:"text-align:left"
                    ,onRender : function(d){
                       return app.svn(d,"warehouse_name")
                            + app.bs({name:"warehouse_id"    ,type:"hidden"  ,value:app.svn(d,"warehouse_id")});
                    }
                }
                ,{text:"Customer Part No."      ,width:100       ,style:"text-align:left"
                    ,onRender: function(d){
                        return app.bs({name:"customer_program_id"   ,type:"hidden"  ,value:app.svn(d,"customer_program_id")})
                            +  app.bs({name:"customer_part_no"      ,type:"hidden"  ,value:app.svn(d,"customer_part_no")})
                            +  app.svn(d,"customer_part_no");
                    }
                } 
            );
        }
        
        _dataRows.push(        
            {text:"Customer MRD"            ,width:90       ,style:"text-align:left" 
                ,onRender: function(d){
                    if(isUD(retVal))
                        return app.bs({type:"hidden"   ,name:"customer_mrd"    ,value: app.svn(d,"customer_mrd").toShortDate()})
                             + app.bs({type:"input"    ,name:"customer_mrd"    ,value: ""})
                    else
                        return app.bs({type:"input"   ,name:"customer_mrd"    ,value: app.svn(d,"customer_mrd").toShortDate()})
                }
            }
            ,{text:"Order Part Qty"         ,width:85       ,style:"text-align:center"
                ,onRender: function(d){ 
                    if(isUD(retVal))
                        return app.bs({type:"hidden"   ,name:"order_qty"    ,value: app.svn(d,"order_qty")})
                             + app.bs({type:"input"    ,name:"order_qty"    ,value: ""})
                    else
                        return app.bs({type:"input"   ,name:"order_qty"    ,value: app.svn(d,"order_qty")})
                }
            }  
            ,{text:"Rate and Flow"          ,width:80               ,style:"text-align:center"  
                    ,onRender: function(d){
                            return app.bs({name:"rate_flow"   ,type:"yesno"    ,value:app.svn(d,"rate_flow")    ,defaultValue:"N"})
                                 + app.bs({name:"comment"     ,type:"hidden"   ,value:app.svn(d,"comment")});
                    }
                }
            ,{text:"Details"                ,width:50              ,style:"text-align:center; cursor:pointer;"
                ,onRender: function(d){  
                    var _link =  '<i class="fas fa-plus" aria-hidden="true" onclick="pop1.showDetails('+ _ctr +')"></i>';
                    return (! isUD(retVal) ? _link : "");
                } 
            }  
        );
    
        _$grid.dataBind({
             url        : app.procURL + "order_parts_sel @order_id=" + gOrderId + ",@order_part_id=" + (isUD(retVal) ? "" : retVal) + ",@customer_id= " + gCustId 
            ,height     : $(window).height() - 400
            ,dataRows   : _dataRows
            ,onComplete : function(o){ 
                var  _this          = this
                    ,_zRow          = _this.find(".zRow")
                    ,_bpId          = ""
                    ,_my            = ""
                    ,_hfId          = ""
                    ,_info          = o.data.rows[0]
                    ,_prefix    = ""
                    ,_suffix    = ""
                   
                ;
                gOrderPartsData = o.data.rows;
                //markOrderPartsMandatory(this); 
                _this.find("select ,input ").css("text-transform","uppercase");
                _this.find("input[name='cbFilter1']").setCheckEvent("#orderPartsGrid input[name='cb']"); 
                _this.data("_orderId",gOrderId);
                _this.data("_orderPartId",gOrderPartId);
                _this.data("_oemId",gOEMId);
                _this.data("_oemName",gOEMName);
                _this.data("_progId",gProgId);
                _this.data("_progName",gProgName);
                _this.data("_custId",gCustId);
                _this.data("_custName",gCustName);
                _this.data("_siteId",gSiteId);
                _this.data("_siteCode",gSiteCode);
                _this.data("_poNo",gPONo);
                _zRow.find("[name='customer_mrd']").datepicker({ pickTime  : false, autoClose : true});
                
            }
        });
    }    
    function displayOrderPartsDetails(order_part_id, customer_mrd, order_qty, rate_flow){  
        var cb = app.bs({name:"cbFilter2",type:"checkbox"})
            ,_$tbl =  $("#tableOrder")
            ,_data = []
            ,_dataRows = []
            ,_getDataRows = function(callback){
                $.get(app.procURL + "order_part_details_sel @order_part_id=" + order_part_id,function(data){
                    callback(data.rows);
                });
            };
            
        $(window).resize(function() {
            var width = $(window).width();
            if (width < 800){ 
              $("#grid").css("style","width: 100% !impotant"); 
              _$tbl.find(".input-group").css("style","width: 100% !impotant"); 
            }
        });
        
        _getDataRows(function(data){
            _data = data;
            _dataRows = [
                 {text:cb        ,width:25              ,style : "text-align:left"
                    ,onRender  :  function(d){ return app.bs({name:"order_part_dtl_id"   ,type:"hidden"      ,value: app.svn (d,"order_part_dtl_id")}) 
                                    + app.bs({name:"is_edited"                           ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                    + app.bs({name:"order_part_id"                       ,type:"hidden"      ,value: order_part_id})
                                    + app.bs({name:"status_id"                           ,type:"hidden"      ,value: app.svn(d,"status_id")})
                                    +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                ,{text:"Customer Required Date"                                  ,width:200     ,style:"text-align:left"
                   ,onRender: function(d){ return bs({type:"input" ,name:"customer_required_date"  ,value: svn(d,"customer_required_date").toShortDate()}); }
                }
                ,{text:"Customer Required Qty"                                  ,width:160     ,style:"text-align:left"
                   ,onRender: function(d) {
                    //   if(_data.length > 0){
                    //         return bs({type:"input"    ,name:"required_qty"            ,value: app.svn(d,"required_qty")});
                    //   }else{
                       return bs({name: "required_qty"          ,type: "input"   ,value: app.svn(d,"required_qty") })
                            + bs({name: "lear_promise_date"     ,type: "hidden"  ,value: app.svn(d,"lear_promise_date") })
                            + bs({name: "promised_qty"          ,type: "hidden"  ,value: app.svn(d,"promised_qty") })
                            + bs({name: "mfg_target_ship_date"  ,type: "hidden"  ,value: app.svn(d,"mfg_target_ship_date") })
                            + bs({name: "mfg_actual_ship_date"  ,type: "hidden"  ,value: app.svn(d,"mfg_actual_ship_date") })
                            + bs({name: "shipment_qty"          ,type: "hidden"  ,value: app.svn(d,"shipment_qty") })                
                            + bs({name: "no_cartons"            ,type: "hidden"  ,value: app.svn(d,"no_cartons") })
                            + bs({name: "box_dimension"         ,type: "hidden"  ,value: app.svn(d,"box_dimension") })
                            + bs({name: "weigth_lb"             ,type: "hidden"  ,value: app.svn(d,"weigth_lb") })
                            + bs({name: "serial_no"             ,type: "hidden"  ,value: app.svn(d,"serial_no") })
                            + bs({name: "delivery_carrier"      ,type: "hidden"  ,value: app.svn(d,"delivery_carrier") })
                            + bs({name: "shipper_number"        ,type: "hidden"  ,value: app.svn(d,"shipper_number") })
                            + bs({name: "shipment_date"         ,type: "hidden"  ,value: app.svn(d,"shipment_date") })
                            + bs({name: "shipment_by"           ,type: "hidden"  ,value: app.svn(d,"shipment_by") })
                            + bs({name: "special_instruction"   ,type: "hidden"  ,value: app.svn(d,"special_instruction") });
                       //}
                   }
               }
            ]; 

            $("#orderPartDetailGrid").dataBind({
                 rows               : _data
                ,width              : $("#frm_modalWindowOrderPartDetails").width() - 20 
                ,blankRowsLimit     : 10
                ,dataRows           : _dataRows
                ,onComplete: function(o){ 
                    var  _this          = this
                        ,_zRow          = _this.find(".zRow")
                        ,_checkQuantity = function(){
                            var _$grid = $("#orderPartDetailGrid");
                            var _tmr = null;
                            
                            _$grid.find("[name='required_qty'], [name='promised_qty']").keyup(function(){
                                var _$this = $(this);
                                clearTimeout(_tmr);
                                _tmr = setTimeout(function(){
                                    if (  pop1.isOrderQtyLimitExceed(gOrderQty,_$this) ){ 
                                        if(_$this[0].name === "required_qty") {
                                            alert( "Required quantity must be = to "+ gOrderQty + "." );
                                            _$this.closest(".zRow").find("[name='required_qty']").val("");
                                        } else{
                                            alert( "Promised quantity must be = to "+ gOrderQty + "." );
                                            _$this.closest(".zRow").find("[name='promised_qty']").val("");
                                        }
                                    }
                                }, 10);
                            });
                        }
                    ;
                    _this.data("id", order_part_id);
                    _this.data("customerMRD", customer_mrd);
                    _this.data("orderQty", order_qty);
                    _this.data("rateFlow", rate_flow);
             
                    if(rate_flow==="Y" && o.data.length===0){
                        gSumTotal = order_qty;
                        var _$firstRow = _this.find(".zRow:first-child");
                        _$firstRow.find("[name='customer_required_date']").val(customer_mrd.toShortDate());
                        _$firstRow.find("[name='required_qty']").val(order_qty);
                    }
                    
                    if(app.userInfo.gRoleId == 6) {
                        var _requiredDate = _zRow.find("[name='customer_required_date']");
                        _requiredDate.each(function(){ 
                    	    if($(this).val() === "") $(this).removeAttr("disabled",true);
                            else $(this).attr("disabled", true);
                        });
                    }
                    
                    _this.find("input[name='cbFilter2']").setCheckEvent("#orderPartDetailGrid input[name='cb']");

                    _zRow.find("[name='customer_required_date']").datepicker({ 
                          pickTime  : false
                        , autoclose : true
                        , todayHighlight: true
                    }).on("hide", function(e) {
                        $(this).closest(".zRow").find("[name='required_qty']").focus();
                    });
                    
                    _checkQuantity();   
                }
            });
        });
    }  
    function displayGeneratePSN(o){
        resetGenPSN();
        var _$mdl = $("#modalGeneratePSN");
        _$mdl.find("#program_id").val();
        _$mdl.find("#program_code").attr("disabled", true).val();
    }
    function resetGenPSN(){
        var _$mdl = $("#modalGeneratePSN");
        _$mdl.find("input,select").not("#program_code").val("");
        _$mdl.find("input[name*='date']").not("input[name*='update']").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
        });
        _$mdl.find("#psn_comment").summernote({
            code: ''
            ,toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
              ]
        });
        _$mdl.find("#psn_comment").summernote('code','');
    }
    function exportToExcel(grid,name){
        $(".btnExport").unbind().click(function(){
            $("#" + grid[0].id).convertToTable(
                function($table){
                    $table.htmlToExcel({
                       fileName: name
                   });
                }
            );
        });
    }
    function markOrderPartsMandatory(grid){
        grid.markMandatory({       
            "groupNames":[
                  {
                       "names" : ["harness_family_id","oem_program_part_id","plant_id","warehouse_id","customer_mrd","order_qty"]
                      ,"type":"M"
                  } 
            ]      
            ,"groupTitles":[ 
                   {"titles" : ["Harness Family","OEM Part No.","Plants","Warehouses","Customer MRD","Order Part Qty"]}
            ]
        })   
    }
    function delay(callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
              callback.apply(context, args);
            }, ms || 0);
        };
    } 
    function setSearch(searchCol){  
        var _$modalInfo =  $("#modalMoreInfo");
       if(isUD(searchCol)) searchCol = "po_no"; 
            _$modalInfo.find("#btnSearchPO").click(function(){ 
            var _searchVal = $.trim(_$modalInfo.find("#searchPo").val());  
            if(_searchVal!==""){
                zsi.getData({
                     sqlCode : "O181" //order_list_sel
                    ,parameters: {search_col: searchCol,search_val:_searchVal} 
                    ,onComplete : function(d) {
                        if(d.rows.length > 0){
                            showOrdersLists(searchCol,_searchVal);
                        }
                    }
                });
            }
        }); 
     } 
    function showOrdersLists(searchCol,searchVal){   
        //gSearchCol = searchCol;
        //gSearchVal = searchVal; 
        displayOrderList(searchCol,searchVal);
    }
    function validation1(){
        var _$modalInfo =  $("#modalMoreInfo");
        _$modalInfo.find("#dd_search_id").change(function(){  
            if($(this).val() !==""){  
                 _$modalInfo.find("#searchPo").attr("placeholder", ($(this).val() ==="oem_part_no" ? "OEM Part No" : $(this).val().replace(/_/g," ") ));
                 _$modalInfo.find("#searchPo").removeAttr("disabled"); 
                 _$modalInfo.find("#btnSearchPO").removeAttr("disabled",true) ;
            }else{  
                _$modalInfo.find("#searchPo").attr("disabled",true) ; 
                _$modalInfo.find("#searchPo").val("").attr("placeholder", "Enter Keyword");  
                _$modalInfo.find("#btnSearchPO").attr("disabled",true) ; 
            } 
        });  
    } 
    function validation2(){
        
        var _$modalInfo =  $("#modalMoreInfo");
        _$modalInfo.find("#btnSearchPO").attr("disabled",true) ; 
            _$modalInfo.find("#searchPo").keyup(function(){
            console.log("search po");
            if($(this).val() !==""){
               _$modalInfo.find("#btnSearchPO").removeAttr("disabled"); 
            }else{
                _$modalInfo.find("#btnSearchPO").attr("disabled",true) ; 
            }
        });
    }   
    
    
    
    $("#btnFilter").on("click",function(){  
        displayOrderList();   
    });
    $("#frm_modalMoreInfo").find('a[data-toggle="tab"], a[data-toggle="pill"]').unbind().on('shown.bs.tab', function (e) { 
        displayOrderList(); 
    }); 
    $("#btnAddAttachement").unbind().click(function(){
        var _indx = $("#gridOrderList").find("input[type='radio']:checked").val();

        if(!isUD(_indx)){
            gOrderListIndex = _indx;
            var _data = pop1.getOrderListData();
            var _$mdl = $("#modalPOCopy");
            _$mdl.find(".modal-title").html("P.O. Copy") ;
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
            _$mdl.find("form").attr("enctype","multipart/form-data");
            _$mdl.find("#order_id").val(_data.order_id);
            _$mdl.find("#order_part_id").val(_data.order_part_id);  
            $.get(base_url + 'page/name/tmplImageUpload'
                ,function(data){
                    _$mdl.find('#divPOCopy').html(data);
                    //$mdl.find("#order_id").val(orderId);
                    //$mdl.find("#prefixKey").val("orders.-" + orderId +   ".");
                    _$mdl.find(".input-group").removeClass("input-group");
                    //initChangeEvent();
                }
            );   
        }else{
            
        }
    });
    $("#btnRevise").unbind().click(function(){
        var _indx = $("#gridOrderList").find("input[type='radio']:checked").val();
        if(!isUD(_indx)){ 
            gOrderListIndex = _indx; 
            var _data = pop1.getOrderListData();
            var _isRev = "Y"
            var _params = ['#p','orders', _data.order_id,is_rev='Y'].join("/");
            window.open(_params,"_self");
        }

    });
    $("#btnPOCopy").unbind().click(function(){
        var _indx = $("#gridOrderList").find("input[type='radio']:checked").val();
        if(!isUD(_indx)){ 
            gOrderListIndex = _indx; 
            var _data = pop1.getOrderListData();
            var _params = ['#p','orders', _data.order_id].join("/");
            
            window.open(_params,"_self");
        }
    });
    $("#btnMLDRep").unbind().click(function(){
        var _indx = $("#gridOrderList").find("input[type='radio']:checked").val();

        if(!isUD(_indx)){ 
            gOrderListIndex = _indx; 
            var _o = gOrderListData[gOrderListIndex];
            var _$mdl = $("#modalMLDReplacement");
            var _data = pop1.getOrderListData()
            var _orderId = _data.order_id;
            var _orderPartId = _data.order_part_id 
            _$mdl.find(".modal-title").html("PO No »" +_o.po_no +" | Line No » "+_o.line_no +" | Customer » "+_o.customer)
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            zsi.getData({
                 sqlCode : "O174" //orders_parts_sel
                ,parameters: {order_id: _orderId, order_part_id: _orderPartId} 
                ,onComplete : function(d) {
                    var _info = d.rows[0]; 
                    var _tbl = _$mdl.find("#tableOrder");
                    if(isUD(_info)) return;
                    
                    _tbl.find("[name='order_id']").text(_orderId);
                    _tbl.find("#oem_id").text(_info.customer);
                    _tbl.find("#customer_id").text(_info.customer);
                    _tbl.find("#contact_id").text(_info.contact_name);
                    _tbl.find("#site_id").text(_info.site_code);
                    _tbl.find("#program_id").text(_info.program_code);
                    _tbl.find("#build_phase_id").text(_info.build_phase_abbrv);
                    _tbl.find("#model_year").text(_info.model_year);
                    _tbl.find("#order_type_id").text(_info.order_type);
                    _tbl.find("#engr_manager_id").text(_info.engr_manager_id); 
                    _tbl.find("#engr_manager").text(_info.engr_manager); 
                    _tbl.find("#program_managers").text(_info.program_managers); 
                    _tbl.find("#car_leaders").text(_info.car_leaders);  
                    _tbl.find("#launch_managers").text(_info.launch_managers); 
                    _tbl.find("#warehouse_contacts").text(_info.warehouse_contacts);  
                    _tbl.find("#po_no").text(_info.po_no); 
                    _tbl.find("#po_issue_date").text(_info.po_issue_date.toShortDate()); 
                    
                    displayMLDOrderParts({
                         orderId        : _tbl.find("#order_id").text()
                        ,oemId          : _data.oem_id
                        ,oemName        : _tbl.find("#oem_id").text() 
                        ,progId         : _data.program_id
                        ,progName       : _tbl.find("#program_id").text()
                        ,custId         : _data.customer_id
                        ,custName       : _tbl.find("#customer_id").text()
                        ,siteId         : _data.site_id
                        ,siteCode       : _tbl.find("#site_id").text()
                        ,bpId           : _data.build_phase_id
                        ,bpName         : _tbl.find("#build_phase_id").text()
                        ,modelYear      : _tbl.find("#model_year").text()
                        ,poNo           : $.trim(_tbl.find("#po_no").text())
                    });
                }
            });

        }
    });
    $("#btnSubmitPOCopy").unbind().click(function(){	
        var _$frm = $("#frm_modalPOCopy")	
            ,_$file = _$frm.find("#file")	
            ,_orderId = _$frm.find("#order_id").val()	
            ,_orderPartId = _$frm.find("#order_part_id").val()	
            ,_id = _$frm.find("#attachment_id").val()	
            ,_title = _$frm.find("#attachment_title").val();	

            if(_title!=="" && _$file.val()!==""){	
                var _fileOrg = _$file.get(0);	
                var formData = new FormData( _$frm.get(0));	
                var _fileName = _fileOrg.files[0].name;	

                $.ajax({	
                    url: base_url + 'file/UploadImage',  //server script to process data	
                    type: 'POST',	
                    //Ajax events	
                    success: completeHandler = function(data) {	
                        if(data.isSuccess){	
                            $.post(app.procURL + "order_attachment_upd "	
                               + "@order_id=" + _orderId	
                               + ",@order_part_id=" + _orderPartId	
                               + ",@attachment_id=" + _id	
                               + ",@filename='dashboard." + _fileName + "'" 	
                               + ",@attachment_title='" + _title + "'" 	
                               ,function(data){	
                                    if(data.isSuccess){ 	
                                        zsi.form.showAlert("alert");  	
                                    }	
                            }); 	
                        }else	
                            alert(data.errMsg);	
                    },	
                    error: errorHandler = function() {	
                        console.log("error");	
                    },	
                    // Form data	
                    data: formData,	
                    //Options to tell JQuery not to process data or worry about content-type	
                    cache: false,	
                    contentType: false,	
                    processData: false	
                }, 'json');   	
            }	
    });
    $(".btnCancel").unbind().click(function(){
        var _indx = $("#gridOrderList").find("input[type='radio']:checked").val(); 
        if(!isUD(_indx)){ 
            gOrderListIndex = _indx;
            var _data = pop1.getOrderListData();
            var _$mdl = $("#modalCancelOrderPart");
            _$mdl.find(".modal-title").html("P.O. Copy") ;
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            displaySummerNote();   
        }else{
            
        }
        $("#btnSaveCancel").unbind().click(function(){ 
            $("#frm_modalCancelOrderPart").jsonSubmit({
                 procedure  : "cancel_order_parts_upd" 
                ,isSingleEntry : true
                ,onComplete : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");  
                    $("#btnCancel").trigger("click");
                }
            });
        });
    });
    $("#btnSaveRedBorder").unbind().click(function(){ 
        var _$grid  = $("#frm_modalWindowRedBorder"); 
        var _rBO    = _$grid.find("#red_border_no").val();
        var _rBD    = _$grid.find("#red_border_date").val();
        var _rBC    = _$grid.find("#comment").val();  
        _$grid.jsonSubmit({
             procedure: "red_border_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                $("#modalBodyRedBorder").trigger("refresh");
                $("#gridOrderList").trigger("refresh") ;
            }
        });
    }); 
    $("#btnSaveMLDOrderParts").unbind().click(function(){
        var _$grid = $("#gridMLDOrderParts");
       // if( _$grid.checkMandatory()!==true) return false;
        _$grid.find('input[type=text],select').prop("disabled",false); 
        _$grid.jsonSubmit({
             procedure  : "order_parts_mld_upd" 
            ,notIncludes : ["harness_family_id","prefix","base","suffix","oem_part_no","customer_part_no","order_part_qty","red_border_no","red_border_date"]
            ,onComplete : function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                var _obj = {
                     orderId    : _$grid.data("_orderId") 
                    ,oemId      : _$grid.data("_oemId")
                    ,oemName    : _$grid.data("_oemName")
                    ,progId     : _$grid.data("_progId")
                    ,progName   : _$grid.data("_progName")
                    ,custId     : _$grid.data("_custId")
                    ,custName   : _$grid.data("_custName")
                    ,siteId     : _$grid.data("_siteId")
                    ,siteCode   : _$grid.data("_siteCode")
                    ,poNo       : _$grid.data("_poNo")
                    
                }
                displayMLDOrderParts(_obj,data.returnValue);
            }
        });
    });
    $("#btnDeleteLDOrderParts").unbind().click(function(){
        var _$grid = $("#gridMLDOrderParts");
        zsi.form.deleteData({
             code       : "ref-00010"
            ,onComplete : function(data){
                displayMLDOrderParts({
                     orderId    : _$grid.data("_orderId") 
                    ,oemId      : _$grid.data("_oemId")
                    ,oemName    : _$grid.data("_oemName")
                    ,progId     : _$grid.data("_progId")
                    ,progName   : _$grid.data("_progName")
                    ,custId     : _$grid.data("_custId")
                    ,custName   : _$grid.data("_custName")
                    ,siteId     : _$grid.data("_siteId")
                    ,siteCode   : _$grid.data("_siteCode")
                    ,poNo       : _$grid.data("_poNo")
                });
            }
        });                  
        
    });
    $("#btnGeneratePSN").unbind().click(function(){
        var _indx = $("#gridMfg").find("input[type='radio']:checked").val();

        if(!isUD(_indx)){
            var _$mdl = $("#modalGeneratePSN");
            _$mdl.find(".modal-title").html("Generate PSN");
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
            
            gOrderListIndex = _indx;
            displayGeneratePSN(pop1.getOrderListData());
        }
    });
    $("#btnPopClear").on("click",function(){  
        var _$filterCulomns = $("#modalMoreInfo");    
        _$filterCulomns.find('#model_year').val(" ");  
        _$filterCulomns.find("#order_type").val(' ');  
        _$filterCulomns.find("#ship_location").val(' ');
        _$filterCulomns.find("#filter_build_phase_id").val(' ');
        _$filterCulomns.find("#filter_order_status_id").val(' ');
        _$filterCulomns.find("#filter_customer_id").val(' ');
        _$filterCulomns.find("#filter_plants").val(' ');
        
        displayOrderList();
    }); 
    $("#btnResetGenPSN").unbind().click(resetGenPSN); 
    $("#btnOrderlistClear").on("click",function(){  
        var _$modalInfo =  $("#modalMoreInfo");    
        _$modalInfo.find('#dd_search_id').val(" ");  
        _$modalInfo.find("#searchPo").val(' ').attr("disabled",true);  
        //gSearchVal = "";
        //gSearchCol = "";
        displayOrderList();
       
    }); 
    return _pub;
})();                                                                                 