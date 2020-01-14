(function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Order Types");
         displayOrderType();
    };
    
    $("#btnSaveOT").click(function () {
       $("#gridOrderType").jsonSubmit({
                 procedure  : "order_type_upd"
                , onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayOrderType();
                }
        });
    });
    $("#btnDeleteOT").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                    displayOrderType();
                  }
        });       
    });
     function displayOrderType(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridOrderType").dataBind({
             sqlCode        : "O204" //order_types_sel
             //url            : app.execURL + "order_types_sel"
            ,width          : $(".zContainer").width() 
            ,height         : 360
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"order_type_id"         ,type:"hidden"  ,value: app.svn(d,"order_type_id")})
                                 + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                 + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                        }
                }
                ,{text: "Order Type"         ,name:"order_type"        ,type:"input"       ,width : 200   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                this.find("#cbFilter").setCheckEvent("#gridOrderType input[name='cb']");
            }
        });
    } 
})();     