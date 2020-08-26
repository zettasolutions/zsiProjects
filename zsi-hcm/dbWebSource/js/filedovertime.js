  
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Filed Overtime");
        displayFiledOverTime(); 
    }; 
    function displayFiledOverTime(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 sqlCode           : "F185"
                ,parameters        : {client_id:app.userInfo.company_id}
                ,height            : $(window).height() - 236 
                ,blankRowsLimit    : 5   
                ,dataRows          : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"ot_id"   ,type:"hidden"      ,value: svn (d,"ot_id")}) 
                                            + app.bs({name:"is_edited"               ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );            
                            }
                        
                        } 
                        ,{text:"OT Filed Date"                ,width:150       ,style:"text-align:left"
                             ,onRender: function(d){ return app.bs({type:"input"   ,name:"ot_filed_date"    ,value: svn(d,"ot_filed_date").toShortDate()});
                    
                            }
                        } 
                        ,{text:"OT Type"                ,type:"select"           ,name:"ot_type_id"             ,width:150       ,style:"text-align:left"} 
                        ,{text:"Employee ID"            ,type:"select"           ,name:"employee_id"            ,width:150       ,style:"text-align:left"} 
                        ,{text:"OT Date"                ,width:100              ,style:"text-align:left"
                             ,onRender: function(d){ 
                                 return app.bs({type:"input"                    ,name:"ot_date"    ,value: svn(d,"ot_date").toShortDate()}); 
                            }
                        }
                        ,{text:"Filed OT Hours"         ,type:"input"           ,name:"filed_ot_hours"         ,width:150       ,style:"text-align:left"}
                        ,{text:"Approved_hours"         ,type:"input"           ,name:"approved_hours"         ,width:150       ,style:"text-align:left"}    
                        ,{text:"Approved By"            ,type:"input"           ,name:"approved_by"            ,width:150       ,style:"text-align:left"}
                        ,{text:"Approved Date"          ,width:100       ,style:"text-align:left"
                            ,onRender: function(d){ 
                                 return app.bs({type:"input"   ,name:"approved_date"    ,value: svn(d,"approved_date").toShortDate()}); 
                            }
                        }
                        ,{text:"OT Reason"          ,type:"input"           ,name:"ot_reason"              ,width:150       ,style:"text-align:left"}
                        ,{text:"Approver Comment"   ,type:"input"           ,name:"approver_comment"      ,width:150       ,style:"text-align:left"} 
                    ] 
                    ,onComplete : function(d){
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        this.find("[name='ot_filed_date']").datepicker().attr("readonly",true); 
                        this.find("[name='ot_date']").datepicker().attr("readonly",true); 
                        this.find("[name='approved_date']").datepicker().attr("readonly",true); 
                        this.find("[name='employee_id']").dataBind({
                           sqlCode : "D218"
                           ,text : "fullname"
                           ,value : "id"
                        });
                        this.find("[name='ot_type_id']").dataBind({
                           sqlCode : "D243"
                           ,text   : "ot_type"
                           ,value  : "ot_id"
                        }); 
                    }
                });
            }   
     
            $("#btnSaveOvertime").click(function () { 
                $("#grid").jsonSubmit({
                     procedure: "filed_overtime_upd"
                    ,optionalItems: ["is_active"] 
                    ,onComplete: function (data) { 
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                        $("#grid").trigger("refresh")
                    } 
                }); 
            });
            
            $("#btnDeleteOvertime").click(function (){  
                $("#grid").deleteData({
            		sqlCode: "D248"  
            		,parameters: {client_id:app.userInfo.company_id,table:'filed_overtime',id:'ot_id'}
            		,onComplete : function(d){
            			$("#grid").trigger("refresh");
            		}
            	 });  
            });
})();

                          