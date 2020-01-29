 var department = (function(){
    var      bs                 = zsi.bs.ctrl
            ,svn                = zsi.setValIfNull
            ,gtw                = null
            ,_public            = {}
    ;
    
    zsi.ready = function() {
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Departments");
        displayDepartments();
    };
    
    $("#btnSaveDepartment").click(function () {
       $("#gridDepartment").jsonSubmit({
                 procedure  : "departments_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridDepartment").trigger("refresh");
                }
        });
    });
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                            $("#gridInactiveDepartment").trigger("refresh");
                          }
        });       
    });
    $("#btnSaveInactiveDepartment").click(function () {
        $("#gridInactiveDepartments").jsonSubmit({
                 procedure: "departments_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridDepartment").trigger("refresh");
                    $("#gridInactiveDepartment").trigger("refresh");
                }
        });
    });
    $("#btnInactiveDepartments").click(function () {
        $(".modal-title").text("Inactive Departments");
        $('#modalInactiveDepartments').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveDepartments();
        
    }); 
    
     function displayDepartments(){
        $("#gridDepartment").dataBind({
             url             : app.execURL + "departments_sel"
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                {text: "Department Code"                                                             ,width : 200   ,style : "text-align:left;"
                    , onRender  :  function(d)
                        { return  app.bs({name:"department_id"                  ,type:"hidden"       ,value: app.svn(d,"department_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"department_code"                ,type:"input"        ,value: app.svn(d,"department_code")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Department Name"           ,name:"department_name"     ,type:"input"        ,width : 230   ,style : "text-align:left;"}
                ,{text: "Active?"                   ,name:"is_active"           ,type:"yesno"        ,width : 50    ,style : "text-align:left;"     ,defaultValue : "Y"}
                   
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
            }
        });
    }
    function displayInactiveDepartments(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveDepartment").dataBind({
             url             : app.execURL + "departments_sel @is_active=N"
            ,width          : $("#frm_modalInactive").width() 
            ,height         : 360
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"department_id"                  ,type:"hidden"       ,value: app.svn(d,"department_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Department Name"                                                            ,width : 200   ,style : "text-align:left;"
                    , onRender  :  function(d)
                            { return  app.bs({name:"department_code"            ,type:"hidden"       ,value: app.svn(d,"department_code")})
                                    + app.bs({name:"department_name"            ,type:"input"        ,value: app.svn(d,"department_name")});
                            }
                    
                }
                ,{text: "Active?"                   ,name:"is_active"           ,type:"yesno"        ,width : 50    ,style : "text-align:left;"     ,defaultValue : "N"}
                   
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("#cbFilter").setCheckEvent("#gridInactiveDepartment input[name='cb']");
            }
        });
    }

    
    
    return _public;
})();           