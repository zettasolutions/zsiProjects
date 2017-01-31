var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var tblName     = "tblRRolesMenu";
var modalWindow = 0;
var role_id =null;
var tblNameUser     = "tblUser";
//var modalWindowUser = 0;
zsi.ready(function(){
    displayRecords();
    getTemplate();
    
});
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
        
        var context = { id:"modalWindow"
                        , title: "Roles Menu" 
                        , sizeAttr: "modal-lg"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body: 
                        
                        '<div><div id="' + tblName + '" class="zGrid"></div></div>'
                      };
        var html    = template(context);     
        $("body").append(html);

        var contextUser = { id:"modalWindowUser"
                        , title: "User" 
                        , body: 
                        
                        '<div><div id="' + tblNameUser + '" class="zGrid"></div></div>'
                      };
        var htmlUser    = template(contextUser);     
        $("body").append(htmlUser);



    });    
    
     

}
function manageItem(id,name){
    role_id =id;
    displayRRolesMenu(id);
    $(".modal-title").text("Role Menu for » " + name);
    $('#modalWindow').modal("show");
    if (modalWindow===0) {
        modalWindow=1;
        $("#modalWindow").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    
    
  // clearGrid();
    
}
function clearGrid(){
    $("#" + tblName).clearGrid();
}
function manageItemUser(id,name){
    role_id =id;
    displayUsers(id);
    $(".modal-title").text("Users for » " + name);
    $('#modalWindowUser').modal("show");
    if (modalWindowUser===0) {
        modalWindowUser=1;
        $("#modalWindowUser").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    
    
  // clearGrid();
    
}
function clearGrid(){
    $("#" + tblNameUser).clearGrid();
}
 $("#btnSave").click(function () {
    $("#grid").jsonSubmit({
            procedure: "roles_upd"
            ,optionalItems: ["is_export_excel","is_export_pdf","is_import_excel"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                displayRecords();
            }
    });
     
});
function submitItems(){
         $("#frm_modalWindow").jsonSubmit({
             procedure  : "role_menus_upd"
            ,onComplete : function (data) {
                $("#" + tblName).clearGrid();
                if(data.isSuccess) zsi.form.showAlert("alert");
                displayRRolesMenu(role_id);
               
            }
        });
        
        
}
function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
         url   : procURL + "roles_sel"
        ,width          : $(document).width() - 550
	    ,height         : $(document).height() - 250
        ,blankRowsLimit:5
        ,dataRows       :[
    		 { text: cb             , width:25  , style:"text-align:left;"   
    		     ,onRender : function(d){
                                return     bs({name:"role_id",type:"hidden",value: svn(d,"role_id") })
                                        +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }             
    		 }	 
    		,{ text:"Role Name"     , width:180 , style:"text-align:center;" ,type:"input"  ,name:"role_name"}	 
    		,{ text:"Export Excel?" , width:100 , style:"text-align:center;" ,type:"yesno"  ,name:"is_export_excel"  ,defaultValue:"Y"}	 
    		,{ text:"Export Pdf?"   , width:100 , style:"text-align:center;" ,type:"yesno"  ,name:"is_export_pdf"    ,defaultValue:"Y"}	 	 
    		,{ text:"Import Excel?" , width:100 , style:"text-align:center;" ,type:"yesno"  ,name:"is_import_excel"  ,defaultValue:"Y"}	 	 
    		,{ text:"Role Menu"    , width:80   , style:"text-align:center;"  
    		    ,onRender : function(d){ return "<a href='javascript:manageItem(" + svn(d,"role_id") + ",\"" +  svn(d,"role_name")  + "\");'>" + svn(d,"countRoleMenus") + "</a>"; }
    		}	 
    		,{ text:"Users"         , width:81  , style:"text-align:center;" 
    		    ,onRender : function(d){ return "<a href='javascript:manageItemUser(" + svn(d,"role_id") + ",\"" + svn(d,"role_name")  + "\");'>" + svn(d,"countUsers") + "</a>"; }
    		}	 	 
	    ]
        ,onComplete: function(){
             $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }
    });    
}
function displayRRolesMenu(id){   
    var cb = bs({name:"cbFilter2",type:"checkbox",style:"margin-top: 2px;"});
    $("#" + tblName).dataBind({
         url   : execURL + "role_menus_sel @role_id=" + id 
        ,width          : 560
	    ,height         : 400
	    
        ,dataRows       :[
    		 { text: cb             , width:40  , style:"text-align:left;" 
    		     ,onRender : function(d){ 
                                return  bs({name:"role_menu_id",type:"hidden",value:svn (d,"role_menu_id")})  
                                        + bs({name:"role_id",type:"hidden",value: id }) 
                                        + bs({name:"menu_id",type:"hidden",value:svn (d,"menu_id")})
                                        + bs({name:"cb",type:"checkbox",checked :(d.role_id!==""?true:false)}) ;
                            }            

    		 }	 
    		,{ text:"Menu Name"     , width:200 , style:"text-align:left;"  ,name:"menu_name"  }	 
    		,{ text:"Is New?"       , width:110 , style:"text-align:center;"  ,type:"yesno"  ,name:"is_new"     ,defaultValue:"Y" }	 
    		,{ text:"Write?"        , width:93  , style:"text-align:left;"    ,type:"yesno"  ,name:"is_write"   ,defaultValue:"Y" }	 	 
    		,{ text:"Delete?"       , width:92  , style:"text-align:left;"    ,type:"yesno"  ,name:"is_delete"  ,defaultValue:"Y" }	 	 
 	    ]
       ,onComplete : function(){
            setToNullIfChecked(id);
            $("#cbFilter2").setCheckEvent("#" + tblName + " input[name='cb']");
        }
    });    
}
function setToNullIfChecked(id){
    $("#" + tblName + " input[name='cb']").change(function(){
            var td  = this.parentNode;
            var role_id = $(td).find("#role_id");
            if(this.checked) 
                role_id.val(id);
            else
                role_id.val('');
    });
}

function displayUsers(id){   
    $("#" + tblNameUser).dataBind({
         url   : procURL + "users_sel @role_id=" + id 
        ,width          : 275
	    ,height         : 400
        ,dataRows       :[
    		 { text: "User Name"     , width:250  , style:"text-align:left, margin-left;" ,name:"logon" }
        ]
    });    
}
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "adm-0001"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});      

    
                                                                          