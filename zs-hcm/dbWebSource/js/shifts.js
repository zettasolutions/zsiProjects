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
                            return app.bs({name:"shift_id"         ,type:"hidden"      ,value: app.svn (d,"shift_id")}) 
                                 + app.bs({name:"is_edited"        ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    
                    } 
                    ,{text:"Shift Code"                     ,type:"input"           ,name:"shift_code"                  ,width:100       ,style:"text-align:left"} 
                    ,{text:"Shift Title"                    ,type:"input"           ,name:"shift_title"                 ,width:100       ,style:"text-align:left"} 
                    ,{text:"Monday"                                                                                     ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"monday"        ,type:"hidden"      ,value: app.svn(d,"monday")}) 
                                  + app.bs({name:"cbMon"         ,type:"checkbox"});
                        }
                    } 
                    ,{text:"Tuesday"                                                                                    ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"tuesday"       ,type:"hidden"      ,value: app.svn(d,"tuesday")}) 
                                  + app.bs({name:"cbTues"        ,type:"checkbox"});
                        }
                    } 
                    ,{text:"Wednesday"                                                                                  ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"wednesday"     ,type:"hidden"      ,value: app.svn(d,"wednesday")}) 
                                  + app.bs({name:"cbWed"         ,type:"checkbox"});
                        }
                    } 
                    ,{text:"Thursday"                                                                                   ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"thursday"      ,type:"hidden"      ,value: app.svn(d,"thursday")}) 
                                  + app.bs({name:"cbThur"        ,type:"checkbox"});
                        }
                    } 
                    ,{text:"Friday"                                                                                     ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"friday"        ,type:"hidden"      ,value: app.svn(d,"friday")}) 
                                  + app.bs({name:"cbFri"         ,type:"checkbox"}) ;
                        }
                    } 
                    ,{text:"Saturday"                                                                                   ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"saturday"      ,type:"hidden"      ,value: app.svn(d,"saturday")}) 
                                  + app.bs({name:"cbSat"         ,type:"checkbox"});
                        }
                    } 
                    ,{text:"Sunday"                                                                                     ,width:65       ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"sunday"        ,type:"hidden"      ,value: app.svn(d,"sunday")}) 
                                  + app.bs({name:"cbSun"         ,type:"checkbox"});
                        }
                    } 
                    ,{text:"No. Hours"                      ,type:"input"           ,name:"no_hours"                    ,width:100       ,style:"text-align:left"} 
                    ,{text:"From Time In"                   ,type:"time"            ,name:"from_time_in"                ,width:100       ,style:"text-align:left" } 
                    ,{text:"To Time In"                     ,type:"time"            ,name:"to_time_in"                  ,width:100       ,style:"text-align:left" } 
                    
                ] 
                ,onComplete : function(d){    
                    var _this = this;
                    var _zRow = _this.find(".zRow");
                    _this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']"); 
                    _zRow.find("[name='cbMon']").attr("readonly","true");
                    if(_zRow.find("[name='monday']").val() == 1) $("[name='monday'][value='1']").closest(".zRow").find("[name='cbMon']").prop("checked",true);
                    if(_zRow.find("[name='tuesday']").val() == 1) $("[name='tuesday'][value='1']").closest(".zRow").find("[name='cbTues']").prop("checked",true);
                    if(_zRow.find("[name='wednesday']").val() == 1) $("[name='wednesday'][value='1']").closest(".zRow").find("[name='cbWed']").prop("checked",true);
                    if(_zRow.find("[name='thursday']").val() == 1) $("[name='thursday'][value='1']").closest(".zRow").find("[name='cbThur']").prop("checked",true);
                    if(_zRow.find("[name='friday']").val() == 1) $("[name='friday'][value='1']").closest(".zRow").find("[name='cbFri']").prop("checked",true);
                    if(_zRow.find("[name='saturday']").val() == 1) $("[name='saturday'][value='1']").closest(".zRow").find("[name='cbSat']").prop("checked",true);
                    if(_zRow.find("[name='sunday']").val() == 1) $("[name='sunday'][value='1']").closest(".zRow").find("[name='cbSun']").prop("checked",true);
                    
                    _this.find("[name='cbMon'],[name='cbTues'],[name='cbWed'],[name='cbThur'],[name='cbFri'],[name='cbSat'],[name='cbSun']").on("click",function(){
                        var _name = $(this)[0].name;
                        switch (_name) {
                            case "cbMon":
                                _name = "monday";
                                break;
                            case "cbTues":
                                _name = "tuesday";
                                break;
                            case "cbWed":
                                _name = "wednesday";
                                break;
                            case "cbThur":
                                _name = "thursday";
                                break;
                            case "cbFri":
                                _name = "friday";
                                break;
                            case "cbSat":
                                _name = "saturday";
                                break;
                            case "cbSun":
                                _name = "sunday";
                                break;
                        }
                        
                        if( this.checked ) {
                            $(this).closest(".zRow").find("[name=" + _name + "]").val(1);
                        } else {
                            $(this).closest(".zRow").find("[name=" + _name + "]").val(null);
                        }
                    });
                    
                    markMandatory();
                } 
        });
    }   

    function markMandatory(){
        $("#grid").markMandatory({       
            "groupNames":[
                {
                     "names" : ["shift_code","shift_title","no_hours",]
                    ,"type":"M"
                }             
              
            ]  
            ,"groupTitles":[ 
                 {"titles" : ["Shift Code","Shift Title","No. Hours"]}
            ]
        }); 
    }    

    $("#btnSave").click(function () { 
        var _$grid = $("#grid");
        if( _$grid.checkMandatory()!==true) return false;
        _$grid.jsonSubmit({
             procedure: "shifts_upd"
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                $("#grid").trigger("refresh");
            } 
        }); 
    });
    
    $("#btnDelete").click(function (){  
        $("#grid").deleteData({
    		sqlCode: "D248"  
    		,parameters: {client_id:app.userInfo.company_id,table:'shifts',id:'shift_id'}
    		,onComplete : function(d){
    			$("#grid").trigger("refresh");
    		}
    	 });  
    });
    
})();

                                 