var customer = (function(){
    var _public = {};
    var  bs                     = zsi.bs.ctrl
        ,svn                    = zsi.setValIfNull
        ,gtw                    = null
        ,gCustomerId            = null
        ,gCustName              = "customer_name"
        ,gOemId                 = ""
        ,gContactId             = ""
    ;

    $.fn.setValueIfChecked = function(){
        var _$zRow = this.closest(".zRow");
        var _progId = _$zRow.find("[name='program_id']");
        var _tempId = _$zRow.find("[name='tempProg_id']").val();
        if(this.prop("checked") === true){
            _progId.val(_tempId);
            
        }else{
            _progId.val("");
            
        }
    };    
    zsi.ready = function(){
         $(".page-title").html("Customers");
         gtw = new zsi.easyJsTemplateWriter();
         displayCustomerOrder();
         setSearch();  
    };
    
    //Public functions
    _public.showModalCustomer = function(id,tabName,name) {
        var _$body = $("#frm_modalCustomer").find(".modal-body");
        gCustomerId = id;
        g$mdl = $("#modalCustomer");
        g$mdl.find(".modal-title").text("Customer » " + name ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
        if (tabName === "Sites") _$body.find("#nav-tab").find("[aria-controls='nav-sites']").trigger("click");
        else if (tabName === "Contacts") _$body.find("#nav-tab").find("[aria-controls='nav-c']").trigger("click");
        else _$body.find("#nav-tab").find("[aria-controls='nav-p']").trigger("click");
    
        
        displaySites(id);
        displayCustomerContacts(id);
    };
    _public.showModalPrograms = function(contactId,name) {
        gContactId = contactId;
        var _$body = $("#frm_modalContactPrograms").find(".modal-body");
        g$mdl = $("#modalContactPrograms");
        g$mdl.find(".modal-title").text("Contact » " + name ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
        g$mdl.find("#dd_search_oem").dataBind({
             sqlCode    : "D259" //dd_oem_sel
            ,text       : "oem_name"
            ,value      : "oem_id" 
            ,onChange   : function(){
                gOemId = this.val();
            }
        }); 
        
        displayPrograms(contactId);
    }; 
    _public.searchProgVal = function(){
        console.log("gContactId",gContactId);
        var _searchVal = $.trim($("#searchProgVal").val()); 
        displayPrograms(gContactId,gOemId,_searchVal);
        
    };
    _public.resetProgVal = function(){
        var g$mdl = $("#modalContactPrograms");
        g$mdl.find("#dd_search_oem").val("");
        g$mdl.find("#searchProgVal").val("");
        displayPrograms(gContactId);
        
    };
    _public.submitCustomerSites = function(){
        var _$grid = $("#grid-Sites");
        if( _$grid.checkMandatory()!==true) return false;
            _$grid.jsonSubmit({
             procedure: "customer_sites_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displaySites(_$grid.data("id"));
            }
        });
    };
    _public.submitCustomerContacts = function(){
        var _$grid = $("#grid-Contacts");
            _$grid.jsonSubmit({
             procedure: "customer_contacts_upd"
            ,optionalItems: ["is_active"] 
            ,notIncludes : ["programs"] 
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayCustomerOrder();
                displayCustomerContacts(_$grid.data("id"));
            }
        });
    }; 
    //Private functions
    function displayCustomerOrder(searchVal){  
        $("#gridCustomers").dataBind({
             sqlCode    : "C142" //customer_sel
            ,parameters  : {search_val: (searchVal ? searchVal : "")} //{site_code : siteCode}
            ,blankRowsLimit : 5
            ,height     : $(window).height() - 260
            ,isPaging   : false
            ,dataRows   : [
        		{text:"Customer Name"    ,width: 250 ,style:"text-align:left;"         ,type:"input"   , name:"customer_name"  ,sortColNo : 2
        		    ,onRender : function(d){return  app.bs({name:"customer_id"         ,type:"hidden"  ,value: app.svn(d,"customer_id")})
                                                +   app.bs({name:"is_edited"           ,type:"hidden"  ,value: app.svn(d,"is_edited")})     		                               
        		                                +   app.bs({name:"customer_code"       ,type:"hidden"  ,value: app.svn(d,"customer_code")})
        		                                +   app.bs({name:"customer_name"       ,value: svn(d,"customer_name")});}
        		}
        		,{ text:"Site Code(s)"            ,width: 400  ,style:"text-align:center;" 
    		        ,onRender    : function(d){ 
    		            var _sites = (app.svn(d,"site_code") ? app.svn(d,"site_code") : '<i class="fa fa-plus" style="color:#007bff!important;" aria-hidden="true" ></i>');
                        var _return = "<a href='javascript:void(0);' style='color:#007bff!important;' title='Sites'"
                                    + "onclick='customer.showModalCustomer(\""+ app.svn(d,"customer_id") +"\",\""+ "Sites" +"\",\"" +  app.svn(d,"customer_name")  + "\");'>" + _sites + " </a>";
                        return (! (d) ? "" : _return );
        		    }
        		}
        		,{
        		    text:"Contacts"         ,width: 400  ,style : "text-align:center;"
        		    ,onRender : function(d){
        		        var _contacts = (app.svn(d,"contacts") ? app.svn(d,"contacts") : '<i class="fa fa-plus" style="color:#007bff!important;" aria-hidden="true" ></i>');
        		        var _return = "<a href='javascript:void(0);'style='color:#007bff!important;' title='Contacts' class='autoCaps'"
        		                    + "onclick='customer.showModalCustomer(\""+ app.svn(d,"customer_id") +"\",\""+ "Contacts" +"\",\"" +  app.svn(d,"customer_name")  + "\");'>"+ _contacts +"</a>";
        		        return (! (d) ? "" : _return);
        		    }
        		}
        		,{text: "Active?"               ,name:"is_active"                  ,type:"yesno"       ,width : 50    ,style : "text-align:center;"  ,defaultValue:"Y"}
    	    ]
    	    ,onComplete : function(o){
    	        this.find("input[name='customer_name']").checkValueExists({code : "ref-00034", colName : "customer_name"}); 
    	        this.find('[data-toggle="tooltip"]').tooltip(); 
    	        this.data("searchVal",searchVal);
    	        this.on('dragstart', function () {
                    return false;
                });
    	    }
        });    
    }
    function displayInactiveCustomers(){
         var cb = app.bs({name:"cbFilter",type:"checkbox"});
         $("#gridInactiveCustomers").dataBind({
    	     sqlCode        : "C142" //customer_sel
    	    ,parameters     : {search_col:"",search_val:"",is_active: "N"}
    	    ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return      app.bs({name:"customer_id"           ,type:"hidden"  ,value: app.svn(d,"customer_id")})
                                    + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")})
                                    + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                            
                        }
                }
        		,{ text: "Customer Name"                                                     ,width: 250          ,style: "text-align:left;" 
        		     ,onRender :   function(d){
        		        return app.bs({name:"customer_code"                 ,type:"hidden"      ,value: app.svn(d,"customer_code")})
        		             + app.bs({name:"customer_name"                                     ,value: app.svn(d,"customer_name")});
        		     }
        		 }
        		,{text: "Active?"        ,name: "is_active"                 ,type:"yesno"    ,width : 50          ,style: "text-align:center;"  ,defaultValue:"N"}
    	    ]
    	    ,onComplete: function(o){
    	        var _zRow = this.find(".zRow");
    	        _zRow.find("[name='customer_code']").attr('readonly',true);
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveCustomers input[name='cb']");
                this.on('dragstart', function () {
                    return false;
                });
            }
        });    
    }
    function displaySites(id){
        $("#grid-Sites").dataBind({
             sqlCode        : "C146" //customer_sites_sel
            ,parameters     : {customer_id : id}
            ,height         : $(window).height() - 360
            ,blankRowsLimit : 5
            ,dataRows   : [
        		 { text: "Site Code"        ,width:160                                  ,style:"text-align:center;" 
        		     ,onRender : function(d){return app.bs({name:"site_id"              ,type:"hidden"   ,value: app.svn(d,"site_id")})
                                                +   app.bs({name:"is_edited"            ,type:"hidden"   ,value: app.svn(d,"is_edited")})
                                                +   app.bs({name:"site_code"            ,value: svn(d,"site_code")}) }
        		 }
        		,{ text:"Building No"   ,width:100      ,type:"input"                  ,name:"bldg_no"         ,style:"text-align:center;" }
        		,{ text:"Street Address",width:200      ,type:"input"                  ,name:"street_address"  ,style:"text-align:left;" }
        		,{ text:"City"          ,width:100      ,type:"input"                  ,name:"city"            ,style:"text-align:left;" }
        		,{ text:"State"         ,width:200      ,type:"input"                  ,name:"state"           ,style:"text-align:left;" }
        		,{ text:"ZIP Code"      ,width:70       ,type:"input"                  ,name:"zip_code"        ,style:"text-align:center;" }
        		,{ text:"Country"       ,width:100                                                             ,style:"text-align:left;" 
        		    ,onRender : function(d){return app.bs({name:"country"              ,type:"input"   ,value: app.svn(d,"country")})
        		                                 + app.bs({name:"customer_id"          ,type:"hidden"   ,value: id});}
        		} 
        		,{ text:"Active?"       ,width:50       ,style:"text-align:center;"    ,type:"yesno"      ,name:"is_active"  ,defaultValue:"Y"}	 	 
    	    ]
    	    ,onComplete : function(o){ 
    	        markCustomerSites();
    	        this.data("id", id);
    	        this.find("input[name='site_code']").checkValueExists({code : "ref-00028", colName : "site_code"}); 
    	        this.find('.zRow').find("input[name='street_address'],input[name='city'],input[name='state'],input[name='country']").addClass('autoCaps');
	            var _$siteAddress = this.find("textarea[name='site_address']");
	            _$siteAddress.css('resize','none');
	            _$siteAddress.popover({
	                placement: 'auto',
	                trigger: 'click',
	                html: true,
	                sanitize: false,
	                content: function () {
                        return $('#popoverContent').html(); //From pagetemplate
                    } 
                });
    	        _$siteAddress.on('shown.bs.popover', function(){
    	            var _$this = $(this);
                    var _tmpSiteAddress = $('.popover').find('#tmp_site_address');
                        _tmpSiteAddress.unbind().focus().val(_$this.val());
                        _tmpSiteAddress.keyup(function(){
                            _$this.val(this.value);
                            _$this.closest(".zRow").find("#is_edited").val("Y");
                        });
                        _tmpSiteAddress.focusout(function(){
                            _$this.popover('hide');
                        });
                });
                
                this.on('dragstart', function () {
                    return false;
                });
    	    }
        });
    }
    function displayInactiveCustomerSites(id){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        $("#gridInactiveCustomerSites").dataBind({
             sqlCode        : "C146" //customer_sites_sel
            ,parameters     : {customer_id : id,is_active : "N"}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return      app.bs({name:"site_id"              ,type:"hidden"   ,value: app.svn(d,"site_id")})
                                    + app.bs({name:"is_edited"            ,type:"hidden"   ,value: app.svn(d,"is_edited")})
                                    + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                            
                        }
                }
        		,{ text: "Site Code"        ,width:235                              ,style:"text-align:center;" 
        		     ,onRender : function(d)
		                { return      app.bs({name:"site_code"            ,type:"input"   ,value: app.svn(d,"site_code")}) 
		                            + app.bs({name:"street_address"       ,type:"hidden"  ,value: app.svn(d,"street_address")})
		                            + app.bs({name:"bldg_no"              ,type:"hidden"  ,value: app.svn(d,"bldg_no")})
	                                + app.bs({name:"city"                 ,type:"hidden"  ,value: app.svn(d,"city")})
	                                + app.bs({name:"state"                ,type:"hidden"  ,value: app.svn(d,"state")})
	                                + app.bs({name:"zip_code"             ,type:"hidden"  ,value: app.svn(d,"zip_code")})
	                                + app.bs({name:"country"              ,type:"hidden"  ,value: app.svn(d,"country")})
	                                + app.bs({name:"customer_id"          ,type:"hidden"  ,value: id});
        		     }
        		 } 
        		,{ text:"Active?"        ,width:50      ,style:"text-align:center;"   ,type:"yesno"       ,name:"is_active"  ,defaultValue:"N"}	 	  
    	    ]
    	    ,onComplete : function(o){
    	        var _zRow = this.find(".zRow");
    	        _zRow.find("[name='site_code']").attr('readonly',true);
    	        this.find("[name='cbFilter2']").setCheckEvent("#gridInactiveCustomerSites input[name='cb']");
    	        this.data("customer_id",id);
    	        this.on('dragstart', function () {
                    return false;
                });
    	    }
        });
    }
    function displayCustomerContacts(id){
        $("#grid-Contacts").dataBind({
             sqlCode    : "C154" //customer_contacts_sel
            ,parameters  : {customer_id : id}
            ,height         : $(window).height() - 360
            ,blankRowsLimit : 5
            ,dataRows   : [
                 {text: "Contact Name"        ,width:170                             ,style:"text-align:center;" 
        		     ,onRender   : function(d){return   app.bs({name:"customer_contact_sp_id"   ,type:"hidden"      ,value: app.svn(d,"customer_contact_sp_id")})
                                                    +   app.bs({name:"customer_id"              ,type:"hidden"      ,value: id})
                                                    +   app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
        		                                    +   app.bs({name:"contact_name"             ,type:"input"       ,value: app.svn(d,"contact_name")});
        		         
        		     }     
        		 }
                ,{text:"Contact Number"         ,width:140          ,style:"text-align:center;"      ,type:"input"   , name:"contact_no"}
                ,{text:"Contact Email"          ,width:180          ,style:"text-align:center;"      ,type:"input"   , name:"contact_email_add"}
                ,{text: "Contact Title"         ,width:150          ,style:"text-align:left;"        ,type:"input"   , name:"contact_title"}                         
                ,{text:"Active?"                ,width:50           ,style:"text-align:center;"      ,type:"yesno"   , name:"is_active"  ,defaultValue:"Y"}	 	 
        		,{text:"Programs"               ,width:200          ,style:"text-align:center;"     ,type:"input"    , name:"programs"
        		    ,onRender : function(d){
        		        var _programs = (app.svn(d,"programs") ? app.svn(d,"programs") : '<i class="fa fa-plus" style="color:#007bff!important;" aria-hidden="true" ></i>');
        		        var _return = "<a href='javascript:void(0);' style='color:#007bff!important;' title='Programs' class='autoCaps'"
        		                    + "onclick='customer.showModalPrograms(\"" +  app.svn(d,"customer_contact_sp_id")  + "\",\"" +  app.svn(d,"contact_name")  + "\");'>"+ _programs +"</a>";
        		        return (! (d) ? "" : _return);
        		    }
        		    
        		}                         
              ]
            ,onComplete : function(o){
	            this.data("id", id);
	            this.find('.zRow').find('input[name="contact_name"]').addClass('autoCaps');
	            this.on('dragstart', function () {
                    return false;
                });
    	    }
        });
    }
    function displayInactiveCustomerContacts(id){
        var cb = app.bs({name:"cbFilter3",type:"checkbox"});
        $("#gridInactiveCustomerContacts").dataBind({
             sqlCode        : "C154" //customer_contacts_sel
            ,parameters     : {customer_id : id,is_active : "N"}
            ,height         : 360
            ,dataRows   : [
                 {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return       app.bs({name:"customer_contact_sp_id"   ,type:"hidden"      ,value: app.svn(d,"customer_contact_sp_id")})
                                    +  app.bs({name:"customer_id"              ,type:"hidden"      ,value: app.svn(d,"customer_id")})
                                    +  app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                    + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                            
                        }
                }
        		,{ text: "Contact Name"        ,width:235                                 ,style:"text-align:center;" 
        		     ,onRender   : function(d){return app.bs({name:"contact_name"         ,type:"input"       ,value: app.svn(d,"contact_name")})
                                        		    + app.bs({name:"contact_no"           ,type:"hidden"      ,value: app.svn(d,"contact_no")})
                                        		    + app.bs({name:"contact_email_add"    ,type:"hidden"      ,value: app.svn(d,"contact_email_add")})
                                        		    + app.bs({name:"contact_title"        ,type:"hidden"      ,value: app.svn(d,"contact_title")});}     
        		 } 
        		,{ text:"Active?"        ,width:50      ,style:"text-align:center;"   ,type:"yesno"       ,name:"is_active"  ,defaultValue:"N"}	 	 
    	    ]
    	    ,onComplete : function(o){
    	         var _zRow = this.find(".zRow");
    	        _zRow.find("input[name='contact_name']").attr('readonly',true);
    	        this.find("[name='cbFilter3']").setCheckEvent("#gridInactiveCustomerContacts input[name='cb']");
    	        this.on('dragstart', function () {
                    return false;
                });
    	    }
        });
    }
    function displayPrograms(contactId,oemId,keywordVal){
        var  cb          = app.bs({name:"cbFilterProg",type:"checkbox"})
            ,_cbChecked  = true
        ;
        $("#gridPrograms").dataBind({
                 sqlCode     : "C261"//contact_programs_list_sel
                ,parameters  : {oem_id: (oemId ? oemId : null), contact_id: contactId, keyword: (keywordVal ? keywordVal : null)}
                ,height      : 360
                ,dataRows    : [
                    {text: cb  ,width : 25   ,style : "text-align:left" 
                        ,onRender: function(d){
                            if(!app.svn(d,"contact_program_id")) _cbChecked = false;
                            
                            var _r="";
                            _r  += app.bs({name:"contact_program_id"            ,type:"hidden"      ,value: app.svn (d,"contact_program_id")}); 
                            _r  += app.bs({name:"contact_id"                    ,type:"hidden"      ,value: contactId});
                            _r  += app.bs({name:"is_edited"                     ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                            _r  += app.bs({name:"tempProg_id"                   ,type:"hidden"      ,value: app.svn(d,"program_id")});
                            
                            if( app.svn(d,"contact_program_id") ){
                                _r  +=app.bs({name:"cb"                        ,type:"checkbox"    ,checked: true });
                                _r  += app.bs({name:"program_id"               ,type:"hidden"      ,value: app.svn(d,"program_id")});

                            }else{
                                _r  +=app.bs({name:"cb"                        ,type:"checkbox"    ,checked: false });
                                _r  += app.bs({name:"program_id"               ,type:"hidden"      ,value: ""});
                            }
                            return _r;     
                        }
                    }
                    ,{text: "Program Code"        ,name : "program_code"        ,type : "input"     ,width : 300  ,style : "text-align:left"}
                ]
                ,onComplete  : function(d){
                    var _cbFilter = this.find("[name='cbFilterProg']");
                    _cbFilter.setCheckEvent("#gridPrograms input[name='cb']");
                    
                    if(_cbChecked){
                        _cbFilter.attr("checked", true);
                    }
                    this.find('input[type="checkbox"]').click(function(){
                       $(this).setValueIfChecked();
                       
                    });
                    this.on('dragstart', function () {
                    return false;
                });
            
                }
        });
     
    }      
    function markCustomerSites(){
        $("#grid-Sites").markMandatory({       
          "groupNames":[
                {
                     "names" : ["site_code","street_address","city","state","zip_code","country"]
                    ,"type":"M"
                }             
              
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Site Code","Street Address","City","State","ZIP Cod","Country"]}
          ]
        });    
    } 
    
    function setSearch(){
        var _$body = $("#frm_modalContactPrograms");
        var  _program = "";
        _$body.find("#search_program").keyup(function(){
            if($(this).val() === "") displayPrograms(gContactId,gOemId);
        });
        
        _$body.find("#search_program").on('keypress',function(e) {
            _program = $.trim(_$body.find("#search_program").val());
            if(e.which == 13) {
                displayPrograms(gContactId,gOemId,_program);
            }
        });
        
        _$body.find("#btnSearchProgram").click(function(){ 
            _program = $.trim(_$body.find("#search_program").val());
                displayPrograms(gContactId,gOemId,_program);  
        }); 
        
        _$body.find("#btnResetProgram").click(function(){
            _$body.find("#search_program").val("");
            displayPrograms(gContactId,gOemId);
                
        });
    
        
    }
    
     
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        displayCustomerOrder(_searchVal);
    }); 
    $("#searchVal").on('keypress',function(e) {
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
            displayCustomerOrder(_searchVal);
        }
    });
    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayCustomerOrder();
        }
    });
    $("#btnResetVal").click(function(){
        displayCustomerOrder();
    });


    //Buttons
    $("#btnDeleteCustomer").click(function(){
        zsi.form.deleteData({
             code       : "ref-00026"
            ,onComplete : function(data){
                    displayInactiveCustomers();
                    $('#modalInactiveCustomers').modal('toggle');
                  }
        });       
    });
    $("#btnDeleteCustomerSite").click(function(){
        zsi.form.deleteData({
             code       : "ref-00029"
            ,onComplete : function(data){
                    displayInactiveCustomerSites(gCustomerId);
                    $('#modalInactiveCustomerSites').modal('toggle');
                  }
        });       
    });
    $("#btnDeleteCustomerContact").click(function(){
        zsi.form.deleteData({
             code       : "ref-00030"
            ,onComplete : function(data){
                    displayInactiveCustomerContacts(gCustomerId);
                    $('#modalInactiveCustomerContacts').modal('toggle');
                  }
        });       
    });
    $("#btnSaveCustomers").click(function () {
        $("#gridCustomers").jsonSubmit({
                 procedure: "customers_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) { 
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayCustomerOrder($("#gridCustomers").data("searchCol"),$("#gridCustomers").data("searchVal"));
                }
        });
    });
    $("#btnSavePrograms").click(function () {
        var _$frm = $("#frm_modalContactPrograms");
        var _$grid = _$frm.find("#gridPrograms");
            _$grid.jsonSubmit({
                 procedure: "contact_programs_upd" 
                ,notIncludes : ["tempProg_id","program_code"]
                ,onComplete: function(data){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");  
                    $("#gridPrograms").trigger("refresh");
                    $("#grid-Contacts").trigger("refresh");
                    _$frm.closest(".modal").modal("hide");
                }
            });
    });


    $("#btnSaveInactiveCustomerSites").click(function () {
        $("#gridInactiveCustomerSites").jsonSubmit({
                 procedure: "customer_sites_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) { 
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveCustomerSites(gCustomerId);
                    $("#grid-Sites").trigger("refresh");
                    $('#modalInactiveCustomerSites').modal('toggle');
                }
        });
    });
    $("#btnSaveInactiveCustomerContactss").click(function () {
        $("#gridInactiveCustomerContacts").jsonSubmit({
                 procedure: "customer_contacts_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) { 
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveCustomerContacts(gCustomerId);
                     displayCustomerOrder();
                    $("#grid-Contacts").trigger("refresh");
                    $('#modalInactiveCustomerContacts').modal('toggle');
                }
        });
    });
    $("#btnInactiveCustomers").click(function () {
        $(".modal-title").text("Inactive Customer(s)");
        $('#modalInactiveCustomers').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveCustomers();
        
    });
    $("#btnInactiveCustomerSites").click(function () {
        $(".modal-title").text("Inactive Site(s)");
        $('#modalInactiveCustomerSites').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveCustomerSites(gCustomerId);
        
    });
    $("#btnInactiveCustomerContacts").click(function () {
        $(".modal-title").text("Inactive Contact(s)");
        $('#modalInactiveCustomerContacts').modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveCustomerContacts(gCustomerId);
        
    });
    $("#btnSaveInactiveCustomers").click(function () {
       $("#gridInactiveCustomers").jsonSubmit({
                 procedure: "customers_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayInactiveCustomers();
                    displayCustomerOrder();
                    $('#modalInactiveCustomers').modal('toggle');
                }
        });
    });
    
    return _public;
})();
                                                             