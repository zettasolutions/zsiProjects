(function(){
    var  bs          = zsi.bs.ctrl
    ;
    var svn =  zsi.setValIfNull;
    
    zsi.ready = function(){
        $(".page-title").html("Warehouses");
        displayRecords();
    };
     
    //Private functions
    function displayRecords(searchVal){
        $("#gridWarehouse").dataBind({
    	     sqlCode        : "W163" //warehouses_sel
    	    ,parameters  : {search_val: (searchVal ? searchVal : "")}
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(window).height() - 260
            ,blankRowsLimit : 5
            ,dataRows       : [
                { text:"Warehouse Name"            ,width:200                                                        ,style:"text-align:left;"   ,sortColNo : 0
    	            , onRender  :  function(d)
                        { return  bs({name:"warehouse_id"           ,type:"hidden"      ,value: svn (d,"warehouse_id")}) 
                                + bs({name:"is_edited"              ,type:"hidden"      ,value: svn (d,"is_edited")})
                                + bs({name:"warehouse_code"         ,type:"hidden"      ,value: svn (d,"warehouse_code")})
                                + bs({name:"warehouse_name"         ,type:"input"       ,value: svn (d,"warehouse_name")}); 
                        }
    	        }
    	        ,{ text:"Street Address"            ,width:150      ,type:"input"       ,name:"warehouse_address"      ,style:"text-align:left;"   ,sortColNo : 1} 
    	        ,{ text:"City"                      ,width:150      ,type:"input"       ,name:"city"                   ,style:"text-align:left;"   ,sortColNo : 2}
        		,{ text:"State"                     ,width:200      ,type:"input"       ,name:"state"                  ,style:"text-align:left;"   ,sortColNo : 3}
        		,{ text:"ZIP Code"                  ,width:70       ,type:"input"       ,name:"zipcode"                ,style:"text-align:center;" ,sortColNo : 4}
        		,{ text:"Country"                   ,width:100      ,type:"input"       ,name:"country"                ,style:"text-align:left;"   }
        		,{ text:"Warehouse Contact(s)"      ,width:450                          ,name:"warehouse_contacts"     ,style:"text-align:left;" 
        		    ,onRender : function(d){ return app.svn(d,"warehouse_contacts")}
        		}
    	        ,{ text:"Active?"                   ,width:50       ,type:"yesno"       ,name:"is_active"              ,style:"text-align:center;"    ,defaultValue:"Y"}
            ]
        	,onComplete: function(){
                this.find('.zRow').find("input[name='warehouse_address'],input[name='city'],input[name='state'],input[name='country']").addClass('autoCaps');
                this.find("input[name='warehouse_name']").checkValueExists({code : "ref-00038", colName : "warehouse_name"}); 
                this.on('dragstart', function () {
                    return false;
                });
               /* var _$whsAddress = this.find("textarea[name='warehouse_address']");
	            _$whsAddress.css('resize','none');
	            _$whsAddress.popover({
	                placement: 'auto',
	                trigger: 'click',
	                html: true,
	                sanitize: false,
	                content: function () {
                        return $('#popoverContent').html(); //From pagetemplate
                    } 
                });
    	        _$whsAddress.on('shown.bs.popover', function(){
    	            var _$this = $(this);
                    var _tmpWhsAddress = $('.popover').find('#tmp_whs_address');
                        _tmpWhsAddress.unbind().focus().val(_$this.val());
                        _tmpWhsAddress.keyup(function(){
                            _$this.val(this.value);
                            _$this.closest(".zRow").find("#is_edited").val("Y");
                        });
                        _tmpWhsAddress.focusout(function(){
                            _$this.popover('hide');
                        });
                });*/
            }  
        });    
    }
    function displayInActiveWarehouses(){
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#gridInactiveWarehouses").dataBind({
    	     sqlCode        : "W163"
    	    ,parameters     : {is_active: "N"}
    	    ,width          : $(".modal-body").width()
    	    ,height         : 360
            ,dataRows       : [
                {text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  bs({name:"warehouse_id",type:"hidden",value: svn (d,"warehouse_id")}) 
                                + bs({name:"is_edited",type:"hidden"})
                                + bs({name:"warehouse_code",type:"hidden" ,value: svn (d,"warehouse_code")})
                                + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" ); 
                        }
                }	 
    	        ,{text  : "Warehouse Name"          , name  : "warehouse_name"      , type  : "input"   , width : 250     , style : "text-align:left;"
    	            , onRender  :  function(d)
                        { return  bs({name:"warehouse_name"     ,type:"input"   ,value: svn (d,"warehouse_name")}) 
                                + bs({name:"street_address"     ,type:"input"   ,value: svn (d,"warehouse_address")})
                                + bs({name:"city"               ,type:"input"   ,value: svn (d,"city")})
                                + bs({name:"state"              ,type:"input"   ,value: svn (d,"state")})
                                + bs({name:"zipcode"            ,type:"input"   ,value: svn (d,"zipcode")})
                                + bs({name:"country"            ,type:"input"   ,value: svn (d,"country")}); 
                        }
                
    	        }
    	        ,{text  : "Active?"                 , name  : "is_active"           , type  : "yesno"   , width : 50      , style : "text-align:center;"    ,defaultValue:"N"}
            ]
        	,onComplete: function(){
                $("[name='cbFilter1']").setCheckEvent("#gridInactiveWarehouses input[name='cb']");
                this.on('dragstart', function () {
                    return false;
                });
            }  
        });    
    }
    
    //Buttons
    $("#btnSave").click(function () {
       $("#gridWarehouse").jsonSubmit({
                 procedure: "warehouses_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                }
        });
    });
    $("#btnSaveInactiveWarehouses").click(function () {
       $("#gridInactiveWarehouses").jsonSubmit({
                 procedure: "warehouses_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                    displayInActiveWarehouses();
                    $('#modalInactiveWarehouses').modal('toggle');
                }
        });
    });
    $("#btnInactiveWarehouses").click(function () {
        $(".modal-title").text("Inactive Warehouse(s)");
        $('#modalInactiveWarehouses').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInActiveWarehouses();
        
    });
    $("button.btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0002"
            ,onComplete : function(data){
                displayRecords();
                displayInActiveWarehouses();
                $('#modalInactiveWarehouses').modal('toggle');
              }
        });       
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        displayRecords(_searchVal);
    }); 
    $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
            displayRecords(_searchVal);
        }
    });
    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayRecords();
        }
    });
    $("#btnResetVal").click(function(){
        displayRecords();
    });
})();

                                            