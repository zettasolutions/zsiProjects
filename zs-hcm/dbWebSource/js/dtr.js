var dtr = (function(){
    var  _pub           = {}
        ,gStartDate     = ""
        ,gEndDate       = ""
        ,gFirstName     = ""
        ,gLastName      = ""
        ,gMiddleName    = ""
        ,gNameSuffix    = ""
        ,gEmpNo         = null
        ,gEmpId         = null
        ,gData
        ,gMainData
        ,gFullName      = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("DTR");
        dateValidation();
        $("#searchVal").select2({placeholder: "",allowClear: true}); 
        $("#searchVal").dataBind({
             sqlCode     : "D218" 
            ,text        : "fullname"
            ,value       : "id"
            ,onChange    : function(d){
                var _val = $(this).find('option[value="'+$(this).val()+'"]').text().replace(",", " ");
                var _data = _val.split(" ");
                var _lastName = _data[0];
                var _firstName = _data[2];
                var _middleName = _data[3];
                var _nameSuffix = _data[4];
                var  _info = d.data[d.index - 1];
                
                gEmpId = $(this).val();
                gEmpNo  = _info? _info.employee_no: "";
                gLastName = $.trim(_lastName).replace(",", " ");
                gFirstName = $.trim(_firstName);
                gMiddleName = _middleName? $.trim(_middleName) : "";
                gNameSuffix = _nameSuffix? $.trim(_nameSuffix): "";
                
                gFullName = gLastName +", " + gFirstName + (gNameSuffix? " " + gNameSuffix:"") + (gMiddleName? " " + gMiddleName:"");
            }
        });
    }; 
    
    function displayDTR(startDate,endDate,empId){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var _index = 0;
        var _ctr = 1;
        $("#grid").dataBind({
             sqlCode            : "D190"
            ,parameters         : {client_id:app.userInfo.company_id,start_date:(startDate ? startDate : gStartDate),end_date:(endDate ? endDate : gEndDate ),employee_id: empId}
            ,width              : $("#panel-content").width()
            ,height             : $(window).height() - 299
            ,blankRowsLimit     : 0
            ,dataRows           : [
                    {text:cb                                                        ,width: 25            ,style: "text-align:left"
                        ,onRender  :  function(d){ 
                                    return app.bs({name:"id"         ,type:  "hidden"      ,value: app.svn (d,"id")}) 
                                         //+ app.bs({name:"is_edited"                  ,type:  "hidden"      ,value: app.svn(d,"is_edited")})
                                         + app.bs({name:"dummy"                        ,type:  "hidden"      ,value: _index++})
                                         //+ app.bs({name:"employee_id"                ,type:  "hidden"      ,value: empId ? empId : app.svn(d,"employee_id")}) 
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                         //+ app.bs({name:"shift_id"                   ,type:  "hidden"      ,value: app.svn(d,"shift_id")})
                                         //+ app.bs({name:"shift_hours"                ,type:  "hidden"      ,value: app.svn(d,"shift_hours")});
                                        
                        }
                    }
                    ,{text:"Line No."                       ,width:50               ,style:"text-align:center"
                        ,onRender: function(d){ 
                                return _ctr++;
                        }
                    }
                    ,{text:"DTR Date"                       ,width:100               ,style:"text-align:center"
                            ,onRender: function(d){ return app.bs({type:"input"     ,name:"dtr_date"         ,value: app.svn(d,"dtr_date").toShortDate()        ,style:"text-align:center"});
                        }
                    }
                    ,{text:"Time In"                                                                                          ,width:80       ,style:"text-align:center"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_in"       ,value: app.svn(d,"time_in").toShortTime()      ,style:"text-align:center"});
                        }
                    } 
                    ,{text:"Time Out"                                                                                         ,width:80       ,style:"text-align:center"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_out"      ,value: app.svn(d,"time_out").toShortTime()     ,style:"text-align:center"});
                        }
                    }
                    ,{text:"Total Hours"                                                                                         ,width:70       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"dummy"      ,value: app.svn(d,"total_hour")      ,style:"text-align:center"});
                        }
                    }
                    ,{text:"Employee No."                       ,width:100        ,style:"text-align:left,padding-left:2px;"
                        
                        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"employee_no")? app.svn(d,"employee_no") : gEmpNo    ,style:"text-align:center"});}
                    }
                    
                    ,{text:"Last Name"                          ,width:165        ,style:"text-align:left,padding-left:2px;"
                        
                        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"last_name")? app.svn(d,"last_name") : gLastName    ,style:"text-align:left,padding-left:2px;"});}
                    }
                    ,{text:"First Name"                         ,width:165        ,style:"text-align:left,padding-left:2px;"
                        
                        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"first_name")? app.svn(d,"first_name") : gFirstName     ,style:"text-align:left,padding-left:2px;"});}
                    }
                    ,{text:"Middle Name"                        ,width:75        ,style:"text-align:center"
                        
                        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"middle_name")? app.svn(d,"middle_name") : gMiddleName    ,style:"text-align:center"});}
                    }
                    ,{text:"Name Suffix"                        ,width:75        ,style:"text-align:center"
                        ,onRender: function(d){ 
                            return app.bs({type:"input"     ,name:"dummy"       ,value: app.svn(d,"name_suffix")? app.svn(d,"name_suffix") : gNameSuffix     ,style:"text-align:center"})
                                 + app.bs({name:"reg_hours"                     ,type:  "hidden"      ,value: app.svn(d,"reg_hours")})
                                 + app.bs({name:"nd_hours"                      ,type:  "hidden"      ,value: app.svn(d,"nd_hours")})
                                 + app.bs({name:"odt_in"                        ,type:  "hidden"      ,value: app.svn(d,"odt_in")})
                                 + app.bs({name:"odt_out"                       ,type:  "hidden"      ,value: app.svn(d,"odt_out")})
                                 + app.bs({name:"reg_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"reg_ot_hours")})
                                 + app.bs({name:"nd_ot_hours"                   ,type:  "hidden"      ,value: app.svn(d,"nd_ot_hours")})
                                 + app.bs({name:"rd_ot_hours"                   ,type:  "hidden"      ,value: app.svn(d,"rd_ot_hours")})
                                 + app.bs({name:"rhd_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"rhd_ot_hours")})
                                 + app.bs({name:"shd_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"shd_ot_hours")})
                                 + app.bs({name:"leave_type_id"                 ,type:  "hidden"      ,value: app.svn(d,"leave_type_id")})
                                 + app.bs({name:"leave_hours"                   ,type:  "hidden"      ,value: app.svn(d,"leave_hours")})
                                 + app.bs({name:"leave_hours_wpay"              ,type:  "hidden"      ,value: app.svn(d,"leave_hours_wpay")});
                        }
                    }
                    //,{text:"Shifts"                         ,type:"select"          ,name:"shift_id"                         ,width:100        ,style:"text-align:left"}
                    //,{text:"Shifts Hours"                   ,type:"input"           ,name:"shift_hours"                      ,width:72         ,style:"text-align:center"}
                    //,{text:"DTR Date"                       ,width:80               ,style:"text-align:left"
                    //        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dtr_date"         ,value: svn(d,"dtr_date").toShortDate()});
                    //    }
                    //} 
                    //
                    //,{text:"Reg Hours"                      ,type:"input"           ,name:"reg_hours"                        ,width:65        ,style:"text-align:center"} 
                    //,{text:"Night Def"                      ,type:"input"           ,name:"nd_hours"                         ,width:60        ,style:"text-align:center"} 
                    //
                    //,{text:"ODT In"                                                                                          ,width:140       ,style:"text-align:left"
                    //        ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_in"       ,value: svn(d,"odt_in").toShortDateTime()});
                    //    }
                    //} 
                    //,{text:"ODT Out"                                                                                         ,width:140       ,style:"text-align:left"
                    //        ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_out"      ,value: svn(d,"odt_out").toShortDateTime()});
                    //    }
                    //}
                    //,{text:"Reg OT Hours"                   ,type:"input"           ,name:"reg_ot_hrs"                       ,width:80        ,style:"text-align:center"}
                    //,{text:"ND OT Hours"                    ,type:"input"           ,name:"nd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                    //,{text:"RD OT Hours"                    ,type:"input"           ,name:"rd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                    //,{text:"RHD OT Hours"                   ,type:"input"           ,name:"rhd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                    //,{text:"SHD OT Hours"                   ,type:"input"           ,name:"shd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                    //,{text:"Leave Type"                     ,type:"select"          ,name:"leave_type_id"                    ,width:160       ,style:"text-align:left"} 
                    //,{text:"Leave Hours"                    ,type:"input"           ,name:"leave_hours"                      ,width:75        ,style:"text-align:center"} 
                    //,{text:"Leave Hours With Pay"           ,type:"input"           ,name:"leave_hours_wpay"                 ,width:120       ,style:"text-align:center"}
                ] 
                ,onComplete : function(o){
                    var _zRow = this.find(".zRow");
                    var _dRows = o.data.rows;
                    var _this  = this;
                    gMainData = _dRows;
                    _this.find("input[type='text']").attr("readonly", true);
                    //_zRow.find("input[type='radio']").click(function(){
                    //    var _i      = $(this).closest(".zRow").index();
    	            //    var _rows   = _dRows[_i];
    	            //    var _data   = [];
    	            //    _data.push(_rows);
        	        //    displayEditDTR(_data); 
                    //});
                    this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");  
                    this.find("[name='input']").attr("readonly", true);
                    //_zRow.find("[name='shift_hours'],[name='reg_hours'],[name='reg_ot_hrs']").attr('readonly',true);
                    //_zRow.find("[name='shift_id']").dataBind({
                    //    sqlCode      : "S203" 
                    //   ,value        : "shift_id"
                    //   ,text         : "shift_code"
                    //   ,onChange     : function(d){
                    //       var   _info          = d.data[d.index - 1]
                    //            ,_shiftHours    = _info.no_hours
                    //            ,_$zRow         = $(this).closest(".zRow");
                    //            
                    //        _$zRow.find("[name='shift_hours']").val(_shiftHours);
                    //   }
                    //});
                    //_zRow.find("[name='leave_type_id']").dataBind({
                    //    sqlCode      : "L187" 
                    //   ,value        : "leave_type_id"
                    //   ,text         : "leave_type"
                    //});
                    //_zRow.find("input[name='dt_in'],input[name='dt_out'],input[name='odt_in'],input[name='odt_out']").on('change',function(){
                    //    var _$zRow      = $(this).closest(".zRow");
                    //    var _colName    = $(this)[0].name;
                    //    var _dtIn       = _$zRow.find("[name='dt_in']");
                    //    var _dtOut      = _$zRow.find("[name='dt_out']");
                    //    var _odtIn      = _$zRow.find("[name='odt_in']");
                    //    var _odtOut     = _$zRow.find("[name='odt_out']");
                    //    var _in         = "";
                    //    var _out        = "";
                    //    if(_colName == "dt_in"){
                    //        _in         = new Date(_dtIn.val());
                    //        _out        = new Date(_dtOut.val());
                    //        _thisValue  = _out.getTime() - _in.getTime();
                    //        if(_dtOut.val() !== "") getTime(_thisValue);
                    //        else _$zRow.find("[name='reg_hours']").val("0.0");
                    //    }else if(_colName == "dt_out"){
                    //        _in         = new Date(_dtIn.val());
                    //        _out        = new Date(_dtOut.val());
                    //        _thisValue  = _out.getTime() - _in.getTime();
                    //        if(_dtIn.val() !== "") getTime(_thisValue);
                    //        else _$zRow.find("[name='reg_hours']").val("0.0");
                    //    }else if(_colName == "odt_in"){
                    //        _in         = new Date(_odtIn.val());
                    //        _out        = new Date(_odtOut.val());
                    //        _thisValue  = _out.getTime() - _in.getTime();
                    //        if(_odtOut.val() !== "") getOTTime(_thisValue);
                    //        else _$zRow.find("[name='reg_ot_hrs']").val("0.0");
                    //    }else{
                    //        _in         = new Date(_odtIn.val());
                    //        _out        = new Date(_odtOut.val());
                    //        _thisValue  = _out.getTime() - _in.getTime();
                    //        if(_odtIn.val() !== "") getOTTime(_thisValue);
                    //        else _$zRow.find("[name='reg_ot_hrs']").val("0.0");
                    //    }
                    //    function getTime(time){
                    //        _hh      = Math.floor(time / 1000 / 60 / 60);
                    //        time    -= _hh * 1000 * 60 * 60;
                    //        _hh     -= _dd * 24;
                    //        _mm      = Math.floor(time / 1000 / 60);
                    //        var _result = _hh == 'NaN' ? '0.0' : (_hh - 1) + '.' + _mm;
                    //        _$zRow.find("[name='reg_hours']").val(_result);
                    //    }
                    //    function getOTTime(otTime){
                    //        _hh      = Math.floor(otTime / 1000 / 60 / 60);
                    //        otTime  -= _hh * 1000 * 60 * 60;
                    //        _hh     -= _dd * 24;
                    //        _mm      = Math.floor(otTime / 1000 / 60);
                    //        var _result = _hh == 'NaN' ? '0.0' : _hh + '.' + _mm;
                    //        _$zRow.find("[name='reg_ot_hrs']").val(_result);
                    //    }
                    //});
                } 
            });
    }
    function displayEditDTR(data){
        var _frDate = $("#dtr_fromDate").val();
        var _toDate = $("#dtr_toDate").val();
        var _ctr = 0;
        var date1 = new Date(_frDate);
        var date2 = new Date(_toDate);
        var diffTime = Math.abs(date2 - date1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        var _arr = [date1];
        var _obj = {};
        for(var x = 0; x < diffDays; x++){
            _ctr++;
            var _date = new Date(_frDate);
            _arr.push(new Date(_date.setDate(date1.getDate() + _ctr)));
        }
        if(data === undefined){
            zsi.getData({
                 sqlCode    : "D190"
                ,parameters : {client_id:app.userInfo.company_id,start_date:_frDate,end_date:_toDate,employee_id: gEmpId}
                ,onComplete : function(d) {
                    var _rows= d.rows.getUniqueRows(["dtr_date"]);
                    
                    $.each(_arr, function(i, v){
                        var date = new Date(_arr[i]);
                        var _tf = false;
                        var _month = date.getMonth()+1;
                        var _getDate = date.getDate();
                        var _nDate = _month >= 10? _month: "0"+_month + '/' + (parseInt(_getDate) >= 10 ? _getDate : "0"+ _getDate) + '/' + date.getFullYear();
                        var _search = _rows.find(function(rows, index) {
                        	if(rows.dtr_date === _nDate) _tf = true;
                        });
                        
                        if(_tf === false){
                            _obj = {
                                 employee_id : gEmpId
                                ,dtr_date    : _nDate
                                ,employee_no : gEmpNo
                                ,last_name   : gLastName
                                ,first_name  : gFirstName
                                ,middle_name : gMiddleName
                                ,name_suffix : gNameSuffix
                            };
                             
                            _rows.push(_obj);
                        }
                         
                    });
                    
                    _rows.sort(function(a, b) {
                        var dateA = new Date(a.dtr_date)
                           ,dateB = new Date(b.dtr_date);
                           
                        return dateA - dateB;
                    });
                    gData = _rows;
                    generateTable(_rows);
                }
            });
        }else generateTable(data);
        
    }
    function generateTable(data){
        var _ctr = 1;
        $("#gridEditDTR").dataBind({
             rows               : data
            ,height             : 370
            ,dataRows           : [
                {text:"Line No."                       ,width:50               ,style:"text-align:center"
                    ,onRender: function(d){ 
                            return _ctr++;
                    }
                }
                ,{text:"DTR Date"                       ,width:100               ,style:"text-align:center"
                        ,onRender  :  function(d){ 
                            return app.bs({name:"id"                         ,type: "hidden"      ,value: app.svn (d,"id")}) 
                                 + app.bs({name:"is_edited"                  ,type: "hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"employee_id"                ,type: "hidden"      ,value: app.svn(d,"employee_id")}) 
                                 + app.bs({name:"shift_id"                   ,type: "hidden"      ,value: app.svn(d,"shift_id")})
                                 + app.bs({name:"shift_hours"                ,type: "hidden"      ,value: app.svn(d,"shift_hours")})
                                 + app.bs({name:"dtr_date"                   ,type: "input"       ,value: app.svn(d,"dtr_date")     ,style:"text-align:center"});
                                    
                    }
                }
                ,{text:"Date Time In"                                                                                          ,width:140       ,style:"text-align:left"
                        ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_in"       ,value: app.svn(d,"time_in").toShortDateTime()      ,style:"text-align:center"});
                    }
                } 
                ,{text:"Date Time Out"                                                                                         ,width:140       ,style:"text-align:left"
                        ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_out"      ,value: app.svn(d,"time_out").toShortDateTime()         ,style:"text-align:center"});
                    }
                }
                ,{text:"Total Hours"                                                                                         ,width:70       ,style:"text-align:left"
                        ,onRender: function(d){ return app.bs({type:"input"         ,name:"total_hours"      ,value: app.svn(d,"total_hour")     ,style:"text-align:center"});
                    }
                }
                ,{text:"Employee No."                       ,width:100        ,style:"text-align:left,padding-left:2px;"
                    
                    ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"employee_no")    ,style:"text-align:center"});}
                }
                
                ,{text:"Last Name"                          ,width:165        ,style:"text-align:left,padding-left:2px;"
                    
                    ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"last_name")   ,style:"text-align:left,padding-left:2px;"});}
                }
                ,{text:"First Name"                         ,width:165        ,style:"text-align:left,padding-left:2px;"
                    
                    ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"first_name")     ,style:"text-align:left,padding-left:2px;"});}
                }
                ,{text:"Middle Name"                        ,width:75        ,style:"text-align:center"
                    
                    ,onRender: function(d){ return app.bs({type:"input"     ,name:"dummy"        ,value: app.svn(d,"middle_name").replace(".", " ")    ,style:"text-align:center"});}
                }
                ,{text:"Name Suffix"                        ,width:75        ,style:"text-align:center"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"dummy"       ,value: app.svn(d,"name_suffix")     ,style:"text-align:center"})
                             + app.bs({name:"reg_hours"                     ,type:  "hidden"      ,value: app.svn(d,"reg_hours")})
                             + app.bs({name:"nd_hours"                      ,type:  "hidden"      ,value: app.svn(d,"nd_hours")})
                             + app.bs({name:"odt_in"                        ,type:  "hidden"      ,value: app.svn(d,"odt_in")})
                             + app.bs({name:"odt_out"                       ,type:  "hidden"      ,value: app.svn(d,"odt_out")})
                             + app.bs({name:"reg_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"reg_ot_hours")})
                             + app.bs({name:"nd_ot_hours"                   ,type:  "hidden"      ,value: app.svn(d,"nd_ot_hours")})
                             + app.bs({name:"rd_ot_hours"                   ,type:  "hidden"      ,value: app.svn(d,"rd_ot_hours")})
                             + app.bs({name:"rhd_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"rhd_ot_hours")})
                             + app.bs({name:"shd_ot_hours"                  ,type:  "hidden"      ,value: app.svn(d,"shd_ot_hours")})
                             + app.bs({name:"leave_type_id"                 ,type:  "hidden"      ,value: app.svn(d,"leave_type_id")})
                             + app.bs({name:"leave_hours"                   ,type:  "hidden"      ,value: app.svn(d,"leave_hours")})
                             + app.bs({name:"leave_hours_wpay"              ,type:  "hidden"      ,value: app.svn(d,"leave_hours_wpay")});
                    }
                }
                //,{text:"Shifts"                         ,type:"select"          ,name:"shift_id"                         ,width:100        ,style:"text-align:left"}
                //,{text:"Shifts Hours"                   ,type:"input"           ,name:"shift_hours"                      ,width:72         ,style:"text-align:center"}
                //,{text:"DTR Date"                       ,width:80               ,style:"text-align:left"
                //        ,onRender: function(d){ return app.bs({type:"input"     ,name:"dtr_date"         ,value: svn(d,"dtr_date").toShortDate()});
                //    }
                //} 
                //
                //,{text:"Reg Hours"                      ,type:"input"           ,name:"reg_hours"                        ,width:65        ,style:"text-align:center"} 
                //,{text:"Night Def"                      ,type:"input"           ,name:"nd_hours"                         ,width:60        ,style:"text-align:center"} 
                //
                //,{text:"ODT In"                                                                                          ,width:140       ,style:"text-align:left"
                //        ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_in"       ,value: svn(d,"odt_in").toShortDateTime()});
                //    }
                //} 
                //,{text:"ODT Out"                                                                                         ,width:140       ,style:"text-align:left"
                //        ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_out"      ,value: svn(d,"odt_out").toShortDateTime()});
                //    }
                //}
                //,{text:"Reg OT Hours"                   ,type:"input"           ,name:"reg_ot_hrs"                       ,width:80        ,style:"text-align:center"}
                //,{text:"ND OT Hours"                    ,type:"input"           ,name:"nd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                //,{text:"RD OT Hours"                    ,type:"input"           ,name:"rd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                //,{text:"RHD OT Hours"                   ,type:"input"           ,name:"rhd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                //,{text:"SHD OT Hours"                   ,type:"input"           ,name:"shd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                //,{text:"Leave Type"                     ,type:"select"          ,name:"leave_type_id"                    ,width:160       ,style:"text-align:left"} 
                //,{text:"Leave Hours"                    ,type:"input"           ,name:"leave_hours"                      ,width:75        ,style:"text-align:center"} 
                //,{text:"Leave Hours With Pay"           ,type:"input"           ,name:"leave_hours_wpay"                 ,width:120       ,style:"text-align:center"}
            ] 
            ,onComplete : function(o){
                var _zRow = this.find(".zRow");
                this.find("[name='dummy'],[name='total_hours']").attr("readonly", true);
                //_zRow.find("[name='shift_hours'],[name='reg_hours'],[name='reg_ot_hrs']").attr('readonly',true);
                //_zRow.find("[name='shift_id']").dataBind({
                //    sqlCode      : "S203" 
                //   ,value        : "shift_id"
                //   ,text         : "shift_code"
                //   ,onChange     : function(d){
                //       var   _info          = d.data[d.index - 1]
                //            ,_shiftHours    = _info.no_hours
                //            ,_$zRow         = $(this).closest(".zRow");
                //            
                //        _$zRow.find("[name='shift_hours']").val(_shiftHours);
                //   }
                //});
                _zRow.find("[name='dtr_date']").datepicker({todayHighlight:true});
                
                _zRow.find("[name='dt_in'],[name='dt_out'],[name='odt_in'],[name='odt_out']").datetimepicker({
                     todayHighlight : false
                    ,format         : 'mm/dd/yyyy HH:ii P'
                    ,showMeridian   : true
                    ,autoclose      : true
                    ,Default        : false
                });
                _zRow.find("[name='leave_type_id']").dataBind({
                    sqlCode      : "L187" 
                   ,value        : "leave_type_id"
                   ,text         : "leave_type"
                });
                _zRow.find("input[name='dt_in'],input[name='dt_out'],input[name='odt_in'],input[name='odt_out']").on('change',function(){
                    var _$zRow      = $(this).closest(".zRow");
                    var _colName    = $(this)[0].name;
                    var _dtIn       = new Date(_$zRow.find("[name='dt_in']").val());
                    var _dtOut      = new Date(_$zRow.find("[name='dt_out']").val());
                    var _totalHours = _$zRow.find("[name='total_hours']");
                    var hours = Math.abs(_dtOut - _dtIn) / 36e5;
                    var minutes = Math.abs(_dtOut - _dtIn) % 36e5/6e4;
                    var totalHours = min(hours) +"."+ (minutes.toString().length == 1? "0" + minutes : minutes);
                    
                    if(_colName == "dt_in"){
                        if(_dtOut != "Invalid Date") _totalHours.val(totalHours);
                        else _totalHours.val("0.0");
                    }else if(_colName == "dt_out"){
                        if(_dtIn != "Invalid Date") _totalHours.val(totalHours);
                        else _totalHours.val("0.0");
                    }
                });
            } 
        });
    }
    function min(time){
        var _time = time.toString().split(".")[0];
        return _time;
    }
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();
        $("#dtr_fromDate").datepicker({
             autoclose : true 
            ,startDate : _date1
            ,endDate: d
            ,todayHighlight: false 
        }).datepicker("setDate", _date1).on("changeDate",function(e){
            $("#dtr_toDate").datepicker({
                autoclose: true
            }).datepicker("setStartDate",e.date);
            $("#dtr_toDate").datepicker().datepicker("setDate",e.date);
        });
        $("#dtr_toDate").datepicker({
              autoclose : true
             ,startDate : _date1
             ,endDate: d
        }).datepicker("setDate","0");
        
        var _startDate = $("#dtr_fromDate").val();
        var _endDate = $("#dtr_toDate").val();
        displayDTR(_startDate,_endDate);
    }
    
    _pub.displayDTRModal = function(){
        var _h = "";
        var _frDate = $("#dtr_fromDate").val();
        var _toDate = $("#dtr_toDate").val();
        displayEditDTR();
        $("#appendTblForPDF").find("#tablePDF").find("tbody").html("");
        $("#ifrmWindow").height($(window).height() - 70);
        if($("#searchVal").val() === "") alert("Please select employee to proceed.");
        else {
            setTimeout(function(){
                for(var i = 0;i<gData.length;i++){
                    var _info = gData[i];
                    var _timeIn = _info.time_in? _info.time_in.toShortTime() : '';
                    var _timeOut = _info.time_out? _info.time_out.toShortTime() : '';
                    var _totalHrs = _info.total_hour? _info.total_hour : '';
                    
                    _h = 
                    '<tr>'
                        + '<td>'+_info.dtr_date+'</td>'
                        + '<td>'+_timeIn+'</td>'
                        + '<td>'+_timeOut+'</td>'
                        + '<td>'+_totalHrs+'</td>'
                    +'</tr>';
                    
                    $("#appendTblForPDF").find("#tablePDF").find("tbody").append(_h);
                }
            },1000);
            
            setTimeout(function(){
                var doc = new jsPDF();
                doc.setFont("arial", "bold");
                doc.setFontSize(10);
                doc.text(gFullName, 14, 16);
                doc.setFont("arial", "normal");
                doc.setFontSize(8);
                doc.text('Period of '+ _frDate + '-' + _toDate, 150, 16,);
                var elem = document.getElementById("tablePDF");
                var res = doc.autoTableHtmlToJson(elem);
                doc.autoTable(res.columns, res.data, 
                    {
                         startY: 20
                        ,theme: 'grid'
                        ,styles: {
                             fontSize: 8
                            ,font: 'helvetica'
                            ,cellPadding: 2
                            ,minCellHeight: 2
                        }
                        ,headStyles: {
                             fillColor: [0, 0, 255]
                            ,textColor: [0, 0, 0]
                            ,fontSize: 8
                            ,padding: 0
                        }
                    }
                    
                );   
                document.getElementById("ifrmWindow").src = doc.output('datauristring');
            },1200);
            $("#modalDTRPDF").modal({ show: true, keyboard: false, backdrop: 'static' });
        }
    };
    
    $("#btnEditDTR").click(function(){
        var _json = [];
        var  _row= $("#grid").find("[name='cb']:checked").parent(".zCell");
        var _getData = function(index){
            _json.push(gMainData[index]);
            
        };
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            _getData(data[1]);
            
        }
        displayEditDTR(_json);
        $("#modalEditDTR").modal({ show: true, keyboard: false, backdrop: 'static' }); 
    });
    $("#btnGenerate").click(function(){
        if($("#searchVal").val() === "") alert("Please select employee to proceed.");
        else{
            displayEditDTR();
            $("#modalEditDTR").modal({ show: true, keyboard: false, backdrop: 'static' });
        }
    });
    $("#btnSave").click(function () { 
        $("#gridEditDTR").jsonSubmit({
             procedure      : "dtr_upd"
            ,notIncludes    : ["dummy","cb","total_hours"]
            ,optionalItems  : ["is_active"] 
            ,onComplete     : function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                $("#grid").trigger("refresh");
                $("#modalEditDTR").modal("toggle");
            } 
        }); 
    });
    $("#btnDelete").click(function (){  
        $("#grid").deleteData({
    		 sqlCode: "D248"  
    		,parameters: {client_id:app.userInfo.company_id,table:'dtr',id:'id'}
    		,onComplete : function(d){
    			$("#grid").trigger("refresh");
    		}
    	 });  
    });
    $("#btnReset").click(function(){   
        var _searchVal = $("#searchVal").val();
        dateValidation();
        $("#searchVal").val("");
    });     
    $("#btnSearch").click(function (){
        var _startDate = $("#dtr_fromDate").val();
        var _endDate = $("#dtr_toDate").val();
        var _searchVal = $("#searchVal").val();
        if(_startDate === "") {
            alert("Please select start date.");
        }
        if(_endDate === ""){
          alert("Please select end date.");  
        }
        else displayDTR(_startDate,_endDate,_searchVal);
    });
    $("#btnExportDTR").click(function () {
        var _h = "";
        var _frDate = $("#dtr_fromDate").val();
        var _toDate = $("#dtr_toDate").val();
        displayEditDTR();
        $("#appendTblForPDF").find("#tablePDF").find("tbody").html("");
        $("#ifrmWindow").height($(window).height() - 70);
        if($("#searchVal").val() === ""){
            alert("Please select employee to proceed.");
            return;
        }
        setTimeout(function(){
            for(var i = 0;i<gData.length;i++){
                var _info = gData[i];
                var _timeIn = _info.time_in? _info.time_in.toShortTime() : '';
                var _timeOut = _info.time_out? _info.time_out.toShortTime() : '';
                var _totalHrs = _info.total_hour? _info.total_hour : '';
                
                _h = 
                '<tr>'
                    + '<td>'+_info.dtr_date+'</td>'
                    + '<td>'+_timeIn+'</td>'
                    + '<td>'+_timeOut+'</td>'
                    + '<td>'+_totalHrs+'</td>'
                +'</tr>';
                
                $("#appendTblForPDF").find("#tablePDF").find("tbody").append(_h);
            }
        },1000);
        
        setTimeout(function(){
            $("#tablePDF").htmlToExcel({
               fileName: gFullName + "'s DTR ("+ _frDate + "-" +  _toDate +").xlsx"
           });
        },1000);
        
    });
    
    return _pub;
    
})();                                   