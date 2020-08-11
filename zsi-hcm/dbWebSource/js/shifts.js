(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Shifts");
        displayShifts(); 
    }; 
    function displayShifts(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "shifts_sel"  
                ,height             : $(window).height() - 240
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:center"
                            ,onRender  :  function(d){ 
                                return app.bs({name:"shift_id"         ,type:"hidden"      ,value: svn (d,"shift_id")}) 
                                     + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                     + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                            }
                        
                        } 
                        ,{text:"Shift Code"                     ,type:"input"           ,name:"shift_code"                  ,width:100       ,style:"text-align:left"} 
                        ,{text:"Shift Title"                    ,type:"input"           ,name:"shift_title"                 ,width:100       ,style:"text-align:left"} 
                        ,{text:"Monday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"monday"      ,type:"hidden"      ,value: svn (d,"monday")}) 
                                      + app.bs({name:"cbMon",type:"checkbox"});
                            }
                        } 
                        ,{text:"Tuesday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"tuesday"      ,type:"hidden"      ,value: svn (d,"tuesday")}) 
                                      + app.bs({name:"cbTues",type:"checkbox"});
                            }
                        } 
                        ,{text:"Wednesday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"wednesday"      ,type:"hidden"      ,value: svn (d,"wednesday")}) 
                                      + app.bs({name:"cbWed",type:"checkbox"});
                            }
                        } 
                        ,{text:"Thursday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"thursday"      ,type:"hidden"      ,value: svn (d,"thursday")}) 
                                      + app.bs({name:"cbThur",type:"checkbox"});
                            }
                        } 
                        ,{text:"Friday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"friday"      ,type:"hidden"      ,value: svn (d,"friday")}) 
                                      + app.bs({name:"cbFri",type:"checkbox"}) ;
                            }
                        } 
                        ,{text:"Saturday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"satruday"      ,type:"hidden"      ,value: svn (d,"saturday")}) 
                                      + app.bs({name:"cbSat",type:"checkbox"});
                            }
                        } 
                        ,{text:"Sunday"                         ,width:65       ,style:"text-align:center"
                            ,onRender : function(d){
                                 return app.bs({name:"sunday"      ,type:"hidden"      ,value: svn (d,"sunday")}) 
                                      + app.bs({name:"cbSun",type:"checkbox"});
                            }
                        } 
                        ,{text:"No. Hours"                      ,type:"input"           ,name:"no_hours"                    ,width:100       ,style:"text-align:left"} 
                        ,{text:"From Time In"                   ,type:"time"            ,name:"from_time_in"                ,width:100       ,style:"text-align:left" } 
                        ,{text:"To Time In"                     ,type:"time"            ,name:"to_time_in"                  ,width:100       ,style:"text-align:left" } 
                        
                    ] 
                    ,onComplete : function(d){    
                        var _zRow = this.find(".zRow");
                        this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']"); 
                        _zRow.find("[name='cbMon']").attr("readonly","true");
                        if(_zRow.find("[name='monday']").val() == 1) _zRow.find("[name='cbMon']").prop("checked","true");
                        if(_zRow.find("[name='tuesday']").val() == 1) _zRow.find("[name='cbTues']").prop("checked","true");
                        if(_zRow.find("[name='wednesday']").val() == 1) _zRow.find("[name='cbWed']").prop("checked","true");
                        if(_zRow.find("[name='thursday']").val() == 1) _zRow.find("[name='cbThur']").prop("checked","true");
                        if(_zRow.find("[name='friday']").val() == 1) _zRow.find("[name='cbFri']").prop("checked","true");
                        if(_zRow.find("[name='saturday']").val() == 1) _zRow.find("[name='cbSat']").prop("checked","true");
                        if(_zRow.find("[name='sunday']").val() == 1) _zRow.find("[name='cbSun']").prop("checked","true");
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "shifts_upd"
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00015"
               ,onComplete:function(data){
                    displayShifts();
               }
            });
        });
    
})();

                              