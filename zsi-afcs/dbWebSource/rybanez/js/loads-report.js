 var loadingTransactions = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Load Transactions Report");
        displayLoadingTransactions();
        validation();
    };
    
    function validation(){
        var _dayFrom = $("#load_date_frm");
        var _dayTo   = $("#load_date_to");
        var _timeFrom = "";
        var _timeTo = "";
        var _error  = $("#ermsgId");
        
        $("#load_date_frm,#load_date_to").on("keyup change",function(){
            var _colName    = $(this)[0].id;
            if(_colName === "load_date_frm")_timeFrom = new Date(_dayFrom.val()).getTime();
            else _timeTo = new Date(_dayTo.val()).getTime();
            if(_timeFrom > _timeTo){
                _error.removeClass("hide");
                _dayTo.css("border-color","red");
                $("#btnFilterVal").attr("disabled",true);
            }else{
                _error.addClass("hide");
                _dayTo.css("border-color","green");
                $("#btnFilterVal").removeAttr("disabled");
            }
        });
    }
    
    function displayLoadingTransactions(loadDateFrm,loadDateTo){
        $("#gridLoadingTransactions").dataBind({
             sqlCode        : "L1267" //loads_report_sel
            ,parameters     : {load_date_frm:(loadDateFrm ? loadDateFrm : ""),load_date_to:(loadDateTo ? loadDateTo : "")} 
            ,height         : $(window).height() - 270
            ,dataRows       : [
                {text: "Load Date"                                                                     ,width : 200
                     ,onRender: function(d){
                        return app.bs({name: "load_date"          ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()    ,style : "text-align:center;"});
                    }
                 }
                ,{text: "QR Id"                      ,name:"qr_id"                   ,type:"input"      ,width : 60    ,style : "text-align:center;"}
                ,{text: "Load Amount"                                                                   ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "load_amount"        ,type: "input"     ,value: app.svn(d,"load_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Loaded By"                  ,name:"loaded_by"              ,type:"input"       ,width : 150   ,style : "text-align:center;"}
                //,{text: "Compay Code"                ,name:"company_code"           ,type:"input"       ,width : 100   ,style : "text-align:center;"}
            ]
            ,onComplete: function(){
                var _this = this;
                var _zRow = _this.find(".zRow");
                this.find("input").attr("readonly",true);
                var _$dateFr = _this.find(".zRow:first-child()").find("[name='load_date']").val();
                var _$dateTo = _this.find(".zRow:last-child()").find("[name='load_date']").val();
                var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates();
                $("#load_date_frm").datepicker({todayHighlight:true}).datepicker("setDate",_dateFr);
                $("#load_date_to").datepicker({todayHighlight:true}).datepicker("setDate",_dateTo);
                
            }
        });
    }
    
    $("#btnFilterVal").click(function(){ 
        var _dateFrm = $.trim($("#load_date_frm").val());  
        var _dateTo = $.trim($("#load_date_to").val());
        displayLoadingTransactions(_dateFrm,_dateTo);
    }); 

    $("#load_date").on("keyup change",function(){
        if($(this).val() === "") {
            displayLoadingTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        displayLoadingTransactions();
    });

    return _pub;
})();                    