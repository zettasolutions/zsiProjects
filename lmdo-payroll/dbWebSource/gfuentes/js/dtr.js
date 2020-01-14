 (function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("DTR");
        displayDTR(); 
    }; 
    function displayDTR(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "dtr_sel"  
                ,width              : $("#panel-content").width()
                ,height             : $(window).height() - 260
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"id"         ,type:"hidden"      ,value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        } 
                        ,{text:"Employee"                       ,type:"select"          ,name:"employee_id"                      ,width:150       ,style:"text-align:left"}
                        ,{text:"Shifts"                         ,type:"select"          ,name:"shift_id"                         ,width:50        ,style:"text-align:left"}
                        ,{text:"Shifts Hours"                   ,type:"input"           ,name:"shift_hours"                      ,width:72        ,style:"text-align:center"}
                        ,{text:"DTR Date"                       ,width:80               ,style:"text-align:left"
                                ,onRender: function(d){ return app.bs({type:"input"     ,name:"dtr_date"       ,value: svn(d,"dtr_date").toShortDate()});
                            }
                        } 
                        ,{text:"DT In"                                                                                           ,width:140       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_in"       ,value: svn(d,"dt_in").toShortDateTime()});
                            }
                        } 
                        ,{text:"DT Out"                                                                                          ,width:140       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"dt_out"       ,value: svn(d,"dt_out").toShortDateTime()});
                            }
                        }
                        ,{text:"Reg Hours"                      ,type:"input"           ,name:"reg_hours"                        ,width:65        ,style:"text-align:center"} 
                        ,{text:"Night Def"                      ,type:"input"           ,name:"nd_hours"                         ,width:60        ,style:"text-align:center"} 
                        
                        ,{text:"ODT In"                                                                                          ,width:140       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_in"       ,value: svn(d,"odt_in").toShortDateTime()});
                            }
                        } 
                        ,{text:"ODT Out"                                                                                         ,width:140       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"         ,name:"odt_out"       ,value: svn(d,"odt_out").toShortDateTime()});
                            }
                        }
                        ,{text:"Reg OT Hours"                   ,type:"input"           ,name:"reg_ot_hrs"                       ,width:80        ,style:"text-align:center"}
                        ,{text:"ND OT Hours"                    ,type:"input"           ,name:"nd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                        ,{text:"RD OT Hours"                    ,type:"input"           ,name:"rd_ot_hours"                      ,width:75        ,style:"text-align:center"}
                        ,{text:"RHD OT Hours"                   ,type:"input"           ,name:"rhd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                        ,{text:"SHD OT Hours"                   ,type:"input"           ,name:"shd_ot_hours"                     ,width:83        ,style:"text-align:center"} 
                        ,{text:"Leave Type"                     ,type:"select"          ,name:"leave_type_id"                    ,width:160       ,style:"text-align:left"} 
                        ,{text:"Leave Hours"                    ,type:"input"           ,name:"leave_hours"                      ,width:75        ,style:"text-align:center"} 
                        ,{text:"Leave Hours With Pay"           ,type:"input"           ,name:"leave_hours_wpay"                 ,width:120       ,style:"text-align:center"}
                    ] 
                    ,onComplete : function(d){
                        var _zRow = this.find(".zRow");
                        _zRow.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        _zRow.find("[name='employee_id']").dataBind("employees");
                        _zRow.find("#shift_hours,#reg_hours,#reg_ot_hrs").attr('readonly',true);
                        _zRow.find("#shift_id").dataBind({
                            sqlCode      : "S203" //shifts_sel
                           ,value        : "shift_id"
                           ,text         : "shift_code"
                           ,onChange     : function(d){
                               var   _info          = d.data[d.index - 1]
                                    ,_shiftHours    = _info.no_hours
                                    ,_$zRow         = $(this).closest(".zRow");
                                    
                                    _$zRow.find("#shift_hours").val(_shiftHours);
                           }
                        });
                        _zRow.find("[name='dtr_date']").datepicker({todayHighlight:true});
                        _zRow.find("#dt_out,#dt_in,#odt_in,#odt_out").datetimepicker({
                             todayHighlight : true
                            ,format         : 'mm/dd/yyyy HH:ii P'
                            ,showMeridian   : true
                            ,autoclose      : true
                            ,todayBtn       : true
                        });
                        _zRow.find("#leave_type_id").dataBind({
                            sqlCode      : "L187" //leave_types_sel
                           ,value        : "leave_type_id"
                           ,text         : "leave_type"
                        });
                        _zRow.find("#dt_in,#dt_out,#odt_in,#odt_out").on('change',function(){
                            var _$zRow      = $(this).closest(".zRow");
                            var _colName    = $(this)[0].id;
                            var _dtIn       = _$zRow.find("#dt_in");
                            var _dtOut      = _$zRow.find("#dt_out");
                            var _odtIn      = _$zRow.find("#odt_in");
                            var _odtOut     = _$zRow.find("#odt_out");
                            var _in         = "";
                            var _out        = "";
                            if(_colName == "dt_in"){
                                    _in         = new Date(_dtIn.val());
                                    _out        = new Date(_dtOut.val());
                                    _thisValue  = _out.getTime() - _in.getTime();
                                    if(_dtOut.val() !== "") getTime(_thisValue);
                                    else _$zRow.find("#reg_hours").val("0.0");
                            }else if(_colName == "dt_out"){
                                    _in         = new Date(_dtIn.val());
                                    _out        = new Date(_dtOut.val());
                                    _thisValue  = _out.getTime() - _in.getTime();
                                    if(_dtIn.val() !== "") getTime(_thisValue);
                                    else _$zRow.find("#reg_hours").val("0.0");
                            }else if(_colName == "odt_in"){
                                    _in         = new Date(_odtIn.val());
                                    _out        = new Date(_odtOut.val());
                                    _thisValue  = _out.getTime() - _in.getTime();
                                    if(_odtOut.val() !== "") getOTTime(_thisValue);
                                    else _$zRow.find("#reg_ot_hrs").val("0.0");
                            }else{
                                    _in         = new Date(_odtIn.val());
                                    _out        = new Date(_odtOut.val());
                                    _thisValue  = _out.getTime() - _in.getTime();
                                    if(_odtIn.val() !== "") getOTTime(_thisValue);
                                    else _$zRow.find("#reg_ot_hrs").val("0.0");
                            }
                            function getTime(time){
                                _hh      = Math.floor(time / 1000 / 60 / 60);
                                _dd      = Math.floor(_hh / 24);
                                time    -= _hh * 1000 * 60 * 60;
                                _hh     -= _dd * 24;
                                _mm      = Math.floor(time / 1000 / 60);
                                var _result = _hh == 'NaN' ? '0.0' : (_hh - 1) + '.' + _mm;
                            _$zRow.find("#reg_hours").val(_result);
                            }
                            function getOTTime(otTime){
                                _hh      = Math.floor(otTime / 1000 / 60 / 60);
                                _dd      = Math.floor(_hh / 24);
                                otTime  -= _hh * 1000 * 60 * 60;
                                _hh     -= _dd * 24;
                                _mm      = Math.floor(otTime / 1000 / 60);
                                var _result = _hh == 'NaN' ? '0.0' : _hh + '.' + _mm;
                            _$zRow.find("#reg_ot_hrs").val(_result);
                            }
                        });
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "dtr_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00016"
               ,onComplete:function(data){
                    displayDTR();
               }
            });
        });
    
})();

                              