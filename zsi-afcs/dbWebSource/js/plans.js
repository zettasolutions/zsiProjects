  var plan = (function(){
    var _pub                = {}
        ,gPlansData         = []
        ,gPlansDataSelected = null;
    
    zsi.ready = function(){
        $(".page-title").html("Plans");
        //$(".panel-container").css("min-height", $(window).height() - 500);
        displayPlans();
    };
   
    function displayPlans(){
        gPlansDataSelected = null;
        $("#gridPlanInclusions").empty();
        $("#lblPlanCode").text("");  
        $("#divPlanInclusions").addClass("hide");
                        
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPlans").dataBind({
             sqlCode        : "P254"
            ,height         : $(window).height() - 586
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb                       ,width:25       ,style:"text-align:left"
                    ,onRender : function(d){
                        return app.bs({name:"plan_id"          ,type:"hidden"              ,value: app.svn(d,"plan_id")}) 
                            + app.bs({name:"is_edited"        ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                            + (d !== null ? app.bs({name:"cb" ,type:"checkbox" }) : "" );
                    }
                 }
                ,{text: "Plan Code"                 ,width : 150    ,name:"plan_code"          ,type:"input"        ,style : "text-align:center;"}
                ,{text: "Plan Name"                 ,width : 150    ,name:"plan_name"          ,type:"input"        ,style : "text-align:left;"}
                ,{text: "Plan SRP"                  ,width : 120    ,style : "text-align:right;padding-right:0.3rem"
                    ,onRender : function(d){
                        return app.bs({name:"plan_srp"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"plan_srp"))     ,style : "text-align:right;padding-right:0.3rem"}); 
                    }
                }
                ,{text: "Plan Down Payment"         ,width : 120    ,style : "text-align:right;padding-right:0.3rem"
                    ,onRender : function(d){
                        return app.bs({name:"plan_dp"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"plan_dp"))     ,style : "text-align:right;padding-right:0.3rem"}); 
                    }
                }
                ,{text: "Plan Start Date"           ,width : 100    ,style : "text-align:left;"
                    ,onRender : function(d){
                        return app.bs({name:"plan_start_date"          ,type:"input"              ,value: (app.svn(d,"plan_start_date").toShortDate())}); 
                        //return app.bs({name:"monthly_rate"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"monthly_rate"))}); 
                    }
                }
                ,{text: "Plan End Date"             ,width : 100    ,style : "text-align:left;"
                    ,onRender : function(d){
                        return app.bs({name:"plan_end_date"          ,type:"input"              ,value: (app.svn(d,"plan_end_date").toShortDate())}); 
                    }
                }
                ,{text: "Promo?"                ,width : 60     ,name:"is_promo"            ,type:"yesno"        ,style : "text-align:center;" ,defaultValue: "Y"}
                ,{text: "Active?"               ,width : 60     ,name:"is_active"           ,type:"yesno"        ,style : "text-align:center;" ,defaultValue: "N"}
            ]
            ,onComplete: function(o){
                gPlansData = o.data.rows;
                var _$this = this;
                var _$row = _$this.find(".zRow");
                _$this.find("[name='cbFilter1']").setCheckEvent("#gridPlans input[name='cb']");
                $("[name='plan_srp'],[name='plan_dp']").maskMoney();
                
                $("[name='plan_start_date'],[name='plan_end_date']").datepicker({ 
                    pickTime  : false
                   ,autoclose : true
                   ,todayHighlight: true
                });
                
                _$row.click(function(){
                    var _obj = gPlansData[$(this).index()];
                    if(!isUD(_obj)){
                        gPlansDataSelected = _obj;
                        displayPlanInclusions(_obj);
                        $("#lblPlanCode").text(_obj.plan_code + " | " + _obj.plan_name);
                        $("#divPlanInclusions").removeClass("hide");
                    }else{
                        gPlansDataSelected = null;
                        $("#gridPlanInclusions").empty();
                        $("#lblPlanCode").text("");  
                        $("#divPlanInclusions").addClass("hide");
                    } 
                });
                
                _$this.find("[name='monthly_rate']").addClass("numeric");
                zsi.initInputTypesAndFormats();
            }
        });
    }
    
    function displayPlanInclusions(o){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPlanInclusions").dataBind({
             sqlCode        : "P258"
            ,parameters     : {plan_id: o.plan_id}
            ,height         : $(window).height() - 787
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
                ,{text: "Product"                   ,width : 200    ,name:"product_id"          ,type:"select"        ,style : "text-align:center;"}
                //,{text: "Application"      ,width : 200    ,name:"app_id"       ,type:"select"          ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                var _this = this;
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlanInclusions input[name='cb']");
                //_this.find("[name='app_id'").dataBind({
                //    sqlCode      : "D245" //dd_applications_sel
                //    ,text         : "app_code"
                //    ,value        : "app_id"
                //    ,onChange     : function(d){
                //    
                //    }
                //});
                
                var _$this = this;
                var _$row = _$this.find(".zRow");
                _$this.find("[name='cbFilter1']").setCheckEvent("#gridPlans input[name='cb']");
                
                _$row.find('[name="product_id"]').dataBind({
                     sqlCode     : "D1287" 
                    ,text        : "product_name"
                    ,value       : "product_id"
                    ,onChange    : function(d){
                        var  _$this         = $(this)
                            ,_info          = d.data[d.index - 1]
                            ,_product_srp   = isUD(_info) ? "" : _info.product_srp
                            ,_product_dp    = isUD(_info) ? "" : _info.product_dp;
                        
                        _$this.closest(".zRow").find('[name="plan_srp"]').val(_product_srp);
                        _$this.closest(".zRow").find('[name="plan_dp"]').val(_product_dp);
                    }
                });
                
                $("[name='plan_start_date'],[name='plan_end_date']").datepicker({ 
                    pickTime  : false
                   ,autoclose : true
                   ,todayHighlight: true
                });
            }
        });
    }
    
   function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    }
  
    $("#btnSavePlans").click(function(){ 
        var _$grid = $("#gridPlans");
        var _$planSrp = _$grid.find("input[name='plan_srp']")
            ,_$planDp = _$grid.find("input[name='plan_dp']");
            _$planSrp.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            _$planDp.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
        
        _$grid.jsonSubmit({
             procedure: "plans_upd"
            ,optionalItems: ["product_id","is_promo","is_active"] 
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