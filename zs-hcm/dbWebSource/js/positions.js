var position = (function(){
    var      bs                 = zsi.bs.ctrl
            ,svn                = zsi.setValIfNull
            ,gtw                = null
            ,_public            = {}
            ,gMdlOtherIncome    = "modalWindowOtherIncome"
    ;
    
    zsi.ready = function() {
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Positions");
        displayPositions();
        getTemplates();
    };

    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlOtherIncome
            , sizeAttr  : "modal-md"
            , title     : "Other Income"
            , body      : gtw.new().modalBodyOtherIncome({grid:"gridOtherIncome",onClickSaveOtherIncome:"submitOtherIncome();"}).html()  
        });
    }
    
    $("#btnSavePosition").click(function () {
        var _$grid = $("#gridPosition");
        var _$basicPay = _$grid.find("input[name='basic_pay']");
        var _$hourlyRate = _$grid.find("input[name='hourly_rate']");
        var _$dailyRate = _$grid.find("input[name='daily_rate']");
            _$basicPay.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            _$hourlyRate.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            _$dailyRate.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
        
       _$grid.jsonSubmit({
             procedure  : "positions_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridPosition").trigger("refresh");
            }
        });
    });
    
    $("#btnDeletePosition").click(function (){  
        $("#gridPosition").deleteData({
    		sqlCode: "D248"  
    		,parameters: {client_id:app.userInfo.company_id,table:'positions',id:'position_id'}
    		,onComplete : function(d){
    			$("#gridPosition").trigger("refresh");
    		}
    	 });  
    });
    
     function displayPositions(){
        var _clientId = app.userInfo.company_id;
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridPosition").dataBind({
             sqlCode        : "P201"
            ,parameters  : {client_id : _clientId} 
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(window).height() - 236
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"position_id"                    ,type:"hidden"       ,value: app.svn(d,"position_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Position Title"            ,name:"position_title"      ,type:"input"        ,width : 240   ,style : "text-align:left;"}
                ,{text: "Position Description"      ,name:"position_desc"       ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Work Description"          ,name:"work_desc"           ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Level No."                 ,name:"level_no"            ,type:"input"        ,width : 65    ,style : "text-align:center;"}
                ,{text: "Basic Pay"                 ,width : 100   ,style : "text-align:right;"
                    ,onRender : function(d){
                        return app.bs({name:"basic_pay"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"basic_pay"))       ,style : "text-align:right"}); 
                    }
                }
                ,{text: "Hourly Rate"               ,width : 100   ,style : "text-align:right;"
                    ,onRender : function(d){
                        return app.bs({name:"hourly_rate"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"hourly_rate"))       ,style : "text-align:right"}); 
                    }
                }
                ,{text: "Daily Rate"                 ,width : 100   ,style : "text-align:right;"
                    ,onRender : function(d){
                        return app.bs({name:"daily_rate"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"daily_rate"))       ,style : "text-align:right"}); 
                    }
                }
                ,{text: "Other Income"                                          ,type:"input"        ,width : 90    ,style : "text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' onclick='position.showModalOI("+ app.svn (d,"position_id") +",\""+ app.svn (d,"position_title") +"\")'><i class='fas fa-link link'></i></a>";
                            return (d !== null ? _link : "");
                        
                    }
                }
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter']").setCheckEvent("#gridPosition input[name='cb']");
                this.find(".zHeaders .item:nth-child(6) .text,.zHeaders .item:nth-child(7) .text,.zHeaders .item:nth-child(8) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });
                $("[name='basic_pay'],[name='hourly_rate'],[name='daily_rate']").maskMoney();
            }
        });
    } 


     function displayOtherIncome(posId){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridOtherIncome").dataBind({
             sqlCode        : "E208"
            ,parameters     : {position_id : posId}
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : 360
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"emp_pos_other_income_id"        ,type:"hidden"       ,value: app.svn(d,"emp_pos_other_income_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"employee_id"                    ,type:"hidden"       ,value: app.svn(d,"employee_id")})
                                + app.bs({name:"position_id"                    ,type:"hidden"       ,value: posId })
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Other Income"          ,name:"other_income_id"         ,type:"select"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Amount"                                                                     ,width : 95    ,style : "text-align:right;"
                    ,onRender: function(d){
                        return app.bs({name:"amount"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"amount"))       ,style : "text-align:right"});
                    }
                }
    
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#gridOtherIncome input[name='cb']");
                this.find("select[name='other_income_id']").dataBind({
                     sqlCode : "O198" 
                    ,text: "other_income_desc"
                    ,value: "other_income_id" 
                });
                this.data("posId",posId);
                this.find("input[name='amount']").css({"text-align":"right", "margin-left": "-5px"});
                this.find(".zHeaders .item:last(child) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });
                
                $("[name='amount']").maskMoney();

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

    _public.showModalOI  = function(posId,pTitle) {
        var g$mdl = $("#" + gMdlOtherIncome);
        g$mdl.find(".modal-title").html(" Other Income » " + pTitle);
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOtherIncome(posId);
    };
    
    _public.submitOtherIncome = function(){
        var _$grid = $("#gridOtherIncome");
        var _$amt = _$grid.find("input[name='amount']");
            _$amt.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            
        _$grid.jsonSubmit({
             procedure: "emp_pos_other_income_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayOtherIncome(_$grid.data("posId"));
            }
        });
    }; 
            
    _public.deleteOtherIncome = function(){
         $("#gridOtherIncome").deleteData({
             tableCode   : "ref-00019"
            ,onComplete : function(data){
                $("#gridOtherIncome").trigger("refresh");
              }
        });       
    };
 
    return _public;
})();                     