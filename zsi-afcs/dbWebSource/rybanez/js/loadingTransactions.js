var loadingTransactions = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Loading Transactions");
        displayLoadingTransactions();
        $("#load_date").datepicker({todayHighlight:true});
    };
    
    function displayLoadingTransactions(loadDate){
        $("#gridLoadingTransactions").dataBind({
             sqlCode        : "L1237" //loading_transactions_sel
            ,parameters     : {load_date:(loadDate ? loadDate : "")} 
            ,height         : $(window).height() - 240
            ,dataRows       : [
                {text: "Load Date"                                                                     ,width : 200
                     ,onRender: function(d){
                        return app.bs({name: "load_date"          ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()    ,style : "text-align:center;"});
                    }
                 }
                ,{text: "QR Id"                      ,name:"qr_id"                   ,type:"input"      ,width : 60    ,style : "text-align:center;"}
                ,{text: "Load Amount"                                                                   ,width : 100   ,style : "text-align:center;"
                    ,onRender: function(d){
                        return app.bs({name: "load_amount"        ,type: "input"     ,value: app.svn(d,"load_amount").toMoney()    ,style : "text-align:center;"});
                    }
                }
                ,{text: "Loaded By"                  ,name:"loaded_by"              ,type:"input"       ,width : 150   ,style : "text-align:center;"}
                ,{text: "Compay Code"                ,name:"company_code"           ,type:"input"       ,width : 100   ,style : "text-align:center;"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("input").attr("readonly",true);
                
            }
        });
    }
    
    $("#btnFilterVal").click(function(){ 
        var _date = $.trim($("#load_date").val());  
            console.log("_date",_date);
            displayLoadingTransactions(_date);
    }); 

    $("#load_date").on("keyup change",function(){
        if($(this).val() === "") {
            displayLoadingTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        $("#load_date").val("");
        displayLoadingTransactions();
    });

    return _pub;
})();                