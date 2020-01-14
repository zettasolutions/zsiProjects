var employees = (function(){
    
    var  bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull
        ,_public            = {}
        ,gMdlOtherIncome    = "modalWindowOtherIncome"
        ,gMdlInactiveEmpl   = "modalWindowInactiveEmployee"
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
              id        : gMdlInactiveEmpl
            , sizeAttr  : "modal-lg"
            , title     : "Inactive Employee"
            , body      : gtw.new().modalBodyInactiveEmployee({gridInactive:"gridInactive",saveInactive:"saveInactive();",deleteInactive:"deleteInactive();"}).html()  
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
                    // {text: cb                      ,width:25           ,style:"text-align:center"
                    //     ,onRender : function(d){
                    //        return app.bs({name:"id"          ,type:"hidden"  ,value: app.svn (d,"id")})
                    //             + app.bs({name:"is_edited"   ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                    //             + app.bs({name:"inactive_type_code"  ,type:"hidden"    ,value: app.svn(d,"inactive_type_code") })
                    //             + app.bs({name:"inactive_data"       ,type:"hidden"    ,value: app.svn(d,"inactive_date") })
                    //             + (d !== null ? bs({name:"cb"  ,type:"checkbox"}) : "" );
                    //     }
                    // }
                    {text:"Employee ID"            ,width:75         ,style:"text-align:center"  
                        ,onRender : function(d){
                            return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn (d,"id")})
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"inactive_type_code"    ,type:"hidden"      ,value: app.svn(d,"inactive_type_code") })
                                 + app.bs({name:"inactive_data"         ,type:"hidden"      ,value: app.svn(d,"inactive_date") })
                                 + app.bs({name:"employee_id"           ,type:"input"       ,value: app.svn(d,"employee_id") });
                        } 
                    }
                    ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:200        ,style:"text-align:center"  }
                    ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:200        ,style:"text-align:center"  }
                    ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:75         ,style:"text-align:center"  }
                    ,{text:"Name Suffix"            ,type:"input"       ,name:"name_suffix"         ,width:105        ,style:"text-align:center"  }
                    ,{text:"Gender"                 ,type:"select"      ,name:"gender"              ,width:50         ,style:"text-align:center"  }
                    ,{text:"Civil Status"           ,type:"select"      ,name:"civil_status_code"   ,width:150        ,style:"text-align:center"  } 
                    ,{text:"Date Hired"                                                             ,width:100        ,style:"text-align:center"  
                         ,onRender: function(d){
                            return bs({name:"date_hired"   ,style:"text-align:center" ,type:"input"  ,value:app.svn(d,"date_hired").toShortDate()}); 
                        }
                    } 
                    ,{text:"Employement Type"       ,type:"select"      ,name:"empl_type_code"      ,width:150        ,style:"text-align:center"  }
                    ,{text:"Department"             ,type:"select"      ,name:"department_id"       ,width:200        ,style:"text-align:center"  }
                    ,{text:"Section"                ,type:"select"      ,name:"section_id"          ,width:200        ,style:"text-align:center"  }
                    ,{text:"Position"               ,type:"select"      ,name:"position_id"         ,width:200        ,style:"text-align:center"  }
                    ,{text:"Basic Pay"              ,type:"input"       ,name:"basic_pay"           ,width:150        ,style:"text-align:center"  }
                    ,{text:"Pay Type"               ,type:"select"      ,name:"pay_type_code"       ,width:150        ,style:"text-align:center"  }
                    ,{text:"SSS No."                ,type:"input"       ,name:"sss_no"              ,width:105        ,style:"text-align:center"  }
                    ,{text:"TIN"                    ,type:"input"       ,name:"tin"                 ,width:105        ,style:"text-align:center"  }
                    ,{text:"PhilHealth No."         ,type:"input"       ,name:"philhealth_no"       ,width:105        ,style:"text-align:center"  }
                    ,{text:"HMDF No."               ,type:"input"       ,name:"hmdf_no"             ,width:105        ,style:"text-align:center"  }
                    ,{text:"Account No."            ,type:"input"       ,name:"account_no"          ,width:105        ,style:"text-align:center"  }
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
                _this.find("input[name='date_hired']").datepicker({
                     pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                });
                _this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                _this.find("select[name='gender']").fillSelect({data: _genderOptions}); 
             
                _this.find("select[name='civil_status_code']").dataBind("civil_status");
                _this.find("select[name='empl_type_code']").dataBind("empl_types");
                _this.find("select[name='pay_type_code']").dataBind("pay_types");
                _zRow.find("[name='position_id']").dataBind({
                     sqlCode      : "P201" //position_sel
                    ,text         : "position_title"
                    ,value        : "position_id"
                }); 
                
                _zRow.find("[name='department_id']").dataBind({
                     sqlCode        : "D213" //dept_sect_sel 
                   // ,parameters    : {dept_sect_parent_id : this.val()} 
                    ,text           : "dept_sect_name"
                    ,value          : "dept_sect_id"
                    ,onChange : function(o){  
                        this.closest(".zRow").find("#section_id").dataBind({
                             sqlCode        : "D213" //dept_sect_sel
                             ,parameters    : {dept_sect_parent_id : o.data[o.index - 1].dept_sect_parent_id} 
                            ,text           : "dept_sect_name"
                            ,value          : "dept_sect_id"
                        }); 
                    }
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

    function displayInactiveEmployees(){
        var cb = bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridInactive").dataBind({
             sqlCode    : "E162"
            ,parameters : {"is_active" : "N"}
            ,width      : $(".zContainer").outerWidth()
            ,blankRowsLimit : 5
            ,dataRows   : [
                {text: cb                      ,width:25            ,style:"text-align:center"
                     ,onRender : function(d){
                        return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn (d,"id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                             + app.bs({name:"inactive_type_code"    ,type:"hidden"      ,value: app.svn(d,"inactive_type_code") })
                             + app.bs({name:"inactive_data"         ,type:"hidden"      ,value: app.svn(d,"inactive_date") })
                             + (d !== null ? bs({name:"cb"          ,type:"checkbox"}) : "" );
                     }
                }
                ,{text:"Employee ID"            ,type:"input"       ,name:"employee_id"         ,width:75         ,style:"text-align:center"}
                ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:200        ,style:"text-align:center"  }
                ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:200        ,style:"text-align:center"  }
                ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:75         ,style:"text-align:center"  
                    ,onRender : function(d){
                        return app.bs({name:"middle_name"           ,type:"input"   ,value: app.svn (d,"middle_name")})
                             + app.bs({name:"name_suffix"           ,type:"hidden"  ,value: app.svn (d,"name_suffix")})
                             + app.bs({name:"gender"                ,type:"hidden"  ,value: app.svn (d,"gender")})
                             + app.bs({name:"civil_status_code"     ,type:"hidden"  ,value: app.svn (d,"civil_status_code")})
                             + app.bs({name:"date_hired"            ,type:"hidden"  ,value: app.svn (d,"date_hired")})
                             + app.bs({name:"empl_type_code"        ,type:"hidden"  ,value: app.svn (d,"empl_type_code")})
                             + app.bs({name:"department_id"         ,type:"hidden"  ,value: app.svn (d,"department_id")})
                             + app.bs({name:"section_id"            ,type:"hidden"  ,value: app.svn (d,"section_id")})
                             + app.bs({name:"position_id"           ,type:"hidden"  ,value: app.svn (d,"position_id")})
                             + app.bs({name:"basic_pay"             ,type:"hidden"  ,value: app.svn (d,"basic_pay")})
                             + app.bs({name:"pay_type_code"         ,type:"hidden"  ,value: app.svn (d,"pay_type_code")})
                             + app.bs({name:"sss_no"                ,type:"hidden"  ,value: app.svn (d,"sss_no")})
                             + app.bs({name:"tin"                   ,type:"hidden"  ,value: app.svn (d,"tin")})
                             + app.bs({name:"philhealth_no"         ,type:"hidden"  ,value: app.svn (d,"philhealth_no")})
                             + app.bs({name:"hmdf_no"               ,type:"hidden"  ,value: app.svn (d,"hmdf_no")})
                             + app.bs({name:"account_no"            ,type:"hidden"  ,value: app.svn (d,"account_no")});
                    }   
                }
                ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:50         ,style:"text-align:center"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter1']").setCheckEvent("#gridInactive input[name='cb']");
                
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

    _public.saveInactive = function(){
       $("#gridInactive").jsonSubmit({
                 procedure: "employees_upd" 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveEmployees();
                    displayEmployees();
                }
        });
    };  

    _public.deleteInactive = function(){
        zsi.form.deleteData({
             code       : "ref-0005"
            ,onComplete : function(data){
                displayInactiveEmployees();
            }
        });   
    };  

    $("#btnInactive").click(function () {
        var g$mdl = $("#" + gMdlInactiveEmpl);
        $(".modal-title").text("Inactive Employee(s)");
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveEmployees();
        
    }); 
            
    $("#btnSave").click(function () {
       $("#grid").jsonSubmit({
                 procedure: "employees_upd" 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayEmployees();
                }
        });
    });
    

    return _public;

    
})();

                                   