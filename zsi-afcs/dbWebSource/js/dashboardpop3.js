 var pop3 = (function(){
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull 
        ,bsButton   = zsi.bs.button
        ,_pub       = {}
        ,_db        = db
        ,_pop1      = pop1
        ,gOrderQty  = 0
        ,gSumTotal  = 0
        ,gOrderPartDetails = _pop1.getOrderListData()
        ;
     
    $(document).ready(function(){
        console.log("pop 2");
        
        var _o = gOrderPartDetails;  
        gOrderQty = _o.order_qty;
        
        var g$mdl = $("#modalOrderDetails");
            g$mdl.find(".modal-title").text("Order Part Details for » " + "PO No. » " + _o.po_no ) ;
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });  
        displayOrderPartsDetails(gOrderPartDetails);
    });
    
    _pub.isOrderQtyLimitExceed = function(limit,target){ 
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
    };
    
    function displayOrderPartsDetails(o){   
        var cb = app.bs({name:"cbFilter2",type:"checkbox"})  
        ,_data = []
        ,_dataRows = []
        ,_getDataRows = function(callback){
            $.get(app.procURL + "order_part_details_sel @order_part_id=" + o.order_part_id,function(data){
                callback(data.rows);
            });
        }; 
        console.log("o",o);
        _getDataRows(function(data){
            _data = data;
            _dataRows = [
                {text:cb        ,width:25              ,style : "text-align:left"
                    ,onRender  :  function(d)
                    { return app.bs({name:"order_part_dtl_id"                   ,type:"hidden"      ,value: app.svn (d,"order_part_dtl_id")}) 
                           + app.bs({name:"is_edited"                           ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                           + app.bs({name:"order_part_id"                       ,type:"hidden"      ,value: o.order_part_id})
                           + app.bs({name:"status_id"                           ,type:"hidden"      ,value: app.svn("status_id")}) 
                           +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                   }
               }  
               
            ];  
            if(o.op_status_id === 20){ 
                _dataRows.push(
                    {text:"Customer Required Date"                                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"customer_required_date"   ,value: svn(d,"customer_required_date").toShortDate()});
                       }
                   }
                   ,{text:"Customer Required Qty"                       ,width:160     ,style:"text-align:left"
                       ,onRender: function(d){
                            
                               return bs({type:"input"                  ,name:"required_qty"                 ,value: app.svn(d,"required_qty") })
                                   + bs({type:"hidden"                  ,name:"lear_promise_date"            ,value: app.svn(d,"lear_promise_date")})
                                   + bs({name: "promised_qty"           ,type: "hidden"                      ,value: app.svn(d,"promised_qty") })
                                   + bs({name: "mfg_target_ship_date"   ,type: "hidden"                      ,value: app.svn(d,"mfg_target_ship_date") })
                                   + bs({name: "mfg_actual_ship_date"   ,type: "hidden"                      ,value: app.svn(d,"mfg_actual_ship_date") })
                                   + bs({name: "shipment_qty"           ,type: "hidden"                      ,value: app.svn(d,"shipment_qty") }) 
                                   + bs({name: "box_size"               ,type: "hidden"                      ,value: app.svn(d,"box_size") })
                                   + bs({name: "no_cartons"             ,type: "hidden"                      ,value: app.svn(d,"no_cartons") })
                                   + bs({name: "box_dimension"          ,type: "hidden"                      ,value: app.svn(d,"box_dimension") })
                                   + bs({name: "weight_lb"              ,type: "hidden"                      ,value: app.svn(d,"weight_lb") })
                                   + bs({name: "serial_no"              ,type: "hidden"                      ,value: app.svn(d,"serial_no") })
                                   + bs({name: "delivery_carrier"       ,type: "hidden"                      ,value: app.svn(d,"delivery_carrier") })
                                   + bs({name: "shipper_number"         ,type: "hidden"                      ,value: app.svn(d,"shipper_number") })
                                   + bs({name: "shipment_date"          ,type: "hidden"                      ,value: app.svn(d,"shipment_date") })
                                   + bs({name: "shipment_by"            ,type: "hidden"                      ,value: app.svn(d,"shipment_by") })
                                   + bs({name: "special_instruction"    ,type: "hidden"                      ,value: app.svn(d,"special_instruction") });
                           
                       }
                   }   
                );
            } 
            else if(o.op_status_id === 17){ 
                _dataRows.push(
                    {text:"Customer Required Date"                                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"customer_required_date"                   ,value: svn(d,"customer_required_date").toShortDate()});
                       }
                    }
                    ,{text:"Customer Required Qty"                              ,width:200                                  ,style:"text-align:left"
                         ,onRender: function(d){
                            
                               return bs({type:"input"                  ,name:"required_qty"                 ,value: app.svn(d,"required_qty") })
                                   + bs({type:"hidden"                  ,name:"lear_promise_date"            ,value: app.svn(d,"lear_promise_date")})
                                   + bs({type: "hidden"                 ,name: "promised_qty"                ,value: app.svn(d,"promised_qty") });
                           
                       } 
                   }
                   ,{text:"Manufacturing Target Ship Date"                                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"mfg_target_ship_date"                             ,value: svn(d,"mfg_target_ship_date").toShortDate()})
                                + bs({type:"hidden" ,name:"mfg_actual_ship_date"                             ,value: svn(d,"mfg_actual_ship_date").toShortDate()});
                       }
                    }
                   ,{text:"Manufacturing Qty"                       ,type: "input"                       ,name:"shipment_qty"                 ,width:160         ,style:"text-align:left"
                       ,onRender : function(d){
                            return bs({name: "shipment_qty"         ,type: "input"                       ,value: app.svn(d,"shipment_qty") })
                               +bs({name: "box_size"                ,type: "hidden"                      ,value: app.svn(d,"box_size") })
                               + bs({name: "no_cartons"             ,type: "hidden"                      ,value: app.svn(d,"no_cartons") })
                               + bs({name: "box_dimension"          ,type: "hidden"                      ,value: app.svn(d,"box_dimension") })
                               + bs({name: "weight_lb"              ,type: "hidden"                      ,value: app.svn(d,"weight_lb") })
                               + bs({name: "serial_no"              ,type: "hidden"                      ,value: app.svn(d,"serial_no") })
                               + bs({name: "delivery_carrier"       ,type: "hidden"                      ,value: app.svn(d,"delivery_carrier") })
                               + bs({name: "shipper_number"         ,type: "hidden"                      ,value: app.svn(d,"shipper_number") })
                               + bs({name: "shipment_date"          ,type: "hidden"                      ,value: app.svn(d,"shipment_date") })
                               + bs({name: "shipment_by"            ,type: "hidden"                      ,value: app.svn(d,"shipment_by") })
                               + bs({name: "special_instruction"    ,type: "hidden"                      ,value: app.svn(d,"special_instruction") });

                       } 
                   });
            } 
            else if(o.op_status_id === 19){ 
                _dataRows.push(
                    {text:"Customer Required Date"                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"customer_required_date"               ,value: svn(d,"customer_required_date").toShortDate()});
                       }
                    }
                    ,{text:"Customer Required Qty"     ,type: "input"                           ,name: "required_qty"                           ,width:200      ,style:"text-align:left"} 
                    ,{text:"Lear Promise Date"         ,width:200                               ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"lear_promise_date"                    ,value: svn(d,"lear_promise_date").toShortDate()});
                       }
                    }
                    ,{text:"Lear Promised Qty"     ,type: "input"                               ,name: "promised_qty"                           ,width:200      ,style:"text-align:left"} 
                    ,{text:"Manufacturing Target Ship Date"                                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"mfg_target_ship_date"                             ,value: svn(d,"mfg_target_ship_date").toShortDate()})
                                + bs({type:"hidden" ,name:"mfg_actual_ship_date"                             ,value: svn(d,"mfg_actual_ship_date").toShortDate()});
                       }
                    }
                    ,{text:"Manufacturing Qty"                      ,type: "input"           ,name:"shipment_qty"                 ,width:160         ,style:"text-align:left"
                       ,onRender : function(d){
                            return bs({name: "shipment_qty"         ,type: "input"                       ,value: app.svn(d,"shipment_qty") })
                               +bs({name: "box_size"                ,type: "hidden"                      ,value: app.svn(d,"box_size") })
                               + bs({name: "no_cartons"             ,type: "hidden"                      ,value: app.svn(d,"no_cartons") })
                               + bs({name: "box_dimension"          ,type: "hidden"                      ,value: app.svn(d,"box_dimension") })
                               + bs({name: "weight_lb"              ,type: "hidden"                      ,value: app.svn(d,"weight_lb") })
                               + bs({name: "serial_no"              ,type: "hidden"                      ,value: app.svn(d,"serial_no") })
                               + bs({name: "delivery_carrier"       ,type: "hidden"                      ,value: app.svn(d,"delivery_carrier") })
                               + bs({name: "shipper_number"         ,type: "hidden"                      ,value: app.svn(d,"shipper_number") })
                               + bs({name: "shipment_date"          ,type: "hidden"                      ,value: app.svn(d,"shipment_date") })
                               + bs({name: "shipment_by"            ,type: "hidden"                      ,value: app.svn(d,"shipment_by") })
                               + bs({name: "special_instruction"    ,type: "hidden"                      ,value: app.svn(d,"special_instruction") });

                       }
                    }
                );
            } 
            else { 
                _dataRows.push(
                    {text:"Customer Required Date"                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"customer_required_date"               ,value: svn(d,"customer_required_date").toShortDate()});
                       }
                    }
                    ,{text:"Customer Required Qty"     ,type: "input"                           ,name: "required_qty"                           ,width:200      ,style:"text-align:left"} 
                    ,{text:"Lear Promise Date"         ,width:200                               ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"lear_promise_date"                    ,value: svn(d,"lear_promise_date").toShortDate()});
                       }
                    }
                    ,{text:"Lear Promised Qty"     ,type: "input"                               ,name: "promised_qty"                           ,width:200      ,style:"text-align:left"} 
                    ,{text:"Manufacturing Target Ship Date"                                                              ,width:200      ,style:"text-align:left" 
                       ,onRender: function(d){ 
                           return bs({type:"input" ,name:"mfg_target_ship_date"                             ,value: svn(d,"mfg_target_ship_date").toShortDate()})
                                + bs({type:"hidden" ,name:"mfg_actual_ship_date"                             ,value: svn(d,"mfg_actual_ship_date").toShortDate()});
                       }
                    }
                    ,{text:"Manufacturing Qty"                      ,type: "input"           ,name:"shipment_qty"                 ,width:160         ,style:"text-align:left"
                       ,onRender : function(d){
                            return bs({name: "shipment_qty"         ,type: "input"                       ,value: app.svn(d,"shipment_qty") })
                               +bs({name: "box_size"                ,type: "hidden"                      ,value: app.svn(d,"box_size") })
                               + bs({name: "no_cartons"             ,type: "hidden"                      ,value: app.svn(d,"no_cartons") })
                               + bs({name: "box_dimension"          ,type: "hidden"                      ,value: app.svn(d,"box_dimension") })
                               + bs({name: "weight_lb"              ,type: "hidden"                      ,value: app.svn(d,"weight_lb") })
                               + bs({name: "serial_no"              ,type: "hidden"                      ,value: app.svn(d,"serial_no") })
                               + bs({name: "delivery_carrier"       ,type: "hidden"                      ,value: app.svn(d,"delivery_carrier") })
                               + bs({name: "shipper_number"         ,type: "hidden"                      ,value: app.svn(d,"shipper_number") })
                               + bs({name: "shipment_date"          ,type: "hidden"                      ,value: app.svn(d,"shipment_date") })
                               + bs({name: "shipment_by"            ,type: "hidden"                      ,value: app.svn(d,"shipment_by") })
                               + bs({name: "special_instruction"    ,type: "hidden"                      ,value: app.svn(d,"special_instruction") });

                       }
                    }
                );
            } 
           
           $("#orderPartDetailGrid").dataBind({
                //url                : app.procURL + "order_part_details_sel @order_part_id=" + id
                rows               : _data
               ,height            : $(window).height() - 200
               ,blankRowsLimit     : 5
               ,dataRows           : _dataRows
               ,onComplete: function(o){ 
               var  _this          = this
                   ,_zRow          = _this.find(".zRow")
                   ,_checkQuantity = function(){
                       var _$grid = $("#orderPartDetailGrid");
                       var _tmr = null; 
                       var _required    = _$grid.find("input[name='required_qty']").addClass("keys");
                       var _promise     = _$grid.find("input[name='promised_qty']").addClass("keys"); 
                       
                        _$grid.find(".keys").keyup(function(){ 
                           var _$this = $(this); 
                           clearTimeout(_tmr);
                           _tmr = setTimeout(function(){
                               if (pop3.isOrderQtyLimitExceed(gOrderQty,_$this) ){   
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
               
               if(app.userInfo.role_id == 6) {
                   var _requiredDate = _zRow.find("input[name='customer_required_date']");
                   _requiredDate.each(function(){ 
               	    if($(this).val() === "") $(this).removeAttr("disabled",true);
                       else $(this).attr("disabled", true);
                   });
               }
               
               _this.find("#cbFilter2").setCheckEvent("#orderPartDetailGrid input[name='cb']"); 

                _zRow.find("[name='mfg_target_ship_date']").datepicker({ 
                      pickTime  : false
                   , autoclose : true
                   , todayHighlight: true
               }).on("hide", function(e) {
                   $(this).closest(".zRow").find("input[name='shipment_qty']").focus();
               });
               _zRow.find("[name='customer_required_date']").datepicker({ 
                      pickTime  : false
                   , autoclose : true
                   , todayHighlight: true
               }).on("hide", function(e) {
                   $(this).closest(".zRow").find("input[name='required_qty']").focus();
               });
               _this.find("[name='lear_promise_date']").datepicker({ 
                      pickTime  : false
                   , autoclose : true
                   , todayHighlight: true
               }).on("hide", function(e) {
                   $(this).closest(".zRow").find("input[name='promised_qty']").focus();
               });
              
               _this.find(".zRow").each(function(i, v){ 
                   var _$orderDtlId = $(v).find("#order_part_dtl_id");
                   if(_$orderDtlId.val()){
                        if($(v).find("input[name='promised_date']").val()){
                            $(v).find("input[name='promised_date']").attr("readonly", true);
                        }
                       $(v).find("input[name='promised_date'],input[name='promised_qty']").attr("readonly", true);
                   }
               });
               _this.data("id",o.order_part_id);
               _checkQuantity();   
           }
           }); 
        });
    } 
    
    $("#btnSaveDetails").unbind().click(function () {   
        if (gSumTotal < gOrderQty){   
            alert( "Required quantity must be = to "+ gOrderQty + "." ); 
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
                displayOrderPartsDetails(gOrderPartDetails); 
                
            }
        });
    });
    
    $("#btnDeleteDetails").unbind().on("click",function(){ 
        var _$grid = $("#modalOrderDetails");
        zsi.form.deleteData({
            code       : "ref-00012"
            ,onComplete : function(data){
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
                displayOrderPartsDetails(gOrderPartDetails); 
            }
        });   
    }); 
    
    return _pub;
 })();           