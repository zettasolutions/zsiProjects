(function(){

        var      bs             = zsi.bs.ctrl
                ,svn            = zsi.setValIfNull 
        ;
        
        zsi.ready = function(){
          $(".page-title").html("Order List");
            var _$tblOrderList = $("#orderListGroup");    
                 _$tblOrderList.find("select[name='oem_id']").dataBind({
                      sqlCode    : "D194" //oem_sel
                     ,text       : "oem_name"
                     ,value      : "oem_id"
                 }); 
                 
                 _$tblOrderList.find("select[name='program_id']").dataBind({
                      sqlCode    : "O159" //oem_programs_sel
                     ,text       : "program_code"
                     ,value      : "program_id"
                 });
             
                 
            $(".panel").css("height", $(".page-content").height());  
        };
         
        $("#btnGo").click(function(){  
           
            var _oemId = $("#orderListGroup").find("#oem_id").val();
            var _progId = $("#orderListGroup").find("#program_id").val(); 
            var _poNO = $("#orderListGroup").find("#enterPONumber").val();
           
            displayOrderList(_oemId,_progId,_poNO);  
             
        });
          
        
        function displayOrderList(oemId,progId,poNo){  
             var cb = bs({name:"cbFilter",type:"checkbox"});
             $("#gridOrderList").dataBind({
                  url               : app.procURL + "orders_sel @oem_id=" + (oemId ? oemId : "") + ",@program_id=" + (progId ? progId : "") + ",@po_no=" + (poNo ? poNo : "")
                 ,width             : $(".panel-container").width() - 45
                 ,height            : 300 
                 ,blankRowsLimit    : 5       ,dataRows          : [
                        {text: cb   ,width : 25     ,style : "text-align:left"
                                 ,onRender : function(d){return app.bs({name:"order_id"     ,type: "hidden"     ,value: app.svn(d,"order_id")})
                                            + app.bs({name:"is_edited"                      ,type: "hidden"     ,value: app.svn(d,"is_edited")})
                                            + (d !==null ? app.bs({name:"cb"                ,type: "checkbox"}) : "" );
                            }
                        }
                        ,{text: "PO No."       ,type : "input"       ,width : 45  ,style : "text-align:left"
                            ,onRender : function(d){ 
                                var params = '#p/orders/1/3/4/5'; 
                                
                                return (d !== null ? '<a href="' + params + '">' + app.svn(d,"po_no") + "</a>" : "");
                            }
                            
                        }
                        ,{text: "PO Date"         ,name : "po_issue_date"     ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Car Leader"      ,name : "car_leader"        ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Rev. No."        ,name : "rev_no"            ,width : 85       ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Order Type"      ,name : "order_type"        ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Rate Row"        ,name : "rate_row"          ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Customer"        ,name : "customer_id"       ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                        ,{text: "Contact"         ,name : "contact_id"        ,width : 165      ,style : "text-align:left", readonly:"readonly"}
                     ]
                      
             });
         }
           
})();           
           
           
           
                                