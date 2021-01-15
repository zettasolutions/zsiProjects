  var pms = (function(){
    var  _pub = {}
        ,gPMSid  = ""
        ,gTotal = 0.00
    ;
    zsi.ready = function(){
        $(".page-title").html("Preventive Maintenance");
        displayPMS();
        markPMMandatory();
        displaySelects();
    };
    
    function displaySelects(){
        $("#pms_date").datepicker({todayHighlight:true ,endDate:new Date()}).datepicker("setDate","0");
        $('#vehicle_id').select2({placeholder: "",allowClear: true});  
        $("#vehicle_id").dataBind({
            sqlCode      : "D272"
           ,parameters   : {client_id:app.userInfo.company_id}
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
        });
        $("#status_id").dataBind({
            sqlCode      : "S122"
           ,text         : "status_name"
           ,value        : "status_id"
        });
        $("#pm_amount").attr("readonly", true);
        $('#service_amount').maskMoney();
    }
     function displayPMS(){ 
         var _cb = app.bs({name:"cbFilter1",type:"checkbox"});
         $("#gridPMS").dataBind({
                 sqlCode: "V239"
                ,height : $(window).height() - 238
                ,parameters   : {client_id:app.userInfo.company_id}  
                ,dataRows : [
                     {text: _cb                                                                          ,width:25           ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"pms_id"                       ,type:"hidden"      ,value: app.svn(d,"pms_id")}) 
                                  + app.bs({name:"is_edited"                    ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                  + app.bs({name:"is_posted"                    ,type:"hidden"      ,value: app.svn(d,"is_posted")})
                                  + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text: "Vehicle Plate No"                                  ,width: 120     ,style: "text-align:center" 
                         ,onRender : function(d){ 
                            return  app.svn(d,"vehicle_plate_no");
                        }
                     } 
                    ,{text: "PMS Schedule Date"                  ,width: 120     ,style: "text-align:center" 
                        ,onRender : function(d){ 
                            return app.bs({type: "input",  name: "sched_pms_date", value: app.svn(d,"sched_pms_date").toShortDate()       , style: "text-align:center"});
                        }
                    } 
                    ,{text: "PMS Schedule Km"              ,type: "input"           ,name: "sched_pms_km"        ,width: 100     ,style: "text-align:left" }
                    ,{text: "PMS Date"                  ,width: 120     ,style: "text-align:center" 
                        ,onRender : function(d){ 
                            return app.bs({type: "input",  name: "pms_date", value: app.svn(d,"pms_date").toShortDate()       , style: "text-align:center"})
                                 + app.bs({name:"vehicle_id"                       ,type:"hidden"      ,value: app.svn(d,"vehicle_id")});
                        }
                    } 
                    ,{text: "ODO Reading"              ,type: "input"           ,name: "odo_reading"        ,width: 100     ,style: "text-align:left" }
                    ,{text: "PM Amount"                                                                     ,width: 100     ,style: "text-align:right;padding-right:0.2rem;"
                        ,onRender : function(d){ 
                            return app.bs({type: "input",  name: "pm_amount", value: app.svn(d,"pm_amount")/*.toCommaSeparatedDecimal()*/       , style: "text-align:right;padding-right:0.3rem;"});
                        }
                        
                    }
                    ,{text: "PM Location"              ,type: "input"           ,name: "pm_location"        ,width: 250     ,style: "text-align:left" }
                ]
                ,onComplete : function(o){
                    var _data = o.data.rows;
                    var _total = 0.00;
                    var _tot = function(){
                        var _$lastRow = $(".zRow:contains('Total Amount')").find("#total");
                        var _totalCost = $(".zRow:not(:contains('Total Amount'))").find("[name='pm_amount']");
                        var _data = [];
                        var _totality = 0.00;
                        
                        _totalCost.each(function(){
                            if(this.value) _data.push(this.value.replace(/,/g, ""));
                        });
                        
                        for (var i = 0; i < _data.length; i++){
                           _totality += parseFloat(_data[i]);
                        }
                        
                       _$lastRow.text(_totality.toCommaSeparatedDecimal());
                    };
                    for(var i = 0; i < _data.length; i++){
                        var _info = _data[i];
                        _total += _info.pm_amount;
                    }
                    /*this.find("[name='pm_amount']").on("keyup change",function(){
                        _tot();
                    });*/
                    this.find("[name='cbFilter1']").setCheckEvent("#gridPMS input[name='cb']");
                    this.find("[name='pm_amount']").maskMoney();
                    var _h          = ""; 
                     _h  +=  '<div class="zRow even">' 
                            +' <div class="zCell" style="width:25;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:120px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:120px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:right;color:#fff;padding-right: 0.3rem;">Total Amount</div>'
                            +' <div class="zCell" style="width:100px;"><b id="total" class="d-block px-1 text-white text-right">'+ _total.toCommaSeparatedDecimal() +'</b></div>'
                            
                        +'</div>';
                    this.find('input[name="odo_reading"],input[name="sched_pms_km"]').keyup(function(e){
                      if (/\D/g.test(this.value))
                      {
                        this.value = this.value.replace(/\D/g, '');
                      }
                    });
                    this.find("#table").append(_h); 
                    this.find("[name='sched_pms_date'],[name='pms_date']").datepicker({todayHighlight:true}); 
                    $(".zRow:last-child()").addClass("zTotal");  
                    setFooterFreezed("#gridPMS");
                }
         });
     }
    
    
    function setFooterFreezed(zGridId){ 
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight;
        var _zTotal = _tableRight.find(".zTotal"); 
            _zRowsHeight =   _zRows.height() - 20; 
            _zTotal.prev().css({"margin-bottom":20 }); 
            _zTotal.css({"top": _zRowsHeight}); 
          
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                    _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                    
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    } 
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    function validations(){
        var forms = document.getElementsByClassName('needs-validation');
    	// Loop over them and prevent submission
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
    			if (form.checkValidity() === false) {
    				event.preventDefault();
    				event.stopPropagation();
    			    $("form").addClass('was-validated');
    			}else{
        			event.preventDefault();
        			event.stopPropagation();
    			    $('#myModal').modal('show');
    			    $("form").addClass('was-validated');
    			}
    		}, false);
    	});
    }
    
   /* function submitReplacementParts(){
        var _$frm = $("#formPMS")
            ,_$grid = $("#gridPMS");
        
        _$frm.find("[name='pms_id']").val(gPMSid);
        _$grid.find("[name='part_qty'], [name='unit_cost']").each(function(){
            this.value = this.value.replace(/,/g, "");
        });
        _$grid.jsonSubmit({
             procedure: "part_replacements_upd" 
             ,notIncludes: ["total_cost"]
             ,onComplete: function(data){
                if(data.isSuccess){
                    zsi.form.showAlert("alert"); 
                    
                    $("#btnNew").removeClass("hide");
                    displayPMS();
                }
             }
        });
    }*/
    
    function markPMMandatory(){
        $("#divVehiclePMS").markMandatory({       
            "groupNames":[
                {
                     "names" : ["pms_date","vehicle_id","odo_reading"]
                } 
            ]      
            ,"groupTitles":[ 
                 {"titles" : ["PM Date","Vehicle","ODO Reading"]}
            ]
        }); 
    }
    
    function markReplacementPartsMandatory(){
        $("#gridPMS").markMandatory({       
            "groupNames":[
                {
                     "names" : ["part_id","part_qty","unit_id","unit_cost"]
                    ,"type":"M"
                } 
            ]      
            ,"groupTitles":[ 
                 {"titles" : ["Part","Part Qty.","Unit","PM Cost"]}
            ]
        }); 
    }
    
    $("#btnNew").click(function () {
        var _params = ['#p','vehicle-pms'].join("/");
        window.open(_params,"_self");    
    }); 
    $("#service_amount").on('keyup', function(){
        var _$thisVal = $(this).val().replace(/,/g, "");
        
        $("#total_pms_amount").val(parseFloat((_$thisVal) + gTotal).toCommaSeparatedDecimal());
    });
    
    $("#btnSave").click(function(){ 
        var _$grid = $("#gridPMS");
        var _$pmAmount = _$grid.find("input[name='pm_amount']");
        _$pmAmount.each(function(){this.value = this.value.replace(/,/g, "");});
        _$grid.jsonSubmit({
             procedure: "vehicle_pms_upd"
            ,notIncludes: ["cb"]
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                _$grid.trigger("refresh");
            } 
        }); 
    });
    
    $("#btnPost").click(function(){
        if($("#gridPMS").find("input[name='cb']:checked").length > 0){
            if(confirm("Are you sure you want to post selected items?")) {
                var _$grid = $("#gridPMS");
                var _$pmAmount = _$grid.find("input[name='pm_amount']");
                _$pmAmount.each(function(){this.value = this.value.replace(/,/g, "");});
                _$grid.find("input[name='cb']:checked").closest(".zRow").find("input[name='is_posted']").each(function(){this.value = "Y"});
                _$grid.jsonSubmit({
                     procedure: "vehicle_pms_upd"
                    ,notIncludes: ["cb"]
                    ,onComplete: function (data) { 
                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                        _$grid.trigger("refresh");
                    } 
                }); 
            }
        }else alert("Please select checkbox to proceed.");
        
    });
    
    return _pub;
})();                                        