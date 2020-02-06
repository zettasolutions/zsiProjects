var devices = (function(){
    var _pub            = {}
        ,gCompanyCode   = "";
    
    zsi.ready = function(){
        $(".page-title").html("Devices");
        displayDevices();
        $("#company_id").dataBind({
            sqlCode    : "C1216" //company_info_sel
           ,text       : "company_name"
           ,value      : "registration_code"
           ,onChange   : function(d){
                var _info           = d.data[d.index - 1]
                    _company_code   = isUD(_info) ? "" : _info.company_code;
                gCompanyCode = _company_code;
                displayDevices(_company_code);
           }
       });
    };
    
    
    function displayDevices(id){
        $("#gridDevices").dataBind({
             sqlCode        : "D1214" //devices_sel
            ,parameters     : {company_code:(id ? id : "")} 
            ,height         : $(window).height() - 280
            ,blankRowsLimit : id ? 5 : 0            
            ,dataRows       : [
                {text: "Mac Address"                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"device_id"         ,type:"hidden"      ,value: app.svn(d,"device_id")})
                                 + app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"company_code"      ,type:"hidden"      ,value: id}) 
                                 + app.bs({name:"mac_address"       ,type:"input"       ,value: app.svn(d,"mac_address")});
                                 
                        }
                }
                ,{text: "Serial No."                    ,name:"serial_no"               ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Device Description"            ,name:"device_desc"             ,type:"input"       ,width : 250   ,style : "text-align:left;"}
                ,{text: "Active?"                       ,name:"is_active"               ,type:"yesno"       ,width : 50    ,style : "text-align:left;" ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
            }
        });
    }
    
    function displayInactive(id){ 
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
         $("#gridInactiveDevices").dataBind({
    	     sqlCode        : "D1214" //devices_sel
            ,parameters     : {company_code:(id ? id : ""),is_active: "N"}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return      app.bs({name:"device_id"          ,type:"hidden"      ,value: app.svn(d,"device_id")})
                                    + app.bs({name:"is_edited"          ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                    + app.bs({name:"company_code"       ,type:"hidden"      ,value: id}) 
                                    + (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                            
                        }
                }
                ,{text: "Mac Address"                 ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"mac_address"           ,type:"input"       ,value: app.svn(d,"mac_address")})
                                 + app.bs({name:"serial_no"             ,type:"hidden"      ,value: app.svn(d,"serial_no")}) 
                                 + app.bs({name:"device_desc"           ,type:"hidden"      ,value: app.svn(d,"device_desc")}) ;
                                 
                        }
                }
                ,{text: "Active?"                       ,name:"is_active"               ,type:"yesno"       ,width : 50    ,style : "text-align:left;" ,defaultValue:"N"}
            ]
    	    ,onComplete: function(o){
    	        var _zRow = this.find(".zRow");
    	        _zRow.find("[name='mac_address']").attr('readonly',true);
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveDevices input[name='cb']");
                
            }
        });  
    }
    
    $("#btnSaveDevices").click(function () {
        $("#gridDevices").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDevices").trigger("refresh");
            }
        });
    });
    
    $("#btnInactive").click(function(){
       var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactiveDevices");
        g$mdl.find(".modal-title").text("Inactive Devices") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive(gCompanyCode);
    });
    
    $("#btnSaveInactiveDevice").click(function () {
       $("#gridInactiveDevices").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDevices").trigger("refresh");
                $('#modalInactiveDevices').modal('toggle');
            }
        });
    });
    $("#btnDeleteDevices").click(function(){
        zsi.form.deleteData({
             code       : "ref-00014"
            ,onComplete : function(data){
                    $("#gridDevices").trigger("refresh");
                    $('#modalInactiveDevices').modal('toggle');
           }
        });       
    });
    
    return _pub;
})();               