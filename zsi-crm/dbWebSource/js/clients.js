 var client = (function(){
    var  _pub               = {}
        ,gClientId          = null
        ,gId                = null
        ,gBatchNoVal        = null
        ,gBatchQty          = null
        ,gClientContractid  = null
        ,gActiveTab         = ""
        ,gCtr               = 1
        ,gLogon             = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Clients");
        $(":input").inputmask();
        gActiveTab = "search";
        $('#keyWord').select2({placeholder: "SELECT KEY WORD",allowClear: true});
        $("#contractsDiv").hide();
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href"); 
        switch(target){
            case "#nav-company-information":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
            case "#nav-documents":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
            case "#nav-admin-information":
                    $('#popEmailAdd').popover("hide", 400);
                    $('#popLogonAdd').popover("hide", 400);
                break;
          default:break; 
        } 
    });
    
    function displayClientContracts(keyword,searchVal){
        var _ctr = 1;
        $("#gridClientContracts").dataBind({
                 sqlCode        : "C1284"
                ,parameters     : {keyword:keyword? keyword: "",search_val: searchVal? searchVal: ""} 
                ,height         : $(window).height() - 276
                ,dataRows       : [
                    { text  : "" , width : 25                                               ,style : "text-center" 
                        ,onRender  :  function(d)  
                            { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"    ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                    }
                    ,{text: "Line No."         ,width:60                                    ,style:"text-align:center"
                         ,onRender : function(d){
                             return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   app.bs({name:"client_name"                  ,type:"hidden"                  ,value: app.svn(d,"client_name")})
                                +   app.bs({name:"client_phone_no"              ,type:"hidden"                  ,value: app.svn(d,"client_phone_no")})
                                +   app.bs({name:"client_mobile_no"             ,type:"hidden"                  ,value: app.svn(d,"client_mobile_no")})
                                +   app.bs({name:"client_email_add"             ,type:"hidden"                  ,value: app.svn(d,"client_email_add")})
                                +   app.bs({name:"billing_address"              ,type:"hidden"                  ,value: app.svn(d,"billing_address")})
                                +   app.bs({name:"country_id"                   ,type:"hidden"                  ,value: app.svn(d,"country_id")})
                                +   app.bs({name:"state_id"                     ,type:"hidden"                  ,value: app.svn(d,"state_id")})
                                +   app.bs({name:"city_id"                      ,type:"hidden"                  ,value: app.svn(d,"city_id")})
                                +   app.bs({name:"client_tin"                   ,type:"hidden"                  ,value: app.svn(d,"client_tin")})
                                +   app.bs({name:"logon"                        ,type:"hidden"                  ,value: app.svn(d,"logon")})
                                +   app.bs({name:"last_name"                    ,type:"hidden"                  ,value: app.svn(d,"last_name")})
                                +   app.bs({name:"first_name"                   ,type:"hidden"                  ,value: app.svn(d,"first_name")})
                                +   app.bs({name:"middle_name"                  ,type:"hidden"                  ,value: app.svn(d,"middle_name")})
                                +   app.bs({name:"name_suffix"                  ,type:"hidden"                  ,value: app.svn(d,"name_suffix")})
                                +   app.bs({name:"bill_to"                      ,type:"hidden"                  ,value: app.svn(d,"bill_to")})
                                +   app.bs({name:"client_id"                    ,type:"hidden"                  ,value: app.svn(d,"client_id")})
                                +   app.bs({name:"is_fmis"                      ,type:"hidden"                  ,value: app.svn(d,"is_fmis")})
                                +   app.bs({name:"is_hcm"                       ,type:"hidden"                  ,value: app.svn(d,"is_hcm")})
                                +   app.bs({name:"is_afcs"                      ,type:"hidden"                  ,value: app.svn(d,"is_afcs")})
                                +   app.bs({name:"is_ct"                        ,type:"hidden"                  ,value: app.svn(d,"is_ct")})
                                +   app.bs({name:"is_afcs"                      ,type:"hidden"                  ,value: app.svn(d,"is_afcs")})
                                +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: app.svn(d,"client_contract_id")})
                                +   app.bs({name:"contract_no"                  ,type:"hidden"                  ,value: app.svn(d,"contract_no")})
                                +   app.bs({name:"contract_date"                ,type:"hidden"                  ,value: app.svn(d,"contract_date").toShortDate()})
                                +   app.bs({name:"contract_term_id"             ,type:"hidden"                  ,value: app.svn(d,"contract_term_id")})
                                +   app.bs({name:"activation_date"              ,type:"hidden"                  ,value: app.svn(d,"activation_date").toShortDate()})
                                +   app.bs({name:"expiry_date"                  ,type:"hidden"                  ,value: app.svn(d,"expiry_date").toShortDate()})
                                +   app.bs({name:"plan_id"                      ,type:"hidden"                  ,value: app.svn(d,"plan_id")})
                                +   app.bs({name:"plan_qty"                     ,type:"hidden"                  ,value: app.svn(d,"plan_qty")})
                                +   app.bs({name:"srp_amount"                   ,type:"hidden"                  ,value: app.svn(d,"srp_amount")})
                                +   app.bs({name:"dp_amount"                    ,type:"hidden"                  ,value: app.svn(d,"dp_amount")})
                                +   _ctr++;
                         }
                     }
                    ,{text:"Client Name"                                                                    ,width:250          ,style:"text-align:left;text-transform:capitalize;"
                        ,onRender      : function(d) {
                            var _clientName = (app.svn(d,"client_name") ? app.svn(d,"client_name") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                            return "<a  style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='client.showModalClients(this);'>" + _clientName + "</a>";
                        }
                    }
                    ,{text:"Contract Number"            ,type:"input"       ,name:"contract_no"             ,width:150          ,style:"text-align:center"
                        ,onRender      : function(d) {
                            var _contractNo = (app.svn(d,"contract_no") ? app.svn(d,"contract_no") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                            return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='client.showModalContracts(this);'><span>" + _contractNo + "</span></a>";
                        }
                    }
                    ,{text:"Contract Date"                                                                          ,width:100           ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"contract_date"                    ,type:"input"                  ,value: app.svn(d,"contract_date").toShortDate()});
                         }
                    }
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
                    var _zRow  = _this.find(".zRow");
                    
                    _zRow.find("input[type='radio']").click(function(){
                        var _zRow   = $(this).closest(".zRow");
        	            var _i      = _zRow.index();
        	            var _data   = _dRows[_i];
        	            $("#btnNewContracts").attr("onclick", "client.showModalContracts("+_zRow.find("a")+")");
                    });
                    
                    if(_dRows.length >= 1) $('#popSearch').popover("hide", 400);
                    else $('#popSearch').popover("show", 400);
                }
        });
    
    }
    
    function displayClientContractDevice(client_contract_id,qty){
        zsi.getData({
             sqlCode    : "C272" 
            ,parameters  : {client_contract_id: client_contract_id} 
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _ctr = 1;
                
                $("#gridContractss").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 395
                    ,blankRowsLimit : (qty? qty - _rows.length : 0)
                    ,dataRows       : [
                         {text: "Item No."         ,width:60                   ,style:"text-align:center"
                             ,onRender : function(d){
                                 return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                    +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                    +   _ctr++;
                             }
                         }
                        ,{text:"Subscription No."                                                                 ,width:140          ,style:"text-align:left"
                            ,onRender : function(d){
                                 return app.bs({name:"subscripton_no"               ,type:"input"                   ,value: app.svn(d,"subscripton_no")}) 
                                    +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: (app.svn(d,"client_contract_id")? app.svn(d,"client_contract_id") : client_contract_id)});
                             }
                        }
                        ,{text:"Device"                     ,type:"select"       ,name:"device_id"              ,width:130          ,style:"text-align:left"}
                        ,{text:"Unit Assignment"            ,type:"input"        ,name:"unit_assignment"        ,width:130           ,style:"text-align:center"}
                      ]
                    ,onComplete : function(){
                        var _this = this;
                        
                        if (!qty){
                            _this.find("input").attr("disabled",true);
                            _this.find("select").attr("disabled",true);
                        }
                        _this.find("input,select").prop('required',true);
                        _this.find(".zRow").find("[name='device_id']").dataBind({
                            sqlCode      : "D276"
                           ,text         : "serial_no"
                           ,value        : "device_id"
                        });
                        
                    }
                });
            }
        });
    }
    
    function displayClientsPlanInclusions(planId){
        var _ctr = 1;
        $("#gridContracts").dataBind({
             sqlCode     : "C1294"
            ,parameters  : {plan_id: planId}
            ,height      : $(window).height() - 395
            ,dataRows    : [
                {text: "Item No."               ,width: 60      ,style:"text-align:center"
                     ,onRender : function(d){
                         return _ctr++;
                     }
                 }
                ,{text: "Product Name"          ,width: 200     ,style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"product_name");
                    }
                }
                ,{text: "Product Description"   ,width: 260     ,style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"product_desc");
                    }
                }
                ,{text: "Device Brand"          ,width: 120     ,style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"device_brand_name");
                    }
                }
                ,{text: "Device Type"           ,width: 120     ,style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"device_type");
                    }
                }
                
            ]
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
    
    function checkValueExist(tableName,colName,keyWord,inputId){
        zsi.getData({
             sqlCode    : "C1295" 
            ,parameters  : {table_name: tableName, colname: colName, keyword: keyWord} 
            ,onComplete : function(d) {
                var _rows= d.rows;
                if(_rows.length >= 1) {
                    $(inputId).val("");
                    if(inputId === "#client_email_add"){ 
                        $('#popEmailAdd').popover("show", 400);
                        setTimeout(function(){
                            $('#popEmailAdd').popover("hide", 400);
                        },2000);
                    }else{ 
                        $('#popLogonAdd').popover("show", 400);
                        setTimeout(function(){
                            $('#popLogonAdd').popover("hide", 400);
                        },2000);
                    }
                    
                }
            }
        });
    }
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    function clicked(){
        setTimeout(function(){
            $("#gridClientContracts").find("span").parent("a").click();
        },500);
        
    }
    
    function randomPassword(){
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < 10; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }
    
    function encryptedPassword(password){
        var url = base_url + "account/getnewpassword?pwd=" + password;
        
        $.get(url,function(data){
           $("#password").val(data);
        });
    }
    
    function getParams(element){
        var _zRow = $(element).closest(".zRow");
        
        return {
              clientContractId   : _zRow.find("[name='client_contract_id']").val()
            , clientName         : _zRow.find("[name='client_name']").val()
            , clientId           : _zRow.find('[name="client_id"]').val()
            , contractDate       : _zRow.find('[name="contract_date"]').val()
            , contractTermId     : _zRow.find('[name="contract_term_id"]').val()
            , activationDate     : _zRow.find('[name="activation_date"]').val()
            , expiryDate         : _zRow.find('[name="expiry_date"]').val()
            , planId             : _zRow.find('[name="plan_id"]').val()
            , planQty            : _zRow.find('[name="plan_qty"]').val()
            , srpAmt             : _zRow.find('[name="srp_amount"]').val()
            , dpAmt              : _zRow.find('[name="dp_amount"]').val()
            , clientPhoneNo      : _zRow.find('[name="client_phone_no"]').val()
            , clientMobileNo     : _zRow.find('[name="client_mobile_no"]').val()
            , clientEmailAdd     : _zRow.find('[name="client_email_add"]').val()
            , billingAdd         : _zRow.find('[name="billing_address"]').val()
            , countryId          : _zRow.find('[name="country_id"]').val()
            , stateId            : _zRow.find('[name="state_id"]').val()
            , cityId             : _zRow.find('[name="city_id"]').val()
            , clientTin          : _zRow.find('[name="client_tin"]').val()
            , logon              : _zRow.find('[name="logon"]').val()
            , lastName           : _zRow.find('[name="last_name"]').val()
            , firstName          : _zRow.find('[name="first_name"]').val()
            , middleName         : _zRow.find('[name="middle_name"]').val()
            , nameSuffix         : _zRow.find('[name="name_suffix"]').val()
            , isFmis             : _zRow.find('[name="is_fmis"]').val()
            , isHcm              : _zRow.find('[name="is_hcm"]').val()
            , isAfcs             : _zRow.find('[name="is_afcs"]').val()
            , isCt               : _zRow.find('[name="is_ct"]').val()
            , billTo             : _zRow.find('[name="bill_to"]').val()
            , contractNo         : _zRow.find('[name="contract_no"]').val()
        };
    }
    
    _pub.showModalContracts = function (eL) {
        var _$mdl = $('#modalClientContracts');
        var _o = getParams(eL);
        var _noMos = 0.00
           ,_interest = 0.00
           ,_productSrp = _o.srpAmt? _o.srpAmt : 0.00
           ,_productDp = _o.dpAmt? _o.dpAmt : 0.00
           ,_planId = _o.planId? _o.planId : null
           ,_keyup = "";
        _$mdl.find("#monthly_amort_amount,#total_amort_amount,#less_dp_amount,#srp_amount,#dp_amount").val(0.00);
        $("#plan_id,#contract_term_id").off();
        _$mdl.find("#dp_amount").maskMoney({allowZero:true});
        gActiveTab = "search";
        gClientContractid = _o.clientContractId;
        
        $("#modalTitle").text(_o.clientName  + (_o.contractNo ? " | " + _o.contractNo : ""));
        $('#plan_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $('#contract_term_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        
        _$mdl.find("#dp_amount").on('keyup change', function(){
           $(this).each(function(){_productDp = parseFloat(this.value.replace(/,/g, ""));});
           _keyup = 'keyup';
           totalAmt();
        });
         
        $("#contract_term_id").dataBind({
            sqlCode      : "D1291"
           ,text         : "term_code"
           ,value        : "term_id"
           ,onComplete   : function(d){
               this.val(_o.contractTermId? _o.contractTermId : "").trigger('change');
           }
           ,onChange     : function(d){
               var  _$this         = $(this)
                   ,_info          = d.data[d.index - 1];
                   
               _noMos     = isUD(_info) ? 0 : _info.no_months;
               _interest  = isUD(_info) ? 0 : _info.interest_pct;
               totalAmt();
           }
        });
         
        $("#plan_id").dataBind({
            sqlCode      : "D256"
           ,text         : "plan_name"
           ,value        : "plan_id"
           ,onChange     : function(d){
                var  _$this         = $(this)
                    ,_info          = d.data[d.index - 1];
                    
                _planId       = isUD(_info) ? ""   : _info.plan_id;       
                _productSrp   = isUD(_info) ? 0.00 : _info.plan_srp;
                _productDp    = isUD(_info) ? 0.00 : _info.plan_dp;
                totalAmt();
                
                displayClientsPlanInclusions(_planId);
                
           }
           ,onComplete   : function(){
               this.val(_planId).trigger('change');
           }
        });
        
        function totalAmt(){
            setTimeout(function(){
                var  lessDpAmt          = commaSeparateNumber(_productSrp - _productDp)
                    ,totalAmortAmt      = commaSeparateNumber((_interest/100 * _productSrp) + _productSrp)
                    ,monthlyAmortAmt    = commaSeparateNumber((_interest/100 * _productSrp) + _productSrp/_noMos);
                
                
               _$mdl.find("#srp_amount").val(commaSeparateNumber(_productSrp));
               if(!_keyup) _$mdl.find("#dp_amount").val(commaSeparateNumber(_productDp));
               _$mdl.find("#less_dp_amount").val(lessDpAmt? lessDpAmt : 0.00);
               _$mdl.find("#total_amort_amount").val(totalAmortAmt? totalAmortAmt : 0.00);
               _$mdl.find("#monthly_amort_amount").val(monthlyAmortAmt? monthlyAmortAmt : "0.00");
            },500);
        }
        
        $("input[name$='date']").datepicker({ pickTime:false,autoclose:true,todayHighlight:true}).datepicker("setDate","0");  
        _$mdl.find("#client_contract_id").val(_o.clientContractId? _o.clientContractId: "");
        _$mdl.find("#contract_no").val(_o.contractNo? _o.contractNo : "");
        _$mdl.find("#contract_date").datepicker("setDate", _o.contractDate? _o.contractDate : "0");
        _$mdl.find("#activation_date").datepicker("setDate", _o.activationDate? _o.activationDate : "0");
        _$mdl.find("#expiry_date").datepicker("setDate", _o.expiryDate? _o.expiryDate : "0");
        _$mdl.find("#client_id").val(_o.clientId? _o.clientId : "");
        _$mdl.find("#plan_qty").val(_o.planQty? _o.planQty : "");
        
        _$mdl.modal('show');
        //gBatchNoVal = clientContractId;
    };
    
   _pub.showModalClients = function (eL) {
        var _$mdl = $('#newClientModal');
        var _o = getParams(eL);
        var _frm = $("#formClientsStep2");
        gActiveTab = "new";
        $(".popover ").hide();
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id');
        gId = _o.clientId;
        $("input[type='checkbox']").prop("checked",false);
        if(_o.isFmis === 'Y'){ $("#is_fmis").prop("checked",true); _frm.find("[name='is_fmis']").val('Y');}
        if(_o.isHcm === 'Y'){ $("#is_hcm").prop("checked",true);_frm.find("[name='is_hcm']").val('Y');}
        if(_o.isAfcs === 'Y'){ $("#is_afcs").prop("checked",true);_frm.find("[name='is_afcs']").val('Y');}
        if(_o.isCt === 'Y'){ $("#is_ct").prop("checked",true);_frm.find("[name='is_ct']").val('Y');}
        $("#formClientsStep1One").removeClass('was-validated');
        $("#formClientsStep2").removeClass('was-validated');
        _$mdl.find("#client_name").val(_o.clientName? _o.clientName : "");
        _$mdl.find("#client_phone_no").val(_o.clientPhoneNo? _o.clientPhoneNo : "");
        _$mdl.find("#client_mobile_no").val(_o.clientMobileNo? _o.clientMobileNo : "");
        _$mdl.find("#client_email_add").val(_o.clientEmailAdd? _o.clientEmailAdd : "");
        _$mdl.find("#billing_address").val(_o.billingAdd? _o.billingAdd : "");
        _$mdl.find("#client_tin").val(_o.clientTin? _o.clientTin : "");
        _$mdl.find("#bill_to").val(_o.billTo? _o.billTo : "");
        _$mdl.find("#clientIds").val(_o.clientId? _o.clientId : "");
        _$mdl.find("#logon").val(_o.logon? _o.logon : "");
        _$mdl.find("#last_name").val(_o.lastName? _o.lastName : "");
        _$mdl.find("#first_name").val(_o.firstName? _o.firstName : "");
        _$mdl.find("#middle_name").val(_o.middleName? _o.middleName : "");
        _$mdl.find("#name_suffix").val(_o.nameSuffix? _o.nameSuffix : "");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        gLogon = _o.logon;
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").dataBind({
             sqlCode     : "D281"
            ,text        : "bank_name"
            ,value       : "bank_id"
        });
        _$country.dataBind({
            sqlCode     : "D247"
            ,text       : "country_name"
            ,value      : "country_id"
            ,onComplete : function(){
                this.val(_o.countryId? _o.countryId : 139).trigger("change");
            }
            ,onChange   : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                _$state.dataBind({
                     sqlCode    : "D248"
                    ,parameters : {country_id:country_id}
                    ,text       : "state_name"
                    ,value      : "state_id"
                    ,onComplete : function(){
                        this.val(_o.stateId? _o.stateId : "").trigger("change");
                    }
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                             sqlCode      : "D246"
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id"
                            ,onComplete : function(){
                                this.val(_o.cityId? _o.cityId : "").trigger("change");
                            }
                        });
                    }
                });
            }
        });
        
        _$mdl.modal('show');
    };
    
    $("#is_ready").click(function(){
        var _$this = $(this);
        var _$frmStep1 = $("#formClientsStep1One");
            _$frmStep2 = $("#formClientsStep2");
        var _frmStep1 = _$frmStep1[0];
            _frmStep2 = _$frmStep2[0];
            
        if(_$this.is(":checked")){
            if( ! _frmStep1.checkValidity()){
                _$frmStep1.addClass('was-validated');
                _$this.prop('checked', false);
            }else{   
                $("#clientInformationDiv").hide(600);
                $("#adminUserDiv").show(600);
            }
        }else{
            if( ! _frmStep2.checkValidity()){
                _$frmStep2.addClass('was-validated');
                $("#formClientsCB").addClass('was-validated');
                $("#clientInformationDiv").show(600);
                $("#adminUserDiv").hide(600);
            }else{ 
                _$frmStep1.addClass('was-validated');
                $("#formClientsCB").removeClass('was-validated');
                $("#clientInformationDiv").show(600);
                $("#adminUserDiv").hide(600);
            }
        } 
    });
    
    $("#client_email_add,#logon").on("change", function(){
        var _colName    = $(this)[0].id;
        var _clientEmailAdd = $("#client_email_add").val();
        var _logonEmailAdd = $("#client_email_add").val();
        
        if(_colName === "client_email_add") checkValueExist("clients","client_email_add",_clientEmailAdd,"#client_email_add");
        else checkValueExist("users","logon",_logonEmailAdd,"#logon");
    });
    
    $('#keyWord').on("keyup change", function(){
        var _this = $(this);
        if(_this.val() === "client_name"){
            $("#keyValue").attr("placeholder", "Enter Client Name......");
            $("#keyValue").val("");
        }
        else{
            $("#keyValue").val("");
            $("#keyValue").attr("placeholder", "Enter Contract No......");
        }
    });
    
    $("#searchOption").on("change", function(){
        var _this = $(this);
        if(_this.val() === "name") $("#searchVal").attr("placeholder", "Type client name......");
        else $("#searchVal").attr("placeholder", "Type contract number......");
    });
    
    $("#submit").click(function () {
        var _$frm = $("#formContract");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            _$frm.addClass('was-validated');
        }else{   
            _$frm.removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
    
    $("#viewImg1,#viewImg2,#viewImg3,#viewImg4").click(function(){
       var _colName = $(this)[0].id;
       var _link = base_url + 'dbimage/ref-00012/client_id/';
       var _img = "";
       if(_colName === "viewImg1"){
           _img = _link + gId + "/mayor_permit_img";
           
           $("#viewImg1").attr("href", _img);
       }else if(_colName === "viewImg2"){
           _img = _link + gId + "/bir_img";
           
           $("#viewImg2").attr("href", _img);
       }else if(_colName === "viewImg3"){
           _img = _link + gId + "/sec_dti_img";
           
           $("#viewImg3").attr("href", _img);
       }else{
           _img = _link + gId + "/company_logo";
           
           $("#viewImg4").attr("href", _img);
       }
    });
    
    $("#is_fmis,#is_hcm,#is_afcs,#is_ct").click(function(){
       var _colName = $(this)[0].id; 
       var _$div = $("#nav-admin-information");
       
       if($("#"+_colName).is(':checked')) _$div.find("[name='"+_colName+"']").val("Y");
       else _$div.find("[name='"+_colName+"']").val("N");
       
    });
    
    $("#btnSubmit").click(function(){
        var _$frmStep1 = $("#formClientsStep1One")
            ,_$frmStep2 = $("#formClientsStep2");
        var _$clientId = $("#clientIds").val();
        
        var _frmStep1 = _$frmStep1[0]
            ,_frmStep2 = _$frmStep2[0];
            
        $('#pop1').popover("hide", 400);
        $('#pop2').popover("hide", 400);
        if( ! _frmStep1.checkValidity()){
            _$frmStep1.addClass('was-validated');
            $('#pop1').popover("show", 400);
        }else if( ! _frmStep2.checkValidity()){
            if(_$clientId) $('#myModal').modal('show');
            else{
                _$frmStep2.addClass('was-validated');
                $('#pop2').popover("show", 400);
            }
        }else $('#myModal').modal('show');
        
    });
    
    $(".continuecancel").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
        $(".continuecancel").addClass("hide");
         setTimeout(function(){
            $("#btnConfirm").removeAttr("onclick");
        },1000);
        
    });
    
    $("#btnSave").click(function (){
        if(gActiveTab === "search"){
            var _frm = $("#formContract");
            _frm.find("#srp_amount,#dp_amount").maskMoney('destroy');
            var _$monthlyAmort = _frm.find("#monthly_amort_amount")
                ,_$totalAmort = _frm.find("#total_amort_amount")
                ,_$lessDpAmt = _frm.find("#less_dp_amount")
                ,_$srpAmt = _frm.find("#srp_amount")
                ,_$dpAmt = _frm.find("#dp_amount");
                
                _$monthlyAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$totalAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$lessDpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                _$srpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                _$dpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
            
            
            _frm.jsonSubmit({
                 procedure: "client_contracts_upd"
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    gBatchNoVal = data.returnValue;
                    gBatchQty = $("#formContract").find("#device_qty").val();
                    if(data.isSuccess){
                      if(data.isSuccess===true) zsi.form.showAlert("alert");
                      $("#gridClientContracts").trigger("refresh");
                      $("#formContract").find("#batchId").text(gBatchNoVal);
                      $("#myModal").find("#msg").text("Data successfully saved.");
                      $("#myModal").find("#msg").css("color","green");
                      modalTxt();
                      setTimeout(function(){
                          $("#myModal").modal('toggle');
                      },1000);
                    }else{
                      $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                      $("#myModal").find("#msg").css("color","red");
                      modalTxt();
                    }
                }
            }); 
        }else{
            $("#formClientsStep1One").jsonSubmit({
                 procedure: "clients_upd" 
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    var _$clientId = $("#clientIds").val();
                    var _clientName = $("#client_name").val();
                    var _password = randomPassword();
                    encryptedPassword(_password);
                    gClientId = data.returnValue;
                    if(data.isSuccess){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        $("#formClientsStep2").find("#clientId").val(_$clientId);
                        $("#gridClientContracts").trigger("refresh");
    			        setTimeout(function(){
    			            if(_$clientId === ""){
    			                $("#formClientsStep2").find("#clientId").val(gClientId ? gClientId: "");
    			                $("#newClientModal").modal('toggle');
            			        $("#formClientsStep2").jsonSubmit({
                                     procedure: "admin_user_upd" 
                                    ,isSingleEntry: true
                                    ,onComplete: function (data) {
                                        var _userId = data.returnValue;
                                        var _firstName = $("#first_name").val();
                                        var _email = $("#logon").val();
                                        setTimeout (function(){
                                            $("#clientPassword").val(_userId);
                                            $("#mail_recipients").val(_email);
                                            $("#ename").val(_firstName);
                                            $("#epassword").val(_password);
                                            if(data.isSuccess){
                                               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                               $("#gridClientContracts").trigger("refresh");
                                               $(".yesno").addClass("hide");
                                               $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                                               
                                               $("#myModal").find("#msg").css("color","green");
                                               
                                               $("#btnConfirm").attr("onclick", "client.showModalContracts(this, '', '', '"+ _clientName +"', '', "+ gClientId +")");
                                               $(".continuecancel").removeClass("hide");
                                               
                                               $("#formEmail").jsonSubmit({
                                                     procedure: "send_mail_upd" 
                                                    ,isSingleEntry: true
                                                    ,onComplete: function (data) {
                                                        if(data.isSuccess){
                                                           if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                        }
                                                    }
                                                });
                                                setTimeout(function(){
                                                   $("#myModal").find("#msg").text("Do you want to create contract(s) for this client?");
                                                   $("#myModal").find("#msg").css("color","#000");
                                                },1500);
                                            }else{
                                               $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                               $("#myModal").find("#msg").css("color","red");
                                               modalTxt();
                                            }
                                        },2000);
                                        
                                    }
                                });
    			            }else if(gLogon === ""){
    			                $("#formClientsStep2").jsonSubmit({
                                     procedure: "admin_user_upd" 
                                    ,isSingleEntry: true
                                    ,onComplete: function (data) {
                                        var _userId = data.returnValue;
                                        var _firstName = $("#first_name").val();
                                        var _email = $("#logon").val();
                                        setTimeout (function(){
                                            $("#clientPassword").val(_userId);
                                            $("#mail_recipients").val(_email);
                                            $("#ename").val(_firstName);
                                            $("#epassword").val(_password);
                                            if(data.isSuccess){
                                               $("#formEmail").jsonSubmit({
                                                     procedure: "send_mail_upd" 
                                                    ,isSingleEntry: true
                                                    ,onComplete: function (data) {
                                                        if(data.isSuccess){
                                                           if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                        }
                                                    }
                                                });
                                                
                                                $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                                                $("#myModal").find("#msg").css("color","green");
                                                setTimeout(function(){
                                                    $("#myModal").modal('toggle');
                                                    modalTxt();
                                                },2000);
                                                
                                            }else{
                                               $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                               $("#myModal").find("#msg").css("color","red");
                                               modalTxt();
                                            }
                                        },2000);
                                        
                                    }
                                });
    			            }else {
    			                $("#myModal").find("#msg").text("Data successfully saved.");
                                $("#myModal").find("#msg").css("color","green");
                                setTimeout(function(){
                                    $("#myModal").modal('toggle');
                                    modalTxt();
                                },1500);
    			            }
    			            
                            setTimeout (function(){
                                var frm = $("#formClientsStep1Two");
                                var frm1 = $("#formClientsStep1Three");
                                var frm2 = $("#formClientsStep1Four");
                                var frm3 = $("#formClientsStep1Five");
                                var fileOrg1=frm.find("#file1").get(0)
                                    ,fileOrg2=frm1.find("#file2").get(0)
                                    ,fileOrg3=frm2.find("#file3").get(0)
                                    ,fileOrg4=frm3.find("#file4").get(0);
                            
                                var formData = new FormData( frm.get(0));
                                var formData1 = new FormData( frm1.get(0));
                                var formData2 = new FormData( frm2.get(0));
                                var formData3 = new FormData( frm3.get(0));
                                
                                if(isUD(fileOrg1.files[0])){}
                                else {
                                    $.ajax({
                                        url: base_url + 'file/uploadTmpDbFile',
                                        type: 'POST',
                                        success: completeHandler = function(data) {
                                            console.log("asdsadsadsada");
                                            if(data.isSuccess){
                                                $.get(base_url  + "sql/exec?p=clients_mayor_pemit_img_upd @client_id=" + (gClientId ? gClientId : _$clientId)
                                                            + ",@tmp_file_id='" +  data.tmp_file_id + "'"
                                                ,function(data){
                                                    zsi.form.showAlert("alert");
                                                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
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
                                }
                                if(isUD(fileOrg2.files[0])){}
                                else {
                                    $.ajax({
                                        url: base_url + 'file/uploadTmpDbFile',
                                        type: 'POST',
                                
                                        success: completeHandler = function(data) {
                                            if(data.isSuccess){
                                                setTimeout(function(){
                                                     $.get(base_url  + "sql/exec?p=clients_bir_img_upd @client_id=" + (gClientId ? gClientId : _$clientId)
                                                            + ",@tmp_file_id='" +  data.tmp_file_id + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    });
                                                },500);
                                                
                                            }else
                                                alert(data.errMsg);
                                        },
                                        error: errorHandler = function() {
                                            console.log("error");
                                        },
                                        data: formData1,
                                        cache: false,
                                        contentType: false,
                                        processData: false
                                    }, 'json');
                                }
                                if(isUD(fileOrg3.files[0])){}
                                else{
                                    $.ajax({
                                        url: base_url + 'file/uploadTmpDbFile',
                                        type: 'POST',
                                        success: completeHandler = function(data) {
                                            if(data.isSuccess){
                                                
                                                setTimeout(function(){
                                                    $.get(base_url  + "sql/exec?p=clients_sec_dti_img_upd @client_id=" + (gClientId ? gClientId : _$clientId) 
                                                            + ",@tmp_file_id='" +  data.tmp_file_id + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    });
                                                },1000);
                                                
                                            }else
                                                alert(data.errMsg);
                                        },
                                        error: errorHandler = function() {
                                            console.log("error");
                                        },
                                        data: formData2,
                                        cache: false,
                                        contentType: false,
                                        processData: false
                                    }, 'json');
                                }
                                if(isUD(fileOrg4.files[0])){}
                                else{
                                    $.ajax({
                                        url: base_url + 'file/uploadTmpDbFile',
                                        type: 'POST',
                                        success: completeHandler = function(data) {
                                            if(data.isSuccess){
                                                setTimeout(function(){
                                                    $.get(base_url  + "sql/exec?p=clients_company_logo_upd @client_id=" + (gClientId ? gClientId : _$clientId)
                                                            + ",@tmp_file_id='" +  data.tmp_file_id + "'"
                                                    ,function(data){
                                                        zsi.form.showAlert("alert");
                                                        if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    });
                                                },1500);
                                                
                                            }else
                                                alert(data.errMsg);
                                        },
                                        error: errorHandler = function() {
                                            console.log("error");
                                        },
                                        data: formData3,
                                        cache: false,
                                        contentType: false,
                                        processData: false
                                    }, 'json');
                                }
                                
                            },2000);
                            
    			        },1000);
    			       
                    }
                }
            });
        }
        
        
    });
    
    $("#btnFilterVal").click(function(){
        var _keyWord = $("#keyWord").val();
        var _keyValue = $("#keyValue").val();
        var _$gridA = $("#gridClientContracts").find("a");    
        
        if(_keyWord === "contract_no"){
            if(_keyValue) clicked();
            $("#contractsDiv").hide(500);
            displayClientContracts(_keyWord,_keyValue);
            
        }else{
            if(_keyWord && _keyValue) $("#contractsDiv").show(500);
            else $("#contractsDiv").hide(500);
            displayClientContracts(_keyWord,_keyValue);
        }
        
    });
    
    return _pub;
})();                                                               