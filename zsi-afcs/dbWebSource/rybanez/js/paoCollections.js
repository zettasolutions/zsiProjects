   var payment = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("PAO Collections");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayTransactions();
        displayPostedTransactions();
        $('.select2').select2();
        $("#nav-posted").find("#posted_date_from").datepicker({todayHighlight:true});
        $("#nav-posted").find("#posted_date_to").datepicker({todayHighlight:true});
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
        $("#single-default").dataBind({
            sqlCode      : "P1233" //pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
        });
    };
    
    function displayTransactions(){
        zsi.getData({
                 sqlCode    : "P1231" //payment_for_posting_sel
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             payment_date:  ""
                            ,inspector_id:  ""
                            ,route_code:    ""
                            ,from_location: ""
                            ,to_location:   ""
                            ,no_klm:        "Total Amount"
                            ,no_reg:        _tot.reg_no
                            ,no_stu:        _tot.stu_no
                            ,no_sc:         _tot.sc_no
                            ,no_pwd:        _tot.pwd_no
                            ,reg_amount:    _tot.reg
                            ,stu_amount:    _tot.stu
                            ,sc_amount:     _tot.sc
                            ,pwd_amount:    _tot.pwd
                            ,total_paid_amount: _tot.total
                            ,post_id:       ""
                            ,qr_id:         ""
                            ,driver:        ""
                            ,pao:           ""
                            ,vehicle_plate_no: ""
                    };
                    
                    d.rows.push(_total);
                    $("#gridTransactions").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 270
                        ,dataRows       : getDataRowsByStatus(1)
                        ,onComplete: function(o){
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                    }
                });

            }
        });
    }
    
    function displayPostedTransactions(fromDate,toDate){
        zsi.getData({
                 sqlCode    : "P1235" //payment_posted_sel
                ,parameters : {payment_date:(fromDate ? fromDate : ""),posted_date:(toDate ? toDate : "")} 
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = { reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                         payment_id:    ""
                        ,payment_date:  ""
                        ,inspector_id:  ""
                        ,route_code:    ""
                        ,from_location: ""
                        ,to_location:   ""
                        ,no_klm:        "Total Amount"
                        ,no_reg:        _tot.reg_no
                        ,no_stu:        _tot.stu_no
                        ,no_sc:         _tot.sc_no
                        ,no_pwd:        _tot.pwd_no
                        ,reg_amount:    _tot.reg
                        ,stu_amount:    _tot.stu
                        ,sc_amount:     _tot.sc
                        ,pwd_amount:    _tot.pwd
                        ,total_paid_amount: _tot.total
                        ,post_id:       ""
                        ,qr_id:         ""
                        ,driver:        ""
                        ,pao:           ""
                        ,vehicle_plate_no: ""
                        ,posted_date:   ""
                        ,company_code:  ""
                        ,created_by:    ""
                    };
                    
                    d.rows.push(_total);
                    $("#gridPostedTransactions").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 280
                        ,dataRows       : getDataRowsByStatus(2)
                        ,onComplete: function(o){
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            
                    }
                });
            }
        });
    }
    
    function getDataRowsByStatus(statusId){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
             {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
    		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
    		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
    		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
    		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
    		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
    		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
            ,{text: "Payment Date"                                                      ,width : 130          ,groupId : 1
                ,onRender: function(d){
                    return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date").toShortDates()    ,style : "text-align:center;"})
                        +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                }
            }
                            
        ];
        
        if(statusId === 2){
            _dataRows.push(                    
                {text: "Posted Date"                                                      ,width : 130          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "posted_date"          ,type: "input"     ,value: app.svn(d,"posted_date").toShortDates()    ,style : "text-align:center;"});
                    }
                }
            );
        }
        
        _dataRows.push(
             {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "PAO"                       ,name:"pao"                     ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Driver"                    ,name:"driver"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Inspector"                 ,name:"inspector_id"            ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Route"                     ,name:"route_code"              ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Distance"                  ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                ,onRender: function(d){
                    return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                }
            }
            ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                ,onRender: function(d){
                    return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                ,onRender: function(d){
                    return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                ,onRender: function(d){
                    return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                }
            }
            ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:center;"       ,groupId : 6
                ,onRender: function(d){
                    return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:center;" ,width : 60});
                }
            }
            ,{text: "Payment Type"               ,name:"payment_type"           ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 7}
                        
        );
        
        return _dataRows;
    }
    
    $("#btnSaveTransations").click(function () {
      $("#gridTransactions").jsonSubmit({
           procedure: "payment_posting_upd"
          ,notIncludes : ["payment_date","vehicle_plate_no","pao","driver","inspector_id","route_id","from_location","to_location","no_klm","no_reg","reg_amount","no_stu","stu_amount","no_sc","sc_amount","no_pwd","pwd_amount","total_paid_amount"]
          ,onComplete: function (data) {
              if(data.isSuccess===true) zsi.form.showAlert("alert");
              $("#gridTransactions").trigger("refresh");
              $("#gridTransactions").convertToTable(
                function($table){
                    console.log("$table",$table);
                    $("#ExcelgridTransactions").find("th").remove();
                    var mywindow = window.open('', 'PRINT');
                    mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;}</style></head><body>');
                    mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                    mywindow.document.write('<div style="text-align:center;"><h4>Run Date: '+gDate+'</h4></div>');
                    mywindow.document.write('<table style="border-collapse: collapse;">');
                    mywindow.document.write('<thead><tr><td colspan="9">&nbsp;</td><td colspan="2">Regular</td><td colspan="2">Student</td><td colspan="2">Senior</td><td colspan="2">PWD</td><td ></td><td></td></tr>');
                    mywindow.document.write('<tr><td>Date</td><td>Vehicle</td><td>PAO</td><td>Driver</td><td>Inspector</td><td>Route</td><td>From</td><td>To</td><td>Distance</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Total Amount</td><td>Payment Type</td></tr></thead>');
                    mywindow.document.write(document.getElementById("ExcelgridTransactions").innerHTML);
                    mywindow.document.write('</table></body></html>');
                    mywindow.document.close();
                    mywindow.focus();
                    mywindow.print();
                    mywindow.close();
                    return true;
                });
            }
        });
    });
    
    $("#btnFilterVal").click(function(){ 
        var _from = $.trim($("#posted_date_from").val()); 
        var _to = $.trim($("#posted_date_to").val()); 
            displayPostedTransactions(_from,_to);
    }); 

    $("#posted_date_from,#posted_date_to").on("keyup change",function(){
        if($(this).val() === "") {
            displayPostedTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        $("#posted_date_from").val("");
        $("#posted_date_to").val("");
        displayPostedTransactions();
    });
    
    
    return _pub;
})();                         