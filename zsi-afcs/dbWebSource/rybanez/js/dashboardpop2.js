 var pop2 = (function(){
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull 
        ,bsButton   = zsi.bs.button
        ,_pub       = {}
        ,_db        = db
        ,_pop1      = pop1
        ,gMfgData   = []  
        ,gSumTotal  = 0
        ,gOrderQty  = 0 
        ,gGrid      = ""
        ,gtw        = null;
        
    $(document).ready(function(){
        console.log("pop2 "); 
        gtw = new zsi.easyJsTemplateWriter();
        var _o = _pop1.getOrderListData(); 
        var _$form = $("#frm_modalUpcoming").find(".modal-body");  
            _$form.css("height",$(window).height() - 100); 
            g$mdl = $("#modalUpcoming"); 
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
           
        
        gOrderQty = _o.order_qty;
        getNavItem(_o);  
        if(_o.sql_code === "O257" || _o.sql_code === "O254" || _o.sql_code ===  "O241")  g$mdl.find("#mfgInput").trigger("click");
        else if(_o.sql_code ===  "O247" || _o.sql_code ===  "O256" || _o.sql_code ===  "O255") g$mdl.find("#whsInput").trigger("click"); 
        else if(_o.sql_code === "O235" || _o.op_status_id === 19) g$mdl.find("#plpdInput").trigger("click"); 
        
        $.get(app.procURL + "red_border_sel"
            , function(d){
                var _info = d.rows[0];  
                if(isUD(_info)) return; 
                _$form.find("#red_border_no").val(_info.red_border_no); 
        }); 
        if(app.userInfo.role_id !== 5) g$mdl.find(".btn-group").hide();
        pop2.setCustomerInfo(_o);
        pop2.setOrderList(_o);
        console.log("gorderlistData",_o);
        pop2.clickedQty(_o);  
        pop2.setOrderInfo(_o,$("#frm_modalInfo"));
        $('[data-toggle="tooltip"]').tooltip();
        displayAttachment(_o.order_id,_o.order_part_id);
        displayComment(_o.order_id);
         
    });
    
    _pub.showModalPop3 = function() {
        _db.displayModal("dashboardpop3");
    };
    
    _pub.setCustomerInfo = function(o){
        
       $.get(app.procURL + "order_parts_sel @order_part_id='"+o.order_part_id+"',@order_id='"+o.order_id+"'"
       ,function(data){
           var _d = data.rows;
           if(_d.length > 0){ 
               _d = _d[0];  
                
               var _$tab = $("#nav-c"); 
                    //_$tab.find("#customer").val(_d.customer); 
                    _$tab.find("#customer_code").val(_d.site_code); 
                    _$tab.find("#customer_info").val(_d.contact_email_add);
                    _$tab.find("#ship_address").val();
                    _$tab.find("#instructions").val();
                   
           }
       });
   };
   
    _pub.setOrderList = function(o){  
        $.get(app.procURL + "order_list_sel @search_col='',@search_val=''"
        ,function(data){
            var _data = data.rows[0]; 
            var _d = data.rows; 
            if(_d.length > 0){ 
                _d = _d[0];  
                var _$modal = $("#modalUpcoming").find(".modal-body");
                    _$modal.find("#program_code").text(o.program_code); 
                    _$modal.find("#oem_part_no").text(o.oem_part_no); 
                    _$modal.find("#po_nos").text(o.po_no + "."+o.line_no);
                    _$modal.find("#rev_nos").text(o.rev_no); 
                    _$modal.find("#engr_manager").text(o.engr_manager);  
                    _$modal.find("#cust_Mrd").text(o.customer_mrd.toShortDate());  
                    _$modal.find("#customer_part_no").val(o.customer_part_no);  
                    _$modal.find("#partDescription").val(o.harness_family);  
                    _$modal.find("#order_status").text(o.status_desc);  
                    _$modal.find("#oem_part_no").val(o.oem_part_no); 
                    _$modal.find("#model_year").val(o.model_year); 
                    _$modal.find("#po_date").val(o.po_issue_date.toShortDate()); 
                    _$modal.find("#bp").val(o.build_phase_abbrv); 
                    _$modal.find("#red_border_no").val(o.red_border_no); 
                    _$modal.find("#red_border_status").val(o.red_border_status); 
                    _$modal.find("#order_type").val(o.order_type);
                    _$modal.find("#rate_flows").val(o.rate_flow == "N" ? "No" : "Yes");
                    _$modal.find("#po_copy").val(o.po_copy);
                    _$modal.find("#number_order_parts").text(o.order_qty);
                    _$modal.find("#quantity_shipped").val(o.quantity_shipped); 
                    _$modal.find("#mld").text(o.mld); 
                    _$modal.find("#comment").text(o.comment); 
                    
                    //LEAR PLANT
                    _$modal.find("#lear_plant").val(o.lear_plant);
                    _$modal.find("#car_leader").val(o.car_leaders);
                    _$modal.find("#lear_warehouse").val(o.warehouse_contacts); 
                    
                    //customer info
                    _$modal.find("#customer").text(_d.customer);  
            }
        }); 
    };
    
    _pub.setOrderInfo = function(o,tbl){   
        var _$modal = tbl;  
            _$modal.find("#program_code").text(o.program_code); 
            _$modal.find("#oem_part_no").text(o.oem_part_no); 
            _$modal.find("#po_nos").text(o.po_no);
            _$modal.find("#rev_nos").text(o.rev_no); 
            _$modal.find("#engr_manager").text(o.engr_manager); 
            _$modal.find("#customer_part_no").val(o.customer_part_no);
            _$modal.find("#cust_Mrd").val(o.customer_mrd.toShortDate());   
            _$modal.find("#partDescription").val(o.harness_family);  
            _$modal.find("#order_status").val(o.status_desc);  
            _$modal.find("#oem_part_no").val(o.oem_part_no); 
            _$modal.find("#model_year").val(o.model_year); 
            _$modal.find("#red_border_no").val(o.red_border_no); 
            _$modal.find("#model_year").val(o.model_year); 
            _$modal.find("#po_date").val(o.po_issue_date.toShortDate()); 
            _$modal.find("#red_border_status").val(o.red_border_status); 
            _$modal.find("#order_type").val(o.order_type);
            _$modal.find("#rate_flows").val(o.rate_flow == "N" ? "No" : "Yes");
            _$modal.find("#po_copy").val(o.po_copy);
            _$modal.find("#qty_po").val(o.order_qty);
            _$modal.find("#quantity_shipped").val(o.quantity_shipped); 
            _$modal.find("#mld").text(o.mld); 
            _$modal.find("#comment").text(o.comment); 
   };
   
    _pub.clickedQty = function(o){ 
        console.log("gorderlistData clickedQty",o);
        $("#number_order_parts").on("click",function(){ 
            showQTY(o);
        });
    }; 
    
    _pub.showOrderInfo = function(){
        
        var _$form = $("#frm_modalInfo").find(".modal-body");  
            g$mdl = $("#modalInfo"); 
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });   
    };
    
    _pub.generatePSN = function(index){ 
        var _indx = index
            ,_$mdl = $("#modalGeneratePSN")
            ,_$grid = $("#gridGeneratePSN"); 
       
        if(isUD(index)) _indx = $("#" + gGrid).find("input[name='cb']:checked").val();
        if(isUD(_indx)) return;
        
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
        _$mdl.find("#comment").summernote({
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
        
        var _main = _pop1.getOrderListData();
        var _details = gMfgData[_indx]; 
        //Main Info
        _$mdl.find("#program_id").dataBind({
             sqlCode    : "D234" //dd_programs_by_user_sel
            ,text       : "program_code"
            ,value      : "oem_program_id"
            ,selectedValue : _main.program_id
        }).attr("selectedvalue", _main.program_id);  
        _$mdl.find("#site_id").dataBind({
             sqlCode    : "D264" //dd_order_sites_sel
            ,text       : "site_code"
            ,value      : "site_id"
            ,selectedValue : _main.site_id
        }).attr("selectedvalue", _main.site_id);  
        _$mdl.find("[name='is_mfg_to_cust']").change(function(){
            _$grid.find("[name='is_mfg_to_cust']").val(this.value);
        });
        
        //Detail's Info
        _$mdl.find("input[name*='date']").not("#send_update_to").datepicker({
             pickTime  : false
           , autoclose : true
           , todayHighlight: true
        }).on("hide", function(e) {
            if($(this).attr("id")==="date_shipped") _$grid.find("[name='mfg_actual_ship_date'],[name='shipment_date']").val(this.value);
        }); 
        console.log("_main",_main);
        console.log("_details",_details);
        markPSNMandatory();
        displayPSNDetails(_main,_details);
    };
    
    function getNavItem(o){  
        var _tabName = $(".nav-tab-coordinates").find(".nav-item.active").text();
        var _navGrid = "";
        var _setNavGrid = function(){
            if(_tabName == "Manufacturing Input"){ 
                sql_code ="O172";
                _params = {
                    order_part_id: o.order_part_id  
                };
                _navGrid = "gridManufacturing";  
                displayManufacturing(sql_code,_tabName,_navGrid,_params);
            }else if(_tabName == "Warehouse Input"){
                _navGrid = "gridWarehouse"; 
                _params = {
                    order_part_id: o.order_part_id  
                };
                 sql_code ="O172";
                displayManufacturing(sql_code,_tabName,_navGrid,_params);
            }else if(_tabName == "Pending Lear Promise Date"){
                _navGrid = "gridPLPD";
                 sql_code = "O235"; 
                 _params = {};
                displayManufacturing(sql_code,_tabName,_navGrid,_params);
            }
        };
       
        $("#modalUpcoming").find(".modal-body").find(".nav-tabs .nav-item").click(function(){ 
            _tabName = $(this).text();
            _setNavGrid();
        });
        _setNavGrid();
    }
    
    function displayAttachment(orderId,orderPartId){
        var _tbl = $("#tableAttachment");
        zsi.getData({
             sqlCode : "O223" //order_attachment_sel
            ,parameters: {order_id: orderId} 
            ,onComplete : function(d) {
                var _info = d.rows
                    ,_h = "";
                if(_info.length > 0){
                    $.each(_info, function(i, v){
                        var _fileName = (v.filename) ? v.filename.substr(v.filename.indexOf('.') +1) : "";
                        _h += gtw.new().attachement({ 
                                orderId : orderId, 
                                orderPartId : orderPartId,
                                attachmentId: v.attachment_id,
                                attachmentTitle: v.attachment_title,
                                fileName: _fileName,
                                status: "show", 
                                url: base_url + "file/viewImage?fileName=" +  v.filename + "&isThumbNail=n'>"
                               // title: "<img src='" + base_url + "file/viewImage?fileName=" +  v.filename + "&isThumbNail=n'>"
                            }).html();
                    });
                    _tbl.find("#divAttachment").html(_h);
                    $('[data-toggle="tooltip"]').tooltip();
                }else{
                    _tbl.find("#divAttachment").append(gtw.new().attachement({ orderId : orderId,  orderPartId : orderPartId, status: "hide" }).html());
                }
            }
        });
    }
    
    function displayComment(orderId){
        var _tbl = $("#tableComment");
        zsi.getData({
             sqlCode : "O205" //order_comment_sel
            ,parameters: {order_id: orderId} 
            ,onComplete : function(d) {
                var _info = d.rows
                    ,_h = "";
                if(_info.length > 0){
                    $.each(_info, function(i, v){
                        var regex = /(<[^>]+>|&nbsp)/ig;
                        var _fileName = (v.filename) ? v.filename.substr(v.filename.indexOf('.') +1) : ""; 
                            _h += gtw.new().comment({ 
                                commentId : v.comment_id, 
                                orderId : orderId,
                                comment: "- " + v.comment.replace(regex, " ") + " ("+(v.created_date) +")",
                                status: "show", 
                                url: base_url + "file/viewImage?fileName=" +  v.filename + "&isThumbNail=n'>"
                            }).html();
                    });
                    _tbl.find("#divComment").html(_h);
                    $('[data-toggle="tooltip"]').tooltip();
                }else{
                    _tbl.find("#divComment").append(gtw.new().comment({ commentId : comment_id,  orderId : orderId, status: "hide" }).html());
                }
            }
        });
    }    
    
    function isOrderQtyLimitExceed(limit,target){
        var _$grid = target.closest(".zGrid");
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
    
    function displayManufacturing(sqlCode,tabName,grid,params){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"}); 
        var  _navItem = "";
            
        
        gGrid = grid; 
        var _sqlCode = sqlCode //order_part_details_sel
            ,_displayRecords = function(){ 
                var  _ctr = -1
                
                //O235
                    ,_datarows = [
                        {text:cb        ,width:25              ,style : "text-align:left"
                           ,onRender  :  function(d){
                               _ctr++;
                                return  app.bs({name:"order_part_dtl_id"                ,type:"hidden"                  ,value: app.svn(d,"order_part_dtl_id")}) 
                                        + app.bs({name:"is_edited"                      ,type:"hidden"                  ,value: app.svn(d,"is_edited")}) 
                                        + app.bs({name:"order_part_id"                  ,type:"hidden"                  ,value: app.svn(d,"order_part_id")})
                                        + app.bs({name:"status_id"                      ,type:"hidden"                  ,value: app.svn(d,"status_id")})
                                        +(d !==null ? app.bs({name:"cb", type:"checkbox", value: _ctr}) : "");
                            }
                        }
                        ,{text:"Status"                                   ,width:120      ,style:"text-align:left" 
                            ,onRender: function(d){ 
                                return svn(d,"status_desc");
                                //return app.bs({type:"input"                     ,name:"status_desc"       ,value: svn(d,"status_desc")});
                            }
                        }
                        ,{text:"Customer Required Date "                        ,width:130      ,style:"text-align:left" 
                            ,onRender: function(d){ 
                                return app.bs({type:"input"                     ,name:"customer_required_date"       ,value: svn(d,"customer_required_date").toShortDate()});
                            }
                        } 
                        ,{text:"Customer Required Qty"                          ,name:"required_qty"            ,type:"input"       ,width:130     ,style:"text-align:left"} 
                        ,{text:"Lear Promise Date"                              ,type:"input"       ,width:130     ,style:"text-align:left"
                            ,onRender : function(d){
                                return app.bs({type:"input"                     ,name:"lear_promise_date"       ,value: svn(d,"lear_promise_date").toShortDate()});
                            }
                        } 
                        ,{text:"Lear Promised Qty"                              ,name:"promised_qty"            ,type:"input"       ,width:130     ,style:"text-align:left"} 
        
                        ,{text:"Plant Target Ship Date"                         ,name:"mfg_target_ship_date"    ,type:"input"       ,width:130     ,style:"text-align:left"
                            ,onRender: function(d){ 
                                return app.bs({type:"input"                     ,name:"mfg_target_ship_date"    ,value: svn(d,"mfg_target_ship_date").toShortDate()});
                            }
                        }
                        ,{text:"Plant Actual Ship Date"                         ,name:"mfg_actual_ship_date"      ,type:"input"       ,width:130     ,style:"text-align:left"
                            ,onRender: function(d){ 
                                return app.bs({type:"input"                     ,name:"mfg_actual_ship_date"   ,value: svn(d,"mfg_actual_ship_date").toShortDate()});
                            }
                        }
                        ,{text:"Shipment Qty"                                   ,type:"input"            ,name:"shipment_qty"                        ,width:130     ,style:"text-align:left"}
                        //,{text:"Box Size"                                       ,type:"input"            ,name:"box_size"                            ,width:160     ,style:"text-align:left"}
                        ,{text:"Number of Cartons"                              ,type:"input"            ,name:"no_cartons"                          ,width:120     ,style:"text-align:left"}  
                        ,{text:"Box Dimensions"                                 ,type:"input"            ,name:"box_dimension"                       ,width:120     ,style:"text-align:left"} 
                        ,{text:"Weight"                                         ,type:"input"            ,name:"weight_lb"                           ,width:120     ,style:"text-align:left"}
                        ,{text:"Serial Number"                                  ,type:"input"            ,name:"serial_no"                           ,width:120     ,style:"text-align:left"}
                        ,{text:"Delivery Carrier"                               ,type:"input"            ,name:"delivery_carrier"                    ,width:120     ,style:"text-align:left"}
                        ,{text:"Shipper Number"                                 ,type:"input"            ,name:"shipper_number"                      ,width:120     ,style:"text-align:left"}
                        ,{text:"Shipment Date"                                  ,type:"input"                                                        ,width:120     ,style:"text-align:left"
                            ,onRender: function(d){ 
                                return app.bs({type:"input"                              ,name:"shipment_date"                       ,value: svn(d,"shipment_date").toShortDate()});
                            }
                        }
                        ,{text:"Shipper By"                     ,type:"input"            ,name:"shipment_by"                         ,width:160     ,style:"text-align:left"}
                        ,{text:"Special Instruction"            ,type:"input"            ,name:"special_instruction"                 ,width:160     ,style:"text-align:left"}
                        ,{text:"PSN"                                                                                                 ,width:120     ,style :"text-align:center"
                            ,onRender: function(d){ 
                                var _link = '<i class="fas text-white fa-sign-out-alt cursor-pointer" title="Generate PSN" style="border-radius:5px;width:70%;height:100%;padding-top:4px;background-image: linear-gradient(to bottom, #ff0021 0px, #CA1F14 100%);" onclick="pop2.generatePSN('+ _ctr +')"</i> Generate PSN';
                                if(d !== null){
                                    if(d.no_cartons==="" || d.box_dimension==="" || d.weight_lb===""){
                                        _link =  "";
                                    }
                                    if(d.psn_id!=="") _link = svn(d,"psn_no");
                                }
                                else{
                                    _link =  "";
                                }
                                return _link;
                            } 
                        }
                    ];
                    
                    if(tabName === "Pending Lear Promise Date"){
                          _datarows = [
                            {text:cb        ,width:25              ,style : "text-align:left"
                               ,onRender  :  function(d){
                                   _ctr++;
                                    return  app.bs({name:"order_part_dtl_id"                ,type:"hidden"                  ,value: app.svn(d,"order_part_dtl_id")}) 
                                            + app.bs({name:"is_edited"                      ,type:"hidden"                  ,value: app.svn(d,"is_edited")}) 
                                            + app.bs({name:"order_part_id"                  ,type:"hidden"                  ,value: app.svn(d,"order_part_id")})
                                            + app.bs({name:"status_id"                      ,type:"hidden"                  ,value: app.svn(d,"status_id")})
                                            +(d !==null ? app.bs({name:"cb", type:"checkbox", value: _ctr}) : "");
                                }
                            }
                            ,{text:"Status"                                   ,width:120      ,style:"text-align:left" 
                                ,onRender: function(d){ 
                                    return svn(d,"status_desc");
                                    //return app.bs({type:"input"                     ,name:"status_desc"       ,value: svn(d,"status_desc")});
                                }
                            }
                            ,{text:"Customer Required Date "                        ,width:130      ,style:"text-align:left" 
                                ,onRender: function(d){ 
                                    return app.bs({type:"input"                     ,name:"customer_required_date"       ,value: svn(d,"customer_required_date").toShortDate()});
                                }
                            } 
                            ,{text:"Customer Required Qty"                          ,name:"required_qty"            ,type:"input"       ,width:130     ,style:"text-align:left"} 
                            ,{text:"Lear Promise Date"                              ,type:"input"       ,width:130     ,style:"text-align:left"
                                ,onRender : function(d){
                                    return app.bs({type:"input"                     ,name:"lear_promise_date"       ,value: svn(d,"lear_promise_date").toShortDate()});
                                }
                            } 
                            ,{text:"Lear Promised Qty"                              ,name:"promised_qty"            ,type:"input"       ,width:130     ,style:"text-align:left"} 
            
                            ,{text:"Plant Target Ship Date"                         ,name:"mfg_target_ship_date"    ,type:"input"       ,width:130     ,style:"text-align:left"
                                ,onRender: function(d){ 
                                    return app.bs({type:"input"                     ,name:"mfg_target_ship_date"    ,value: svn(d,"mfg_target_ship_date").toShortDate()});
                                }
                            }
                            ,{text:"Plant Actual Ship Date"                         ,name:"mfg_actual_ship_date"      ,type:"input"       ,width:130     ,style:"text-align:left"
                                ,onRender: function(d){ 
                                    return app.bs({type:"input"                     ,name:"mfg_actual_ship_date"   ,value: svn(d,"mfg_actual_ship_date").toShortDate()});
                                }
                            }
                            ,{text:"Shipment Qty"                                   ,type:"input"            ,name:"shipment_qty"                        ,width:130     ,style:"text-align:left"}
                            //,{text:"Box Size"                                       ,type:"input"            ,name:"box_size"                            ,width:160     ,style:"text-align:left"}
                            ,{text:"Number of Cartons"                              ,type:"input"            ,name:"no_cartons"                          ,width:120     ,style:"text-align:left"}  
                            ,{text:"Box Dimensions"                                 ,type:"input"            ,name:"box_dimension"                       ,width:120     ,style:"text-align:left"} 
                            ,{text:"Weight"                                         ,type:"input"            ,name:"weight_lb"                           ,width:120     ,style:"text-align:left"}
                            ,{text:"Serial Number"                                  ,type:"input"            ,name:"serial_no"                           ,width:120     ,style:"text-align:left"}
                            ,{text:"Delivery Carrier"                               ,type:"input"            ,name:"delivery_carrier"                    ,width:120     ,style:"text-align:left"}
                            ,{text:"Shipper Number"                                 ,type:"input"            ,name:"shipper_number"                      ,width:120     ,style:"text-align:left"}
                            ,{text:"Shipment Date"                                  ,type:"input"                                                        ,width:120     ,style:"text-align:left"
                                ,onRender: function(d){ 
                                    return app.bs({type:"input"                              ,name:"shipment_date"                       ,value: svn(d,"shipment_date").toShortDate()});
                                }
                            }
                            ,{text:"Shipper By"                     ,type:"input"            ,name:"shipment_by"                         ,width:160     ,style:"text-align:left"}
                            ,{text:"Special Instruction"            ,type:"input"            ,name:"special_instruction"                 ,width:160     ,style:"text-align:left"}
                            ,{text:"PSN"                                                                                                 ,width:120     ,style :"text-align:center"
                                ,onRender: function(d){ 
                                    var _link = '<i class="fas text-white fa-sign-out-alt cursor-pointer" title="Generate PSN" style="border-radius:5px;width:70%;height:100%;padding-top:4px;background-image: linear-gradient(to bottom, #ff0021 0px, #CA1F14 100%);" onclick="pop2.generatePSN('+ _ctr +')"</i> Generate PSN';
                                    if(d !== null){
                                        if(d.no_cartons==="" || d.box_dimension==="" || d.weight_lb===""){
                                            _link =  "";
                                        }
                                        if(d.psn_id!=="") _link = svn(d,"psn_no");
                                    }
                                    else{
                                        _link =  "";
                                    }
                                    return _link;
                                } 
                            }
                        ];  
                    }
                    console.log("tabName",tabName);
                $("#" + grid).dataBind({
                     sqlCode            : _sqlCode 
                     ,parameters        : params  
                     ,dataRows          : _datarows 
                     ,blankRowsLimit    : 5
                    ,onComplete: function(_o){  
                        gMfgData = _o.data.rows;
                        var _zRow = this.find(".zRow")
                            ,_setInputAttr = function(row, name){
                                var _$zRow = row;
                                var  _$custDate = _$zRow.find("input[name='customer_required_date']")
                                    ,_$custQty = _$zRow.find("input[name='required_qty']")
                                    ,_$learDate = _$zRow.find("input[name='lear_promise_date']")
                                    ,_$learQty = _$zRow.find("input[name='promised_qty']")
                                    ,_$plantTarDate = _$zRow.find("input[name='mfg_target_ship_date']")
                                    ,_$plantActDate = _$zRow.find("input[name='mfg_actual_ship_date']")
                                    ,_$shipQty = _$zRow.find("input[name='shipment_qty']")
                                    ,_$noCartoons = _$zRow.find("input[name='no_cartons']")
                                    ,_$boxDim = _$zRow.find("input[name='box_dimension']")
                                    ,_$weightLB = _$zRow.find("input[name='weight_lb']")
                                    ,_$serialNo = _$zRow.find("input[name='serial_no']")
                                    ,_$deliveryCar = _$zRow.find("input[name='delivery_carrier']")
                                    ,_$shipNumber = _$zRow.find("input[name='shipper_number']")
                                    ,_$shipDate = _$zRow.find("input[name='shipment_date']")
                                    ,_$shipBy = _$zRow.find("input[name='shipment_by']")
                                    ,_$specialIns = _$zRow.find("input[name='special_instruction']");
                                 
                                if(isUD(name)){
                                    _$custDate.attr('disabled',true); 
                                    _$custQty.attr('disabled',true);  
                                    _$learDate.attr('disabled',true);  
                                    _$learQty.attr('disabled',true);  
                                    _$plantTarDate.attr('disabled',true); 
                                    _$plantActDate.attr('disabled',true); 
                                    _$shipQty.attr('disabled',true);  
                                    _$noCartoons.attr('disabled',true); 
                                    _$boxDim.attr('disabled',true);  
                                    _$weightLB.attr('disabled',true);  
                                    _$serialNo.attr('disabled',true);  
                                    _$deliveryCar.attr('disabled',true);  
                                    _$shipNumber.attr('disabled',true); 
                                    _$shipDate.attr('disabled',true); 
                                    _$shipBy.attr('disabled',true);  
                                    //_$specialIns.attr('disabled',true); 
                                    
                                    if(grid === "gridPLPD"){ //Pending Lear Promise Date
                                        _$learDate.attr('disabled',false);
                                    }
                                    if(grid === "gridManufacturing"){ //Manufacturing
                                        _$plantTarDate.attr('disabled',false); 
                                        //_$shipQty.attr('disabled',false); 
                                    }
                                    if(grid === "gridWarehouse"){ //Warehouse
                                        _$serialNo.attr('disabled',false);  
                                        _$deliveryCar.attr('disabled',false);  
                                        _$shipNumber.attr('disabled',false); 
                                        _$shipDate.attr('disabled',false); 
                                    }
                                    
                                    if(app.userInfo.role_id===5){ //Program Coordinator
                                        _$custDate.attr('disabled',false);
                                        _$custQty.attr('disabled',false);
                                        _$specialIns.attr('disabled',false);
                                    }

                                    // _zRow.find("input[name='promised_qty']").attr('readonly',true);
                                    // _zRow.find("input[name='shipment_qty']").attr('readonly',true);
                                    // _zRow.find("input[name='lear_promise_date']").attr('disabled',true);
                                    // _zRow.find("input[name='mfg_actual_ship_date']").attr('disabled',true);
                                    // _zRow.find("input[name='shipment_qty']").attr('readonly',true);
                                    // _zRow.find("input[name='box_size']").attr('readonly',true);
                                    // _zRow.find("input[name='no_cartons']").attr('readonly',true);
                                    // _zRow.find("input[name='box_dimension']").attr('readonly',true);
                                    // _zRow.find("input[name='weight_lb']").attr('readonly',true);
                                    // _zRow.find("input[name='serial_no']").attr('readonly',true);
                                    // _zRow.find("input[name='delivery_carrier']").attr('readonly',true);
                                    // _zRow.find("input[name='special_instruction']").attr('readonly',true);
                                }
                                else{
                                    if(name == "mfg_target_ship_date")
                                        (_$plantTarDate.val() !== "")  ? _$shipQty.removeAttr('disabled') : _$shipQty.val("").attr('disabled',true) ;
                                    else if(name == "shipment_qty")
                                        (_$shipQty.val() !== "")  ? _$learDate.removeAttr('disabled') : _$learDate.val("").attr('disabled',true) ;
                                    else if(name == "lear_promise_date")
                                        (_$learDate.val() !== "")  ? _$learQty.removeAttr('disabled') : _$learQty.val("").attr('disabled',true) ;
                                    else if(name == "promised_qty")
                                        (_$learQty.val() !== "")  ? _$plantActDate.removeAttr('disabled') : _$plantActDate.val("").attr('disabled',true) ;
                                    else if(name == "mfg_actual_ship_date")
                                        (_$plantActDate.val() !== "")  ? _no_cartons.removeAttr('disabled') : _no_cartons.val("").attr('disabled',true) ;  
                                    else if(name == "no_cartons")
                                        (_no_cartons.val() !== "")  ? _box_dimension.removeAttr('disabled') : _box_dimension.val("").attr('disabled',true) ;
                                    else if(name == "box_dimension")
                                        (_box_dimension.val() !== "")  ? _weight_lb.removeAttr('disabled') : _weight_lb.val("").attr('disabled',true) ;
                                    else if(name == "weight_lb")
                                        (_weight_lb.val() !== "")  ? _serial_no.removeAttr('disabled') : _serial_no.val("").attr('disabled',true) ;
                                    else if(name == "serial_no")
                                        (_serial_no.val() !== "")  ? _delivery_carrier.removeAttr('disabled') : _delivery_carrier.val("").attr('disabled',true) ;
                                    else if(name == "delivery_carrier")
                                        (_delivery_carrier.val() !== "")  ? _shipperNo.removeAttr('disabled') : _shipperNo.val("").attr('disabled',true) ;
                                    else if(name == "shipper_number")
                                        (_shipperNo.val() !== "")  ? _shipmentDate.removeAttr('disabled') : _shipmentDate.val("").attr('disabled',true) ;
                                    else if(name == "shipment_date")
                                        (_shipmentDate.val() !== "")  ? _shipmentBy.removeAttr('disabled') : _shipmentBy.val("").attr('disabled',true) ;
                                }
                            };
                            
                        _zRow.find("input[name$='date']").datepicker({
                             pickTime  : false
                           , autoclose : true
                           , todayHighlight: true
                        });
                        
                        _setInputAttr(_zRow);
                        _zRow.find("input[type='text']").on("change keyup", function(){
                            _setInputAttr($(this).closest(".zRow"), $(this).attr("name"));
                            // var _inputName = $(this)[0].name;
                            // validationManufacturing($(this),_inputName);  
                        });
                        
                        this.find("[name='cbFilter2']").setCheckEvent("#"+ grid +" input[name='cb']");
                        this.find("input[name$='qty']").keyup(function(){
                            var _$this = $(this)
                                ,_$zRow = _$this.closest(".zRow");
                           
                            if (isOrderQtyLimitExceed(gOrderQty, _$this) ){ 
                                if(_$this[0].name === "shipment_qty") {
                                    alert( "Shipment quantity must be equal to "+ gOrderQty + "." );
                                    _$this.val("");
                                } else{
                                    alert( "Lear promised quantity must be equal to "+ gOrderQty + "." );
                                    _$this.val("");
                                }
                            }
                        });
                    }
                });
            };  
            _displayRecords();
        } 

    function displayPSNDetails(main, details){ 
        $("#gridGeneratePSN").dataBind({ 
             rows               : [details]
            ,width              : $(window).width()  
            ,height             : 200
            ,blankRowsLimit     : 0
            ,dataRows           : [
                {text:"Part Number"         ,width:130      ,style:"text-align:left" 
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden", name:"order_part_dtl_id"       ,value: svn(d,"order_part_dtl_id")})
                            + app.bs({type:"hidden", name:"order_part_id"       ,value: svn(d,"order_part_id")})
                            + app.bs({type:"hidden", name:"is_mfg_to_cust"})
                            + app.bs({type:"hidden", name:"mfg_actual_ship_date"})
                            + svn(d,"oem_part_no");
                    }
                } 
                ,{text:"Quantity"          ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"shipment_qty");
                    }
                }
                ,{text:"P.O Number"         ,width:130     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"po_no");
                    }
                }
                ,{text:"No. of Cartons"                   ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input",  name:"no_cartons"       ,value: svn(d,"no_cartons")});
                    }
                }
                ,{text:"Box Dimension(in)"                       ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input", name:"box_dimension"       ,value: svn(d,"box_dimension")});
                    }
                }
                ,{text:"Weight LB"                    ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({name:"weight_lb"       ,value: svn(d,"weight_lb")});
                    }
                }  
                ,{text:"Serial Number"         ,width:130     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"serial_no"   ,value: svn(d,"serial_no")});
                    }
                }
                ,{text:"Delivery Carrier"         ,width:160     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"delivery_carrier" ,value: svn(d,"delivery_carrier")});
                    }
                }
                ,{text:"Shipper No."         ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"shipper_number"   ,value: svn(d,"shipper_number")});
                    }
                }
                ,{text:"Customer MRD"                  ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden", name:"shipment_date"})
                            + app.bs({type:"hidden", name:"shipment_by"})
                            + app.bs({type:"hidden", name:"psn_id"})
                            + svn(d,"customer_required_date").toShortDate();
                    }
                }
            ]
            ,onComplete: function(){ 
                this.find("input[name$='date']").datepicker({
                     pickTime  : false
                   , autoclose : true
                   , todayHighlight: true
                });
                markPSNDetailMandatory();
                //this.find("input[type='text']").attr("readonly", true);
            }
        }); 
    }
    
    function showQTY(o) {
        var _o = o;
        console.log("showQTY",_o);
        var _$body = $("#frm_modalQTY").find(".modal-body").find("#nav-tab");   
        g$mdl = $("#modalQTY");
        g$mdl.find(".modal-title").html("Order Number » "+_o.order_qty) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
        g$mdl.find("#orderQty").val(_o.order_qty);
        g$mdl.find("#oem_part_number").val(_o.oem_part_no); 
        g$mdl.find("#status").val(_o.status_desc); 
        g$mdl.find("#model_year").val(_o.model_year);
        g$mdl.find("#prefix").val(_o.prefix);
        g$mdl.find("#base").val(_o.base);
        g$mdl.find("#suffix").val(_o.suffix);
        g$mdl.find("#customer_part_no").val(_o.customer_part_no);
        g$mdl.find("#description").val(_o.description);
        g$mdl.find("#frm_comments").val(_o.comments);
        
        displatQtyOnPO(o);
    } 
        
    function displatQtyOnPO(o){   
        $("#gridQty").dataBind({ 
             width      : $(".zContainer").width() 
    	    ,height     : $(window).height() - 480
            ,dataRows   :[
        		 {text: "Customer Requested Date"      ,type:"input"           , width: 200        , style: "text-align:left;" 
        		     ,onRender: function(d){
        		         return bs({name: "requested_date", value: o.customer_mrd.toShortDate()});
        		     }
        		 }
        		 ,{text: "Quantity Requested"                     ,type:"input"                                  , width: 200        , style: "text-align:left;" 
        		     ,onRender: function(d){
        		         return bs({name: "qty_requested", value: o.order_qty});
        		     }
        		 }
        		 ,{text: "Lear Promise Date"            ,type:"input"            , width: 200        , style: "text-align:left;" 
        		     ,onRender: function(d){
        		         return bs({name: "promise_date", value: o.customer_mrd.toShortDate()});
        		     }
        		 }
        		 ,{text: "Promise Quantity"                     ,type:"input"       , width: 200        , style: "text-align:left;" 
        		     ,onRender: function(d){
        		         return bs({name: "qty_promise", value: o.order_qty});
        		     }
        		 }
    	    ]
    	    ,onComplete : function(d){
    	         
    	    }
        });        
    } 
    
    function validationManufacturing(target,inputName){ 
        var _zRow = target.closest(".zRow"); 
        var _mfgTarget = _zRow.find("input[name='mfg_target_ship_date']");
        var _shipment_qty = _zRow.find("input[name='shipment_qty']");
        var _promised_qty = _zRow.find("input[name='promised_qty']");
        var _learPromiseDdate = _zRow.find("input[name='lear_promise_date']");
        var _mfg_actual_ship_date= _zRow.find("input[name='mfg_actual_ship_date']");  
        var _no_cartons = _zRow.find("input[name='no_cartons']");
        var _box_dimension = _zRow.find("input[name='box_dimension']");
        var _weight_lb = _zRow.find("input[name='weight_lb']");
        var _serial_no = _zRow.find("input[name='serial_no']");
        var _delivery_carrier = _zRow.find("input[name='delivery_carrier']");
        var _special_instruction = _zRow.find("input[name='special_instruction']");
        var _shipperNo =  _zRow.find("input[name='shipper_number']");
        var _shipmentDate =  _zRow.find("input[name='shipment_date']");
        var _shipmentBy =   _zRow.find("input[name='shipment_by']");
        
        //if(app.userInfo.role_id === 5) target.closest(".zRows input[name='special_instruction']").removeAttr('readonly',true);
             
        if(inputName == "mfg_target_ship_date")
            (_mfgTarget.val() !== "")  ? _shipment_qty.removeAttr('readonly') : _shipment_qty.val("").attr('readonly',true) ;
        else if(inputName == "shipment_qty")
            (_shipment_qty.val() !== "")  ? _learPromiseDdate.removeAttr('disabled') : _learPromiseDdate.val("").attr('disabled',true) ;
        
        
        else if(inputName == "lear_promise_date")
            (_learPromiseDdate.val() !== "")  ? _promised_qty.removeAttr('readonly') : _promised_qty.val("").attr('readonly',true) ;
        else if(inputName == "promised_qty")
            (_promised_qty.val() !== "")  ? _mfg_actual_ship_date.removeAttr('disabled') : _mfg_actual_ship_date.val("").attr('disabled',true) ;
        else if(inputName == "mfg_actual_ship_date")
            (_mfg_actual_ship_date.val() !== "")  ? _no_cartons.removeAttr('readonly') : _no_cartons.val("").attr('readonly',true) ;  
        else if(inputName == "no_cartons")
            (_no_cartons.val() !== "")  ? _box_dimension.removeAttr('readonly') : _box_dimension.val("").attr('readonly',true) ;
        else if(inputName == "box_dimension")
            (_box_dimension.val() !== "")  ? _weight_lb.removeAttr('readonly') : _weight_lb.val("").attr('readonly',true) ;
        else if(inputName == "weight_lb")
            (_weight_lb.val() !== "")  ? _serial_no.removeAttr('readonly') : _serial_no.val("").attr('readonly',true) ;
        else if(inputName == "serial_no")
            (_serial_no.val() !== "")  ? _delivery_carrier.removeAttr('readonly') : _delivery_carrier.val("").attr('readonly',true) ;
        else if(inputName == "delivery_carrier")
            (_delivery_carrier.val() !== "")  ? _shipperNo.removeAttr('readonly') : _shipperNo.val("").attr('readonly',true) ;
        else if(inputName == "shipper_number")
            (_shipperNo.val() !== "")  ? _shipmentDate.removeAttr('disabled') : _shipmentDate.val("").attr('disabled',true) ;
        else if(inputName == "shipment_date")
            (_shipmentDate.val() !== "")  ? _shipmentBy.removeAttr('readonly') : _shipmentBy.val("").attr('readonly',true) ;
        
    }
    
    function markPSNMandatory(){
        $("#frm_modalGeneratePSN").markMandatory({       
          "groupNames":[
                {"names" : ["program_id","date_shipped","site_id"]}    
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Program","Date Shipped","Site"]}
          ]
        });    
    } 
    function markPSNDetailMandatory(){
        $("#gridGeneratePSN").markMandatory({       
          "groupNames":[
                {
                     "names" : ["site_code","street_address","city","state","zip_code","country"]
                    ,"type":"M"
                }    
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Site Code","Street Address","City","State","ZIP Cod","Country"]}
          ]
        });    
    } 

    _pub.submitManufacturing = function(){
        var _$grid =  $("#gridManufacturing");
        var _zRow  = $("#gridManufacturing").find('.zRow'); 
        _zRow.find("input:disabled").removeAttr('disabled');
        _$grid.jsonSubmit({
              procedure: "order_part_details_upd"
             ,optionalItems: ["is_active"] 
             ,notIncludes: ["status_desc"]
             ,onComplete: function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                 $("#modalButton").trigger("click");
                 //$("#modalMoreInfo").find(".nav-item.nav-link.active").trigger("click"); 
               
             }
         });
    };
    
    _pub.submitPSN = function(){
        var _$frm = $("#frm_modalGeneratePSN");
        var _$dtl = $("#gridGeneratePSN");
        
        if( _$frm.checkMandatory()!==true) return false;
        if( _$dtl.checkMandatory()!==true) return false;
        
        _$frm.jsonSubmit({
             procedure: "psn_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess===true){
                    var _psnId = data.returnValue;
                    _$frm.find("[name='psn_id']").val(_psnId);
                    _$dtl.find("[name='psn_id']").val(_psnId);
                    _$dtl.jsonSubmit({
                         procedure: "order_part_details_psn_upd"
                        ,notIncludes: ["part_number","po_no","cutomer_mrd"]
                        ,onComplete: function (data) {
                            if(data.isSuccess===true){
                                zsi.form.showAlert("alert"); 
                                //displayPSNDetails(_psnId);
                            }
                        }
                    });
                    
                }
            }        
        });
    };
  
    $("#editOrder").click(function(){
        var _$tblNav = $("#nav-o");
        _$tblNav.find(".inputText").css("border", "1px solid").removeAttr("readonly");
        _$tblNav.find("input[name='po_date']").removeAttr("disabled");
        _$tblNav.find("input[name='customer_mrd']").removeAttr("disabled");
        _$tblNav.find("input[name='promise_date']").removeAttr("disabled");
    });
    
    $("#editCustomer").click(function(){
        var _$tblNav = $("#nav-c");
        _$tblNav.find(".inputText").css("border", "1px solid").removeAttr("readonly"); 
    }); 
    
    $("#btnEditQty").click(function(){ 
        $("#frm_modalQTY").find(".inputText").css("border", "1px solid black").removeAttr("readonly");
    }); 
    
    $("#deleteManufacturing").click(function () {  
        var _$grid = $("#modalUpcoming");
        zsi.form.deleteData({
            code       : "ref-00035"
            ,onComplete : function(data){
                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayManufacturing();
            }
        });
    });
    
    $("#submitWarehouse").click(function () {  
        var _$grid  = $("#gridWarehouse"); 
        _$grid.find("input:disabled").removeAttr('disabled');
        _$grid.jsonSubmit({
             procedure: "order_part_details_upd"
            ,optionalItems: ["is_active"]
            ,notIncludes: ["status_desc"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                $("#modalButton").trigger("click");
                $("#modalMoreInfo").find(".nav-item.nav-link.active").trigger("click");
            }
        });
    });
    
   $("#deleteWarehouse").click(function () {  
        var _$grid = $("#modalUpcoming");
        zsi.form.deleteData({
            code       : "ref-00035"
            ,onComplete : function(data){
                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayWarehouse();
            }
        });
    });
    
    $("#submitPLPD").click(function () {  
        var _$grid  = $("#gridPLPD"); 
        _$grid.find("input:disabled").removeAttr('disabled');
        _$grid.jsonSubmit({
             procedure: "order_part_details_upd"
            ,optionalItems: ["is_active"]
            ,notIncludes: ["status_desc"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                $("#modalButton").trigger("click");
                $("#modalMoreInfo").find(".nav-item.nav-link.active").trigger("click");
            }
        });
    });
    
    return _pub;
 })();                                                   