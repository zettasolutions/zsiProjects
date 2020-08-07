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
       //$("#divPlanInclusions").addClass("hide");
                        
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
                var _this = this;
                var _zRow = _this.find(".zRow");
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlans input[name='cb']");
                $("[name='plan_srp'],[name='plan_dp']").maskMoney();
                
                $("[name='plan_start_date'],[name='plan_end_date']").datepicker({ 
                    pickTime  : false
                   ,autoclose : true
                   ,todayHighlight: true
                });
                
                _zRow.click(function(){
                    var _obj = gPlansData[$(this).index()];
                    if(!isUD(_obj)){
                        gPlansDataSelected = _obj;
                        displayPlanInclusions(_obj);
                        $("#lblPlanCode").text(_obj.plan_code + " | " + _obj.plan_name);
                        //$("#divPlanInclusions").removeClass("hide");
                    }else{
                        gPlansDataSelected = null;
                        $("#gridPlanInclusions").empty();
                        $("#lblPlanCode").text("");  
                        //$("#divPlanInclusions").addClass("hide");
                    } 
                });
                
                _this.find("[name='monthly_rate']").addClass("numeric");
                zsi.initInputTypesAndFormats();
            }
        });
    }
    
    function displayPlanInclusions(o){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPlanInclusions").dataBind({
             sqlCode        : "P258"
            ,parameters     : {plan_id: o.plan_id}
          //  ,height         : $(window).height() - 787
           // ,width          : $(window).width() - 20
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
                ,{text: "Product"                   ,width : 165    ,name:"product_id"          ,type:"select"        ,style : "text-align:center;"}
                ,{text: "Product Name"              ,width : 250    ,style : "text-align:left;"
                    ,onRender : function(d){
                        return app.bs({name:"product_name"          ,type:"input"              ,value: app.svn(d,"product_name")}); 
                    }
                }
                ,{text: "Product Desc"              ,width : 135    ,style : "text-align:left;"
                    ,onRender : function(d){
                        return app.bs({name:"product_desc"          ,type:"input"              ,value: app.svn(d,"product_desc")}); 
                    }
                }
                ,{text: "Product SRP"               ,width : 100    ,style : "text-align:right;"
                    ,onRender : function(d){
                        return app.bs({name:"product_desc"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"product_srp"))}); 
                    }
                }
                ,{text: "Device Brand"              ,width : 100    ,style : "text-align:center;"
                    ,onRender : function(d){
                        return app.bs({name:"device_brand_code"          ,type:"input"              ,value: app.svn(d,"device_brand_name")}); 
                    }
                }
                ,{text: "Device Type"               ,width : 100    ,style : "text-align:center;"
                    ,onRender : function(d){
                        return app.bs({name:"device_type_code"          ,type:"input"              ,value: app.svn(d,"device_type")}); 
                    }
                }
            ]
            ,onComplete: function(o){
                var _this = this;
                var _zRow = _this.find(".zRow");
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlanInclusions input[name='cb']");
                _this.find("[name='cbFilter1']").setCheckEvent("#gridPlans input[name='cb']");
                
                _zRow.find("input[name='product_name'],input[name='product_desc'],input[name='product_srp'],input[name='product_dp'],input[name='device_brand_code'],input[name='device_type_code']").attr("readonly",true);
                _zRow.find('[name="product_id"]').dataBind({
                     sqlCode     : "P1289" 
                    ,text        : "product_code"
                    ,value       : "product_id"
                    ,onChange    : function(d){
                        var  _$this         = $(this)
                            ,_info          = d.data[d.index - 1];
                            _$this.closest(".zRow").find("input[name='product_name']").val(_info.product_name);
                            _$this.closest(".zRow").find("input[name='product_desc']").val(_info.product_desc);
                            _$this.closest(".zRow").find("input[name='product_srp']").val(_info.product_srp);
                            _$this.closest(".zRow").find("input[name='product_dp']").val(_info.product_dp);
                            _$this.closest(".zRow").find("input[name='device_brand_code']").val(_info.device_brand_code);
                            _$this.closest(".zRow").find("input[name='device_type_code']").val(_info.device_type_code);
                    }
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
        //$("#gridPlanInclusions").find(".zRow").find("input[name='product_name'],input[name='product_desc'],input[name='product_srp'],input[name='product_dp'],input[name='device_brand_code'],input[name='device_type_code']").removeAttr("readonly");

        $("#gridPlanInclusions").jsonSubmit({
             procedure: "plan_inclusions_upd"
            ,notIncludes: ["product_name","product_desc","product_srp","device_brand_code","device_type_code"]
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