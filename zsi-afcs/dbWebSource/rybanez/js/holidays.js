  var oem =  (function(){
        var _public = {};
            var  bs                     = zsi.bs.ctrl
                ,svn                    = zsi.setValIfNull
                ,gYearVal               = ""
                 
            ;
  
            zsi.ready = function(){
                $(".page-title").html("Holidays");
                var _year = new Date().getFullYear();
                gYearVal = _year;
                $("#yearId").val(_year);
                displayHolidays("",_year);
            }; 
             
            function displayHolidays(keyword,year){  
                var cb = app.bs({name:"cbFilter2",type:"checkbox"});
                $("#gridHolidays").dataBind({
                     sqlCode        : "H295" //holidays_sel
                    ,parameters     : {keyword: keyword,year: year}
                    ,height         : $(window).height() - 265  
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                            {text: cb  ,width : 25   ,style : "text-align:left"
                                ,onRender  :  function(d){  
                                    return app.bs({name:"holiday_id"                ,type:"hidden"      ,value: svn (d,"holiday_id")}) 
                                        + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")})
                                        + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); 
                                }
                        }
                        ,{text: "Holiday Date"           ,name : "holiday_date"      ,type : "input"      ,width : 200   ,style : "text-align:left" ,sortColNo : 1
                            ,onRender : function(d){
                                 return app.bs({name:"holiday_date"               ,type:"input"      ,value: svn(d,"holiday_date").toShortDate()});
                            }
                        }
                        ,{text: "Holiday Title"           ,name : "holiday_title"      ,type : "input"      ,width : 200   ,style : "text-align:left"  ,sortColNo : 2}
                        
            
                    ]
                    ,onComplete: function(o){ 
                        console.log("gYearVal",gYearVal);
                        var  _this      = this
                            ,_zRow      = _this.find(".zRow"); 
                        var _date = _zRow.find("[name='holiday_date']");
                        var _today = new Date();
                         _zRow.find("[name='holiday_date']").datepicker({ 
                             pickTime  : false
                            ,autoclose : true
                            ,todayHighlight: true 
                            ,changeMonth: true
                            ,changeYear: true
                            ,defaultViewDate: {year: gYearVal}
                            ,onComplete : function(){
                                this.val();
                            }
                        });
                        _this.find("[name='cbFilter2']").setCheckEvent("#gridHolidays input[name='cb']");   
                    }
                });
            } 
           
            $("#btnSaveHolidays").click(function () { 
                var _yearVal = $.trim($("#yearId").val()) ;
                $("#gridHolidays").jsonSubmit({
                     procedure  : "holidays_upd"
                     ,optionalItems: ["is_active"]
                    ,onComplete : function (data) {
                        if(data.isSuccess===true){
                            zsi.form.showAlert("alert");
                            displayHolidays("",_yearVal);
                        }
                    }
                });
            }); 
            
            $("#btnPrev").unbind().click(function(){
                var _yearVal = $.trim($("#yearId").val()) ;
                var _count = _yearVal - 1; 
                setTimeout(function(){
                    displayHolidays("",_count);
                }, 200);
                $("#yearId").val(_count);
                gYearVal = _count;
            });
            
            $("#btnNext").unbind().click(function(){
                var _yearVal = $.trim($("#yearId").val());
                var _count = parseInt(_yearVal) + 1; 
                setTimeout(function(){
                    displayHolidays("",_count);
                }, 200);
                $("#yearId").val(_count);
                gYearVal = _count;
            });
            
            $("#btnDeleteHolidays").click(function(){
                var _yearVal = $.trim($("#yearId").val()) ;
                zsi.form.deleteData({
                     code       : "ref-00046"
                    ,onComplete : function(data){
                        displayHolidays("",_yearVal);
                    }
                });       
            });
            
            $("#yearId").on('keypress',function(e) {
                var _yearVal = $.trim($("#yearId").val()); 
                if(e.which == 13) {
                    displayHolidays("",_yearVal);
                }
                gYearVal = _yearVal;
            });
    
            $("#btnSearch").unbind().click(function(){
                var _yearVal = $.trim($("#yearId").val());
                var _keyword = $("#searchKeyword").val();
                displayHolidays(_keyword,_yearVal);
            });
            
            $("#btnReset").unbind().click(function(){
                $("#searchKeyword").val("");
                displayHolidays();
            });
    
    
    return _public;
  
 })();
  

                                                                                                                                                                                                                       