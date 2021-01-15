 var loadingTransactions = (function(){
    var _pub             = {}
        ,gDateType       = ""
        ,gLoaderId       = null
        ,gzGrid          = "#gridLoadingTransactions";
    
    zsi.ready = function(){
        $(".page-title").html("Billings");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayBillings();
        
    };
    
    
   
    function displayBillings(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridBillings").dataBind({
             sqlCode        : "B250" 
            ,height         : $(window).height() - 270
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb                                                                          ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"billing_period_id"            ,type:"hidden"              ,value: app.svn(d,"billing_period_id")}) 
                              + app.bs({name:"is_edited"                    ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                              + (d !== null ? app.bs({name:"cb"             ,type:"checkbox"}) : "" );
                     }
                 }
                ,{text: "Billing Date"                                                                  ,width : 100
                     ,onRender: function(d){
                        return app.bs({name: "billing_date"                        ,type: "input"      ,value: app.svn(d,"billing_date").toShortDate()    ,style : "text-align:left;"});
                    }
                 }
                ,{text: "Billing Class"             ,name:"billing_class_id"       ,type:"select"      ,width : 200    ,style : "text-align:center;"}
                ,{text: "Posted?"                   ,name:"is_posted"              ,type:"yesno"       ,width : 60   ,style : "text-align:center;" ,defaultValue: "Y"}
            ]
            ,onComplete: function(){
                var _this = this;
                var _zRow = _this.find(".zRow");
                _this.find("[name='cbFilter1']").setCheckEvent("#gridBillings input[name='cb']");
                _this.find('[name="billing_date"]').datepicker({todayHighlight:true});
                _zRow.find('[name="billing_class_id"]').dataBind({
                    sqlCode      : "D252" 
                   ,text         : "billing_classification"
                   ,value        : "billing_class_id"
                });
                
            }
        });
    }
    
   /* function displayLoadingTransactions(loadDateFrm,loadDateTo,dateType,loaderId){
        zsi.getData({
                 sqlCode    : "L1267"
                ,parameters     : {load_date_frm:(loadDateFrm ? loadDateFrm : ""),load_date_to:(loadDateTo ? loadDateTo : ""),date_type:(dateType ? dateType : ""),load_by:(loaderId ? loaderId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _totality = 0.00;
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _totality  +=_info.load_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                         load_date          : ""
                        ,qr_id              : "Total Amount"
                        ,load_amount        : _totality
                        ,loaded_by          : ""
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 270
                        ,dataRows       : getDataRows()
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="qr_id"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            if(o.data.length <= 1)$("#btnExportTransations").attr("disabled",true);
                            else $("#btnExportTransations").removeAttr("disabled");
                            
                            setTimeout(function(){
                                setFooterFreezed(gzGrid);
                            }, 200)

                    }
                });
            }
        });
    }
    
    function getDataRows(){
        var _dataRows =[];
        
        _dataRows.push(
             {text: "Load Date"                                                                     ,width : 200
                     ,onRender: function(d){
                        return app.bs({name: "load_date"          ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()    ,style : "text-align:center;"});
                    }
                 }
                ,{text: "QR Id"                      ,name:"qr_id"                   ,type:"input"      ,width : 100    ,style : "text-align:center;"}
                ,{text: "Load Amount"                                                                   ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "load_amount"        ,type: "input"     ,value: app.svn(d,"load_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Loaded By"                  ,name:"loaded_by"              ,type:"input"       ,width : 150   ,style : "text-align:center;"}
                        
        );
        
        return _dataRows;
    }*/
    
    /*function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 20;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight});
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                   _zTotal.prev().css({"margin-bottom":23 }); 
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }*/
    
    $("#btnSaveBillings").click(function(){ 
        $("#gridBillings").jsonSubmit({
             procedure: "billings_upd"
            ,optionalItems: ["is_posted","billing_class_id"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayBillings();
            } 
        }); 
    });
    
    $("#btnDeleteBillings").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00014" 
               ,onComplete:function(data){
                     displayBillings();
               }
        });
    });
    
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