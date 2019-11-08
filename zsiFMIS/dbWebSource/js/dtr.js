 
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
                 url                : app.procURL + "assets_sel"  
                ,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"id"         ,type:"hidden"      ,value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        } 
                        ,{text:"Employee"                       ,type:"select"          ,name:"employee_id"                     ,width:200       ,style:"text-align:left"} 
                        ,{text:"DT In"                          ,type:"input"           ,name:"dt_in"                           ,width:100       ,style:"text-align:left"} 
                        ,{text:"DT Out"                         ,type:"input"           ,name:"dt_out"                          ,width:100       ,style:"text-align:left"} 
                        ,{text:"Shift"                          ,type:"select"          ,name:"shift_id"                        ,width:150       ,style:"text-align:left"}
                        ,{text:"Reg Hours"                      ,type:"input"           ,name:"rg_hours"                        ,width:100       ,style:"text-align:left"} 
                        ,{text:"ND Hours"                       ,type:"input"           ,name:"nd_hours"                        ,width:100       ,style:"text-align:left"} 
                        ,{text:"Total Hours"                    ,type:"input"           ,name:"total_hours"                     ,width:100       ,style:"text-align:left"} 
                        
                    ] 
                    ,onComplete : function(d){    
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        this.find("[name='employee_id']").dataBind("employees");
                        this.find("[name='shift_id']").dataBind("employees");
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "assets_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00011"
               ,onComplete:function(data){
                    displayAssets();
               }
            });
        });
    
})();

                   