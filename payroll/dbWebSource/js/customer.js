var customer = (function(){
    var _public = {};
    var  bs                     = zsi.bs.ctrl
        ,svn                    = zsi.setValIfNull
        ,gtw                    = null
        ;
    
    zsi.ready = function(){
         $(".page-title").html("Customers");
         gtw = new zsi.easyJsTemplateWriter();
         displayCustomerOrder();
        
    };
    
    
    function displayCustomerOrder(){   
        var _sidebar = $(".page-sidebar").width() - 400;
        $("#gridCustomers").dataBind({
             sqlCode    : "C142"
            // url            : app.execURL + "customers_sel @is_active=Y"
            ,parameters : {is_active: "Y"}
            ,width      : $(".zContainer").width()
            ,blankRowsLimit : 5
            ,height     : 300
            ,isPaging   : false
            ,dataRows   : [
        		 { text: "Customer Code"   ,width: 300 ,style:"text-align:left;" 
        		     ,onRender : function(d){return bs({name:"customer_id"          ,type:"hidden"  ,value: svn(d,"customer_id")})
                                                +   bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")})     		                               
        		                                +   bs({name:"customer_code"        ,value: svn(d,"customer_code")}) }
        		 }
        		,{ text:"Customer Name"    ,width: 380 ,style:"text-align:left;"     ,type:"input"   , name:"customer_name"}
        		,{text: "Active?"               ,name:"is_active"                ,type:"yesno"       ,width : 85    ,style : "text-align:center;"  ,defaultValue:"Y"}
        		,{ text:"Sites"            ,width: 40  ,style:"text-align:center;" 
    		        ,onRender    : function(d){ 
                        var _return = "<a href='javascript:void(0);' title='Sites'"
                                    + "onclick='customer.showModalCustomer(\""+ "Sites" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'><i class='fas fa-link'></i> </a>";
                        return (! (d) ? "" : _return);
        		    }
        		}
        		,{
        		    text:"Contacts"         ,width: 65  ,style : "text-align:center;"
        		    ,onRender : function(d){
        		        var _return = "<a href='javascript:void(0);' title='Contacts'"
        		                    + "onclick='customer.showModalCustomer(\""+ "Contacts" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'><i class='fas fa-link'></i></a>";
        		        return (! (d) ? "" : _return);
        		    }
        		}
        		,{
        		    text:"Programs"         ,width: 70  ,style : "text-align:center;"
        		    ,onRender : function(d){
        		        var _return = "<a href='javascript:void(0);' title='Programs'"
        		                    + "onclick='customer.showModalCustomer(\""+ "Programs" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'><i class='fas fa-link'></i></a>";
        		        return (! (d) ? "" : _return);
        		    }
        		}
    	    ]
    	    ,onComplete : function(o){
    	        this.find('[data-toggle="tooltip"]').tooltip(); 
    	    }
        });    
    }
    
     function displayInactiveCustomers(){
         var cb = app.bs({name:"cbFilter",type:"checkbox"});
         $("#gridInactiveCustomers").dataBind({
    	     //url            : app.execURL + "customers_sel @is_active=N"
    	     sqlCode        : "C142"
    	    ,parameters     : {is_active: "N"}
    	    ,width          : $("#frm_modalInactive").width() - 15
    	    ,height         : $(document).height() - 300
            ,blankRowsLimit : 5
            ,isPaging       : false
            ,dataRows       : [
        		 { text: "Customer Code"   ,width: 300 ,style:"text-align:left;" 
        		     ,onRender : function(d){return bs({name:"customer_id"          ,type:"hidden"  ,value: svn(d,"customer_id")})
                                                +   bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")})     		                               
        		                                +   bs({name:"customer_code"        ,value: svn(d,"customer_code")}) }
        		 }
        		,{ text:"Customer Name"    ,width: 380 ,style:"text-align:left;"     ,type:"input"   , name:"customer_name"}
        		,{text: "Active?"               ,name:"is_active"                ,type:"yesno"       ,width : 85    ,style : "text-align:center;"  ,defaultValue:"Y"}
    	    ]
    	    ,onComplete: function(o){
                this.find("#cbFilter").setCheckEvent("#gridInactiveCustomers input[name='cb']");
            }
        });    
    }
     $("#btnDeleteCustomer").click(function(){
        zsi.form.deleteData({
             code       : "ref-00020"
            ,onComplete : function(data){
                    displayInactiveCustomers();
                  }
        });       
    });
    
    $("#btnSaveCustomers").click(function () {
        $("#gridCustomers").jsonSubmit({
                 procedure: "customers_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) { 
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayCustomerOrder();
                }
        });
    });
     $("#btnInactiveCustomers").click(function () {
        $(".modal-title").text("Inactive Customers");
        $('#modalInactiveCustomers').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveCustomers();
        
    });
     $("#btnSaveInactiveCustomers").click(function () {
       $("#gridInactiveCustomers").jsonSubmit({
                 procedure: "customers_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveCustomers();
                    displayCustomerOrder();
                }
        });
    });
        _public.showModalCustomer = function(tabName, id,name) {
        var _$body = $("#frm_modalCustomer").find(".modal-body");
        
        g$mdl = $("#modalCustomer");
        g$mdl.find(".modal-title").text("Customer » " + name ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
        if (tabName === "Sites") _$body.find("#nav-tab").find("[aria-controls='nav-sites']").trigger("click");
        else if (tabName === "Contacts") _$body.find("#nav-tab").find("[aria-controls='nav-c']").trigger("click");
        else _$body.find("#nav-tab").find("[aria-controls='nav-p']").trigger("click");
    
        
        displaySites(id);
        displayCustomerContacts(id);
        displayCustomerPrograms(id);
    };
    
    
    _public.submitCustomerSites = function(){
        var _$grid = $("#grid-Sites");
            _$grid.jsonSubmit({
             procedure: "customer_sites_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displaySites(_$grid.data("id"));
            }
        });
    }    ;
    _public.submitCustomerContacts = function(){
        var _$grid = $("#grid-Contacts");
            _$grid.jsonSubmit({
             procedure: "customer_contacts_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayCustomerContacts(_$grid.data("id"));
            }
        });
    };    
    _public.submitCustomerPrograms = function(){
        var _$grid = $("#grid-Programs");
            _$grid.jsonSubmit({
             procedure: "customer_programs_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayCustomerPrograms(_$grid.data("id"));
            }
        });
    };    
    
    function displaySites(id){
        $("#grid-Sites").dataBind({
             sqlCode    : "C146"
            ,parameter  : {site_id : id}
            ,width          : $(".modal-body").width() - 20
            ,height         : 360
            ,blankRowsLimit : 5
            ,dataRows   : [
        		 { text: "Site Code"        ,width:100                              ,style:"text-align:center;" 
        		     ,onRender : function(d){return bs({name:"site_id"              ,type:"hidden"   ,value: svn(d,"site_id")})
                                                +   bs({name:"is_edited"            ,type:"hidden"   ,value: svn(d,"is_edited")})
                                                +   bs({name:"site_code"            ,value: svn(d,"site_code")}) }
        		 }
        		,{ text:"Site Address"      ,width:350 ,style:"text-align:center;" 
        		    ,onRender: function(d){
        		                       return bs({name:"site_address"   ,type:"input"   ,value: svn(d,"site_address")})
        		                            + bs({name:"customer_id"    ,type:"hidden"  ,value: id}); 
        		    }
        		} 
        		,{ text:"Is Active?"        ,width:75  ,style:"text-align:center;"   ,type:"yesno"      , name:"is_active"  ,defaultValue:"Y"}	 	 
    	    ]
    	    ,onComplete : function(o){
    	        this.data("id", id);
    	    }
        });    
        
    }
    function displayCustomerContacts(id){
        $("#grid-Contacts").dataBind({
             sqlCode    : "C154"
            ,parameter  : {customer_contact_sp_id : id}
            ,width          : $(".modal-body").width() - 20
            ,height         : 360
            ,blankRowsLimit : 5
            ,dataRows   : [
                            { text: "Contact Name"        ,width:100                             ,style:"text-align:center;" 
                    		     ,onRender   : function(d){return   bs({name:"customer_contact_sp_id"   ,type:"hidden"      ,value: svn(d,"customer_contact_sp_id")})
                                                                +   bs({name:"customer_id"              ,type:"hidden"      ,value: id})
                                                                +   bs({name:"is_edited"                ,type:"hidden"      ,value: svn(d,"is_edited")})
                    		                                    +   bs({name:"contact_name"             ,type:"input"       ,value: svn(d,"contact_name")})
                    		         
                    		     }     
                    		 }
                            
                            ,{ text:"Contact Number"        ,width:250          ,style:"text-align:center;"      ,type:"input"    , name:"contact_no"}
                            ,{ text:"Contact Email"         ,width:250          ,style:"text-align:center;"      ,type:"input"    , name:"contact_email_add"}
                            ,{ text:"Is Active?"            ,width:75           ,style:"text-align:center;"      ,type:"yesno"    , name:"is_active"  ,defaultValue:"Y"}	 	 
                          ]
               ,onComplete : function(o){
    	        this.data("id", id);
    	       // this.find("[name='customer_id']").dataBind("customers");
    	    }
        });
    }
    function displayCustomerPrograms(id){
        $("#grid-Programs").dataBind({
             sqlCode    : "C156"
            ,parameter  : {customer_program_id : id}
            ,width          : $(".modal-body").width() - 20
            ,height         : 360
            ,blankRowsLimit : 5
            ,dataRows   :   [
                            {  text: "OEM"      ,width : 400    ,style:"text-align:center"
                                ,onRender   : function(d){return    app.bs({name:"customer_program_id"      ,type:"hidden"      ,value: app.svn(d,"customer_program_id")})
                                                                +   app.bs({name:"customer_id"              ,type:"hidden"      ,value: id})
                                                                +   app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                                                +   app.bs({name:"oem_id"                   ,type:"select"      ,value: app.svn(d,"oem_id")}) 
                                                              
                                    
                                }     
                                     
                            }   
                            ,{ text:"Program {OEM Part Number}"  ,width:400           ,style:"text-align:center;"       ,name:"program_part_id"          ,type:"select"}
                            ,{ text:"Customer Part No"           ,width:100           ,style:"text-align:center;"       ,type:"input"    , name:"customer_part_no" } 
                            ,{ text:"Is Active?"                 ,width:75            ,style:"text-align:center;"       ,type:"yesno"    , name:"is_active"  ,defaultValue:"Y"} 
                    ] 
                    ,onComplete : function(o){ 
            	       this.data("id", id);  
            	       this.find("[name='oem_id']").dataBind({
                        sqlCode     : "O149" 
                        ,text       : "oem_name"
                        ,value      : "oem_id"
                        ,onChange   : function(){
                            var _$program = this.closest(".zRow").find("#program_part_id"); 
                            _$program.dataBind({
                                sqlCode     : "D209"
                                ,parameters : {oem_id : this.val()}
                                ,text       : "program_part"
                                ,value      : "oem_program_part_id"
                            });
                            
                        }
                        ,onComplete   : function(){  
                            var _zRow = this.closest(".zRow");
                            var _$program = _zRow.find("select[name='program_part_id']"); 
                            var _oemId = _zRow.find("select[name='oem_id']").val(); 
                            _$program.dataBind({
                                sqlCode     : "D209" 
                                ,parameters : {oem_id : (_oemId ? _oemId : "")}
                                ,text       : "program_part"
                                ,value      : "oem_program_part_id"
                            }); 
                            
                        }
                         
                    }); 
                    
                      
                         
                            
                
                 

                 
    	    }
        });
    }
    return _public;
})();
 
 
 
 
 
        