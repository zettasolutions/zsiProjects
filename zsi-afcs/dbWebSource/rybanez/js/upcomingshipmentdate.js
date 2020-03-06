  var ppsd=(function(){

        var      bs             = zsi.bs.ctrl
                ,svn            = zsi.setValIfNull 
                ,_pub           = {}
                
        zsi.ready = function(){ 
            $(".page-title").html("Upcoming Shipment Date");
            displayOrderList();
            displayProgramDetails();
            }  
        function displayOrderList(){
            var cb = bs({name:"cbFilter",type:"checkbox"});
            
            $("#grid").dataBind({
                  sqlCode           : "O241" //order_upcoming_ship_dates_sel 
                 ,width             : $(".zContainer").width()
                 ,parameters        : {}
                 ,height            : $(window).height() - 260    
                 ,dataRows          : [
                         {text: "PO No."                    ,name : "po_no"                     ,width : 100      ,style : "text-align:left"}
                        ,{text: "PO Issue Date"                                                 ,width : 165      ,style : "text-align:left"
                            ,onRender: function(d){ return bs({name:"po_issue_date"             ,value : app.svn(d,"po_issue_date").toShortDate()});
                        
                            }
                        }
                        ,{text: "OEM Part No."              ,name : "oem_part_no"               ,width : 165      ,style : "text-align:left"}
                        ,{text: "Order Type"                ,name : "order_type"                ,width : 100      ,style : "text-align:left"}
                        ,{text: "Customer Part No."         ,name : "customer_part_no"          ,width : 120      ,style : "text-align:left"}
                        ,{text: "Order Qty"                 ,name : "order_qty"                 ,width : 120      ,style : "text-align:left"}
                        ,{text: "Model Year"                ,name : "model_year"                ,width : 100      ,style : "text-align:left"}
                        ,{text: "Build Phase"               ,name : "build_phase_abbrv"         ,width : 130      ,style : "text-align:left"}
                        ,{text: "Harness Family"            ,name : "harness_family"            ,width : 130      ,style : "text-align:left"}
                        ,{text: "Prefix"                    ,name : "prefix"                    ,width : 130      ,style : "text-align:left"}
                        ,{text: "Base"                      ,name : "base"                      ,width : 130      ,style : "text-align:left"}
                        ,{text: "Suffix"                    ,name : "suffix"                    ,width : 130      ,style : "text-align:left"}
                        ,{text : "More Info"                ,type : "input"                     ,width : 90       ,style : "text-align:center"
                                ,onRender : function(d){
                                        var _link = "<a href='javascript:void(0)' title='MORE INFO > "+ app.svn (d,"po_no") +"' onclick='ppsd.showModal(\""+ app.svn (d,"po_no") +"\",\""+ app.svn (d,"customer") +"\",\""+ app.svn (d,"engr_manager") +"\",\""+ app.svn (d,"program_coordinator") +"\",\""+ app.svn (d,"program_managers") +"\",\""+ app.svn (d,"car_leaders") +"\",\""+ app.svn (d,"launch_managers") +"\",\""+ app.svn (d,"warehouse_contacts") +"\")'><i class='fas fa-link link'></i></a>";
                                        return (d !== null ? _link : "");
                                    
                                }
                         }
                        
                ]
                ,onComplete : function(){
                    var _zRow = this.find(".zRow");
                    _zRow.find("#po_issue_date").attr('readonly',true);
                    
                    
                }
               
            });
         }
         $("#btnSavePartDetails").click(function () {
               $("#gridPartDetails").jsonSubmit({
                     procedure  : "order_part_details_upd"
                    ,onComplete: function (data) {
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        $("#gridPartDetails").trigger("refresh");
                    }
                });
            });
          _pub.showModal = function(poNo,customer,engrMngr,progCoordr,progMngr,carLdr,launchMngr,wareHContact) {
                var _$body = $("#frm_modalMoreInfo").find(".modal-body").find("#nav-tab");
                var _$form = $("#frm_modalMoreInfo").find(".modal-body").find("#nav-tabContent");
                g$mdl = $("#modalMoreInfo");
                g$mdl.find(".modal-title").html("More Info » "+poNo+"") ;
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                _$form.find("#customerId").html(customer);
                _$form.find("#engrManagerId").html(engrMngr);
                _$form.find("#programCoordinatorId").html(progCoordr);
                _$form.find("#programManagerId").html(progMngr);
                _$form.find("#carLeaderId").html(carLdr);
                _$form.find("#launchManagerId").html(launchMngr);
                _$form.find("#warehouseContactId").html(wareHContact);
                
                
            }
         
    return _pub;
           
})();                                               