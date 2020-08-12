var leave = (function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
            ,_pub                   = {}
            ,gleaveTypeId           = null
    ;
    zsi.ready = function() {
        $(".page-title").html("Leave");
        $("#collapsed").find("a").addClass("has-tooltip").tooltip();
        runDatePicker();
        $(".panel-asd").css("height", $(window).height() - 143);
        
        $("#userId").dataBind({
             sqlCode     : "D218" 
            ,text        : ("fullname")
            ,value       : "id"
        });
        $("#leaveTypeId").dataBind({
             sqlCode     : "L187" 
            ,text        : "leave_type"
            ,value       : "leave_type_id"
            ,onComplete  : function(d){
                gleaveTypeId = this.val();
            }
        });
        markLeavesMandatory();
        $("#userId").select2({placeholder: "",allowClear: true});
        $("#leaveTypeId").select2({placeholder: "",allowClear: true});
    };
    
    runDatePicker = function(){
        $('#datepicker').datepicker(
        {
             todayHighlight     : true
            ,startDate            : new Date()
            ,multidate          : true
            ,multidateSeparator : ","
            ,format             : 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            var _date = e.dates;
            var _dates = [];
            $.each(e.dates, function(i, v){
                _dates.push(e.format(i,"mm/dd/yyyy"));
            });
            $("#datepickerVal").val(_dates);
        });
            
    }; 
    $("#btnSaveLeaves").click(function () { 
       $("#gridLeaves").jsonSubmit({
                 procedure  : "filed_leaves_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridLeaves").trigger("refresh");
                }
        });
    });
    
    $("#btnDeleteLeaves").click(function(){
        zsi.form.deleteData({
             code       : "ref-00014"
            ,onComplete : function(data){
                $("#gridLeaves").trigger("refresh");
              }
        });       
    });
    
    $("#btnGo").click(function () {  
      if($("#leaveDD").checkMandatory()!==true) return false; 
        var _row  = $(".row");
        var _date = _row.find('#datepickerVal').val();
        var _user = _row.find('#userId').val();
        var _leaveType = _row.find('#leaveTypeId').val();
        var _rows = [];
        var _info = null;  
        $.each(_date.split(","), function(i,v){
            _info = { 
                 employee_id    : _user
                ,leave_type_id  : _leaveType
                ,leave_date     : v
            };
            
            if(i >= 0 && _date !== ""){
                $("#collapsed").find("a").click();
                $(".row").find("#gridId").removeClass("d-none");
                $(".row").find("#btnId").removeClass("d-none");
            }else{
                $(".row").find("#gridId").addClass("d-none");
                $(".row").find("#btnId").addClass("d-none");
            }
             _rows.push(_info);
        });
       
        displayDateOfLeaves(_rows); 
       
         
    });
    function markLeavesMandatory(){
         $("#leaveDD").markMandatory({       
            "groupNames":[
                  {
                       "names" : ["userId","leaveTypeId"]
                      ,"type":"M"
                  } 
            ]      
            ,"groupTitles":[ 
                   {"titles" : ["Employee","Type of leave"]}
            ]
        });   
    }
    function displayDateOfLeaves(data){
        $("#gridLeaves").dataBind({
             rows           : data
            ,height         : $(window).height() - 350
            ,dataRows       : [
                {text: "File Date"                                                              ,width : 190   ,style : "text-align:left;"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"leave_id"                  ,type:"hidden"      ,value: app.svn(d,"leave_id")})
                                 + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"employee_id"               ,type:"hidden"      ,value: app.svn(d,"employee_id")})
                                 + app.bs({name:"leave_type_id"             ,type:"hidden"      ,value: app.svn(d,"leave_type_id")})
                                 + app.bs({name:"file_date"                 ,type:"input"       ,value: app.svn(d,"file_date")});
                        }
                }
                ,{text: "Leave Date"            ,name:"leave_date"          ,type:"input"       ,width : 190   ,style : "text-align:left;"}
                ,{text: "Leave Type"            ,name:"leave_type_id"       ,type:"select"      ,width : 190   ,style : "text-align:left;"}
                ,{text: "Filed Hours"           ,name:"filed_hours"         ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Approved Hours"        ,name:"approved_hours"      ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Approved?"                                                             ,width : 70    ,style : "text-align:left;" ,defaultValue:"N"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"is_approved"               ,type:"yesno"       ,value: app.svn(d,"is_approved")})
                                 + app.bs({name:"is_approved_by"            ,type:"hidden"      ,value: app.svn(d,"is_approved_by")})
                                 + app.bs({name:"is_approved_date"          ,type:"hidden"      ,value: app.svn(d,"is_approved_date")}) ;
                        }
                }
                ,{text: "Leave Reason"          ,name:"leave_reason"        ,type:"input"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Approver Comment"                                                      ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"approver_comment"          ,type:"input"       ,value: app.svn(d,"approver_comment")})  
                                 + app.bs({name:"created_by"                ,type:"hidden"      ,value: app.svn(d,"created_by")})
                                 + app.bs({name:"created_date"              ,type:"hidden"      ,value: app.svn(d,"created_date")}) ;
                        }
                }
                
            ]
            ,onComplete: function(d){   
                var _this           = this
                    ,_zRow          = _this.find(".zRow")
                    ,_checkQuantity = function(){
                        var _$grid = $("#gridLeaves");
                        var _tmr = null; 
                        var _leaveDate = _$grid.find("[name='leave_date']").val(); 
                        _$grid.find("[name='file_date']").on("keyup change",function(){
                            var _$this = $(this);
                            clearTimeout(_tmr);
                            _tmr = setTimeout(function(){
                                if (_$this.val() > _leaveDate){  
                                    alert( "File Date must be less than to "+ _leaveDate + "." ); 
                                    _$this.closest(".zRow").find("[name='file_date']").datepicker({ 
                                        autoclose : true
                                        , todayHighlight: true 
                                    }).datepicker("setDate","0");
                                }
                            }, 10);
                        });
                        _$grid.find("[name='leave_date']").attr('readonly',true);
                        _$grid.find("[name='leave_type_id']").dataBind({
                             sqlCode     : "L187" 
                            ,text        : "leave_type"
                            ,value       : "leave_type_id"
                           ,selectedValue : gleaveTypeId 
                        });
                    };
                    
                     _this.on('dragstart', function(){ return false; });
                    
                    _zRow.find("[name='file_date']").datepicker({ 
                          autoclose : true
                        , todayHighlight: true 
                    }).datepicker("setDate","0");
                     
                    _checkQuantity(); 
                 
            }
        });
    }
    
    return _pub;
})();   















