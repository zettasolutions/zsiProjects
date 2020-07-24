var employees = (function(){
    
    var  bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull
        ,_public            = {}
        ,gMdlOtherIncome    = "modalWindowOtherIncome"
        ,gMdlInactiveEmpl   = "modalWindowInactiveEmployee"
        ,gMdlInactiveType   = "modalWindowInactiveType"
        ,mdlImageEmpl       = "modalWindowImageEmployee"
        ,gSearchOption      = "" 
        ,gSearchValue       = ""
        ,gCustName          = ""
        ,gFullName          = ""
        ,gCanvas;
    
    zsi.ready = function(){
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Employees");
        displayEmployees();
        getTemplates();
        
        $("#search_option").fillSelect({
                data: [
                     { text: "First Name", value: "first_name" }
                    ,{ text: "Last Name", value: "last_name" }
                ]
                ,onChange : function(){
                    var _this = this;
                    gCustName = _this.val();
                    var _placeHolder = "";
                    if(_this.val() === "first_name") _placeHolder = "First Name";
                    else _placeHolder = "Last Name";
                    $("#searchVal").attr("placeholder", _placeHolder);
                    
                    if(_this.val() === "") $("#searchVal").attr("placeholder", "Enter Keyword"); 
                    $("#searchVal").val("");
                }
            });
            
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
        })
        .bsModalBox({
              id        : mdlImageEmpl
            , sizeAttr  : "modal-md"
            , title     : "Inactive Employee(s)"
            , body      : ""
            , footer    : gtw.new().modalBodyImageEmpl({onClickUploadImageEmpl:"employees.uploadImageEmpl();"}).html()  
        });
    }
    
    function displayEmployees(searchVal){
        var _clientId = app.userInfo.client_id;
        var cb = bs({name:"cbFilter1",type:"checkbox"}); 
            _genderOptions      =   [
                                         {text:"M"     ,value:"M"}
                                        ,{text:"F"     ,value:"F"}
                                    ]
           ,_inactiveTypeOptions =  [
                                         {text:"A"      ,value:"A"}
                                        ,{text:"B"      ,value:"B"}
                                    ] 
        ;                           
        $("#grid").dataBind({
                 sqlCode    : "E162"
                ,height     : $(window).height() - 265
                ,parameters  : {client_id : _clientId, search_val: (searchVal ? searchVal : ""),is_active : "Y"} 
                ,blankRowsLimit : 5
                ,dataRows   : [
                    { text:"Photo"             , width:40      , style:"text-align:center;" 
            		    ,onRender : function(d){ 
                            var mouseMoveEvent= "onmouseover='employees.mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='employees.mouseout();'";
                            var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='employees.showModalUploadEmplImage(" + svn(d,"id") +",\"" 
        		                           + svn(d,"emp_lfm_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                            return (d!==null ? html : "");
                        }
        		    }
        		    ,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                        ,onRender : function(d){
                                var _link = "<a href='javascript:void(0)' ' title='View' onclick='employees.showModalViewId(this,"+ app.svn (d,"employee_no") +", \""+ app.svn (d,"first_name") +"\", \""+ app.svn (d,"middle_name") +"\",\""+ app.svn (d,"last_name") +"\",\""+ app.svn (d,"name_suffix") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"position_id") +"\",\""+ app.svn (d,"emp_hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                                return (d !== null ? _link : "");
                        }
                    }
                    ,{text:"Employee No."            ,width:95         ,style:"text-align:center" ,sortColNo : 3 
                        ,onRender : function(d){
                            return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn(d,"id")})
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"client_id"             ,type:"hidden"      ,value: _clientId})
                                 + app.bs({name:"employee_no"           ,type:"input"       ,value: app.svn(d,"employee_no") });
                        } 
                    }
                    ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:150        ,style:"text-align:left" ,sortColNo : 4 }
                    ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:150        ,style:"text-align:left" ,sortColNo : 5}
                    ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:100        ,style:"text-align:center" ,sortColNo : 6}
                    ,{text:"Name Suffix"            ,type:"input"       ,name:"name_suffix"         ,width:80         ,style:"text-align:center"}
                    ,{text:"Gender"                 ,type:"select"      ,name:"gender"              ,width:50         ,style:"text-align:center"}
                    ,{text:"Civil Status"           ,type:"select"      ,name:"civil_status_code"   ,width:120        ,style:"text-align:left"} 
                    ,{text:"Date Hired"                                                             ,width:100        ,style:"text-align:left"  
                         ,onRender: function(d){
                            return bs({name:"date_hired"   ,style:"text-align:center" ,type:"input" ,value:app.svn(d,"date_hired").toShortDate()}); 
                        }
                    } 
                    ,{text:"Employement Type"       ,type:"select"      ,name:"empl_type_code"      ,width:180        ,style:"text-align:center"}
                    ,{text:"Department"             ,type:"select"      ,name:"department_id"       ,width:150        ,style:"text-align:center"}
                    ,{text:"Section"                                                                ,width:150        ,style:"text-align:center"  
                        ,onRender : function(d){
                            return app.bs({name:"section_id"            ,type:"select"      ,value: app.svn(d,"section_id")})
                                 + app.bs({name:"emp_hash_key"          ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")});
                                 
                        }
                    }
                    ,{text:"Position"               ,type:"select"      ,name:"position_id"         ,width:200        ,style:"text-align:center"}
                    ,{text:"Basic Pay"                                                              ,width:80         ,style:"text-align:right"
                        ,onRender: function(d){
                            return app.bs({name:"basic_pay"             ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"basic_pay"))       ,style : "text-align:right"});
                    }
                    }
                    ,{text:"Pay Type"               ,type:"select"      ,name:"pay_type_code"       ,width:90         ,style:"text-align:center"}
                    ,{text:"SSS No."                ,type:"input"       ,name:"sss_no"              ,width:105        ,style:"text-align:center"}
                    ,{text:"TIN"                    ,type:"input"       ,name:"tin"                 ,width:105        ,style:"text-align:center"}
                    ,{text:"PhilHealth No."         ,type:"input"       ,name:"philhealth_no"       ,width:105        ,style:"text-align:center"}
                    ,{text:"HMDF No."               ,type:"input"       ,name:"hmdf_no"             ,width:105        ,style:"text-align:center"}
                    ,{text:"Account No."            ,type:"input"       ,name:"account_no"          ,width:105        ,style:"text-align:center"}
                    ,{text:"No. of Shares"          ,type:"input"       ,name:"no_shares"           ,width:105        ,style:"text-align:center"}
                    ,{text:"Contact Name"           ,type:"input"       ,name:"contact_name"        ,width:105        ,style:"text-align:center"}
                    ,{text:"Contact Phone No."      ,type:"input"       ,name:"contact_phone_no"    ,width:105        ,style:"text-align:center"}
                    ,{text:"Contact Address"        ,type:"input"       ,name:"contact_address"     ,width:105        ,style:"text-align:center"}
                    ,{text:"Cotact Relation"        ,type:"select"      ,name:"contact_relation_id" ,width:105        ,style:"text-align:center"}
                    ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:60         ,style:"text-align:center" ,defaultValue:"Y"
                        
                    }
                    ,{text:"Other Income"           ,type:"input"                                   ,width:90         ,style:"text-align:center"
                        ,onRender : function(d){
                                var _link = "<a href='javascript:void(0)' ' onclick='employees.showModalEmp("+ app.svn (d,"id") +",\""+ app.svn (d,"last_name") +"\", \"" + " " +"\", \""+ app.svn (d,"first_name") +"\")'><i class='fas fa-link link'></i></a>";
                                return (d !== null ? _link : "")
                                    + app.bs({name:"inactive_type_code"    ,type:"hidden"      ,value: app.svn(d,"inactive_type_code")})
                                    + app.bs({name:"inactive_date"         ,type:"hidden"      ,value: app.svn(d,"inactive_date") });
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
                _this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                _this.find("select[name='gender']").fillSelect({data: _genderOptions});
                this.find(".zHeaders .item:nth-child(15) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });
                _this.find('[name="basic_pay"]').attr("readonly",true);
                _this.find("select[name='civil_status_code']").dataBind("civil_status");
                _this.find("select[name='empl_type_code']").dataBind("empl_types");
                _zRow.find("select[name='pay_type_code']").dataBind("pay_types");
                _zRow.find("[name='position_id']").dataBind({
                     sqlCode      : "P201" 
                    ,text         : "position_title"
                    ,value        : "position_id"
                    ,onChange     : function(d){
                        var  _info       = d.data[d.index - 1]
                            ,_basic_pay  = _info.basic_pay
                            ,_$zRow      = $(this).closest(".zRow");_$zRow.find('[name="basic_pay"]').val(_basic_pay);}
                }); 
                
                
                _zRow.find("[name='department_id']").dataBind({
                     sqlCode        : "D213"  
                    ,text           : "dept_sect_name"
                    ,value          : "dept_sect_id"
                    ,onChange : function(o){  
                        this.closest(".zRow").find("#section_id").dataBind({
                             sqlCode        : "D213"
                             ,parameters    : {dept_sect_parent_id : o.data[o.index - 1].dept_sect_parent_id} 
                            ,text           : "dept_sect_name"
                            ,value          : "dept_sect_id"
                        }); 
                    }
                });
                _this.find("select[name='contact_relation_id']").dataBind("relations");
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
                            _$this.closest(".zRow").find("[name='inactive_type_code']").val( $(this).val());    
                        });
                        _date.datepicker().change(function(){
                            _$this.closest(".zRow").find("[name='inactive_data']").val( $(this).val());    
                        });
                    } else {
                        _$this.closest(".zRow").find("[name='inactive_type_code']").val("");
                        _$this.closest(".zRow").find("[name='inactive_data']").val("");
                    }
                });
            }
        });
    }  
    
    function displayInactiveEmployees(){
        var _clientId = app.userInfo.client_id;
        var cb = bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridInactive").dataBind({
             sqlCode    : "E162"
            ,parameters : {client_id : _clientId,is_active : "N"}
            ,height     : 300
            ,dataRows   : [
                {text: cb                      ,width:25            ,style:"text-align:center"
                     ,onRender : function(d){
                        return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn (d,"id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                             + app.bs({name:"client_id"             ,type:"hidden"      ,value: _clientId})
                             + (d !== null ? bs({name:"cb"          ,type:"checkbox"}) : "");
                     }
                }
                ,{text:"Employee No."           ,type:"input"       ,name:"employee_no"         ,width:95         ,style:"text-align:center"}
                ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:200        ,style:"text-align:left"}
                ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:200        ,style:"text-align:left"}
                ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:75         ,style:"text-align:left"  
                    ,onRender : function(d){
                        return app.bs({name:"middle_name"           ,type:"input"   ,value: app.svn (d,"middle_name")})
                             + app.bs({name:"name_suffix"           ,type:"hidden"  ,value: app.svn (d,"name_suffix")})
                             + app.bs({name:"gender"                ,type:"hidden"  ,value: app.svn (d,"gender")})
                             + app.bs({name:"civil_status_code"     ,type:"hidden"  ,value: app.svn (d,"civil_status_code")})
                             + app.bs({name:"date_hired"            ,type:"hidden"  ,value: app.svn (d,"date_hired")})
                             + app.bs({name:"empl_type_code"        ,type:"hidden"  ,value: app.svn (d,"empl_type_code")})
                             + app.bs({name:"department_id"         ,type:"hidden"  ,value: app.svn (d,"department_id")})
                             + app.bs({name:"section_id"            ,type:"hidden"  ,value: app.svn (d,"section_id")})
                             + app.bs({name:"emp_hash_key"          ,type:"hidden"  ,value: app.svn (d,"emp_hash_key")})
                             + app.bs({name:"position_id"           ,type:"hidden"  ,value: app.svn (d,"position_id")})
                             + app.bs({name:"basic_pay"             ,type:"hidden"  ,value: app.svn (d,"basic_pay")})
                             + app.bs({name:"pay_type_code"         ,type:"hidden"  ,value: app.svn (d,"pay_type_code")})
                             + app.bs({name:"sss_no"                ,type:"hidden"  ,value: app.svn (d,"sss_no")})
                             + app.bs({name:"tin"                   ,type:"hidden"  ,value: app.svn (d,"tin")})
                             + app.bs({name:"philhealth_no"         ,type:"hidden"  ,value: app.svn (d,"philhealth_no")})
                             + app.bs({name:"hmdf_no"               ,type:"hidden"  ,value: app.svn (d,"hmdf_no")})
                             + app.bs({name:"account_no"            ,type:"hidden"  ,value: app.svn (d,"account_no")})
                             + app.bs({name:"no_shares"             ,type:"hidden"  ,value: app.svn (d,"no_shares")})
                             + app.bs({name:"contact_name"          ,type:"hidden"  ,value: app.svn (d,"contact_name")})
                             + app.bs({name:"contact_phone_no"      ,type:"hidden"  ,value: app.svn (d,"contact_phone_no")})
                             + app.bs({name:"contact_address"       ,type:"hidden"  ,value: app.svn (d,"contact_address")})
                             + app.bs({name:"contact_relation_id"   ,type:"hidden"  ,value: app.svn (d,"contact_relation_id")});
                    }   
                }
                ,{text:"Active?"                                                        ,width:50         ,style:"text-align:center"    ,defaultValue:"N"
                    ,onRender : function(d){
                        return app.bs({name:"is_active"             ,type:"yesno"       ,value: app.svn (d,"is_active")})
                             + app.bs({name:"inactive_type_code"    ,type:"hidden"      ,value: app.svn(d,"inactive_type_code")})
                             + app.bs({name:"inactive_data"         ,type:"hidden"      ,value: app.svn(d,"inactive_date")});
                     }
                }
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter1']").setCheckEvent("#gridInactive input[name='cb']");
                this.find("input").attr("readonly", true);
                
            }
        });
    }
    function displayOtherIncome(emdId){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridOtherIncome").dataBind({
             sqlCode        : "E208" 
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
                                + app.bs({name:"position_id"                    ,type:"hidden"       ,value: app.svn(d,"position_id")})
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
                this.find("[name='cbFilter']").setCheckEvent("#gridOtherIncome input[name='cb']");
                this.find("select[name='other_income_id']").dataBind({
                     sqlCode : "O198" 
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
                $("[name='amount']").maskMoney();

            }
        });
    }
    
    _public.showModalViewId = function (eL,id,firstName,middleName,lastName,nameSuffix,fileName,positionId,hashKey){
        var _frm = $("#frm_modalEmpoloyeeId");
        var _$position = $(eL).closest(".zRow").find('[name="position_id"] option[value="'+positionId+'"]').text();
        var _middleN = middleName? middleName + "." : "";
        var _suffixN = nameSuffix? nameSuffix + "." : "";
        var _imgFilename = fileName? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png";
        $("#previewImage").html("");
        _frm.find("#nameId").text(firstName+ " " +_middleN+ " " +lastName+ " " +_suffixN);
        _frm.find("#positionId").text(_$position);
        _frm.find("#idNo").text(pad(id));
        _frm.find("#imgFilename").attr("src", _imgFilename);
        $('#modalEmployeesId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:60,height:60}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
        gFullName = firstName+lastName;
        setTimeout(function(){
            html2canvas($("#printThis"),{
                onrendered: function(canvas){
                    $("#previewImage").append(canvas);
                    gCanvas = canvas;
                }
            });
        }, 100);
    };
    
    function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    }
    
    function pad(id) {
        var _str = id.toString();
        return _str.length < 3 ? pad("0" + _str, 3) : _str;
    }
    
    _public.showModalUploadEmplImage = function(emplId, name){
        employee_id = emplId;
        var m=$('#' + mdlImageEmpl);
        m.find(".modal-title").text("Image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("employee.");
            }
        ); 
    },
    _public.uploadImageEmpl = function(){
        var frm = $("#frm_" + mdlImageEmpl);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',
            type: 'POST',
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    $.get(base_url  + "sql/exec?p=dbo.image_file_employees_upd @employee_id=" + employee_id
                                    + ",@img_filename='employee." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageEmpl).modal('toggle');
                    });   
                }else
                    alert(data.errMsg);
            },
            error: errorHandler = function() {
                console.log("error");
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
    },
    _public.mouseover = function(filename){
        $("#user-box").css("display","block");
        $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _public.mouseout = function (){
        $("#user-box").css("display","none");
    }, 
    _public.showModalEmp  = function(emdId,lName,fName) {
        var g$mdl = $("#" + gMdlOtherIncome);
        g$mdl.find(".modal-title").html(" Other Income » " + lName + " " + fName);
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOtherIncome(emdId);
    },
    _public.deleteOtherIncome = function(){
        zsi.form.deleteData({
             code       : "ref-00019"
            ,onComplete : function(data){
                $("#gridOtherIncome").trigger("refresh");
              }
        });       
    },
    _public.onClickAdd = function(){
        $("#" + gMdlInactiveType).modal('hide');

    },
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
                displayOtherIncome(_$grid.data("emdId"));
            }
        });
    }, 
    _public.saveInactive = function(){
       $("#gridInactive").jsonSubmit({
                 procedure: "employees_upd" 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveEmployees();
                    displayEmployees();
                }
        });
    },  
    _public.deleteInactive = function(){
        zsi.form.deleteData({
             code       : "ref-0005"
            ,onComplete : function(data){
                displayInactiveEmployees();
            }
        });   
    };  
    
    //Buttons
    $("#btnInactive").click(function () {
        var g$mdl = $("#" + gMdlInactiveEmpl);
        $(".modal-title").text("Inactive Employee(s)");
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveEmployees();
        
    }); 
    
    $("#btnSave").click(function () {
        var _$grid = $("#grid");
        var _$basicPay = _$grid.find("input[name='basic_pay']");
            _$basicPay.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
        _$grid.jsonSubmit({
                 procedure: "employees_upd"
                ,optionalItems: ["is_active","position_id","pay_type_code","contact_relation_id","gender","civil_status_code","empl_type_code","department_id","section_id"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayEmployees();
                }
        });
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        displayEmployees(_searchVal);
    }); 
    $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
            displayEmployees(_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayEmployees();
        }
    });


    $("#btnResetVal").click(function(){
        displayEmployees();
    });
    
    document.getElementById("Print").onclick = function () {
        printCanvas();
    };

    function printCanvas(){  
        var _imgData = gCanvas.toDataURL("image/png");
        var _newImgData = _imgData.replace(/^data:image\/png/, "data:application/octet-stream");
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html><body>';
        windowContent += '<img src="' + _newImgData + '">';
        windowContent += '</body></html>';
        var printWin = window.open('','');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
    }
    
    $("#download").click(function() { 
        var _imgData = gCanvas.toDataURL("image/png");
        var _newImgData = _imgData.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#download").attr("download", ""+gFullName+"Id.png").attr("href", _newImgData);
    });
    
    return _public;

    
})();

                                                            