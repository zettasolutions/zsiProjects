var orders =  (function(){
    var _public = {};
    var  bs                     = zsi.bs.ctrl
        ,svn                    = zsi.setValIfNull 
        ,hashParams             = app.hash.getPageParams(["order_id"])
        ,gOrderPartId           = null
        ,g_today_date           = new Date() + ""
        ,gData                  = ""
        ,gOrder_id              = null
        ,gOrderPartsData        = ""
        ,gtw                    = null
        ,gMdlEngrMngr           = "modalWindowEngineeringManager"
        ,gMdlPlants             = "modalWindowPlants"
        ,gMdlWarehouses         = "modalWindowWarehouses"
        ,gMdlDetails            = "modalWindowOrderPartDetails"
        ,gMdlRedBorder          = "modalWindowRedBorder"
        ,gMdlOrderParts         = "modalWindowOrderParts"
        ,gMdlAddOrderParts      = "modalWindowAddOrderParts"
        ,gMdlOrderUsers         = "modalWindowOrderUsers"
        ,gMdlOrderPlants        = "modalWindowOrderPlants"
        ,gMdlOrderWarehouses    = "modalWindowOrderWarehouses"
        ,gTeams                 = []
        ,gCommentId             = []
        ,gOrderPartBRows        = ""
        ,gOEMId                 = "" 
        ,gOEMName               = ""
        ,gCustName              = ""
        ,gPONo                  = ""
        ,gRoleId                = null
        ,gProgId                = ""
        ,gProgName              = ""
        ,gCustId                = ""
        ,gOrderId               = ""
        ,gOrderQty              = 0
        ,gSumTotal              = 0
    ;
    
    $.fn.setValueIfChecked = function(){
        var _click_change= function(){
            var _$zRow = $(this).closest(".zRow");
            var _userId = _$zRow.find("#user_id");
            var _tempId = _$zRow.find("#tempUser_id").val();
            
            if( $(this).prop("checked") === true){
                _userId.val(_tempId);
            }else{
                _userId.val("");
                
            }
        };    
            
        this.click(_click_change);
        this.change(_click_change);
        
    }
    $.fn.setPlantValueIfChecked = function(){
        var _click_change= function(){
            var _$zRow = $(this).closest(".zRow");
            var _plantId = _$zRow.find("#plant_id");
            var _tempId = _$zRow.find("#tempPlant_id").val();
            
            if( $(this).prop("checked") === true){
                _plantId.val(_tempId);
            }else{
                _plantId.val("");
                
            }
        };    
            
        this.click(_click_change);
        this.change(_click_change);
    }
    $.fn.setWarehouseValueIfChecked = function(){
        var _click_change= function(){
            var _$zRow = $(this).closest(".zRow");
            var _warehouseId = _$zRow.find("#warehouse_id");
            var _tempId = _$zRow.find("#tempWarehouse_id").val();
            
            if( $(this).prop("checked") === true){
                _warehouseId.val(_tempId);
            }else{
                _warehouseId.val("");
                
            }
        };    
            
        this.click(_click_change);
        this.change(_click_change);

    }

    zsi.ready = function(){  
        $(".page-title").html("Orders");
        $(".panel-container").height($(window).height() - 150);
        gtw = new zsi.easyJsTemplateWriter();
        displayOrders(); 
        setInputs();      
        runDatePicker();
        getTemplates(); 
        markOrderParts(); 
        $(".hides").hide();
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    //Private Functions
    function displayOrderPartsDetails(bRows,siteCode,id,roleId){  
        var cb = app.bs({name:"cbFilter2",type:"checkbox"})
            ,_$tbl =  $("#tableOrder")
            ,_data = []
            ,_dataRows = []
            ,_getDataRows = function(callback){
                $.get(app.procURL + "order_part_details_sel @order_part_id=" + id,function(data){
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
                                    + app.bs({name:"order_part_id"                       ,type:"hidden"      ,value: id})
                                    + app.bs({name:"status_id"                           ,type:"hidden"      ,value: app.svn(d,"status_id")})
                                    +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                    }
                } 
                ,{text:"Customer Site Code"             ,width:300      ,style:"text-align:left"
                    ,onRender : function(d){

                        if(_data.length > 0){
                            return bs({type:"select"    ,name:"site_id"            ,value: (siteCode ? siteCode : app.svn(d,"site_id") ) });
                        }else{
                            return bs({type:"select"    ,name:"site_id"            ,value: (siteCode ? siteCode : app.svn(d,"site_id") ) })
                                 + bs({type:"hidden"    ,name:"lear_promise_date"  ,value: app.svn(d,"lear_promise_date")})
                                 + bs({type:"hidden"    ,name:"promised_qty"       ,value: app.svn(d,"promised_qty") });
                        }
                    }


                }
            ]; 
            
            if(_data.length > 0){
                _dataRows.push(
                     {text:"Lear Promise Date "                                                                         ,width:200     ,style:"text-align:left"
                        ,onRender: function(d){
                            if(app.userInfo.gRoleId == 4) return svn(d,"lear_promise_date").toShortDate();
                            else return bs({type:"input" ,name:"lear_promise_date"   ,value: svn(d,"lear_promise_date").toShortDate()});
                        }
                    }
                    ,{text:"Lear Promised Qty"                                                                          ,width:160     ,style:"text-align:left"
                        ,onRender: function(d) {
                            return bs({name: "promised_qty"  ,type: "input"   ,value: app.svn(d,"promised_qty") });
                        }
                    }
                ); 
            }

            _dataRows.push(
                 {text:"Customer Required Date"                                  ,width:200     ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({type:"input" ,name:"customer_required_date"  ,value: svn(d,"customer_required_date").toShortDate()});
                    }
                }
                ,{text:"Customer Required Qty"                                  ,width:160     ,style:"text-align:left"
                    ,onRender: function(d) {
                        return bs({name: "required_qty"         ,type: "input"   ,value: app.svn(d,"required_qty") })
                             + bs({name: "mfg_target_ship_date" ,type: "hidden"  ,value: app.svn(d,"mfg_target_ship_date") })
                             + bs({name: "mfg_actual_ship_date" ,type: "hidden"  ,value: app.svn(d,"mfg_actual_ship_date") })
                             + bs({name: "shipment_qty"         ,type: "hidden"  ,value: app.svn(d,"shipment_qty") })
                             + bs({name: "box_size"             ,type: "hidden"  ,value: app.svn(d,"box_size") })                            
                             + bs({name: "no_cartons"           ,type: "hidden"  ,value: app.svn(d,"no_cartons") })
                             + bs({name: "box_dimension"        ,type: "hidden"  ,value: app.svn(d,"box_dimension") })
                             + bs({name: "weigth_lb"            ,type: "hidden"  ,value: app.svn(d,"weigth_lb") })
                             + bs({name: "serial_no"            ,type: "hidden"  ,value: app.svn(d,"serial_no") })
                             + bs({name: "delivery_carrier"     ,type: "hidden"  ,value: app.svn(d,"delivery_carrier") })
                             + bs({name: "shipper_number"       ,type: "hidden"  ,value: app.svn(d,"shipper_number") })
                             + bs({name: "shipment_date"        ,type: "hidden"  ,value: app.svn(d,"shipment_date") })
                             + bs({name: "shipment_by"          ,type: "hidden"  ,value: app.svn(d,"shipment_by") });
                    }
                }
            ); 
            
            $("#orderPartDetailGrid").dataBind({
                 //url                : app.procURL + "order_part_details_sel @order_part_id=" + id
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
                                    if (  orders.isOrderQtyLimitExceed(gOrderQty,_$this) ){ 
                                        if(_$this[0].id === "required_qty") {
                                            alert( "Required quantity must be = to "+ gOrderQty + "." );
                                            _$this.closest(".zRow").find("#required_qty").val("");
                                        } else{
                                            alert( "Promised quantity must be = to "+ gOrderQty + "." );
                                            _$this.closest(".zRow").find("#promised_qty").val("");
                                        }
                                    }
                                }, 10);
                            });
                        }
                    ;
                    
                    if(app.userInfo.gRoleId == 6) {
                        var _requiredDate = _zRow.find("#customer_required_date");
                        _requiredDate.each(function(){ 
                    	    if($(this).val() == "") $(this).removeAttr("disabled",true)
                            else $(this).attr("disabled", true);
                        })
                    }
                    
                    _this.find("#cbFilter2").setCheckEvent("#orderPartDetailGrid input[name='cb']");
                    _this.find("#site_id").attr("selectedvalue",siteCode);
                    _this.find("[name='site_id']").dataBind({
                         sqlCode    : "C146"
                        ,text       : "site_code"
                        ,value      : "site_id"
                    }); 

                    _zRow.find("select[name='status_id']").dataBind({
                         url        : app.procURL + "statuses_sel @level_no=3"
                        ,text       : "status_desc"
                        ,value      : "status_id"
                    });

                    _zRow.find("[name='customer_required_date']").datepicker({ 
                          pickTime  : false
                        , autoclose : true
                        , todayHighlight: true
                    }).on("hide", function(e) {
                        $(this).closest(".zRow").find("#required_qty").focus();
                    });
                    _this.find("[name='lear_promise_date']").datepicker({ 
                          pickTime  : false
                        , autoclose : true
                        , todayHighlight: true
                    }).on("hide", function(e) {
                        $(this).closest(".zRow").find("#promised_qty").focus();
                    });
                    
                    //_this.find('.zRows').css('cssText', 'height : 600px !important');
                    _this.data("siteCode",siteCode);
                    _this.data("id",id);
                    _checkQuantity();   
                }
            });
        });
    }  
    function displayOrderUsersList(oemId,progId,roleId,orderId,target){ 
        var  cb          = app.bs({name:"cbFilterOrder",type:"checkbox"})
            ,_cbChecked  = true
            ,_dataRows   = [];

        _dataRows.push(
            {text: cb  ,width : 25   ,style : "text-align:left"
                ,onRender  :  function(d){ 
                    if(!app.svn(d,"order_user_id")) _cbChecked = false;
                    
                    var _r="";
                    _r  += app.bs({name:"order_user_id"  ,type:"hidden"      ,value: svn(d,"order_user_id")}); 
                    _r  += app.bs({name:"order_id"       ,type:"hidden"      ,value: orderId}); 
                    _r  += app.bs({name:"program_id"     ,type:"hidden"      ,value: progId});
                    _r  += app.bs({name:"tempUser_id"    ,type:"hidden"       ,value: app.svn(d,"user_id")});
                    
                    if( app.svn(d,"order_user_id") ){
                        _r  +=app.bs({name:"cb"          ,type:"checkbox"    ,checked: true });
                        _r  += app.bs({name:"user_id"    ,type:"hidden"      ,value: app.svn(d,"user_id")});

                    }else{
                       _r +=app.bs({name:"cb"            ,type:"checkbox"    ,checked: false });
                       _r  += app.bs({name:"user_id"     ,type:"hidden"      ,value: ""});
                    }
                    return _r;     
                }
            }
        );
            
        if(app.userInfo.roleId == 2){
            _dataRows.push(
                    {text: "Program Managers"                       ,name : "program_user"              ,type : "input"     ,width : 300  ,style : "text-align:left"}
                
            );
        }else if(app.userInfo.roleId == 6){
            _dataRows.push(
                    {text: "Car Leaders"                            ,name : "program_user"              ,type : "input"     ,width : 300  ,style : "text-align:left"}
                
            );
        }else if(app.userInfo.roleId == 4){
            _dataRows.push(
                    {text: "Launch Managers"                        ,name : "program_user"              ,type : "input"     ,width : 300  ,style : "text-align:left"}
                
            );
        }else{
            _dataRows.push(
                    {text: "Warehouse Contacts"                     ,name : "program_user"              ,type : "input"     ,width : 300  ,style : "text-align:left"}
                
            );
        }
        
        $("#orderUsersGrid").dataBind({
                 sqlCode     : "D217" //dd_order_users_sel
                ,parameters  : {oem_id: oemId, order_id: (orderId ? orderId : ""), program_id: progId, role_id: roleId}
                ,width       : $(".modal-body").width("")
                ,height      : 360
                ,dataRows    : _dataRows
                ,onComplete: function(o){ 
                    var progUser = [];
                    var _this = this;
                    var _zRow = _this.find(".zRow");
                    var _$tbl = $("#tableOrder");
                    _zRow.find('input[name="cb"]:checked').each(function() {
                    	progUser.push($(this).closest(".zRow").find("#program_user").val());
                    });
                        
                    var _html = '<span>'+'<i class="fas fa-plus"></i>'+'</span>'; 
                    if(progUser.length === 0){
                      target.html(_html);
                    } 
                    else{
                      target.text(progUser);
     
                    } 
                    
                    _this.data("oemId",oemId);
                    _this.data("progId",progId);
                    _this.data("roleId",roleId);
                    _this.data("orderId",orderId);
                    _this.data("target",target);                    
                    var _cbFilter = this.find("#cbFilterOrder");
                    _cbFilter.setCheckEvent("#orderUsersGrid input[name='cb']");
                    
                    if(_cbChecked){
                        _cbFilter.attr("checked", true);
                    }
                    this.find('input[type="checkbox"]').setValueIfChecked();

                }
        });

    } 
    function displayPlantsList(progId,orderId,target){ 
        var  cb          = app.bs({name:"cbFilterOrderPlants",type:"checkbox"})
            ,_cbChecked  = true
            ,_dataRows   = [];

        $("#orderPlantsGrid").dataBind({
                 sqlCode     : "D230" //dd_order_plants_sel
                ,parameters  : {order_id: (orderId ? orderId : "")}
                ,width       : $(".modal-body").width("")
                ,height      : 360
                ,dataRows    : [
                    {text: cb  ,width : 25   ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                            if(!app.svn(d,"order_plant_id")) _cbChecked = false;
                            
                            var _r="";
                            _r  += app.bs({name:"order_plant_id"  ,type:"hidden"      ,value: app.svn (d,"order_plant_id")}); 
                            _r  += app.bs({name:"order_id"        ,type:"hidden"      ,value: orderId});
                            _r  += app.bs({name:"program_id"      ,type:"hidden"      ,value: progId});
                            _r  += app.bs({name:"tempPlant_id"    ,type:"hidden"      ,value: app.svn(d,"plant_id")});
                            
                            if( app.svn(d,"order_plant_id") ){
                                _r  +=app.bs({name:"cb"                 ,type:"checkbox"    ,checked: true });
                                _r  += app.bs({name:"plant_id"          ,type:"hidden"      ,value: app.svn(d,"plant_id")});
    
                            }else{
                                _r  +=app.bs({name:"cb"                 ,type:"checkbox"    ,checked: false });
                                _r  += app.bs({name:"plant_id"          ,type:"hidden"      ,value: ""});
                            }
                            return _r;     
                        }
                    }
                    ,{text: "Plants"     ,name : "plant"           ,type : "input"     ,width : 300  ,style : "text-align:left"}
                ]
                ,onComplete: function(o){ 
                    var plants = [];
                    var _this = this;
                    var _zRow = _this.find(".zRow");
                    var _$tbl = $("#tableOrder");
                    _zRow.find('input[name="cb"]:checked').each(function() {
                    	plants.push($(this).closest(".zRow").find("#plant").val());
                    });
                        
                    var _html = '<span>'+'<i class="fas fa-plus"></i>'+'</span>'; 
                    if(plants.length === 0){
                      target.html(_html);
                    } 
                    else{
                      target.text(plants);
     
                    } 
                    _this.data("progId",progId);
                    _this.data("orderId",orderId);
                    _this.data("target",target);                    
                    var _cbFilter = this.find("#cbFilterOrderPlants");
                    _cbFilter.setCheckEvent("#orderPlantsGrid input[name='cb']");
                    
                    if(_cbChecked){
                        _cbFilter.attr("checked", true);
                    }
                    this.find('input[type="checkbox"]').setPlantValueIfChecked();

                }
        });

    }  
    function displayWarehousesList(progId,orderId,target){ 
        var  cb          = app.bs({name:"cbFilterOrderWrehouses",type:"checkbox"})
            ,_cbChecked  = true
            ,_dataRows   = [];

        $("#orderWarehousesGrid").dataBind({
                 sqlCode     : "D231" //dd_order_warehouses_sel
                ,parameters  : {order_id: (orderId ? orderId : "")}
                ,width       : $(".modal-body").width("")
                ,height      : 360
                ,dataRows    : [
                    {text: cb  ,width : 25   ,style : "text-align:left"
                        ,onRender  :  function(d){ 
                            if(!app.svn(d,"order_warehouse_id")) _cbChecked = false;
                            
                            var _r="";
                            _r  += app.bs({name:"order_warehouse_id"      ,type:"hidden"      ,value: app.svn (d,"order_warehouse_id")}); 
                            _r  += app.bs({name:"order_id"                ,type:"hidden"      ,value: orderId});
                            _r  += app.bs({name:"program_id"              ,type:"hidden"      ,value: progId});
                            _r  += app.bs({name:"tempWarehouse_id"        ,type:"hidden"      ,value: app.svn(d,"warehouse_id")});
                            
                            if( app.svn(d,"order_warehouse_id") ){
                                _r  +=app.bs({name:"cb"                         ,type:"checkbox"    ,checked: true });
                                _r  += app.bs({name:"warehouse_id"              ,type:"hidden"      ,value: app.svn(d,"warehouse_id")});

                            }else{
                                _r  +=app.bs({name:"cb"                         ,type:"checkbox"    ,checked: false });
                                _r  += app.bs({name:"warehouse_id"              ,type:"hidden"      ,value: ""});
                            }
                            return _r;     
                        }
                    }
                    ,{text: "Warehouses"        ,name : "warehouse"        ,type : "input"     ,width : 200  ,style : "text-align:left"}
                ]
                ,onComplete: function(o){ 
                    var warehouses = [];
                    var _this = this;
                    var _zRow = _this.find(".zRow");
                    var _$tbl = $("#tableOrder");
                    _zRow.find('input[name="cb"]:checked').each(function() {
                    	warehouses.push($(this).closest(".zRow").find("#warehouse").val());
                    });
                        
                    var _html = '<span>'+'<i class="fas fa-plus"></i>'+'</span>'; 
                    if(warehouses.length === 0){
                      target.html(_html);
                    } 
                    else{
                      target.text(warehouses);
     
                    } 
                    _this.data("progId",progId);
                    _this.data("orderId",orderId);
                    _this.data("target",target);                    
                    var _cbFilter = this.find("#cbFilterOrderWrehouses");
                    _cbFilter.setCheckEvent("#orderWarehousesGrid input[name='cb']");
                    
                    if(_cbChecked){
                        _cbFilter.attr("checked", true);
                    }
                    this.find('input[type="checkbox"]').setWarehouseValueIfChecked();

                }
        });

    }
    function displayOrders(id,commentId){
        var _$tbl = $("#tableOrder").find("#panel-1");
        _$tbl.find(".rev_no").hide();
        _$tbl.find("#showOrderedParts").hide();
        if(id){ 
            gOrder_id = id;
            
            _$tbl.find(".rev_no").show();
            _$tbl.find("#showOrderedParts").show();
            var _html = '<span>'+'<i class="fas fa-plus"></i>'+'</span>';
            if(_$tbl.find("#program_managers").text() === ""){
                _$tbl.find("#program_managers").html(_html);
            }
            if(_$tbl.find("#car_leaders").text() === ""){
                _$tbl.find("#car_leaders").html(_html);
            }
            if(_$tbl.find("#launch_managers").text() === ""){
                _$tbl.find("#launch_managers").html(_html);
            }
            if($("#warehouse_contacts").text() === ""){
                _$tbl.find("#warehouse_contacts").html(_html);
            }
            if($("#plants").text() === ""){
                _$tbl.find("#plants").html(_html);
            }
            if($("#warehouses").text() === ""){
                _$tbl.find("#warehouses").html(_html);
            }

        }else if(hashParams.order_id){ 
            gOrder_id = hashParams.order_id;
            _$tbl.find("#showOrderedParts").show();
             $.get(app.procURL + "orders_sel @order_id=" + gOrder_id 
                , function(d){ 
                    var _info = d.rows[0]; 
                    if(isUD(_info)) return;
                    _$tbl.find("#order_id").val(gOrder_id);
                    _$tbl.find("#oem_id").attr("selectedvalue",_info.oem_id);
                    _$tbl.find("#customer_id").attr("selectedvalue",_info.customer_id);
                    _$tbl.find("#contact_id").attr("selectedvalue",_info.contact_id);
                    _$tbl.find("#site_id").attr("selectedvalue",_info.site_id);
                    _$tbl.find("#program_id").attr("selectedvalue",_info.program_id);
                    _$tbl.find("#engr_manager_id").attr("selectedvalue",_info.engr_manager_id); 
                    _$tbl.find("#order_type_id").attr("selectedvalue",_info.order_type_id);
                    _$tbl.find("#program_managers").text(_info.program_managers); 
                    _$tbl.find("#car_leaders").text(_info.car_leaders);  
                    _$tbl.find("#launch_managers").text(_info.launch_managers); 
                    _$tbl.find("#warehouse_contacts").text(_info.warehouse_contacts);  
                    _$tbl.find("#plants").text(_info.plants);  
                    _$tbl.find("#warehouses").text(_info.warehouses); 
                    _$tbl.find("#po_no").val(_info.po_no); 
                    _$tbl.find("#po_issue_date").val(_info.po_issue_date.toShortDate()); 
            });
        }
   
        var _$tblOrder = $("#tableOrder"); 
        var _oemEvents = function(d){
                gOEMId = this.val();
                if(this.val() == 5) {
                        $('.hides').show();
                } else {
                        $('.hides').hide();
                }  
                
                if(this.val()){
                    _$tblOrder.find("#customer_id").dataBind({
                         sqlCode    :"D212"   //dd_oem_customers_sel
                        ,parameters : {oem_id : this.val()} 
                        ,text       :"customer_code"
                        ,value      :"customer_id"
                        ,onChange: function(){
                            _$tblOrder.find("#contact_id").dataBind({
                                 sqlCode    : "C154" //customer_contacts_sel
                                ,parameters : {customer_id : this.val()}
                                ,text       : "contact_name"
                                ,value      : "customer_contact_sp_id"
                            });  
                            _$tblOrder.find("#site_id").dataBind({
                                 sqlCode    : "D246" //dd_customer_sites_sel
                                ,parameters : {customer_id : this.val()}
                                ,text       : "site_code"
                                ,value      : "site_id"
                            }); 
                        }
                        ,onComplete: function(){
                            _$tblOrder.find("#site_id").dataBind({
                                 sqlCode    : "D246" //dd_customer_sites_sel
                                ,parameters : {customer_id : this.val()}
                                ,text       : "site_code"
                                ,value      : "site_id"
                            });  
                            _$tblOrder.find("#contact_id").dataBind({
                                 sqlCode    : "C154"
                                ,parameters : {customer_id : this.val()}
                                ,text       : "contact_name"
                                ,value      : "customer_contact_sp_id"
                            });  
                        }
                    }); 
           
                    //_$tblOrder.find("#contact_id").attr("selectedvalue", d.contact_id);
                    // _$tblOrder.find("#contact_id").dataBind({
                    //      sqlCode    : "C154"
                    //     ,parameters : {customer_id : this.val()}
                    //     ,text       : "contact_name"
                    //     ,value      : "customer_contact_sp_id"
                    // });  

                    _$tblOrder.find("#program_id").dataBind({
                         sqlCode    : "D213" //dd_program_by_coordinator_sel
                        ,parameters : {oem_id : isNaN([d.index - 1].oem_id) ? this.val() : d.data[d.index - 1].oem_id } //added
                        ,text       : "program_code"
                        ,value      : "program_id" 
                        ,onChange   : function(d){
                            var _$engrMngrId = _$tblOrder.find("#engr_manager_id");
                            var _managerId   = d.data[d.index - 1].engr_manager_id;
                            gProgId = this.val();
                            _$engrMngrId.attr("selectedvalue", _managerId );
                            
                            _$engrMngrId.dataBind({
                                 sqlCode    : "D179"
                                ,parameters : {oem_id : d.data[d.index - 1].oem_id}
                                ,text       : "engr_manager"
                                ,value      : "engr_manager_id"
                            });
                        
                            var  _info                = d.data[d.index - 1]
                                ,_carleaders          = _info.car_leaders
                                ,_progMngrs           = _info.program_managers
                                ,_launchMngrs         = _info.launch_managers
                                ,_warehouseContacts   = _info.warehouse_contacts
                                ,_plants              = _info.plants 
                                ,_warehouses          = _info.warehouses 
                            ;
                            $("#program_managers").text(_progMngrs);
                            $("#car_leaders").text(_carleaders);
                            $("#launch_managers").text(_launchMngrs);
                            $("#warehouse_contacts").text(_warehouseContacts);
                            $("#plants").text(_plants);
                            $("#warehouses").text(_warehouses);
                        }
                        ,onComplete : function(d){
                            console.log()
                            var  _info  = isNaN([d.index - 1].oem_id) ? "" : d.data[d.index - 1];
                            if(!isUD(_info)){ //added
                                var _carleaders             = _info.car_leaders
                                    ,_progMngrs             = _info.program_managers
                                    ,_launchMngrs           = _info.launch_managers
                                    ,_warehouseContacts     = _info.warehouse_contacts 
                                    ,_plants                = _info.plants 
                                    ,_warehouses            = _info.warehouses 
                                    ,_$engrMngrId           = _$tblOrder.find("#engr_manager_id")
                                    ,_managerId             = _info.engr_manager_id;
                                    
                                _$engrMngrId.attr("selectedvalue", _managerId );
                                
                                _$engrMngrId.dataBind({
                                     sqlCode    : "D179"
                                    ,parameters : {oem_id : (_info.oem_id) ? _info.oem_id : gOEMId}
                                    ,text       : "engr_manager"
                                    ,value      : "engr_manager_id"
                                });
            
                                $("#program_managers").text(_progMngrs);
                                $("#car_leaders").text(_carleaders);
                                $("#launch_managers").text(_launchMngrs);
                                $("#warehouse_contacts").text(_warehouseContacts);   
                                $("#plants").text(_plants);
                                $("#warehouses").text(_warehouses);
                            }                        
                        }
                    });
                }
        };
        
        _$tblOrder.find("#oem_id").dataBind({
             sqlCode    : "D194"
            ,text       : "oem_name"
            ,value      : "oem_id"
            ,onChange   : _oemEvents
            ,onComplete : _oemEvents
        });
        
        _$tblOrder.find("#order_type_id").dataBind({
             sqlCode    : "O204"
            ,text       : "order_type"
            ,value      : "order_type_id"
        });

        gOrderId = (gOrder_id !== null ? gOrder_id : _$tbl.find("#order_id").val());
        
        _$tbl.find("select, input").on("keyup change", function(){ 
            _$tbl.find("#is_edited").val("Y");
        });   

    }
    function displayNewOrderParts(o){
        var  _OEMId      = o.oemId    
            ,_ProgId     = o.progId  
            ,_CustId     = o.custId  
            ,_OrderId    = o.orderId 
            ,_poNo       = o.poNo    
            , cb         = app.bs({name:"cbFilter1",type:"checkbox"})
            ,_dataRows  = []
        ; 
        
        if(gOEMId == 5){
            _dataRows.push(
                 {text:"Line No."                         ,width:150       ,style:"text-align:center"
                    ,onRender  :  function(d){ 
                        return app.bs({name:"order_part_id"  ,type:"hidden"      ,value: svn(d,"order_part_id")}) 
                            +  app.bs({name:"order_id"       ,type:"hidden"      ,value: gOrderId}) 
                            +  app.bs({name:"is_edited"      ,type:"hidden"      ,value: svn(d,"is_edited")})
                            +  app.bs({name:"status_id"      ,style:"text-align:center" ,type:"hidden"       ,value: svn(d,"status_id")})
                            +  app.bs({name:"line_no"      ,style:"text-align:center" ,type:"input"       ,value: svn(d,"line_no")})
                            
                            ;
                    }
                     
                 }

               /* ,{text:"Line No."               ,type:"input"           ,name:"line_no"                  ,width:65      ,style:"text-align:center"}*/
                ,{text:"Build Phase"            ,type:"select"          ,name:"build_phase_id"           ,width:200       ,style:"text-align:left"}
                ,{text:"Model Year"             ,type:"select"          ,name:"model_year"               ,width:100       ,style:"text-align:left"}
                ,{text:"Harness Family"         ,type:"select"          ,name:"harness_family_id"        ,width:200       ,style:"text-align:left"}
                ,{text:"Base"                   ,type:"select"          ,name:"base"                     ,width:200       ,style:"text-align:left"} 
                ,{text:"OEM Part No."           ,type:"select"          ,name:"oem_program_part_id"      ,width:200       ,style:"text-align:left"} 
                ,{text:"Plants"                 ,type:"select"          ,name:"plant_id"                 ,width:200       ,style:"text-align:left"}
                ,{text:"Warehouses"                                                                      ,width:200       ,style:"text-align:left" 
                    ,onRender: function(d){
                        return bs({name:"warehouse_id"          ,type:"select"  ,value:app.svn(d,"warehouse_id")})
                            +  bs({name:"customer_program_id"   ,type:"hidden"  ,value:app.svn(d,"customer_program_id")})
                            +  bs({name:"customer_part_no"      ,type:"hidden"  ,value:app.svn(d,"customer_part_no")});
                    }
                    
                } 
                ,{text:"Prefix"                                 ,width:120          ,style:"text-align:center"
                        ,onRender: function(d){ return svn(d,"prefix");}
                } 
                ,{text:"Suffix"                                 ,width:120          ,style:"text-align:center"
                        ,onRender: function(d){ return svn(d,"suffix") ;}
                }
            
            );
        }else{
            _dataRows.push(
                 {text: "Build Phase"                            ,width: 65          ,style: "text-align:left"
                    ,onRender  :  function(d){  
                        return app.bs({name:"order_part_id"     ,type:"hidden"      ,value: svn(d,"order_part_id")}) 
                            +  app.bs({name:"order_id"          ,type:"hidden"      ,value: gOrderId}) 
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: svn(d,"is_edited")})
                            +  app.bs({name:"build_phase_id"    ,type:"select"      ,value: svn(d,"build_phase_id")})
                            +app.bs({name:"status_id"  ,type:"hidden"      ,value: svn(d,"status_id")}) 
                            +  app.bs({name:"line_no"    ,type:"hidden"      ,value: svn(d,"line_no")}); 
                    } 
                 
                } 
                /*,{text:"Status"                 ,width:250       ,style:"text-align:center"
                    ,onRender: function(d){
                        return +app.bs({name:"status_id"  ,type:"hidden"      ,value: svn(d,"status_id")}) 
                            +  app.bs({name:"line_no"    ,type:"hidden"      ,value: svn(d,"line_no")})
                        
                    }
                }*/
                ,{text:"Model Year"                             ,type:"select"      ,name:"model_year"               ,width:100       ,style:"text-align:left"}
                ,{text:"Harness Family"                         ,type:"select"      ,name:"harness_family_id"        ,width:200       ,style:"text-align:left"}
                ,{text:"OEM Part No."                           ,type:"select"      ,name:"oem_program_part_id"      ,width:200       ,style:"text-align:left"} 
                ,{text:"Plants"                                 ,type:"select"      ,name:"plant_id"                 ,width:200       ,style:"text-align:left"}
                ,{text:"Warehouses"                             ,type:"select"      ,name:"warehouse_id"             ,width:200       ,style:"text-align:left"} 
                ,{text:"Customer Part No."                                                               ,width:200       ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"customer_program_id"   ,type:"hidden"      ,value:app.svn(d,"customer_program_id")})
                            +  bs({name:"customer_part_no"      ,type:"input"       ,value:app.svn(d,"customer_part_no")});
                    }
                } 

            );
        }
        
        _dataRows.push(        
                 {text:"Customer MRD"            ,width:160        
                    ,onRender: function(d){ return bs({style:"text-align:center" ,type:"input"  ,name:"customer_mrd"    ,value: svn(d,"customer_mrd").toShortDate()});
                        
                    }
                }
                ,{text:"Order Part Qty"      ,width:85       
                    ,onRender: function(d){
                        return bs({name:"order_qty"   ,style:"text-align:center" ,type:"input"  ,value:app.svn(d,"order_qty")});
                           // +  bs({name:"comment"     ,type:"hidden"   ,value:app.svn(d,"customer_part_no")});
                    }
                }   
                ,{text:"Rate and Flow"                          ,type:"yesno"       ,name:"rate_flow"                ,width:90        ,style:"text-align:left"   ,defaultValue: "N"
                    ,onRender: function(d){
                        return bs({name:"rate_flow"   ,type:"yesno"  ,value:app.svn(d,"rate_flow") ,style:"text-align:left"})
                            +  bs({name:"comment"     ,type:"hidden"   ,value:app.svn(d,"comment")});
                    }
                }
        );

        $("#newOrderPartsGrid").dataBind({
             //width              : $("#frm_modalWindowOrderParts").width() - 20
             height             : $(window).height() - 280
            ,blankRowsLimit     : 20
            ,dataRows           : _dataRows
            ,onComplete: function(o){
                var  _this      = this
                    ,_zRow      = _this.find(".zRow")
                    ,_bpId      = ""
                    ,_my        = ""
                    ,_hfId      = ""
                ; 

                markOrderPartsMandatory();
            
                //_this.find('.zRows').css('cssText', 'height : 500px !important');
                _this.find("#cbFilter1").setCheckEvent("#orderPartsGrid input[name='cb']");
                _this.data("_orderId",_OrderId);
                _this.data("_progId",_ProgId);
                _this.data("_custId",_CustId);
                _this.data("_oemId",_OEMId);
                _this.data("_poNo",_poNo);
                /*_zRow.find("select[name='status_id']").dataBind({
                     url        : app.procURL + "statuses_sel @level_no=2" 
                    ,text       : "status_desc"
                    ,value      : "status_id" 
                });
*/
                _zRow.find("[name='customer_mrd']").datepicker({ 
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                }).on("hide", function(e) {
                    $(this).closest(".zRow").find("#order_qty").focus();
                });
                
                _zRow.find("select[name='build_phase_id']").dataBind({
                    sqlCode    :"D210"   //dd_program_bp_sel
                   ,parameters : {program_id : _ProgId} 
                   ,text       :"build_phase_abbrv"
                   ,value      :"build_phase_id"
                   ,onChange   : function(d){
                        var _self = this;
                        var _zRow = _self.closest(".zRow");
                        _bpId = _self.val();
                        _zRow.find("select[name='harness_family_id']").val("");
                        _zRow.find("select[name='oem_program_part_id']").val("");
                        _zRow.find("select[name='plant_id']").val("");
                        _zRow.find("select[name='warehouse_id']").val("");

                        _self.closest(".zRow").find("select[name='model_year']").dataBind({
                            sqlCode    :"D211"   //dd_program_model_year_sel
                           ,parameters : {program_id : _ProgId, bp_id :_bpId } 
                           ,text       :"model_year_name"
                           ,value      :"model_year"
                           ,onChange   : function(d){
                                var _self = this;
                                var _zRow = _self.closest(".zRow");
                                _my = _self.val();
                                _zRow.find("select[name='oem_program_part_id']").val("");
                                _zRow.find("select[name='plant_id']").val("");
                                _zRow.find("select[name='warehouse_id']").val("");

                                _self.closest(".zRow").find("select[name='harness_family_id']").dataBind({
                                     sqlCode    : "D214" //dd_program_harness_sel
                                    ,parameters : {program_id : _ProgId, bp_id : _bpId, model_year : _my}
                                    ,text       : "harness_family"
                                    ,value      : "harness_family_id"
                                    ,onChange   : function(d){
                                        var _self = this;
                                        var _zRow = _self.closest(".zRow");
                                        _hfId = _self.val();
                                        _zRow.find("select[name='plant_id']").val("");
                                        _zRow.find("select[name='warehouse_id']").val("");

                                        _self.closest(".zRow").find("select[name='oem_program_part_id']").dataBind({
                                             sqlCode    : "D209" //dd_program_parts_sel
                                            ,parameters : {program_id : _ProgId, bp_id : _bpId, model_year : _my, customer_id : _CustId, hf_id : _hfId}
                                            ,text       : "oem_part_no"
                                            ,value      : "oem_program_part_id"
                                            ,onChange   : function(d){
                                                var _zRow = $(this).closest(".zRow");
                                                var _d = d.data[0];
                                                console.log(_d);
                                                console.log(_d.plant_id);
                                                _zRow.find("select[name='plant_id']").attr("selectedvalue",_d.plant_id)
                                                _zRow.find("select[name='warehouse_id']").attr("selectedvalue",_d.warehouse_id)
                                                _zRow.find("select[name='plant_id']").dataBind({
                                                     sqlCode    : "P144"
                                                    ,parameters : {plant_id :_d.plant_id}
                                                    ,text       : "plant_name"
                                                    ,value      : "plant_id"
                                                });
                                                _zRow.find("select[name='warehouse_id']").dataBind({
                                                     url        : app.procURL + "warehouses_sel"
                                                    ,parameters : {warehouse_id :_d.warehouse_id}
                                                    ,text       : "warehouse_name"
                                                    ,value      : "warehouse_id"
                                                });

                                                $.get(app.procURL + "oem_program_parts_sel @bp_id='" + _bpId + "'"
                                                    + ",@model_year='" + _my + "'"
                                                    + ",@hf_id='" +_hfId + "'"
                                                    + ",@program_id='" + _ProgId + "'"
                                                    + ",@oem_id='" + _OEMId + "'"
                                                    + ",@customer_id='" + _CustId + "'"
                                                    , function(d){
                                                        var _info = d.rows[0];
                                                        if(isUD(_info)) return;
                                                        var __zRow = _self.closest(".zRow");
                                                        __zRow.find("#customer_program_id").val(_info.customer_program_id);
                                                        __zRow.find("#customer_part_no").val(_info.customer_part_no);
                                                });
                                                
                                            }
                                        });
                                    }
                                });
                                
                                _self.closest(".zRow").find("select[name='base']").dataBind({
                                     sqlCode    : "D214" //dd_program_harness_sel
                                    ,parameters : {program_id : _ProgId,model_year : _my}
                                    ,text       : "base"
                                    ,value      : "harness_family_id"
                                    ,onChange   : function(d){
                                        var __hfId = $(this).val();
                                        $(this).closest(".zRow").find("select[name='harness_family_id']").attr("selectedvalue",__hfId);
                                        $(this).closest(".zRow").find("select[name='harness_family_id']").dataBind({
                                                 sqlCode    : "D214" //dd_program_harness_sel
                                                ,parameters : {program_id : _ProgId, bp_id : _bpId, model_year : _my}
                                                ,text       : "harness_family"
                                                ,value      : "harness_family_id"
                                        });
                                        $(this).closest(".zRow").find("select[name='oem_program_part_id']").dataBind({
                                             sqlCode    : "D209" //dd_program_parts_sel
                                            ,parameters : {program_id : _ProgId, bp_id : _bpId, model_year : _my, customer_id : _CustId, hf_id : __hfId}
                                            ,text       : "oem_part_no"
                                            ,value      : "oem_program_part_id"
                                            ,onChange   : function(d){
                                                var _zRow = $(this).closest(".zRow");
                                                var _d = d.data[0];
                                                
                                                _zRow.find("select[name='plant_id']").attr("selectedvalue",(isUD(_d.plant_id) ? _d.plant_id : ""))
                                                _zRow.find("select[name='warehouse_id']").attr("selectedvalue",_d.warehouse_id)
                                                _zRow.find("select[name='plant_id']").dataBind({
                                                     sqlCode    : "P144"
                                                    ,parameters : {plant_id :_d.plant_id}
                                                    ,text       : "plant_name"
                                                    ,value      : "plant_id"
                                                });
                                                _zRow.find("select[name='warehouse_id']").dataBind({
                                                     url        : app.procURL + "warehouses_sel"
                                                    ,parameters : {warehouse_id :_d.warehouse_id}
                                                    ,text       : "warehouse_name"
                                                    ,value      : "warehouse_id"
                                                });

                                                $.get(app.procURL + "oem_program_parts_sel @bp_id='" + _bpId + "'"
                                                    + ",@model_year='" + _my + "'"
                                                    + ",@hf_id='" + __hfId + "'"
                                                    + ",@program_id='" + _ProgId + "'"
                                                    + ",@oem_id='" + _OEMId + "'"
                                                    + ",@customer_id='" + _CustId + "'"
                                                    , function(d){
                                                        var _info = d.rows[0];
                                                        if(isUD(_info)) return;
                                                        var __zRow = _self.closest(".zRow");
                                                        __zRow.find("#customer_program_id").val(_info.customer_program_id);
                                                        __zRow.find("#customer_part_no").val(_info.customer_part_no);
                                                });
                                                
                                            }

                                        });

                                    }
                                 });
                                

                           }
                        }); 
                       
                   }
                   ,onComplete : function(d){
                        _zRow.find("select[name='model_year']").dataBind({
                            sqlCode    :"D211"   //dd_program_model_year_sel
                           ,parameters : {program_id : _ProgId} 
                           ,text       :"model_year_name"
                           ,value      :"model_year"
                        });
                        _zRow.find("select[name='harness_family_id']").dataBind({
                             sqlCode    : "D214" //dd_program_harness_sel
                            ,text       : "harness_family"
                            ,value      : "harness_family_id"
                        });
                        
                        _zRow.find("select[name='base']").dataBind({
                             sqlCode    : "D214" //dd_program_harness_sel
                            ,text       : "base"
                            ,value      : "harness_family_id"
                        });

                        _zRow.find("select[name='oem_program_part_id']").dataBind({
                             sqlCode    : "D209" //dd_program_parts_sel
                            ,text       : "oem_part_no"
                            ,value      : "oem_program_part_id"
                        });
                                 
                       
                   }
                }); 
                _zRow.find("select[name='plant_id']").dataBind({
                     sqlCode    : "P144"
                    ,text       : "plant_name"
                    ,value      : "plant_id"
                });
                _zRow.find("select[name='warehouse_id']").dataBind({
                     url        : app.procURL + "warehouses_sel"
                    ,text       : "warehouse_name"
                    ,value      : "warehouse_id"
                });
            }
                
        });
    }
    function displayOrderParts(o){
        var  cb         = app.bs({name:"cbFilter1",type:"checkbox"})
            ,_dataRows  = []
        ;
 
        gPONo       = o.poNo;
        gOEMName    = o.oemName;
        gCustName   = o.custName; 
        gProgId     = o.progId;
        gOrderId    = o.orderId;
        gOEMId      = o.oemId;
        gCustId     = o.custId; 
        if(gOEMId == 5){
            _dataRows.push(
                 {text: cb                       ,width : 25   ,style : "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.bs({name:"order_part_id"  ,type:"hidden"      ,value: svn(d,"order_part_id")}) 
                            +  app.bs({name:"order_id"       ,type:"hidden"      ,value: gOrderId}) 
                            +  app.bs({name:"is_edited"      ,type:"hidden"      ,value: svn(d,"is_edited")})
                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                    }
                
                }
                ,{text:"Edit"                   ,width:65        ,style:"text-align:center"
                    ,onRender : function(d){
                        var _edit = '<span><i class="far fa-edit" style="text-decoration: underline; cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title="Click to edit." onclick="orders.editOrderPart(this)"></i></span>';
                        
                        return (d !==null ?_edit : "" );
                    }
                }
                ,{text:"Status"                 ,type:"select"          ,name:"status_id"               ,width:150       ,style:"text-align:center"}
                ,{text:"Line No."               ,type:"input"           ,name:"line_no"                 ,width:65        ,style:"text-align:center"}
                ,{text:"Build Phase"            ,type:"select"          ,name:"build_phase_id"          ,width:200       ,style:"text-align:left"  }
                ,{text:"Model Year"             ,type:"select"          ,name:"model_year"              ,width:100       ,style:"text-align:left"  }
                ,{text:"Harness Family"         ,type:"select"          ,name:"harness_family_id"       ,width:200       ,style:"text-align:left"  }
                ,{text:"OEM Part No."           ,type:"select"          ,name:"oem_program_part_id"     ,width:200       ,style:"text-align:left"  } 
                ,{text:"Plants"                 ,type:"select"          ,name:"plant_id"                ,width:200       ,style:"text-align:left"  }
                ,{text:"Warehouses"                                                                     ,width:200       ,style:"text-align:left" 
                    ,onRender: function(d){
                        return bs({name:"warehouse_id"          ,type:"select"  ,value:app.svn(d,"warehouse_id")})
                            +  bs({name:"customer_program_id"   ,type:"hidden"  ,value:app.svn(d,"customer_program_id")})
                            +  bs({name:"customer_part_no"      ,type:"hidden"  ,value:app.svn(d,"customer_part_no")});
                    }
                    
                } 
            
            );
        }else{
            _dataRows.push(
                 {text: cb                       ,width : 25   ,style : "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.bs({name:"order_part_id"  ,type:"hidden"      ,value: svn(d,"order_part_id")}) 
                            +  app.bs({name:"order_id"       ,type:"hidden"      ,value: gOrderId}) 
                            +  app.bs({name:"is_edited"      ,type:"hidden"      ,value: svn(d,"is_edited")})
                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                    }
                
                }
                ,{text:"Edit"                   ,width:65        ,style:"text-align:center"
                    ,onRender : function(d){
                        var _edit = '<span><i class="far fa-edit" style="text-decoration: underline; cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title="Click to edit." name="btnEdit" onclick="orders.editOrderPart(this)"></i></span>';
                        return (d !==null ?_edit : "" );
                    }
                }
                ,{text:"Status"                 ,width:150       ,style:"text-align:center"
                    ,onRender: function(d){
                        return app.bs({name:"status_id"  ,type:"select"      ,value: svn(d,"status_id")}) 
                            +  app.bs({name:"line_no"    ,type:"hidden"      ,value: svn(d,"line_no")})
                        
                    }
                }
                ,{text:"Build Phase"            ,type:"select"          ,name:"build_phase_id"          ,width:200       ,style:"text-align:left"}
                ,{text:"Model Year"             ,type:"select"          ,name:"model_year"              ,width:100       ,style:"text-align:left"}
                ,{text:"Harness Family"         ,type:"select"          ,name:"harness_family_id"       ,width:200       ,style:"text-align:left"}
                ,{text:"OEM Part No."           ,type:"select"          ,name:"oem_program_part_id"     ,width:200       ,style:"text-align:left"} 
                ,{text:"Plants"                 ,type:"select"          ,name:"plant_id"                ,width:200       ,style:"text-align:left"}
                ,{text:"Warehouses"             ,type:"select"          ,name:"warehouse_id"            ,width:200       ,style:"text-align:left"} 
                ,{text:"Customer Part No."                                                              ,width:200       ,style:"text-align:left"
                    ,onRender: function(d){
                        return bs({name:"customer_program_id"   ,type:"hidden"  ,value:app.svn(d,"customer_program_id")})
                            +  bs({name:"customer_part_no"      ,type:"input"   ,value:app.svn(d,"customer_part_no")});
                    }
                    
                } 

            );
        }
        
        _dataRows.push(        
                {text:"Customer MRD"            ,width:100       ,style:"text-align:left" 
                    ,onRender: function(d){ return bs({type:"input"    ,name:"customer_mrd"    ,value: svn(d,"customer_mrd").toShortDate()});
                        
                    }
                }
                ,{text:"Order Part Qty"         ,name:"order_qty"       ,type:"input"                    ,width:100       ,style:"text-align:center"}  
                ,{text:"Rate and Flow"          ,name:"rate_flow"       ,type:"yesno"                    ,width:90        ,style:"text-align:left"   ,defaultValue: "Y"}
                ,{text:"Details"                ,width:70              ,style:"text-align:center; cursor:pointer;"
                    ,onRender: function(d){  
                        var _link =  '<i class="fas fa-plus" aria-hidden="true" onclick="orders.showDetails( \'' + gPONo +  '\',\''+ o.siteCode +'\',\''+ app.svn(d,"line_no") +'\',\''+ app.svn(d,"oem_part_no") +'\',\''+ app.svn(d,"customer_mrd") +'\',\''+ app.svn(d,"order_part_id")+ '\',\''+ app.svn(d,"role_id")+ '\',\''+ app.svn(d,"order_qty")+ '\')"></i>';
                        return (d !== null ? _link : "");
                    } 
                }  
                ,{text:"Red Border No"         ,width:200       ,style:"text-align:left"
                    ,onRender: function(d){ return bs({name:"red_border_no" ,value: svn(d,"red_border_no")});
                    }
                }  
                ,{text:"Red Border Date"       ,width:200       ,style:"text-align:left"
                     ,onRender: function(d){ return bs({name:"red_border_date" ,value: svn(d,"red_border_date").toShortDate()});
                    }
                }  
                ,{text:"Comment"               ,width:200             ,style:"text-align:left"
                     ,onRender: function(d){ return bs({name:"comment" ,value: svn(d,"comment")}); 
                    }
                }
                ,{text:"Red Border"                ,width:65              ,style:"text-align:center; cursor:pointer;"
                    ,onRender: function(d){  
                        var _link = "";
                        if(svn(d,"red_border_no")){
                            //_link = '<i class="fas fa-edit text-white p-1 mr-1" style="border-radius:5px;width:33px;background-image: linear-gradient(to bottom, #ff0021 0px, #CA1F14 100%);" onclick="orders.showRedBorder(this, \'Edit\')"></i>' 
                            _link += '<button class="btn btn-xs btn-primary fas fa-edit" onclick="orders.showRedBorder(this,\'Edit\')"></button>';
                        }
                        //_link += '<i class="fas fa-plus text-white p-1 mr-1" style="border-radius:5px;width:33px;background-image: linear-gradient(to bottom, #ff0021 0px, #CA1F14 100%);" onclick="orders.showRedBorder(this,\'Add\')"></i>';
                        _link += '<button class="btn btn-xs btn-primary fas fa-plus" onclick="orders.showRedBorder(this,\'Add\')"></button>';
                        return (d !== null ? _link : "");
                    } 
                }  
        );
        
        $("#orderPartsGrid").dataBind({
             url        : app.procURL + "order_parts_sel @order_id=" + gOrderId 
            //,width      : $("#frm_modalWindowOrderParts").width() - 20 
            ,height     : $(window).height() - 280
            ,dataRows   : _dataRows
            ,onComplete : function(o){ 
                //if(o.data.rows.length === 0) orders.addOrderParts();
                //this.height($(window).height() - 280)
                var  _this          = this
                    ,_zRow          = _this.find(".zRow")
                    ,_bpId          = ""
                    ,_my            = ""
                    ,_hfId          = ""
                    ,_info          = o.data.rows[0]
                ; 

                markOrderPartsMandatory(); 
                
                _this.find('input[type=text],select').attr("disabled",true); 
                _this.find("#cbFilter1").setCheckEvent("#orderPartsGrid input[name='cb']"); 
                _this.data("_orderId",gOrderId);
                _this.data("_progId",gProgId);
                _this.data("_custId",gCustId);
                _this.data("_oemId",gOEMId);
                _this.data("_poNo",gPONo);
                _this.data("_oemName",gOEMName);
                _this.data("_custName",gCustName);
                
                if(isUD(_info)) return;
                else{
                    var _buildPhaseId  = ""
                    var _modelYr       = ""
                    var _harnessFamId  = ""
                    _zRow.find("select[name='status_id']").dataBind({
                         url        : app.procURL + "statuses_sel @level_no=2"
                        ,text       : "status_desc"
                        ,value      : "status_id"
                    });
                    _zRow.find("[name='customer_mrd']").datepicker({ pickTime  : false, autoClose : true});
                    _zRow.find("select[name='build_phase_id']").dataBind({
                        sqlCode    :"D210"   //dd_program_bp_sel
                       ,parameters : {program_id : gProgId} 
                       ,text       :"build_phase_abbrv"
                       ,value      :"build_phase_id"
                       ,onChange   : function(d){
                            var _self = this;
                            _bpId = _self.val();
                            _self.closest(".zRow").find("select[name='model_year']").dataBind({
                                sqlCode    :"D211"   //dd_program_model_year_sel
                               ,parameters : {program_id : gProgId, bp_id :_bpId } 
                               ,text       :"model_year_name"
                               ,value      :"model_year"
                               ,onChange   : function(d){
                                    var _self = this;
                                    _my = _self.val();
                                    _self.closest(".zRow").find("select[name='harness_family_id']").dataBind({
                                         sqlCode    : "D214" //dd_program_harness_sel
                                        ,parameters : {program_id : gProgId, bp_id : _bpId, model_year : _my}
                                        ,text       : "harness_family"
                                        ,value      : "harness_family_id"
                                        ,onChange   : function(d){
                                            var _self = this;
                                            _hfId = _self.val();
            
                                            _self.closest(".zRow").find("select[name='oem_program_part_id']").dataBind({
                                                 sqlCode    : "D209" //dd_program_parts_sel
                                                ,parameters : {program_id : gProgId, bp_id : _bpId, model_year : _my, customer_id : gCustId, hf_id : _hfId}
                                                ,text       : "oem_part_no"
                                                ,value      : "oem_program_part_id"
                                                ,onChange   : function(d){
                                                    var _zRow = $(this).closest(".zRow");
                                                    console.log("d",d);
                                                    var _d = d.data[0];
                                                    
                                                    _zRow.find("select[name='plant_id']").attr("selectedvalue",_d.plant_id)
                                                    _zRow.find("select[name='warehouse_id']").attr("selectedvalue",_d.warehouse_id)
                                                    _zRow.find("select[name='plant_id']").dataBind({
                                                         sqlCode    : "P144"
                                                        ,parameters : {plant_id :_d.plant_id}
                                                        ,text       : "plant_name"
                                                        ,value      : "plant_id"
                                                    });
                                                    _zRow.find("select[name='warehouse_id']").dataBind({
                                                         url        : app.procURL + "warehouses_sel"
                                                        ,parameters : {warehouse_id :_d.warehouse_id}
                                                        ,text       : "warehouse_name"
                                                        ,value      : "warehouse_id"
                                                    });
                                                    $.get(app.procURL + "oem_program_parts_sel @bp_id='" + _bpId + "'"
                                                        + ",@model_year='" + _my + "'"
                                                        + ",@hf_id='" +_hfId + "'"
                                                        + ",@program_id='" + gProgId + "'"
                                                        + ",@oem_id='" + gOEMId + "'"
                                                        + ",@customer_id='" + gCustId + "'"
                                                        , function(d){
                                                            var _info = d.rows[0];
                                                            if(isUD(_info)) return;
                                                            var __zRow = _self.closest(".zRow");
                                                            __zRow.find("#customer_program_id").val(_info.customer_program_id);
                                                            __zRow.find("#customer_part_no").val(_info.customer_part_no);
                                                    });
                                                    
                                                }
                                            });
                                        }
                                    });
                               }
                            }); 
                           
                       }
                       ,onEachComplete : function(d){
                           var _$zRow = $(this).closest(".zRow");
                           _buildPhaseId   = _$zRow.find("#build_phase_id").val();
                       }
                   }); 
                    _zRow.find("select[name='model_year']").dataBind({
                         sqlCode    :"D211"   //dd_program_model_year_sel
                        ,parameters : {program_id : gProgId} 
                        ,text       :"model_year_name"
                        ,value      :"model_year"
                        ,onEachComplete : function(d){
                           var _$zRow = $(this).closest(".zRow");
                           _modelYr   = _$zRow.find("#model_year").val();
                        }
                    });
                    _zRow.find("select[name='harness_family_id']").dataBind({
                         sqlCode    : "D214" //dd_program_harness_sel
                        ,parameters : {program_id : gProgId, bp_id : _buildPhaseId, model_year : _modelYr}
                        ,text       : "harness_family"
                        ,value      :  "harness_family_id"
                        ,onChange   : function(d){
                            var _self = this;
                            _hfId = _self.val();
    
                            _self.closest(".zRow").find("select[name='oem_program_part_id']").dataBind({
                                 sqlCode    : "D209" //dd_program_parts_sel
                                ,parameters : {program_id : gProgId, bp_id :  _buildPhaseId, model_year : _modelYr, customer_id : gCustId, hf_id : _hfId}
                                ,text       : "oem_part_no"
                                ,value      : "oem_program_part_id"
                                ,onChange   : function(d){
                                    var _zRow = $(this).closest(".zRow");
                                    var _d = d.data[0];
                                    console.log("_d",_d);
                                    _zRow.find("select[name='plant_id']").attr("selectedvalue",_d.plant_id)
                                    _zRow.find("select[name='warehouse_id']").attr("selectedvalue",_d.warehouse_id)
                                    _zRow.find("select[name='plant_id']").dataBind({
                                         sqlCode    : "P144"
                                        ,parameters : {plant_id :_d.plant_id}
                                        ,text       : "plant_name"
                                        ,value      : "plant_id"
                                    });
                                    _zRow.find("select[name='warehouse_id']").dataBind({
                                         url        : app.procURL + "warehouses_sel"
                                        ,parameters : {warehouse_id :_d.warehouse_id}
                                        ,text       : "warehouse_name"
                                        ,value      : "warehouse_id"
                                    });
                                    
                                    $.get(app.procURL + "oem_program_parts_sel @bp_id='" + _bpId + "'"
                                        + ",@model_year='" + _modelYr + "'"
                                        + ",@hf_id='" +_hfId + "'"
                                        + ",@program_id='" + gProgId + "'"
                                        + ",@oem_id='" + gOEMId + "'"
                                        + ",@customer_id='" + gCustId + "'"
                                        , function(d){
                                            var __info = d.rows[0];
                                            if(isUD(__info)) return;
                                            var __zRow = _self.closest(".zRow");
                                            __zRow.find("#customer_program_id").val(__info.customer_program_id);
                                            __zRow.find("#customer_part_no").val(__info.customer_part_no);
                                    });
                                    
                                }
                                
                            });
                        }
                        ,onEachComplete : function(d){
                           var _$zRow = $(this).closest(".zRow");
                           _harnessFamId   = _$zRow.find("#harness_family_id").val();
                        }
                        
                        
                    });
                    _zRow.find("select[name='oem_program_part_id']").dataBind({
                         sqlCode    : "D209" //dd_program_parts_sel
                        ,parameters : {program_id : gProgId, bp_id : _buildPhaseId, model_year : _modelYr, customer_id : gCustId, hf_id : _harnessFamId}
                        ,text       : "oem_part_no"
                        ,value      : "oem_program_part_id"
                        ,onChange   : function(d){
                            var _zRow = $(this).closest(".zRow");
                            var _i = d.index;
                            var _d = d.data[_i];
                            _zRow.find("select[name='plant_id']").attr("selectedvalue",_d.plant_id)
                            _zRow.find("select[name='warehouse_id']").attr("selectedvalue",_d.warehouse_id)
                            _zRow.find("select[name='plant_id']").dataBind({
                                 sqlCode    : "P144"
                                ,parameters : {plant_id :_d.plant_id}
                                ,text       : "plant_name"
                                ,value      : "plant_id"
                            });
                            _zRow.find("select[name='warehouse_id']").dataBind({
                                 url        : app.procURL + "warehouses_sel"
                                ,parameters : {warehouse_id :_d.warehouse_id}
                                ,text       : "warehouse_name"
                                ,value      : "warehouse_id"
                            });
                            $.get(app.procURL + "oem_program_parts_sel @bp_id='" + _bpId + "'"
                                + ",@model_year='" + _my + "'"
                                + ",@hf_id='" +_hfId + "'"
                                + ",@program_id='" + gProgId + "'"
                                + ",@oem_id='" + gOEMId + "'"
                                + ",@customer_id='" + gCustId + "'"
                                , function(d){
                                    var _info = d.rows[0];
                                    console.log("_info",_info);
                                    if(isUD(_info)) return;
                                    var __zRow = _zRow.closest(".zRow");
                                    __zRow.find("#customer_program_id").val(_info.customer_program_id);
                                    __zRow.find("#customer_part_no").val(_info.customer_part_no);
                            });
                        }

                    });
                    _zRow.find("select[name='plant_id']").dataBind({
                         sqlCode    : "P144"
                        ,text       : "plant_name"
                        ,value      : "plant_id"
                    });
                    _zRow.find("select[name='warehouse_id']").dataBind({
                         url        : app.procURL + "warehouses_sel"
                        ,text       : "warehouse_name"
                        ,value      : "warehouse_id"
                    });
   
    

                }
                 
                
            }
                
        });
    }
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlEngrMngr
            , sizeAttr  : "modal-md"
            , title     : "Enginnering Manager(s)"
            , body      : gtw.new().modalBodyEngineeringManager({engrMngrListGroup:"engrMngrList"}).html()  
        })
        .bsModalBox({
              id        : gMdlPlants
            , sizeAttr  : "modal-md"
            , title     : "Plantt(s)"
            , body      : gtw.new().modalBodyPlants({plantsListGroup:"plantList"}).html()  
        })
        .bsModalBox({
              id        : gMdlWarehouses
            , sizeAttr  : "modal-md"
            , title     : "Warehouse(s)"
            , body      : gtw.new().modalBodyWarehouses({warehousesListGroup:"warehousesist"}).html()  
        })
        .bsModalBox({
              id        : gMdlOrderParts
            , sizeAttr  : "modal-full"
            , title     : "Order Parts"
            , body      : gtw.new().modalBodyOrderParts({orderPartsGrid:"orderPartsGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderParts();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
                        +'<div class="pull-left"><button type="button" onclick="orders.deleteOrderParts();" class="btn btn-sm btn-primary"><i class="far fa-trash-alt"></i> Delete</button></div>'
                        +'<div class="pull-left"><button type="button" onclick="orders.addOrderParts();" class="btn btn-sm btn-primary" id="addOrderParts"><i class="far fa-plus"></i> Add</button></div>'
        }) 
        .bsModalBox({
              id        : gMdlAddOrderParts
            , sizeAttr  : "modal-full"
            , title     : "Order Parts"
            , body      : gtw.new().modalBodyAddOrderParts({newOrderPartsGrid:"newOrderPartsGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitNewOrderParts();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
        }) 
        .bsModalBox({
              id        : gMdlDetails
            , sizeAttr  : "modal-full"
            , title     : "Order Part Details"
            , body      : gtw.new().modalBodyOrderPartDetails({grid:"orderPartDetailGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderPartDetails();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
                        +'<div class="pull-left"><button type="button" onclick="orders.deleteOrderPartDetails();" class="btn btn-sm btn-primary"><i class="far fa-trash-alt"></i> Delete</button></div>'
        })
        .bsModalBox({
              id        : gMdlRedBorder
            , sizeAttr  :"modal-sm"
            , title     : "" 
            , body      : gtw.new().modalBodyRedBorder().html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderRedBorder();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>' 
        }) 
        .bsModalBox({
              id        : gMdlOrderUsers
            , sizeAttr  : "modal-md"
            , title     : "Order Users"
            , body      : gtw.new().modalBodyOEMOrderUsers({orderUsersGrid:"orderUsersGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderUsers();" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
        })
        .bsModalBox({
              id        : gMdlOrderPlants
            , sizeAttr  : "modal-md"
            , title     : "Order Users"
            , body      : gtw.new().modalBodyOrderPlants({orderPlantsGrid:"orderPlantsGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderPlants(this);" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
        })
        .bsModalBox({
              id        : gMdlOrderWarehouses
            , sizeAttr  : "modal-md"
            , title     : "Order Users"
            , body      : gtw.new().modalBodyOrderWarehouses({orderWarehousesGrid:"orderWarehousesGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderWarehouses(this);" class="btn btn-sm btn-primary"><i class="far fa-save"></i> Save</button></div>'
        });
    }
    
    function initChangeEvent(){
        $("input[name='file']").change(function(){
            fileNameThumbNail= this.files[0].name;
            var fileSize1 =  this.files[0].size / 1000.00; //to kilobytes
            if(fileSize1 > 1000){ 
                alert("Please make sure that file size must not exceed 100 KB.");
                this.value="";
            }
        });
    }
    function markOrderParts(){
        zsi.form.markMandatory({       
          "groupNames":[
                {
                     "names" : ["oem_id","customer_id","contact_id","program_id","po_no"]
                    ,"type":"M"
                }             
              
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["OEM","Customer","Customer Contact","Program","PO No"]}
          ]
        });    
    }
    function markOrderPartsMandatory(){
        zsi.form.markMandatory({       
          "groupNames":[
                {
                     "names" : ["build_phase_id","model_year","harness_family_id","oem_program_part_id","plant_id","warehouse_id","customer_mrd","order_qty"]
                    ,"type":"M"
                }             
              
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Build Phase","Model Year","Harness Family","OEM Part No.","Plants","Warehouses","Customer MRD","Order Part Qty"]}
          ]
        });    
    }
    runDatePicker = function(){ 
        var _$tbl =$("#tableOrder");
        _$tbl.find("#po_issue_date").datepicker({}).datepicker("setDate", "0");    
        _$tbl.find("#mrd").datepicker({}).datepicker("setDate", "0");    
    };
    function setSearch(cId,pId,oId){
      var _tblCode = (cId ? "ref-00021" : "ref-00011");
      var _cId = (cId ? cId : "");
      var _pId = (pId ? pId : "");

      var _params = (_cId ?  "'customer_id=" + _cId + " and program_id=" + _pId + "'"  :  "'program_id=" + _pId + "'");
      var _filterId =  $("#searchOrderParts");
      new zsi.search({
          tableCode: _tblCode
          ,colNames : ["oem_part_no"] 
          ,displayNames : ["Description"]  
          ,searchColumn :"oem_part_no"
          ,input:"input[name=searchOrderParts]"
          ,url : app.execURL + "searchData "
          ,condition: _params
          ,isLikeAll: "Y"
          ,onSelectedItem: function(currentObject,data,i){ 
              if(data){
                  $("#oem_program_part_id").val(data.oem_program_part_id);
                  $("#order_search_id").val(oId);
                  
                  currentObject.value=data.oem_part_no;
                  var tr  = currentObject.parentNode.parentNode;
                  $(tr).find("#searchOrderParts").val(data.oem_part_no);
              }

          }
      });        
    } 
    function setInputs(){
      searchOrderParts = $("input[name=searchOrderParts]");
    }   
    function setToNullIfChecked(_zRow){
        var _$frm = $("#frm_modalWindowOrderUsers");
        var _tempId = _zRow.find("#tempUser_id").val();
        _$frm.find("#orderUsersGrid").find("input[name='cb']").change(function(){
                
                var _userId = $(this).closest(".zRow").find("#user_id");
                if(this.checked) 
                    _userId.val(_tempId);
                else
                    _userId.val('');
        });
    } 
    
    //Public functions
    _public.addOrderParts = function(){
        var  _$grid     = $("#orderPartsGrid")
            ,_$mdl      = $("#" + gMdlAddOrderParts)
            ,_$frm      = $("#frm_modalWindowAddOrderParts")
        ;

        _$mdl.find(".modal-title").text("Order Parts for » " + "PO#: » " + gPONo + " | OEM Name » " + gOEMName + " | Customer Name » " + gCustName );
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayNewOrderParts({
             oemId       : gOEMId
            ,oemName     : gOEMName 
            ,progId      : gProgId   
            ,progName    : "" 
            ,custId      : gCustId
            ,custName    : gCustName 
            ,orderId     : gOrderId
            ,poNo        : gPONo
        });
        
        _$frm.find(".modal-footer").addClass("justify-content-start");
    }
    _public.deleteOrderPartDetails = function(){
        var _$grid = $("#orderPartDetailGrid");
        zsi.form.deleteData({
             code       : "ref-00012"
            ,onComplete : function(data){
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                displayOrderPartsDetails("",_$grid.data("siteCode"),_$grid.data("id")); 
            }
        });          
        
    }
    _public.deleteOrderParts = function(){
        var _$grid = $("#orderPartsGrid");
        zsi.form.deleteData({
             code       : "ref-00010"
            ,onComplete : function(data){
                displayOrderParts({
                     oemId       : ""
                    ,oemName     : ""
                    ,progId      :  _$grid.data("_progId")
                    ,progName    : ""
                    ,custId      : ""
                    ,custName    : ""
                    ,orderId     :  _$grid.data("_orderId")
                    ,poNo        : _$grid.data("_poNo") 
                });
            }
        });          
    }
    _public.editOrderPart = function(o){ 
        var _zRow   = $(o).closest(".zRow");
        _zRow.find("#line_no").attr("disabled",false);   
        _zRow.find("select").attr("disabled",false);
        _zRow.find("#customer_mrd").attr("disabled",false);
        _zRow.find("#comment").attr("disabled",false);
        _zRow.find("#order_qty").attr("disabled",false);     
    }
    _public.isOrderQtyLimitExceed = function(limit,target){
        var _$grid = $("#orderPartDetailGrid");
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
    }
    _public.submitOrderParts = function(){
        if( zsi.form.checkMandatory()!==true) return false;
        var _$grid = $("#orderPartsGrid");
        _$grid.find('input[type=text],select').attr("disabled",false); 
        _$grid.jsonSubmit({
             procedure  : "order_parts_upd"
            ,notInclude : "#build_phase_id,#model_year,#harness_family_id,#customer_part_no,#red_border_no,#red_border_date"
            ,onComplete : function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                displayOrderParts({
                     oemId      : _$grid.data("_oemId")
                    ,oemName    : ""
                    ,progId     : _$grid.data("_progId")
                    ,progName   : ""
                    ,custId     : _$grid.data("_custId")
                    ,custName   : ""
                    ,orderId    : _$grid.data("_orderId") 
                    ,poNo       : _$grid.data("_poNo")
                });
            }
        });
    }
    _public.submitNewOrderParts = function(){
        if( zsi.form.checkMandatory()!==true) return false;
        var _$grid = $("#newOrderPartsGrid");
        _$grid.jsonSubmit({
             procedure  : "order_parts_upd"
            ,notInclude : "#build_phase_id,#model_year,#harness_family_id,#prefix,#base,#suffix,#oem_part_no,#customer_part_no,#order_part_qty"
            ,onComplete : function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                
                //displayOrderParts({
                //     oemId      : _$grid.data("_oemId")   
                //    ,oemName    : "" 
                //    ,progId     : _$grid.data("_progId")
                //    ,progName   : ""
                //    ,custId     : _$grid.data("_custId")  
                //    ,custName   : ""
                //    ,orderId    : _$grid.data("_orderId")
                //    ,poNo       : _$grid.data("_poNo") 
                //});
                $("#tableOrder").find("#showOrderedParts").click();
                
                $('#' + gMdlAddOrderParts).modal('toggle');
        }
        });
    }
    _public.submitOrderRedBorder = function(){ 
        var _$grid  = $("#frm_modalWindowRedBorder"); 
        var _rBO    = _$grid.find("#red_border_no").val();
        var _rBD    = _$grid.find("#red_border_date").val();
        var _rBC    = _$grid.find("#comment").val();  
        _$grid.jsonSubmit({
             procedure: "red_border_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                $("#modalBodyRedBorder").trigger("refresh")
                $("#frm_modalWindowOrderParts").trigger("refresh")
                $("#orderPartsGrid").trigger("refresh")
            }
        });
    }
    _public.submitOrderPartDetails = function(){
         //if (  orders.isOrderQtyLimitExceed(gOrderQty) ){ 
         //    alert( "Promise quantiy is exceeded to "+ gOrderQty + "." );
         //}else{
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
                displayOrderPartsDetails("",_$grid.data("siteCode"),_$grid.data("id"),_$grid.data("roleId")); 
            }
        });
        //}
    }
    _public.showList = function (type,v) {
        var  _$mdl      = $("#" + gMdlOrderUsers)
            ,_name      = ""
            ,_$tbl      = $("#tableOrder")
            ,_$target   = null
        ;

        switch(type){
            case "PM":
                _name = "Program Manager";
                _$target = _$tbl.find("#program_managers")
                _roleId = 2
                break;
            case "CL":
                _name = "Car Leader";
                _$target = _$tbl.find("#car_leaders")
                _roleId = 6
                break;
            case "LM":
                _name = "Launch Manager";
                _$target = _$tbl.find("#launch_managers")
                _roleId = 4
                break;
            case "WC":
                _name = "Warehouse Contacts";
                _$target = _$tbl.find("#warehouse_contacts")
                _roleId = 9
                break;
            default:break;

        }
        
        if(gOrderId == "") return;
        _$mdl.find(".modal-title").text(_name +"(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOrderUsersList(gOEMId,gProgId,_roleId,gOrderId,_$target);
    
    }
    _public.showOrderPlantsList = function () {
        var  _$mdl      = $("#" + gMdlOrderPlants)
            ,_$tbl      = $("#tableOrder")
        ;

        if(gOrderId == "") return;

        _$mdl.find(".modal-title").text("Order Plant(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayPlantsList(gProgId,gOrderId,_$tbl.find("#plants"));
    
    }
    _public.showOrderWarehousesList = function () {
        var  _$mdl      = $("#" + gMdlOrderWarehouses)
            ,_$tbl      = $("#tableOrder")
        ;

        if(gOrderId == "") return;

        _$mdl.find(".modal-title").text("Order Warehouse(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayWarehousesList(gProgId,gOrderId,_$tbl.find("#warehouses"));
    
    }
    _public.showDetails = function(poNo,siteCode,lineNo,oemPartNo,mrd,orderPartId,roleId,orderQty){
        gOrderQty = orderQty;
        var _$mdl = $("#" + gMdlDetails);
        var _$frm = $("#frm_modalWindowOrderPartDetails");
        _$mdl.find(".modal-title").text("Order Part Details for » " + "PO No. » " + poNo + "." + lineNo + " | OEM Part No. » " + oemPartNo + " | Customer MRD » " + mrd.toShortDate() + " | Order Part Qty. » " + orderQty ) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$frm.css('height', '800px');
        displayOrderPartsDetails("",siteCode,orderPartId,roleId);
        _$frm.find(".modal-footer").addClass("justify-content-start");

    }
    _public.showRedBorder = function(obj, event){ 
        var _zRow = $(obj).closest(".zRow");
        var _lineNo = _zRow.find("#line_no").val();
        var _orderPartId = _zRow.find("#order_part_id").val();
        var _rbId = "";
        var _rbn = ""; 
        var _rbd = ""; 
        var _comment = ""; 
        var _$mdl = $("#" + gMdlRedBorder);
        var _$frm = $("#frm_modalWindowRedBorder");
        
        if(event==="Edit"){
            _rbId = _zRow.find("#red_border_id").val();
            _rbn = _zRow.find("#red_border_no").val();
            _rbd = _zRow.find("#red_border_date").val();
            _comment = _zRow.find("#comment").val();
            
            _$frm.find("select, input, textarea").on("keyup change", function(){ 
               _$frm.find("#is_edited").val("Y");
            });  
        }
        
        
        _$mdl.find(".modal-title").text("Red Border » " + " PO#: »" + gPONo +"."+ _lineNo) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$frm.css('height', '460px'); 
        _$frm.find("#order_part_id").val(_orderPartId);
        _$frm.find("#red_border_id").val(_rbId);
        _$frm.find("#red_border_no").val(_rbn);
        _$frm.find("#red_border_date").val(_rbd).datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
        }).on("hide", function(e) {
            _$frm.find("#comment").focus();
        });
        _$frm.find("#comment").val(_comment);
        _$frm.find(".modal-footer").addClass("justify-content-start");
    }
    _public.showOrderParts = function(o,dRows){
        var _$mdl = $("#" + gMdlOrderParts);
        var _$frm = $("#frm_modalWindowOrderParts");
        _$mdl.find(".modal-title").text("Order Parts for » " + "PO#: » " + o.poNo + " | OEM Name » " + o.oemName + " | Customer Name » " + o.custName);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOrderParts(o);
        _$frm.find(".modal-footer").addClass("justify-content-start");
    }
    _public.submitOrderUsers = function(){
        var _$frm = $("#frm_modalWindowOrderUsers");
        var _$grid = _$frm.find("#orderUsersGrid");
            _$grid.jsonSubmit({
                 procedure: "order_users_upd"
                ,notInclude: "#tempUser_id,#program_user"
                ,onComplete: function(data){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");      
                    displayOrderUsersList(_$grid.data("oemId"),_$grid.data("progId"),_$grid.data("roleId"),_$grid.data("orderId"),_$grid.data("target"));
                }
            });
    }
    _public.submitOrderPlants = function(){
       var _$frm = $("#modalWindowOrderPlants");
       var _$grid = _$frm.find("#orderPlantsGrid");
           _$grid.jsonSubmit({
                procedure: "order_plants_upd"
               ,notInclude: "#tempPlant_id,#plant"
               ,onComplete: function(data){
                   if(data.isSuccess===true) zsi.form.showAlert("alert");      
                   displayPlantsList(_$grid.data("progId"),_$grid.data("orderId"),_$grid.data("target"));
               }
           });
    }
    _public.submitOrderWarehouses = function(){
       var _$frm = $("#modalWindowOrderWarehouses");
       var _$grid = _$frm.find("#orderWarehousesGrid");
           _$grid.jsonSubmit({
                procedure: "order_warehouses_upd"
               ,notInclude: "#tempWarehouse_id,#warehouse"
               ,onComplete: function(data){
                   if(data.isSuccess===true) zsi.form.showAlert("alert");      
                   displayWarehousesList(_$grid.data("progId"),_$grid.data("orderId"),_$grid.data("target"));
               }
           });
    }
    
    //Buttons
    $("#btnSaveOrders").click(function () {
        if( zsi.form.checkMandatory()!==true) return false;
        $("#tableOrder").jsonSubmit({
             procedure: "orders_upd"
            ,notInclude: "#oem_id,#comment,#comment_id"
            ,onComplete: function (data) {
                var _$tbl       = $("#tableOrder");
                var _commentId  = _$tbl.find("#comment_id").val();
                var _comment    = _$tbl.find("textarea").val();
                var _PONo       = _$tbl.find("#po_no").val();
                var _OEMId      = _$tbl.find("#oem_id").val();
                var _OEMName    = _$tbl.find("#oem_id :selected").text();
                var _ProgId     = _$tbl.find("#program_id").val();
                var _ProgName   = _$tbl.find("#program_id :selected").text();
                var _CustId     = _$tbl.find("#customer_id").val();
                var _CustName   = _$tbl.find("#customer_id :selected").text();
                var _siteCode   = _$tbl.find("#site_id").val();
                var _OrderId    = (hashParams.order_id) ? hashParams.order_id : data.returnValue;
                
                if(data.isSuccess===true){ 
                    zsi.form.showAlert("alert");
                    gOrderId = _OrderId;
                    if( _$tbl.find("#order_id").val() ) return;
                    _$tbl.find("#order_id").val(_OrderId);
                    if(_OrderId) _$tbl.find("#showOrderedParts").show();
                    var _obj = {
                         oemId       : _OEMId   
                        ,oemName     : _OEMName 
                        ,poNo        : _PONo     
                        ,progId      : _ProgId  
                        ,progName    : _ProgName
                        ,custId      : _CustId  
                        ,custName    : _CustName
                        ,orderId     : _OrderId
                        ,siteCode    : _siteCode
                    };
                    
                    $.get(app.procURL + "order_parts_sel @order_id=" + _OrderId, function(data){
                        if(data.rows.length) {
                            orders.showOrderParts(_obj);
                        
                        }else {
                            var  _$grid     = $("#orderPartsGrid")
                                ,_$mdl      = $("#" + gMdlAddOrderParts)
                                ,_$frm      = $("#frm_modalWindowAddOrderParts")
                            ;
                            
                            _$mdl.find(".modal-title").text("Order Parts for » " + "PO#: » " + _PONo + " | OEM Name » " + _OEMName + " | Customer Name » " + _CustName );
                            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                            displayNewOrderParts({
                                 oemId       : _OEMId
                                ,oemName     : _OEMName 
                                ,progId      : _ProgId   
                                ,progName    : _ProgName 
                                ,custId      : _CustId
                                ,custName    : _CustName 
                                ,orderId     : _OrderId
                                ,poNo        : _PONo
                                ,siteCode    : _siteCode
                            });
                            
                            _$frm.find(".modal-footer").addClass("justify-content-start");
    
                        }
                    });
                    
                    
                }
            }
        }); 
    });
    $("#btnReset").click(function(){ 
        var _$tbl = $("#tableOrder");
        _$tbl.find(".rev_no").hide();
        _$tbl.find("#showOrderedParts").hide();
        _$tbl.find('input[type=text], input[type=hidden], select').val('');
        _$tbl.find('.clearText').text('');
        _$tbl.find('select').attr('selectedvalue','').val('');  
        //_$tbl.find('#orderComments, #orderAttachments').html('');   
    });
    $("#showOrderedParts").click(function () {
        var  _$tbl       = $("#tableOrder")
            ,_PONo       = _$tbl.find("#po_no").val()
            ,_OEMId      = _$tbl.find("#oem_id").val()
            ,_OEMName    = _$tbl.find("#oem_id :selected").text()
            ,_ProgId     = _$tbl.find("#program_id").val()
            ,_ProgName   = _$tbl.find("#program_id :selected").text()
            ,_CustId     = _$tbl.find("#customer_id").val()
            ,_CustName   = _$tbl.find("#customer_id :selected").text()
            ,_siteCode   = _$tbl.find("#site_id").val()
            ,_commentId  = _$tbl.find("#comment_id").val()
            ,_comment    = _$tbl.find("textarea").val()
        ;

        orders.showOrderParts({
             oemId       : _OEMId    
            ,oemName     : _OEMName  
            ,poNo        : _PONo     
            ,progId      : _ProgId  
            ,progName    : _ProgName
            ,custId      : _CustId  
            ,custName    : _CustName
            ,orderId     : gOrderId 
            ,siteCode    : _siteCode
        });

        
    });
    
    return _public;

})();  

          