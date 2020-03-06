var proofDelivery = (function(){
    var  _pub            = {}

    ;
    
    zsi.ready = function(){
        $(".page-title").html("Proof of Deliveries");
        displayNewRecords();
        displayPostedRecords();
        searchPO();
    
    };
    
    function displayNewRecords(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var lineItem = 0;
        $("#gridNew").dataBind({
    	     sqlCode        : "P286" //proof_of_delivery_unposted_sel
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(window).height() - 280
            ,blankRowsLimit : 5
            ,dataRows       : [	 
                { text : cb , width : 25   , style : "text-align:left;" 
                    ,onRender  :  function(d){ 
                        return app.bs({name:"proof_delivery_id"                 ,type:"hidden"      ,value: app.svn(d,"proof_delivery_id")})
                             + app.bs({name:"is_edited"                         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                             + app.bs({name:"is_posted"                         ,type:"hidden"      ,value: app.svn(d,"is_posted")})
                             + app.bs({name:"order_part_id"                     ,type:"hidden"      ,value: app.svn(d,"order_part_id")})
                             + (d !==null ? app.bs({name:"cb"                   ,type:"checkbox"}) : "" ); }
                }
                ,{text : "Line Item"            ,width : 65       , style : "text-align:center;"
                    ,onRender: function(d){
                        lineItem++;
                        return lineItem;
                    }
                }
                ,{text: "Order No."             ,width : 125   ,style : "text-align:left"
                    ,onRender: function(d){
                        return app.bs({name: "search_order_part_id"             ,type:"input"    ,value:app.svn(d,"order_part_detail_id")})
                             + app.bs({name: "order_part_detail_id"             ,type:"hidden"   ,value:app.svn(d,"order_part_detail_id")});
                     }
                }
                ,{text: "Order Qty."            ,name:"order_qty"               ,type:"input"       ,width : 85    ,style : "text-align:center"}
                ,{text: "Total Dlvd. Qty."      ,name:"delivered_qty"           ,type:"input"       ,width : 85    ,style : "text-align:center"}
                ,{text: "Delivered Qty."        ,name:"qty"                     ,type:"input"       ,width : 85    ,style : "text-align:center"}
                ,{text: "Receiving Location"    ,name:"site_id"                 ,type:"select"      ,width : 160   ,style : "text-align:left"}
                ,{text: "POD Attached"          ,name:"pod_attached"            ,type:"yesno"       ,width : 85    ,style : "text-align:center"   ,defaultValue: "Y"}
                ,{text: "Pakcing Slip Attached" ,name:"packing_slip_attached"   ,type:"yesno"       ,width : 120   ,style : "text-align:center"   ,defaultValue: "Y"}
            ]
    	    ,onComplete: function(o){
    	        var _this = this;
    	        var _zRow = this.find(".zRow");
                _zRow.find("input[name='qty']").keyup(delay(function(e) {
                    var _$zRow    = $(this).closest(".zRow");
                    var _orderQty = _$zRow.find("[name='order_qty']").val();
                    var _dlvdQty  = _$zRow.find("[name='delivered_qty']").val();
                    var _total = _orderQty - _dlvdQty;
                    if( $(this).val() > _total) {
                        alert("Please enter qty equal or less than " + _total+".");
                        $(this).val("");
                    }
                },300));
                _this.find("input[name='cbFilter1']").setCheckEvent("#gridNew input[name='cb']");
                _this.find("[name='order_qty'],[name='delivered_qty']").attr("readonly",true);
                new zsi.search({
                     tableCode: "ref-00042"
                    ,colNames : ["po","order_part_id","order_qty","delivered_qty","site_id","customer_id"]
                    ,displayNames : ["Order No."]  
                    ,searchColumn :"po"
                    ,input:"input[name='search_order_part_id']"
                    ,url : app.execURL + "searchData "
                    ,onSelectedItem: function(currentObject,data,i){ 
                        if(isUD(data)) return;
                        currentObject.value = data.search_order_part_id;
                        var _siteId         = data.site_id;
                        var _custId         = data.customer_id;
                        var _orderPartDtlId = data.order_part_dtl_id;
                        var _orderPartId    = data.order_part_id;
                        var _orderQty       = data.order_qty;
                        var _ttlDelivered   = data.delivered_qty;
                        var _zRow           = $(currentObject).closest(".zRow");
                        $(currentObject).val(data.po);
                        _zRow.find("[name='order_part_detail_id']").val(_orderPartDtlId);
                        _zRow.find("[name='order_part_id']").val(_orderPartId);
                        _zRow.find("[name='order_qty']").val(_orderQty);
                        _zRow.find("[name='delivered_qty']").val(_ttlDelivered);
                        _zRow.find("[name='site_id']").unbind().dataBind({
                             sqlCode        : "C146" //customer_sites_sel
                            ,text           : "site_code"
                            ,value          : "site_id"
                            ,seletedValue   : _siteId
                            ,onComplete     : function(){
                                $(this).val(data.site_id)                            ;
                            }
                        });
                    }
                });           
       
                _zRow.find("[name='site_id']").unbind().dataBind({
                     sqlCode        : "C146" //customer_sites_sel
                    ,text           : "site_code"
                    ,value          : "site_id"
                });
       
            }  
        });    
    }
    
    function displayPostedRecords(poNo){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var lineItem = 0;
        $("#gridPosted").dataBind({
    	     sqlCode        : "P285" //proof_of_delivery_posted_sel
     	    ,parameters     : {po : (! isUD(poNo) ? poNo : "")}
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(window).height() - 280
            //,blankRowsLimit : 5
            ,dataRows       : [	 
                {text : "Line Item"            ,width : 65       , style : "text-align:center;"
                    ,onRender: function(d){
                        lineItem++;
                        return lineItem;
                    }
                }
                ,{text: "Order No."             ,width : 85    ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"order_part_detail_id")}
                }
                ,{text: "Order Qty."            ,width : 85    ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"order_qty")}
                }
                ,{text: "Total Dlvd. Qty."      ,width : 85    ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"delivered_qty")}
                }
                ,{text: "Delivered Qty."        ,width : 85    ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"qty")}
                }
                ,{text: "Receiving Location"    ,width : 160   ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"site_id")}
                }
                ,{text: "POD Attached"          ,width : 85    ,style : "text-align:center" 
                    ,onRender : function(d){ return app.svn(d,"pod_attached")}
                }
                ,{text: "Pakcing Slip Attached" ,width : 120   ,style : "text-align:center"
                    ,onRender : function(d){ return app.svn(d,"packing_slip_attached")}
                }
            ]
            ,onComplete: function(o){
                this.data("poNo",poNo);
            }
        });
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

    function searchPO(){
        new zsi.search({
             tableCode: "ref-00042"
            ,colNames : ["po"]
            ,displayNames : ["Order No."]  
            ,searchColumn :"po"
            ,input:"input[name='search_po_no']"
            ,url : app.execURL + "searchData "
            ,onSelectedItem: function(currentObject,data,i){ 
                if(isUD(data)) return;
                currentObject.value = data.po;
            }
        });                   
    }
    
    $("#btnSearch").unbind().click(function(){
        var _po = $("#search_po_no").val().replace(".", ",");
        displayPostedRecords(_po);
    });

    $("#btnSave").unbind().click(function () {
        $("#gridNew").jsonSubmit({
             procedure: "proof_delivery_upd"
            ,notIncludes: ["search_order_part_id"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
               displayNewRecords();
          }
        });
    });

    $("#btnDelete").unbind().click(function(){
        zsi.form.deleteData({
             code       : "ref-00043"
            ,onComplete : function(data){
                displayNewRecords();
            }
        });                  
    });
    
    $("#btnPost").unbind().click(function(){
        var _$grid = $("#gridNew");
        var _zRow = _$grid.find(".zRow");
        var _isPosted = false;
        _zRow.each(function(){
            var _this = $(this);
            if(_this.find("[name='proof_delivery_id']").val() !== "" ) 
            _this.find("[name='is_edited']").val("Y");
            _this.find("[name='is_posted']").val("Y");
            _isPosted = true;
        });

        console.log("_isPosted",_isPosted);
    
        if(_isPosted === true){
            _$grid.jsonSubmit({
                 procedure: "proof_delivery_upd"
                ,notIncludes: ["search_order_part_id"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");  
                   displayNewRecords();
                   displayPostedRecords();
              }
            });

        }

    });

    return _pub;
})();                                             