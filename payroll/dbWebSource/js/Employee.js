var employees = (function(){
    
    var  bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull
        ,_public            = {}
        ,gMdlOtherIncome    = "modalWindowOtherIncome"
        ,gMdlInactiveType   = "modalWindowInactiveType"
    ;
    
    zsi.ready = function(){
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Employees");
        displayEmployees();
        getTemplates();
    };
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlOtherIncome
            , sizeAttr  : "modal-md"
            , title     : "Other Income"
            , body      : gtw.new().modalBodyOtherIncome({grid:"gridOtherIncome",onClickSaveOtherIncome:"submitOtherIncome();"}).html()  
        })
        .bsModalBox({
              id        : gMdlInactiveType
            , sizeAttr  : "modal-md"
            , title     : "Inactive Type"
            , body      : gtw.new().modalBodyInactiveType({onClickAdd:"onClickAdd();"}).html()  
        });
        
    }
    
    function displayEmployees(){
        var cb = bs({name:"cbFilter1",type:"checkbox"}); 
            _genderOptions      =   [
                                         { text:"M"     ,value:"M"          }
                                        ,{ text:"F"     ,value:"F"          }
                                    ]
           ,_inactiveTypeOptions =  [
                                         {text:"A"      ,value:"A"          }
                                        ,{text:"B"      ,value:"B"          }
                                    ] 
        ;                           
        $("#grid").dataBind({
                 
                 sqlCode    : "E162"
                ,width      : $(".zContainer").outerWidth()
                ,blankRowsLimit : 5
                ,dataRows   : [
                     {text: cb                      ,width:25           ,style:"text-align:center"
                         ,onRender : function(d){
                            return bs({name:"id"          ,type:"hidden"  ,value: svn (d,"id")})
                                 + bs({name:"is_edited"   ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                 + bs({name:"inactive_type_code"  ,type:"hidden"    ,value: app.svn(d,"inactive_type_code") })
                                 + bs({name:"inactive_data"       ,type:"hidden"    ,value: app.svn(d,"inactive_date") })
                                 + (d !== null ? bs({name:"cb"  ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Employee ID"            ,type:"input"       ,name:"employee_id"         ,width:105        ,style:"text-align:center"}
                    ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:150        ,style:"text-align:left"  }
                    ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:150        ,style:"text-align:left"  }
                    ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:75         ,style:"text-align:center"}
                    ,{text:"Name Suffix"            ,type:"input"       ,name:"name_suffix"         ,width:105        ,style:"text-align:left"  }
                    ,{text:"Gender"                 ,type:"select"      ,name:"gender"              ,width:50         ,style:"text-align:left"  }
                    ,{text:"Civil Status"           ,type:"select"      ,name:"civil_status_code"   ,width:100        ,style:"text-align:left"  }
                    ,{text:"Date Hired"             ,type:"input"       ,name:"date_hired"          ,width:100        ,style:"text-align:left"  }
                    ,{text:"Employement Type"       ,type:"select"      ,name:"empl_type_code"      ,width:140        ,style:"text-align:left"  }
                    ,{text:"Department"             ,type:"select"      ,name:"department_id"       ,width:120        ,style:"text-alignleft"   }
                    ,{text:"Position"               ,type:"select"      ,name:"position_id"         ,width:120        ,style:"text-align:left"  }
                    ,{text:"Basic Pay"              ,type:"input"       ,name:"basic_pay"           ,width:105        ,style:"text-align:left"  }
                    ,{text:"Pay Type"               ,type:"select"      ,name:"pay_type_code"       ,width:105        ,style:"text-align:left"  }
                    ,{text:"SSS No."                ,type:"input"       ,name:"sss_no"              ,width:105        ,style:"text-align:left"  }
                    ,{text:"TIN"                    ,type:"input"       ,name:"tin"                 ,width:105        ,style:"text-align:left"  }
                    ,{text:"PhilHealth No."         ,type:"input"       ,name:"philhealth_no"       ,width:105        ,style:"text-align:left"  }
                    ,{text:"HMDF No."               ,type:"input"       ,name:"hmdf_no"             ,width:105        ,style:"text-align:left"  }
                    ,{text:"Account No."            ,type:"input"       ,name:"account_no"          ,width:105        ,style:"text-align:left"  }
                    ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:50         ,style:"text-align:center"    ,defaultValue:"Y"}
                    ,{text:"Other Income"           ,type:"input"                                   ,width:90         ,style:"text-align:center"
                        ,onRender : function(d){
                                var _link = "<a href='javascript:void(0)' ' onclick='employees.showModalEmp("+ app.svn (d,"employee_id") +",\""+ app.svn (d,"last_name") +"\", \"" + " " +"\", \""+ app.svn (d,"first_name") +"\")'><i class='fas fa-link link'></i></a>";
                                return (d !== null ? _link : "");
                            
                        }
                    }

            ]
            ,onComplete: function(){
                var _this = this;
                var _zRow = _this.find(".zRow");
                _this.find("input[name='date_hired']").datepicker();
                _this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                _this.find("select[name='gender']").fillSelect({data: _genderOptions}); 
                _this.find("select[name='civil_status_code']").dataBind("civil_status");
                _this.find("select[name='empl_type_code']").dataBind("empl_types");
                _this.find("select[name='pay_type_code']").dataBind("pay_types");
                _this.find("select[name='department_id']").dataBind("departments");
                _zRow.find("#position_id").dataBind({
                     sqlCode      : "P201" //position_sel
                    ,text         : "position_title"
                    ,value        : "position_id"
                });
                
                _zRow.find("[name='is_active']").change(function(){
                    var _$this = $(this);
                    if(_$this.val() === "N"){
                        var g$mdl = $("#" + gMdlInactiveType);
                        var _inactiveTypeCode = g$mdl.find("select[name='inactive_type_code']");
                        var _date = g$mdl.find("input[name='inactive_date']");
                        g$mdl.find(".modal-title").html(" Inactive Type");
                        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                        _inactiveTypeCode.fillSelect({data: _inactiveTypeOptions});
                        _inactiveTypeCode.change(function(){
                            _$this.closest(".zRow").find("#inactive_type_code").val( $(this).val() );    
                        });
                        _date.datepicker().change(function(){
                            _$this.closest(".zRow").find("#inactive_data").val( $(this).val() );    
                        });
                    } else {
                        _$this.closest(".zRow").find("#inactive_type_code").val("");    
                        _$this.closest(".zRow").find("#inactive_data").val("");    
                    }
                });
            }
        });
    }  

    function displayOtherIncome(emdId){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridOtherIncome").dataBind({
             sqlCode        : "E208" //emp_pos_other_income_sel
            ,parameters     : {employee_id : emdId}
            ,blankRowsLimit : 5
            ,width          : $("#frm_modalWindowOtherIncome").width() 
            ,height         : 360
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"emp_pos_other_income_id"        ,type:"hidden"       ,value: app.svn(d,"emp_pos_other_income_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"employee_id"                    ,type:"hidden"       ,value: emdId})
                                + app.bs({name:"position_id"                    ,type:"hidden"       ,value: app.svn(d,"position_id") })
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Other Income"          ,name:"other_income_id"         ,type:"select"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Amount"                                                                     ,width : 95    ,style : "text-align:right;"
                    ,onRender: function(d){
                        return (d !== null ? bs({name: "amount"   ,type: "input"  ,value: parseFloat(app.svn(d,"amount")).toFixed(2) }) : bs({name: "amount"   ,type: "input"  ,value: app.svn(d,"amount") }) );
                    }
                }
    
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("#cbFilter").setCheckEvent("#gridOtherIncome input[name='cb']");
                this.find("select[name='other_income_id']").dataBind({
                     sqlCode : "O198" //other_income_sel 
                    ,text: "other_income_desc"
                    ,value: "other_income_id" 
                });
                this.data("emdId",emdId);
                this.find("input[name='amount']").css({"text-align":"right", "margin-left": "-5px"});
                this.find(".zHeaders .item:last(child) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });

            }
        });
    } 

    _public.showModalEmp  = function(emdId,lName,fName) {
        var g$mdl = $("#" + gMdlOtherIncome);
        g$mdl.find(".modal-title").html(" Other Income » " + lName + " " + fName);
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOtherIncome(emdId);
    };
 
    _public.deleteOtherIncome = function(){
        zsi.form.deleteData({
             code       : "ref-00019"
            ,onComplete : function(data){
                $("#gridOtherIncome").trigger("refresh");
              }
        });       
    };
        
    _public.onClickAdd = function(){
        $("#" + gMdlInactiveType).modal('hide');

    };
    
    _public.submitOtherIncome = function(){
        var _$grid = $("#gridOtherIncome");
            _$grid.jsonSubmit({
                 procedure: "emp_pos_other_income_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayOtherIncome(_$grid.data("emdId"));
                }
            });
    }; 
            
    $("#btnSave").click(function () {
       $("#grid").jsonSubmit({
                 procedure: "employees_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayEmployees();
                }
        });
    });
    $("#btnAdd").click(function(){
        console.log("agi");
    });
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0005"
            ,onComplete : function(data){
                displayEmployees();
            }
        });   
    });  

    return _public;

    
})();

                         