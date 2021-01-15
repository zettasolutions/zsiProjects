 (function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Categories, Types and Classes Reference");
        displayCategories();
        displayTypes();
        displayClasses()
        
    
    }; 
    
    function displayCategories(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridCategories").dataBind({
             sqlCode        : "C218" //categories_sel
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"category_id"               ,type:"hidden"              ,value: app.svn(d,"category_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Category Code"             ,type:"input"       ,name:"category_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Category Name"             ,type:"input"       ,name:"category_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"Category Description"      ,type:"input"       ,name:"category_desc"              ,width:400          ,style:"text-align:left"}
                    
                    
                  ]
                  ,onComplete : function(o){
                    $("#cbFilter1").setCheckEvent("#gridCategories input[name='cb']");
                  } 
        });
    } 
    
    function displayTypes(){  
        var cb = app.bs({name:"cbFilter2",type:"checkbox"}); 
        $("#gridTypes").dataBind({
             sqlCode        : "T224" //types_sel
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"type_id"               ,type:"hidden"              ,value: app.svn(d,"type_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Type Code"             ,type:"input"       ,name:"type_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Type Name"             ,type:"input"       ,name:"type_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"Type Description"      ,type:"input"       ,name:"type_desc"              ,width:400          ,style:"text-align:left"}
                    
                    
                  ]
                  ,onComplete : function(o){
                    $("#cbFilter2").setCheckEvent("#gridTypes input[name='cb']");
                  } 
        });
    } 
    
    function displayClasses(){  
        var cb = app.bs({name:"cbFilter3",type:"checkbox"}); 
        $("#gridClasses").dataBind({
             sqlCode        : "C223" //classes_sel
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"class_id"               ,type:"hidden"              ,value: app.svn(d,"class_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Class Code"             ,type:"input"       ,name:"class_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Class Name"             ,type:"input"       ,name:"class_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"Class Description"      ,type:"input"       ,name:"class_desc"              ,width:400          ,style:"text-align:left"}
                    
                    
                  ]
                  ,onComplete : function(o){
                    $("#cbFilter3").setCheckEvent("#gridClasses input[name='cb']");
                  } 
        });
    } 
    
    
    $("#btnSaveCategory").click(function(){ 
        $("#gridCategories").jsonSubmit({
             procedure: "categories_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayCategories();
            } 
        }); 
    });

    $("#btnSaveTypes").click(function(){ 
        $("#gridTypes").jsonSubmit({
             procedure: "types_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayTypes();
            } 
        }); 
    });
    
    $("#btnSaveClasses").click(function(){ 
        $("#gridClasses").jsonSubmit({
             procedure: "classes_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayClasses();
            } 
        }); 
    });
    
    $("#btnDeleteCategory").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00010"
               ,onComplete:function(data){
                     displayCategories();
               }
        });
    });
    
    $("#btnDeleteTypes").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00011"
               ,onComplete:function(data){
                     displayTypes();
               }
        });
    });
    
    $("#btnDeleteClasses").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00012"
               ,onComplete:function(data){
                     displayClasses();
               }
        });
    });
})();    