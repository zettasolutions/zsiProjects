 var department = (function(){
    var      bs                 = zsi.bs.ctrl
            ,svn                = zsi.setValIfNull
            ,gtw                = null
            ,_public            = {}
    ;
    
    zsi.ready = function() {
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Departments");
        displayDeptSection();
    };
    
    $("#btnSaveDeptSect").click(function () {
       $("#gridDeptSect").jsonSubmit({
                 procedure  : "dept_sect_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridDeptSect").trigger("refresh");
                }
        });
    });
    
    $("#btnSaveSection").click(function () {
       $("#gridSection").jsonSubmit({
                 procedure  : "dept_sect_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridSection").trigger("refresh");
                }
        });
    });

    $("#btnDeleteInactiveDepartments").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                $("#gridInactiveDepartment").trigger("refresh");
            }
        });       
    });
    
    $("#btnDeleteInactiveSections").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                $("#gridInactiveSections").trigger("refresh");
            }
        });       
    });


    $("#btnSaveInactiveDeptSect").click(function () {
        $("#gridInactiveDepartment").jsonSubmit({
                 procedure: "dept_sect_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveDepartments();
                    $("#gridDeptSect").trigger("refresh");
                    
                }
        });
    });
    
    $("#btnSaveInactiveSections").click(function () {
        $("#gridInactiveSections").jsonSubmit({
                 procedure: "dept_sect_upd"
                 ,optionalItems: ["is_active"]
                 ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveSections($("#gridSection").data("parentId"));
                    $("#gridSection").trigger("refresh");
                    
                }
        });
    });

    $("#btnInactiveDeptSect").click(function () {
        $(".modal-title").text("Inactive Departments");
        $('#modalInactiveDepartments').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveDepartments();
        
    }); 
    
    $("#btnInactiveSect").click(function () {
        $(".modal-title").text("Inactive Sections");
        $('#modalInactiveSections').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveSections($("#gridSection").data("parentId"));
        
    }); 

    _public.showModalSection = function(parentId,name) {
        var _$mdl = $("#modalSection");
        _$mdl.find(".modal-title").text("Section » " + name ) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displaySection(parentId);
    };
    
    function displayDeptSection(){
        $("#gridDeptSect").dataBind({
             sqlCode        : "D213" //dept_sect_sel
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : 300
            ,dataRows       : [
                {text: "Department Code"                                    ,style: "text-align:left;"     ,width: 100   
                    ,onRender  :  function(d){
                        return    app.bs({name:"dept_sect_id"               ,type:"hidden"       ,value: app.svn(d,"dept_sect_id")})
                                + app.bs({name:"dept_sect_parent_id"        ,type:"hidden"       ,value: app.svn(d,"dept_sect_parent_id")})
                                + app.bs({name:"is_edited"                  ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"dept_sect_code"             ,type:"input"        ,value: app.svn(d,"dept_sect_code")});
                    }
                }
                ,{text: "Department Name"   ,name: "dept_sect_name"     ,type: "input"      ,width: 230     ,style: "text-align:left;"}
                ,{text: "Section"           ,width: 85                          ,style: "text-align:center;"
                    ,onRender : function(d){
                        var _link = "<a href='javascript:void(0)' title='SECTION > ' onclick='department.showModalSection("+ app.svn (d,"dept_sect_id") +",\""+ app.svn (d,"dept_sect_name") +"\")'><i class='fas fa-link link'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Active?"           ,name:"is_active"            ,type:"yesno"      ,width : 50    ,style : "text-align:left;"     ,defaultValue : "Y"}
            ]
            ,onComplete: function(o){
                var _zRow = this.find(".zRow");
            }
        });
    }

    function displaySection(parentId){
        $("#gridSection").dataBind({
             sqlCode        : "D213" //dept_sect_sel
            ,parameters     : {dept_sect_parent_id : parentId}
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                {text: "Section Code"                                    ,style: "text-align:left;"     ,width: 100   
                    ,onRender  :  function(d){
                        return    app.bs({name:"dept_sect_id"               ,type:"hidden"       ,value: app.svn(d,"dept_sect_id")})
                                + app.bs({name:"dept_sect_parent_id"        ,type:"hidden"       ,value: parentId})
                                + app.bs({name:"is_edited"                  ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"dept_sect_code"             ,type:"input"        ,value: app.svn(d,"dept_sect_code")});
                    }
                }
                ,{text: "Section Name"   ,name: "dept_sect_name"     ,type: "input"      ,width: 230     ,style: "text-align:left;"}
                ,{text: "Active?"        ,name:"is_active"           ,type:"yesno"       ,width : 50     ,style : "text-align:left;"     ,defaultValue : "Y"}
            ]
            ,onComplete: function(o){
                var _zRow = this.find(".zRow");
                this.data("parentId",parentId);
            }
        });
    }

    function displayInactiveDepartments(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveDepartment").dataBind({
             sqlCode        : "D213" //dept_sect_sel
            ,parameters     : {is_active : "N"}
            ,width          : $("#frm_modalInactive").width() 
            ,height         : 300
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"dept_sect_id"                   ,type:"hidden"       ,value: app.svn(d,"dept_sect_id")})
                                + app.bs({name:"dept_sect_parent_id"            ,type:"hidden"       ,value: app.svn(d,"dept_sect_parent_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Department Name"                                                            ,width : 200   ,style : "text-align:left;"
                    , onRender  :  function(d)
                            { return  app.bs({name:"dept_sect_code"            ,type:"hidden"       ,value: app.svn(d,"dept_sect_code")})
                                    + app.bs({name:"dept_sect_name"            ,type:"input"        ,value: app.svn(d,"dept_sect_name")});
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

    function displayInactiveSections(parentId){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveSections").dataBind({
             sqlCode        : "D213" //dept_sect_sel
            ,parameters     : {is_active : "N", dept_sect_parent_id : parentId}
            ,width          : $("#frm_modalInactive").width() 
            ,height         : 300
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"dept_sect_id"                   ,type:"hidden"       ,value: app.svn(d,"dept_sect_id")})
                                + app.bs({name:"dept_sect_parent_id"            ,type:"hidden"       ,value: parentId})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Section Name"                                                            ,width : 200   ,style : "text-align:left;"
                    , onRender  :  function(d)
                            { return  app.bs({name:"dept_sect_code"            ,type:"hidden"       ,value: app.svn(d,"dept_sect_code")})
                                    + app.bs({name:"dept_sect_name"            ,type:"input"        ,value: app.svn(d,"dept_sect_name")});
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