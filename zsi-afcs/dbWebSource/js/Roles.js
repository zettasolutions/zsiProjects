var roles = (function(){
    var pub             = {};
    var bs              = zsi.bs.ctrl;
    var svn             =  zsi.setValIfNull;
    var gMdlRoleMenus   = "modalRoleMenus";
    var modalWindow     = 0;
    var role_id         = null;
    var gMdlUsers       = "modalWindowUsers";
    var gtw             = null;
     
    zsi.ready=function(){
        $(".page-title").html("Roles");
        gtw = new zsi.easyJsTemplateWriter();
        displayRecords();
        getTemplate();
        
    };
    
    //Private Functions
    function clearGrid(){
        $("#" + tblNameUser).clearGrid();
    }
    function displayRecords(){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
             url            : app.procURL + "roles_sel"
            ,width          : $("#frm").width()
    	    ,height         : $(window).height() - 240
            ,blankRowsLimit:5
            ,dataRows       :[
        		 { text: cb             , width:25  , style:"text-align:left;"   
        		     ,onRender : function(d){
                                    return     app.bs({name:"role_id",      type:"hidden",  value: svn(d,"role_id") })
                                            +  app.bs({name:"is_edited",    type:"hidden"}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }             
        		 }	 
        		,{ text:"Role Name"     , width:200 , style:"text-align:center;"    ,type:"input"  ,name:"role_name"}	 
            //	,{text  : "Dashboard Page"          , name  : "page_id"             ,type  : "select"           , width : 300       , style : "text-align:left;"}
        	//	,{ text:"Export Excel?" , width:100 , style:"text-align:center;"    ,type:"yesno"  ,name:"is_export_excel"  ,defaultValue:"Y"}	 
        	//	,{ text:"Export Pdf?"   , width:100 , style:"text-align:center;"    ,type:"yesno"  ,name:"is_export_pdf"    ,defaultValue:"Y"}	 	 
        	//	,{ text:"Import Excel?" , width:100 , style:"text-align:center;"    ,type:"yesno"  ,name:"is_import_excel"  ,defaultValue:"Y"}
        // 		,{text  : "Add"         , name  : "is_add"          , type  : "yesno"         , width:60          , style : "text-align:center;"   ,defaultValue:"Y" }
        // 		,{text  : "Edit"        , name  : "is_edit"         , type  : "yesno"         , width:60          , style : "text-align:center;"   ,defaultValue:"Y" }
        // 		,{text  : "Delete"      , name  : "is_delete"       , type  : "yesno"         , width:60          , style : "text-align:center;"   ,defaultValue:"Y" }
        		,{ text:"Role Menu"     , width:80  , style:"text-align:center;"  
        		    ,onRender : function(d){ return "<a href='javascript:roles.showModalRoleMenus(" + svn(d,"role_id") + ",\"" +  svn(d,"role_name")  + "\");'><span class='badge'>" + svn(d,"countRoleMenus") + "</span></a>"; }
        		}	 
        		,{ text:"Users"         , width:81  , style:"text-align:center;" 
        		    ,onRender : function(d){
        		        return "<a href='javascript:roles.showModalUsers(" + svn(d,"role_id") + ",\"" + svn(d,"role_name") + "\");'><span class='badge'>" + svn(d,"countUsers") + "</span></a>";
        		      }
        		}	 	 
        		
    	       // ,{text  : "Dashboards"   , width : 100 , style:"text-align:center;" 
            //         ,onRender : function(d){ return "<a href='javascript:manageItemDashboard(" + svn(d,"role_id") + ",\"" +  svn(d,"role_name")  + "\");'><span class='badge'>" + svn(d,"countRoleDashboards") + "</span></a>"; }
            //     }
            ]
            ,onComplete: function(){
                $("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
            //    $("select[name='page_id']").dataBind( "pages");
            /* s$("select[name='user_id']").dataBind({
                      url: base_url + "selectoption/code/notUsers"
                    , isUniqueOptions:true
                    , onComplete: function(){
                        $("select[name='user_id']").setUniqueOptions();
                    }
                }); */ 
    	               
                 
            }
        });    
    }
    function displayRRolesMenu(id){   
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        $("#gridRoleMenus").dataBind({
             url            : app.procURL + "role_menus_sel @role_id=" + id 
            //,width          : $(document).width() - 10
    	    ,height         : 400
    	    
            ,dataRows       :[
        		 { text: cb             , width:25  , style:"text-align:left;" 
        		     ,onRender : function(d){ 
                                    return    app.bs({name:"role_menu_id",type:"hidden",value:svn (d,"role_menu_id")})  
                                            + app.bs({name:"role_id",type:"hidden",value: svn (d,"role_id") }) 
                                            + app.bs({name:"cb",type:"checkbox",checked :(d.role_id!==""?true:false)}) ;
                                        //    +  (d !==null ? bs({name:"cb1",type:"checkbox"}) : "" );
                                }            
    
        		 }	 
        		,{ text:"Menu Name"     , width:300 , style:"text-align:left;"   
        		    ,onRender: function(d){
        		        return app.bs({name: "menu_id" ,type:"hidden" ,value: d.menu_id})
        		            + d.menu_name;
        		    }
        		}	 
        
     	    ]
           ,onComplete : function(){
                setToNullIfChecked(id);
                this.data("id",id);
                $("[name='cbFilter2']").setCheckEvent("#" + gMdlRoleMenus + " input[name='cb']");
                
                this.find("input[name='menu_id']").dataBind({
                    sqlCode : "R38" 
                    ,parameters: {role_id : id}
                    ,text: "menu_name"
                    ,value: "menu_id" 
                });
            }
        });    
    }
    function displayUsers(id){   
        $("#gridUsers").dataBind({
             url            : app.execURL + "users_sel @role_id=" + id 
            ,width          : 320
    	    ,height         : 400
            ,dataRows       :[
        		 //{ text: "User Name"     , width:300  , style:"text-align:left, margin-left;" ,name:"logon" }
        		 { text:"User Name"     , width:300 , style:"text-align:left;"   
        		    ,onRender: function(d){
        		        return app.bs({name: "logon" ,type:"hidden" ,value: d.logon})
        		            + d.logon;
        		    }
        		}	 
            ]
            // ,onComplete : function(){
            //     this.data("id",id);
            //     this.find("input[name='logon']").dataBind({
            //         sqlCode : "U77" 
            //         ,parameters: {role_id : id}
            //         ,text: "logon"
            //         ,value: "logon" 
            //     });
            // }
        
        });    
    }
    function setToNullIfChecked(id){
        $("#gridRoleMenus  input[name='cb']").change(function(){
                var td  = this.parentNode;
                var role_id = $(td).find("#role_id");
                if(this.checked) 
                    role_id.val(id);
                else
                    role_id.val('');
        });
    }
    function getTemplate(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlRoleMenus
            , sizeAttr  : "modal-md"
            , title     : "Role Menus"
            , body      : gtw.new().modalBodyRoleMenus({grid:"gridRoleMenus",onClickSaveRoleMenus:"submitRoleMenus();"}).html()  
        })
        .bsModalBox({
              id        : gMdlUsers
            , sizeAttr  : "modal-md"
            , title     : "User(s)"
            , body      : gtw.new().modalBodyUsers({grid:"gridUsers",onClickSaveUsers:"submitUsers"}).html()  
        }); 
        
    }
    
    //Public Functions
    pub.showModalRoleMenus = function(id,name) {
        g$mdl = $("#" + gMdlRoleMenus);
        g$mdl.find(".modal-title").text("Role Menus » " + name ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayRRolesMenu(id,name);
    }; 
    pub.showModalUsers = function(id,name) {
        g$mdl = $("#" + gMdlUsers);
        g$mdl.find(".modal-title").text("Users » " + name ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
       displayUsers(id,name);
    };  
    pub.submitRoleMenus = function(){
             $("#frm_modalRoleMenus").jsonSubmit({
                 procedure  : "role_menus_upd"
                ,onComplete : function (data) {
                    $("#gridRoleMenus").clearGrid();
                    if(data.isSuccess) zsi.form.showAlert("alert");
                    displayRRolesMenu($("#gridRoleMenus").data("id"));
                    displayRecords();
                }
            });
            
            
    };
    pub.submitUsers = function(){
             $("#frm_modalUsers").jsonSubmit({
                 procedure  : "users_upd"
                ,onComplete : function (data) {
                    $("#gridUser").clearGrid();
                    if(data.isSuccess) zsi.form.showAlert("alert");
                    displayUsers($("#gridUsers").data("id"));
                    displayRecords();
                   
                }
            });
            
            
    };
    
    //Buttons
    $("#btnSave").click(function () {
        $("#grid").jsonSubmit({
                sqlCode: "R41" 
                , onComplete: function (data) {
                    $("#grid").clearGrid();
                    displayRecords();
                }
        });
         
    });
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "adm-0001"
            ,onComplete : function(data){
                            displayRecords();
                          }
        });   
    
    });      

    return pub;      
})();

                                                                                                                             