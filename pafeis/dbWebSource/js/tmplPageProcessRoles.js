function initPageProcessRolesTemplate(page_process_id, page_id){
    g_page_process_id = page_process_id;
    g_page_id = page_id;
    displayPageProcessRolesRecords(page_process_id);
}

$("#pprBtnSave").click(function () {
   $("#pageProcessRolesGrid").jsonSubmit({
            procedure: "page_process_roles_upd"
            , optionalItems: ["page_process_id"]
            , onComplete: function (data) {
                $("#pageProcessRolesGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayPageProcessRolesRecords(g_page_process_id);
                initPageProcessTemplate(g_page_id);
            }
    });
});

    
function displayPageProcessRolesRecords(id){
     var cb = bs({ name: "cbFilter3", type: "checkbox" });
     $("#pageProcessRolesGrid").dataBind({
	     url            : execURL + "page_process_roles_sel @page_process_id=" + id
	    ,width          : 550
	    //,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"page_process_role_id",type:"hidden",value: svn (d,"page_process_role_id")})
                		                             + bs({name:"is_edited",type:"hidden"}) 
                		                             + bs({name:"page_process_id",type:"hidden",value: id})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                ,{text  : "Roles"            , name  : "role_id"              , type  : "select"       , width : 300       , style : "text-align:left;"}
        		
	    ]   
    	     ,onComplete: function(data){
    	        $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });
    	         
                $("select[name='role_id']").dataBind("roles");
        }  
    });    
}
   

$("#pprBtnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0009"
        ,onComplete : function(data){
                        displayPageProcessRolesRecords(g_page_process_id);
                        initPageProcessTemplate(g_page_id);
                      }
    });       
});

