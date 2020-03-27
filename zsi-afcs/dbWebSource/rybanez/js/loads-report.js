 var loadingTransactions = (function(){
    var _pub             = {}
        ,gDateType       = ""
        ,gLoaderId       = null;
    
    zsi.ready = function(){
        $(".page-title").html("Load Transactions Report");
        displayLoadingTransactions();
        validation();
        $('#loaderId').select2({placeholder: "SELECT LOADER",allowClear: true});
        
        $("#loaderId").dataBind({
            sqlCode      : "D1270" //dd_users_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _loader_id         = isUD(_info) ? "" : _info.user_id;
                gLoaderId = _loader_id;
           }
        });
        
        $('[name="filter"]').on('change', function(){
            var _this = $(this);
            var _placeholderFrm = "";
            var _placeholderTo = "";
            if(_this.val() === "weekly"){ gDateType = "weekly";_placeholderFrm="FROM WEEK.....";_placeholderTo="TO WEEK....."}
            else if (_this.val() === "monthly"){ gDateType = "monthly";_placeholderFrm="FROM MONTH.....";_placeholderTo="TO MONTH....."}
            else{ gDateType = "yearly";_placeholderFrm="FROM YEAR.....";_placeholderTo="TO YEAR....."}
            
            if(_this.is(':checked')){
                $("#load_date_frm").attr("placeholder",_placeholderFrm);
                $("#load_date_to").attr("placeholder",_placeholderTo);
                $("#load_date_frm").val("");
                $("#load_date_to").val("");
                $(".date-range").removeClass("hide");
            }
            
        });
    };
    
    
    function validation(){
        var _dayFrom = $("#load_date_frm");
        var _dayTo   = $("#load_date_to");
        var _timeFrom = "";
        var _timeTo = "";
        var _error  = $("#ermsgId");
        var _msg = "Value must not be lesser than "
        var _erTypeMsg = "";
        
        $("#load_date_frm,#load_date_to").on("keyup",function(){
            var _colName    = $(this)[0].id;
            if(gDateType === "weekly") _erTypeMsg = _msg + "from week value";
            else if(gDateType === "monthly") _erTypeMsg = _msg + "from month value";
            else _erTypeMsg = _msg + "from year value";
            
            _error.text(_erTypeMsg);
            
            if(_colName === "load_date_frm")_timeFrom = _dayFrom.val();
            else _timeTo = _dayTo.val();
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
   
    function displayLoadingTransactions(loadDateFrm,loadDateTo,dateType,loaderId){
        $("#gridLoadingTransactions").dataBind({
             sqlCode        : "L1267" //loads_report_sel
            ,parameters     : {load_date_frm:(loadDateFrm ? loadDateFrm : ""),load_date_to:(loadDateTo ? loadDateTo : ""),date_type:(dateType ? dateType : ""),load_by:(loaderId ? loaderId : "")} 
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
                
            }
        });
    }
    
    $("#btnExportTransations").click(function () {
      $("#gridLoadingTransactions").convertToTable(
        function($table){
            $table.htmlToExcel({
               fileName: "Loads Report"
           });
        });
    });
    
    $("#btnFilterVal").click(function(){ 
        var _dateFrm = $.trim($("#load_date_frm").val());  
        var _dateTo = $.trim($("#load_date_to").val());
        displayLoadingTransactions(_dateFrm,_dateTo,gDateType,gLoaderId);
    }); 

    $("#load_date").on("keyup change",function(){
        if($(this).val() === "") {
            displayLoadingTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        $("#loaderId").val(null).trigger('change');
        $(".date-range").addClass("hide");
        $('[name="filter"]').prop('checked', false);
        displayLoadingTransactions();
    });

    return _pub;
})();                        