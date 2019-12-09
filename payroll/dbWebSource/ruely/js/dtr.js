 (function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("DTR");
        displayDTR(); 
    }; 
    function displayDTR(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "dtr_sel"  
                ,width              : $("#panel-content").width()
                ,height         : $(window).height() - 260
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"id"         ,type:"hidden"      ,value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Employee"                       ,type:"select"          ,name:"employee_id"                     ,width:150       ,style:"text-align:left"}
                        ,{text:"Shifts"                         ,type:"select"          ,name:"shift_id"                        ,width:50        ,style:"text-align:left"}
                        ,{text:"Shifts Hours"                   ,type:"input"           ,name:"shift_hours"                     ,width:100       ,style:"text-align:left"}
                        ,{text:"DTR Date"                       ,width:100              ,style:"text-align:left"
                                ,onRender: function(d){ return app.bs({type:"input"     ,name:"dtr_date"       ,value: svn(d,"dtr_date").toShortDate()});
                            }
                        } 
                        ,{text:"DT In"                          ,type:"input"           ,name:"dt_in"                            ,width:145       ,style:"text-align:left"} 
                        ,{text:"DT Out"                         ,type:"input"           ,name:"dt_out"                           ,width:145       ,style:"text-align:left"} 
                        
                        
                        ,{text:"Reg Hours"                      ,type:"input"           ,name:"reg_hours"                        ,width:65        ,style:"text-align:left"} 
                        ,{text:"Night Def"                      ,type:"input"           ,name:"nd_hours"                         ,width:100       ,style:"text-align:left"} 
                        
                        ,{text:"ODT In"                         ,type:"input"           ,name:"odt_in"                           ,width:145       ,style:"text-align:left"} 
                        ,{text:"ODT Out"                        ,type:"input"           ,name:"odt_out"                          ,width:145       ,style:"text-align:left"} 
                        
                        ,{text:"Reg OT Hours"                   ,type:"input"           ,name:"reg_ot_hrs"                       ,width:100       ,style:"text-align:left"}
                        ,{text:"ND OT Hours"                    ,type:"input"           ,name:"nd_ot_hours"                      ,width:100       ,style:"text-align:left"}
                        ,{text:"RD OT Hours"                    ,type:"input"           ,name:"rd_ot_hours"                      ,width:100       ,style:"text-align:left"}
                        ,{text:"RHD OT Hours"                   ,type:"input"           ,name:"rhd_ot_hours"                     ,width:100       ,style:"text-align:left"} 
                        ,{text:"SHD OT Hours"                   ,type:"input"           ,name:"shd_ot_hours"                     ,width:100       ,style:"text-align:left"} 
                        ,{text:"Leave Type"                     ,type:"select"          ,name:"leave_type_id"                    ,width:160       ,style:"text-align:left"} 
                        ,{text:"Leave Hours"                    ,type:"input"           ,name:"leave_hours"                      ,width:75        ,style:"text-align:left"} 
                        ,{text:"Leave Hours With Pay"           ,type:"input"           ,name:"leave_hours_wpay"                 ,width:120       ,style:"text-align:left"} 
                        
                    ] 
                    ,onComplete : function(d){
                        var _zRow = this.find(".zRow");
                        _zRow.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        _zRow.find("[name='employee_id']").dataBind("employees");
                        _zRow.find("[name='shift_id']").dataBind("shifts");
                        _zRow.find("[name='dtr_date']").datepicker({todayHighlight:true});
                        _zRow.find("#dt_in,#dt_out,#odt_in,#odt_out").datepicker({
                             timePicker         : true
                            ,isRTL              : true
                            ,todayHighlight     : true
                            ,format             : 'mm/dd/yyyy HH:mm PP'
                            
                        });
                        _zRow.find("#leave_type_id").dataBind({
                            sqlCode      : "L187" //leave_types_sel
                           ,value        : "leave_type_id"
                           ,text         : "leave_type"
                        });
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "dtr_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00016"
               ,onComplete:function(data){
                    displayDTR();
               }
            });
        });
    
})();

                          