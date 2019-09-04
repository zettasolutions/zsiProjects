var  bs                     = zsi.bs.ctrl
    ,svn                    = zsi.setValIfNull
    // ,gMdlSites              = "modalSites"
    // ,gMdlCustomerContacts   = "modalCustomerContacts"
    // ,gMdlSiteProgram        = "modalSiteProgram"
    ,gtw                    = null
;

zsi.ready = function(){
     gtw = new zsi.easyJsTemplateWriter();
     displayCustomerOrder();
     
     //getTemplates();
};

// function getTemplates(){
//     new zsi.easyJsTemplateWriter("body");
//     // .bsModalBox({
//     //       id        : gMdlSites
//     //     , sizeAttr  : "modal-lg"
//     //     , title     : "Sites"
//     //     , body      : gtw.new().modalBodySites({gridSites:"grid-Sites",onClickSaveSites:"submitDataSites();"}).html()  
//     // })
//     // .bsModalBox({
//     //       id        : gMdlCustomerContacts
//     //     , sizeAttr  : "modal-lg"
//     //     , title     : "Contacts"
//     //     , body      : gtw.new().modalBodyContacts({gridContacts:"grid-Contacts",onClickSaveContacts:"submitCustomerContacts();"}).html()  
//     // })
//     // .bsModalBox({
//     //       id        : gMdlCustomerPrograms
//     //     , sizeAttr  : "modal-lg"
//     //     , title     : "Programs"
//     //     , body      : gtw.new().modalBodyPrograms({gridPrograms:"grid-Programs",onClickSavePrograms:"submitCustomerPrograms();"}).html()  
//     // });
// }

function displayCustomerOrder(){   
    var _sidebar = $("#sidebar-container").width() + 20;
    $("#gridCustomers").dataBind({
         sqlCode    : "C142"
        ,width      : $(window).width() - 300
        ,blankRowsLimit : 5
        ,height     : 300
        ,dataRows   : [
    		 { text: "Customer Code"   ,width:150 ,style:"text-align:left;" 
    		     ,onRender : function(d){return bs({name:"customer_id"          ,type:"hidden"  ,value: svn(d,"customer_id")})
                                            +   bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")})     		                               
    		                                +   bs({name:"customer_code"        ,value: svn(d,"customer_code")}) }
    		 }
    		,{ text:"Customer Name"    ,width:400 ,style:"text-align:left;"     ,type:"input"   , name:"customer_name"}
    		,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,defaultValue:"Y"
                       ,onRender : function(d){ return bs({name:"is_active" ,type:"yesno"   ,value: svn(d,"is_active")    })
                                                      +  bs({name:"is_edited",type:"hidden"});
                    }
                }	 	 
    		,{ text:"Sites"            ,width:40  ,style:"text-align:center;" 
		        ,onRender    : function(d){ 
                    var _return = "<a href='javascript:void(0);' class='btn btn-sm' data-toggle='tooltip' data-placement='left' title='Custmer'"
                                + "onclick='showModalCustomer(\""+ "Sites" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'  ><i class='fas fa-link link'></i> </a>";
                    return (! (d) ? "" : _return);
    		    }
    		}
    		,{
    		    text:"Contacts"         ,width: 65  ,style : "text-align:center;"
    		    ,onRender : function(d){
    		        var _return = "<a href='javascript:void(0);' class='btn btn-sm' data-toggle='tooltip' data-placement='left' title='Customer'"
    		                    + "onclick='showModalCustomer(\""+ "Contacts" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'><i class='fas fa-link link'></i></a>";
    		        return (! (d) ? "" : _return);
    		    }
    		}
    		,{
    		    text:"Programs"         ,width: 70  ,style : "text-align:center;"
    		    ,onRender : function(d){
    		        var _return = "<a href='javascript:void(0);' class='btn btn-sm' data-toggle='tooltip' data-placement='left' title='Customer'"
    		                    + "onclick='showModalCustomer(\""+ "Programs" +"\",\""+ svn(d,"customer_id") +"\",\"" +  svn(d,"customer_name")  + "\");'><i class='fas fa-link link'></i></a>";
    		        return (! (d) ? "" : _return);
    		    }
    		}
	    ]
	    ,onComplete : function(o){
	        this.find('[data-toggle="tooltip"]').tooltip(); 
	    }
    });    
}
$("#btnSaveCustomers").click(function () {
    $("#gridCustomers").jsonSubmit({
             procedure: "customers_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                console.log("data",data);
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayCustomerOrder();
            }
    });
});
 
function showModalCustomer(tabName, id,name) {
    console.log("tabName",tabName);
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
}


function submitCustomerSites(){
    var _$grid = $("#grid-Sites");
        _$grid.jsonSubmit({
         procedure: "customer_sites_upd"
        ,onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displaySites(_$grid.data("id"));
        }
    });
}    
function submitCustomerContacts(){
    var _$grid = $("#grid-Contacts");
        _$grid.jsonSubmit({
         procedure: "customer_contacts_upd"
        ,onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayCustomerContacts(_$grid.data("id"));
        }
    });
}    
function submitCustomerPrograms(){
    var _$grid = $("#grid-Programs");
        _$grid.jsonSubmit({
         procedure: "customer_programs_upd"
        ,onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayCustomerPrograms(_$grid.data("id"));
        }
    });
}    

function displaySites(id){
    $("#grid-Sites").dataBind({
         sqlCode    : "C146"
        ,parameter  : {"site_id" : id}
        ,width          : $("#frm_modalCustomer").width() - 265
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows   : [
    		 { text: "Site Code"        ,width:100                              ,style:"text-align:center;" 
    		     ,onRender : function(d){return bs({name:"site_id"              ,type:"hidden"   ,value: svn(d,"site_id")})
                                            +   bs({name:"is_edited"            ,type:"hidden"   ,value: svn(d,"is_edited")})     		                               
    		                                +   bs({name:"site_code"            ,value: svn(d,"site_code")}) }
    		 }
    		,{ text:"Site Address"      ,width:350 ,style:"text-align:center;"  ,type:"input"    , name:"site_address"}
    		,{ text:"Customer Code"      ,width:350 ,style:"text-align:center;"  ,type:"input"    , name:"customer_code"}
    		,{ text:"Is Active?"        ,width:75 ,style:"text-align:center;"  ,type:"yesno"    , name:"is_actvie"  ,defaultValue:"Y"}	 	 
	    ]
	    ,onComplete : function(o){
	        this.data("id", id);
	    }
    });    
    
}
function displayCustomerContacts(id){
    $("#grid-Contacts").dataBind({
         sqlCode    : "C154"
        ,parameter  : {"customer_contact_sp_id" : id}
        ,width          : $("#frm_modalCustomer").width() - 265
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows   : [
                        {  text: "Customer"      ,width : 400        ,style:"text-align:center"
                            ,onRender   : function(d){return    bs({name:"customer_contact_sp_id"   ,type:"hidden"      ,value: svn(d,"site_id")})
                                                            +   bs({name:"customer_id"              ,type:"select"      ,value: svn(d,"customer_id")})
                                                            +   bs({name:"is_edited"                ,type:"hidden"      ,value: svn(d,"is_edited")})}     
                                 
                        }
                        ,{ text:"Contact Name"          ,width:250          ,style:"text-align:center;"      ,type:"input"    , name:"contact_name"}
                        ,{ text:"Contact Number"        ,width:250          ,style:"text-align:center;"      ,type:"input"    , name:"contact_no"}
                        ,{ text:"Contact Email"         ,width:250          ,style:"text-align:center;"      ,type:"input"    , name:"contact_email_add"}
                        ,{ text:"Is Active?"            ,width:75           ,style:"text-align:center;"       ,type:"yesno"    , name:"is_actvie"  ,defaultValue:"Y"}	 	 
                      ]
           ,onComplete : function(o){
	        this.data("id", id);
	    }
    });
}
function displayCustomerPrograms(id){
    $("#grid-Programs").dataBind({
         sqlCode    : "C156"
        ,parameter  : {"customer_program_id" : id}
        ,width          : $("#frm_modalCustomer").width() - 265
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows   :   [
                            {  text: "Customer"      ,width : 400        ,style:"text-align:center"
                            ,onRender   : function(d){return    bs({name:"customer_contact_sp_id"   ,type:"hidden"      ,value: svn(d,"site_id")})
                                                            +   bs({name:"customer_id"              ,type:"select"      ,value: svn(d,"customer_id")})
                                                            +   bs({name:"is_edited"                ,type:"hidden"      ,value: svn(d,"is_edited")})}     
                                 
                        }
                        ,{ text:"Program"               ,width:250          ,style:"text-align:center;"      ,type:"select"    , name:"program_id"}
                        ,{ text:"Is Active?"            ,width:75           ,style:"text-align:center;"       ,type:"yesno"    , name:"is_actvie"  ,defaultValue:"Y"}	
                        ]
           ,onComplete : function(o){
	        this.data("id", id);
	    }
    });
}
                                                                                                                          