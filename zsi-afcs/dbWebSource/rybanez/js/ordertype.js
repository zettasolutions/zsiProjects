(function(){
    var      bs             = zsi.bs.ctrl
            ,svn            = zsi.setValIfNull
            ,gtw            = null
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Order Types");
         displayOrderType();
    }; 
    
    //Private functions
    function displayOrderType(searchVal){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridOrderType").dataBind({
             sqlCode        : "O204" //order_types_sel
            ,parameters     : {search_val: (searchVal ? searchVal : "")}
            ,width          : $(".zContainer").width() 
            ,height         : $(window).height() - 260
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: "Order Type"                 ,width : 200   ,style : "text-align:left;" ,sortColNo : 0
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"order_type_id"         ,type:"hidden"  ,value: app.svn(d,"order_type_id")})
                                 + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"order_type"            ,type:"input"   ,value: app.svn(d,"order_type")}) ;
                                 
                        }
                }
                ,{text: "Active?"         ,name:"is_active"             ,type:"yesno"   ,width : 50   ,style : "text-align:left;" ,defaultValue:"Y"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridOrderType input[name='cb']");
                this.on('dragstart', function () {
                    return false;
                });
            }
        });
    }
    function showModal(){
        var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactive");
        g$mdl.find(".modal-title").text("Order Types »   In Active ") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive();
    }
    function displayInactive(){ 
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        
         $("#gridInactiveOrderTypes").dataBind({
    	     sqlCode        : "O204" //order_types_sel
    	    ,parameters     : {is_active: "N"}
    	    ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return      app.bs({name:"order_type_id"         ,type:"hidden"   ,value: app.svn(d,"order_type_id")})
                                    + app.bs({name:"is_edited"             ,type:"hidden"   ,value: app.svn(d,"is_edited")})
                                    + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                            
                        }
                }
        		,{ text: "Order Type"                                                       ,width: 250          ,style: "text-align:left;" 
        		     ,onRender :   function(d){
        		        return app.bs({name:"order_type"                   ,type:"input"    ,value: app.svn(d,"order_type")})
        		              
        		     }
        		 }
        		,{text: "Active?"        ,name: "is_active"                ,type:"yesno"    ,width : 50          ,style: "text-align:center;"  ,defaultValue:"N"}
    	    ]
    	    ,onComplete: function(o){
    	        var _zRow = this.find(".zRow");
    	        _zRow.find("[name='customer_code']").attr('readonly',true);
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveOrderTypes input[name='cb']");
                this.on('dragstart', function () {
                    return false;
                });
                
            }
        });  
    }
    
    //Buttons
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        displayOrderType(_searchVal);
    }); 
    $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
            displayOrderType(_searchVal);
        }
    });
    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayOrderType();
        }
    });
    $("#btnResetVal").click(function(){
        displayOrderType();
    });
    $("#btnSaveOT").click(function () {
        $("#gridOrderType").jsonSubmit({
                 procedure: "order_type_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) { 
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayOrderType($("#gridOrderType").data("siteCode"));
                }
        });
    }); 
    $("#btnInactive").click(function(){
       showModal(); 
    });
    $("#btnSaveInactiveOrderTypes").click(function () {
       $("#gridInactiveOrderTypes").jsonSubmit({
                 procedure: "order_type_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactive();
                    displayOrderType();
                    $('#modalInactiveOrderTypes').modal('toggle');
                }
        });
    });
    $("#btnDeleteOrderTypes").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                    displayInactive();
                    $('#modalInactiveOrderTypes').modal('toggle');
           }
        });       
    });
    
})();                        