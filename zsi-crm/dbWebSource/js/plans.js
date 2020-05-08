  var plan = (function(){
    var _pub                = {}
        ,gPlansData         = []
        ,gPlansDataSelected = null;
    
    zsi.ready = function(){
        $(".page-title").html("Plans");
        $(".panel-container").css("min-height", $(window).height() - 500);
        displayPlans();
    };
   
    function displayPlans(){
        gPlansDataSelected = null;
        $("#gridPlanInclusions").empty();
        $("#lblPlanCode").text("");  
        $("#divPlanInclusions").addClass("hide");
                        
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPlans").dataBind({
             sqlCode        : "P254" //plans_sel
            ,height         : $(".panel-container") - 570
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb                       ,width:25       ,style:"text-align:left"
                    ,onRender : function(d){
                        return app.bs({name:"plan_id"          ,type:"hidden"              ,value: app.svn(d,"plan_id")}) 
                            + app.bs({name:"is_edited"        ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                            + (d !== null ? app.bs({name:"cb" ,type:"checkbox" }) : "" );
                    }
                 }
                ,{text: "Plan Code"             ,width : 100    ,name:"plan_code"           ,type:"input"        ,style : "text-align:center;"}
                ,{text: "Plan Description"      ,width : 200    ,name:"plan_desc"           ,type:"input"        ,style : "text-align:left;"}
                ,{text: "Monthly Rate"          ,width : 100    ,style : "text-align:left;"
                    ,onRender : function(d){
                        return app.bs({name:"monthly_rate"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"monthly_rate"))}); 
                    }
                }
                ,{text: "Is Active?"            ,width : 90     ,name:"is_active"           ,type:"yesno"        ,style : "text-align:center;" ,defaultValue: "Y"}
            ]
            ,onComplete: function(o){
                gPlansData = o.data.rows;
                var _this = this;
                var _$row = _this.find(".zRow");
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlans input[name='cb']");
                
                _this.find("[name='monthly_rate']").focusout(function(){
                    $(this).val(commaSeparateNumber($(this).val()));
                });
                
                _$row.click(function(){
                    var _obj = gPlansData[$(this).index()];
                    if(!isUD(_obj)){
                        gPlansDataSelected = _obj;
                        displayPlanInclusions(_obj);
                        $("#lblPlanCode").text(_obj.plan_code);
                        $("#divPlanInclusions").removeClass("hide");
                    }else{
                        gPlansDataSelected = null;
                        $("#gridPlanInclusions").empty();
                        $("#lblPlanCode").text("");  
                        $("#divPlanInclusions").addClass("hide");
                    } 
                });
            }
        });
    }
    
    function displayPlanInclusions(o){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPlanInclusions").dataBind({
             sqlCode        : "P258" //plan_inclusions_sel
            ,parameters     : {plan_id: o.plan_id}
            ,height         : $(".panel-container") - 570
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb                       ,width:25       ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"plan_inclusion_id"                ,type:"hidden"          ,value: app.svn(d,"plan_inclusion_id")}) 
                              + app.bs({name:"is_edited"                        ,type:"hidden"      })
                              + app.bs({name:"plan_id"                          ,type:"hidden"          ,value: o.plan_id })
                              + (d !== null ? app.bs({name:"cb"                 ,type:"checkbox"    })  : "" );
                     }
                 }
                ,{text: "Application"      ,width : 200    ,name:"app_id"       ,type:"select"          ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                var _this = this;
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlanInclusions input[name='cb']");
                _this.find("[name='app_id'").dataBind({
                    sqlCode      : "D245" //dd_applications_sel
                    ,text         : "app_code"
                    ,value        : "app_id"
                    ,onChange     : function(d){
                    
                    }
                });
            }
        });
    }
    
   function commaSeparateNumber(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = parseFloat(val).toFixed(2).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }
  
    $("#btnSavePlans").click(function(){ 
        var _$grid = $("#gridPlans");
        var _$monthlyRate = _$grid.find("input[name='monthly_rate']");
            _$monthlyRate.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
        
        _$grid.jsonSubmit({
             procedure: "plans_upd"
            //,optionalItems: ["",""] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayPlans();
            } 
        }); 
    });
    
    $("#btnDeletePlans").click(function(){
        zsi.form.deleteData({ 
            code:"ref-0001" 
           ,onComplete:function(data){
                 displayPlans();
           }
        });
    });
    
    $("#btnSavePlanInclusion").click(function(){ 
        $("#gridPlanInclusions").jsonSubmit({
             procedure: "plan_inclusions_upd"
            //,optionalItems: ["",""] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayPlanInclusions(gPlansDataSelected);
            } 
        }); 
    });
    
    $("#btnDeletePlanInclusion").click(function(){
        zsi.form.deleteData({ 
            code:"ref-0002" 
           ,onComplete:function(data){
                 displayPlanInclusions(gPlansDataSelected);
           }
        });
    });
    
    return _pub;
})();                                