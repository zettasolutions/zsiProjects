var ol=(function(){

        var      bs             = zsi.bs.ctrl
                ,svn            = zsi.setValIfNull 
                ,_pub           = {}
                ,$olg          = {
                    parent :   $("#orderListGroup")
                    ,get oemId() {
                        return this.parent.find("#oem_id");
                    },
                    set oemId (value) {
                       this.parent.find("#oem_id").attr("selectedvalue",value).val(value);
                    }
                    ,get progId() {
                        return this.parent.find("#program_id");
                    },
                    set progId (value) {
                       this.parent.find("#program_id").attr("selectedvalue",value).val(value);
                    }
                    ,get bpId() {
                        return this.parent.find("#build_phase_id");
                    },
                    set bpId (value) {
                       this.parent.find("#build_phase_id").attr("selectedvalue",value).val(value);
                    }
                    ,get custId() {
                        return this.parent.find("#customer_id");
                    },
                    set custId (value) {
                       this.parent.find("#customer_id").attr("selectedvalue",value).val(value);
                    }
                    ,get ordStatId() {
                        return this.parent.find("#order_status_id");
                    },
                    set ordStatId (value) {
                       this.parent.find("#order_status_id").attr("selectedvalue",value).val(value);
                    }
                    ,get poNO() {
                        return this.parent.find("#poNO");
                    },
                    set poNO (value) {
                       this.parent.find("#poNO").val(value);
                    }                    

                }
        ;
        
        zsi.ready = function(){ 
            $(".page-title").html("Order List");
             $(".panel-content").find("#gridOrderList").hide(); 
            var _onOEMCompleteChangeEvent = function(){
                $olg.custId.dataBind({
                     parameters : {oem_id : this.val()} 
                     ,sqlCode   : "D212" //dd_oem_customers_sel
                    ,text       : "customer_code"
                    ,value      : "customer_id"
                });
             }
             ,_onProgramCompleteChangeEvent = function(){
                $olg.bpId.dataBind({
                      parameters : {program_id : this.val()} 
                     ,sqlCode    : "D210" //dd_program_bp_sel
                     ,text       : "build_phase_abbrv"
                     ,value      : "build_phase_id"
                });
             };
             
            $olg.oemId.dataBind({
                  sqlCode    : "D194" //oem_sel
                 ,text       : "oem_name"
                 ,value      : "oem_id"
                 ,onChange   : _onOEMCompleteChangeEvent
                 ,onComplete : _onOEMCompleteChangeEvent
            }); 
           
            
            $olg.progId.dataBind({
                  sqlCode    : "O159" //oem_programs_sel
                 ,text       : "program_code"
                 ,value      : "program_id"
                 ,onChange   : _onProgramCompleteChangeEvent
                 ,onComplete : _onProgramCompleteChangeEvent
            });
            
            $olg.ordStatId.dataBind("statuses"); 
        };
         
        $("#btnGo").click(function(){ 
            //pass parameters in an array format.
            $(".panel-content").find("#gridOrderList").show();
            ol.orderlist([
                 $olg.oemId.val()
                ,$olg.progId.val()
                ,$olg.bpId.val()
                ,$olg.custId.val()
                ,$olg.poNO.val()
            ]);
        });
        _pub.orderlist = async function(p){
            $olg.oemId   = p[0];
            $olg.progId  = p[1]; 
            $olg.bpId    = p[2];
            $olg.custId  = p[3];
            $olg.poNO    = p[4];


            displayOrderList({
                 oemId  :  p[0]
                ,progId :  p[1]
                ,bpId   :  p[2]
                ,custId :  p[3]
                ,poNO   :  p[4]
            });  
            app.hash.createPathState({
                 functionName   : 'ol.orderlist'
                ,parameters     : p
            });
            
        }

        function displayOrderList(o){ 
            var cb = bs({name:"cbFilter",type:"checkbox"});
            
            $("#gridOrderList").dataBind({
                 sqlCode:"O181"
                 ,parameters : {  
                       oem_id       : o.oemId 
                     , program_id   : o.progId
                     , po_no        : (o.poNo ? o.poNo : "") 
                     , customer_id  : o.custId 
                     , bp_id        : o.bpId
                 } 
                ,width      : $(".zContainer").width() 
                ,height     : $(window).height() - 300
                ,dataRows          : [
                        {text: "PO No."       ,type : "input"       ,width : 65  ,style : "text-align:left"
                            ,onRender : function(d){ 
                                var params = ['#p','orders', app.svn(d,"order_id") ].join("/") ; 
                                return (d !== null ? '<a href="' + params + '">' + app.svn(d,"po_no") + "</a>" : "");
                            }
                        } 
                        ,{text: "PO Date"        ,width : 165      ,style : "text-align:left"
                            ,onRender: function(d){ return bs({name:"po_issue_date"      ,value : app.svn(d,"po_issue_date").toShortDate()});
                            }
                        }
                        ,{text: "OEM"              ,name : "oem"                ,width : 165      ,style : "text-align:left"}
                        ,{text: "Part No."         ,name : "oem_part_no"        ,width : 165      ,style : "text-align:left"}
                        ,{text: "Customer"         ,name : "customer"           ,width : 165      ,style : "text-align:left"}
                        ,{text: "Program"          ,name : "program_code"       ,width : 165      ,style : "text-align:left"}
                        ,{text: "Order Qty."       ,name : "order_qty"          ,width : 165      ,style : "text-align:left"}
                        ,{text: "Order Type"       ,name : "order_type"         ,width : 165      ,style : "text-align:left"}
                ]
               
            });
         }
         
    return _pub;
           
})();           
           
           
           
                                                                            